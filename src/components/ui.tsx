"use client";
// 共享 UI：Header（语言）· 页内宠物切换 · Stepper · Toast · BottomNav
import { useEffect, useState } from "react";
import { useI18n } from "./I18n";
import { BottomNav } from "./BottomNav";
import { LANGS, LANG_LABEL, Lang } from "@/lib/types";
import { loadState, updateState } from "@/lib/store";

export function Header() {
  const { lang, setLang } = useI18n();
  return (
    <>
      <header className="app-header">
        <div className="bar">
          <a className="logo" href="/">Pets<i>Daily</i> 🐾</a>
          <div className="hright">
            <div className="lang">
              <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                {LANGS.map((l) => (
                  <option key={l} value={l}>{LANG_LABEL[l]}</option>
                ))}
              </select>
            </div>
            <button className="avatar-btn" onClick={() => (window.location.href = "/account")}>🐾</button>
          </div>
        </div>
      </header>
      <BottomNav />
    </>
  );
}

/** 作品库 / 日记的过滤。空值是全部，不改全局当前宠物。 */
export function PetFilter({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { t } = useI18n();
  const [pets, setPets] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => { setPets(loadState().pets); }, []);
  if (pets.length < 2) return null;
  return (
    <div className="pet-switch">
      <span>{t("tpl.pickPet")}</span>
      <select aria-label={t("tpl.pickPet")} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{t("tpl.all")}</option>
        {pets.map((p) => <option key={p.id} value={p.id}>{p.name || "—"}</option>)}
      </select>
    </div>
  );
}

/** 礼物页切换正在编排的那一只。一只宠物时不显示。 */
export function PetSwitch() {
  const { t } = useI18n();
  const [petId, setPetId] = useState("");
  const [pets, setPets] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    const s = loadState();
    setPets(s.pets);
    setPetId(s.curPetId ?? "");
  }, []);
  if (pets.length < 2) return null;
  return (
    <div className="pet-switch">
      <span>{t("tpl.pickPet")}</span>
      <select
        aria-label={t("tpl.pickPet")}
        value={petId}
        onChange={(e) => {
          updateState({ curPetId: e.target.value });
          window.location.reload();
        }}
      >
        {pets.map((p) => <option key={p.id} value={p.id}>{p.name || "—"}</option>)}
      </select>
    </div>
  );
}

export function Stepper({ cur, skipPhotos }: { cur: number; skipPhotos?: boolean }) {
  const { t } = useI18n();
  const names = [t("stepper1"), t("stepperP"), t("stepper2"), t("stepper3")];
  return (
    <div className="stepper">
      {names.map((nm, i) => {
        const done = i < cur || (i === 2 && skipPhotos);
        const isCur = i === cur;
        return (
          <span key={i} style={{ display: "contents" }}>
            {i > 0 && <span className="line" />}
            <span className={`st ${done ? "done" : isCur ? "cur" : ""}`}>
              <span className="dot">{done ? "✓" : i + 1}</span>
              <span className="lbl">{nm}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

let toastTimer: ReturnType<typeof setTimeout>;
export function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setMsg(""), 3200);
  }, [msg]);
  const node = <div id="toast" className={msg ? "on" : ""}>{msg}</div>;
  return { toast: setMsg, toastNode: node };
}
