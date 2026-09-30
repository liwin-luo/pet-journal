"use client";
// 主链路共享逻辑：意图带去素材层（审计 #3 的过渡说明）· 素材检查 · 推荐重排
import { loadState, updateState, curPet } from "./store";
import { creditsLeft } from "./plan";
import { TAGMAP } from "./catalog";
import { isPortrait } from "./guards";

/** 创作选择完成后调用。有点数就做刚才这一张；用完了才去付费墙；还没有肖像就去上传。 */
export function afterCreateIntent(intent: string) {
  updateState({ intent });
  const s = loadState();
  const p = curPet(s);
  const ready = Boolean(p?.hasAnchor && isPortrait(p.anchorImage));
  if (!ready) {
    window.location.href = "/upload";
    return;
  }
  window.location.href = creditsLeft(s) > 0 ? "/processing?n=1" : "/preview";
}

/** 性格标签 → 推荐风格 index 集合 */
export function recIndices(tags: number[]): Set<number> {
  const s = new Set<number>();
  for (const tg of tags) for (const x of TAGMAP[TAGKEY(tg)] ?? []) s.add(x);
  return s;
}
function TAGKEY(i: number): string {
  return ["playful", "cuddly", "sassy", "goofy", "alert", "gentle", "dramatic", "chill"][i] ?? "";
}

/** 创作框 @ 到的宠物。没有这份名单时退回当前一只。 */
export function citedPets(s: ReturnType<typeof loadState>) {
  const ids = s.citedPetIds?.length ? s.citedPetIds : (s.curPetId ? [s.curPetId] : []);
  return ids.map((id) => s.pets.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}

/** 组装引擎所需的宠物上下文（tagNames 由页面用 i18n 翻译后传入） */
export function petCtx(p: ReturnType<typeof curPet>, tagNames: string[]) {
  const kind = p?.species === "dog" ? "dog" : p?.species === "cat" ? "cat" : "";
  const stage = p?.stage === "young" ? "young" : p?.stage === "senior" ? "senior" : "";
  const breed = [kind, p?.breed, stage].filter(Boolean).join(", ");
  return {
    name: p?.name || "your pet",
    breed: breed || "pet",
    coat: p?.coat || "",
    tags: tagNames,
  };
}

/** 多只宠物合成一条提示。ponytail: 仍是一张锚点图，其它宠物只写进文字。要各用各的照片，得按宠物传参考图。 */
export function groupCtx(list: NonNullable<ReturnType<typeof curPet>>[], tagsOf: (p: NonNullable<ReturnType<typeof curPet>>) => string[]) {
  if (list.length <= 1) return petCtx(list[0] ?? null, list[0] ? tagsOf(list[0]) : []);
  return {
    name: list.map((p) => p.name).filter(Boolean).join(" and ") || "your pets",
    breed: list.map((p) => {
      const c = petCtx(p, tagsOf(p));
      return [c.name, c.breed, c.coat].filter(Boolean).join(" ");
    }).join("; "),
    coat: "together in one portrait",
    tags: [] as string[],
  };
}

