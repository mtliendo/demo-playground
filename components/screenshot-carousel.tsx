"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Screenshot } from "@/lib/types";

export function ScreenshotCarousel({ shots, title }: { shots: Screenshot[]; title: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (shots.length === 0) return null;

  function show(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
  }

  // The track is the source of truth: dots follow scrolling, including swipes.
  function onScroll() {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  const single = shots.length === 1;

  return (
    <figure>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[12px] border border-line bg-bg-sunken [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        {...(single ? {} : { tabIndex: 0, role: "region", "aria-label": `${title} screenshots` })}
      >
        {shots.map((shot, index) => (
          <div key={shot.src} className="relative aspect-[16/10] w-full shrink-0 snap-start">
            <Image
              src={shot.src}
              alt={`${title} — ${shot.label}`}
              fill
              priority={index === 0}
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>

      {single ? (
        <figcaption className="mt-3 text-[13px] text-ink-faint">{shots[0].label}</figcaption>
      ) : (
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
          {shots.map((shot, index) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => show(index)}
              aria-current={index === active ? "true" : undefined}
              className={[
                "min-h-9 rounded-full border px-3 text-[13px]",
                "transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.98]",
                index === active
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
              ].join(" ")}
            >
              {shot.label}
            </button>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
