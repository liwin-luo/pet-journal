"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/ui";
import { ShareCard } from "@/components/ShareCard";
import { ShareBar } from "@/components/ShareBar";
import { PlazaButton } from "@/components/PlazaButton";
import { loadState } from "@/lib/store";
import { planOf } from "@/lib/plan";
import { isPortrait } from "@/lib/guards";
import { useI18n } from "@/components/I18n";

export default function WorkDetailPage() {
  const { orderId, index } = useParams<{ orderId: string; index: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [view, setView] = useState<{ petName: string; image: string; date: number } | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const s = loadState();
    const order = s.orders.find((o) => o.id === orderId);
    const src = order?.images[Number(index)] ?? "";
    const pet = s.pets.find((p) => p.id === order?.petId);
    if (!order || !isPortrait(src)) { setMissing(true); return; }
    setView({ petName: pet?.name || "", image: src, date: order.createdAt });
  }, [orderId, index]);

  return (
    <>
      <Header />
      <div className="page"><div className="share-stage">
        <a className="backlink" onClick={() => router.push("/library")}>← {t("common.back")}</a>
        {missing && <p className="psub">{t("lib.empty")}</p>}
        {view && (
          <>
            <ShareCard kind="work" petName={view.petName} text="" image={view.image} date={view.date} mark={planOf(loadState()) === "free"} />
            <ShareBar image={view.image} payload={{ kind: "work", petName: view.petName, text: "", image: view.image, date: view.date, mark: planOf(loadState()) === "free" }} />
            <PlazaButton source={`work:${orderId}:${index}`} payload={{ kind: "work", petName: view.petName, text: "", image: view.image, date: view.date }} />
            <Link className="btn bs" href={`/diary?work=${orderId}:${index}`} style={{ marginTop: 10 }}>{t("diary.write")}</Link>
          </>
        )}
      </div></div>
    </>
  );
}
