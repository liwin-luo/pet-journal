import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { saveShare } from "@/lib/share-store";
import { isPortrait } from "@/lib/guards";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await getSessionUser();
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  if (!/^s_[a-z0-9]+$/i.test(token)) return NextResponse.json({ error: "bad token" }, { status: 400 });
  const image = String(body.image || "");
  if (!isPortrait(image) || image.length > 1_500_000) {
    return NextResponse.json({ error: "bad image" }, { status: 400 });
  }
  const kind = body.kind === "diary" ? "diary" : "work";
  await saveShare({
    token,
    kind,
    petName: String(body.petName || "").slice(0, 40),
    text: String(body.text || "").slice(0, 800),
    image,
    date: Number(body.date) || Date.now(),
    mark: Boolean(body.mark),
  });
  return NextResponse.json({ ok: true, token });
}
