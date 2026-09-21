/**
 * 出图模板与 prompt 拼装。档案字段只为场面服务。
 * 所属模块：labs/pet-journal
 */
import {
  AGE_LABEL,
  RELATION_LABEL,
  SEX_LABEL,
  SPECIES_EN,
  SPECIES_LABEL,
  type PromptFriend,
  type PromptPet,
} from "./types.ts";

export type TemplateId = "home" | "out" | "duo" | "meeting" | "star" | "meme";

export type Template = {
  id: TemplateId;
  title: string;
  blurb: string;
  needsFriend: boolean;
  meme: boolean;
};

export const TEMPLATES: Template[] = [
  { id: "home", title: "日常在家", blurb: "窝在熟悉的角落，玩具摊一地", needsFriend: false, meme: false },
  { id: "out", title: "出门玩", blurb: "去外面撒欢，风把毛吹乱", needsFriend: false, meme: false },
  { id: "duo", title: "和朋友合影", blurb: "两只一起入镜", needsFriend: true, meme: false },
  { id: "meeting", title: "严肃开会", blurb: "西装、会议室、一本正经", needsFriend: false, meme: true },
  { id: "star", title: "当明星", blurb: "红毯闪光灯，杂志封面", needsFriend: false, meme: true },
  { id: "meme", title: "表情包", blurb: "口头禅直接画进画面", needsFriend: false, meme: true },
];

export const RATIO = "3:4";
export const SEEDREAM_SIZE = "1728x2304";

export function findTemplate(id: string | undefined): Template | undefined {
  return TEMPLATES.find((item) => item.id === id);
}

export function letteringText(pet: Pick<PromptPet, "name" | "catchphrase">): string {
  const phrase = pet.catchphrase?.trim();
  return phrase || pet.name.trim();
}

export type GenerateIssue = {
  ok: false;
  code: "missing_name" | "missing_photo" | "missing_friend" | "bad_template";
  message: string;
};

export type GenerateOk = { ok: true };

export function validateGenerate(
  pet: { name: string; photos: string[] },
  friend: PromptFriend | undefined,
  templateId: string,
): GenerateOk | GenerateIssue {
  const template = findTemplate(templateId);
  if (!template) return { ok: false, code: "bad_template", message: "没有这个模板" };
  if (!pet.name.trim()) return { ok: false, code: "missing_name", message: "先给宠物起个名字" };
  if (pet.photos.length < 1) return { ok: false, code: "missing_photo", message: "至少拍一张正面参考图" };
  if (template.needsFriend && !friend?.name.trim()) {
    return { ok: false, code: "missing_friend", message: "合影要先选一位朋友" };
  }
  return { ok: true };
}

export function buildPrompt(
  pet: PromptPet,
  friend: PromptFriend | undefined,
  templateId: TemplateId,
): string {
  const template = findTemplate(templateId);
  if (!template) return "";

  const who = [
    `A real ${SPECIES_EN[pet.species]} named ${pet.name}.`,
    pet.breed?.trim() ? `Breed: ${pet.breed.trim()}.` : "",
    pet.sex ? `Sex: ${pet.sex}.` : "",
    pet.age ? `Life stage: ${AGE_LABEL[pet.age]} (${pet.age}).` : "",
    pet.traits.length ? `Personality: ${pet.traits.join(", ")}.` : "",
    pet.hobbies?.trim() ? `Hobbies: ${pet.hobbies.trim()}.` : "",
    pet.toys?.trim() ? `Favorite toys: ${pet.toys.trim()}.` : "",
    pet.food?.trim() ? `Favorite food: ${pet.food.trim()}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const buddy = friend
    ? `A companion ${friend.species ? SPECIES_EN[friend.species] : "animal"} named ${friend.name}, relationship: ${friend.relation} (${RELATION_LABEL[friend.relation]}). Keep both faces recognizable from the reference photos.`
    : "";

  const scene = sceneFor(template.id, pet, friend);
  const lettering = letteringText(pet);
  const textBlock = template.meme
    ? `Paint this exact Chinese lettering in the still: ${lettering}. Do not leave the frame letter-empty.`
    : "No poster captions, no watermarks, no extra logos.";

  return [
    who,
    buddy,
    scene,
    "Photoreal pet portrait, keep the subject's markings and face from the reference photos.",
    `Vertical ${RATIO} frame.`,
    textBlock,
  ]
    .filter(Boolean)
    .join(" ");
}

function sceneFor(id: TemplateId, pet: PromptPet, friend: PromptFriend | undefined): string {
  const toy = pet.toys?.trim() || "a well-loved toy";
  const hobby = pet.hobbies?.trim() || "napping";
  switch (id) {
    case "home":
      return `Scene: cozy home afternoon, the pet ${hobby}, ${toy} nearby, warm window light, lived-in mess.`;
    case "out":
      return `Scene: outdoor outing that matches a ${pet.age ?? "adult"} ${SPECIES_LABEL[pet.species]}, wind in the fur, candid snapshot energy.`;
    case "duo":
      return `Scene: two pets posing together as ${friend?.relation ?? "playmate"}s, equal framing, playful contact, studio-yearbook lighting.`;
    case "meeting":
      return `Scene: parody corporate meeting. The pet wears a tiny suit at a conference table, serious expression, fluorescent office, laptop open.`;
    case "star":
      return `Scene: parody celebrity moment. Red carpet or glossy magazine cover, flash bulbs, the pet as a star, glamorous but still the same animal.`;
    case "meme":
      return `Scene: bold Chinese meme / sticker portrait, punchy color, the pet mid-expression, lettering integrated into the picture.`;
  }
}
