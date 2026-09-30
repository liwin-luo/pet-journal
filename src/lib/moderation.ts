import { textProvider } from "./engine";

// 内容审核，两层：
// 1) 关键词黑名单（快、零成本，拦截露骨/暴力/歧视/名人商标等）
// 2) GLM 语义门控（拦截"不是给宠物做图"的诉求 + 黑名单漏掉的违规内容）
//    配了 TEXT_API_KEY 才启用；语义门控失败时宁可拒绝（fail-closed）。

const BLOCKLIST = [
  // 露骨/性内容
  /\b(porn|pornographic|nsfw|nude|naked|sex|sexual|erotic|hentai|fetish|nsfw\s+art)\b/i,
  // 暴力/血腥/虐待
  /\b(kill|killing|murder|behead|torture|gore|mutilat|animal\s+abuse|animal\s+cruelty)\b/i,
  // 歧视/仇恨
  /\b(nazi|swastika|kkk|white\s*power|master\s*race|racial\s+slur)\b/i,
  // 违法
  /\b(meth|cocaine|heroin|fentanyl|bomb\s+making|weapon\s+making)\b/i,
  // 名人/商标/版权角色（人物主体本身就不允许）
  /\b(taylor\s*swift|trump|biden|putin|messi|ronaldo|disney|marvel|pokemon|nintendo)\b/i,
  // 把人当主体（产品只做宠物）
  /\b(portrait\s+of\s+(a|my|the)\s+(human|person|child|kid|baby)\b)/i,
  /\b(human|person|woman|man|girl|boy)\s+(nude|naked|sexual|sexy)\b/i,
];

export function checkMessage(raw: unknown): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof raw !== "string") return { ok: false, reason: "Message must be text" };
  const text = raw.trim().slice(0, 800);
  for (const re of BLOCKLIST) {
    if (re.test(text)) return { ok: false, reason: BLOCKED_REASON };
  }
  return { ok: true, text };
}

export const BLOCKED_REASON =
  "This request isn't something we can make. We only paint pets — keep it kind, safe, and about your animal!";

export function checkGalleryText(raw: unknown): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof raw !== "string") return { ok: true, text: "" };
  const text = raw.trim().slice(0, 600);
  for (const re of BLOCKLIST) {
    if (re.test(text)) return { ok: false, reason: "Review contains words we can't publish." };
  }
  return { ok: true, text };
}

// ===== 语义门控 =====

const GATE_BRIEF = [
  "You are the safety and topic gatekeeper of a service that turns pet photos into AI artwork.",
  "The user sends a request, usually about their pet. Decide whether to allow it.",
  "",
  "ALLOW only if the request asks for a picture / artwork of an ANIMAL (a pet: cat, dog, bird, fish, rabbit, hamster, horse, etc.), in any style, scene, outfit or occasion.",
  "",
  "REJECT (allowed=false) if:",
  "- the main subject is a human / person / celebrity / fictional human character (even together with a pet)",
  "- the request is NOT about creating an image of an animal (objects, landscapes, logos, memes with big text, essays, questions, other services)",
  "- sexual, pornographic or fetish content of any kind",
  "- hateful, discriminatory or demeaning content (race, religion, gender, disability, nationality)",
  "- violence, gore, animal abuse, or anything illegal",
  "- real brands, trademarks, or copyrighted characters",
  "",
  'Reply with JSON only: {"allowed":true} or {"allowed":false,"reason":"<one short friendly sentence>"}',
  "",
  `User request:`,
].join("\n");

export type GateResult = { ok: true } | { ok: false; reason: string };

/**
 * 语义门控：非宠物诉求与违规内容都拒绝。
 * 未配 TEXT_API_KEY（本地 Mock 开发）时跳过；模型调用失败时 fail-closed。
 */
export async function gateRequest(message: string): Promise<GateResult> {
  if (!message.trim()) return { ok: true };
  if (!process.env.TEXT_API_KEY?.trim()) return { ok: true }; // Mock 开发模式，仅关键词层
  try {
    const raw = await textProvider().chat(`${GATE_BRIEF}\n${message.trim().slice(0, 800)}`);
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start < 0 || end <= start) throw new Error("gate: no JSON");
    const json = JSON.parse(raw.slice(start, end + 1)) as { allowed?: unknown; reason?: unknown };
    if (json.allowed === true) return { ok: true };
    const reason = typeof json.reason === "string" && json.reason.trim() ? json.reason.trim().slice(0, 160) : BLOCKED_REASON;
    return { ok: false, reason };
  } catch {
    // 语义门控失效时不能放行
    return { ok: false, reason: "We couldn't check your request just now. Please try again in a moment." };
  }
}

if (process.env.MOD_CHECK) {
  if (checkMessage("nude photo").ok) throw new Error("blocklist miss");
  if (checkMessage("my cat as a knight").ok === false) throw new Error("false positive");
}
