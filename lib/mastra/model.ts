export function hasLlmKey(): boolean {
  return Boolean(process.env.ZHIPU_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim());
}

export function diaryModel() {
  const apiKey = process.env.ZHIPU_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("没有文案模型 Key");
  const id = (process.env.MASTRA_MODEL_ID ?? "custom/glm-5.3-flash") as `${string}/${string}`;
  return {
    id,
    url: process.env.MASTRA_MODEL_URL ?? "https://open.bigmodel.cn/api/coding/paas/v4",
    apiKey,
  };
}
