"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PawIcon, SparkIcon } from "./icons";

type Texts = {
  quotaTitle: string;
  quotaOf: string;
  quotaLeft: string;
  myPictures: string;
  plans: string;
  plansSoon: string;
  signout: { title: string; body: string; cancel: string; confirm: string };
};

type Props = {
  user: { name?: string; email: string; picture?: string };
  quota: { used: number; limit: number; left: number };
  homePath: string;
  accountPath: string;
  texts: Texts;
};

/** 顶栏个人中心：头像下拉（资料 / 今日额度 / 入口 / 登出确认）。 */
export function UserMenu({ user, quota, homePath, accountPath, texts }: Props) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pct = Math.min(100, Math.round((quota.used / Math.max(1, quota.limit)) * 100));

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 transition-colors hover:border-sand"
      >
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.picture} alt="" className="h-8 w-8 rounded-full border border-sand" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-xs font-bold text-sage">
            {(user.name || user.email).slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="hidden max-w-28 truncate text-sm text-coffee lg:inline">{user.name || user.email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-card border border-sand/70 bg-white p-3 shadow-lift"
        >
          {/* 资料 */}
          <div className="flex items-center gap-2.5 border-b border-sand/70 pb-3">
            {user.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.picture} alt="" className="h-10 w-10 rounded-full border border-sand" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-sm font-bold text-sage">
                {(user.name || user.email).slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{user.name || user.email}</span>
              <span className="block truncate text-xs text-fog">{user.email}</span>
            </span>
          </div>

          {/* 今日额度 */}
          <div className="border-b border-sand/70 px-1 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-fog">{texts.quotaTitle}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-sand">
              <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-coffee">
              {texts.quotaOf.replace("{used}", String(quota.used)).replace("{limit}", String(quota.limit))} ·{" "}
              {texts.quotaLeft.replace("{left}", String(quota.left))}
            </p>
          </div>

          {/* 入口 */}
          <div className="border-b border-sand/70 py-1">
            <Link href={`${homePath}#create`} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-coffee transition-colors hover:bg-parchment hover:text-coral">
              <SparkIcon className="h-4 w-4 text-coral" /> {texts.myPictures}
            </Link>
            <Link href={accountPath} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-coffee transition-colors hover:bg-parchment hover:text-coral">
              <PawIcon className="h-4 w-4 text-coral" /> {texts.plans}
              <span className="ml-auto rounded-full bg-sage-soft px-2 py-0.5 text-[10px] font-semibold text-sage">{texts.plansSoon}</span>
            </Link>
          </div>

          {/* 登出 */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setModal(true);
            }}
            className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-coffee transition-colors hover:bg-parchment hover:text-coral"
          >
            {texts.signout.confirm}
          </button>
        </div>
      )}

      {/* 登出确认弹框（Portal 到 body） */}
      {modal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={texts.signout.title}
            onClick={() => setModal(false)}
          >
            <div className="card w-full max-w-sm p-6 !rounded-big rise" role="document" onClick={(e) => e.stopPropagation()}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-soft text-coral">
                <PawIcon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold">{texts.signout.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-coffee">{texts.signout.body}</p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" className="btn-ghost" onClick={() => setModal(false)}>
                  {texts.signout.cancel}
                </button>
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className="btn-primary">
                    {texts.signout.confirm}
                  </button>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
