import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { SITE_NAME } from "@/lib/site";
import { PawIcon, SparkIcon } from "./icons";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold font-display">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white">
            <PawIcon className="h-5 w-5" />
          </span>
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-coffee md:flex" aria-label="Main">
          <Link href="/templates" className="transition-colors hover:text-coral">Templates</Link>
          <Link href="/gallery" className="transition-colors hover:text-coral">Gallery</Link>
          <Link href="/faq" className="transition-colors hover:text-coral">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <form action="/api/auth/logout" method="post" className="flex items-center gap-2">
              <span className="hidden items-center gap-2 text-sm text-coffee sm:flex" title={user.email}>
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt="" className="h-8 w-8 rounded-full border border-sand" referrerPolicy="no-referrer" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-xs font-bold text-sage">
                    {(user.name || user.email).slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="max-w-28 truncate">{user.name || user.email}</span>
              </span>
              <button type="submit" className="text-sm font-medium text-coffee transition-colors hover:text-coral">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-medium text-coffee transition-colors hover:text-coral">
              Sign in
            </Link>
          )}
          <Link href="/#create" className="btn-primary !px-5 !py-2.5 text-sm">
            <SparkIcon className="h-4 w-4" />
            Create
          </Link>
        </div>
      </div>
      {/* 移动端导航 */}
      <nav className="flex justify-center gap-6 border-t border-sand/60 py-2 text-sm font-medium text-coffee md:hidden" aria-label="Mobile">
        <Link href="/templates">Templates</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/faq">FAQ</Link>
      </nav>
    </header>
  );
}
