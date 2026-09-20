import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Wind, Sparkles, Activity, Play, Pause, RotateCcw } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { ChamberAtmospherePalette } from './ChamberAtmosphere.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface ChamberDrydownMachineProps {
  fragrance: Fragrance;
  palette: ChamberAtmospherePalette;
}

interface DrydownStage {
  timeKey: string;
  label: string;
  stageName: string;
  topOpacity: number;
  heartOpacity: number;
  baseOpacity: number;
  sillageLabel: string;
  sillageRadiusPct: number; // percentage radius for visual halo
  projectionDescriptor: string;
  chemicalBehavior: string;
}

const STAGES: DrydownStage[] = [
  {
    timeKey: '0m',
    label: 'Spritz',
    stageName: 'Initial Volatile Flash',
    topOpacity: 1.0,
    heartOpacity: 0.25,
    baseOpacity: 0.1,
    sillageLabel: 'Expansive Radiance (1.8m radius)',
    sillageRadiusPct: 92,
    projectionDescriptor: 'Volatile esters, aldehydes & citrus terpenes rapidly vaporize off skin lipid barrier.',
    chemicalBehavior: 'Ethanol flash carries volatile high-vapor pressure molecules into immediate headspace.'
  },
  {
    timeKey: '15m',
    label: '15 min',
    stageName: 'Early Bloom & Accord Bridging',
    topOpacity: 0.75,
    heartOpacity: 0.65,
    baseOpacity: 0.3,
    sillageLabel: 'Moderate Expansive (1.4m radius)',
    sillageRadiusPct: 76,
    projectionDescriptor: 'Top molecules temper; delicate mid florals and peppery aromachemicals dock into focus.',
    chemicalBehavior: 'Hedione & light lactones begin binding top terpenes to mid-weight phenyl aldehydes.'
  },
  {
    timeKey: '2h',
    label: '2 hours',
    stageName: 'Full Heart & Core Accord',
    topOpacity: 0.15,
    heartOpacity: 1.0,
    baseOpacity: 0.65,
    sillageLabel: 'Intimate to Moderate Aura (0.8m radius)',
    sillageRadiusPct: 56,
    projectionDescriptor: 'Heart petals, spices, and herbaceous notes achieve steady-state isothermal diffusion.',
    chemicalBehavior: 'Iso E Super / Ambroxan matrices anchor mid-weight molecules against ambient air currents.'
  },
  {
    timeKey: '6h',
    label: '6 hours',
    stageName: 'Deep Basenote Fixation',
    topOpacity: 0.0,
    heartOpacity: 0.35,
    baseOpacity: 0.95,
    sillageLabel: 'Personal Skin Scent (0.3m radius)',
    sillageRadiusPct: 36,
    projectionDescriptor: 'Heavy santalols, resins, oud sesquiterpenes, and vanillin linger close to warm pulse points.',
    chemicalBehavior: 'High molecular weight aromachemicals (MW > 250 g/mol) maintain adhesive skin affinity.'
  },
  {
    timeKey: '12h',
    label: '12+ hours',
    stageName: 'The Drydown Shadow',
    topOpacity: 0.0,
    heartOpacity: 0.05,
    baseOpacity: 0.85,
    sillageLabel: 'Intimate Sensory Scent-Film',
    sillageRadiusPct: 22,
    projectionDescriptor: 'Skin-absorbed musks and noble woody fixatives persist as a private, lingering signature.',
    chemicalBehavior: 'Hydrophobic amber and macrocyclic musks remain locked in keratin protein matrix.'
  }
];

export const ChamberDrydownMachine: React.FC<ChamberDrydownMachineProps> = ({
  fragrance,
  palette
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeStage = STAGES[currentStageIndex];

  const topNotes = fragrance.top_notes?.length ? fragrance.top_notes : ['Bergamot', 'Sparkling Terpenes'];
  const heartNotes = fragrance.middle_notes?.length ? fragrance.middle_notes : ['Damask Rose', 'Spiced Hedione'];
  const baseNotes = fragrance.base_notes?.length ? fragrance.base_notes : ['Aged Santal', 'Amber Resin', 'Ambroxan'];

  // Optional playback cycle
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % STAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="rounded-3xl bg-[#14100D]/90 border border-white/10 p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl shadow-xl">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10"
        style={{ background: palette.pedestalGlow }}
      />

      {/* Header with Haute Laboratory Notation */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Evaporation Kinetics Engine</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-medium mt-0.5">
            Drydown Time Machine
          </h4>
        </div>

        {/* Play / Cycle Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer ${
            isPlaying
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
              : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-stone-300'
          }`}
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{isPlaying ? 'Pause Cycle' : 'Simulate 12h'}</span>
        </button>
      </div>

      {/* SILLAGE RADIAL HALO + TIME VISUALIZER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual Diffusion Halo (Left 5 Cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-white/10 flex items-center justify-center">
            {/* Guide Rings */}
            <div className="absolute inset-4 rounded-full border border-dashed border-white/10 pointer-events-none" />
            <div className="absolute inset-10 rounded-full border border-dotted border-white/10 pointer-events-none" />

            {/* Dynamic Sillage Expansion Aura */}
            <motion.div
              animate={{
                width: `${activeStage.sillageRadiusPct}%`,
                height: `${activeStage.sillageRadiusPct}%`,
                opacity: 0.35 + (activeStage.sillageRadiusPct / 100) * 0.45
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="rounded-full blur-md"
              style={{
                background: `radial-gradient(circle, ${palette.brassAccent} 0%, ${palette.pedestalGlow} 60%, transparent 100%)`
              }}
            />

            {/* Central Pulse Point Marker */}
            <div className="absolute z-10 w-5 h-5 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            </div>

            {/* Sillage Radius Readout */}
            <div className="absolute bottom-2 text-center">
              <span className="px-2.5 py-0.5 rounded-full bg-black/70 border border-white/15 text-[9px] font-mono text-amber-200 uppercase tracking-wider backdrop-blur-xs">
                {activeStage.sillageLabel}
              </span>
            </div>
          </div>
        </div>

        {/* TIME STAGE CONTROLS & ACTIVE VOLATILITY (Right 7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Time Scrubber Buttons */}
          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
            {STAGES.map((st, idx) => {
              const isSelected = idx === currentStageIndex;
              return (
                <button
                  key={st.timeKey}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStageIndex(idx);
                  }}
                  className={`py-2 px-1 rounded-xl text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-semibold shadow-md'
                      : 'hover:bg-white/5 text-stone-400'
                  }`}
                >
                  <span className="font-mono text-xs sm:text-sm font-bold">{st.timeKey}</span>
                  <span className="text-[9px] truncate w-full hidden sm:inline">{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Name & Physical Description */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-amber-400 font-bold">
                {activeStage.stageName}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                Skin Vapor Kinetics
              </span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed font-serif">
              “{activeStage.projectionDescriptor}”
            </p>
            <div className="text-[10px] font-mono text-stone-400 pt-1 border-t border-white/5">
              Molecular Behavior: {activeStage.chemicalBehavior}
            </div>
          </div>

          {/* ACTIVE NOTE EMISSION AT THIS TIMELINE STAGE */}
          <div className="space-y-2 pt-1 text-xs">
            <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
              Active Headspace Concentration:
            </div>

            {/* Top Notes Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-300">Top ({topNotes.slice(0, 2).join(', ')})</span>
                <span className="font-mono text-amber-300">
                  {Math.round(activeStage.topOpacity * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${activeStage.topOpacity * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
            </div>

            {/* Heart Notes Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-300">Heart ({heartNotes.slice(0, 2).join(', ')})</span>
                <span className="font-mono text-rose-300">
                  {Math.round(activeStage.heartOpacity * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${activeStage.heartOpacity * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-rose-400"
                />
              </div>
            </div>

            {/* Base Notes Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-300">Base ({baseNotes.slice(0, 2).join(', ')})</span>
                <span className="font-mono text-amber-500">
                  {Math.round(activeStage.baseOpacity * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${activeStage.baseOpacity * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-amber-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
