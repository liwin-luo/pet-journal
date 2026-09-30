import type { MetadataRoute } from "next";
import { TEMPLATES } from "@/lib/templates";

const SITE = "https://www.petsdaily.live";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/pricing", "/templates", "/plaza", "/privacy", "/terms"].map((path) => ({
    url: `${SITE}${path || "/"}`,
    lastModified: now,
  }));
  const templates = TEMPLATES.map((item) => ({
    url: `${SITE}/t/${item.id}`,
    lastModified: now,
  }));
  return [...pages, ...templates];
}
