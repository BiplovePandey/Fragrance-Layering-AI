import { MainNavId } from '../types.js';

export type VisualWorldId = 'atelier' | 'archive' | 'chamber';

export interface VisualWorldConfig {
  id: VisualWorldId;
  name: string;
  tagline: string;
  emotion: string;
  primaryTone: string;
  paletteDescription: string;
  // Background canvas gradient
  ambientCanvasGrad: string;
  // Outer container backdrop class
  backdropClass: string;
  // Header styling
  headerClass: string;
  headerBorder: string;
  brandTagText: string;
  brandTagClass: string;
  // Bottom rail styling
  bottomRailClass: string;
  bottomRailBorder: string;
  bottomRailGlow: string;
  // Surface / Card aesthetic
  surfaceClass: string;
  surfaceBorder: string;
  // Accent colors
  accentAmber: string;
  brassAccent: string;
  textMuted: string;
  textPrimary: string;
}

export const VISUAL_WORLDS: Record<VisualWorldId, VisualWorldConfig> = {
  atelier: {
    id: 'atelier',
    name: 'The Living Atelier',
    tagline: 'Private Salon & Bespoke Wardrobe',
    emotion: 'welcoming • luxurious • personal • cinematic',
    primaryTone: '#B45309',
    paletteDescription: 'espresso, walnut, warm amber, cream, champagne, soft botanical accents',
    ambientCanvasGrad: 'radial-gradient(ellipse at 50% 15%, rgba(217, 119, 6, 0.12) 0%, rgba(180, 83, 9, 0.05) 45%, transparent 75%)',
    backdropClass: 'bg-[#FAF7F2] text-[#1C1713]',
    headerClass: 'bg-[#FAF7F2]/80 backdrop-blur-2xl',
    headerBorder: 'border-[#EAE1D5]/80 shadow-[0_4px_24px_rgba(95,70,40,0.04)]',
    brandTagText: 'Atelier',
    brandTagClass: 'text-amber-900/90 bg-amber-100/70 border-amber-300/60',
    bottomRailClass: 'bg-[#181310]/92 text-[#E8DFD3] backdrop-blur-2xl',
    bottomRailBorder: 'border-white/10 border-t-amber-500/30',
    bottomRailGlow: 'shadow-[0_12px_40px_rgba(20,15,10,0.35)]',
    surfaceClass: 'bg-white/85 backdrop-blur-xl',
    surfaceBorder: 'border-[#EAE1D5]',
    accentAmber: '#D97706',
    brassAccent: '#C59A3F',
    textMuted: '#7A6F66',
    textPrimary: '#1A1613'
  },

  archive: {
    id: 'archive',
    name: 'The Heritage Archive',
    tagline: 'Centuries of Alchemical Knowledge & Botanical Craft',
    emotion: 'heritage • craft • knowledge • botanical • editorial',
    primaryTone: '#C2410C',
    paletteDescription: 'warm parchment, terracotta, aged copper, olive/botanical green, cream',
    ambientCanvasGrad: 'radial-gradient(ellipse at 50% 15%, rgba(194, 65, 12, 0.12) 0%, rgba(4, 120, 87, 0.06) 45%, transparent 75%)',
    backdropClass: 'bg-[#F6F1E8] text-[#241E19]',
    headerClass: 'bg-[#F6F1E8]/85 backdrop-blur-2xl',
    headerBorder: 'border-[#DECDBA]/80 shadow-[0_4px_24px_rgba(110,65,30,0.05)]',
    brandTagText: 'Archive',
    brandTagClass: 'text-stone-900 bg-orange-100/70 border-orange-300/60',
    bottomRailClass: 'bg-[#2A211B]/95 text-[#F2ECE1] backdrop-blur-2xl',
    bottomRailBorder: 'border-[#DECDBA]/25 border-t-orange-500/30',
    bottomRailGlow: 'shadow-[0_12px_40px_rgba(42,33,27,0.35)]',
    surfaceClass: 'bg-[#FCFAF6]/90 backdrop-blur-xl',
    surfaceBorder: 'border-[#DECDBA]',
    accentAmber: '#C2410C',
    brassAccent: '#B8860B',
    textMuted: '#6E645A',
    textPrimary: '#201A15'
  },

  chamber: {
    id: 'chamber',
    name: 'The Olfactory Chamber',
    tagline: 'Experimental Laboratory & Scent Synthesis',
    emotion: 'scientific • mysterious • experimental • precise',
    primaryTone: '#D4AF37',
    paletteDescription: 'espresso, smoked glass, burnished copper, amber, deep blue/purple accents',
    ambientCanvasGrad: 'radial-gradient(ellipse at 50% 20%, rgba(212, 175, 55, 0.14) 0%, rgba(30, 27, 75, 0.12) 45%, transparent 75%)',
    backdropClass: 'bg-[#0E0C0A] text-[#F3EFEA]',
    headerClass: 'bg-[#0E0C0A]/85 backdrop-blur-2xl',
    headerBorder: 'border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]',
    brandTagText: 'Chamber',
    brandTagClass: 'text-amber-300 bg-amber-950/60 border-amber-500/30',
    bottomRailClass: 'bg-[#120F0D]/95 text-[#E6DFD5] backdrop-blur-2xl',
    bottomRailBorder: 'border-white/[0.12] border-t-amber-400/40',
    bottomRailGlow: 'shadow-[0_12px_45px_rgba(0,0,0,0.7)]',
    surfaceClass: 'bg-[#16120E]/90 backdrop-blur-xl',
    surfaceBorder: 'border-white/[0.09]',
    accentAmber: '#F59E0B',
    brassAccent: '#D4AF37',
    textMuted: '#A3998E',
    textPrimary: '#F7F4EF'
  }
};

/**
 * Maps any main navigation tab to one of the Three Visual Worlds:
 * - Atelier: atelier, wear, wardrobe (Vault), community (Society)
 * - Archive: heritage, academy
 * - Chamber: layer, explore, discover, mydna (Portrait), scanner
 */
export function resolveVisualWorld(tab: MainNavId): VisualWorldConfig {
  switch (tab) {
    case 'heritage':
    case 'academy':
      return VISUAL_WORLDS.archive;

    case 'layer':
    case 'explore':
    case 'discover':
    case 'mydna':
    case 'scanner':
      return VISUAL_WORLDS.chamber;

    case 'atelier':
    case 'wear':
    case 'wardrobe':
    case 'community':
    default:
      return VISUAL_WORLDS.atelier;
  }
}
