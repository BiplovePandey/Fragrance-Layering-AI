import React from 'react';

export interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  glow?: boolean;
}

/* ==========================================================================
   PHASE 11: CORE NAVIGATION GLYPHS
   Distinctive, elegant, slightly organic, thin, recognizable, premium,
   geometric enough to remain readable, inspired by fragrance, botanical
   forms and alchemical instruments.
   ========================================================================== */

/**
 * ATELIER GLYPH: Four-petal / scent-bloom glyph.
 * An artisanal floral bloom forming an alchemical cross with radiant core.
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
    {/* 4 Petals arranged along cardinal scent axes */}
    {/* North Petal */}
    <path d="M12 12C10.5 7.5 10 4 12 2c2 2 1.5 5.5 0 10z" />
    {/* South Petal */}
    <path d="M12 12C10.5 16.5 10 20 12 22c2-2 1.5-5.5 0-10z" />
    {/* East Petal */}
    <path d="M12 12C16.5 10.5 20 10 22 12c-2 2-5.5 1.5-10 0z" />
    {/* West Petal */}
    <path d="M12 12C7.5 10.5 4 10 2 12c2 2 5.5 1.5 10 0z" />
    {/* Central Bloom Heart / Scent Particle Core */}
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * WEAR GLYPH: Elegant flacon with subtle rising vapor ribbons.
 * A slender, haute-parfumerie silhouette releasing delicate aromatic vapor.
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
    {/* Slender Flacon Cap & Sprayer Collar */}
    <rect x="10" y="8" width="4" height="2.5" rx="0.5" />
    <line x1="9" y1="10.5" x2="15" y2="10.5" />
    {/* Slender Flacon Body */}
    <path d="M8 12.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20.5v-8z" />
    {/* Delicate Scent Fill Level */}
    <path d="M8 18c1.5.5 3-.5 4 0s2.5.5 4 0" strokeDasharray="1 2" strokeOpacity="0.65" />
    {/* Subtle Rising Vapor Ribbons */}
    <path d="M12 7.5V6c0-1.5 1.5-2 1.5-3.5" strokeOpacity="0.85" />
    <path d="M10 6c0-1.5-1.5-2-1.5-3.5" strokeOpacity="0.65" />
  </svg>
);

/**
 * VAULT / CABINET GLYPH: Cabinet/shelf glyph.
 * Architectural perfume sanctum holding flacons on tiered display shelves.
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
    {/* Architectural Outer Frame & Pediment */}
    <rect x="3.5" y="3.5" width="17" height="17.5" rx="2" />
    {/* Middle Shelf Divider */}
    <line x1="3.5" y1="12" x2="20.5" y2="12" strokeWidth={strokeWidth * 1.1} />
    {/* Top Shelf Flacons */}
    <path d="M7 11.5v-3.5h2v3.5M8 8V6.5" strokeOpacity="0.9" />
    <path d="M15 11.5v-4.5h2v4.5M16 7V5.5" strokeOpacity="0.9" />
    {/* Bottom Shelf Flacons */}
    <path d="M6.5 20.5v-4h2.5v4M7.75 16.5V15" strokeOpacity="0.9" />
    <path d="M11 20.5v-5h2v5M12 15.5V14" strokeOpacity="0.9" />
    <path d="M15.5 20.5v-4h2v4M16.5 16.5V15" strokeOpacity="0.9" />
  </svg>
);

/**
 * HERITAGE GLYPH: Botanical seal / leaf manuscript glyph.
 * Circular botanical seal framing an archival leaf manuscript codex.
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
    {/* Outer Botanical Seal Ring with Dashed Radiance */}
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="7.5" strokeDasharray="1.5 2" strokeOpacity="0.5" />
    {/* Manuscript Leaf Rib & Petiole */}
    <path d="M7 17C8 13 11 8 17 7c-1 6-6 9-10 10z" strokeWidth={strokeWidth * 1.05} />
    {/* Central Leaf Vein */}
    <path d="M7 17l6-6" strokeOpacity="0.75" />
    {/* Fine Secondary Veinlets */}
    <path d="M9.5 14.5l2 1M11.5 12.5l2 1" strokeOpacity="0.55" strokeWidth={strokeWidth * 0.85} />
  </svg>
);

/**
 * LAYER / MIXER GLYPH: Two intersecting scent trails.
 * Two graceful, fluid olfactory vapor streams that cross and harmonize.
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
    {/* Scent Trail Alpha (ascending left to right) */}
    <path d="M4 19c3-4 6-2 8-7s4-7 8-9" strokeWidth={strokeWidth * 1.1} />
    {/* Scent Trail Beta (ascending right to left, intersecting) */}
    <path d="M20 19c-3-4-6-2-8-7s-4-7-8-9" strokeWidth={strokeWidth * 1.1} />
    {/* Harmonious Synthesis Intersection Nodal Spark */}
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    {/* Volatile Particle Accents */}
    <circle cx="6" cy="7" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="18" cy="7" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * EXPLORE GLYPH: Compass + scent particle.
 * Scent compass with celestial pointer and an orbiting volatile particle.
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
    {/* Outer Calibrated Compass Ring */}
    <circle cx="12" cy="12" r="9" />
    {/* Cardinal Orientation Ticks */}
    <line x1="12" y1="3" x2="12" y2="4.5" />
    <line x1="12" y1="19.5" x2="12" y2="21" />
    <line x1="3" y1="12" x2="4.5" y2="12" />
    <line x1="19.5" y1="12" x2="21" y2="12" />
    {/* 4-Pointed Scent Star Compass Needle */}
    <polygon points="12,6.5 13.75,10.25 17.5,12 13.75,13.75 12,17.5 10.25,13.75 6.5,12 10.25,10.25" strokeWidth={strokeWidth * 0.95} />
    {/* Orbiting Scent Particle */}
    <circle cx="16.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * PORTRAIT / DNA GLYPH: Constellation / molecular bloom.
 * Connected multi-node sensory constellation forming an olfactory bloom.
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
    {/* Molecular Constellation Nodes (Hexagonal / Bloom Layout) */}
    {/* Central Core */}
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
    {/* Star Nodes */}
    <circle cx="12" cy="4" r="1.5" />
    <circle cx="19" cy="8" r="1.5" />
    <circle cx="19" cy="16" r="1.5" />
    <circle cx="12" cy="20" r="1.5" />
    <circle cx="5" cy="16" r="1.5" />
    <circle cx="5" cy="8" r="1.5" />
    {/* Constellation Connecting Bonds */}
    <path d="M12 5.5v4.5M17.7 9.2l-3.9 2.3M17.7 14.8l-3.9-2.3M12 18.5v-4.5M6.3 14.8l3.9-2.3M6.3 9.2l3.9 2.3" strokeOpacity="0.8" />
    {/* Outer Constellation Polygon */}
    <path d="M12 4l7 4v8l-7 4-7-4V8z" strokeDasharray="1.5 2.5" strokeOpacity="0.5" />
  </svg>
);

/**
 * SCANNER GLYPH: Optical flacon / scan glyph.
 * Precision corner targeting reticle framing an optical flacon profile.
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
    {/* 4 Optical Corner Scan Reticles */}
    <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" />
    {/* Optical Flacon Silhouette in Focal Plane */}
    <rect x="10.5" y="7" width="3" height="2" rx="0.5" />
    <path d="M9 10h6l1 2.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 17.5v-5L9 10z" />
    {/* Laser Scan Horizon Beam */}
    <line x1="6" y1="13.5" x2="18" y2="13.5" strokeDasharray="1.5 1.5" strokeOpacity="0.8" />
  </svg>
);

/**
 * ACADEMY GLYPH: Botanical manuscript / instrument glyph.
 * Archival manuscript leaf with perfumer's graduated dropper instrument.
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
    {/* Open Archival Manuscript Codex Foliage */}
    <path d="M3 18.5a2.5 2.5 0 0 1 2.5-2.5h5.5v5H5.5A2.5 2.5 0 0 1 3 18.5z" />
    <path d="M21 18.5a2.5 2.5 0 0 0-2.5-2.5h-5.5v5h5.5A2.5 2.5 0 0 0 21 18.5z" />
    {/* Perfumer's Precision Pipette / Alchemical Instrument */}
    <path d="M12 3v13M10.5 4.5h3" />
    <polygon points="12,16 13,13 11,13" fill="currentColor" />
    {/* Suspended Extract Micro-Droplet */}
    <circle cx="12" cy="18.5" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * COMMUNITY / SOCIETY GLYPH: Two scent trails forming a shared circle.
 * Twin flowing vapor streams ascending from opposite poles to meet in a circle.
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
    {/* Trail A: Climbs clockwise from south to north */}
    <path d="M12 21c-4.5 0-8-3.5-8-8 0-3 1.8-5.5 4.5-6.8" strokeWidth={strokeWidth * 1.1} />
    <circle cx="9" cy="6" r="1.25" fill="currentColor" />
    {/* Trail B: Climbs counter-clockwise from north to south, meeting Trail A */}
    <path d="M12 3c4.5 0 8 3.5 8 8 0 3-1.8 5.5-4.5 6.8" strokeWidth={strokeWidth * 1.1} />
    <circle cx="15" cy="18" r="1.25" fill="currentColor" />
    {/* Center Scent Union Radiance */}
    <circle cx="12" cy="12" r="2" strokeDasharray="1.5 2" strokeOpacity="0.6" />
    <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
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

/* ==========================================================================
   DISCOVERY COLLECTION GLYPHS (FOR HIM, FOR HER, UNISEX & NICHE)
   Distinctive, bespoke luxury identity marks without gender stereotypes.
   ========================================================================== */

/**
 * For Him Glyph: Refined architectural flacon with subtle geometric aromatic diamond motif.
 */
export const ForHimGlyph: React.FC<GlyphProps> = ({
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
    {/* Architectural Beveled Stopper */}
    <rect x="9" y="2" width="6" height="3" rx="0.5" />
    <path d="M12 5v2" />
    <path d="M8.5 7h7" />
    {/* Broad Beveled Shoulders & Structured Flacon Body */}
    <path d="M6 9.5l2-1.5h8l2 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V9.5z" />
    {/* Internal Geometric Diamond / Aromatic Prismatic Facet */}
    <polygon points="12,11 15,14.5 12,18 9,14.5" strokeOpacity="0.85" strokeWidth={strokeWidth * 0.9} />
    <line x1="12" y1="11" x2="12" y2="18" strokeDasharray="1.5 1.5" strokeOpacity="0.6" />
  </svg>
);

/**
 * For Her Glyph: Refined flacon with luminous botanical petal and curved floral motif.
 */
export const ForHerGlyph: React.FC<GlyphProps> = ({
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
    {/* Rounded Droplet Stopper */}
    <ellipse cx="12" cy="3.5" rx="2.5" ry="2" />
    <path d="M12 5.5v1.5" />
    <path d="M9 7h6" />
    {/* Graceful Soft-Shoulder Flacon Silhouette */}
    <path d="M7 9.5c0-1.2 1.5-2 5-2s5 .8 5 2l1 10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L7 9.5z" />
    {/* Internal Botanical Petal Arch / Floral Rosette Contour */}
    <path d="M12 11c1.5 1.5 2 3.5 0 6-2-2.5-1.5-4.5 0-6z" strokeOpacity="0.9" strokeWidth={strokeWidth * 0.95} />
    <path d="M9.5 14c1.2-.5 3.8-.5 5 0" strokeDasharray="1 1.5" strokeOpacity="0.6" />
  </svg>
);

/**
 * Unisex & Niche Glyph: Balanced dual-flacon motif with intertwining scent trails.
 */
export const UnisexNicheGlyph: React.FC<GlyphProps> = ({
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
    {/* Twin Harmonic Flacon Collars & Caps */}
    <rect x="5.5" y="4" width="3" height="2" rx="0.5" />
    <rect x="15.5" y="4" width="3" height="2" rx="0.5" />
    <line x1="7" y1="6" x2="7" y2="7.5" />
    <line x1="17" y1="6" x2="17" y2="7.5" />
    {/* Twin Complementary Flacons */}
    <path d="M4 9.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 10 9.5V19a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 4 19V9.5z" strokeOpacity="0.8" />
    <path d="M14 9.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 19V9.5z" strokeOpacity="0.8" />
    {/* Intertwining Scent Wave / Infinite Mobius Ribbon connecting the two */}
    <path d="M7 14c2-3 4 3 6 0s4 3 4 0" strokeWidth={strokeWidth * 1.1} />
    <circle cx="12" cy="14" r="1" fill="currentColor" />
  </svg>
);

/**
 * All Collections Glyph: Harmonic tri-flacon constellation symbolizing complete discovery.
 */
export const AllCollectionsGlyph: React.FC<GlyphProps> = ({
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
    {/* Central Master Flacon */}
    <rect x="10.5" y="2" width="3" height="2" rx="0.5" />
    <path d="M8.5 6.5h7l1 11a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 7.5 17.5l1-11z" />
    {/* Left Flacon Contour */}
    <path d="M4 10.5h3v7a1 1 0 0 1-1 1H4" strokeOpacity="0.75" />
    {/* Right Flacon Contour */}
    <path d="M20 10.5h-3v7a1 1 0 0 0 1 1h2" strokeOpacity="0.75" />
    {/* Luminous Radiance Spark */}
    <path d="M12 9v4M10 11h4" strokeWidth={strokeWidth * 0.9} />
  </svg>
);

/**
 * Unclassified Glyph: Open archival flacon with delicate dotted inspection aura.
 */
export const UnclassifiedGlyph: React.FC<GlyphProps> = ({
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
    <rect x="10" y="3" width="4" height="2" rx="0.5" />
    <path d="M8 8h8l1 9.5a2 2 0 0 1-2 2.5H9a2 2 0 0 1-2-2.5L8 8z" strokeDasharray="2.5 2" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/**
 * Collection Glyph Resolver
 */
export const COLLECTION_GLYPH_MAP: Record<string, React.FC<GlyphProps>> = {
  all: AllCollectionsGlyph,
  'for-him': ForHimGlyph,
  'for-her': ForHerGlyph,
  'unisex-niche': UnisexNicheGlyph,
  unspecified: UnclassifiedGlyph,
  unclassified: UnclassifiedGlyph,
  masculine: ForHimGlyph,
  feminine: ForHerGlyph,
  unisex: UnisexNicheGlyph
};

export function getCollectionGlyph(collectionKey: string): React.FC<GlyphProps> {
  const normalized = (collectionKey || '').toLowerCase();
  return COLLECTION_GLYPH_MAP[normalized] || AllCollectionsGlyph;
}

/* ==========================================================================
   PHASE 11: ICON INTERACTION CONTAINER
   Enforces luxury atelier interaction physics:
   - Default: muted champagne / brass
   - Hover: brighter stroke + tiny reflected bottle aura (100–150ms)
   - Active: warm amber/champagne with restrained halo
   - Pressed: slight spring compression
   - Focus: clear accessible focus ring
   ========================================================================== */

export interface AtelierIconProps {
  glyph: React.FC<GlyphProps>;
  size?: number | string;
  strokeWidth?: number;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  title?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const AtelierIcon: React.FC<AtelierIconProps> = ({
  glyph: GlyphComponent,
  size = 18,
  strokeWidth = 1.35,
  isActive = false,
  disabled = false,
  className = '',
  iconClassName = '',
  title,
  onClick,
  ariaLabel
}) => {
  return (
    <span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-label={ariaLabel || title}
      title={title}
      onClick={disabled ? undefined : onClick}
      onKeyDown={onClick && !disabled ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`relative inline-flex items-center justify-center select-none transition-all duration-150 group/icon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/80 rounded-lg active:scale-95 ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Restrained Flacon Reflected Light Halo */}
      {isActive && (
        <span
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/15 via-amber-300/10 to-amber-500/15 blur-sm pointer-events-none"
          aria-hidden="true"
        />
      )}
      <GlyphComponent
        size={size}
        strokeWidth={isActive ? strokeWidth * 1.15 : strokeWidth}
        className={`transition-all duration-150 ${
          isActive
            ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.35)]'
            : 'text-[#9A8D7F] dark:text-[#A89D91] group-hover/icon:text-[#D4AF37] group-hover/icon:drop-shadow-[0_0_4px_rgba(212,175,55,0.25)]'
        } ${iconClassName}`}
      />
    </span>
  );
};

