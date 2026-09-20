import { ScentFamilyAtmosphere } from '../components/AtmosphericFragranceCanvas.js';

export type CanonicalFragranceFamily =
  | 'woody_oud'
  | 'earth_mitti'
  | 'floral'
  | 'solar_citrus'
  | 'fresh_green'
  | 'marine'
  | 'spicy_resinous';

export interface FragranceFamilyTokens {
  id: CanonicalFragranceFamily;
  displayName: string;
  subhead: string;
  atmosphereKey: ScentFamilyAtmosphere;
  primaryColor: string;
  accentAmber: string;
  iconAccent: string;
  brassHighlight: string;
  ambientGlow: string;
  mistColor: string;
  borderAccent: string;
  cardBorder: string;
  glassBg: string;
  badgeBg: string;
  badgeText: string;
  chipActiveClass: string;
  nuanceKeywords: [string, string, string];
  flaconAura: {
    coreVapor: string;
    midDiffusion: string;
    outerBloom: string;
    amber: string;
    liquidColor: string;
    capTone: string;
    accentNote: string;
  };
  palette: string[];
}

export const FRAGRANCE_FAMILY_TOKENS: Record<CanonicalFragranceFamily, FragranceFamilyTokens> = {
  woody_oud: {
    id: 'woody_oud',
    displayName: 'Woody / Oud',
    subhead: 'Deep amber, smoked walnut & burnished brass',
    atmosphereKey: 'oud',
    primaryColor: '#B45309',
    accentAmber: '#D97706',
    iconAccent: '#D97706',
    brassHighlight: '#C59A3F',
    nuanceKeywords: ['Walnut', 'Smoked Amber', 'Burnished Brass'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(180, 83, 9, 0.22) 0%, rgba(120, 53, 15, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(180, 83, 9, 0.26)',
    borderAccent: 'border-amber-700/40',
    cardBorder: 'border-amber-800/30',
    glassBg: 'bg-[#140E0A]/85',
    badgeBg: 'bg-amber-950/70 border-amber-700/40',
    badgeText: 'text-amber-200',
    chipActiveClass: 'bg-amber-900/60 text-amber-200 border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(180, 83, 9, 0.32)',
      midDiffusion: 'rgba(217, 119, 6, 0.18)',
      outerBloom: 'rgba(146, 64, 14, 0.08)',
      amber: '#D97706',
      liquidColor: 'rgba(180, 83, 9, 0.42)',
      capTone: '#C59A3F',
      accentNote: 'Smoked Agarwood & Cedar'
    },
    palette: ['#B45309', '#92400E', '#78350F', '#D97706', '#451A03']
  },

  earth_mitti: {
    id: 'earth_mitti',
    displayName: 'Earth / Mitti',
    subhead: 'Terracotta, baked clay & monsoon petrichor',
    atmosphereKey: 'earthy',
    primaryColor: '#C2410C',
    accentAmber: '#EA580C',
    iconAccent: '#EA580C',
    brassHighlight: '#B8860B',
    nuanceKeywords: ['Terracotta', 'Wet Clay', 'Copper'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(194, 65, 12, 0.22) 0%, rgba(154, 52, 18, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(194, 65, 12, 0.28)',
    borderAccent: 'border-orange-700/40',
    cardBorder: 'border-orange-800/30',
    glassBg: 'bg-[#160D09]/85',
    badgeBg: 'bg-orange-950/70 border-orange-700/40',
    badgeText: 'text-orange-200',
    chipActiveClass: 'bg-orange-900/60 text-orange-200 border-orange-600/50 shadow-[0_0_15px_rgba(234,88,12,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(194, 65, 12, 0.30)',
      midDiffusion: 'rgba(234, 88, 12, 0.16)',
      outerBloom: 'rgba(254, 215, 170, 0.08)',
      amber: '#EA580C',
      liquidColor: 'rgba(194, 65, 12, 0.38)',
      capTone: '#B8860B',
      accentNote: 'Baked Gangetic Alluvial Clay'
    },
    palette: ['#C2410C', '#9A3412', '#7C2D12', '#EA580C', '#431407']
  },

  floral: {
    id: 'floral',
    displayName: 'Floral Radiance',
    subhead: 'Damask rose, night-blooming jasmine & warm cream',
    atmosphereKey: 'rose',
    primaryColor: '#BE123C',
    accentAmber: '#E11D48',
    iconAccent: '#FB7185',
    brassHighlight: '#D4AF37',
    nuanceKeywords: ['Warm Ivory', 'Dusty Rose', 'Botanical Green'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(190, 18, 60, 0.20) 0%, rgba(159, 18, 57, 0.08) 45%, transparent 75%)',
    mistColor: 'rgba(225, 29, 72, 0.24)',
    borderAccent: 'border-rose-700/40',
    cardBorder: 'border-rose-800/30',
    glassBg: 'bg-[#180A10]/85',
    badgeBg: 'bg-rose-950/70 border-rose-700/40',
    badgeText: 'text-rose-200',
    chipActiveClass: 'bg-rose-900/60 text-rose-200 border-rose-600/50 shadow-[0_0_15px_rgba(225,29,72,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(225, 29, 72, 0.28)',
      midDiffusion: 'rgba(244, 63, 94, 0.16)',
      outerBloom: 'rgba(254, 205, 211, 0.09)',
      amber: '#FB7185',
      liquidColor: 'rgba(225, 29, 72, 0.32)',
      capTone: '#D4AF37',
      accentNote: 'Kannauj Ruh Gulab & Mogra'
    },
    palette: ['#BE123C', '#9F1239', '#881337', '#E11D48', '#4C0519']
  },

  solar_citrus: {
    id: 'solar_citrus',
    displayName: 'Solar Citrus',
    subhead: 'Sunlit bergamot, lemon blossom & warm amber zest',
    atmosphereKey: 'citrus',
    primaryColor: '#B45309',
    accentAmber: '#F59E0B',
    iconAccent: '#F59E0B',
    brassHighlight: '#E5C158',
    nuanceKeywords: ['Cream', 'Sun Gold', 'Pale Amber'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(217, 119, 6, 0.22) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 75%)',
    mistColor: 'rgba(245, 158, 11, 0.25)',
    borderAccent: 'border-amber-600/40',
    cardBorder: 'border-amber-700/30',
    glassBg: 'bg-[#161208]/85',
    badgeBg: 'bg-amber-950/70 border-amber-600/40',
    badgeText: 'text-amber-200',
    chipActiveClass: 'bg-amber-900/60 text-amber-200 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(245, 158, 11, 0.28)',
      midDiffusion: 'rgba(252, 211, 77, 0.16)',
      outerBloom: 'rgba(254, 240, 138, 0.08)',
      amber: '#F59E0B',
      liquidColor: 'rgba(245, 158, 11, 0.30)',
      capTone: '#E5C158',
      accentNote: 'Sunlit Bergamot & Neroli'
    },
    palette: ['#B45309', '#D97706', '#F59E0B', '#FBBF24', '#78350F']
  },

  fresh_green: {
    id: 'fresh_green',
    displayName: 'Fresh / Green (Khus)',
    subhead: 'Wild vetiver root, crushed pine & morning dew mist',
    atmosphereKey: 'khus',
    primaryColor: '#047857',
    accentAmber: '#10B981',
    iconAccent: '#10B981',
    brassHighlight: '#34D399',
    nuanceKeywords: ['Deep Botanical Green', 'Jade', 'Cool Mist'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(4, 120, 87, 0.20) 0%, rgba(6, 95, 70, 0.08) 45%, transparent 75%)',
    mistColor: 'rgba(16, 185, 129, 0.24)',
    borderAccent: 'border-emerald-700/40',
    cardBorder: 'border-emerald-800/30',
    glassBg: 'bg-[#081510]/85',
    badgeBg: 'bg-emerald-950/70 border-emerald-700/40',
    badgeText: 'text-emerald-200',
    chipActiveClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-600/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(16, 185, 129, 0.28)',
      midDiffusion: 'rgba(52, 211, 153, 0.16)',
      outerBloom: 'rgba(167, 243, 208, 0.08)',
      amber: '#10B981',
      liquidColor: 'rgba(16, 185, 129, 0.32)',
      capTone: '#34D399',
      accentNote: 'Wild Kannauj Khus Root'
    },
    palette: ['#047857', '#065F46', '#064E3B', '#10B981', '#022C22']
  },

  marine: {
    id: 'marine',
    displayName: 'Marine Ozone',
    subhead: 'Oceanic spray, blue-gray driftwood & cool sea glass',
    atmosphereKey: 'aquatic',
    primaryColor: '#0369A1',
    accentAmber: '#0EA5E9',
    iconAccent: '#38BDF8',
    brassHighlight: '#7DD3FC',
    nuanceKeywords: ['Blue-Gray', 'Sea Glass', 'Cool Mist'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(3, 105, 161, 0.20) 0%, rgba(2, 132, 199, 0.08) 45%, transparent 75%)',
    mistColor: 'rgba(14, 165, 233, 0.24)',
    borderAccent: 'border-sky-700/40',
    cardBorder: 'border-sky-800/30',
    glassBg: 'bg-[#081218]/85',
    badgeBg: 'bg-sky-950/70 border-sky-700/40',
    badgeText: 'text-sky-200',
    chipActiveClass: 'bg-sky-900/60 text-sky-200 border-sky-600/50 shadow-[0_0_15px_rgba(14,165,233,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(14, 165, 233, 0.26)',
      midDiffusion: 'rgba(56, 189, 248, 0.15)',
      outerBloom: 'rgba(186, 230, 253, 0.08)',
      amber: '#0284C7',
      liquidColor: 'rgba(14, 165, 233, 0.28)',
      capTone: '#D4AF37',
      accentNote: 'Coastal Driftwood & Saline Calone'
    },
    palette: ['#0369A1', '#0284C7', '#0EA5E9', '#38BDF8', '#082F49']
  },

  spicy_resinous: {
    id: 'spicy_resinous',
    displayName: 'Spicy / Resinous',
    subhead: 'Saffron, Ceylon cinnamon, deep amber & burnt orange',
    atmosphereKey: 'spicy',
    primaryColor: '#C2410C',
    accentAmber: '#EA580C',
    iconAccent: '#EA580C',
    brassHighlight: '#D97706',
    nuanceKeywords: ['Saffron', 'Burnt Orange', 'Resin Amber'],
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(234, 88, 12, 0.22) 0%, rgba(185, 28, 28, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(234, 88, 12, 0.28)',
    borderAccent: 'border-orange-600/40',
    cardBorder: 'border-orange-700/30',
    glassBg: 'bg-[#180C07]/85',
    badgeBg: 'bg-orange-950/70 border-orange-600/40',
    badgeText: 'text-orange-200',
    chipActiveClass: 'bg-orange-900/60 text-orange-200 border-orange-500/50 shadow-[0_0_15px_rgba(234,88,12,0.2)]',
    flaconAura: {
      coreVapor: 'rgba(234, 88, 12, 0.32)',
      midDiffusion: 'rgba(249, 115, 22, 0.18)',
      outerBloom: 'rgba(254, 215, 170, 0.09)',
      amber: '#EA580C',
      liquidColor: 'rgba(234, 88, 12, 0.40)',
      capTone: '#D97706',
      accentNote: 'Kashmiri Saffron & Sacred Frankincense'
    },
    palette: ['#C2410C', '#B45309', '#EA580C', '#F97316', '#7C2D12']
  }
};

/**
 * Robust canonical fragrance family resolver.
 * Parses fragrance family strings, perfume titles, and note accords to map to the 7 canonical visual families.
 */
export function resolveFragranceFamily(
  familyOrAtmosphere?: string | null,
  name?: string | null,
  notes?: string[] | null
): CanonicalFragranceFamily {
  const query = [
    familyOrAtmosphere || '',
    name || '',
    ...(notes || [])
  ].join(' ').toLowerCase();

  if (
    query.includes('mitti') ||
    query.includes('petrichor') ||
    query.includes('clay') ||
    query.includes('earth') ||
    query.includes('geosmin') ||
    query.includes('alluvial')
  ) {
    return 'earth_mitti';
  }

  if (
    query.includes('khus') ||
    query.includes('vetiver') ||
    query.includes('vetivert') ||
    query.includes('green') ||
    query.includes('pine') ||
    query.includes('juniper') ||
    query.includes('alpine') ||
    query.includes('herbal') ||
    query.includes('galbanum') ||
    query.includes('moss')
  ) {
    return 'fresh_green';
  }

  if (
    query.includes('rose') ||
    query.includes('gulab') ||
    query.includes('floral') ||
    query.includes('jasmine') ||
    query.includes('mogra') ||
    query.includes('chameli') ||
    query.includes('tuberose') ||
    query.includes('soliflore') ||
    query.includes('gardenia') ||
    query.includes('iris') ||
    query.includes('peony')
  ) {
    return 'floral';
  }

  if (
    query.includes('citrus') ||
    query.includes('bergamot') ||
    query.includes('lemon') ||
    query.includes('mandarin') ||
    query.includes('grapefruit') ||
    query.includes('lime') ||
    query.includes('yuzu') ||
    query.includes('neroli') ||
    query.includes('orange blossom') ||
    query.includes('solar')
  ) {
    return 'solar_citrus';
  }

  if (
    query.includes('marine') ||
    query.includes('aquatic') ||
    query.includes('sea') ||
    query.includes('ocean') ||
    query.includes('salt') ||
    query.includes('water') ||
    query.includes('calone') ||
    query.includes('driftwood')
  ) {
    return 'marine';
  }

  if (
    query.includes('saffron') ||
    query.includes('cinnamon') ||
    query.includes('cardamom') ||
    query.includes('clove') ||
    query.includes('spicy') ||
    query.includes('spiced') ||
    query.includes('frankincense') ||
    query.includes('resinous') ||
    query.includes('resin') ||
    query.includes('myrrh') ||
    query.includes('incense') ||
    query.includes('pepper')
  ) {
    return 'spicy_resinous';
  }

  if (
    query.includes('oud') ||
    query.includes('agarwood') ||
    query.includes('sandalwood') ||
    query.includes('chandan') ||
    query.includes('cedar') ||
    query.includes('woody') ||
    query.includes('woods') ||
    query.includes('patchouli') ||
    query.includes('amber') ||
    query.includes('leather') ||
    query.includes('smoke') ||
    query.includes('tobacco')
  ) {
    return 'woody_oud';
  }

  return 'woody_oud';
}

/**
 * Get full design tokens for any fragrance or atmosphere key.
 */
export function getFragranceFamilyTokens(
  familyOrAtmosphere?: string | null,
  name?: string | null,
  notes?: string[] | null
): FragranceFamilyTokens {
  const resolved = resolveFragranceFamily(familyOrAtmosphere, name, notes);
  return FRAGRANCE_FAMILY_TOKENS[resolved] || FRAGRANCE_FAMILY_TOKENS.woody_oud;
}
