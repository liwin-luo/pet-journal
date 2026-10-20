import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TemplateFilter } from "@/components/public-filter";
import { TemplateCard } from "@/components/TemplateCard";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { BADGES, CATS, TEMPLATES } from "@/lib/templates";


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

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">{t.tpl.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-coffee">{t.tpl.desc}</p>
      </header>

      <TemplateFilter
        badges={BADGES.map((b) => ({ id: b.id, label: t.tpl[b.id] }))}
        cats={CATS.map((c) => ({
          id: c.id,
          label: `${t.tpl.cats[c.id]} (${TEMPLATES.filter((x) => x.cat === c.id).length})`,
        }))}
        allLabel={t.tpl.all}
        total={TEMPLATES.length}
        empty={t.tpl.empty.replace("{badge}", "")}
      />

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {TEMPLATES.map((tpl, i) => (
          <div key={tpl.id} data-tpl="" data-cat={tpl.cat} data-badge={tpl.badge ?? ""}>
            <TemplateCard tpl={tpl} priority={i < 8} />
          </div>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AI pet portrait templates",
          numberOfItems: TEMPLATES.length,
          itemListElement: TEMPLATES.slice(0, 30).map((tpl, i) => ({
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
