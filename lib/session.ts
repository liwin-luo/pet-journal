import { cookies } from "next/headers";
import { authStatus } from "./scope.ts";
import { readSession, SESSION_COOKIE } from "./session-cookie.ts";

export async function requireUserId(): Promise<{ ok: true; userId: string } | { ok: false; status: 401 }> {
  const jar = await cookies();
  const userId = readSession(jar.get(SESSION_COOKIE)?.value);
  if (authStatus(userId) === 401 || !userId) return { ok: false, status: 401 };
  return { ok: true, userId };
}

export function unauthorized() {
  return Response.json({ error: "先登录" }, { status: 401 });
}
