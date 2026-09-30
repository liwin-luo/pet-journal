// 上传页 → 锚点页的参考图。sessionStorage 扛刷新；内存扛配额不够的情况。
let mem: string[] = [];

export function setRefs(urls: string[]) {
  mem = urls;
  try { sessionStorage.setItem("petpics_refs", JSON.stringify(urls)); } catch { /* 配额满时只留内存 */ }
}

export function getRefs(): string[] {
  if (mem.length) return mem;
  try {
    const raw = sessionStorage.getItem("petpics_refs");
    if (raw) mem = JSON.parse(raw);
  } catch { /* 忽略坏数据 */ }
  return mem;
}
