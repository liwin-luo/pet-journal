"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Tpl } from "@/lib/templates";
import { CopyButton } from "./CopyButton";
import { ShareBar } from "./ShareBar";
import { DownloadIcon, PawIcon, RefreshIcon, ShareIcon, SparkIcon, StarIcon, UploadIcon } from "./icons";

type Msg = {
  id: number;
  text: string;
  images: string[];
  templateId?: string;
  status: "loading" | "done" | "error";
  result?: { image: string; imagePath?: string; prompt: string; shareUrl: string; left: number };
  error?: string;
};

const PLACEHOLDERS = [
  "e.g. My cat as a renaissance royal, oil painting",
  "e.g. My dog in a Santa hat by the fireplace, cozy",
  "e.g. My bunny reading a book in a library, warm light",
  "e.g. Funny birthday portrait of my pug with a party hat",
];

const LOADING_LINES = [
  "Studying your pet's finest features…",
  "Mixing the perfect palette…",
  "Sketching whiskers and paw details…",
  "Painting the scene you asked for…",
  "Adding the final brush strokes…",
];

const IDEAS = [
  "Renaissance royal portrait",
  "Christmas card by the fireplace",
  "Astronaut floating in space",
  "Funny movie poster",
  "Cozy winter sweater",
  "Birthday party hat",
];

type Props = { featured: Tpl[]; user: { name?: string; email: string } | null };

export function Generator({ featured, user }: Props) {
  const params = useSearchParams();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<{ id: string; url: string }[]>([]);
  const [busyFiles, setBusyFiles] = useState(false);
  const [tpl, setTpl] = useState<Tpl | null>(null);
  const [loadingLine, setLoadingLine] = useState(0);
  const [shareFor, setShareFor] = useState<number | null>(null);
  const [shareOpenFor, setShareOpenFor] = useState<number | null>(null);
  const [signInFor, setSignInFor] = useState<number | null>(null);
  const idRef = useRef(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // /templates/[slug] 点 "Try it" 带 ?tpl= 进来，预选模板
  useEffect(() => {
    const id = params.get("tpl");
    if (id) {
      const found = featured.find((t) => t.id === id);
      if (found) setTpl(found);
    }
  }, [params, featured]);

  useEffect(() => {
    if (!msgs.some((m) => m.status === "loading")) return;
    const t = setInterval(() => setLoadingLine((n) => (n + 1) % LOADING_LINES.length), 2600);
    return () => clearInterval(t);
  }, [msgs]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  async function pickFiles(list: FileList | null) {
    if (!list?.length) return;
    const form = new FormData();
    for (const f of Array.from(list).slice(0, 4 - files.length)) form.append("files", f);
    setBusyFiles(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = (await res.json()) as { urls?: string[]; error?: string };
      if (!res.ok || !data.urls) throw new Error(data.error || "Upload failed");
      setFiles((prev) => [...prev, ...data.urls!.map((url, i) => ({ id: `${Date.now()}-${i}`, url }))]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusyFiles(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function generate(text: string, images: string[], templateId?: string) {
    const id = ++idRef.current;
    setMsgs((prev) => [...prev, { id, text, images, templateId, status: "loading" }]);
    setInput("");
    setFiles([]);
    setTpl(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, templateId, imageIds: images.map((u) => u.split("/").pop()) }),
      });
      const data = (await res.json()) as Msg["result"] & { error?: string };
      if (!res.ok || !data?.image) throw new Error(data?.error || "Generation failed");
      setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, status: "done", result: data } : m)));
    } catch (err) {
      setMsgs((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "error", error: err instanceof Error ? err.message : "Failed" } : m)),
      );
    }
  }

  async function download(id: number, result: Msg["result"]) {
    if (!result) return;
    const res = await fetch(result.imagePath || result.image);
    if (res.status === 401) {
      setSignInFor(id);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pet-portrait.jpg";
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasHistory = msgs.length > 0;
  const loading = msgs.some((m) => m.status === "loading");

  return (
    <div id="create" className="card overflow-hidden !rounded-big">
      {/* 顶栏 */}
      <div className="flex items-center justify-between border-b border-sand/70 bg-parchment/70 px-5 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white">
            <PawIcon className="h-4 w-4" />
          </span>
          {hasHistory ? "Your session" : "Tell the studio what to paint"}
        </p>
        <span className="text-xs text-fog">3 free pictures a day</span>
      </div>

      <div className={hasHistory ? "max-h-[480px] overflow-y-auto px-5 py-4" : ""} ref={chatRef}>
        {/* 历史消息 */}
        {msgs.map((m) => (
          <div key={m.id} className="rise mb-5">
            {/* 用户气泡 */}
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-coral-soft px-4 py-3">
              {!!m.images.length && (
                <div className="mb-2 flex gap-2">
                  {m.images.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={url} src={url} alt="Attached pet photo" className="h-14 w-14 rounded-lg object-cover" />
                  ))}
                </div>
              )}
              <p className="text-sm">{m.text || <em className="text-coffee">(just the template)</em>}</p>
              {m.templateId && (
                <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-coral">
                  ✦ {m.templateId} template
                </span>
              )}
            </div>
            {/* 助手气泡 */}
            <div className="mt-3 max-w-[92%]">
              {m.status === "loading" && (
                <div className="flex items-center gap-3 rounded-2xl rounded-tl-md bg-parchment px-4 py-3 text-sm text-coffee">
                  <PawIcon className="h-5 w-5 text-coral bounce-soft" />
                  {LOADING_LINES[loadingLine]}
                  <span className="ml-auto text-xs text-fog">~30s</span>
                </div>
              )}
              {m.status === "error" && (
                <div className="rounded-2xl rounded-tl-md border border-coral/40 bg-coral-soft/60 px-4 py-3 text-sm text-coral-deep">
                  {m.error}{" "}
                  <button className="font-semibold underline" onClick={() => generate(m.text, m.images, m.templateId)}>
                    Try again
                  </button>
                </div>
              )}
              {m.status === "done" && m.result && (
                <div className="rounded-2xl rounded-tl-md border border-sand/70 bg-white p-3 shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.result.image}
                    alt={m.text || "Generated pet portrait"}
                    className="mx-auto max-h-[420px] w-auto rounded-xl"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {user ? (
                      <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => download(m.id, m.result)}>
                        <DownloadIcon className="h-4 w-4" /> Download
                      </button>
                    ) : (
                      <button
                        className="btn-primary !px-4 !py-2 text-sm"
                        onClick={() => setSignInFor(signInFor === m.id ? null : m.id)}
                      >
                        <DownloadIcon className="h-4 w-4" /> Sign in to download
                      </button>
                    )}
                    <button
                      className="btn-ghost !py-2 text-sm"
                      onClick={() => generate(m.text, m.images, m.templateId)}
                      title="Uses one free picture"
                    >
                      <RefreshIcon className="h-4 w-4" /> Regenerate
                    </button>
                    <CopyButton text={m.result.prompt} label="Copy the prompt" />
                    <button
                      className="btn-ghost !py-2 text-sm"
                      onClick={() => setShareOpenFor(shareOpenFor === m.id ? null : m.id)}
                    >
                      <ShareIcon className="h-4 w-4" /> Share
                    </button>
                    <button
                      className="btn-ghost !py-2 text-sm"
                      onClick={() => setShareFor(shareFor === m.id ? null : m.id)}
                    >
                      <StarIcon className="h-4 w-4 text-gold" /> Post to gallery
                    </button>
                  </div>
                  {shareOpenFor === m.id && m.result && (
                    <div className="mt-3 rounded-xl bg-parchment/60 p-4">
                      <p className="text-sm font-semibold">Share to social media</p>
                      <p className="mb-3 mt-1 text-xs text-fog">
                        Anyone with the link can view this picture.
                      </p>
                      <ShareBar
                        url={`${window.location.origin}${m.result.shareUrl}`}
                        imageUrl={
                          m.result.imagePath
                            ? `${window.location.origin}${m.result.imagePath}?st=${m.result.shareUrl.split("/").pop()}`
                            : undefined
                        }
                        fileShareSrc={m.result.image}
                        text="Check out this AI pet portrait I made! 🐾"
                      />
                    </div>
                  )}
                  {signInFor === m.id && !user && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-parchment/70 px-4 py-3 text-sm text-coffee">
                      Downloading needs a free account — it keeps your pictures safe.
                      <Link href="/login?next=/" className="btn-primary !px-4 !py-2 text-sm">
                        Sign in
                      </Link>
                    </div>
                  )}
                  {shareFor === m.id && (
                    <ShareForm
                      image={m.result.imagePath || m.result.image}
                      onDone={() => setShareFor(null)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 空状态引导 */}
        {!hasHistory && (
          <div className="py-1">
            <label className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sand bg-parchment/40 px-4 py-7 text-center transition-colors hover:border-coral">
              <UploadIcon className="h-7 w-7 text-coral" />
              <span className="mt-2 text-sm font-semibold">Attach a photo of your pet</span>
              <span className="mt-1 text-xs text-coffee">
                1–4 photos · JPG / PNG / WebP · clear face works best
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => pickFiles(e.target.files)}
              />
              {busyFiles && <span className="absolute inset-0 rounded-xl bg-cream/70 text-sm font-medium leading-[7rem]">Uploading…</span>}
            </label>
            {!!files.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f) => (
                  <span key={f.id} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.url} alt="Attached pet photo" className="h-16 w-16 rounded-lg border border-sand object-cover" />
                    <button
                      onClick={() => removeFile(f.id)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-white"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fog">Need an idea? Tap one</p>
              <div className="flex flex-wrap gap-2">
                {IDEAS.map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setInput(idea)}
                    className="rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-coffee transition-colors hover:border-coral hover:text-coral"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区（始终显示） */}
      <div className="border-t border-sand/70 bg-white px-5 py-4">
        {!hasHistory && (
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-fog">Template</span>
            {tpl ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-white">
                {tpl.name}
                <button onClick={() => setTpl(null)} aria-label="Clear template">×</button>
              </span>
            ) : (
              featured.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTpl(t)}
                  className="shrink-0 rounded-full border border-sand bg-cream px-3 py-1.5 text-xs font-medium text-coffee transition-colors hover:border-coral hover:text-coral"
                >
                  {t.name}
                </button>
              ))
            )}
            <Link href="/templates" className="shrink-0 text-xs font-semibold text-coral hover:underline">
              Browse all 100 →
            </Link>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !loading) generate(input.trim(), files.map((f) => f.url), tpl?.id);
              }
            }}
            rows={2}
            maxLength={800}
            placeholder={hasHistory ? "Describe another picture…" : PLACEHOLDERS[0]}
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-sand bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-fog focus:border-coral"
          />
          <button
            className="btn-primary !px-5"
            disabled={loading || busyFiles || (!input.trim() && !files.length && !tpl)}
            onClick={() => generate(input.trim(), files.map((f) => f.url), tpl?.id)}
          >
            <SparkIcon className="h-4 w-4" />
            {loading ? "Painting…" : "Generate"}
          </button>
        </div>
        <p className="mt-2 text-xs text-fog">
          Press Enter to send · works best with one clear photo + a short wish · ~30 seconds per picture
        </p>
      </div>
    </div>
  );
}

/** 生成结果投稿表单（评价 + 作品进画廊，先审后显） */
function ShareForm({ image, onDone }: { image: string; onDone: () => void }) {
  const [nickname, setNickname] = useState("");
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("cat");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit() {
    setState("sending");
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, nickname, petName, species, rating, text }),
    });
    setState(res.ok ? "sent" : "error");
    if (res.ok) setTimeout(onDone, 2200);
  }

  if (state === "sent") {
    return <p className="mt-3 rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage">Thanks! It will appear in the gallery after a quick check. 🐾</p>;
  }

  return (
    <form
      className="mt-3 rounded-xl bg-parchment/60 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-sm font-semibold">Show it in the gallery (optional)</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Your name" maxLength={40} className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral" />
        <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Pet's name" maxLength={40} className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral" />
        <select value={species} onChange={(e) => setSpecies(e.target.value)} className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral">
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="bird">Bird</option>
          <option value="fish">Fish</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other pet</option>
        </select>
      </div>
      <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`} className={n <= rating ? "text-gold" : "text-sand"}>
            <StarIcon className="h-5 w-5" />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        maxLength={600}
        placeholder="How did it turn out? (optional review)"
        className="mt-2 w-full resize-none rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral"
      />
      <div className="mt-2 flex items-center gap-2">
        <button type="submit" disabled={state === "sending"} className="btn-primary !px-4 !py-2 text-sm">
          {state === "sending" ? "Sending…" : "Submit"}
        </button>
        {state === "error" && <span className="text-xs text-coral-deep">Something went wrong — try again.</span>}
      </div>
    </form>
  );
}
