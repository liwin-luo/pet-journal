import { readDb, type GalleryEntry } from "./store";
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
