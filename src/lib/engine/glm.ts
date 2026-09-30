import { ChatProvider } from "./providers";

/** Mastra 的模型 id 是 custom/glm-5.3-flash，直连智谱只要斜杠后面那段。 */
export function glmModelId(raw: string): string {
  return raw.trim().replace(/^custom\//, "") || "glm-5.3-flash";
}

/** 智谱 GLM。TEXT_* 优先，否则用原来线上的 ZHIPU_API_KEY / MASTRA_MODEL_*。 */
export const glm: ChatProvider = {
  name: "glm",
  async chat(prompt) {
    const key = process.env.TEXT_API_KEY?.trim() || process.env.ZHIPU_API_KEY?.trim();
    if (!key) throw new Error("没配 TEXT_API_KEY");
    const base = (process.env.TEXT_BASE_URL?.trim() || process.env.MASTRA_MODEL_URL?.trim() || "https://open.bigmodel.cn/api/coding/paas/v4").replace(/\/$/, "");
    const model = glmModelId(process.env.TEXT_MODEL?.trim() || process.env.MASTRA_MODEL_ID?.trim() || "glm-5.3-flash");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(60_000),
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`GLM HTTP ${res.status}: ${text.slice(0, 240)}`);
    const content = (JSON.parse(text) as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content;
    if (!content?.trim()) throw new Error("GLM 没有返回文字");
    return content.trim();
  },
};

if (process.env.GLM_CHECK) {
  if (glmModelId("custom/glm-5.3-flash") !== "glm-5.3-flash") throw new Error("strip");
  if (glmModelId("glm-5.3-flash") !== "glm-5.3-flash") throw new Error("plain");
}
