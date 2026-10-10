import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvatarStudio } from "@/components/AvatarStudio";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { getSessionUser } from "@/lib/auth";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/tools/pet-avatar",
    title: t.avatar.metaT,
    description: t.avatar.metaD,
  });
}

export default async function PetAvatarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const user = await getSessionUser().catch(() => null);

  const how = [
    { t: t.avatar.how1t, d: t.avatar.how1d },
    { t: t.avatar.how2t, d: t.avatar.how2d },
    { t: t.avatar.how3t, d: t.avatar.how3d },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.home.toolsEyebrow}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.avatar.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.avatar.sub}</p>
      </header>

      <div className="mt-10">
        <AvatarStudio
          locale={locale}
          signedIn={!!user}
          loginPath={lp(locale, "/login")}
          texts={{
            styleLabel: t.avatar.styleLabel,
            photoLabel: t.avatar.photoLabel,
            photoHint: t.avatar.photoHint,
            generate: t.avatar.generate,
            generating: t.avatar.generating,
            again: t.avatar.again,
            dl: t.avatar.dl,
            dlSignIn: t.avatar.dlSignIn,
            errPhoto: t.avatar.errPhoto,
            err: t.avatar.err,
            free: t.avatar.free,
            left: t.avatar.left,
            share: t.gen.share,
          }}
        />
      </div>

      {/* 三步走 */}
      <section className="mt-16" aria-labelledby="avatar-how">
        <h2 id="avatar-how" className="h-display text-center text-3xl">{t.home.howTitle}</h2>
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

      {/* 互推 → 梗图 */}
      <p className="mt-10 text-center text-sm">
        <Link href={lp(locale, "/tools/meme-maker")} className="font-semibold text-coral hover:underline">{t.avatar.tryMeme}</Link>
      </p>

      {/* 帮助文档交叉内链 */}
      <p className="mt-4 text-center text-sm text-coffee">
        Need the full manual? Read{" "}
        <Link href={lp(locale, "/help/how-to-create-a-pet-avatar")} className="font-semibold text-coral hover:underline">
          How to Create an AI Pet Avatar
        </Link>
        .
      </p>

      {/* FAQ */}
      <section className="mx-auto mt-14 max-w-3xl" aria-labelledby="avatar-faq">
        <h2 id="avatar-faq" className="h-display text-center text-3xl">{t.home.faqTitle}</h2>
        <div className="mt-8">
          <FaqAccordion items={[...t.avatar.faq]} />
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: t.avatar.title,
            url: "/tools/pet-avatar",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.avatar.faq.map((f) => ({
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
