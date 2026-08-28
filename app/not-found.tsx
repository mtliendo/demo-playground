import Link from "next/link";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-4">Not in the catalog</h1>
      <p className="mt-5 text-lg leading-8 text-ink-muted">
        It may not have shipped yet, or the slug changed.
      </p>
      <Link href="/" className={`${btnPrimary} mt-10`}>
        Back to catalog
      </Link>
    </main>
  );
}
