import fs from "fs";
import path from "path";

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

export function saveGift(gift: GiftRecord) {
  const all = readAll();
  all[gift.token] = gift;
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(all));
}

export function readGift(token: string): GiftRecord | null {
  return readAll()[token] ?? null;
}
