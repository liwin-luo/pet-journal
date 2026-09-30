import fs from "fs";
import os from "os";
import path from "path";
import Database from "better-sqlite3";
import { draw, grant, walletFields, type PlanId, type Wallet } from "@/lib/credits";

export type JsonState = { pets: unknown[]; orders: unknown[]; diary: unknown[] };
export type StoredWallet = { plan: PlanId; credits: number; creditDay: string; monthUsed: number };
export type UserRow = { id: string; googleSub: string; email: string; name?: string };

// ponytail: Vercel 磁盘只让写 /tmp，这个库换实例就没了。要留住用户，接上 Supabase。
const file = process.env.SQLITE_CHECK === "1"
  ? path.join(os.tmpdir(), "petpics-sqlite-check.sqlite")
  : process.env.VERCEL
    ? path.join(os.tmpdir(), "petpics.sqlite")
    : path.join(process.cwd(), ".data", "app.sqlite");

type Sqlite = InstanceType<typeof Database>;

let db: Sqlite | undefined;

function sqlite(): Sqlite {
  if (!db) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    db = new Database(file);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        google_sub TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        name TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS user_state (
        user_id TEXT PRIMARY KEY,
        pets TEXT NOT NULL,
        orders TEXT NOT NULL,
        diary TEXT NOT NULL,
        wallet TEXT NOT NULL DEFAULT '{}'
      );
    `);
    const cols = db.prepare(`PRAGMA table_info(user_state)`).all() as { name: string }[];
    if (!cols.some((c) => c.name === "wallet")) {
      db.exec(`ALTER TABLE user_state ADD COLUMN wallet TEXT NOT NULL DEFAULT '{}'`);
    }
  }
  return db;
}

export function upsertGoogleUser(input: { googleSub: string; email: string; name?: string }): UserRow {
  const database = sqlite();
  const existing = database.prepare(`SELECT id, google_sub, email, name FROM users WHERE google_sub = ?`).get(input.googleSub) as
    | { id: string; google_sub: string; email: string; name: string | null }
    | undefined;
  if (existing) {
    database.prepare(`UPDATE users SET email = ?, name = ? WHERE id = ?`).run(input.email, input.name ?? existing.name, existing.id);
    return { id: existing.id, googleSub: existing.google_sub, email: input.email, name: input.name ?? existing.name ?? undefined };
  }
  const id = crypto.randomUUID();
  database.prepare(`INSERT INTO users (id, google_sub, email, name, created_at) VALUES (?, ?, ?, ?, ?)`).run(
    id, input.googleSub, input.email, input.name ?? null, new Date().toISOString(),
  );
  return { id, googleSub: input.googleSub, email: input.email, name: input.name };
}

export function userById(id: string): UserRow | undefined {
  const row = sqlite().prepare(`SELECT id, google_sub, email, name FROM users WHERE id = ?`).get(id) as
    | { id: string; google_sub: string; email: string; name: string | null }
    | undefined;
  if (!row) return undefined;
  return { id: row.id, googleSub: row.google_sub, email: row.email, name: row.name ?? undefined };
}

const empty = (): JsonState => ({ pets: [], orders: [], diary: [] });

export function readState(userId: string): JsonState {
  const row = sqlite().prepare(`SELECT pets, orders, diary FROM user_state WHERE user_id = ?`).get(userId) as
    | { pets: string; orders: string; diary: string }
    | undefined;
  if (!row) return empty();
  return { pets: JSON.parse(row.pets), orders: JSON.parse(row.orders), diary: JSON.parse(row.diary) };
}

export function writeState(userId: string, data: JsonState): void {
  sqlite().prepare(`
    INSERT INTO user_state (user_id, pets, orders, diary) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET pets = excluded.pets, orders = excluded.orders, diary = excluded.diary
  `).run(userId, JSON.stringify(data.pets), JSON.stringify(data.orders), JSON.stringify(data.diary));
}

function parseWallet(raw: string | null | undefined): StoredWallet {
  try {
    const v = raw ? JSON.parse(raw) as Wallet : {};
    return walletFields(v);
  } catch {
    return walletFields({});
  }
}

export function readWallet(userId: string): StoredWallet {
  const row = sqlite().prepare(`SELECT wallet FROM user_state WHERE user_id = ?`).get(userId) as
    | { wallet?: string }
    | undefined;
  return parseWallet(row?.wallet);
}

export function writeWallet(userId: string, w: StoredWallet): void {
  const payload = JSON.stringify(walletFields(w));
  const database = sqlite();
  const exists = database.prepare(`SELECT 1 AS ok FROM user_state WHERE user_id = ?`).get(userId);
  if (!exists) {
    database.prepare(`INSERT INTO user_state (user_id, pets, orders, diary, wallet) VALUES (?, '[]', '[]', '[]', ?)`).run(userId, payload);
  } else {
    database.prepare(`UPDATE user_state SET wallet = ? WHERE user_id = ?`).run(payload, userId);
  }
}

export function drawStored(userId: string, n: number, today: string): { taken: number; wallet: StoredWallet } {
  return sqlite().transaction(() => {
    const result = draw(readWallet(userId), n, today);
    const wallet = walletFields(result.next);
    writeWallet(userId, wallet);
    return { taken: result.taken, wallet };
  })();
}

export function grantStored(userId: string, tier: "studio" | "home"): StoredWallet {
  const next = grant(readWallet(userId), tier);
  const wallet = walletFields(next);
  writeWallet(userId, wallet);
  return wallet;
}

export function addStored(userId: string, n: number): StoredWallet {
  const cur = readWallet(userId);
  const wallet: StoredWallet = { ...cur, credits: cur.credits + Math.max(0, Math.floor(n)) };
  writeWallet(userId, wallet);
  return wallet;
}

if (process.env.SQLITE_CHECK === "1") {
  const first = upsertGoogleUser({ googleSub: "sub-check", email: "a@b.c", name: "A" });
  const again = upsertGoogleUser({ googleSub: "sub-check", email: "a2@b.c", name: "B" });
  if (first.id !== again.id || again.email !== "a2@b.c") throw new Error("upsert");
  writeState(first.id, { pets: [{ id: "p" }], orders: [], diary: [] });
  if (readState(first.id).pets.length !== 1) throw new Error("state");
  const bought = grantStored(first.id, "studio");
  const spent = drawStored(first.id, 3, "2099-1-1");
  if (bought.plan !== "studio" || bought.credits !== 0 || spent.taken !== 3 || spent.wallet.plan !== "studio") throw new Error("wallet");
  if (readState(first.id).pets.length !== 1) throw new Error("wallet wiped pets");
  db?.close();
  fs.rmSync(file, { force: true });
  console.log("sqlite ok");
}
