/**
 * 日记正文草稿、校验、配图 prompt。不碰存储。
 * 所属模块：labs/pet-journal
 */
import { SPECIES_EN, SPECIES_LABEL, type PromptPet } from "./types.ts";
import { RATIO } from "./templates.ts";

export type DiarySource = "auto" | "prompt";

export type DiaryWriteInput = {
  name: string;
  source: DiarySource;
  userNote?: string;
};

export type DiaryIssue = {
  ok: false;
  code: "missing_name" | "missing_note" | "auto_exists" | "missing_body" | "missing_photo";
  message: string;
};

export function canAutoDraft(hasAuto: boolean): boolean {
  return !hasAuto;
}

export function validateDiaryWrite(input: DiaryWriteInput): { ok: true } | DiaryIssue {
  if (!input.name.trim()) return { ok: false, code: "missing_name", message: "先给宠物起个名字" };
  if (input.source === "prompt" && !input.userNote?.trim()) {
    return { ok: false, code: "missing_note", message: "先写一句今天的事" };
  }
  return { ok: true };
}

export function validateDiaryImage(input: { name: string; body: string; photos: string[] }): { ok: true } | DiaryIssue {
  if (!input.name.trim()) return { ok: false, code: "missing_name", message: "先给宠物起个名字" };
  if (!input.body.trim()) return { ok: false, code: "missing_body", message: "先有正文再配图" };
  if (input.photos.length < 1) return { ok: false, code: "missing_photo", message: "档案里至少要有一张参考图" };
  return { ok: true };
}

export function seasonFromDate(date: string): string {
  const month = Number(date.slice(5, 7));
  if (month === 3 || month === 4 || month === 5) return "春天";
  if (month === 6 || month === 7 || month === 8) return "夏天";
  if (month === 9 || month === 10 || month === 11) return "秋天";
  return "冬天";
}

export function formatDiaryDate(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

export function draftDiaryBody(input: {
  pet: PromptPet;
  date: string;
  source: DiarySource;
  userNote?: string;
  weather?: string;
}): string {
  const name = input.pet.name.trim();
  const day = formatDiaryDate(input.date);
  const sky = input.weather?.trim() || seasonFromDate(input.date);
  const hobby = input.pet.hobbies?.trim() || "发呆";
  const toy = input.pet.toys?.trim();
  const food = input.pet.food?.trim();
  const trait = input.pet.traits[0];
  const phrase = input.pet.catchphrase?.trim();
  const traitBit = trait ? `人家说我${trait}，今天也不装。` : "";
  const toyBit = toy ? `还翻出了${toy}。` : "";
  const foodBit = food ? `想到${food}就有劲。` : "";
  const phraseBit = phrase ? `临了只想说：${phrase}` : "然后就把今天过完了。";

  if (input.source === "prompt") {
    const note = input.userNote?.trim() ?? "";
    return `今天是${day}。我是${name}。主人说「${note}」，我记在心里。${traitBit}${toyBit}天色是${sky}。${phraseBit}`;
  }

  return `今天是${day}。我是${name}。${sky}的一天，没有大新闻。我${hobby}了一会儿。${traitBit}${toyBit}${foodBit}${phraseBit}`;
}

export function buildDiaryLlmPrompt(input: {
  pet: PromptPet;
  date: string;
  source: DiarySource;
  userNote?: string;
  weather?: string;
}): string {
  const pet = input.pet;
  const facts = [
    `名字：${pet.name}`,
    `物种：${SPECIES_LABEL[pet.species]}`,
    pet.breed?.trim() ? `品种：${pet.breed.trim()}` : "",
    pet.traits.length ? `性格：${pet.traits.join("、")}` : "",
    pet.hobbies?.trim() ? `爱好：${pet.hobbies.trim()}` : "",
    pet.toys?.trim() ? `玩具：${pet.toys.trim()}` : "",
    pet.food?.trim() ? `食物：${pet.food.trim()}` : "",
    pet.catchphrase?.trim() ? `口头禅（最多用一次）：${pet.catchphrase.trim()}` : "",
    `日期：${input.date} ${formatDiaryDate(input.date)}`,
    `天气：${input.weather?.trim() || "未知，按季节写日常，不要编具体气温"}`,
    input.source === "prompt" ? `主人原话（必须写进日记）：${input.userNote?.trim()}` : "没有主人原话，写平常的一天",
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "用第一人称「我」写一篇中文日记，80到160字。",
    "不要编就医、走丢、死亡。不要具体气温。口头禅最多出现一次。",
    "只输出日记正文，不要标题。",
    facts,
  ].join("\n");
}

export function buildDiaryImagePrompt(pet: PromptPet, body: string): string {
  return [
    `A real ${SPECIES_EN[pet.species]} named ${pet.name}.`,
    pet.breed?.trim() ? `Breed: ${pet.breed.trim()}.` : "",
    "Illustrated journal page, paper texture, warm ink, one vertical still.",
    "The animal from the reference photos appears in the scene.",
    `Paint this exact Chinese diary lettering in the still: ${body.trim()}`,
    "Do not leave the frame letter-empty. No extra logos.",
    `Vertical ${RATIO} frame.`,
  ]
    .filter(Boolean)
    .join(" ");
}
