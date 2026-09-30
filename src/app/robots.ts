import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/login", "/create", "/library", "/diary", "/account", "/upload", "/anchor", "/preview", "/processing", "/pets", "/pet", "/gift"],
    },
    sitemap: "https://www.petsdaily.live/sitemap.xml",
  };
}
