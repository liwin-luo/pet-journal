"use client";
// 选宠物页（意图先行入口；单宠自动跳过 → 见 lib/flow.ts autoRoute）
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { PetSvg } from "@/components/PetArt";
import { loadState, updateState } from "@/lib/store";
import { Pet } from "@/lib/types";
import { canAddPet } from "@/lib/plan";
import { isPortrait } from "@/lib/guards";

export default function WhoPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [pets, setPets] = useState<Pet[]>([]);
  const [ready, setReady] = useState(false);
  const [manage, setManage] = useState(false);
  const [gate, setGate] = useState(false);

  useEffect(() => {
    const s = loadState();
    const manage = new URLSearchParams(location.search).get("manage") === "1";
    setManage(manage);
    setPets(s.pets);
    setReady(true);
    if (manage) return;
    if (s.pets.length === 1) {
      const p = s.pets[0];
      updateState({ curPetId: p.id });
      router.replace(p.profileDone ? "/create" : "/pet/new");
    }
  }, [router]);

  const pick = (p: Pet) => {
    updateState({ curPetId: p.id });
    router.push(p.profileDone ? "/create" : "/pet/new");
  };
  const newPet = () => {
    if (canAddPet(loadState())) router.push("/pet/new?new=1");
    else setGate(true);
  };

  return (
    <>
      <Header />
      <div className="page">
        <div className="wrap">
          <h1 className="ptitle">{t("who.title")}</h1>
          <div className="pets-grid">
            {ready && pets.map((p) => (
              <div className="pcard" key={p.id} onClick={() => pick(p)}>
                <div className="pv2">{isPortrait(p.anchorImage) ? <img src={p.anchorImage} alt="" /> : <PetSvg dog={p.dog} royal />}</div>
                <b>{p.name || "—"}</b>
                <div className="m">{p.breed}</div>
                <div className="m" style={{ color: p.profileDone ? "var(--sage)" : "var(--gold)", fontWeight: 600 }}>
                  {p.profileDone ? t("who.done") : t("who.setup")}
                </div>
                {manage && (
                  <button className="link" onClick={(e) => { e.stopPropagation(); updateState({ curPetId: p.id }); router.push("/pet/new"); }}>
                    {t("who.edit")}
                  </button>
                )}
              </div>
            ))}
            <div className="pcard add" onClick={newPet}>
              <span style={{ fontSize: 26 }}>＋</span>{t("who.new")}
            </div>
          </div>
          {gate && (
            <div style={{ marginTop: 16 }}>
              <p className="psub">{t("plan.gate")}</p>
              <Link className="btn bp" href="/preview" style={{ marginTop: 12 }}>{t("plan.change")}</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
