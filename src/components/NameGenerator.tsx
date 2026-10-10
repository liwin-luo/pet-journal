"use client";

import { useEffect, useMemo, useState } from "react";
import type { NameEntry, NameStyle, PetGender } from "@/lib/names";
import { NAME_STYLES } from "@/lib/names";

// 起名生成器：前端词库随机 + 性别/风格筛选 + 收藏（localStorage 按物种隔离）。

type Texts = {
  pickGender: string;
  gAll: string;
  gM: string;
  gF: string;
  gU: string;
  pickStyle: string;
  sAll: string;
  sCute: string;
  sCool: string;
  sClassic: string;
  sFunny: string;
  sFood: string;
  shuffle: string;
  savedTitle: string;
  savedEmpty: string;
  clear: string;
  count: string;
};

const GENDERS: { id: PetGender | "all"; key: keyof Texts }[] = [
  { id: "all", key: "gAll" },
  { id: "m", key: "gM" },
  { id: "f", key: "gF" },
  { id: "u", key: "gU" },
];

const STYLE_KEYS: Record<NameStyle, keyof Texts> = {
  cute: "sCute",
  cool: "sCool",
  classic: "sClassic",
  funny: "sFunny",
  food: "sFood",
};

export function NameGenerator({
  names,
  species,
  texts,
}: {
  names: NameEntry[];
  species: "dog" | "cat";
  texts: Texts;
}) {
  const [gender, setGender] = useState<PetGender | "all">("all");
  const [style, setStyle] = useState<NameStyle | "all">("all");
  const [shuffled, setShuffled] = useState<NameEntry[]>(names);
  const [saved, setSaved] = useState<string[]>([]);
  const storeKey = `pd-names-${species}`;

  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem(storeKey) ?? "[]"));
    } catch {}
  }, [storeKey]);

  function toggleSave(n: string) {
    setSaved((prev) => {
      const next = prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n];
      localStorage.setItem(storeKey, JSON.stringify(next));
      return next;
    });
  }

  function shuffle() {
    setShuffled((prev) => [...prev].sort(() => Math.random() - 0.5));
  }

  const filtered = useMemo(
    () => shuffled.filter((n) => (gender === "all" || n.g === gender) && (style === "all" || n.s === style)),
    [shuffled, gender, style],
  );

  const savedEntries = useMemo(() => names.filter((n) => saved.includes(n.n)), [names, saved]);

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-coral bg-coral-soft text-coral" : "border-sand bg-surface-2 text-coffee hover:border-coral/60"
    }`;

  const styleLabel = (s: NameStyle | "all") => (s === "all" ? texts.sAll : texts[STYLE_KEYS[s]] as string);
  const genderLabel = (g: PetGender | "all") => texts[GENDERS.find((x) => x.id === g)!.key] as string;

  return (
    <div className="flex flex-col gap-8">
      {/* 筛选 */}
      <div className="card flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">{texts.pickGender}</span>
          {GENDERS.map((g) => (
            <button key={g.id} type="button" onClick={() => setGender(g.id)} className={chip(gender === g.id)} aria-pressed={gender === g.id}>
              {genderLabel(g.id)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-fog">{texts.pickStyle}</span>
          <button type="button" onClick={() => setStyle("all")} className={chip(style === "all")} aria-pressed={style === "all"}>
            {texts.sAll}
          </button>
          {NAME_STYLES.map((s) => (
            <button key={s} type="button" onClick={() => setStyle(s)} className={chip(style === s)} aria-pressed={style === s}>
              {styleLabel(s)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fog">{texts.count.replace("{n}", String(filtered.length))}</p>
          <button type="button" onClick={shuffle} className="btn-ghost !px-4 !py-2 text-sm">🎲 {texts.shuffle}</button>
        </div>
      </div>

      {/* 收藏 */}
      <section aria-label={texts.savedTitle}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">♥ {texts.savedTitle} <span className="text-sm font-normal text-fog">({savedEntries.length})</span></h2>
          {savedEntries.length > 0 && (
            <button type="button" onClick={() => { setSaved([]); localStorage.removeItem(storeKey); }} className="text-sm font-medium text-fog hover:text-coral">
              {texts.clear}
            </button>
          )}
        </div>
        {savedEntries.length === 0 ? (
          <p className="mt-2 text-sm text-fog">{texts.savedEmpty}</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {savedEntries.map((n) => (
              <span key={n.n} className="rounded-full border border-coral/60 bg-coral-soft px-4 py-1.5 text-sm font-semibold text-coral">
                {n.n} <span className="font-normal opacity-75">· {n.m}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 名字网格 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((n) => {
          const isSaved = saved.includes(n.n);
          return (
            <div key={`${n.n}-${n.m}`} className="card flex items-center justify-between gap-2 p-4">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold">{n.n}</p>
                <p className="truncate text-xs text-fog">{n.m}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleSave(n.n)}
                aria-pressed={isSaved}
                aria-label={`${isSaved ? "♥" : "♡"} ${n.n}`}
                className={`shrink-0 text-xl transition-transform hover:scale-110 ${isSaved ? "text-coral" : "text-fog"}`}
              >
                {isSaved ? "♥" : "♡"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
