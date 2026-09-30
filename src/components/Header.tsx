import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { getDict, lp, type Dict, type Locale } from "@/lib/i18n";
import { getQuota, getSubjectId } from "@/lib/ratelimit";
import { SITE_NAME } from "@/lib/site";
import { PawIcon, SparkIcon } from "./icons";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { UserMenu } from "./UserMenu";

export async function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const user = await getSessionUser().catch(() => null);
  const quota = user ? await getQuota(await getSubjectId()) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href={lp(locale, "/")} className="flex items-center gap-2 text-lg font-semibold font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white">
            <PawIcon className="h-5 w-5" />
          </span>
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-coffee md:flex" aria-label="Main">
          <Link href={lp(locale, "/templates")} className="transition-colors hover:text-coral">{t.nav.templates}</Link>
          <Link href={lp(locale, "/gallery")} className="transition-colors hover:text-coral">{t.nav.gallery}</Link>
          <Link href={lp(locale, "/faq")} className="transition-colors hover:text-coral">{t.nav.faq}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          {user && quota ? (
            <UserMenu
              user={{ name: user.name, email: user.email, picture: user.picture }}
              quota={quota}
              homePath={lp(locale, "/")}
              accountPath={lp(locale, "/account")}
              libPath={lp(locale, "/library")}
              texts={{ quotaTitle: t.acct.quotaTitle, quotaOf: t.acct.quotaOf, quotaLeft: t.acct.quotaLeft, myPictures: t.acct.myPictures, plans: t.acct.plans, signout: t.signout }}
            />
          ) : (
            <Link href={lp(locale, "/login")} className="text-sm font-medium text-coffee transition-colors hover:text-coral">
              {t.nav.signIn}
            </Link>
          )}
          <Link href={`${lp(locale, "/")}#create`} className="btn-primary !px-5 !py-2.5 text-sm">
            <SparkIcon className="h-4 w-4" />
            {t.nav.create}
          </Link>
        </div>
      </div>
      {/* 移动端导航 */}
      <nav className="flex justify-center gap-6 border-t border-sand/60 py-2 text-sm font-medium text-coffee md:hidden" aria-label="Mobile">
        <Link href={lp(locale, "/templates")}>{t.nav.templates}</Link>
        <Link href={lp(locale, "/gallery")}>{t.nav.gallery}</Link>
        <Link href={lp(locale, "/faq")}>{t.nav.faq}</Link>
      </nav>
    </header>
  );
}
