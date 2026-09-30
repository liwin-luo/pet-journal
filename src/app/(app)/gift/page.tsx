"use client";
// 礼物编排：收件人 → 贺卡 → 确认。定时信息写入礼物记录，收礼页按 token 读取。
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header, PetSwitch } from "@/components/ui";
import { loadState, updateState, curPet } from "@/lib/store";
import { isPortrait } from "@/lib/guards";

export default function GiftPage() {
  const router = useRouter();
  const { t, tArr, lang } = useI18n();
  const pet = curPet(loadState());
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [when, setWhen] = useState("now");
  const [card, setCard] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const tpls = tArr("gift.tpl");

  const whenText = when === "now" ? t("gift.now") : when === "xmas" ? t("gift.xmas") : when;

  const polish = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/gift/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, lang, petName: pet?.name || "" }),
      });
      if (res.status === 401) {
        window.location.href = "/login?next=/gift";
        return;
      }
      const data = await res.json();
      if (data.text) setCard(data.text);
    } finally { setBusy(false); }
  };

  const publish = async () => {
    setBusy(true);
    try {
      const s = loadState();
      const target = s.orders.find((o) => o.petId === (pet?.id ?? s.curPetId) && o.images?.some(isPortrait)) ?? s.orders[0];
      const id = "g_" + Date.now().toString(36);
      const images = (target?.images ?? []).filter(isPortrait);
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: id, toName: name.trim(), email: email.trim(), when,
          card: card.trim(), petName: pet?.name || "", images,
        }),
      });
      if (!res.ok || !target) return;
      updateState((st) => ({
        orders: st.orders.map((o) => o.id === target.id ? {
          ...o, gift: { token: id, toName: name.trim(), email: email.trim(), when, card: card.trim() },
        } : o),
      }));
      setToken(id);
      setStep(4);
    } finally { setBusy(false); }
  };

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        {step === 1 && (
          <>
            <PetSwitch />
            <h1 className="ptitle">{t("gift.qwho")}</h1>
            <div className="fld" style={{ marginTop: 20 }}>
              <label>{t("gift.name")}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex" />
            </div>
            <div className="fld">
              <label>{t("gift.email")}</label>
              <input type="email" value={email} placeholder="alex@example.com" onChange={(e) => { setEmail(e.target.value); setEmailErr(false); }} />
              {emailErr ? <div className="hint">{t("gift.needEmail")}</div> : null}
            </div>
            <div className="fld">
              <label>{t("gift.when")}</label>
              <input type="date" value={when !== "now" && when !== "xmas" ? when : ""} onChange={(e) => setWhen(e.target.value || "now")} />
              <div className="presets">
                <button className={`chip ${when === "now" ? "p" : ""}`} onClick={() => setWhen("now")}>{t("gift.now")}</button>
                <button className={`chip ${when === "xmas" ? "p" : ""}`} onClick={() => setWhen("xmas")}>{t("gift.xmas")}</button>
              </div>
            </div>
            <button className="btn bp" style={{ width: "100%" }} onClick={() => {
              if (!email.includes("@")) { setEmailErr(true); return; }
              setStep(2);
            }}>{t("common.cont")}</button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="ptitle">{t("gift.qcard")}</h1>
            <div className="tcards" style={{ marginTop: 20 }}>
              {tpls.map((c, i) => (
                <div className="tcard" key={i} onClick={() => setCard(c)}>{c}</div>
              ))}
            </div>
            <div className="fld" style={{ marginTop: 16 }}>
              <label>{t("gift.own")}</label>
              <textarea rows={3} value={card} onChange={(e) => setCard(e.target.value)} />
              <button className="btn bg1 btn-sm" style={{ marginTop: 10 }} disabled={busy} onClick={polish}>
                {busy ? "…" : t("gift.polish")}
              </button>
            </div>
            <div className="gift-preview">
              <div className="hand">{card || "…"}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn bs" style={{ flex: 1 }} onClick={() => setStep(1)}>{t("common.back")}</button>
              <button className="btn bp" style={{ flex: 2 }} onClick={() => setStep(3)}>{t("common.cont")}</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="ptitle">{t("gift.qfinal")}</h1>
            <div className="card" style={{ padding: "8px 18px", marginTop: 20 }}>
              <div className="sumrow"><span>{t("gift.sTo")}</span><b>{name || "—"}</b></div>
              <div className="sumrow"><span>{t("gift.email")}</span><b>{email}</b></div>
              <div className="sumrow"><span>{t("gift.sWhen")}</span><b>{whenText}</b></div>
              <div className="sumrow"><span>{t("gift.sCard")}</span><b style={{ fontFamily: "var(--fh)", fontSize: 17 }}>{card}</b></div>
            </div>
            <button className="btn bp" style={{ width: "100%", marginTop: 22 }} disabled={busy} onClick={publish}>
              {busy ? "…" : t("gift.schedule")}
            </button>
          </>
        )}
        {step === 4 && (
          <>
            <h1 className="ptitle" style={{ textAlign: "center", marginTop: 10 }}>{t("gift.doneT")}</h1>
            <p className="psub" style={{ textAlign: "center", marginTop: 8 }}>{t("gift.doneB")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
              <button className="btn bp" onClick={() => router.push("/g/" + token)}>{t("gift.previewRec")}</button>
              <button className="btn bs" onClick={() => router.push("/library")}>{t("gift.viewGal")}</button>
            </div>
          </>
        )}
      </div></div>
    </>
  );
}
