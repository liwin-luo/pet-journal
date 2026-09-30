import { cookies } from "next/headers";
import { cookieDomain } from "./site";
import { getSessionUser } from "./auth";
import { bumpUsage, peekUsage } from "./store";

const COOKIE = "paw_device";
const YEAR = 60 * 60 * 24 * 365;

export const FREE_DAILY_LIMIT = Number(process.env.FREE_DAILY_LIMIT || 3);

export async function getDeviceId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing && /^[\w-]{10,64}$/.test(existing)) return existing;
  const id = crypto.randomUUID();
  try {
    jar.set(COOKIE, id, { httpOnly: true, sameSite: "lax", maxAge: YEAR, path: "/", domain: cookieDomain() });
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

/** 只查不加。生成成功后才 recordUse，失败不占额度。 */
export async function checkLimit(subject: string): Promise<{ ok: boolean; used: number; left: number }> {
  const used = await peekUsage(subject, today());
  return { ok: used < FREE_DAILY_LIMIT, used, left: Math.max(0, FREE_DAILY_LIMIT - used) };
}

export async function recordUse(subject: string): Promise<void> {
  await bumpUsage(subject, today());
}

/** 下一次额度重置时间（UTC 零点）的 ISO 串。 */
export function nextResetIso(): string {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
}

/** 个人中心额度信息：已用 / 上限 / 剩余。 */
export async function getQuota(subject: string): Promise<{ used: number; limit: number; left: number }> {
  const used = await peekUsage(subject, today());
  return { used, limit: FREE_DAILY_LIMIT, left: Math.max(0, FREE_DAILY_LIMIT - used) };
}
