import { Mastra } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";
import { diaryAgent } from "./agent.ts";
import { diaryImageWorkflow } from "./workflow.ts";

const connectionString = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/pet_journal";

export const mastra = new Mastra({
  agents: { diaryAgent },
  workflows: { diaryImageWorkflow },
  storage: new PostgresStore({
    id: "pet-journal-mastra",
    connectionString,
  }),
});
