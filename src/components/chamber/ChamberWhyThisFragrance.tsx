import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles, Wind, Clock, Compass, Activity, Binary, Layers } from 'lucide-react';
import { Fragrance, WeatherCondition, OlfactoryVector8D } from '../../types.js';
import { calculateWeatherAlignmentScore } from '../../services/weatherEngine.js';
import { ChamberAtmospherePalette } from './ChamberAtmosphere.js';

interface ChamberWhyThisFragranceProps {
  fragrance: Fragrance;
  weather?: WeatherCondition;
  vector8D: OlfactoryVector8D;
  palette: ChamberAtmospherePalette;
}

export const ChamberWhyThisFragrance: React.FC<ChamberWhyThisFragranceProps> = ({
  fragrance,
  weather,
  vector8D,
  palette
}) => {
  const [isOpenLevel4, setIsOpenLevel4] = useState<boolean>(true);
  const [isOpenScience, setIsOpenScience] = useState<boolean>(false);

  // Weather alignment calculation
  const weatherResonance = weather ? calculateWeatherAlignmentScore(fragrance, weather) : null;

  return (
    <div className="rounded-3xl bg-[#14100D]/90 border border-white/10 p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl shadow-xl space-y-4">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none -z-10"
        style={{ background: palette.pedestalGlow }}
      />

      {/* Main Header / Trigger */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Harmonic Intelligence &bull; Level 4 Rationale</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-medium mt-0.5">
            Why This Fragrance?
          </h4>
        </div>

        <button
          type="button"
          onClick={() => setIsOpenLevel4((prev) => !prev)}
          className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 transition cursor-pointer"
        >
          <motion.div animate={{ rotate: isOpenLevel4 ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* LEVEL 4: SENSORY & CLIMATIC DISCLOSURE */}
      <AnimatePresence>
        {isOpenLevel4 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-1"
          >
            {/* Primary Olfactory Character */}
            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-semibold block mb-1">
                Olfactory Character &amp; Emotional Texture
              </span>
              <p className="font-serif text-sm sm:text-base text-stone-100 italic leading-relaxed">
                “{fragrance.name} embodies the {fragrance.fragrance_family} archetype. With prominent{' '}
                {(fragrance.top_notes || []).slice(0, 2).join(' & ')} diffusing into deep{' '}
                {(fragrance.base_notes || []).slice(0, 2).join(' & ')}, it delivers a contemplative, luxurious presence.”
              </p>
            </div>

            {/* Environmental & Performance Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Climate Match */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-400 font-mono text-[10px] uppercase">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Climate Resonance</span>
                </div>
                <div className="text-stone-200 font-medium">
                  {weather ? `${weather.temperature_c}°C • ${weather.season}` : 'Temperate 24°C'}
                </div>
                <div className="text-[10px] text-stone-400">
                  {weatherResonance
                    ? `Match Score: ${weatherResonance.score}/100 • ${weatherResonance.advisory}`
                    : 'Balanced for day and evening warmth.'}
                </div>
              </div>

              {/* Longevity & Substantivity */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Longevity Rating</span>
                </div>
                <div className="text-stone-200 font-medium">
                  {fragrance.longevity_hours || 8} Hours on Skin
                </div>
                <div className="text-[10px] text-stone-400">
                  {fragrance.longevity || 'Long-Lasting'} substantivity with persistent base fixatives.
                </div>
              </div>

              {/* Sillage Projection */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px] uppercase">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Sillage &amp; Aura</span>
                </div>
                <div className="text-stone-200 font-medium capitalize">
                  {fragrance.projection || 'Moderate Radiance'}
                </div>
                <div className="text-[10px] text-stone-400">
                  Expansive first 2h, transitioning into an intimate skin veil.
                </div>
              </div>
            </div>

            {/* Occasion & Layering Affinity */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Optimal Occasions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(fragrance.occasion || ['Evening', 'Intimate', 'Ceremonial']).map((occ) => (
                    <span
                      key={occ}
                      className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] text-stone-300 font-mono"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Layering Partner Family:
                </span>
                <span className="text-amber-300 font-mono text-[11px] font-medium">
                  {fragrance.fragrance_family.includes('Floral') ? 'Woody Sandalwood / Musk' : 'Sparkling Citrus / Damask Rose'}
                </span>
              </div>
            </div>

            {/* LEVEL 5: SCIENTIFIC DISCLOSURE TOGGLE */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setIsOpenScience((prev) => !prev)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-mono text-stone-300 transition cursor-pointer"
                aria-expanded={isOpenScience}
              >
                <span className="flex items-center gap-2">
                  <Binary className="w-3.5 h-3.5 text-amber-400" />
                  <span>Level 5: Modelled Evaporation Principles &amp; 8D Vector Accords (Simulated)</span>
                </span>
                <motion.div animate={{ rotate: isOpenScience ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpenScience && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 p-4 rounded-xl bg-black/40 border border-amber-500/20 text-stone-300 font-mono text-xs space-y-2.5"
                  >
                    <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                      Modelled Volatility &amp; Evaporation Principles (Simulated)
                    </div>
                    <p className="text-[11px] leading-relaxed text-stone-400">
                      Computational Evaporation Model: Vaporization kinetics are computationally simulated using multi-component volatility indices. High vapor-pressure monoterpenes exhibit rapid early diffusion rates (0–45 min), while sesquiterpene alcohols and resinous fixatives maintain persistent skin substantivity over 8–12 hours.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-stone-500 block">Freshness Force:</span>
                        <span className="text-emerald-400 font-bold">{vector8D.freshness}%</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-stone-500 block">Resinous Force:</span>
                        <span className="text-amber-400 font-bold">{vector8D.warm_resinous_spices}%</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-stone-500 block">Woody Force:</span>
                        <span className="text-amber-500 font-bold">{vector8D.woody}%</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="text-stone-500 block">Fixative Force:</span>
                        <span className="text-teal-400 font-bold">{vector8D.longevity_fixative}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
