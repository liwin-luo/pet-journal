import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LikeButton } from "@/components/LikeButton";
import { PawIcon, StarIcon } from "@/components/icons";
import { WorkShareButton } from "@/components/WorkShareButton";
import { getGalleryWithLikes } from "@/lib/gallery";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { templateById } from "@/lib/templates";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/gallery",
    title: t.meta.galleryTitle,
    description: t.meta.galleryDesc,
    ogImage: "/land/cat-suit.jpg",
  });
}

const SPECIES_KEYS = ["all", "cat", "dog", "bird", "fish", "rabbit", "other"] as const;

export default async function GalleryPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ species?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const { species } = await searchParams;
  const all = await getGalleryWithLikes();
  const filter = species && SPECIES_KEYS.includes(species as never) ? species : "all";
  const works = (filter === "all" ? all : all.filter((g) => g.species === filter)).filter((g) => !g.text);
  const reviews = all.filter((g) => g.text);
  const speciesLabel = (key: string) => (key === "all" ? t.gal.speciesAll : (t.gal[key as keyof typeof t.gal] as string));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">{t.gal.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-coffee">
          {t.gal.desc}{" "}
          <Link href={`${lp(locale, "/")}#create`} className="font-semibold text-coral hover:underline">
            {t.gal.createPost}
          </Link>
          .
        </p>
      </header>

      {/* 物种筛选 */}
      <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Filter by pet type">
        {SPECIES_KEYS.map((s) => (
          <Link
            key={s}
            href={s === "all" ? lp(locale, "/gallery") : `${lp(locale, "/gallery")}?species=${s}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === s ? "bg-coral text-white" : "border border-sand bg-white text-coffee hover:border-coral hover:text-coral"
            }`}
          >
            {speciesLabel(s)}
          </Link>
        ))}
      </nav>

      {/* 作品墙 */}
      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>figure]:mb-4">
        {works.map((w) => {
          const tpl = templateById(w.templateId);
          return (
            <figure key={w.id} className="group relative break-inside-avoid">
              <Link href={lp(locale, `/gallery/${w.id}`)} aria-label={`${w.petName} — ${tpl?.name ?? ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.image}
                  alt={`AI ${tpl?.name ?? "studio"} portrait of ${w.petName} the ${w.species}`}
                  width={512}
                  height={683}
                  loading="lazy"
                  className="w-full rounded-card object-cover shadow-soft transition-shadow group-hover:shadow-lift"
                />
              </Link>
              <figcaption className="mt-2">
                <div className="flex items-center gap-1.5 text-xs text-coffee">
                  <PawIcon className="h-3.5 w-3.5 text-coral" />
                  <span className="font-semibold">{w.petName}</span>
                  <span className="text-fog">·</span>
                  <Link href={tpl ? lp(locale, `/templates/${tpl.id}`) : lp(locale, "/templates")} className="hover:text-coral">
                    {tpl?.name ?? t.gal.custom}
                  </Link>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <LikeButton id={w.id} count={w.likeCount} liked={w.liked} label={t.gal.likeBtn} />
                  <WorkShareButton path={lp(locale, `/gallery/${w.id}`)} title={`${w.petName} — ${tpl?.name ?? "AI"}`} label={t.gal.shareBtn} />
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {!works.length && (
        <p className="mt-10 text-center text-coffee">{t.gal.noWorks.replace("{species}", speciesLabel(filter))}</p>
      )}

      {/* 评价 */}
      <section className="mt-16" aria-labelledby="reviews">
        <h2 id="reviews" className="h-display text-3xl">{t.gal.reviewsTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={r.id} className="card p-6">
              <div className="flex gap-0.5 text-gold" aria-label={`${r.rating ?? 5} / 5`}>
                {Array.from({ length: r.rating ?? 5 }, (_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed">“{r.text}”</p>
              <footer className="mt-4 flex items-center gap-3 text-sm text-coffee">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral-soft text-coral">
                  <PawIcon className="h-4 w-4" />
                </span>
                <span>
                  <strong className="text-ink">{r.nickname}</strong>
                  {r.image && (
                    <>
                      {" · "}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image} alt={`Portrait of ${r.petName}`} className="inline-block h-6 w-6 rounded object-cover align-middle" loading="lazy" />
                    </>
                  )}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
        {!reviews.length && (
          <p className="mt-6 text-sm text-coffee">
            {t.gal.noReviewsPre}
            <Link href={`${lp(locale, "/")}#create`} className="font-semibold text-coral hover:underline">{t.gal.noReviewsLink}</Link>
            {t.gal.noReviewsPost}
          </p>
        )}
      </section>

      {/* CTA */}
      <div className="mt-16 rounded-big bg-coral px-6 py-12 text-center text-white shadow-lift">
        <h2 className="h-display text-3xl">{t.gal.ctaTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-coral-soft">{t.gal.ctaSub}</p>
        <Link href={lp(locale, "/#create")} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
          <PawIcon className="h-5 w-5" /> {t.gal.ctaBtn}
        </Link>
      </div>

      <JsonLd
        data={reviews
          .filter((r) => !r.seed)
          .slice(0, 10)
          .map((r) => ({
            "@context": "https://schema.org",
            "@type": "Review",
            itemReviewed: { "@type": "WebApplication", name: "PetsDaily" },
            reviewRating: { "@type": "Rating", ratingValue: r.rating ?? 5, bestRating: 5 },
            author: { "@type": "Person", name: r.nickname },
            reviewBody: r.text,
          }))}
      />
    </div>
  );
}
