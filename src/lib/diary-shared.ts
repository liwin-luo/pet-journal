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
