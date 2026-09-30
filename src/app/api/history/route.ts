import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listHistory } from "@/lib/history";
import { getDeviceId } from "@/lib/ratelimit";

export const runtime = "nodejs";

/** 生成历史：登录按账号，匿名按设备 cookie（同一浏览器登录前后都能找回图）。 */
export async function GET() {
  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  const items = await listHistory({ email: user?.email ?? null, deviceId });
  return NextResponse.json({ items });
}
