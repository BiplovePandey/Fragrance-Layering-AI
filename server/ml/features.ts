import fs from 'fs';
import path from 'path';
import { Fragrance, UserPreferences, NoteTaxonomyEntry } from '../../src/types.js';

export const FEATURE_NAMES = [
  'freshness',
  'sweetness',
  'intensity',
  'woody',
  'floral',
  'warm_resinous_spices',
  'earthy_clay',
  'longevity_fixative'
] as const;

export type FeatureKey = typeof FEATURE_NAMES[number];

// Fallback olfactory note keywords for categorization
const BASE_NOTE_CATEGORIES: Record<string, FeatureKey> = {
  // Citrus & Freshness
  bergamot: 'freshness',
  lemon: 'freshness',
  lime: 'freshness',
  grapefruit: 'freshness',
  mandarin: 'freshness',
  orange: 'freshness',
  neroli: 'freshness',
  petitgrain: 'freshness',
  yuzu: 'freshness',
  mosambi: 'freshness',
  'sweet lime': 'freshness',

  // Woody
  sandalwood: 'woody',
  chandan: 'woody',
  cedar: 'woody',
  cedarwood: 'woody',
  deodar: 'woody',
  oud: 'woody',
  oudh: 'woody',
  agarwood: 'woody',
  'dehn al oud': 'woody',
  birch: 'woody',
  cypress: 'woody',
  pine: 'woody',
  patchouli: 'woody',
  guaiac: 'woody',
  oak: 'woody',
  rosewood: 'woody',
  papyrus: 'woody',
  driftwood: 'woody',
  'iso e super': 'woody',

  // Earthy / Clay / Roots
  vetiver: 'earthy_clay',
  'ruh khus': 'earthy_clay',
  khus: 'earthy_clay',
  mitti: 'earthy_clay',
  'geeli mitti': 'earthy_clay',
  petrichor: 'earthy_clay',
  clay: 'earthy_clay',
  earth: 'earthy_clay',

  // Floral (Western & Sacred Indian Florals)
  rose: 'floral',
  gulab: 'floral',
  'ruh gulab': 'floral',
  jasmine: 'floral',
  mogra: 'floral',
  motia: 'floral',
  bela: 'floral',
  juhi: 'floral',
  kewra: 'floral',
  kewda: 'floral',
  keora: 'floral',
  champa: 'floral',
  champaca: 'floral',
  rajnigandha: 'floral',
  tuberose: 'floral',
  parijat: 'floral',
  genda: 'floral',
  marigold: 'floral',
  lotus: 'floral',
  kamal: 'floral',
  nargis: 'floral',
  iris: 'floral',
  violet: 'floral',
  peony: 'floral',
  lavender: 'floral',
  geranium: 'floral',
  mimosa: 'floral',
  lily: 'floral',
  ylang: 'floral',
  'orange blossom': 'floral',
  osmanthus: 'floral',

  // Warm Resinous & Spices (Western Spices & Indian Heritage Accords)
  cardamom: 'warm_resinous_spices',
  elaichi: 'warm_resinous_spices',
  cinnamon: 'warm_resinous_spices',
  dalchini: 'warm_resinous_spices',
  pepper: 'warm_resinous_spices',
  'black pepper': 'warm_resinous_spices',
  'pink pepper': 'warm_resinous_spices',
  'calicut pepper': 'warm_resinous_spices',
  sichuan: 'warm_resinous_spices',
  nutmeg: 'warm_resinous_spices',
  jaiphal: 'warm_resinous_spices',
  clove: 'warm_resinous_spices',
  laung: 'warm_resinous_spices',
  saffron: 'warm_resinous_spices',
  kesar: 'warm_resinous_spices',
  zafran: 'warm_resinous_spices',
  shamama: 'warm_resinous_spices',
  ginger: 'warm_resinous_spices',
  'star anise': 'warm_resinous_spices',
  coriander: 'warm_resinous_spices',
  chai: 'warm_resinous_spices',
  henna: 'warm_resinous_spices',
  benzoin: 'warm_resinous_spices',
  loban: 'warm_resinous_spices',
  frankincense: 'warm_resinous_spices',
  sambrani: 'warm_resinous_spices',
  guggul: 'warm_resinous_spices',
  myrrh: 'warm_resinous_spices',
  labdanum: 'warm_resinous_spices',
  amber: 'warm_resinous_spices',

  // Fruits / Indian Ingredients (Mapped to Freshness)
  mango: 'freshness',
  'raw mango': 'freshness',
  kairi: 'freshness',
  kokum: 'freshness',
  jamun: 'freshness',
  pomegranate: 'freshness',
  anar: 'freshness',
  guava: 'freshness',

  // Sweetness / Gourmand
  vanilla: 'sweetness',
  praline: 'sweetness',
  tonka: 'sweetness',
  caramel: 'sweetness',
  cacao: 'sweetness',
  chocolate: 'sweetness',
  coffee: 'sweetness',
  jaggery: 'sweetness',
  gur: 'sweetness',
  almond: 'sweetness',
  cognac: 'sweetness',
  rum: 'sweetness',
  honey: 'sweetness',
  shahad: 'sweetness',
  sugar: 'sweetness',
  coconut: 'sweetness',
  nariyal: 'sweetness',

  // Longevity / Fixatives
  musk: 'longevity_fixative',
  ambergris: 'longevity_fixative',
  civet: 'longevity_fixative',
  castoreum: 'longevity_fixative',
  ambroxan: 'longevity_fixative'
};

// Dynamically load taxonomy if available
let DYNAMIC_TAXONOMY: NoteTaxonomyEntry[] = [];
try {
  const taxPath = path.join(process.cwd(), 'data', 'notes_taxonomy.json');
  if (fs.existsSync(taxPath)) {
    DYNAMIC_TAXONOMY = JSON.parse(fs.readFileSync(taxPath, 'utf-8'));
  }
} catch (e) {
  // Use fallback base map
}

export function setDynamicTaxonomy(taxonomy: NoteTaxonomyEntry[]) {
  if (Array.isArray(taxonomy) && taxonomy.length > 0) {
    DYNAMIC_TAXONOMY = taxonomy;
  }
}

export function getTaxonomyMapping(rawNote: string): {
  normalized_name: string;
  category: string;
  note_family: string;
  feature_key: FeatureKey;
} {
  const lower = rawNote.toLowerCase().trim();

  // Search dynamic taxonomy first
  for (const entry of DYNAMIC_TAXONOMY) {
    if (
      lower.includes(entry.raw_term.toLowerCase()) ||
      lower.includes(entry.original_note.toLowerCase()) ||
      lower.includes(entry.normalized_name.toLowerCase())
    ) {
      let feature: FeatureKey = 'woody';
      if (entry.category === 'floral' || entry.note_family === 'Floral') feature = 'floral';
      else if (entry.category === 'citrus' || entry.note_family === 'Citrus' || entry.category === 'fruit') feature = 'freshness';
      else if (entry.category === 'spicy' || entry.category === 'resinous_warm' || entry.note_family === 'Spices' || entry.note_family === 'Resinous / warm') feature = 'warm_resinous_spices';
      else if (entry.category === 'gourmand' || entry.note_family === 'Sweet / gourmand') feature = 'sweetness';
      else if (entry.category === 'earthy_clay' || entry.note_family === 'Earthy') feature = 'earthy_clay';
      else if (entry.category === 'woody' || entry.note_family === 'Woody') feature = 'woody';
      else if (entry.category === 'musk' || (entry.note_family as string) === 'Musk') feature = 'longevity_fixative';

      return {
        normalized_name: entry.normalized_name,
        category: entry.category,
        note_family: entry.note_family,
        feature_key: feature
      };
    }
  }

  // Check fallback base categories
  for (const [key, category] of Object.entries(BASE_NOTE_CATEGORIES)) {
    if (lower.includes(key)) {
      return {
        normalized_name: key.charAt(0).toUpperCase() + key.slice(1),
        category: category,
        note_family: category.charAt(0).toUpperCase() + category.slice(1),
        feature_key: category
      };
    }
  }

  return {
    normalized_name: rawNote,
    category: 'fresh',
    note_family: 'Fresh',
    feature_key: 'woody'
  };
}

/**
 * Resolves a raw note against documented taxonomy.
 * Returns mapped: true if matched with confidence against the dynamic or base taxonomy,
 * or mapped: false if retained as raw term for taxonomy review.
 */
export function resolveTaxonomyNote(rawNote: string): {
  raw_note: string;
  normalized_name: string;
  mapped: boolean;
  category: string;
  note_family: string;
  feature_key: FeatureKey;
} {
  const lower = rawNote.toLowerCase().trim();

  // Search dynamic taxonomy first
  for (const entry of DYNAMIC_TAXONOMY) {
    if (
      lower === entry.raw_term.toLowerCase() ||
      lower === entry.original_note.toLowerCase() ||
      lower === entry.normalized_name.toLowerCase() ||
      lower.includes(entry.raw_term.toLowerCase()) ||
      lower.includes(entry.original_note.toLowerCase()) ||
      lower.includes(entry.normalized_name.toLowerCase())
    ) {
      let feature: FeatureKey = 'woody';
      if (entry.category === 'floral' || entry.note_family === 'Floral') feature = 'floral';
      else if (entry.category === 'citrus' || entry.note_family === 'Citrus' || entry.category === 'fruit') feature = 'freshness';
      else if (entry.category === 'spicy' || entry.category === 'resinous_warm' || entry.note_family === 'Spices' || entry.note_family === 'Resinous / warm') feature = 'warm_resinous_spices';
      else if (entry.category === 'gourmand' || entry.note_family === 'Sweet / gourmand') feature = 'sweetness';
      else if (entry.category === 'earthy_clay' || entry.note_family === 'Earthy') feature = 'earthy_clay';
      else if (entry.category === 'woody' || entry.note_family === 'Woody') feature = 'woody';
      else if (entry.category === 'musk' || (entry.note_family as string) === 'Musk') feature = 'longevity_fixative';

      return {
        raw_note: rawNote,
        normalized_name: entry.normalized_name,
        mapped: true,
        category: entry.category,
        note_family: entry.note_family,
        feature_key: feature
      };
    }
  }

  // Search base note categories
  for (const [key, category] of Object.entries(BASE_NOTE_CATEGORIES)) {
    if (lower.includes(key)) {
      return {
        raw_note: rawNote,
        normalized_name: key.charAt(0).toUpperCase() + key.slice(1),
        mapped: true,
        category: category,
        note_family: category.charAt(0).toUpperCase() + category.slice(1),
        feature_key: category
      };
    }
  }

  // Unmapped: preserve raw cultural terminology
  return {
    raw_note: rawNote,
    normalized_name: rawNote,
    mapped: false,
    category: 'unclassified',
    note_family: 'Unclassified',
    feature_key: 'woody'
  };
}

/**
 * Extracts normalized 8-dimensional feature vector according to Section 19:
 * [Freshness, Sweetness, Intensity, Woody, Floral, Warm Resinous / Spices, Earthy / Clay, Longevity / Fixative]
 * Scaled to [0.0, 1.0] for vector algebra, and can be multiplied by 100 for display (0-100).
 */
export function extractFragranceVector(fragrance: Omit<Fragrance, 'cluster_id' | 'cluster_label' | 'vector'>): number[] {
  const sweetness = Math.max(0.1, Math.min(1.0, fragrance.sweetness / 10));
  const freshness = Math.max(0.1, Math.min(1.0, fragrance.freshness / 10));
  const intensity = Math.max(0.1, Math.min(1.0, fragrance.intensity / 10));

  let woodyHits = 0;
  let floralHits = 0;
  let warmResinousSpicesHits = 0;
  let earthyClayHits = 0;
  let longevityFixativeHits = 0;

  const allNotes = [
    ...(fragrance.top_notes || []),
    ...(fragrance.middle_notes || []),
    ...(fragrance.base_notes || []),
    ...((fragrance as any).notes_general || [])
  ].map(n => n.toLowerCase());

  // Check fragrance family
  const familyLower = (fragrance.fragrance_family || '').toLowerCase();
  if (familyLower.includes('woody') || familyLower.includes('cedar') || familyLower.includes('sandalwood') || familyLower.includes('oud')) woodyHits += 2;
  if (familyLower.includes('floral') || familyLower.includes('rose') || familyLower.includes('jasmine')) floralHits += 2;
  if (familyLower.includes('spicy') || familyLower.includes('oriental') || familyLower.includes('amber') || familyLower.includes('resin')) warmResinousSpicesHits += 2;
  if (familyLower.includes('earth') || familyLower.includes('clay') || familyLower.includes('petrichor') || familyLower.includes('mitti') || familyLower.includes('chypre')) earthyClayHits += 2;

  // Longevity / fixative heuristic
  const longHours = parseInt(fragrance.longevity || '6', 10);
  if (!isNaN(longHours)) {
    longevityFixativeHits += Math.min(3, Math.max(1, longHours / 3));
  }
  if (fragrance.is_oil_based || (fragrance.format && (fragrance.format === 'Attar' || fragrance.format === 'Extrait de Parfum'))) {
    longevityFixativeHits += 2;
  }

  allNotes.forEach(note => {
    // Earthy / Clay
    if (note.includes('mitti') || note.includes('petrichor') || note.includes('earth') || note.includes('clay') || note.includes('soil') || note.includes('moss') || note.includes('oakmoss') || note.includes('vetiver') || note.includes('khus')) {
      earthyClayHits += 1.5;
    }
    // Woody
    if (note.includes('wood') || note.includes('cedar') || note.includes('sandalwood') || note.includes('chandan') || note.includes('oud') || note.includes('agarwood') || note.includes('patchouli') || note.includes('cypress') || note.includes('guaiac') || note.includes('pine')) {
      woodyHits += 1.5;
    }
    // Floral
    if (note.includes('rose') || note.includes('gulab') || note.includes('jasmine') || note.includes('mogra') || note.includes('tuberose') || note.includes('rajnigandha') || note.includes('kewra') || note.includes('kewda') || note.includes('champa') || note.includes('neroli') || note.includes('iris') || note.includes('nargis') || note.includes('lily') || note.includes('violet') || note.includes('lavender')) {
      floralHits += 1.5;
    }
    // Warm Resinous / Spices
    if (note.includes('amber') || note.includes('spice') || note.includes('cardamom') || note.includes('elaichi') || note.includes('cinnamon') || note.includes('clove') || note.includes('saffron') || note.includes('kesar') || note.includes('zafran') || note.includes('shamama') || note.includes('pepper') || note.includes('resin') || note.includes('myrrh') || note.includes('frankincense') || note.includes('benzoin') || note.includes('loban') || note.includes('vanilla') || note.includes('tonka') || note.includes('incense')) {
      warmResinousSpicesHits += 1.5;
    }
    // Fixatives
    if (note.includes('musk') || note.includes('ambergris') || note.includes('ambroxan') || note.includes('civet') || note.includes('sandalwood') || note.includes('agarwood') || note.includes('oud')) {
      longevityFixativeHits += 1.2;
    }
  });

  const totalHits = Math.max(1, woodyHits + floralHits + warmResinousSpicesHits + earthyClayHits);
  const woody = Math.min(1.0, Number((woodyHits / totalHits * 1.5).toFixed(2)));
  const floral = Math.min(1.0, Number((floralHits / totalHits * 1.5).toFixed(2)));
  const warm_resinous_spices = Math.min(1.0, Number((warmResinousSpicesHits / totalHits * 1.5).toFixed(2)));
  const earthy_clay = Math.min(1.0, Number((earthyClayHits / totalHits * 1.5).toFixed(2)));
  const longevity_fixative = Math.min(1.0, Number(Math.max(0.2, (longevityFixativeHits / 5)).toFixed(2)));

  return [
    freshness,
    sweetness,
    intensity,
    woody,
    floral,
    warm_resinous_spices,
    earthy_clay,
    longevity_fixative
  ];
}

/**
 * Returns 8D olfactory vector in 0-100 range as requested in Section 19
 */
export function extractFragranceVector8D_100(fragrance: Omit<Fragrance, 'cluster_id' | 'cluster_label' | 'vector'>): {
  freshness: number;
  sweetness: number;
  intensity: number;
  woody: number;
  floral: number;
  warm_resinous_spices: number;
  earthy_clay: number;
  longevity_fixative: number;
} {
  const [f, s, i, w, fl, wr, ec, lf] = extractFragranceVector(fragrance);
  return {
    freshness: Math.round(f * 100),
    sweetness: Math.round(s * 100),
    intensity: Math.round(i * 100),
    woody: Math.round(w * 100),
    floral: Math.round(fl * 100),
    warm_resinous_spices: Math.round(wr * 100),
    earthy_clay: Math.round(ec * 100),
    longevity_fixative: Math.round(lf * 100)
  };
}

/**
 * Creates user preference vector matching the 8D feature space
 */
export function createUserPreferenceVector(preferences: UserPreferences): number[] {
  const sweetness = preferences.sweetness ? preferences.sweetness / 10 : 0.5;
  const freshness = preferences.freshness ? preferences.freshness / 10 : 0.5;
  const intensity = preferences.intensity ? preferences.intensity / 10 : 0.6;

  let woody = 0.3;
  let floral = 0.3;
  let warm_resinous_spices = 0.3;
  let earthy_clay = 0.2;
  let longevity_fixative = 0.6;

  const families = (preferences.favorite_family || []).map(f => f.toLowerCase());
  if (families.some(f => f.includes('wood') || f.includes('oud') || f.includes('cedar'))) woody = 0.9;
  if (families.some(f => f.includes('floral') || f.includes('rose') || f.includes('jasmine'))) floral = 0.9;
  if (families.some(f => f.includes('spic') || f.includes('amber') || f.includes('oriental') || f.includes('gourmand'))) warm_resinous_spices = 0.9;
  if (families.some(f => f.includes('earth') || f.includes('petrichor') || f.includes('mitti') || f.includes('chypre'))) earthy_clay = 0.9;

  (preferences.preferred_notes || []).forEach(n => {
    const lower = n.toLowerCase();
    if (lower.includes('wood') || lower.includes('sandal') || lower.includes('cedar') || lower.includes('oud')) woody = Math.min(1.0, woody + 0.3);
    if (lower.includes('rose') || lower.includes('jasmine') || lower.includes('floral') || lower.includes('mogra')) floral = Math.min(1.0, floral + 0.3);
    if (lower.includes('amber') || lower.includes('spice') || lower.includes('saffron') || lower.includes('cardamom')) warm_resinous_spices = Math.min(1.0, warm_resinous_spices + 0.3);
    if (lower.includes('mitti') || lower.includes('khus') || lower.includes('earth') || lower.includes('clay') || lower.includes('vetiver')) earthy_clay = Math.min(1.0, earthy_clay + 0.4);
  });

  return [
    freshness,
    sweetness,
    intensity,
    woody,
    floral,
    warm_resinous_spices,
    earthy_clay,
    longevity_fixative
  ];
}
