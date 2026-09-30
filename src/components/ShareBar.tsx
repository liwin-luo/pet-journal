"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, FacebookIcon, PinterestIcon, ShareIcon, TelegramIcon, WhatsAppIcon, XIcon } from "./icons";

type Props = {
  /** 分享落地页的绝对地址 */
  url: string;
  /** 随链接一起发的一句话 */
  text?: string;
  /** 公开可访问的图片绝对地址（Pinterest 出图用） */
  imageUrl?: string;
  /** 页面内图片 src（data-URL 或媒体地址），用于系统级带图分享（手机上可直达 Instagram/TikTok） */
  fileShareSrc?: string;
};

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white text-coffee transition-all hover:-translate-y-0.5 hover:border-coral hover:text-coral";

export function ShareBar({ url, text, imageUrl, fileShareSrc }: Props) {
  const [copied, setCopied] = useState(false);
  const [native, setNative] = useState(false);
  useEffect(() => {
    if ("share" in navigator) setNative(true);
  }, []);
  const shareText = text || "Check out this AI pet portrait I made! 🐾";
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const targets = [
    { name: "X", icon: <XIcon className="h-4 w-4" />, href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { name: "Facebook", icon: <FacebookIcon className="h-4 w-4" />, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "WhatsApp", icon: <WhatsAppIcon className="h-4 w-4" />, href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { name: "Telegram", icon: <TelegramIcon className="h-4 w-4" />, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
    ...(imageUrl
      ? [
          {
            name: "Pinterest",
            icon: <PinterestIcon className="h-4 w-4" />,
            href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(imageUrl)}&description=${encodedText}`,
          },
        ]
      : []),
  ];

  async function fileFrom(src: string): Promise<File> {
    const res = await fetch(src);
    const blob = await res.blob();
    return new File([blob], "pet-portrait.jpg", { type: blob.type || "image/jpeg" });
  }

  /** 系统分享面板：手机上带图分享可直达 Instagram/TikTok/信息流 */
  async function nativeShare() {
    try {
      if (fileShareSrc && typeof navigator.canShare === "function") {
        const file = await fileFrom(fileShareSrc);
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text: shareText });
          return;
        }
      }
      await navigator.share({ title: "AI pet portrait", text: shareText, url });
    } catch {
      // 用户取消不算错误
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {native && (
        <button type="button" onClick={nativeShare} className="btn-ghost !py-2 text-sm">
          <ShareIcon className="h-4 w-4" /> Share image…
        </button>
      )}
      {targets.map((t) => (
        <a key={t.name} href={t.href} target="_blank" rel="noopener noreferrer" aria-label={`Share to ${t.name}`} title={`Share to ${t.name}`} className={iconBtn}>
          {t.icon}
        </a>
      ))}
      <button type="button" onClick={copyLink} className={iconBtn} aria-label="Copy link" title="Copy link" aria-live="polite">
        {copied ? <CheckIcon className="h-4 w-4 text-sage" /> : <CopyIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
