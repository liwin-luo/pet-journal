// 站点身份唯一出口。换域名/品牌只改 .env.local，不动代码。
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Pawtrait";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
export const SITE_MAIL = process.env.NEXT_PUBLIC_SITE_MAIL?.trim() || "hello@example.com";
export const SITE_TAGLINE = "Turn your pet into any picture you can imagine";
export const UPDATED = "September 30, 2026";
