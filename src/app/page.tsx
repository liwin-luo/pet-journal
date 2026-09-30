import { Suspense } from "react";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Generator } from "@/components/Generator";
import { JsonLd } from "@/components/JsonLd";
import { PawIcon, SparkIcon, StarIcon, UploadIcon } from "@/components/icons";
import { TemplateCard } from "@/components/TemplateCard";
import { FAQS } from "@/lib/faq";
import { getAllGallery, splitWorksReviews } from "@/lib/gallery";
import { pageMeta } from "@/lib/seo";
import { TEMPLATES, tplImg } from "@/lib/templates";

export const metadata = pageMeta({
  description:
    "Upload one photo of your pet, type what you want, and get an AI portrait that still looks like them. 100 free templates — renaissance, holiday cards, movie posters and more.",
  ogImage: "/og.jpg",
});

export default async function Home() {
  const featured = TEMPLATES.filter((t) =>
    ["royal", "xmas", "poster", "pixar", "sticker", "neon", "polaroid", "astronaut"].includes(t.id),
  );
  const { works, reviews } = splitWorksReviews(await getAllGallery());

  return (
    <>
      {/* Hero + 生成器 */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 text-center md:pt-16">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-semibold text-coffee shadow-soft">
          <SparkIcon className="h-3.5 w-3.5 text-coral" />
          AI pet studio · 100 templates · free to try
        </p>
        <h1 className="h-display mx-auto mt-5 max-w-3xl text-4xl leading-tight md:text-6xl">
          Turn your pet into <span className="text-coral">any picture</span> you can imagine
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-coffee md:text-lg">
          Say what you want, attach one photo, and get a portrait that still looks like <em>them</em> — ready to
          share, print or gift. About 30 seconds, no account needed.
        </p>

        <div className="mx-auto mt-8 max-w-2xl text-left">
          <Suspense fallback={<div className="card h-72 animate-pulse !rounded-big" />}>
            <Generator featured={featured} />
          </Suspense>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-fog">
            <li>✓ Free daily pictures</li>
            <li>✓ Photos auto-deleted in 7 days</li>
            <li>✓ Every image labeled AI-generated</li>
          </ul>
        </div>

        {/* 前后对比 */}
        <div className="mx-auto mt-12 flex max-w-2xl items-center justify-center gap-3 md:gap-6">
          <figure className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/land/before.jpg" alt="A regular phone photo of a pet" width={400} height={300} className="aspect-[4/3] w-full rounded-card object-cover shadow-soft" />
            <figcaption className="mt-2 text-xs text-coffee">One phone photo</figcaption>
          </figure>
          <span aria-hidden="true" className="text-2xl text-coral">→</span>
          <figure className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/land/after.jpg" alt="An AI-generated royal portrait of the same pet" width={400} height={300} className="aspect-[4/3] w-full rounded-card object-cover shadow-soft" />
            <figcaption className="mt-2 text-xs text-coffee">A portrait that&apos;s still them</figcaption>
          </figure>
        </div>
      </section>

      {/* 三步走 */}
      <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="how">
        <h2 id="how" className="h-display text-center text-3xl">How it works</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { icon: <UploadIcon className="h-6 w-6" />, t: "Upload a photo", d: "One clear face-on photo is enough. Add up to four for better fur and eye detail." },
            { icon: <PawIcon className="h-6 w-6" />, t: "Say what you want", d: "“My cat as a knight”, “birthday card for my pug” — or copy any template prompt and edit it." },
            { icon: <SparkIcon className="h-6 w-6" />, t: "Get your picture", d: "In ~30 seconds you have a portrait to download, regenerate, or post to the gallery." },
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
            <h2 id="tpls" className="h-display text-3xl">Start from a template</h2>
            <p className="mt-2 text-sm text-coffee">100 ready-made styles — copy the prompt as-is or add your twist.</p>
          </div>
          <Link href="/templates" className="hidden shrink-0 font-semibold text-coral hover:underline md:block">
            Browse all 100 →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((t) => (
            <TemplateCard key={t.id} tpl={t} />
          ))}
        </div>
        <Link href="/templates" className="mt-6 inline-block font-semibold text-coral hover:underline md:hidden">
          Browse all 100 templates →
        </Link>
      </section>

      {/* 用户作品预览 */}
      <section className="bg-parchment/50 py-14" aria-labelledby="works">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 id="works" className="h-display text-3xl">Made by pet people</h2>
              <p className="mt-2 text-sm text-coffee">Real pictures from the studio. <Link href="/gallery" className="font-semibold text-coral hover:underline">See the full gallery →</Link></p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {works.slice(0, 6).map((w) => (
              <figure key={w.id} className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt={`AI ${w.templateId ?? "studio"} portrait of ${w.petName} the ${w.species}`} width={512} height={683} loading="lazy" className="aspect-[3/4] w-full rounded-card object-cover shadow-soft transition-transform duration-200 group-hover:scale-[1.03]" />
                <figcaption className="mt-2 text-xs text-coffee">{w.petName} · {w.templateId ?? "custom"}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 评价预览 */}
      {!!reviews.length && (
        <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="reviews">
          <h2 id="reviews" className="h-display text-3xl">Happy humans, happy tails</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <blockquote key={r.id} className="card p-6">
                <div className="flex gap-0.5 text-gold" aria-label={`${r.rating ?? 5} out of 5 stars`}>
                  {Array.from({ length: r.rating ?? 5 }, (_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink">“{r.text}”</p>
                <footer className="mt-4 text-sm text-coffee">
                  — {r.nickname}, {r.petName}&apos;s human
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* FAQ 预览 */}
      <section className="mx-auto max-w-3xl px-4 py-14" aria-labelledby="faq-preview">
        <h2 id="faq-preview" className="h-display text-center text-3xl">Questions, answered</h2>
        <div className="mt-8">
          <FaqAccordion items={FAQS.slice(0, 4)} />
        </div>
        <p className="mt-5 text-center text-sm text-coffee">
          <Link href="/faq" className="font-semibold text-coral hover:underline">
            Read all questions →
          </Link>
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-6">
        <div className="rounded-big bg-coral px-6 py-12 text-center text-white shadow-lift">
          <h2 className="h-display text-3xl">Make yours in 30 seconds</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-coral-soft">
            One photo, one sentence. Your pet&apos;s next favorite picture is a click away.
          </p>
          <Link href="/#create" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
            <PawIcon className="h-5 w-5" /> Create my pet portrait
          </Link>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.slice(0, 4).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </>
  );
}
