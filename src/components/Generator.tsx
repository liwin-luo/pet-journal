"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n";
import type { Tpl } from "@/lib/templates";
import { CopyButton } from "./CopyButton";
import { ShareBar } from "./ShareBar";
import { DownloadIcon, LightbulbIcon, PaperclipIcon, PaletteIcon, PawIcon, RefreshIcon, ShareIcon, SparkIcon, StarIcon } from "./icons";

type HistItem = {
  imagePath: string;
  shareUrl: string;
  prompt: string;
  message: string;
  templateId?: string;
  createdAt: string;
};

type Msg = {
  id: number;
  text: string;
  images: string[];
  templateId?: string;
  status: "loading" | "done" | "error";
  result?: { image: string; imagePath?: string; prompt: string; shareUrl: string; left: number };
  error?: string;
};

const LOADING_CYCLE_MS = 2600;

type Labels = {
  topbar: string;
  topbarSession: string;
  freeCount: string;
  uploadTitle: string;
  ideasLabel: string;
  ideas: string[];
  tplLabel: string;
  browseAll: string;
  placeholder: string;
  helper: string;
};

type Props = {
  featured: Tpl[];
  user: { name?: string; email: string } | null;
  locale: string;
  gen: Dict["gen"];
  labels: Labels;
};

const iconBtn =
  "flex h-9 items-center gap-1.5 rounded-full border border-sand bg-cream px-3 text-xs font-medium text-coffee transition-colors hover:border-coral hover:text-coral";

export function Generator({ featured, user, locale, gen, labels }: Props) {
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
  const [ideasOpen, setIdeasOpen] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);
  const [hist, setHist] = useState<HistItem[]>([]);
  const [histSel, setHistSel] = useState<string | null>(null);
  const [histSignIn, setHistSignIn] = useState(false);
  const idRef = useRef(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const P = (path: string) => (locale === "en" ? path : `/${locale}${path}`);

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
    const t = setInterval(() => setLoadingLine((n) => (n + 1) % gen.loading.length), LOADING_CYCLE_MS);
    return () => clearInterval(t);
  }, [msgs, gen.loading.length]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  // 生成历史：登录状态变化或新生成后刷新（同一浏览器登录前后都能找回图）
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      const data = (await res.json()) as { items?: HistItem[] };
      setHist(data.items ?? []);
    } catch {
      // 历史加载失败不影响生成
    }
  }, []);
  useEffect(() => {
    loadHistory();
  }, [loadHistory, user]);

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
    setIdeasOpen(false);
    setTplOpen(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, templateId, imageIds: images.map((u) => u.split("/").pop()) }),
      });
      const data = (await res.json()) as Msg["result"] & { error?: string };
      if (!res.ok || !data?.image) throw new Error(data?.error || "Generation failed");
      setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, status: "done", result: data } : m)));
      loadHistory();
    } catch (err) {
      setMsgs((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "error", error: err instanceof Error ? err.message : "Failed" } : m)),
      );
    }
  }

  async function fetchDownload(path: string): Promise<boolean> {
    const res = await fetch(path);
    if (res.status === 401) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pet-portrait.jpg";
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }

  async function download(id: number, result: Msg["result"]) {
    if (!result) return;
    const ok = await fetchDownload(result.imagePath || result.image);
    if (!ok) setSignInFor(id);
  }

  const hasHistory = msgs.length > 0;
  const loading = msgs.some((m) => m.status === "loading");

  return (
    <div
      id="create"
      className="card overflow-hidden !rounded-big"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files?.length) pickFiles(e.dataTransfer.files);
      }}
    >
      {/* 顶栏 */}
      <div className="flex items-center justify-between border-b border-sand/70 bg-parchment/70 px-5 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white">
            <PawIcon className="h-4 w-4" />
          </span>
          {hasHistory ? labels.topbarSession : labels.topbar}
        </p>
        <span className="text-xs text-fog">{labels.freeCount}</span>
      </div>

      {/* 对话区 */}
      {hasHistory && (
        <div className="max-h-[480px] overflow-y-auto px-5 py-4" ref={chatRef}>
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
                <p className="text-sm">{m.text || <em className="text-coffee">({gen.styles})</em>}</p>
                {m.templateId && (
                  <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-coral">
                    ✦ {m.templateId} {labels.tplLabel}
                  </span>
                )}
              </div>
              {/* 助手气泡 */}
              <div className="mt-3 max-w-[92%]">
                {m.status === "loading" && (
                  <div className="flex items-center gap-3 rounded-2xl rounded-tl-md bg-parchment px-4 py-3 text-sm text-coffee">
                    <PawIcon className="h-5 w-5 text-coral bounce-soft" />
                    {gen.loading[loadingLine]}
                    <span className="ml-auto text-xs text-fog">~30s</span>
                  </div>
                )}
                {m.status === "error" && (
                  <div className="rounded-2xl rounded-tl-md border border-coral/40 bg-coral-soft/60 px-4 py-3 text-sm text-coral-deep">
                    {m.error}{" "}
                    <button className="font-semibold underline" onClick={() => generate(m.text, m.images, m.templateId)}>
                      {gen.regen}
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
                          <DownloadIcon className="h-4 w-4" /> {gen.download}
                        </button>
                      ) : (
                        <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => setSignInFor(signInFor === m.id ? null : m.id)}>
                          <DownloadIcon className="h-4 w-4" /> {gen.signInTitle}
                        </button>
                      )}
                      <button
                        className="btn-ghost !py-2 text-sm"
                        onClick={() => generate(m.text, m.images, m.templateId)}
                        title={gen.regenTip}
                      >
                        <RefreshIcon className="h-4 w-4" /> {gen.regen}
                      </button>
                      <CopyButton text={m.result.prompt} label={gen.copyPrompt} />
                      <button
                        className="btn-ghost !py-2 text-sm"
                        onClick={() => setShareOpenFor(shareOpenFor === m.id ? null : m.id)}
                      >
                        <ShareIcon className="h-4 w-4" /> {gen.share}
                      </button>
                      <button
                        className="btn-ghost !py-2 text-sm"
                        onClick={() => setShareFor(shareFor === m.id ? null : m.id)}
                      >
                        <StarIcon className="h-4 w-4 text-gold" /> {gen.postGallery}
                      </button>
                    </div>
                    {signInFor === m.id && !user && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-parchment/70 px-4 py-3 text-sm text-coffee">
                        {gen.signInBody}
                        <Link href={P("/login?next=/")} className="btn-primary !px-4 !py-2 text-sm">
                          {gen.signInBtn}
                        </Link>
                      </div>
                    )}
                    {shareOpenFor === m.id && m.result && (
                      <div className="mt-3 rounded-xl bg-parchment/60 p-4">
                        <p className="text-sm font-semibold">{gen.shareTitle}</p>
                        <p className="mb-3 mt-1 text-xs text-fog">{gen.shareNote}</p>
                        <ShareBar
                          url={`${window.location.origin}${P(m.result.shareUrl)}`}
                          imageUrl={
                            m.result.imagePath
                              ? `${window.location.origin}${m.result.imagePath}?st=${m.result.shareUrl.split("/").pop()}`
                              : undefined
                          }
                          fileShareSrc={m.result.image}
                          text={gen.shareText}
                        />
                      </div>
                    )}
                    {shareFor === m.id && (
                      <ShareForm image={m.result.imagePath || m.result.image} gen={gen} onDone={() => setShareFor(null)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 输入区（始终显示） */}
      <div className="border-t border-sand/70 bg-white px-5 py-4">
        {/* 附件缩略图 */}
        {!!files.length && (
          <div className="mb-2 flex flex-wrap gap-2">
            {files.map((f) => (
              <span key={f.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt="Attached pet photo" className="h-12 w-12 rounded-lg border border-sand object-cover" />
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
        {/* 已选模板 */}
        {tpl && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
              {tpl.name}
              <button onClick={() => setTpl(null)} aria-label="Clear template">×</button>
            </span>
          </div>
        )}
        {/* 功能图标行 */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => pickFiles(e.target.files)}
          />
          <button type="button" className={iconBtn} onClick={() => fileRef.current?.click()} disabled={files.length >= 4 || busyFiles} title={labels.uploadTitle} aria-label={labels.uploadTitle}>
            <PaperclipIcon className="h-4 w-4" /> {gen.photo}
          </button>
          <button
            type="button"
            onClick={() => {
              setIdeasOpen(!ideasOpen);
              setTplOpen(false);
            }}
            aria-expanded={ideasOpen}
            title={labels.ideasLabel}
            aria-label={labels.ideasLabel}
            className={`${iconBtn} ${ideasOpen ? "!border-coral !text-coral" : ""}`}
          >
            <LightbulbIcon className="h-4 w-4" /> {gen.ideas}
          </button>
          <button
            type="button"
            onClick={() => {
              setTplOpen(!tplOpen);
              setIdeasOpen(false);
            }}
            aria-expanded={tplOpen}
            title={labels.tplLabel}
            aria-label={labels.tplLabel}
            className={`${iconBtn} ${tplOpen ? "!border-coral !text-coral" : ""}`}
          >
            <PaletteIcon className="h-4 w-4" /> {gen.styles}
          </button>
        </div>
        {/* 灵感面板 */}
        {ideasOpen && (
          <div className="mb-2 rounded-xl border border-sand bg-cream px-3 py-2.5">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-fog">{labels.ideasLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {labels.ideas.map((idea) => (
                <button
                  key={idea}
                  onClick={() => {
                    setInput(idea);
                    setIdeasOpen(false);
                  }}
                  className="rounded-full border border-sand bg-white px-3 py-1.5 text-xs font-medium text-coffee transition-colors hover:border-coral hover:text-coral"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* 模板面板 */}
        {tplOpen && (
          <div className="mb-2 max-h-44 overflow-y-auto rounded-xl border border-sand bg-cream px-3 py-2.5">
            <div className="flex flex-wrap gap-1.5">
              {featured.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTpl(t);
                    setTplOpen(false);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    tpl?.id === t.id ? "bg-coral text-white" : "border border-sand bg-white text-coffee hover:border-coral hover:text-coral"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
            <Link href={P("/templates")} className="mt-2 inline-block text-xs font-semibold text-coral hover:underline">
              {labels.browseAll}
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
            placeholder={hasHistory ? gen.placeholders[0] : labels.placeholder}
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-sand bg-cream px-4 py-3 text-sm outline-none transition-colors placeholder:text-fog focus:border-coral"
          />
          <button
            className="btn-primary !px-5"
            disabled={loading || busyFiles || (!input.trim() && !files.length && !tpl)}
            onClick={() => generate(input.trim(), files.map((f) => f.url), tpl?.id)}
          >
            <SparkIcon className="h-4 w-4" />
            {loading ? gen.painting : gen.generate}
          </button>
        </div>
        <p className="mt-2 text-xs text-fog">{labels.helper}</p>
      </div>

      {/* 历史区：同一浏览器/账号生成过的图都在这里，登录前后都能找回 */}
      {hist.length > 0 && (
        <div className="border-t border-sand/70 bg-parchment/40 px-5 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-fog">{gen.histTitle}</span>
            {hist.map((h) => (
              <button
                key={h.imagePath}
                onClick={() => {
                  setHistSel(histSel === h.imagePath ? null : h.imagePath);
                  setHistSignIn(false);
                }}
                className={`shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  histSel === h.imagePath ? "border-coral" : "border-transparent hover:border-sand"
                }`}
                aria-label={gen.histOpen}
                title={h.message || gen.histOpen}
              >
                <img src={h.imagePath} alt={h.message || "Generated pet picture"} className="h-16 w-16 object-cover" />
              </button>
            ))}
            <Link href={P("/library")} className="shrink-0 whitespace-nowrap text-xs font-semibold text-coral hover:underline">
              {gen.viewAll}
            </Link>
          </div>
          {histSel &&
            (() => {
              const h = hist.find((x) => x.imagePath === histSel);
              if (!h) return null;
              return (
                <div className="mt-3 rounded-xl border border-sand/70 bg-white p-3">
                  <img src={h.imagePath} alt={h.message || "Generated pet picture"} className="mx-auto max-h-72 rounded-lg" />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {user ? (
                      <button
                        className="btn-primary !px-4 !py-2 text-sm"
                        onClick={async () => {
                          const ok = await fetchDownload(h.imagePath);
                          if (!ok) setHistSignIn(true);
                        }}
                      >
                        <DownloadIcon className="h-4 w-4" /> {gen.download}
                      </button>
                    ) : (
                      <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => setHistSignIn(!histSignIn)}>
                        <DownloadIcon className="h-4 w-4" /> {gen.signInTitle}
                      </button>
                    )}
                    <CopyButton text={h.prompt} label={gen.copyPrompt} />
                    <a href={P(h.shareUrl)} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2 text-sm">
                      <ShareIcon className="h-4 w-4" /> {gen.sharePage}
                    </a>
                  </div>
                  {histSignIn && !user && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-parchment/70 px-4 py-3 text-sm text-coffee">
                      {gen.signInBody}
                      <Link href={P("/login?next=/")} className="btn-primary !px-4 !py-2 text-sm">
                        {gen.signInBtn}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      )}
    </div>
  );
}

/** 生成结果投稿表单（评价 + 作品进画廊，先审后显） */
function ShareForm({ image, gen, onDone }: { image: string; gen: Dict["gen"]; onDone: () => void }) {
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
    return <p className="mt-3 rounded-xl bg-sage-soft px-4 py-3 text-sm text-sage">{gen.thanks}</p>;
  }

  return (
    <form
      className="mt-3 rounded-xl bg-parchment/60 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-sm font-semibold">{gen.formTitle}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={gen.yourName} maxLength={40} className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral" />
        <input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder={gen.petName} maxLength={40} className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral" />
        <select value={species} onChange={(e) => setSpecies(e.target.value)} className="rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral">
          <option value="cat">{gen.species.cat}</option>
          <option value="dog">{gen.species.dog}</option>
          <option value="bird">{gen.species.bird}</option>
          <option value="fish">{gen.species.fish}</option>
          <option value="rabbit">{gen.species.rabbit}</option>
          <option value="other">{gen.species.other}</option>
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
        placeholder={gen.reviewPh}
        className="mt-2 w-full resize-none rounded-lg border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-coral"
      />
      <div className="mt-2 flex items-center gap-2">
        <button type="submit" disabled={state === "sending"} className="btn-primary !px-4 !py-2 text-sm">
          {state === "sending" ? gen.sending : gen.submit}
        </button>
        {state === "error" && <span className="text-xs text-coral-deep">{gen.err}</span>}
      </div>
    </form>
  );
}
