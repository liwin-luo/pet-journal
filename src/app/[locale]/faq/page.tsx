import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { SITE_MAIL } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({ locale: raw as Locale, path: "/faq", title: t.meta.faqTitle, description: t.meta.faqDesc });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">{t.faqPage.title}</h1>
        <p className="mt-3 text-coffee">
          {t.faqPage.intro}{" "}
          <a href={`mailto:${SITE_MAIL}`} className="font-semibold text-coral hover:underline">{SITE_MAIL}</a>.
        </p>
      </header>
      <div className="mt-10">
        <FaqAccordion items={t.faq} />
      </div>
      <div className="mt-10 text-center">
        <Link href={lp(locale, "/#create")} className="btn-primary">{t.faqPage.cta}</Link>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: t.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
