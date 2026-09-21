"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/locale-provider";
import { fill } from "@/lib/i18n.ts";
import { resolveFriend } from "@/lib/pets";
import { TEMPLATES, findTemplate } from "@/lib/templates";
import type { Pet } from "@/lib/types";

function CreateInner() {
  const { m } = useI18n();
  const search = useSearchParams();
  const [ready, setReady] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petId, setPetId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [templateId, setTemplateId] = useState(search.get("template") ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ url: string; mock: boolean } | null>(null);

  useEffect(() => {
    if (preview) document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [preview]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/pets");
      const data = (await res.json()) as { pets?: Pet[] };
      const list = data.pets ?? [];
      setPets(list);
      setPetId(search.get("pet") || list[0]?.id || "");
      setFriendId(search.get("friend") ?? "");
      setTemplateId(search.get("template") ?? "");
      setReady(true);
    })();
  }, [search]);

  const pet = useMemo(() => pets.find((item) => item.id === petId), [petId, pets]);
  const template = findTemplate(templateId);
  const resolved = pet ? resolveFriend(pet, friendId, pets) : undefined;
  const blocked = Boolean(template?.needsFriend && !resolved);

  async function generate() {
    if (!pet || !template || blocked) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet: { ...pet, id: pet.id },
          petId: pet.id,
          friend: resolved
            ? {
                id: resolved.friend.id,
                name: resolved.friend.name,
                species: resolved.species,
                relation: resolved.friend.relation,
                photos: resolved.photos,
              }
            : undefined,
          templateId: template.id,
        }),
      });
      const data = (await res.json()) as { imageUrl?: string; mock?: boolean; error?: string };
      if (!res.ok || !data.imageUrl) {
        setError(data.error || "出图失败，换模板或重试");
        return;
      }
      setPreview({ url: data.imageUrl, mock: Boolean(data.mock) });
    } catch {
      setError("出图失败，换模板或重试");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <p className="text-sm text-mute">{m.create.opening}</p>;

  if (!pets.length) {
    return (
      <section className="card mx-auto max-w-md p-8 text-center">
        <p className="display text-3xl">{m.create.emptyTitle}</p>
        <p className="mt-2 text-sm text-mute">{m.create.emptyBody}</p>
        <Link href="/pets/new" className="btn mt-6 w-full sm:w-auto">{m.common.goNewPet}</Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
      <div className="card space-y-4 p-5 lg:sticky lg:top-6">
        <label className="block space-y-2">
          <span className="text-xs text-mute">{m.create.who}</span>
          <select className="field" value={petId} onChange={(e) => { setPetId(e.target.value); setFriendId(""); setPreview(null); }}>
            {pets.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-xs text-mute">{m.create.friend}</span>
          <select className="field" value={friendId} onChange={(e) => setFriendId(e.target.value)}>
            <option value="">{m.create.noFriend}</option>
            {(pet?.friends ?? []).map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name} · {m.labels.relation[friend.relation]}
              </option>
            ))}
          </select>
        </label>
        {blocked ? <p className="text-sm text-stamp">{m.create.needFriend}</p> : null}
        {error ? <p className="text-sm text-stamp">{error}</p> : null}
        <button type="button" className="btn w-full" disabled={!template || busy || blocked} onClick={() => void generate()}>
          {busy ? m.create.busy : template ? fill(m.create.go, { title: m.templates[template.id].title }) : m.create.pick}
        </button>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {TEMPLATES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setTemplateId(item.id); setPreview(null); }}
              className="card p-4 text-left"
              style={{ outline: templateId === item.id ? "2px solid #3a2c22" : undefined }}
            >
              <p className="display text-xl leading-none">{m.templates[item.id].title}</p>
              <p className="mt-2 text-xs text-mute">{m.templates[item.id].blurb}</p>
            </button>
          ))}
        </div>
        {preview ? (
          <div id="result" className="card mx-auto max-w-md overflow-hidden p-4">
            <img src={preview.url} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
            {preview.mock ? <p className="stamp mt-3">{m.mock}</p> : null}
            <div className="mt-3 flex gap-3">
              <button type="button" className="btn flex-1" disabled={busy} onClick={() => void generate()}>{m.create.again}</button>
              <Link href="/album" className="btn btn-ghost flex-1">{m.create.album}</Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<p className="text-sm text-mute">…</p>}>
      <CreateInner />
    </Suspense>
  );
}
