import { PetPromptContext } from "./types";

/** 模板、风格和用户原话都写进同一条提示。参考图只负责认宠物。 */
export function picturePrompt(input: {
  templatePrompt?: string;
  stylePrompt?: string;
  note?: string;
  keepsakeScene?: string;
  pet: PetPromptContext;
}): string {
  const asked = [
    input.templatePrompt?.trim(),
    input.stylePrompt?.trim(),
    input.note?.trim(),
    input.keepsakeScene ? `include the pet's ${input.keepsakeScene}` : "",
  ].filter(Boolean).join(". ");
  const pet = input.pet;
  return [
    asked ? `Make this picture: ${asked}.` : "Make one portrait of this pet.",
    "Use the reference only for who the pet is: same face, fur markings and eye color. Change the pose, clothes and setting to match the request.",
    `Pet name: ${pet.name}. Breed: ${pet.breed}. Coat: ${pet.coat || "n/a"}. Personality: ${pet.tags.join(", ") || "n/a"}.`,
    "No text in the image.",
  ].join(" ");
}

if (process.env.PROMPT_CHECK) {
  const p = picturePrompt({
    templatePrompt: "in a jersey",
    note: "riding a scooter",
    pet: { name: "Miso", breed: "cat", coat: "orange", tags: ["chill"] },
  });
  if (!p.includes("in a jersey") || !p.includes("riding a scooter") || !p.includes("Miso")) {
    throw new Error(p);
  }
}
