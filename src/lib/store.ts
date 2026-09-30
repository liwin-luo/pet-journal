import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// 存储层，两种模式（接口不变）：
// - Postgres（配了 DATABASE_URL，线上/Vercel 用）：pd_media 存图，pd_state 存 JSON 文档
// - 本地文件 .data/（没配 DATABASE_URL，本地开发用）
const DATA_DIR = path.join(process.cwd(), ".data");

export type Share = {
  token: string;
  image: string;
  templateId?: string;
  message: string;
  prompt: string;
  createdAt: string;
  /** 归属：匿名按设备 cookie，登录按账号邮箱（历史记录 / Your pictures 用） */
  deviceId?: string;
  email?: string;
};

export type GalleryEntry = {
  id: string;
  image: string;
  templateId?: string;
  species: string;
  petName: string;
  nickname: string;
  text?: string;
  rating?: number;
  approved: boolean;
  seed?: boolean;
  createdAt: string;
};

/** 宠物档案（Phase 1：每主人一份）。avatar 取自主人某张作品的 /api/media/ 地址。 */
export type PetProfile = {
  name: string;
  species: string;
  avatar?: string;
  updatedAt: string;
};

/** 一天的日记文案（按 主人|日期|语言 缓存，生成后不再变）。 */
export type DiaryText = {
  title: string;
  text: string;
  lang: string;
  createdAt: string;
};

export type LikeRec = { count: number; devices: string[] };

type Db = {
  shares: Record<string, Share>;
  gallery: GalleryEntry[];
  usage: Record<string, { date: string; count: number }>;
  likes: Record<string, LikeRec>;
  pets: Record<string, PetProfile>; // key = ownerKey（"u:email" / "d:deviceid"）
  diary: Record<string, DiaryText>; // key = `${ownerKey}|${YYYY-MM-DD}|${lang}`
};

const EMPTY: Db = { shares: {}, gallery: [], usage: {}, likes: {}, pets: {}, diary: {} };

const usePg = !!process.env.DATABASE_URL?.trim();

// ===== Postgres 模式 =====

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalStore = globalThis as unknown as { pdPool?: any };

async function pg(): Promise<import("pg").Pool> {
  if (!globalStore.pdPool) {
    const { Pool } = await import("pg");
    // Supabase 等托管库的证书链不带公共 CA；连接串里的 sslmode=require 会被 pg 按 verify-full
    // 严格校验而报 SELF_SIGNED_CERT_IN_CHAIN。剥掉 sslmode，显式关闭校验（连接仍加密）。
    const cs = new URL(process.env.DATABASE_URL!);
    cs.searchParams.delete("sslmode");
    const pool = new Pool({
      connectionString: cs.toString(),
      max: 5,
      ssl: { rejectUnauthorized: false },
    });
    await pool.query(`
      create table if not exists pd_media (
        id text primary key,
        kind text not null,
        mime text not null,
        bytes bytea not null,
        created_at timestamptz default now()
      )`);
    await pool.query(`
      create table if not exists pd_state (
        key text primary key,
        data jsonb not null,
        updated_at timestamptz default now()
      )`);
    await pool.query(`
      create table if not exists pd_usage (
        subject text not null,
        day text not null,
        count int not null default 0,
        primary key (subject, day)
      )`);
    globalStore.pdPool = pool;
  }
  return globalStore.pdPool;
}

async function pgLoad(): Promise<Db> {
  const pool = await pg();
  const res = await pool.query<{ data: Partial<Db> }>(`select data from pd_state where key = 'main'`);
  return res.rows[0] ? { ...structuredClone(EMPTY), ...res.rows[0].data } : structuredClone(EMPTY);
}

async function pgSave(db: Db): Promise<void> {
  const pool = await pg();
  await pool.query(
    `insert into pd_state (key, data) values ('main', $1)
     on conflict (key) do update set data = $1, updated_at = now()`,
    [JSON.stringify(db)],
  );
}

// ===== 本地文件模式 =====

let queue: Promise<unknown> = Promise.resolve();
let cache: Db | null = null;

async function fileLoad(): Promise<Db> {
  if (cache) return cache;
  try {
    const raw = await readFile(path.join(DATA_DIR, "db.json"), "utf8");
    cache = { ...structuredClone(EMPTY), ...(JSON.parse(raw) as Partial<Db>) };
  } catch {
    cache = structuredClone(EMPTY);
  }
  return cache;
}

/** 单进程内串行化写，避免并发丢数据。 */
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

// ===== 对外接口 =====

export async function updateDb<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  return locked(async () => {
    const db = usePg ? await pgLoad() : await fileLoad();
    const out = await fn(db);
    if (usePg) await pgSave(db);
    else {
      await mkdir(DATA_DIR, { recursive: true });
      const tmp = path.join(DATA_DIR, `db.json.${randomUUID()}.tmp`);
      await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
      await rename(tmp, path.join(DATA_DIR, "db.json"));
    }
    return out;
  });
}

export async function readDb(): Promise<Db> {
  return usePg ? pgLoad() : fileLoad();
}

export async function approveGalleryEntry(id: string): Promise<void> {
  await updateDb((db) => {
    const entry = db.gallery.find((g) => g.id === id);
    if (entry) entry.approved = true;
  });
}

export async function removeGalleryEntry(id: string): Promise<void> {
  await updateDb((db) => {
    db.gallery = db.gallery.filter((g) => g.id !== id);
  });
}

export async function pendingGalleryEntries(): Promise<GalleryEntry[]> {
  const db = await readDb();
  return db.gallery.filter((g) => !g.approved);
}

/** 点赞切换（设备去重）：返回切换后的状态。 */
export async function toggleLike(entryId: string, deviceId: string): Promise<{ liked: boolean; count: number }> {
  return updateDb((db) => {
    const rec = db.likes[entryId] ?? { count: 0, devices: [] };
    const had = rec.devices.includes(deviceId);
    const devices = had ? rec.devices.filter((d) => d !== deviceId) : [...rec.devices, deviceId];
    db.likes[entryId] = { count: devices.length, devices };
    return { liked: !had, count: devices.length };
  });
}

export async function getLikeSnapshot(): Promise<Record<string, LikeRec>> {
  const db = await readDb();
  return db.likes ?? {};
}

// ===== 宠物日记 =====

export async function getPetProfile(ownerKey: string): Promise<PetProfile | null> {
  const db = await readDb();
  return db.pets[ownerKey] ?? null;
}

export async function savePetProfile(
  ownerKey: string,
  pet: { name: string; species: string; avatar?: string },
): Promise<PetProfile> {
  return updateDb((db) => {
    const rec: PetProfile = { ...pet, updatedAt: new Date().toISOString() };
    db.pets[ownerKey] = rec;
    return rec;
  });
}

export async function getDiaryText(ownerKey: string, date: string, lang: string): Promise<DiaryText | null> {
  const db = await readDb();
  return db.diary[`${ownerKey}|${date}|${lang}`] ?? null;
}

export async function saveDiaryText(
  ownerKey: string,
  date: string,
  lang: string,
  entry: { title: string; text: string },
): Promise<DiaryText> {
  return updateDb((db) => {
    const rec: DiaryText = { ...entry, lang, createdAt: new Date().toISOString() };
    db.diary[`${ownerKey}|${date}|${lang}`] = rec;
    return rec;
  });
}

// ===== 每日额度（原子计数，避免多实例丢更新）=====

/** 原子 +1，返回累计次数。PG 走单条 upsert；文件模式走串行队列。 */
export async function bumpUsage(subject: string, day: string): Promise<number> {
  if (usePg) {
    const pool = await pg();
    const res = await pool.query<{ count: number }>(
      `insert into pd_usage (subject, day, count) values ($1, $2, 1)
       on conflict (subject, day) do update set count = pd_usage.count + 1
       returning count`,
      [subject, day],
    );
    return res.rows[0].count;
  }
  return updateDb((db) => {
    const rec = db.usage[subject];
    db.usage[subject] = { date: day, count: rec && rec.date === day ? rec.count + 1 : 1 };
    return db.usage[subject].count;
  });
}

export async function peekUsage(subject: string, day: string): Promise<number> {
  if (usePg) {
    const pool = await pg();
    const res = await pool.query<{ count: number }>(`select count from pd_usage where subject = $1 and day = $2`, [subject, day]);
    return res.rows[0]?.count ?? 0;
  }
  const db = await readDb();
  const rec = db.usage[subject];
  return rec && rec.date === day ? rec.count : 0;
}

// ===== 图片存储 =====

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export async function storeImage(bytes: Buffer, kind: "uploads" | "generated", mime = "image/jpeg"): Promise<string> {
  const id = randomUUID();
  if (usePg) {
    const pool = await pg();
    await pool.query(`insert into pd_media (id, kind, mime, bytes) values ($1, $2, $3, $4)`, [id, kind, mime, bytes]);
    return id;
  }
  const ext = EXT[mime] ?? "jpg";
  const dir = path.join(DATA_DIR, kind);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.${ext}`), bytes);
  return id;
}

export async function readStoreFile(
  kind: "uploads" | "generated",
  id: string,
): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  if (usePg) {
    // kind 必须参与过滤：生成图要靠"非 uploads"来走下载门控
    const pool = await pg();
    const res = await pool.query<{ mime: string; bytes: Buffer }>(
      `select mime, bytes from pd_media where id = $1 and kind = $2`,
      [id, kind],
    );
    const row = res.rows[0];
    if (!row) return null;
    return { mime: row.mime, bytes: Buffer.isBuffer(row.bytes) ? row.bytes : Buffer.from(row.bytes as unknown as string) };
  }
  for (const [mime, ext] of Object.entries(EXT)) {
    try {
      const bytes = await readFile(path.join(DATA_DIR, kind, `${id}.${ext}`));
      return { mime, bytes };
    } catch {
      // 试下一个扩展名
    }
  }
  return null;
}
