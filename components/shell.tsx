"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "日记", match: (path: string) => path === "/" },
  { href: "/pets", label: "宠物册", match: (path: string) => path.startsWith("/pets") },
  { href: "/create", label: "出图", match: (path: string) => path.startsWith("/create") },
  { href: "/album", label: "相册", match: (path: string) => path.startsWith("/album") },
];

function meta(path: string): { title: string; desc: string } {
  if (path === "/") return { title: "今天", desc: "写一篇，再给它配一张手账图" };
  if (path === "/pets/new") return { title: "新档案", desc: "名字、物种和一张正面照就能开始" };
  if (path.startsWith("/pets/") && path !== "/pets/new") return { title: "编辑档案", desc: "改完只影响下一张图" };
  if (path.startsWith("/pets")) return { title: "宠物册", desc: "家里那几只，各有各的本" };
  if (path.startsWith("/create")) return { title: "出图工坊", desc: "选模板，用档案和物品当参考" };
  if (path.startsWith("/album")) return { title: "相册", desc: "日记图和模板图都在这" };
  return { title: "宠物手账", desc: "" };
}

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/login") return children;

  const page = meta(path);
  return (
    <div className="app">
      <aside className="rail">
        <Link href="/" className="px-2">
          <p className="stamp">PET JOURNAL</p>
          <p className="display mt-3 text-2xl leading-none">宠物手账</p>
          <p className="mt-2 text-xs text-mute">给家里那只留今天</p>
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className="nav-item" data-on={tab.match(path)}>
              <span className="display w-5 text-lg leading-none">{tab.label.slice(0, 1)}</span>
              {tab.label}
            </Link>
          ))}
        </nav>
        <form action="/api/auth/signout" method="post" className="px-2">
          <button type="submit" className="text-xs text-mute underline underline-offset-4">
            登出
          </button>
        </form>
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
          <form action="/api/auth/signout" method="post" className="lg:hidden">
            <button type="submit" className="text-xs text-mute underline underline-offset-4">
              登出
            </button>
          </form>
        </header>
        <main className="canvas">{children}</main>
        <nav className="dock">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className="tab" data-on={tab.match(path)}>
              <span className="display text-lg leading-none">{tab.label.slice(0, 1)}</span>
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
