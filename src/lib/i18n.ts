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

const DICTS: Record<Locale, Dict> = { en, es, pt, de, fr, it, ja, zh, ru, ko };

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
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
