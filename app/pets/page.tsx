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

  if (pets === null) return <p className="text-sm text-[#6b5a4a]">翻开册子…</p>;

  if (!pets.length) {
    return (
      <section className="relative mt-6">
        <div className="polaroid relative">
          <span className="tape" />
          <div className="flex aspect-[3/4] flex-col items-center justify-center bg-[#f3e6d4] text-center">
            <p className="display text-4xl">册子还是空的</p>
            <p className="mt-3 max-w-[14rem] text-sm text-[#6b5a4a]">先把家里那只的名字、爱好和一张正面照收进来。</p>
          </div>
        </div>
        <Link href="/pets/new" className="btn mt-6 w-full">添加第一只宠物</Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b5a4a]">{pets.length} 只在册</p>
        <Link href="/pets/new" className="text-sm underline decoration-[#c23b22] underline-offset-4">
          再加一只
        </Link>
      </div>
      {pets.map((pet, index) => (
        <article key={pet.id} className="polaroid relative" style={{ transform: `rotate(${index % 2 ? 1.2 : -1}deg)` }}>
          <span className="tape" />
          <Link href={`/pets/${pet.id}`}>
            {pet.photos[0] ? (
              <img src={pet.photos[0]} alt={pet.name} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center bg-[#f3e6d4]">{pet.name}</div>
            )}
          </Link>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="display text-2xl leading-none">{pet.name}</h2>
              <p className="mt-1 text-xs text-[#6b5a4a]">
                {SPECIES_LABEL[pet.species]}
                {pet.breed ? ` · ${pet.breed}` : ""}
                {pet.sex ? ` · ${SEX_LABEL[pet.sex]}` : ""}
                {pet.age ? ` · ${AGE_LABEL[pet.age]}` : ""}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/?pet=${pet.id}`} className="underline underline-offset-4">日记</Link>
              <Link href={`/create?pet=${pet.id}`} className="underline underline-offset-4">出图</Link>
              <button type="button" className="text-[#c23b22]" onClick={() => void remove(pet.id)}>
                移出
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
