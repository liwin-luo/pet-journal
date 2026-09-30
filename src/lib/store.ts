import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// JSON 文件库（MVP）。上 Vercel 等无盘环境时，把这几个函数换成对象存储/数据库即可，接口不变。
const DATA_DIR = path.join(process.cwd(), ".data");

export type Share = {
  token: string;
  image: string;
  templateId?: string;
  message: string;
  prompt: string;
  createdAt: string;
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

type Db = {
  shares: Record<string, Share>;
  gallery: GalleryEntry[];
  usage: Record<string, { date: string; count: number }>;
};

const EMPTY: Db = { shares: {}, gallery: [], usage: {} };
let queue: Promise<unknown> = Promise.resolve();
let cache: Db | null = null;

async function load(): Promise<Db> {
  if (cache) return cache;
  try {
    const raw = await readFile(path.join(DATA_DIR, "db.json"), "utf8");
    cache = { ...EMPTY, ...(JSON.parse(raw) as Partial<Db>) };
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

export async function updateDb<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  return locked(async () => {
    const db = await load();
    const out = await fn(db);
    await mkdir(DATA_DIR, { recursive: true });
    const tmp = path.join(DATA_DIR, `db.json.${randomUUID()}.tmp`);
    await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await rename(tmp, path.join(DATA_DIR, "db.json"));
    return out;
  });
}

export async function readDb(): Promise<Db> {
  return load();
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
  const db = await load();
  return db.gallery.filter((g) => !g.approved);
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
