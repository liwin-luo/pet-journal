import { cookies } from "next/headers";
import { updateDb } from "./store";

const COOKIE = "paw_device";
const YEAR = 60 * 60 * 24 * 365;

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

export const FREE_DAILY_LIMIT = Number(process.env.FREE_DAILY_LIMIT || 5);

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function checkAndCount(deviceId: string): Promise<{ ok: boolean; left: number }> {
  return updateDb((db) => {
    const day = today();
    const rec = db.usage[deviceId];
    const count = rec && rec.date === day ? rec.count : 0;
    if (count >= FREE_DAILY_LIMIT) return { ok: false, left: 0 };
    db.usage[deviceId] = { date: day, count: count + 1 };
    return { ok: true, left: FREE_DAILY_LIMIT - count - 1 };
  });
}

export async function remainingUses(deviceId: string): Promise<number> {
  const db = await import("./store").then((m) => m.readDb());
  const rec = db.usage[deviceId];
  const count = rec && rec.date === today() ? rec.count : 0;
  return Math.max(0, FREE_DAILY_LIMIT - count);
}
