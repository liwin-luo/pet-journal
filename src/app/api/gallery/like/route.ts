import { NextResponse } from "next/server";
import { getAllGallery } from "@/lib/gallery";
import { getDeviceId } from "@/lib/ratelimit";
import { toggleLike } from "@/lib/store";

export const runtime = "nodejs";

/** 点赞切换：设备去重（再次点击取消）。 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const all = await getAllGallery();
  if (!all.some((g) => g.id === id)) {
    return NextResponse.json({ error: "Unknown work" }, { status: 404 });
  }

  const deviceId = await getDeviceId();
  const result = await toggleLike(id, deviceId);
  return NextResponse.json(result);
}
