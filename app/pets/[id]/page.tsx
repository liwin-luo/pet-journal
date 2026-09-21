"use client";

import { useParams } from "next/navigation";
import { PetForm } from "@/components/pet-form";

export default function EditPetPage() {
  const params = useParams<{ id: string }>();
  return (
    <section>
      <p className="mb-4 text-sm text-[#6b5a4a]">改档案会影响下一张图，已经生成的不会变。</p>
      <PetForm petId={params.id} />
    </section>
  );
}
