"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useTransition } from "react";
import type { CatalogItem } from "@/lib/types";
import { TOPIC_LABELS, TOPICS, isTopic, type Topic } from "@/lib/topics";

type TypeFilter = "all" | "demo" | "skill";

function parseType(value: string | null, fallback: TypeFilter): TypeFilter {
  if (value === "demo" || value === "skill" || value === "all") return value;
  return fallback;
}

export function Catalog({
  items,
  lockedType,
}: {
  items: CatalogItem[];
  lockedType?: "demo" | "skill";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const type = lockedType ?? parseType(searchParams.get("type"), "all");
  const topicParam = searchParams.get("topic");
  const topic = topicParam && isTopic(topicParam) ? topicParam : null;
  const query = searchParams.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);

  function update(next: { type?: TypeFilter; topic?: Topic | null; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextType = next.type ?? type;
    const nextTopic = next.topic === undefined ? topic : next.topic;
    const nextQ = next.q === undefined ? query : next.q;

    if (lockedType || nextType === "all") params.delete("type");
    else params.set("type", nextType);

    if (nextTopic) params.set("topic", nextTopic);
    else params.delete("topic");

    if (nextQ.trim()) params.set("q", nextQ);
    else params.delete("q");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  const filtered = items.filter((item) => {
    if (type !== "all" && item.kind !== type) return false;
    if (topic && !item.topics.includes(topic)) return false;
    if (deferredQuery.trim()) {
      const hay = `${item.title} ${item.oneLiner} ${item.topics.join(" ")}`.toLowerCase();
      if (!hay.includes(deferredQuery.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search the catalog</span>
            <input
              type="search"
              value={query}
              onChange={(event) => update({ q: event.target.value })}
              placeholder="Search demos and skills"
              className="h-11 w-full rounded-lg border border-line bg-bg-elevated px-3.5 font-sans text-[15px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
            />
          </label>
          {lockedType ? null : (
            <div className="flex rounded-lg border border-line p-1" role="group" aria-label="Type">
              {(
                [
                  ["all", "All"],
                  ["demo", "Demos"],
                  ["skill", "Skills"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ type: value })}
                  aria-pressed={type === value}
                  className={[
                    "min-h-9 rounded-md px-3 font-mono text-[11px] tracking-wide uppercase",
                    type === value ? "bg-accent-soft text-ink" : "text-ink-muted hover:text-ink",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
            Topics
          </span>
          <button
            type="button"
            onClick={() => update({ topic: null })}
            aria-label="All topics"
            className={[
              "rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase",
              topic === null
                ? "border-accent bg-accent-soft text-ink"
                : "border-line text-ink-muted hover:text-ink",
            ].join(" ")}
          >
            All
          </button>
          {TOPICS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => update({ topic: topic === item ? null : item })}
              aria-pressed={topic === item}
              className={[
                "rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase",
                topic === item
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
              ].join(" ")}
            >
              {TOPIC_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 font-mono text-[12px] tracking-wide text-ink-faint uppercase">
        {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 max-w-md text-ink-muted">
          Nothing matches. Clear the topic or try a shorter search.
        </p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {filtered.map((item) => (
            <li key={`${item.kind}-${item.slug}`}>
              <CatalogCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CatalogCard({ item }: { item: CatalogItem }) {
  const isDemo = item.kind === "demo";
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col rounded-xl border border-line bg-bg-card/80 p-5 transition-colors hover:border-line-strong hover:bg-bg-elevated"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            "font-mono text-[11px] tracking-[0.16em] uppercase",
            isDemo ? "text-accent" : "text-skill",
          ].join(" ")}
        >
          {isDemo ? "Demo" : "Skill"}
        </span>
        {item.liveUrl ? (
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] tracking-wide text-ink-muted uppercase">
            Live
          </span>
        ) : null}
      </div>
      <h2 className="font-display mt-3 text-2xl tracking-tight text-ink group-hover:text-accent-hover">
        {item.title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{item.oneLiner}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {item.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="font-mono text-[10px] tracking-wide text-ink-faint uppercase"
          >
            {TOPIC_LABELS[topic]}
          </span>
        ))}
        {item.timeToStandUp ? (
          <span className="ml-auto font-mono text-[11px] text-ink-muted">{item.timeToStandUp}</span>
        ) : null}
      </div>
    </Link>
  );
}
