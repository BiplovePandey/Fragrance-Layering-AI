import { Fragrance } from '../types.js';

export type MarketedClassification = 'masculine' | 'feminine' | 'unisex' | 'unspecified';

export type DiscoveryCollectionId = 'all' | 'for-him' | 'for-her' | 'unisex-niche';

export interface CollectionConfig {
  id: DiscoveryCollectionId;
  label: string;
  shortLabel: string;
  marketedTarget?: 'masculine' | 'feminine' | 'unisex';
  editorialTitle: string;
  editorialSubtitle: string;
  landingHeadline: string;
  landingEditorial: string;
  palette: {
    accent: string;
    glow: string;
    border: string;
    cardBg: string;
    badgeBg: string;
    badgeText: string;
    chipActive: string;
  };
}

export const DISCOVERY_COLLECTIONS: Record<DiscoveryCollectionId, CollectionConfig> = {
  all: {
    id: 'all',
    label: 'All Fragrances',
    shortLabel: 'All Scents',
    editorialTitle: 'The Complete Atelier Archive',
    editorialSubtitle: 'Every verified flacon, heritage attar, and olfactory composition.',
    landingHeadline: 'The Olfactory Cosmos',
    landingEditorial: 'A panoramic sanctuary of artisanal extracts, heritage Kannauj distillates, and contemporary haute parfumerie without boundaries.',
    palette: {
      accent: '#D4AF37',
      glow: 'rgba(212, 175, 55, 0.2)',
      border: 'border-amber-500/30',
      cardBg: 'from-amber-950/20 via-stone-900/40 to-stone-950/60',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-300',
      chipActive: 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
    }
  },
  'for-him': {
    id: 'for-him',
    label: 'For Him',
    shortLabel: 'For Him',
    marketedTarget: 'masculine',
    editorialTitle: 'Smoked Woods & Botanical Chords',
    editorialSubtitle: 'Artisanal compositions marked by architectural depth, vetiver, deep amber, and leather tones.',
    landingHeadline: 'Explore the Art of Masculine Fragrance',
    landingEditorial: 'Documented catalogue selections positioned around structural woods, resonant drydowns, aromatic vetivers, and botanical resinous depths — open to every wearer.',
    palette: {
      accent: '#C28B45',
      glow: 'rgba(194, 139, 69, 0.25)',
      border: 'border-amber-700/40',
      cardBg: 'from-[#1C140E]/90 via-[#16110D]/90 to-[#0F0B09]/95',
      badgeBg: 'bg-amber-900/20',
      badgeText: 'text-amber-300',
      chipActive: 'bg-[#C28B45]/25 text-amber-200 border-[#C28B45]/60 shadow-[0_0_15px_rgba(194,139,69,0.3)]'
    }
  },
  'for-her': {
    id: 'for-her',
    label: 'For Her',
    shortLabel: 'For Her',
    marketedTarget: 'feminine',
    editorialTitle: 'Velvet Florals & Radiant Chords',
    editorialSubtitle: 'Luminous compositions steeped in damask rose, night-blooming jasmine, creamy sandalwood, and warm spices.',
    landingHeadline: 'Explore the Art of Feminine Fragrance',
    landingEditorial: 'Documented catalogue creations celebrating petal-soft sillage, golden vanillas, luminous florals, and diaphanous amber mists — designed to be worn without limitation.',
    palette: {
      accent: '#E0A899',
      glow: 'rgba(224, 168, 153, 0.25)',
      border: 'border-rose-400/30',
      cardBg: 'from-[#1F1416]/90 via-[#181013]/90 to-[#120B0D]/95',
      badgeBg: 'bg-rose-950/30',
      badgeText: 'text-rose-200',
      chipActive: 'bg-rose-500/20 text-rose-200 border-rose-400/50 shadow-[0_0_15px_rgba(224,168,153,0.3)]'
    }
  },
  'unisex-niche': {
    id: 'unisex-niche',
    label: 'Unisex & Niche',
    shortLabel: 'Unisex & Niche',
    marketedTarget: 'unisex',
    editorialTitle: 'Pure Olfactory Architecture',
    editorialSubtitle: 'Boundary-free artisanal perfumes, sacred heritage attars, and high-concept independent creations.',
    landingHeadline: 'Beyond Boundaries',
    landingEditorial: 'Parchment, Kannauj copper stills, earthy petrichor, and mineral facets crafted for olfactory purity and artistic vision, independent of gender conventions.',
    palette: {
      accent: '#7EB09B',
      glow: 'rgba(126, 176, 155, 0.25)',
      border: 'border-emerald-600/30',
      cardBg: 'from-[#111915]/90 via-[#0F1412]/90 to-[#0A0E0C]/95',
      badgeBg: 'bg-emerald-950/30',
      badgeText: 'text-emerald-200',
      chipActive: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50 shadow-[0_0_15px_rgba(126,176,155,0.3)]'
    }
  }
};

/**
 * Normalizes any fragrance gender string into our canonical MarketedClassification.
 */
export function getMarketedClassification(fragrance?: Partial<Fragrance> | null): MarketedClassification {
  if (!fragrance) return 'unspecified';
  const g = (fragrance.gender || '').toLowerCase().trim();
  if (g === 'masculine' || g === 'men' || g === "men's") return 'masculine';
  if (g === 'feminine' || g === 'women' || g === "women's") return 'feminine';
  if (g === 'unisex' || g === 'universal' || g === 'shared') return 'unisex';
  return 'unspecified';
}

/**
 * Maps a fragrance to its primary DiscoveryCollectionId.
 */
export function getFragranceDiscoveryCollection(fragrance?: Partial<Fragrance> | null): DiscoveryCollectionId {
  const classification = getMarketedClassification(fragrance);
  if (classification === 'masculine') return 'for-him';
  if (classification === 'feminine') return 'for-her';
  if (classification === 'unisex') return 'unisex-niche';
  return 'all';
}

/**
 * Returns formatted badge metadata for display in chamber and modals.
 */
export function getMarketedClassificationBadge(fragrance?: Partial<Fragrance> | null): {
  label: string;
  editorialTag: string;
  collectionId: DiscoveryCollectionId;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  isUnspecified: boolean;
} {
  const classification = getMarketedClassification(fragrance);

  switch (classification) {
    case 'masculine':
      return {
        label: 'For Him',
        editorialTag: 'Masculine Marketed',
        collectionId: 'for-him',
        colorClass: 'text-amber-300',
        borderClass: 'border-amber-600/40',
        bgClass: 'bg-amber-950/40',
        isUnspecified: false
      };
    case 'feminine':
      return {
        label: 'For Her',
        editorialTag: 'Feminine Marketed',
        collectionId: 'for-her',
        colorClass: 'text-rose-200',
        borderClass: 'border-rose-400/40',
        bgClass: 'bg-rose-950/40',
        isUnspecified: false
      };
    case 'unisex':
      return {
        label: 'Unisex & Niche',
        editorialTag: 'Universal / Unisex Marketed',
        collectionId: 'unisex-niche',
        colorClass: 'text-emerald-200',
        borderClass: 'border-emerald-500/40',
        bgClass: 'bg-emerald-950/40',
        isUnspecified: false
      };
    default:
      return {
        label: 'Not specified',
        editorialTag: 'Unclassified / Open Palette',
        collectionId: 'all',
        colorClass: 'text-stone-300',
        borderClass: 'border-stone-700/40',
        bgClass: 'bg-stone-900/40',
        isUnspecified: true
      };
  }
}

/**
 * Computes live, accurate catalogue counts for every discovery collection.
 */
export function computeCollectionCounts(fragrances: Fragrance[]): {
  all: number;
  'for-him': number;
  'for-her': number;
  'unisex-niche': number;
  unclassified: number;
} {
  const counts = {
    all: fragrances.length,
    'for-him': 0,
    'for-her': 0,
    'unisex-niche': 0,
    unclassified: 0
  };

  fragrances.forEach((f) => {
    const classification = getMarketedClassification(f);
    if (classification === 'masculine') counts['for-him']++;
    else if (classification === 'feminine') counts['for-her']++;
    else if (classification === 'unisex') counts['unisex-niche']++;
    else counts.unclassified++;
  });

  return counts;
}
