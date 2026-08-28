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
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">Demos</p>
      <h1 className="h1 mt-4">Runnable experiences</h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-ink-muted">
        One card per thing a room can do.
      </p>
      <div className="mt-14">
        <CatalogPage items={items} />
      </div>
    </main>
  );
}
