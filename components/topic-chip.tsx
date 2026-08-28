import { TOPIC_LABELS, type Topic } from "@/lib/topics";

type TopicChipProps = {
  topic: Topic;
  href?: string;
  active?: boolean;
};

export function TopicChip({ topic, href, active }: TopicChipProps) {
  const label = TOPIC_LABELS[topic];
  const className = [
    "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase transition-colors",
    active
      ? "border-accent bg-accent-soft text-ink"
      : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
  ].join(" ");

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return <span className={className}>{label}</span>;
}
