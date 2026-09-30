import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeChip } from "@/components/BadgeChip";
import { CopyButton } from "@/components/CopyButton";
import { PromptBlock } from "@/components/PromptBlock";
import { TemplateCard } from "@/components/TemplateCard";
import { getDict, isLocale, LOCALES, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { CATS, TEMPLATES, templateById, tplImg } from "@/lib/templates";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => TEMPLATES.map((t) => ({ locale, slug: t.id })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = (await params) ?? {};
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const t = getDict(locale);
  const tpl = templateById(slug);
  if (!tpl) return pageMeta({ locale, path: `/templates/${slug}`, title: "Not found", noindex: true });
  return pageMeta({
    locale,
    path: `/templates/${tpl.id}`,
    title: t.tpl.detailTitle.replace("{name}", tpl.name),
    description: t.tpl.detailDesc.replace("{blurb}", tpl.blurb).replace(/\{name\}/g, tpl.name),
    ogImage: tplImg(tpl.id),
  });
}

export default async function TemplateDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = (await params) ?? {};
  if (!isLocale(raw) || !slug) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const tpl = templateById(slug);
  if (!tpl) notFound();
  const cat = CATS.find((c) => c.id === tpl.cat)!;
  const related = TEMPLATES.filter((x) => x.cat === tpl.cat && x.id !== tpl.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="text-sm text-coffee" aria-label="Breadcrumb">
        <Link href={lp(locale, "/templates")} className="hover:text-coral">{t.tpl.crumbRoot}</Link>
        <span className="mx-2 text-fog">/</span>
        <Link href={`/templates?cat=${tpl.cat}`} className="hover:text-coral">{t.tpl.cats[tpl.cat]}</Link>
        <span className="mx-2 text-fog">/</span>
        <span className="text-ink">{tpl.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tplImg(tpl.id)}
            alt={`${tpl.name} — AI pet portrait template example`}
            width={512}
            height={683}
            fetchPriority="high"
            className="w-full rounded-big object-cover shadow-lift"
          />
          <figcaption className="mt-3 text-xs text-fog">{t.tpl.exampleCap}</figcaption>
        </figure>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="h-display text-3xl md:text-4xl">{tpl.name} pet portrait</h1>
            {tpl.badge && <BadgeChip badge={tpl.badge} />}
          </div>
          <p className="mt-3 text-coffee">{tpl.blurb}</p>

          <div className="mt-6 card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-fog">{t.tpl.promptLabel}</p>
            <div className="mt-2">
              <PromptBlock prompt={tpl.prompt} texts={{ showFull: t.tpl.showFull, showLess: t.tpl.showLess }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={tpl.prompt} />
              <Link href={`/?tpl=${tpl.id}#create`} className="btn-primary !py-2 text-sm">
                {t.tpl.useTpl}
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold">{t.tpl.howTitle}</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-coffee">
              {t.tpl.how.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <p className="mt-6 rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage">{t.tpl.tip}</p>
        </div>
      </div>

      <section className="mt-14" aria-labelledby="related">
        <h2 id="related" className="h-display text-2xl">{t.tpl.more.replace("{cat}", t.tpl.cats[tpl.cat])}</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {related.map((x) => (
            <TemplateCard key={x.id} tpl={x} />
          ))}
        </div>
      </section>
    </div>
  );
}
