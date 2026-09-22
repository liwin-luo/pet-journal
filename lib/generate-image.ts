import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { putMedia } from "./db/media.ts";
import { putR2Object, readR2Env } from "./r2.ts";
import { RATIO, SEEDREAM_SIZE } from "./templates.ts";

const SEEDREAM_TIMEOUT_MS = 240_000;

export type GeneratePetStillInput = {
  prompt: string;
  refs: string[];
  seed: number;
  petName: string;
  template: { title: string };
};

export type GeneratePetStillResult = {
  imageUrl: string;
  mimeType: string;
  mock: boolean;
  prompt: string;
  seed: number;
};

export async function generatePetStill(
  input: GeneratePetStillInput,
): Promise<GeneratePetStillResult> {
  const arkKey = process.env.ARK_API_KEY?.trim();
  const arkBase = (process.env.ARK_BASE?.trim() || "https://ark.ap-southeast.bytepluses.com").replace(
    /\/$/,
    "",
  );
  const modelId = process.env.SEEDREAM_MODEL_ID?.trim() || "seedream-5-0-260128";

  if (arkKey) {
    return await generateSeedream({
      apiKey: arkKey,
      baseUrl: arkBase,
      modelId,
      prompt: input.prompt,
      refs: input.refs,
      seed: input.seed,
    });
  }

  const svg = mockStillSvg(input.petName, input.template.title);
  const imageUrl = await saveImage("svg", Buffer.from(svg, "utf8"), "image/svg+xml");
  return {
    imageUrl,
    mimeType: "image/svg+xml",
    mock: true,
    prompt: input.prompt,
    seed: input.seed,
  };
}

async function generateSeedream(opts: {
  apiKey: string;
  baseUrl: string;
  modelId: string;
  prompt: string;
  refs: string[];
  seed: number;
}): Promise<GeneratePetStillResult> {
  const refs = opts.refs.filter(isImageRef).slice(0, 4);
  const jpeg = Boolean(process.env.VERCEL);
  const res = await fetch(`${opts.baseUrl}/api/v3/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(SEEDREAM_TIMEOUT_MS),
    body: JSON.stringify({
      model: opts.modelId,
      prompt: opts.prompt,
      ...(refs.length ? { image: refs } : {}),
      size: SEEDREAM_SIZE,
      seed: opts.seed,
      ...(/seedream-5/i.test(opts.modelId) ? { output_format: jpeg ? "jpeg" : "png" } : {}),
      response_format: "b64_json",
      watermark: false,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Seedream HTTP ${res.status}: ${text.slice(0, 240)}`);
  }
  const parsed = JSON.parse(text) as { data?: Array<{ b64_json?: string }> };
  const b64 = parsed.data?.[0]?.b64_json;
  if (!b64) throw new Error("Seedream response missing b64_json");
  const bytes = Buffer.from(b64, "base64");
  const png = bytes[0] === 0x89;
  const mime = png ? "image/png" : "image/jpeg";
  const imageUrl = await saveImage(png ? "png" : "jpg", bytes, mime);
  return {
    imageUrl,
    mimeType: mime,
    mock: false,
    prompt: opts.prompt,
    seed: opts.seed,
  };
}

function isImageRef(url: string): boolean {
  return (
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("data:image/")
  );
}

export async function saveImage(ext: "png" | "jpg" | "svg", bytes: Buffer, mime: string): Promise<string> {
  if (readR2Env()) {
    const key = `generated/${crypto.randomUUID()}.${ext}`;
    return await putR2Object(key, bytes, mime);
  }
  if (!process.env.VERCEL) {
    try {
      return await savePublicFile(ext, bytes);
    } catch (cause) {
      console.error("public write failed, store in db", cause);
    }
  }
  const id = crypto.randomUUID();
  await putMedia(id, mime, bytes);
  return `/api/media/${id}`;
}

async function savePublicFile(ext: "png" | "jpg" | "svg", bytes: Buffer): Promise<string> {
  const dir = path.join(process.cwd(), "public", "generated");
  await mkdir(dir, { recursive: true });
  const filename = `${crypto.randomUUID()}.${ext}`;
  await writeFile(path.join(dir, filename), bytes);
  return `/generated/${filename}`;
}

export function mockStillSvg(petName: string, templateTitle: string): string {
  const w = 1728;
  const h = 2304;
  const safeName = escapeXml(petName);
  const safeTitle = escapeXml(templateTitle);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#F3E6D4"/>
  <rect x="96" y="120" width="${w - 192}" height="${h - 240}" fill="#FFF8EE" stroke="#2A2118" stroke-width="8"/>
  <text x="50%" y="42%" text-anchor="middle" font-size="92" fill="#2A2118" font-family="serif">${safeName}</text>
  <text x="50%" y="50%" text-anchor="middle" font-size="64" fill="#C23B22" font-family="serif">${safeTitle}</text>
  <text x="50%" y="58%" text-anchor="middle" font-size="48" fill="#6B5A4A" font-family="sans-serif">未接模型</text>
  <text x="50%" y="64%" text-anchor="middle" font-size="36" fill="#8A7A68" font-family="sans-serif">${RATIO} 占位</text>
</svg>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function publicImageError(message: string): string {
  if (/timeout|aborted|ABORT/i.test(message)) return "出图超时，等一会儿再试";
  if (/ARK|401|403|invalid.+key/i.test(message)) return "出图 Key 无效，检查 Vercel 的 ARK_API_KEY";
  if (/EROFS|EACCES|ENOENT|public write/i.test(message)) return "线上不能写本地磁盘";
  if (/Seedream HTTP/i.test(message)) return "出图模型拒绝了这次请求，换模板或重试";
  return "配图失败，字还在，可以重试";
}
