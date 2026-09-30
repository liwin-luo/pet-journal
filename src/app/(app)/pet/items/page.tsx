"use client";
// 建宠物子步骤②：心爱之物选做（玩具/领巾/毯子，最多 3 件）
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { updateState, loadState, curPet } from "@/lib/store";
import { KeepsakeType } from "@/lib/types";

const DEFS: { k: KeepsakeType; ic: string }[] = [
  { k: "toy", ic: "🎾" }, { k: "bandana", ic: "🧣" }, { k: "blanket", ic: "🛏️" },
];

export default function ItemsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [items, setItems] = useState<Record<KeepsakeType, boolean>>(
    () => curPetItems()
  );
  const n = Object.values(items).filter(Boolean).length;

  const toggle = (k: KeepsakeType) => {
    const next = { ...items, [k]: !items[k] };
    setItems(next);
    updateState((s) => ({ pets: s.pets.map((p) => p.id === s.curPetId ? { ...p, items: next } : p) }));
  };

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <h1 className="ptitle">{t("items.title")}</h1>
        <p className="psub">{t("items.sub")}</p>
        <div style={{ marginTop: 20 }}>
          {DEFS.map(({ k, ic }) => (
            <div className={`itemcard card ${items[k] ? "done" : ""}`} key={k}>
              <div className="ic-big">{ic}</div>
              <div style={{ flex: 1 }}>
                <b>{t(`items.${k}`)}</b>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t(`items.${k}D`)}</div>
              </div>
              <button className={`btn ${items[k] ? "bp" : "bs"} btn-sm`} onClick={() => toggle(k)}>
                {items[k] ? t("items.added") : t("items.add")}
              </button>
            </div>
          ))}
        </div>
        <button className="btn bp" style={{ width: "100%", marginTop: 6 }} onClick={() => router.push("/create")}>
          {n ? t("items.contN").replace("{n}", String(n)) : t("common.cont")}
        </button>
        <a className="skiplink" onClick={() => router.push("/create")}>{t("items.skip")}</a>
      </div></div>
    </>
  );
}
function curPetItems() {
  const p = curPet(loadState());
  return p?.items ?? { toy: false, bandana: false, blanket: false };
}
