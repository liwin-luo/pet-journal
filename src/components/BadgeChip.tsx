import type { Badge } from "@/lib/templates";
import { FlameIcon, SparkIcon } from "./icons";

const STYLES: Record<Badge, string> = {
  hot: "bg-coral text-white",
  new: "bg-gold text-ink",
};

const ICONS: Record<Badge, (props: { className?: string }) => React.ReactNode> = {
  hot: FlameIcon,
  new: SparkIcon,
};

export function BadgeChip({ badge }: { badge: Badge }) {
  const Icon = ICONS[badge];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-soft ${STYLES[badge]}`}
    >
      <Icon className="h-3 w-3" />
    </span>
  );
}
