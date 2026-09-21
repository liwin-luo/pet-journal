"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { resolveFriend } from "@/lib/pets";
import { TEMPLATES, findTemplate } from "@/lib/templates";
import { RELATION_LABEL, type Pet } from "@/lib/types";

function CreateInner() {
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

  if (!ready) return <p className="text-sm text-[#6b5a4a]">铺开相纸…</p>;

  if (!pets.length) {
    return (
      <section className="mt-8 text-center">
        <p className="display text-3xl">册子是空的</p>
        <p className="mt-2 text-sm text-[#6b5a4a]">先收一只宠物再来选模板。</p>
        <Link href="/pets/new" className="btn mt-6 w-full">去建档</Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <label className="block space-y-2">
        <span className="text-xs text-[#6b5a4a]">出镜的是</span>
        <select className="field" value={petId} onChange={(e) => { setPetId(e.target.value); setFriendId(""); setPreview(null); }}>
          {pets.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
      <label className="block space-y-2">
        <span className="text-xs text-[#6b5a4a]">带上朋友（可选，合影必选）</span>
        <select className="field" value={friendId} onChange={(e) => setFriendId(e.target.value)}>
          <option value="">这次不带</option>
          {(pet?.friends ?? []).map((friend) => (
            <option key={friend.id} value={friend.id}>
              {friend.name} · {RELATION_LABEL[friend.relation]}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => { setTemplateId(item.id); setPreview(null); }}
            className="polaroid relative text-left"
            style={{ outline: templateId === item.id ? "2px solid #2a2118" : undefined }}
          >
            <p className="display text-xl leading-none">{item.title}</p>
            <p className="mt-2 text-xs text-[#6b5a4a]">{item.blurb}</p>
          </button>
        ))}
      </div>
      {blocked ? <p className="text-sm text-[#c23b22]">合影要先选一位朋友</p> : null}
      {error ? <p className="text-sm text-[#c23b22]">{error}</p> : null}
      <button type="button" className="btn w-full" disabled={!template || busy || blocked} onClick={() => void generate()}>
        {busy ? "在暗房里…大约半分钟" : template ? `生成「${template.title}」` : "先点一个模板"}
      </button>
      {preview ? (
        <div id="result" className="polaroid relative">
          <span className="tape" />
          <img src={preview.url} alt="" className="aspect-[3/4] w-full object-cover" />
          {preview.mock ? <p className="stamp mt-3">未接模型</p> : null}
          <div className="mt-3 flex gap-3">
            <button type="button" className="btn flex-1" disabled={busy} onClick={() => void generate()}>再来一张</button>
            <Link href="/album" className="btn btn-ghost flex-1">去相册</Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#6b5a4a]">铺开相纸…</p>}>
      <CreateInner />
    </Suspense>
  );
}
