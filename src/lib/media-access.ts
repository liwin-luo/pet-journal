import { cookies } from "next/headers";
import { getSessionUser } from "./auth";
import { readDb } from "./store";

/**
 * 生成图的访问规则（与 /api/media 一致）：
 * - 登录用户可取
 * - st=分享令牌 放行分享页/社交卡
 * - 已审核进入画廊的作品公开
 * - 生成者本人设备（device cookie 匹配）可回看自己的历史图
 */
export async function canAccessGenerated(id: string, req: Request): Promise<boolean> {
  const path = `/api/media/${id}`;
  if (await getSessionUser().catch(() => null)) return true;

  const url = new URL(req.url);
  const st = url.searchParams.get("st");
  const device = (await cookies().catch(() => null))?.get("paw_device")?.value ?? null;
  const db = await readDb();

  if (st && db.shares[st]?.image === path) return true;
  if (db.gallery.some((g) => g.approved && g.image === path)) return true;
  if (device) return Object.values(db.shares).some((s) => s.image === path && s.deviceId === device);
  return false;
}
