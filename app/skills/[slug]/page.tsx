import { notFound } from "next/navigation";
import { InstallTabs } from "@/components/install-tabs";
import { Markdown } from "@/components/markdown";
import { TopicChip } from "@/components/topic-chip";
import { TrackedLink } from "@/components/tracked-link";
import { getSkill, getSkills } from "@/lib/content";
import { githubUserUrl } from "@/lib/github";

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
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[12px] tracking-[0.2em] text-skill uppercase">Skill</p>
      <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">
        {skill.title}
      </h1>
      <p className="mt-4 text-lg leading-8 text-ink-muted">{skill.oneLiner}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {skill.topics.map((topic) => (
          <TopicChip key={topic} topic={topic} href={`/?type=skill&topic=${topic}`} />
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        By{" "}
        <a className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent" href={githubUserUrl(skill.author.github)}>
          {skill.author.name}
        </a>
      </p>

      <div className="mt-6">
        <Markdown>{skill.synopsis}</Markdown>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Install</h2>
        <p className="mt-2 text-sm text-ink-faint">
          Official commands from the upstream README. We do not invent a fourth installer.
        </p>
        <div className="mt-4">
          <InstallTabs install={skill.install} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Stories</h2>
        <ol className="mt-6 space-y-8">
          {skill.stories.map((story, index) => (
            <li key={story.title}>
              <p className="font-mono text-[11px] tracking-[0.16em] text-ink-faint uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-display mt-1 text-xl tracking-tight">{story.title}</h3>
              <p className="mt-2 leading-7 text-ink-muted">{story.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">Repository</h2>
        <p className="mt-3">
          <TrackedLink
            href={skill.repo}
            event="cta_skill_repo"
            className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
          >
            {skill.repo.replace("https://", "")}
          </TrackedLink>
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-tight">When to use</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
          {skill.whenToUse.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
