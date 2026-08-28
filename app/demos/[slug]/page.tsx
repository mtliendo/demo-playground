import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureFigure } from "@/components/architecture-figure";
import { Markdown } from "@/components/markdown";
import { ScreenshotCarousel } from "@/components/screenshot-carousel";
import { TopicChip } from "@/components/topic-chip";
import { TrackedLink } from "@/components/tracked-link";
import { getDemo, getDemos } from "@/lib/content";
import { githubUserUrl } from "@/lib/github";
import { btnBrand, btnPrimary, btnSecondary, inlineLink } from "@/lib/ui";

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

function Facts({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <dt className="text-[13px] text-ink-faint">{label}</dt>
      <dd className="mt-2">
        <ul className="space-y-1.5 text-[15px] leading-6 text-ink-muted">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-line-strong" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

export default async function DemoPage({ params }: DemoParams) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();

  const related = demo.seeAlso
    .map((relatedSlug) => getDemo(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">Demo</p>
      <h1 className="h1 mt-4">{demo.title}</h1>
      <p className="mt-5 text-lg leading-8 text-ink-muted">{demo.oneLiner}</p>

      <p className="mt-6 text-[15px] text-ink-faint">
        By{" "}
        <a className={inlineLink} href={githubUserUrl(demo.author.github)}>
          {demo.author.name}
        </a>
        {demo.seenAt.length > 0 ? ` · Seen at ${demo.seenAt.join(", ")}` : null}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {demo.liveUrl ? (
          <TrackedLink href={demo.liveUrl} event="cta_live" className={btnPrimary}>
            Live demo
          </TrackedLink>
        ) : null}
        <TrackedLink href={demo.repo} event="cta_repo" className={btnBrand}>
          Repository
        </TrackedLink>
        {demo.blogUrl ? (
          <TrackedLink href={demo.blogUrl} event="cta_blog" className={btnSecondary}>
            Blog
          </TrackedLink>
        ) : null}
        {demo.videoUrl ? (
          <TrackedLink href={demo.videoUrl} event="cta_video" className={btnSecondary}>
            Video
          </TrackedLink>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {demo.topics.map((topic) => (
          <TopicChip key={topic} topic={topic} href={`/?topic=${topic}`} />
        ))}
      </div>

      {demo.screenshots.length > 0 ? (
        <div className="mt-12">
          <ScreenshotCarousel shots={demo.screenshots} title={demo.title} />
        </div>
      ) : null}

      <section className="mt-20">
        <h2 className="h2">The experience</h2>
        <div className="mt-4">
          <Markdown>{demo.experience}</Markdown>
        </div>
        <div className="mt-8">
          <ArchitectureFigure repo={demo.repo} architecturePath={demo.architecture} />
        </div>
        {demo.talkTrack.length > 0 ? (
          <dl className="mt-8">
            <Facts label="Reach for this when" items={demo.talkTrack} />
          </dl>
        ) : null}
      </section>

      <section className="mt-20">
        <h2 className="h2">Run it</h2>
        <dl className="mt-6 grid gap-7 rounded-[12px] border border-line bg-bg-card p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <dt className="text-[13px] text-ink-faint">Time to stand up</dt>
            <dd className="mt-2 text-[15px] text-ink">{demo.timeToStandUp}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink-faint">Stack</dt>
            <dd className="mt-2 text-[15px] text-ink-muted">{demo.stack.join(" · ")}</dd>
          </div>
          <div className="sm:col-span-2">
            <Facts label="Auth0 requirements" items={demo.auth0Requirements} />
          </div>
          <div className="sm:col-span-2">
            <Facts label="Everything else" items={demo.otherRequirements} />
          </div>
        </dl>

        <div className="mt-8">
          <Markdown>{demo.setup}</Markdown>
        </div>
        <p className="mt-5 text-[15px] text-ink-faint">
          Canonical instructions stay in the{" "}
          <TrackedLink href={demo.repo} event="cta_readme" className={inlineLink}>
            repository README
          </TrackedLink>
          .
        </p>
      </section>

      {related.length > 0 || demo.relatedRepos.length > 0 ? (
        <section className="mt-20 border-t border-line pt-10">
          <h2 className="h2">See also</h2>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/demos/${item.slug}`} className={inlineLink}>
                  {item.title}
                </Link>
                <span className="text-ink-faint"> — {item.oneLiner}</span>
              </li>
            ))}
            {demo.relatedRepos.map((item) => (
              <li key={item.url}>
                <TrackedLink href={item.url} event="cta_related_repo" className={inlineLink}>
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
