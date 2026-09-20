import React from 'react';

export interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  glow?: boolean;
}

/* ==========================================================================
   WORLD & PILLAR NAVIGATION GLYPHS
   Thin, elegant, slightly organic, luxurious custom iconography.
   ========================================================================== */

/**
 * Atelier Glyph: Fine-line haute parfumerie flacon with celestial aura spark.
 */
export const AtelierGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Stopper & Neck */}
    <rect x="10" y="2.5" width="4" height="2.5" rx="0.75" />
    <path d="M12 5v2" />
    <path d="M9.5 7h5" />
    {/* Flacon Shoulders & Body */}
    <path d="M7.5 9h9l1.5 3v7.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V12L7.5 9z" />
    {/* Inner Liquid Horizon */}
    <path d="M7 16c1.5.8 3.5-.6 5 0s3.5.8 5 0" strokeDasharray="1.5 2.5" strokeOpacity="0.7" />
    {/* Celestial Aura Spark */}
    <path d="M12 11.5v2.5M10.75 12.75h2.5" strokeWidth={strokeWidth * 0.9} />
  </svg>
);

/**
 * Wear Glyph: Ceremonial scent ritual drape with rising aromatic vapor ribbons.
 */
export const WearGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Ceremonial Collar / Scarf Contour */}
    <path d="M6 3.5h12l1 5-4.5 3.5L12 10l-2.5 2L5 8.5l1-5z" />
    <path d="M9.5 12v8.5a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V12" />
    {/* Rising Scent Vapor Strands */}
    <path d="M10 6.5c-.5-1 .5-2 0-2.8" strokeOpacity="0.8" />
    <path d="M14 6.5c.5-1-.5-2 0-2.8" strokeOpacity="0.8" />
    <circle cx="12" cy="15.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Vault / Cabinet Glyph: Artisan perfume sanctum with arched alcove & specimen tiers.
 */
export const VaultGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Arched Architectural Alcove */}
    <path d="M4 21V9a8 8 0 0 1 16 0v12" />
    <path d="M3 21h18" />
    {/* Specimen Shelves */}
    <path d="M5 14h14" strokeWidth={strokeWidth * 0.9} />
    {/* Tiered Specimen Bottles */}
    <path d="M8 11.5v2.5M12 9.5v4.5M16 11.5v2.5" strokeOpacity="0.85" />
    <rect x="7" y="16.5" width="2.5" height="4.5" rx="0.5" />
    <rect x="11" y="15.5" width="2.5" height="5.5" rx="0.5" />
    <rect x="15" y="16.5" width="2.5" height="4.5" rx="0.5" />
  </svg>
);

/**
 * Heritage Glyph: Ancient Kannauj copper Deg-Bhapka still with sacred botanical laurel.
 */
export const HeritageGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Traditional Copper Deg Retort Vessel */}
    <path d="M7 19.5h10M8.5 19.5c0-4 1.5-6.5 3.5-6.5s3.5 2.5 3.5 6.5" />
    <path d="M12 13V5.5" />
    {/* Chonga Bamboo Condenser Neck */}
    <path d="M12 6.5c2.5-1.5 5.5-.5 7.5 2v3.5" />
    {/* Submerged Bhapka Receiver */}
    <rect x="17.5" y="12" width="4" height="6" rx="1.5" />
    {/* Heritage Seal Ribbon Arc */}
    <path d="M4 11a5 5 0 0 1 3-4.5M3 15a5 5 0 0 0 3.5 3" strokeOpacity="0.75" />
  </svg>
);

/**
 * Layering Glyph: Twin alchemical vessels with converging vapor trajectories.
 */
export const LayeringGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Left Alchemical Ampoule */}
    <path d="M5.5 8h3M7 8V5.5M5 18a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2L8 8H6l-1 10z" />
    {/* Right Alchemical Ampoule */}
    <path d="M15.5 8h3M17 8V5.5M15 18a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2L18 8h-2l-1 10z" />
    {/* Intertwined Scent Volatiles (Synthesis Apex) */}
    <path d="M7 4.5c1-1.5 3-1.5 5 1s4 2.5 5 1" strokeOpacity="0.8" />
    <circle cx="12" cy="3.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Explore Glyph: Precision celestial astrolabe and fragrance compass.
 */
export const ExploreGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="9.25" strokeOpacity="0.85" />
    <circle cx="12" cy="12" r="6" strokeDasharray="1.5 2" strokeOpacity="0.6" />
    {/* 4-Pointed Scent Star Pointer */}
    <path d="M12 4.5l1.5 6L19.5 12l-6 1.5-1.5 6-1.5-6L4.5 12l6-1.5 1.5-6z" />
    <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Portrait / DNA Glyph: Sacred geometric olfactory iris and biometric rosette.
 */
export const PortraitGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Concentric Biometric Resonance Rings */}
    <circle cx="12" cy="12" r="9.5" strokeOpacity="0.4" strokeDasharray="2 3" />
    <circle cx="12" cy="12" r="6.75" />
    {/* DNA Double Helix Strands & Petal Interlacing */}
    <path d="M6 9c2 1 4 2 6 2s4-1 6-2M6 15c2-1 4-2 6-2s4 1 6 2" />
    <circle cx="12" cy="12" r="2.5" strokeWidth={strokeWidth * 1.1} />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Scanner Glyph: Precision optical inspection chamber reticle with targeting lens.
 */
export const ScannerGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Four Corner Reticle Precision Brackets */}
    <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" />
    {/* Optical Lens Iris */}
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 9.5v5M9.5 12h5" strokeDasharray="1.5 1.5" strokeOpacity="0.75" />
  </svg>
);

/**
 * Academy Glyph: Botanical quill and archival parchment codex.
 */
export const AcademyGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Archival Codex Foliage */}
    <path d="M3 19a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3v-1z" />
    <path d="M15 19a3 3 0 0 1 3-3h3v5a2 2 0 0 1-2 2h-1a3 3 0 0 1-3-3v-1z" />
    {/* Botanical Quill Pen */}
    <path d="M12 3c3 1.5 6 4 7 8l-4 1-3-3V3z" />
    <path d="M12 9l3-3" strokeOpacity="0.7" />
  </svg>
);

/**
 * Community / Society Glyph: Ceremonial salon pavilion with harmonious gathering.
 */
export const CommunityGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Central Protagonist Persona */}
    <circle cx="12" cy="7.5" r="2.5" />
    <path d="M7.5 18c0-3 2-4.5 4.5-4.5s4.5 1.5 4.5 4.5v1h-9v-1z" />
    {/* Twin Society Flankers */}
    <circle cx="5" cy="9" r="1.75" strokeOpacity="0.75" />
    <path d="M2.5 18c0-2 1.2-3 2.8-3 .6 0 1.2.2 1.7.5" strokeOpacity="0.75" />
    <circle cx="19" cy="9" r="1.75" strokeOpacity="0.75" />
    <path d="M21.5 18c0-2-1.2-3-2.8-3-.6 0-1.2.2-1.7.5" strokeOpacity="0.75" />
  </svg>
);


/* ==========================================================================
   8D OLFACTORY DIMENSION GLYPHS
   Precise symbolic representations of the 8 sensory coordinates:
   1. Freshness: leaf + airflow
   2. Sweetness: petal / nectar
   3. Intensity: radiating flame
   4. Woody: wood ring
   5. Floral: flower
   6. Warm Spices: saffron / resin
   7. Earth & Clay: clay / terrain
   8. Longevity / Fixative: anchored droplet / flacon
   ========================================================================== */

/**
 * Freshness Glyph: Delicate botanical leaf embracing an ascending airflow swirl.
 */
export const FreshnessGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Botanical Leaf */}
    <path d="M12 21c-4.5-1-7-5.5-7-10 0-4 3-7 8-7 4.5 0 7 2.5 7 7 0 4.5-3.5 9-8 10z" />
    {/* Central Rib */}
    <path d="M13 4c-1 4-2 8-1 14" strokeOpacity="0.7" />
    {/* Flowing Air Currents */}
    <path d="M17 7c2-1 4 0 4 2s-2 3-4 3" strokeOpacity="0.85" />
    <path d="M16 14c1.5 0 3 1 3 2s-1 2-2.5 2" strokeOpacity="0.7" />
  </svg>
);

/**
 * Sweetness Glyph: Sculpted nectar petal with suspended honeyed droplet.
 */
export const SweetnessGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Nectar Petal Silhouette */}
    <path d="M12 21c-4.5 0-8-3.5-8-8 0-5 5-9 8-10 3 1 8 5 8 10 0 4.5-3.5 8-8 8z" />
    {/* Suspended Golden Nectar Dew Drop */}
    <path d="M12 9c-1.5 2-2.5 3.5-2.5 5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1.5-1-3-2.5-5z" fill="currentColor" fillOpacity="0.18" />
  </svg>
);

/**
 * Intensity Glyph: Radiating multi-layer sillage flame corona.
 */
export const IntensityGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Outer Radiant Flame Tongue */}
    <path d="M12 2c1.5 3.5 4.5 5.5 5.5 9 1 3.5-.5 7-3.5 9s-6.5 1-8.5-1.5c-1.5-2-1.5-4.5 0-6.5 1-1.5 2.5-2.5 3-4.5 1-3.5 3.5-5.5 3.5-5.5z" />
    {/* Inner Thermal Core */}
    <path d="M12 11c1 2 2.5 3 2.5 4.5 0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5c0-1.2 1-2.5 2.5-4.5z" fill="currentColor" fillOpacity="0.25" />
    {/* Radiating Intensity Ticks */}
    <path d="M4 12h-2M22 12h-2M5.5 6.5l-1.5-1.5M20 18.5l-1.5-1.5" strokeOpacity="0.6" />
  </svg>
);

/**
 * Woody Glyph: Concentric organic heartwood rings.
 */
export const WoodyGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Outer Trunk Bark */}
    <ellipse cx="12" cy="12" rx="9.5" ry="8.5" />
    {/* Concentric Growth Rings */}
    <ellipse cx="12" cy="12" rx="6.75" ry="6" strokeOpacity="0.8" />
    <ellipse cx="12" cy="12" rx="4" ry="3.5" strokeOpacity="0.6" />
    <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
    {/* Organic Wood Grain Radial Fissure */}
    <path d="M12 3.5c-.5 2 .5 4 0 6" strokeOpacity="0.5" />
  </svg>
);

/**
 * Floral Glyph: Elegant five-petal Damascena Rose bloom.
 */
export const FloralGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* 5 Petal Rosette Layout */}
    <circle cx="12" cy="7.5" r="3.25" />
    <circle cx="16" cy="11" r="3.25" />
    <circle cx="14.5" cy="15.5" r="3.25" />
    <circle cx="9.5" cy="15.5" r="3.25" />
    <circle cx="8" cy="11" r="3.25" />
    {/* Floral Pistil Center */}
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Warm Spices Glyph: Radiant Kashmiri saffron stigmas with amber resin tear.
 */
export const WarmSpicesGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Central Saffron Triple Stigma */}
    <path d="M12 21V10c0-3 1-5 3-6.5" />
    <path d="M12 13c-1.5-2-3-4-2.5-6.5" />
    <path d="M12 15c2-2 3.5-3.5 4.5-5.5" />
    {/* Saffron Stigma Flared Tips */}
    <circle cx="15.5" cy="3.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="17" cy="9.5" r="1" fill="currentColor" stroke="none" />
    {/* Golden Crystalline Resin Drop */}
    <path d="M7 15c0 2 1.5 3.5 3 3.5s3-1.5 3-3.5c0-1.5-3-4.5-3-4.5s-3 3-3 4.5z" strokeOpacity="0.8" />
  </svg>
);

/**
 * Earth & Clay Glyph: Terraced alluvial clay strata and monsoon petrichor soil.
 */
export const EarthClayGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Terracotta Alluvial Strata Horizons */}
    <path d="M2.5 18.5c4-.5 7.5 1 11.5 0s6.5-1 7.5-.5" />
    <path d="M4 14.5c3.5-1 7.5.5 11 0s4.5-.8 5-.5" strokeOpacity="0.85" />
    <path d="M6 10.5c3-.5 6 1 9 .5s4.5-1.5 5-1" strokeOpacity="0.7" />
    {/* Petrichor Clay Droplets penetrating soil */}
    <circle cx="9" cy="5.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="4" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Longevity / Fixative Glyph: Anchored geometric droplet flacon with fixative base weight.
 */
export const LongevityGlyph: React.FC<GlyphProps> = ({
  size = 18,
  strokeWidth = 1.35,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Anchored Fixative Droplet */}
    <path d="M12 3C9 7.5 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7.5-6-12z" />
    {/* Heavy Foundation Anchor Bar */}
    <path d="M4.5 21h15" strokeWidth={strokeWidth * 1.2} />
    <path d="M12 18.5v2.5" />
    {/* Internal Binding Core Ring */}
    <circle cx="12" cy="14" r="2" strokeOpacity="0.8" />
  </svg>
);

/**
 * Helper to retrieve the exact 8D glyph component by axis key.
 */
export const DIMENSION_GLYPH_MAP: Record<string, React.FC<GlyphProps>> = {
  freshness: FreshnessGlyph,
  sweetness: SweetnessGlyph,
  intensity: IntensityGlyph,
  woody: WoodyGlyph,
  floral: FloralGlyph,
  warm_resinous_spices: WarmSpicesGlyph,
  earthy_clay: EarthClayGlyph,
  longevity_fixative: LongevityGlyph
};

export function getDimensionGlyph(axisKey: string): React.FC<GlyphProps> {
  return DIMENSION_GLYPH_MAP[axisKey] || FreshnessGlyph;
}
