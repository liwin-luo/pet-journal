"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocaleSwitch } from "./locale-switch";
import { useI18n } from "./locale-provider";

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { m } = useI18n();
  if (path === "/login" || path === "/") return children;

  const tabs = [
    { href: "/today", label: m.nav.today, match: path === "/today" },
    { href: "/pets", label: m.nav.pets, match: path.startsWith("/pets") },
    { href: "/create", label: m.nav.create, match: path.startsWith("/create") },
    { href: "/album", label: m.nav.album, match: path.startsWith("/album") },
  ];
  const page =
    path === "/today"
      ? m.pages.today
      : path === "/pets/new"
        ? m.pages.petsNew
        : path.startsWith("/pets/")
          ? m.pages.petsEdit
          : path.startsWith("/pets")
            ? m.pages.pets
            : path.startsWith("/create")
              ? m.pages.create
              : path.startsWith("/album")
                ? m.pages.album
                : { title: m.brand, desc: "" };

  return (
    <div className="app">
      <aside className="rail">
        <Link href="/today" className="px-2">
          <p className="stamp">{m.stamp}</p>
          <p className="display mt-3 text-2xl leading-none">{m.brand}</p>
          <p className="mt-2 text-xs text-mute">{m.tagline}</p>
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="nav-item" data-on={tab.match}>
              <span className="display w-5 text-lg leading-none">{tab.label.slice(0, 1)}</span>
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 px-2">
          <LocaleSwitch />
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-xs text-mute underline underline-offset-4">
              {m.nav.signOut}
            </button>
          </form>
        </div>
      </aside>

      <div className="stage">
        <header className="topbar">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.16em] text-mute uppercase">Petsdaily</p>
            <div className="page-head mb-0 mt-1 lg:hidden">
              <h1 className="display text-2xl leading-none">{page.title}</h1>
            </div>
            <div className="hidden lg:block">
              <h1 className="display text-3xl leading-none">{page.title}</h1>
              {page.desc ? <p className="mt-1 text-sm text-mute">{page.desc}</p> : null}
            </div>
          </div>
          <div className="flex items-center gap-3 lg:hidden">
            <LocaleSwitch />
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-xs text-mute underline underline-offset-4">
                {m.nav.signOut}
              </button>
            </form>
          </div>
        </header>
        <main className="canvas">{children}</main>
        <nav className="dock">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href} className="tab" data-on={tab.match}>
              <span className="display text-lg leading-none">{tab.label.slice(0, 1)}</span>
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
