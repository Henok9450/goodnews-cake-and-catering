/**
 * GoodNews Cake & Catering - Artisanal Cake Gallery Curation
 * Analyzes the physical design, tiers, frosting, motifs, and occasion of showcase cakes
 * to provide the best, most elegant bakery names and descriptions.
 * 
 * Strict Rule: Pre-existing curated development cakes maintain their exact original titles.
 */

export const UPLOADED_CAKE_CURATIONS = {
  // Cake 1: Single-tier ivory cake with dense vertical pleated buttercream ruffles, fresh baby's breath, gold pearls & gold birthday topper
  'abff6066': {
    title: "Vertical Pleated Ruffle & Baby's Breath Birthday Cake",
    description: "A graceful single-tier ivory buttercream cake detailed with tight vertical pleated ruffles, delicate fresh baby's breath florals, edible golden pearls, and an elegant cursive gold birthday topper.",
    ingredients: ['Vanilla velvet sponge', 'Pleated vanilla buttercream', "Fresh baby's breath florals", 'Edible gold pearls', 'Acrylic gold topper'],
    size: '1.5 kg',
    servings: '12-15 people',
    category: 'Birthday Cakes'
  },

  // Cake 2: Tall single-tier ivory cake with translucent sculptural feather / wing wafer paper sails, 24k gold leaf foil & pearls
  '2c93b7da': {
    title: 'Ethereal Feather Sail & Gold Leaf Celebration Cake',
    description: 'A couture tall single-tier celebration cake finished with smooth ivory buttercream, adorned with sculptural translucent feather sails, hand-applied 24k-style edible gold leaf, and shimmering sugar pearls.',
    ingredients: ['Almond & vanilla sponge', 'Smooth Swiss meringue buttercream', 'Sculptural wafer paper sails', 'Edible gold leaf foil', 'Sugar pearls'],
    size: 'Tall Tier (1.5 kg)',
    servings: '12-15 people',
    category: 'Celebration Cakes'
  },

  // Cake 3: Two-tier white wedding cake embraced by spiraling wafer paper wave cascade with baby's breath
  'watermarked_img_12927559622594782392': {
    title: 'Cascading Wave & Spiraling Sail Two-Tier Wedding Cake',
    description: "A breathtaking two-tier white wedding cake wrapped in a continuous, flowing wafer paper cascade, embellished with delicate sprigs of fresh baby's breath and scattered edible pearls.",
    ingredients: ['Velvet vanilla bean sponge', 'White silk buttercream', 'Flowing rice paper wave sail', "Fresh baby's breath florals", 'Shimmering pearls'],
    size: 'Two-tier (2.5 kg)',
    servings: '22-28 people',
    category: 'Wedding Cakes'
  },

  // Cake 4: Pastel baby blue single-tier cake with expectant mother silhouette & bubble spheres arch
  '05f8a227': {
    title: 'Pastel Blue Baby Shower Silhouette Cake',
    description: 'A charming pastel baby blue celebration cake featuring a tender expectant mother silhouette topper, framed by a cascading arch of baby blue, white, and silver decorative bubbles with a golden Baby Shower crest.',
    ingredients: ['Classic vanilla sponge', 'Pastel blue buttercream frosting', 'Decorative sphere bubbles', 'Silhouette mother topper', 'Silver dragees'],
    size: '1.5 kg',
    servings: '12-15 people',
    category: 'Celebration Cakes'
  },

  // Cake 5: Two-tier horizontal pleated ruffle cake with dusty mauve roses, baby's breath & custom gold monogram
  'cee9cdc3': {
    title: 'Dusty Mauve Rose Pleated Two-Tier Monogram Cake',
    description: "A romantic two-tier celebration cake crafted with delicate horizontal pleated ruffles, crowned with a bouquet of dusty mauve roses, fresh baby's breath, and a custom gold monogram topper.",
    ingredients: ['Spiced almond sponge', 'Textured horizontal ruffle buttercream', 'Lush dusty mauve roses', "Baby's breath accents", 'Gold monogram crest'],
    size: 'Two-tier (2.5 kg)',
    servings: '22-28 people',
    category: 'Wedding Cakes'
  },

  // Cake 6: Ivory single-tier vertical pleated cake with edible gold pearls, tall metallic spiral candles & Happy Birthday topper
  '5edda22e': {
    title: 'Gilded Spiral Candle & Pleated Ivory Birthday Cake',
    description: 'An upscale single-tier ivory birthday cake featuring fine vertical piped ruffles, edible gold pearls, tall spiral metallic gold candles, and a minimalist gold Happy Birthday topper.',
    ingredients: ['Golden butter sponge', 'Ivory piped ruffle buttercream', 'Edible gold dragees', 'Metallic spiral candles', 'Acrylic gold topper'],
    size: '1.5 kg',
    servings: '12-15 people',
    category: 'Birthday Cakes'
  },

  // Cake 7: Two-tier midnight navy & gold luxury cake with Moroccan geometric stenciling and dramatic black, gold & cream sugar roses
  '8555646f': {
    title: 'Midnight Navy & Gilded Moroccan Two-Tier Cake',
    description: 'An opulent two-tier dark navy celebration cake accented with intricate metallic gold geometric stenciling, gilded accents, and an arrangement of sculpted black, gold, and cream sugar roses.',
    ingredients: ['Dark chocolate velvet sponge', 'Midnight navy fondant & buttercream', '24k-style metallic gold stenciling', 'Sculpted sugar roses', 'Gold luster trim'],
    size: 'Two-tier (3 kg)',
    servings: '25-30 people',
    category: 'Celebration Cakes'
  }
};

/**
 * Resolves comprehensive cake details (title, description, ingredients, size, servings, category).
 * Preserves custom admin titles while replacing raw filenames/UUIDs with bespoke artisanal descriptions.
 */
export const resolveCakeDetails = (data = {}) => {
  const caption = data.caption || '';
  const url = data.url || '';
  const keyTarget = (caption + ' ' + url).toLowerCase();

  // 1. Check curated signature lookup
  for (const [key, curation] of Object.entries(UPLOADED_CAKE_CURATIONS)) {
    if (keyTarget.includes(key.toLowerCase())) {
      return {
        ...curation,
        category: data.category && data.category !== 'Celebration Cakes' ? data.category : curation.category
      };
    }
  }

  // 2. Detect if caption is a raw filename or UUID
  const isRawFilename = /\.(webp|jpg|jpeg|png)$/i.test(caption) || /^[0-9a-f-]{15,}/i.test(caption) || caption.includes('watermarked_img_');

  const title = isRawFilename
    ? 'Artisanal Celebration Cake'
    : (caption || 'Artisanal Celebration Cake');

  const description = isRawFilename
    ? 'Artisanal handcrafted celebration cake by GoodNews Cake & Catering.'
    : (caption || 'Artisanal celebration cake crafted by GoodNews Cake & Catering.');

  return {
    title,
    description,
    ingredients: ['Vanilla Velvet Sponge', 'Buttercream Frosting', 'Signature Decor'],
    size: '1.5 kg',
    servings: '10-15 people',
    category: data.category || 'Celebration Cakes'
  };
};

/**
 * Resolves a clean display title from caption and url
 */
export const resolveCakeTitle = (caption = '', url = '') => {
  return resolveCakeDetails({ caption, url }).title;
};
