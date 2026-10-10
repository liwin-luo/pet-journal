import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons";
import { getAllHelpDocs, getHelpDoc, localizeHelpHtml } from "@/lib/help";
import { DEFAULT_LOCALE, getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export function generateStaticParams() {
  return getAllHelpDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const doc = getHelpDoc(slug);
  if (!doc) return {};
  return pageMeta({
    locale: raw as Locale,
    path: `/help/${slug}`,
    title: doc.title,
    description: doc.description,
  });
}

export default async function HelpDocPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const doc = getHelpDoc(slug);
  if (!doc) notFound();
  const html = localizeHelpHtml(doc.html, locale === DEFAULT_LOCALE ? "" : `/${locale}`);
  const others = getAllHelpDocs().filter((d) => d.slug !== slug);
  const toolDef = TOOLS.find((tl) => tl.href === doc.tool);
  const toolName = toolDef ? (t.tools[`${toolDef.id}T` as keyof typeof t.tools] as string) : t.footer.create;

  const howTo =
    doc.steps.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: doc.title,
          description: doc.description,
          step: doc.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.split(/[.—:]/)[0].slice(0, 80), text: s })),
          tool: `${SITE_NAME} ${toolName}`,
        }
      : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header>
        <Link href={lp(locale, "/help")} className="text-sm font-semibold text-coral hover:underline">
          ← {t.help.back}
        </Link>
        <h1 className="headline-retro h-display mt-4 text-4xl leading-tight md:text-5xl">{doc.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-coffee">{doc.description}</p>
      </header>

      {/* 步骤速览（也是 HowTo 结构化数据源） */}
      {doc.steps.length >= 2 && (
        <nav aria-label={t.help.steps} className="card mt-8 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fog">{t.help.steps}</p>
          <ol className="mt-3 space-y-1.5 text-sm text-coffee">
            {doc.steps.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold text-coral" aria-hidden="true">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* 正文 */}
      <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: html }} />

      {/* 工具 CTA：本篇对应的工具 */}
      <div className="mt-14 rounded-big bg-coral px-6 py-10 text-center text-white shadow-lift">
        <p className="h-display text-2xl md:text-3xl">{toolName}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-coral-soft">Free to try · 3 pictures a day · no account to start</p>
        <Link href={lp(locale, doc.tool)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
          {t.help.openTool} <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* 其他帮助文档 */}
      {others.length > 0 && (
        <section className="mt-14" aria-label="More guides">
          <h2 className="h-display text-2xl">More guides</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {others.map((d) => (
              <Link key={d.slug} href={lp(locale, `/help/${d.slug}`)} className="card group p-4 transition-all duration-200 hover:-translate-y-1 hover:border-coral/60">
                <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-coral">{d.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-coffee">{d.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={[
          ...(howTo ? [howTo] : []),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
              { "@type": "ListItem", position: 2, name: t.help.title, item: `${SITE_URL}${lp(locale, "/help")}` },
              { "@type": "ListItem", position: 3, name: doc.title },
            ],
          },
        ]}
      />
    </article>
  );
}
