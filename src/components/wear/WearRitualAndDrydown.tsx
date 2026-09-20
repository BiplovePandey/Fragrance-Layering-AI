import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface WearRitualAndDrydownProps {
  fragrance: Fragrance;
  applicationRitual?: {
    spraysA: number;
    placementA: string;
    skinVsClothing: string;
    waitTime: string;
  };
}

interface DrydownStep {
  timeKey: string;
  label: string;
  phaseTitle: string;
  projectionRadius: string;
  activeNotes: string;
  sensoryCharacter: string;
  topPct: number;
  heartPct: number;
  basePct: number;
}

export const WearRitualAndDrydown: React.FC<WearRitualAndDrydownProps> = ({
  fragrance,
  applicationRitual
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);

  const isOilBased = fragrance.format === 'Attar' || fragrance.is_oil_based;
  const isHighIntensity = (fragrance.intensity || 7) >= 8;

  // Application dosage derived from format and intensity
  const recommendedSprays = applicationRitual?.spraysA ?? (isOilBased ? 1 : isHighIntensity ? 2 : 3);
  const applicationUnit = isOilBased ? 'dab with glass applicator rod' : 'targeted sprays';
  const placementAdvice = applicationRitual?.placementA ?? 'Pulse points: inner wrists, lateral collarbones, and nape of neck.';
  const skinClothingAdvice = isOilBased
    ? 'Direct warm skin application. Avoid light fabrics.'
    : 'Direct skin application on pulse points. Scent warm skin radiates accords with higher fidelity than synthetic fabrics.';

  const drydownSteps: DrydownStep[] = [
    {
      timeKey: '0m',
      label: 'Initial Spritz',
      phaseTitle: 'Volatile Opening & Sparkle',
      projectionRadius: '1.8m halo radiance',
      activeNotes: (fragrance.top_notes || ['Citrus', 'Spices']).join(', '),
      sensoryCharacter: 'Immediate effervescence and volatile citrus/spice notes lift off the skin.',
      topPct: 95,
      heartPct: 25,
      basePct: 10
    },
    {
      timeKey: '15m',
      label: '15 min',
      phaseTitle: 'Opening Bloom & Heart Bridge',
      projectionRadius: '1.4m moderate aura',
      activeNotes: `${(fragrance.top_notes || [])[0] || 'Crisp notes'} merging into ${(fragrance.middle_notes || ['Florals'])[0] || 'blooms'}`,
      sensoryCharacter: 'Alcohol flash evaporates; floral and herbal mid-weight accords warm to body temperature.',
      topPct: 65,
      heartPct: 70,
      basePct: 30
    },
    {
      timeKey: '2h',
      label: '2 hours',
      phaseTitle: 'Full Heart & Core Accord',
      projectionRadius: '0.9m personal boundary',
      activeNotes: (fragrance.middle_notes || ['Damask Rose', 'Saffron', 'Woods']).join(', '),
      sensoryCharacter: 'The definitive identity of the fragrance. Isothermal diffusion delivers rich steady projection.',
      topPct: 15,
      heartPct: 95,
      basePct: 65
    },
    {
      timeKey: '6h',
      label: '6 hours',
      phaseTitle: 'Resinous Base Drydown',
      projectionRadius: '0.4m intimate trail',
      activeNotes: (fragrance.base_notes || ['Sandalwood', 'Amber', 'Musk']).join(', '),
      sensoryCharacter: 'Heavy molecular weight fixatives lock into skin lipid barrier, radiating intimate warmth.',
      topPct: 0,
      heartPct: 35,
      basePct: 90
    },
    {
      timeKey: '12h',
      label: '12+ hours',
      phaseTitle: 'Subtle Skin Memory',
      projectionRadius: 'Close personal skin scent',
      activeNotes: `${(fragrance.base_notes || ['Amber', 'Musk'])[0] || 'Skin Woods'} & Body Chemistry`,
      sensoryCharacter: 'A comforting, hypnotic trace that melds seamlessly with your natural skin warmth.',
      topPct: 0,
      heartPct: 5,
      basePct: 60
    }
  ];

  const currentStep = drydownSteps[selectedStageIdx];

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
            Chapter VI &bull; The Wear Ritual
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            Application Protocol &amp; Evolution
          </h2>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700/60 text-[11px] font-mono text-stone-400">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>MODELLED DRYDOWN</span>
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

        {/* Step 4: Revisit at Drydown */}
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
            Judge the fragrance by its 2-hour heart and 6-hour base warmth, not just the top flash.
          </p>
        </div>
      </div>

      {/* Modelled Drydown Scrubber */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/70 border border-amber-900/30 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-200 font-medium">
              Experience The Drydown Curve
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-500">
            Tap stage to inspect note evaporation
          </span>
        </div>

        {/* Stage Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {drydownSteps.map((step, idx) => {
            const isSelected = selectedStageIdx === idx;
            return (
              <button
                key={step.timeKey}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`py-2.5 px-1 sm:px-2 rounded-xl text-center transition cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-500/70 text-amber-200 shadow-md shadow-amber-950/40 ring-1 ring-amber-500/40'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
                aria-pressed={isSelected}
              >
                <div className="text-xs sm:text-sm font-mono font-semibold">
                  {step.timeKey}
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5 truncate hidden sm:block">
                  {step.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Stage Highlight */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 rounded-xl bg-stone-900/60 border border-stone-800">
          <div className="md:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase: {currentStep.phaseTitle}</span>
              <span className="text-stone-600">&bull;</span>
              <span className="text-stone-400">{currentStep.projectionRadius}</span>
            </div>

            <p className="text-sm text-stone-200 font-serif leading-relaxed">
              &ldquo;{currentStep.sensoryCharacter}&rdquo;
            </p>

            <div className="text-xs text-stone-400 pt-1">
              <strong className="text-stone-300 font-mono text-[11px] uppercase mr-2">
                Active Notes:
              </strong>
              <span>{currentStep.activeNotes}</span>
            </div>
          </div>

          {/* Molecular Proportion Bars */}
          <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-white/[0.08] pt-3 md:pt-0 md:pl-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Accord Diffusion Intensity
            </span>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-stone-400">
                <span>Top Notes</span>
                <span>{currentStep.topPct}%</span>
              </div>
              <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${currentStep.topPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-stone-400 pt-0.5">
                <span>Heart Notes</span>
                <span>{currentStep.heartPct}%</span>
              </div>
              <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 transition-all duration-500"
                  style={{ width: `${currentStep.heartPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-stone-400 pt-0.5">
                <span>Base Notes</span>
                <span>{currentStep.basePct}%</span>
              </div>
              <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-500"
                  style={{ width: `${currentStep.basePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
