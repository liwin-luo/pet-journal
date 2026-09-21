import Link from "next/link";
import { DiaryHome } from "@/components/diary-home";
import { listPets } from "@/lib/db/pets.ts";
import { t } from "@/lib/i18n.ts";
import { readLocale } from "@/lib/locale.ts";
import { requireUserId } from "@/lib/session.ts";

export default async function DiaryPage() {
  const m = t(await readLocale());
  const session = await requireUserId();
  if (!session.ok) {
    return (
      <section className="card mx-auto mt-8 max-w-md p-8 text-center">
        <p className="display text-3xl">{m.common.needLogin}</p>
        <Link href="/login" className="btn mt-6 w-full sm:w-auto">{m.common.goGoogle}</Link>
      </section>
    );
  }
  let pets;
  try {
    pets = await listPets(session.userId);
  } catch (cause) {
    console.error("listPets failed", cause);
    return (
      <section className="card mx-auto mt-8 max-w-md p-8 text-center">
        <p className="display text-3xl">{m.common.dbDown}</p>
        <p className="mt-2 text-sm text-mute">{m.common.dbDownHint}</p>
      </section>
    );
  }
  if (!pets.length) {
    return (
      <section className="card mx-auto mt-8 max-w-md p-8 text-center">
        <p className="display text-3xl">{m.diary.emptyTitle}</p>
        <p className="mt-2 text-sm text-mute">{m.diary.emptyBody}</p>
        <Link href="/pets/new" className="btn mt-6 w-full sm:w-auto">{m.common.goNewPet}</Link>
      </section>
    );
  }
  return <DiaryHome />;
}
