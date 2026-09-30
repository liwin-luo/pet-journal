import { ChatProvider } from "./providers";

/** 智谱 GLM。换模型只改 TEXT_MODEL / TEXT_BASE_URL。 */
export const glm: ChatProvider = {
  name: "glm",
  async chat(prompt) {
    const key = process.env.TEXT_API_KEY?.trim();
    if (!key) throw new Error("没配 TEXT_API_KEY");
    const base = (process.env.TEXT_BASE_URL?.trim() || "https://open.bigmodel.cn/api/coding/paas/v4").replace(/\/$/, "");
    const model = process.env.TEXT_MODEL?.trim() || "glm-5.3-flash";
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
