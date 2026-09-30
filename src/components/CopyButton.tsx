"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyButton({ text, label = "Copy prompt", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 降级：老浏览器
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }

  return (
    <button type="button" onClick={copy} className={`btn-ghost !py-2 text-sm ${className ?? ""}`} aria-live="polite">
      {done ? <CheckIcon className="h-4 w-4 text-sage" /> : <CopyIcon className="h-4 w-4" />}
      {done ? "Copied!" : label}
    </button>
  );
}
