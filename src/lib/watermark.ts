import path from "node:path";
import sharp from "sharp";

// 域名水印：预生成的文字图层（public/wm-overlay.png，白字深描边、透明底），
// 运行时按底图宽度等比缩放后合成到右下角。运行环境无需字体。
const OVERLAY_PATH = path.join(process.cwd(), "public", "wm-overlay.png");

export async function addDomainWatermark(bytes: Buffer): Promise<Buffer> {
  const base = sharp(bytes, { failOn: "none" });
  const meta = await base.metadata();
  const w = meta.width ?? 800;
  const h = meta.height ?? 600;

  const overlay = await sharp(OVERLAY_PATH).resize({ width: Math.round(w * 0.5) }).png().toBuffer();
  const om = await sharp(overlay).metadata();
  const padX = Math.round(w * 0.025);
  const padY = Math.round(h * 0.025);
  const left = Math.max(0, w - (om.width ?? 0) - padX);
  const top = Math.max(0, h - (om.height ?? 0) - padY);

  return base
    .composite([{ input: overlay, left, top }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}
