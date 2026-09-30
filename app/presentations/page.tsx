import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog-page";
import { getCatalogItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Presentations",
  description: "Talk tracks for the room — slides, script, and how long it takes.",
};

export default function PresentationsPage() {
  const items = getCatalogItems().filter((item) => item.kind === "presentation");
  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">Presentations</p>
      <h1 className="h1 mt-4">Talk tracks for the room</h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-ink-muted">
        Slides, script, and how long it takes.
      </p>
      <p className="mt-3 max-w-xl text-[15px] text-ink-faint">
        Slides for this section live in Google Slides, shared to the org — viewing them requires
        signing in with an Okta-linked Google account.
      </p>
      <div className="mt-14">
        <CatalogPage items={items} />
      </div>
    </main>
  );
}
