"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/locale-provider";
import { fill } from "@/lib/i18n.ts";
import { readImageAsDataUrl } from "@/lib/image";
import { emptyPet } from "@/lib/pets";
import {
  TRAIT_OPTIONS,
  type Age,
  type Friend,
  type Pet,
  type Relation,
  type Sex,
  type Species,
} from "@/lib/types";

export function PetForm({ petId }: { petId?: string }) {
  const { m } = useI18n();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [ready, setReady] = useState(false);
  const [others, setOthers] = useState<Pet[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/pets");
      const data = (await res.json()) as { pets?: Pet[] };
      const list = data.pets ?? [];
      setOthers(list.filter((item) => item.id !== petId));
      if (petId) {
        setPet(list.find((item) => item.id === petId) ?? null);
      } else {
        setPet(emptyPet());
      }
      setReady(true);
    })();
  }, [petId]);

  function patch(partial: Partial<Pet>) {
    setPet((current) => (current ? { ...current, ...partial } : current));
  }

  async function onPhotos(files: FileList | null) {
    if (!files?.length) return;
    const extras: string[] = [];
    for (const file of Array.from(files)) extras.push(await readImageAsDataUrl(file));
    setPet((now) => (now ? { ...now, photos: [...now.photos, ...extras].slice(0, 4) } : now));
  }

  async function onFriendPhoto(file: File | undefined) {
    if (!file) return;
    const photo = await readImageAsDataUrl(file);
    const friend: Friend = {
      id: crypto.randomUUID(),
      kind: "photo",
      name: "好朋友",
      photo,
      relation: "playmate",
    };
    setPet((now) => (now ? { ...now, friends: [...now.friends, friend] } : now));
  }

  function addPetFriend(otherId: string) {
    const other = others.find((item) => item.id === otherId);
    if (!other) return;
    setPet((now) => {
      if (!now || now.friends.some((friend) => friend.petId === other.id)) return now;
      return {
        ...now,
        friends: [
          ...now.friends,
          {
            id: crypto.randomUUID(),
            kind: "pet",
            petId: other.id,
            name: other.name,
            species: other.species,
            relation: "playmate",
          },
        ],
      };
    });
  }

  async function save() {
    if (!pet) return;
    if (!pet.name.trim()) {
      setError("先起个名字");
      return;
    }
    if (pet.photos.length < 1) {
      setError("至少一张正面参考图");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(petId ? `/api/pets/${pet.id}` : "/api/pets", {
      method: petId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet),
    });
    setSaving(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "没存上");
      return;
    }
    router.push(petId ? "/pets" : "/today");
  }

  if (!ready) return <p className="text-sm text-mute">{m.pets.opening}</p>;
  if (!pet) return <p className="text-sm text-mute">{m.form.missing}</p>;

  return (
    <div className="card space-y-5 p-5 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-5 md:space-y-0">
      <Field label={m.form.name}>
        <input className="field" value={pet.name} onChange={(e) => patch({ name: e.target.value })} placeholder="豆豆" />
      </Field>
      <Field label={m.form.species}>
        <Row>
          {(Object.keys(m.labels.species) as Species[]).map((value) => (
            <Chip key={value} on={pet.species === value} onClick={() => patch({ species: value })}>
              {m.labels.species[value]}
            </Chip>
          ))}
        </Row>
      </Field>
      <Field label={m.form.breed}>
        <input className="field" value={pet.breed ?? ""} onChange={(e) => patch({ breed: e.target.value })} placeholder={m.form.breedPh} />
      </Field>
      <Field label={m.form.sex}>
        <Row>
          {(Object.keys(m.labels.sex) as Sex[]).map((value) => (
            <Chip key={value} on={pet.sex === value} onClick={() => patch({ sex: pet.sex === value ? undefined : value })}>
              {m.labels.sex[value]}
            </Chip>
          ))}
        </Row>
      </Field>
      <Field label={m.form.age}>
        <Row>
          {(Object.keys(m.labels.age) as Age[]).map((value) => (
            <Chip key={value} on={pet.age === value} onClick={() => patch({ age: pet.age === value ? undefined : value })}>
              {m.labels.age[value]}
            </Chip>
          ))}
        </Row>
      </Field>
      <Field label={m.form.traits}>
        <Row>
          {TRAIT_OPTIONS.map((trait) => {
            const on = pet.traits.includes(trait);
            return (
              <Chip
                key={trait}
                on={on}
                onClick={() => {
                  if (on) patch({ traits: pet.traits.filter((item) => item !== trait) });
                  else if (pet.traits.length < 3) patch({ traits: [...pet.traits, trait] });
                }}
              >
                {trait}
              </Chip>
            );
          })}
        </Row>
      </Field>
      <Field label={m.form.hobbies}>
        <input className="field" value={pet.hobbies ?? ""} onChange={(e) => patch({ hobbies: e.target.value })} placeholder={m.form.hobbiesPh} />
      </Field>
      <Field label={m.form.toys}>
        <input className="field" value={pet.toys ?? ""} onChange={(e) => patch({ toys: e.target.value })} placeholder={m.form.toysPh} />
      </Field>
      <Field label={m.form.food}>
        <input className="field" value={pet.food ?? ""} onChange={(e) => patch({ food: e.target.value })} placeholder={m.form.foodPh} />
      </Field>
      <Field label={m.form.catchphrase}>
        <input className="field" value={pet.catchphrase ?? ""} onChange={(e) => patch({ catchphrase: e.target.value })} placeholder={m.form.catchphrasePh} />
      </Field>
      <Field label={fill(m.form.photos, { n: pet.photos.length })} wide>
        <div className="grid grid-cols-4 gap-2">
          {pet.photos.map((src, index) => (
            <button
              key={`${src.slice(0, 24)}-${index}`}
              type="button"
              className="overflow-hidden rounded-xl"
              onClick={() => patch({ photos: pet.photos.filter((_, i) => i !== index) })}
            >
              <img src={src} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
          {pet.photos.length < 4 ? (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-line bg-canvas text-xs text-mute">
              {m.form.addPhoto}
              <input type="file" accept="image/*" hidden multiple onChange={(e) => void onPhotos(e.target.files)} />
            </label>
          ) : null}
        </div>
      </Field>
      <Field label={m.form.friends} wide>
        {others.length ? (
          <select className="field mb-2" defaultValue="" onChange={(e) => { if (e.target.value) addPetFriend(e.target.value); e.target.value = ""; }}>
            <option value="">{m.form.pickFriend}</option>
            {others.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        ) : (
          <p className="mb-2 text-xs text-mute">{m.form.noSecond}</p>
        )}
        <label className="btn btn-ghost mb-3 w-full text-sm sm:w-auto">
          {m.form.uploadFriend}
          <input type="file" accept="image/*" hidden onChange={(e) => void onFriendPhoto(e.target.files?.[0])} />
        </label>
        <div className="space-y-2">
          {pet.friends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-2 rounded-xl border border-line bg-canvas p-2">
              {friend.kind === "photo" && friend.photo ? (
                <img src={friend.photo} alt="" className="h-12 w-12 object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center bg-[#f3e6d4] text-xs">{friend.name.slice(0, 1)}</div>
              )}
              <input
                className="field"
                value={friend.name}
                onChange={(e) =>
                  patch({
                    friends: pet.friends.map((item) => (item.id === friend.id ? { ...item, name: e.target.value } : item)),
                  })
                }
              />
              <select
                className="field w-24"
                value={friend.relation}
                onChange={(e) =>
                  patch({
                    friends: pet.friends.map((item) =>
                      item.id === friend.id ? { ...item, relation: e.target.value as Relation } : item,
                    ),
                  })
                }
              >
                {(Object.keys(m.labels.relation) as Relation[]).map((value) => (
                  <option key={value} value={value}>{m.labels.relation[value]}</option>
                ))}
              </select>
              <button type="button" className="text-xs text-stamp" onClick={() => patch({ friends: pet.friends.filter((item) => item.id !== friend.id) })}>
                {m.form.del}
              </button>
            </div>
          ))}
        </div>
      </Field>
      {error ? <p className="text-sm text-stamp md:col-span-2">{error}</p> : null}
      <div className="md:col-span-2">
        <button type="button" className="btn w-full sm:w-auto" disabled={saving} onClick={() => void save()}>
          {saving ? m.form.saving : m.form.save}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`space-y-2${wide ? " md:col-span-2" : ""}`}>
      <p className="text-xs tracking-wide text-mute">{label}</p>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="chip" data-on={on} onClick={onClick}>
      {children}
    </button>
  );
}
