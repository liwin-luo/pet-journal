// 模板目录。后期加模板：在 TEMPLATES 末尾加一条即可，模板中心和 @ 搜索都会读到。
// ponytail: 名字只有中文和英文，其它语言先显示英文。要某语言的名字，给条目加对应字段再在 tplText 里读。
export type CatId = "react" | "classic" | "holiday" | "cover" | "story" | "season";

export interface Tpl {
  id: string;
  cat: CatId;
  en: string;
  zh: string;
  prompt: string;
  bg: string;
  fg: string;
}

export const CATS: { id: CatId; en: string; zh: string }[] = [
  { id: "react", en: "Reactions", zh: "表情" },
  { id: "classic", en: "Classic", zh: "经典肖像" },
  { id: "holiday", en: "Holiday", zh: "节日" },
  { id: "cover", en: "Covers", zh: "海报封面" },
  { id: "story", en: "Stories", zh: "故事" },
  { id: "season", en: "Seasons", zh: "时节" },
];

export const TEMPLATES: Tpl[] = [
  { id: "glance", cat: "react", en: "Side-eye", zh: "侧目", bg: "#C4A882", fg: "#3D2E24", prompt: "Close photo of the same pet, head turned slightly, both eyes looking sideways together, unimpressed meme reaction, still clearly that pet" },
  { id: "desk", cat: "react", en: "Desk", zh: "工位", bg: "#E7EEF2", fg: "#3D4A55", prompt: "LinkedIn-style headshot of the same pet in a simple suit, chest-up, office blur behind, no paws in frame, polite and slightly tired" },
  { id: "delivery", cat: "react", en: "Delivery", zh: "外卖", bg: "#F3D36B", fg: "#3D2E24", prompt: "The same pet perched naturally on a scooter seat in a tiny yellow delivery vest, bag beside them, not standing like a person" },
  { id: "sticker", cat: "react", en: "Sticker", zh: "Q版", bg: "#F6E3C5", fg: "#E0715C", prompt: "Cute die-cut sticker of the same pet, thick white outline, slight sideways glance, simple cream background, not an angry scowl" },
  { id: "royal", cat: "classic", en: "Royal classic", zh: "皇室经典", bg: "#54382C", fg: "#D4A857", prompt: "Renaissance royal oil portrait, ornate golden oval frame, dark warm background, centered subject" },
  { id: "oil", cat: "classic", en: "Classic oil", zh: "古典油画", bg: "#4A3B52", fg: "#D8C8A8", prompt: "Classic museum oil painting portrait, rich glaze, warm dark ground" },
  { id: "baroque", cat: "classic", en: "Baroque", zh: "巴洛克", bg: "#3F4A3C", fg: "#E3C88F", prompt: "Baroque chiaroscuro oil portrait, dramatic side light" },
  { id: "watercolor", cat: "classic", en: "Watercolor", zh: "水彩", bg: "#7A9EAB", fg: "#F2EBDD", prompt: "Soft watercolor portrait, warm light washes, paper texture" },
  { id: "pastel", cat: "classic", en: "Pastel dream", zh: "粉彩白日梦", bg: "#9E7AAB", fg: "#F2EBDD", prompt: "Pastel daydream portrait, chalky color, airy background" },
  { id: "golden", cat: "classic", en: "Golden hour", zh: "黄金时刻", bg: "#C98A4B", fg: "#F6E3C5", prompt: "Golden hour film portrait, warm skin light, shallow depth" },
  { id: "line", cat: "classic", en: "One line", zh: "极简线条", bg: "#8A7A6D", fg: "#FAF6EF", prompt: "Minimal single-line art portrait on cream paper" },
  { id: "noir", cat: "classic", en: "Film noir", zh: "黑色电影", bg: "#26221E", fg: "#C7BBA5", prompt: "Film noir portrait, low-key light, mysterious, monochrome warmth" },
  { id: "pop", cat: "classic", en: "Pop art", zh: "波普艺术", bg: "#E0715C", fg: "#FBEAE5", prompt: "Bold pop art portrait, flat color, high contrast, gallery print" },
  { id: "pixar", cat: "classic", en: "Animated film", zh: "动画电影", bg: "#5B8DEF", fg: "#EAF1FD", prompt: "Feature-animation 3D character portrait, big expressive eyes, soft studio light" },
  { id: "ink", cat: "classic", en: "Ink wash", zh: "水墨", bg: "#3D2E24", fg: "#EFE3D0", prompt: "Chinese ink wash portrait, spare brush strokes, rice paper, lots of empty space" },
  { id: "ukiyo", cat: "classic", en: "Woodblock", zh: "浮世绘", bg: "#6E2B2B", fg: "#F6EFE2", prompt: "Japanese woodblock print portrait, flat color, bold outline" },

  { id: "xmas", cat: "holiday", en: "Christmas card", zh: "圣诞贺卡", bg: "#7A1F2B", fg: "#F6EFE2", prompt: "Festive Christmas portrait, warm fireplace bokeh, holiday colors, lower third kept simple for greeting text" },
  { id: "birthday", cat: "holiday", en: "Birthday card", zh: "生日贺卡", bg: "#E0715C", fg: "#FBEAE5", prompt: "Joyful birthday portrait, party hat, confetti bokeh, pastel ground, space at top for text" },
  { id: "santa", cat: "holiday", en: "Santa paws", zh: "圣诞老人装", bg: "#2F5D50", fg: "#F6EFE2", prompt: "Pet in a Santa-inspired costume by a fireplace, cozy holiday light" },
  { id: "knit", cat: "holiday", en: "Christmas knit", zh: "圣诞毛衣", bg: "#7A1F2B", fg: "#F6EFE2", prompt: "Cozy Christmas knitted sweater portrait, soft indoor light" },
  { id: "lunar", cat: "holiday", en: "Lunar new year", zh: "新春", bg: "#8C2F2F", fg: "#F3D48A", prompt: "Lunar new year portrait, red and gold, lantern bokeh, festive but elegant" },
  { id: "midautumn", cat: "holiday", en: "Mid-autumn", zh: "中秋", bg: "#3D3A55", fg: "#F6E3C5", prompt: "Mid-autumn night portrait, full moon, osmanthus and warm lantern light" },
  { id: "halloween", cat: "holiday", en: "Halloween", zh: "万圣夜", bg: "#2A241C", fg: "#E8A05A", prompt: "Halloween portrait, pumpkin glow, playful not scary, night background" },
  { id: "valentine", cat: "holiday", en: "Valentine", zh: "情人节", bg: "#8A4A55", fg: "#F8E4E0", prompt: "Valentine portrait, soft rose light, a few petals, romantic and simple" },
  { id: "newyear", cat: "holiday", en: "New Year's eve", zh: "跨年夜", bg: "#1E2A3A", fg: "#F6E3C5", prompt: "New Year's eve portrait, distant fireworks bokeh, evening coat of light" },

  { id: "poster", cat: "cover", en: "Movie poster", zh: "电影海报", bg: "#26221E", fg: "#E8C9A0", prompt: "Cinematic movie poster, dramatic low angle, dark ground, bottom quarter clear for a title" },
  { id: "magazine", cat: "cover", en: "Magazine cover", zh: "杂志封面", bg: "#4A3B52", fg: "#F2EBDD", prompt: "Editorial magazine cover portrait, clean studio background, top area clear for a masthead" },
  { id: "idcard", cat: "cover", en: "Pet ID card", zh: "宠物档案卡", bg: "#EFE3D0", fg: "#3D2E24", prompt: "Clean front-facing ID portrait on a plain warm background, even light, centered" },
  { id: "album", cat: "cover", en: "Record sleeve", zh: "黑胶封面", bg: "#3D2E24", fg: "#E3C88F", prompt: "Square vinyl album cover portrait, bold graphic crop, studio light" },
  { id: "stamp", cat: "cover", en: "Postage stamp", zh: "邮票", bg: "#F6EFE2", fg: "#7A1F2B", prompt: "Postage stamp portrait, perforated edge feel, small engraved detail, cream paper" },
  { id: "polaroid", cat: "cover", en: "Polaroid", zh: "拍立得", bg: "#F7F1E6", fg: "#3D2E24", prompt: "Instant-film polaroid portrait, soft flash, white border, casual and close" },
  { id: "wanted", cat: "cover", en: "Wanted poster", zh: "通缉令", bg: "#C4A574", fg: "#3D2E24", prompt: "Old west wanted poster portrait, weathered paper, woodcut contrast, space below for type" },
  { id: "passport", cat: "cover", en: "Passport", zh: "护照页", bg: "#6E7A62", fg: "#F6EFE2", prompt: "Formal passport-style portrait, plain ground, straight-on, even light" },

  { id: "astronaut", cat: "story", en: "Astronaut", zh: "宇航员", bg: "#2E3440", fg: "#B8C4D4", prompt: "Astronaut portrait, helmet visor reflection, quiet cosmic background" },
  { id: "samurai", cat: "story", en: "Samurai", zh: "武士", bg: "#6E2B2B", fg: "#E8C9A0", prompt: "Samurai portrait, armor suggested, calm honorable pose, muted background" },
  { id: "knight", cat: "story", en: "Knight", zh: "骑士", bg: "#3F4A3C", fg: "#E3C88F", prompt: "Storybook knight portrait, soft armor, banner light, not a battle scene" },
  { id: "pirate", cat: "story", en: "Pirate", zh: "海盗", bg: "#3D2E24", fg: "#E8C9A0", prompt: "Friendly pirate portrait, coat and hat, warm cabin light" },
  { id: "chef", cat: "story", en: "Chef", zh: "主厨", bg: "#F6EFE2", fg: "#8C2F2F", prompt: "Chef portrait in a white coat, warm kitchen bokeh, proud and tidy" },
  { id: "detective", cat: "story", en: "Detective", zh: "侦探", bg: "#2A2622", fg: "#C7BBA5", prompt: "Detective portrait, trench-coat mood, rainy window light, noir but gentle" },
  { id: "wizard", cat: "story", en: "Wizard", zh: "巫师", bg: "#3A3050", fg: "#E3C88F", prompt: "Wizard portrait, robe and soft magic light, library background, whimsical" },
  { id: "sailor", cat: "story", en: "Sailor", zh: "水手", bg: "#3E5C6E", fg: "#F2EBDD", prompt: "Sailor portrait, navy collar, sea horizon, bright daylight" },
  { id: "scientist", cat: "story", en: "Scientist", zh: "科学家", bg: "#E7EEF2", fg: "#3D4A55", prompt: "Scientist portrait, lab coat, clean light, curious expression" },
  { id: "musician", cat: "story", en: "Musician", zh: "音乐家", bg: "#4A3B52", fg: "#F2EBDD", prompt: "Musician portrait on a small stage, warm spotlight, instrument nearby" },
  { id: "hero", cat: "story", en: "Superhero", zh: "超级英雄", bg: "#2E3440", fg: "#E0715C", prompt: "Superhero portrait, simple cape, heroic low light, city bokeh" },
  { id: "ballet", cat: "story", en: "Ballet", zh: "芭蕾", bg: "#F4E6EA", fg: "#6E3A48", prompt: "Ballet portrait, soft tutu suggestion, stage wash of light, graceful" },

  { id: "spring", cat: "season", en: "Spring picnic", zh: "春日野餐", bg: "#DCE8C8", fg: "#3F4A3C", prompt: "Spring picnic portrait, blossoms, soft daylight, fresh green" },
  { id: "summer", cat: "season", en: "Summer shore", zh: "夏日海边", bg: "#7A9EAB", fg: "#F6EFE2", prompt: "Summer shore portrait, bright sea light, breeze, relaxed" },
  { id: "autumn", cat: "season", en: "Autumn woods", zh: "秋日林间", bg: "#C98A4B", fg: "#F6E3C5", prompt: "Autumn woods portrait, fallen leaves, honey light" },
  { id: "winter", cat: "season", en: "Winter snow", zh: "冬日雪地", bg: "#D5DDE4", fg: "#3D2E24", prompt: "Winter snow portrait, cool light, scarf, quiet background" },
  { id: "rain", cat: "season", en: "Rainy window", zh: "雨天窗边", bg: "#5C6B73", fg: "#F2EBDD", prompt: "Rainy window portrait, droplets on glass, warm indoor light on the subject" },

  { id: "blep", cat: "react", en: "Blep", zh: "吐舌", bg: "#F6E3C5", fg: "#3D2E24", prompt: "Close photo of the same pet with a tiny tongue tip out, relaxed silly face, plain wall, phone snapshot" },
  { id: "guilty", cat: "react", en: "Caught", zh: "被抓包", bg: "#E7D7C8", fg: "#3D2E24", prompt: "The same pet caught in the act, wide guilty eyes, crumbs or a tipped cup nearby, candid indoor photo" },
  { id: "loaf", cat: "react", en: "Loaf", zh: "面包坐", bg: "#F3E6D4", fg: "#3D2E24", prompt: "The same pet tucked into a neat loaf, paws hidden, calm face toward camera, soft daylight" },
  { id: "spa", cat: "react", en: "Spa day", zh: "护理", bg: "#F7F1E8", fg: "#6E5A4E", prompt: "The same pet lying on a towel, tiny towel turban, cucumber slices over the eyes, top-down pamper photo, still that animal" },
  { id: "barber", cat: "react", en: "Fresh cut", zh: "理发", bg: "#EFE6DA", fg: "#3D2E24", prompt: "The same pet in a barber cape, just-trimmed fur, shop mirror behind, proud and slightly damp, not a person" },
  { id: "grill", cat: "react", en: "Cookout", zh: "烧烤", bg: "#C46A3A", fg: "#F6EFE2", prompt: "The same pet beside a backyard grill in a tiny apron, late-afternoon cookout, still sitting as that animal" },
  { id: "doorbell", cat: "react", en: "Doorbell", zh: "门铃", bg: "#2E3438", fg: "#D5DDE4", prompt: "Doorbell-camera still of the same pet looking up into the lens, fisheye, porch light, waiting to be let in" },

  { id: "anime", cat: "classic", en: "Anime", zh: "动漫", bg: "#F4C7D8", fg: "#3A3050", prompt: "Anime portrait of the same pet, clean line, large expressive eyes, vivid flat color, cream background" },
  { id: "neon", cat: "classic", en: "Neon night", zh: "霓虹", bg: "#1B2430", fg: "#7AD7F0", prompt: "The same pet in rainy neon night light, magenta and cyan glow, wet street bokeh, chest-up portrait" },
  { id: "memorial", cat: "classic", en: "Keepsake", zh: "纪念", bg: "#E7D3C4", fg: "#5C4638", prompt: "Gentle keepsake portrait of the same pet, soft window light, quiet background, tender and unhurried" },
  { id: "sketch", cat: "classic", en: "Sketch", zh: "速写", bg: "#F6F1E8", fg: "#3D2E24", prompt: "Loose watercolor sketch of the same pet, a few confident lines, lots of paper showing" },
  { id: "clay", cat: "classic", en: "Clay", zh: "黏土", bg: "#E7C7A8", fg: "#6B4632", prompt: "Handmade clay figurine of the same pet, soft studio light, visible fingerprints, simple base" },
  { id: "tattoo", cat: "classic", en: "Tattoo flash", zh: "纹身稿", bg: "#F7F3EA", fg: "#1E1A17", prompt: "Traditional tattoo flash of the same pet, bold black line, limited color, cream paper" },
  { id: "marble", cat: "classic", en: "Marble", zh: "大理石", bg: "#E4E0D8", fg: "#6E675E", prompt: "White marble bust of the same pet, museum light, calm classical face, plain stone ground" },
  { id: "starry", cat: "classic", en: "Starry night", zh: "星夜", bg: "#1E3A5F", fg: "#F2D56B", prompt: "Oil portrait of the same pet under a swirling starry night sky, thick visible brush, deep blue and gold" },
  { id: "garden", cat: "classic", en: "Garden light", zh: "花园光", bg: "#A9C4A0", fg: "#3F4A3C", prompt: "Impressionist garden portrait of the same pet, dappled leaves, loose sunny strokes" },
  { id: "deco", cat: "classic", en: "Art deco", zh: "装饰艺术", bg: "#1F3A34", fg: "#E3C88F", prompt: "Art deco poster portrait of the same pet, geometric gold lines, deep green ground, elegant crop" },
  { id: "botanic", cat: "classic", en: "Botanical", zh: "植物图鉴", bg: "#F4F0E4", fg: "#3D4A32", prompt: "Botanical plate of the same pet among labeled leaves, fine ink and soft wash, cream paper" },

  { id: "harvest", cat: "holiday", en: "Harvest table", zh: "收获季", bg: "#C98A4B", fg: "#F6E3C5", prompt: "The same pet at a harvest table, pumpkins and wheat, warm afternoon, cozy not spooky" },
  { id: "easter", cat: "holiday", en: "Spring eggs", zh: "彩蛋", bg: "#F3E4C8", fg: "#6E8B74", prompt: "The same pet among pastel eggs and blossoms, soft spring light, playful and clean" },

  { id: "yearbook", cat: "cover", en: "Yearbook", zh: "年鉴照", bg: "#D9E2EA", fg: "#2E3A46", prompt: "School yearbook photo of the same pet, mottled blue backdrop, straight-on, slight awkward charm" },
  { id: "trading", cat: "cover", en: "Trading card", zh: "卡牌", bg: "#F4E7C4", fg: "#7A1F2B", prompt: "Sports trading card of the same pet, bold frame, stat-free bottom band left clear, studio flash" },
  { id: "news", cat: "cover", en: "Front page", zh: "头版", bg: "#F6F1E6", fg: "#1E1A17", prompt: "Newspaper front-page photo of the same pet, halftone, a clear headline area above, black and warm gray" },
  { id: "jersey", cat: "cover", en: "Jersey", zh: "球衣", bg: "#1E3A5F", fg: "#F2EBDD", prompt: "The same pet in a plain numbered jersey, no logos, stadium bokeh, proud sports portrait" },
  { id: "film", cat: "cover", en: "35mm", zh: "胶片", bg: "#C4B6A4", fg: "#2A2622", prompt: "35mm film still of the same pet, gentle grain, slightly faded color, natural window light" },
  { id: "vhs", cat: "cover", en: "Home video", zh: "家用录像", bg: "#6E7A62", fg: "#F6EFE2", prompt: "1990s home-video still of the same pet, soft scan lines, living-room lamp, found-footage charm" },
  { id: "pin", cat: "cover", en: "Enamel pin", zh: "徽章", bg: "#F6EFE2", fg: "#E0715C", prompt: "Enamel pin of the same pet, hard outline, flat glossy color, metal edge, plain ground" },
  { id: "crochet", cat: "cover", en: "Crochet", zh: "钩针", bg: "#E7D8C8", fg: "#6B4632", prompt: "Crochet portrait of the same pet, visible yarn stitches, soft stuffed shape, warm wool colors" },

  { id: "cowboy", cat: "story", en: "Cowboy", zh: "牛仔", bg: "#C4A574", fg: "#3D2E24", prompt: "The same pet in a small cowboy hat on a sunny porch, dust and wood, still sitting as that animal" },
  { id: "princess", cat: "story", en: "Storybook", zh: "童话", bg: "#F4E6EA", fg: "#6E3A48", prompt: "Storybook portrait of the same pet with a simple ribbon crown, soft castle light, illustrated but recognizable" },
  { id: "ninja", cat: "story", en: "Ninja", zh: "忍者", bg: "#243028", fg: "#C7D0C4", prompt: "The same pet in a simple dark wrap, moonlit garden, quiet and alert, not a human pose" },
  { id: "viking", cat: "story", en: "Viking", zh: "维京", bg: "#3E4A55", fg: "#E3C88F", prompt: "The same pet with a small horned helmet suggestion, cold sea light, sturdy and calm" },
  { id: "pharaoh", cat: "story", en: "Pharaoh", zh: "法老", bg: "#C4A05A", fg: "#3D2E24", prompt: "The same pet with a simple gold collar, warm sandstone, still and ceremonial" },
  { id: "barista", cat: "story", en: "Barista", zh: "咖啡师", bg: "#E7D3C0", fg: "#4A3428", prompt: "The same pet behind a small coffee counter, steam, morning light, apron, still that animal" },
  { id: "pilot", cat: "story", en: "Pilot", zh: "飞行员", bg: "#D5DDE4", fg: "#2E3A46", prompt: "The same pet in a simple pilot cap, bright cabin window, clouds outside, chest-up" },
  { id: "racer", cat: "story", en: "Racer", zh: "车手", bg: "#C4473A", fg: "#F6EFE2", prompt: "The same pet in a plain racing suit and open helmet, pit-lane bokeh, no logos" },
  { id: "rock", cat: "story", en: "Rock show", zh: "摇滚", bg: "#241C28", fg: "#E0715C", prompt: "The same pet under a small stage light, leather collar, amp glow, loud but friendly" },
  { id: "farmer", cat: "story", en: "Farmer", zh: "农场", bg: "#C9B48A", fg: "#3F4A3C", prompt: "The same pet in denim overalls on a farm step, morning dust, honest and muddy-pawed" },
  { id: "teacher", cat: "story", en: "Classroom", zh: "课堂", bg: "#E7EEF2", fg: "#3D4A55", prompt: "The same pet at a low desk, chalkboard blur, afternoon classroom light" },
  { id: "doctor", cat: "story", en: "Clinic", zh: "诊室", bg: "#F4F7F8", fg: "#3D5A62", prompt: "The same pet in a plain white coat, clean clinic light, calm and capable, no text" },
  { id: "librarian", cat: "story", en: "Library", zh: "图书馆", bg: "#6E5A48", fg: "#F6EFE2", prompt: "The same pet between book stacks, green lamp, quiet afternoon, one paw on a closed book" },
  { id: "yoga", cat: "story", en: "Yoga", zh: "瑜伽", bg: "#E7E2D6", fg: "#5C6B5A", prompt: "The same pet on a yoga mat in a natural stretch, soft studio, plants, unforced" },

  { id: "camp", cat: "season", en: "Campfire", zh: "营火", bg: "#3A2A22", fg: "#E8A05A", prompt: "The same pet by a small campfire, blanket, night trees, warm face light" },
  { id: "cafe", cat: "season", en: "Cafe seat", zh: "咖啡馆", bg: "#E7D3C0", fg: "#4A3428", prompt: "The same pet in a cafe window seat, cup nearby, rainy street outside, cozy" },
  { id: "beret", cat: "season", en: "Paris", zh: "巴黎", bg: "#C9D3DC", fg: "#3D2E24", prompt: "The same pet in a small beret on a Paris balcony, soft overcast, zinc roofs behind" },
  { id: "kimono", cat: "season", en: "Kimono", zh: "和服", bg: "#F3E6EA", fg: "#6E3A48", prompt: "The same pet in a simple kimono pattern cloth, tatami and paper screen, quiet daylight" },
  { id: "hanbok", cat: "season", en: "Hanbok", zh: "韩服", bg: "#F6E3E8", fg: "#7A3048", prompt: "The same pet in a simple hanbok ribbon and cloth, palace courtyard blur, bright and formal" },
  { id: "sunbeam", cat: "season", en: "Sunbeam", zh: "光斑", bg: "#F6E7C8", fg: "#6B5436", prompt: "The same pet asleep in a rectangle of sun on the floor, dust in the light, ordinary home" },
  { id: "boxsit", cat: "season", en: "In the box", zh: "纸箱", bg: "#E4D2B8", fg: "#3D2E24", prompt: "The same pet sitting proudly in a slightly too-small cardboard box, living room, classic photo" },
  { id: "florist", cat: "season", en: "Florist", zh: "花店", bg: "#F4E4EA", fg: "#5C6B4A", prompt: "The same pet among buckets of flowers in a small shop, stems, soft color, morning" },
];

if (new Set(TEMPLATES.map((t) => t.id)).size !== TEMPLATES.length || TEMPLATES.length !== 100) {
  throw new Error("template catalog " + TEMPLATES.length);
}

export function tplText(item: { en: string; zh: string }, lang: string) {
  return lang === "zh" ? item.zh : item.en;
}

export function templateById(id: string | null | undefined) {
  return TEMPLATES.find((t) => t.id === id);
}

export function templatePrompt(id: string | null | undefined) {
  return templateById(id)?.prompt;
}
