/**
 * OLFACTORY AI — DESIGN SYSTEM v1.0 TOKENS
 * 
 * Centralized design token constants for the luxury digital fragrance atelier.
 * Core Philosophy: "Emotion first → Action second → Explanation third → Science fourth"
 * Guiding Principle: "REVEAL, DON'T OVERWHELM"
 */

export const ATELIER_COLORS = {
  // Base Parchment & Text
  parchment: '#F8F5EF',
  parchmentWarm: '#F3EEE5',
  ivory: '#FBF9F5',
  espressoPrimary: '#1A1613',
  espressoSecondary: '#5A5046',
  taupeMuted: '#7A6F66',
  borderSubtle: '#DCD4C8',

  // Luxury Accents
  amberPrimary: '#D97706',
  amberDeep: '#B45309',
  goldWarm: '#C9953B',

  // Heritage & Botanical Accents
  terracotta: '#D95D39',
  botanicalGreen: '#55BFA3',
  botanicalDeep: '#0D9488',
  sandalwood: '#B58A58',

  // Dark Chamber Experience
  chamberEspresso: '#14110E',
  chamberBlack: '#0E0C0A',
  chamberSurface: '#1C1713',
  chamberBorder: 'rgba(217, 119, 6, 0.22)',
} as const;

export const TYPOGRAPHY_TOKENS = {
  fonts: {
    display: "'Cormorant Garamond', Garamond, Georgia, serif",
    brand: "'Cinzel', serif",
    sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'Space Mono', monospace",
  },
  scale: {
    displayXl: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)', // 56–72px
    display: 'clamp(2rem, 3.8vw + 0.8rem, 3.5rem)',  // 48–60px
    h1: 'clamp(1.75rem, 2.5vw + 0.5rem, 2.75rem)',   // 40–48px
    h2: 'clamp(1.4rem, 1.8vw + 0.4rem, 2.25rem)',    // 32–40px
    h3: 'clamp(1.2rem, 1.2vw + 0.3rem, 1.65rem)',    // 24–30px
    h4: 'clamp(1.05rem, 0.8vw + 0.3rem, 1.3rem)',    // 18–22px
    bodyLarge: '1.125rem',                           // 16–18px
    body: '0.9375rem',                               // 14–16px
    small: '0.8125rem',                              // 12–14px
    micro: '0.6875rem',                              // 10–12px
  }
} as const;

export const SPACING_TOKENS = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const RADIUS_TOKENS = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  atelier: '20px',
  luxury: '24px',
  hero: '32px',
  full: '9999px',
} as const;

export const GLASS_SURFACES = {
  level1Ambient: {
    name: 'Ambient Glass',
    className: 'glass-ambient',
    blur: '20px',
    border: '1px solid rgba(220, 212, 200, 0.75)',
    usage: 'Navigation, small controls, pills, floating utilities',
  },
  level2Atelier: {
    name: 'Atelier Glass',
    className: 'glass-atelier',
    blur: '30px',
    border: '1px solid rgba(255, 255, 255, 0.95)',
    usage: 'Primary cards, recommendation cards, collection cards, dashboards',
  },
  level3Chamber: {
    name: 'Chamber Glass',
    className: 'glass-chamber',
    blur: '36px',
    border: '1px solid rgba(217, 119, 6, 0.22)',
    usage: 'Fragrance Chamber, deep analysis, layering synthesis, nocturnal immersion',
  },
} as const;

export const WARM_SHADOWS = {
  soft: '0 4px 20px -2px rgba(95, 70, 40, 0.05)',
  medium: '0 10px 35px -4px rgba(95, 70, 40, 0.08)',
  deep: '0 24px 60px -12px rgba(95, 70, 40, 0.12)',
  chamber: '0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.07)',
} as const;

export const MOTION_TOKENS = {
  durations: {
    fast: 0.2,      // 200ms
    standard: 0.35, // 350ms
    slow: 0.55,     // 550ms
  },
  spring: {
    gentle: { type: 'spring', damping: 24, stiffness: 260 },
    subtle: { type: 'spring', damping: 28, stiffness: 320 },
    snappy: { type: 'spring', damping: 20, stiffness: 350 },
  },
  hoverScale: 1.015,
  tapScale: 0.985,
} as const;

export const ATMOSPHERIC_ACCORD_COLORS: Record<string, { bg: string; text: string; border: string; aura: string }> = {
  Rose: {
    bg: 'rgba(232, 106, 146, 0.08)',
    text: '#991B4C',
    border: 'rgba(232, 106, 146, 0.3)',
    aura: 'rgba(232, 106, 146, 0.25)',
  },
  Oud: {
    bg: 'rgba(180, 83, 9, 0.08)',
    text: '#78350F',
    border: 'rgba(180, 83, 9, 0.3)',
    aura: 'rgba(180, 83, 9, 0.25)',
  },
  Mitti: {
    bg: 'rgba(217, 93, 57, 0.08)',
    text: '#9A3412',
    border: 'rgba(217, 93, 57, 0.3)',
    aura: 'rgba(217, 93, 57, 0.25)',
  },
  Bergamot: {
    bg: 'rgba(217, 119, 6, 0.08)',
    text: '#92400E',
    border: 'rgba(217, 119, 6, 0.3)',
    aura: 'rgba(217, 119, 6, 0.25)',
  },
  Marine: {
    bg: 'rgba(13, 148, 136, 0.08)',
    text: '#115E59',
    border: 'rgba(13, 148, 136, 0.3)',
    aura: 'rgba(13, 148, 136, 0.25)',
  },
  Sandalwood: {
    bg: 'rgba(181, 138, 88, 0.08)',
    text: '#634226',
    border: 'rgba(181, 138, 88, 0.3)',
    aura: 'rgba(181, 138, 88, 0.25)',
  },
  Vetiver: {
    bg: 'rgba(85, 191, 163, 0.08)',
    text: '#0F766E',
    border: 'rgba(85, 191, 163, 0.3)',
    aura: 'rgba(85, 191, 163, 0.25)',
  },
};
