import type { Topic } from "./topics";

export type Screenshot = {
  src: string;
  label: string;
};

export type Author = {
  name: string;
  github: string;
};

export type RelatedRepo = {
  label: string;
  url: string;
};

export type CatalogEntryMeta = {
  slug: string;
  title: string;
  oneLiner: string;
  topics: Topic[];
  author: Author;
};

export type Demo = CatalogEntryMeta & {
  kind: "demo";
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
  screenshots: Screenshot[];
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

export type Skill = CatalogEntryMeta & {
  kind: "skill";
  repo: string;
  install: SkillInstall;
  stories: SkillStory[];
  whenToUse: string[];
  synopsis: string;
};

export type Presentation = CatalogEntryMeta & {
  kind: "presentation";
  timeToComplete: string;
  seenAt: string[];
  seeAlso: string[];
  // Google Slides view/edit URL. Sharing must be restricted to the org (Okta-federated
  // Google Workspace) — never "Anyone with the link" — so this is opened via a plain
  // link-out button, never embedded in an <iframe>.
  slidesUrl: string;
  talkTrack: string;
};

export type CatalogItem = {
  kind: "demo" | "skill" | "presentation";
  slug: string;
  title: string;
  oneLiner: string;
  topics: Topic[];
  href: string;
  timeToStandUp?: string;
  liveUrl?: string;
  thumbnail?: string;
};
