import fs from 'fs';
import path from 'path';
import { Fragrance, UserPreferences, NoteTaxonomyEntry } from '../../src/types.js';

export const FEATURE_NAMES = [
  'sweetness',
  'freshness',
  'woody',
  'floral',
  'citrus',
  'spicy',
  'gourmand',
  'intensity'
] as const;

export type FeatureKey = typeof FEATURE_NAMES[number];

// Fallback olfactory note keywords for categorization
const BASE_NOTE_CATEGORIES: Record<string, FeatureKey> = {
  // Citrus
  bergamot: 'citrus',
  lemon: 'citrus',
  lime: 'citrus',
  grapefruit: 'citrus',
  mandarin: 'citrus',
  orange: 'citrus',
  neroli: 'citrus',
  petitgrain: 'citrus',
  yuzu: 'citrus',
  mosambi: 'citrus',
  'sweet lime': 'citrus',

  // Woody & Earthy Roots (Including Indian attar bases)
  sandalwood: 'woody',
  chandan: 'woody',
  cedar: 'woody',
  cedarwood: 'woody',
  deodar: 'woody',
  vetiver: 'woody',
  'ruh khus': 'woody',
  khus: 'woody',
  mitti: 'woody',
  'geeli mitti': 'woody',
  petrichor: 'woody',
  clay: 'woody',
  earth: 'woody',
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

  // Spicy & Resinous (Western Spices & Indian Heritage Accords)
  cardamom: 'spicy',
  elaichi: 'spicy',
  cinnamon: 'spicy',
  dalchini: 'spicy',
  pepper: 'spicy',
  'black pepper': 'spicy',
  'pink pepper': 'spicy',
  'calicut pepper': 'spicy',
  sichuan: 'spicy',
  nutmeg: 'spicy',
  jaiphal: 'spicy',
  clove: 'spicy',
  laung: 'spicy',
  saffron: 'spicy',
  kesar: 'spicy',
  zafran: 'spicy',
  shamama: 'spicy',
  ginger: 'spicy',
  'star anise': 'spicy',
  coriander: 'spicy',
  chai: 'spicy',
  henna: 'spicy',
  benzoin: 'spicy',
  loban: 'spicy',
  frankincense: 'spicy',
  sambrani: 'spicy',
  guggul: 'spicy',
  myrrh: 'spicy',
  labdanum: 'spicy',
  amber: 'spicy',

  // Fruits / Indian Ingredients
  mango: 'citrus',
  'raw mango': 'citrus',
  kairi: 'citrus',
  kokum: 'citrus',
  jamun: 'citrus',
  pomegranate: 'citrus',
  anar: 'citrus',
  guava: 'citrus',

  // Gourmand
  vanilla: 'gourmand',
  praline: 'gourmand',
  tonka: 'gourmand',
  caramel: 'gourmand',
  cacao: 'gourmand',
  chocolate: 'gourmand',
  coffee: 'gourmand',
  jaggery: 'gourmand',
  gur: 'gourmand',
  almond: 'gourmand',
  cognac: 'gourmand',
  rum: 'gourmand',
  honey: 'gourmand',
  shahad: 'gourmand',
  sugar: 'gourmand',
  coconut: 'gourmand',
  nariyal: 'gourmand',
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
      else if (entry.category === 'citrus' || entry.note_family === 'Citrus') feature = 'citrus';
      else if (entry.category === 'spicy' || entry.category === 'resinous_warm' || entry.note_family === 'Spices' || entry.note_family === 'Resinous / warm') feature = 'spicy';
      else if (entry.category === 'gourmand' || entry.note_family === 'Sweet / gourmand') feature = 'gourmand';
      else if (entry.category === 'fruit' || entry.note_family === 'Fruits / Indian ingredients') feature = 'citrus';
      else if (entry.category === 'earthy_clay' || entry.note_family === 'Earthy') feature = 'woody';

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
 * Extracts normalized 8-dimensional feature vector:
 * [sweetness, freshness, woody, floral, citrus, spicy, gourmand, intensity]
 * All values scaled to [0.0, 1.0]
 */
export function extractFragranceVector(fragrance: Omit<Fragrance, 'cluster_id' | 'cluster_label' | 'vector'>): number[] {
  const sweetness = Math.max(0.1, Math.min(1.0, fragrance.sweetness / 10));
  const freshness = Math.max(0.1, Math.min(1.0, fragrance.freshness / 10));
  const intensity = Math.max(0.1, Math.min(1.0, fragrance.intensity / 10));

  let woodyCount = 0;
  let floralCount = 0;
  let citrusCount = 0;
  let spicyCount = 0;
  let gourmandCount = 0;

  const allNotes = [
    ...(fragrance.top_notes || []),
    ...(fragrance.middle_notes || []),
    ...(fragrance.base_notes || [])
  ].map(n => n.toLowerCase());

  // Also check fragrance family
  const familyLower = (fragrance.fragrance_family || '').toLowerCase();
  if (familyLower.includes('woody') || familyLower.includes('chypre') || familyLower.includes('earth') || familyLower.includes('petrichor')) woodyCount += 2;
  if (familyLower.includes('floral')) floralCount += 2;
  if (familyLower.includes('citrus')) citrusCount += 2;
  if (familyLower.includes('spicy') || familyLower.includes('oriental') || familyLower.includes('amber')) spicyCount += 2;
  if (familyLower.includes('gourmand') || familyLower.includes('vanilla')) gourmandCount += 2;

  allNotes.forEach(note => {
    const mapping = getTaxonomyMapping(note);
    if (mapping.feature_key === 'woody') woodyCount += 1;
    else if (mapping.feature_key === 'floral') floralCount += 1;
    else if (mapping.feature_key === 'citrus') citrusCount += 1;
    else if (mapping.feature_key === 'spicy') spicyCount += 1;
    else if (mapping.feature_key === 'gourmand') gourmandCount += 1;
  });

  const totalNoteHits = Math.max(1, woodyCount + floralCount + citrusCount + spicyCount + gourmandCount);

  // Normalize note profile scores to range 0.05 - 0.95
  const woody = Math.min(1.0, Number((woodyCount / totalNoteHits * 1.5).toFixed(2)));
  const floral = Math.min(1.0, Number((floralCount / totalNoteHits * 1.5).toFixed(2)));
  const citrus = Math.min(1.0, Number((citrusCount / totalNoteHits * 1.5).toFixed(2)));
  const spicy = Math.min(1.0, Number((spicyCount / totalNoteHits * 1.5).toFixed(2)));
  const gourmand = Math.min(1.0, Number((gourmandCount / totalNoteHits * 1.5).toFixed(2)));

  return [
    sweetness,
    freshness,
    woody,
    floral,
    citrus,
    spicy,
    gourmand,
    intensity
  ];
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
  let citrus = 0.3;
  let spicy = 0.3;
  let gourmand = 0.3;

  const families = (preferences.favorite_family || []).map(f => f.toLowerCase());
  if (families.some(f => f.includes('wood') || f.includes('earth'))) woody = 0.9;
  if (families.some(f => f.includes('floral') || f.includes('rose'))) floral = 0.9;
  if (families.some(f => f.includes('citrus') || f.includes('fresh'))) citrus = 0.9;
  if (families.some(f => f.includes('spic') || f.includes('oriental'))) spicy = 0.9;
  if (families.some(f => f.includes('gourmand') || f.includes('sweet') || f.includes('vanilla'))) gourmand = 0.9;

  // If preferred notes provided, boost them
  (preferences.preferred_notes || []).forEach(n => {
    const mapping = getTaxonomyMapping(n);
    if (mapping.feature_key === 'woody') woody = Math.min(1.0, woody + 0.3);
    else if (mapping.feature_key === 'floral') floral = Math.min(1.0, floral + 0.3);
    else if (mapping.feature_key === 'citrus') citrus = Math.min(1.0, citrus + 0.3);
    else if (mapping.feature_key === 'spicy') spicy = Math.min(1.0, spicy + 0.3);
    else if (mapping.feature_key === 'gourmand') gourmand = Math.min(1.0, gourmand + 0.3);
  });

  return [
    sweetness,
    freshness,
    woody,
    floral,
    citrus,
    spicy,
    gourmand,
    intensity
  ];
}
