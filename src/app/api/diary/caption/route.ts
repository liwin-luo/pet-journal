import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { captionBrief, fallbackCaption, listWorks, parseCaption } from "@/lib/diary";
import { textProvider } from "@/lib/engine";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import { getDeviceId, getSubjectId } from "@/lib/ratelimit";
import { getDiaryText, getPetProfile, saveDiaryText } from "@/lib/store";
import type { DiaryWork } from "@/lib/diary-shared";

export const runtime = "nodejs";
export const maxDuration = 120;

type ReqEntry = { date?: unknown; tokens?: unknown };

/** 补写日记文案：body = { lang, entries: [{date, tokens}] }，一次最多 10 天。 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { entries?: ReqEntry[]; lang?: unknown } | null;
  const lang =
    typeof body?.lang === "string" && (LOCALES as readonly string[]).includes(body.lang) ? body.lang : DEFAULT_LOCALE;
  const entries = (Array.isArray(body?.entries) ? body!.entries.slice(0, 10) : [])
    .map((e) => ({
      date: typeof e.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : "",
      // share token 是 12 位 hex（generate/route.ts 里 UUID 去横线截断）
      tokens: Array.isArray(e.tokens)
        ? e.tokens.filter((x): x is string => typeof x === "string" && /^[a-f0-9]{12}$/.test(x)).slice(0, 8)
        : [],
    }))
    .filter((e) => e.date && e.tokens.length);
  if (!entries.length) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  const ownerKey = await getSubjectId();
  const byToken = new Map((await listWorks({ email: user?.email ?? null, deviceId })).map((w) => [w.token, w]));
  const pet = await getPetProfile(ownerKey);

  // 生成并行（互不依赖），落库串行（updateDb 整文档读改写，并行会丢更新）
  const results = await Promise.all(
    entries.map(async (e) => {
      const cached = await getDiaryText(ownerKey, e.date, lang);
      if (cached) return { date: e.date, title: cached.title, text: cached.text, save: false };
      // 只认主人自己的 token——别人的 token 静默丢弃，不产出文案
      const works = e.tokens.map((t) => byToken.get(t)).filter((w): w is DiaryWork => !!w);
      if (!works.length) return { date: e.date, title: "", text: "", save: false };
      let entry: { title: string; text: string };
      try {
        entry = parseCaption(await textProvider().chat(captionBrief({ date: e.date, lang, pet, works })));
      } catch {
        entry = fallbackCaption({ works });
      }
      return { date: e.date, ...entry, save: true };
    }),
  );
  for (const r of results) {
    if (r.save) await saveDiaryText(ownerKey, r.date, lang, { title: r.title, text: r.text });
  }
  return NextResponse.json({ entries: results.map(({ save, ...e }) => e) });
}
