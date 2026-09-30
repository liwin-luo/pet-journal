import { readFile } from "node:fs/promises";
import path from "node:path";

/** 把本地成图读回 data-URL。出图服务访问不到 localhost。 */
export async function loadRef(src: string): Promise<string | null> {
  if (src.startsWith("data:image/")) return src;
  if (src.startsWith("https://")) return src;
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
