import { hasAutoDraft, insertDiary, nextIndex } from "@/lib/db/diaries.ts";
import { validateDiaryWrite } from "@/lib/diary-copy.ts";
import { shouldBlockAuto } from "@/lib/scope.ts";
import { requireUserId, unauthorized } from "@/lib/session.ts";
import type { PromptPet } from "@/lib/types.ts";
import { writeDiaryBody } from "@/lib/write-diary.ts";

export const runtime = "nodejs";

type Body = {
  pet?: PromptPet & { id?: string };
  petId?: string;
  date?: string;
  source?: "auto" | "prompt";
  userNote?: string;
  weather?: string;
  photo?: string;
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
  const source = body.source;
  const petId = body.petId || pet?.id;
  if (!pet || !petId || (source !== "auto" && source !== "prompt") || !body.date) {
    return Response.json({ error: "缺少宠物、日期或来源" }, { status: 400 });
  }

  const check = validateDiaryWrite({ name: pet.name, source, userNote: body.userNote });
  if (!check.ok) {
    return Response.json({ error: check.message, code: check.code }, { status: 400 });
  }

  const hasAuto = await hasAutoDraft(session.userId, petId, body.date);
  if (shouldBlockAuto(hasAuto, source)) {
    return Response.json({ error: "今天已经有自动稿了", code: "auto_exists" }, { status: 400 });
  }

  try {
    const result = await writeDiaryBody({
      userId: session.userId,
      petId,
      pet,
      date: body.date,
      source,
      userNote: body.userNote,
      weather: body.weather,
    });
    const entry = await insertDiary(session.userId, {
      id: crypto.randomUUID(),
      petId,
      petName: pet.name,
      date: body.date,
      index: await nextIndex(session.userId, petId, body.date),
      source,
      userNote: source === "prompt" ? body.userNote : undefined,
      photo: source === "prompt" ? body.photo : undefined,
      body: result.body,
      mock: result.mock,
      edited: false,
    });
    return Response.json({ body: result.body, mock: result.mock, entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "文案失败";
    console.error("diary write failed", message);
    return Response.json({ error: "日记写不出来，重试一次" }, { status: 502 });
  }
}
