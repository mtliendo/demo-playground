import Image from "next/image";
import { architectureAvailable, architectureRawUrl } from "@/lib/github";

export async function ArchitectureFigure({
  repo,
  architecturePath,
}: {
  repo: string;
  architecturePath: string;
}) {
  const src = architectureRawUrl(repo, architecturePath);
  const exists = src ? await architectureAvailable(src) : false;

  if (!src || !exists) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong bg-bg-elevated px-5 py-8">
        <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">
          Architecture
        </p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
          Add <code className="font-mono text-ink">{architecturePath}</code> to the source repo.
          The Showcase renderer looks on <code className="font-mono text-ink">main</code> and
          shows it here. Use the <code className="font-mono text-ink">showcase-architecture</code>{" "}
          skill in this package to draft the image.
        </p>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-bg-elevated">
      <Image
        src={src}
        alt="Architecture diagram from the source repository"
        width={1280}
        height={720}
        className="h-auto w-full bg-black object-contain"
        unoptimized
      />
      <figcaption className="border-t border-line px-4 py-2 font-mono text-[11px] tracking-wide text-ink-faint uppercase">
        {architecturePath} · from the repo
      </figcaption>
    </figure>
  );
}
