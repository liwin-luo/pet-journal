"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/locale-provider";
import { todayISO } from "@/lib/dates";
import { readImageAsDataUrl } from "@/lib/image";
import { petSnapshot } from "@/lib/pets";
import type { DiaryEntry, Pet } from "@/lib/types";

const autoOnce = new Set<string>();

function DiaryInner() {
  const { m } = useI18n();
  const search = useSearchParams();
  const [ready, setReady] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState("");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState("");

  async function loadPets() {
    const res = await fetch("/api/pets");
    const data = (await res.json()) as { pets?: Pet[]; lastPetId?: string };
    const list = data.pets ?? [];
    setPets(list);
    const hinted = search.get("pet") || data.lastPetId || "";
    const chosen = list.some((item) => item.id === hinted) ? hinted : list[0]?.id || "";
    setPetId(chosen);
    return chosen;
  }

  async function loadEntries(id: string) {
    const res = await fetch(`/api/diaries?petId=${encodeURIComponent(id)}`);
    const data = (await res.json()) as { entries?: DiaryEntry[] };
    setEntries(data.entries ?? []);
  }

  useEffect(() => {
    void loadPets().then((chosen) => {
      if (chosen) return loadEntries(chosen);
    }).finally(() => setReady(true));
  }, [search]);

  const pet = useMemo(() => pets.find((item) => item.id === petId), [petId, pets]);
  const today = todayISO();

  useEffect(() => {
    if (!pet) return;
    const key = `${pet.id}:${today}`;
    if (entries.some((item) => item.petId === pet.id && item.date === today && item.source === "auto")) return;
    if (autoOnce.has(key)) return;
    autoOnce.add(key);
    void requestBody("auto");
  }, [pet?.id, today, entries]);

  async function requestBody(source: "auto" | "prompt") {
    if (!pet) return;
    if (source === "prompt" && !note.trim()) {
      setError("先写一句今天的事");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet: { ...petSnapshot(pet), id: pet.id },
          petId: pet.id,
          date: today,
          source,
          userNote: source === "prompt" ? note.trim() : undefined,
          photo: source === "prompt" ? photo || undefined : undefined,
        }),
      });
      const data = (await res.json()) as { entry?: DiaryEntry; error?: string; code?: string };
      if (data.code === "auto_exists") {
        await loadEntries(pet.id);
        return;
      }
      if (!res.ok || !data.entry) {
        if (source === "auto") autoOnce.delete(`${pet.id}:${today}`);
        setError(data.error || "日记写不出来，重试一次");
        return;
      }
      await loadEntries(pet.id);
      if (source === "prompt") {
        setNote("");
        setPhoto("");
      }
    } catch {
      if (source === "auto") autoOnce.delete(`${pet.id}:${today}`);
      setError("日记写不出来，重试一次");
    } finally {
      setBusy(false);
    }
  }

  async function illustrate(entry: DiaryEntry) {
    if (!pet) return;
    setImageBusy(entry.id);
    setError("");
    try {
      const photos = [...pet.photos, entry.photo].filter(Boolean) as string[];
      const res = await fetch("/api/diary-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet: { ...petSnapshot(pet), id: pet.id },
          petId: pet.id,
          body: entry.body,
          photos,
          diaryId: entry.id,
        }),
      });
      const data = (await res.json()) as { imageUrl?: string; error?: string };
      if (!res.ok || !data.imageUrl) {
        setError(data.error || "配图失败，字还在，可以重试");
        return;
      }
      await loadEntries(pet.id);
    } catch {
      setError("配图失败，字还在，可以重试");
    } finally {
      setImageBusy("");
    }
  }

  async function saveEdit(id: string) {
    const text = draft.trim();
    if (!text) return;
    const res = await fetch(`/api/diaries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text }),
    });
    if (!res.ok) {
      setError("没存上");
      return;
    }
    setEditingId("");
    if (pet) await loadEntries(pet.id);
  }

  if (!ready) return <p className="text-sm text-mute">{m.diary.opening}</p>;

  if (!pets.length) {
    return (
      <section className="card mx-auto mt-4 max-w-md p-8 text-center">
        <p className="display text-3xl">{m.diary.emptyTitle}</p>
        <p className="mt-2 text-sm text-mute">{m.diary.emptyBody}</p>
        <Link href="/pets/new" className="btn mt-6 w-full sm:w-auto">{m.common.goNewPet}</Link>
      </section>
    );
  }

  const groups = groupByDate(entries);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,360px)_1fr] xl:items-start">
      <div className="card space-y-4 p-5 xl:sticky xl:top-6">
        <label className="block space-y-2">
          <span className="text-xs text-mute">{m.diary.whose}</span>
          <select
            className="field"
            value={petId}
            onChange={(e) => {
              const id = e.target.value;
              setPetId(id);
              setError("");
              void loadEntries(id);
            }}
          >
            {pets.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <div className="space-y-2">
          <p className="text-xs text-mute">{m.diary.promptLabel}</p>
          <textarea
            className="field min-h-24"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={m.diary.promptPh}
          />
          <div className="flex gap-2">
            <label className="btn btn-ghost flex-1 text-sm">
              {photo ? m.diary.attached : m.diary.attach}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void readImageAsDataUrl(file).then(setPhoto);
                }}
              />
            </label>
            {photo ? (
              <button type="button" className="btn btn-ghost" onClick={() => setPhoto("")}>
                {m.diary.remove}
              </button>
            ) : null}
          </div>
          <button type="button" className="btn w-full" disabled={busy} onClick={() => void requestBody("prompt")}>
            {busy ? m.diary.writing : m.diary.write}
          </button>
        </div>
        {error ? <p className="text-sm text-stamp">{error}</p> : null}
      </div>

      <div className="space-y-6">
        {groups.map(([date, list]) => (
          <div key={date}>
            <h2 className="display text-2xl">{date === today ? m.diary.today : date}</h2>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {list.map((entry) => (
                <article key={entry.id} className="polaroid relative">
                  <p className="stamp">{entry.source === "auto" ? m.diary.auto : m.diary.prompted}</p>
                  {editingId === entry.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea className="field min-h-28" value={draft} onChange={(e) => setDraft(e.target.value)} />
                      <button type="button" className="btn w-full" onClick={() => void saveEdit(entry.id)}>
                        {m.diary.save}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mt-3 block w-full text-left text-sm leading-7"
                      onClick={() => { setEditingId(entry.id); setDraft(entry.body); }}
                    >
                      {entry.body}
                      {entry.edited ? <span className="mt-2 block text-xs text-mute">{m.diary.edited}</span> : null}
                    </button>
                  )}
                  {entry.photo ? <img src={entry.photo} alt="" className="mt-3 aspect-[4/3] w-full rounded-lg object-cover" /> : null}
                  {entry.imageUrl ? (
                    <div className="mt-3">
                      <img src={entry.imageUrl} alt="" className="aspect-[3/4] w-full rounded-lg object-cover" />
                      {entry.mock ? <p className="stamp mt-2">未接模型</p> : null}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="btn mt-3 w-full"
                    disabled={Boolean(imageBusy) || !pet?.photos.length}
                    onClick={() => void illustrate(entry)}
                  >
                    {imageBusy === entry.id ? m.diary.drawing : entry.imageUrl ? m.diary.redraw : m.diary.draw}
                  </button>
                </article>
              ))}
            </div>
          </div>
        ))}
        {!entries.length && busy ? <p className="text-sm text-mute">{m.diary.drafting}</p> : null}
      </div>
    </section>
  );
}

function groupByDate(entries: DiaryEntry[]): Array<[string, DiaryEntry[]]> {
  const map = new Map<string, DiaryEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.date) ?? [];
    list.push(entry);
    map.set(entry.date, list);
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export function DiaryHome() {
  return (
    <Suspense fallback={<p className="text-sm text-mute">…</p>}>
      <DiaryInner />
    </Suspense>
  );
}
