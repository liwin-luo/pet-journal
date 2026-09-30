import fs from "fs";
import path from "path";
import { readyDb } from "@/lib/pgdb";
import { usePg } from "@/lib/accounts";

export interface GiftRecord {
  token: string;
  toName: string;
  email: string;
  when: string;
  card: string;
  petName: string;
  images: string[];
}

const FILE = path.join(process.cwd(), ".data", "gifts.json");

function readAll(): Record<string, GiftRecord> {
  if (!fs.existsSync(FILE)) return {};
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return {}; }
}

export async function saveGift(gift: GiftRecord) {
  if (!usePg()) {
    const all = readAll();
    all[gift.token] = gift;
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(all));
    return;
  }
  const pool = await readyDb();
  await pool.query(
    `INSERT INTO app_gifts (token, body) VALUES ($1, $2::jsonb)
     ON CONFLICT (token) DO UPDATE SET body = EXCLUDED.body`,
    [gift.token, JSON.stringify(gift)],
  );
}

export async function readGift(token: string): Promise<GiftRecord | null> {
  if (!usePg()) return readAll()[token] ?? null;
  const pool = await readyDb();
  const res = await pool.query(`SELECT body FROM app_gifts WHERE token = $1`, [token]);
  const body = res.rows[0]?.body;
  if (!body) return null;
  return typeof body === "string" ? JSON.parse(body) : body;
}
