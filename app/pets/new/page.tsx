"use client";

import { PetForm } from "@/components/pet-form";
import { useI18n } from "@/components/locale-provider";

export default function NewPetPage() {
  const { m } = useI18n();
  return (
    <section>
      <p className="mb-4 text-sm text-mute">{m.pets.newHint}</p>
      <PetForm />
    </section>
  );
}
