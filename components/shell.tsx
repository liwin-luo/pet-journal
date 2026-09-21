"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "日记", match: (path: string) => path === "/" },
  { href: "/pets", label: "宠物册", match: (path: string) => path.startsWith("/pets") },
  { href: "/create", label: "出图", match: (path: string) => path.startsWith("/create") },
  { href: "/album", label: "相册", match: (path: string) => path.startsWith("/album") },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const login = path === "/login";
  return (
    <div className="phone flex min-h-dvh flex-col">
      <header className="flex items-end justify-between px-5 pt-6 pb-3">
        <div>
          <p className="stamp">PET JOURNAL</p>
          <h1 className="display mt-2 text-3xl leading-none">宠物手账</h1>
        </div>
        {login ? (
          <p className="text-xs text-[#6b5a4a]">各看各的</p>
        ) : (
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-xs text-[#6b5a4a] underline underline-offset-4">
              登出
            </button>
          </form>
        )}
      </header>
      <main className="flex-1 px-5 pb-24">{children}</main>
      {login ? null : (
        <nav className="sticky bottom-0 flex border-t border-[#d8c4a8] bg-[#f3e6d4]/95 backdrop-blur">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className="tab" data-on={tab.match(path)}>
              <span className="display text-lg leading-none">{tab.label.slice(0, 1)}</span>
              {tab.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
