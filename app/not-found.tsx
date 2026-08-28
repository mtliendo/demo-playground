import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-[12px] tracking-[0.2em] text-accent uppercase">404</p>
      <h1 className="font-display mt-3 text-4xl">That entry is not in the catalog</h1>
      <p className="mt-4 text-ink-muted">It may not have shipped in v1, or the slug changed.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-accent px-4 font-mono text-[12px] tracking-wide text-bg uppercase hover:bg-accent-hover"
      >
        Back to catalog
      </Link>
    </main>
  );
}
