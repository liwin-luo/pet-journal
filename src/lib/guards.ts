// 画像地址是否真能显示。失败占位符 "MOCK" 和 ref:// 都不能当 src。
export function isPortrait(src?: string | null): boolean {
  if (!src || src === "MOCK") return false;
  return src.startsWith("data:image/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/generated/");
}
