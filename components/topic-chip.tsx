import { TOPIC_LABELS, type Topic } from "@/lib/topics";

export function TopicChip({ topic, href }: { topic: Topic; href?: string }) {
  const label = TOPIC_LABELS[topic];
  const className =
    "inline-flex min-h-9 items-center rounded-full border border-line px-3 text-[13px] text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink";

  return href ? (
    <a href={href} className={className}>
      {label}
    </a>
  ) : (
    <span className={className}>{label}</span>
  );
}
