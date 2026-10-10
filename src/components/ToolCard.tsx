import Link from "next/link";
import type { ComponentType } from "react";
import type { ToolIconId } from "@/lib/tools";
import { ArrowIcon, BoneIcon, CakeIcon, LaughIcon, MoonIcon, PaletteIcon, PawIcon } from "./icons";

const ICONS: Record<ToolIconId, ComponentType<{ className?: string }>> = {
  palette: PaletteIcon,
  laugh: LaughIcon,
  moon: MoonIcon,
  bone: BoneIcon,
  paw: PawIcon,
  cake: CakeIcon,
};

// Skillry 式马卡龙工具卡：彩色卡面 + 内联 SVG 图标 + FREE/NEW 徽章 + 标题描述。
export function ToolCard({
  href,
  color,
  icon,
  title,
  desc,
  badge,
  badgeText,
  openLabel,
}: {
  href: string;
  color: string;
  icon: ToolIconId;
  title: string;
  desc: string;
  badge?: "free" | "new" | "hot";
  badgeText: string;
  openLabel: string;
}) {
  const Icon = ICONS[icon];
  const badgeCls =
    badge === "new"
      ? "bg-lemon text-lemon-ink"
      : badge === "hot"
        ? "bg-coral text-white"
        : "border border-sand bg-surface-2 text-coffee";
  return (
    <Link
      href={href}
      className="card group relative flex flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-coral/60 hover:shadow-lift"
    >
      {badge && (
        <span className={`pill-badge absolute right-4 top-4 ${badgeCls}`} aria-hidden="true">
          {badgeText}
        </span>
      )}
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-lemon-ink shadow-soft transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        <Icon className="h-8 w-8" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug">{title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-coffee">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
        {openLabel}
        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
