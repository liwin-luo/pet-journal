import { readFile } from "node:fs/promises";
import path from "node:path";
import { addDomainWatermark } from "@/lib/watermark";
import { getAllGallery } from "@/lib/gallery";
import { readStoreFile } from "@/lib/store";

export const runtime = "nodejs";

/**
 * 带域名水印的图片出口（模板示例图 + 画廊作品）：
 * - /api/wm/tpl/{file}.jpg      → public/tpl 示例图
 * - /api/wm/gallery/{entryId}   → 已公开画廊作品（模板图或已审核媒体）
 * 结果确定性，CDN/浏览器可永久缓存。
 */
export async function GET(_req: Request, { params }: { params: Promise<{ seg?: string[] }> }) {
  const { seg } = await params;
  const [kind = "", name = ""] = seg ?? [];
  let bytes: Buffer | null = null;

  try {
    if (kind === "tpl" && name && /^[\w.-]+\.jpe?g$/i.test(name)) {
      bytes = await readFile(path.join(process.cwd(), "public", "tpl", name));
    } else if (kind === "land" && name && /^[\w.-]+\.jpe?g$/i.test(name)) {
      bytes = await readFile(path.join(process.cwd(), "public", "land", name));
    } else if (kind === "gallery" && name && /^[0-9a-zA-Z-]+$/.test(name)) {
      const all = await getAllGallery();
      const entry = all.find((g) => g.id === name);
      if (entry) {
        const img = entry.image;
        if (img.startsWith("/land/")) {
          bytes = await readFile(path.join(process.cwd(), "public", "land", img.slice("/land/".length)));
        } else if (img.startsWith("/tpl/")) {
          bytes = await readFile(path.join(process.cwd(), "public", "tpl", img.slice("/tpl/".length)));
        } else if (img.startsWith("/api/media/")) {
          const mediaId = img.slice("/api/media/".length).split(/[?#]/)[0];
          bytes = (await readStoreFile("generated", mediaId) ?? (await readStoreFile("uploads", mediaId)))?.bytes ?? null;
        }
      }
    }
  } catch {
    bytes = null;
  }

  if (!bytes) return new Response("Not found", { status: 404 });

  const out = await addDomainWatermark(bytes);
  return new Response(new Uint8Array(out), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
