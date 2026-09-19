// OLFACTORY AI — DESIGN SYSTEM v1.0
// Central theme system harmonized with luxury digital fragrance atelier palette.

export * from './styles/tokens';

export const SCENT_PALETTE = {
  background: '#F8F5EF', // Parchment
  primary: '#D97706',    // Primary Amber
  secondary: '#C9953B',  // Warm Gold
  accent: '#B45309',     // Deep Amber
  fresh: '#55BFA3',      // Botanical Green
  indian: '#D95D39',     // Terracotta
  darkText: '#1A1613',   // Primary Espresso
  softText: '#7A6F66',   // Muted Taupe
  cardBg: '#FFFFFF',
  border: '#DCD4C8'      // Subtle Warm Border
};

export interface MoodColorConfig {
  gradient: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  shadowColor: string;
  iconBg: string;
}

export const FRAGRANCE_FAMILY_THEMES: Record<string, MoodColorConfig> = {
  Floral: {
    gradient: 'from-[#FFF1F5] via-[#FCE4EC] to-[#F8D5E2]',
    badgeBg: '#FCE4EE',
    badgeText: '#991B4C',
    borderColor: '#F3B4C9',
    shadowColor: 'rgba(232, 106, 146, 0.12)',
    iconBg: '#FDF0F4'
  },
  Fresh: {
    gradient: 'from-[#EBFBFA] via-[#D8F8EE] to-[#E6FAF4]',
    badgeBg: '#D6F7EE',
    badgeText: '#0F766E',
    borderColor: '#99E6D5',
    shadowColor: 'rgba(85, 191, 163, 0.12)',
    iconBg: '#E0F7F2'
  },
  Sweet: {
    gradient: 'from-[#FFF7ED] via-[#FFE8D1] to-[#FED7AA]/40',
    badgeBg: '#FEE8CC',
    badgeText: '#9A3412',
    borderColor: '#FDBA74',
    shadowColor: 'rgba(217, 119, 6, 0.12)',
    iconBg: '#FEF3E2'
  },
  Woody: {
    gradient: 'from-[#FAF6F0] via-[#EEDDC6] to-[#E4CEB0]',
    badgeBg: '#EDE0CE',
    badgeText: '#634226',
    borderColor: '#D4B896',
    shadowColor: 'rgba(181, 138, 88, 0.12)',
    iconBg: '#F2E7D9'
  },
  Oriental: {
    gradient: 'from-[#FFF8ED] via-[#FCECD7] to-[#F5D8B4]',
    badgeBg: '#FCE7CC',
    badgeText: '#854D0E',
    borderColor: '#E8C496',
    shadowColor: 'rgba(180, 83, 9, 0.14)',
    iconBg: '#FDF1E2'
  },
  Earthy: {
    gradient: 'from-[#FCF4EE] via-[#FCE3D8] to-[#FAD4C0]',
    badgeBg: '#FCE0D2',
    badgeText: '#90331A',
    borderColor: '#F4B097',
    shadowColor: 'rgba(217, 93, 57, 0.18)',
    iconBg: '#FDECE4'
  },
  Aquatic: {
    gradient: 'from-[#F0F9FF] via-[#DCEEFB] to-[#C7E4F9]',
    badgeBg: '#D8ECF9',
    badgeText: '#0369A1',
    borderColor: '#93C5FD',
    shadowColor: 'rgba(56, 189, 248, 0.18)',
    iconBg: '#E0F2FE'
  },
  Spicy: {
    gradient: 'from-[#FFF1EE] via-[#FFE3DC] to-[#FED2C7]',
    badgeBg: '#FFDFD7',
    badgeText: '#9E2A12',
    borderColor: '#FCA591',
    shadowColor: 'rgba(239, 68, 68, 0.18)',
    iconBg: '#FEE5DF'
  }
};

export function getFamilyTheme(family: string = ''): MoodColorConfig {
  const norm = family.toLowerCase();
  if (norm.includes('floral') || norm.includes('rose') || norm.includes('jasmine')) return FRAGRANCE_FAMILY_THEMES.Floral;
  if (norm.includes('fresh') || norm.includes('citrus') || norm.includes('aromatic') || norm.includes('green')) return FRAGRANCE_FAMILY_THEMES.Fresh;
  if (norm.includes('sweet') || norm.includes('gourmand') || norm.includes('vanilla')) return FRAGRANCE_FAMILY_THEMES.Sweet;
  if (norm.includes('wood') || norm.includes('sandal') || norm.includes('cedar')) return FRAGRANCE_FAMILY_THEMES.Woody;
  if (norm.includes('oriental') || norm.includes('oud') || norm.includes('amber') || norm.includes('resin')) return FRAGRANCE_FAMILY_THEMES.Oriental;
  if (norm.includes('earth') || norm.includes('petrichor') || norm.includes('mitti') || norm.includes('vetiver')) return FRAGRANCE_FAMILY_THEMES.Earthy;
  if (norm.includes('aqua') || norm.includes('marine') || norm.includes('ocean')) return FRAGRANCE_FAMILY_THEMES.Aquatic;
  if (norm.includes('spic') || norm.includes('cardamom') || norm.includes('cinnamon')) return FRAGRANCE_FAMILY_THEMES.Spicy;
  return FRAGRANCE_FAMILY_THEMES.Floral;
}

export interface InteractiveNoteInfo {
  id: string;
  name: string;
  hindiName?: string;
  emoji: string;
  family: string;
  vibe: string;
  description: string;
  culturalOrigin: string; // e.g. "Indian • French • Middle Eastern"
  pairsBestWith: string[];
  gradient: string;
  borderColor: string;
}

export const POPULAR_NOTE_BUBBLES: InteractiveNoteInfo[] = [
  {
    id: 'rose',
    name: 'Damascena Rose',
    hindiName: 'Gulab',
    emoji: '🌹',
    family: 'Floral',
    vibe: 'Romantic • Soft • Velvety',
    description: 'Fresh dewy dawn-picked petals distilled in copper degs. Tender, honeyed, and uplifting with natural powdery elegance.',
    culturalOrigin: 'Kannauj & Grasse perfumery',
    pairsBestWith: ['Sandalwood', 'Bourbon Vanilla', 'Oud', 'Cardamom'],
    gradient: 'from-[#FFE6F0] to-[#FBB6CE]',
    borderColor: '#E86A92'
  },
  {
    id: 'sandalwood',
    name: 'Mysore Sandalwood',
    hindiName: 'Chandan',
    emoji: '🪵',
    family: 'Woody',
    vibe: 'Creamy • Meditative • Sacred',
    description: 'The golden crown of Indian perfumery. Buttery, milky, warm heartwood that acts as the ultimate olfactory harmonizer and anchor.',
    culturalOrigin: 'Southern India & Vedic rituals',
    pairsBestWith: ['Damascena Rose', 'Amber', 'Bergamot', 'Jasmine'],
    gradient: 'from-[#FAF1E3] to-[#E9D5B7]',
    borderColor: '#B58A58'
  },
  {
    id: 'mitti',
    name: 'Baked Earth / Petrichor',
    hindiName: 'Mitti Attar',
    emoji: '🌧️',
    family: 'Earthy',
    vibe: 'Calm • Nostalgic • Rain-soaked',
    description: 'The poetic fragrance of the first summer rain falling upon sun-baked alluvial clay, hydro-distilled into a sandalwood oil base.',
    culturalOrigin: 'Kannauj, Uttar Pradesh heritage',
    pairsBestWith: ['Vetiver (Khus)', 'Rose', 'Citrus', 'Cedarwood'],
    gradient: 'from-[#FCECE4] to-[#F5C7B2]',
    borderColor: '#D95D39'
  },
  {
    id: 'vanilla',
    name: 'Bourbon Vanilla',
    hindiName: 'Vanilla',
    emoji: '🍦',
    family: 'Sweet',
    vibe: 'Delicious • Cozy • Sensual',
    description: 'Dark, caramelized pods infused with creamy balsam and smoky tonka nuances. Instantly adds softness, longevity, and comfort.',
    culturalOrigin: 'Madagascar & French Haute Parfumerie',
    pairsBestWith: ['Oud', 'Coffee', 'Lavender', 'Tobacco'],
    gradient: 'from-[#FFF3E6] to-[#FED7AA]',
    borderColor: '#F2A65A'
  },
  {
    id: 'bergamot',
    name: 'Calabrian Bergamot',
    hindiName: 'Citrus Zest',
    emoji: '🍋',
    family: 'Fresh',
    vibe: 'Sparkling • Crisp • Energizing',
    description: 'Sun-drenched, aromatic Italian citrus with a delicate floral undertone. Illuminates any dark or heavy base note.',
    culturalOrigin: 'Mediterranean & Classic Colognes',
    pairsBestWith: ['Tea', 'Vetiver', 'Patchouli', 'Musk'],
    gradient: 'from-[#E8FAF4] to-[#B2EFE0]',
    borderColor: '#55BFA3'
  },
  {
    id: 'khus',
    name: 'Wild Ruh Khus (Vetiver)',
    hindiName: 'Khus / Usira',
    emoji: '🌿',
    family: 'Earthy',
    vibe: 'Cooling • Grassy • Forest Earth',
    description: 'Distilled from the deep tangled roots of wild vetiver grass. Nature’s ancient cooling agent, deeply green, smoky, and grounding.',
    culturalOrigin: 'North Indian riverbeds & Ayurvedic coolness',
    pairsBestWith: ['Grapefruit', 'Mitti', 'Cardamom', 'Cedar'],
    gradient: 'from-[#EBF7F2] to-[#C1EADA]',
    borderColor: '#3DA388'
  },
  {
    id: 'mogra',
    name: 'Sambac Jasmine',
    hindiName: 'Mogra / Chameli',
    emoji: '🌼',
    family: 'Floral',
    vibe: 'Festive • Intoxicating • Opulent',
    description: 'Night-blooming royal white blossoms worn in festive hair garlands. Intensely indolic, narcotic, and joyful.',
    culturalOrigin: 'Madurai & Traditional temple garlands',
    pairsBestWith: ['Sandalwood', 'Green Tea', 'Saffron', 'Amber'],
    gradient: 'from-[#FFFBEB] to-[#FDE68A]',
    borderColor: '#D97706'
  },
  {
    id: 'kesar',
    name: 'Kashmiri Saffron',
    hindiName: 'Kesar / Zafran',
    emoji: '✨',
    family: 'Spicy',
    vibe: 'Regal • Golden • Warm Leather',
    description: 'The world’s most precious spice thread. Bitter-sweet, metallic, warm golden nuance that wraps fragrances in royal luxury.',
    culturalOrigin: 'Pampore, Kashmir & Royal Mughal courts',
    pairsBestWith: ['Rose', 'Oud', 'Amber', 'Cardamom'],
    gradient: 'from-[#FFF5ED] to-[#FFCF9E]',
    borderColor: '#EA580C'
  },
  {
    id: 'oud',
    name: 'Assam Agarwood',
    hindiName: 'Oudh',
    emoji: '🪵',
    family: 'Oriental',
    vibe: 'Enigmatic • Resinous • Powerful',
    description: 'Dark resinous heartwood naturally aged over decades. Complex, balsamic, deeply animalic, and remarkably persistent.',
    culturalOrigin: 'Northeastern India & Middle Eastern royal scents',
    pairsBestWith: ['Rose', 'Vanilla', 'Amber', 'Bergamot'],
    gradient: 'from-[#F7F0FA] to-[#DEC0EB]',
    borderColor: '#7B3F98'
  }
];

export interface TinderVibeCard {
  id: number;
  emoji: string;
  name: string;
  family: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  targetPreferences: {
    family: string;
    note: string;
    sweetness: number;
    freshness: number;
    intensity: number;
  };
}

export const TINDER_VIBE_CARDS: TinderVibeCard[] = [
  {
    id: 1,
    emoji: '🌹',
    name: 'Rose & Petals',
    family: 'Floral',
    tags: ['Romantic', 'Soft & Velvet', 'Elegant Sillage'],
    gradient: 'from-[#FFEBF2] via-[#FFD6E5] to-[#FCE4EC]',
    accentColor: '#E86A92',
    targetPreferences: {
      family: 'Floral',
      note: 'Rose',
      sweetness: 6,
      freshness: 6,
      intensity: 6
    }
  },
  {
    id: 2,
    emoji: '🌧️',
    name: 'Mitti & Petrichor',
    family: 'Earthy',
    tags: ['First Monsoon Rain', 'Baked Clay', 'Meditative'],
    gradient: 'from-[#FCF4EE] via-[#FCE3D8] to-[#FAD4C0]',
    accentColor: '#D95D39',
    targetPreferences: {
      family: 'Traditional Attar',
      note: 'Mitti Attar',
      sweetness: 4,
      freshness: 7,
      intensity: 7
    }
  },
  {
    id: 3,
    emoji: '🪵',
    name: 'Mysore Sandalwood',
    family: 'Woody',
    tags: ['Creamy Wood', 'Warm Second-Skin', 'Sacred Comfort'],
    gradient: 'from-[#FAF6F0] via-[#EEDDC6] to-[#E4CEB0]',
    accentColor: '#B58A58',
    targetPreferences: {
      family: 'Woody Aromatic',
      note: 'Sandalwood',
      sweetness: 5,
      freshness: 5,
      intensity: 7
    }
  },
  {
    id: 4,
    emoji: '🍋',
    name: 'Bergamot & Mint',
    family: 'Fresh',
    tags: ['Crisp Zest', 'Clean Morning', 'Invigorating Breeze'],
    gradient: 'from-[#EBFBFA] via-[#D8F8EE] to-[#E6FAF4]',
    accentColor: '#55BFA3',
    targetPreferences: {
      family: 'Citrus',
      note: 'Bergamot',
      sweetness: 3,
      freshness: 9,
      intensity: 5
    }
  },
  {
    id: 5,
    emoji: '🍯',
    name: 'Amber & Spiced Vanilla',
    family: 'Sweet',
    tags: ['Decadent Gourmand', 'Cozy Warmth', 'Evening Glamour'],
    gradient: 'from-[#FFF7ED] via-[#FFE8D1] to-[#FED7AA]/50',
    accentColor: '#F2A65A',
    targetPreferences: {
      family: 'Amber Vanilla',
      note: 'Vanilla',
      sweetness: 8,
      freshness: 3,
      intensity: 8
    }
  }
];

export interface ScentPersonality {
  title: string;
  emoji: string;
  tagline: string;
  dominantFamilies: string[];
  signatureChords: string;
  paletteDescription: string;
}

export function determinePersonality(stats: {
  floral: number;
  woody: number;
  sweet: number;
  fresh: number;
  spicy: number;
  earthy: number;
}): ScentPersonality {
  const scores = [
    { key: 'floral', val: stats.floral, title: 'The Warm Romantic', emoji: '🌹', tagline: 'Poetic, gentle, wrapped in velvety dawn petals and soft woods', chords: 'Rose + Sandalwood', families: ['Floral', 'Woody'] },
    { key: 'earthy', val: stats.earthy, title: 'The Earthy Poet', emoji: '🌧️', tagline: 'Grounded in petrichor, wild roots, rain-soaked earth and contemplative stillness', chords: 'Mitti + Ruh Khus', families: ['Earthy', 'Aromatic'] },
    { key: 'woody', val: stats.woody, title: 'The Mystical Alchemist', emoji: '🪵', tagline: 'Drawn to shadow, rare aged resins, incense, and deep Assam oud', chords: 'Oud + Cardamom', families: ['Woody', 'Oriental'] },
    { key: 'fresh', val: stats.fresh, title: 'The Sunlit Minimalist', emoji: '🌿', tagline: 'Luminous citrus sparkles, crisp aquatic morning air, and dewy green leaves', chords: 'Bergamot + Neroli', families: ['Citrus', 'Fresh'] },
    { key: 'sweet', val: stats.sweet, title: 'The Regal Gourmand', emoji: '🍯', tagline: 'Decadent bourbon vanilla, golden spun amber, and intoxicating warmth', chords: 'Amber + Tonka Bean', families: ['Amber', 'Sweet'] },
    { key: 'spicy', val: stats.spicy, title: 'The Spice Navigator', emoji: '🌶️', tagline: 'Kashmiri saffron, toasted cinnamon, pink pepper, and radiant vibrancy', chords: 'Saffron + Leather', families: ['Spicy', 'Oriental'] }
  ];

  scores.sort((a, b) => b.val - a.val);
  const best = scores[0] || scores[0];

  return {
    title: best.title,
    emoji: best.emoji,
    tagline: best.tagline,
    dominantFamilies: best.families,
    signatureChords: best.chords,
    paletteDescription: `Your nose leans strongly towards ${best.families.join(' & ')} compositions.`
  };
}
