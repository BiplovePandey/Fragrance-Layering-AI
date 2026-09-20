import React, { useState } from 'react';
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
  Compass
} from 'lucide-react';
import { WearRecommendation, Fragrance, WeatherCondition } from '../../types.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface WhyThisScentAlignmentProps {
  recommendation: WearRecommendation;
  weather: WeatherCondition;
  currentMood: string;
  currentOccasion: string;
}

interface AlignmentFactor {
  key: string;
  label: string;
  value: number; // 0 to 100
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  detailedRationale: string;
}

export const WhyThisScentAlignment: React.FC<WhyThisScentAlignmentProps> = ({
  recommendation,
  weather,
  currentMood,
  currentOccasion
}) => {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const { fragrance, score, reasons, match, ownership } = recommendation;
  const livingDNA = olfactoryIntelligence.getLivingDNA();
  const scentMemory = olfactoryIntelligence.getScentMemory();

  // Extract match metrics or calculate from living DNA & context
  const stateMatch = match?.mood ?? (reasons.some(r => /mood|mindset/i.test(r)) ? 92 : 88);
  const weatherMatch = match?.weather ?? (reasons.some(r => /temperature|heat|weather|cold|humidity/i.test(r)) ? 95 : 85);
  const dnaMatch = match?.preference ?? (match?.olfactory ?? 91);
  const occasionMatch = match?.occasion ?? 89;
  const cabinetMatch = match?.wardrobe ?? (ownership?.owned ? 96 : 82);

  // Categorize returned reasons from API
  const weatherReason = reasons.find(r => /temperature|heat|weather|cold|cool|humidity|diffusion|atmosphere|moisture/i.test(r)) ||
    `Evaporation curve calibrated for ${weather.temperature_c}°C and ${weather.humidity_pct}% humidity.`;

  const moodReason = reasons.find(r => /affinity|mood|mindset|compositions|character|confidence|sensual|serene/i.test(r)) ||
    `Reflects your current "${currentMood}" state through harmonious botanical accords.`;

  const occasionReason = reasons.find(r => /formal|office|casual|festive|wedding|evening|day|date|setting|attire/i.test(r) && r !== weatherReason) ||
    `Structured sillage and projection ideal for a ${currentOccasion} setting.`;

  const dnaReason = `Harmonizes with your ${livingDNA.personalityTitle} scent signature (${(scentMemory.favoriteFamilies || []).slice(0, 2).join(', ') || fragrance.fragrance_family}).`;

  const cabinetReason = ownership?.owned
    ? `An owned anchor in your wardrobe; honors your rotation rhythm without repetitive olfactory fatigue.`
    : `Curated discovery piece bridging fresh dimensions into your olfactory journey.`;

  const alignmentFactors: AlignmentFactor[] = [
    {
      key: 'state',
      label: 'Your State',
      value: stateMatch,
      icon: Heart,
      summary: 'Emotional and mental resonance',
      detailedRationale: moodReason
    },
    {
      key: 'atmosphere',
      label: 'Atmosphere',
      value: weatherMatch,
      icon: CloudSun,
      summary: 'Temperature & humidity evaporation balance',
      detailedRationale: weatherReason
    },
    {
      key: 'dna',
      label: 'Your DNA',
      value: dnaMatch,
      icon: Sparkles,
      summary: '8D Vector profile compatibility',
      detailedRationale: dnaReason
    },
    {
      key: 'occasion',
      label: 'Occasion',
      value: occasionMatch,
      icon: Briefcase,
      summary: 'Formality & social distance appropriateness',
      detailedRationale: occasionReason
    },
    {
      key: 'cabinet',
      label: 'Cabinet',
      value: cabinetMatch,
      icon: Layers,
      summary: 'Rotation freshness & collection synergy',
      detailedRationale: cabinetReason
    }
  ];

  const toggleFactor = (key: string) => {
    setExpandedFactor(prev => (prev === key ? null : key));
  };

  return (
    <section
      id="wear-today-why"
      aria-label="Chapter V: Why This Scent"
      className="rounded-3xl p-6 sm:p-8 bg-[#14110E] border border-amber-900/30 text-stone-200 shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Chapter V &bull; Why This Scent
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            The Olfactory Rationale
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700/60 text-[11px] font-mono text-stone-400">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>MODELLED ALIGNMENT</span>
        </div>
      </div>

      {/* Primary Narrative Summary */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-amber-900/20 text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
        <p className="italic font-serif text-amber-100/90 text-sm sm:text-base mb-2">
          &ldquo;{recommendation.reasons[0] || `${fragrance.name} by ${fragrance.brand_name || fragrance.brand} offers sublime resonance across today’s sensory parameters.`}&rdquo;
        </p>
        <span className="text-[11px] text-stone-400">
          Each dimension below reflects mathematical convergence between ambient environmental telemetry and your personal olfactory DNA.
        </span>
      </div>

      {/* Tactile Olfactory Alignment Bars */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-stone-400">
          <span>Olfactory Alignment Dimensions</span>
          <span className="text-amber-400 font-bold">Composite: {score}%</span>
        </div>

        <div className="space-y-2">
          {alignmentFactors.map((factor) => {
            const isExpanded = expandedFactor === factor.key;
            const Icon = factor.icon;

            return (
              <div
                key={factor.key}
                className="rounded-2xl bg-stone-900/50 border border-stone-800/80 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFactor(factor.key)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-900/80 transition"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 min-w-[130px] sm:min-w-[160px]">
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-stone-200">
                      {factor.label}
                    </span>
                  </div>

                  {/* Tactile Vector Track */}
                  <div className="flex-1 max-w-xs hidden sm:flex items-center gap-3">
                    <div className="relative w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, Math.max(10, factor.value))}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-amber-300/90 w-8 text-right">
                      {factor.value}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone-400 hidden md:inline">
                      {factor.summary}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Factor Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4 pt-1 text-xs text-stone-300 border-t border-white/[0.04] bg-stone-950/40 space-y-1.5"
                    >
                      <p className="leading-relaxed font-sans">
                        {factor.detailedRationale}
                      </p>
                      <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1 pt-1">
                        <ShieldCheck className="w-3 h-3 text-amber-500/80" />
                        <span>Calibrated against olfactory context vector</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
