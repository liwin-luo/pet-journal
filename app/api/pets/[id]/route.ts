import { getPet, removePet, upsertPet } from "@/lib/db/pets.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";
import type { Pet } from "@/lib/types.ts";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  const { id } = await ctx.params;
  const pet = await getPet(session.userId, id);
  if (!pet) return Response.json({ error: "这只不在册子里了" }, { status: 404 });
  return Response.json({ pet });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  const { id } = await ctx.params;
  const existing = await getPet(session.userId, id);
  if (!existing) return Response.json({ error: "这只不在册子里了" }, { status: 404 });
  let patch: Partial<Pet>;
  try {
    patch = (await req.json()) as Partial<Pet>;
  } catch {
    return Response.json({ error: "请求读不出来" }, { status: 400 });
  }
  const pet = { ...existing, ...patch, id };
  if (!pet.name.trim()) return Response.json({ error: "先起个名字" }, { status: 400 });
  if (pet.photos.length < 1) return Response.json({ error: "至少一张正面参考图" }, { status: 400 });
  return Response.json({ pet: await upsertPet(session.userId, pet) });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  const { id } = await ctx.params;
  await removePet(session.userId, id);
  return Response.json({ ok: true });
}
