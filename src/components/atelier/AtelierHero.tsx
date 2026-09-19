import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CloudSun,
  FlaskConical,
  Compass,
  Check,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { ScentFamilyAtmosphere } from '../AtmosphericFragranceCanvas.js';
import { HeroFlacon } from './HeroFlacon.js';
import { AtmosphereSelector } from './AtmosphereSelector.js';

interface AtelierHeroProps {
  scentOfTheDay: Fragrance;
  scentOfTheDayScore: number;
  scentOfTheDayAdvisory: string;
  partnerFrag?: Fragrance;
  weather: WeatherCondition;
  currentAtmosphere: ScentFamilyAtmosphere;
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  onOpenWeatherModal: () => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onWearToday?: (frag: Fragrance, partner?: Fragrance) => void;
  onOpenWhatShouldIWear: () => void;
  onNavigate: (tab: any) => void;
}

export const AtelierHero: React.FC<AtelierHeroProps> = ({
  scentOfTheDay,
  scentOfTheDayScore,
  scentOfTheDayAdvisory,
  partnerFrag,
  weather,
  currentAtmosphere,
  onSetAtmosphere,
  onOpenWeatherModal,
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onWearToday,
  onOpenWhatShouldIWear,
  onNavigate
}) => {
  const [wornSuccess, setWornSuccess] = useState(false);

  const handleWearClick = () => {
    if (scentOfTheDay) {
      onWearToday?.(scentOfTheDay, partnerFrag);
      setWornSuccess(true);
      setTimeout(() => setWornSuccess(false), 3500);
    }
  };

  const weatherLine = `${weather.temperature_c}°C · ${weather.humidity_pct}% Humidity · ${weather.season} ${weather.time_of_day}`;

  return (
    <section className="relative pt-6 pb-14 sm:pb-20 flex flex-col items-center text-center overflow-visible">
      {/* =========================================================================
          BACKGROUND DEPTH: LAYER 2 & LAYER 4 (WARM ENVIRONMENTAL GRADIENTS & VAPOR)
          ========================================================================= */}
      {/* Soft Environmental Amber-Rose Radiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[750px] h-[520px] sm:h-[750px] bg-gradient-to-b from-amber-200/20 via-rose-100/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Slow Secondary Vapor Movement */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.55, 0.3],
          x: [-15, 15, -15]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] bg-amber-400/8 rounded-[48%_52%_60%_40%/50%_45%_55%_50%] blur-[90px] pointer-events-none -z-10"
      />

      {/* =========================================================================
          CEREMONIAL GREETING & METEOROLOGICAL CONTEXT
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-3xl px-4"
      >
        {/* Weather Calibration Pill */}
        <button
          type="button"
          onClick={onOpenWeatherModal}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#E8DFD3] hover:border-amber-300 text-xs text-[#5A5046] hover:text-[#1A1613] transition-all cursor-pointer shadow-2xs backdrop-blur-md mb-5"
          title="Recalibrate atmospheric climate and volatility factors"
        >
          <CloudSun className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="font-mono text-[11px] tracking-tight">{weatherLine}</span>
          <span className="text-[10px] text-amber-800 font-semibold underline underline-offset-2 opacity-85 group-hover:opacity-100">
            Recalibrate
          </span>
        </button>

        {/* Ceremonial Greeting (Cinzel Eyebrow) */}
        <span className="font-brand text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8A7E74] font-medium mb-1">
          Good {weather.time_of_day}, Alchemist.
        </span>

        {/* Main Display Headline (Cormorant Garamond) */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1A1613] leading-tight mt-1 max-w-2xl">
          &ldquo;What does the atmosphere call for today?&rdquo;
        </h1>
      </motion.div>

      {/* =========================================================================
          THE HERO PROTAGONIST FLACON
          ========================================================================= */}
      <div className="my-6 sm:my-10 flex flex-col items-center relative z-20">
        {scentOfTheDay && (
          <HeroFlacon
            fragrance={scentOfTheDay}
            atmosphere={currentAtmosphere}
            size="hero"
            onClick={() => onSelectFragranceForChamber(scentOfTheDay)}
          />
        )}
      </div>

      {/* =========================================================================
          ATMOSPHERIC FIT SCORE & EDITORIAL ADVISORY
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-xl px-4 z-20"
      >
        {/* Large Cormorant Score (Editorial typography, not generic gauge) */}
        <div className="flex flex-col items-center">
          <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#1A1613] tracking-tight leading-none">
            {scentOfTheDayScore}%
          </span>
          <span className="font-brand text-[11px] sm:text-xs uppercase tracking-[0.22em] text-amber-800 font-semibold mt-1.5">
            Atmospheric Fit
          </span>
        </div>

        {/* Poetic Advisory Inscription */}
        <p className="font-serif italic text-base sm:text-lg text-[#5A5046] mt-3 max-w-md leading-relaxed text-center">
          {scentOfTheDayAdvisory
            ? `\u201C${scentOfTheDayAdvisory}\u201D`
            : "\u201CExceptional alignment with today\u2019s atmosphere \u2014 releasing luminous top notes into the climate with graceful sillage.\u201D"}
        </p>

        {/* Note Pyramid Highlights */}
        {scentOfTheDay && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3.5">
            {(scentOfTheDay.top_notes || []).slice(0, 2).map((n) => (
              <span
                key={n}
                className="px-2.5 py-0.5 rounded-full bg-white/80 border border-[#E8DFD3] text-[11px] font-sans text-[#3D352E] shadow-2xs"
              >
                {n}
              </span>
            ))}
            {(scentOfTheDay.middle_notes || []).slice(0, 1).map((n) => (
              <span
                key={n}
                className="px-2.5 py-0.5 rounded-full bg-rose-50/80 border border-rose-200/80 text-[11px] font-sans text-rose-900 shadow-2xs"
              >
                {n}
              </span>
            ))}
            {(scentOfTheDay.base_notes || []).slice(0, 2).map((n) => (
              <span
                key={n}
                className="px-2.5 py-0.5 rounded-full bg-amber-50/90 border border-amber-200/80 text-[11px] font-sans text-amber-900 shadow-2xs"
              >
                {n}
              </span>
            ))}
          </div>
        )}

        {/* =========================================================================
            PRIMARY CTA: LUXURY PHYSICAL CONTROL (WEAR THIS TODAY)
            ========================================================================= */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            type="button"
            onClick={handleWearClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-white cursor-pointer transition-all duration-300 flex items-center justify-center gap-2.5 select-none hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 60%, #92400E 100%)',
              boxShadow: '0 12px 30px -4px rgba(180, 83, 9, 0.38), inset 0 1px 1.5px rgba(255, 255, 255, 0.45)'
            }}
          >
            {wornSuccess ? (
              <>
                <Check className="w-4 h-4 text-amber-200" />
                <span>Ritual Applied</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Wear This Today</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenWhatShouldIWear}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full text-xs font-medium tracking-normal text-[#2E2620] bg-white/80 hover:bg-white border border-[#E3DACB] hover:border-amber-300 transition-all cursor-pointer shadow-2xs backdrop-blur-md"
          >
            <span>Consult Atelier Advisor</span>
          </button>
        </div>

        {/* =========================================================================
            SECONDARY ACTIONS: QUIET, UNDERSTATED EDITORIAL LINKS
            ========================================================================= */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7A6F66]">
          {scentOfTheDay && (
            <button
              type="button"
              onClick={() => onSelectFragranceForChamber(scentOfTheDay)}
              className="group inline-flex items-center gap-1.5 hover:text-[#1A1613] transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-700/80 group-hover:text-amber-800" />
              <span className="underline decoration-[#E3DACB] underline-offset-4 group-hover:decoration-[#1A1613]">
                Inspect in Fragrance Chamber
              </span>
            </button>
          )}

          {partnerFrag && (
            <button
              type="button"
              onClick={() => onSendToLaboratory(scentOfTheDay, partnerFrag)}
              className="group inline-flex items-center gap-1.5 hover:text-[#1A1613] transition cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-700/80 group-hover:text-amber-800" />
              <span className="underline decoration-[#E3DACB] underline-offset-4 group-hover:decoration-[#1A1613]">
                Pair with {partnerFrag.name}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onNavigate('layer')}
            className="group inline-flex items-center gap-1.5 hover:text-[#1A1613] transition cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-teal-700/80 group-hover:text-teal-800" />
            <span className="underline decoration-[#E3DACB] underline-offset-4 group-hover:decoration-[#1A1613]">
              Enter Laboratory
            </span>
          </button>
        </div>
      </motion.div>

      {/* =========================================================================
          ATMOSPHERE SELECTOR (TACTILE CONTROLS)
          ========================================================================= */}
      <div className="w-full max-w-3xl mt-12 pt-6 border-t border-[#E8DFD3]/70 px-4">
        <AtmosphereSelector
          currentAtmosphere={currentAtmosphere}
          onSetAtmosphere={onSetAtmosphere}
        />
      </div>
    </section>
  );
};
