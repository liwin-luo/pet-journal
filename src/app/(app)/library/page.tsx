"use client";
// 作品库：默认所有宠物最近一套写真。过滤后才只看一只。
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18n";
import { Header, PetFilter } from "@/components/ui";
import { loadState } from "@/lib/store";
import { isPortrait } from "@/lib/guards";
import { AppState } from "@/lib/types";

type Shot = { src: string; petName: string; orderId: string; index: number };

function shotsOf(s: AppState, petId: string): Shot[] {
  const pets = petId ? s.pets.filter((p) => p.id === petId) : s.pets;
  const out: Shot[] = [];
  for (const p of pets) {
    const order = s.orders.find((o) => o.petId === p.id && o.images?.some(isPortrait));
    order?.images.forEach((src, index) => {
      if (isPortrait(src)) out.push({ src, petName: p.name || "—", orderId: order.id, index });
    });
  }
  return out;
}

export default function LibraryPage() {
  const { t } = useI18n();
  const [pack, setPack] = useState<AppState | null>(null);
  const [filter, setFilter] = useState("");
  useEffect(() => { setPack(loadState()); }, []);

  const images = pack ? shotsOf(pack, filter) : [];

  return (
    <>
      <Header />
      <div className="page"><div className="wrap-wide">
        <PetFilter value={filter} onChange={setFilter} />
        <div className="lib-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div>
            <h1 className="ptitle">{t("lib.title")}</h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              <span className="chip">{images.length ? `${images.length}` : t("lib.chip1")}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link className="btn bs btn-sm" href="/diary">{t("diary.new")}</Link>
          </div>
        </div>
        {images.length === 0 ? (
          <p className="psub">{t("lib.empty")}</p>
        ) : (
          <div className="masonry">
            {images.map((shot) => (
              <Link className="mitem" key={`${shot.orderId}-${shot.index}`} href={`/library/${shot.orderId}/${shot.index}`} style={{ background: "#54382C", position: "relative" }}>
                <img src={shot.src} alt="" />
                {!filter && <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "4px 6px", fontSize: 11, fontWeight: 700, background: "rgba(61,46,36,.55)", color: "#fff" }}>{shot.petName}</span>}
              </Link>
            ))}
          </div>
        )}
      </div></div>
    </>
  );
}
