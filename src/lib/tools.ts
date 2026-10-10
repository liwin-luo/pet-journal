// 免费工具注册表：首页工具区 / 工具中心 / 页脚共用。
// 文案按 id 从 dict.tools 取（t.tools[id + "T"] / [id + "D"]）。

export type ToolId = "portrait" | "meme" | "avatar" | "dogNames" | "catNames" | "age";

export interface ToolDef {
  id: ToolId;
  href: string;
  /** 马卡龙卡面底色（Skillry 式彩色圆角卡） */
  color: string;
  emoji: string;
  badge?: "free" | "new" | "hot";
}

export const TOOLS: ToolDef[] = [
  { id: "portrait", href: "/#create", color: "#e8765f", emoji: "🎨", badge: "hot" },
  { id: "meme", href: "/tools/meme-maker", color: "#8fa7c9", emoji: "😹", badge: "new" },
  { id: "avatar", href: "/tools/pet-avatar", color: "#d9a8c4", emoji: "🌙" },
  { id: "dogNames", href: "/tools/dog-names", color: "#a3b591", emoji: "🦴" },
  { id: "catNames", href: "/tools/cat-names", color: "#b9a7d9", emoji: "🐾" },
  { id: "age", href: "/tools/pet-age", color: "#e6b767", emoji: "🎂" },
];

export function toolById(id: ToolId): ToolDef {
  return TOOLS.find((t) => t.id === id)!;
}
