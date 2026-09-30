import { cookies } from "next/headers";
import { getLikeSnapshot, readDb, type GalleryEntry, type LikeRec } from "./store";
import { SEED_GALLERY } from "./seed";

/** 前台画廊数据 = 种子内容 + 用户投稿（已审核）。 */
export async function getAllGallery(): Promise<GalleryEntry[]> {
  const db = await readDb();
  return [...SEED_GALLERY, ...db.gallery.filter((g) => g.approved)];
}

export function splitWorksReviews(entries: GalleryEntry[]): { works: GalleryEntry[]; reviews: GalleryEntry[] } {
  return {
    works: entries.filter((g) => !g.text),
    reviews: entries.filter((g) => g.text),
  };
}

export type WorkWithLikes = GalleryEntry & { likeCount: number; liked: boolean };

/** 画廊数据附带点赞状态（按设备 cookie 判断当前访客是否已赞）。 */
export async function getGalleryWithLikes(): Promise<WorkWithLikes[]> {
  const [entries, likes, jar] = await Promise.all([
    getAllGallery(),
    getLikeSnapshot() as Promise<Record<string, LikeRec>>,
    cookies().catch(() => null),
  ]);
  const device = jar?.get("paw_device")?.value ?? null;
  return entries.map((e) => ({
    ...e,
    likeCount: likes[e.id]?.count ?? 0,
    liked: device ? (likes[e.id]?.devices ?? []).includes(device) : false,
  }));
}
