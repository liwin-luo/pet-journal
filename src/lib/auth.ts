import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { cookieDomain } from "./site";

// 会话：无数据库，用户信息 HMAC 签名后放进 httpOnly cookie。
export type SessionUser = {
  email: string;
  name?: string;
  picture?: string;
  exp: number;
};

const COOKIE = "paw_session";
// 180 天：登录状态长期保留（持久 cookie，关浏览器也不丢）
const TTL_MS = 180 * 24 * 60 * 60 * 1000;

function secret(): string {
  return process.env.AUTH_SECRET?.trim() || "dev-insecure-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signSession(user: Omit<SessionUser, "exp">, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: now + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(token: string | undefined, now = Date.now()): SessionUser | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const a = Buffer.from(mac);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const user = JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionUser;
    if (!user.email || typeof user.exp !== "number" || user.exp <= now) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return readSession(jar.get(COOKIE)?.value);
}

/** Route Handler 里用：读 + 可选写。 */
export async function sessionCookie(token: string): Promise<string> {
  const secure = (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https");
  const domain = cookieDomain();
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TTL_MS / 1000}${secure ? "; Secure" : ""}${domain ? `; Domain=${domain}` : ""}`;
}

export function clearSessionCookie(): string {
  const domain = cookieDomain();
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
}

export function authEnabled(): boolean {
  return !!(process.env.AUTH_SECRET?.trim() && process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim());
}

/** 本地开发/演示登录开关（AUTH_DEMO=1 才开放，避免线上变成匿名绕过）。 */
export function demoEnabled(): boolean {
  return process.env.AUTH_DEMO === "1";
}
