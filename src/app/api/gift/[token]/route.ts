import { NextResponse } from "next/server";
import { readGift } from "@/lib/gift-store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const gift = await readGift(token);
  if (!gift) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(gift);
}
