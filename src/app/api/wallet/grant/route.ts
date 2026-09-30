import { NextResponse } from "next/server";
import { publicOrigin } from "@/lib/google-oauth";
import { sessionOrNull } from "@/lib/session";
import { grantStored } from "@/lib/accounts";

export const runtime = "nodejs";

// 本机没有 Paddle 时，登录后可以把点数记到这个用户身上，方便把流程走通。
// 正式域名或已经配了 PADDLE_API_KEY 时拒绝，避免假购买变成真余额。
export async function POST(req: Request) {
  const user = await sessionOrNull();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const host = new URL(publicOrigin(req)).hostname;
  const local = host === "127.0.0.1" || host === "localhost";
  if (!local || process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: "pay" }, { status: 501 });
  }
  const body = await req.json().catch(() => ({}));
  const tier = body.tier === "home" ? "home" : body.tier === "studio" ? "studio" : "";
  if (!tier) return NextResponse.json({ error: "tier" }, { status: 400 });
  return NextResponse.json(await grantStored(user.id, tier));
}
