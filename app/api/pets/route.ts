import { listPets, upsertPet } from "@/lib/db/pets.ts";
import { lastPetId, rememberLastPet } from "@/lib/db/users.ts";
import { emptyPet } from "@/lib/pets.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";
import type { Pet } from "@/lib/types.ts";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  return Response.json({
    pets: await listPets(session.userId),
    lastPetId: await lastPetId(session.userId),
  });
}

export async function POST(req: Request) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();
  let pet: Pet;
  try {
    pet = { ...emptyPet(), ...((await req.json()) as Partial<Pet>) };
  } catch {
    return Response.json({ error: "请求读不出来" }, { status: 400 });
  }
  if (!pet.name.trim()) return Response.json({ error: "先起个名字" }, { status: 400 });
  if (pet.photos.length < 1) return Response.json({ error: "至少一张正面参考图" }, { status: 400 });
  const saved = await upsertPet(session.userId, pet);
  await rememberLastPet(session.userId, saved.id);
  return Response.json({ pet: saved });
}
