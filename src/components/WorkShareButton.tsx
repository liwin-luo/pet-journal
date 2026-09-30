"use client";

import { useState } from "react";
import { CheckIcon, ShareIcon } from "./icons";

type Props = { path: string; title: string; label: string };

/** 卡片分享按钮：优先系统分享面板，否则复制链接。 */
export function WorkShareButton({ path, title, label }: Props) {
  const [done, setDone] = useState(false);

  async function share() {
    const url = `${window.location.origin}${path}`;
    const nav = navigator as Navigator & { share?: (data: { title?: string; url: string }) => Promise<void> };
    try {
      if (nav.share) {
        await nav.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      // 用户取消系统分享，忽略
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-1 rounded-full border border-sand bg-white px-2.5 py-1 text-xs font-semibold text-coffee transition-all hover:border-coral hover:text-coral"
    >
      {done ? <CheckIcon className="h-3.5 w-3.5 text-sage" /> : <ShareIcon className="h-3.5 w-3.5" />}
    </button>
  );
}
