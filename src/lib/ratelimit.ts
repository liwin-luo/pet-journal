import { cookies } from "next/headers";
import { getSessionUser } from "./auth";
import { updateDb } from "./store";

const COOKIE = "paw_device";
const YEAR = 60 * 60 * 24 * 365;

export const FREE_DAILY_LIMIT = Number(process.env.FREE_DAILY_LIMIT || 3);

export async function getDeviceId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing && /^[\w-]{10,64}$/.test(existing)) return existing;
  const id = crypto.randomUUID();
  try {
    jar.set(COOKIE, id, { httpOnly: true, sameSite: "lax", maxAge: YEAR, path: "/" });
  } catch {
    // 只读上下文（RSC 里调用）会抛错；生成接口是 Route Handler，可以写。
  }
  return id;
}

/** 限额主体：登录用户按账号，匿名按设备。 */
export async function getSubjectId(): Promise<string> {
  const user = await getSessionUser().catch(() => null);
  if (user) return `u:${user.email}`;
  return `d:${await getDeviceId()}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function usedToday(db: { usage: Record<string, { date: string; count: number }> }, subject: string): number {
  const rec = db.usage[subject];
  return rec && rec.date === today() ? rec.count : 0;
}

/** 只查不加。生成成功后才 recordUse，失败不占额度。 */
export async function checkLimit(subject: string): Promise<{ ok: boolean; used: number; left: number }> {
  const db = await import("./store").then((m) => m.readDb());
  const used = usedToday(db, subject);
  return { ok: used < FREE_DAILY_LIMIT, used, left: Math.max(0, FREE_DAILY_LIMIT - used) };
}

export async function recordUse(subject: string): Promise<void> {
  await updateDb((db) => {
    const day = today();
    const rec = db.usage[subject];
    db.usage[subject] = { date: day, count: (rec && rec.date === day ? rec.count : 0) + 1 };
  });
}
