// 免费每月 8 张。Plus / 家庭不设月上限。扣点和入账以服务器钱包为准。
import { AppState } from "./types";
import { loadState, updateState } from "./store";
import { PLANS, FREE_MONTH, creditsLeft, draw, grant, planOf, todayKey, walletFields, type PlanId } from "./credits";

export { PLANS, FREE_MONTH, creditsLeft, planOf, todayKey, walletFields };
export type { PlanId };

export function canAddPet(s: AppState): boolean {
  return s.pets.length < PLANS[planOf(s)].pets;
}

/** 本机预扣。出图接口会再扣一次服务器钱包，页面不要靠这个入账。 */
export function takeCredits(n: number): number {
  const s = loadState();
  const { next, taken } = draw(s, n);
  updateState(walletFields(next));
  return taken;
}

export function grantPack(tier: "studio" | "home") {
  const next = grant(loadState(), tier);
  updateState({ paid: true, ...walletFields(next) });
}
