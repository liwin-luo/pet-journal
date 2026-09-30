import { NextResponse } from "next/server";
import { planPicture, readPlanBody } from "@/lib/engine/agent";
import { completeText, runEngine } from "@/lib/engine";
import { isPortrait } from "@/lib/guards";
import { creditsLeft, todayKey } from "@/lib/credits";
import { sessionOrNull } from "@/lib/session";
import { drawStored, readState, readWallet, restoreStored } from "@/lib/accounts";

export const runtime = "nodejs";
export const maxDuration = 300;

// POST /api/generate/batch  body: 对话框原文、@ 提及、可选图片、count。先问语言模型，再出图。
// 额度先看余额，图成功写进库之后才扣。失败不扣。
export async function POST(req: Request) {
  const user = await sessionOrNull();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const today = todayKey();
  const asked = Math.min(Math.max(Number(body.count) || 1, 1), 8);
  let before = await readWallet(user.id);
  let room = creditsLeft(before, today);
  if (room < 1 && !before.refilled && (await readState(user.id)).orders.length === 0) {
    before = await restoreStored(user.id);
    room = creditsLeft(before, today);
  }
  if (room < 1) return NextResponse.json({ error: "no credits", ...before }, { status: 402 });

  try {
    const plan = await planPicture(readPlanBody(body), completeText);
    const pet = body.pet ?? { name: "your pet", breed: "pet", coat: "", tags: [] };
    const { images } = await runEngine((engine) => engine.generateBatch({
      count: Math.min(asked, room),
      anchorImage: plan.refs[0] || "",
      prompt: plan.prompt,
      refImages: plan.refs,
      pet,
    }));
    const good = (images ?? []).filter((src) => isPortrait(src));
    if (!good.length) return NextResponse.json({ error: "no images" }, { status: 502 });
    const charged = await drawStored(user.id, good.length, today);
    if (charged.taken < 1) return NextResponse.json({ error: "no credits", ...charged.wallet }, { status: 402 });
    return NextResponse.json({ images: good.slice(0, charged.taken), ...charged.wallet });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "batch failed";
    console.error("batch", message.slice(0, 240));
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

