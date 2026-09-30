import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authEnabled, demoEnabled, getSessionUser } from "@/lib/auth";
import { PawIcon } from "@/components/icons";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({
    locale: raw as Locale,
    path: "/login",
    title: t.login.title,
    description: t.login.sub,
    noindex: true,
  });
}

export default async function LoginPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const { next, error } = await searchParams;
  const user = await getSessionUser().catch(() => null);
  const googleOn = authEnabled();
  const demoOn = demoEnabled();
  const safeNext = next && next.startsWith("/") ? next : "/";

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="h-display text-3xl">{t.login.signedTitle}</h1>
        <p className="mt-2 text-coffee">{t.login.signedBody.replace("{email}", user.email)}</p>
        <Link href={safeNext} className="btn-primary mt-6">{t.login.back}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="card p-8 text-center !rounded-big">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white">
          <PawIcon className="h-6 w-6" />
        </span>
        <h1 className="h-display mt-4 text-3xl">{t.login.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-coffee">{t.login.sub}</p>
        {error && (
          <p className="mt-4 rounded-xl bg-coral-soft px-4 py-2 text-sm text-coral-deep">
            {error === "config" ? t.login.errConfig : t.login.errGoogle}
          </p>
        )}
        <div className="mt-6">
          {googleOn ? (
            <a
              href={`/api/auth/google?next=${encodeURIComponent(safeNext)}`}
              className="btn-primary w-full !bg-white !text-ink border border-sand hover:shadow-lift"
            >
              <GoogleG /> {t.login.google}
            </a>
          ) : (
            <p className="rounded-xl bg-parchment px-4 py-3 text-sm text-coffee">{t.login.notConfigured}</p>
          )}
          {demoOn && (
            <form action={`/api/auth/demo?next=${encodeURIComponent(safeNext)}`} method="post" className="mt-3">
              <button className="btn-ghost w-full" type="submit">{t.login.demo}</button>
            </form>
          )}
        </div>
        <p className="mt-6 text-xs text-fog">
          {t.login.agreePre}
          <Link href={lp(locale, "/terms")} className="underline hover:text-coral">{t.login.terms}</Link>
          {t.login.and}
          <Link href={lp(locale, "/privacy")} className="underline hover:text-coral">{t.login.privacy}</Link>.
        </p>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.03c2.2-2.1 3.5-5.1 3.5-8.6z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5l-.14.01-3.6 2.8-.05.13C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.01-.16-3.7-2.8-.12.06C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.8-3z" />
      <path fill="#EA4335" d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.8 3c.9-2.9 3.6-5 6.8-5z" />
    </svg>
  );
}
