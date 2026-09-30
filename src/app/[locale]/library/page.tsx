import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { PawIcon, SparkIcon } from "@/components/icons";
import { getSessionUser } from "@/lib/auth";
import { listHistory } from "@/lib/history";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { getQuota, getSubjectId } from "@/lib/ratelimit";
import { pageMeta } from "@/lib/seo";
import { templateById } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({ locale: raw as Locale, path: "/library", title: t.lib.title, noindex: true });
}

/** 个人作品库：按设备/账号列出历史生成记录（私人页，noindex）。 */
export default async function LibraryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const user = await getSessionUser().catch(() => null);
  const jar = await cookies().catch(() => null);
  const deviceId = jar?.get("paw_device")?.value ?? null;
  const items = await listHistory({ email: user?.email ?? null, deviceId });
  const quota = await getQuota(await getSubjectId());

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-display text-4xl">{t.lib.title}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-coffee">
            <SparkIcon className="h-4 w-4 text-coral" />
            {t.home.freeCount.replace("3", String(quota.limit))} · {t.acct.quotaLeft.replace("{left}", String(quota.left))}
          </p>
        </div>
        <Link href={`${lp(locale, "/")}#create`} className="btn-primary !px-5 !py-2.5 text-sm">
          {t.nav.create}
        </Link>
      </div>

      {items.length ? (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((h) => {
            const tpl = h.templateId ? templateById(h.templateId) : undefined;
            return (
              <Link key={h.token} href={lp(locale, `/share/${h.token}`)} className="group card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.imagePath} alt={h.message || "Generated pet picture"} width={512} height={683} loading="lazy" className="aspect-[3/4] w-full object-cover" />
                <div className="p-3">
                  <p className="truncate text-xs font-semibold text-coffee">{h.message || (tpl?.name ?? t.gal.custom)}</p>
                  <p className="mt-0.5 text-[11px] text-fog">
                    {tpl?.name ?? t.gal.custom} · {new Date(h.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 card p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-soft text-coral">
            <PawIcon className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm text-coffee">{t.lib.empty}</p>
          <Link href={`${lp(locale, "/")}#create`} className="btn-primary mt-5">{t.nav.create}</Link>
        </div>
      )}
    </div>
  );
}
