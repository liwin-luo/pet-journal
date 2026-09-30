"use client";
// 日记：自己写或让 AI 起草，都能配一张图。AI 只填进正文，保存前可以改。
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { loadState, updateState } from "@/lib/store";
import { petCtx } from "@/lib/flow";
import { isPortrait } from "@/lib/guards";
import { AppState, DiaryEntry } from "@/lib/types";

function byDay(entries: DiaryEntry[]) {
  const groups: { day: string; items: DiaryEntry[] }[] = [];
  for (const d of [...entries].sort((a, b) => b.date - a.date)) {
    const day = new Date(d.date).toLocaleDateString();
    const last = groups[groups.length - 1];
    if (last?.day === day) last.items.push(d);
    else groups.push({ day, items: [d] });
  }
  return groups;
}

/** 这只宠物已有的图。ponytail: 最多 8 张，更多去作品库看。 */
function picsOf(s: AppState, petId: string): string[] {
  const pet = s.pets.find((p) => p.id === petId);
  const out: string[] = [];
  const push = (src?: string) => {
    if (isPortrait(src) && !out.includes(src!)) out.push(src!);
  };
  push(pet?.anchorImage);
  for (const o of s.orders) {
    if (o.petId !== petId) continue;
    for (const img of o.images) push(img);
  }
  return out.slice(0, 8);
}

async function fileToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(bmp.width * scale));
  c.height = Math.max(1, Math.round(bmp.height * scale));
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.72);
}

export default function DiaryPage() {
  const { t, tArr, lang } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pack, setPack] = useState<AppState | null>(null);
  const [petId, setPetId] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState("");

  useEffect(() => {
    const s = loadState();
    setPack(s);
    const work = new URLSearchParams(location.search).get("work") || "";
    const [oid, idx] = work.split(":");
    const order = s.orders.find((o) => o.id === oid);
    const src = order?.images[Number(idx)] ?? "";
    if (order && isPortrait(src)) {
      setPetId(order.petId);
      setImage(src);
      return;
    }
    setPetId(s.curPetId || s.pets[0]?.id || "");
  }, []);

  useEffect(() => {
    if (!pack || !location.search.includes("work=")) return;
    document.getElementById("diary-form")?.scrollIntoView({ block: "start" });
  }, [pack]);

  const pets = pack?.pets ?? [];
  const nameOf = (id: string) => pets.find((p) => p.id === id)?.name || "";
  const pics = pack && petId ? picsOf(pack, petId) : [];
  const strip = image && !pics.includes(image) ? [image, ...pics] : pics;
  const entries = (pack?.diary ?? []).filter((d) => d.text.trim());

  const onPet = (id: string) => {
    if (id === petId) return;
    const prev = pack ? picsOf(pack, petId) : [];
    setPetId(id);
    setText("");
    setImage((cur) => (cur && prev.includes(cur) ? "" : cur));
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    setFail("");
    try { setImage(await fileToDataUrl(file)); }
    catch { setFail(t("upload.bad")); }
  };

  const draft = async () => {
    const s = pack ?? loadState();
    const pet = s.pets.find((p) => p.id === petId);
    if (!pet) return;
    setBusy(true); setFail("");
    const tagNames = tArr("tags8");
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet: petCtx(pet, pet.tags.map((i) => tagNames[i]).filter(Boolean)),
          note: text.trim() || undefined,
          lang,
        }),
      });
      if (res.status === 401) {
        window.location.href = "/login?next=/diary";
        return;
      }
      const data = await res.json();
      const body = String(data.text || "").trim();
      if (!res.ok || !body) { setFail(t("diary.fail")); return; }
      setText(body.slice(0, 800));
    } catch {
      setFail(t("diary.fail"));
    } finally { setBusy(false); }
  };

  const save = () => {
    const body = text.trim().slice(0, 800);
    const s = pack ?? loadState();
    const pet = s.pets.find((p) => p.id === petId);
    if (!body || !pet) return;
    const entry: DiaryEntry = {
      id: "d_" + Date.now(),
      petId: pet.id,
      date: Date.now(),
      image: isPortrait(image) ? image : "",
      text: body,
    };
    updateState({ diary: [entry, ...s.diary] });
    setText("");
    setImage("");
    setPack(loadState());
  };

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <h1 className="ptitle">{t("diary.allTitle")}</h1>
        <p className="psub">{t("diary.sub")}</p>

        <div className="sec-t">{t("diary.timeline")}</div>
        {byDay(entries).length === 0 ? <p className="psub">{t("diary.empty")}</p> : (
          <div className="tl">
            {byDay(entries).map((g) => (
              <div key={g.day}>
                <div className="tl-item">
                  <span className="tl-rail"><span className="tl-daydot" /><span className="tl-line" /></span>
                  <span className="tl-day">{g.day}</span>
                </div>
                {g.items.map((d) => {
                  const pet = pets.find((p) => p.id === d.petId);
                  const img = isPortrait(d.image) ? d.image : (isPortrait(pet?.anchorImage) ? pet!.anchorImage! : "");
                  return (
                    <Link className="tl-item" key={d.id} href={`/diary/${d.id}`}>
                      <span className="tl-rail"><span className="tl-dot" /><span className="tl-line" /></span>
                      <span className="tl-body">
                        <span className="tl-name">{nameOf(d.petId)}</span>
                        <span className="tl-text">{d.text}</span>
                        {img ? <img src={img} alt="" /> : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {pets.length === 0 ? (
          <Link className="btn bp" href="/pet/new" style={{ marginTop: 16 }}>{t("pets.add")}</Link>
        ) : (
          <div id="diary-form" style={{ marginTop: 28 }}>
            <div className="sec-t">{t("diary.new")}</div>
            <div className="fld">
              <label htmlFor="diary-pet">{t("diary.pet")}</label>
              <select id="diary-pet" className="sel-inp" value={petId} onChange={(e) => onPet(e.target.value)}>
                {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="fld">
              <label>{t("diary.pic")}</label>
              <div className="diary-pics">
                {strip.map((src) => (
                  <button type="button" key={src.slice(-32)} className={image === src ? "on" : ""} onClick={() => setImage(image === src ? "" : src)}>
                    <img src={src} alt="" />
                  </button>
                ))}
                <button type="button" className="add" onClick={() => fileRef.current?.click()}>{t("diary.addPic")}</button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
              </div>
            </div>
            <div className="fld">
              <label htmlFor="diary-text">{t("diary.body")}</label>
              <textarea id="diary-text" rows={4} maxLength={800} value={text} placeholder={t("diary.placeholder")} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="diary-acts">
              <button className="btn bs" disabled={busy || !petId} onClick={draft}>{busy ? "…" : t("diary.ai")}</button>
              <button className="btn bp" disabled={!text.trim() || !petId || busy} onClick={save}>{t("diary.save")}</button>
            </div>
            {fail ? <p className="hint">{fail}</p> : null}
          </div>
        )}
      </div></div>
    </>
  );
}
