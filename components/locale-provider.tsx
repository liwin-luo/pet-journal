"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { htmlLang, isLocale, localeCookie, t, type Locale, type Messages } from "@/lib/i18n.ts";

const Ctx = createContext<{ locale: Locale; m: Messages; setLocale: (next: Locale) => void } | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [current, setCurrent] = useState(locale);
  useEffect(() => {
    setCurrent(locale);
  }, [locale]);
  const value = useMemo(
    () => ({
      locale: current,
      m: t(current),
      setLocale(next: Locale) {
        if (!isLocale(next)) return;
        document.cookie = localeCookie(next);
        document.documentElement.lang = htmlLang(next);
        setCurrent(next);
      },
    }),
    [current],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("LocaleProvider missing");
  return ctx;
}
