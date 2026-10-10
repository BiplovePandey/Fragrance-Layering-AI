import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CloudSun,
  Heart,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  Compass,
  Binary,
  HelpCircle,
  Clock,
  Wind
} from 'lucide-react';
import { WearRecommendation, WeatherCondition, Fragrance } from '../../types.js';
import { olfactoryIntelligence, extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import {
  generateWhyThisScentSignals,
  ExplanationSignal
} from '../../utils/recommendationExplanation.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { accordionVariants } from '../../motion/variants.js';

interface WhyThisScentAlignmentProps {
  recommendation: WearRecommendation;
  weather: WeatherCondition;
  currentMood: string;
  currentOccasion: string;
  wardrobeFragrances?: Fragrance[];
}

export const WhyThisScentAlignment: React.FC<WhyThisScentAlignmentProps> = ({
  recommendation,
  weather,
  currentMood,
  currentOccasion,
  wardrobeFragrances = []
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [isLevel2Expanded, setIsLevel2Expanded] = useState<boolean>(true); // Level 2: Signal breakdown
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);
  const [showLevel3Enthusiast, setShowLevel3Enthusiast] = useState<boolean>(false); // Level 3: 8D vector / technical

  const { fragrance, score, match } = recommendation;

  // Retrieve living DNA safely
  const livingDNA = useMemo(() => {
    try {
      return olfactoryIntelligence.getLivingDNA();
    } catch {
      return null;
    }
  }, []);

  // Compute 8D vector for enthusiast disclosure
  const vector8D = useMemo(() => {
    return extractFragranceVector8D(fragrance);
  }, [fragrance]);

  // Generate signals translated to human language and sorted strongest first
  const signals: ExplanationSignal[] = useMemo(() => {
    return generateWhyThisScentSignals(
      fragrance,
      weather,
      match,
      score,
      currentMood,
      currentOccasion,
      livingDNA,
      wardrobeFragrances
    );
  }, [fragrance, weather, match, score, currentMood, currentOccasion, livingDNA, wardrobeFragrances]);

  // Icons map for signals
  const getSignalIcon = (id: string) => {
    switch (id) {
      case 'climate':
        return CloudSun;
      case 'mood':
        return Heart;
      case 'occasion':
        return Briefcase;
      case 'dna':
        return Sparkles;
      case 'cabinet':
        return Layers;
      default:
        return Compass;
    }
  };

  const toggleSignal = (id: string) => {
    setExpandedSignalId(prev => (prev === id ? null : id));
  };

  return (
    <section
      id="wear-today-why"
      aria-label="Chapter V: Why This Scent"
      className="rounded-3xl p-6 sm:p-8 bg-[#14110E] border border-amber-900/30 text-stone-200 shadow-xl space-y-6"
    >
      {/* Chapter Eyebrow & Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Chapter V &bull; Why This Scent
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            The Olfactory Rationale
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700/60 text-[11px] font-mono text-stone-300">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>PROGRESSIVE DISCLOSURE</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEVEL 1: SHORT HUMAN EXPLANATION
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-amber-900/20 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-amber-400/80">
          <span>Level 1 &bull; Core Olfactory Verdict</span>
          <span className="text-stone-500">PLAIN-LANGUAGE EXPLANATION</span>
        </div>
        <p className="italic font-serif text-amber-100/90 text-sm sm:text-base leading-relaxed">
          &ldquo;{recommendation.reasons?.[0] || `${fragrance?.name || 'This fragrance'} by ${fragrance?.brand_name || fragrance?.brand || 'curated house'} aligns with your current atmosphere (${weather?.temperature_c ?? 24}°C), ${currentMood?.toLowerCase() || 'calibrated'} mindset, and personal olfactory DNA.`}&rdquo;
        </p>
        <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Grounded strictly in verified catalogue notes, live atmosphere, and personal wear history.</span>
        </div>
      </div>

      {/* =========================================================================
          LEVEL 2: SIGNAL BREAKDOWN (STRONGEST CONTRIBUTING SIGNALS FIRST)
          ========================================================================= */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsLevel2Expanded(prev => !prev)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why did Olfactory AI choose this? (Signal Breakdown)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLevel2Expanded ? 'rotate-180' : ''}`} />
          </button>
          <span className="text-[11px] font-mono text-stone-400 hidden sm:inline">
            Ranked by strongest contributing signals
          </span>
        </div>

        <AnimatePresence initial={false}>
          {isLevel2Expanded && (
            <motion.div
              variants={reducedMotion ? undefined : accordionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="space-y-2.5 overflow-hidden"
            >
              {signals.map((signal, idx) => {
                const isExpanded = expandedSignalId === signal.id;
                const Icon = getSignalIcon(signal.id);

                return (
                  <div
                    key={signal.id}
                    className="rounded-2xl bg-stone-900/50 border border-stone-800/80 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSignal(signal.id)}
                      className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-900/80 transition"
                      aria-expanded={isExpanded}
                    >
                      {/* Signal Label & Rank */}
                      <div className="flex items-center gap-3 min-w-[150px] sm:min-w-[190px]">
                        <span className="w-5 h-5 rounded-md bg-stone-800 text-stone-400 text-[10px] font-mono flex items-center justify-center font-bold">
                          #{idx + 1}
                        </span>
                        <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-stone-200 block">
                            {signal.label}
                          </span>
                          <span className="text-[10px] font-mono text-stone-500 uppercase">
                            {signal.metricName}
                          </span>
                        </div>
                      </div>

                      {/* Small Elegant Signal Indicator (NOT a loud dashboard) */}
                      <div className="flex-1 max-w-xs hidden sm:flex items-center gap-3">
                        <div className="relative w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(15, signal.value))}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-amber-300/90 w-10 text-right">
                          {signal.value}%
                        </span>
                      </div>

                      {/* Transparency Category Tag & Disclosure Toggle */}
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-stone-950/80 border border-stone-700/60 text-[9px] font-mono text-stone-400 uppercase tracking-wider hidden md:inline">
                          {signal.transparency}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-stone-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Human Language Explanation */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 pt-1.5 text-xs text-stone-300 border-t border-white/[0.04] bg-stone-950/40 space-y-2"
                        >
                          <p className="leading-relaxed font-sans text-stone-200">
                            {signal.translation}
                          </p>
                          {signal.detail && (
                            <p className="text-[11px] font-mono text-amber-300/80">
                              Status: {signal.detail}
                            </p>
                          )}
                          <div className="text-[10px] font-mono text-stone-500 flex items-center justify-between pt-1">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-amber-500/80" />
                              <span>Classification: {signal.transparency}</span>
                            </span>
                            <span>Signal Weight: #{idx + 1} contributing resonance</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================================
          LEVEL 3: ENTHUSIAST & 8D TECHNICAL INFORMATION
          ========================================================================= */}
      <div className="pt-2 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => setShowLevel3Enthusiast(prev => !prev)}
          className="w-full py-2.5 px-4 rounded-xl bg-stone-900/60 hover:bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300 hover:text-stone-100 flex items-center justify-between cursor-pointer transition"
          aria-expanded={showLevel3Enthusiast}
        >
          <span className="flex items-center gap-2">
            <Binary className="w-3.5 h-3.5 text-amber-400" />
            <span>Level 3 &bull; Enthusiast Inspection (8D Vector &amp; Technical Model)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-stone-950 text-[9px] text-stone-500 uppercase">
              MODELLED
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${showLevel3Enthusiast ? 'rotate-180' : ''}`} />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {showLevel3Enthusiast && (
            <motion.div
              variants={reducedMotion ? undefined : accordionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-300 font-mono text-[10px] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-2">
                  <span className="text-amber-400 font-semibold tracking-wider uppercase">
                    8D Olfactory Vector Coordinates (Modelled Space)
                  </span>
                  <span className="text-stone-500">
                    Calculated against living DNA &bull; {livingDNA?.personalityTitle || 'Active Archetype'}
                  </span>
                </div>

                {/* 8D Visual Dimension Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {[
                    { key: 'Freshness', val: vector8D.freshness, color: 'bg-emerald-400' },
                    { key: 'Sweetness', val: vector8D.sweetness, color: 'bg-rose-400' },
                    { key: 'Intensity', val: vector8D.intensity, color: 'bg-amber-400' },
                    { key: 'Woody Depth', val: vector8D.woody, color: 'bg-yellow-500' },
                    { key: 'Floral Radiance', val: vector8D.floral, color: 'bg-pink-400' },
                    { key: 'Warm Resins & Spices', val: vector8D.warm_resinous_spices, color: 'bg-orange-400' },
                    { key: 'Earthy Clay (Mitti)', val: vector8D.earthy_clay, color: 'bg-amber-700' },
                    { key: 'Longevity Fixatives', val: vector8D.longevity_fixative, color: 'bg-teal-400' },
                  ].map((dim) => (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>{dim.key}</span>
                        <span className="text-stone-200 font-bold">{dim.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden border border-white/[0.04]">
                        <div
                          className={`h-full ${dim.color} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, Math.max(5, dim.val))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technical Simulation Notice */}
                <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 leading-relaxed flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-300">Modelled Volatility Simulation:</strong> At ambient temperature ({weather.temperature_c}°C) and relative humidity ({weather.humidity_pct}%), volatile top terpenes transition into heart accords over 15 to 120 minutes, while heavy fixatives anchor the skin boundary. This is a mathematical simulation, not a laboratory measurement.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
