import { buildDiaryLlmPrompt, draftDiaryBody, type DiarySource } from "./diary-copy.ts";
import { hasLlmKey } from "./mastra/model.ts";
import type { PromptPet } from "./types.ts";

export async function writeDiaryBody(input: {
  userId: string;
  petId?: string;
  pet: PromptPet;
  date: string;
  source: DiarySource;
  userNote?: string;
  weather?: string;
}): Promise<{ body: string; mock: boolean }> {
  const fallback = draftDiaryBody(input);
  if (!hasLlmKey()) return { body: fallback, mock: true };

  const { mastra } = await import("./mastra/index.ts");
  const agent = mastra.getAgentById("diary-agent");
  const response = await agent.generate(buildDiaryLlmPrompt(input), {
    memory: {
      resource: input.userId,
      thread: `diary-${input.petId || input.pet.name}`,
    },
  });
  const body = response.text?.trim().replace(/^["「]|["」]$/g, "");
  if (!body) throw new Error("diary agent empty");
  return { body, mock: false };
}
