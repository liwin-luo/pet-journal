"use client";
// 建档：先定物种（狗 / 猫 / 其他），再填决定相似度的品种和毛色。性格只影响姿势。
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { loadState, updateState, curPet } from "@/lib/store";
import { emptyPet, Pet } from "@/lib/types";
import { canAddPet } from "@/lib/plan";

type Species = "dog" | "cat" | "other";
type Stage = "young" | "adult" | "senior";

const DOGS = ["Golden Retriever", "Labrador", "French Bulldog", "Corgi", "Poodle", "Shiba Inu", "Border Collie", "German Shepherd", "Dachshund", "Beagle", "Siberian Husky", "Chihuahua"];
const CATS = ["British Shorthair", "Ragdoll", "Siamese", "Maine Coon", "Persian", "Scottish Fold", "Bengal", "Russian Blue", "American Shorthair", "Sphynx"];

function inferSpecies(p: Pet): Species {
  if (p.species) return p.species;
  if (DOGS.includes(p.breed) || p.dog) return "dog";
  if (CATS.includes(p.breed)) return "cat";
  return "cat";
}

export default function NewPetPage() {
  const router = useRouter();
  const { t, tArr } = useI18n();
  const tagNames = tArr("tags8");
  const [species, setSpecies] = useState<Species | null>(null);
  const [breedKey, setBreedKey] = useState("");
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [coat, setCoat] = useState("");
  const [stage, setStage] = useState<Stage>("adult");
  const [tags, setTags] = useState<number[]>([]);
  const [bday, setBday] = useState("");
  const [creating, setCreating] = useState(false);
  const [hint, setHint] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const neu = new URLSearchParams(location.search).get("new") === "1";
    if (neu && !canAddPet(loadState())) { router.replace("/preview"); return; }
    setCreating(neu);
    if (!neu) {
      const p = curPet(loadState());
      if (p) {
        const sp = inferSpecies(p);
        setSpecies(sp);
        setName(p.name);
        setCoat(p.coat);
        setTags(p.tags);
        setBday(p.bday ?? "");
        setStage(p.stage ?? "adult");
        if (sp === "other") setCustom(p.breed);
        else {
          const list = sp === "dog" ? DOGS : CATS;
          if (list.includes(p.breed)) setBreedKey(p.breed);
          else { setBreedKey("custom"); setCustom(p.breed); }
        }
      }
    }
    setLoaded(true);
  }, []);

  const list = species === "dog" ? DOGS : CATS;
  const breed = (() => {
    if (species === "other") return custom.trim();
    if (breedKey === "custom") return custom.trim();
    if (breedKey === "mixed") return custom.trim() || (species === "cat" ? "mixed-breed cat" : "mixed-breed dog");
    return breedKey;
  })();
  const coatPh = species === "cat" ? t("profile.coatCat") : species === "other" ? t("profile.coatOther") : t("profile.coatDog");
  const ready = Boolean(species && name.trim() && breed && coat.trim() && tags.length);

  const pickSpecies = (sp: Species) => {
    setSpecies(sp);
    setBreedKey(sp === "other" ? "" : sp === "dog" ? DOGS[0] : CATS[0]);
    setCustom("");
    setHint("");
  };
  const toggleTag = (i: number) => {
    setTags((cur) => cur.includes(i) ? cur.filter((x) => x !== i) : cur.length >= 3 ? cur : [...cur, i]);
    setHint("");
  };
  const save = () => {
    if (!ready || !species) { setHint(t("profile.need")); return; }
    const fields = {
      name: name.trim(), breed, coat: coat.trim(), tags, bday, stage,
      species, dog: species === "dog", profileDone: true as const,
    };
    if (creating) {
      const id = "pet_" + Date.now();
      updateState((s) => ({
        pets: [...s.pets, { ...emptyPet(id), ...fields }],
        curPetId: id,
      }));
    } else {
      updateState((s) => ({
        pets: s.pets.map((p) => p.id === s.curPetId ? { ...p, ...fields } : p),
      }));
    }
    router.push("/pet/items");
  };

  if (!loaded) return <><Header /><div className="page" /></>;
  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <h1 className="ptitle">{t("profile.title")}</h1>
        <p className="psub">{t("profile.lead")}</p>

        <div className="fld" style={{ marginTop: 8 }}>
          <label>{t("profile.animal")}</label>
          <div className="species">
            {(["dog", "cat", "other"] as Species[]).map((sp) => (
              <button key={sp} type="button" className={species === sp ? "on" : ""} onClick={() => pickSpecies(sp)}>
                {t(`profile.${sp}`)}
              </button>
            ))}
          </div>
        </div>

        {species === "other" && (
          <div className="fld">
            <label>{t("profile.kind")}</label>
            <input value={custom} placeholder={t("profile.kindPh")} onChange={(e) => { setCustom(e.target.value); setHint(""); }} />
          </div>
        )}
        {species && species !== "other" && (
          <div className="fld">
            <label>{t("profile.breed")}</label>
            <select className="sel-inp" value={breedKey} onChange={(e) => { setBreedKey(e.target.value); setHint(""); }}>
              {list.map((b) => <option key={b} value={b}>{b}</option>)}
              <option value="mixed">{t("profile.mixed")}</option>
              <option value="custom">{t("profile.custom")}</option>
            </select>
            {(breedKey === "mixed" || breedKey === "custom") && (
              <input style={{ marginTop: 8 }} value={custom} placeholder={t("profile.breedCustom")} onChange={(e) => { setCustom(e.target.value); setHint(""); }} />
            )}
          </div>
        )}

        {species && <>
        <div className="fld">
          <label>{t("profile.name")}</label>
          <input value={name} placeholder={t("profile.namePh")} onChange={(e) => { setName(e.target.value); setHint(""); }} />
        </div>
        <div className="fld">
          <label>{t("profile.coat")}</label>
          <input value={coat} placeholder={coatPh} onChange={(e) => { setCoat(e.target.value); setHint(""); }} />
        </div>
        <div className="fld">
          <label>{t("profile.stage")}</label>
          <div className="tagrow">
            {(["young", "adult", "senior"] as Stage[]).map((st) => (
              <button key={st} type="button" className={`tag ${stage === st ? "on" : ""}`} onClick={() => setStage(st)}>{t(`profile.${st}`)}</button>
            ))}
          </div>
        </div>
        <div className="fld">
          <label>{t("profile.tags")}</label>
          <div className="tagrow">
            {tagNames.map((tn, i) => (
              <button key={i} type="button" className={`tag ${tags.includes(i) ? "on" : ""}`} onClick={() => toggleTag(i)}>{tn}</button>
            ))}
          </div>
          <div className="hint">{t("profile.tagNote")}</div>
        </div>
        <details className="fld">
          <summary>{t("profile.bday")}</summary>
          <input type="month" value={bday} onChange={(e) => setBday(e.target.value)} />
        </details>
        </>}
        {breed && <div className="sumline">{[t(`profile.${species}`), name, breed, coat].filter(Boolean).join(" · ")}</div>}
        {hint ? <div className="hint">{hint}</div> : null}
        <button className="btn bp" style={{ width: "100%" }} onClick={save}>{t("profile.cont")}</button>
        <a className="skiplink" onClick={() => router.push(creating ? "/create" : "/pet/items")}>{creating ? t("common.back") : t("profile.skip")}</a>
      </div></div>
    </>
  );
}
