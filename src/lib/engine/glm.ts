import type { ChatProvider } from "./providers";

/** Mastra 的模型 id 是 custom/glm-5.3-flash，直连智谱只要斜杠后面那段。 */
export function glmModelId(raw: string): string {
  return raw.trim().replace(/^custom\//, "") || "glm-5.3-flash";
}

/** 智谱 GLM（与参考项目同接口）。 */
export const glm: ChatProvider = {
  name: "glm",
  async chat(prompt) {
    const key = process.env.TEXT_API_KEY?.trim();
    if (!key) throw new Error("TEXT_API_KEY is not set");
    const base = (process.env.TEXT_BASE_URL?.trim() || "https://open.bigmodel.cn/api/coding/paas/v4").replace(/\/$/, "");
    const model = glmModelId(process.env.TEXT_MODEL?.trim() || "glm-5.3-flash");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`GLM HTTP ${res.status}: ${text.slice(0, 240)}`);
    const content = (JSON.parse(text) as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content;
    if (!content?.trim()) throw new Error("GLM returned no text");
    return content.trim();
  },
};
