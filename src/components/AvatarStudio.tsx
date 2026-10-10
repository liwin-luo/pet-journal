"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/i18n";

// 头像生成器：复用主站上传/生成/限流/审核链路，头像风格作为预设提示词。
// 引擎提示词保持英文（GLM 合成出图提示词），界面文案走 i18n。

const STYLES = [
  {
    id: "cartoon3d",
    emoji: "🧸",
    prompt:
      "Cute 3D cartoon avatar of the same pet from the reference photo, big glossy eyes, rounded stylized shapes, Pixar-style character render, head and shoulders centered, soft studio lighting, plain warm pastel background, detailed stylized fur keeping the pet's real colors, adorable friendly mood. Square 1:1 profile-picture crop. No text.",
  },
  {
    id: "chibi",
    emoji: "🌸",
    prompt:
      "Kawaii chibi sticker-style avatar of the same pet from the reference photo, oversized head, tiny body, simple flat cel shading with bold clean outlines, pastel color palette keeping the pet's real fur colors, plain solid pastel background, head and chest centered, irresistible cute mood. Square 1:1 profile-picture crop. No text.",
  },
  {
    id: "watercolor",
    emoji: "🎨",
    prompt:
      "Soft watercolor illustration avatar of the same pet from the reference photo, loose painterly brush strokes, gentle pastel washes, big kind eyes, head and shoulders centered, plain cream paper background keeping the pet's real colors, warm gentle mood. Square 1:1 profile-picture crop. No text.",
  },
];

type Texts = {
  styleLabel: string;
  photoLabel: string;
  photoHint: string;
  generate: string;
  generating: string;
  again: string;
  dl: string;
  dlSignIn: string;
  errPhoto: string;
  err: string;
  free: string;
  left: string;
  share: string;
};

export function AvatarStudio({
  locale,
  signedIn,
  texts,
  loginPath,
}: {
  locale: string;
  signedIn: boolean;
  texts: Texts;
  loginPath: string;
}) {
  const [styleId, setStyleId] = useState(STYLES[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ image: string; imagePath: string; shareUrl: string; left: number | null } | null>(null);
  const [err, setErr] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const langPath = (p: string) => (locale === DEFAULT_LOCALE ? p : `/${locale}${p}`);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) return;
    if (f.size > 5 * 1024 * 1024) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
    setErr("");
  }

  async function generate() {
    if (!file) {
      setErr(texts.errPhoto);
      return;
    }
    setErr("");
    setBusy(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("files", file);
      const up = await fetch("/api/upload", { method: "POST", body: form });
      if (!up.ok) throw new Error();
      const { ids } = (await up.json()) as { ids: string[] };
      const style = STYLES.find((s) => s.id === styleId)!;
      const gen = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: style.prompt, imageIds: ids }),
      });
      const data = await gen.json();
      if (!gen.ok) throw new Error(data.error || texts.err);
      setResult({ image: data.image, imagePath: data.imagePath, shareUrl: data.shareUrl, left: data.left ?? null });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    } catch (e) {
      setErr(e instanceof Error && e.message && e.message !== "Failed to fetch" ? e.message : texts.err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 控制面板 */}
      <div className="card flex flex-col gap-5 p-5 md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fog">{texts.styleLabel}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyleId(s.id)}
                aria-pressed={styleId === s.id}
                className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-2xl transition-all ${
                  styleId === s.id
                    ? "border-coral bg-coral-soft shadow-soft"
                    : "border-sand bg-surface-2 hover:border-coral/60"
                }`}
              >
                <span aria-hidden="true">{s.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-coffee">{s.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-fog">{texts.photoLabel}</p>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sand bg-surface-2/60 px-4 py-8 text-center transition-colors hover:border-coral/70">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-28 w-28 rounded-xl object-cover" />
            ) : (
              <span className="text-4xl" aria-hidden="true">📸</span>
            )}
            <span className="text-xs text-fog">{texts.photoHint}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={pick} />
          </label>
        </div>

        {err && <p className="text-sm font-medium text-coral">{err}</p>}

        <button type="button" onClick={generate} disabled={busy} className="btn-primary w-full">
          {busy ? (
            <>
              <span className="bounce-soft inline-block" aria-hidden="true">🎨</span> {texts.generating}
            </>
          ) : (
            <>✨ {texts.generate}</>
          )}
        </button>
        <p className="text-center text-xs text-fog">{texts.free}</p>
      </div>

      {/* 结果区 */}
      <div ref={resultRef} className="card flex flex-col items-center justify-center gap-4 p-5 md:p-6">
        {busy && <div className="h-64 w-64 animate-pulse rounded-2xl bg-surface-2" />}
        {!busy && !result && (
          <div className="text-center text-fog">
            <span className="block text-5xl" aria-hidden="true">🐾</span>
            <p className="mt-3 text-sm">{texts.styleLabel} → {texts.photoLabel}</p>
          </div>
        )}
        {!busy && result && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.image} alt="AI pet avatar" className="w-full max-w-64 rounded-2xl border border-sand/60 shadow-lift" />
            <p className="text-xs text-fog">AI-generated · {result.left !== null ? texts.left.replace("{n}", String(result.left)) : ""}</p>
            <div className="flex w-full flex-col gap-2">
              {signedIn ? (
                <a href={result.imagePath} download className="btn-primary w-full text-sm">⬇ {texts.dl}</a>
              ) : (
                <Link href={loginPath} className="btn-primary w-full text-sm">{texts.dlSignIn}</Link>
              )}
              <Link href={langPath(result.shareUrl)} className="btn-ghost w-full !justify-center text-sm">
                {texts.share} ↗
              </Link>
            </div>
            <button type="button" onClick={() => setResult(null)} className="text-sm font-semibold text-coral hover:underline">
              {texts.again}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
