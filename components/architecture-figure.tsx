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
      <p className="rounded-[12px] border border-dashed border-line bg-bg-card px-5 py-6 text-[15px] leading-6 text-ink-muted">
        No architecture diagram yet. Add{" "}
        <code className="font-mono text-[13px] text-ink-muted">{architecturePath}</code> on{" "}
        <code className="font-mono text-[13px] text-ink-muted">main</code> in the source repo
        and it renders here.
      </p>
    );
  }

  return (
    <figure className="overflow-hidden rounded-[12px] border border-line bg-bg-sunken">
      <Image
        src={src}
        alt="Architecture diagram from the source repository"
        width={1280}
        height={720}
        className="h-auto w-full object-contain"
        unoptimized
      />
    </figure>
  );
}
