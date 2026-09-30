// 配了 DATABASE_URL 就用原来那套 Postgres；否则本地 SQLite。
// sqlite 用动态 import，线上不会去加载 better-sqlite3。
import { usePg } from "@/lib/db-mode";

export { usePg };

async function backend() {
  return usePg() ? import("@/lib/pgdb") : import("@/lib/sqlite");
}

export async function upsertGoogleUser(input: { googleSub: string; email: string; name?: string }) {
  return (await backend()).upsertGoogleUser(input);
}

export async function userById(id: string) {
  return (await backend()).userById(id);
}

export async function readState(userId: string) {
  return (await backend()).readState(userId);
}

export async function writeState(userId: string, data: { pets: unknown[]; orders: unknown[]; diary: unknown[] }) {
  await (await backend()).writeState(userId, data);
}

export async function readWallet(userId: string) {
  return (await backend()).readWallet(userId);
}

export async function drawStored(userId: string, n: number, today: string) {
  return (await backend()).drawStored(userId, n, today);
}

export async function grantStored(userId: string, tier: "studio" | "home") {
  return (await backend()).grantStored(userId, tier);
}

export async function addStored(userId: string, n: number) {
  return (await backend()).addStored(userId, n);
}

