import { Fragrance } from '../../types.js';

export interface LabPalette {
  name: string;
  primaryColor: string;
  glowColor: string;
  vaporRgbaA: string;
  vaporRgbaB: string;
  accentBorder: string;
  tagBg: string;
  tagText: string;
}

export const getLabPalette = (family?: string): LabPalette => {
  const fam = (family || '').toLowerCase();

  if (fam.includes('oud') || fam.includes('wood') || fam.includes('chandan') || fam.includes('cedar') || fam.includes('vetiver')) {
    return {
      name: 'Sandalwood & Noble Woods',
      primaryColor: '#D4AF37',
      glowColor: 'rgba(212, 175, 55, 0.25)',
      vaporRgbaA: 'rgba(202, 138, 4, 0.45)',
      vaporRgbaB: 'rgba(161, 98, 7, 0.25)',
      accentBorder: 'border-amber-500/40',
      tagBg: 'bg-amber-950/60',
      tagText: 'text-amber-200'
    };
  }

  if (fam.includes('floral') || fam.includes('rose') || fam.includes('jasmine') || fam.includes('mogra')) {
    return {
      name: 'Damask Rose & Floral Radiance',
      primaryColor: '#F43F5E',
      glowColor: 'rgba(244, 63, 94, 0.25)',
      vaporRgbaA: 'rgba(244, 63, 94, 0.45)',
      vaporRgbaB: 'rgba(225, 29, 72, 0.25)',
      accentBorder: 'border-rose-500/40',
      tagBg: 'bg-rose-950/60',
      tagText: 'text-rose-200'
    };
  }

  if (fam.includes('earth') || fam.includes('mitti') || fam.includes('petrichor') || fam.includes('clay')) {
    return {
      name: 'Mitti Terracotta & Petrichor',
      primaryColor: '#D95D39',
      glowColor: 'rgba(217, 93, 57, 0.28)',
      vaporRgbaA: 'rgba(217, 93, 57, 0.45)',
      vaporRgbaB: 'rgba(194, 65, 12, 0.25)',
      accentBorder: 'border-orange-500/40',
      tagBg: 'bg-orange-950/60',
      tagText: 'text-orange-200'
    };
  }

  if (fam.includes('fresh') || fam.includes('citrus') || fam.includes('bergamot') || fam.includes('neroli')) {
    return {
      name: 'Solar Citrus & Fresh Zest',
      primaryColor: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      vaporRgbaA: 'rgba(245, 158, 11, 0.45)',
      vaporRgbaB: 'rgba(217, 119, 6, 0.25)',
      accentBorder: 'border-amber-400/40',
      tagBg: 'bg-amber-950/60',
      tagText: 'text-amber-200'
    };
  }

  if (fam.includes('aquatic') || fam.includes('marine') || fam.includes('water') || fam.includes('ocean')) {
    return {
      name: 'Marine Ozone & Cool Waters',
      primaryColor: '#0EA5E9',
      glowColor: 'rgba(14, 165, 233, 0.25)',
      vaporRgbaA: 'rgba(14, 165, 233, 0.45)',
      vaporRgbaB: 'rgba(2, 132, 199, 0.25)',
      accentBorder: 'border-sky-500/40',
      tagBg: 'bg-sky-950/60',
      tagText: 'text-sky-200'
    };
  }

  // Default Amber Gold
  return {
    name: 'Alchemical Gold',
    primaryColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.25)',
    vaporRgbaA: 'rgba(234, 179, 8, 0.45)',
    vaporRgbaB: 'rgba(245, 158, 11, 0.25)',
    accentBorder: 'border-yellow-500/40',
    tagBg: 'bg-yellow-500/15',
    tagText: 'text-yellow-300'
  };
};

/**
 * Generates an evocative, poetic presentation label for the temporary chord
 * strictly derived from the existing fragrances' families and notes.
 */
export const deriveChordPoeticName = (fragA?: Fragrance, fragB?: Fragrance): string => {
  if (!fragA || !fragB) return 'Harmonic Chord In Progress';

  const famA = (fragA.fragrance_family || '').toLowerCase();
  const famB = (fragB.fragrance_family || '').toLowerCase();

  if ((famA.includes('citrus') && famB.includes('wood')) || (famA.includes('wood') && famB.includes('citrus'))) {
    return 'Solar Heartwood Alchemy';
  }
  if (famA.includes('earth') || famB.includes('earth') || famA.includes('mitti') || famB.includes('mitti')) {
    return 'Monsoon Alluvial Petrichor';
  }
  if ((famA.includes('floral') || famA.includes('rose')) && (famB.includes('wood') || famB.includes('amber'))) {
    return 'Velvet Damascena Sillage';
  }
  if (famA.includes('fresh') && famB.includes('oud')) {
    return 'Luminous Agarwood Counterpoint';
  }
  if (famA.includes('spic') || famB.includes('spic')) {
    return 'Saffron & Warm Spice Resonance';
  }
  if (famA.includes('aquatic') || famB.includes('aquatic')) {
    return 'Coastal Mineral Drift';
  }

  const primaryFamA = fragA.fragrance_family?.split(' ')[0] || 'Aromatic';
  const primaryFamB = fragB.fragrance_family?.split(' ')[0] || 'Woody';
  return `${primaryFamA} & ${primaryFamB} Chord`;
};
