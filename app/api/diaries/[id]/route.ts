import { updateDiary } from "@/lib/db/diaries.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  const { id } = await ctx.params;
  let body: { body?: string };
  try {
    body = (await req.json()) as { body?: string };
  } catch {
    return Response.json({ error: "请求读不出来" }, { status: 400 });
  }
  const text = body.body?.trim();
  if (!text) return Response.json({ error: "正文不能空" }, { status: 400 });
  const entry = await updateDiary(session.userId, id, { body: text, edited: true });
  if (!entry) return Response.json({ error: "这篇不是你的" }, { status: 404 });
  return Response.json({ entry });
}
