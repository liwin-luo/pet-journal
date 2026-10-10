import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { NameGenerator } from "@/components/NameGenerator";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { DOG_NAMES } from "@/lib/names";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/tools/dog-names",
    title: t.dogPage.metaT,
    description: t.dogPage.metaD,
  });
}

export default async function DogNamesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.home.toolsEyebrow}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.dogPage.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.dogPage.sub}</p>
      </header>

      <div className="mt-10">
        <NameGenerator
          names={DOG_NAMES}
          species="dog"
          texts={{
            pickGender: t.names.pickGender,
            gAll: t.names.gAll,
            gM: t.names.gM,
            gF: t.names.gF,
            gU: t.names.gU,
            pickStyle: t.names.pickStyle,
            sAll: t.names.sAll,
            sCute: t.names.sCute,
            sCool: t.names.sCool,
            sClassic: t.names.sClassic,
            sFunny: t.names.sFunny,
            sFood: t.names.sFood,
            shuffle: t.names.shuffle,
            savedTitle: t.names.savedTitle,
            savedEmpty: t.names.savedEmpty,
            clear: t.names.clear,
            count: t.names.count,
          }}
        />
      </div>

      {/* 互推 → 头像工具 */}
      <p className="mt-12 text-center text-sm">
        <Link href={lp(locale, "/tools/pet-avatar")} className="font-semibold text-coral hover:underline">{t.avatar.tryMeme}</Link>
      </p>

      {/* FAQ */}
      <section className="mx-auto mt-12 max-w-3xl" aria-labelledby="dog-names-faq">
        <h2 id="dog-names-faq" className="h-display text-center text-3xl">{t.home.faqTitle}</h2>
        <div className="mt-8">
          <FaqAccordion items={[...t.dogPage.faq]} />
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: t.dogPage.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
