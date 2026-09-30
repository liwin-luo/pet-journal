import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TemplateCard } from "@/components/TemplateCard";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { BADGES, CATS, TEMPLATES, type Badge, type CatId } from "@/lib/templates";

// 徽章/分类筛选走 searchParams，必须每次请求渲染
export const dynamic = "force-dynamic";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/templates",
    title: t.meta.templatesTitle,
    description: t.meta.templatesDesc,
    ogImage: "/tpl/royal.jpg",
    ogImageDims: { w: 768, h: 768 },
  });
}

export default async function TemplatesPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ cat?: string; badge?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const { cat, badge } = await searchParams;
  const active = CATS.some((c) => c.id === cat) ? (cat as CatId) : "all";
  const activeBadge = badge === "hot" || badge === "new" ? (badge as Badge) : undefined;
  const list = TEMPLATES.filter((t) => (active === "all" || t.cat === active) && (!activeBadge || t.badge === activeBadge));

  const chipCls = (on: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      on ? "bg-coral text-white" : "border border-sand bg-white text-coffee hover:border-coral hover:text-coral"
    }`;
  const catHref = (c: CatId) => (activeBadge ? `/templates?badge=${activeBadge}&cat=${c}` : `/templates?cat=${c}`);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">{t.tpl.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-coffee">{t.tpl.desc}</p>
      </header>

      {/* 徽章快捷筛选 */}
      <nav className="mt-6 flex justify-center gap-2" aria-label="Badge filters">
        {BADGES.map((b) => (
          <Link
            key={b.id}
            href={activeBadge === b.id ? (active === "all" ? "/templates" : `/templates?cat=${active}`) : `/templates?badge=${b.id}`}
            className={chipCls(activeBadge === b.id)}
          >
            {t.tpl[b.id]}
          </Link>
        ))}
      </nav>

      {/* 分类筛选 */}
      <nav className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Template categories">
        <Link href={activeBadge ? `/templates?badge=${activeBadge}` : "/templates"} className={chipCls(active === "all")}>
          {t.tpl.all} ({TEMPLATES.length})
        </Link>
        {CATS.map((c) => {
          const n = TEMPLATES.filter((x) => x.cat === c.id).length;
          return (
            <Link key={c.id} href={catHref(c.id)} className={chipCls(active === c.id)}>
              {t.tpl.cats[c.id]} ({n})
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((tpl, i) => (
          <TemplateCard key={tpl.id} tpl={tpl} priority={i < 8} />
        ))}
      </div>
      {!list.length && (
        <p className="mt-10 text-center text-coffee">
          {t.tpl.empty.replace("{badge}", activeBadge ? t.tpl[activeBadge] : "")}
        </p>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AI pet portrait templates",
          numberOfItems: list.length,
          itemListElement: list.slice(0, 30).map((tpl, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${tpl.name} pet portrait template`,
            url: `/templates/${tpl.id}`,
          })),
        }}
      />
    </div>
  );
}
