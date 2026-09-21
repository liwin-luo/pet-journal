import { Pool } from "pg";
import { migrate } from "./schema.ts";

let pool: Pool | undefined;
let migrated = false;

export function db(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("先设 DATABASE_URL");
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function readyDb(): Promise<Pool> {
  const client = db();
  if (!migrated) {
    await migrate(client);
    migrated = true;
  }
  return client;
}
