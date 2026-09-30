import type { GalleryEntry } from "./store";

// 上线种子内容：图片全部是本引擎的真实产出（模板示例图 / 端到端测试图），
// 图、模板名、物种一一核对过。
// 注意：评价为示例文案，正式上线前请按 README「上线清单」替换/删除为真实用户反馈。
const now = "2026-09-20T10:00:00.000Z";

export const SEED_GALLERY: GalleryEntry[] = [
  // 作品（无评价文字）
  { id: "seed-1", image: "/tpl/royal.jpg", templateId: "royal", species: "dog", petName: "Waffles", nickname: "Ava", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-2", image: "/tpl/xmas.jpg", templateId: "xmas", species: "dog", petName: "Juniper", nickname: "Rachel", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-3", image: "/tpl/pixar.jpg", templateId: "pixar", species: "cat", petName: "Nori", nickname: "Ken", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-4", image: "/tpl/astronaut.jpg", templateId: "astronaut", species: "cat", petName: "Pepper", nickname: "Lena", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-5", image: "/tpl/poster.jpg", templateId: "poster", species: "cat", petName: "Biscuit", nickname: "Marco", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-6", image: "/tpl/polaroid.jpg", templateId: "polaroid", species: "cat", petName: "Mochi", nickname: "Ivy", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-7", image: "/tpl/knit.jpg", templateId: "knit", species: "cat", petName: "Luna", nickname: "Ben", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-8", image: "/tpl/sticker.jpg", templateId: "sticker", species: "cat", petName: "Smoky", nickname: "Zoe", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  { id: "seed-9", image: "/land/royal-cat.jpg", templateId: "royal", species: "cat", petName: "Simba", nickname: "Owen", text: undefined, rating: undefined, approved: true, seed: true, createdAt: now },
  // 评价（附作品图）
  { id: "seed-10", image: "/tpl/desk.jpg", templateId: "desk", species: "cat", petName: "Miso", nickname: "Aya", text: "My boss cat now has a LinkedIn headshot. I laughed for ten minutes — the tired-but-polite face is EXACTLY him.", rating: 5, approved: true, seed: true, createdAt: now },
  { id: "seed-11", image: "/tpl/glance.jpg", templateId: "glance", species: "dog", petName: "Biscuit", nickname: "Tom", text: "The side-eye is perfect. Sent it to the whole family chat.", rating: 5, approved: true, seed: true, createdAt: now },
  { id: "seed-12", image: "/tpl/knit.jpg", templateId: "knit", species: "cat", petName: "Luna", nickname: "Sofia", text: "Ordered nothing, got a Christmas card of my cat in his sweater. The face and the knit are spot on.", rating: 5, approved: true, seed: true, createdAt: now },
  { id: "seed-13", image: "/tpl/sticker.jpg", templateId: "sticker", species: "cat", petName: "Smoky", nickname: "Leo", text: "Turned my cat into a sticker and put it on my laptop. Zero regrets.", rating: 4, approved: true, seed: true, createdAt: now },
];
