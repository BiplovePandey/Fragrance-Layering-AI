export interface ChamberAtmospherePalette {
  id: string;
  name: string;
  glow: string;
  ambientBackdrop: string;
  pedestalGlow: string;
  brassAccent: string;
  particleTone: string;
  accentBorder: string;
  tagBg: string;
  tagText: string;
}

export const CHAMBER_PALETTES: Record<string, ChamberAtmospherePalette> = {
  woody: {
    id: 'woody',
    name: 'Sandalwood & Noble Woods',
    glow: 'radial-gradient(ellipse at 50% 40%, rgba(202, 138, 4, 0.22) 0%, rgba(161, 98, 7, 0.12) 40%, transparent 75%)',
    ambientBackdrop: 'from-[#1A140E] via-[#120F0B] to-[#0A0806]',
    pedestalGlow: 'rgba(217, 119, 6, 0.35)',
    brassAccent: '#D4AF37',
    particleTone: 'rgba(253, 230, 138, 0.4)',
    accentBorder: 'border-amber-500/30',
    tagBg: 'bg-amber-950/60 border-amber-500/30',
    tagText: 'text-amber-200'
  },
  floral: {
    id: 'floral',
    name: 'Damask Rose & Floral Radiance',
    glow: 'radial-gradient(ellipse at 50% 40%, rgba(244, 63, 94, 0.22) 0%, rgba(225, 29, 72, 0.10) 40%, transparent 75%)',
    ambientBackdrop: 'from-[#1A0E13] via-[#120A0E] to-[#0A0608]',
    pedestalGlow: 'rgba(244, 63, 94, 0.35)',
    brassAccent: '#F472B6',
    particleTone: 'rgba(254, 205, 211, 0.45)',
    accentBorder: 'border-rose-500/30',
    tagBg: 'bg-rose-950/60 border-rose-500/30',
    tagText: 'text-rose-200'
  },
  citrus: {
    id: 'citrus',
    name: 'Solar Citrus & Fresh Zest',
    glow: 'radial-gradient(ellipse at 50% 40%, rgba(245, 158, 11, 0.24) 0%, rgba(217, 119, 6, 0.10) 40%, transparent 75%)',
    ambientBackdrop: 'from-[#1A160E] via-[#12100A] to-[#0A0906]',
    pedestalGlow: 'rgba(245, 158, 11, 0.38)',
    brassAccent: '#FBBF24',
    particleTone: 'rgba(254, 240, 138, 0.5)',
    accentBorder: 'border-amber-400/30',
    tagBg: 'bg-amber-950/60 border-amber-400/30',
    tagText: 'text-amber-200'
  },
  earthy: {
    id: 'earthy',
    name: 'Mitti Terracotta & Petrichor',
    glow: 'radial-gradient(ellipse at 50% 40%, rgba(194, 65, 12, 0.24) 0%, rgba(154, 52, 18, 0.12) 40%, transparent 75%)',
    ambientBackdrop: 'from-[#1C120C] via-[#140D08] to-[#0A0704]',
    pedestalGlow: 'rgba(234, 88, 12, 0.38)',
    brassAccent: '#C2410C',
    particleTone: 'rgba(254, 215, 170, 0.4)',
    accentBorder: 'border-orange-500/30',
    tagBg: 'bg-orange-950/60 border-orange-500/30',
    tagText: 'text-orange-200'
  },
  spicy: {
    id: 'spicy',
    name: 'Assam Oud & Warm Resins',
    glow: 'radial-gradient(ellipse at 50% 40%, rgba(180, 83, 9, 0.26) 0%, rgba(120, 53, 15, 0.14) 40%, transparent 75%)',
    ambientBackdrop: 'from-[#18110B] via-[#100B07] to-[#080504]',
    pedestalGlow: 'rgba(180, 83, 9, 0.42)',
    brassAccent: '#B45309',
    particleTone: 'rgba(251, 191, 36, 0.35)',
    accentBorder: 'border-amber-600/30',
    tagBg: 'bg-amber-950/70 border-amber-600/30',
    tagText: 'text-amber-300'
  },
  aquatic: {
    id: 'aquatic',
    name: 'Marine Ozone & Cool Waters',
    glow: 'radial-gradient(ellipse at 50% 40%, rgba(14, 165, 233, 0.22) 0%, rgba(2, 132, 199, 0.10) 40%, transparent 75%)',
    ambientBackdrop: 'from-[#0C151B] via-[#080E12] to-[#04070A]',
    pedestalGlow: 'rgba(14, 165, 233, 0.35)',
    brassAccent: '#38BDF8',
    particleTone: 'rgba(186, 230, 253, 0.45)',
    accentBorder: 'border-sky-500/30',
    tagBg: 'bg-sky-950/60 border-sky-500/30',
    tagText: 'text-sky-200'
  }
};

export function getChamberPalette(fragranceFamily?: string, name?: string): ChamberAtmospherePalette {
  const text = `${fragranceFamily || ''} ${name || ''}`.toLowerCase();
  if (text.includes('rose') || text.includes('floral') || text.includes('jasmine') || text.includes('mogra')) {
    return CHAMBER_PALETTES.floral;
  }
  if (text.includes('oud') || text.includes('oriental') || text.includes('spicy') || text.includes('amber')) {
    return CHAMBER_PALETTES.spicy;
  }
  if (text.includes('citrus') || text.includes('fresh') || text.includes('neroli') || text.includes('bergamot')) {
    return CHAMBER_PALETTES.citrus;
  }
  if (text.includes('earth') || text.includes('mitti') || text.includes('clay') || text.includes('petrichor')) {
    return CHAMBER_PALETTES.earthy;
  }
  if (text.includes('aquatic') || text.includes('marine') || text.includes('water') || text.includes('ocean')) {
    return CHAMBER_PALETTES.aquatic;
  }
  if (text.includes('wood') || text.includes('sandal') || text.includes('chandan') || text.includes('cedar') || text.includes('vetiver')) {
    return CHAMBER_PALETTES.woody;
  }
  return CHAMBER_PALETTES.woody;
}
