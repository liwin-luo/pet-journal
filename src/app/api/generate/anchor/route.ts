import { NextResponse } from "next/server";
import { planPicture, readPlanBody } from "@/lib/engine/agent";
import { completeText, runEngine } from "@/lib/engine";
import { sessionOrNull } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/generate/anchor  body: 对话框原文、@ 提及、可选图片。先问语言模型，再出图。
export async function POST(req: Request) {
  if (!await sessionOrNull()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const body = await req.json();
    const plan = await planPicture(readPlanBody(body), completeText);
    const { image } = await runEngine((engine) => engine.generateAnchor({
      prompt: plan.prompt,
      refImages: plan.refs,
      pet: body.pet ?? { name: "your pet", breed: "pet", coat: "", tags: [] },
    }));
    if (!image) throw new Error("no image");
    return NextResponse.json({ anchorImage: image });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "anchor failed";
    console.error("anchor", message.slice(0, 240));
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
