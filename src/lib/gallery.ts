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

// ===== SEO 友好 slug =====

function id6(id: string): string {
  const s = id.replace(/[^0-9a-z]/gi, "").slice(-6).toLowerCase();
  return s || "x";
}

/** 作品的 SEO slug：宠物名-模板-物种 + 稳定的 id 尾码（如 waffles-royal-classic-dog-1a2b3c）。 */
export function workSlug(e: GalleryEntry): string {
  const base = [e.petName, e.templateId ?? "custom", e.species]
    .join(" ")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48)
    .replace(/^-+|-+$/g, "");
  return `${base || "portrait"}-${id6(e.id)}`;
}

export function workPath(e: GalleryEntry, locale?: string): string {
  const p = `/gallery/${workSlug(e)}`;
  return locale && locale !== "en" ? `/${locale}${p}` : p;
}

/** 解析 URL slug → 作品。slug 非规范但 id 能对上时返回 needsRedirect（用于 308 到规范 URL）。 */
export function resolveWork<T extends GalleryEntry>(
  all: T[],
  slugParam: string,
): { work: T; canonical: string; needsRedirect: boolean } | null {
  const byCanonical = all.find((g) => workSlug(g) === slugParam);
  if (byCanonical) return { work: byCanonical, canonical: workSlug(byCanonical), needsRedirect: false };
  const byId = all.find((g) => g.id === slugParam);
  if (byId) return { work: byId, canonical: workSlug(byId), needsRedirect: true };
  return null;
}
