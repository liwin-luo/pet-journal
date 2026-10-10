"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, ZapIcon } from "./icons";

// 柠檬黄公告条（Skillry 式顶部 Pro 推销），可关闭，会话内不再显示。
export function AnnounceBar({
  pro,
  text,
  cta,
  close,
  href,
}: {
  pro: string;
  text: string;
  cta: string;
  close: string;
  href: string;
}) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="annbar relative px-10 py-1.5 text-center text-[13px] font-semibold">
      <span className="mr-2 inline-flex -translate-y-px items-center gap-1 rounded-full bg-lemon-ink px-2 py-0.5 text-[10px] font-bold tracking-wide text-lemon">
        <ZapIcon className="h-3 w-3" /> {pro}
      </span>
      {text}{" "}
      <Link href={href} className="ml-1 inline-flex items-center gap-1 rounded-full bg-lemon-ink px-3 py-1 text-[12px] font-bold text-lemon transition-transform hover:-translate-y-px">
        {cta} <ArrowIcon className="h-3.5 w-3.5" />
      </Link>
      <button
        type="button"
        onClick={() => setShow(false)}
        aria-label={close}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-lemon-ink/70 transition-colors hover:text-lemon-ink"
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
