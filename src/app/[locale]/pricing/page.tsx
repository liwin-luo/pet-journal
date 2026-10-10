import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { PricingPlans } from "@/components/PricingPlans";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/pricing",
    title: t.pricing.metaT,
    description: t.pricing.metaD,
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.pricing.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.pricing.sub}</p>
      </header>

      <div className="mt-10">
        <PricingPlans
          texts={{
            freeName: t.pricing.freeName,
            freePrice: t.pricing.freePrice,
            freePer: t.pricing.freePer,
            freeFeat: [...t.pricing.freeFeat],
            freeCta: t.pricing.freeCta,
            proBadge: t.pricing.proBadge,
            proName: t.pricing.proName,
            proFeat: [...t.pricing.proFeat],
            monthly: t.pricing.monthly,
            yearly: t.pricing.yearly,
            perMonth: t.pricing.perMonth,
            perYear: t.pricing.perYear,
            yearlySave: t.pricing.yearlySave,
            creditsName: t.pricing.creditsName,
            creditsSub: t.pricing.creditsSub,
            creditUnit: t.pricing.creditUnit,
            packsFeat: [...t.pricing.packsFeat],
            buy: t.pricing.buy,
            soon: t.pricing.soon,
            startHref: `${lp(locale, "/")}#create`,
          }}
        />
      </div>

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="pricing-faq">
        <h2 id="pricing-faq" className="h-display text-center text-3xl">{t.home.faqTitle}</h2>
        <div className="mt-8">
          <FaqAccordion items={[...t.pricing.faq]} />
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: t.pricing.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
