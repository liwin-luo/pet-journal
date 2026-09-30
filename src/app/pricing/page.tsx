"use client";
import { useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { useI18n } from "@/components/I18n";
import { FREE_MONTH, PLANS, walletFields } from "@/lib/plan";
import { pricePeriod } from "@/lib/site";
import { updateState } from "@/lib/store";

export default function PricingPage() {
  const { t, lang } = useI18n();
  const [note, setNote] = useState("");
  const buy = async (tier: "studio" | "home") => {
    setNote("");
    const res = await fetch("/api/wallet/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    if (res.status === 401) {
      window.location.href = "/login?next=/pricing";
      return;
    }
    if (!res.ok) {
      setNote(lang === "zh" ? "支付还没接上，现在不会扣款。" : "Checkout isn't charging yet.");
      return;
    }
    updateState({ paid: true, ...walletFields(await res.json()) });
    window.location.href = "/create";
  };
  return (
    <SiteChrome>
      <section className="block" id="pricing">
        <div className="container">
          <h1 className="sec-head">{t("land.priceT")}</h1>
          <p className="sub">{t("land.price")}</p>
          <div className="price-grid">
            <div className="card tiercard">
              <div className="tn">{t("plan.free")}</div>
              <div className="tp">$0</div>
              <ul>
                <li>✔ {t("plan.petsLine").replace("{n}", String(PLANS.free.pets))}</li>
                <li>✔ {t("plan.freeMonth").replace("{n}", String(FREE_MONTH))}</li>
              </ul>
              <a className="btn bs" href="/create">{t("land.cta")}</a>
            </div>
            <div className="card tiercard featured">
              <span className="badge">{t("paywall.badge")}</span>
              <div className="tn">{t("plan.studio")}</div>
              <div className="tp">${PLANS.studio.price}<span>{pricePeriod(lang)}</span></div>
              <ul>
                <li>✔ {t("plan.petsLine").replace("{n}", String(PLANS.studio.pets))}</li>
                <li>✔ {t("plan.packLine")}</li>
                <li>✔ {t("plan.keep")}</li>
              </ul>
              <button className="btn bp" onClick={() => buy("studio")}>{t("plan.buy").replace("{name}", t("plan.studio")).replace("{price}", String(PLANS.studio.price))}</button>
            </div>
            <div className="card tiercard">
              <div className="tn">{t("plan.home")}</div>
              <div className="tp">${PLANS.home.price}<span>{pricePeriod(lang)}</span></div>
              <ul>
                <li>✔ {t("plan.petsLine").replace("{n}", String(PLANS.home.pets))}</li>
                <li>✔ {t("plan.packLine")}</li>
                <li>✔ {t("plan.keep")}</li>
              </ul>
              <button className="btn bs" onClick={() => buy("home")}>{t("plan.buy").replace("{name}", t("plan.home")).replace("{price}", String(PLANS.home.price))}</button>
            </div>
          </div>
          {note && <p className="sub" style={{ textAlign: "center" }}>{note}</p>}
        </div>
      </section>
    </SiteChrome>
  );
}
