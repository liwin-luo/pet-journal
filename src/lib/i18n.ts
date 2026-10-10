import en from "./i18n/dicts/en.json";
import es from "./i18n/dicts/es.json";
import pt from "./i18n/dicts/pt.json";
import de from "./i18n/dicts/de.json";
import fr from "./i18n/dicts/fr.json";
import it from "./i18n/dicts/it.json";
import ja from "./i18n/dicts/ja.json";
import zh from "./i18n/dicts/zh.json";
import ru from "./i18n/dicts/ru.json";
import ko from "./i18n/dicts/ko.json";

export const LOCALES = ["en", "es", "pt", "de", "fr", "it", "ja", "zh", "ru", "ko"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { label: string; flag: string; hreflang: string; og: string }> = {
  en: { label: "English", flag: "🇺🇸", hreflang: "en", og: "en_US" },
  es: { label: "Español", flag: "🇪🇸", hreflang: "es", og: "es_ES" },
  pt: { label: "Português", flag: "🇧🇷", hreflang: "pt-BR", og: "pt_BR" },
  de: { label: "Deutsch", flag: "🇩🇪", hreflang: "de", og: "de_DE" },
  fr: { label: "Français", flag: "🇫🇷", hreflang: "fr", og: "fr_FR" },
  it: { label: "Italiano", flag: "🇮🇹", hreflang: "it", og: "it_IT" },
  ja: { label: "日本語", flag: "🇯🇵", hreflang: "ja", og: "ja_JP" },
  zh: { label: "中文", flag: "🇨🇳", hreflang: "zh-CN", og: "zh_CN" },
  ru: { label: "Русский", flag: "🇷🇺", hreflang: "ru", og: "ru_RU" },
  ko: { label: "한국어", flag: "🇰🇷", hreflang: "ko", og: "ko_KR" },
};

const RAW_DICTS: Record<Locale, unknown> = { en, es, pt, de, fr, it, ja, zh, ru, ko };

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

// 开发约定：新功能先只在 en.json 写英文占位，其他语言在功能确认后统一补齐。
// 缺失 key 运行时深层回退英文（数组整组回退），构建不再要求 10 份字典同步。
const MERGED = new Map<Locale, Dict>();

function deepMerge(base: unknown, override: unknown): unknown {
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return override === undefined ? base : override;
  }
  const b = base as Record<string, unknown>;
  const o = (override ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(b)) out[k] = deepMerge(b[k], o[k]);
  return out;
}

export function getDict(locale: Locale): Dict {
  let d = MERGED.get(locale);
  if (!d) {
    d = locale === DEFAULT_LOCALE ? (RAW_DICTS[locale] as Dict) : (deepMerge(RAW_DICTS[DEFAULT_LOCALE], RAW_DICTS[locale]) as Dict);
    MERGED.set(locale, d);
  }
  return d;
}

/** 站内链接：en 用根路径，其他语言加前缀。 */
export function lp(locale: Locale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

/** hreflang 属性值。 */
export function hreflangOf(locale: Locale): string {
  return LOCALE_META[locale].hreflang;
}

export type Dict = typeof en;
