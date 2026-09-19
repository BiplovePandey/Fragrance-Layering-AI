import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Sparkles, Activity } from 'lucide-react';
import { Fragrance } from '../types.js';

interface EvaporationTimelineProps {
  fragrance: Fragrance;
  className?: string;
}

interface TimelineStage {
  timeKey: string;
  label: string;
  hours: number;
  stageName: string;
  dominantLevel: 'top' | 'heart' | 'base';
  topOpacity: number;
  heartOpacity: number;
  baseOpacity: number;
  sillageLabel: string;
  sillageRadius: number; // percentage
  projectionDescriptor: string;
  chemicalBehavior: string;
}

const STAGES: TimelineStage[] = [
  {
    timeKey: '0m',
    label: 'Initial Spritz',
    hours: 0,
    stageName: 'High Volatility Opening',
    dominantLevel: 'top',
    topOpacity: 1.0,
    heartOpacity: 0.25,
    baseOpacity: 0.1,
    sillageLabel: 'Expansive Radiance (1.8m)',
    sillageRadius: 90,
    projectionDescriptor: 'Volatile esters, aldehydes & citrus terpenes rapidly vaporize off skin lipid barrier.',
    chemicalBehavior: 'Ethanol flash carries volatile high-vapor pressure molecules into immediate headspace.'
  },
  {
    timeKey: '15m',
    label: '15 Minutes',
    hours: 0.25,
    stageName: 'Early Bloom & Accord Bridging',
    dominantLevel: 'top',
    topOpacity: 0.8,
    heartOpacity: 0.6,
    baseOpacity: 0.25,
    sillageLabel: 'Expansive Radius (1.4m)',
    sillageRadius: 75,
    projectionDescriptor: 'Top molecules temper; delicate mid florals and peppery aromachemicals dock into focus.',
    chemicalBehavior: 'Hedione & light lactones begin binding top terpenes to mid-weight phenyl aldehydes.'
  },
  {
    timeKey: '2h',
    label: '2 Hours',
    hours: 2,
    stageName: 'Full Heart & Core Accord',
    dominantLevel: 'heart',
    topOpacity: 0.15,
    heartOpacity: 1.0,
    baseOpacity: 0.6,
    sillageLabel: 'Intimate to Moderate Aura (0.8m)',
    sillageRadius: 55,
    projectionDescriptor: 'Heart petals, spices, and herbaceous notes achieve steady-state isothermal diffusion.',
    chemicalBehavior: 'Iso E Super / Ambroxan matrices anchor mid-weight molecules against ambient air currents.'
  },
  {
    timeKey: '6h',
    label: '6 Hours',
    hours: 6,
    stageName: 'Deep Basenote Fixation',
    dominantLevel: 'base',
    topOpacity: 0.0,
    heartOpacity: 0.35,
    baseOpacity: 0.95,
    sillageLabel: 'Personal Skin Scent (0.3m)',
    sillageRadius: 35,
    projectionDescriptor: 'Heavy santalols, resins, oud sesquiterpenes, and vanillin linger close to warm pulse points.',
    chemicalBehavior: 'High molecular weight aromachemicals (MW > 250 g/mol) maintain adhesive skin affinity.'
  },
  {
    timeKey: '12h',
    label: '12+ Hours',
    hours: 12,
    stageName: 'The Drydown Shadow',
    dominantLevel: 'base',
    topOpacity: 0.0,
    heartOpacity: 0.05,
    baseOpacity: 0.85,
    sillageLabel: 'Intimate Sensory Scent-Film',
    sillageRadius: 20,
    projectionDescriptor: 'Skin-absorbed musks and noble woody fixatives persist as a private, lingering signature.',
    chemicalBehavior: 'Hydrophobic amber and macrocyclic musks remain locked in keratin protein matrix.'
  }
];

export const EvaporationTimeline: React.FC<EvaporationTimelineProps> = ({
  fragrance,
  className = ''
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const currentStage = STAGES[selectedIndex];

  // Derive molecular note highlights
  const topNotes = useMemo(() => fragrance.top_notes?.length ? fragrance.top_notes : ['Bergamot', 'Sparkling Terpenes'], [fragrance]);
  const heartNotes = useMemo(() => fragrance.middle_notes?.length ? fragrance.middle_notes : ['Damask Rose', 'Spiced Hedione'], [fragrance]);
  const baseNotes = useMemo(() => fragrance.base_notes?.length ? fragrance.base_notes : ['Aged Santal', 'Amber Resin', 'Ambroxan'], [fragrance]);

  return (
    <div className={`rounded-3xl bg-white/95 border border-[#E3DACB] p-6 sm:p-8 space-y-7 shadow-xs relative overflow-hidden ${className}`}>
      {/* Background Subtle Warmth */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header with Haute Laboratory Notation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFD3] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 font-mono text-[10px] uppercase font-semibold">
              <Clock className="w-3 h-3 text-amber-700" />
              <span>ISOTHERMAL EVAPORATION DYNAMICS</span>
            </span>
            <span className="text-[10px] font-mono text-[#8A7E74] hidden sm:inline">
              REF: VOL-{(fragrance.longevity_hours || 8)}H
            </span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl text-[#1A1613] font-medium tracking-tight mt-1.5">
            Skin Lifespan &amp; Volatility Scrubber
          </h4>
          <p className="text-xs text-[#6B6056] mt-0.5">
            Scrub along the 12-hour timeline to observe how volatile top notes dissipate while heavy fixative anchors crystallize.
          </p>
        </div>

        {/* Live Stage Badge */}
        <div className="sm:text-right shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7E74] block">Current Diffusion Phase</span>
          <span className="text-xs font-semibold font-mono text-amber-900">
            T + {currentStage.timeKey} &bull; {currentStage.stageName}
          </span>
        </div>
      </div>

      {/* Interactive Time Steps & Slider */}
      <div className="space-y-4">
        {/* Step Buttons */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
          {STAGES.map((stg, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={stg.timeKey}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`py-2 px-1 sm:px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center select-none ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-400 shadow-2xs text-amber-950 font-bold'
                    : 'bg-[#FAF8F5] border-[#E8DFD3] hover:bg-white text-[#6B6056] hover:text-[#1A1613]'
                }`}
              >
                <span className="text-xs sm:text-sm font-mono">{stg.timeKey}</span>
                <span className="text-[9px] sm:text-[10px] text-[#7A6F66] truncate max-w-full font-sans mt-0.5">
                  {stg.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continuous Range Slider with Floating Badge */}
        <div className="relative pt-6 pb-2">
          {/* Floating Time Label directly above slider */}
          <div
            className="absolute top-0 transition-all duration-300 pointer-events-none flex flex-col items-center -translate-x-1/2"
            style={{
              left: `${(selectedIndex / (STAGES.length - 1)) * 96 + 2}%`
            }}
          >
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-100 font-mono text-[10px] tracking-wider uppercase font-semibold shadow-md whitespace-nowrap">
              T + {currentStage.timeKey} &bull; {currentStage.dominantLevel.toUpperCase()} ACCORD
            </span>
            <div className="w-1.5 h-1.5 rotate-45 bg-amber-950 -mt-0.5" />
          </div>

          <input
            type="range"
            min={0}
            max={STAGES.length - 1}
            step={1}
            value={selectedIndex}
            onMouseDown={() => setIsScrubbing(true)}
            onMouseUp={() => setIsScrubbing(false)}
            onTouchStart={() => setIsScrubbing(true)}
            onTouchEnd={() => setIsScrubbing(false)}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
            className="w-full accent-amber-700 cursor-pointer h-2 bg-[#E8DFD3] rounded-lg appearance-none transition-all"
          />

          <div className="flex justify-between text-[10px] font-mono text-[#8A7E74] mt-1.5 px-1">
            <span>Spritz (0m)</span>
            <span>Heart Accord (2h)</span>
            <span>Drydown Anchor (12h+)</span>
          </div>
        </div>
      </div>

      {/* Real-Time Molecular Layer Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Sillage Aura (5 cols) */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="font-brand text-[10px] uppercase tracking-[0.2em] text-[#7A6F66] mb-3 font-semibold">
            Simulated Sillage Halo
          </span>

          {/* Concentric Aura Rings with Dynamic Radius that Gently Breathes */}
          <div className="relative w-48 h-48 flex items-center justify-center my-3">
            {/* Outer Expansion Halo: Gently Breathes (Expand -> Soften -> Contract) */}
            <motion.div
              animate={{
                scale: [
                  currentStage.sillageRadius / 100,
                  (currentStage.sillageRadius / 100) * 1.09,
                  currentStage.sillageRadius / 100
                ],
                opacity: [0.28, 0.52, 0.28]
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute rounded-full pointer-events-none blur-md"
              style={{
                width: `${currentStage.sillageRadius}%`,
                height: `${currentStage.sillageRadius}%`,
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(251, 113, 133, 0.25) 50%, transparent 80%)'
              }}
            />

            {/* Middle Concentric Ring */}
            <div
              className="absolute rounded-full border border-amber-600/35 transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(28, currentStage.sillageRadius * 0.72)}%`,
                height: `${Math.max(28, currentStage.sillageRadius * 0.72)}%`
              }}
            />

            {/* Inner Concentric Pulse */}
            <div
              className="absolute rounded-full border border-amber-800/25 transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(18, currentStage.sillageRadius * 0.42)}%`,
                height: `${Math.max(18, currentStage.sillageRadius * 0.42)}%`
              }}
            />

            {/* Core Pulse Point Icon */}
            <div className="relative z-10 w-12 h-12 rounded-full bg-white border border-amber-400/60 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
          </div>

          <span className="text-xs font-semibold text-[#1A1613] mt-1 font-serif">
            {currentStage.sillageLabel}
          </span>
          <span className="text-[10px] text-[#7A6F66] mt-0.5">
            Radial projection through ambient atmosphere
          </span>
        </div>

        {/* Right Column: Molecular Notes Evaporation Status (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          {/* Top Notes Dynamic Tier (Bright / Volatile) */}
          <div
            className="p-3.5 rounded-2xl border transition-all duration-500"
            style={{
              borderColor: currentStage.topOpacity > 0.3 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(232, 223, 211, 0.6)',
              backgroundColor: currentStage.topOpacity > 0.3 ? 'rgba(254, 243, 199, 0.65)' : 'rgba(250, 248, 245, 0.4)',
              opacity: Math.max(0.42, currentStage.topOpacity)
            }}
          >
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-amber-950 font-mono text-[10px] font-semibold">
                <span>TOP ACCORDS</span>
                <span className="text-[9px] text-[#7A6F66]">(High Volatility Opening)</span>
              </span>
              <span className="font-mono text-[10px] text-amber-900 font-semibold">
                {Math.round(currentStage.topOpacity * 100)}% Activity
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {topNotes.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full bg-white border border-[#E3DACB] text-[11px] text-[#292323] shadow-2xs font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes Dynamic Tier (Soft / Warm) */}
          <div
            className="p-3.5 rounded-2xl border transition-all duration-500"
            style={{
              borderColor: currentStage.heartOpacity > 0.4 ? 'rgba(244, 63, 94, 0.45)' : 'rgba(232, 223, 211, 0.6)',
              backgroundColor: currentStage.heartOpacity > 0.4 ? 'rgba(255, 228, 230, 0.65)' : 'rgba(250, 248, 245, 0.4)',
              opacity: Math.max(0.42, currentStage.heartOpacity)
            }}
          >
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-rose-950 font-mono text-[10px] font-semibold">
                <span>HEART BRIDGE</span>
                <span className="text-[9px] text-[#7A6F66]">(Medium Volatility Core)</span>
              </span>
              <span className="font-mono text-[10px] text-rose-900 font-semibold">
                {Math.round(currentStage.heartOpacity * 100)}% Activity
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {heartNotes.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full bg-white border border-[#E3DACB] text-[11px] text-[#292323] shadow-2xs font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes Dynamic Tier (Deep / Persistent) */}
          <div
            className="p-3.5 rounded-2xl border transition-all duration-500"
            style={{
              borderColor: currentStage.baseOpacity > 0.5 ? 'rgba(180, 83, 9, 0.55)' : 'rgba(232, 223, 211, 0.6)',
              backgroundColor: currentStage.baseOpacity > 0.5 ? 'rgba(254, 236, 214, 0.65)' : 'rgba(250, 248, 245, 0.4)',
              opacity: Math.max(0.42, currentStage.baseOpacity)
            }}
          >
            <div className="flex items-center justify-between text-xs font-medium mb-1">
              <span className="flex items-center gap-1.5 text-amber-950 font-mono text-[10px] font-semibold">
                <span>BASE FIXATIVES</span>
                <span className="text-[9px] text-[#7A6F66]">(Heavy Molecular Anchor)</span>
              </span>
              <span className="font-mono text-[10px] text-amber-950 font-semibold">
                {Math.round(currentStage.baseOpacity * 100)}% Activity
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {baseNotes.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full bg-white border border-[#E3DACB] text-[11px] text-[#292323] shadow-2xs font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Master Perfumer Chemical Breakdown Card */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] text-[#3D352E] text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-amber-800 font-mono text-[11px] font-semibold">
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          <span>PERFUMER SENSORY NOTATION:</span>
        </div>
        <p className="text-[#1A1613] text-xs sm:text-sm font-serif italic leading-relaxed">
          &ldquo;{currentStage.projectionDescriptor}&rdquo;
        </p>
        <p className="text-[11px] font-mono text-[#7A6F66]">
          Molecular Behavior: {currentStage.chemicalBehavior}
        </p>
      </div>
    </div>
  );
};
