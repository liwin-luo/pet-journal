import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { getSessionUser } from "@/lib/auth";
import { listHistory } from "@/lib/history";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { getQuota, getSubjectId } from "@/lib/ratelimit";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({ locale: raw as Locale, path: "/account", title: t.acct.title, noindex: true });
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect(lp(locale, "/login?next=/account"));

  const quota = await getQuota(await getSubjectId());
  const deviceId = (await import("@/lib/ratelimit")).getDeviceId;
  const history = await listHistory({ email: user.email, deviceId: await deviceId() });
  const pct = Math.min(100, Math.round((quota.used / Math.max(1, quota.limit)) * 100));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="h-display text-4xl">{t.acct.title}</h1>

      {/* 个人资料 */}
      <section className="mt-8 card p-6" aria-labelledby="acct-profile">
        <h2 id="acct-profile" className="text-xs font-semibold uppercase tracking-wide text-fog">{t.acct.profile}</h2>
        <div className="mt-4 flex items-center gap-4">
          {user.picture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.picture} alt="" className="h-14 w-14 rounded-full border border-sand" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-lg font-bold text-sage">
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-lg font-semibold">{user.name || user.email}</span>
            <span className="block truncate text-sm text-coffee">{user.email}</span>
          </span>
          <span className="ml-auto"><SignOutButton texts={t.signout} /></span>
        </div>
      </section>

      {/* 今日额度 */}
      <section className="mt-6 card p-6" aria-labelledby="acct-quota">
        <h2 id="acct-quota" className="text-xs font-semibold uppercase tracking-wide text-fog">{t.acct.quotaTitle}</h2>
        <p className="mt-3 font-display text-3xl font-semibold">
          {quota.used} <span className="text-base font-normal text-fog">/ {quota.limit}</span>
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sand">
          <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-coffee">{t.acct.quotaLeft.replace("{left}", String(quota.left))}</p>
        <p className="mt-1 text-xs text-fog">{t.acct.resetsAt.replace("{time}", "00:00 UTC")}</p>
      </section>

      {/* 我的作品 */}
      <section className="mt-6 card p-6" aria-labelledby="acct-pics">
        <div className="flex items-center justify-between">
          <h2 id="acct-pics" className="text-xs font-semibold uppercase tracking-wide text-fog">{t.acct.myPictures}</h2>
          <Link href={`${lp(locale, "/")}#create`} className="text-xs font-semibold text-coral hover:underline">+ {t.nav.create}</Link>
        </div>
        {history.length ? (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {history.map((h) => (
              <Link key={h.token} href={lp(locale, `/share/${h.token}`)} className="group block" title={h.message || h.templateId || ""}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.imagePath} alt={h.message || "Generated pet picture"} className="aspect-[3/4] w-full rounded-lg border border-sand object-cover transition-transform group-hover:scale-[1.03]" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-coffee">
            {t.gal.noReviewsPre}
            <Link href={`${lp(locale, "/")}#create`} className="font-semibold text-coral hover:underline">{t.gal.noReviewsLink}</Link>
            {t.gal.noReviewsPost}
          </p>
        )}
      </section>

      {/* 套餐（预留） */}
      <section className="mt-6 card p-6" aria-labelledby="acct-plans">
        <div className="flex items-center justify-between">
          <h2 id="acct-plans" className="text-xs font-semibold uppercase tracking-wide text-fog">{t.acct.plans}</h2>
          <span className="rounded-full bg-sage-soft px-2.5 py-1 text-[10px] font-semibold text-sage">{t.acct.plansSoon}</span>
        </div>
        <div className="mt-4 grid gap-3 opacity-60 sm:grid-cols-3">
          {["Free", "Plus", "Studio"].map((p, i) => (
            <div key={p} className="rounded-xl border border-sand/70 bg-parchment/40 p-4">
              <p className="font-display font-semibold">{p}</p>
              <p className="mt-1 text-xs text-fog">{[t.acct.quotaTitle, t.acct.plansSoon, t.acct.plansSoon][i]}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-coffee">
        <Link href={`${lp(locale, "/")}#create`} className="font-semibold text-coral hover:underline">← {t.acct.back}</Link>
      </p>
    </div>
  );
}
