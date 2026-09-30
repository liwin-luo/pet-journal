import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { SITE_MAIL, UPDATED } from "@/lib/site";

type Block = { h: string; body: string[] };

/** 法律页共用排版：privacy / terms / ai-disclosure 都是「标题 + 段块」。 */
export function LegalPage({
  locale,
  title,
  intro,
  blocks,
  meta,
}: {
  locale: Locale;
  title: string;
  intro: string;
  blocks: Block[];
  meta: { updatedLabel: string; questionsPre: string; seeAlso: string; faq: string };
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="h-display text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-fog">{meta.updatedLabel} {UPDATED}</p>
      <p className="mt-4 text-coffee">{intro}</p>
      <div className="mt-8 space-y-8">
        {blocks.map((b) => (
          <section key={b.h}>
            <h2 className="font-display text-xl font-semibold">{b.h}</h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-coffee">
              {b.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm text-coffee">
        {meta.questionsPre}
        <a href={`mailto:${SITE_MAIL}`} className="font-semibold text-coral hover:underline">{SITE_MAIL}</a>. {meta.seeAlso}{" "}
        <Link href={lp(locale, "/faq")} className="font-semibold text-coral hover:underline">{meta.faq}</Link>.
      </p>
    </div>
  );
}

/** 法律页通用工厂：传 dict 子对象即可生成 privacy / terms / ai 页面。 */
export function makeLegalPage(
  key: "privacy" | "terms" | "ai",
  metaKey: "privacyTitle" | "termsTitle" | "aiTitle",
  metaDesc: "privacyDesc" | "termsDesc" | "aiDesc",
  path: string,
) {
  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: raw } = await params;
    if (!isLocale(raw)) notFound();
    const t = getDict(raw as Locale);
    const doc = t.legal[key];
    return (
      <LegalPage
        locale={raw as Locale}
        title={doc.title}
        intro={doc.intro}
        blocks={doc.blocks.map((b) => ({ h: b.h, body: [...b.body] }))}
        meta={{
          updatedLabel: t.legal.updatedLabel,
          questionsPre: t.legal.questionsPre,
          seeAlso: t.legal.seeAlso,
          faq: t.legal.faq,
        }}
      />
    );
  }

  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale: raw } = await params;
    if (!isLocale(raw)) return {};
    const t = getDict(raw as Locale);
    return pageMeta({
      locale: raw as Locale,
      path,
      title: t.meta[metaKey],
      description: t.meta[metaDesc],
    });
  }

  return { Page, generateMetadata };
}
