"use client";
// 一张已经生成的肖像。再买点数做更多张，或者做成礼物。
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header, Stepper } from "@/components/ui";
import { loadState, curPet, updateState } from "@/lib/store";
import { PLANS, creditsLeft, planOf, walletFields } from "@/lib/plan";
import { isPortrait } from "@/lib/guards";
import { pricePeriod } from "@/lib/site";
import { TemplateId } from "@/lib/catalog";

export default function PreviewPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const s = loadState();
  const pet = curPet(s);
  const anchor = isPortrait(pet?.anchorImage) ? pet!.anchorImage! : "";
  const tpl = s.selectedTemplate as TemplateId | null;
  const [, bump] = useState(0);
  const [payOff, setPayOff] = useState(false);
  useEffect(() => {
    if (!anchor) router.replace("/upload");
  }, [anchor, router]);

  const left = creditsLeft(s);
  const bullets = (tier: "studio" | "home") => [
    <li key="k">✔ {t("plan.packLine")}</li>,
    <li key="p">✔ {t("plan.petsLine").replace("{n}", String(PLANS[tier].pets))}</li>,
    <li key="r">✔ {t("plan.keep")}</li>,
  ];
  const checkout = async (tier: "studio" | "home") => {
    setPayOff(false);
    const res = await fetch("/api/wallet/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    if (res.status === 401) {
      window.location.href = "/login?next=/preview";
      return;
    }
    if (!res.ok) { setPayOff(true); return; }
    const w = await res.json();
    updateState({ paid: true, ...walletFields(w) });
    bump((n) => n + 1);
  };

  if (!anchor) return <><Header /><div className="page" /></>;
  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <Stepper cur={3} />
        <div className="pv-row">
          <div className="pv" style={{ width: "min(280px, 78%)" }}>
            <img src={anchor} alt="" />
            {overlay(tpl, pet?.name || "", pet?.breed || "", t("tpl.xmasW"))}
            {planOf(s) === "free" && <span className="wm">PetsDaily</span>}
          </div>
        </div>
        {s.intent ? <p className="ptitle" style={{ textAlign: "center", fontSize: 22 }}>{s.intent}</p> : null}
        <h1 className="ptitle" style={{ textAlign: "center" }}>{t("paywall.title")}</h1>
        <p className="psub" style={{ textAlign: "center" }}>{t("paywall.sub")}</p>
        <p className="psub" style={{ textAlign: "center" }}>{planOf(s) === "free" ? t("plan.left").replace("{n}", String(left)) : t("plan.packLine")}</p>
        {left > 0 && (
          <button className="btn bp" style={{ width: "100%", marginBottom: 14 }} onClick={() => router.push("/processing?n=" + Math.min(8, left))}>
            {t("plan.use").replace("{n}", String(Math.min(8, left)))}
          </button>
        )}
        {left < 1 && <p className="psub" style={{ textAlign: "center" }}>{t("plan.empty")}</p>}
        {payOff && <p className="psub" style={{ textAlign: "center" }}>{lang === "zh" ? "支付还没接上，现在不会扣款。" : "Checkout isn't charging yet."}</p>}
        <div className="tiercard card featured">
          <span className="badge">{t("paywall.badge")}</span>
          <div className="tn">{t("plan.studio")}</div>
          <div className="tp">${PLANS.studio.price}<span>{pricePeriod(lang)}</span></div>
          <ul>{bullets("studio")}</ul>
          <button className="btn bp" style={{ width: "100%" }} onClick={() => checkout("studio")}>{t("plan.buy").replace("{name}", t("plan.studio")).replace("{price}", String(PLANS.studio.price))}</button>
        </div>
        <div className="tiercard card">
          <div className="tn">{t("plan.home")}</div>
          <div className="tp">${PLANS.home.price}<span>{pricePeriod(lang)}</span></div>
          <ul>{bullets("home")}</ul>
          <button className="btn bp" style={{ width: "100%" }} onClick={() => checkout("home")}>{t("plan.buy").replace("{name}", t("plan.home")).replace("{price}", String(PLANS.home.price))}</button>
        </div>
        <button className="btn bs" style={{ width: "100%", marginTop: 12 }} onClick={() => router.push("/gift")}>{t("plan.gift")}</button>
      </div></div>
    </>
  );
}

function overlay(id: TemplateId | null, name: string, breed: string, xmas: string) {
  const nm = name.toUpperCase();
  if (id === "xmas") return <div className="tpl-script">{xmas}</div>;
  if (id === "poster") return <div className="tpl-big">{nm}</div>;
  if (id === "magazine") return <div className="tpl-bar">{nm} · SPECIAL</div>;
  if (id === "birthday") return <div className="tpl-script">🎂</div>;
  if (id === "idcard") return <div className="tpl-id"><b>{name}</b><br />{breed}</div>;
  return null;
}
