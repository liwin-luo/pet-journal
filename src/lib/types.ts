// PetPics 核心类型定义
export type Lang = "en" | "es" | "pt" | "fr" | "de" | "ja" | "ko" | "zh";
export const LANGS: Lang[] = ["en", "es", "pt", "fr", "de", "ja", "ko", "zh"];
export const LANG_LABEL: Record<Lang, string> = {
  en: "English", es: "Español", pt: "Português", fr: "Français",
  de: "Deutsch", ja: "日本語", ko: "한국어", zh: "简体中文",
};

export type KeepsakeType = "toy" | "bandana" | "blanket";

export interface Pet {
  id: string;
  name: string;
  breed: string;
  /** 狗 / 猫 / 其他。旧数据可能没有，用 dog + breed 推断 */
  species?: "dog" | "cat" | "other";
  /** 体型比例：幼年 / 成年 / 老年。不填当作成年 */
  stage?: "young" | "adult" | "senior";
  dog: boolean;
  /** 4 个必填字段全部填写后为 true（MVP 审计 #2 的判定标准） */
  profileDone: boolean;
  /** 已确认的锚点图（data-URL / 对象存储 URL），有它才能跳过上传直出预览 */
  hasAnchor: boolean;
  anchorImage?: string;
  coat: string;
  tags: number[];
  bday?: string;
  items: Record<KeepsakeType, boolean>;
  collections: number;
}

export interface Order {
  id: string;
  tier: "studio" | "gift";
  amount: number;
  petId: string;
  createdAt: number;
  status: "paid" | "generating" | "done";
  images: string[];
  gift?: { token: string; toName: string; email: string; when: string; card: string };
}

export interface DiaryEntry {
  id: string;
  petId: string;
  date: number;
  image: string;
  text: string;
}

export interface AppState {
  lang: Lang;
  /** 用户在语言菜单里选过。没选过就保持英语，不跟浏览器语言走。 */
  langPicked?: boolean;
  pets: Pet[];
  curPetId: string | null;
  /** 创作框里 @ 到的宠物。空则只用 curPetId。 */
  citedPetIds: string[];
  orders: Order[];
  diary: DiaryEntry[];
  /** 创作意图（模板名或自定义描述），由创作页带到上传页做过渡说明（审计 #3） */
  intent: string;
  selectedStyle: number | null;
  selectedTemplate: string | null;
  customDesc: string;
  paid: boolean;
  /** 免费 / Plus / 家庭。旧数据没有时当作免费。 */
  plan?: "free" | "studio" | "home";
  /** 旧点数包还没花完的余额。 */
  credits?: number;
  /** 免费额度对应的月份，形如 2026-9。 */
  creditDay?: string;
  /** 这个月已经用掉的免费张数。 */
  monthUsed?: number;
  creditUsed?: number;
}

export const emptyPet = (id: string): Pet => ({
  id, name: "", breed: "", dog: true, profileDone: false, hasAnchor: false,
  coat: "", tags: [], items: { toy: false, bandana: false, blanket: false }, collections: 0,
});
