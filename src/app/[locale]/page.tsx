import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Generator } from "@/components/Generator";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, CheckCircleIcon, PawIcon, SparkIcon, StarIcon, UploadIcon } from "@/components/icons";
import { TemplateCard } from "@/components/TemplateCard";
import { ToolCard } from "@/components/ToolCard";
import { getSessionUser } from "@/lib/auth";
import { getAllGallery, splitWorksReviews } from "@/lib/gallery";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { CREDIT_PACKS, PRO_MONTHLY, formatPrice } from "@/lib/plans";
import { pageMeta } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";
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

function MarqueeRow({ ids, duration, reverse }: { ids: string[]; duration: string; reverse?: boolean }) {
  const doubled = [...ids, ...ids];
  return (
    <div className="overflow-hidden" style={{ ["--marquee-duration" as string]: duration }}>
      <div className={`marquee ${reverse ? "marquee-reverse" : ""}`}>
        {doubled.map((id, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${id}-${i}`}
            src={`/tpl/${id}.jpg`}
            alt=""
            width={160}
            height={200}
            loading="lazy"
            aria-hidden={i >= ids.length}
            className="h-40 w-32 shrink-0 rounded-2xl border border-sand/50 object-cover shadow-soft md:h-48 md:w-40"
          />
        ))}
      </div>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const featured = TEMPLATES.filter((tpl) =>
    ["royal", "xmas", "poster", "pixar", "sticker", "neon", "polaroid", "astronaut"].includes(tpl.id),
  );
  const marqueeA = TEMPLATES.slice(0, 12).map((tpl) => tpl.id);
  const marqueeB = TEMPLATES.slice(12, 24).map((tpl) => tpl.id);
  const { works, reviews } = splitWorksReviews(await getAllGallery());
  const user = await getSessionUser().catch(() => null);

  const toolBadgeText = { free: t.tools.freeBadge, new: t.tools.newBadge, hot: t.tools.hotBadge } as const;

  return (
    <>
      {/* Hero + 生成器 */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center md:pt-16">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-sand bg-surface px-4 py-1.5 text-xs font-semibold text-coffee shadow-soft">
          <SparkIcon className="h-3.5 w-3.5 text-coral" />
          {t.home.badge}
        </p>
        <h1 className="headline-retro h-display mx-auto mt-6 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          {t.home.heroPre}
          <span className="text-coral">{t.home.heroHl}</span>
          {t.home.heroPost}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-coffee md:text-lg">{t.home.sub}</p>

        <div className="mx-auto mt-9 max-w-2xl text-left">
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
      </section>

      {/* 模板图墙 marquee（Skillry 式首屏视觉锚点） */}
      <section className="marquee-hover relative py-8" aria-label={t.home.marqueeCap}>
        <MarqueeRow ids={marqueeA} duration="70s" />
        <div className="mt-4">
          <MarqueeRow ids={marqueeB} duration="85s" reverse />
        </div>
        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-fog">{t.home.marqueeCap}</p>
      </section>

      {/* 前后对比 */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 md:gap-6">
          <figure className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/land/cat.jpg" alt={t.home.beforeCap} width={400} height={300} className="aspect-[4/3] w-full rounded-card border border-sand/60 object-cover shadow-soft" />
            <figcaption className="mt-2 text-xs text-coffee">{t.home.beforeCap}</figcaption>
          </figure>
          <span aria-hidden="true" className="text-2xl text-coral">→</span>
          <figure className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/land/royal-cat.jpg" alt={t.home.afterCap} width={400} height={300} className="aspect-[4/3] w-full rounded-card border border-sand/60 object-cover shadow-soft" />
            <figcaption className="mt-2 text-xs text-coffee">{t.home.afterCap}</figcaption>
          </figure>
        </div>
      </section>

      {/* 免费工具矩阵 */}
      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="tools">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.home.toolsEyebrow}</p>
          <h2 id="tools" className="h-display mt-3 text-3xl md:text-4xl">{t.home.toolsTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-coffee">{t.home.toolsDesc}</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              href={lp(locale, tool.href)}
              color={tool.color}
              emoji={tool.emoji}
              title={t.tools[`${tool.id}T` as keyof typeof t.tools] as string}
              desc={t.tools[`${tool.id}D` as keyof typeof t.tools] as string}
              badge={tool.badge}
              badgeText={tool.badge ? toolBadgeText[tool.badge] : ""}
              openLabel={t.tools.openTool}
            />
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href={lp(locale, "/tools")} className="inline-flex items-center gap-1.5 font-semibold text-coral hover:underline">
            {t.home.toolsAll.replace("→", "")}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </p>
      </section>

      {/* 精选模板（横向滚动行） */}
      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="tpls">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="tpls" className="h-display text-3xl">{t.home.tplTitle}</h2>
            <p className="mt-2 text-sm text-coffee">{t.home.tplDesc}</p>
          </div>
          <Link href={lp(locale, "/templates")} className="hidden shrink-0 font-semibold text-coral hover:underline md:block">
            {t.home.browseAll}
          </Link>
        </div>
        <div className="hscroll no-scrollbar mt-8">
          {featured.map((tpl) => (
            <div key={tpl.id} className="w-44 shrink-0 sm:w-52">
              <TemplateCard tpl={tpl} />
            </div>
          ))}
        </div>
        <Link href={lp(locale, "/templates")} className="mt-6 inline-block font-semibold text-coral hover:underline md:hidden">
          {t.home.browseAll}
        </Link>
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

      {/* 用户作品预览 */}
      <section className="bg-parchment/50 py-14" aria-labelledby="works">
        <div className="mx-auto max-w-6xl px-4">
          <h2 id="works" className="h-display text-3xl">{t.home.worksTitle}</h2>
          <p className="mt-2 text-sm text-coffee">
            {t.home.worksDesc}
            <Link href={lp(locale, "/gallery")} className="font-semibold text-coral hover:underline">{t.home.worksLink}</Link>
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {works.slice(0, 6).map((w) => (
              <figure key={w.id} className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt={`AI ${w.templateId ?? "studio"} portrait of ${w.petName} the ${w.species}`} width={512} height={683} loading="lazy" className="aspect-[3/4] w-full rounded-card border border-sand/50 object-cover shadow-soft transition-transform duration-200 group-hover:scale-[1.03]" />
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

      {/* 定价预告（三档迷你卡） */}
      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="pricing-teaser">
        <div className="text-center">
          <h2 id="pricing-teaser" className="h-display text-3xl md:text-4xl">{t.home.priceT}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-coffee">{t.home.priceD}</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
          <div className="card p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-fog">{t.pricing.freeName}</p>
            <p className="mt-2 font-display text-3xl font-black">{t.pricing.freePrice}<span className="ml-1 text-xs font-semibold text-fog">{t.pricing.freePer}</span></p>
            <ul className="mt-4 space-y-2 text-sm text-coffee">
              {t.pricing.freeFeat.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{f}</li>
              ))}
            </ul>
          </div>
          <div className="card relative border-coral/60 p-6 shadow-lift">
            <span className="pill-badge absolute -top-3 left-1/2 -translate-x-1/2 bg-lemon text-lemon-ink">{t.pricing.proBadge}</span>
            <p className="text-sm font-semibold uppercase tracking-wide text-coral">{t.pricing.proName}</p>
            <p className="mt-2 font-display text-3xl font-black">{formatPrice(PRO_MONTHLY)}<span className="ml-1 text-xs font-semibold text-fog">{t.pricing.perMonth}</span></p>
            <ul className="mt-4 space-y-2 text-sm text-coffee">
              {t.pricing.proFeat.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{f}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-fog">{t.pricing.creditsName}</p>
            <p className="mt-2 font-display text-3xl font-black">{formatPrice(CREDIT_PACKS[1].price)}<span className="ml-1 text-xs font-semibold text-fog">/ {CREDIT_PACKS[1].credits} {t.pricing.creditUnit}</span></p>
            <ul className="mt-4 space-y-2 text-sm text-coffee">
              {t.pricing.packsFeat.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{f}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-7 text-center">
          <Link href={lp(locale, "/pricing")} className="btn-ghost">
            {t.home.priceBtn} <ArrowIcon className="h-4 w-4" />
          </Link>
        </p>
      </section>

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
