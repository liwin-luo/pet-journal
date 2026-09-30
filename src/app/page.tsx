"use client";
// 落地页：对照 preview/landing.html 的首屏、对比、三步、礼物和价格。文案跟现在的点数包走。
import { useRef } from "react";
import { useI18n } from "@/components/I18n";
import { SiteChrome } from "@/components/SiteChrome";
import { FREE_MONTH, PLANS } from "@/lib/plan";
import { pricePeriod, siteCopy } from "@/lib/site";

const PAIRS = [
  { before: "/land/dog.jpg", src: "/land/dog-glance.jpg", cap: "land.rage" },
  { before: "/land/cat.jpg", src: "/land/cat-suit.jpg", cap: "land.office" },
  { before: "/land/bird.jpg", src: "/land/bird-seat.jpg", cap: "land.job" },
  { before: "/land/fish.jpg", src: "/land/fish-cute.jpg", cap: "land.sticker" },
];

function Slider({ before, src, cap }: { before: string; src: string; cap: string }) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const move = (x: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(92, Math.max(8, ((x - r.left) / r.width) * 100));
    el.style.setProperty("--pos", `${p}%`);
  };
  return (
    <div
      className="ba"
      ref={box}
      role="slider"
      aria-label={t(cap)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={42}
      tabIndex={0}
      onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
      onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX); }}
      onKeyDown={(e) => {
        const el = box.current;
        if (!el) return;
        const cur = parseFloat(el.style.getPropertyValue("--pos")) || 42;
        if (e.key === "ArrowLeft") el.style.setProperty("--pos", `${Math.max(8, cur - 6)}%`);
        if (e.key === "ArrowRight") el.style.setProperty("--pos", `${Math.min(92, cur + 6)}%`);
      }}
    >
      <div className="ba-layer ba-after">
        <img src={src} alt="" draggable={false} />
        <span className="ba-cap">{t(cap)}</span>
      </div>
      <div className="ba-clip">
        <div className="ba-layer ba-before">
          <img src={before} alt="" draggable={false} />
          <span className="ba-cap dark">{t("land.before")}</span>
        </div>
      </div>
      <div className="ba-handle" />
    </div>
  );
}

export default function Home() {
  const { t, lang } = useI18n();
  const c = siteCopy(lang);
  return (
    <SiteChrome>

      <section className="block">
        <div className="container">
          <h1>{t("land.h1")} <em>{t("land.em")}</em></h1>
          <p className="sub">{t("land.sub")}</p>
          <div className="land-cta">
            <a className="btn bp" href="/create">{t("land.cta")}</a>
            <a className="btn bs" href="#how">{t("land.cta2")}</a>
          </div>
          <p className="price-line">{t("land.price")}</p>
          <div className="ba-grid">
            {PAIRS.map((p) => <Slider key={p.src} before={p.before} src={p.src} cap={p.cap} />)}
          </div>
        </div>
      </section>

      <section className="block" id="how" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="sec-head">{t("land.how")}</h2>
          <div className="how-grid">
            <div className="card how-card"><b>1</b><h3>{t("land.s1")}</h3><p>{t("land.s1d")}</p></div>
            <div className="card how-card"><b>2</b><h3>{t("land.s2")}</h3><p>{t("land.s2d")}</p></div>
            <div className="card how-card"><b>3</b><h3>{t("land.s3")}</h3><p>{t("land.s3d")}</p></div>
          </div>
        </div>
      </section>

      <section className="block" id="gift" style={{ paddingTop: 0 }}>
        <div className="container land-gift">
          <div>
            <h2>{t("land.giftT")}</h2>
            <p className="sub">{t("land.giftL")}</p>
            <a className="btn bg1" href="/gift">{t("plan.gift")}</a>
          </div>
          <div className="card gift-note">
            <img src="/land/fish-cute.jpg" alt="" />
            <p>{t("land.card")}</p>
          </div>
        </div>
      </section>

      <section className="block" id="pricing" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="sec-head">{t("land.priceT")}</h2>
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
              <a className="btn bp" href="/pricing">{t("plan.buy").replace("{name}", t("plan.studio")).replace("{price}", String(PLANS.studio.price))}</a>
            </div>
            <div className="card tiercard">
              <div className="tn">{t("plan.home")}</div>
              <div className="tp">${PLANS.home.price}<span>{pricePeriod(lang)}</span></div>
              <ul>
                <li>✔ {t("plan.petsLine").replace("{n}", String(PLANS.home.pets))}</li>
                <li>✔ {t("plan.packLine")}</li>
                <li>✔ {t("plan.keep")}</li>
              </ul>
              <a className="btn bs" href="/pricing">{t("plan.buy").replace("{name}", t("plan.home")).replace("{price}", String(PLANS.home.price))}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="faq" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="sec-head">{c.faqTitle}</h2>
          <div className="faq-list">
            {c.faqs.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
