import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { listPlaza, publishPlaza, unpublishPlaza } from "@/lib/share-store";
import { isPortrait } from "@/lib/guards";

export const runtime = "nodejs";

const SOURCE = /^(?:work:[A-Za-z0-9_-]+:\d{1,4}|diary:[A-Za-z0-9_-]+)$/;

export async function GET() {
  const items = listPlaza().map(({ token, kind, petName, text, date }) => ({ token, kind, petName, text, date }));
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  let user;
  try { user = await getSessionUser(); }
  catch { return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 }); }

  const body = await req.json().catch(() => ({}));
  const source = String(body.source || "");
  if (!SOURCE.test(source)) return NextResponse.json({ error: "bad source" }, { status: 400 });

  if (!body.on) {
    const rec = unpublishPlaza(source, user.id);
    if (!rec) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ on: false, token: rec.token });
  }

  const image = String(body.image || "");
  if (!isPortrait(image) || image.length > 1_500_000) {
    return NextResponse.json({ error: "bad image" }, { status: 400 });
  }
  const rec = publishPlaza({
    token: "s_" + Date.now().toString(36),
    source,
    ownerId: user.id,
    kind: body.kind === "diary" ? "diary" : "work",
    petName: String(body.petName || "").slice(0, 40),
    text: String(body.text || "").slice(0, 800),
    image,
    date: Number(body.date) || Date.now(),
    plaza: true,
  });
  return NextResponse.json({ on: true, token: rec.token });
}
