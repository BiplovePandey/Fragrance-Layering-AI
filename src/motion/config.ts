// Liquid Luxury Motion Tokens & Physics
// Damped, restrained, tactile, and cinematic timings.

export const MOTION_DURATIONS = {
  instant: 0.12,    // 120ms - micro toggles, press states
  micro: 0.2,       // 200ms - hover lift, quick icons, badges
  standard: 0.32,   // 320ms - card transitions, tabs, drawer states
  expressive: 0.48, // 480ms - modal entrances, view transitions, sheets
  cinematic: 0.8,   // 800ms - hero reveals, laboratory synthesis, atmosphere
} as const;

// Luxury Easing Curves
// Emulating Apple interface physics and premium physical decelerations.
export const MOTION_EASINGS = {
  // Ultra-refined ease-out for entering elements
  luxuryDecel: [0.16, 1, 0.3, 1] as const,
  // Smooth symmetric curve for view crossfades
  luxuryFluid: [0.25, 0.1, 0.25, 1] as const,
  // Snappy yet soft for micro-interactions
  tactile: [0.2, 0, 0, 1] as const,
  // Gentle linger for atmospheric scent particles & flacons
  ambient: [0.4, 0, 0.2, 1] as const,
} as const;

// Physical Spring Tokens
// Damped and controlled to strictly prevent cartoonish rubber-banding.
export const MOTION_SPRINGS = {
  // Ultra-gentle for cards, flacons, and modals
  luxurySoft: {
    type: 'spring' as const,
    stiffness: 280,
    damping: 32,
    mass: 1,
  },
  // Snappy and crisp for button presses & tab indicators
  tactilePress: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 0.8,
  },
  // Smooth spatial navigation for shared elements and layout transitions
  spatialLayout: {
    type: 'spring' as const,
    stiffness: 320,
    damping: 34,
    mass: 0.9,
  },
  // Slow harmonic resonance for laboratory chord merges
  harmonicMerge: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 26,
    mass: 1.2,
  },
} as const;
