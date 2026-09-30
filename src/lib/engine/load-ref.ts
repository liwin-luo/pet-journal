import { readFile } from "node:fs/promises";
import path from "node:path";

/** 把已存的图读回 data-URL：出图服务访问不到本站的 /api/media。 */
export async function loadRef(src: string): Promise<string | null> {
  if (src.startsWith("data:image/")) return src;
  if (src.startsWith("https://")) return src;
  const tpl = src.startsWith("/tpl/") ? src.slice("/tpl/".length).split(/[?#]/)[0] : "";
  if (/^[\w.-]+$/.test(tpl)) {
    try {
      const buf = await readFile(path.join(process.cwd(), "public", "tpl", tpl));
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      return null;
    }
  }
  const mediaId = src.startsWith("/api/media/") ? src.slice("/api/media/".length).split(/[?#]/)[0] : "";
  if (/^[0-9a-f-]{36}$/i.test(mediaId)) {
    const { readStoreFile } = await import("../store");
    const up = await readStoreFile("uploads", mediaId);
    if (up) return `data:${up.mime};base64,${up.bytes.toString("base64")}`;
    const gen = await readStoreFile("generated", mediaId);
    if (gen) return `data:${gen.mime};base64,${gen.bytes.toString("base64")}`;
    return null;
  }
  return null;
}
