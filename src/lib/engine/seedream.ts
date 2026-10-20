import { storeImage } from "../store";
import type { StillProvider } from "./providers";

const TIMEOUT_MS = 240_000;

/** 火山方舟 Seedream（与参考项目同接口）。换模型只改 SEEDREAM_MODEL_ID / ARK_BASE。 */
export const seedream: StillProvider = {
  name: "seedream",
  async still(prompt, refs) {
    const key = process.env.ARK_API_KEY?.trim();
    if (!key) throw new Error("ARK_API_KEY is not set");
    const base = (process.env.ARK_BASE?.trim() || "https://ark.ap-southeast.bytepluses.com").replace(/\/$/, "");
    const model = process.env.SEEDREAM_MODEL_ID?.trim() || "seedream-5-0-260128";
    const { loadRef } = await import("./load-ref");
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
        response_format: "url",
        watermark: false,
      }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Seedream HTTP ${res.status}: ${text.slice(0, 240)}`);
    const first = (JSON.parse(text) as { data?: Array<{ url?: string; b64_json?: string }> }).data?.[0];
    const bytes = await seedreamBytes(first);
    const id = await storeImage(bytes, "generated");
    return `/api/media/${id}`;
  },
};

async function seedreamBytes(first: { url?: string; b64_json?: string } | undefined): Promise<Buffer> {
  if (first?.url) {
    const img = await fetch(first.url, { signal: AbortSignal.timeout(60_000) });
    if (!img.ok) throw new Error(`Seedream HTTP ${img.status}`);
    return Buffer.from(await img.arrayBuffer());
  }
  if (first?.b64_json) return Buffer.from(first.b64_json, "base64");
  throw new Error("Seedream returned no image");
}
