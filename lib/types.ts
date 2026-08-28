import type { Topic } from "./topics";

export type Author = {
  name: string;
  github: string;
};

export type RelatedRepo = {
  label: string;
  url: string;
};

export type Demo = {
  kind: "demo";
  slug: string;
  title: string;
  oneLiner: string;
  topics: Topic[];
  author: Author;
  repo: string;
  liveUrl?: string;
  blogUrl?: string;
  videoUrl?: string;
  timeToStandUp: string;
  auth0Requirements: string[];
  otherRequirements: string[];
  talkTrack: string[];
  seenAt: string[];
  relatedRepos: RelatedRepo[];
  seeAlso: string[];
  architecture: string;
  stack: string[];
  experience: string;
  setup: string;
};

export type SkillStory = {
  title: string;
  body: string;
};

export type SkillInstall = {
  cursor: string;
  claude: string;
  chatgpt: string;
  any: string;
};

export type Skill = {
  kind: "skill";
  slug: string;
  title: string;
  oneLiner: string;
  topics: Topic[];
  author: Author;
  repo: string;
  install: SkillInstall;
  stories: SkillStory[];
  whenToUse: string[];
  synopsis: string;
};

export type CatalogItem = {
  kind: "demo" | "skill";
  slug: string;
  title: string;
  oneLiner: string;
  topics: Topic[];
  href: string;
  timeToStandUp?: string;
  liveUrl?: string;
};
