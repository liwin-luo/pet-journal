export type Species = "cat" | "dog" | "other";
export type Sex = "male" | "female";
export type Age = "young" | "adult" | "senior";
export type Relation = "playmate" | "sibling" | "rival";

export type Friend = {
  id: string;
  kind: "pet" | "photo";
  petId?: string;
  name: string;
  photo?: string;
  species?: Species;
  relation: Relation;
};

export type Pet = {
  id: string;
  userId?: string;
  name: string;
  species: Species;
  breed?: string;
  sex?: Sex;
  age?: Age;
  traits: string[];
  hobbies?: string;
  toys?: string;
  food?: string;
  catchphrase?: string;
  photos: string[];
  friends: Friend[];
  createdAt: number;
};

export type PromptPet = {
  name: string;
  species: Species;
  breed?: string;
  sex?: Sex;
  age?: Age;
  traits: string[];
  hobbies?: string;
  toys?: string;
  food?: string;
  catchphrase?: string;
};

export type PromptFriend = {
  name: string;
  species?: Species;
  relation: Relation;
};

export type ImageSource = "diary" | "template";

export type Shot = {
  id: string;
  petId: string;
  petName: string;
  friendId?: string;
  friendName?: string;
  templateId: string;
  source: ImageSource;
  diaryId?: string;
  imageUrl: string;
  mock: boolean;
  seed: number;
  createdAt: number;
};

export type DiaryEntry = {
  id: string;
  petId: string;
  petName: string;
  date: string;
  index: number;
  source: "auto" | "prompt";
  userNote?: string;
  photo?: string;
  body: string;
  imageUrl?: string;
  mock?: boolean;
  edited: boolean;
  createdAt: number;
};

export const SPECIES_LABEL: Record<Species, string> = {
  cat: "猫",
  dog: "狗",
  other: "其他",
};

export const SPECIES_EN: Record<Species, string> = {
  cat: "cat",
  dog: "dog",
  other: "small pet",
};

export const SEX_LABEL: Record<Sex, string> = {
  male: "公",
  female: "母",
};

export const AGE_LABEL: Record<Age, string> = {
  young: "幼年",
  adult: "成年",
  senior: "老年",
};

export const RELATION_LABEL: Record<Relation, string> = {
  playmate: "玩伴",
  sibling: "兄妹",
  rival: "死对头",
};

export const TRAIT_OPTIONS = ["黏人", "高冷", "二货", "护食", "话痨", "胆小"] as const;
