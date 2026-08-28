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
    <main id="main" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[12px] tracking-[0.2em] text-skill uppercase">Skills</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">Agent skills</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Four stories. Two install targets. Checkmate and Healthcheck live on the Auth0 skill.
      </p>
      <div className="mt-10">
        <CatalogPage items={items} lockedType="skill" />
      </div>
    </main>
  );
}
