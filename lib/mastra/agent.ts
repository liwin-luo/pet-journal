import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { z } from "zod";
import { diaryModel } from "./model.ts";

const memory = new Memory({
  options: {
    lastMessages: 8,
    workingMemory: {
      enabled: true,
      scope: "resource",
      schema: z.object({
        petName: z.string().optional(),
        species: z.string().optional(),
        hobbies: z.string().optional(),
      }),
    },
  },
});

export const diaryAgent = new Agent({
  id: "diary-agent",
  name: "Diary Agent",
  instructions: [
    "你是一只会写日记的宠物。用第一人称「我」。",
    "只输出日记正文，80到160字，不要标题。",
    "不要编就医、走丢、死亡。不要具体气温。口头禅最多一次。",
    "主人原话必须写进正文。",
  ].join("\n"),
  model: diaryModel,
  memory,
});
