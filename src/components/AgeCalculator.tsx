"use client";

import { useMemo, useState } from "react";
import { catToHuman, chartFor, dogToHuman, type DogSize } from "@/lib/age";
import { CatIcon, DogIcon } from "./icons";

// 年龄换算器：纯前端计算 + 实时换算表。

type Texts = {
  kind: string;
  cat: string;
  dog: string;
  ageLabel: string;
  years: string;
  size: string;
  small: string;
  medium: string;
  large: string;
  result: string;
  stage: { baby: string; young: string; adult: string; senior: string };
  chartTitle: string;
  petYears: string;
  humanYears: string;
};

const STAGE_CLS: Record<string, string> = {
  baby: "bg-sage-soft text-sage",
  young: "bg-coral-soft text-coral",
  adult: "bg-surface-2 text-coffee",
  senior: "bg-surface-2 text-gold",
};

export function AgeCalculator({ texts }: { texts: Texts }) {
  const [kind, setKind] = useState<"cat" | "dog">("cat");
  const [age, setAge] = useState(3);
  const [size, setSize] = useState<DogSize>("medium");

  const { humanYears, stage } = useMemo(
    () => (kind === "cat" ? catToHuman(age) : dogToHuman(age, size)),
    [kind, age, size],
  );
  const chart = useMemo(() => chartFor(kind, size), [kind, size]);
  const maxHuman = Math.max(...chart.map((c) => c.human), 1);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      active ? "border-coral bg-coral-soft text-coral" : "border-sand bg-surface-2 text-coffee hover:border-coral/60"
    }`;

  return (
    <div className="flex flex-col gap-8">
      <div className="card grid gap-6 p-6 md:grid-cols-[auto_1fr_1fr] md:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fog">{texts.kind}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setKind("cat")} className={`${chip(kind === "cat")} inline-flex items-center gap-2`} aria-pressed={kind === "cat"}><CatIcon className="h-4 w-4" /> {texts.cat}</button>
            <button type="button" onClick={() => setKind("dog")} className={`${chip(kind === "dog")} inline-flex items-center gap-2`} aria-pressed={kind === "dog"}><DogIcon className="h-4 w-4" /> {texts.dog}</button>
          </div>
        </div>
        <div>
          <label htmlFor="pet-age" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-fog">{texts.ageLabel}</label>
          <div className="flex items-center gap-2">
            <input
              id="pet-age"
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={age}
              onChange={(e) => setAge(Math.min(30, Math.max(0, Number(e.target.value) || 0)))}
              className="w-24 rounded-xl border border-sand bg-surface-2 px-4 py-2.5 text-base font-semibold text-ink outline-none focus:border-coral"
            />
            <span className="text-sm text-coffee">{texts.years}</span>
          </div>
        </div>
        {kind === "dog" && (
          <div>
            <label htmlFor="dog-size" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-fog">{texts.size}</label>
            <select
              id="dog-size"
              value={size}
              onChange={(e) => setSize(e.target.value as DogSize)}
              className="w-full rounded-xl border border-sand bg-surface-2 px-4 py-2.5 text-sm font-medium text-ink outline-none focus:border-coral"
            >
              <option value="small">{texts.small}</option>
              <option value="medium">{texts.medium}</option>
              <option value="large">{texts.large}</option>
            </select>
          </div>
        )}
      </div>

      {/* 结果 */}
      <div className="rounded-big border border-coral/40 bg-coral-soft/60 p-8 text-center shadow-soft">
        <p className="font-display text-4xl font-black text-coral md:text-5xl">{texts.result.replace("{n}", String(humanYears))}</p>
        <span className={`pill-badge mt-4 inline-flex !px-4 !py-1.5 !text-xs ${STAGE_CLS[stage]}`}>
          {texts.stage[stage]}
        </span>
      </div>

      {/* 换算表 */}
      <section aria-label={texts.chartTitle}>
        <h2 className="font-display text-xl font-bold">{texts.chartTitle}</h2>
        <div className="card mt-3 overflow-x-auto p-4">
          <table className="w-full min-w-120 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-fog">
                <th className="whitespace-nowrap px-2 py-2 font-semibold">{texts.petYears}</th>
                <th className="whitespace-nowrap px-2 py-2 font-semibold">{texts.humanYears}</th>
                <th className="w-full px-2 py-2 font-semibold" aria-hidden="true"></th>
              </tr>
            </thead>
            <tbody>
              {chart.map((row) => (
                <tr key={row.pet} className={`border-t border-sand/50 ${row.pet === Math.floor(age) ? "bg-coral-soft/50 font-semibold" : ""}`}>
                  <td className="px-2 py-1.5 text-coffee">{row.pet}</td>
                  <td className="px-2 py-1.5 text-coffee">{row.human}</td>
                  <td className="px-2 py-1.5" aria-hidden="true">
                    <div className="h-2 rounded-full bg-surface-2">
                      <div className="h-2 rounded-full bg-coral/70" style={{ width: `${(row.human / maxHuman) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
