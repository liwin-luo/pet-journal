import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { getAllHelpDocs } from "@/lib/help";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/help",
    title: t.help.title,
    description: t.help.sub,
  });
}

export default async function HelpHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const docs = getAllHelpDocs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">{t.nav.tools}</p>
        <h1 className="headline-retro h-display mx-auto mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{t.help.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-coffee">{t.help.sub}</p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={lp(locale, `/help/${doc.slug}`)}
            className="card group flex flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-coral/60 hover:shadow-lift"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-fog">{t.blog.readTime.replace("{n}", String(Math.max(2, Math.round(doc.html.split(/\s+/).length / 400))))} · {doc.date}</p>
            <h2 className="mt-2 font-display text-lg font-bold leading-snug transition-colors group-hover:text-coral">{doc.title}</h2>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-coffee">{doc.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
              Read guide
              <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
