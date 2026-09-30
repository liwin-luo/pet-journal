"use client";
// 创作对话框：@ 引用宠物或模板，也可以贴一张自己的图。芯片收在输入框里。
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { loadState, updateState } from "@/lib/store";
import { afterCreateIntent } from "@/lib/flow";
import { getRefs, setRefs } from "@/lib/refs";
import { isPortrait } from "@/lib/guards";
import { TEMPLATES, templateById, tplText } from "@/lib/catalog";
import { Order, Pet } from "@/lib/types";
import { canAddPet } from "@/lib/plan";

type AtItem =
  | { k: "pet"; id: string; label: string }
  | { k: "new"; label: string }
  | { k: "tpl"; id: string; label: string }
  | { k: "center"; label: string };

function atQuery(text: string, caret: number): { start: number; query: string } | null {
  const upto = text.slice(0, caret);
  const at = upto.lastIndexOf("@");
  if (at < 0) return null;
  const query = upto.slice(at + 1);
  if (/\s/.test(query)) return null;
  return { start: at, query };
}

/** 已引用宠物的现成肖像。ponytail: 最多 8 张，更多去作品库。 */
function picsOf(pets: Pet[], orders: Order[], ids: string[]): string[] {
  const out: string[] = [];
  const push = (src?: string) => {
    if (isPortrait(src) && !out.includes(src!)) out.push(src!);
  };
  for (const id of ids) {
    push(pets.find((p) => p.id === id)?.anchorImage);
    for (const o of orders) {
      if (o.petId !== id) continue;
      for (const img of o.images) push(img);
    }
  }
  return out.slice(0, 8);
}

async function fileToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const max = 640;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(bmp.width * scale));
  c.height = Math.max(1, Math.round(bmp.height * scale));
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.72);
}

export default function CreatePage() {
  const router = useRouter();
  const { t, lang, tArr } = useI18n();
  const sugg = tArr("tpl.sugg");
  const nameOf = (id: string) => {
    const item = templateById(id);
    return item ? tplText(item, lang) : id;
  };
  const box = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [petIds, setPetIds] = useState<string[]>([]);
  const [tpl, setTpl] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [at, setAt] = useState<{ start: number; query: string } | null>(null);
  const [hi, setHi] = useState(0);

  useEffect(() => {
    const s = loadState();
    setPets(s.pets);
    setOrders(s.orders);
    const saved = (s.citedPetIds ?? []).filter((id) => s.pets.some((p) => p.id === id));
    setPetIds(saved.length ? saved : (s.curPetId ? [s.curPetId] : []));
    setDesc(s.customDesc || "");
    const fromUrl = new URLSearchParams(window.location.search).get("tpl");
    const picked = templateById(fromUrl) ? fromUrl : (templateById(s.selectedTemplate) ? s.selectedTemplate : null);
    setTpl(picked);
    if (fromUrl && templateById(fromUrl)) updateState({ selectedTemplate: fromUrl, selectedStyle: null });
  }, []);

  const chosen = petIds.map((id) => pets.find((p) => p.id === id)).filter((p): p is Pet => Boolean(p));
  const pics = picsOf(pets, orders, petIds);
  const strip = photo && !pics.includes(photo) ? [photo, ...pics] : pics;
  const q = (at?.query ?? "").trim().toLowerCase();
  const hit = (s: string) => !q || s.toLowerCase().includes(q);
  const items: AtItem[] = [];
  if (at) {
    for (const p of pets) if (!petIds.includes(p.id) && hit(p.name || "")) items.push({ k: "pet", id: p.id, label: p.name || "—" });
    if (!q || hit(t("who.new"))) items.push({ k: "new", label: t("who.new") });
    const found = q
      ? TEMPLATES.filter((item) => hit(item.zh) || hit(item.en)).slice(0, 8)
      : [];
    for (const item of found) items.push({ k: "tpl", id: item.id, label: tplText(item, lang) });
    if (!q || found.length < TEMPLATES.length) items.push({ k: "center", label: t("tpl.center") });
  }

  const syncAt = (text: string, caret: number) => {
    const next = atQuery(text, caret);
    setAt(next);
    if (next?.query !== at?.query) setHi(0);
  };
  const pickPet = (id: string) => {
    setPetIds((cur) => cur.includes(id) ? cur : [...cur, id]);
    setHint("");
  };
  const apply = (item: AtItem) => {
    const caret = box.current?.selectionStart ?? desc.length;
    const cleaned = at ? (desc.slice(0, at.start) + desc.slice(caret)).slice(0, 800) : desc;
    if (at) setDesc(cleaned);
    setAt(null);
    setHint("");
    if (item.k === "new") { router.push(canAddPet(loadState()) ? "/pet/new?new=1" : "/preview"); return; }
    if (item.k === "center") {
      updateState({ customDesc: cleaned.trim(), selectedTemplate: tpl, citedPetIds: petIds });
      router.push("/templates");
      return;
    }
    if (item.k === "pet") { pickPet(item.id); }
    else setTpl(item.id);
    box.current?.focus();
  };
  const insertAt = () => {
    const el = box.current;
    const pos = el?.selectionStart ?? desc.length;
    const next = desc.slice(0, pos) + "@" + desc.slice(pos);
    setDesc(next.slice(0, 800));
    const caret = pos + 1;
    setAt({ start: pos, query: "" });
    setHi(0);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };
  const addPhoto = async (f: File) => {
    try { setPhoto(await fileToDataUrl(f)); setHint(""); }
    catch { setHint(t("upload.bad")); }
  };
  const dropPetPic = (ids: string[]) => {
    const keep = picsOf(pets, orders, ids);
    setPhoto((cur) => (cur && pics.includes(cur) && !keep.includes(cur) ? null : cur));
  };
  const send = (fromEnter = false) => {
    if (fromEnter && at) {
      if (items.length) apply(items[Math.min(hi, items.length - 1)]);
      else setAt(null);
      return;
    }
    const text = desc.trim().slice(0, 800);
    if (!chosen.length) { setHint(t("tpl.needPet")); return; }
    if (!tpl && !text && !photo) { setHint(t("tpl.needDesc")); return; }
    if (photo) setRefs([photo, ...getRefs().filter((u) => u !== photo)].slice(0, 10));
    const tplName = tpl ? nameOf(tpl) : "";
    const names = chosen.map((p) => p.name).filter(Boolean).join(" · ");
    const intent = [names, tplName, text].filter(Boolean).join(" · ").slice(0, 80);
    const undone = chosen.find((p) => !p.profileDone);
    updateState({
      curPetId: (undone ?? chosen[0]).id,
      citedPetIds: chosen.map((p) => p.id),
      selectedTemplate: tpl,
      selectedStyle: null,
      customDesc: text,
    });
    if (undone) {
      updateState({ intent });
      router.push("/pet/new");
      return;
    }
    afterCreateIntent(intent);
  };

  const petItems = items.filter((i) => i.k === "pet" || i.k === "new");
  const tplItems = items.filter((i) => i.k === "tpl" || i.k === "center");
  let n = 0;

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <h1 className="ptitle">{t("tpl.title")}</h1>
        <p className="psub">{t("tpl.dialogHi")}</p>
        <div className="composer">
          {(chosen.length || tpl || photo) && (
            <div className="pills">
              {chosen.map((p) => (
                <button key={p.id} type="button" className="pill" onClick={() => setPetIds((ids) => { const next = ids.filter((id) => id !== p.id); dropPetPic(next); return next; })}>@{p.name || "—"} <span className="x">×</span></button>
              ))}
              {tpl && <button type="button" className="pill" onClick={() => setTpl(null)}>@{nameOf(tpl)} <span className="x">×</span></button>}
              {photo && (
                <button type="button" className="pill" onClick={() => setPhoto(null)}>
                  <img src={photo} alt="" />{t("tpl.addImg")} <span className="x">×</span>
                </button>
              )}
            </div>
          )}
          <textarea
            ref={box}
            rows={3}
            value={desc}
            placeholder={t("tpl.customPh")}
            onChange={(e) => {
              const v = e.target.value.slice(0, 800);
              setDesc(v);
              setHint("");
              syncAt(v, e.target.selectionStart ?? v.length);
            }}
            onKeyUp={(e) => { if (e.key !== "Enter") syncAt(desc, box.current?.selectionStart ?? desc.length); }}
            onClick={() => syncAt(desc, box.current?.selectionStart ?? desc.length)}
            onBlur={() => setAt(null)}
            onPaste={(e) => {
              const f = Array.from(e.clipboardData.files).find((x) => x.type.startsWith("image/"));
              if (!f) return;
              e.preventDefault();
              addPhoto(f);
            }}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if (at && items.length && e.key === "ArrowDown") { e.preventDefault(); setHi((i) => (i + 1) % items.length); return; }
              if (at && items.length && e.key === "ArrowUp") { e.preventDefault(); setHi((i) => (i - 1 + items.length) % items.length); return; }
              if (at && e.key === "Escape") { e.preventDefault(); setAt(null); return; }
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(true); return; }
              if (e.key === "Backspace" && desc === "" && box.current?.selectionStart === 0) {
                if (photo) setPhoto(null);
                else if (tpl) setTpl(null);
                else if (petIds.length) setPetIds((ids) => ids.slice(0, -1));
              }
            }}
          />
          {at && (
            <div className="at-menu" onMouseDown={(e) => e.preventDefault()}>
              {items.length === 0 && <div className="sec">{t("tpl.noMatch")}</div>}
              {petItems.length > 0 && <div className="sec">{t("tpl.pickPet")}</div>}
              {petItems.map((item) => {
                const i = n++;
                return (
                  <button key={item.k === "pet" ? item.id : "new"} type="button" className={i === hi ? "on" : ""}
                    onMouseEnter={() => setHi(i)} onClick={() => apply(item)}>{item.label}</button>
                );
              })}
              {tplItems.length > 0 && <div className="sec">{t("tpl.cite")}</div>}
              {tplItems.map((item) => {
                const i = n++;
                const key = item.k === "tpl" ? item.id : "center";
                return (
                  <button key={key} type="button" className={i === hi ? "on" : ""}
                    onMouseEnter={() => setHi(i)} onClick={() => apply(item)}>{item.label}</button>
                );
              })}
            </div>
          )}
          {strip.length > 0 && (
            <div className="diary-pics">
              {strip.map((src) => (
                <button type="button" key={src.slice(-32)} className={photo === src ? "on" : ""} onClick={() => setPhoto(photo === src ? null : src)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
          <div className="composer-bar">
            <button type="button" className="tool" onClick={insertAt}>@</button>
            <button type="button" className="tool" onClick={() => file.current?.click()}>{t("tpl.addImg")}</button>
            <input ref={file} type="file" accept="image/*" hidden onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) addPhoto(f);
              e.target.value = "";
            }} />
            <button type="button" className="btn bp send" onClick={() => send()}>{t("tpl.send")}</button>
          </div>
        </div>
        {hint ? <div className="hint">{hint}</div> : null}
        <div className="presets">
          {sugg.map((s) => (
            <button className="chip" key={s} onClick={() => { setDesc((d) => (d ? `${d} ${s}` : s).slice(0, 800)); setAt(null); }}>{s}</button>
          ))}
        </div>
        <a className="skiplink" onClick={() => router.push("/templates")}>{t("tpl.stylesLink")}</a>
      </div></div>
    </>
  );
}
