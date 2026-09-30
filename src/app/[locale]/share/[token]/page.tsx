import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PawIcon, SparkIcon } from "@/components/icons";
import { ShareBar } from "@/components/ShareBar";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { readDb } from "@/lib/store";
import { templateById } from "@/lib/templates";

export const dynamic = "force-dynamic";

async function getShare(token: string) {
  const db = await readDb();
  return db.shares[token];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; token: string }> }): Promise<Metadata> {
  const { locale: raw, token } = await params;
  if (!isLocale(raw)) return pageMeta({ locale: "en", path: `/share/${token}`, title: "Not found", noindex: true });
  const t = getDict(raw as Locale);
  const share = await getShare(token);
  if (!share) return pageMeta({ locale: raw as Locale, path: `/share/${token}`, title: "Not found", noindex: true });
  const tpl = templateById(share.templateId);
  return pageMeta({
    locale: raw as Locale,
    path: `/share/${token}`,
    title: share.message ? `${t.share.made}: “${share.message.slice(0, 60)}”` : "AI pet portrait",
    description: `AI pet portrait${tpl ? ` — ${tpl.name}` : ""}. ${t.share.makeSub}`,
    ogImage: share.image.startsWith("data:") ? undefined : `${SITE_URL}${share.image}?st=${token}`,
    ogImageDims: { w: 1728, h: 2304 },
    noindex: true,
  });
}

export default async function SharePage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale: raw, token } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const share = await getShare(token);
  if (!share) notFound();
  const tpl = templateById(share.templateId);

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <p className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-semibold text-coffee shadow-soft">
        <PawIcon className="h-3.5 w-3.5 text-coral" />
        {t.share.made}
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${share.image}?st=${token}`}
        alt={share.message || "AI-generated pet portrait"}
        className="mx-auto mt-6 w-full max-w-md rounded-big shadow-lift"
      />
      {share.message && <p className="mt-4 text-coffee">“{share.message}”</p>}
      {tpl && (
        <p className="mt-1 text-sm text-fog">
          {t.share.tplLabel}{" "}
          <Link href={lp(locale, `/templates/${tpl.id}`)} className="font-semibold text-coral hover:underline">
            {tpl.name}
          </Link>
        </p>
      )}

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-coffee">{t.share.love}</p>
        <div className="flex justify-center">
          <ShareBar
            url={`${SITE_URL}/share/${token}`}
            imageUrl={`${SITE_URL}${share.image}?st=${token}`}
            fileShareSrc={`${share.image}?st=${token}`}
            text={t.gen.shareText}
          />
        </div>
      </div>

      <div className="mt-8 rounded-big bg-coral px-6 py-8 text-white shadow-lift">
        <h1 className="h-display text-2xl">{t.share.make}</h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-coral-soft">{t.share.makeSub}</p>
        <Link
          href={lp(locale, "/#create")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-coral-deep transition-transform hover:-translate-y-0.5"
        >
          <SparkIcon className="h-4 w-4" /> {t.share.cta}
        </Link>
      </div>
    </div>
  );
}
