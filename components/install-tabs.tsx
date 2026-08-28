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
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("claude");

  return (
    <div className="overflow-hidden rounded-[12px] border border-line bg-bg-card">
      <div className="flex flex-wrap gap-1 border-b border-line p-2" role="tablist" aria-label="Install target">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={[
              "min-h-9 rounded-[6px] px-3 text-[14px] transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98]",
              active === tab.id
                ? "bg-accent-soft text-ink"
                : "text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto bg-bg-sunken p-4 font-mono text-[13px] leading-6 text-ink">
        <code>{install[active]}</code>
      </pre>
    </div>
  );
}
