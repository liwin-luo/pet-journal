"use client";

import { PetForm } from "@/components/pet-form";

export default function NewPetPage() {
  return (
    <section>
      <p className="mb-4 text-sm text-mute">必填只有名字、物种和一张正面照。其余都是给生图用的。</p>
      <PetForm />
    </section>
  );
}
