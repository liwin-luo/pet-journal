"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n";

/** 语言切换器：保持当前路径，只切换语言前缀（en 无前缀）。 */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    // 本地记住语言：middleware 读此 cookie，将无前缀请求送到用户选的语言
    document.cookie = `paw_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    const segs = pathname.split("/");
    if ((LOCALES as readonly string[]).includes(segs[1])) segs.splice(1, 1);
    const rest = segs.join("/") || "/";
    router.push(next === "en" ? rest : `/${next}${rest === "/" ? "" : rest}`);
  }

  return (
    <select
      value={locale}
      onChange={(e) => switchTo(e.target.value as Locale)}
      aria-label="Language"
      className="max-w-36 cursor-pointer rounded-full border border-sand bg-white py-1.5 pl-3.5 pr-8 text-xs font-medium text-coffee outline-none transition-colors hover:border-coral"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_META[l].label}
        </option>
      ))}
    </select>
  );
}
