import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons";
import { getAllPosts, getPost, localizePostHtml } from "@/lib/blog";
import { DEFAULT_LOCALE, getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const post = getPost(slug);
  if (!post) return {};
  return pageMeta({
    locale: raw as Locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.description,
    ogImage: post.cover,
    ogImageAlt: post.title,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const html = localizePostHtml(post.html, locale === DEFAULT_LOCALE ? "" : `/${locale}`);
  const others = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {/* 文头 */}
      <header>
        <Link href={lp(locale, "/blog")} className="text-sm font-semibold text-coral hover:underline">
          ← {t.blog.back}
        </Link>
        <h1 className="headline-retro h-display mt-4 text-4xl leading-tight md:text-5xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fog">
          <time dateTime={post.date}>{post.date}</time>
          <span aria-hidden="true">·</span>
          <span>{t.blog.readTime.replace("{n}", String(post.readingTime))}</span>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-sand bg-surface px-2.5 py-0.5 text-xs font-medium text-coffee">{tag}</span>
          ))}
        </div>
      </header>

      {/* 封面 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.cover} alt={post.title} width={1024} height={683} className="mt-8 aspect-[3/2] w-full rounded-big border border-sand/60 object-cover shadow-lift" />

      {/* 正文 */}
      <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: html }} />

      {/* 文末 CTA（每篇的终点都是产品） */}
      <div className="mt-14 rounded-big bg-coral px-6 py-10 text-center text-white shadow-lift">
        <p className="h-display text-2xl md:text-3xl">{post.ctaLabel}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-coral-soft">Free to try · 3 pictures a day · no account to start</p>
        <Link href={lp(locale, post.ctaHref)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5">
          {post.ctaLabel} <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* 相关文章 */}
      {others.length > 0 && (
        <section className="mt-14" aria-label="Related posts">
          <h2 className="h-display text-2xl">Keep reading</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} href={lp(locale, `/blog/${p.slug}`)} className="card group p-4 transition-all duration-200 hover:-translate-y-1 hover:border-coral/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt="" width={400} height={260} loading="lazy" className="aspect-[3/2] w-full rounded-xl border border-sand/60 object-cover" />
                <p className="mt-3 text-sm font-semibold leading-snug transition-colors group-hover:text-coral">{p.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          image: `${SITE_URL}${post.cover}`,
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
          mainEntityOfPage: `${SITE_URL}${lp(locale, `/blog/${slug}`)}`,
        }}
      />
    </article>
  );
}
