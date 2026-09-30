import { NextResponse } from "next/server";
import { completeText } from "@/lib/engine";
import { sessionOrNull } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!await sessionOrNull()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const card = String(body.card || "").trim();
  const lang = String(body.lang || "en");
  const petName = String(body.petName || "");
  if (!card) return NextResponse.json({ error: "empty" }, { status: 400 });
  try {
    const text = await completeText(
      `Rewrite this pet gift card in 2 short warm sentences. Language: ${lang}. Pet: ${petName}. Keep the sender's meaning. No prices.\n\n${card}`,
    );
    return NextResponse.json({ text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "polish failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
