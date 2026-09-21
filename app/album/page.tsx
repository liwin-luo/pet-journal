"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/locale-provider";
import { findTemplate } from "@/lib/templates";
import type { Shot } from "@/lib/types";

export default function AlbumPage() {
  const { m } = useI18n();
  const [shots, setShots] = useState<Shot[] | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/images");
      const data = (await res.json()) as { shots?: Shot[] };
      setShots(data.shots ?? []);
    })();
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, Shot[]>();
    for (const shot of shots ?? []) {
      const list = map.get(shot.petId) ?? [];
      list.push(shot);
      map.set(shot.petId, list);
    }
    return [...map.entries()];
  }, [shots]);

  if (shots === null) return <p className="text-sm text-mute">{m.album.opening}</p>;

  if (!shots.length) {
    return (
      <section className="card mx-auto max-w-md p-8 text-center">
        <p className="display text-3xl">{m.album.emptyTitle}</p>
        <p className="mt-2 text-sm text-mute">{m.album.emptyBody}</p>
        <Link href="/today" className="btn mt-6 w-full sm:w-auto">{m.album.back}</Link>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {groups.map(([petId, list]) => (
        <div key={petId}>
          <h2 className="display text-2xl">{list[0]?.petName}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {list.map((shot) => {
              const template = findTemplate(shot.templateId);
              const label = shot.source === "diary"
                ? m.album.diaryShot
                : (template ? m.templates[template.id].title : shot.templateId);
              return (
                <article key={shot.id} className="card overflow-hidden p-3">
                  <img src={shot.imageUrl} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
                  <p className="mt-2 text-xs text-mute">
                    {label}
                    {shot.friendName ? ` · ${shot.friendName}` : ""}
                    {shot.mock ? ` · ${m.album.mock}` : ""}
                  </p>
                  <div className="mt-2 flex justify-between text-xs">
                    <a href={shot.imageUrl} download>{m.album.download}</a>
                    {shot.source === "template" ? (
                      <Link href={`/create?pet=${shot.petId}&template=${shot.templateId}${shot.friendId ? `&friend=${shot.friendId}` : ""}`}>
                        {m.album.again}
                      </Link>
                    ) : (
                      <Link href={`/today?pet=${shot.petId}`}>{m.album.toDiary}</Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
