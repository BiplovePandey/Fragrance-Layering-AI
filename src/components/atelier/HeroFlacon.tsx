import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Eye } from 'lucide-react';
import { Fragrance, OlfactoryVector8D } from '../../types.js';
import { getFlaconLayoutId, SHARED_FLACON_TRANSITION } from '../../motion/sharedElements.js';
import { ScentFamilyAtmosphere } from '../AtmosphericFragranceCanvas.js';
import { extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { getFragranceFamilyTokens } from '../../utils/fragrancePalette.js';

interface HeroFlaconProps {
  fragrance: Fragrance;
  atmosphere?: ScentFamilyAtmosphere;
  vector8D?: OlfactoryVector8D;
  onClick?: () => void;
  size?: 'hero' | 'chord' | 'mini';
}

// Map fragrance family or atmosphere to multi-layered vapor aura tones
const FAMILY_AURA_MAP: Record<string, {
  coreVapor: string;
  midDiffusion: string;
  outerBloom: string;
  amber: string;
  liquidColor: string;
  capTone: string;
  accentNote: string;
}> = {
  rose: {
    coreVapor: 'rgba(244, 63, 94, 0.28)',
    midDiffusion: 'rgba(251, 113, 133, 0.16)',
    outerBloom: 'rgba(254, 205, 211, 0.10)',
    amber: '#FB7185',
    liquidColor: 'rgba(244, 63, 94, 0.32)',
    capTone: '#D4AF37',
    accentNote: 'Damask Petals'
  },
  oud: {
    coreVapor: 'rgba(180, 83, 9, 0.32)',
    midDiffusion: 'rgba(217, 119, 6, 0.18)',
    outerBloom: 'rgba(146, 64, 14, 0.09)',
    amber: '#D97706',
    liquidColor: 'rgba(180, 83, 9, 0.42)',
    capTone: '#C59A3F',
    accentNote: 'Smoked Resin'
  },
  citrus: {
    coreVapor: 'rgba(245, 158, 11, 0.28)',
    midDiffusion: 'rgba(252, 211, 77, 0.16)',
    outerBloom: 'rgba(254, 240, 138, 0.10)',
    amber: '#F59E0B',
    liquidColor: 'rgba(245, 158, 11, 0.30)',
    capTone: '#E5C158',
    accentNote: 'Solar Zest'
  },
  earthy: {
    coreVapor: 'rgba(194, 65, 12, 0.30)',
    midDiffusion: 'rgba(234, 88, 12, 0.16)',
    outerBloom: 'rgba(254, 215, 170, 0.10)',
    amber: '#EA580C',
    liquidColor: 'rgba(194, 65, 12, 0.38)',
    capTone: '#B8860B',
    accentNote: 'Mitti Terracotta'
  },
  aquatic: {
    coreVapor: 'rgba(14, 165, 233, 0.26)',
    midDiffusion: 'rgba(56, 189, 248, 0.15)',
    outerBloom: 'rgba(186, 230, 253, 0.08)',
    amber: '#0284C7',
    liquidColor: 'rgba(14, 165, 233, 0.28)',
    capTone: '#D4AF37',
    accentNote: 'Marine Mist'
  },
  woody: {
    coreVapor: 'rgba(180, 83, 9, 0.28)',
    midDiffusion: 'rgba(202, 138, 4, 0.16)',
    outerBloom: 'rgba(253, 230, 138, 0.08)',
    amber: '#CA8A04',
    liquidColor: 'rgba(180, 83, 9, 0.36)',
    capTone: '#C9953B',
    accentNote: 'Mysore Santal'
  },
  default: {
    coreVapor: 'rgba(217, 119, 6, 0.26)',
    midDiffusion: 'rgba(245, 158, 11, 0.15)',
    outerBloom: 'rgba(254, 243, 199, 0.08)',
    amber: '#D97706',
    liquidColor: 'rgba(217, 119, 6, 0.32)',
    capTone: '#D4AF37',
    accentNote: 'Botanical Accord'
  }
};

export const HeroFlacon: React.FC<HeroFlaconProps> = ({
  fragrance,
  atmosphere,
  vector8D,
  onClick,
  size = 'hero'
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const effectiveVector = vector8D || extractFragranceVector8D(fragrance);

  const tokens = getFragranceFamilyTokens(
    atmosphere || fragrance.fragrance_family,
    fragrance.name,
    [...(fragrance.top_notes || []), ...(fragrance.middle_notes || []), ...(fragrance.base_notes || [])]
  );
  const baseAura = tokens.flaconAura;

  // 8D Vector-influenced visual properties
  const intensityRatio = Math.max(0.35, Math.min(1.2, (effectiveVector.intensity || 60) / 70));
  const freshnessRatio = Math.max(0.3, Math.min(1.2, (effectiveVector.freshness || 60) / 70));
  const woodyRatio = (effectiveVector.woody || 50) / 100;
  const resinRatio = (effectiveVector.warm_resinous_spices || 50) / 100;

  // Modulated aura tones reflecting resin and wood depth
  const aura = {
    ...baseAura,
    liquidColor: resinRatio > 0.6 
      ? `rgba(180, 83, 9, ${0.28 + resinRatio * 0.22})` 
      : baseAura.liquidColor,
    amber: woodyRatio > 0.65 ? '#CA8A04' : baseAura.amber
  };

  const isHero = size === 'hero';
  const isChord = size === 'chord';

  // Pointer Parallax (Subtle 2-4 degrees tilt max for hero, disabled if reduced motion)
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHero || !containerRef.current || reducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Dimensions
  const containerSize = isHero
    ? 'w-56 h-80 sm:w-72 sm:h-96'
    : isChord
    ? 'w-32 h-44 sm:w-40 sm:h-52'
    : 'w-20 h-28';

  const bottleWidth = isHero ? 'w-40 sm:w-48' : isChord ? 'w-24 sm:w-28' : 'w-16';
  const bottleHeight = isHero ? 'h-52 sm:h-64' : isChord ? 'h-34 sm:h-40' : 'h-20';
  const capWidth = isHero ? 'w-14 sm:w-16 h-8 sm:h-10' : isChord ? 'w-9 h-5' : 'w-6 h-3';
  const neckWidth = isHero ? 'w-9 sm:w-11 h-3.5 sm:h-4.5' : isChord ? 'w-6 h-2.5' : 'w-4 h-1.5';

  const outerBloomPx = Math.round((isHero ? 340 : 180) * intensityRatio);
  const midDiffusionPx = Math.round((isHero ? 260 : 140) * (0.85 + freshnessRatio * 0.25));

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none cursor-pointer group ${containerSize}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Inspect ${fragrance.name} by ${fragrance.brand}`}
      style={{ perspective: isHero && !reducedMotion ? 900 : undefined }}
    >
      {/* =========================================================================
          ATMOSPHERIC FRAGRANCE AURA (3-LAYER SLOW VAPOR DIFFUSION)
          ========================================================================= */}
      {/* Layer 1: Outer Environmental Bloom */}
      <motion.div
        animate={
          reducedMotion
            ? { scale: 1, opacity: 0.7 }
            : {
                scale: isHovered ? 1.22 : isHero ? [1.02, 1.15, 1.02] : [1, 1.06, 1],
                opacity: isHovered ? 0.9 : isHero ? [0.65, 0.95, 0.65] : [0.4, 0.7, 0.4],
              }
        }
        transition={{
          duration: 6 / freshnessRatio,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute rounded-full pointer-events-none blur-3xl z-0 transition-all duration-700"
        style={{
          width: `${outerBloomPx}px`,
          height: `${outerBloomPx}px`,
          background: `radial-gradient(circle, ${aura.outerBloom} 0%, rgba(255,255,255,0) 70%)`
        }}
      />

      {/* Layer 2: Mid Scent Vapor Diffusion (Irregular Breathing Ellipse) */}
      <motion.div
        animate={
          reducedMotion
            ? { scale: 1, opacity: 0.8, rotate: 0 }
            : {
                scale: isHovered ? 1.15 : isHero ? [1, 1.1, 1] : [1, 1.05, 1],
                opacity: isHovered ? 0.95 : isHero ? [0.75, 1, 0.75] : [0.5, 0.8, 0.5],
                rotate: isHero ? [0, 8, -6, 0] : 0
              }
        }
        transition={{
          duration: 8 / freshnessRatio,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute rounded-[45%_55%_60%_40%/50%_45%_55%_50%] pointer-events-none blur-2xl z-0 transition-all duration-500"
        style={{
          width: `${midDiffusionPx}px`,
          height: `${midDiffusionPx}px`,
          background: `radial-gradient(circle, ${aura.midDiffusion} 15%, transparent 68%)`
        }}
      />

      {/* Layer 3: Concentrated Core Headspace Aura */}
      <motion.div
        animate={
          reducedMotion
            ? { scale: 1, opacity: 0.9 }
            : {
                scale: isHovered ? 1.08 : [0.95, 1.05, 0.95],
                opacity: [0.8, 1, 0.8]
              }
        }
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute rounded-full pointer-events-none blur-xl z-0"
        style={{
          width: isHero ? '180px' : '100px',
          height: isHero ? '180px' : '100px',
          background: `radial-gradient(circle, ${aura.coreVapor} 0%, transparent 75%)`
        }}
      />

      {/* Floating Micro-Scent Molecules (Light-Refracting Particles) */}
      {isHero && !reducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
              animate={{
                x: [0, (i % 2 === 0 ? 1 : -1) * (14 + i * 7), (i % 2 === 0 ? 1 : -1) * (8 + i * 3)],
                y: [6, -30 - i * 14, -65 - i * 18],
                opacity: [0, 0.65, 0],
                scale: [0.4, 0.9, 0.2]
              }}
              transition={{
                duration: (4.2 + i * 0.8) / freshnessRatio,
                repeat: Infinity,
                delay: i * 0.9,
                ease: 'easeOut'
              }}
              className="absolute w-1.5 h-1.5 rounded-full blur-[0.6px]"
              style={{
                left: `${38 + (i * 11) % 30}%`,
                bottom: '28%',
                backgroundColor: aura.amber
              }}
            />
          ))}
        </div>
      )}

      {/* =========================================================================
          THE PHYSICAL FLACON (SHARED ELEMENT + TILT + LUXURY GLASS CRAFT)
          ========================================================================= */}
      <motion.div
        layoutId={getFlaconLayoutId(fragrance.id)}
        transition={SHARED_FLACON_TRANSITION}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={
            isHero
              ? reducedMotion
                ? { y: 0 }
                : { y: isHovered ? -6 : [0, -6, 0] }
              : undefined
          }
          transition={
            isHero
              ? isHovered
                ? { duration: 0.3, ease: 'easeOut' }
                : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              : undefined
          }
          style={isHero && !reducedMotion ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
          className="flex flex-col items-center"
        >
          {/* 1. Flacon Cap (Brushed Gold / Noble Metallic Bevel) */}
          <div
            className={`${capWidth} rounded-t-lg relative shadow-md transition-transform group-hover:-translate-y-0.5`}
            style={{
              background: 'linear-gradient(135deg, #E6C875 0%, #F5E9BE 25%, #C59A3F 55%, #8B651B 85%, #59400D 100%)',
              boxShadow: '0 3px 12px rgba(89, 64, 13, 0.28), inset 0 1px 1.5px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(0,0,0,0.3)'
            }}
          >
            {/* Cap Filigree Accent & Upper Bevel Highlight */}
            <div className="absolute inset-x-1 top-1 h-[1px] bg-white/80 rounded-full" />
            <div className="absolute inset-x-2 bottom-1 h-[1px] bg-black/25" />
            {/* Center Cap Finial / Monogram Dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-950/40 border border-white/60" />
          </div>

          {/* 2. Neck / Gold Collar Ring */}
          <div
            className={`${neckWidth} bg-gradient-to-r from-amber-800 via-amber-400 to-amber-900 shadow-inner relative`}
          >
            <div className="absolute inset-x-0 top-0 h-[0.5px] bg-white/70" />
            <div className="absolute inset-x-0 bottom-0 h-[0.5px] bg-amber-950/50" />
          </div>

          {/* 3. Flacon Glass Shoulder & Vessel */}
          <div
            className={`${bottleWidth} ${bottleHeight} rounded-[30px] relative overflow-hidden flex flex-col items-center justify-between p-4 transition-all duration-300`}
            style={{
              background: 'linear-gradient(168deg, rgba(255,255,255,0.92) 0%, rgba(250,247,242,0.78) 40%, rgba(244,239,232,0.90) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              boxShadow: isHovered
                ? '0 28px 56px -12px rgba(95, 70, 40, 0.22), 0 12px 24px -6px rgba(95, 70, 40, 0.12), inset 0 1.5px 3px rgba(255,255,255,1), inset 0 -6px 16px rgba(217, 119, 6, 0.16)'
                : '0 20px 45px -10px rgba(95, 70, 40, 0.16), 0 8px 16px -4px rgba(95, 70, 40, 0.08), inset 0 1.5px 3px rgba(255,255,255,1), inset 0 -4px 12px rgba(217, 119, 6, 0.12)'
            }}
          >
            {/* Primary Specular Vertical Reflection (Left Light Refraction) */}
            <div className="absolute left-2.5 sm:left-3 top-3 bottom-4 w-2 bg-gradient-to-b from-white/95 via-white/50 to-transparent rounded-full pointer-events-none" />

            {/* Secondary Soft Rim Reflection (Right Side Glaze) */}
            <div className="absolute right-2.5 sm:right-3 top-6 bottom-8 w-1 bg-gradient-to-b from-white/70 via-white/25 to-transparent rounded-full pointer-events-none" />

            {/* Subtle Atmospheric Reflected Color Spill (Back Wall Reflection) */}
            <div
              className="absolute inset-x-3 inset-y-4 rounded-[22px] pointer-events-none opacity-40 blur-sm"
              style={{
                background: `radial-gradient(ellipse at 50% 65%, ${aura.coreVapor} 0%, transparent 70%)`
              }}
            />

            {/* 4. Fragrance Liquid Fill Level inside Glass */}
            <div
              className="absolute inset-x-2.5 bottom-2.5 rounded-b-[26px] overflow-hidden pointer-events-none transition-all duration-500"
              style={{
                height: isHero ? '68%' : '60%',
                background: `linear-gradient(180deg, transparent 0%, ${aura.liquidColor} 22%, ${aura.amber}55 100%)`,
                borderTop: `1px solid ${aura.amber}60`
              }}
            >
              {/* Liquid Meniscus Shimmer Line */}
              <motion.div
                animate={{ x: [-12, 12, -12] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-1 bg-white/50 blur-[0.5px]"
              />

              {/* Internal Caustic Depth Glow */}
              <div
                className="absolute bottom-1 inset-x-3 h-8 rounded-full blur-md opacity-60"
                style={{ backgroundColor: aura.amber }}
              />
            </div>

            {/* 5. Luxury Editorial Label Inscribed on Glass */}
            <div className="relative z-10 w-full my-auto flex flex-col items-center text-center px-1">
              {/* Monogram Seal / Kannauj Deg Emblem */}
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1.5 shadow-2xs transition-transform group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FAF7F2 0%, #EFE8DC 100%)',
                  border: `1px solid ${aura.amber}70`
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              </div>

              {/* Fragrance Name */}
              <h4
                className="font-serif font-medium leading-tight text-[#1A1613] tracking-tight px-1 line-clamp-2"
                style={{
                  fontSize: isHero ? 'clamp(1.05rem, 1.3vw + 0.5rem, 1.35rem)' : isChord ? '0.85rem' : '0.7rem'
                }}
              >
                {fragrance.name}
              </h4>

              {/* Brand */}
              <span
                className="font-brand uppercase tracking-widest text-[#7A6F66] font-semibold mt-1 truncate max-w-full"
                style={{ fontSize: isHero ? '0.68rem' : '0.55rem' }}
              >
                {fragrance.brand}
              </span>

              {/* Concentration Tag */}
              {isHero && (
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-900/90 mt-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-[#E8DFD3] shadow-2xs font-semibold">
                  {fragrance.concentration || 'Fine Parfum'}
                </span>
              )}
            </div>

            {/* 6. Thick Crystal Base Refraction Layer */}
            <div className="relative z-10 w-full flex items-center justify-between px-1.5 pt-1 text-[8px] font-mono text-[#8A7E74] border-t border-white/60">
              <span className="opacity-80">KAU-{(fragrance.id % 900) + 100}</span>
              <span className="opacity-80">50 ML &bull; FL.OZ 1.7</span>
            </div>
          </div>
        </motion.div>

        {/* Tactile Flacon Contact Shadow (Shrinks and softens when bottle rises) */}
        <motion.div
          animate={
            isHero
              ? {
                  scale: isHovered ? 0.86 : [1, 0.9, 1],
                  opacity: isHovered ? 0.22 : [0.35, 0.22, 0.35]
                }
              : undefined
          }
          transition={
            isHero
              ? isHovered
                ? { duration: 0.3 }
                : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              : undefined
          }
          className="rounded-full mt-2.5 pointer-events-none transition-all duration-300"
          style={{
            width: isHero ? '150px' : isChord ? '95px' : '55px',
            height: isHero ? '16px' : isChord ? '10px' : '6px',
            background: 'radial-gradient(ellipse at center, rgba(89, 64, 13, 0.38) 0%, rgba(89, 64, 13, 0.10) 55%, transparent 75%)',
            filter: 'blur(3.5px)'
          }}
        />
      </motion.div>

      {/* Hover Inspect Indicator Badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-xs border border-white text-amber-900 pointer-events-none">
        <Eye className="w-3.5 h-3.5 text-amber-800" />
      </div>
    </div>
  );
};
