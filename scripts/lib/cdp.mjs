// Minimal Chrome DevTools Protocol driver. No dependencies: Node 22+ ships a global WebSocket.
import { spawn } from "node:child_process";

const CHROME =
  process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  #ws;
  #id = 0;
  #pending = new Map();
  #handlers = new Map();

  static async connect(url) {
    const cdp = new CDP();
    cdp.#ws = new WebSocket(url);
    cdp.#ws.onmessage = (e) => cdp.#dispatch(JSON.parse(e.data));
    await new Promise((res, rej) => {
      cdp.#ws.onopen = res;
      cdp.#ws.onerror = rej;
    });
    return cdp;
  }

  #dispatch(msg) {
    if (msg.id !== undefined) {
      const p = this.#pending.get(msg.id);
      this.#pending.delete(msg.id);
      if (!p) return;
      if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
      else p.resolve(msg.result);
      return;
    }
    const key = `${msg.sessionId ?? ""}:${msg.method}`;
    const h = this.#handlers.get(key);
    if (h) {
      this.#handlers.delete(key);
      h(msg.params);
    }
  }

  send(method, params = {}, sessionId) {
    const id = ++this.#id;
    this.#ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject }));
  }

  once(method, sessionId) {
    return new Promise((resolve) =>
      this.#handlers.set(`${sessionId ?? ""}:${method}`, resolve),
    );
  }

  close() {
    this.#ws.close();
  }
}

async function debuggerUrl(port) {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome did not expose a debugging port");
}

export async function launch(port = 9222) {
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      "--remote-allow-origins=*",
      "--hide-scrollbars",
      "--force-color-profile=srgb",
      "--disable-gpu",
      "--no-first-run",
      `--user-data-dir=/tmp/shoot-profile-${port}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  const cdp = await CDP.connect(await debuggerUrl(port));
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  await cdp.send("Page.enable", {}, sessionId);

  return {
    cdp,
    sessionId,
    async viewport(width, height, scale = 2) {
      await cdp.send(
        "Emulation.setDeviceMetricsOverride",
        { width, height, deviceScaleFactor: scale, mobile: width < 700 },
        sessionId,
      );
    },
    async goto(url, { settle = 500 } = {}) {
      const loaded = cdp.once("Page.loadEventFired", sessionId);
      await cdp.send("Page.navigate", { url }, sessionId);
      await Promise.race([loaded, sleep(20000)]);
      await cdp
        .send(
          "Runtime.evaluate",
          { expression: "document.fonts.ready.then(() => 1)", awaitPromise: true },
          sessionId,
        )
        .catch(() => {});
      await sleep(settle);
    },
    async shot({ fullPage = false, width, maxHeight = 6000, format = "png", quality } = {}) {
      let clip;
      if (fullPage) {
        const { cssContentSize } = await cdp.send("Page.getLayoutMetrics", {}, sessionId);
        clip = {
          x: 0,
          y: 0,
          width,
          height: Math.min(Math.ceil(cssContentSize.height), maxHeight),
          scale: 1,
        };
      }
      const { data } = await cdp.send(
        "Page.captureScreenshot",
        {
          format,
          ...(quality === undefined ? {} : { quality }),
          captureBeyondViewport: fullPage,
          ...(clip ? { clip } : {}),
        },
        sessionId,
      );
      return Buffer.from(data, "base64");
    },
    close() {
      cdp.close();
      chrome.kill();
    },
  };
}
