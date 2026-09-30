import { isPortrait } from "@/lib/guards";

export type PlanImage = { id: string; note: string; src: string };

export type PlanBody = {
  text: string;
  mentions: string[];
  images: PlanImage[];
};

/** 只收下对话框里真实带上的图。id 必须是我们发给模型的那批。 */
export function readPlanBody(raw: unknown): PlanBody {
  const body = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const text = typeof body.text === "string" ? body.text.slice(0, 800) : "";
  const mentions = Array.isArray(body.mentions)
    ? body.mentions.filter((x): x is string => typeof x === "string").slice(0, 12).map((x) => x.slice(0, 400))
    : [];
  const images: PlanImage[] = [];
  if (Array.isArray(body.images)) {
    for (const item of body.images) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      const id = typeof row.id === "string" ? row.id : "";
      const src = typeof row.src === "string" ? row.src : "";
      if (!/^[\w.-]{1,40}$/.test(id)) continue;
      if (!isPortrait(src) && !/^\/tpl\/[\w.-]+$/.test(src)) continue;
      images.push({ id, note: typeof row.note === "string" ? row.note.slice(0, 200) : "", src });
      if (images.length === 8) break;
    }
  }
  return { text, mentions, images };
}

export function planBrief(input: Pick<PlanBody, "text" | "mentions" | "images">): string {
  const lines = [
    "You plan one picture. Read the dialog and the image list. Write the image prompt, and choose which image ids the image model should see.",
    "Those photos only show who the pet is. The pose, clothes, place and action must follow the dialog, not copy the photo.",
    "The image model cannot see this dialog. Put the user's request into the prompt. Write the prompt in English. Do not put words in the picture.",
    "Reply with JSON only: {\"prompt\":\"...\",\"images\":[\"id\"]}",
    "",
    "Dialog:",
    input.text.trim() || "(no extra words)",
    ...input.mentions.map((m) => `- ${m}`),
    "",
    "Images:",
    ...(input.images.length ? input.images.map((img) => `- ${img.id}: ${img.note || "image"}`) : ["- none"]),
  ];
  return lines.join("\n");
}

export function parsePlan(raw: string, allowed: ReadonlySet<string>): { prompt: string; images: string[] } {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型没有返回出图计划");
  const json = JSON.parse(raw.slice(start, end + 1)) as { prompt?: unknown; images?: unknown };
  const prompt = typeof json.prompt === "string" ? json.prompt.trim().slice(0, 2000) : "";
  if (!prompt) throw new Error("模型没有写出提示词");
  const images = Array.isArray(json.images)
    ? json.images.filter((id): id is string => typeof id === "string" && allowed.has(id)).slice(0, 4)
    : [];
  return { prompt, images };
}

export async function planPicture(
  input: PlanBody,
  chat: (prompt: string) => Promise<string>,
): Promise<{ prompt: string; refs: string[] }> {
  const raw = await chat(planBrief(input));
  const plan = parsePlan(raw, new Set(input.images.map((img) => img.id)));
  const byId = new Map(input.images.map((img) => [img.id, img.src]));
  return { prompt: plan.prompt, refs: plan.images.map((id) => byId.get(id)!).filter(Boolean) };
}

if (process.env.PLAN_CHECK) {
  const brief = planBrief({ text: "骑滑板", mentions: ["@template 球衣"], images: [{ id: "up-1", note: "photo", src: "" }] });
  if (!brief.includes("骑滑板") || !brief.includes("up-1")) throw new Error("brief");
  const plan = parsePlan("```json\n{\"prompt\":\"cat on a skateboard\",\"images\":[\"up-1\",\"nope\"]}\n```", new Set(["up-1"]));
  if (plan.prompt !== "cat on a skateboard" || plan.images.join() !== "up-1") throw new Error("parse " + JSON.stringify(plan));
}
