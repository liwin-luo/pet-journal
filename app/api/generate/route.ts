import { insertImage } from "@/lib/db/images.ts";
import { generatePetStill, publicImageError } from "@/lib/generate-image.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";
import {
  buildPrompt,
  findTemplate,
  validateGenerate,
  type TemplateId,
} from "@/lib/templates.ts";
import type { PromptFriend, PromptPet } from "@/lib/types.ts";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  pet?: PromptPet & { id?: string; photos?: string[] };
  petId?: string;
  friend?: PromptFriend & { photos?: string[]; id?: string };
  templateId?: string;
  seed?: number;
};

export async function POST(req: Request) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "请求读不出来" }, { status: 400 });
  }

  const pet = body.pet;
  const photos = pet?.photos?.filter(Boolean) ?? [];
  const template = findTemplate(body.templateId);
  const petId = body.petId || pet?.id;
  const friend = body.friend?.name?.trim()
    ? { name: body.friend.name, species: body.friend.species, relation: body.friend.relation }
    : undefined;

  if (!pet || !petId || !template) {
    return Response.json({ error: "缺少宠物或模板" }, { status: 400 });
  }

  const check = validateGenerate({ name: pet.name, photos }, friend, template.id);
  if (!check.ok) {
    return Response.json({ error: check.message, code: check.code }, { status: 400 });
  }

  const seed = Number.isFinite(body.seed) ? Number(body.seed) : Math.floor(Math.random() * 1_000_000_000);
  const refs = [...photos, ...(body.friend?.photos ?? [])].slice(0, 4);

  try {
    const result = await generatePetStill({
      prompt: buildPrompt(pet, friend, template.id as TemplateId),
      refs,
      seed,
      petName: pet.name,
      template,
    });
    await insertImage(session.userId, {
      id: crypto.randomUUID(),
      petId,
      petName: pet.name,
      source: "template",
      templateId: template.id,
      friendId: body.friend?.id,
      friendName: friend?.name,
      imageUrl: result.imageUrl,
      mock: result.mock,
      seed: result.seed,
      createdAt: Date.now(),
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "模型失败";
    console.error("generate failed", message);
    return Response.json({ error: publicImageError(message) }, { status: 502 });
  }
}
