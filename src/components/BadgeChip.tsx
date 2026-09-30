import type { Badge } from "@/lib/templates";

const STYLES: Record<Badge, string> = {
  hot: "bg-coral text-white",
  new: "bg-gold text-ink",
};

const LABELS: Record<Badge, string> = {
  hot: "🔥 Hot",
  new: "✨ New",
};

export function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-soft ${STYLES[badge]}`}
    >
      {LABELS[badge]}
    </span>
  );
}
