import type { ChatProvider, StillProvider } from "./providers";

const API = "https://openrouter.ai/api/v1/chat/completions";

async function callOpenRouter(body: object) {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "PetsDaily",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

function extractImages(data: { choices?: Array<{ message?: { images?: unknown[]; content?: string } }> }): string[] {
  const msg = data?.choices?.[0]?.message;
  const urls: string[] = [];
  for (const im of msg?.images ?? []) {
    const row = im as { image_url?: { url?: string } } | string;
    const u = typeof row === "string" ? row : row?.image_url?.url;
    if (u) urls.push(u);
  }
  if (!urls.length && msg?.content) {
    for (const m of String(msg.content).matchAll(/!\[[^\]]*\]\((data:image[^)]+|https?:[^)]+)\)/g)) urls.push(m[1]);
  }
  return urls;
}

export const openrouterStill: StillProvider = {
  name: "openrouter",
  async still(prompt, refs) {
    const { loadRef } = await import("./load-ref");
    const loaded: string[] = [];
    for (const ref of refs.slice(0, 4)) {
      const url = await loadRef(ref);
      if (url) loaded.push(url);
    }
    const parts: object[] = [{ type: "text", text: prompt }];
    for (const url of loaded) parts.push({ type: "image_url", image_url: { url } });
    const data = await callOpenRouter({
      model: process.env.OPENROUTER_IMAGE_MODEL || "google/gemini-2.5-flash-image",
      modalities: ["image", "text"],
      messages: [{ role: "user", content: parts }],
    });
    const [image] = extractImages(data);
    if (!image) throw new Error("OpenRouter returned no image");
    if (image.startsWith("data:")) {
      const { storeImage } = await import("../store");
      const b64 = image.slice(image.indexOf(";base64,") + 8);
      const id = await storeImage(Buffer.from(b64, "base64"), "generated");
      return `/api/media/${id}`;
    }
    return image;
  },
};

export const openrouterChat: ChatProvider = {
  name: "openrouter",
  async chat(prompt) {
    const data = await callOpenRouter({
      model: process.env.OPENROUTER_TEXT_MODEL || "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
    });
    const text = data?.choices?.[0]?.message?.content;
    if (!text?.trim()) throw new Error("OpenRouter returned no text");
    return String(text).trim();
  },
};
