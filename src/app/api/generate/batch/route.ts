import { NextResponse } from "next/server";
import { runEngine } from "@/lib/engine";
import { isPortrait } from "@/lib/guards";
import { todayKey } from "@/lib/credits";
import { sessionOrNull } from "@/lib/session";
import { addStored, drawStored, readWallet } from "@/lib/accounts";

export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/generate/batch  body: { anchorImage, stylePrompt?, templatePrompt?, keepsakeScene?, pet, count }
// 先认登录，再按实际张数扣服务器钱包。失败把点数退回。
export async function POST(req: Request) {
  const user = await sessionOrNull();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const asked = Math.min(Math.max(Number(body.count) || 1, 1), 8);
  const { taken } = await drawStored(user.id, asked, todayKey());
  if (taken < 1) return NextResponse.json({ error: "no credits", ...await readWallet(user.id) }, { status: 402 });

  try {
    const pet = body.pet ?? { name: "your pet", breed: "pet", coat: "", tags: [] };
    const { images } = await runEngine((engine) => engine.generateBatch({ ...body, count: taken, pet }));
    const good = (images ?? []).filter((src) => isPortrait(src));
    if (!good.length) {
      await addStored(user.id, taken);
      return NextResponse.json({ error: "no images" }, { status: 502 });
    }
    if (good.length < taken) await addStored(user.id, taken - good.length);
    return NextResponse.json({ images: good, ...await readWallet(user.id) });
  } catch (e: unknown) {
    await addStored(user.id, taken);
    const message = e instanceof Error ? e.message : "batch failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

