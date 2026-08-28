"use client";

import { useState } from "react";
import type { SkillInstall } from "@/lib/types";

const TABS = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude Code" },
  { id: "chatgpt", label: "ChatGPT / Codex" },
  { id: "any", label: "Any agent" },
] as const;

export function InstallTabs({ install }: { install: SkillInstall }) {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("cursor");
  const body = install[active];

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg-card">
      <div className="flex flex-wrap gap-1 border-b border-line p-2" role="tablist" aria-label="Install target">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={[
              "min-h-9 rounded-md px-3 font-mono text-[11px] tracking-wide uppercase",
              active === tab.id ? "bg-accent-soft text-ink" : "text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-ink">
        <code>{body}</code>
      </pre>
    </div>
  );
}
