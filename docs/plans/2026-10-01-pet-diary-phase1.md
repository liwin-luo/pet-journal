# 宠物日记 Phase 1（单宠物日记）实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** 给 PetsDaily 增加 `/diary` 页面——把主人的全部生成记录按"天"归组，用日历 / 时间线 / 日记本三种视图回看，每天配一篇 GLM 以宠物第一人称写的日记，外加一份轻量宠物档案（名字/物种/头像）。

**Architecture:** 不动生成主链路。作品查询走新函数 `listWorks`（绕开 `listHistory` 的 24 条截断）；按本地时区的"归日"放在客户端做（SSR 时区不可靠）；日记文案按需惰性生成（`POST /api/diary/caption`，按 `主人|日期|语言` 键永久缓存）；宠物档案与文案缓存挂在现有 `pd_state` JSON 文档的两个新键上，双模式存储自动兼容。客户端组件只 import 纯函数文件 `diary-shared.ts`（否则 `node:fs` 会进客户端 bundle 导致构建失败）。

**Tech Stack:** Next.js 15 App Router / React 19 / TypeScript / Tailwind v4（tokens: cream/parchment/sand/ink/coffee/fog/coral/coral-soft/sage/sage-soft/gold）/ pg（无 ORM）/ 智谱 GLM（`textProvider()`）。

**约定：**

- 本项目**没有测试框架**（scripts 只有 dev/build/lint）。验证手段 = `npx tsc --noEmit`（类型）、`npm run build`（构建 + Next 自带类型检查）、纯函数用 `DIARY_CHECK=1` 顶层自检（对齐 `src/lib/engine/plan.ts:55` 的 `PLAN_CHECK` 惯例，`next build` 收集页面数据时会执行模块顶层代码）、API 用 curl 打本地 dev server、页面用浏览器人工过一遍。
- 每个任务结束 commit 到 main（本仓库直接提交 main 是既有习惯）。开始前确认工作区干净：`git status`。
- 本地 `.env.local` 已配 `TEXT_API_KEY`（真实 GLM）和 `ARK_API_KEY`（真实 Seedream）。本地 `.data/db.json` 目前不存在（无历史数据）。要看到"有内容的日记"，先用首页真实生成 1–2 张（花额度），或临时 `.env.local` 里设 `IMAGE_PROVIDER=mock` 走免费占位图。

---

## 关键现状（零上下文速览）

- 生成记录类型 `Share`：`{ token(12位hex), image("/api/media/{uuid}"), templateId?, message(用户原话), prompt(英文成图提示词), createdAt(UTC ISO), deviceId?, email? }`，全部存在 `pd_state('main')` JSON 文档的 `shares` dict 里（`src/lib/store.ts:10-20`）。
- 主人归属：登录按邮箱（HMAC cookie `paw_session`），匿名按设备 cookie `paw_device`。`getSubjectId()` 返回 `"u:{email}"` 或 `"d:{deviceId}"`（`src/lib/ratelimit.ts:25`）。
- `mockChat.chat()` 会直接 throw（`src/lib/engine/mock.ts:32`）——**日记文案必须有无 AI 时的降级**。
- `listHistory` 截断 24 条（`src/lib/history.ts:19`），不能改它（account/library 在用），日记另开全量查询。
- 图片出口 `/api/media/{id}` 对生成图有下载门控：登录或设备 cookie 匹配放行——日记页展示主人自己的图**无需新鉴权**。
- i18n：`Dict = typeof en`（`src/lib/i18n.ts:49`），10 个 dict JSON **必须同步加键**，缺键 `npm run build` 直接类型报错。en 无 URL 前缀，其他语言 `/xx` 前缀，`lp(locale, path)` 生成链接。
- 已知限制（接受，Phase 2 再正规化）：`pd_state` 整文档读改写，多实例并发下低频写有丢更新风险；日记文案是低频 + 幂等（可重生成），风险可接受。任务 5 中生成并行、落库串行，就是为了把窗口压到最小。

## 数据模型（本计划新增）

```ts
// 挂到 Db（src/lib/store.ts）的两个新键，key 设计：
// pets["u:a@b.c" 或 "d:deviceid"]                => PetProfile
// diary["u:a@b.c|2026-10-01|en"]                 => DiaryText
type PetProfile = { name: string; species: string; avatar?: string; updatedAt: string };
type DiaryText  = { title: string; text: string; lang: string; createdAt: string };
```

---

### Task 1: 存储层——`Db` 扩展 + 宠物档案/文案读写

**Files:**
- Modify: `src/lib/store.ts`

**Step 1: 加类型与 EMPTY**

在 `GalleryEntry` 类型后（`store.ts:35` 附近）追加：

```ts
/** 宠物档案（Phase 1：每主人一份）。avatar 取自主人某张作品的 /api/media/ 地址。 */
export type PetProfile = {
  name: string;
  species: string;
  avatar?: string;
  updatedAt: string;
};

/** 一天的日记文案（按 主人|日期|语言 缓存，生成后不再变）。 */
export type DiaryText = {
  title: string;
  text: string;
  lang: string;
  createdAt: string;
};
```

`Db` 类型（`store.ts:38`）与 `EMPTY`（`store.ts:45`）改为：

```ts
type Db = {
  shares: Record<string, Share>;
  gallery: GalleryEntry[];
  usage: Record<string, { date: string; count: number }>;
  likes: Record<string, LikeRec>;
  pets: Record<string, PetProfile>; // key = ownerKey（"u:email" / "d:deviceid"）
  diary: Record<string, DiaryText>; // key = `${ownerKey}|${YYYY-MM-DD}|${lang}`
};

const EMPTY: Db = { shares: {}, gallery: [], usage: {}, likes: {}, pets: {}, diary: {} };
```

旧数据兼容：`pgLoad`/`fileLoad` 都用 `{ ...structuredClone(EMPTY), ...旧文档 }` 合并（`store.ts:95`、`store.ts:116`），旧文档没有 `pets`/`diary` 键会自动补空对象，无需迁移。

**Step 2: 加 4 个读写函数**

在 `getLikeSnapshot` 之后（`store.ts:183` 后）、"每日额度"分节注释前插入：

```ts
// ===== 宠物日记 =====

export async function getPetProfile(ownerKey: string): Promise<PetProfile | null> {
  const db = await readDb();
  return db.pets[ownerKey] ?? null;
}

export async function savePetProfile(
  ownerKey: string,
  pet: { name: string; species: string; avatar?: string },
): Promise<PetProfile> {
  return updateDb((db) => {
    const rec: PetProfile = { ...pet, updatedAt: new Date().toISOString() };
    db.pets[ownerKey] = rec;
    return rec;
  });
}

export async function getDiaryText(ownerKey: string, date: string, lang: string): Promise<DiaryText | null> {
  const db = await readDb();
  return db.diary[`${ownerKey}|${date}|${lang}`] ?? null;
}

export async function saveDiaryText(
  ownerKey: string,
  date: string,
  lang: string,
  entry: { title: string; text: string },
): Promise<DiaryText> {
  return updateDb((db) => {
    const rec: DiaryText = { ...entry, lang, createdAt: new Date().toISOString() };
    db.diary[`${ownerKey}|${date}|${lang}`] = rec;
    return rec;
  });
}
```

**Step 3: 验证**

Run: `npx tsc --noEmit`
Expected: 无错误（新增键暂时无人消费，不应有任何报错）。

**Step 4: Commit**

```bash
git add src/lib/store.ts
git commit -m "feat: 存储层支持宠物档案与日记文案缓存（pets/diary 键）"
```

---

### Task 2: 业务层——纯函数（归日/月矩阵/文案）+ 全量作品查询

**Files:**
- Create: `src/lib/diary-shared.ts`（纯函数，客户端可安全 import）
- Create: `src/lib/diary.ts`（服务端：读库 + 文案 brief/解析/降级）

**Step 1: 写 `src/lib/diary-shared.ts`（完整文件）**

为什么拆两个文件：`DiaryView` 客户端组件只需要归日/月矩阵这几个纯函数；如果它们和 `readDb`（`node:fs`/`pg`）同文件，客户端组件会把 `node:fs` 拉进 bundle，构建直接失败。

```ts
// 客户端可安全 import 的日记纯函数（绝不 import store/node:fs，见 DiaryView）。

export type DiaryWork = {
  token: string;
  image: string;
  message: string;
  prompt: string;
  templateId?: string;
  createdAt: string;
};

export type DayGroup = { date: string; works: DiaryWork[] }; // date = 浏览者本地时区 YYYY-MM-DD

/** 按浏览者本地时区归日，最新在前。只许在客户端 mount 后调用（SSR 时区不同会 hydration mismatch）。 */
export function groupByLocalDay(works: DiaryWork[]): DayGroup[] {
  const byDay = new Map<string, DiaryWork[]>();
  for (const w of works) {
    const d = new Date(w.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const list = byDay.get(key);
    if (list) list.push(w);
    else byDay.set(key, [w]);
  }
  return [...byDay.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, ws]) => ({ date, works: ws }));
}

/** 某月周矩阵（周日起），格子是 YYYY-MM-DD，首尾用 null 补整周。month0 = 0-11。 */
export function monthMatrix(year: number, month0: number): (string | null)[][] {
  const first = new Date(year, month0, 1);
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: first.getDay() }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${year}-${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

if (process.env.DIARY_CHECK) {
  const works = [
    { token: "b", image: "/api/media/b", message: "astronaut", prompt: "cat astronaut", createdAt: "2026-10-02T12:00:00.000Z" },
    { token: "a", image: "/api/media/a", message: "royal king", prompt: "regal cat", createdAt: "2026-10-01T12:00:00.000Z" },
  ];
  const days = groupByLocalDay(works);
  if (days.length !== 2 || days[0].date !== "2026-10-02" || days[1].works[0]?.token !== "a") throw new Error("diary group");
  const m = monthMatrix(2026, 9);
  // 1 号必须落在它自己的星期几列上；10 月必须 31 个日期格
  if (m.flat().indexOf("2026-10-01") !== new Date(2026, 9, 1).getDay()) throw new Error("diary matrix");
  if (m.flat().filter(Boolean).length !== 31 || m.some((w) => w.length !== 7)) throw new Error("diary matrix shape");
}
```

**Step 2: 写 `src/lib/diary.ts`（完整文件）**

```ts
import { DEFAULT_LOCALE, LOCALE_META, type Locale } from "./i18n";
import { readDb } from "./store";
import type { DiaryWork, PetProfile } from "./diary-shared";

/** 日记用全量作品（不分页不截断）：登录按账号，匿名按设备。最新在前。 */
export async function listWorks(opts: { email?: string | null; deviceId?: string | null }): Promise<DiaryWork[]> {
  const db = await readDb();
  return Object.values(db.shares)
    .filter((s) => (opts.email ? s.email === opts.email : false) || (s.deviceId && s.deviceId === opts.deviceId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => ({
      token: s.token,
      image: s.image,
      message: s.message,
      prompt: s.prompt,
      templateId: s.templateId,
      createdAt: s.createdAt,
    }));
}

// ===== 日记文案（GLM，一天一篇，宠物第一人称）=====

/** locale → 语言名，喂给模型指定书写语言（LOCALE_META 的 label 本身就是语言名）。 */
export function langName(locale: string): string {
  return LOCALE_META[locale as Locale]?.label ?? "English";
}

export type CaptionInput = {
  date: string;
  lang: string;
  pet?: Pick<PetProfile, "name" | "species"> | null;
  works: { message: string; prompt: string }[];
};

export function captionBrief(input: CaptionInput): string {
  const name = input.pet?.name?.trim() || "my pet";
  const species = input.pet?.species?.trim() || "pet";
  const pics = input.works
    .slice(0, 8)
    .map(
      (w, i) =>
        `${i + 1}. Request: ${w.message.trim().slice(0, 150) || "(none)"} / Art direction: ${w.prompt.trim().slice(0, 180) || "(none)"}`,
    )
    .join("\n");
  return [
    `You write one diary entry in the voice of the user's pet, about ${input.date}.`,
    "",
    `The pet: ${name}, a ${species}.`,
    `Today the owner made ${input.works.length} AI portrait(s) of the pet at a portrait studio. Each portrait is one little "adventure":`,
    pics,
    "",
    "Rules:",
    '- First person: the pet is speaking ("I"). Warm, playful, a little dramatic.',
    `- Weave today's portraits into one short diary entry about the day, written in ${langName(input.lang)}.`,
    "- Title: at most 6 words. Body: 40-90 words, 1-3 short paragraphs, no lists.",
    '- Reply with JSON only: {"title":"...","text":"..."}',
  ].join("\n");
}

export function parseCaption(raw: string): { title: string; text: string } {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("模型没有返回日记");
  const json = JSON.parse(raw.slice(start, end + 1)) as { title?: unknown; text?: unknown };
  const title = typeof json.title === "string" ? json.title.trim().slice(0, 80) : "";
  const text = typeof json.text === "string" ? json.text.trim().slice(0, 1200) : "";
  if (!title || !text) throw new Error("日记字段缺失");
  return { title, text };
}

/** 没有文本模型（mock 抛错）或解析失败时的降级：英文模板，保证不为空。 */
export function fallbackCaption(input: { works: { message: string }[] }): { title: string; text: string } {
  const n = input.works.length;
  const first = input.works[0]?.message?.trim();
  const theme = first ? ` Today's theme: "${first.slice(0, 80)}".` : "";
  return {
    title: n > 1 ? `${n} portraits in one day` : "A portrait kind of day",
    text: `Today my human dressed me up for ${n === 1 ? "a brand-new portrait" : `${n} brand-new portraits`}.${theme} I stayed very dignified. There were treats. It was a good day.`,
  };
}

if (process.env.DIARY_CHECK) {
  const works = [
    { message: "royal king portrait", prompt: "a regal cat wearing a crown, oil painting" },
    { message: "astronaut", prompt: "a cat astronaut floating in space" },
  ];
  const brief = captionBrief({ date: "2026-10-01", lang: "en", pet: { name: "Mochi", species: "cat" }, works });
  if (!brief.includes("Mochi") || !brief.includes("astronaut") || !brief.includes("2026-10-01")) throw new Error("diary brief");
  const cap = parseCaption('```json\n{"title":"King for a day","text":"I wore the crown."}\n```');
  if (cap.title !== "King for a day" || !cap.text.includes("crown")) throw new Error("diary parse");
  let threw = false;
  try {
    parseCaption("no json here");
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("diary parse guard");
  if (langName("zh") !== "中文" || langName("xx") !== "English" || langName(DEFAULT_LOCALE) !== "English") throw new Error("diary lang");
  const fb = fallbackCaption({ works });
  if (!fb.title || !fb.text.includes("2")) throw new Error("diary fallback");
}
```

**Step 3: 验证（自检在构建期执行）**

Run: `DIARY_CHECK=1 npm run build`
Expected: 构建成功。若自检抛错，构建会在收集页面数据阶段失败并显示 `Error: diary ...`。

**Step 4: Commit**

```bash
git add src/lib/diary-shared.ts src/lib/diary.ts
git commit -m "feat: 日记业务层——全量作品查询、本地时区归日、GLM 日记文案（含降级与自检）"
```

---

### Task 3: `GET /api/diary`（作品 + 档案）

**Files:**
- Create: `src/app/api/diary/route.ts`

**Step 1: 完整文件**

```ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listWorks } from "@/lib/diary";
import { getDeviceId, getSubjectId } from "@/lib/ratelimit";
import { getPetProfile } from "@/lib/store";

export const runtime = "nodejs";

/** 日记数据：主人全量作品 + 宠物档案。文案按需走 POST /api/diary/caption。 */
export async function GET() {
  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  const works = await listWorks({ email: user?.email ?? null, deviceId });
  const pet = await getPetProfile(await getSubjectId());
  return NextResponse.json({ works, pet });
}
```

**Step 2: 验证**

起 dev server（另一个终端 `npm run dev`），然后：

Run: `curl -s http://localhost:3000/api/diary | head -c 300`
Expected: `{"works":[...],"pet":null}`（本地无历史数据则 `works:[]`，同样算通过）。

**Step 3: Commit**

```bash
git add src/app/api/diary/route.ts
git commit -m "feat: GET /api/diary 返回主人全量作品与宠物档案"
```

---

### Task 4: `PUT /api/diary/pet`（保存档案）

**Files:**
- Create: `src/app/api/diary/pet/route.ts`

**Step 1: 完整文件**

```ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listWorks } from "@/lib/diary";
import { getDeviceId, getSubjectId } from "@/lib/ratelimit";
import { savePetProfile } from "@/lib/store";

export const runtime = "nodejs";

/** 保存宠物档案。头像必须选自主人自己的作品（防跨用户引用）。 */
export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; species?: unknown; avatar?: unknown }
    | null;
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "";
  const species = typeof body?.species === "string" ? body.species.trim().slice(0, 30) : "";
  if (!name) return NextResponse.json({ error: "Pet name is required" }, { status: 400 });

  const deviceId = await getDeviceId();
  const user = await getSessionUser().catch(() => null);
  // 与 getSubjectId 同构，但这里已持有 email/deviceId，省一次会话解析
  const ownerKey = user ? `u:${user.email}` : `d:${deviceId}`;

  let avatar: string | undefined;
  if (typeof body?.avatar === "string" && /^\/api\/media\/[0-9a-f-]{36}$/i.test(body.avatar)) {
    const mine = await listWorks({ email: user?.email ?? null, deviceId });
    if (mine.some((w) => w.image === body.avatar)) avatar = body.avatar;
  }

  const pet = await savePetProfile(ownerKey, { name, species, avatar });
  return NextResponse.json({ pet });
}
```

注意：这里**不能**用 `getSubjectId()` 替代手写 ownerKey——`listWorks` 需要 email 与 deviceId 两个原始值做归属过滤，`getSubjectId()` 只给回拼好的 key。

**Step 2: 验证**

Run: `curl -s -X PUT http://localhost:3000/api/diary/pet -H 'Content-Type: application/json' -d '{"name":"Mochi","species":"cat"}'`
Expected: `{"pet":{"name":"Mochi","species":"cat","updatedAt":"..."}}`；再 `curl -s http://localhost:3000/api/diary | head -c 200` 应看到 `"pet":{"name":"Mochi"...}`（同一浏览器 cookie）。
Run: `curl -s -X PUT http://localhost:3000/api/diary/pet -H 'Content-Type: application/json' -d '{}' -o /dev/null -w '%{http_code}'`
Expected: `400`。

**Step 3: Commit**

```bash
git add src/app/api/diary/pet/route.ts
git commit -m "feat: PUT /api/diary/pet 保存宠物档案（头像限主人自有作品）"
```

---

### Task 5: `POST /api/diary/caption`（惰性补写文案，缓存优先）

**Files:**
- Create: `src/app/api/diary/caption/route.ts`

**Step 1: 完整文件**

设计要点：一天一篇；命中缓存直接回（重复查看零成本）；未命中的并行调 GLM（单天失败降级英文模板）；**落库串行**——`updateDb` 是整文档读改写，并行写会互相覆盖丢数据（文件模式有锁，PG 模式没有）。

```ts
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
```

**Step 2: 验证（需要 Task 3/4 的接口 + 有至少一张作品）**

先确认有作品：`curl -s http://localhost:3000/api/diary | python3 -m json.tool | head`。若 `works` 为空，先在首页真实生成一张（或临时 `IMAGE_PROVIDER=mock` 后生成一张，记得改回来）。

```bash
# 用第一条作品的 createdAt 算本地日期，组一个 caption 请求
BODY=$(curl -s http://localhost:3000/api/diary | python3 -c "
import sys, json, datetime
w = json.load(sys.stdin)['works'][0]
day = datetime.datetime.fromisoformat(w['createdAt'].replace('Z', '+00:00')).astimezone()
print(json.dumps({'lang': 'en', 'entries': [{'date': day.strftime('%Y-%m-%d'), 'tokens': [w['token']]}]}))
")
curl -s -X POST http://localhost:3000/api/diary/caption -H 'Content-Type: application/json' -d "$BODY"
```

Expected: `{"entries":[{"date":"...","title":"...","text":"..."}]}`，文案是宠物口吻英文（本地 `TEXT_API_KEY` 已配，走真实 GLM）。
Run: 立刻原样再发一次同样的请求，响应应完全相同且明显更快（缓存命中，不再调 GLM）。
Run: 把 body 里的 token 改成 `ffffffffffffffffffff`（12 位但不属于主人）再发：
Expected: `{"entries":[{"date":"...","title":"","text":""}]}`（静默丢弃，不报错）。

**Step 3: Commit**

```bash
git add src/app/api/diary/caption/route.ts
git commit -m "feat: POST /api/diary/caption 惰性补写每日日记文案（缓存优先、并行生成串行落库）"
```

---

### Task 6: i18n——10 个语言字典加 `diary` 段 + 2 个入口键

**Files:**
- Modify: `src/lib/i18n/dicts/en.json`、`zh.json`、`es.json`、`pt.json`、`de.json`、`fr.json`、`it.json`、`ja.json`、`ru.json`、`ko.json`

每个文件做两处修改：
1. 在 `"acct"` 对象里加 `"myDiary"`；在 `"lib"` 对象里加 `"viewDiary"`。
2. 在文件末尾（最后一个键之后）加 `"diary"` 对象。

**`en.json` 的 `acct.myDiary` = `"Pet diary"`，`lib.viewDiary` = `"View as diary"`，diary 段：**

```json
"diary": {
  "title": "Pet Diary",
  "subtitle": "Every portrait is a day in their life",
  "tabCalendar": "Calendar",
  "tabTimeline": "Timeline",
  "tabBook": "Diary book",
  "empty": "The diary is empty — create your first portrait and the story begins.",
  "create": "Create a portrait",
  "setupTitle": "Who is this diary about?",
  "petNamePh": "e.g. Mochi",
  "petSpeciesPh": "cat, dog, rabbit…",
  "petAvatar": "Avatar (pick a portrait)",
  "petSave": "Save",
  "petEdit": "Edit",
  "writing": "Writing the entry…",
  "picsCount": "{count} pictures",
  "picCount": "1 picture",
  "prev": "Previous",
  "next": "Next"
}
```

**`zh.json`：** `acct.myDiary` = `"宠物日记"`，`lib.viewDiary` = `"以日记查看"`，diary 段：

```json
"diary": {
  "title": "宠物日记",
  "subtitle": "每一张画像，都是它生命里的一天",
  "tabCalendar": "日历",
  "tabTimeline": "时间线",
  "tabBook": "日记本",
  "empty": "日记还是空的——创建第一张画像，故事就开始了。",
  "create": "去创作画像",
  "setupTitle": "这本日记的主角是谁？",
  "petNamePh": "例如：年糕",
  "petSpeciesPh": "猫、狗、兔子…",
  "petAvatar": "头像（选一张画像）",
  "petSave": "保存",
  "petEdit": "编辑",
  "writing": "正在写今天的日记…",
  "picsCount": "{count} 张照片",
  "picCount": "1 张照片",
  "prev": "前一天",
  "next": "后一天"
}
```

**其余 8 个语言，`diary` 段如下（`acct.myDiary` / `lib.viewDiary` 跟随各语言 diar­y.title / "以日记查看" 的对应译法）：**

`es.json`（myDiary `"Diario de la mascota"` / viewDiary `"Ver como diario"`）：

```json
"diary": {
  "title": "Diario de tu mascota",
  "subtitle": "Cada retrato es un día de su vida",
  "tabCalendar": "Calendario",
  "tabTimeline": "Cronología",
  "tabBook": "Diario",
  "empty": "El diario está vacío: crea tu primer retrato y empieza la historia.",
  "create": "Crear un retrato",
  "setupTitle": "¿De quién es este diario?",
  "petNamePh": "p. ej. Mochi",
  "petSpeciesPh": "gato, perro, conejo…",
  "petAvatar": "Avatar (elige un retrato)",
  "petSave": "Guardar",
  "petEdit": "Editar",
  "writing": "Escribiendo la entrada…",
  "picsCount": "{count} fotos",
  "picCount": "1 foto",
  "prev": "Anterior",
  "next": "Siguiente"
}
```

`pt.json`（`"Diário do pet"` / `"Ver como diário"`）：

```json
"diary": {
  "title": "Diário do pet",
  "subtitle": "Cada retrato é um dia da vida dele",
  "tabCalendar": "Calendário",
  "tabTimeline": "Linha do tempo",
  "tabBook": "Diário",
  "empty": "O diário está vazio — crie o primeiro retrato e a história começa.",
  "create": "Criar um retrato",
  "setupTitle": "De quem é este diário?",
  "petNamePh": "ex.: Mochi",
  "petSpeciesPh": "gato, cachorro, coelho…",
  "petAvatar": "Avatar (escolha um retrato)",
  "petSave": "Salvar",
  "petEdit": "Editar",
  "writing": "Escrevendo a entrada…",
  "picsCount": "{count} fotos",
  "picCount": "1 foto",
  "prev": "Anterior",
  "next": "Próximo"
}
```

`de.json`（`"Haustier-Tagebuch"` / `"Als Tagebuch ansehen"`）：

```json
"diary": {
  "title": "Haustier-Tagebuch",
  "subtitle": "Jedes Porträt ist ein Tag in seinem Leben",
  "tabCalendar": "Kalender",
  "tabTimeline": "Zeitstrahl",
  "tabBook": "Tagebuch",
  "empty": "Das Tagebuch ist leer – erschaffe dein erstes Porträt und die Geschichte beginnt.",
  "create": "Porträt erstellen",
  "setupTitle": "Für wen ist dieses Tagebuch?",
  "petNamePh": "z. B. Mochi",
  "petSpeciesPh": "Katze, Hund, Kaninchen…",
  "petAvatar": "Avatar (Porträt auswählen)",
  "petSave": "Speichern",
  "petEdit": "Bearbeiten",
  "writing": "Eintrag wird geschrieben…",
  "picsCount": "{count} Bilder",
  "picCount": "1 Bild",
  "prev": "Zurück",
  "next": "Weiter"
}
```

`fr.json`（`"Journal de l'animal"` / `"Voir en journal"`）：

```json
"diary": {
  "title": "Journal de votre animal",
  "subtitle": "Chaque portrait est une journée de sa vie",
  "tabCalendar": "Calendrier",
  "tabTimeline": "Chronologie",
  "tabBook": "Journal",
  "empty": "Le journal est vide — créez votre premier portrait et l'histoire commence.",
  "create": "Créer un portrait",
  "setupTitle": "À qui est ce journal ?",
  "petNamePh": "ex. Mochi",
  "petSpeciesPh": "chat, chien, lapin…",
  "petAvatar": "Avatar (choisir un portrait)",
  "petSave": "Enregistrer",
  "petEdit": "Modifier",
  "writing": "Rédaction de l'entrée…",
  "picsCount": "{count} photos",
  "picCount": "1 photo",
  "prev": "Précédent",
  "next": "Suivant"
}
```

`it.json`（`"Diario dell'animale"` / `"Vedi come diario"`）：

```json
"diary": {
  "title": "Diario del tuo animale",
  "subtitle": "Ogni ritratto è un giorno della sua vita",
  "tabCalendar": "Calendario",
  "tabTimeline": "Timeline",
  "tabBook": "Diario",
  "empty": "Il diario è vuoto: crea il tuo primo ritratto e la storia inizia.",
  "create": "Crea un ritratto",
  "setupTitle": "Di chi è questo diario?",
  "petNamePh": "es. Mochi",
  "petSpeciesPh": "gatto, cane, coniglio…",
  "petAvatar": "Avatar (scegli un ritratto)",
  "petSave": "Salva",
  "petEdit": "Modifica",
  "writing": "Scrittura della voce…",
  "picsCount": "{count} foto",
  "picCount": "1 foto",
  "prev": "Precedente",
  "next": "Successivo"
}
```

`ja.json`（`"ペット日記"` / `"日記で見る"`）：

```json
"diary": {
  "title": "ペット日記",
  "subtitle": "肖像画はどれも、この子の一日です",
  "tabCalendar": "カレンダー",
  "tabTimeline": "タイムライン",
  "tabBook": "日記帳",
  "empty": "日記はまだ空です。最初の肖像画を作ると、物語が始まります。",
  "create": "肖像画を作る",
  "setupTitle": "誰の日記にしますか？",
  "petNamePh": "例：モチ",
  "petSpeciesPh": "猫、犬、うさぎ…",
  "petAvatar": "アイコン（肖像画を選択）",
  "petSave": "保存",
  "petEdit": "編集",
  "writing": "日記を書いています…",
  "picsCount": "写真 {count} 枚",
  "picCount": "写真 1 枚",
  "prev": "前へ",
  "next": "次へ"
}
```

`ru.json`（`"Дневник питомца"` / `"Открыть как дневник"`）：

```json
"diary": {
  "title": "Дневник питомца",
  "subtitle": "Каждый портрет — один день его жизни",
  "tabCalendar": "Календарь",
  "tabTimeline": "Хроника",
  "tabBook": "Дневник",
  "empty": "Дневник пуст — создайте первый портрет, и история начнётся.",
  "create": "Создать портрет",
  "setupTitle": "О ком этот дневник?",
  "petNamePh": "напр. Моти",
  "petSpeciesPh": "кот, собака, кролик…",
  "petAvatar": "Аватар (выберите портрет)",
  "petSave": "Сохранить",
  "petEdit": "Изменить",
  "writing": "Пишем запись…",
  "picsCount": "{count} фото",
  "picCount": "1 фото",
  "prev": "Назад",
  "next": "Вперёд"
}
```

`ko.json`（`"반려동물 일기"` / `"일기로 보기"`）：

```json
"diary": {
  "title": "반려동물 일기",
  "subtitle": "모든 초상화는 아이의 하루입니다",
  "tabCalendar": "달력",
  "tabTimeline": "타임라인",
  "tabBook": "일기장",
  "empty": "일기가 아직 비어 있어요. 첫 초상화를 만들면 이야기가 시작됩니다.",
  "create": "초상화 만들기",
  "setupTitle": "누구의 일기인가요?",
  "petNamePh": "예: 모찌",
  "petSpeciesPh": "고양이, 강아지, 토끼…",
  "petAvatar": "아바타 (초상화 선택)",
  "petSave": "저장",
  "petEdit": "편집",
  "writing": "일기를 쓰고 있어요…",
  "picsCount": "사진 {count}장",
  "picCount": "사진 1장",
  "prev": "이전",
  "next": "다음"
}
```

注意：`petName` / `petSpecies` 输入框的 aria-label 直接复用 `setupTitle` 所在卡片里已有的占位符方案——label 用 `d.petNamePh` 不可行，最终组件里 aria-label 用 `d.setupTitle` + placeholder（见 Task 7），所以这里**不需要**单独的 label 键。

**Step 1: 验证**

Run: `npx tsc --noEmit`
Expected: 无错误。`Dict = typeof en` + `Record<Locale, Dict>` 会强制 10 个文件结构一致——漏一个文件/一个键都会在这里报错（这是本项目刻意的"类型即校验"）。

**Step 2: Commit**

```bash
git add src/lib/i18n/dicts/
git commit -m "feat: 10 语言字典新增宠物日记词条"
```

---

### Task 7: `DiaryView` 客户端组件（三视图 + 档案卡）

**Files:**
- Create: `src/components/DiaryView.tsx`

**Step 1: 完整文件**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { groupByLocalDay, monthMatrix, type DiaryWork } from "@/lib/diary-shared";
import type { PetProfile } from "@/lib/store";
import { type Dict, type Locale } from "@/lib/i18n";

type Caption = { title: string; text: string };
type View = "calendar" | "timeline" | "book";

type Props = {
  locale: Locale;
  t: Dict;
  createPath: string;
  works: DiaryWork[];
  pet0: PetProfile | null;
};

function dayLabel(date: string, locale: Locale): string {
  // 挂正午的时间戳，避免时区换档把日期挪一天
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric" });
}

/** 宠物日记：宠物档案卡 + 日历/时间线/日记本三视图。 */
export function DiaryView({ locale, t, createPath, works, pet0 }: Props) {
  const d = t.diary;
  const [pet, setPet] = useState(pet0);
  const [editing, setEditing] = useState(!pet0);
  const [view, setView] = useState<View>("calendar");
  // 本地时区归日只能在客户端算（SSR 时区不同会 hydration mismatch），mount 后再分组
  const [days, setDays] = useState<ReturnType<typeof groupByLocalDay> | null>(null);
  const [ym, setYm] = useState({ y: new Date().getFullYear(), m0: new Date().getMonth() });
  const [captions, setCaptions] = useState<Record<string, Caption>>({});
  const [bookDay, setBookDay] = useState<string | null>(null);
  const asked = useRef<Set<string>>(new Set());
  const [form, setForm] = useState({ name: pet0?.name ?? "", species: pet0?.species ?? "", avatar: pet0?.avatar });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDays(groupByLocalDay(works));
  }, [works]);

  const byDate = useMemo(() => new Map((days ?? []).map((x) => [x.date, x])), [days]);

  const monthDays = useMemo(() => {
    const prefix = `${ym.y}-${String(ym.m0 + 1).padStart(2, "0")}`;
    return (days ?? []).filter((x) => x.date.startsWith(prefix));
  }, [days, ym]);

  // 当月缺文案的日子批量补写（asked 防重发；服务端有永久缓存，重复请求免费）
  useEffect(() => {
    if (!monthDays.length) return;
    const missing = monthDays.filter((x) => !asked.current.has(x.date));
    if (!missing.length) return;
    missing.forEach((x) => asked.current.add(x.date));
    fetch("/api/diary/caption", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lang: locale,
        entries: missing.slice(0, 10).map((x) => ({ date: x.date, tokens: x.works.map((w) => w.token) })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { entries?: (Caption & { date: string })[] };
        setCaptions((prev) => {
          const next = { ...prev };
          for (const e of data.entries ?? []) if (e.text) next[e.date] = { title: e.title, text: e.text };
          return next;
        });
      })
      .catch(() => {});
  }, [monthDays, locale]);

  if (!days) return <div className="card mt-8 h-72 animate-pulse bg-parchment/60" />;

  if (!works.length) {
    return (
      <div className="card mt-8 p-10 text-center">
        <p className="text-sm text-coffee">{d.empty}</p>
        <Link href={createPath} className="btn-primary mt-5">{d.create}</Link>
      </div>
    );
  }

  const weeks = monthMatrix(ym.y, ym.m0);
  const monthLabel = new Date(ym.y, ym.m0, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
  const shiftMonth = (delta: number) => {
    const n = new Date(ym.y, ym.m0 + delta, 1);
    setYm({ y: n.getFullYear(), m0: n.getMonth() });
  };
  const openDay = (date: string) => {
    setBookDay(date);
    setView("book");
  };
  const bookIdx = bookDay ? days.findIndex((x) => x.date === bookDay) : -1;
  const bookCur = bookIdx >= 0 ? days[bookIdx] : days[0];
  const bookAt = (delta: number) => {
    const next = days[bookIdx + delta];
    if (next) setBookDay(next.date);
  };

  const savePet = async () => {
    if (!form.name.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/diary/pet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, species: form.species, avatar: form.avatar }),
      });
      if (res.ok) {
        const data = (await res.json()) as { pet: PetProfile };
        setPet(data.pet);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const dayImgs = (day: { works: DiaryWork[] }) => (
    <div className="flex items-start gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={day.works[0]!.image} alt={day.works[0]!.message || "Portrait"} className="aspect-[3/4] w-28 shrink-0 rounded-xl border border-sand object-cover sm:w-40" />
      {day.works.length > 1 && (
        <div className="flex flex-col gap-2">
          {day.works.slice(1, 4).map((w) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={w.token} src={w.image} alt={w.message || "Portrait"} className="h-12 w-12 rounded-lg border border-sand object-cover" />
          ))}
          {day.works.length > 4 && (
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-parchment text-xs font-semibold text-coffee">
              +{day.works.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const captionOf = (date: string) =>
    captions[date] ? (
      <>
        <p className="font-display text-lg font-semibold text-coral-deep">{captions[date]!.title}</p>
        <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-coffee">{captions[date]!.text}</p>
      </>
    ) : (
      <p className="text-sm text-fog">{d.writing}</p>
    );

  return (
    <div>
      {/* 宠物档案卡 */}
      {editing ? (
        <div className="card p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-fog">{d.setupTitle}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={d.petNamePh}
              aria-label={d.setupTitle}
              maxLength={40}
              className="w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm outline-none focus:border-coral"
            />
            <input
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
              placeholder={d.petSpeciesPh}
              aria-label={d.petSpeciesPh}
              maxLength={30}
              className="w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm outline-none focus:border-coral"
            />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-fog">{d.petAvatar}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {works.slice(0, 12).map((w) => (
              <button
                key={w.token}
                type="button"
                onClick={() => setForm({ ...form, avatar: form.avatar === w.image ? undefined : w.image })}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${form.avatar === w.image ? "border-coral" : "border-transparent hover:border-sand"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={w.image} alt="" className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {pet && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setForm({ name: pet.name, species: pet.species, avatar: pet.avatar });
                  setEditing(false);
                }}
              >
                {t.signout.cancel}
              </button>
            )}
            <button type="button" className="btn-primary" disabled={!form.name.trim() || saving} onClick={savePet}>
              {d.petSave}
            </button>
          </div>
        </div>
      ) : (
        <div className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pet?.avatar ?? works[0]!.image} alt={pet?.name ?? ""} className="h-14 w-14 rounded-full border border-sand object-cover" />
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold">{pet?.name ?? d.setupTitle}</p>
            {pet?.species && (
              <span className="mt-0.5 inline-block rounded-full bg-sage-soft px-2.5 py-0.5 text-[11px] font-semibold text-sage">{pet.species}</span>
            )}
          </div>
          <button type="button" onClick={() => setEditing(true)} className="btn-ghost ml-auto !px-4 !py-2 text-sm">
            {d.petEdit}
          </button>
        </div>
      )}

      {/* 视图切换 */}
      <div className="mt-6 flex gap-2" role="tablist" aria-label={d.title}>
        {(["calendar", "timeline", "book"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${view === v ? "bg-coral text-white" : "bg-parchment text-coffee transition-colors hover:text-coral"}`}
          >
            {v === "calendar" ? d.tabCalendar : v === "timeline" ? d.tabTimeline : d.tabBook}
          </button>
        ))}
      </div>

      {/* 日历 */}
      {view === "calendar" && (
        <div className="card mt-4 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label={d.prev} className="btn-ghost !px-3 !py-1.5">←</button>
            <p className="font-display text-lg font-semibold">{monthLabel}</p>
            <button type="button" onClick={() => shiftMonth(1)} aria-label={d.next} className="btn-ghost !px-3 !py-1.5">→</button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-fog">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i}>{new Date(2023, 0, 1 + i).toLocaleDateString(locale, { weekday: "short" })}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {weeks.flat().map((date, i) =>
              date === null ? (
                <span key={`pad${i}`} />
              ) : (
                <button
                  key={date}
                  type="button"
                  disabled={!byDate.has(date)}
                  onClick={() => openDay(date)}
                  className={`relative aspect-square rounded-lg border p-1.5 text-left transition-colors ${
                    byDate.has(date) ? "border-coral/40 bg-coral-soft/60 hover:border-coral" : "border-transparent text-fog"
                  }`}
                >
                  <span className="text-[11px] font-semibold">{Number(date.slice(8))}</span>
                  {byDate.has(date) && (
                    <span className="absolute inset-x-1.5 bottom-1.5 flex -space-x-1.5">
                      {byDate.get(date)!.works.slice(0, 3).map((w) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={w.token} src={w.image} alt="" className="h-5 w-5 rounded-full border border-white object-cover sm:h-6 sm:w-6" />
                      ))}
                    </span>
                  )}
                </button>
              ),
            )}
          </div>
          <p className="mt-3 text-center text-xs text-fog">{d.subtitle}</p>
        </div>
      )}

      {/* 时间线 */}
      {view === "timeline" && (
        <div className="mt-4 space-y-5">
          {days.map((day) => (
            <article key={day.date} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-sand/70 px-5 py-3">
                <h3 className="font-display font-semibold">{dayLabel(day.date, locale)}</h3>
                <span className="text-xs text-fog">
                  {(day.works.length === 1 ? d.picCount : d.picsCount).replace("{count}", String(day.works.length))}
                </span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-[176px_1fr]">
                {dayImgs(day)}
                <div>{captionOf(day.date)}</div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 日记本 */}
      {view === "book" && bookCur && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <button type="button" disabled={bookIdx >= days.length - 1} onClick={() => bookAt(1)} className="btn-ghost !px-4 !py-2 text-sm">
              ← {d.prev}
            </button>
            <p className="font-display font-semibold">{dayLabel(bookCur.date, locale)}</p>
            <button type="button" disabled={bookIdx <= 0} onClick={() => bookAt(-1)} className="btn-ghost !px-4 !py-2 text-sm">
              {d.next} →
            </button>
          </div>
          <div className="card mt-3 grid overflow-hidden sm:min-h-[420px] sm:grid-cols-2">
            <div className="bg-parchment p-4 sm:p-5">{dayImgs(bookCur)}</div>
            <div className="flex flex-col p-6 sm:p-8">
              {captionOf(bookCur.date)}
              <p className="mt-auto pt-6 text-xs text-fog">
                {pet?.name ? `${pet.name} · ` : ""}
                {bookCur.date}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

实现说明（执行时别丢）：
- `bookCur = days[0]` 兜底：日记本 tab 永远有内容；日历点某天 → `openDay` 跳到日记本并定位该天。
- 文案请求**不 abort**：切月后旧请求正常完成并写入 `captions`（按日期键，无害），服务端有缓存，多打几次免费。
- 所有 `<img>` 前保留 `eslint-disable-next-line @next/next/no-img-element`（与 Library 页同风格）。
- `dayImgs`/`captionOf` 是组件内普通函数（非组件），避免不必要的 remount。

**Step 2: 验证**

Run: `npx tsc --noEmit && npm run build`
Expected: 均通过（组件此时还没有被页面引用，build 不扫它也没关系，tsc 会查）。

**Step 3: Commit**

```bash
git add src/components/DiaryView.tsx
git commit -m "feat: DiaryView 三视图组件（日历/时间线/日记本）+ 宠物档案卡"
```

---

### Task 8: `/diary` 页面（服务端组件，noindex）

**Files:**
- Create: `src/app/[locale]/diary/page.tsx`

**Step 1: 完整文件**

```tsx
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
```

（`getSubjectId()` 在 RSC 里内部 `getDeviceId()` 写 cookie 会抛错但被其内部 catch 吞掉——Library 页 `getQuota(await getSubjectId())` 就是这么用的，属既有模式。）

**Step 2: 浏览器验证（dev server）**

Run: 打开 `http://localhost:3000/diary`（无历史数据时先去首页生成 1 张，或临时 `IMAGE_PROVIDER=mock` 生成 2 张同日作品，验证"同日多篇归组"）。
Expected:
- 无作品：空状态卡 + Create 按钮。
- 有作品：档案编辑卡自动展开（首次无档案）→ 填名字/物种保存 → 卡片变成头像+名字。
- 日历：当月格子里出现缩略图圆点，点有图日期跳日记本。
- 时间线：同一天多张归在一篇，文案从"Writing the entry…"变成真实日记（首次有 GLM 延迟，属预期）。
- 日记本：左右翻天，左图右文。
- 切语言到中文：界面文案变化，日记正文重新生成（`lang` 不同缓存不同，首次会再次请求 caption）。
- `curl -s http://localhost:3000/diary | grep -i noindex` 应命中（noindex 生效）。

**Step 3: Commit**

```bash
git add "src/app/[locale]/diary/page.tsx"
git commit -m "feat: /diary 宠物日记页（私人页 noindex，三视图）"
```

---

### Task 9: 三处入口（UserMenu / Library / Account）

**Files:**
- Modify: `src/components/icons.tsx`（加 BookIcon）
- Modify: `src/components/UserMenu.tsx`、`src/components/Header.tsx`
- Modify: `src/app/[locale]/library/page.tsx`、`src/app/[locale]/account/page.tsx`

**Step 1: `icons.tsx` 追加 BookIcon**（沿用 `type P` 与 `base`，Lucide book 线条风）：

```tsx
export function BookIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`} aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
```

**Step 2: `UserMenu.tsx`**

- `Texts` 类型加 `myDiary: string;`
- `Props` 加 `diaryPath: string;`，函数签名解构加 `diaryPath`
- import 里加 `BookIcon`：`import { BookIcon, PawIcon, SparkIcon } from "./icons";`
- "入口"区块（`{/* 入口 */}` 内、"My pictures" Link 之前）加：

```tsx
<Link href={diaryPath} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-coffee transition-colors hover:bg-parchment hover:text-coral">
  <BookIcon className="h-4 w-4 text-coral" /> {texts.myDiary}
</Link>
```

**Step 3: `Header.tsx`** —— `UserMenu` 调用处（`Header.tsx:30-38`）加 `diaryPath={lp(locale, "/diary")}`，`texts` 对象加 `myDiary: t.acct.myDiary`。

**Step 4: `library/page.tsx`** —— 头部按钮区（`library/page.tsx:44-46` 的 Create Link 旁）加：

```tsx
<Link href={lp(locale, "/diary")} className="btn-ghost !px-5 !py-2.5 text-sm">
  {t.lib.viewDiary}
</Link>
```

（外层是 `flex flex-wrap items-end justify-between gap-4`，两个按钮并排放进去即可；匿名设备访客靠这个入口进日记。）

**Step 5: `account/page.tsx`** —— "我的作品"区块头（`account/page.tsx:72-75`）改为：

```tsx
<div className="flex items-center justify-between">
  <h2 id="acct-pics" className="text-xs font-semibold uppercase tracking-wide text-fog">{t.acct.myPictures}</h2>
  <div className="flex items-center gap-4 text-xs font-semibold">
    <Link href={lp(locale, "/diary")} className="text-coral hover:underline">{t.acct.myDiary}</Link>
    <Link href={`${lp(locale, "/")}#create`} className="text-coral hover:underline">+ {t.nav.create}</Link>
  </div>
</div>
```

**Step 6: 验证**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: 全通过。浏览器：登录后顶栏头像下拉出现"Pet diary"入口；未登录带历史时 /library 页有"View as diary"按钮。

**Step 7: Commit**

```bash
git add src/components/icons.tsx src/components/UserMenu.tsx src/components/Header.tsx "src/app/[locale]/library/page.tsx" "src/app/[locale]/account/page.tsx"
git commit -m "feat: 日记入口——顶栏用户菜单、作品库、个人中心"
```

---

### Task 10: 全量验收 + README

**Step 1: 全量构建**

Run: `DIARY_CHECK=1 npm run build && npm run lint`
Expected: 全通过，无新的 lint 告警。

**Step 2: 人工 E2E 清单（dev server + 浏览器）**

1. 全新匿名访客（无痕窗口）访问 `/diary` → 空状态 + Create。
2. 生成 2 张同日作品（mock 或真实）→ 回 `/diary`：档案卡展开 → 保存"Mochi/cat"。
3. 日历当天有缩略图；点日期进日记本；翻前一天/后一天边界按钮正确禁用。
4. 时间线同日归组，文案出现（非空、第一人称）。
5. 刷新页面：文案秒出（缓存命中，Network 里 caption 请求响应极快）。
6. 切 zh：界面中文、正文重写为中文。
7. 登录另一账号（或另一无痕窗口）访问 `/diary` → 看不到前一个身份的作品与文案（归属隔离）。
8. `curl -s -X PUT .../api/diary/pet -d '{"name":""}'` → 400。
9. `/diary` 页面源码含 noindex。

**Step 3: README 补一句**（功能列表/概览处）：`宠物日记：日历/时间线/日记本三视图回看作品，AI 以宠物口吻写每日日记。`

**Step 4: Commit**

```bash
git add README.md
git commit -m "docs: README 补充宠物日记功能说明"
```

---

## 验收后遗留（Phase 2 候选，不在本计划）

- `pd_pets` / `pd_diary` 独立表（多实例并发写安全 + 按月 SQL 查询）；多宠物分册（Share 挂 petId）；生成时顺带预写当日文案；日记公开分享页（复用 `/share/[token]` 模式）；日记本导出长图。
