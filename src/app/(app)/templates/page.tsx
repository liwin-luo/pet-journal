"use client";
// 模板中心：目录来自 lib/templates.ts。加模板不用改这个页面。
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header } from "@/components/ui";
import { updateState } from "@/lib/store";
import { CATS, TEMPLATES, tplText } from "@/lib/templates";

export default function TemplateCenterPage() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sel, setSel] = useState<string | null>(null);
  const query = q.trim().toLowerCase();
  const list = TEMPLATES.filter((item) => {
    if (cat !== "all" && item.cat !== cat) return false;
    if (!query) return true;
    return item.zh.toLowerCase().includes(query) || item.en.toLowerCase().includes(query);
  });
  const useTpl = () => {
    if (!sel) return;
    updateState({ selectedTemplate: sel, selectedStyle: null });
    router.push("/create");
  };

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <a className="backlink" onClick={() => router.push("/create")}>← {t("common.back")}</a>
        <h1 className="ptitle">{t("tpl.center")}</h1>
        <p className="psub">{t("tpl.centerSub")}</p>
        <p className="hint" style={{ marginTop: 0 }}>{t("tpl.count").replace("{n}", String(TEMPLATES.length))}</p>
        <div className="fld">
          <input value={q} placeholder={t("tpl.searchPh")} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="presets">
          <button type="button" className={`chip ${cat === "all" ? "p" : ""}`} onClick={() => setCat("all")}>{t("tpl.all")}</button>
          {CATS.map((c) => (
            <button key={c.id} type="button" className={`chip ${cat === c.id ? "p" : ""}`} onClick={() => setCat(c.id)}>{tplText(c, lang)}</button>
          ))}
        </div>
        {list.length === 0 ? <p className="psub">{t("tpl.noMatch")}</p> : (
          <div className="sgrid">
            {list.map((item) => (
              <button key={item.id} type="button" className={`scard ${sel === item.id ? "sel" : ""}`} onClick={() => setSel(item.id)}>
                <div className="thumb" style={{ background: item.bg }}>
                  <img src={`/tpl/${item.id}.jpg?v=2`} alt="" />
                </div>
                <div className="nm">{tplText(item, lang)}</div>
              </button>
            ))}
          </div>
        )}
      </div></div>
      <div className="bottom-bar"><div className="inner">
        <span className="note">{sel ? tplText(TEMPLATES.find((item) => item.id === sel)!, lang) : t("tpl.searchPh")}</span>
        <button className="btn bp" disabled={!sel} onClick={useTpl}>{t("tpl.use")}</button>
      </div></div>
    </>
  );
}
