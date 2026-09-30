import { readFile } from "node:fs/promises";
import path from "node:path";

/** 把已存的图读回 data-URL。出图服务访问不到本站的 /api/media。 */
export async function loadRef(src: string): Promise<string | null> {
  if (src.startsWith("data:image/")) return src;
  if (src.startsWith("https://")) return src;
  const mediaId = src.startsWith("/api/media/") ? src.slice("/api/media/".length).split(/[?#]/)[0] : "";
  if (/^[0-9a-f-]{36}$/i.test(mediaId)) {
    const { getMedia } = await import("@/lib/pgdb");
    const file = await getMedia(mediaId);
    if (!file) return null;
    return `data:${file.mime};base64,${file.bytes.toString("base64")}`;
  }
  const name = src.split("/generated/").pop()?.split("?")[0] ?? "";
  if (!/^[\w.-]+$/.test(name)) return null;
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "generated", name));
    const mime = name.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
