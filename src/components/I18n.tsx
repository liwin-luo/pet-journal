"use client";
// i18n：字典由原型程序化抽取（src/lib/i18n/dict.json，8 语全量）
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import dict from "@/lib/i18n/dict.json";
import { Lang, LANGS } from "@/lib/types";
import { loadState, updateState } from "@/lib/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const I18N = dict as Record<Lang, any>;

// 底部导航标签（8 语）
const NAV_I18N: Record<Lang, Record<string, string>> = {
  en: { create: "Create", library: "Gallery", plaza: "Plaza", diary: "Diary", pets: "Pets", account: "Account" },
  es: { create: "Crear", library: "Galería", plaza: "Plaza", diary: "Diario", pets: "Mascotas", account: "Cuenta" },
  pt: { create: "Criar", library: "Galeria", plaza: "Praça", diary: "Diário", pets: "Pets", account: "Conta" },
  fr: { create: "Créer", library: "Galerie", plaza: "Place", diary: "Journal", pets: "Animaux", account: "Compte" },
  de: { create: "Erstellen", library: "Galerie", plaza: "Platz", diary: "Tagebuch", pets: "Haustiere", account: "Konto" },
  ja: { create: "作る", library: "ギャラリー", plaza: "広場", diary: "日記", pets: "うちの子", account: "アカウント" },
  ko: { create: "만들기", library: "갤러리", plaza: "광장", diary: "일기", pets: "우리 아이", account: "계정" },
  zh: { create: "创作", library: "作品库", plaza: "广场", diary: "日记", pets: "毛孩们", account: "我的" },
};
for (const L of Object.keys(NAV_I18N) as Lang[]) {
  I18N[L].nav = NAV_I18N[L];
}
// stepperP 修正：创作页标签（dict.json 抽取自旧版原型，值仍是"档案/Profile"）
const STEP_P: Record<Lang, string> = {
  en: "Create", es: "Crear", pt: "Criar", fr: "Créer", de: "Gestalten",
  ja: "作成", ko: "만들기", zh: "创作",
};
for (const L of LANGS) I18N[L].stepperP = STEP_P[L];

type Vars = Record<string, string | number>;
type Ctx = {
  lang: Lang;
  t: (path: string, vars?: Vars) => string;
  tArr: (path: string) => string[];
  tObj: <T = Record<string, string>>(path: string) => T;
  setLang: (l: Lang) => void;
};

const Ctx = createContext<Ctx>(null as unknown as Ctx);

function resolve(lang: Lang, path: string) {
  return path.split(".").reduce<any>((o, k) => (o == null ? o : o[k]), I18N[lang]);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const s = loadState();
    if (s.langPicked) {
      setLangState(s.lang);
      document.documentElement.lang = s.lang;
      return;
    }
    if (s.lang !== "en") updateState({ lang: "en" });
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    updateState({ lang: l, langPicked: true });
    document.documentElement.lang = l;
  };

  const t = (path: string, vars?: Vars) => {
    const v = resolve(lang, path);
    let s = typeof v === "string" ? v : path;
    if (vars) for (const [k, val] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(val));
    return s;
  };
  const tArr = (path: string) => { const v = resolve(lang, path); return Array.isArray(v) ? v : []; };
  const tObj = <T,>(path: string) => (resolve(lang, path) ?? {}) as T;

  return <Ctx.Provider value={{ lang, t, tArr, tObj, setLang }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
