import { updateDiary } from "@/lib/db/diaries.ts";
import { insertImage } from "@/lib/db/images.ts";
import { validateDiaryImage } from "@/lib/diary-copy.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";
import type { PromptPet } from "@/lib/types.ts";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  pet?: PromptPet & { id?: string; photos?: string[] };
  petId?: string;
  body?: string;
  photos?: string[];
  diaryId?: string;
};

export async function POST(req: Request) {
  const session = await requireUserId();
  if (!session.ok) return unauthorized();

  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "请求读不出来" }, { status: 400 });
  }

  const pet = payload.pet;
  const text = payload.body?.trim() ?? "";
  const photos = (payload.photos ?? pet?.photos ?? []).filter(Boolean);
  const petId = payload.petId || pet?.id;
  if (!pet || !petId) return Response.json({ error: "缺少宠物" }, { status: 400 });

  const check = validateDiaryImage({ name: pet.name, body: text, photos });
  if (!check.ok) {
    return Response.json({ error: check.message, code: check.code }, { status: 400 });
  }

  try {
    const { mastra } = await import("@/lib/mastra/index.ts");
    const workflow = mastra.getWorkflow("diaryImageWorkflow");
    const run = await workflow.createRun();
    const result = await run.start({
      inputData: { pet, body: text, photos },
    });
    if (result.status !== "success") {
      throw new Error(result.status === "failed" ? String(result.error) : result.status);
    }
    const drawn = result.result;
    if (payload.diaryId) {
      await updateDiary(session.userId, payload.diaryId, {
        imageUrl: drawn.imageUrl,
        mock: drawn.mock,
      });
    }
    await insertImage(session.userId, {
      id: crypto.randomUUID(),
      petId,
      petName: pet.name,
      source: "diary",
      templateId: "diary",
      diaryId: payload.diaryId,
      imageUrl: drawn.imageUrl,
      mock: drawn.mock,
      seed: drawn.seed,
      createdAt: Date.now(),
    });
    return Response.json(drawn);
  } catch (error) {
    const message = error instanceof Error ? error.message : "模型失败";
    console.error("diary image failed", message);
    return Response.json({ error: "配图失败，字还在，可以重试" }, { status: 502 });
  }
}
