import fs from "fs";
import path from "path";
import { readyDb } from "@/lib/pgdb";
import { usePg } from "@/lib/accounts";

export interface ShareRecord {
  token: string;
  kind: "work" | "diary";
  petName: string;
  text: string;
  image: string;
  date: number;
  /** 免费图带印记。买过点数包的不再盖。 */
  mark?: boolean;
  /** 作品或日记的稳定编号。同一条内容重复发布沿用原来的链接。 */
  source?: string;
  ownerId?: string;
  /** 出现在广场。撤下只把这个关掉，分享链接还能打开。 */
  plaza?: boolean;
}

const FILE = path.join(process.cwd(), ".data", "shares.json");

async function readAll(): Promise<Record<string, ShareRecord>> {
  if (!usePg()) {
    if (!fs.existsSync(FILE)) return {};
    try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return {}; }
  }
  const pool = await readyDb();
  const res = await pool.query(`SELECT token, body FROM app_shares`);
  const all: Record<string, ShareRecord> = {};
  for (const row of res.rows) {
    all[row.token] = typeof row.body === "string" ? JSON.parse(row.body) : row.body;
  }
  return all;
}

async function writeAll(all: Record<string, ShareRecord>) {
  if (!usePg()) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(all));
    return;
  }
  const pool = await readyDb();
  for (const [token, body] of Object.entries(all)) {
    await pool.query(
      `INSERT INTO app_shares (token, body) VALUES ($1, $2::jsonb)
       ON CONFLICT (token) DO UPDATE SET body = EXCLUDED.body`,
      [token, JSON.stringify(body)],
    );
  }
}

export async function saveShare(rec: ShareRecord) {
  const all = await readAll();
  all[rec.token] = rec;
  await writeAll(all);
}

export async function readShare(token: string): Promise<ShareRecord | null> {
  return (await readAll())[token] ?? null;
}

export function visiblePlaza(rows: ShareRecord[]): ShareRecord[] {
  return rows.filter((r) => r.plaza).sort((a, b) => b.date - a.date);
}

export async function listPlaza(): Promise<ShareRecord[]> {
  return visiblePlaza(Object.values(await readAll()));
}

async function owned(source: string, ownerId: string): Promise<ShareRecord | undefined> {
  return Object.values(await readAll()).find((r) => r.source === source && r.ownerId === ownerId);
}

export async function plazaOn(source: string, ownerId: string): Promise<boolean> {
  return !!(await owned(source, ownerId))?.plaza;
}

/** 发布到广场。已有记录就打开广场开关，链接不变。 */
export async function publishPlaza(rec: ShareRecord): Promise<ShareRecord> {
  const all = await readAll();
  const prev = Object.values(all).find((r) => r.source === rec.source && r.ownerId === rec.ownerId);
  const token = prev?.token ?? rec.token;
  const next: ShareRecord = { ...prev, ...rec, token, plaza: true };
  all[token] = next;
  await writeAll(all);
  return next;
}

/** 账户删除照片时，这个人广场上的都撤下。分享链接还留着。 */
export async function unpublishOwned(ownerId: string): Promise<number> {
  const all = await readAll();
  let n = 0;
  for (const rec of Object.values(all)) {
    if (rec.ownerId === ownerId && rec.plaza) { rec.plaza = false; n += 1; }
  }
  if (n) await writeAll(all);
  return n;
}

/** 从广场撤下。记录留着，分享页照常能打开。 */
export async function unpublishPlaza(source: string, ownerId: string): Promise<ShareRecord | null> {
  const all = await readAll();
  const prev = Object.values(all).find((r) => r.source === source && r.ownerId === ownerId);
  if (!prev) return null;
  prev.plaza = false;
  all[prev.token] = prev;
  await writeAll(all);
  return prev;
}

if (process.env.PLAZA_CHECK) {
  const got = visiblePlaza([
    { token: "a", kind: "work", petName: "", text: "", image: "", date: 1, plaza: false },
    { token: "b", kind: "work", petName: "", text: "", image: "", date: 1, plaza: true },
    { token: "c", kind: "diary", petName: "", text: "", image: "", date: 2, plaza: true },
  ]).map((r) => r.token).join(",");
  if (got !== "c,b") throw new Error("plaza order " + got);
}

/** data-URL 或 /generated 文件 → 字节。社交预览要用一个真正的图片地址。 */
export function decodeImage(src: string): { type: string; body: Buffer } | null {
  const m = src.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (m) return { type: m[1], body: Buffer.from(m[2], "base64") };
  const name = src.split("/generated/").pop()?.split("?")[0] ?? "";
  if (!/^[\w.-]+$/.test(name)) return null;
  try {
    const body = fs.readFileSync(path.join(process.cwd(), "public", "generated", name));
    return { type: name.endsWith(".png") ? "image/png" : "image/jpeg", body };
  } catch {
    return null;
  }
}
