"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/ui";
import { ShareCard } from "@/components/ShareCard";
import { ShareBar } from "@/components/ShareBar";
import { PlazaButton } from "@/components/PlazaButton";
import { loadState } from "@/lib/store";
import { planOf } from "@/lib/plan";
import { isPortrait } from "@/lib/guards";
import { useI18n } from "@/components/I18n";

export default function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [view, setView] = useState<{ petName: string; text: string; image: string; date: number } | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const s = loadState();
    const entry = s.diary.find((d) => d.id === id && d.text.trim());
    if (!entry) { setMissing(true); return; }
    const pet = s.pets.find((p) => p.id === entry.petId);
    const image = isPortrait(entry.image) ? entry.image : (isPortrait(pet?.anchorImage) ? pet!.anchorImage! : "");
    setView({ petName: pet?.name || "", text: entry.text, image, date: entry.date });
  }, [id]);

  return (
    <>
      <Header />
      <div className="page"><div className="share-stage">
        <a className="backlink" onClick={() => router.push("/diary")}>← {t("common.back")}</a>
        {missing && <p className="psub">{t("lib.empty")}</p>}
        {view && (
          <>
            <ShareCard kind="diary" petName={view.petName} text={view.text} image={view.image} date={view.date} mark={planOf(loadState()) === "free"} />
            <ShareBar image={view.image} payload={{ kind: "diary", ...view, mark: planOf(loadState()) === "free" }} />
            <PlazaButton source={`diary:${id}`} payload={{ kind: "diary", ...view }} />
          </>
        )}
      </div></div>
    </>
  );
}
