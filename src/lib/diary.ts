import type { DiaryWork } from "./diary-shared";
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from "./i18n";
import { readDb, type PetProfile } from "./store";

/** 日记用全量作品（不分页不截断）：登录按账号，匿名按设备。最新在前。 */
export async function listWorks(opts: { email?: string | null; deviceId?: string | null }): Promise<DiaryWork[]> {
  const db = await readDb();
  return Object.values(db.shares)
    .filter((s) => (opts.email ? s.email === opts.email : false) || (s.deviceId && s.deviceId === opts.deviceId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => ({
      token: s.token,
      image: s.image,
      message: s.message,
      prompt: s.prompt,
      templateId: s.templateId,
      createdAt: s.createdAt,
    }));
}

// ===== 日记文案（GLM，一天一篇，宠物第一人称）=====

/** locale → 语言名，喂给模型指定书写语言（LOCALE_META 的 label 本身就是语言名）。 */
export function langName(locale: string): string {
  return LOCALE_META[locale as Locale]?.label ?? "English";
}

export type CaptionInput = {
  date: string;
  lang: string;
  pet?: Pick<PetProfile, "name" | "species"> | null;
  works: { message: string; prompt: string }[];
};

export function captionBrief(input: CaptionInput): string {
  const name = input.pet?.name?.trim() || "my pet";
  const species = input.pet?.species?.trim() || "pet";
  const pics = input.works
    .slice(0, 8)
    .map(
      (w, i) =>
        `${i + 1}. Request: ${w.message.trim().slice(0, 150) || "(none)"} / Art direction: ${w.prompt.trim().slice(0, 180) || "(none)"}`,
    )
    .join("\n");
  return [
    `You write one diary entry in the voice of the user's pet, about ${input.date}.`,
    "",
    `The pet: ${name}, a ${species}.`,
    `Today the owner made ${input.works.length} AI portrait(s) of the pet at a portrait studio. Each portrait is one little "adventure":`,
    pics,
    "",
    "Rules:",
    '- First person: the pet is speaking ("I"). Warm, playful, a little dramatic.',
    `- Weave today's portraits into one short diary entry about the day, written in ${langName(input.lang)}.`,
    "- Title: at most 6 words. Body: 40-90 words, 1-3 short paragraphs, no lists.",
    '- Reply with JSON only: {"title":"...","text":"..."}',
  ].join("\n");
}

export function parseCaption(raw: string): { title: string; text: string } {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型没有返回日记");
  const json = JSON.parse(raw.slice(start, end + 1)) as { title?: unknown; text?: unknown };
  const title = typeof json.title === "string" ? json.title.trim().slice(0, 80) : "";
  const text = typeof json.text === "string" ? json.text.trim().slice(0, 1200) : "";
  if (!title || !text) throw new Error("日记字段缺失");
  return { title, text };
}

/** 没有文本模型（mock 抛错）或解析失败时的降级：英文模板，保证不为空。 */
export function fallbackCaption(input: { works: { message: string }[] }): { title: string; text: string } {
  const n = input.works.length;
  const first = input.works[0]?.message?.trim();
  const theme = first ? ` Today's theme: "${first.slice(0, 80)}".` : "";
  return {
    title: n > 1 ? `${n} portraits in one day` : "A portrait kind of day",
    text: `Today my human dressed me up for ${n === 1 ? "a brand-new portrait" : `${n} brand-new portraits`}.${theme} I stayed very dignified. There were treats. It was a good day.`,
  };
}

if (process.env.DIARY_CHECK) {
  const works = [
    { message: "royal king portrait", prompt: "a regal cat wearing a crown, oil painting" },
    { message: "astronaut", prompt: "a cat astronaut floating in space" },
  ];
  const brief = captionBrief({ date: "2026-10-01", lang: "en", pet: { name: "Mochi", species: "cat" }, works });
  if (!brief.includes("Mochi") || !brief.includes("astronaut") || !brief.includes("2026-10-01")) throw new Error("diary brief");
  const cap = parseCaption('```json\n{"title":"King for a day","text":"I wore the crown."}\n```');
  if (cap.title !== "King for a day" || !cap.text.includes("crown")) throw new Error("diary parse");
  let threw = false;
  try {
    parseCaption("no json here");
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("diary parse guard");
  if (langName("zh") !== "中文" || langName("xx") !== "English" || langName(DEFAULT_LOCALE) !== "English") throw new Error("diary lang");
  const fb = fallbackCaption({ works });
  if (!fb.title || !fb.text.includes("2")) throw new Error("diary fallback");
}
