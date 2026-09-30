import type { Metadata } from "next";
import { DEFAULT_LOCALE, hreflangOf, LOCALES, lp, type Locale } from "./i18n";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./site";

/** 语言感知的页面元数据：canonical + 全语言 hreflang 互链（en 为根路径，x-default 指向 en）。 */
export function pageMeta(opts: {
  locale?: Locale;
  path?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
} = {}): Metadata {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  const path = opts.path ?? "/";
  const title = opts.title ? `${opts.title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const description = opts.description ?? SITE_TAGLINE;
  const canon = `${SITE_URL}${lp(locale, path)}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[hreflangOf(l)] = `${SITE_URL}${lp(l, path)}`;
  languages["x-default"] = `${SITE_URL}${path}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: canon, languages: opts.noindex ? undefined : languages },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canon,
      siteName: SITE_NAME,
      type: "website",
      images: opts.ogImage ? [{ url: opts.ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: opts.ogImage ? [opts.ogImage] : undefined },
  };
}
