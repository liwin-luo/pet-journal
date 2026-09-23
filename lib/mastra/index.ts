import { Mastra } from "@mastra/core";
import { PostgresStore } from "@mastra/pg";
import { poolConfig } from "../db/client.ts";
import { diaryAgent } from "./agent.ts";
import { diaryImageWorkflow } from "./workflow.ts";

const connectionString =
  process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "") ||
  "postgres://postgres:postgres@localhost:5432/pet_journal";
const pg = poolConfig(connectionString);

export const mastra = new Mastra({
  agents: { diaryAgent },
  workflows: { diaryImageWorkflow },
  storage: new PostgresStore({
    id: "pet-journal-mastra",
    connectionString: pg.connectionString ?? connectionString,
    max: pg.max,
    ...(pg.ssl ? { ssl: pg.ssl } : {}),
  }),
});
