"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

type Labels = { home: string; templates: string; gallery: string; faq: string };

const ITEMS: { path: string; key: keyof Labels }[] = [
  { path: "/", key: "home" },
  { path: "/templates", key: "templates" },
  { path: "/gallery", key: "gallery" },
  { path: "/faq", key: "faq" },
];

/** 去掉语言前缀后的站内路径。 */
function sitePath(pathname: string, locale: string): string {
  if (locale !== DEFAULT_LOCALE && pathname.startsWith(`/${locale}`)) {
    const rest = pathname.slice(locale.length + 1);
    return `/${rest}`;
  }
  return pathname;
}

export function NavLinks({ locale, labels, variant }: { locale: string; labels: Labels; variant: "desktop" | "mobile" }) {
  const pathname = usePathname() || "/";
  const current = sitePath(pathname, locale);

  function isActive(path: string): boolean {
    return path === "/" ? current === "/" : current === path || current.startsWith(`${path}/`);
  }

  const cls = (active: boolean) =>
    `transition-colors ${variant === "desktop" ? "text-sm" : "text-sm"} ${
      active ? "font-semibold text-coral" : "font-medium text-coffee hover:text-coral"
    }`;

  return (
    <>
      {ITEMS.map((item) => (
        <Link
          key={item.key}
          href={locale === DEFAULT_LOCALE ? item.path : `/${locale}${item.path === "/" ? "" : item.path}`}
          className={cls(isActive(item.path))}
          aria-current={isActive(item.path) ? "page" : undefined}
        >
          {labels[item.key]}
        </Link>
      ))}
    </>
  );
}
