import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { getAllPosts } from "@/lib/blog";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/blog",
    title: t.blog.title,
    description: t.blog.sub,
  });
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.nav.blog}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.blog.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.blog.sub}</p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={lp(locale, `/blog/${post.slug}`)}
            className="card group flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-coral/60 hover:shadow-lift"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" width={512} height={340} loading="lazy" className="aspect-[3/2] w-full border-b border-sand/60 object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-xs text-fog">
                <time dateTime={post.date}>{post.date}</time>
                <span aria-hidden="true">·</span>
                <span>{t.blog.readTime.replace("{n}", String(post.readingTime))}</span>
              </div>
              <h2 className="mt-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-coral">{post.title}</h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-coffee">{post.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
                Read post
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
