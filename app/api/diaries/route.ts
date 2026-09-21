import { listDiaries } from "@/lib/db/diaries.ts";
import { lastPetId, rememberLastPet } from "@/lib/db/users.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  const petId = new URL(req.url).searchParams.get("petId");
  if (!petId) return Response.json({ error: "缺少宠物" }, { status: 400 });
  await rememberLastPet(session.userId, petId);
  return Response.json({
    entries: await listDiaries(session.userId, petId),
    lastPetId: await lastPetId(session.userId),
  });
}
