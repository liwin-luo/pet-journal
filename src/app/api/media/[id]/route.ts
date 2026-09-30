import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth";
import { readDb, readStoreFile } from "@/lib/store";

export const runtime = "nodejs";

/**
 * 生成图访问规则（上传图 UUID 不可猜，保持公开以支持匿名预览与生成链路）：
 * - 登录用户可取
 * - st=分享令牌 放行分享页/社交卡
 * - 已审核进入画廊的作品公开
 * - 生成者本人设备（device cookie 匹配）可回看自己的历史图
 * 其余一律 401 —— 下载按钮未登录会引导登录。
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const up = await readStoreFile("uploads", id);
  if (up) return imageResponse(up.bytes, up.mime, "public, max-age=31536000, immutable");

  const file = await readStoreFile("generated", id);
  if (!file) return new Response("Not found", { status: 404 });

  const path = `/api/media/${id}`;
  const url = new URL(req.url);
  const st = url.searchParams.get("st");
  const device = (await cookies().catch(() => null))?.get("paw_device")?.value ?? null;

  const db = await readDb();
  const allowed =
    !!(await getSessionUser().catch(() => null)) ||
    (st ? db.shares[st]?.image === path : false) ||
    db.gallery.some((g) => g.approved && g.image === path) ||
    (device ? Object.values(db.shares).some((s) => s.image === path && s.deviceId === device) : false);

  if (!allowed) {
    return Response.json({ error: "Sign in to download this picture", loginUrl: "/login" }, { status: 401 });
  }
  // 门控资源只允许浏览器私有缓存，避免公共缓存把图漏给未登录用户
  return imageResponse(file.bytes, file.mime, "private, max-age=86400");
}

function imageResponse(bytes: Buffer, mime: string, cacheControl: string): Response {
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": mime, "Cache-Control": cacheControl },
  });
}
