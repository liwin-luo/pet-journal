import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgeCalculator } from "@/components/AgeCalculator";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/tools/pet-age",
    title: t.age.metaT,
    description: t.age.metaD,
  });
}

export default async function PetAgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.home.toolsEyebrow}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.age.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.age.sub}</p>
      </header>

      <div className="mt-10">
        <AgeCalculator
          texts={{
            kind: t.age.kind,
            cat: t.age.cat,
            dog: t.age.dog,
            ageLabel: t.age.ageLabel,
            years: t.age.years,
            size: t.age.size,
            small: t.age.small,
            medium: t.age.medium,
            large: t.age.large,
            result: t.age.result,
            stage: t.age.stage,
            chartTitle: t.age.chartTitle,
            petYears: t.age.petYears,
            humanYears: t.age.humanYears,
          }}
        />
      </div>

      {/* 互推 → 头像工具 */}
      <p className="mt-12 text-center text-sm">
        <Link href={lp(locale, "/tools/pet-avatar")} className="font-semibold text-coral hover:underline">{t.avatar.tryMeme}</Link>
      </p>

      {/* FAQ */}
      <section className="mx-auto mt-12 max-w-3xl" aria-labelledby="pet-age-faq">
        <h2 id="pet-age-faq" className="h-display text-center text-3xl">{t.home.faqTitle}</h2>
        <div className="mt-8">
          <FaqAccordion items={[...t.age.faq]} />
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t.age.title,
            url: "/tools/pet-age",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.age.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
    </div>
  );
}
