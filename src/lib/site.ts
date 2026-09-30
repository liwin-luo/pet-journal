// 站点身份唯一出口。换域名/品牌只改 .env.local，不动代码。
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "PetsDaily";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/$/, "");
export const SITE_MAIL = process.env.NEXT_PUBLIC_SITE_MAIL?.trim() || "hello@example.com";
export const SITE_TAGLINE = "Turn your pet into any picture you can imagine";
export const UPDATED = "September 30, 2026";

/**
 * Cookie 的 Domain 属性：www 主机名时落到裸域（petsdaily.live），
 * 让 www / 裸域 / 子域共享登录态与设备身份；本地 localhost 返回 undefined（host-only）。
 */
export function cookieDomain(): string | undefined {
  const host = new URL(SITE_URL).hostname;
  return host.startsWith("www.") ? host.slice(4) : undefined;
}
