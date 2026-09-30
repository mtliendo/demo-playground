"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { CatalogItem } from "@/lib/types";
import { TOPIC_LABELS, TOPICS, isTopic, type Topic } from "@/lib/topics";

const chipBase =
  "min-h-9 rounded-full border px-3 text-[13px] transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98]";

// Purple means "you narrowed something". The default resting state stays neutral.
function chip(state: "on" | "resting" | "off") {
  const skin = {
    on: "border-accent bg-accent-soft text-ink",
    resting: "border-line-strong bg-bg-elevated text-ink",
    off: "border-line text-ink-muted hover:border-line-strong hover:text-ink",
  }[state];
  return `${chipBase} ${skin}`;
}

export function Catalog({ items }: { items: CatalogItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const topicParam = searchParams.get("topic");
  const topic = topicParam && isTopic(topicParam) ? topicParam : null;

  function select(next: Topic | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("topic", next);
    else params.delete("topic");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  const filtered = topic
    ? items.filter((item) => item.topics.includes(topic))
    : items;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => select(null)}
          aria-pressed={topic === null}
          className={chip(topic === null ? "resting" : "off")}
        >
          Any topic
        </button>
        {TOPICS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => select(topic === item ? null : item)}
            aria-pressed={topic === item}
            className={chip(topic === item ? "on" : "off")}
          >
            {TOPIC_LABELS[item]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-ink-muted">Nothing under that topic yet.</p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {filtered.map((item, index) => (
            <li
              key={`${item.kind}-${item.slug}`}
              className="rise"
              style={{ animationDelay: `${Math.min(index, 7) * 40}ms` }}
            >
              <CatalogCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function kindLabel(kind: CatalogItem["kind"]) {
  return kind === "demo" ? "Demo" : kind === "skill" ? "Skill" : "Presentation";
}

// Presentations have no screenshot pipeline (the deck lives in Google Slides, not this repo),
// so a card without a thumbnail gets a static placeholder instead of skipping the image block —
// keeps card heights consistent with Demo cards in the same grid.
function PresentationPlaceholder() {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-line bg-bg-sunken"
    >
      <svg viewBox="0 0 24 24" className="size-12 text-ink-faint" fill="none">
        {/* Two overlapping 16:9 slides, offset like a deck — reads as "presentation" at a glance. */}
        <rect x="2.5" y="7" width="15" height="9.5" rx="1.2" fill="var(--bg-sunken)" stroke="currentColor" strokeWidth="1.4" />
        <rect x="6.5" y="3" width="15" height="9.5" rx="1.2" fill="var(--bg-sunken)" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9.5 6.2h9M9.5 8.7h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CatalogCard({ item }: { item: CatalogItem }) {
  const gated = item.kind === "presentation";
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-line bg-bg-card transition-colors duration-200 hover:border-line-strong"
    >
      {item.thumbnail ? (
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg-sunken">
          <Image
            src={item.thumbnail}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : item.kind === "presentation" ? (
        <PresentationPlaceholder />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <p className="text-[13px] text-accent-ink">{kindLabel(item.kind)}</p>
          {gated ? (
            <span className="inline-flex items-center gap-1 text-[13px] text-ink-faint">
              <span aria-hidden>🔒</span>
              Slides: Okta only
            </span>
          ) : null}
        </div>
        <h2 className="mt-2 text-xl font-medium tracking-[-0.015em] text-ink">
          {item.title}
        </h2>
        <p className="mt-2 flex-1 text-[15px] leading-6 text-ink-muted">
          {item.oneLiner}
        </p>
        <p className="mt-5 flex items-center gap-2 text-[13px] text-ink-faint">
          {item.liveUrl ? (
            <>
              <span aria-hidden className="size-1.5 rounded-full bg-mint" />
              <span>Live</span>
              <span aria-hidden>·</span>
            </>
          ) : null}
          <span>
            {item.timeToStandUp ??
              (item.kind === "demo" ? "Runnable app" : item.kind === "skill" ? "Agent skill" : "Talk")}
          </span>
        </p>
      </div>
    </Link>
  );
}
