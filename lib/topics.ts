export const TOPICS = [
  "ai-agents",
  "token-vault",
  "ciba",
  "human-in-the-loop",
  "events",
  "tenant-ops",
  "jwt",
] as const;

export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  "ai-agents": "AI Agents",
  "token-vault": "Token Vault",
  ciba: "CIBA",
  "human-in-the-loop": "Human-in-the-loop",
  events: "Events",
  "tenant-ops": "Tenant ops",
  jwt: "JWT",
};

export function isTopic(value: string): value is Topic {
  return (TOPICS as readonly string[]).includes(value);
}
