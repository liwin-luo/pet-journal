import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "pj_user";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.AUTH_SECRET?.trim();
  if (!value) throw new Error("先设 AUTH_SECRET");
  return value;
}

export function signSession(userId: string, now = Date.now()): string {
  const exp = now + WEEK_MS;
  const payload = Buffer.from(JSON.stringify({ userId, exp })).toString("base64url");
  const mac = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function readSession(raw: string | undefined, now = Date.now()): string | undefined {
  if (!raw) return undefined;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return undefined;
  const payload = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { userId?: string; exp?: number };
    if (!parsed.userId || typeof parsed.exp !== "number" || parsed.exp <= now) return undefined;
    return parsed.userId;
  } catch {
    return undefined;
  }
}

export function sessionCookie(value: string): string {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(WEEK_MS / 1000)}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
