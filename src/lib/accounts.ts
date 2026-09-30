// 配了 DATABASE_URL 就用原来那套 Postgres；否则本地 SQLite。
import * as pg from "@/lib/pgdb";
import * as sqlite from "@/lib/sqlite";

export function usePg(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function upsertGoogleUser(input: { googleSub: string; email: string; name?: string }) {
  return usePg() ? pg.upsertGoogleUser(input) : sqlite.upsertGoogleUser(input);
}

export async function userById(id: string) {
  return usePg() ? pg.userById(id) : sqlite.userById(id);
}

export async function readState(userId: string) {
  return usePg() ? pg.readState(userId) : sqlite.readState(userId);
}

export async function writeState(userId: string, data: { pets: unknown[]; orders: unknown[]; diary: unknown[] }) {
  if (usePg()) await pg.writeState(userId, data);
  else sqlite.writeState(userId, data);
}

export async function readWallet(userId: string) {
  return usePg() ? pg.readWallet(userId) : sqlite.readWallet(userId);
}

export async function drawStored(userId: string, n: number, today: string) {
  return usePg() ? pg.drawStored(userId, n, today) : sqlite.drawStored(userId, n, today);
}

export async function grantStored(userId: string, tier: "studio" | "home") {
  return usePg() ? pg.grantStored(userId, tier) : sqlite.grantStored(userId, tier);
}

export async function addStored(userId: string, n: number) {
  return usePg() ? pg.addStored(userId, n) : sqlite.addStored(userId, n);
}
