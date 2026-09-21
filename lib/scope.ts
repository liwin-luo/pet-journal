/**
 * 多用户隔离：列表过滤、第二篇自动稿、未登录状态码。
 * 所属模块：labs/pet-journal
 */
import type { DiarySource } from "./diary-copy.ts";

export function scopeByUser<T extends { userId: string }>(rows: T[], userId: string): T[] {
  return rows.filter((row) => row.userId === userId);
}

export function ownedBy(userId: string, rowUserId: string | undefined): boolean {
  return Boolean(userId) && userId === rowUserId;
}

export function shouldBlockAuto(hasAuto: boolean, source: DiarySource): boolean {
  return source === "auto" && hasAuto;
}

export function authStatus(userId: string | undefined): 200 | 401 {
  return userId ? 200 : 401;
}
