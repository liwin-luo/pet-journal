import { imageProvider, textProvider } from "./adapt";
import { AnchorInput, BatchInput, DiaryInput, ImageEngine, PetPromptContext, TextEngine } from "./types";

function petLine(p: PetPromptContext): string {
  return `Pet name: ${p.name}. Breed: ${p.breed}. Coat: ${p.coat || "n/a"}. Personality: ${p.tags.join(", ") || "n/a"}.`;
}

export function getEngine(): ImageEngine & TextEngine {
  const still = imageProvider();
  const chat = textProvider();
  return {
    name: `${still.name}+${chat.name}`,
    async generateAnchor(input: AnchorInput) {
      const prompt =
        `Create ONE portrait of this exact pet. Keep the face, fur markings and eye color consistent with the reference photos. ` +
        `${petLine(input.pet)} Warm studio light, head and shoulders, centered, no text.`;
      return { image: await still.still(prompt, input.refImages ?? []) };
    },
    async generateBatch(input: BatchInput) {
      const scene = input.keepsakeScene
        ? ` Include the pet's ${input.keepsakeScene}.`
        : "";
      const style = input.templatePrompt || input.stylePrompt || "warm studio portrait";
      const prompt =
        `Using the reference as this exact pet, make ONE new picture. Keep the same face and markings. ` +
        `Scene: ${style}.${scene} ${petLine(input.pet)} No text in the image.`;
      const images: string[] = [];
      const refs = input.anchorImage ? [input.anchorImage] : [];
      for (let i = 0; i < input.count; i++) images.push(await still.still(prompt, refs));
      return { images };
    },
    async writeDiary(input: DiaryInput) {
      const prompt =
        `Write a diary entry of 3 or 4 sentences in first person as ${input.pet.name}, a ${input.pet.breed}. ` +
        (input.pet.tags.length ? `Personality: ${input.pet.tags.join(", ")}. ` : "") +
        `Language: ${input.lang}. ` +
        (input.note ? `What happened: ${input.note}. ` : "") +
        `End with "— ${input.pet.name}". Do not mention being an AI.`;
      return { text: await chat.chat(prompt) };
    },
  };
}

export async function completeText(prompt: string): Promise<string> {
  return textProvider().chat(prompt);
}

export async function runEngine<T>(fn: (engine: ImageEngine & TextEngine) => Promise<T>): Promise<T> {
  return fn(getEngine());
}
