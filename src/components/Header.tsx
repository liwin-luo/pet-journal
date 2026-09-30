import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { PawIcon, SparkIcon } from "./icons";

export function Header() {
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
          <Link href="/templates" className="transition-colors hover:text-coral">
            Templates
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-coral">
            Gallery
          </Link>
          <Link href="/faq" className="transition-colors hover:text-coral">
            FAQ
          </Link>
        </nav>
        <Link href="/#create" className="btn-primary !px-5 !py-2.5 text-sm">
          <SparkIcon className="h-4 w-4" />
          Create
        </Link>
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
