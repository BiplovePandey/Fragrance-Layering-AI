import { CommunityRecipe } from '../types.js';

export const COMMUNITY_RECIPES: CommunityRecipe[] = [
  {
    id: 'recipe-1',
    title: 'Monsoon Petrichor & Smoked Tea',
    author: 'Aarav_Nose',
    author_level: 'Fragrance Alchemist',
    fragrance_a: {
      id: 33,
      name: 'B680 Vetiver',
      brand: 'Muzna Fragrances',
      gender: 'unisex',
      description: 'Cult indie vetiver oil isolation with pink pepper and smoky earth.',
      season: ['Summer', 'Monsoon'],
      occasion: ['Casual', 'Office'],
      intensity: 8,
      sweetness: 3,
      freshness: 8,
      longevity: '11 hrs',
      fragrance_family: 'Smoky Green Vetiver',
      top_notes: ['Pink Pepper', 'Bergamot'],
      middle_notes: ['Khus / Vetiver', 'Cedar'],
      base_notes: ['Earth', 'Amber'],
      vector: [0.3, 0.8, 0.67, 0, 0.33, 0.5, 0, 0.8]
    },
    fragrance_b: {
      id: 11,
      name: 'Chai Musk',
      brand: 'Bombay Perfumery',
      gender: 'unisex',
      description: 'Steaming ginger tea, lemongrass, and clean milky skin musk.',
      season: ['Monsoon', 'Fall', 'Winter'],
      occasion: ['Casual', 'Signature'],
      intensity: 7,
      sweetness: 6,
      freshness: 6,
      longevity: '9 hrs',
      fragrance_family: 'Spiced Gourmand Musk',
      top_notes: ['Lemongrass', 'Ginger'],
      middle_notes: ['Chai Spice', 'Tea Leaf'],
      base_notes: ['White Musk', 'Sandalwood'],
      vector: [0.6, 0.6, 0.4, 0.3, 0.2, 0.7, 0.2, 0.7]
    },
    chord_name: 'Verdant Assam Cloudburst',
    compatibility_score: 96,
    ratio: '2 sprays B680 Vetiver + 1 spray Chai Musk',
    spray_order: 'Apply B680 Vetiver first as base anchor, wait 45s, then mist Chai Musk over chest and collarbone.',
    wait_time: '45 seconds',
    review: 'This pairing captures the nostalgic magic of sipping spiced hot masala chai on a rain-drenched veranda while petrichor rises from the grass.',
    season: 'Monsoon',
    occasion: 'Signature',
    likes: 142,
    has_liked: false,
    remixes_count: 28,
    created_at: '2 days ago',
    tags: ['#MonsoonVibe', '#IndianNiche', '#ArtisanalChai']
  },
  {
    id: 'recipe-2',
    title: 'Velvet Narcissus & Dark Heartwood',
    author: 'Elena_Perfumista',
    author_level: 'Olfactory Master',
    fragrance_a: {
      id: 7,
      name: 'Nargis',
      brand: 'Forest Essentials',
      gender: 'feminine',
      description: 'Ethereal Kashmiri narcissus floral mist crafted using pure steam distillation.',
      season: ['Spring', 'Summer'],
      occasion: ['Signature', 'Day'],
      intensity: 6,
      sweetness: 5,
      freshness: 8,
      longevity: '8 hrs',
      fragrance_family: 'Floral Soliflore',
      top_notes: ['Lemon', 'Sweet Lime'],
      middle_notes: ['Nargis', 'Jasmine'],
      base_notes: ['Chandan', 'White Musk'],
      vector: [0.5, 0.8, 0.17, 0.83, 0.33, 0.17, 0, 0.6]
    },
    fragrance_b: {
      id: 6,
      name: 'Mysore Sandalwood & Vetiver',
      brand: 'Forest Essentials',
      gender: 'unisex',
      description: 'Pure artisanal hydro-distillation of wild vetiver roots with Mysore sandalwood.',
      season: ['Monsoon', 'Summer'],
      occasion: ['Meditation / Spiritual', 'Signature'],
      intensity: 7,
      sweetness: 4,
      freshness: 7,
      longevity: '10 hrs',
      fragrance_family: 'Sacred Woody / Earthy',
      top_notes: ['Khus / Vetiver', 'Sweet Lime'],
      middle_notes: ['Cedar', 'Cardamom'],
      base_notes: ['Chandan', 'Sandalwood'],
      vector: [0.4, 0.7, 0.95, 0, 0.14, 0.41, 0, 0.7]
    },
    chord_name: 'Imperial Kashmiri Lotus Sanctum',
    compatibility_score: 93,
    ratio: '1 spray Mysore Sandalwood + 2 sprays Nargis',
    spray_order: 'Dab sandalwood oil on inner wrists; mist Nargis in an arc over hair and clothing.',
    wait_time: '30 seconds',
    review: 'Pure ethereal royalty. The creamy sandalwood heartwood anchors the fragile narcissus flower, extending its sillage from 3 hours to 10+ hours.',
    season: 'Spring',
    occasion: 'Special Event',
    likes: 189,
    has_liked: true,
    remixes_count: 34,
    created_at: '5 days ago',
    tags: ['#AyurvedicLuxury', '#WeddingScent', '#PureBotanicals']
  },
  {
    id: 'recipe-3',
    title: 'Solar Bergamot & Smoked Oud Synergy',
    author: 'Rohan_K',
    author_level: 'Note Hunter',
    fragrance_a: {
      id: 1,
      name: 'Raw',
      brand: 'SKINN by Titan',
      gender: 'masculine',
      description: 'Luminous watery citrus with violet leaves and patchouli.',
      season: ['Summer', 'Spring'],
      occasion: ['Office', 'Casual'],
      intensity: 6,
      sweetness: 4,
      freshness: 8,
      longevity: '7 hrs',
      fragrance_family: 'Citrus Aquatic Woods',
      top_notes: ['Bergamot', 'Mandarin'],
      middle_notes: ['Violet Leaves', 'Geranium'],
      base_notes: ['Patchouli', 'Guaiac Wood'],
      vector: [0.4, 0.8, 0.5, 0.2, 0.2, 0.4, 0, 0.7]
    },
    fragrance_b: {
      id: 5,
      name: 'Nox Oud',
      brand: 'SKINN by Titan',
      gender: 'masculine',
      description: 'Rich oriental oud layered with spiced saffron and amberwood.',
      season: ['Winter', 'Fall'],
      occasion: ['Evening', 'Date'],
      intensity: 8,
      sweetness: 6,
      freshness: 4,
      longevity: '12 hrs',
      fragrance_family: 'Spiced Amber Oud',
      top_notes: ['Saffron', 'Thyme'],
      middle_notes: ['Leather', 'Raspberry'],
      base_notes: ['Assam Oud', 'Amber'],
      vector: [0.6, 0.4, 0.8, 0, 0.3, 0.9, 0.2, 0.9]
    },
    chord_name: 'Citrus Noir Horizon',
    compatibility_score: 89,
    ratio: '1 spray Nox Oud (Chest) + 2 sprays Raw (Collarbone & Wrists)',
    spray_order: 'Nox Oud directly on skin chest. Layer Raw over collarbones and pulse points.',
    wait_time: '60 seconds',
    review: 'Cuts the heavy winter weight of Nox Oud and gives it a vibrant, sparkling modern edge suitable for evening rooftop dinners in warmer months.',
    season: 'Summer',
    occasion: 'Date',
    likes: 97,
    has_liked: false,
    remixes_count: 15,
    created_at: '1 week ago',
    tags: ['#TitanSkinn', '#HighContrast', '#DateNight']
  }
];

export interface RemixPrompt {
  id: string;
  label: string;
  icon: string;
  instruction: string;
  targetModification: {
    boostNoteFamily?: string;
    reduceSweetness?: boolean;
    boostFreshness?: boolean;
    targetSeason?: string;
    targetOccasion?: string;
  };
}

export const REMIX_PROMPTS: RemixPrompt[] = [
  {
    id: 'summer-friendly',
    label: 'Make Summer-Friendly',
    icon: '☀️',
    instruction: 'Inject sparkling citrus & cooling aquatic accords, dial back dense resins, and boost evaporative effervescence.',
    targetModification: { boostFreshness: true, targetSeason: 'Summer' }
  },
  {
    id: 'less-sweet',
    label: 'Reduce Sweetness',
    icon: '🍋',
    instruction: 'Neutralize gourmand vanilla/sugar notes with crisp vetiver root, pink pepper, and bitter bergamot zest.',
    targetModification: { reduceSweetness: true }
  },
  {
    id: 'replace-oud',
    label: 'Replace Oud with Vetiver',
    icon: '🌿',
    instruction: 'Substitute heavy animalic agarwood with clean, grassy Mysore vetiver or cedarwood for effortless day wear.',
    targetModification: { boostNoteFamily: 'Woody' }
  },
  {
    id: 'increase-longevity',
    label: 'Increase Longevity & Sillage',
    icon: '⏳',
    instruction: 'Reinforce base fixatives with sacred Mysore sandalwood, ambroxan, and aged patchouli.',
    targetModification: { boostNoteFamily: 'Woody' }
  },
  {
    id: 'office-safe',
    label: 'Make Office-Safe',
    icon: '💼',
    instruction: 'Moderate projection from loud 6-foot cloud down to an intimate, refined 2-foot professional scent bubble.',
    targetModification: { targetOccasion: 'Office' }
  }
];
