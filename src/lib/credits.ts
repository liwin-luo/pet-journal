// 额度跟 PetsDaily 的三档对齐：免费每月 8 张，Plus / 家庭按月、不设月上限。
// 旧的点数余额仍可花掉。扣点和入账以服务器钱包为准。
export type PlanId = "free" | "studio" | "home";

export const FREE_MONTH = 8;

export const PLANS: Record<PlanId, { pets: number; price: number }> = {
  free: { pets: 1, price: 0 },
  studio: { pets: 5, price: 6 },
  home: { pets: 15, price: 12 },
};

const RANK: Record<PlanId, number> = { free: 0, studio: 1, home: 2 };

export type Wallet = { plan?: PlanId; credits?: number; creditDay?: string; monthUsed?: number; refilled?: boolean };

export function planOf(s: { plan?: PlanId }): PlanId {
  return s.plan === "studio" || s.plan === "home" ? s.plan : "free";
}

export function todayKey(now = new Date()): string {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

export function monthKey(today = todayKey()): string {
  const parts = today.split("-");
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : today;
}

export function walletFields(w: Wallet) {
  return {
    plan: planOf(w),
    credits: Number(w.credits) || 0,
    creditDay: typeof w.creditDay === "string" ? w.creditDay : "",
    monthUsed: Number(w.monthUsed) || 0,
    refilled: w.refilled === true,
  };
}

/** 作品没落库时把本月已用清掉，只做一次。 */
export function restoreMonth(w: Wallet) {
  return walletFields({ ...w, monthUsed: 0, refilled: true });
}

/** 付费档每次最多出 8 张。免费档是本月剩余，加上还没花完的旧余额。 */
export function creditsLeft(s: Wallet, today = todayKey()): number {
  if (planOf(s) !== "free") return 8;
  const used = s.creditDay === monthKey(today) ? (s.monthUsed || 0) : 0;
  return (s.credits || 0) + Math.max(0, FREE_MONTH - used);
}

/** 付费档不扣余额。免费档先花旧余额，再花本月额度。 */
export function draw(w: Wallet, n: number, today = todayKey()): { next: Wallet; taken: number } {
  const plan = planOf(w);
  const want = Math.max(0, Math.floor(n));
  if (plan !== "free") return { taken: want, next: walletFields(w) };
  const month = monthKey(today);
  let used = w.creditDay === month ? (w.monthUsed || 0) : 0;
  let balance = w.credits || 0;
  const fromBal = Math.min(balance, want);
  balance -= fromBal;
  const fromFree = Math.min(Math.max(0, FREE_MONTH - used), want - fromBal);
  used += fromFree;
  return {
    taken: fromBal + fromFree,
    next: walletFields({ plan, credits: balance, creditDay: month, monthUsed: used, refilled: w.refilled === true }),
  };
}

/** 升到更高的那一档，不降回去。不另加点数包。 */
export function grant(w: Wallet, tier: "studio" | "home"): Wallet {
  const cur = planOf(w);
  return walletFields({ ...w, plan: RANK[tier] > RANK[cur] ? tier : cur });
}

if (process.env.PLAN_CHECK) {
  const day = "2026-9-2";
  const fresh = creditsLeft({ credits: 0 }, day);
  const usedUp = creditsLeft({ creditDay: "2026-9", monthUsed: 8 }, day);
  const nextMo = creditsLeft({ creditDay: "2026-9", monthUsed: 8 }, "2026-10-1");
  const paid = creditsLeft({ plan: "studio", credits: 0 }, day);
  const spent = draw({ credits: 0 }, 3, day);
  const cap = draw({ credits: 0 }, 9, day);
  const bought = grant({ credits: 0, plan: "free" }, "studio");
  const stay = grant({ credits: 1, plan: "home" }, "studio");
  if (fresh !== 8 || usedUp !== 0 || nextMo !== 8 || paid !== 8) throw new Error(`plan ${fresh} ${usedUp} ${nextMo} ${paid}`);
  if (spent.taken !== 3 || spent.next.monthUsed !== 3 || spent.next.creditDay !== "2026-9") throw new Error("draw");
  if (cap.taken !== 8) throw new Error("cap");
  if (bought.plan !== "studio" || bought.credits !== 0) throw new Error("grant");
  if (stay.plan !== "home" || stay.credits !== 1) throw new Error("norank");
  const back = restoreMonth({ creditDay: "2026-9", monthUsed: 8, credits: 0 });
  const kept = draw(back, 1, day);
  if (creditsLeft(back, day) !== 8 || back.refilled !== true || kept.taken !== 1 || kept.next.refilled !== true) throw new Error("restore");
  console.log("plan ok");
}
