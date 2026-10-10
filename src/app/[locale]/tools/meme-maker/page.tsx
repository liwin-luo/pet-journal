import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { MemeMaker } from "@/components/MemeMaker";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/tools/meme-maker",
    title: t.meme.metaT,
    description: t.meme.metaD,
  });
}

export default async function MemeMakerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  const how = [
    { t: t.meme.how1t, d: t.meme.how1d },
    { t: t.meme.how2t, d: t.meme.how2d },
    { t: t.meme.how3t, d: t.meme.how3d },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.home.toolsEyebrow}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.meme.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.meme.sub}</p>
      </header>

      <div className="mt-10">
        <MemeMaker
          texts={{
            upload: t.meme.upload,
            uploadHint: t.meme.uploadHint,
            changePhoto: t.meme.changePhoto,
            topText: t.meme.topText,
            bottomText: t.meme.bottomText,
            stickers: t.meme.stickers,
            download: t.meme.download,
            share: t.meme.share,
            errType: t.meme.errType,
            ideaLabel: t.meme.ideaLabel,
            ideas: [...t.meme.ideas],
          }}
        />
      </div>

      {/* 三步走 */}
      <section className="mt-16" aria-labelledby="meme-how">
        <h2 id="meme-how" className="h-display text-center text-3xl">{t.meme.howTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {how.map((s, i) => (
            <div key={i} className="card p-6 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-coral text-base font-black text-white" aria-hidden="true">{i + 1}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-coffee">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 互推 → AI 写真 */}
      <p className="mt-10 text-center text-sm">
        <Link href={`${lp(locale, "/")}#create`} className="font-semibold text-coral hover:underline">{t.meme.tryStudio}</Link>
      </p>

      {/* FAQ */}
      <section className="mx-auto mt-14 max-w-3xl" aria-labelledby="meme-faq">
        <h2 id="meme-faq" className="h-display text-center text-3xl">{t.home.faqTitle}</h2>
        <div className="mt-8">
          <FaqAccordion items={[...t.meme.faq]} />
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t.meme.title,
            url: "/tools/meme-maker",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.meme.faq.map((f) => ({
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
