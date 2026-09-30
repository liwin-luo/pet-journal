// 模板目录：100 个模板，6 类。提示词为专业级详细版，覆盖媒介风格 / 主体姿态 / 构图布局 /
// 背景环境 / 光影 / 色调 / 质感 / 情绪等维度，保证生成结果与模板示例图高度一致。
// 新增模板：在 TEMPLATES 末尾加一条即可（id 唯一，图片放 public/tpl/{id}.jpg）。
export type CatId = "reactions" | "classic" | "holiday" | "covers" | "story" | "seasons";

export type Badge = "hot" | "new";

export interface Tpl {
  id: string;
  cat: CatId;
  name: string;
  blurb: string;
  prompt: string;
  bg: string;
  fg: string;
  badge?: Badge;
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
  {
    id: "glance", cat: "reactions", name: "Side-eye", blurb: "That famous unimpressed side glance, meme-ready.",
    prompt: "Candid close-up photo of the same pet from the reference photo, head turned slightly away while both eyes glance sideways at the camera with an unimpressed, meme-worthy expression. Eye-level close-up, face filling the left two-thirds of the frame, shallow depth of field with a softly blurred neutral wall behind. Natural overcast daylight, even and honest, slightly desaturated smartphone look. Muted grey and warm beige palette, sharp focus on the eyes, fine fur detail. Deadpan comedic mood. No text.",
    bg: "#C4A882", fg: "#3D2E24",
  },
  {
    id: "desk", cat: "reactions", name: "Desk", blurb: "A LinkedIn-style office headshot in a tiny suit.",
    prompt: "Corporate LinkedIn-style headshot of the same pet from the reference photo wearing a well-fitted charcoal suit jacket over a white shirt, chest-up and centered, facing the camera with a polite, slightly tired expression. Eye-level 85mm portrait look, shallow depth of field. Blurred modern office background with glass partitions, warm ceiling lights and indistinct desks. Clean frontal office lighting, gentle catchlights in the eyes. Palette of charcoal grey, crisp white and soft blue. Realistic photographic detail. Professional with subtle deadpan humor. No text.",
    bg: "#E7EEF2", fg: "#3D4A55",
  },
  {
    id: "delivery", cat: "reactions", name: "Delivery", blurb: "Scooter courier in a little yellow vest, order on the way.",
    prompt: "Candid street photo of the same pet from the reference photo perched naturally on the seat of a yellow delivery scooter, wearing a tiny bright-yellow delivery vest, an insulated square food bag strapped behind the seat. Full-body side-on composition at eye level, subject centered, urban street melting into warm bokeh behind. Late-afternoon sunlight with long soft shadows and a warm rim light on the fur. Palette of taxi yellow, warm grey and asphalt tones. Realistic candid photography, sharp on the subject. Charming working-pet mood. No text.",
    bg: "#F3D36B", fg: "#3D2E24",
  },
  {
    id: "sticker", cat: "reactions", name: "Sticker", blurb: "A die-cut sticker with a thick white outline.",
    prompt: "Cute die-cut vinyl sticker of the same pet from the reference photo, sitting in a three-quarter view with a slightly sideways, curious glance. Full-body silhouette fully inside the frame, clean thick white sticker outline around the shape, soft drop shadow on a plain warm cream background. Flat evenly lit studio look, smooth glossy vinyl highlights, rounded kawaii shapes with big expressive eyes, pastel fur tones true to the photo. Collectible, charming sticker-sheet mood. No text.",
    bg: "#F6E3C5", fg: "#E0715C",
  },
  {
    id: "blep", cat: "reactions", name: "Blep", blurb: "Tiny tongue tip out, maximum silliness.",
    prompt: "Amusing close-up snapshot of the same pet from the reference photo with just the tip of its tongue sticking out in a tiny blep, relaxed half-lidded silly eyes. Tight eye-level phone-photo framing, head centered and filling most of the frame, plain pastel wall behind. Soft window light from one side, natural colors, slight casual snapshot grain. Warm cream and soft pink palette. Honest, lovable, meme-ready mood. No text.",
    bg: "#F6E3C5", fg: "#3D2E24",
  },
  {
    id: "guilty", cat: "reactions", name: "Caught", blurb: "Wide guilty eyes, caught in the act.",
    prompt: "Candid comedic photo of the same pet from the reference photo caught mid-mischief, wide guilty eyes looking up, body half-crouched as if frozen in the act. Eye-level indoor snapshot, subject centered low in the frame, crumbs and one tipped ceramic cup scattered in the soft-focus foreground as evidence. Warm dim household lamp light, soft shadows. Palette of warm brown, cream and a hint of terracotta. Slightly grainy candid realism. Playful guilty-conscience humor. No text.",
    bg: "#E7D7C8", fg: "#3D2E24",
  },
  {
    id: "loaf", cat: "reactions", name: "Loaf", blurb: "Paws tucked, baked into a perfect loaf.",
    prompt: "Cozy photo of the same pet from the reference photo tucked into a perfect loaf shape with all paws hidden beneath, calm contented face straight at the camera. Eye-level medium shot, subject centered on a warm wooden floor with a pool of soft morning light around it. Gentle window light from the left, smooth soft shadows. Palette of honey wood, cream and warm brown. Crisp fur detail, shallow depth of field. Peaceful, satisfying, wholesome mood. No text.",
    bg: "#F3E6D4", fg: "#3D2E24",
  },
  {
    id: "spa", cat: "reactions", name: "Spa day", blurb: "Towel turban and cucumber slices, full pamper mode.",
    prompt: "Top-down spa-day photo of the same pet from the reference photo lying flat on a fluffy white towel, a tiny rolled towel turban on its head and two cucumber slices resting over its eyes. Straight-down flat-lay composition, subject centered with the towel filling the frame like a spa bed. Bright, even softbox lighting with clean soft highlights. Fresh palette of white, mint green and soft blush. Crisp detail with a glossy magazine-wellness finish. Serene, indulgent, gently funny mood. No text.",
    bg: "#F7F1E8", fg: "#6E5A4E",
  },
  {
    id: "barber", cat: "reactions", name: "Fresh cut", blurb: "Barber cape on, just-trimmed and proud.",
    prompt: "Barbershop portrait of the same pet from the reference photo draped in a striped barber cape, just-trimmed fur looking neat and slightly damp, proud chest-up pose facing the camera. Eye-level composition, subject centered, blurred barbershop mirror and shelf of tools behind. Warm tungsten shop lighting with soft highlights on the cape. Palette of navy stripes, chrome silver and warm wood. Sharp realistic photographic detail. Proud fresh-cut mood with gentle humor. No text.",
    bg: "#EFE6DA", fg: "#3D2E24",
  },
  {
    id: "grill", cat: "reactions", name: "Cookout", blurb: "Tiny apron by the backyard grill, golden hour.",
    prompt: "Late-afternoon cookout photo of the same pet from the reference photo sitting beside a small backyard grill in a tiny barbecue apron, one paw resting on the grill's side table. Full-body composition taken at pet height, subject on the right third, thin smoke drifting softly. Golden-hour sunlight with warm rim light on the fur and a gentle lens flare. Palette of charcoal black, ketchup red and warm amber. Realistic candid photography. Friendly suburban cookout mood. No text.",
    bg: "#C46A3A", fg: "#F6EFE2",
  },
  {
    id: "doorbell", cat: "reactions", name: "Doorbell", blurb: "Fisheye doorbell-camera still, waiting to be let in.",
    prompt: "Doorbell-camera still of the same pet from the reference photo sitting on the porch and staring straight up into the lens, nose exaggeratedly close and slightly distorted by the fisheye view. Centered wide-angle framing with visible edge distortion and vignetting, porch floorboards and door frame behind. Dusk porch light glowing above, cool blue evening ambience with a warm lamp accent. Desaturated night palette with amber highlights, grainy security-camera realism. Patient, slightly dramatic mood. No text.",
    bg: "#2E3438", fg: "#D5DDE4",
  },

  {
    id: "royal", cat: "classic", name: "Royal classic", blurb: "Renaissance royal oil portrait in a golden frame.",
    prompt: "Regal Renaissance royal oil portrait of the same pet from the reference photo, seated upright facing the viewer with a calm commanding gaze, chest-up and centered inside an ornate carved golden oval frame that borders the whole canvas. Dark umber background with faint velvet drapery and a candle glow from the upper left. Warm chiaroscuro lighting: strong key light on the face falling slowly into deep shadow. Palette of deep crimson, antique gold and rich brown, glazed oil texture with fine craquelure. Stately museum atmosphere. No text.",
    bg: "#54382C", fg: "#D4A857",
  },
  {
    id: "oil", cat: "classic", name: "Classic oil", blurb: "Museum-grade oil painting with rich glaze.",
    prompt: "Classic museum oil painting portrait of the same pet from the reference photo, three-quarter head-and-shoulders view turned gently toward the light, dignified expression. Centered composition with generous dark negative space on a warm umber ground, a whisper of landscape shadow behind. Soft single-source light from the upper left with Rembrandt-style falloff. Palette of deep brown, ochre and muted gold, rich glazed layers and visible brushwork. Timeless gallery-wall mood. No text.",
    bg: "#4A3B52", fg: "#D8C8A8",
  },
  {
    id: "baroque", cat: "classic", name: "Baroque", blurb: "Dramatic chiaroscuro light, old-master drama.",
    prompt: "Dramatic Baroque chiaroscuro oil portrait of the same pet from the reference photo, head turned into a beam of strong side light emerging from deep darkness, chest-up filling the right half of the frame. Nearly black background with hints of heavy drapery. Extreme light-to-shadow contrast: sharp highlights along the fur edges, deep crushed shadows. Palette of near-black, warm amber and old gold, thick expressive brush strokes with an old-master finish. Theatrical, powerful mood. No text.",
    bg: "#3F4A3C", fg: "#E3C88F",
  },
  {
    id: "watercolor", cat: "classic", name: "Watercolor", blurb: "Soft washes and paper texture, gentle light.",
    prompt: "Soft watercolor portrait of the same pet from the reference photo, gentle three-quarter pose with head and chest centered, airy white paper breathing around the subject. Loose wet-on-wet washes bleeding softly at the edges, visible cold-press paper texture, a few confident darker accents on the eyes and nose. Diffused bright daylight feel with no harsh shadows. Palette of warm sepia, dusty rose and soft sage washed over cream paper. Light, tender, hand-painted mood. No text.",
    bg: "#7A9EAB", fg: "#F2EBDD",
  },
  {
    id: "pastel", cat: "classic", name: "Pastel dream", blurb: "Chalky pastel daydream, airy and soft.",
    prompt: "Dreamy chalk-pastel portrait of the same pet from the reference photo, soft frontal pose with the head slightly tilted, centered with dreamy negative space. Blended chalky strokes with a powdery texture, edges dissolving into a hazy gradient background. Diffuse glowing light from behind the subject like a soft halo. Palette of blush pink, lilac, baby blue and cream over pastel paper grain. Whimsical daydream mood. No text.",
    bg: "#9E7AAB", fg: "#F2EBDD",
  },
  {
    id: "golden", cat: "classic", name: "Golden hour", blurb: "Warm film portrait in low sunset light.",
    prompt: "Golden-hour film portrait of the same pet from the reference photo, chest-up placed on the left third, gazing into the distance. Warm low sun behind the subject creates a glowing rim light along the fur edges with a soft bounce fill on the face. Background melting into creamy bokeh, shallow depth of field, 85mm lens feel, fine film grain. Palette of honey gold, warm amber and soft brown. Nostalgic, tender, cinematic-warm mood. No text.",
    bg: "#C98A4B", fg: "#F6E3C5",
  },
  {
    id: "line", cat: "classic", name: "One line", blurb: "Minimal single-line art on cream paper.",
    prompt: "Minimal single-line-art portrait of the same pet from the reference photo, face and one flowing paw gesture drawn as one continuous elegant black line, centered on generous cream paper with wide margins. Flat even lighting, pure graphic look with no shading, one confident unbroken stroke with tasteful loops. Only deep ink black on warm cream. Gallery-poster simplicity, clever and chic modern-minimal mood. No text.",
    bg: "#8A7A6D", fg: "#FAF6EF",
  },
  {
    id: "noir", cat: "classic", name: "Film noir", blurb: "Low-key monochrome mystery, smoky and cool.",
    prompt: "Film-noir portrait of the same pet from the reference photo, chest-up emerging from darkness, one side of the face striped by hard venetian-blind light, mysterious sideways gaze. Low-key composition with the subject offset to the left, thin smoke haze drifting through the light beam. Palette of near-black, silver grey and warm sepia highlights, heavy contrast with deep crushed blacks and glossy cinematic grain. Mysterious, smoky detective mood. No text.",
    bg: "#26221E", fg: "#C7BBA5",
  },
  {
    id: "pop", cat: "classic", name: "Pop art", blurb: "Bold flat pop-art print, gallery contrast.",
    prompt: "Bold pop-art portrait of the same pet from the reference photo, frontal pop-icon pose with the head large and centered like a gallery print. Flat vivid color blocks, thick black outlines, halftone dot shading on one side of the face, a solid contrasting background block. Even graphic lighting with no gradients. Palette of hot coral red, cobalt blue, sunshine yellow and cream, screen-print texture. Loud, playful Warhol-gallery mood. No text.",
    bg: "#E0715C", fg: "#FBEAE5",
  },
  {
    id: "pixar", cat: "classic", name: "Animated film", blurb: "Big-eyed 3D character straight from an animated film.",
    prompt: "Feature-animation 3D character portrait of the same pet from the reference photo reimagined as a lovable cartoon hero, big glossy expressive eyes, chest-up and slightly turned, centered. Soft stylized studio lighting with a gentle rim light and subtle subsurface scattering in the fur. Smooth high-quality 3D render with rounded appealing shapes, blurred cozy interior background. Palette of soft caramel, cream and warm grey with saturated accents. Charming, heartwarming animated-film mood. No text.",
    bg: "#5B8DEF", fg: "#EAF1FD",
  },
  {
    id: "ink", cat: "classic", name: "Ink wash", blurb: "Spare Chinese ink strokes on rice paper.",
    prompt: "Chinese ink-wash portrait of the same pet from the reference photo, seated in profile with one ear flicked, painted in sparse confident brush strokes, the composition resting in the lower right third with vast empty rice paper around it. Monochrome sumi-e ink with graduated grey washes in the fur, one small vermilion seal accent, visible paper grain. Soft diffuse light with no shadows. Only ink black, paper cream and a single red seal. Meditative, zen, masterful mood. No text.",
    bg: "#3D2E24", fg: "#EFE3D0",
  },
  {
    id: "ukiyo", cat: "classic", name: "Woodblock", blurb: "Japanese woodblock print with bold flat outlines.",
    prompt: "Japanese ukiyo-e woodblock print portrait of the same pet from the reference photo, formal seated pose, chest-up centered like a classic Edo-period print. Bold flat color areas with crisp dark outlines, layered stylized cloud and wave patterns in the background, visible woodgrain printing texture. Even flat lighting with no gradients. Palette of indigo blue, vermilion red, sumi black and aged cream paper. Elegant, collected, traditional-print mood. No text.",
    bg: "#6E2B2B", fg: "#F6EFE2",
  },
  {
    id: "anime", cat: "classic", name: "Anime", blurb: "Clean-line anime portrait with vivid flat color.",
    prompt: "Clean anime-style portrait of the same pet from the reference photo with large sparkling expressive eyes, chest-up and slightly angled, centered against a simple flat cream background with one soft color accent shape. Crisp line art, cel shading with two-tone shadows, vivid flat colors true to the pet's real markings. Even bright lighting. Palette of warm fur tones, soft pink and cream. Cheerful, energetic anime-key-visual mood. No text.",
    bg: "#F4C7D8", fg: "#3A3050",
  },
  {
    id: "neon", cat: "classic", name: "Neon night", blurb: "Rainy neon street glow, magenta and cyan.",
    prompt: "Cinematic neon-night portrait of the same pet from the reference photo, chest-up placed on the right third in city rain, fur glistening with droplets. Magenta neon-sign glow from the left and cyan glow from the right, wet asphalt reflections and round bokeh of distant signs behind. Deep midnight background, shallow depth of field. Palette of electric magenta, cyan and deep midnight blue. Moody, futuristic blade-runner mood. No text.",
    bg: "#1B2430", fg: "#7AD7F0",
  },
  {
    id: "memorial", cat: "classic", name: "Keepsake", blurb: "A tender keepsake portrait in soft window light.",
    prompt: "Gentle keepsake portrait of the same pet from the reference photo, serene resting pose, chest-up centered in soft diffused window light with a quiet peaceful expression. Muted simple background with a hint of a favourite blanket, shallow depth of field. Soft wraparound light with no harsh shadows and a gentle bloom. Palette of warm ivory, soft grey and pale caramel, fine photographic grain. Tender, loving, memorial-calm mood. No text.",
    bg: "#E7D3C4", fg: "#5C4638",
  },
  {
    id: "sketch", cat: "classic", name: "Sketch", blurb: "Loose watercolor sketch, a few confident lines.",
    prompt: "Loose watercolor-and-ink sketch of the same pet from the reference photo, lively three-quarter pose captured in a few confident pencil lines and quick washes, subject centered small with most of the paper left raw. Visible pencil construction strokes, paint splashes and drips, cold-press paper texture. Bright airy daylight feel. Mostly white paper with warm grey, ochre and one blue accent. Spontaneous artist-studio-sketch mood. No text.",
    bg: "#F6F1E8", fg: "#3D2E24",
  },
  {
    id: "clay", cat: "classic", name: "Clay", blurb: "Handmade clay figurine with visible fingerprints.",
    prompt: "Handmade clay figurine of the same pet from the reference photo, an adorable slightly rounded sculpt seated and facing forward, centered on a simple wooden base against a plain studio background. Soft three-quarter studio lighting with gentle grounding shadows and a macro depth of field. Matte terracotta and cream glaze with visible fingerprints and tool marks, tiny handmade imperfections. Palette of raw terracotta, warm beige and one glazed accent. Handcrafted, wholesome artisan mood. No text.",
    bg: "#E7C7A8", fg: "#6B4632",
  },
  {
    id: "tattoo", cat: "classic", name: "Tattoo flash", blurb: "Old-school tattoo flash, bold line, limited color.",
    prompt: "Traditional tattoo-flash illustration of the same pet from the reference photo, bold frontal head portrait centered like a flash-sheet design. Thick uniform black outlines, limited color shading in red, gold and green, small decorative stars and blank ribbon banners around the subject. Flat even lighting, crisp vector-clean lines on aged cream paper with slight ink bleed. Classic old-school tattoo palette. Bold, iconic parlor-wall mood. No text.",
    bg: "#F7F3EA", fg: "#1E1A17",
  },
  {
    id: "marble", cat: "classic", name: "Marble", blurb: "White marble bust under calm museum light.",
    prompt: "White marble bust of the same pet from the reference photo, calm classical pose on a stone socle, chest-up carved in polished marble, centered against a plain stone wall. Soft directional museum skylight from above, delicate chisel detailing in the fur, subtle translucency in the stone. Palette of warm white marble, pale grey shadow and honey stone ground. Timeless classical-sculpture serenity. No text.",
    bg: "#E4E0D8", fg: "#6E675E",
  },
  {
    id: "starry", cat: "classic", name: "Starry night", blurb: "Swirling starry sky in thick oil strokes.",
    prompt: "Oil portrait of the same pet from the reference photo set under a swirling starry night sky, chest-up on the lower left gazing upward, painted in thick expressive impasto strokes. Rolling spiral clouds and glowing stars fill the upper canvas with a dark cypress-like shape at the edge. Moonlit contrast with luminous yellow halos around the stars. Palette of deep ultramarine, swirling cobalt and vivid golden yellow. Emotional post-impressionist wonder. No text.",
    bg: "#1E3A5F", fg: "#F2D56B",
  },
  {
    id: "garden", cat: "classic", name: "Garden light", blurb: "Impressionist garden scene with dappled sun.",
    prompt: "Impressionist garden portrait of the same pet from the reference photo, relaxed among blooming flower beds, chest-up centered with dappled sunlight through leaves falling on the fur. Loose broken brush strokes, vibrating complementary colors, blossoms dissolving into dabs of paint, no hard outlines. Bright summer-afternoon light. Palette of leafy green, lavender, sun yellow and warm cream. Joyful Monet-garden mood. No text.",
    bg: "#A9C4A0", fg: "#3F4A3C",
  },
  {
    id: "deco", cat: "classic", name: "Art deco", blurb: "Geometric gold deco lines on deep green.",
    prompt: "Art-deco poster portrait of the same pet from the reference photo, elegant frontal pose framed by geometric gold sunburst arcs and stepped symmetrical borders, regal chest-up composition centered. Flat graphic shapes, crisp gold linework, deep green ground with a subtle geometric pattern. Even stylized lighting with no gradients. Palette of emerald green, luxurious gold and cream. Sophisticated 1920s poster elegance. No text.",
    bg: "#1F3A34", fg: "#E3C88F",
  },
  {
    id: "botanic", cat: "classic", name: "Botanical", blurb: "Fine botanical plate among labeled leaves.",
    prompt: "Vintage botanical-plate illustration of the same pet from the reference photo, seated among finely drawn leaves and stems, centered on aged cream paper like a scientific plate with delicate blank caption lines beneath. Fine ink outlines with soft scientific watercolor washes, small numbered vignettes of a paw and an ear in the corners. Even naturalist lighting. Palette of muted sage, sepia ink and cream paper. Curious Victorian-naturalist mood. No text.",
    bg: "#F4F0E4", fg: "#3D4A32",
  },

  {
    id: "xmas", cat: "holiday", name: "Christmas card", blurb: "Fireplace bokeh and holiday colors, room for a greeting.",
    prompt: "Festive Christmas portrait of the same pet from the reference photo, chest-up centered before a glowing fireplace dressed with garlands and warm fairy lights, red and green ornaments softly blurred into bokeh. Warm fireside key light from the left with twinkling amber bokeh behind. Palette of cranberry red, pine green, gold and warm brown, cozy knitted texture accents, photographic detail. Joyful holiday-card mood with the lower third kept simple for a greeting. No text.",
    bg: "#7A1F2B", fg: "#F6EFE2",
  },
  {
    id: "birthday", cat: "holiday", name: "Birthday card", blurb: "Party hat, confetti bokeh, joyful pastel ground.",
    prompt: "Joyful birthday portrait of the same pet from the reference photo wearing a tiny party hat, chest-up centered with confetti frozen mid-fall around the head. Soft pastel ground with balloons and streamers blurred into bokeh behind, subject tack sharp. Bright cheerful studio light with sparkle accents. Palette of coral, butter yellow, mint and cream. Playful celebration mood with the top area left clear for a message. No text.",
    bg: "#E0715C", fg: "#FBEAE5",
  },
  {
    id: "santa", cat: "holiday", name: "Santa paws", blurb: "Santa-inspired costume by a cozy fireplace.",
    prompt: "Cozy holiday portrait of the same pet from the reference photo in a Santa-inspired red velvet costume with white fur trim and a tiny hat, seated by a crackling fireplace, chest-up centered. Warm flickering firelight from below-left, glowing garland and tree-light bokeh behind. Palette of deep red, snowy white trim and warm chestnut. Soft photographic detail with a gentle glow. Generous Santa-paws mood. No text.",
    bg: "#2F5D50", fg: "#F6EFE2",
  },
  {
    id: "knit", cat: "holiday", name: "Christmas knit", blurb: "Cozy knitted sweater, soft indoor light.",
    prompt: "Cozy Christmas portrait of the same pet from the reference photo wearing a hand-knitted red sweater with white snowflake patterns, frontal chest-up pose on a cream sofa. Soft warm indoor lamp light from the side, gentle shadows, creamy bokeh. Palette of cranberry red, snow white and warm cream. Visible wool stitching and soft fur detail. Snug, affectionate winter mood. No text.",
    bg: "#7A1F2B", fg: "#F6EFE2",
  },
  {
    id: "lunar", cat: "holiday", name: "Lunar new year", blurb: "Red and gold lanterns, festive and elegant.",
    prompt: "Festive Lunar New Year portrait of the same pet from the reference photo, chest-up centered among hanging red lanterns with gold coins and blossom branches softly blurred behind. Warm lantern glow from above, rich golden ambience. Palette of auspicious red, imperial gold and deep brown. Elegant photographic detail with festive bokeh. Prosperous, celebratory, refined mood. No text.",
    bg: "#8C2F2F", fg: "#F3D48A",
  },
  {
    id: "midautumn", cat: "holiday", name: "Mid-autumn", blurb: "Full moon night with osmanthus and warm lanterns.",
    prompt: "Mid-autumn night portrait of the same pet from the reference photo, chest-up on the lower third gazing at a huge glowing full moon high in the sky, osmanthus branches and warm paper lanterns framing the edges. Cool moonlight mixed with warm lantern accents and a soft mist. Palette of deep indigo night, silver moon glow and warm amber lantern light. Poetic, tranquil reunion mood. No text.",
    bg: "#3D3A55", fg: "#F6E3C5",
  },
  {
    id: "halloween", cat: "holiday", name: "Halloween", blurb: "Pumpkin glow, playful spooky, never scary.",
    prompt: "Playful Halloween portrait of the same pet from the reference photo in a tiny witch or pumpkin-themed costume, chest-up centered among glowing jack-o'-lanterns with soft purple night mist behind. Warm pumpkin-glow light from below with candle flicker. Palette of pumpkin orange, deep purple and black. Detailed but friendly, never scary. Spooky-cute holiday mood. No text.",
    bg: "#2A241C", fg: "#E8A05A",
  },
  {
    id: "valentine", cat: "holiday", name: "Valentine", blurb: "Soft rose light and a few petals, romantic.",
    prompt: "Romantic Valentine portrait of the same pet from the reference photo, chest-up centered in soft rose-toned light with a few petals floating gently around. Dreamy blush background with heart-shaped bokeh accents blurred behind. Diffuse warm glow from the front with soft-focus edges. Palette of rose pink, deep red and cream. Tender love-letter mood. No text.",
    bg: "#8A4A55", fg: "#F8E4E0",
  },
  {
    id: "newyear", cat: "holiday", name: "New Year's eve", blurb: "Distant fireworks over an evening coat of light.",
    prompt: "New Year's Eve portrait of the same pet from the reference photo, chest-up on the lower third in an elegant evening setting while distant fireworks burst across the night sky. Cool night ambience with a warm golden firework glow rim-lighting the fur, sparkling bokeh sparks. Palette of midnight blue, gold and silver. Sparkling, hopeful celebration mood. No text.",
    bg: "#1E2A3A", fg: "#F6E3C5",
  },
  {
    id: "harvest", cat: "holiday", name: "Harvest table", blurb: "Pumpkins and wheat at a warm harvest table.",
    prompt: "Harvest-table portrait of the same pet from the reference photo sitting proudly behind pumpkins, wheat sheaves and autumn gourds, chest-up centered with a rustic barn softly blurred behind. Warm late-afternoon golden-hour light. Palette of pumpkin orange, wheat gold, deep russet and cream. Cozy, abundant autumn mood, cozy not spooky. No text.",
    bg: "#C98A4B", fg: "#F6E3C5",
  },
  {
    id: "easter", cat: "holiday", name: "Spring eggs", blurb: "Pastel eggs and blossoms in soft spring light.",
    prompt: "Spring Easter portrait of the same pet from the reference photo nestled among pastel-painted eggs and fresh blossom branches, chest-up centered against a soft clean background. Bright diffused spring daylight, airy and light. Palette of pastel blue, soft pink, eggshell cream and fresh green. Crisp cheerful photography. Playful, clean spring mood. No text.",
    bg: "#F3E4C8", fg: "#6E8B74",
  },

  {
    id: "poster", cat: "covers", name: "Movie poster", blurb: "Cinematic low angle, space for a title.",
    prompt: "Cinematic movie-poster portrait of the same pet from the reference photo, heroic slightly low-angle shot, chest-up rising from the bottom of the frame with an intense gaze past the camera. Dramatic dark ground with atmospheric smoke and strong rim lighting outlining the fur, high contrast. Palette of charcoal black, ember orange and steel blue, glossy blockbuster finish. The bottom quarter of the frame kept clear of detail for a title. Epic trailer mood. No text.",
    bg: "#26221E", fg: "#E8C9A0",
  },
  {
    id: "magazine", cat: "covers", name: "Magazine cover", blurb: "Editorial studio cover, masthead-ready top.",
    prompt: "Editorial magazine-cover portrait of the same pet from the reference photo, confident frontal pose, chest-up centered against a seamless studio backdrop in a solid muted tone. Clean professional softbox lighting, crisp detail, a subtle shadow under the chin. Palette of warm taupe, cream and one bold accent color. High-end fashion-photography polish with the top third kept clear for a masthead. No text.",
    bg: "#4A3B52", fg: "#F2EBDD",
  },
  {
    id: "idcard", cat: "covers", name: "Pet ID card", blurb: "Clean front-facing ID portrait, even light.",
    prompt: "Clean ID-card style portrait of the same pet from the reference photo, perfectly frontal and centered, ears symmetric, neutral expression, head and chest filling the middle of the frame against a plain warm light-grey official background. Flat even bureaucratic lighting with no shadows, passport-photo realism, razor-sharp focus. Neutral palette of light grey, cream and natural fur tones. Deadpan official-document humor. No text.",
    bg: "#EFE3D0", fg: "#3D2E24",
  },
  {
    id: "album", cat: "covers", name: "Record sleeve", blurb: "Square vinyl sleeve, bold graphic crop.",
    prompt: "Square vinyl-record-sleeve portrait of the same pet from the reference photo, bold graphic chest-up crop slightly off-center, moody studio light with a single colored gel. Minimal dark background with subtle grain, high contrast, iconic album-cover framing. Palette of deep black, burnt orange and cream. Retro-cool liner-note mood in a strict 1:1 composition. No text.",
    bg: "#3D2E24", fg: "#E3C88F",
  },
  {
    id: "stamp", cat: "covers", name: "Postage stamp", blurb: "Perforated stamp edge, engraved detail.",
    prompt: "Commemorative postage-stamp portrait of the same pet from the reference photo, dignified chest-up pose centered inside a perforated stamp edge with realistic punched holes. Subtle engraved hatching in the fur, aged cream paper with fine print texture and one muted accent hue. Flat even lighting. Palette of sepia, sage and cream. Collectible national-postage dignity. No text.",
    bg: "#F6EFE2", fg: "#7A1F2B",
  },
  {
    id: "polaroid", cat: "covers", name: "Polaroid", blurb: "Instant-film flash photo with a white border.",
    prompt: "Instant-film polaroid photo of the same pet from the reference photo, casual close chest-up snapshot with soft direct flash, centered inside the classic white polaroid frame with its thicker bottom border. Gentle flash falloff, slightly washed highlights, warm nostalgic color shift, subtle film grain. Palette of faded warm tones over cream. Candid home-memory mood. No text.",
    bg: "#F7F1E6", fg: "#3D2E24",
  },
  {
    id: "wanted", cat: "covers", name: "Wanted poster", blurb: "Old-west wanted poster, weathered woodcut.",
    prompt: "Old-west wanted-poster portrait of the same pet from the reference photo with a stern frontier gaze, chest-up centered on weathered paper with burnt edges, woodcut-style contrast shading, the lower area of the poster left clear. Warm lamplight feel, sepia monochrome with aged stains and paper folds. Palette of dusty brown, aged cream and ink black. Rough 1880s frontier humor. No text.",
    bg: "#C4A574", fg: "#3D2E24",
  },
  {
    id: "passport", cat: "covers", name: "Passport", blurb: "Straight-on passport photo, plain ground.",
    prompt: "Formal passport-photo portrait of the same pet from the reference photo, perfectly straight-on centered pose with a neutral expression, even shadowless lighting on a plain white background, head sized to official proportions. Flat documentary realism, razor-sharp focus, no vignette. Neutral palette of white, soft grey and natural fur tones. Quiet official-document humor. No text.",
    bg: "#6E7A62", fg: "#F6EFE2",
  },
  {
    id: "yearbook", cat: "covers", name: "Yearbook", blurb: "Mottled blue backdrop, charmingly awkward.",
    prompt: "School yearbook photo of the same pet from the reference photo, straight-on chest-up pose with a slight awkward charm, centered against a classic mottled blue-grey studio backdrop. Even soft studio lighting with a gentle vignette, retro 90s finish and a slight fade. Palette of dusty blue, grey and warm fur tones. Nostalgic school-photo mood. No text.",
    bg: "#D9E2EA", fg: "#2E3A46",
  },
  {
    id: "trading", cat: "covers", name: "Trading card", blurb: "Sports card frame, studio flash, stat band clear.",
    prompt: "Sports trading-card portrait of the same pet from the reference photo, dynamic heroic pose, chest-up centered inside a bold glossy card frame with bright accent borders. Studio flash lighting with crisp specular highlights, stadium crowd melted into golden bokeh far behind. Saturated colors, sharp detail. Palette of team red, gold and a cream card frame, the bottom stat band left clear. Collector-card excitement. No text.",
    bg: "#F4E7C4", fg: "#7A1F2B",
  },
  {
    id: "news", cat: "covers", name: "Front page", blurb: "Halftone newspaper photo with a headline area.",
    prompt: "Newspaper front-page photo of the same pet from the reference photo, documentary chest-up shot with a halftone dot print texture across the whole image, black-and-warm-grey monochrome, a clear empty headline band above. Honest press-photography lighting, slight newsprint ink bleed. Palette of newsprint cream, ink black and warm grey. Historic-headline mood. No text.",
    bg: "#F6F1E6", fg: "#1E1A17",
  },
  {
    id: "jersey", cat: "covers", name: "Jersey", blurb: "Numbered jersey, stadium bokeh, proud pose.",
    prompt: "Sports-jersey portrait of the same pet from the reference photo wearing a plain numbered athletic jersey, proud chest-up pose from a slightly low hero angle, stadium crowd melted into golden bokeh behind. Evening floodlight glow from above with crisp subject focus. Palette of deep navy, white and warm gold. Game-day champion mood, no readable logos. No text.",
    bg: "#1E3A5F", fg: "#F2EBDD",
  },
  {
    id: "film", cat: "covers", name: "35mm", blurb: "Gentle film grain, faded color, window light.",
    prompt: "35mm film still of the same pet from the reference photo, natural chest-up pose by a window, gentle analog grain and slightly faded color with soft halation on the highlights. Warm daylight from the side, shallow depth of field, organic Kodak-tone palette of honey, cream and muted green. Authentic, unposed home-movie mood. No text.",
    bg: "#C4B6A4", fg: "#2A2622",
  },
  {
    id: "vhs", cat: "covers", name: "Home video", blurb: "1990s home-video still with soft scan lines.",
    prompt: "1990s home-video still of the same pet from the reference photo, candid living-room pose with soft scan lines and slight chromatic bleeding across the frame, warm lamp glow behind, no timestamp. Dim cozy indoor lighting with a VHS color shift. Palette of washed magenta, teal and warm cream. Nostalgic found-footage charm. No text.",
    bg: "#6E7A62", fg: "#F6EFE2",
  },
  {
    id: "pin", cat: "covers", name: "Enamel pin", blurb: "Glossy enamel pin with a hard metal outline.",
    prompt: "Enamel-pin design of the same pet from the reference photo, cute simplified head portrait centered inside a hard metal cloisonné outline, flat glossy enamel color fills with tiny metal highlights on a plain warm ground. Even flat lighting with no gradients, crisp die-cast edges. Palette of gold metal, coral, cream and one teal accent. Collectible lapel-pin charm. No text.",
    bg: "#F6EFE2", fg: "#E0715C",
  },
  {
    id: "crochet", cat: "covers", name: "Crochet", blurb: "Visible yarn stitches, soft stuffed shape.",
    prompt: "Handmade crochet portrait of the same pet from the reference photo as an adorable amigurumi figure, seated facing forward, centered on a soft neutral background. Soft diffused craft lighting with a macro focus on visible yarn stitches and fluffy wool texture, gentle handmade imperfection. Palette of warm wool cream, caramel and dusty coral. Cozy, gift-worthy craft mood. No text.",
    bg: "#E7D8C8", fg: "#6B4632",
  },

  {
    id: "astronaut", cat: "story", name: "Astronaut", blurb: "Helmet visor reflecting a quiet cosmos.",
    prompt: "Astronaut portrait of the same pet from the reference photo in a detailed white space suit, chest-up inside a helmet with the reflection of distant stars and a colorful nebula on the visor, centered against quiet deep space. Cool rim light from the helmet lamps plus a soft interior glow. Palette of space-suit white, glass blue and cosmic violet-black. Awe-filled, serene cosmic-explorer mood. No text.",
    bg: "#2E3440", fg: "#B8C4D4",
  },
  {
    id: "samurai", cat: "story", name: "Samurai", blurb: "Calm honorable pose, armor suggested.",
    prompt: "Samurai portrait of the same pet from the reference photo in refined lacquered armor with a straw kasa hat suggestion, calm honorable chest-up pose facing the camera, a misty courtyard softly blurred behind. Soft overcast light with a gentle rim, painterly depth. Palette of lacquer black, deep crimson and aged gold. Disciplined, poetic warrior mood. No text.",
    bg: "#6E2B2B", fg: "#E8C9A0",
  },
  {
    id: "knight", cat: "story", name: "Knight", blurb: "Storybook knight in soft armor and banner light.",
    prompt: "Storybook knight portrait of the same pet from the reference photo in softly polished silver armor with a tiny plumed helm, chest-up centered before a blurred castle banner. Warm golden key light with soft shadows and illuminated-manuscript warmth. Palette of polished silver, banner crimson and meadow green. Brave, gentle fairytale mood, no battle scene. No text.",
    bg: "#3F4A3C", fg: "#E3C88F",
  },
  {
    id: "pirate", cat: "story", name: "Pirate", blurb: "Friendly pirate coat and hat, warm cabin light.",
    prompt: "Friendly pirate portrait of the same pet from the reference photo in a weathered tricorn hat and coat, chest-up on a ship deck with rigging softly blurred behind and a warm lantern glowing to the right. Golden cabin-glow key light with a sea-breeze feel. Palette of ocean teal, worn brown leather and antique gold. Adventurous, swashbuckling-good-humor mood. No text.",
    bg: "#3D2E24", fg: "#E8C9A0",
  },
  {
    id: "chef", cat: "story", name: "Chef", blurb: "White coat, warm kitchen bokeh, proud and tidy.",
    prompt: "Chef portrait of the same pet from the reference photo in a crisp white double-breasted chef coat and a small toque, chest-up centered before a warmly blurred professional kitchen with hanging copper pans. Warm kitchen bokeh from behind with a clean frontal fill light. Palette of chef white, copper gold and warm brown. Proud, tidy, deliciously busy mood. No text.",
    bg: "#F6EFE2", fg: "#8C2F2F",
  },
  {
    id: "detective", cat: "story", name: "Detective", blurb: "Trench-coat mood, rainy window light.",
    prompt: "Detective portrait of the same pet from the reference photo in a tan trench coat, chest-up beside a rain-streaked window with moody city lights smeared into bokeh behind the glass. Noir but gentle: soft window key light, a warm desk-lamp accent, misty contrast. Palette of rain grey, tan and warm amber. Thoughtful, quiet casework mood. No text.",
    bg: "#2A2622", fg: "#C7BBA5",
  },
  {
    id: "wizard", cat: "story", name: "Wizard", blurb: "Robe, soft magic light, whimsical library.",
    prompt: "Wizard portrait of the same pet from the reference photo in a star-dusted robe and a slightly oversized pointed hat, chest-up in an ancient library with floating dust motes and a soft magical glow around the paws. Warm candlelight mixed with a cool magical accent light. Palette of robe indigo, parchment gold and candle amber. Whimsical, wise storybook charm. No text.",
    bg: "#3A3050", fg: "#E3C88F",
  },
  {
    id: "sailor", cat: "story", name: "Sailor", blurb: "Navy collar and sea horizon, bright daylight.",
    prompt: "Sailor portrait of the same pet from the reference photo in a crisp navy sailor collar, chest-up centered against a bright sea horizon and clear sky with the breeze lifting the fur. Bright natural daylight with clean highlights. Palette of navy, sea blue, white and sun cream. Fresh, honest, salty-air mood. No text.",
    bg: "#3E5C6E", fg: "#F2EBDD",
  },
  {
    id: "scientist", cat: "story", name: "Scientist", blurb: "Lab coat, clean light, curious expression.",
    prompt: "Scientist portrait of the same pet from the reference photo in a neat white lab coat and tiny safety glasses, chest-up centered in a clean bright laboratory with softly blurred glassware behind. Cool clean lighting with a warm accent from a bench lamp. Palette of lab white, glass blue and warm beige fur tones. Curious, precise, gently amusing mood. No text.",
    bg: "#E7EEF2", fg: "#3D4A55",
  },
  {
    id: "musician", cat: "story", name: "Musician", blurb: "Small stage, warm spotlight, instrument nearby.",
    prompt: "Musician portrait of the same pet from the reference photo on a small stage, chest-up centered under a warm spotlight with an instrument softly out of focus nearby and a dark intimate club behind. Warm spotlight from above with a soft rim light and dust drifting in the beam. Palette of stage amber, deep brown and soft violet shadows. Soulful late-set mood. No text.",
    bg: "#4A3B52", fg: "#F2EBDD",
  },
  {
    id: "hero", cat: "story", name: "Superhero", blurb: "Simple cape, heroic low light, city bokeh.",
    prompt: "Superhero portrait of the same pet from the reference photo in a simple elegant cape, heroic low-angle chest-up pose against a dusk city skyline bokeh, the cape lifted by the wind. Dramatic rim light plus a cool city glow with confident contrast. Palette of midnight blue, cape crimson and city amber. Inspiring guardian mood. No text.",
    bg: "#2E3440", fg: "#E0715C",
  },
  {
    id: "ballet", cat: "story", name: "Ballet", blurb: "Soft tutu suggestion, graceful stage wash.",
    prompt: "Ballet portrait of the same pet from the reference photo in a soft tulle suggestion, graceful upright pose, chest-up centered on a dim stage washed with gentle rose light and a soft haze in the beams. Theatrical side light with a delicate rim and dreamy bloom. Palette of blush pink, stage ivory and shadow mauve. Graceful, delicate performance mood. No text.",
    bg: "#F4E6EA", fg: "#6E3A48",
  },
  {
    id: "cowboy", cat: "story", name: "Cowboy", blurb: "Tiny hat on a sunny porch, dust and wood.",
    prompt: "Old-frontier portrait of the same pet from the reference photo in a small cowboy hat, chest-up on a sunlit wooden porch with posts and drifting dust motes, a relaxed squint into the warm light. Golden-hour side light with a dusty haze. Palette of denim blue, saddle-leather brown and straw gold. Easy, laconic ranch mood. No text.",
    bg: "#C4A574", fg: "#3D2E24",
  },
  {
    id: "princess", cat: "story", name: "Storybook", blurb: "Ribbon crown and soft castle light.",
    prompt: "Storybook princess portrait of the same pet from the reference photo wearing a delicate ribbon crown, chest-up centered in soft castle light with gauzy curtains, an illustrated-but-recognizable finish. Soft pastel glow with gentle bloom. Palette of rose, pearl and soft gold. Sweet, gentle fairytale mood. No text.",
    bg: "#F4E6EA", fg: "#6E3A48",
  },
  {
    id: "ninja", cat: "story", name: "Ninja", blurb: "Moonlit garden, quiet and alert.",
    prompt: "Ninja portrait of the same pet from the reference photo in a simple dark wrap with bright alert eyes, chest-up placed low in the frame against a moonlit garden with bamboo softly silvered behind. Cool moonlight with deep shadows. Minimal palette of charcoal, moon silver and leaf green. Quiet, alert, stealthy-elegant mood. No text.",
    bg: "#243028", fg: "#C7D0C4",
  },
  {
    id: "viking", cat: "story", name: "Viking", blurb: "Small horned helmet, cold sea light.",
    prompt: "Viking portrait of the same pet from the reference photo with a small horned-helmet suggestion, sturdy calm chest-up pose, cold northern sea light with a longship silhouette blurred at the shore. Overcast steel light with a warm fur accent. Palette of sea grey, fur brown and iron silver. Sturdy, unbothered explorer mood. No text.",
    bg: "#3E4A55", fg: "#E3C88F",
  },
  {
    id: "pharaoh", cat: "story", name: "Pharaoh", blurb: "Gold collar on warm sandstone, ceremonial.",
    prompt: "Ancient Egyptian royal portrait of the same pet from the reference photo wearing a simple gold collar, still ceremonial chest-up pose before warm sandstone columns with hieroglyph shadows softly carved behind. Warm desert sun from the side with golden dust in the air. Palette of sandstone gold, a lapis-blue accent and warm bronze. Timeless regal mood. No text.",
    bg: "#C4A05A", fg: "#3D2E24",
  },
  {
    id: "barista", cat: "story", name: "Barista", blurb: "Behind the counter, steam and morning light.",
    prompt: "Barista portrait of the same pet from the reference photo behind a small coffee counter in a canvas apron, chest-up centered with a cup of steaming coffee nearby, morning light through the café window and a rainy street softly blurred outside. Warm morning side light with the steam catching the glow. Palette of espresso brown, apron cream and window silver. Cozy neighborhood-roast mood. No text.",
    bg: "#E7D3C0", fg: "#4A3428",
  },
  {
    id: "pilot", cat: "story", name: "Pilot", blurb: "Simple pilot cap, clouds outside the window.",
    prompt: "Pilot portrait of the same pet from the reference photo in a simple pilot cap, chest-up beside a bright cabin window with clouds streaming past and a calm confident look. Cool high-altitude daylight with a soft warm cabin fill. Palette of cabin cream, sky blue and cap navy. Above-the-clouds calm mood. No text.",
    bg: "#D5DDE4", fg: "#2E3A46",
  },
  {
    id: "racer", cat: "story", name: "Racer", blurb: "Racing suit and open helmet, pit-lane bokeh.",
    prompt: "Racing-driver portrait of the same pet from the reference photo in a plain racing suit with the visor of an open helmet lifted, chest-up from a slightly low angle, pit-lane bokeh with team lights behind. Sharp garage lighting with specular highlights on the suit. Palette of racing red, carbon black and cream. Focused qualifying mood, no logos. No text.",
    bg: "#C4473A", fg: "#F6EFE2",
  },
  {
    id: "rock", cat: "story", name: "Rock show", blurb: "Stage light, amp glow, loud but friendly.",
    prompt: "Rock-show portrait of the same pet from the reference photo under a single small stage light, chest-up with a leather collar, amp glow and light haze behind, caught mid-performance. Loud warm spotlight with deep shadows and a subtle lens flare. Palette of stage amber, leather black and ember red. Friendly, electric encore mood. No text.",
    bg: "#241C28", fg: "#E0715C",
  },
  {
    id: "farmer", cat: "story", name: "Farmer", blurb: "Denim overalls, morning dust, muddy paws.",
    prompt: "Farmer portrait of the same pet from the reference photo in tiny denim overalls, chest-up on a weathered farm step with morning dust and straw drifting in the air, honest slightly muddy paws. Early golden light with a soft haze. Palette of denim blue, barn red and straw gold. Wholesome hardworking mood. No text.",
    bg: "#C9B48A", fg: "#3F4A3C",
  },
  {
    id: "teacher", cat: "story", name: "Classroom", blurb: "Low desk and chalkboard blur, afternoon light.",
    prompt: "Classroom portrait of the same pet from the reference photo at a low desk, chest-up turned slightly away from a chalkboard blur, warm afternoon classroom light streaming through venetian blinds. Nostalgic chalk-dust glow. Palette of chalk green, wood brown and warm cream. Patient, beloved-teacher mood. No text.",
    bg: "#E7EEF2", fg: "#3D4A55",
  },
  {
    id: "doctor", cat: "story", name: "Clinic", blurb: "White coat, clean clinic light, calm and capable.",
    prompt: "Clinic portrait of the same pet from the reference photo in a plain white coat with a stethoscope suggestion, chest-up centered in clean bright clinic light with a calm capable expression, soft blurred medical shelves behind. Even clinical lighting with gentle shadows. Palette of coat white, teal scrubs and warm fur tones. Trustworthy, gentle-healer mood. No text.",
    bg: "#F4F7F8", fg: "#3D5A62",
  },
  {
    id: "librarian", cat: "story", name: "Library", blurb: "Between book stacks under a green lamp.",
    prompt: "Library portrait of the same pet from the reference photo between tall wooden book stacks, chest-up with one paw resting on a closed book, a green shaded lamp glowing warmly. Quiet afternoon light shafts through the dust. Palette of oak brown, lamp green and paper cream. Cozy, wise, hushed-afternoon mood. No text.",
    bg: "#6E5A48", fg: "#F6EFE2",
  },
  {
    id: "yoga", cat: "story", name: "Yoga", blurb: "Natural stretch on a mat, plants and calm.",
    prompt: "Yoga portrait of the same pet from the reference photo in a natural relaxed stretch on a mat, full-body side composition centered low, a soft studio with plants and warm wood behind. Soft diffused daylight with calm shadows. Palette of mat sage, plant green and warm cream. Unforced, mindful, gently funny mood. No text.",
    bg: "#E7E2D6", fg: "#5C6B5A",
  },

  {
    id: "spring", cat: "seasons", name: "Spring picnic", blurb: "Blossoms and fresh green, soft daylight.",
    prompt: "Spring picnic portrait of the same pet from the reference photo sitting on a checkered blanket under blossoming trees, chest-up centered with petals drifting softly around. Fresh soft daylight with a gentle backlight through pink blossoms. Palette of blossom pink, fresh green and cream. Renewed, airy spring mood. No text.",
    bg: "#DCE8C8", fg: "#3F4A3C",
  },
  {
    id: "summer", cat: "seasons", name: "Summer shore", blurb: "Bright sea light and an easy breeze.",
    prompt: "Summer shore portrait of the same pet from the reference photo, chest-up on bright sand with the sea line behind, fur lifted by the breeze and a relaxed happy expression. Bright high sun with sparkling water bokeh. Palette of sea turquoise, sand cream and sky blue. Free, breezy vacation mood. No text.",
    bg: "#7A9EAB", fg: "#F6EFE2",
  },
  {
    id: "autumn", cat: "seasons", name: "Autumn woods", blurb: "Fallen leaves and honey-colored light.",
    prompt: "Autumn woods portrait of the same pet from the reference photo, chest-up among fallen maple leaves with warm honey light filtering through amber trees and leaves drifting down. Golden-hour side light with a soft glow. Palette of russet, honey gold, deep copper and cream. Nostalgic leaf-peeping mood. No text.",
    bg: "#C98A4B", fg: "#F6E3C5",
  },
  {
    id: "winter", cat: "seasons", name: "Winter snow", blurb: "Cool snow light, a scarf, quiet background.",
    prompt: "Winter snow portrait of the same pet from the reference photo wearing a soft scarf, chest-up centered in gently falling snow against a quiet pale background with hints of frosted trees. Cool overcast snow light with a warm scarf accent and visible breath warmth. Palette of snow white, ice blue and scarf crimson. Quiet, cozy-cold mood. No text.",
    bg: "#D5DDE4", fg: "#3D2E24",
  },
  {
    id: "rain", cat: "seasons", name: "Rainy window", blurb: "Droplets on glass, warm light indoors.",
    prompt: "Rainy-window portrait of the same pet from the reference photo, chest-up behind wet glass with droplets and streaks in sharp foreground focus, warm indoor light on the fur and a grey street blurred outside. Cozy contrast between the warm interior and cool exterior. Palette of rain grey, warm amber interior and cream. Contemplative hygge mood. No text.",
    bg: "#5C6B73", fg: "#F2EBDD",
  },
  {
    id: "camp", cat: "seasons", name: "Campfire", blurb: "Blanket by a small fire, night trees.",
    prompt: "Campfire portrait of the same pet from the reference photo wrapped in a wool blanket beside a small fire, chest-up centered with night trees behind and sparks rising. Warm fire glow on the face from below against cool night blue. Palette of ember orange, wool cream and midnight blue. Intimate, storytelling campfire mood. No text.",
    bg: "#3A2A22", fg: "#E8A05A",
  },
  {
    id: "cafe", cat: "seasons", name: "Cafe seat", blurb: "Window seat, cup nearby, rainy street.",
    prompt: "Café-window portrait of the same pet from the reference photo seated at a window table with a small cup nearby, chest-up centered, the rain-soft street and passersby blurred outside. Warm café interior light against cool window grey. Palette of café brown, window silver and cream. Cozy people-watching mood. No text.",
    bg: "#E7D3C0", fg: "#4A3428",
  },
  {
    id: "beret", cat: "seasons", name: "Paris", blurb: "Small beret on a Paris balcony, soft overcast.",
    prompt: "Parisian portrait of the same pet from the reference photo in a small black beret, chest-up on a wrought-iron balcony with zinc rooftops and chimney pots softly behind and a haughty gentle expression. Soft overcast Parisian light with painterly depth. Palette of beret black, rooftop grey and croissant cream. Effortless French-chic mood. No text.",
    bg: "#C9D3DC", fg: "#3D2E24",
  },
  {
    id: "kimono", cat: "seasons", name: "Kimono", blurb: "Patterned cloth, tatami and paper screens.",
    prompt: "Kimono portrait of the same pet from the reference photo in a simple patterned kimono cloth, formal seated chest-up pose in a tatami room with paper screens glowing softly behind. Quiet diffused daylight through shoji paper. Palette of indigo pattern, tatami straw and paper white. Serene, traditional, graceful mood. No text.",
    bg: "#F3E6EA", fg: "#6E3A48",
  },
  {
    id: "hanbok", cat: "seasons", name: "Hanbok", blurb: "Ribbon and cloth, palace courtyard blur.",
    prompt: "Hanbok portrait of the same pet from the reference photo in a simple ribboned hanbok, formal chest-up pose before a softly blurred palace courtyard with tiled roofs. Bright formal daylight with a clean pastel rendering. Palette of jeogori coral, sky blue and palace stone grey. Festive, dignified holiday mood. No text.",
    bg: "#F6E3E8", fg: "#7A3048",
  },
  {
    id: "sunbeam", cat: "seasons", name: "Sunbeam", blurb: "Asleep in a rectangle of sun, dust in the light.",
    prompt: "Sunbeam portrait of the same pet from the reference photo asleep in a crisp rectangle of sunlight on the floor, slightly angled top-down composition with dust motes glowing in the beam and an ordinary home interior softly blurred. Warm afternoon window light, high contrast between the bright patch and soft shadow. Palette of sun gold, warm cream and home brown. Perfectly content, universal-pet mood. No text.",
    bg: "#F6E7C8", fg: "#6B5436",
  },
  {
    id: "boxsit", cat: "seasons", name: "In the box", blurb: "Proudly sitting in a slightly too-small box.",
    prompt: "Classic home photo of the same pet from the reference photo sitting proudly inside a slightly too-small cardboard box, full-body centered in a lived-in living room with a satisfied direct gaze into the camera. Ordinary warm indoor daylight with an honest snapshot feel. Palette of cardboard tan, sofa cream and warm brown. Iconic, hilarious, universally beloved mood. No text.",
    bg: "#E4D2B8", fg: "#3D2E24",
  },
  {
    id: "florist", cat: "seasons", name: "Florist", blurb: "Among buckets of flowers in a small shop.",
    prompt: "Florist-shop portrait of the same pet from the reference photo among buckets and buckets of fresh flowers, chest-up centered and surrounded by stems, morning shop light from the front. Soft natural light with dew-fresh colors. Palette of coral, lavender and butter-yellow blooms against leafy green. Abundant, fragrant, cheerful mood. No text.",
    bg: "#F4E4EA", fg: "#5C6B4A",
  },
];

// 徽章：在此维护名单即可（新模板建议先挂 "new"，转热门改 "hot"）。
const HOT_IDS = new Set(["royal", "oil", "pixar", "poster", "xmas", "astronaut", "sticker", "desk", "glance", "neon"]);
const NEW_IDS = new Set(["doorbell", "botanic", "deco", "crochet", "pin", "hanbok", "sunbeam", "boxsit", "librarian", "yoga"]);

for (const t of TEMPLATES) {
  if (HOT_IDS.has(t.id)) t.badge = "hot";
  else if (NEW_IDS.has(t.id)) t.badge = "new";
}

export const BADGES: { id: Badge; label: string }[] = [
  { id: "hot", label: "🔥 Hot" },
  { id: "new", label: "✨ New" },
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

/** 带域名水印的预览/下载出口。 */
export function tplImgWm(id: string): string {
  return `/api/wm/tpl/${id}.jpg`;
}

if (new Set(TEMPLATES.map((t) => t.id)).size !== TEMPLATES.length || TEMPLATES.length !== 100) {
  throw new Error("template catalog");
}
