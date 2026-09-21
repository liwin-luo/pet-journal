"use client";

import { useParams } from "next/navigation";
import { PetForm } from "@/components/pet-form";
import { useI18n } from "@/components/locale-provider";

export default function EditPetPage() {
  const params = useParams<{ id: string }>();
  const { m } = useI18n();
  return (
    <section>
      <p className="mb-4 text-sm text-mute">{m.pets.editHint}</p>
      <PetForm petId={params.id} />
    </section>
  );
}
