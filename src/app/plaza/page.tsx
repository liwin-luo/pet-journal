"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui";
import { useI18n } from "@/components/I18n";

type Item = { token: string; kind: "work" | "diary"; petName: string; text: string; date: number };

export default function PlazaPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    fetch("/api/plaza", { cache: "no-store" })
      .then((r) => r.json())
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch(() => setItems([]));
  }, []);

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <h1 className="ptitle">{t("plaza.title")}</h1>
        <p className="psub">{t("plaza.sub")}</p>
        {items === null ? <p className="psub">…</p> : items.length === 0 ? (
          <p className="psub">{t("plaza.empty")}</p>
        ) : (
          <div className="plaza">
            {items.map((item) => (
              <Link key={item.token} href={`/s/${item.token}`} className="plaza-card">
                <img src={`/api/share/${item.token}/img`} alt="" />
                <div className="meta">
                  <strong>{item.petName || "PetsDaily"}</strong>
                  {item.kind === "diary" && item.text ? <p>{item.text}</p> : <span className="when">{new Date(item.date).toLocaleDateString()}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div></div>
    </>
  );
}
