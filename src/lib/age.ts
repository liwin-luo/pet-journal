// 宠物年龄 ↔ 人类年龄换算（猫 / 狗）。纯前端计算，数据来自兽医常用近似表。
// 狗按体型分档（小型 ≤10kg / 中型 11–25kg / 大型 >25kg）。

export type DogSize = "small" | "medium" | "large";

export interface AgeResult {
  humanYears: number;
  stage: "baby" | "young" | "adult" | "senior";
}

/** 猫：1 岁≈15 人岁，2 岁≈24，之后每年 +4。 */
export function catToHuman(age: number): AgeResult {
  const humanYears = age <= 0 ? 0 : age <= 1 ? age * 15 : age <= 2 ? 15 + (age - 1) * 9 : 24 + (age - 2) * 4;
  return { humanYears: Math.round(humanYears), stage: catStage(age) };
}

function catStage(age: number): AgeResult["stage"] {
  if (age < 1) return "baby";
  if (age < 7) return "young";
  if (age < 11) return "adult";
  return "senior";
}

const DOG_TABLE: Record<DogSize, number[]> = {
  // 每个狗年对应的人类年增量（首年 15，次年 +9，之后按体型加速）
  small: [15, 9, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6],
  medium: [15, 9, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8],
  large: [15, 9, 6, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
};

export function dogToHuman(age: number, size: DogSize): AgeResult {
  const table = DOG_TABLE[size];
  let humanYears = 0;
  for (let i = 0; i < Math.min(Math.floor(age), table.length); i++) humanYears += table[i];
  if (age > table.length) humanYears += (age - table.length) * table[table.length - 1];
  return { humanYears: Math.round(humanYears), stage: dogStage(age, size) };
}

function dogStage(age: number, size: DogSize): AgeResult["stage"] {
  const senior = size === "small" ? 11 : size === "medium" ? 9 : 7;
  if (age < 1) return "baby";
  if (age < 3) return "young";
  if (age < senior) return "adult";
  return "senior";
}

/** 换算表数据（SEO 表格用）：0–16 岁逐岁列出。 */
export function chartFor(kind: "cat" | "dog", size: DogSize): { pet: number; human: number }[] {
  return Array.from({ length: 17 }, (_, i) => ({
    pet: i,
    human: (kind === "cat" ? catToHuman(i) : dogToHuman(i, size)).humanYears,
  }));
}
