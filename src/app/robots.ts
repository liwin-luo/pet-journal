import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /share/ 必须允许抓取：社交平台（X/FB/WhatsApp）需要读取分享页 meta 才能生成大图预览；
        // 分享页本身带 meta noindex，不会被收录。/admin/ 是后台，屏蔽。
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
