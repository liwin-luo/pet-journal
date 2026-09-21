"use client";

import { LOCALES, LOCALE_LABEL } from "@/lib/i18n.ts";
import { useI18n } from "./locale-provider.tsx";

export function LocaleSwitch({ tone = "ink" }: { tone?: "ink" | "hero" }) {
  const { locale, setLocale } = useI18n();
  const mute = tone === "hero" ? "text-[#5a4030]/70" : "text-mute";
  return (
    <div className={`flex flex-wrap items-center gap-1 text-xs ${mute}`}>
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          className={`rounded-full px-2 py-1 ${locale === item ? "bg-ink text-card" : ""}`}
          onClick={() => setLocale(item)}
        >
          {LOCALE_LABEL[item]}
        </button>
      ))}
    </div>
  );
}
