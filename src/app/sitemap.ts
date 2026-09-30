import type { MetadataRoute } from "next";
import { LOCALES, lp } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: { path: string; priority: number; freq: "weekly" | "daily" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/templates", priority: 0.9, freq: "weekly" },
    { path: "/gallery", priority: 0.8, freq: "daily" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
    { path: "/ai-disclosure", priority: 0.2, freq: "yearly" },
  ];

  const out: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const s of statics) {
      out.push({ url: `${SITE_URL}${lp(locale, s.path)}`, lastModified: now, changeFrequency: s.freq, priority: s.priority });
    }
    for (const t of TEMPLATES) {
      out.push({ url: `${SITE_URL}${lp(locale, `/templates/${t.id}`)}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
    }
  }
  return out;
}
