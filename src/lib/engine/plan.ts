/** 让文本模型把"用户原话 + 模板提示词"合成一条英文图像提示词，并决定看哪些参考图。 */
export type PlanBody = {
  message: string;
  templatePrompt?: string;
  imageCount: number;
};

export function planBrief(input: PlanBody): string {
  const lines = [
    "You plan one picture of the user's pet. The user writes a request and attaches photos of their pet.",
    "Write the image prompt the image model will draw. Choose which photos it should see.",
    "",
    "Rules:",
    "- The subject is ALWAYS the pet from the photos. Never draw a human.",
    "- The photos only show who the pet is: same face, fur markings, eye color. Pose, clothes and setting follow the request.",
    "- Write the prompt in English, vivid but under 120 words, describing one single image.",
    "- Do not put any words, letters or captions inside the picture.",
    "- Keep any text-safe zone the template asks for, but do not draw text there.",
    input.imageCount === 0
      ? "- No photo was attached. Invent a generic pet that matches the request."
      : "- Reference which attached photos to use by number.",
    "",
    "Reply with JSON only: {\"prompt\":\"...\",\"images\":" +
      (input.imageCount ? "[1]" : "[]") + "}",
    "",
    input.templatePrompt ? `Template (must follow): ${input.templatePrompt}` : "Template: none",
    `User request: ${input.message.trim() || "(no extra words, follow the template or make a beautiful portrait)"}`,
  ];
  return lines.join("\n");
}

export function parsePlan(raw: string, imageCount: number): { prompt: string; images: number[] } {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型没有返回出图计划");
  const json = JSON.parse(raw.slice(start, end + 1)) as { prompt?: unknown; images?: unknown };
  const prompt = typeof json.prompt === "string" ? json.prompt.trim().slice(0, 1600) : "";
  if (!prompt) throw new Error("模型没有写出提示词");
  const images = Array.isArray(json.images)
    ? json.images.filter((n): n is number => typeof n === "number" && n >= 1 && n <= imageCount).slice(0, 4)
    : [];
  return { prompt, images: imageCount && !images.length ? Array.from({ length: Math.min(imageCount, 4) }, (_, i) => i + 1) : images };
}

/** 没有文本模型时的降级拼装：模板提示词 + 用户原话 + 认宠规则。 */
export function fallbackPrompt(message: string, templatePrompt?: string): string {
  const asked = [templatePrompt?.trim(), message.trim()].filter(Boolean).join(". ");
  return [
    asked ? `Make this picture: ${asked}.` : "Make one beautiful portrait of this pet.",
    "Use the reference only for who the pet is: same face, fur markings and eye color. Change the pose, clothes and setting to match the request.",
    "No text in the image.",
  ].join(" ");
}

if (process.env.PLAN_CHECK) {
  const p = parsePlan('```json\n{"prompt":"cat on a skateboard","images":[9]}\n```', 2);
  if (!p.prompt || p.images.join() !== "1,2") throw new Error("plan parse");
  if (!fallbackPrompt("riding a scooter", "in a jersey").includes("in a jersey")) throw new Error("fallback");
}
