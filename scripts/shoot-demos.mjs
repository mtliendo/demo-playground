#!/usr/bin/env node
// Capture the screenshot set for each demo listed in scripts/demo-targets.json.
// First shot in a demo's list becomes its catalog thumbnail.
// Usage: node scripts/shoot-demos.mjs [targetsFile]

import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { launch, sleep } from "./lib/cdp.mjs";

const TARGETS = process.argv[2] ?? "scripts/demo-targets.json";
const OUT = "public/shots";
const WIDTH = 1280;
// Cards render these at 16:10 with object-cover, so capture at exactly 16:10.
// Anything else gets silently cropped on the sides. Narrow the width to make a
// sparse page's content fill more of the frame.
const ASPECT = 16 / 10;
// Largest render is the detail-page carousel at 768px CSS, so 1920 covers 2x
// retina there and everywhere smaller. Next/Image derives the rest.
const SCALE = 1.5;
// Next.js injects a dev-mode badge into every locally booted app.
const ALWAYS_HIDE = ["nextjs-portal", "[data-nextjs-toast]"];

// Auth-gated routes still render *something* against a placeholder tenant, so a
// screenshot succeeding proves nothing. Reject the page before it reaches disk.
const REJECT = /error occurred|login request|unauthorized|forbidden|access denied|something went wrong|application error|this page could not be found/i;

async function pageIsUsable(browser) {
  const { result } = await browser.cdp.send(
    "Runtime.evaluate",
    {
      expression: `JSON.stringify({
        text: document.body.innerText.trim(),
        nodes: document.body.querySelectorAll("*").length,
      })`,
      returnByValue: true,
    },
    browser.sessionId,
  );
  const { text, nodes } = JSON.parse(result.value);
  if (REJECT.test(text)) return `rejected: "${text.split("\n")[0].slice(0, 50)}"`;
  // A deliberately minimal app can be a handful of elements and still be real,
  // so gate on copy, not element count.
  if (text.length < 40) return `rejected: ${text.length} chars of copy, ${nodes} elements`;
  return null;
}

const targets = JSON.parse(await readFile(TARGETS, "utf8"));
const browser = await launch(9223);
const results = [];

try {
  for (const demo of targets) {
    const { slug, base, width = WIDTH, shots } = demo;
    await rm(`${OUT}/${slug}`, { recursive: true, force: true });
    await mkdir(`${OUT}/${slug}`, { recursive: true });
    await browser.viewport(width, Math.round(width / ASPECT), SCALE);

    // A scroll past the page bottom silently re-shoots the previous view.
    const seen = new Set();
    let index = 0;
    for (const { label, path = "/", scroll = 0, settle = 2500 } of shots) {
      const name = `${String(++index).padStart(2, "0")}-${label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`;
      try {
        await browser.goto(base + path, { settle });
        await browser.cdp.send(
          "Runtime.evaluate",
          {
            expression: `document.querySelectorAll(${JSON.stringify(ALWAYS_HIDE.join(","))})
              .forEach((el) => el.remove());
              window.scrollTo(0, ${scroll});`,
          },
          browser.sessionId,
        );
        await sleep(scroll ? 700 : 200);

        const problem = await pageIsUsable(browser);
        if (problem) {
          results.push([`${slug}/${name}`, "SKIP", problem]);
          index--;
          continue;
        }

        const img = await browser.shot({ format: "webp", quality: 88 });
        const hash = createHash("sha1").update(img).digest("hex");
        if (seen.has(hash)) {
          results.push([`${slug}/${name}`, "SKIP", "rejected: identical to an earlier shot"]);
          index--;
          continue;
        }
        seen.add(hash);
        await writeFile(`${OUT}/${slug}/${name}.webp`, img);
        results.push([`${slug}/${name}`, "ok", `${Math.round(img.length / 1024)} KB`]);
      } catch (err) {
        results.push([`${slug}/${name}`, "FAILED", err.message.slice(0, 70)]);
      }
    }
  }
} finally {
  browser.close();
}

for (const [name, status, detail] of results) {
  console.log(`${status.padEnd(7)} ${name.padEnd(38)} ${detail}`);
}
if (results.some(([, s]) => s === "FAILED")) process.exitCode = 1;
