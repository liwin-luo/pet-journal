import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Generator } from "@/components/Generator";
import { JsonLd } from "@/components/JsonLd";
import { PawIcon, SparkIcon, StarIcon, UploadIcon } from "@/components/icons";
import { TemplateCard } from "@/components/TemplateCard";
import { getSessionUser } from "@/lib/auth";
import { getAllGallery, splitWorksReviews } from "@/lib/gallery";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { TEMPLATES } from "@/lib/templates";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/",
    title: t.meta.homeTitle,
    description: t.meta.homeDesc,
    ogImage: "/og.jpg",
    ogImageDims: { w: 1728, h: 2304 },
    ogImageAlt: "AI pet portrait example — a pet painted in a renaissance style",
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const featured = TEMPLATES.filter((t) =>
    ["royal", "xmas", "poster", "pixar", "sticker", "neon", "polaroid", "astronaut"].includes(t.id),
  );
  const { works, reviews } = splitWorksReviews(await getAllGallery());
  const user = await getSessionUser().catch(() => null);

  return (
    <>
      {/* Hero + 生成器 */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 text-center md:pt-16">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-semibold text-coffee shadow-soft">
          <SparkIcon className="h-3.5 w-3.5 text-coral" />
          {t.home.badge}
        </p>
        <h1 className="h-display mx-auto mt-5 max-w-3xl text-4xl leading-tight md:text-6xl">
          {t.home.heroPre}
          <span className="text-coral">{t.home.heroHl}</span>
          {t.home.heroPost}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-coffee md:text-lg">{t.home.sub}</p>

        <div className="mx-auto mt-8 max-w-2xl text-left">
          <Suspense fallback={<div className="card h-72 animate-pulse !rounded-big" />}>
            <Generator
              featured={featured}
              user={user}
              locale={locale}
              gen={t.gen}
              labels={{
                topbar: t.home.topbar,
                topbarSession: t.home.topbarSession,
                freeCount: t.home.freeCount,
                uploadTitle: t.home.uploadTitle,
                ideasLabel: t.home.ideasLabel,
                ideas: [...t.home.ideas],
                tplLabel: t.home.tplLabel,
                browseAll: t.home.browseAll,
                placeholder: t.home.placeholder,
                helper: t.home.helper,
              }}
            />
          </Suspense>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-fog">
            <li>✓ {t.home.trust1}</li>
            <li>✓ {t.home.trust2}</li>
            <li>✓ {t.home.trust3}</li>
            <li>✓ {t.home.trust4}</li>
          </ul>
        </div>

        {/* 前后对比 */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 md:gap-6">
          <figure className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/land/before.jpg" alt={t.home.beforeCap} width={400} height={300} className="aspect-[4/3] w-full rounded-card object-cover shadow-soft" />
            <figcaption className="mt-2 text-xs text-coffee">{t.home.beforeCap}</figcaption>
          </figure>
          <span aria-hidden="true" className="text-2xl text-coral">→</span>
          <figure className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/land/after.jpg" alt={t.home.afterCap} width={400} height={300} className="aspect-[4/3] w-full rounded-card object-cover shadow-soft" />
            <figcaption className="mt-2 text-xs text-coffee">{t.home.afterCap}</figcaption>
          </figure>
        </div>
      </section>

      {/* 三步走 */}
      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="how">
        <h2 id="how" className="h-display text-center text-3xl">{t.home.howTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: <UploadIcon className="h-6 w-6" />, t: t.home.how1t, d: t.home.how1d },
            { icon: <PawIcon className="h-6 w-6" />, t: t.home.how2t, d: t.home.how2d },
            { icon: <SparkIcon className="h-6 w-6" />, t: t.home.how3t, d: t.home.how3d },
          ].map((s, i) => (
            <div key={i} className="card p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-soft text-coral">{s.icon}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-coffee">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 精选模板 */}
      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="tpls">
        <div className="flex items-end justify-between">
          <div>
            <h2 id="tpls" className="h-display text-3xl">{t.home.tplTitle}</h2>
            <p className="mt-2 text-sm text-coffee">{t.home.tplDesc}</p>
          </div>
          <Link href={lp(locale, "/templates")} className="hidden shrink-0 font-semibold text-coral hover:underline md:block">
            {t.home.browseAll}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} />
          ))}
        </div>
        <Link href={lp(locale, "/templates")} className="mt-6 inline-block font-semibold text-coral hover:underline md:hidden">
          {t.home.browseAll}
        </Link>
      </section>

      {/* 用户作品预览 */}
      <section className="bg-parchment/50 py-14" aria-labelledby="works">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 id="works" className="h-display text-3xl">{t.home.worksTitle}</h2>
              <p className="mt-2 text-sm text-coffee">
                {t.home.worksDesc}
                <Link href={lp(locale, "/gallery")} className="font-semibold text-coral hover:underline">{t.home.worksLink}</Link>
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {works.slice(0, 6).map((w) => (
              <figure key={w.id} className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt={`AI ${w.templateId ?? "studio"} portrait of ${w.petName} the ${w.species}`} width={512} height={683} loading="lazy" className="aspect-[3/4] w-full rounded-card object-cover shadow-soft transition-transform duration-200 group-hover:scale-[1.03]" />
                <figcaption className="mt-2 text-xs text-coffee">{w.petName} · {w.templateId ?? "AI"}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 评价预览 */}
      {!!reviews.length && (
        <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="reviews">
          <h2 id="reviews" className="h-display text-3xl">{t.home.reviewsTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <blockquote key={r.id} className="card p-6">
                <div className="flex gap-0.5 text-gold" aria-label={`${r.rating ?? 5} / 5`}>
                  {Array.from({ length: r.rating ?? 5 }, (_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">“{r.text}”</p>
                <footer className="mt-4 text-sm text-coffee">
                  — {r.nickname}, {r.petName}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* FAQ 预览 */}
      <section className="mx-auto max-w-3xl px-4 py-14" aria-labelledby="faq-preview">
        <h2 id="faq-preview" className="h-display text-center text-3xl">{t.home.faqTitle}</h2>
        <div className="mt-8">
          <FaqAccordion items={t.faq.slice(0, 4)} />
        </div>
        <p className="mt-5 text-center text-sm text-coffee">
          <Link href={lp(locale, "/faq")} className="font-semibold text-coral hover:underline">
            {t.home.faqLink}
          </Link>
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-6">
        <div className="rounded-big bg-coral px-6 py-12 text-center text-white shadow-lift">
          <h2 className="h-display text-3xl">{t.home.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-coral-soft">{t.home.ctaSub}</p>
          <Link href={`${lp(locale, "/")}#create`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
            <PawIcon className="h-5 w-5" /> {t.home.ctaBtn}
          </Link>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: t.faq.slice(0, 4).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
