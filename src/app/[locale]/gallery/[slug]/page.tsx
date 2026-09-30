import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LikeButton } from "@/components/LikeButton";
import { ShareBar } from "@/components/ShareBar";
import { PawIcon, StarIcon } from "@/components/icons";
import { getGalleryWithLikes, resolveWork, workPath } from "@/lib/gallery";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { templateById } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const t = getDict(locale);
  const all = await getGalleryWithLikes();
  const found = resolveWork(all, slug);
  if (!found) return pageMeta({ locale, path: `/gallery/${slug}`, title: "Not found", noindex: true });
  const { work: entry, canonical, needsRedirect } = found;
  const tpl = templateById(entry.templateId);
  const title = t.gal.detailTitle.replace("{pet}", entry.petName).replace("{tpl}", tpl?.name ?? "");
  return pageMeta({
    locale,
    // 非规范 slug（旧 /gallery/seed-5 等）也渲染，canonical 统一指向规范 URL
    path: needsRedirect ? `/gallery/${canonical}` : `/gallery/${slug}`,
    title,
    description: entry.text ?? `${tpl?.name ?? t.gal.custom} · ${t.gal.desc}`,
    ogImage: entry.image.startsWith("data:") ? undefined : entry.image,
  });
}

export default async function WorkDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const all = await getGalleryWithLikes();
  const found = resolveWork(all, slug);
  if (!found) notFound();
  const { work: w, needsRedirect } = found;
  // 旧 ID 链接（/gallery/seed-5、/gallery/<uuid>）永久重定向到 SEO slug
  if (needsRedirect) permanentRedirect(lp(locale, workPath(w)));
  const tpl = templateById(w.templateId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-coffee" aria-label="Breadcrumb">
        <Link href={lp(locale, "/gallery")} className="hover:text-coral">← {t.gal.backTo}</Link>
      </nav>

      <header className="mt-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-semibold text-coffee shadow-soft">
          <PawIcon className="h-3.5 w-3.5 text-coral" />
          {t.share.made}
        </p>
        <h1 className="h-display mt-4 text-3xl md:text-4xl">{w.petName}</h1>
        <p className="mt-2 text-sm text-coffee">
          {t.gal.by.replace("{nickname}", w.nickname)} ·{" "}
          <Link href={tpl ? lp(locale, `/templates/${tpl.id}`) : lp(locale, "/templates")} className="font-semibold text-coral hover:underline">
            {tpl?.name ?? t.gal.custom}
          </Link>
          {w.species && <span className="text-fog"> · {w.species}</span>}
        </p>
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/wm/gallery/${w.id}`}
        alt={`AI ${tpl?.name ?? "studio"} portrait of ${w.petName} the ${w.species}`}
        className="mx-auto mt-6 w-full rounded-big shadow-lift"
      />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`/api/wm/gallery/${w.id}`}
          download={`petsdaily-${(w.petName || "pet").replace(/[^\w-]+/g, "-").toLowerCase()}.jpg`}
          className="btn-ghost !py-2 text-sm"
        >
          {t.gal.download} ↓
        </a>
        <LikeButton id={w.id} count={w.likeCount} liked={w.liked} label={t.gal.likeBtn} />
        <ShareBar
          url={`${SITE_URL}${lp(locale, workPath(w))}`}
          imageUrl={w.image.startsWith("data:") ? undefined : `${SITE_URL}${w.image}`}
          fileShareSrc={w.image}
          text={t.gen.shareText}
        />
      </div>

      {w.text && (
        <section className="mt-10" aria-labelledby="story">
          <h2 id="story" className="h-display text-center text-2xl">{t.gal.storyTitle}</h2>
          <blockquote className="card mx-auto mt-4 max-w-xl p-6">
            <div className="flex justify-center gap-0.5 text-gold" aria-label={`${w.rating ?? 5} / 5`}>
              {Array.from({ length: w.rating ?? 5 }, (_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <p className="mt-3 text-center text-sm leading-relaxed">“{w.text}”</p>
            <footer className="mt-4 text-center text-sm text-coffee">
              — {w.nickname}, {w.petName}
            </footer>
          </blockquote>
        </section>
      )}

      <div className="mt-12 rounded-big bg-coral px-6 py-10 text-center text-white shadow-lift">
        <h2 className="h-display text-2xl">{t.gal.ctaTitle}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-coral-soft">{t.gal.ctaSub}</p>
        <Link href={lp(locale, "/#create")} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
          <PawIcon className="h-5 w-5" /> {t.gal.ctaBtn}
        </Link>
      </div>
    </div>
  );
}
