import { getSessionUser } from "@/lib/auth";
import { readDb, readStoreFile } from "@/lib/store";
import { canAccessGenerated } from "@/lib/media-access";

export const runtime = "nodejs";

/**
 * 媒体出口：
 * - 上传图（UUID 不可猜）公开，支持匿名预览与生成链路
 * - 生成图：登录 / st=分享令牌 / 已入画廊 / 生成者本人设备 可取；其余 401（下载需登录）
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

  let allowed = !!(await getSessionUser().catch(() => null));
  if (!allowed && st) {
    const db = await readDb();
    allowed = db.shares[st]?.image === path;
  }
  if (!allowed) {
    const db = await readDb();
    allowed = db.gallery.some((g) => g.approved && g.image === path);
  }
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
