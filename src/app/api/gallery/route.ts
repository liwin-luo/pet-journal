import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { checkGalleryText } from "@/lib/moderation";
import { updateDb } from "@/lib/store";
import { getAllGallery, splitWorksReviews } from "@/lib/gallery";
import { templateById } from "@/lib/templates";

export const runtime = "nodejs";

export async function GET() {
  const { works, reviews } = splitWorksReviews(await getAllGallery());
  return NextResponse.json({ works, reviews });
}

/** 投稿：作品 + 评价。先入库 pending，站长审核 approved 后前台可见。 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const text = checkGalleryText(body.text);
  if (!text.ok) return NextResponse.json({ error: text.reason }, { status: 400 });

  const image = typeof body.image === "string" && /^\/(api\/media\/[0-9a-f-]{36}|tpl\/[\w.-]+)$/.test(body.image)
    ? body.image
    : null;
  if (!image) return NextResponse.json({ error: "A picture is required" }, { status: 400 });

  const nickname = String(body.nickname ?? "").trim().slice(0, 40) || "Anonymous";
  const petName = String(body.petName ?? "").trim().slice(0, 40) || "their pet";
  const species = ["cat", "dog", "bird", "fish", "rabbit", "other"].includes(String(body.species))
    ? String(body.species)
    : "other";
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  const templateId = typeof body.templateId === "string" && templateById(body.templateId) ? body.templateId : undefined;

  await updateDb((db) => {
    db.gallery.push({
      id: randomUUID(),
      image,
      templateId,
      species,
      petName,
      nickname,
      text: text.text || undefined,
      rating,
      approved: false,
      createdAt: new Date().toISOString(),
    });
  });
  return NextResponse.json({ ok: true, message: "Thanks! Your picture will appear after a quick check." });
}
