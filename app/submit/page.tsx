import type { Metadata } from "next";
import { issueTemplateUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit",
  description: "Propose a demo or skill for Auth0 Showcase via a GitHub issue.",
};

export default function SubmitPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[12px] tracking-[0.2em] text-accent uppercase">Contribute</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Submit an entry</h1>
      <p className="mt-4 leading-7 text-ink-muted">
        No in-app form in v1. Open a GitHub issue with the template that matches the type.
        A maintainer turns a complete issue into a content file.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a
          href={issueTemplateUrl("submit-demo.yml")}
          className="rounded-xl border border-line bg-bg-card p-5 hover:border-accent"
        >
          <p className="font-mono text-[11px] tracking-wide text-accent uppercase">Demo</p>
          <p className="font-display mt-2 text-2xl">Runnable experience</p>
          <p className="mt-2 text-sm text-ink-muted">
            Repo, live URL, Auth0 requirements, and docs/architecture.png.
          </p>
        </a>
        <a
          href={issueTemplateUrl("submit-skill.yml")}
          className="rounded-xl border border-line bg-bg-card p-5 hover:border-accent"
        >
          <p className="font-mono text-[11px] tracking-wide text-skill uppercase">Skill</p>
          <p className="font-display mt-2 text-2xl">Agent skill</p>
          <p className="mt-2 text-sm text-ink-muted">
            Install targets and the stories it covers. Same package can host several stories.
          </p>
        </a>
      </div>
    </main>
  );
}
