"use client";
// 付款后的成图。数量跟接口实际返回走，失败就停在这一页，不把空订单标成完成。
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { loadState, updateState } from "@/lib/store";
import { citedPets, groupCtx } from "@/lib/flow";
import { STYLE_PROMPTS, templatePrompt } from "@/lib/catalog";
import { isPortrait } from "@/lib/guards";
import { creditsLeft, walletFields } from "@/lib/plan";

export default function ProcessingPage() {
  const router = useRouter();
  const { t, tArr } = useI18n();
  const [images, setImages] = useState<string[]>([]);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const [nextGift, setNextGift] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [tryN, setTryN] = useState(0);

  useEffect(() => {
    setNextGift(new URLSearchParams(location.search).get("next") === "gift");
    const s = loadState();
    const asked = Number(new URLSearchParams(location.search).get("n") || 1);
    const count = Math.min(8, creditsLeft(s), Math.max(1, asked || 1));
    if (count < 1) { router.replace("/preview"); return; }
    const group = citedPets(s);
    const tagNames = tArr("tags8");
    let cancel = false;
    (async () => {
      try {
        const res = await fetch("/api/generate/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            count,
            anchorImage: group[0]?.anchorImage,
            templatePrompt: templatePrompt(s.selectedTemplate),
            stylePrompt: s.selectedTemplate ? undefined : (s.selectedStyle != null ? STYLE_PROMPTS[s.selectedStyle] : undefined),
            pet: groupCtx(group, (p) => p.tags.map((i) => tagNames[i]).filter(Boolean)),
          }),
        });
        if (res.status === 401) {
          window.location.href = "/login?next=" + encodeURIComponent(location.pathname + location.search);
          return;
        }
        if (res.status === 402) {
          const data = await res.json().catch(() => ({}));
          if (typeof data.credits === "number") {
            updateState(walletFields(data));
          }
          router.replace("/preview");
          return;
        }
        const data = await res.json();
        const imgs: string[] = (data.images ?? []).filter(isPortrait);
        if (!res.ok || !imgs.length) throw new Error(data.error || "empty");
        if (cancel) return;
        if (data.plan || typeof data.credits === "number") {
          updateState(walletFields(data));
        }
        const kept = imgs;
        const id = "ord_" + Date.now();
        setOrderId(id);
        updateState((st) => ({
          orders: [{
            id,
            tier: "studio" as const,
            amount: 0,
            petId: group[0]?.id ?? st.curPetId ?? "",
            createdAt: Date.now(),
            status: "done" as const,
            images: kept,
          }, ...st.orders],
        }));
        setImages(kept);
      } catch {
        if (!cancel) setErr(true);
      }
    })();
    return () => { cancel = true; };
    // tryN 是唯一的重试开关；t/tArr 每次渲染都是新函数，放进依赖会把请求取消掉
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tryN]);

  useEffect(() => {
    if (!images.length) return;
    const iv = setInterval(() => setN((x) => {
      if (x + 1 >= images.length) { clearInterval(iv); setDone(true); }
      return Math.min(images.length, x + 1);
    }), 140);
    return () => clearInterval(iv);
  }, [images]);

  useEffect(() => {
    if (!done) return;
    const cols = ["#E0715C", "#D4A857", "#8FA98F"];
    const nodes: HTMLDivElement[] = [];
    for (let i = 0; i < 24; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.textContent = "·";
      c.style.left = Math.random() * 100 + "vw";
      c.style.animationDuration = 1.4 + Math.random() * 1.6 + "s";
      c.style.color = cols[i % 3];
      document.body.appendChild(c);
      nodes.push(c);
    }
    const timer = setTimeout(() => nodes.forEach((c) => c.remove()), 3600);
    return () => { clearTimeout(timer); nodes.forEach((c) => c.remove()); };
  }, [done]);

  const total = images.length || 8;
  return (
    <>
      <Header />
      <div className="page"><div className="wrap" style={{ textAlign: "center" }}>
        <h1 className="ptitle" style={{ margin: "8px 0 4px" }}>{err ? t("anchor.gen") : t("proc.celeb")}</h1>
        {err ? (
          <div style={{ marginTop: 18 }}>
            <p className="psub">{t("proc.fail")}</p>
            <button className="btn bp" onClick={() => { setErr(false); setTryN((x) => x + 1); }}>{t("anchor.restart")}</button>
          </div>
        ) : (
          <>
            <div className="count-big">{n} / {total}</div>
            <div className="mini-grid">
              {Array.from({ length: total }, (_, i) => (
                <div className="mini" key={i} style={{ background: "#54382C", opacity: i < n ? 1 : 0.08, transform: i < n ? "scale(1)" : "scale(.7)" }} />
              ))}
            </div>
            {done && (
              <div style={{ marginTop: 26 }}>
                <button className="btn bp" onClick={() => router.push(nextGift ? "/gift" : orderId ? `/library/${orderId}/0` : "/library")}>
                  {nextGift ? t("common.cont") : t("proc.view")}
                </button>
              </div>
            )}
          </>
        )}
      </div></div>
    </>
  );
}
