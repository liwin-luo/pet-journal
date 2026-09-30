import type { Metadata } from "next";
import { DEFAULT_LOCALE, hreflangOf, LOCALES, LOCALE_META, lp, type Locale } from "./i18n";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./site";

/** 语言感知的页面元数据：canonical + 全语言 hreflang 互链 + 完整 OG/Twitter 卡（各平台分享规范）。 */
export function pageMeta(opts: {
  locale?: Locale;
  path?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  ogImageDims?: { w: number; h: number };
  ogImageAlt?: string;
  noindex?: boolean;
} = {}): Metadata {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  const path = opts.path ?? "/";
  const title = opts.title ? `${opts.title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  // Google 展示约 155–160 字符，超长会截断；统一钳制
  const rawDesc = opts.description ?? SITE_TAGLINE;
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157).trimEnd() + "…" : rawDesc;
  const canon = `${SITE_URL}${lp(locale, path)}`;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[hreflangOf(l)] = `${SITE_URL}${lp(l, path)}`;
  languages["x-default"] = `${SITE_URL}${path}`;

  // OG/Twitter：X 用 summary_large_image 出大图卡；FB/WhatsApp/LinkedIn 读 og:*。
  // width/height/alt 帮助各平台不经过二次抓取就排出正确版式。
  const ogImage = opts.ogImage
    ? [
        {
          url: opts.ogImage,
          ...(opts.ogImageDims ? { width: opts.ogImageDims.w, height: opts.ogImageDims.h } : {}),
          alt: opts.ogImageAlt ?? `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ]
    : undefined;

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
      locale: LOCALE_META[locale].og,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage,
    },
  };
}
