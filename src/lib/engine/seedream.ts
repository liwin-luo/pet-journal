import { loadRef } from "./load-ref";
import { StillProvider } from "./providers";

const TIMEOUT_MS = 240_000;

/** 火山 Seedream。换模型只改 SEEDREAM_MODEL_ID / ARK_BASE。 */
export const seedream: StillProvider = {
  name: "seedream",
  async still(prompt, refs) {
    const key = process.env.ARK_API_KEY?.trim();
    if (!key) throw new Error("没配 ARK_API_KEY");
    const base = (process.env.ARK_BASE?.trim() || "https://ark.ap-southeast.bytepluses.com").replace(/\/$/, "");
    const model = process.env.SEEDREAM_MODEL_ID?.trim() || "seedream-5-0-260128";
    const loaded: string[] = [];
    for (const ref of refs.slice(0, 4)) {
      const url = await loadRef(ref);
      if (url) loaded.push(url);
    }
    const res = await fetch(`${base}/api/v3/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        model,
        prompt,
        ...(loaded.length ? { image: loaded } : {}),
        size: process.env.SEEDREAM_SIZE?.trim() || "1728x2304",
        seed: Math.floor(Math.random() * 1_000_000_000),
        ...(/seedream-5/i.test(model) ? { output_format: "jpeg" } : {}),
        response_format: "b64_json",
        watermark: false,
      }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Seedream HTTP ${res.status}: ${text.slice(0, 240)}`);
    const b64 = (JSON.parse(text) as { data?: Array<{ b64_json?: string }> }).data?.[0]?.b64_json;
    if (!b64) throw new Error("Seedream 没有返回图片");
    // ponytail: Vercel 上 public/ 只读，写成 /generated 会 502。data URL 单张大约几 MB，8 张一起回传可能顶到响应上限；再大就改对象存储。
    return `data:image/jpeg;base64,${b64}`;
  },
};
