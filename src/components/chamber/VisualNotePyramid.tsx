import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Sparkles, Layers, Info, X, Clock, Wind, ArrowDown } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { ChamberAtmospherePalette } from './ChamberAtmosphere.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface VisualNotePyramidProps {
  fragrance: Fragrance;
  palette: ChamberAtmospherePalette;
}

interface NoteDetail {
  name: string;
  tier: 'top' | 'heart' | 'base';
  tierLabel: string;
  glyph: string;
  volatilityRate: string;
  boilingPoint: string;
  aromaProfile: string;
  fixativeRole: string;
}

// Intelligent dictionary for note sensory profiles
function getNoteDetail(name: string, tier: 'top' | 'heart' | 'base'): NoteDetail {
  const lower = name.toLowerCase();

  // Determine glyph
  let glyph = '🌿';
  if (/rose|flower|petal|jasmine|mogra|iris|violet|neroli|tuberose|ylang/i.test(lower)) glyph = '🌸';
  else if (/bergamot|lemon|citrus|orange|mandarin|grapefruit|lime/i.test(lower)) glyph = '🍋';
  else if (/sandalwood|chandan|cedar|wood|oud|agarwood|patchouli|vetiver|khus/i.test(lower)) glyph = '🪵';
  else if (/amber|resin|benzoin|frankincense|myrrh/i.test(lower)) glyph = '✨';
  else if (/cardamom|pepper|saffron|cinnamon|clove|ginger/i.test(lower)) glyph = '🌶️';
  else if (/musk|leather|civet|castoreum/i.test(lower)) glyph = '🦌';
  else if (/mitti|clay|earth|petrichor/i.test(lower)) glyph = '🏺';
  else if (/marine|sea|water|aquatic|salt|ozone/i.test(lower)) glyph = '🌊';
  else if (/vanilla|tonka|honey|sugar|cocoa/i.test(lower)) glyph = '🍯';

  if (tier === 'top') {
    return {
      name,
      tier,
      tierLabel: 'Top Volatiles (Opening Accord)',
      glyph,
      volatilityRate: 'High Flash (0 to 30 mins)',
      boilingPoint: '< 250°C (Low MW Terpenes)',
      aromaProfile: `Crisp, effervescent opening providing the initial olfactory impact upon skin application.`,
      fixativeRole: 'Diffuses rapidly into immediate headspace; creates initial lift and impression.'
    };
  }
  if (tier === 'heart') {
    return {
      name,
      tier,
      tierLabel: 'Heart / Middle Accord (Core Theme)',
      glyph,
      volatilityRate: 'Steady Isothermal (30 mins to 3 hours)',
      boilingPoint: '250°C – 320°C (Medium MW Esters & Alcohols)',
      aromaProfile: `The emotional signature of the fragrance, blossoming as top notes gently dissipate.`,
      fixativeRole: 'Forms the harmonious bridge between fleeting top terpenes and heavy base fixatives.'
    };
  }
  return {
    name,
    tier,
    tierLabel: 'Base Fixatives (Drydown Shadow)',
    glyph,
    volatilityRate: 'Persistent Substantivity (3 to 12+ hours)',
    boilingPoint: '> 320°C (High MW Sesquiterpenes & Musks)',
    aromaProfile: `Deep, grounding resins and noble woods anchoring the entire composition to skin lipids.`,
    fixativeRole: 'Reduces overall vapor pressure; prolongs the diffusion life of heart notes.'
  };
}

export const VisualNotePyramid: React.FC<VisualNotePyramidProps> = ({
  fragrance,
  palette
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedNote, setSelectedNote] = useState<NoteDetail | null>(null);

  const topNotes = fragrance.top_notes?.length ? fragrance.top_notes : ['Bergamot', 'Sparkling Terpenes'];
  const heartNotes = fragrance.middle_notes?.length ? fragrance.middle_notes : ['Damask Petals', 'Spiced Accord'];
  const baseNotes = fragrance.base_notes?.length ? fragrance.base_notes : ['Mysore Santal', 'Amber Resin', 'Musk'];

  return (
    <div className="rounded-3xl bg-[#14100D]/90 border border-white/10 p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl shadow-xl">
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-1/4 w-72 h-72 rounded-full blur-[90px] pointer-events-none -z-10"
        style={{ background: palette.pedestalGlow }}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>Volatile Kinetic Architecture</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-medium mt-0.5">
            Evolving Note Pyramid
          </h4>
        </div>
        <span className="text-[10px] font-mono text-stone-400 hidden sm:inline-block">
          Tap any note to inspect
        </span>
      </div>

      {/* PYRAMID TIER CONTAINERS WITH TIME-PRESSURE EVOLUTION */}
      <div className="space-y-4">
        {/* TIER 1: TOP VOLATILES */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/20 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-xs uppercase font-bold text-amber-200 tracking-wider">
                Top Volatiles &bull; Fast Opening (0m – 30m)
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300/80">
              Vapor Flash: &lt; 250°C
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {topNotes.map((note) => {
              const detail = getNoteDetail(note, 'top');
              return (
                <motion.button
                  key={note}
                  type="button"
                  whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  onClick={() => setSelectedNote(detail)}
                  className="px-3.5 py-1.5 rounded-full bg-[#201912]/80 hover:bg-[#2A2118] border border-amber-400/40 text-xs text-amber-100 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <span className="text-sm">{detail.glyph}</span>
                  <span className="font-medium">{note}</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Transition Connector */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="p-1 rounded-full bg-[#181310] border border-white/10 text-stone-400">
            <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        {/* TIER 2: HEART ACCORD */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-400/5 to-transparent border border-rose-400/20 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-mono text-xs uppercase font-bold text-rose-200 tracking-wider">
                Heart Accord &bull; Core Diffusion (30m – 3h)
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-300/80">
              Isothermal Core: 250°C – 320°C
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {heartNotes.map((note) => {
              const detail = getNoteDetail(note, 'heart');
              return (
                <motion.button
                  key={note}
                  type="button"
                  whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  onClick={() => setSelectedNote(detail)}
                  className="px-3.5 py-1.5 rounded-full bg-[#201519]/80 hover:bg-[#2B1B22] border border-rose-400/40 text-xs text-rose-100 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <span className="text-sm">{detail.glyph}</span>
                  <span className="font-medium">{note}</span>
                  <span className="w-1 h-1 rounded-full bg-rose-400" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Transition Connector */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="p-1 rounded-full bg-[#181310] border border-white/10 text-stone-400">
            <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        {/* TIER 3: BASE FIXATIVES */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-700/15 via-amber-900/10 to-transparent border border-amber-600/25 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="font-mono text-xs uppercase font-bold text-amber-300 tracking-wider">
                Base Fixatives &bull; Drydown Shadow (3h – 12h+)
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400/80">
              Macromolecules: &gt; 320°C
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {baseNotes.map((note) => {
              const detail = getNoteDetail(note, 'base');
              return (
                <motion.button
                  key={note}
                  type="button"
                  whileHover={reducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  onClick={() => setSelectedNote(detail)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1F1810]/90 hover:bg-[#2D2115] border border-amber-600/40 text-xs text-amber-200 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <span className="text-sm">{detail.glyph}</span>
                  <span className="font-medium">{note}</span>
                  <span className="w-1 h-1 rounded-full bg-amber-500" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* INTERACTIVE NOTE INSPECTOR POPOVER MODAL */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-4 p-4 rounded-2xl bg-[#1B1612] border border-amber-500/30 text-stone-200 text-xs space-y-3 relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelectedNote(null)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-100 hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <span className="text-2xl p-2 rounded-xl bg-white/[0.06] border border-white/10">
                {selectedNote.glyph}
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  {selectedNote.tierLabel}
                </span>
                <h5 className="font-serif text-lg font-medium text-stone-100">
                  {selectedNote.name}
                </h5>
              </div>
            </div>

            <p className="text-stone-300 leading-relaxed text-xs">
              {selectedNote.aromaProfile}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-stone-500 block text-[9px] uppercase">Lifespan &amp; Evaporation:</span>
                <span className="text-amber-300 font-semibold">{selectedNote.volatilityRate}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-stone-500 block text-[9px] uppercase">Thermodynamic Range:</span>
                <span className="text-stone-300">{selectedNote.boilingPoint}</span>
              </div>
            </div>

            <div className="text-[10px] text-stone-400 italic">
              &bull; {selectedNote.fixativeRole}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
