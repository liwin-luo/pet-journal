import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { approveGalleryEntry, removeGalleryEntry } from "@/lib/store";

export const runtime = "nodejs";

function keyOk(key: unknown): boolean {
  const expected = process.env.ADMIN_KEY?.trim();
  if (!expected || typeof key !== "string") return false;
  const a = Buffer.from(key);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** 审核动作：approve / remove。需 ADMIN_KEY。 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { key?: string; id?: string; action?: string } | null;
  if (!body || !keyOk(body.key)) return NextResponse.json({ error: "Bad key" }, { status: 401 });
  if (!body.id || typeof body.id !== "string") return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (body.action === "approve") {
    await approveGalleryEntry(body.id);
    return NextResponse.json({ ok: true });
  }
  if (body.action === "remove") {
    await removeGalleryEntry(body.id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
