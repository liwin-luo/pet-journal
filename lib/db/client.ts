import { Pool, type PoolConfig } from "pg";
import { migrate } from "./schema.ts";

let pool: Pool | undefined;
let migrated = false;

export function poolConfig(connectionString: string): PoolConfig {
  const parsed = new URL(connectionString);
  const supabase = parsed.hostname.endsWith("supabase.com") || parsed.hostname.endsWith("supabase.co");
  if (!supabase) return { connectionString, max: 5 };
  parsed.searchParams.delete("sslmode");
  parsed.searchParams.delete("uselibpqcompat");
  return {
    connectionString: parsed.toString(),
    // ponytail: 6543 事务池 + Vercel 短函数，单连接；池证书链自签，不 verify
    max: 1,
    ssl: { rejectUnauthorized: false },
  };
}

export function db(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");
    if (!connectionString) throw new Error("先设 DATABASE_URL");
    pool = new Pool(poolConfig(connectionString));
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
