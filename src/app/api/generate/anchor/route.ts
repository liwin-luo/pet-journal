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
  } catch (e: any) {
    // 引擎降级预案（技术调研 §1.4）：连续失败由客户端切换 Mock 引擎重试
    return NextResponse.json({ error: e.message ?? "anchor failed" }, { status: 502 });
  }
}
