// 和原来的 PetsDaily 一样：DATABASE_URL 指向 Postgres。用户写进同一张 users 表。
import { Pool, type PoolConfig } from "pg";
import { draw, grant, walletFields, type PlanId, type Wallet } from "@/lib/credits";

export type StoredWallet = { plan: PlanId; credits: number; creditDay: string; monthUsed: number };
export type UserRow = { id: string; googleSub: string; email: string; name?: string };
export type JsonState = { pets: unknown[]; orders: unknown[]; diary: unknown[] };

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
    max: 1,
    ssl: { rejectUnauthorized: false },
  };
}

function poolOf(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");
    if (!connectionString) throw new Error("先设 DATABASE_URL");
    pool = new Pool(poolConfig(connectionString));
  }
  return pool;
}

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_sub TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      last_pet_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
  `CREATE TABLE IF NOT EXISTS app_state (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      pets JSONB NOT NULL DEFAULT '[]',
      orders JSONB NOT NULL DEFAULT '[]',
      diary JSONB NOT NULL DEFAULT '[]',
      wallet JSONB NOT NULL DEFAULT '{}'
    )`,
  `CREATE TABLE IF NOT EXISTS app_shares (
      token TEXT PRIMARY KEY,
      body JSONB NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS app_gifts (
      token TEXT PRIMARY KEY,
      body JSONB NOT NULL
    )`,
];

export async function readyDb(): Promise<Pool> {
  const client = poolOf();
  if (!migrated) {
    for (const sql of STATEMENTS) await client.query(sql);
    migrated = true;
  }
  return client;
}

function asWallet(raw: unknown): StoredWallet {
  try {
    const v = typeof raw === "string" ? JSON.parse(raw) as Wallet : (raw ?? {}) as Wallet;
    return walletFields(v);
  } catch {
    return walletFields({});
  }
}

function asList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  }
  return [];
}

function mapUser(row: { id: string; google_sub: string; email: string; name?: string | null }): UserRow {
  return { id: row.id, googleSub: row.google_sub, email: row.email, name: row.name ?? undefined };
}

export async function upsertGoogleUser(input: { googleSub: string; email: string; name?: string }): Promise<UserRow> {
  const pool = await readyDb();
  const existing = await pool.query(
    `SELECT id, google_sub, email, name FROM users WHERE google_sub = $1`,
    [input.googleSub],
  );
  if (existing.rows[0]) {
    const row = existing.rows[0];
    await pool.query(`UPDATE users SET email = $2, name = $3 WHERE id = $1`, [
      row.id, input.email, input.name ?? row.name,
    ]);
    return mapUser({ ...row, email: input.email, name: input.name ?? row.name });
  }
  const id = crypto.randomUUID();
  const inserted = await pool.query(
    `INSERT INTO users (id, google_sub, email, name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (google_sub) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name
     RETURNING id, google_sub, email, name`,
    [id, input.googleSub, input.email, input.name ?? null],
  );
  return mapUser(inserted.rows[0]);
}

export async function userById(id: string): Promise<UserRow | undefined> {
  const pool = await readyDb();
  const result = await pool.query(`SELECT id, google_sub, email, name FROM users WHERE id = $1`, [id]);
  return result.rows[0] ? mapUser(result.rows[0]) : undefined;
}

const empty = (): JsonState => ({ pets: [], orders: [], diary: [] });

export async function readState(userId: string): Promise<JsonState> {
  const pool = await readyDb();
  const result = await pool.query(`SELECT pets, orders, diary FROM app_state WHERE user_id = $1`, [userId]);
  const row = result.rows[0];
  if (!row) return empty();
  return { pets: asList(row.pets), orders: asList(row.orders), diary: asList(row.diary) };
}

export async function writeState(userId: string, data: JsonState): Promise<void> {
  const pool = await readyDb();
  await pool.query(
    `INSERT INTO app_state (user_id, pets, orders, diary)
     VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb)
     ON CONFLICT (user_id) DO UPDATE SET
       pets = EXCLUDED.pets, orders = EXCLUDED.orders, diary = EXCLUDED.diary`,
    [userId, JSON.stringify(data.pets), JSON.stringify(data.orders), JSON.stringify(data.diary)],
  );
}

export async function readWallet(userId: string): Promise<StoredWallet> {
  const pool = await readyDb();
  const result = await pool.query(`SELECT wallet FROM app_state WHERE user_id = $1`, [userId]);
  return asWallet(result.rows[0]?.wallet);
}

async function withWallet(userId: string, next: (cur: StoredWallet) => StoredWallet): Promise<StoredWallet> {
  const pool = await readyDb();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO app_state (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`,
      [userId],
    );
    const cur = await client.query(`SELECT wallet FROM app_state WHERE user_id = $1 FOR UPDATE`, [userId]);
    const wallet = next(asWallet(cur.rows[0]?.wallet));
    await client.query(`UPDATE app_state SET wallet = $2::jsonb WHERE user_id = $1`, [userId, JSON.stringify(wallet)]);
    await client.query("COMMIT");
    return wallet;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function drawStored(userId: string, n: number, today: string): Promise<{ taken: number; wallet: StoredWallet }> {
  let taken = 0;
  const wallet = await withWallet(userId, (cur) => {
    const result = draw(cur, n, today);
    taken = result.taken;
    return walletFields(result.next);
  });
  return { taken, wallet };
}

export async function grantStored(userId: string, tier: "studio" | "home"): Promise<StoredWallet> {
  return withWallet(userId, (cur) => walletFields(grant(cur, tier)));
}

export async function addStored(userId: string, n: number): Promise<StoredWallet> {
  return withWallet(userId, (cur) => ({ ...cur, credits: cur.credits + Math.max(0, Math.floor(n)) }));
}
