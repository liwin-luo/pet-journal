"use client";

import { useEffect, useState } from "react";

type Chip = { id: string; label: string };

function useQueryPick(param: string, allowed: string[], fallback: string) {
  const key = allowed.join("\n");
  const [active, setActive] = useState(fallback);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get(param);
    setActive(q && key.split("\n").includes(q) ? q : fallback);
  }, [param, fallback, key]);
  function pick(id: string) {
    const url = new URL(window.location.href);
    if (id === fallback) url.searchParams.delete(param);
    else url.searchParams.set(param, id);
    const search = url.searchParams.toString();
    history.replaceState(null, "", url.pathname + (search ? `?${search}` : ""));
    setActive(id);
  }
  return [active, pick] as const;
}

const chipCls = (on: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    on ? "bg-coral text-white" : "border border-sand bg-surface text-coffee hover:border-coral hover:text-coral"
  }`;

/** 模板筛选留在浏览器里。服务端不读 query，公开页才能被缓存。 */
export function TemplateFilter({
  badges,
  cats,
  allLabel,
  total,
  empty,
}: {
  badges: Chip[];
  cats: Chip[];
  allLabel: string;
  total: number;
  empty: string;
}) {
  const badgeIds = badges.map((b) => b.id);
  const catIds = cats.map((c) => c.id);
  const [badge, pickBadge] = useQueryPick("badge", badgeIds, "");
  const [cat, pickCat] = useQueryPick("cat", catIds, "all");

  useEffect(() => {
    let shown = 0;
    document.querySelectorAll<HTMLElement>("[data-tpl]").forEach((el) => {
      const ok = (cat === "all" || el.dataset.cat === cat) && (!badge || el.dataset.badge === badge);
      el.hidden = !ok;
      if (ok) shown += 1;
    });
    const note = document.getElementById("tpl-empty");
    if (note) note.hidden = shown > 0;
  }, [badge, cat]);

  return (
    <>
      <nav className="mt-6 flex justify-center gap-2" aria-label="Badge filters">
        {badges.map((b) => (
          <button key={b.id} type="button" className={chipCls(badge === b.id)} onClick={() => pickBadge(badge === b.id ? "" : b.id)}>
            {b.label}
          </button>
        ))}
      </nav>
      <nav className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Template categories">
        <button type="button" className={chipCls(cat === "all")} onClick={() => pickCat("all")}>
          {allLabel} ({total})
        </button>
        {cats.map((c) => (
          <button key={c.id} type="button" className={chipCls(cat === c.id)} onClick={() => pickCat(c.id)}>
            {c.label}
          </button>
        ))}
      </nav>
      <p id="tpl-empty" hidden className="mt-10 text-center text-coffee">
        {empty}
      </p>
    </>
  );
}

/** 画廊物种筛选。同上，不把 query 送回函数。 */
export function GalleryFilter({ chips, empty }: { chips: Chip[]; empty: string }) {
  const ids = chips.map((c) => c.id);
  const [species, pick] = useQueryPick("species", ids, "all");

  useEffect(() => {
    let shown = 0;
    document.querySelectorAll<HTMLElement>("[data-species]").forEach((el) => {
      const ok = species === "all" || el.dataset.species === species;
      el.hidden = !ok;
      if (ok) shown += 1;
    });
    const note = document.getElementById("gal-empty");
    if (note) note.hidden = shown > 0;
  }, [species]);

  return (
    <>
      <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Filter by pet type">
        {chips.map((c) => (
          <button key={c.id} type="button" className={chipCls(species === c.id)} onClick={() => pick(c.id)}>
            {c.label}
          </button>
        ))}
      </nav>
      <p id="gal-empty" hidden className="mt-10 text-center text-coffee">
        {empty}
      </p>
    </>
  );
}
