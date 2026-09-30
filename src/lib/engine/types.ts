// 生成引擎接口（MVP 决策 #2：引擎抽象，v0 Nano Banana / v1 可插 LoRA）
export interface PetPromptContext {
  name: string;
  breed: string;
  coat: string;
  tags: string[];
}

export interface AnchorInput {
  refImages?: string[]; // data-URL 或对象存储 URL（6-10 张）
  pet: PetPromptContext;
}

export interface BatchInput {
  anchorImage: string;
  count: number;
  /** 风格 prompt（自由创作路径） */
  stylePrompt?: string;
  /** 模板 prompt（模板路径，含排版说明；文字由前端排版层叠加，模型只画画面区域） */
  templatePrompt?: string;
  /** 物品场景（三类各一场景包） */
  keepsakeScene?: "toy" | "bandana" | "blanket";
  pet: PetPromptContext;
}

export interface DiaryInput {
  pet: PetPromptContext;
  image?: string;
  note?: string;
  lang: string;
}

export interface ImageEngine {
  readonly name: string;
  generateAnchor(input: AnchorInput): Promise<{ image: string }>;
  generateBatch(input: BatchInput): Promise<{ images: string[] }>;
}

export interface TextEngine {
  readonly name: string;
  writeDiary(input: DiaryInput): Promise<{ text: string }>;
}
