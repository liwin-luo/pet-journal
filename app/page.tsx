import Link from "next/link";
import { DiaryHome } from "@/components/diary-home";
import { listPets } from "@/lib/db/pets.ts";
import { requireUserId } from "@/lib/session.ts";

export default async function DiaryPage() {
  const session = await requireUserId();
  if (!session.ok) {
    return (
      <section className="mt-8 text-center">
        <p className="display text-3xl">先登录</p>
        <Link href="/login" className="btn mt-6 w-full">用 Google 继续</Link>
      </section>
    );
  }
  const pets = await listPets(session.userId);
  if (!pets.length) {
    return (
      <section className="mt-8 text-center">
        <p className="display text-3xl">还没人可写</p>
        <p className="mt-2 text-sm text-[#6b5a4a]">先收一只宠物，打开今天会自动起草。</p>
        <Link href="/pets/new" className="btn mt-6 w-full">去建档</Link>
      </section>
    );
  }
  return <DiaryHome />;
}
