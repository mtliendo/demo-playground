import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureFigure } from "@/components/architecture-figure";
import { Markdown } from "@/components/markdown";
import { TopicChip } from "@/components/topic-chip";
import { TrackedLink } from "@/components/tracked-link";
import { getDemo, getDemos } from "@/lib/content";
import { githubUserUrl } from "@/lib/github";

export function generateStaticParams() {
  return getDemos().map((demo) => ({ slug: demo.slug }));
}

type DemoParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: DemoParams) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) return {};
  return { title: demo.title, description: demo.oneLiner };
}

const ctaClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-4 font-mono text-[12px] tracking-wide uppercase transition-colors";

export default async function DemoPage({ params }: DemoParams) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();

  const related = demo.seeAlso
    .map((relatedSlug) => getDemo(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[12px] tracking-[0.2em] text-accent uppercase">Demo</p>
      <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
        {demo.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-ink-muted">{demo.oneLiner}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {demo.topics.map((topic) => (
          <TopicChip key={topic} topic={topic} href={`/?topic=${topic}`} />
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        By{" "}
        <a className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent" href={githubUserUrl(demo.author.github)}>
          {demo.author.name}
        </a>
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {demo.liveUrl ? (
          <TrackedLink
            href={demo.liveUrl}
            event="cta_live"
            className={`${ctaClass} bg-accent text-bg hover:bg-accent-hover`}
          >
            Live demo
          </TrackedLink>
        ) : null}
        <TrackedLink
          href={demo.repo}
          event="cta_repo"
          className={`${ctaClass} border border-line text-ink hover:border-accent hover:text-accent-hover`}
        >
          Repository
        </TrackedLink>
        {demo.blogUrl ? (
          <TrackedLink
            href={demo.blogUrl}
            event="cta_blog"
            className={`${ctaClass} border border-line text-ink-muted hover:text-ink`}
          >
            Blog
          </TrackedLink>
        ) : null}
        {demo.videoUrl ? (
          <TrackedLink
            href={demo.videoUrl}
            event="cta_video"
            className={`${ctaClass} border border-line text-ink-muted hover:text-ink`}
          >
            Video
          </TrackedLink>
        ) : null}
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl tracking-tight">The experience</h2>
        <div className="mt-4">
          <Markdown>{demo.experience}</Markdown>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-line bg-bg-card p-5 sm:p-6">
        <h2 className="font-display text-2xl tracking-tight">Run this</h2>
        <dl className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
              Time to stand up
            </dt>
            <dd className="mt-2 text-ink">{demo.timeToStandUp}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
              Stack
            </dt>
            <dd className="mt-2 text-ink-muted">{demo.stack.join(" · ")}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
              Auth0 requirements
            </dt>
            <dd>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-muted">
                {demo.auth0Requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
          {demo.otherRequirements.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
                Everything else
              </dt>
              <dd>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-muted">
                  {demo.otherRequirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Architecture</h2>
        <div className="mt-4">
          <ArchitectureFigure repo={demo.repo} architecturePath={demo.architecture} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Setup</h2>
        <div className="mt-4">
          <Markdown>{demo.setup}</Markdown>
        </div>
        <p className="mt-4 text-sm text-ink-faint">
          Canonical instructions stay in the{" "}
          <TrackedLink href={demo.repo} event="cta_readme" className="text-ink-muted underline underline-offset-4 hover:text-ink">
            repository README
          </TrackedLink>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">When to use this</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
          {demo.talkTrack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {demo.seenAt.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl tracking-tight">Seen at</h2>
          <p className="mt-3 text-ink-muted">{demo.seenAt.join(" · ")}</p>
        </section>
      ) : null}

      {related.length > 0 || demo.relatedRepos.length > 0 ? (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-display text-2xl tracking-tight">See also</h2>
          <ul className="mt-4 space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/demos/${item.slug}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
                  {item.title}
                </Link>
                <span className="text-ink-faint"> — {item.oneLiner}</span>
              </li>
            ))}
            {demo.relatedRepos.map((item) => (
              <li key={item.url}>
                <TrackedLink
                  href={item.url}
                  event="cta_related_repo"
                  className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
                >
                  {item.label}
                </TrackedLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
