import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDeviceId } from "@/lib/ratelimit";
import { readDb } from "@/lib/store";

export const runtime = "nodejs";

/** 生成历史：登录按账号，匿名按设备 cookie（同一浏览器登录前后都能找回图）。 */
export async function GET() {
  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  const db = await readDb();

  const items = Object.values(db.shares)
    .filter((s) => (user?.email ? s.email === user.email : false) || (s.deviceId && s.deviceId === deviceId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 24)
    .map((s) => ({
      imagePath: s.image,
      shareUrl: `/share/${s.token}`,
      prompt: s.prompt,
      message: s.message,
      templateId: s.templateId,
      createdAt: s.createdAt,
    }));

  return NextResponse.json({ items });
}
