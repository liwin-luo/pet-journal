import { glm } from "./glm";
import { mockChat, mockStill } from "./mock";
import { openrouterChat, openrouterStill } from "./openrouter";
import { fallbackPrompt, parsePlan, planBrief } from "./plan";
import type { ChatProvider, StillProvider } from "./providers";
import { seedream } from "./seedream";

const STILLS: Record<string, StillProvider> = { seedream, openrouter: openrouterStill, mock: mockStill };
const CHATS: Record<string, ChatProvider> = { glm, openrouter: openrouterChat, mock: mockChat };

export function imageProvider(): StillProvider {
  const id = (process.env.IMAGE_PROVIDER || "seedream").toLowerCase();
  // 没配出图密钥一律走 Mock，避免线上裸奔报 500。
  const hasKey = id === "openrouter" ? !!process.env.OPENROUTER_API_KEY : !!process.env.ARK_API_KEY;
  return hasKey ? STILLS[id] : mockStill;
}

export function textProvider(): ChatProvider {
  const id = (process.env.TEXT_PROVIDER || "glm").toLowerCase();
  const hasKey = id === "openrouter" ? !!process.env.OPENROUTER_API_KEY : !!process.env.TEXT_API_KEY;
  return hasKey ? CHATS[id] : mockChat;
}

export type GenerateInput = {
  message: string;
  templatePrompt?: string;
  imageIds: string[];
};

export type GenerateResult = {
  image: string;
  prompt: string;
  /** true = 提示词由文本模型规划；false = 降级拼装 */
  planned: boolean;
};

/** 一次完整生成：GLM 规划提示词 → Seedream 出图。规划失败降级为模板+原话直出。 */
export async function generatePicture(input: GenerateInput): Promise<GenerateResult> {
  const still = imageProvider();
  const chat = textProvider();
  const refs = input.imageIds.map((id) => `/api/media/${id}`);

  let prompt = "";
  let planned = false;
  let chosen: number[] = [];
  try {
    const raw = await chat.chat(
      planBrief({ message: input.message, templatePrompt: input.templatePrompt, imageCount: refs.length }),
    );
    const plan = parsePlan(raw, refs.length);
    prompt = plan.prompt;
    chosen = plan.images;
    planned = true;
  } catch {
    prompt = fallbackPrompt(input.message, input.templatePrompt);
    chosen = refs.map((_, i) => i + 1);
  }

  const refImages = chosen.length ? chosen.map((n) => refs[n - 1]) : refs;
  const image = await still.still(prompt, refImages);
  return { image, prompt, planned };
}
