"use client";
// 锚点生成与确认（相似度的人工闸门）：生成 → 👍 进预览 / 👎 免费重画×1 → 用尽软着陆
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header, Stepper } from "@/components/ui";
import { loadState, updateState } from "@/lib/store";
import { planRequest } from "@/lib/flow";
import { getRefs } from "@/lib/refs";
import { isPortrait } from "@/lib/guards";

export default function AnchorPage() {
  const router = useRouter();
  const { t, tArr, lang } = useI18n();
  const [phase, setPhase] = useState<"gen" | "confirm">("gen");
  const [img, setImg] = useState("");
  const [prog, setProg] = useState(0);
  const [regenLeft, setRegenLeft] = useState(1);
  const [outOf, setOutOf] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fact, setFact] = useState(0);
  const started = useRef(false);

  const facts = tArr("anchor.facts");

  const run = useCallback(() => {
    setPhase("gen"); setProg(8); setFailed(false);
    const p1 = setTimeout(() => setProg(38), 500);
    const p2 = setTimeout(() => setProg(72), 1200);
    (async () => {
      try {
        const s = loadState();
        const res = await fetch("/api/generate/anchor", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planRequest(s, getRefs(), (i) => tArr("tags8")[i] || "")),
        });
        if (res.status === 401) {
          window.location.href = "/login?next=/anchor";
          return;
        }
        const data = await res.json();
        if (!res.ok || !isPortrait(data.anchorImage)) throw new Error(data.error);
        setImg(data.anchorImage); setProg(100);
        setTimeout(() => setPhase("confirm"), 350);
      } catch {
        setFailed(true); setProg(100);
        setTimeout(() => setPhase("confirm"), 350);
      }
    })();
    return () => { clearTimeout(p1); clearTimeout(p2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const cleanup = run();
    const iv = setInterval(() => setFact((f) => f + 1), 2200);
    return () => { clearInterval(iv); cleanup?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yes = () => {
    if (!isPortrait(img)) return;
    updateState((s) => ({
      pets: s.pets.map((p) => p.id === s.curPetId ? { ...p, hasAnchor: true, anchorImage: img } : p),
    }));
    router.push("/preview");
  };
  const no = () => {
    if (regenLeft > 0) { setRegenLeft(regenLeft - 1); started.current = false; run(); }
    else setOutOf(true);
  };

  const imgNode = isPortrait(img)
    ? <img src={img} alt="anchor" style={{ width: "100%" }} />
    : null;

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <Stepper cur={2} />
        <a className="backlink" onClick={() => router.push("/upload")}>← {t("common.back")}</a>
        {phase === "gen" ? (
          <div className="stage-card card">
            <h1 className="ptitle">{t("anchor.gen")}</h1>
            <div className="prog"><i style={{ width: `${prog}%` }} /></div>
            <div className="fact">{facts[fact % Math.max(1, facts.length)]}</div>
          </div>
        ) : failed ? (
          <div className="stage-card card">
            <h1 className="ptitle">{t("anchor.failT")}</h1>
            <p className="psub">{t("anchor.fail")}</p>
            <button className="btn bp" onClick={() => { started.current = false; run(); }}>{t("anchor.restart")}</button>
          </div>
        ) : (
          <div className="stage-card card">
            <h1 className="ptitle">{t("anchor.ready")}</h1>
            <div className="anchor-img" style={{ marginTop: 20 }}>{imgNode}</div>
            <div className="q">{t("anchor.q")}</div>
            <div className="btn-row f2">
              <button className="btn bp" onClick={yes}>👍 {t("anchor.yes")}</button>
              <button className="btn bs" onClick={no}>👎 {t("anchor.no")}</button>
            </div>
            <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--ink-soft)" }}>
              {t("anchor.retouch").replace("{n}", String(regenLeft))}
            </div>
          </div>
        )}
        {outOf && (
          <div className="card" style={{ padding: 20, marginTop: 16 }}>
            <h3 style={{ fontFamily: "var(--fd)" }}>{t("anchor.outT")}</h3>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", margin: "8px 0 14px" }}>{t("anchor.outB")}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn bp" style={{ flex: 1 }} disabled={!isPortrait(img)} onClick={yes}>{t("anchor.unlock")}</button>
              <button className="btn bs" style={{ flex: 1 }} onClick={() => router.push("/upload")}>{t("anchor.restart")}</button>
            </div>
          </div>
        )}
      </div></div>
    </>
  );
}
