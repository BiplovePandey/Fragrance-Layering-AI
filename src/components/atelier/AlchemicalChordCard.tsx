import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical, ArrowRight, Sparkles } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { HeroFlacon } from './HeroFlacon.js';
import { GlassSurface } from '../ui/GlassSurface.js';

interface AlchemicalChordCardProps {
  baseFragrance: Fragrance;
  sparkFragrance: Fragrance;
  harmonyScore?: number;
  chordTitle?: string;
  chordDescription?: string;
  applicationRitual?: string;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
}

export const AlchemicalChordCard: React.FC<AlchemicalChordCardProps> = ({
  baseFragrance,
  sparkFragrance,
  harmonyScore = 96,
  chordTitle = 'Chypre Petrichor & Smoked Wood',
  chordDescription = 'Harmonic fusion of Indian alluvial petrichor with high-altitude vetiver roots and sparkling citrus aldehydes.',
  applicationRitual = 'Application ritual: 1 spray base to chest; 2 sprays spark to collarbone. Allow 45 seconds to dock before blending.',
  onSendToLaboratory,
  onSelectFragranceForChamber
}) => {
  return (
    <section className="relative my-8 py-2">
      {/* Background Soft Atmospheric Ambient Diffusion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[380px] bg-gradient-to-r from-amber-400/8 via-rose-300/8 to-amber-500/8 rounded-full blur-[90px] pointer-events-none -z-10" />

      <GlassSurface
        surface="atelier"
        radius="luxury"
        className="p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8DFD3]/75 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-mono mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>CHAPTER II &bull; THE DAY'S ACCORD</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#1A1613] tracking-tight">
              Today's Alchemical Chord
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5046] mt-1 max-w-xl leading-relaxed">
              {chordDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSendToLaboratory(baseFragrance, sparkFragrance)}
            className="self-start sm:self-center px-4 py-2 rounded-full text-xs font-medium text-[#2E2620] bg-white hover:bg-[#FAF7F2] border border-[#E3DACB] hover:border-amber-300 transition-all cursor-pointer shadow-2xs flex items-center gap-2 group"
          >
            <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
            <span>Simulate in Laboratory</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-800 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* =========================================================================
            THE TWO FLACONS & CONVERGING PERFUME VAPOR BRIDGE
            ========================================================================= */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10 relative">
          {/* Base Anchor Flacon */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col items-center text-center max-w-xs z-10"
          >
            <span className="font-brand text-[10px] uppercase tracking-[0.2em] text-[#7A6F66] mb-2 font-semibold">
              Base Anchor &bull; Skin Affinity
            </span>
            <HeroFlacon
              fragrance={baseFragrance}
              size="chord"
              onClick={() => onSelectFragranceForChamber(baseFragrance)}
            />
            <h3 className="font-serif text-lg font-medium text-[#1A1613] mt-2">
              {baseFragrance.name}
            </h3>
            <span className="text-xs text-amber-800 font-sans font-medium">
              by {baseFragrance.brand}
            </span>
            <p className="text-xs text-[#5A5046] mt-1 line-clamp-2">
              Alluvial heartwood foundation fixing volatile molecules for 9+ hours.
            </p>
          </motion.div>

          {/* =========================================================================
              THE PERFUME VAPOR CONVERGENCE BRIDGE (TWO VAPORS MERGING INTO 96%)
              ========================================================================= */}
          <div className="flex flex-col items-center justify-center shrink-0 px-2 sm:px-6 py-4 relative z-0">
            {/* Desktop Vapor Stream Lines & Floating Vapor Mist */}
            <div className="hidden md:flex items-center justify-center relative w-48 sm:w-56 h-28">
              {/* Left Vapor Stream from Base Flacon */}
              <motion.div
                animate={{
                  opacity: [0.35, 0.65, 0.35],
                  scaleX: [0.95, 1.05, 0.95]
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 w-24 h-12 rounded-full pointer-events-none blur-md"
                style={{
                  background: 'linear-gradient(90deg, rgba(217, 119, 6, 0.25) 0%, rgba(245, 158, 11, 0.45) 100%)'
                }}
              />

              {/* Right Vapor Stream from Spark Flacon */}
              <motion.div
                animate={{
                  opacity: [0.35, 0.65, 0.35],
                  scaleX: [0.95, 1.05, 0.95]
                }}
                transition={{ duration: 4.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-0 w-24 h-12 rounded-full pointer-events-none blur-md"
                style={{
                  background: 'linear-gradient(270deg, rgba(251, 113, 133, 0.25) 0%, rgba(245, 158, 11, 0.45) 100%)'
                }}
              />

              {/* Luminous Central Convergence Zone (Vapor Fusion) */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.65, 0.95, 0.65]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full pointer-events-none blur-lg"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 158, 11, 0.40) 0%, rgba(251, 191, 36, 0.25) 45%, transparent 75%)'
                }}
              />

              {/* Center Convergence Orb with Cormorant Harmony Score */}
              <div className="relative z-10 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/85 border border-[#E8DFD3] shadow-xs backdrop-blur-md">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1613] tracking-tight leading-none">
                  {harmonyScore}%
                </span>
                <span className="font-brand text-[9px] uppercase tracking-[0.2em] text-amber-800 font-semibold mt-1">
                  Harmonic Synergy
                </span>
              </div>
            </div>

            {/* Mobile Convergence Indicator */}
            <div className="md:hidden flex flex-col items-center justify-center p-3 rounded-2xl bg-white/90 border border-[#E8DFD3] shadow-xs my-2">
              <span className="font-serif text-3xl font-normal text-[#1A1613]">
                {harmonyScore}%
              </span>
              <span className="font-brand text-[9px] uppercase tracking-[0.2em] text-amber-800 font-semibold mt-0.5">
                Harmonic Synergy
              </span>
            </div>
          </div>

          {/* Diffusion Spark Flacon */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col items-center text-center max-w-xs z-10"
          >
            <span className="font-brand text-[10px] uppercase tracking-[0.2em] text-[#7A6F66] mb-2 font-semibold">
              Diffusion Spark &bull; Sillage Envelope
            </span>
            <HeroFlacon
              fragrance={sparkFragrance}
              size="chord"
              onClick={() => onSelectFragranceForChamber(sparkFragrance)}
            />
            <h3 className="font-serif text-lg font-medium text-[#1A1613] mt-2">
              {sparkFragrance.name}
            </h3>
            <span className="text-xs text-rose-800 font-sans font-medium">
              by {sparkFragrance.brand}
            </span>
            <p className="text-xs text-[#5A5046] mt-1 line-clamp-2">
              High-volatility radiance radiating delicate floral-citrus molecules into the air.
            </p>
          </motion.div>
        </div>

        {/* Application Ritual Footnote */}
        <div className="pt-4 border-t border-[#E8DFD3]/80 flex items-center justify-center text-center">
          <p className="font-serif italic text-xs sm:text-sm text-[#7A6F66] max-w-lg">
            &ldquo;{applicationRitual}&rdquo;
          </p>
        </div>
      </GlassSurface>
    </section>
  );
};
