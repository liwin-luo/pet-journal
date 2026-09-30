import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminActions } from "@/components/AdminActions";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { pendingGalleryEntries, readStoreFile } from "@/lib/store";
import { templateById } from "@/lib/templates";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  return pageMeta({ locale: raw as Locale, path: "/admin", noindex: true });
}

/** 管理页：?key=ADMIN_KEY 审核画廊投稿。图片在服务端读成 data-URL，绕开下载门控。 */
export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const { key } = await searchParams;
  const expected = process.env.ADMIN_KEY?.trim();
  const ok = !!expected && key === expected;

  if (!ok) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <form className="card p-6" method="get">
          <h1 className="h-display text-2xl">{t.admin.title}</h1>
          <p className="mt-2 text-sm text-coffee">{t.admin.enterKey}</p>
          <input name="key" type="password" className="mt-4 w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm outline-none focus:border-coral" autoFocus />
          <button className="btn-primary mt-3 w-full" type="submit">{t.admin.open}</button>
        </form>
      </div>
    );
  }

  const pending = await pendingGalleryEntries();
  const items = await Promise.all(
    pending.map(async (g) => {
      let src = g.image;
      if (g.image.startsWith("/api/media/")) {
        const mediaId = g.image.split("/").pop() ?? "";
        const file = (await readStoreFile("generated", mediaId)) ?? (await readStoreFile("uploads", mediaId));
        if (file) src = `data:${file.mime};base64,${file.bytes.toString("base64")}`;
      }
      return { entry: g, src, tplName: g.templateId ? templateById(g.templateId)?.name : undefined };
    }),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="h-display text-3xl">{t.admin.title}</h1>
      <p className="mt-2 text-sm text-coffee">
        {pending.length} {pending.length === 1 ? t.admin.sub : t.admin.sub}
      </p>
      {!items.length && <p className="mt-8 rounded-card bg-sage-soft px-4 py-3 text-sm text-sage">{t.admin.allClear}</p>}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {items.map(({ entry, src, tplName }) => (
          <article key={entry.id} className="card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Submission by ${entry.nickname}`} className="max-h-72 w-full object-contain bg-parchment/40" />
            <div className="p-4">
              <p className="text-sm font-semibold">
                {entry.nickname} · {entry.petName} <span className="font-normal text-fog">({entry.species}{tplName ? ` · ${tplName}` : ""})</span>
              </p>
              {entry.text && <p className="mt-1 text-sm text-coffee">“{entry.text}”</p>}
              <p className="mt-1 text-xs text-fog">{entry.rating ?? "-"}★ · {new Date(entry.createdAt).toLocaleString(locale)}</p>
              <AdminActions id={entry.id} texts={{ approve: t.admin.approve, remove: t.admin.remove }} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
