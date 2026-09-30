import { imageProvider, textProvider } from "./adapt";
import { picturePrompt } from "./prompt";
import { AnchorInput, BatchInput, DiaryInput, ImageEngine, TextEngine } from "./types";

export function getEngine(): ImageEngine & TextEngine {
  const still = imageProvider();
  const chat = textProvider();
  return {
    name: `${still.name}+${chat.name}`,
    async generateAnchor(input: AnchorInput) {
      return { image: await still.still(picturePrompt(input), input.refImages ?? []) };
    },
    async generateBatch(input: BatchInput) {
      const prompt = picturePrompt(input);
      const refs: string[] = [];
      for (const src of [input.anchorImage, ...(input.refImages ?? [])]) {
        if (src && !refs.includes(src)) refs.push(src);
        if (refs.length === 4) break;
      }
      const images: string[] = [];
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
