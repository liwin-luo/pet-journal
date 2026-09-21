"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/locale-provider";
import { fill } from "@/lib/i18n.ts";
import type { Pet } from "@/lib/types";

export default function PetsPage() {
  const { m } = useI18n();
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

  if (pets === null) return <p className="text-sm text-mute">{m.pets.opening}</p>;

  if (!pets.length) {
    return (
      <section className="card mx-auto max-w-md p-8 text-center">
        <p className="display text-3xl">{m.pets.emptyTitle}</p>
        <p className="mt-3 text-sm text-mute">{m.pets.emptyBody}</p>
        <Link href="/pets/new" className="btn mt-6 w-full sm:w-auto">{m.pets.addFirst}</Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">{fill(m.pets.count, { n: pets.length })}</p>
        <Link href="/pets/new" className="btn">{m.pets.addAnother}</Link>
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
                  {m.labels.species[pet.species]}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                  {pet.sex ? ` · ${m.labels.sex[pet.sex]}` : ""}
                  {pet.age ? ` · ${m.labels.age[pet.age]}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 text-sm">
                <Link href={`/today?pet=${pet.id}`} className="underline underline-offset-4">{m.pets.diary}</Link>
                <Link href={`/create?pet=${pet.id}`} className="underline underline-offset-4">{m.pets.create}</Link>
                <button type="button" className="text-stamp" onClick={() => void remove(pet.id)}>
                  {m.pets.remove}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
