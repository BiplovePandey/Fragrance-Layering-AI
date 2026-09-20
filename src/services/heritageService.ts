import { HeritageEntry, Fragrance, OlfactoryVector8D } from '../types.js';
import { extractFragranceVector8D } from './olfactoryIntelligence.js';

export interface HeritageMapRegion {
  id: string;
  name: string;
  hindiName: string;
  state: string;
  heritageIds: string[];
  coordinates: { lat: number; lng: number };
  svgCoordinates: { x: number; y: number }; // Relative percentage for map plotting (0-100)
  signatureMaterial: string;
  botanicalTradition: string;
  historicalPeriod: string;
  color: string;
}

export const HERITAGE_MAP_REGIONS: HeritageMapRegion[] = [
  {
    id: 'kashmir',
    name: 'Pampore',
    hindiName: 'पाम्पोर (कश्मीर)',
    state: 'Kashmir Valley',
    heritageIds: ['kashmiri-zafran'],
    coordinates: { lat: 34.02, lng: 74.93 },
    svgCoordinates: { x: 30, y: 14 },
    signatureMaterial: 'Kashmiri Zafran (Saffron)',
    botanicalTradition: 'Centuries of Saffron Cultivation on Karewa terraces',
    historicalPeriod: 'Ancient Silk Road & Mughal Imperial Unguents',
    color: '#D97706' // Saffron amber
  },
  {
    id: 'kannauj',
    name: 'Kannauj & Hasayan',
    hindiName: 'कन्नौज (इत्र नगरी)',
    state: 'Uttar Pradesh',
    heritageIds: ['kannauj-mitti-attar', 'kannauj-gulab', 'kannauj-shamama'],
    coordinates: { lat: 27.05, lng: 79.91 },
    svgCoordinates: { x: 44, y: 35 },
    signatureMaterial: 'Mitti Attar, Ruh Gulab & Shamama',
    botanicalTradition: 'Closed-loop Deg & Bhapka Hydro-distillation over wood fires',
    historicalPeriod: '400+ Years Continuous Distillation Heritage (GI Protected)',
    color: '#EA580C' // Terracotta clay
  },
  {
    id: 'rajasthan',
    name: 'Bharatpur Riverbeds',
    hindiName: 'भरतपुर (राजस्थान)',
    state: 'Rajasthan / Western Gangetic Basin',
    heritageIds: ['wild-ruh-khus'],
    coordinates: { lat: 27.21, lng: 77.49 },
    svgCoordinates: { x: 37, y: 36 },
    signatureMaterial: 'Wild Ruh Khus (River Vetiver)',
    botanicalTradition: 'Wild riverbed rhizome digging & copper distillation',
    historicalPeriod: 'Ancient Vedic Cooling Ayurvedic Formulations',
    color: '#059669' // Emerald root green
  },
  {
    id: 'assam',
    name: 'Upper Assam Rainforests',
    hindiName: 'ऊपरी असम (अगरु वन)',
    state: 'Assam',
    heritageIds: ['assam-oud'],
    coordinates: { lat: 26.80, lng: 94.63 },
    svgCoordinates: { x: 88, y: 32 },
    signatureMaterial: 'Assam Dehn Al Oud (Agarwood)',
    botanicalTradition: 'Aged infected Aquilaria heartwood slow hydro-distillation',
    historicalPeriod: 'Ancient Sanskrit Aguru texts & Forest Traditions',
    color: '#78350F' // Aged dark oud
  },
  {
    id: 'ganjam',
    name: 'Ganjam Coastal Belt',
    hindiName: 'गंजाम (ओडिशा तट)',
    state: 'Odisha',
    heritageIds: ['orissa-kewda'],
    coordinates: { lat: 19.38, lng: 85.05 },
    svgCoordinates: { x: 63, y: 55 },
    signatureMaterial: 'Ganjam Kewda (Screw Pine)',
    botanicalTradition: 'Pre-dawn harvest of fragrant male spadices',
    historicalPeriod: 'GI Protected Eastern Maritime Flower Heritage',
    color: '#EAB308' // Golden nectar floral
  },
  {
    id: 'mysore',
    name: 'Mysore & Western Ghats',
    hindiName: 'मैसूर (कर्नाटक)',
    state: 'Karnataka',
    heritageIds: ['mysore-chandan'],
    coordinates: { lat: 12.30, lng: 76.64 },
    svgCoordinates: { x: 39, y: 77 },
    signatureMaterial: 'Mysore Chandan (White Sandalwood)',
    botanicalTradition: 'High-santalol heartwood steam distillation & universal fixative',
    historicalPeriod: 'Ancient Vedic Rituals & GI Protected Reserve Forests',
    color: '#B45309' // Creamy sandalwood wood
  },
  {
    id: 'madurai',
    name: 'Madurai',
    hindiName: 'मदुरै (तमिलनाडु)',
    state: 'Tamil Nadu',
    heritageIds: ['madurai-mogra'],
    coordinates: { lat: 9.92, lng: 78.11 },
    svgCoordinates: { x: 42, y: 88 },
    signatureMaterial: 'Madurai Mogra & Chameli (Jasmine)',
    botanicalTradition: 'Dawn-picked unopened Jasmine buds for temple garlands and attar',
    historicalPeriod: 'Ancient Sangam Era & GI Protected Floral Heritage',
    color: '#F472B6' // Jasmine petal pink
  }
];

/**
 * Computes an authentic 8-D vector for a heritage entry using the existing
 * algorithmic vector engine in olfactoryIntelligence.ts
 */
export function extractHeritageVector8D(entry: HeritageEntry): OlfactoryVector8D {
  const dummyFrag: Partial<Fragrance> = {
    id: 99000,
    name: entry.name,
    brand: 'Traditional Indian Archive',
    fragrance_family: entry.olfactory_profile.dominant_families.join(', '),
    description: `${entry.olfactory_profile.description} ${entry.extraction_method}`,
    top_notes: entry.olfactory_profile.notes.slice(0, 2),
    middle_notes: entry.olfactory_profile.notes.slice(2, 4),
    base_notes: entry.olfactory_profile.notes.slice(4),
    format: 'Attar',
    is_oil_based: true,
    longevity: '12-24 hrs',
    freshness: entry.olfactory_profile.dominant_families.includes('Fresh') ? 8 : 4,
    sweetness: entry.olfactory_profile.dominant_families.includes('Sweet') ? 7 : 4,
    intensity: 9
  };

  return extractFragranceVector8D(dummyFrag as Fragrance);
}

/**
 * Checks whether a fragrance matches or connects with a given heritage entry.
 * Based on authentic project data matching: names, brands, notes, accords, materials.
 */
export function isFragranceHeritageMatch(fragrance: Fragrance, entry: HeritageEntry): {
  isMatch: boolean;
  matchReason: string;
  relationshipType: 'direct_material' | 'brand_lineage' | 'olfactory_accord' | 'equivalent';
} {
  const fName = (fragrance.name || '').toLowerCase();
  const fBrand = (fragrance.brand || '').toLowerCase();
  const fDesc = (fragrance.description || '').toLowerCase();
  const fNotes = [
    ...(fragrance.top_notes || []),
    ...(fragrance.middle_notes || []),
    ...(fragrance.base_notes || []),
    ...(fragrance.accords || []),
    ...(fragrance.heritage_materials || [])
  ].map((n) => n.toLowerCase());

  const eName = entry.name.toLowerCase();
  const eNotes = entry.olfactory_profile.notes.map((n) => n.toLowerCase());

  // Check direct modern Indian listed references
  for (const mod of entry.modern_indian_fragrances) {
    if (fName.includes(mod.name.toLowerCase()) || mod.name.toLowerCase().includes(fName)) {
      return {
        isMatch: true,
        matchReason: `Direct modern Indian heritage bottle: ${mod.brand} • ${mod.name}`,
        relationshipType: 'direct_material'
      };
    }
  }

  // Check international equivalents listed
  for (const eq of entry.international_equivalents) {
    if (fName.includes(eq.name.toLowerCase()) || eq.name.toLowerCase().includes(fName)) {
      return {
        isMatch: true,
        matchReason: `Contemporary artistic equivalent: ${eq.brand} • ${eq.name}`,
        relationshipType: 'equivalent'
      };
    }
  }

  // Specific material matches based on verified traditional notes
  if (entry.id === 'kannauj-mitti-attar') {
    const hasMitti = fNotes.some((n) => n.includes('mitti') || n.includes('clay') || n.includes('petrichor') || n.includes('geosmin') || n.includes('baked earth'));
    if (hasMitti || fName.includes('mitti') || fDesc.includes('mitti') || fDesc.includes('petrichor')) {
      return {
        isMatch: true,
        matchReason: 'Features authentic baked clay / petrichor geosmin accords',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'wild-ruh-khus') {
    const hasKhus = fNotes.some((n) => n.includes('khus') || n.includes('vetiver') || n.includes('ruh khus'));
    if (hasKhus || fName.includes('khus') || fName.includes('vetiver')) {
      return {
        isMatch: true,
        matchReason: 'Features wild vetiver / Ruh Khus root notes',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'kannauj-gulab') {
    const hasRose = fNotes.some((n) => n.includes('rose') || n.includes('gulab') || n.includes('damascena'));
    if (hasRose || fName.includes('rose') || fName.includes('gulab')) {
      return {
        isMatch: true,
        matchReason: 'Contains steam-distilled Damask rose floral heart',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'mysore-chandan') {
    const hasChandan = fNotes.some((n) => n.includes('chandan') || n.includes('sandalwood') || n.includes('santalum'));
    if (hasChandan || fName.includes('sandalwood') || fName.includes('chandan') || fBrand.includes('forest essentials')) {
      return {
        isMatch: true,
        matchReason: 'Anchored by creamy sacred sandalwood base fixative',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'orissa-kewda') {
    const hasKewda = fNotes.some((n) => n.includes('kewda') || n.includes('kewra') || n.includes('pandanus'));
    if (hasKewda || fName.includes('kewda') || fDesc.includes('kewda')) {
      return {
        isMatch: true,
        matchReason: 'Features ethereal fragrant screw pine (Kewda) floral notes',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'kannauj-shamama') {
    const hasShamama = fNotes.some((n) => n.includes('shamama') || (n.includes('cardamom') && n.includes('clove')));
    if (hasShamama || fName.includes('shamama') || fDesc.includes('shamama') || fDesc.includes('40 herbs')) {
      return {
        isMatch: true,
        matchReason: 'Complex warm herbal-resinous winter compound accord',
        relationshipType: 'olfactory_accord'
      };
    }
  }

  if (entry.id === 'madurai-mogra') {
    const hasMogra = fNotes.some((n) => n.includes('mogra') || n.includes('jasmine') || n.includes('chameli') || n.includes('sambac'));
    if (hasMogra || fName.includes('mogra') || fName.includes('jasmine')) {
      return {
        isMatch: true,
        matchReason: 'Contains night-blooming Jasmine Sambac floral indoles',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'kashmiri-zafran') {
    const hasZafran = fNotes.some((n) => n.includes('saffron') || n.includes('zafran') || n.includes('kesar'));
    if (hasZafran || fName.includes('saffron') || fName.includes('kesar')) {
      return {
        isMatch: true,
        matchReason: 'Infused with golden crimson saffron spice accords',
        relationshipType: 'direct_material'
      };
    }
  }

  if (entry.id === 'assam-oud') {
    const hasOud = fNotes.some((n) => n.includes('oud') || n.includes('agarwood') || n.includes('agallocha'));
    if (hasOud || fName.includes('oud') || fDesc.includes('agarwood')) {
      return {
        isMatch: true,
        matchReason: 'Centered around deep subterranean Assam agarwood',
        relationshipType: 'direct_material'
      };
    }
  }

  // Cross-note overlap check
  const noteOverlap = fNotes.filter((fn) => eNotes.some((en) => fn.includes(en) || en.includes(fn)));
  if (noteOverlap.length >= 2) {
    return {
      isMatch: true,
      matchReason: `Shared heritage olfactory notes: ${noteOverlap.slice(0, 2).join(', ')}`,
      relationshipType: 'olfactory_accord'
    };
  }

  return {
    isMatch: false,
    matchReason: '',
    relationshipType: 'olfactory_accord'
  };
}

/**
 * Filters user's owned fragrances that connect to a heritage material
 */
export function findCabinetMatchesForHeritage(
  entry: HeritageEntry,
  ownedFragrances: Fragrance[]
): { fragrance: Fragrance; matchReason: string; relationshipType: string }[] {
  return ownedFragrances
    .map((f) => {
      const match = isFragranceHeritageMatch(f, entry);
      return {
        fragrance: f,
        matchReason: match.matchReason,
        relationshipType: match.relationshipType,
        isMatch: match.isMatch
      };
    })
    .filter((m) => m.isMatch);
}

/**
 * Finds all related catalog fragrances for a heritage entry
 */
export function findRelatedFragrancesForHeritage(
  entry: HeritageEntry,
  allFragrances: Fragrance[],
  limit: number = 6
): { fragrance: Fragrance; matchReason: string; relationshipType: string }[] {
  const matches = allFragrances
    .map((f) => {
      const match = isFragranceHeritageMatch(f, entry);
      return {
        fragrance: f,
        matchReason: match.matchReason,
        relationshipType: match.relationshipType,
        isMatch: match.isMatch
      };
    })
    .filter((m) => m.isMatch);

  return matches.slice(0, limit);
}
