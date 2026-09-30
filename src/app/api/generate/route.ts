import { NextResponse } from "next/server";
import { generatePicture } from "@/lib/engine";
import { checkMessage } from "@/lib/moderation";
import { checkAndCount, FREE_DAILY_LIMIT, getDeviceId } from "@/lib/ratelimit";
import { randomUUID } from "node:crypto";
import { templateById } from "@/lib/templates";
import { updateDb } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { message?: unknown; templateId?: unknown; imageIds?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const message = checkMessage(body.message);
  if (!message.ok) return NextResponse.json({ error: message.reason }, { status: 400 });

  const tpl = typeof body.templateId === "string" ? templateById(body.templateId) : undefined;
  if (typeof body.templateId === "string" && body.templateId && !tpl) {
    return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  }

  const imageIds = Array.isArray(body.imageIds)
    ? body.imageIds.filter((x): x is string => typeof x === "string" && /^[0-9a-f-]{36}$/i.test(x)).slice(0, 4)
    : [];
  if (!imageIds.length && !message.text.trim() && !tpl) {
    return NextResponse.json({ error: "Tell us what to make, or attach a photo" }, { status: 400 });
  }

  const deviceId = await getDeviceId();
  const gate = await checkAndCount(deviceId);
  if (!gate.ok) {
    return NextResponse.json(
      { error: `You've used all ${FREE_DAILY_LIMIT} free pictures for today. Come back tomorrow!` },
      { status: 429 },
    );
  }

  try {
    const result = await generatePicture({
      message: message.text,
      templatePrompt: tpl?.prompt,
      imageIds,
    });

    const token = randomUUID().replace(/-/g, "").slice(0, 12);
    await updateDb((db) => {
      db.shares[token] = {
        token,
        image: result.image,
        templateId: tpl?.id,
        message: message.text,
        prompt: result.prompt,
        createdAt: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      image: result.image,
      prompt: result.prompt,
      planned: result.planned,
      shareUrl: `/share/${token}`,
      left: gate.left,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    console.error("[generate]", msg);
    return NextResponse.json(
      { error: "The studio hiccupped while painting. Please try again in a moment." },
      { status: 502 },
    );
  }
}
