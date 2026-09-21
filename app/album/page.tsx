"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { findTemplate } from "@/lib/templates";
import type { Shot } from "@/lib/types";

export default function AlbumPage() {
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

  if (shots === null) return <p className="text-sm text-mute">翻相册…</p>;

  if (!shots.length) {
    return (
      <section className="card mx-auto max-w-md p-8 text-center">
        <p className="display text-3xl">相册还没第一张</p>
        <p className="mt-2 text-sm text-mute">写完日记配图，或去出一张模板图。</p>
        <Link href="/" className="btn mt-6 w-full sm:w-auto">回今天</Link>
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
              const label = shot.source === "diary" ? "日记" : (template?.title ?? shot.templateId);
              return (
                <article key={shot.id} className="card overflow-hidden p-3">
                  <img src={shot.imageUrl} alt="" className="aspect-[3/4] w-full rounded-xl object-cover" />
                  <p className="mt-2 text-xs text-mute">
                    {label}
                    {shot.friendName ? ` · ${shot.friendName}` : ""}
                    {shot.mock ? " · 占位" : ""}
                  </p>
                  <div className="mt-2 flex justify-between text-xs">
                    <a href={shot.imageUrl} download>下载</a>
                    {shot.source === "template" ? (
                      <Link href={`/create?pet=${shot.petId}&template=${shot.templateId}${shot.friendId ? `&friend=${shot.friendId}` : ""}`}>
                        同模板再来一张
                      </Link>
                    ) : (
                      <Link href={`/?pet=${shot.petId}`}>回日记</Link>
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
