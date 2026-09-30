"use client";

import { useState } from "react";

type Texts = { showFull: string; showLess: string };

/**
 * 提示词展示：默认 3 行，超出用 … 截断；"Show full prompt" 展开全文。
 * 复制按钮（外部传入）始终复制完整文本。
 */
export function PromptBlock({ prompt, texts }: { prompt: string; texts: Texts }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-parchment/70 p-4">
      <p className={`whitespace-pre-line font-mono text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>{prompt}</p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs font-semibold text-coral hover:underline"
        aria-expanded={expanded}
      >
        {expanded ? texts.showLess : texts.showFull}
      </button>
    </div>
  );
}
