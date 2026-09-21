import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { buildDiaryImagePrompt, validateDiaryImage } from "../diary-copy.ts";
import { generatePetStill } from "../generate-image.ts";
import type { PromptPet } from "../types.ts";

const petSchema = z.object({
  name: z.string(),
  species: z.enum(["cat", "dog", "other"]),
  breed: z.string().optional(),
  sex: z.enum(["male", "female"]).optional(),
  age: z.enum(["young", "adult", "senior"]).optional(),
  traits: z.array(z.string()),
  hobbies: z.string().optional(),
  toys: z.string().optional(),
  food: z.string().optional(),
  catchphrase: z.string().optional(),
});

const resultSchema = z.object({
  imageUrl: z.string(),
  mock: z.boolean(),
  prompt: z.string(),
  seed: z.number(),
});

const validate = createStep({
  id: "validate-diary-image",
  inputSchema: z.object({
    pet: petSchema,
    body: z.string(),
    photos: z.array(z.string()),
  }),
  outputSchema: z.object({
    pet: petSchema,
    body: z.string(),
    photos: z.array(z.string()),
    prompt: z.string(),
  }),
  execute: async ({ inputData }) => {
    const check = validateDiaryImage({
      name: inputData.pet.name,
      body: inputData.body,
      photos: inputData.photos,
    });
    if (!check.ok) throw new Error(check.message);
    return {
      ...inputData,
      prompt: buildDiaryImagePrompt(inputData.pet as PromptPet, inputData.body),
    };
  },
});

const draw = createStep({
  id: "draw-journal-page",
  inputSchema: z.object({
    pet: petSchema,
    body: z.string(),
    photos: z.array(z.string()),
    prompt: z.string(),
  }),
  outputSchema: resultSchema,
  execute: async ({ inputData }) => {
    const result = await generatePetStill({
      prompt: inputData.prompt,
      refs: inputData.photos.slice(0, 4),
      seed: Math.floor(Math.random() * 1_000_000_000),
      petName: inputData.pet.name,
      template: { title: "今日日记" },
    });
    return {
      imageUrl: result.imageUrl,
      mock: result.mock,
      prompt: result.prompt,
      seed: result.seed,
    };
  },
});

export const diaryImageWorkflow = createWorkflow({
  id: "diary-image",
  inputSchema: z.object({
    pet: petSchema,
    body: z.string(),
    photos: z.array(z.string()),
  }),
  outputSchema: resultSchema,
})
  .then(validate)
  .then(draw)
  .commit();
