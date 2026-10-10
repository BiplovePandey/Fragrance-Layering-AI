import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Wind,
  Sparkles,
  Droplets,
  Activity,
  Info,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import {
  getModelledDrydownPhases,
  DrydownPhase
} from '../../utils/recommendationExplanation.js';

interface WearRitualAndDrydownProps {
  fragrance: Fragrance;
  applicationRitual?: {
    spraysA: number;
    placementA: string;
    skinVsClothing: string;
    waitTime: string;
  };
}

export const WearRitualAndDrydown: React.FC<WearRitualAndDrydownProps> = ({
  fragrance,
  applicationRitual
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(0);

  const isOilBased = fragrance?.format === 'Attar' || Boolean(fragrance?.is_oil_based);
  const isHighIntensity = (fragrance?.intensity || 7) >= 8;

  // Application dosage derived from format and intensity
  const recommendedSprays = applicationRitual?.spraysA ?? (isOilBased ? 1 : isHighIntensity ? 2 : 3);
  const applicationUnit = isOilBased ? 'dab with glass applicator rod' : 'targeted sprays';
  const placementAdvice = applicationRitual?.placementA ?? 'Pulse points: inner wrists, lateral collarbones, and nape of neck.';
  const skinClothingAdvice = isOilBased
    ? 'Direct warm skin application. Avoid light fabrics.'
    : 'Direct skin application on pulse points. Warm skin radiates accords with higher fidelity than synthetic fabrics.';

  // Canonical 4 Drydown Phases specified for Phase 14
  const drydownPhases: DrydownPhase[] = useMemo(() => {
    return getModelledDrydownPhases(fragrance);
  }, [fragrance]);

  const activePhase = drydownPhases[selectedPhaseIdx] || drydownPhases[0];

  return (
    <section
      id="wear-today-ritual"
      aria-label="Chapter VI: The Wear Ritual and Drydown"
      className="rounded-3xl p-6 sm:p-8 bg-[#14110E] border border-amber-900/30 text-stone-200 shadow-xl space-y-8"
    >
      {/* Chapter Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Chapter VI &bull; The Wear Ritual &amp; Drydown
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            Application Protocol &amp; Evolution
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700/60 text-[11px] font-mono text-stone-300">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>MODELLED DRYDOWN (SIMULATED)</span>
        </div>
      </div>

      {/* 4-Step Sensory Ritual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Step 1: Pulse Points */}
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Placement
            </span>
          </div>
          <h4 className="font-serif text-sm font-medium text-stone-100">
            Pulse Points
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            {placementAdvice}
          </p>
        </div>

        {/* Step 2: Application Dosage */}
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Dosage
            </span>
          </div>
          <h4 className="font-serif text-sm font-medium text-stone-100">
            {recommendedSprays} {applicationUnit}
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            {skinClothingAdvice}
          </p>
        </div>

        {/* Step 3: Let It Settle */}
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Aeration
            </span>
          </div>
          <h4 className="font-serif text-sm font-medium text-stone-100">
            Let It Settle
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Allow volatile carrier flash to aerate for 45&ndash;60 seconds before inhaling directly.
          </p>
        </div>

        {/* Step 4: Observe Evolution */}
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
              4
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Evolution
            </span>
          </div>
          <h4 className="font-serif text-sm font-medium text-stone-100">
            Observe Drydown
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Experience the 2h–6h drydown anchor, where true molecular fidelity resides on your skin.
          </p>
        </div>
      </div>

      {/* Modelled Drydown Scrubber (Connecting recommendation explanation to actual drydown model) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/70 border border-amber-900/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-200 font-medium">
              Modelled Evaporation Curve (Simulated)
            </span>
          </div>
          <span className="text-[10px] font-mono text-stone-400 bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800">
            MODELLED &bull; NOT A LABORATORY MEASUREMENT
          </span>
        </div>

        {/* 4 Canonical Phase Buttons: OPENING (0-15m), HEART (15m-2h), DRYDOWN (2h-6h+), LATE (6h-12h+) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {drydownPhases.map((phaseItem, idx) => {
            const isSelected = selectedPhaseIdx === idx;
            return (
              <button
                key={phaseItem.phase}
                type="button"
                onClick={() => setSelectedPhaseIdx(idx)}
                className={`p-3 rounded-xl text-left transition cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-500/70 text-amber-200 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    {phaseItem.phase}
                  </span>
                  <span className="text-[11px] font-mono font-semibold">
                    {phaseItem.timeframe}
                  </span>
                </div>
                <div className="text-[11px] text-stone-300 mt-1 font-medium truncate">
                  {phaseItem.durationLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Active Phase Highlight */}
        <div className="p-4 sm:p-5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.04] pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider">
                {activePhase.phase} &bull; {activePhase.timeframe}
              </span>
              <span className="text-stone-600">&bull;</span>
              <span className="text-stone-300">{activePhase.headline}</span>
            </div>

            <div className="text-[10px] font-mono text-stone-400">
              Volatility Factor: <strong className="text-amber-300">{activePhase.relativeVolatilityPct}%</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-2">
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {activePhase.evaporationDynamics}
              </p>
              <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
                <span>Simulated molecular trajectory based on formula format ({fragrance.concentration || 'Eau de Parfum'})</span>
              </div>
            </div>

            <div className="md:col-span-5 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 block">
                Dominant Active Notes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePhase.activeNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-200"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Transparency Notice */}
        <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800/50 flex items-start gap-2.5 text-[10px] font-mono text-stone-400 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-stone-300">SCIENTIFIC TRANSPARENCY NOTICE:</strong> Drydown timelines are calculated using mathematical diffusion curves calibrated against ambient temperature, humidity, and alcohol-to-oil concentration. They represent modelled olfactory evolution, not empirical laboratory measurements on individual skin microbiomes.
          </span>
        </div>
      </div>
    </section>
  );
};
