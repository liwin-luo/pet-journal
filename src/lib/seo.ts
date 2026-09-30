import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "./site";

export function pageMeta(opts: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
} = {}): Metadata {
  const title = opts.title ? `${opts.title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const description = opts.description ?? SITE_TAGLINE;
  const url = `${SITE_URL}${opts.path ?? ""}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: opts.ogImage ? [{ url: opts.ogImage }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: opts.ogImage ? [opts.ogImage] : undefined },
  };
}
