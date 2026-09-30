import { glm } from "./glm";
import { openrouterChat, openrouterStill } from "./openrouter";
import { ChatProvider, StillProvider } from "./providers";
import { seedream } from "./seedream";

const STILLS: Record<string, StillProvider> = { seedream, openrouter: openrouterStill };
const CHATS: Record<string, ChatProvider> = { glm, openrouter: openrouterChat };

export function imageProvider(): StillProvider {
  const id = (process.env.IMAGE_PROVIDER || "seedream").toLowerCase();
  const provider = STILLS[id];
  if (!provider) throw new Error(`未知出图 IMAGE_PROVIDER=${id}`);
  return provider;
}

export function textProvider(): ChatProvider {
  const id = (process.env.TEXT_PROVIDER || "glm").toLowerCase();
  const provider = CHATS[id];
  if (!provider) throw new Error(`未知文案 TEXT_PROVIDER=${id}`);
  return provider;
}

if (process.env.PROVIDER_CHECK) {
  const prevI = process.env.IMAGE_PROVIDER;
  const prevT = process.env.TEXT_PROVIDER;
  process.env.IMAGE_PROVIDER = "seedream";
  process.env.TEXT_PROVIDER = "glm";
  if (imageProvider().name !== "seedream" || textProvider().name !== "glm") throw new Error("default provider");
  process.env.IMAGE_PROVIDER = "missing";
  let threw = false;
  try { imageProvider(); } catch { threw = true; }
  if (!threw) throw new Error("unknown provider should throw");
  process.env.IMAGE_PROVIDER = prevI;
  process.env.TEXT_PROVIDER = prevT;
}
