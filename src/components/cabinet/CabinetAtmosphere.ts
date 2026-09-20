/**
 * CABINET ATMOSPHERE TOKENS & MATERIALS
 * 
 * Physical materiality for the Private Fragrance Cabinet:
 * - Dark Walnut woodwork
 * - Smoked Glass panels
 * - Aged Brass metal trims
 * - Warm Amber illumination
 * - Parchment label accents
 */

export interface CabinetPalette {
  id: string;
  name: string;
  walnutDeck: string;
  brassAccent: string;
  brassBorder: string;
  ambientGlow: string;
  plaqueBg: string;
  highlightText: string;
}

export const CABINET_PALETTES: Record<string, CabinetPalette> = {
  woody: {
    id: 'woody',
    name: 'Sandalwood & Noble Woods',
    walnutDeck: 'from-[#1A140F] via-[#261E16] to-[#1A140F]',
    brassAccent: '#D4AF37',
    brassBorder: 'rgba(212, 175, 55, 0.35)',
    ambientGlow: 'rgba(202, 138, 4, 0.16)',
    plaqueBg: 'rgba(30, 24, 18, 0.85)',
    highlightText: '#FDE68A'
  },
  floral: {
    id: 'floral',
    name: 'Damask Rose & Night Florals',
    walnutDeck: 'from-[#1A1114] via-[#26161D] to-[#1A1114]',
    brassAccent: '#E0A96D',
    brassBorder: 'rgba(244, 63, 94, 0.35)',
    ambientGlow: 'rgba(244, 63, 94, 0.15)',
    plaqueBg: 'rgba(32, 20, 26, 0.85)',
    highlightText: '#FECDD3'
  },
  earthy: {
    id: 'earthy',
    name: 'Mitti Terracotta & Petrichor',
    walnutDeck: 'from-[#1A130F] via-[#281A12] to-[#1A130F]',
    brassAccent: '#C97A47',
    brassBorder: 'rgba(217, 93, 57, 0.35)',
    ambientGlow: 'rgba(217, 93, 57, 0.15)',
    plaqueBg: 'rgba(32, 22, 16, 0.85)',
    highlightText: '#FFEDD5'
  },
  citrus: {
    id: 'citrus',
    name: 'Solar Citrus & Bergamot',
    walnutDeck: 'from-[#18150D] via-[#252013] to-[#18150D]',
    brassAccent: '#E5C158',
    brassBorder: 'rgba(245, 158, 11, 0.35)',
    ambientGlow: 'rgba(245, 158, 11, 0.14)',
    plaqueBg: 'rgba(30, 26, 17, 0.85)',
    highlightText: '#FEF08A'
  },
  aquatic: {
    id: 'aquatic',
    name: 'Marine Ozone & Coastal Mist',
    walnutDeck: 'from-[#0F161A] via-[#142128] to-[#0F161A]',
    brassAccent: '#93C5FD',
    brassBorder: 'rgba(14, 165, 233, 0.35)',
    ambientGlow: 'rgba(14, 165, 233, 0.14)',
    plaqueBg: 'rgba(18, 28, 34, 0.85)',
    highlightText: '#BAE6FD'
  },
  default: {
    id: 'default',
    name: 'Artisanal Vault Archive',
    walnutDeck: 'from-[#14100C] via-[#221A13] to-[#14100C]',
    brassAccent: '#D4AF37',
    brassBorder: 'rgba(217, 119, 6, 0.3)',
    ambientGlow: 'rgba(217, 119, 6, 0.15)',
    plaqueBg: 'rgba(26, 20, 15, 0.85)',
    highlightText: '#F5EEDB'
  }
};

export function getCabinetPalette(family?: string): CabinetPalette {
  if (!family) return CABINET_PALETTES.default;
  const lower = family.toLowerCase();
  if (lower.includes('rose') || lower.includes('floral')) return CABINET_PALETTES.floral;
  if (lower.includes('wood') || lower.includes('oud') || lower.includes('sandalwood') || lower.includes('amber')) return CABINET_PALETTES.woody;
  if (lower.includes('mitti') || lower.includes('earth') || lower.includes('clay') || lower.includes('khus')) return CABINET_PALETTES.earthy;
  if (lower.includes('citrus') || lower.includes('fresh') || lower.includes('aromatic')) return CABINET_PALETTES.citrus;
  if (lower.includes('aquatic') || lower.includes('marine') || lower.includes('ocean')) return CABINET_PALETTES.aquatic;
  return CABINET_PALETTES.default;
}
