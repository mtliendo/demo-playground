import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isTopic, type Topic } from "./topics";
import type { CatalogItem, Demo, Skill } from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readMdFiles(dir: string) {
  const full = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const parsed = matter(raw);
      return { slug: file.replace(/\.md$/, ""), data: parsed.data, body: parsed.content.trim() };
    });
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asTopics(value: unknown): Topic[] {
  return asStringArray(value).filter(isTopic);
}

function splitSections(body: string) {
  const experienceMatch = body.match(/^## experience\s*\n([\s\S]*?)(?=^## )/m);
  const setupMatch = body.match(/^## setup\s*\n([\s\S]*)$/m);
  return {
    experience: (experienceMatch?.[1] ?? body).trim(),
    setup: (setupMatch?.[1] ?? "").trim(),
  };
}

function parseDemo(slug: string, data: Record<string, unknown>, body: string): Demo {
  const author = (data.author as { name?: string; github?: string }) ?? {};
  const { experience, setup } = splitSections(body);
  return {
    kind: "demo",
    slug,
    title: String(data.title ?? slug),
    oneLiner: String(data.oneLiner ?? ""),
    topics: asTopics(data.topics),
    author: { name: String(author.name ?? "Unknown"), github: String(author.github ?? "") },
    repo: String(data.repo ?? ""),
    liveUrl: data.liveUrl ? String(data.liveUrl) : undefined,
    blogUrl: data.blogUrl ? String(data.blogUrl) : undefined,
    videoUrl: data.videoUrl ? String(data.videoUrl) : undefined,
    timeToStandUp: String(data.timeToStandUp ?? "Unknown"),
    auth0Requirements: asStringArray(data.auth0Requirements),
    otherRequirements: asStringArray(data.otherRequirements),
    talkTrack: asStringArray(data.talkTrack),
    seenAt: asStringArray(data.seenAt),
    relatedRepos: Array.isArray(data.relatedRepos)
      ? (data.relatedRepos as { label?: string; url?: string }[])
          .filter((item) => item.label && item.url)
          .map((item) => ({ label: String(item.label), url: String(item.url) }))
      : [],
    seeAlso: asStringArray(data.seeAlso),
    architecture: String(data.architecture ?? "docs/architecture.png"),
    stack: asStringArray(data.stack),
    experience,
    setup,
  };
}

function parseSkill(slug: string, data: Record<string, unknown>, body: string): Skill {
  const author = (data.author as { name?: string; github?: string }) ?? {};
  const install = (data.install as Record<string, string>) ?? {};
  const stories = Array.isArray(data.stories)
    ? (data.stories as { title?: string; body?: string }[])
        .filter((item) => item.title && item.body)
        .map((item) => ({ title: String(item.title), body: String(item.body) }))
    : [];
  return {
    kind: "skill",
    slug,
    title: String(data.title ?? slug),
    oneLiner: String(data.oneLiner ?? ""),
    topics: asTopics(data.topics),
    author: { name: String(author.name ?? "Unknown"), github: String(author.github ?? "") },
    repo: String(data.repo ?? ""),
    install: {
      cursor: String(install.cursor ?? ""),
      claude: String(install.claude ?? ""),
      chatgpt: String(install.chatgpt ?? ""),
      any: String(install.any ?? ""),
    },
    stories,
    whenToUse: asStringArray(data.whenToUse),
    synopsis: body,
  };
}

export function getDemos(): Demo[] {
  return readMdFiles("demos")
    .map((file) => parseDemo(file.slug, file.data as Record<string, unknown>, file.body))
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

export function getDemo(slug: string) {
  return getDemos().find((demo) => demo.slug === slug);
}

export function getSkills(): Skill[] {
  return readMdFiles("skills")
    .map((file) => parseSkill(file.slug, file.data as Record<string, unknown>, file.body))
    .toSorted((a, b) => a.title.localeCompare(b.title));
}

export function getSkill(slug: string) {
  return getSkills().find((skill) => skill.slug === slug);
}

export function getCatalogItems(): CatalogItem[] {
  const demos = getDemos().map(
    (demo): CatalogItem => ({
      kind: "demo",
      slug: demo.slug,
      title: demo.title,
      oneLiner: demo.oneLiner,
      topics: demo.topics,
      href: `/demos/${demo.slug}`,
      timeToStandUp: demo.timeToStandUp,
      liveUrl: demo.liveUrl,
    }),
  );
  const skills = getSkills().map(
    (skill): CatalogItem => ({
      kind: "skill",
      slug: skill.slug,
      title: skill.title,
      oneLiner: skill.oneLiner,
      topics: skill.topics,
      href: `/skills/${skill.slug}`,
    }),
  );
  return [...demos, ...skills];
}
