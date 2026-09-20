import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CloudSun,
  FlaskConical,
  Compass,
  Check,
  Eye,
  Shuffle,
  ChevronDown,
  HelpCircle,
  Binary,
  Wind,
  Clock,
  Droplets,
  Layers,
  ThermometerSun,
  Activity
} from 'lucide-react';
import { Fragrance, WeatherCondition, OlfactoryVector8D } from '../../types.js';
import { ScentFamilyAtmosphere } from '../AtmosphericFragranceCanvas.js';
import { HeroFlacon } from './HeroFlacon.js';
import { AtmosphereSelector } from './AtmosphereSelector.js';
import { ScentMist } from '../ui/ScentMist.js';
import { extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { accordionVariants } from '../../motion/variants.js';
import { getFragranceFamilyTokens } from '../../utils/fragrancePalette.js';

export interface AtelierHeroProps {
  scentOfTheDay: Fragrance;
  scentOfTheDayScore: number;
  scentOfTheDayAdvisory: string;
  partnerFrag?: Fragrance;
  weather: WeatherCondition;
  currentAtmosphere: ScentFamilyAtmosphere;
  allFragrances?: Fragrance[];
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  onOpenWeatherModal: () => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onWearToday?: (frag: Fragrance, partner?: Fragrance) => void;
  onOpenWhatShouldIWear: () => void;
  onNavigate: (tab: any) => void;
  onSurpriseSelect?: (frag: Fragrance) => void;
}

// Atmospheric styling palette mapped to fragrance family and climate
const ATMOSPHERE_PALETTE: Record<string, {
  ambientGlow: string;
  mistColor: string;
  accentAmber: string;
  pillBg: string;
  pillText: string;
}> = {
  rose: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(251, 113, 133, 0.18) 0%, rgba(254, 205, 211, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(251, 113, 133, 0.28)',
    accentAmber: '#E11D48',
    pillBg: 'bg-rose-100/90 border-rose-300/80',
    pillText: 'text-rose-950'
  },
  oud: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(180, 83, 9, 0.22) 0%, rgba(217, 119, 6, 0.12) 45%, transparent 75%)',
    mistColor: 'rgba(180, 83, 9, 0.32)',
    accentAmber: '#B45309',
    pillBg: 'bg-amber-100/90 border-amber-300/80',
    pillText: 'text-amber-950'
  },
  citrus: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(245, 158, 11, 0.20) 0%, rgba(252, 211, 77, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(245, 158, 11, 0.26)',
    accentAmber: '#D97706',
    pillBg: 'bg-amber-100/90 border-amber-300/80',
    pillText: 'text-amber-950'
  },
  earthy: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(194, 65, 12, 0.20) 0%, rgba(234, 88, 12, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(194, 65, 12, 0.28)',
    accentAmber: '#C2410C',
    pillBg: 'bg-orange-100/90 border-orange-300/80',
    pillText: 'text-orange-950'
  },
  aquatic: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(14, 165, 233, 0.18) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)',
    mistColor: 'rgba(14, 165, 233, 0.25)',
    accentAmber: '#0284C7',
    pillBg: 'bg-sky-100/90 border-sky-300/80',
    pillText: 'text-sky-950'
  },
  woody: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(202, 138, 4, 0.20) 0%, rgba(253, 230, 138, 0.10) 45%, transparent 75%)',
    mistColor: 'rgba(202, 138, 4, 0.28)',
    accentAmber: '#A16207',
    pillBg: 'bg-amber-100/90 border-amber-300/80',
    pillText: 'text-amber-950'
  },
  default: {
    ambientGlow: 'radial-gradient(ellipse at 50% 35%, rgba(217, 119, 6, 0.18) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 75%)',
    mistColor: 'rgba(217, 119, 6, 0.28)',
    accentAmber: '#B45309',
    pillBg: 'bg-amber-100/90 border-amber-300/80',
    pillText: 'text-amber-950'
  }
};

export const AtelierHero: React.FC<AtelierHeroProps> = ({
  scentOfTheDay,
  scentOfTheDayScore,
  scentOfTheDayAdvisory,
  partnerFrag,
  weather,
  currentAtmosphere,
  allFragrances = [],
  onSetAtmosphere,
  onOpenWeatherModal,
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onWearToday,
  onOpenWhatShouldIWear,
  onNavigate,
  onSurpriseSelect
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [wornSuccess, setWornSuccess] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showWhyThisScent, setShowWhyThisScent] = useState(false);
  const [showScienceLevel5, setShowScienceLevel5] = useState(false);

  // Derive 8D vector of current hero protagonist
  const vector8D: OlfactoryVector8D = extractFragranceVector8D(scentOfTheDay);

  // Derive palette for active atmosphere using centralized fragrance tokens
  const familyTokens = getFragranceFamilyTokens(
    currentAtmosphere || scentOfTheDay?.fragrance_family,
    scentOfTheDay?.name,
    [...(scentOfTheDay?.top_notes || []), ...(scentOfTheDay?.middle_notes || []), ...(scentOfTheDay?.base_notes || [])]
  );
  const palette = {
    ambientGlow: familyTokens.ambientGlow,
    mistColor: familyTokens.mistColor,
    accentAmber: familyTokens.accentAmber,
    pillBg: familyTokens.badgeBg,
    pillText: familyTokens.badgeText
  };

  // Weather overlay adjustment
  const isRainy = weather.condition.toLowerCase().includes('rain') || weather.condition.toLowerCase().includes('monsoon') || weather.humidity_pct > 75;
  const isSunny = weather.condition.toLowerCase().includes('sun') || weather.condition.toLowerCase().includes('clear');
  const isCool = weather.temperature_c < 22;

  // Handle Apply Wear Ritual
  const handleWearClick = () => {
    if (scentOfTheDay) {
      onWearToday?.(scentOfTheDay, partnerFrag);
      ambientAudioEngine.playSpatialChord([440, 554, 659]);
      setWornSuccess(true);
      setTimeout(() => setWornSuccess(false), 3500);
    }
  };

  // Handle Signature Surprise Me Interaction
  const handleSurpriseClick = () => {
    if (!allFragrances.length) return;

    // 1. Play spatial alchemical harmonic chime
    ambientAudioEngine.playSpatialChord([528, 660, 792]);

    // 2. Trigger brief cinematic reveal veil
    setIsRevealing(true);

    // 3. Pick a surprising, serendipitous fragrance
    const candidateList = allFragrances.filter((f) => f.id !== scentOfTheDay?.id);
    const chosen = candidateList.length
      ? candidateList[Math.floor(Math.random() * candidateList.length)]
      : allFragrances[0];

    // 4. Update atmosphere if fragrance family corresponds
    const familyLower = chosen.fragrance_family?.toLowerCase() || '';
    if (familyLower.includes('rose') || familyLower.includes('floral')) {
      onSetAtmosphere('rose');
    } else if (familyLower.includes('oud') || familyLower.includes('oriental')) {
      onSetAtmosphere('oud');
    } else if (familyLower.includes('citrus') || familyLower.includes('fresh')) {
      onSetAtmosphere('citrus');
    } else if (familyLower.includes('earth') || familyLower.includes('mitti')) {
      onSetAtmosphere('earthy');
    } else if (familyLower.includes('water') || familyLower.includes('aquatic') || familyLower.includes('marine')) {
      onSetAtmosphere('aquatic');
    } else if (familyLower.includes('wood') || familyLower.includes('sandal')) {
      onSetAtmosphere('woody');
    }

    setTimeout(() => {
      onSurpriseSelect?.(chosen);
      setIsRevealing(false);
    }, 450);
  };

  const weatherLine = `${weather.temperature_c}°C · ${weather.humidity_pct}% Humidity · ${weather.season} ${weather.time_of_day}`;

  return (
    <section className="relative pt-6 pb-12 sm:pb-16 flex flex-col items-center text-center overflow-visible select-none">
      {/* =========================================================================
          ATMOSPHERIC CANVAS & LIGHTING LAYERS
          ========================================================================= */}
      {/* Dynamic Background Glow based on Selected Fragrance & Atmosphere */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] sm:w-[860px] h-[580px] sm:h-[860px] rounded-full blur-[110px] pointer-events-none -z-10 transition-all duration-1000"
        style={{
          background: palette.ambientGlow
        }}
      />

      {/* Climate-Specific Lighting Overlays */}
      {isRainy && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal-500/8 rounded-full blur-[100px] pointer-events-none -z-10" />
      )}
      {isSunny && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      )}
      {isCool && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-amber-700/8 rounded-full blur-[90px] pointer-events-none -z-10" />
      )}

      {/* Controlled Organic Ambient Vapor Drift */}
      {!reducedMotion && (
        <motion.div
          animate={{
            scale: [1, 1.07, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [-12, 12, -12]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[680px] h-[450px] sm:h-[680px] rounded-[48%_52%_60%_40%/50%_45%_55%_50%] blur-[95px] pointer-events-none -z-10 transition-colors duration-1000"
          style={{
            backgroundColor: palette.mistColor
          }}
        />
      )}

      {/* =========================================================================
          CEREMONIAL GREETING & METEOROLOGICAL CONTEXT
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-3xl px-4 z-10"
      >
        {/* Weather Calibration Pill */}
        <button
          type="button"
          onClick={onOpenWeatherModal}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#E8DFD3] hover:border-amber-300 text-xs text-[#5A5046] hover:text-[#1A1613] transition-all cursor-pointer shadow-2xs backdrop-blur-md mb-4"
          title="Recalibrate atmospheric climate and volatility factors"
        >
          <CloudSun className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="font-mono text-[11px] tracking-tight">{weatherLine}</span>
          <span className="text-[10px] text-amber-800 font-semibold underline underline-offset-2 opacity-85 group-hover:opacity-100">
            Recalibrate
          </span>
        </button>

        {/* Ceremonial Greeting */}
        <span className="font-brand text-xs sm:text-sm uppercase tracking-[0.25em] text-[#8A7E74] font-medium mb-1">
          Good {weather.time_of_day}, Alchemist.
        </span>

        {/* Display Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#1A1613] leading-tight mt-1 max-w-2xl">
          &ldquo;What does the atmosphere call for today?&rdquo;
        </h1>
      </motion.div>

      {/* =========================================================================
          THE HERO PROTAGONIST FLACON (CINEMATIC FOCAL POINT)
          ========================================================================= */}
      <div className="my-6 sm:my-9 flex flex-col items-center relative z-20">
        <AnimatePresence mode="wait">
          {isRevealing ? (
            <motion.div
              key="reveal-veil"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35 }}
              className="w-56 h-80 sm:w-72 sm:h-96 flex flex-col items-center justify-center relative"
            >
              <ScentMist color={palette.mistColor} density="rich" />
              <div className="p-4 rounded-full bg-white/80 backdrop-blur-md border border-amber-300/80 shadow-md flex items-center gap-2 text-amber-900 font-mono text-xs animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Alchemical Distillation...</span>
              </div>
            </motion.div>
          ) : (
            scentOfTheDay && (
              <motion.div
                key={scentOfTheDay.id}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <HeroFlacon
                  fragrance={scentOfTheDay}
                  atmosphere={currentAtmosphere}
                  vector8D={vector8D}
                  size="hero"
                  onClick={() => onSelectFragranceForChamber(scentOfTheDay)}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          ATMOSPHERIC FIT SCORE & SENSORY IDENTITY
          ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-xl px-4 z-20"
      >
        {/* Large Cormorant Score */}
        <div className="flex flex-col items-center">
          <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[#1A1613] tracking-tight leading-none">
            {scentOfTheDayScore}%
          </span>
          <span className="font-brand text-[11px] sm:text-xs uppercase tracking-[0.22em] text-amber-800 font-semibold mt-1.5">
            Atmospheric Harmony
          </span>
        </div>

        {/* Fragrance Name & Brand Headline */}
        <div className="mt-3 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1613] font-medium tracking-tight">
            {scentOfTheDay?.name}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7A6F66]">
              by {scentOfTheDay?.brand}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C8BEB0]" />
            <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#E8DFD3] text-[10px] font-mono font-medium text-amber-900 shadow-2xs">
              {scentOfTheDay?.concentration || 'Fine Parfum'}
            </span>
          </div>
        </div>

        {/* Poetic Advisory Inscription */}
        <p className="font-serif italic text-base sm:text-lg text-[#5A5046] mt-3 max-w-md leading-relaxed text-center">
          {scentOfTheDayAdvisory
            ? `\u201C${scentOfTheDayAdvisory}\u201D`
            : '\u201CExceptional alignment with today\u2019s atmosphere \u2014 releasing luminous top notes into the climate with graceful sillage.\u201D'}
        </p>

        {/* Note Pyramid Highlights */}
        {scentOfTheDay && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3.5">
            {(scentOfTheDay.top_notes || []).slice(0, 2).map((n) => (
              <span
                key={n}
                className="px-2.5 py-0.5 rounded-full bg-white/85 border border-[#E8DFD3] text-[11px] font-sans text-[#3D352E] shadow-2xs"
              >
                🌿 {n}
              </span>
            ))}
            {(scentOfTheDay.middle_notes || []).slice(0, 1).map((n) => (
              <span
                key={n}
                className="px-2.5 py-0.5 rounded-full bg-rose-50/85 border border-rose-200/80 text-[11px] font-sans text-rose-900 shadow-2xs"
              >
                🌸 {n}
              </span>
            ))}
            {(scentOfTheDay.base_notes || []).slice(0, 2).map((n) => (
              <span
                key={n}
                className="px-2.5 py-0.5 rounded-full bg-amber-50/90 border border-amber-200/80 text-[11px] font-sans text-amber-900 shadow-2xs"
              >
                🪵 {n}
              </span>
            ))}
          </div>
        )}

        {/* =========================================================================
            ACTIONS HIERARCHY: DISCOVER (PRIMARY) & SURPRISE ME (SIGNATURE)
            ========================================================================= */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          {/* Primary Action: Discover My Scent (opens personalized advisor) */}
          <button
            type="button"
            onClick={onOpenWhatShouldIWear}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase text-white cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 select-none hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: 'linear-gradient(135deg, #D97706 0%, #B45309 60%, #92400E 100%)',
              boxShadow: '0 10px 25px -4px rgba(180, 83, 9, 0.38), inset 0 1px 1.5px rgba(255, 255, 255, 0.45)'
            }}
          >
            <Compass className="w-4 h-4 text-amber-200" />
            <span>Discover My Scent</span>
          </button>

          {/* Secondary Action: Surprise Me (instant alchemical serendipity in the Atelier) */}
          <button
            type="button"
            onClick={handleSurpriseClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-normal text-[#2E2620] bg-white/85 hover:bg-white border border-[#E3DACB] hover:border-amber-400 transition-all cursor-pointer shadow-2xs backdrop-blur-md flex items-center justify-center gap-2 group hover:-translate-y-0.5 active:translate-y-0"
          >
            <Shuffle className="w-4 h-4 text-amber-700 group-hover:rotate-180 transition-transform duration-500" />
            <span>Surprise Me</span>
          </button>

          {/* Direct Wear Ritual Button */}
          <button
            type="button"
            onClick={handleWearClick}
            className={`w-full sm:w-auto px-5 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 border shadow-2xs ${
              wornSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-stone-50/90 hover:bg-stone-100 border-[#DCD4C8] text-[#3D352E]'
            }`}
          >
            {wornSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ritual Applied</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Wear Today</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-[#7A6F66]">
          {scentOfTheDay && (
            <button
              type="button"
              onClick={() => onSelectFragranceForChamber(scentOfTheDay)}
              className="group inline-flex items-center gap-1.5 hover:text-[#1A1613] transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-amber-700/80 group-hover:text-amber-800" />
              <span className="underline decoration-[#E3DACB] underline-offset-4 group-hover:decoration-[#1A1613]">
                Inspect in Chamber
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

        {/* =========================================================================
            PROGRESSIVE DISCLOSURE: WHY THIS SCENT? (LEVEL 4 & LEVEL 5)
            ========================================================================= */}
        <div className="w-full max-w-lg mt-6 text-left">
          <button
            type="button"
            onClick={() => setShowWhyThisScent((prev) => !prev)}
            className="group flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-[#5A5046] hover:text-[#1A1613] transition-all cursor-pointer select-none text-xs font-medium"
            aria-expanded={showWhyThisScent}
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 transition-transform group-hover:scale-110" />
              <span>Why this scent for today?</span>
            </span>
            <motion.span
              animate={{ rotate: showWhyThisScent ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {showWhyThisScent && (
              <motion.div
                variants={reducedMotion ? undefined : accordionVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="overflow-hidden"
              >
                <div className="p-4 sm:p-5 mt-2 rounded-2xl bg-white/85 backdrop-blur-md border border-[#DCD4C8] shadow-xs space-y-4 text-xs text-[#5A5046]">
                  {/* LEVEL 4: INTELLIGENCE */}
                  <div>
                    <span className="font-semibold text-amber-900 block mb-1 text-[11px] uppercase tracking-wider">
                      Atmospheric Resonance
                    </span>
                    <p className="leading-relaxed italic font-serif text-stone-700">
                      &ldquo;{scentOfTheDayAdvisory || `${scentOfTheDay?.name} delivers optimal molecular performance under current temperature (${weather.temperature_c}°C) and relative humidity (${weather.humidity_pct}%).`}&rdquo;
                    </p>
                  </div>

                  {/* Context Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                      <ThermometerSun className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase font-semibold">Climate Match</span>
                        <span className="font-medium text-stone-800">
                          {weather.temperature_c}°C &bull; {weather.season}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase font-semibold">Skin Longevity</span>
                        <span className="font-medium text-stone-800">
                          {scentOfTheDay?.longevity_hours || 8}+ Hours
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                      <Wind className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase font-semibold">Sillage Radius</span>
                        <span className="font-medium text-stone-800">
                          {scentOfTheDay?.projection || 'Expansive Aura (1.4m)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-2">
                      <Layers className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase font-semibold">Layer Affinity</span>
                        <span className="font-medium text-stone-800">
                          High (Alluvial Base Anchor)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* LEVEL 5 TOGGLE: ENTHUSIAST & SCIENCE */}
                  <div className="pt-2 border-t border-[#E8DFD3]">
                    <button
                      type="button"
                      onClick={() => setShowScienceLevel5((prev) => !prev)}
                      className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-[11px] font-mono text-stone-700 hover:text-stone-900 transition cursor-pointer"
                      aria-expanded={showScienceLevel5}
                    >
                      <span className="flex items-center gap-1.5">
                        <Binary className="w-3 h-3 text-amber-700" />
                        <span>Enthusiast Analysis (8D Vector &amp; Modelled Fixatives)</span>
                      </span>
                      <motion.span
                        animate={{ rotate: showScienceLevel5 ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-3 h-3 text-stone-500" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {showScienceLevel5 && (
                        <motion.div
                          variants={reducedMotion ? undefined : accordionVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-3.5 rounded-xl bg-stone-900 text-stone-300 font-mono text-[10px] space-y-3">
                            <div className="flex items-center justify-between text-amber-400 border-b border-stone-800 pb-1.5">
                              <span>8D OLFACTORY VECTOR DIMS (MODELLED)</span>
                              <span>FIT: {scentOfTheDayScore}/100 Climate Alignment</span>
                            </div>

                            {/* 8D Visual Dimension Bars */}
                            <div className="space-y-1.5">
                              {[
                                { key: 'Freshness', val: vector8D.freshness, color: 'bg-emerald-400' },
                                { key: 'Sweetness', val: vector8D.sweetness, color: 'bg-rose-400' },
                                { key: 'Intensity', val: vector8D.intensity, color: 'bg-amber-400' },
                                { key: 'Woody Depth', val: vector8D.woody, color: 'bg-yellow-500' },
                                { key: 'Floral Radiance', val: vector8D.floral, color: 'bg-pink-400' },
                                { key: 'Warm Resins & Spice', val: vector8D.warm_resinous_spices, color: 'bg-orange-400' },
                                { key: 'Earthy Clay (Mitti)', val: vector8D.earthy_clay, color: 'bg-amber-700' },
                                { key: 'Longevity Fixatives', val: vector8D.longevity_fixative, color: 'bg-teal-400' },
                              ].map((dim) => (
                                <div key={dim.key} className="space-y-0.5">
                                  <div className="flex justify-between text-[9px] text-stone-400">
                                    <span>{dim.key}</span>
                                    <span>{dim.val}%</span>
                                  </div>
                                  <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${dim.color} rounded-full transition-all duration-500`}
                                      style={{ width: `${Math.min(100, Math.max(5, dim.val))}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Fixative Kinetics Note */}
                            <div className="pt-2 border-t border-stone-800 text-[9px] text-stone-400 leading-relaxed">
                              <span className="text-amber-300 block font-semibold mb-0.5">Modelled Volatility &amp; Evaporation:</span>
                              Under current ambient humidity ({weather.humidity_pct}%), volatile top terpenes are modelled to disperse within 20–30 minutes, transitioning into floral-spice heart esters while heavy base fixatives anchor the skin profile.
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* =========================================================================
          ATMOSPHERE SELECTOR (TACTILE FOOTER CONTROLS)
          ========================================================================= */}
      <div className="w-full max-w-3xl mt-10 pt-6 border-t border-[#E8DFD3]/70 px-4 z-10">
        <AtmosphereSelector
          currentAtmosphere={currentAtmosphere}
          onSetAtmosphere={onSetAtmosphere}
        />
      </div>
    </section>
  );
};
