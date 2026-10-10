"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 纯前端梗图生成器：照片全程不出浏览器，canvas 渲染 + 本地下载。
// 输出 1080×1080（社交平台通用方图），右下角带域名小水印（获客钩子）。

const SIZE = 1080;
const FONT = '900 92px Impact, "Arial Black", "Helvetica Neue", sans-serif';
const STICKERS = ["😂", "😭", "💀", "🔥", "❤️", "👀", "✨", "🐾"];

interface Sticker {
  emoji: string;
  x: number; // 0–1 归一化坐标
  y: number;
}

type Texts = {
  upload: string;
  uploadHint: string;
  changePhoto: string;
  topText: string;
  bottomText: string;
  stickers: string;
  download: string;
  share: string;
  errType: string;
  ideaLabel: string;
  ideas: string[];
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawBlock(ctx: CanvasRenderingContext2D, text: string, top: boolean) {
  const trimmed = text.trim();
  if (!trimmed) return;
  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  const lines = wrapText(ctx, trimmed.toUpperCase(), SIZE - 120);
  const lineHeight = 96;
  const startY = top ? 30 : SIZE - 30 - (lines.length - 1) * lineHeight;
  lines.forEach((l, i) => {
    const y = startY + i * lineHeight + 78;
    ctx.strokeStyle = "rgba(0,0,0,0.9)";
    ctx.lineWidth = 14;
    ctx.strokeText(l, SIZE / 2, Math.min(Math.max(y, 92), SIZE - 16));
    ctx.fillStyle = "#ffffff";
    ctx.fillText(l, SIZE / 2, Math.min(Math.max(y, 92), SIZE - 16));
  });
}

function render(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  top: string,
  bottom: string,
  stickers: Sticker[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, SIZE, SIZE);
  // cover 裁切
  const scale = Math.max(SIZE / img.width, SIZE / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
  // 上下渐变压暗，保证白字可读
  const g = ctx.createLinearGradient(0, 0, 0, SIZE);
  g.addColorStop(0, "rgba(0,0,0,0.45)");
  g.addColorStop(0.25, "rgba(0,0,0,0)");
  g.addColorStop(0.75, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);

  drawBlock(ctx, top, true);
  drawBlock(ctx, bottom, false);

  for (const s of stickers) {
    ctx.font = "110px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.emoji, s.x * SIZE, s.y * SIZE);
  }
  ctx.textBaseline = "alphabetic";

  // 域名水印
  ctx.font = '600 34px system-ui, sans-serif';
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText("petsdaily.live", SIZE - 28, SIZE - 24);
  ctx.shadowBlur = 0;
  ctx.textAlign = "left";
}

export function MemeMaker({ texts }: { texts: Texts }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<number>(-1);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [err, setErr] = useState("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.canShare);
  }, []);

  const redraw = useCallback(() => {
    if (canvasRef.current && imgRef.current) {
      render(canvasRef.current, imgRef.current, top, bottom, stickers);
    }
  }, [top, bottom, stickers]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErr(texts.errType);
      return;
    }
    setErr("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setHasPhoto(true);
      redraw();
    };
    img.src = url;
  }

  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const { x, y } = pointerPos(e);
    const hit = stickers.findIndex((s) => Math.hypot((s.x - x) * SIZE, (s.y - y) * SIZE) < 70);
    if (hit >= 0) {
      dragRef.current = hit;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (dragRef.current < 0) return;
    const { x, y } = pointerPos(e);
    setStickers((prev) =>
      prev.map((s, i) => (i === dragRef.current ? { ...s, x: Math.min(Math.max(x, 0.05), 0.95), y: Math.min(Math.max(y, 0.05), 0.95) } : s)),
    );
  }

  function onPointerUp() {
    dragRef.current = -1;
  }

  function addSticker(emoji: string) {
    setStickers((prev) => [
      ...prev,
      { emoji, x: 0.3 + Math.random() * 0.4, y: 0.3 + Math.random() * 0.4 },
    ]);
  }

  function download() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pet-meme.jpg";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/jpeg", 0.92);
  }

  async function share() {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.canShare) return;
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.92));
    if (!blob) return;
    const file = new File([blob], "pet-meme.jpg", { type: "image/jpeg" });
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: "🐾" }).catch(() => {});
    }
  }

  const inputCls =
    "w-full rounded-xl border border-sand bg-surface-2 px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-fog focus:border-coral";

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_360px]">
      {/* 画布预览 */}
      <div className="card flex items-center justify-center p-4 md:p-6">
        <div className="relative w-full max-w-[520px]">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className={`w-full rounded-2xl border border-sand/60 bg-surface-2 ${hasPhoto ? "cursor-grab active:cursor-grabbing" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
          {!hasPhoto && (
            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-surface-2/95 text-center">
              <span className="text-5xl" aria-hidden="true">🖼️</span>
              <span className="font-display text-lg font-bold">{texts.upload}</span>
              <span className="text-xs text-fog">{texts.uploadHint}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} />
            </label>
          )}
        </div>
      </div>

      {/* 控制面板 */}
      <div className="flex flex-col gap-4">
        {hasPhoto && (
          <label className="btn-ghost cursor-pointer !justify-center text-sm">
            {texts.changePhoto}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} />
          </label>
        )}
        {err && <p className="text-sm font-medium text-coral">{err}</p>}

        <div>
          <label htmlFor="meme-top" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{texts.topText}</label>
          <input id="meme-top" value={top} onChange={(e) => setTop(e.target.value)} maxLength={80} className={inputCls} />
        </div>
        <div>
          <label htmlFor="meme-bottom" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{texts.bottomText}</label>
          <input id="meme-bottom" value={bottom} onChange={(e) => setBottom(e.target.value)} maxLength={80} className={inputCls} />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-fog">{texts.stickers}</p>
          <div className="flex flex-wrap gap-1.5">
            {STICKERS.map((s) => (
              <button key={s} type="button" onClick={() => addSticker(s)} className="rounded-xl border border-sand bg-surface-2 px-2.5 py-1.5 text-xl transition-transform hover:-translate-y-0.5 hover:border-coral" aria-label={`Add ${s}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={download} disabled={!hasPhoto} className="btn-primary flex-1 text-sm">
            ⬇ {texts.download}
          </button>
          {canShare && (
            <button type="button" onClick={share} disabled={!hasPhoto} className="btn-ghost text-sm">
              {texts.share}
            </button>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fog">{texts.ideaLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {texts.ideas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => (top.length < bottom.length ? setTop(idea) : setBottom(idea))}
                className="rounded-full border border-sand bg-surface-2 px-3 py-1.5 text-xs font-medium text-coffee transition-colors hover:border-coral hover:text-coral"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
