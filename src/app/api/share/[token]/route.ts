import { NextResponse } from "next/server";
import { readShare } from "@/lib/share-store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const rec = await readShare(token);
  if (!rec) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rec);
}
