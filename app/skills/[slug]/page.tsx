import { notFound } from "next/navigation";
import { InstallTabs } from "@/components/install-tabs";
import { Markdown } from "@/components/markdown";
import { TopicChip } from "@/components/topic-chip";
import { TrackedLink } from "@/components/tracked-link";
import { getSkill, getSkills } from "@/lib/content";
import { githubUserUrl } from "@/lib/github";
import { btnBrand, inlineLink } from "@/lib/ui";

export function generateStaticParams() {
  return getSkills().map((skill) => ({ slug: skill.slug }));
}

type SkillParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: SkillParams) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return {};
  return { title: skill.title, description: skill.oneLiner };
}

export default async function SkillPage({ params }: SkillParams) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow">Skill</p>
      <h1 className="h1 mt-4">{skill.title}</h1>
      <p className="mt-5 text-lg leading-8 text-ink-muted">{skill.oneLiner}</p>

      <p className="mt-6 text-[15px] text-ink-faint">
        By{" "}
        <a className={inlineLink} href={githubUserUrl(skill.author.github)}>
          {skill.author.name}
        </a>
      </p>

      <div className="mt-8">
        <TrackedLink href={skill.repo} event="cta_skill_repo" className={btnBrand}>
          Repository
        </TrackedLink>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {skill.topics.map((topic) => (
          <TopicChip key={topic} topic={topic} href={`/?topic=${topic}`} />
        ))}
      </div>

      <section className="mt-20">
        <h2 className="h2">Install</h2>
        <p className="mt-2 text-[15px] text-ink-faint">
          Official commands from the upstream README.
        </p>
        <div className="mt-5">
          <InstallTabs install={skill.install} />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="h2">What it does</h2>
        <div className="mt-4">
          <Markdown>{skill.synopsis}</Markdown>
        </div>
        {skill.whenToUse.length > 0 ? (
          <ul className="mt-6 max-w-[70ch] space-y-1.5 text-[15px] leading-6 text-ink-muted">
            {skill.whenToUse.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-line-strong" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {skill.stories.length > 0 ? (
        <section className="mt-20">
          <h2 className="h2">Stories</h2>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {skill.stories.map((story) => (
              <li key={story.title} className="py-5">
                <h3 className="text-[17px] font-medium tracking-[-0.015em] text-ink">
                  {story.title}
                </h3>
                <p className="mt-1.5 max-w-[70ch] text-[15px] leading-6 text-ink-muted">
                  {story.body}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </main>
  );
}
