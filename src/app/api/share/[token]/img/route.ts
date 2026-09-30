import { NextResponse } from "next/server";
import { decodeImage, readShare } from "@/lib/share-store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const rec = readShare(token);
  const img = rec ? decodeImage(rec.image) : null;
  if (!img) return new NextResponse("not found", { status: 404 });
  return new NextResponse(new Uint8Array(img.body), {
    headers: { "Content-Type": img.type, "Cache-Control": "public, max-age=86400" },
  });
}
