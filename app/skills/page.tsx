import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog-page";
import { getCatalogItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Skills",
  description: "Auth0 and JWT agent skills — install targets and the stories they cover.",
};

export default function SkillsPage() {
  const items = getCatalogItems().filter((item) => item.kind === "skill");
  return (
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">Skills</p>
      <h1 className="h1 mt-4">Agent skills</h1>
      <p className="mt-5 max-w-xl text-lg leading-8 text-ink-muted">
        Drop one into your agent and let it do the Auth0 wiring.
      </p>
      <div className="mt-14">
        <CatalogPage items={items} />
      </div>
    </main>
  );
}
