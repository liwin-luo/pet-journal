// Google 已配置时必须有登录 cookie。没配时仍用 demo，方便本地没密钥时打开页面。
import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "@/lib/session-cookie";
import { userById } from "@/lib/accounts";

export interface SessionUser { id: string; email?: string; name?: string }

export const AUTH_ENABLED = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() || process.env.GOOGLE_CLIENT_ID?.trim(),
);

export async function sessionOrNull(): Promise<SessionUser | null> {
  try { return await getSessionUser(); }
  catch { return null; }
}

export async function getSessionUser(): Promise<SessionUser> {
  if (!AUTH_ENABLED) return { id: "demo-user", email: "demo@petpics.app" };
  const jar = await cookies();
  const id = readSession(jar.get(SESSION_COOKIE)?.value);
  const user = id ? await userById(id) : undefined;
  if (!user) throw new Error("UNAUTHORIZED");
  return { id: user.id, email: user.email, name: user.name };
}

export const authEnabled = AUTH_ENABLED;
