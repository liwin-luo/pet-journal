import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listWorks } from "@/lib/diary";
import { getDeviceId, getSubjectId } from "@/lib/ratelimit";
import { getPetProfile } from "@/lib/store";

export const runtime = "nodejs";

/** 日记数据：主人全量作品 + 宠物档案。文案按需走 POST /api/diary/caption。 */
export async function GET() {
  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  const works = await listWorks({ email: user?.email ?? null, deviceId });
  const pet = await getPetProfile(await getSubjectId());
  return NextResponse.json({ works, pet });
}
