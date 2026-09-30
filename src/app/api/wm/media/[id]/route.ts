import { canAccessGenerated } from "@/lib/media-access";
import { addDomainWatermark } from "@/lib/watermark";
import { readStoreFile } from "@/lib/store";

export const runtime = "nodejs";

/** 生成图的水印出口：与 /api/media 相同的访问规则，但输出带域名水印（下载传播均带品牌）。 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = await readStoreFile("generated", id);
  if (!file) return new Response("Not found", { status: 404 });

  if (!(await canAccessGenerated(id, req))) {
    return Response.json({ error: "Sign in to download this picture", loginUrl: "/login" }, { status: 401 });
  }

  const out = await addDomainWatermark(file.bytes);
  // 门控资源只允许浏览器私有缓存
  return new Response(new Uint8Array(out), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "private, max-age=86400" },
  });
}
