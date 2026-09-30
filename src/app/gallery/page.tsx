import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PawIcon, StarIcon } from "@/components/icons";
import { getAllGallery } from "@/lib/gallery";
import { pageMeta } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { templateById } from "@/lib/templates";

export const metadata: Metadata = pageMeta({
  title: "Gallery — AI pet portraits & reviews from pet people",
  description:
    "See real AI pet portraits made with our studio: cats, dogs, birds and fish as renaissance royals, astronauts, movie stars and more — plus honest reviews from the humans behind them.",
  path: "/gallery",
  ogImage: "/land/cat-suit.jpg",
});

const SPECIES = ["all", "cat", "dog", "bird", "fish", "rabbit", "other"];

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ species?: string }> }) {
  const { species } = await searchParams;
  const all = await getAllGallery();
  const filter = species && SPECIES.includes(species) ? species : "all";
  const works = (filter === "all" ? all : all.filter((g) => g.species === filter)).filter((g) => !g.text);
  const reviews = all.filter((g) => g.text);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="h-display text-4xl">Made in the studio</h1>
        <p className="mx-auto mt-3 max-w-2xl text-coffee">
          Every picture here started as one phone photo and one sentence. All images are AI-generated — and made by
          people who love their pets. Want yours here?{" "}
          <Link href="/#create" className="font-semibold text-coral hover:underline">
            Create &amp; post it
          </Link>
          .
        </p>
      </header>

      {/* 物种筛选 */}
      <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Filter by pet type">
        {SPECIES.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/gallery" : `/gallery?species=${s}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              filter === s ? "bg-coral text-white" : "border border-sand bg-white text-coffee hover:border-coral hover:text-coral"
            }`}
          >
            {s === "all" ? "All pets" : `${s}s`}
          </Link>
        ))}
      </nav>

      {/* 作品墙 */}
      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>figure]:mb-4">
        {works.map((w) => {
          const tpl = templateById(w.templateId);
          return (
            <figure key={w.id} className="group relative break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.image}
                alt={`AI ${tpl?.name ?? "studio"} portrait of ${w.petName} the ${w.species}`}
                width={512}
                height={683}
                loading="lazy"
                className="w-full rounded-card object-cover shadow-soft transition-shadow group-hover:shadow-lift"
              />
              <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-coffee">
                <PawIcon className="h-3.5 w-3.5 text-coral" />
                <span className="font-semibold">{w.petName}</span>
                <span className="text-fog">·</span>
                <Link href={tpl ? `/templates/${tpl.id}` : "/templates"} className="hover:text-coral">
                  {tpl?.name ?? "custom"}
                </Link>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {!works.length && <p className="mt-10 text-center text-coffee">No {filter}s in the gallery yet — be the first!</p>}

      {/* 评价 */}
      <section className="mt-16" aria-labelledby="reviews">
        <h2 id="reviews" className="h-display text-3xl">What pet people say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={r.id} className="card p-6">
              <div className="flex gap-0.5 text-gold" aria-label={`${r.rating ?? 5} out of 5 stars`}>
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
                  <strong className="text-ink">{r.nickname}</strong> · {r.petName}&apos;s human
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
            No reviews yet — <Link href="/#create" className="font-semibold text-coral hover:underline">make a picture</Link> and tell us how it went.
          </p>
        )}
      </section>

      {/* CTA */}
      <div className="mt-16 rounded-big bg-coral px-6 py-12 text-center text-white shadow-lift">
        <h2 className="h-display text-3xl">Your pet belongs here</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-coral-soft">Free to try, no account, ~30 seconds per picture.</p>
        <Link href="/#create" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
          <PawIcon className="h-5 w-5" /> Create my pet portrait
        </Link>
      </div>

      {/* 结构化数据只包含真实用户投稿（seed 示例评价不进 Review 标记，避免误导搜索引擎） */}
      <JsonLd
        data={reviews
          .filter((r) => !r.seed)
          .slice(0, 10)
          .map((r) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: { "@type": "WebApplication", name: SITE_NAME },
          reviewRating: { "@type": "Rating", ratingValue: r.rating ?? 5, bestRating: 5 },
          author: { "@type": "Person", name: r.nickname },
          reviewBody: r.text,
        }))}
      />
    </div>
  );
}
