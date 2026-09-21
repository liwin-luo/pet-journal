"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AGE_LABEL, SEX_LABEL, SPECIES_LABEL, type Pet } from "@/lib/types";

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[] | null>(null);

  async function refresh() {
    const res = await fetch("/api/pets");
    const data = (await res.json()) as { pets?: Pet[] };
    setPets(data.pets ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function remove(id: string) {
    await fetch(`/api/pets/${id}`, { method: "DELETE" });
    await refresh();
  }

  if (pets === null) return <p className="text-sm text-mute">翻开册子…</p>;

  if (!pets.length) {
    return (
      <section className="card mx-auto max-w-md p-8 text-center">
        <p className="display text-3xl">册子还是空的</p>
        <p className="mt-3 text-sm text-mute">先把家里那只的名字、爱好和一张正面照收进来。</p>
        <Link href="/pets/new" className="btn mt-6 w-full sm:w-auto">添加第一只宠物</Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">{pets.length} 只在册</p>
        <Link href="/pets/new" className="btn">再加一只</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pets.map((pet) => (
          <article key={pet.id} className="card overflow-hidden">
            <Link href={`/pets/${pet.id}`}>
              {pet.photos[0] ? (
                <img src={pet.photos[0]} alt={pet.name} className="aspect-[4/5] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-paper">{pet.name}</div>
              )}
            </Link>
            <div className="flex items-end justify-between gap-3 p-4">
              <div>
                <h2 className="display text-2xl leading-none">{pet.name}</h2>
                <p className="mt-1 text-xs text-mute">
                  {SPECIES_LABEL[pet.species]}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                  {pet.sex ? ` · ${SEX_LABEL[pet.sex]}` : ""}
                  {pet.age ? ` · ${AGE_LABEL[pet.age]}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 text-sm">
                <Link href={`/?pet=${pet.id}`} className="underline underline-offset-4">日记</Link>
                <Link href={`/create?pet=${pet.id}`} className="underline underline-offset-4">出图</Link>
                <button type="button" className="text-stamp" onClick={() => void remove(pet.id)}>
                  移出
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
