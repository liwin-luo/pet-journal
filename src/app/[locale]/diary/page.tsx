import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { DiaryView } from "@/components/DiaryView";
import { getSessionUser } from "@/lib/auth";
import { listWorks } from "@/lib/diary";
import { getDict, isLocale, lp, type Locale } from "@/lib/i18n";
import { getSubjectId } from "@/lib/ratelimit";
import { pageMeta } from "@/lib/seo";
import { getPetProfile } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const t = getDict(raw as Locale);
  return pageMeta({ locale: raw as Locale, path: "/diary", title: t.diary.title, noindex: true });
}

/** 宠物日记：日历/时间线/日记本三种视图回看生成历史（私人页，noindex）。 */
export default async function DiaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const user = await getSessionUser().catch(() => null);
  const jar = await cookies().catch(() => null);
  const deviceId = jar?.get("paw_device")?.value ?? null;
  const works = await listWorks({ email: user?.email ?? null, deviceId });
  const pet = await getPetProfile(await getSubjectId());

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="h-display text-4xl">{t.diary.title}</h1>
      <p className="mt-2 text-sm text-coffee">{t.diary.subtitle}</p>
      <DiaryView locale={locale} t={t} createPath={`${lp(locale, "/")}#create`} works={works} pet0={pet} />
    </div>
  );
}
