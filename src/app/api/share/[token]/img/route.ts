import { NextResponse } from "next/server";
import { getMedia } from "@/lib/pgdb";
import { decodeImage, readShare } from "@/lib/share-store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const rec = await readShare(token);
  const img = rec ? decodeImage(rec.image) : null;
  if (img) {
    return new NextResponse(new Uint8Array(img.body), {
      headers: { "Content-Type": img.type, "Cache-Control": "public, max-age=86400" },
    });
  }
  const mediaId = rec?.image.startsWith("/api/media/") ? rec.image.slice("/api/media/".length).split(/[?#]/)[0] : "";
  if (!/^[0-9a-f-]{36}$/i.test(mediaId)) return new NextResponse("not found", { status: 404 });
  const file = await getMedia(mediaId);
  if (!file) return new NextResponse("not found", { status: 404 });
  return new NextResponse(new Uint8Array(file.bytes), {
    headers: { "Content-Type": file.mime, "Cache-Control": "public, max-age=86400" },
  });
}
