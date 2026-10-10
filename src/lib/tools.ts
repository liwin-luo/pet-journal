// 免费工具注册表：首页工具区 / 工具中心 / 页脚共用。
// 文案按 id 从 dict.tools 取（t.tools[id + "T"] / [id + "D"]）。

export type ToolId = "portrait" | "meme" | "avatar" | "dogNames" | "catNames" | "age";

/** 卡面图标 id，ToolCard 里映射为内联 SVG（icons.tsx） */
export type ToolIconId = "palette" | "laugh" | "moon" | "bone" | "paw" | "cake";

export interface ToolDef {
  id: ToolId;
  href: string;
  /** 马卡龙卡面底色（Skillry 式彩色圆角卡） */
  color: string;
  icon: ToolIconId;
  badge?: "free" | "new" | "hot";
}

export const TOOLS: ToolDef[] = [
  { id: "portrait", href: "/#create", color: "#e8765f", icon: "palette", badge: "hot" },
  { id: "meme", href: "/tools/meme-maker", color: "#8fa7c9", icon: "laugh", badge: "new" },
  { id: "avatar", href: "/tools/pet-avatar", color: "#d9a8c4", icon: "moon" },
  { id: "dogNames", href: "/tools/dog-names", color: "#a3b591", icon: "bone" },
  { id: "catNames", href: "/tools/cat-names", color: "#b9a7d9", icon: "paw" },
  { id: "age", href: "/tools/pet-age", color: "#e6b767", icon: "cake" },
];

export function toolById(id: ToolId): ToolDef {
  return TOOLS.find((t) => t.id === id)!;
}
