import { createHmac, timingSafeEqual } from "node:crypto";

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

export function googleRedirectUri(req?: Request): string {
  if (process.env.VERCEL && req) return `${publicOrigin(req)}/api/auth/google/callback`;
  return (
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    "http://127.0.0.1:3000/api/auth/google/callback"
  );
}

export function googleClient(): { id: string; secret: string } {
  const id = process.env.AUTH_GOOGLE_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim() || "";
  const secret = process.env.AUTH_GOOGLE_SECRET?.trim() || process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
  if (!id || !secret) throw new Error("先配 AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET");
  return { id, secret };
}

function stateSecret(): string {
  return process.env.AUTH_SECRET?.trim() || googleClient().secret;
}

export function signOauthState(now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ exp: now + STATE_TTL_MS, n: crypto.randomUUID() })).toString("base64url");
  const mac = createHmac("sha256", stateSecret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function verifyOauthState(state: string, now = Date.now()): boolean {
  const dot = state.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = state.slice(0, dot);
  const mac = state.slice(dot + 1);
  const expected = createHmac("sha256", stateSecret()).update(payload).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: number };
    return typeof parsed.exp === "number" && parsed.exp > now;
  } catch {
    return false;
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

export async function googleProfile(code: string, req?: Request): Promise<{ sub: string; email: string; name?: string }> {
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
  if (!tokenRes.ok || !tokenJson.access_token) {
    throw new Error(tokenJson.error || "Google 换 token 失败");
  }
  const me = await fetch(USERINFO, {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
  });
  const profile = (await me.json()) as { sub?: string; email?: string; name?: string };
  if (!profile.sub || !profile.email) throw new Error("Google 没返回邮箱");
  return { sub: profile.sub, email: profile.email, name: profile.name };
}
