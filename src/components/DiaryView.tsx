"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { groupByLocalDay, monthMatrix, type DiaryWork } from "@/lib/diary-shared";
import type { PetProfile } from "@/lib/store";
import { type Dict, type Locale } from "@/lib/i18n";

type Caption = { title: string; text: string };
type View = "calendar" | "timeline" | "book";

type Props = {
  locale: Locale;
  t: Dict;
  createPath: string;
  works: DiaryWork[];
  pet0: PetProfile | null;
};

function dayLabel(date: string, locale: Locale): string {
  // 挂正午的时间戳，避免时区换档把日期挪一天
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric" });
}

/** 宠物日记：宠物档案卡 + 日历/时间线/日记本三视图。 */
export function DiaryView({ locale, t, createPath, works, pet0 }: Props) {
  const d = t.diary;
  const [pet, setPet] = useState(pet0);
  const [editing, setEditing] = useState(!pet0);
  const [view, setView] = useState<View>("calendar");
  // 本地时区归日只能在客户端算（SSR 时区不同会 hydration mismatch），mount 后再分组
  const [days, setDays] = useState<ReturnType<typeof groupByLocalDay> | null>(null);
  const [ym, setYm] = useState({ y: new Date().getFullYear(), m0: new Date().getMonth() });
  const [captions, setCaptions] = useState<Record<string, Caption>>({});
  const [bookDay, setBookDay] = useState<string | null>(null);
  const asked = useRef<Set<string>>(new Set());
  const [form, setForm] = useState({ name: pet0?.name ?? "", species: pet0?.species ?? "", avatar: pet0?.avatar });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDays(groupByLocalDay(works));
  }, [works]);

  const byDate = useMemo(() => new Map((days ?? []).map((x) => [x.date, x])), [days]);

  const monthDays = useMemo(() => {
    const prefix = `${ym.y}-${String(ym.m0 + 1).padStart(2, "0")}`;
    return (days ?? []).filter((x) => x.date.startsWith(prefix));
  }, [days, ym]);

  // 当月缺文案的日子批量补写（asked 防重发；服务端有永久缓存，重复请求免费）
  useEffect(() => {
    if (!monthDays.length) return;
    const missing = monthDays.filter((x) => !asked.current.has(x.date));
    if (!missing.length) return;
    missing.forEach((x) => asked.current.add(x.date));
    fetch("/api/diary/caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lang: locale,
        entries: missing.slice(0, 10).map((x) => ({ date: x.date, tokens: x.works.map((w) => w.token) })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { entries?: (Caption & { date: string })[] };
        setCaptions((prev) => {
          const next = { ...prev };
          for (const e of data.entries ?? []) if (e.text) next[e.date] = { title: e.title, text: e.text };
          return next;
        });
      })
      .catch(() => {});
  }, [monthDays, locale]);

  if (!days) return <div className="card mt-8 h-72 animate-pulse bg-parchment/60" />;

  if (!works.length) {
    return (
      <div className="card mt-8 p-10 text-center">
        <p className="text-sm text-coffee">{d.empty}</p>
        <Link href={createPath} className="btn-primary mt-5">{d.create}</Link>
      </div>
    );
  }

  const weeks = monthMatrix(ym.y, ym.m0);
  const monthLabel = new Date(ym.y, ym.m0, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
  const shiftMonth = (delta: number) => {
    const n = new Date(ym.y, ym.m0 + delta, 1);
    setYm({ y: n.getFullYear(), m0: n.getMonth() });
  };
  const openDay = (date: string) => {
    setBookDay(date);
    setView("book");
  };
  const bookIdx = bookDay ? days.findIndex((x) => x.date === bookDay) : -1;
  const bookCur = bookIdx >= 0 ? days[bookIdx] : days[0];
  const bookAt = (delta: number) => {
    const next = days[bookIdx + delta];
    if (next) setBookDay(next.date);
  };

  const savePet = async () => {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/diary/pet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, species: form.species, avatar: form.avatar }),
      });
      if (res.ok) {
        const data = (await res.json()) as { pet: PetProfile };
        setPet(data.pet);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const dayImgs = (day: { works: DiaryWork[] }) => (
    <div className="flex items-start gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={day.works[0]!.image} alt={day.works[0]!.message || "Portrait"} className="aspect-[3/4] w-28 shrink-0 rounded-xl border border-sand object-cover sm:w-40" />
      {day.works.length > 1 && (
        <div className="flex flex-col gap-2">
          {day.works.slice(1, 4).map((w) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={w.token} src={w.image} alt={w.message || "Portrait"} className="h-12 w-12 rounded-lg border border-sand object-cover" />
          ))}
          {day.works.length > 4 && (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-parchment text-xs font-semibold text-coffee">
              +{day.works.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const captionOf = (date: string) =>
    captions[date] ? (
      <>
        <p className="font-display text-lg font-semibold text-coral-deep">{captions[date]!.title}</p>
        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-coffee">{captions[date]!.text}</p>
      </>
    ) : (
      <p className="text-sm text-fog">{d.writing}</p>
    );

  return (
    <div>
      {/* 宠物档案卡 */}
      {editing ? (
        <div className="card p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fog">{d.setupTitle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={d.petNamePh}
              aria-label={d.setupTitle}
              maxLength={40}
              className="w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm outline-none focus:border-coral"
            />
            <input
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
              placeholder={d.petSpeciesPh}
              aria-label={d.petSpeciesPh}
              maxLength={30}
              className="w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm outline-none focus:border-coral"
            />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-fog">{d.petAvatar}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {works.slice(0, 12).map((w) => (
              <button
                key={w.token}
                type="button"
                onClick={() => setForm({ ...form, avatar: form.avatar === w.image ? undefined : w.image })}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${form.avatar === w.image ? "border-coral" : "border-transparent hover:border-sand"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt="" className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {pet && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setForm({ name: pet.name, species: pet.species, avatar: pet.avatar });
                  setEditing(false);
                }}
              >
                {t.signout.cancel}
              </button>
            )}
            <button type="button" className="btn-primary" disabled={!form.name.trim() || saving} onClick={savePet}>
              {d.petSave}
            </button>
          </div>
        </div>
      ) : (
        <div className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pet?.avatar ?? works[0]!.image} alt={pet?.name ?? ""} className="h-14 w-14 rounded-full border border-sand object-cover" />
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold">{pet?.name ?? d.setupTitle}</p>
            {pet?.species && (
              <span className="mt-0.5 inline-block rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] font-semibold text-sage">{pet.species}</span>
            )}
          </div>
          <button type="button" onClick={() => setEditing(true)} className="btn-ghost ml-auto !px-4 !py-2 text-sm">
            {d.petEdit}
          </button>
        </div>
      )}

      {/* 视图切换 */}
      <div className="mt-6 flex gap-2" role="tablist" aria-label={d.title}>
        {(["calendar", "timeline", "book"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${view === v ? "bg-coral text-white" : "bg-parchment text-coffee transition-colors hover:text-coral"}`}
          >
            {v === "calendar" ? d.tabCalendar : v === "timeline" ? d.tabTimeline : d.tabBook}
          </button>
        ))}
      </div>

      {/* 日历 */}
      {view === "calendar" && (
        <div className="card mt-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label={d.prev} className="btn-ghost !px-3 !py-1.5">←</button>
            <p className="font-display text-lg font-semibold">{monthLabel}</p>
            <button type="button" onClick={() => shiftMonth(1)} aria-label={d.next} className="btn-ghost !px-3 !py-1.5">→</button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-fog">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i}>{new Date(2023, 0, 1 + i).toLocaleDateString(locale, { weekday: "short" })}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {weeks.flat().map((date, i) =>
              date === null ? (
                <span key={`pad${i}`} />
              ) : (
                <button
                  key={date}
                  type="button"
                  disabled={!byDate.has(date)}
                  onClick={() => openDay(date)}
                  className={`relative aspect-square rounded-lg border p-1.5 text-left transition-colors ${
                    byDate.has(date) ? "border-coral/40 bg-coral-soft/60 hover:border-coral" : "border-transparent text-fog"
                  }`}
                >
                  <span className="text-[11px] font-semibold">{Number(date.slice(8))}</span>
                  {byDate.has(date) && (
                    <span className="absolute inset-x-1.5 bottom-1.5 flex -space-x-1.5">
                      {byDate.get(date)!.works.slice(0, 3).map((w) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={w.token} src={w.image} alt="" className="h-5 w-5 rounded-full border border-white object-cover sm:h-6 sm:w-6" />
                      ))}
                    </span>
                  )}
                </button>
              ),
            )}
          </div>
          <p className="mt-3 text-center text-xs text-fog">{d.subtitle}</p>
        </div>
      )}

      {/* 时间线 */}
      {view === "timeline" && (
        <div className="mt-4 space-y-5">
          {days.map((day) => (
            <article key={day.date} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-sand/70 px-5 py-3">
                <h3 className="font-display font-semibold">{dayLabel(day.date, locale)}</h3>
                <span className="text-xs text-fog">
                  {(day.works.length === 1 ? d.picCount : d.picsCount).replace("{count}", String(day.works.length))}
                </span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[176px_1fr]">
                {dayImgs(day)}
                <div>{captionOf(day.date)}</div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 日记本 */}
      {view === "book" && bookCur && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <button type="button" disabled={bookIdx >= days.length - 1} onClick={() => bookAt(1)} className="btn-ghost !px-4 !py-2 text-sm">
              ← {d.prev}
            </button>
            <p className="font-display font-semibold">{dayLabel(bookCur.date, locale)}</p>
            <button type="button" disabled={bookIdx <= 0} onClick={() => bookAt(-1)} className="btn-ghost !px-4 !py-2 text-sm">
              {d.next} →
            </button>
          </div>
          <div className="card mt-3 grid overflow-hidden sm:min-h-[420px] sm:grid-cols-2">
            <div className="bg-parchment p-4 sm:p-5">{dayImgs(bookCur)}</div>
            <div className="flex flex-col p-6 sm:p-8">
              {captionOf(bookCur.date)}
              <p className="mt-auto pt-6 text-xs text-fog">
                {pet?.name ? `${pet.name} · ` : ""}
                {bookCur.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
