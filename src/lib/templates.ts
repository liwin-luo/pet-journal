// 模板目录：100 个模板，6 类。提示词与参考引擎验证过的一致。
// 新增模板：在 TEMPLATES 末尾加一条即可（id 唯一，图片放 public/tpl/{id}.jpg）。
export type CatId = "reactions" | "classic" | "holiday" | "covers" | "story" | "seasons";

export interface Tpl {
  id: string;
  cat: CatId;
  name: string;
  blurb: string;
  prompt: string;
  bg: string;
  fg: string;
}

export const CATS: { id: CatId; name: string }[] = [
  { id: "reactions", name: "Reactions" },
  { id: "classic", name: "Classic & Art" },
  { id: "holiday", name: "Holiday" },
  { id: "covers", name: "Posters & Cards" },
  { id: "story", name: "Characters" },
  { id: "seasons", name: "Seasons & Places" },
];

export const TEMPLATES: Tpl[] = [
  { id: "glance", cat: "reactions", name: "Side-eye", blurb: "That famous unimpressed side glance, meme-ready.", prompt: "Close photo of the same pet, head turned slightly, both eyes looking sideways together, unimpressed meme reaction, still clearly that pet", bg: "#C4A882", fg: "#3D2E24" },
  { id: "desk", cat: "reactions", name: "Desk", blurb: "A LinkedIn-style office headshot in a tiny suit.", prompt: "LinkedIn-style headshot of the same pet in a simple suit, chest-up, office blur behind, no paws in frame, polite and slightly tired", bg: "#E7EEF2", fg: "#3D4A55" },
  { id: "delivery", cat: "reactions", name: "Delivery", blurb: "Scooter courier in a little yellow vest, order on the way.", prompt: "The same pet perched naturally on a scooter seat in a tiny yellow delivery vest, bag beside them, not standing like a person", bg: "#F3D36B", fg: "#3D2E24" },
  { id: "sticker", cat: "reactions", name: "Sticker", blurb: "A die-cut sticker with a thick white outline.", prompt: "Cute die-cut sticker of the same pet, thick white outline, slight sideways glance, simple cream background, not an angry scowl", bg: "#F6E3C5", fg: "#E0715C" },
  { id: "blep", cat: "reactions", name: "Blep", blurb: "Tiny tongue tip out, maximum silliness.", prompt: "Close photo of the same pet with a tiny tongue tip out, relaxed silly face, plain wall, phone snapshot", bg: "#F6E3C5", fg: "#3D2E24" },
  { id: "guilty", cat: "reactions", name: "Caught", blurb: "Wide guilty eyes, caught in the act.", prompt: "The same pet caught in the act, wide guilty eyes, crumbs or a tipped cup nearby, candid indoor photo", bg: "#E7D7C8", fg: "#3D2E24" },
  { id: "loaf", cat: "reactions", name: "Loaf", blurb: "Paws tucked, baked into a perfect loaf.", prompt: "The same pet tucked into a neat loaf, paws hidden, calm face toward camera, soft daylight", bg: "#F3E6D4", fg: "#3D2E24" },
  { id: "spa", cat: "reactions", name: "Spa day", blurb: "Towel turban and cucumber slices, full pamper mode.", prompt: "The same pet lying on a towel, tiny towel turban, cucumber slices over the eyes, top-down pamper photo, still that animal", bg: "#F7F1E8", fg: "#6E5A4E" },
  { id: "barber", cat: "reactions", name: "Fresh cut", blurb: "Barber cape on, just-trimmed and proud.", prompt: "The same pet in a barber cape, just-trimmed fur, shop mirror behind, proud and slightly damp, not a person", bg: "#EFE6DA", fg: "#3D2E24" },
  { id: "grill", cat: "reactions", name: "Cookout", blurb: "Tiny apron by the backyard grill, golden hour.", prompt: "The same pet beside a backyard grill in a tiny apron, late-afternoon cookout, still sitting as that animal", bg: "#C46A3A", fg: "#F6EFE2" },
  { id: "doorbell", cat: "reactions", name: "Doorbell", blurb: "Fisheye doorbell-camera still, waiting to be let in.", prompt: "Doorbell-camera still of the same pet looking up into the lens, fisheye, porch light, waiting to be let in", bg: "#2E3438", fg: "#D5DDE4" },

  { id: "royal", cat: "classic", name: "Royal classic", blurb: "Renaissance royal oil portrait in a golden frame.", prompt: "Renaissance royal oil portrait, ornate golden oval frame, dark warm background, centered subject", bg: "#54382C", fg: "#D4A857" },
  { id: "oil", cat: "classic", name: "Classic oil", blurb: "Museum-grade oil painting with rich glaze.", prompt: "Classic museum oil painting portrait, rich glaze, warm dark ground", bg: "#4A3B52", fg: "#D8C8A8" },
  { id: "baroque", cat: "classic", name: "Baroque", blurb: "Dramatic chiaroscuro light, old-master drama.", prompt: "Baroque chiaroscuro oil portrait, dramatic side light", bg: "#3F4A3C", fg: "#E3C88F" },
  { id: "watercolor", cat: "classic", name: "Watercolor", blurb: "Soft washes and paper texture, gentle light.", prompt: "Soft watercolor portrait, warm light washes, paper texture", bg: "#7A9EAB", fg: "#F2EBDD" },
  { id: "pastel", cat: "classic", name: "Pastel dream", blurb: "Chalky pastel daydream, airy and soft.", prompt: "Pastel daydream portrait, chalky color, airy background", bg: "#9E7AAB", fg: "#F2EBDD" },
  { id: "golden", cat: "classic", name: "Golden hour", blurb: "Warm film portrait in low sunset light.", prompt: "Golden hour film portrait, warm skin light, shallow depth", bg: "#C98A4B", fg: "#F6E3C5" },
  { id: "line", cat: "classic", name: "One line", blurb: "Minimal single-line art on cream paper.", prompt: "Minimal single-line art portrait on cream paper", bg: "#8A7A6D", fg: "#FAF6EF" },
  { id: "noir", cat: "classic", name: "Film noir", blurb: "Low-key monochrome mystery, smoky and cool.", prompt: "Film noir portrait, low-key light, mysterious, monochrome warmth", bg: "#26221E", fg: "#C7BBA5" },
  { id: "pop", cat: "classic", name: "Pop art", blurb: "Bold flat pop-art print, gallery contrast.", prompt: "Bold pop art portrait, flat color, high contrast, gallery print", bg: "#E0715C", fg: "#FBEAE5" },
  { id: "pixar", cat: "classic", name: "Animated film", blurb: "Big-eyed 3D character straight from an animated film.", prompt: "Feature-animation 3D character portrait, big expressive eyes, soft studio light", bg: "#5B8DEF", fg: "#EAF1FD" },
  { id: "ink", cat: "classic", name: "Ink wash", blurb: "Spare Chinese ink strokes on rice paper.", prompt: "Chinese ink wash portrait, spare brush strokes, rice paper, lots of empty space", bg: "#3D2E24", fg: "#EFE3D0" },
  { id: "ukiyo", cat: "classic", name: "Woodblock", blurb: "Japanese woodblock print with bold flat outlines.", prompt: "Japanese woodblock print portrait, flat color, bold outline", bg: "#6E2B2B", fg: "#F6EFE2" },
  { id: "anime", cat: "classic", name: "Anime", blurb: "Clean-line anime portrait with vivid flat color.", prompt: "Anime portrait of the same pet, clean line, large expressive eyes, vivid flat color, cream background", bg: "#F4C7D8", fg: "#3A3050" },
  { id: "neon", cat: "classic", name: "Neon night", blurb: "Rainy neon street glow, magenta and cyan.", prompt: "The same pet in rainy neon night light, magenta and cyan glow, wet street bokeh, chest-up portrait", bg: "#1B2430", fg: "#7AD7F0" },
  { id: "memorial", cat: "classic", name: "Keepsake", blurb: "A tender keepsake portrait in soft window light.", prompt: "Gentle keepsake portrait of the same pet, soft window light, quiet background, tender and unhurried", bg: "#E7D3C4", fg: "#5C4638" },
  { id: "sketch", cat: "classic", name: "Sketch", blurb: "Loose watercolor sketch, a few confident lines.", prompt: "Loose watercolor sketch of the same pet, a few confident lines, lots of paper showing", bg: "#F6F1E8", fg: "#3D2E24" },
  { id: "clay", cat: "classic", name: "Clay", blurb: "Handmade clay figurine with visible fingerprints.", prompt: "Handmade clay figurine of the same pet, soft studio light, visible fingerprints, simple base", bg: "#E7C7A8", fg: "#6B4632" },
  { id: "tattoo", cat: "classic", name: "Tattoo flash", blurb: "Old-school tattoo flash, bold line, limited color.", prompt: "Traditional tattoo flash of the same pet, bold black line, limited color, cream paper", bg: "#F7F3EA", fg: "#1E1A17" },
  { id: "marble", cat: "classic", name: "Marble", blurb: "White marble bust under calm museum light.", prompt: "White marble bust of the same pet, museum light, calm classical face, plain stone ground", bg: "#E4E0D8", fg: "#6E675E" },
  { id: "starry", cat: "classic", name: "Starry night", blurb: "Swirling starry sky in thick oil strokes.", prompt: "Oil portrait of the same pet under a swirling starry night sky, thick visible brush, deep blue and gold", bg: "#1E3A5F", fg: "#F2D56B" },
  { id: "garden", cat: "classic", name: "Garden light", blurb: "Impressionist garden scene with dappled sun.", prompt: "Impressionist garden portrait of the same pet, dappled leaves, loose sunny strokes", bg: "#A9C4A0", fg: "#3F4A3C" },
  { id: "deco", cat: "classic", name: "Art deco", blurb: "Geometric gold deco lines on deep green.", prompt: "Art deco poster portrait of the same pet, geometric gold lines, deep green ground, elegant crop", bg: "#1F3A34", fg: "#E3C88F" },
  { id: "botanic", cat: "classic", name: "Botanical", blurb: "Fine botanical plate among labeled leaves.", prompt: "Botanical plate of the same pet among labeled leaves, fine ink and soft wash, cream paper", bg: "#F4F0E4", fg: "#3D4A32" },

  { id: "xmas", cat: "holiday", name: "Christmas card", blurb: "Fireplace bokeh and holiday colors, room for a greeting.", prompt: "Festive Christmas portrait, warm fireplace bokeh, holiday colors, lower third kept simple for greeting text", bg: "#7A1F2B", fg: "#F6EFE2" },
  { id: "birthday", cat: "holiday", name: "Birthday card", blurb: "Party hat, confetti bokeh, joyful pastel ground.", prompt: "Joyful birthday portrait, party hat, confetti bokeh, pastel ground, space at top for text", bg: "#E0715C", fg: "#FBEAE5" },
  { id: "santa", cat: "holiday", name: "Santa paws", blurb: "Santa-inspired costume by a cozy fireplace.", prompt: "Pet in a Santa-inspired costume by a fireplace, cozy holiday light", bg: "#2F5D50", fg: "#F6EFE2" },
  { id: "knit", cat: "holiday", name: "Christmas knit", blurb: "Cozy knitted sweater, soft indoor light.", prompt: "Cozy Christmas knitted sweater portrait, soft indoor light", bg: "#7A1F2B", fg: "#F6EFE2" },
  { id: "lunar", cat: "holiday", name: "Lunar new year", blurb: "Red and gold lanterns, festive and elegant.", prompt: "Lunar new year portrait, red and gold, lantern bokeh, festive but elegant", bg: "#8C2F2F", fg: "#F3D48A" },
  { id: "midautumn", cat: "holiday", name: "Mid-autumn", blurb: "Full moon night with osmanthus and warm lanterns.", prompt: "Mid-autumn night portrait, full moon, osmanthus and warm lantern light", bg: "#3D3A55", fg: "#F6E3C5" },
  { id: "halloween", cat: "holiday", name: "Halloween", blurb: "Pumpkin glow, playful spooky, never scary.", prompt: "Halloween portrait, pumpkin glow, playful not scary, night background", bg: "#2A241C", fg: "#E8A05A" },
  { id: "valentine", cat: "holiday", name: "Valentine", blurb: "Soft rose light and a few petals, romantic.", prompt: "Valentine portrait, soft rose light, a few petals, romantic and simple", bg: "#8A4A55", fg: "#F8E4E0" },
  { id: "newyear", cat: "holiday", name: "New Year's eve", blurb: "Distant fireworks over an evening coat of light.", prompt: "New Year's eve portrait, distant fireworks bokeh, evening coat of light", bg: "#1E2A3A", fg: "#F6E3C5" },
  { id: "harvest", cat: "holiday", name: "Harvest table", blurb: "Pumpkins and wheat at a warm harvest table.", prompt: "The same pet at a harvest table, pumpkins and wheat, warm afternoon, cozy not spooky", bg: "#C98A4B", fg: "#F6E3C5" },
  { id: "easter", cat: "holiday", name: "Spring eggs", blurb: "Pastel eggs and blossoms in soft spring light.", prompt: "The same pet among pastel eggs and blossoms, soft spring light, playful and clean", bg: "#F3E4C8", fg: "#6E8B74" },

  { id: "poster", cat: "covers", name: "Movie poster", blurb: "Cinematic low angle, space for a title.", prompt: "Cinematic movie poster, dramatic low angle, dark ground, bottom quarter clear for a title", bg: "#26221E", fg: "#E8C9A0" },
  { id: "magazine", cat: "covers", name: "Magazine cover", blurb: "Editorial studio cover, masthead-ready top.", prompt: "Editorial magazine cover portrait, clean studio background, top area clear for a masthead", bg: "#4A3B52", fg: "#F2EBDD" },
  { id: "idcard", cat: "covers", name: "Pet ID card", blurb: "Clean front-facing ID portrait, even light.", prompt: "Clean front-facing ID portrait on a plain warm background, even light, centered", bg: "#EFE3D0", fg: "#3D2E24" },
  { id: "album", cat: "covers", name: "Record sleeve", blurb: "Square vinyl sleeve, bold graphic crop.", prompt: "Square vinyl album cover portrait, bold graphic crop, studio light", bg: "#3D2E24", fg: "#E3C88F" },
  { id: "stamp", cat: "covers", name: "Postage stamp", blurb: "Perforated stamp edge, engraved detail.", prompt: "Postage stamp portrait, perforated edge feel, small engraved detail, cream paper", bg: "#F6EFE2", fg: "#7A1F2B" },
  { id: "polaroid", cat: "covers", name: "Polaroid", blurb: "Instant-film flash photo with a white border.", prompt: "Instant-film polaroid portrait, soft flash, white border, casual and close", bg: "#F7F1E6", fg: "#3D2E24" },
  { id: "wanted", cat: "covers", name: "Wanted poster", blurb: "Old-west wanted poster, weathered woodcut.", prompt: "Old west wanted poster portrait, weathered paper, woodcut contrast, space below for type", bg: "#C4A574", fg: "#3D2E24" },
  { id: "passport", cat: "covers", name: "Passport", blurb: "Straight-on passport photo, plain ground.", prompt: "Formal passport-style portrait, plain ground, straight-on, even light", bg: "#6E7A62", fg: "#F6EFE2" },
  { id: "yearbook", cat: "covers", name: "Yearbook", blurb: "Mottled blue backdrop, charmingly awkward.", prompt: "School yearbook photo of the same pet, mottled blue backdrop, straight-on, slight awkward charm", bg: "#D9E2EA", fg: "#2E3A46" },
  { id: "trading", cat: "covers", name: "Trading card", blurb: "Sports card frame, studio flash, stat band clear.", prompt: "Sports trading card of the same pet, bold frame, stat-free bottom band left clear, studio flash", bg: "#F4E7C4", fg: "#7A1F2B" },
  { id: "news", cat: "covers", name: "Front page", blurb: "Halftone newspaper photo with a headline area.", prompt: "Newspaper front-page photo of the same pet, halftone, a clear headline area above, black and warm gray", bg: "#F6F1E6", fg: "#1E1A17" },
  { id: "jersey", cat: "covers", name: "Jersey", blurb: "Numbered jersey, stadium bokeh, proud pose.", prompt: "The same pet in a plain numbered jersey, no logos, stadium bokeh, proud sports portrait", bg: "#1E3A5F", fg: "#F2EBDD" },
  { id: "film", cat: "covers", name: "35mm", blurb: "Gentle film grain, faded color, window light.", prompt: "35mm film still of the same pet, gentle grain, slightly faded color, natural window light", bg: "#C4B6A4", fg: "#2A2622" },
  { id: "vhs", cat: "covers", name: "Home video", blurb: "1990s home-video still with soft scan lines.", prompt: "1990s home-video still of the same pet, soft scan lines, living-room lamp, found-footage charm", bg: "#6E7A62", fg: "#F6EFE2" },
  { id: "pin", cat: "covers", name: "Enamel pin", blurb: "Glossy enamel pin with a hard metal outline.", prompt: "Enamel pin of the same pet, hard outline, flat glossy color, metal edge, plain ground", bg: "#F6EFE2", fg: "#E0715C" },
  { id: "crochet", cat: "covers", name: "Crochet", blurb: "Visible yarn stitches, soft stuffed shape.", prompt: "Crochet portrait of the same pet, visible yarn stitches, soft stuffed shape, warm wool colors", bg: "#E7D8C8", fg: "#6B4632" },

  { id: "astronaut", cat: "story", name: "Astronaut", blurb: "Helmet visor reflecting a quiet cosmos.", prompt: "Astronaut portrait, helmet visor reflection, quiet cosmic background", bg: "#2E3440", fg: "#B8C4D4" },
  { id: "samurai", cat: "story", name: "Samurai", blurb: "Calm honorable pose, armor suggested.", prompt: "Samurai portrait, armor suggested, calm honorable pose, muted background", bg: "#6E2B2B", fg: "#E8C9A0" },
  { id: "knight", cat: "story", name: "Knight", blurb: "Storybook knight in soft armor and banner light.", prompt: "Storybook knight portrait, soft armor, banner light, not a battle scene", bg: "#3F4A3C", fg: "#E3C88F" },
  { id: "pirate", cat: "story", name: "Pirate", blurb: "Friendly pirate coat and hat, warm cabin light.", prompt: "Friendly pirate portrait, coat and hat, warm cabin light", bg: "#3D2E24", fg: "#E8C9A0" },
  { id: "chef", cat: "story", name: "Chef", blurb: "White coat, warm kitchen bokeh, proud and tidy.", prompt: "Chef portrait in a white coat, warm kitchen bokeh, proud and tidy", bg: "#F6EFE2", fg: "#8C2F2F" },
  { id: "detective", cat: "story", name: "Detective", blurb: "Trench-coat mood, rainy window light.", prompt: "Detective portrait, trench-coat mood, rainy window light, noir but gentle", bg: "#2A2622", fg: "#C7BBA5" },
  { id: "wizard", cat: "story", name: "Wizard", blurb: "Robe, soft magic light, whimsical library.", prompt: "Wizard portrait, robe and soft magic light, library background, whimsical", bg: "#3A3050", fg: "#E3C88F" },
  { id: "sailor", cat: "story", name: "Sailor", blurb: "Navy collar and sea horizon, bright daylight.", prompt: "Sailor portrait, navy collar, sea horizon, bright daylight", bg: "#3E5C6E", fg: "#F2EBDD" },
  { id: "scientist", cat: "story", name: "Scientist", blurb: "Lab coat, clean light, curious expression.", prompt: "Scientist portrait, lab coat, clean light, curious expression", bg: "#E7EEF2", fg: "#3D4A55" },
  { id: "musician", cat: "story", name: "Musician", blurb: "Small stage, warm spotlight, instrument nearby.", prompt: "Musician portrait on a small stage, warm spotlight, instrument nearby", bg: "#4A3B52", fg: "#F2EBDD" },
  { id: "hero", cat: "story", name: "Superhero", blurb: "Simple cape, heroic low light, city bokeh.", prompt: "Superhero portrait, simple cape, heroic low light, city bokeh", bg: "#2E3440", fg: "#E0715C" },
  { id: "ballet", cat: "story", name: "Ballet", blurb: "Soft tutu suggestion, graceful stage wash.", prompt: "Ballet portrait, soft tutu suggestion, stage wash of light, graceful", bg: "#F4E6EA", fg: "#6E3A48" },
  { id: "cowboy", cat: "story", name: "Cowboy", blurb: "Tiny hat on a sunny porch, dust and wood.", prompt: "The same pet in a small cowboy hat on a sunny porch, dust and wood, still sitting as that animal", bg: "#C4A574", fg: "#3D2E24" },
  { id: "princess", cat: "story", name: "Storybook", blurb: "Ribbon crown and soft castle light.", prompt: "Storybook portrait of the same pet with a simple ribbon crown, soft castle light, illustrated but recognizable", bg: "#F4E6EA", fg: "#6E3A48" },
  { id: "ninja", cat: "story", name: "Ninja", blurb: "Moonlit garden, quiet and alert.", prompt: "The same pet in a simple dark wrap, moonlit garden, quiet and alert, not a human pose", bg: "#243028", fg: "#C7D0C4" },
  { id: "viking", cat: "story", name: "Viking", blurb: "Small horned helmet, cold sea light.", prompt: "The same pet with a small horned helmet suggestion, cold sea light, sturdy and calm", bg: "#3E4A55", fg: "#E3C88F" },
  { id: "pharaoh", cat: "story", name: "Pharaoh", blurb: "Gold collar on warm sandstone, ceremonial.", prompt: "The same pet with a simple gold collar, warm sandstone, still and ceremonial", bg: "#C4A05A", fg: "#3D2E24" },
  { id: "barista", cat: "story", name: "Barista", blurb: "Behind the counter, steam and morning light.", prompt: "The same pet behind a small coffee counter, steam, morning light, apron, still that animal", bg: "#E7D3C0", fg: "#4A3428" },
  { id: "pilot", cat: "story", name: "Pilot", blurb: "Simple pilot cap, clouds outside the window.", prompt: "The same pet in a simple pilot cap, bright cabin window, clouds outside, chest-up", bg: "#D5DDE4", fg: "#2E3A46" },
  { id: "racer", cat: "story", name: "Racer", blurb: "Racing suit and open helmet, pit-lane bokeh.", prompt: "The same pet in a plain racing suit and open helmet, pit-lane bokeh, no logos", bg: "#C4473A", fg: "#F6EFE2" },
  { id: "rock", cat: "story", name: "Rock show", blurb: "Stage light, amp glow, loud but friendly.", prompt: "The same pet under a small stage light, leather collar, amp glow, loud but friendly", bg: "#241C28", fg: "#E0715C" },
  { id: "farmer", cat: "story", name: "Farmer", blurb: "Denim overalls, morning dust, muddy paws.", prompt: "The same pet in denim overalls on a farm step, morning dust, honest and muddy-pawed", bg: "#C9B48A", fg: "#3F4A3C" },
  { id: "teacher", cat: "story", name: "Classroom", blurb: "Low desk and chalkboard blur, afternoon light.", prompt: "The same pet at a low desk, chalkboard blur, afternoon classroom light", bg: "#E7EEF2", fg: "#3D4A55" },
  { id: "doctor", cat: "story", name: "Clinic", blurb: "White coat, clean clinic light, calm and capable.", prompt: "The same pet in a plain white coat, clean clinic light, calm and capable, no text", bg: "#F4F7F8", fg: "#3D5A62" },
  { id: "librarian", cat: "story", name: "Library", blurb: "Between book stacks under a green lamp.", prompt: "The same pet between book stacks, green lamp, quiet afternoon, one paw on a closed book", bg: "#6E5A48", fg: "#F6EFE2" },
  { id: "yoga", cat: "story", name: "Yoga", blurb: "Natural stretch on a mat, plants and calm.", prompt: "The same pet on a yoga mat in a natural stretch, soft studio, plants, unforced", bg: "#E7E2D6", fg: "#5C6B5A" },

  { id: "spring", cat: "seasons", name: "Spring picnic", blurb: "Blossoms and fresh green, soft daylight.", prompt: "Spring picnic portrait, blossoms, soft daylight, fresh green", bg: "#DCE8C8", fg: "#3F4A3C" },
  { id: "summer", cat: "seasons", name: "Summer shore", blurb: "Bright sea light and an easy breeze.", prompt: "Summer shore portrait, bright sea light, breeze, relaxed", bg: "#7A9EAB", fg: "#F6EFE2" },
  { id: "autumn", cat: "seasons", name: "Autumn woods", blurb: "Fallen leaves and honey-colored light.", prompt: "Autumn woods portrait, fallen leaves, honey light", bg: "#C98A4B", fg: "#F6E3C5" },
  { id: "winter", cat: "seasons", name: "Winter snow", blurb: "Cool snow light, a scarf, quiet background.", prompt: "Winter snow portrait, cool light, scarf, quiet background", bg: "#D5DDE4", fg: "#3D2E24" },
  { id: "rain", cat: "seasons", name: "Rainy window", blurb: "Droplets on glass, warm light indoors.", prompt: "Rainy window portrait, droplets on glass, warm indoor light on the subject", bg: "#5C6B73", fg: "#F2EBDD" },
  { id: "camp", cat: "seasons", name: "Campfire", blurb: "Blanket by a small fire, night trees.", prompt: "The same pet by a small campfire, blanket, night trees, warm face light", bg: "#3A2A22", fg: "#E8A05A" },
  { id: "cafe", cat: "seasons", name: "Cafe seat", blurb: "Window seat, cup nearby, rainy street.", prompt: "The same pet in a cafe window seat, cup nearby, rainy street outside, cozy", bg: "#E7D3C0", fg: "#4A3428" },
  { id: "beret", cat: "seasons", name: "Paris", blurb: "Small beret on a Paris balcony, soft overcast.", prompt: "The same pet in a small beret on a Paris balcony, soft overcast, zinc roofs behind", bg: "#C9D3DC", fg: "#3D2E24" },
  { id: "kimono", cat: "seasons", name: "Kimono", blurb: "Patterned cloth, tatami and paper screens.", prompt: "The same pet in a simple kimono pattern cloth, tatami and paper screen, quiet daylight", bg: "#F3E6EA", fg: "#6E3A48" },
  { id: "hanbok", cat: "seasons", name: "Hanbok", blurb: "Ribbon and cloth, palace courtyard blur.", prompt: "The same pet in a simple hanbok ribbon and cloth, palace courtyard blur, bright and formal", bg: "#F6E3E8", fg: "#7A3048" },
  { id: "sunbeam", cat: "seasons", name: "Sunbeam", blurb: "Asleep in a rectangle of sun, dust in the light.", prompt: "The same pet asleep in a rectangle of sun on the floor, dust in the light, ordinary home", bg: "#F6E7C8", fg: "#6B5436" },
  { id: "boxsit", cat: "seasons", name: "In the box", blurb: "Proudly sitting in a slightly too-small box.", prompt: "The same pet sitting proudly in a slightly too-small cardboard box, living room, classic photo", bg: "#E4D2B8", fg: "#3D2E24" },
  { id: "florist", cat: "seasons", name: "Florist", blurb: "Among buckets of flowers in a small shop.", prompt: "The same pet among buckets of flowers in a small shop, stems, soft color, morning", bg: "#F4E4EA", fg: "#5C6B4A" },
];

export function templateById(id: string | null | undefined): Tpl | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function templatesByCat(cat: CatId | "all"): Tpl[] {
  return cat === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.cat === cat);
}

export function tplImg(id: string): string {
  return `/tpl/${id}.jpg`;
}

if (new Set(TEMPLATES.map((t) => t.id)).size !== TEMPLATES.length) {
  throw new Error("template catalog: duplicate id");
}
