import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { generatePicture } from "@/lib/engine";
import { BLOCKED_REASON, checkMessage, gateRequest } from "@/lib/moderation";
import { checkLimit, FREE_DAILY_LIMIT, getDeviceId, getSubjectId, recordUse } from "@/lib/ratelimit";
import { readStoreFile, storeImage, updateDb } from "@/lib/store";
import { templateById } from "@/lib/templates";

export const runtime = "nodejs";
export const maxDuration = 300;

/** 把生成图读回 data-URL，给未登录用户当即时预览（展示保持干净；水印只在下载时携带）。 */
async function toDataUrl(path: string): Promise<string | null> {
  const id = path.slice("/api/media/".length).split(/[?#]/)[0];
  const file = await readStoreFile("generated", id);
  if (!file) return null;
  return `data:${file.mime};base64,${file.bytes.toString("base64")}`;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { message?: unknown; templateId?: unknown; imageIds?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  // 1) 关键词黑名单
  const message = checkMessage(body.message);
  if (!message.ok) return NextResponse.json({ error: message.reason }, { status: 400 });

  const tpl = typeof body.templateId === "string" ? templateById(body.templateId) : undefined;
  if (typeof body.templateId === "string" && body.templateId && !tpl) {
    return NextResponse.json({ error: "Unknown template" }, { status: 400 });
  }

  const imageIds = Array.isArray(body.imageIds)
    ? body.imageIds.filter((x): x is string => typeof x === "string" && /^[0-9a-f-]{36}$/i.test(x)).slice(0, 4)
    : [];

  // 2) 语义门控：诉求必须是"给宠物做图"，且内容合法（GLM 判定，非宠物/违规一律拒绝）
  const gate = await gateRequest(message.text);
  if (!gate.ok) return NextResponse.json({ error: gate.reason || BLOCKED_REASON }, { status: 400 });

  if (!imageIds.length && !message.text.trim() && !tpl) {
    return NextResponse.json({ error: "Tell us what to make, or attach a photo" }, { status: 400 });
  }

  // 3) 限额：登录按账号，匿名按设备；生成成功后才计数，失败不占额度
  const subject = await getSubjectId();
  const limit = await checkLimit(subject);
  if (!limit.ok) {
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
    const user = await getSessionUser().catch(() => null);
    const deviceId = await getDeviceId();
    let publicPath: string;
    let preview: string | undefined; // 未登录的即时预览（data-URL）

    if (result.image.startsWith("/api/media/")) {
      publicPath = result.image;
      if (!user) preview = (await toDataUrl(publicPath)) ?? undefined;
    } else {
      // Mock data-URL：落盘一份，登录后的下载/投稿走统一出口
      const b64 = result.image.slice(result.image.indexOf(";base64,") + 8);
      const mime = result.image.slice(5, result.image.indexOf(";"));
      const id = await storeImage(Buffer.from(b64, "base64"), "generated", mime);
      publicPath = `/api/media/${id}`;
      if (!user) preview = result.image;
    }

    await updateDb((db) => {
      db.shares[token] = {
        token,
        image: publicPath,
        templateId: tpl?.id,
        message: message.text,
        prompt: result.prompt,
        createdAt: new Date().toISOString(),
        deviceId,
        email: user?.email,
      };
    });

    await recordUse(subject);

    return NextResponse.json({
      // 未登录：内嵌预览图，下载必须先登录；登录：直接引用受会话保护的媒体地址
      image: user ? publicPath : preview ?? publicPath,
      imagePath: publicPath,
      prompt: result.prompt,
      planned: result.planned,
      shareUrl: `/share/${token}`,
      left: Math.max(0, FREE_DAILY_LIMIT - limit.used - 1),
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
