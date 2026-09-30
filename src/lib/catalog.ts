// 创作目录：旧的 18 个风格编号仍可供已保存的选择使用。模板见 templates.ts。
export interface StyleDef { id: number; name: string; royal: boolean; bg: string; fg: string }

export const STYLES: StyleDef[] = [
  { id: 0, name: "Renaissance Royal", royal: true, bg: "#54382C", fg: "#D4A857" },
  { id: 1, name: "Baroque Hound", royal: false, bg: "#3F4A3C", fg: "#E3C88F" },
  { id: 2, name: "Classic Oil", royal: false, bg: "#4A3B52", fg: "#D8C8A8" },
  { id: 3, name: "Watercolor", royal: false, bg: "#7A9EAB", fg: "#F2EBDD" },
  { id: 4, name: "Golden Hour", royal: false, bg: "#C98A4B", fg: "#F6E3C5" },
  { id: 5, name: "Minimal Line", royal: false, bg: "#8A7A6D", fg: "#FAF6EF" },
  { id: 6, name: "Pop Art", royal: false, bg: "#E0715C", fg: "#FBEAE5" },
  { id: 7, name: "Pixar-style", royal: false, bg: "#5B8DEF", fg: "#EAF1FD" },
  { id: 8, name: "Astronaut", royal: false, bg: "#2E3440", fg: "#B8C4D4" },
  { id: 9, name: "Samurai", royal: false, bg: "#6E2B2B", fg: "#E8C9A0" },
  { id: 10, name: "Christmas Knit", royal: false, bg: "#7A1F2B", fg: "#F6EFE2" },
  { id: 11, name: "Santa Paws", royal: false, bg: "#2F5D50", fg: "#F6EFE2" },
  { id: 12, name: "Festive Portrait", royal: false, bg: "#3D2E24", fg: "#D4A857" },
  { id: 13, name: "Renaissance II", royal: true, bg: "#4A3B52", fg: "#E3C88F" },
  { id: 14, name: "Watercolor II", royal: false, bg: "#9E7AAB", fg: "#F2EBDD" },
  { id: 15, name: "Film Noir", royal: false, bg: "#26221E", fg: "#C7BBA5" },
  { id: 16, name: "Pop Art II", royal: false, bg: "#D4A857", fg: "#3D2E24" },
  { id: 17, name: "Pixar II", royal: false, bg: "#4E9E7F", fg: "#EAF4EE" },
];

// 性格标签 index（dict: profile.tags8 数组顺序）→ 推荐风格
export const TAGKEYS = ["playful", "cuddly", "sassy", "goofy", "alert", "gentle", "dramatic", "chill"];
export const TAGMAP: Record<string, number[]> = {
  playful: [7, 17], cuddly: [3, 10], sassy: [6], goofy: [7, 16],
  alert: [9], gentle: [3, 0], dramatic: [0, 6], chill: [5, 14],
};

export type { Tpl, CatId } from "./templates";
export { TEMPLATES, CATS, tplText, templateById, templatePrompt } from "./templates";
export type TemplateId = string;

/** 风格 → 生图 prompt 片段（引擎 batch 的 stylePrompt） */
export const STYLE_PROMPTS: Record<number, string> = {
  0: "Renaissance royal oil painting portrait, ornate costume, dark warm background, museum quality",
  1: "Baroque chiaroscuro oil portrait, dramatic lighting",
  2: "Classic oil painting portrait, museum grade",
  3: "Soft watercolor painting, warm light washes",
  4: "Golden hour film photography look, warm tones",
  5: "Minimal single-line art elegance on cream background",
  6: "Bold pop art portrait, gallery ready, high contrast",
  7: "Pixar-style 3D animated character charm, big expressive eyes",
  8: "Astronaut suit, cosmic background, cinematic",
  9: "Samurai armor, honorable warrior pose",
  10: "Cozy Christmas knitted sweater portrait",
  11: "Santa hat and festive costume by the fireplace",
  12: "Festive holiday portrait, Christmas card ready",
  13: "Second renaissance royal variant, regal attire",
  14: "Pastel watercolor daydream style",
  15: "Film noir, dashing mysterious low-key lighting",
  16: "Bold pop art variant with attitude",
  17: "Blockbuster 3D animated movie style",
};

/** 风格描述（8 语；索引与 STYLES 一致） */
export const STYLE_DESC: Record<string, string[]> = {
  en: ["oil-painting nobility","dramatic chiaroscuro","museum-grade portrait","soft washes & warm light","film-photo warmth","one-line elegance","bold & gallery-ready","big-screen 3D charm","one small paw for pet-kind","honor of the goodest","cozy sweater season","ho ho ho, treats please","holiday card ready","another royal cut","pastel daydream","dashing & mysterious","double the attitude","blockbuster ready"],
  es: ["nobleza al óleo","claroscuro dramático","retrato de museo","aguadas suaves y luz cálida","calidez de foto fílmica","elegancia de una línea","atrevido y listo para galería","encanto 3D de gran pantalla","una pequeña pata para la especie","honor del más bueno","temporada de suéter acogedor","jo jo jo, premios por favor","listo para tarjeta navideña","otro corte real","ensueño pastel","elegante y misterioso","doble actitud","listo para el blockbuster"],
  pt: ["nobreza em óleo","claro-escuro dramático","retrato de museu","aguadas suaves e luz quente","calor de foto em filme","elegância de uma linha","ousado e pronto para galeria","charme 3D de cinema","uma patinha pela espécie","a honra do mais bonito","temporada de suéter aconchegante","ho ho ho, petiscos por favor","pronto para cartão de Natal","outro corte real","sonho pastel","charmoso e misterioso","atitude em dobro","pronto para a blockbuster"],
  fr: ["noblesse à l'huile","clair-obscur dramatique","portrait de musée","lavis doux et lumière chaude","chaleur argentique","élégance d'un trait","audacieux et prêt pour la galerie","charme 3D grand écran","une petite patte pour l'espèce","l'honneur du plus sage","saison du pull douillet","ho ho ho, des gâteries","prêt pour la carte de vœux","autre coupe royale","rêverie pastel","ténébreux et mystérieux","double l'attitude","prêt pour le blockbuster"],
  de: ["Ölmalerei-Adel","dramatisches Helldunkel","Museums-Qualität","weiche Aquarelle & warmes Licht","filmische Wärme","Eleganz in einer Linie","mutig & galerie-reif","3D-Charme für die Leinwand","eine kleine Pfote für die Pet-welt","die Ehre des Liebsten","gemütliche Pullover-Saison","ho ho ho, Leckerlis bitte","bereit für die Weihnachtskarte","ein weiterer Königschnitt","pastellverträumt","dashing & geheimnisvoll","doppelte Attitüde","bereit für den Blockbuster"],
  ja: ["油絵の貴族","ドラマチックな明暗","美術館級の肖像","柔らかな水彩と暖かな光","フィルムの温もり","一本線のエレガンス","大胆でギャラリー級","大画面3Dの魅力","種族のための一歩","最良の友の名誉","あったかセーターシーズン","ホーホーホー、おやつを","ホリデーカード仕上げ","もう一人の王族","パステルの夢見ごこち","ダンディでミステリアス","倍のチャーミング","大ヒット作仕立て"],
  ko: ["유화의 귀족","드라마틱한 명암","미술관급 초상","부드러운 수채와 따뜻한 빛","필름의 온기","한 줄의 우아함","대담하고 갤러리급","스크린 3D 매력","펫-킨드를 위한 작은 발자국","가장 착한 아이의 명예","포근한 니트 시즌","호호호, 간식 주세요","홀리데이 카드 완성","또 한 명의 왕족","파스텔 몽상","세련되고 신비하게","두 배의 매력","블록버스터 준비 완료"],
  zh: ["油画贵族气质","戏剧性明暗对比","美术馆级肖像","柔和晕染与暖光","胶片般的温暖","一笔线条的优雅","大胆醒目，画廊级","大银幕 3D 魅力","为汪星迈出的一小爪","最乖孩子的荣誉","温暖毛衣季","嚯嚯嚯，零食拿来","圣诞贺卡成品","另一位皇室成员","马卡龙色的白日梦","帅气而神秘","双倍魅力","大片即视感"],
};
