import { createHmac, timingSafeEqual } from "node:crypto";

// Google OAuth（移植自参考项目，已验证的流程）。
// GOOGLE_REDIRECT_URI：本地开发默认 127.0.0.1:3000；线上自动取当前 origin，需在 Google 控制台登记。
const AUTHORIZE = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN = "https://oauth2.googleapis.com/token";
const USERINFO = "https://openidconnect.googleapis.com/v1/userinfo";
const STATE_TTL_MS = 10 * 60 * 1000;

export function publicOrigin(req: Request): string {
  const url = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || url.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() || req.headers.get("host") || url.host;
  return `${proto}://${host}`;
}

function isLoopback(origin: string): boolean {
  const host = new URL(origin).hostname;
  return host === "127.0.0.1" || host === "localhost";
}

export function googleRedirectUri(req?: Request): string {
  if (req) {
    const origin = publicOrigin(req);
    if (!isLoopback(origin)) return `${origin}/api/auth/google/callback`;
  }
  return process.env.GOOGLE_REDIRECT_URI?.trim() || "http://127.0.0.1:3000/api/auth/google/callback";
}

export function googleClient(): { id: string; secret: string } {
  const id = process.env.AUTH_GOOGLE_ID?.trim() || "";
  const secret = process.env.AUTH_GOOGLE_SECRET?.trim() || "";
  if (!id || !secret) throw new Error("AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET are not set");
  return { id, secret };
}

function stateSecret(): string {
  const value = process.env.AUTH_SECRET?.trim();
  if (!value) throw new Error("AUTH_SECRET is not set");
  return value;
}

const NEXT_OK = /^\/[A-Za-z0-9/_?=&%.~-]{0,180}$/;

export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || !NEXT_OK.test(raw)) return "/";
  return raw;
}

export function signOauthState(next = "/", now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: now + STATE_TTL_MS, n: crypto.randomUUID(), next: safeNext(next) }),
  ).toString("base64url");
  const mac = createHmac("sha256", stateSecret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

/** 验过签名就返回登录后要去的站内路径。过期或被改过则是 null。 */
export function readOauthState(state: string, now = Date.now()): string | null {
  const dot = state.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = state.slice(0, dot);
  const mac = state.slice(dot + 1);
  const expected = createHmac("sha256", stateSecret()).update(payload).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number; next?: string };
    if (typeof parsed.exp !== "number" || parsed.exp <= now) return null;
    return safeNext(parsed.next);
  } catch {
    return null;
  }
}

export function googleAuthorizeUrl(state: string, req?: Request): string {
  const client = googleClient();
  const url = new URL(AUTHORIZE);
  url.searchParams.set("client_id", client.id);
  url.searchParams.set("redirect_uri", googleRedirectUri(req));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export async function googleProfile(
  code: string,
  req?: Request,
): Promise<{ sub: string; email: string; name?: string; picture?: string }> {
  const client = googleClient();
  const body = new URLSearchParams({
    code,
    client_id: client.id,
    client_secret: client.secret,
    redirect_uri: googleRedirectUri(req),
    grant_type: "authorization_code",
  });
  const tokenRes = await fetch(TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tokenJson = (await tokenRes.json()) as { access_token?: string; error?: string };
  if (!tokenRes.ok || !tokenJson.access_token) throw new Error(tokenJson.error || "Google token exchange failed");
  const me = await fetch(USERINFO, { headers: { Authorization: `Bearer ${tokenJson.access_token}` } });
  const profile = (await me.json()) as { sub?: string; email?: string; name?: string; picture?: string };
  if (!profile.sub || !profile.email) throw new Error("Google returned no email");
  return { sub: profile.sub, email: profile.email, name: profile.name, picture: profile.picture };
}
