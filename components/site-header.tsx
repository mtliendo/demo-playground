import Link from "next/link";
import { SITE } from "@/lib/site";

const nav = [
  { href: "/", label: "Catalog" },
  { href: "/demos", label: "Demos" },
  { href: "/skills", label: "Skills" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-bg"
      >
        Skip to catalog
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.22em] text-accent uppercase">
            Auth0
          </span>
          <span className="font-display text-xl tracking-tight text-ink group-hover:text-accent-hover">
            Showcase
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-2 font-mono text-[12px] tracking-wide text-ink-muted uppercase transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/submit"
            className="ml-1 rounded-full border border-line px-3 py-1.5 font-mono text-[12px] tracking-wide text-ink uppercase transition-colors hover:border-accent hover:text-accent-hover"
          >
            Submit
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg text-ink">{SITE.name}</p>
          <p className="mt-1 max-w-md text-sm text-ink-muted">
            Maintained by Auth0 Developer Advocacy. Full apps and agent skills — not a
            replacement for{" "}
            <a className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent" href={SITE.codeSamplesUrl}>
              official code samples
            </a>
            .
          </p>
        </div>
        <p className="font-mono text-[11px] tracking-wide text-ink-faint uppercase">
          Not an official Auth0.com property
        </p>
      </div>
    </footer>
  );
}
