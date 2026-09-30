import { readDb } from "./store";

export type HistItem = {
  token: string;
  imagePath: string;
  shareUrl: string;
  prompt: string;
  message: string;
  templateId?: string;
  createdAt: string;
};

/** 生成历史：登录按账号，匿名按设备 cookie（同一浏览器登录前后都能找回图）。最新在前，最多 24 条。 */
export async function listHistory(opts: { email?: string | null; deviceId?: string | null }): Promise<HistItem[]> {
  const db = await readDb();
  return Object.values(db.shares)
    .filter((s) => (opts.email ? s.email === opts.email : false) || (s.deviceId && s.deviceId === opts.deviceId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 24)
    .map((s) => ({
      token: s.token,
      imagePath: s.image,
      shareUrl: `/share/${s.token}`,
      prompt: s.prompt,
      message: s.message,
      templateId: s.templateId,
      createdAt: s.createdAt,
    }));
}
