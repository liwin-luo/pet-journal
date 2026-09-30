import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { saveGift } from "@/lib/gift-store";
import { isPortrait } from "@/lib/guards";

export const runtime = "nodejs";

// 收礼链接的数据。买家登录后写入；收礼人用 token 读取，不需要账号。
export async function POST(req: Request) {
  try {
    await getSessionUser();
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  if (!/^g_[a-z0-9]+$/i.test(token)) {
    return NextResponse.json({ error: "bad token" }, { status: 400 });
  }
  const images = Array.isArray(body.images)
    ? body.images.filter((x: unknown) => typeof x === "string" && isPortrait(x)).slice(0, 12)
    : [];
  saveGift({
    token,
    toName: String(body.toName || "").slice(0, 80),
    email: String(body.email || "").slice(0, 120),
    when: String(body.when || "now").slice(0, 40),
    card: String(body.card || "").slice(0, 500),
    petName: String(body.petName || "").slice(0, 40),
    images,
  });
  return NextResponse.json({ ok: true, token });
}
