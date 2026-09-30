import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { TemplateCard } from "@/components/TemplateCard";
import { pageMeta } from "@/lib/seo";
import { CATS, TEMPLATES, type CatId } from "@/lib/templates";

export const metadata: Metadata = pageMeta({
  title: "Pet portrait template center — 100 free AI styles",
  description:
    "Browse 100 AI pet portrait templates: renaissance paintings, Christmas cards, movie posters, anime and more. Copy any prompt for free and make yours in 30 seconds.",
  path: "/templates",
  ogImage: "/tpl/royal.jpg",
});

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const active = CATS.some((c) => c.id === cat) ? (cat as CatId) : "all";
  const list = active === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.cat === active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">Template center</h1>
        <p className="mx-auto mt-3 max-w-2xl text-coffee">
          100 ready-made recipes for your pet&apos;s next picture. Copy the prompt straight into the studio, or open a
          template and add your own twist — every prompt is free to copy.
        </p>
      </header>

      {/* 分类筛选 */}
      <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Template categories">
        <Link
          href="/templates"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            active === "all" ? "bg-coral text-white" : "border border-sand bg-white text-coffee hover:border-coral hover:text-coral"
          }`}
        >
          All ({TEMPLATES.length})
        </Link>
        {CATS.map((c) => {
          const n = TEMPLATES.filter((t) => t.cat === c.id).length;
          return (
            <Link
              key={c.id}
              href={`/templates?cat=${c.id}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === c.id ? "bg-coral text-white" : "border border-sand bg-white text-coffee hover:border-coral hover:text-coral"
              }`}
            >
              {c.name} ({n})
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((t, i) => (
          <TemplateCard key={t.id} tpl={t} priority={i < 8} />
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AI pet portrait templates",
          numberOfItems: list.length,
          itemListElement: list.slice(0, 30).map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${t.name} pet portrait template`,
            url: `/templates/${t.id}`,
          })),
        }}
      />
    </div>
  );
}
