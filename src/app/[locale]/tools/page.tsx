import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SparkIcon } from "@/components/icons";
import { ToolCard } from "@/components/ToolCard";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/tools",
    title: t.tools.hubMetaT,
    description: t.tools.hubMetaD,
  });
}

export default async function ToolsHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const toolBadgeText = { free: t.tools.freeBadge, new: t.tools.newBadge, hot: t.tools.hotBadge } as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.home.toolsEyebrow}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.tools.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.tools.desc}</p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            href={lp(locale, tool.href)}
            color={tool.color}
            icon={tool.icon}
            title={t.tools[`${tool.id}T` as keyof typeof t.tools] as string}
            desc={t.tools[`${tool.id}D` as keyof typeof t.tools] as string}
            badge={tool.badge}
            badgeText={tool.badge ? toolBadgeText[tool.badge] : ""}
            openLabel={t.tools.openTool}
          />
        ))}
      </div>

      {/* 工具间互推：梗图 → AI 写真 */}
      <section className="mt-14 rounded-big border border-sand bg-parchment/60 p-8 text-center md:p-12" aria-labelledby="tools-more">
        <h2 id="tools-more" className="h-display text-2xl md:text-3xl">{t.tools.moreT}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-coffee">{t.tools.moreD}</p>
        <Link href={`${lp(locale, "/")}#create`} className="btn-primary mt-6">
          <SparkIcon className="h-4 w-4" /> {t.tools.moreBtn}
        </Link>
      </section>

      <section className="mt-12 text-center" aria-labelledby="tools-cta">
        <h2 id="tools-cta" className="h-display text-2xl">{t.tools.ctaT}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-coffee">{t.tools.ctaD}</p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${t.tools.title} — ${SITE_NAME}`,
          description: t.tools.hubMetaD,
        }}
      />
    </div>
  );
}
