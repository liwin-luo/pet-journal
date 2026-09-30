// 内容审核（MVP：关键词黑名单 + 长度限制）。上线后可换成模型审核接口。
const BLOCKLIST = [
  // 露骨/暴力
  /\b(porn|pornographic|nsfw|nude|naked|sex|sexual|erotic|hentai)\b/i,
  /\b(kill|killing|murder|behead|torture|gore|blood\s*pour)\b/i,
  /\b(child|kid|baby|toddler|infant|human|person|woman|man|girl|boy)\s+(nude|naked|sexual|sexy)\b/i,
  // 把人当主体（产品只做宠物）
  /\b(portrait\s+of\s+(a|my)\s+(human|person|child|kid|baby)\b)/i,
  // 名人/商标风险
  /\b(taylor\s*swift|trump|biden|putin|messi|ronaldo|disney|marvel|pokemon|nintendo)\b/i,
  // 毒品武器
  /\b(swastika|nazi|kkk|meth|cocaine|heroin)\b/i,
];

export function checkMessage(raw: unknown): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof raw !== "string") return { ok: false, reason: "Message must be text" };
  const text = raw.trim().slice(0, 800);
  for (const re of BLOCKLIST) {
    if (re.test(text)) return { ok: false, reason: "This request isn't something we can make. Keep it about your pet!" };
  }
  return { ok: true, text };
}

export function checkGalleryText(raw: unknown): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof raw !== "string") return { ok: true, text: "" };
  const text = raw.trim().slice(0, 600);
  for (const re of BLOCKLIST) {
    if (re.test(text)) return { ok: false, reason: "Review contains words we can't publish." };
  }
  return { ok: true, text };
}
