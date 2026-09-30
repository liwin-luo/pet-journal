import { NextResponse } from "next/server";
import { runEngine } from "@/lib/engine";
import { sessionOrNull } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

// POST /api/diary  body: { pet: PetPromptContext, note?: string, lang: string }
export async function POST(req: Request) {
  if (!await sessionOrNull()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const body = await req.json();
    const { text } = await runEngine((engine) => engine.writeDiary({
      pet: body.pet ?? { name: "your pet", breed: "pet", coat: "", tags: [] },
      note: body.note,
      lang: body.lang ?? "en",
    }));
    if (!text?.trim()) throw new Error("no text");
    return NextResponse.json({ text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "diary failed";
    console.error("diary", message.slice(0, 240));
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
