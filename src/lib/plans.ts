// 定价数据唯一出口：价格/档位结构在这里，文案在 i18n（dict.pricing / dict.acct）。
// 后续接 Paddle 时只改本文件（补 checkout link/product id），页面不动。

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  best?: boolean;
}

export const PRO_MONTHLY = 9.99;
export const PRO_YEARLY = 79;

export const CREDIT_PACKS: CreditPack[] = [
  { id: "pack30", credits: 30, price: 9 },
  { id: "pack80", credits: 80, price: 19, best: true },
  { id: "pack200", credits: 200, price: 39 },
];

export function formatPrice(n: number): string {
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

export function yearlyMonthlyEquiv(): string {
  return `$${(PRO_YEARLY / 12).toFixed(2)}`;
}
