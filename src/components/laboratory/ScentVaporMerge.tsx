import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, AlertTriangle, ShieldCheck, Flame, Waves } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { getLabPalette, deriveChordPoeticName } from './LaboratoryAtmosphere.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface ScentVaporMergeProps {
  fragA: Fragrance;
  fragB: Fragrance;
  compatibilityScore: number;
  spraysA: number;
  spraysB: number;
}

export const ScentVaporMerge: React.FC<ScentVaporMergeProps> = ({
  fragA,
  fragB,
  compatibilityScore,
  spraysA,
  spraysB
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const paletteA = getLabPalette(fragA.fragrance_family);
  const paletteB = getLabPalette(fragB.fragrance_family);
  const chordName = deriveChordPoeticName(fragA, fragB);

  // Play subtle spatial chord when a new combination merges
  useEffect(() => {
    try {
      if (compatibilityScore >= 85) {
        ambientAudioEngine.playSpatialChord([528, 660, 792, 1056], 0.12);
      } else if (compatibilityScore >= 70) {
        ambientAudioEngine.playSpatialChord([440, 554.37, 659.25], 0.1);
      } else {
        ambientAudioEngine.playSpatialChord([370, 466.16, 554.37], 0.08);
      }
    } catch {
      // Audio fallback
    }
  }, [fragA.id, fragB.id, compatibilityScore]);

  // Determine merge behavior based on compatibility
  const isHarmonic = compatibilityScore >= 85;
  const isTension = compatibilityScore >= 70 && compatibilityScore < 85;
  const isFriction = compatibilityScore < 70;

  // Relative ratio
  const totalSprays = spraysA + spraysB;
  const ratioAPercent = Math.round((spraysA / totalSprays) * 100);
  const ratioBPercent = 100 - ratioAPercent;

  return (
    <div
      role="region"
      aria-label={`Scent Vapor Synthesis: ${fragA.name} and ${fragB.name} chord collision with ${compatibilityScore} percent resonance score`}
      className="relative w-full py-6 flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#0A0806]/80 border border-stone-800/80 p-4 sm:p-6 backdrop-blur-xl"
    >
      {/* Background Laboratory Markings & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af3710_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      {/* Hero Alchemical Collision Vessel & Vapor Chamber */}
      <div className="relative w-full max-w-2xl h-44 sm:h-52 flex items-center justify-between px-2 sm:px-8">
        {/* ============================================================
            LEFT VAPOR STREAM (FRAGRANCE A)
        ============================================================ */}
        <div className="relative flex-1 h-full flex items-center justify-start overflow-visible">
          {/* Vapor emitter ring on left */}
          <div className="w-3 h-16 rounded-full border border-amber-500/40 bg-stone-900/80 relative z-10 shadow-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>

          {/* Animated SVG Vapor Plume from Left to Center */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="vaporGradA" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={paletteA.primaryColor} stopOpacity={0.7} />
                <stop offset="60%" stopColor={paletteA.primaryColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={isHarmonic ? '#D4AF37' : paletteA.primaryColor} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <motion.path
              d="M 12 88 Q 60 50, 120 75 T 220 88"
              fill="none"
              stroke="url(#vaporGradA)"
              strokeWidth={Math.max(4, spraysA * 3)}
              strokeLinecap="round"
              strokeDasharray="6 4"
              initial={{ pathOffset: 0 }}
              animate={reducedMotion ? { pathOffset: 0 } : { pathOffset: -1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.path
              d="M 12 88 Q 80 120, 150 95 T 220 88"
              fill="none"
              stroke="url(#vaporGradA)"
              strokeWidth={Math.max(2, spraysA * 1.8)}
              strokeLinecap="round"
              opacity={0.6}
              initial={{ pathOffset: 0 }}
              animate={reducedMotion ? { pathOffset: 0 } : { pathOffset: -1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          {/* Micro scent molecules floating rightward */}
          {!reducedMotion && [...Array(4)].map((_, i) => (
            <motion.div
              key={`molA-${i}`}
              className="absolute w-2 h-2 rounded-full blur-[0.5px] pointer-events-none"
              style={{
                backgroundColor: paletteA.primaryColor,
                left: `${15 + i * 18}%`,
                top: `${42 + (i % 2 === 0 ? 12 : -12)}%`
              }}
              animate={{
                x: [0, 25, 0],
                y: [0, (i % 2 === 0 ? -10 : 10), 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        {/* ============================================================
            CENTER: THE ALCHEMICAL COLLISION VESSEL & CHORD MENISCUS
        ============================================================ */}
        <div className="relative z-20 flex flex-col items-center justify-center shrink-0 mx-2">
          {/* Reaction Aura Halo */}
          <motion.div
            className="absolute w-32 sm:w-40 h-32 sm:h-40 rounded-full blur-2xl pointer-events-none -z-10"
            style={{
              background: isHarmonic
                ? 'radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(244,63,94,0.2) 60%, transparent 100%)'
                : isTension
                ? 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(16,185,129,0.2) 60%, transparent 100%)'
                : 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(180,83,9,0.2) 60%, transparent 100%)'
            }}
            animate={
              reducedMotion
                ? { scale: 1, opacity: 0.7 }
                : isFriction
                ? { scale: [0.95, 1.08, 0.95], opacity: [0.5, 0.8, 0.5] }
                : { scale: [1, 1.04, 1], opacity: [0.6, 0.9, 0.6] }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: isFriction ? 1.5 : 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
            }
          />

          {/* Central Blending Alembic Vessel */}
          <div className="w-20 sm:w-24 h-24 sm:h-28 rounded-full bg-gradient-to-b from-white/20 via-stone-900/80 to-black border-2 border-amber-400/40 flex flex-col items-center justify-center relative shadow-[0_0_40px_rgba(212,175,55,0.25)] backdrop-blur-2xl overflow-hidden">
            {/* Specular curved reflection */}
            <div className="absolute top-1 left-2 w-3 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] pointer-events-none" />

            {/* Central harmonic liquid wave */}
            <motion.div
              className="absolute bottom-0 w-full h-1/2 opacity-70"
              style={{
                background: `linear-gradient(to top, ${paletteA.primaryColor}80, ${paletteB.primaryColor}80)`
              }}
              animate={reducedMotion ? { y: 0 } : { y: [0, -3, 0] }}
              transition={reducedMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Inner Collision Sparkle / Status Core */}
            <div className="relative z-10 text-center">
              <Sparkles className={`w-5 h-5 mx-auto ${isHarmonic ? (reducedMotion ? 'text-[#D4AF37]' : 'text-[#D4AF37] animate-spin') : isTension ? 'text-amber-300' : 'text-rose-400'}`} style={{ animationDuration: '8s' }} />
              <div className="font-mono text-sm sm:text-base font-bold text-stone-100 mt-1">
                {compatibilityScore}%
              </div>
              <span className="text-[8px] font-mono tracking-widest uppercase text-amber-300/80">
                Resonance
              </span>
            </div>
          </div>

          {/* Pedestal mark */}
          <div className="w-16 h-2 rounded-full bg-stone-900 border border-stone-800 mt-1" />
        </div>

        {/* ============================================================
            RIGHT VAPOR STREAM (FRAGRANCE B)
        ============================================================ */}
        <div className="relative flex-1 h-full flex items-center justify-end overflow-visible">
          {/* Animated SVG Vapor Plume from Right to Center */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="vaporGradB" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor={paletteB.primaryColor} stopOpacity={0.7} />
                <stop offset="60%" stopColor={paletteB.primaryColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={isHarmonic ? '#D4AF37' : paletteB.primaryColor} stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <motion.path
              d="M 220 88 Q 160 50, 100 75 T 0 88"
              fill="none"
              stroke="url(#vaporGradB)"
              strokeWidth={Math.max(4, spraysB * 3)}
              strokeLinecap="round"
              strokeDasharray="6 4"
              initial={{ pathOffset: 0 }}
              animate={reducedMotion ? { pathOffset: 0 } : { pathOffset: 1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.path
              d="M 220 88 Q 140 120, 70 95 T 0 88"
              fill="none"
              stroke="url(#vaporGradB)"
              strokeWidth={Math.max(2, spraysB * 1.8)}
              strokeLinecap="round"
              opacity={0.6}
              initial={{ pathOffset: 0 }}
              animate={reducedMotion ? { pathOffset: 0 } : { pathOffset: 1 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          {/* Micro scent molecules floating leftward */}
          {!reducedMotion && [...Array(4)].map((_, i) => (
            <motion.div
              key={`molB-${i}`}
              className="absolute w-2 h-2 rounded-full blur-[0.5px] pointer-events-none"
              style={{
                backgroundColor: paletteB.primaryColor,
                right: `${15 + i * 18}%`,
                top: `${42 + (i % 2 === 0 ? -12 : 12)}%`
              }}
              animate={{
                x: [0, -25, 0],
                y: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}

          {/* Vapor emitter ring on right */}
          <div className="w-3 h-16 rounded-full border border-rose-500/40 bg-stone-900/80 relative z-10 shadow-xs flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ============================================================
          VAPOR COLLISION HARMONIC STATUS BAR
      ============================================================ */}
      <div className="mt-3 w-full max-w-lg flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-stone-950/70 border border-stone-800">
        <div className="flex items-center gap-2">
          {isHarmonic ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Harmonic Chord
            </span>
          ) : isTension ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
              <Waves className="w-3 h-3 text-amber-400" />
              Interesting Tension
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-mono uppercase font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Olfactory Friction
            </span>
          )}

          <span className="text-xs font-serif font-medium text-stone-200">
            {chordName}
          </span>
        </div>

        {/* Ratio Meter */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
          <span className="text-amber-300">{ratioAPercent}% A</span>
          <div className="w-16 h-1.5 bg-stone-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${ratioAPercent}%` }}
            />
            <div
              className="h-full bg-rose-400 transition-all duration-300"
              style={{ width: `${ratioBPercent}%` }}
            />
          </div>
          <span className="text-rose-300">{ratioBPercent}% B</span>
        </div>
      </div>
    </div>
  );
};
