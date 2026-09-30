import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listWorks } from "@/lib/diary";
import { getDeviceId, getSubjectId } from "@/lib/ratelimit";
import { savePetProfile } from "@/lib/store";

export const runtime = "nodejs";

/** 保存宠物档案。头像必须选自主人自己的作品（防跨用户引用）。 */
export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; species?: unknown; avatar?: unknown }
    | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "";
  const species = typeof body?.species === "string" ? body.species.trim().slice(0, 30) : "";
  if (!name) return NextResponse.json({ error: "Pet name is required" }, { status: 400 });

  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  // 与 getSubjectId 同构，但这里已持有 email/deviceId，省一次会话解析
  const ownerKey = user ? `u:${user.email}` : `d:${deviceId}`;

  let avatar: string | undefined;
  if (typeof body?.avatar === "string" && /^\/api\/media\/[0-9a-f-]{36}$/i.test(body.avatar)) {
    const mine = await listWorks({ email: user?.email ?? null, deviceId });
    if (mine.some((w) => w.image === body.avatar)) avatar = body.avatar;
  }

  const pet = await savePetProfile(ownerKey, { name, species, avatar });
  return NextResponse.json({ pet });
}
