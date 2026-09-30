"use client";
// 收礼人页：免登录，没有购买导航。信封 → 贺卡 → 画廊。
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useI18n } from "@/components/I18n";

interface GiftView {
  toName: string;
  when: string;
  card: string;
  petName: string;
  images: string[];
}

export default function RecipientPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useI18n();
  const [gift, setGift] = useState<GiftView | null>(null);
  const [missing, setMissing] = useState(false);
  const [stage, setStage] = useState(1);

  useEffect(() => {
    if (!token) return;
    fetch("/api/gift/" + token)
      .then(async (res) => {
        if (!res.ok) { setMissing(true); return; }
        setGift(await res.json());
      })
      .catch(() => setMissing(true));
  }, [token]);

  if (missing) {
    return <div className="page"><p className="psub" style={{ textAlign: "center" }}>{t("lib.empty")}</p></div>;
  }
  if (!gift) return <div className="page" />;

  const pet = gift.petName || t("rcv.gal");
  return (
    <div className="page">
      {stage === 1 && (
        <div className="env-stage">
          <div className="tagline">{t("rcv.tag")}{gift.toName ? ` · ${gift.toName}` : ""}</div>
          <div className="env" onClick={() => setStage(2)}>·</div>
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t("rcv.tap")}</div>
        </div>
      )}
      {stage === 2 && (
        <div className="env-stage">
          <div className="card-reveal">
            <div className="hand">{gift.card || "…"}</div>
            <div className="from">{pet}</div>
          </div>
          <button className="btn bp" onClick={() => setStage(3)}>{t("rcv.open")}</button>
        </div>
      )}
      {stage === 3 && (
        <div className="wrap-wide">
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <h1 className="ptitle" style={{ marginTop: 6 }}>{pet}</h1>
          </div>
          {gift.images.length > 0 && (
            <div className="masonry">
              {gift.images.map((src, i) => (
                <div className="mitem" key={i} style={{ background: "#54382C" }}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          )}
          {gift.images[0] && (
            <div style={{ marginTop: 22 }}>
              <a className="btn bp" href={gift.images[0]} download="petpics.jpg">{t("rcv.dl")}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
