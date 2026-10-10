"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "./icons";
import { CREDIT_PACKS, PRO_MONTHLY, PRO_YEARLY, formatPrice, yearlyMonthlyEquiv } from "@/lib/plans";

// 定价面板：Free / Pro（月·年切换）/ Credits 加油包。
// 本期不接支付：按钮为禁用占位并明确标注 Coming soon（plans.ts 后续补 checkout 链接）。

type Texts = {
  freeName: string;
  freePrice: string;
  freePer: string;
  freeFeat: string[];
  freeCta: string;
  proBadge: string;
  proName: string;
  proFeat: string[];
  monthly: string;
  yearly: string;
  perMonth: string;
  perYear: string;
  yearlySave: string;
  creditsName: string;
  creditsSub: string;
  creditUnit: string;
  packsFeat: string[];
  buy: string;
  soon: string;
  startHref: string;
};

export function PricingPlans({ texts }: { texts: Texts }) {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="flex flex-col gap-10">
      {/* 切换 */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-sand bg-surface p-1" role="group" aria-label={texts.monthly}>
          <button type="button" onClick={() => setYearly(false)} aria-pressed={!yearly} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${!yearly ? "bg-coral text-white" : "text-coffee hover:text-coral"}`}>
            {texts.monthly}
          </button>
          <button type="button" onClick={() => setYearly(true)} aria-pressed={yearly} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${yearly ? "bg-coral text-white" : "text-coffee hover:text-coral"}`}>
            {texts.yearly}
            <span className={`pill-badge !px-2 !py-0.5 ${yearly ? "bg-lemon text-lemon-ink" : "bg-lemon/90 text-lemon-ink"}`}>{texts.yearlySave}</span>
          </button>
        </div>
      </div>

      {/* 三档 */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Free */}
        <div className="card flex flex-col p-7">
          <h2 className="font-display text-xl font-bold">{texts.freeName}</h2>
          <p className="mt-3 font-display text-4xl font-black">
            {texts.freePrice}
            <span className="ml-2 text-xs font-semibold text-fog">{texts.freePer}</span>
          </p>
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-coffee">
            {texts.freeFeat.map((f) => (
              <li key={f} className="flex items-start gap-2"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{f}</li>
            ))}
          </ul>
          <Link href={texts.startHref} className="btn-ghost mt-7 w-full !justify-center">{texts.freeCta}</Link>
        </div>

        {/* Pro */}
        <div className="card relative flex flex-col border-coral/60 p-7 shadow-lift">
          <span className="pill-badge absolute -top-3 left-1/2 -translate-x-1/2 bg-lemon text-lemon-ink">{texts.proBadge}</span>
          <h2 className="font-display text-xl font-bold text-coral">{texts.proName}</h2>
          <p className="mt-3 font-display text-4xl font-black">
            {formatPrice(yearly ? PRO_YEARLY : PRO_MONTHLY)}
            <span className="ml-2 text-xs font-semibold text-fog">{yearly ? texts.perYear : texts.perMonth}</span>
          </p>
          {yearly && <p className="mt-1 text-xs font-medium text-sage">≈ {yearlyMonthlyEquiv()}{texts.perMonth}</p>}
          <ul className="mt-6 flex-1 space-y-2.5 text-sm text-coffee">
            {texts.proFeat.map((f) => (
              <li key={f} className="flex items-start gap-2"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{f}</li>
            ))}
          </ul>
          <button type="button" disabled className="btn-primary mt-7 w-full cursor-not-allowed" title={texts.soon}>
            {texts.proName} · {texts.soon}
          </button>
        </div>

        {/* Credits */}
        <div className="card flex flex-col p-7">
          <h2 className="font-display text-xl font-bold">{texts.creditsName}</h2>
          <p className="mt-1 text-xs font-medium text-fog">{texts.creditsSub}</p>
          <ul className="mt-5 flex-1 space-y-2 text-sm text-coffee">
            {texts.packsFeat.map((f) => (
              <li key={f} className="flex items-start gap-2"><CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />{f}</li>
            ))}
          </ul>
          <div className="mt-5 space-y-2">
            {CREDIT_PACKS.map((p) => (
              <div key={p.id} className={`relative flex items-center justify-between rounded-2xl border px-4 py-3 ${p.best ? "border-coral/60 bg-coral-soft/50" : "border-sand bg-surface-2"}`}>
                {p.best && <span className="pill-badge absolute -top-2.5 right-4 bg-lemon text-lemon-ink">★</span>}
                <span className="font-display text-lg font-black">{p.credits} <span className="text-xs font-semibold text-fog">{texts.creditUnit}</span></span>
                <button type="button" disabled className="rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed" title={texts.soon}>
                  {formatPrice(p.price)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-fog">{texts.soon}</p>
    </div>
  );
}
