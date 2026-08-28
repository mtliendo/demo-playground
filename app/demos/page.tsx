import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog-page";
import { getCatalogItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Demos",
  description: "Runnable Auth0 demo apps you can clone, deploy, and take to a booth.",
};

export default function DemosPage() {
  const items = getCatalogItems().filter((item) => item.kind === "demo");
  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[12px] tracking-[0.2em] text-accent uppercase">Demos</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">Runnable experiences</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        One card per thing a room can do. Related repos stay on the detail page.
      </p>
      <div className="mt-10">
        <CatalogPage items={items} lockedType="demo" />
      </div>
    </main>
  );
}
