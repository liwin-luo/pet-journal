import { NextResponse } from "next/server";
import { runEngine } from "@/lib/engine";
import { sessionOrNull } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/generate/anchor  body: { refImages?: string[], pet: PetPromptContext }
export async function POST(req: Request) {
  if (!await sessionOrNull()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const body = await req.json();
    const { image } = await runEngine((engine) => engine.generateAnchor({
      refImages: body.refImages,
      pet: body.pet,
    }));
    if (!image) throw new Error("no image");
    return NextResponse.json({ anchorImage: image });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "anchor failed";
    console.error("anchor", message.slice(0, 240));
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
