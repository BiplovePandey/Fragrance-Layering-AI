import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Droplets, RefreshCw, Layers, Shield } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { getLabPalette } from './LaboratoryAtmosphere.js';
import { MOTION_SPRINGS, MOTION_EASINGS } from '../../motion/config.js';

interface FlaconStationProps {
  station: 'A' | 'B';
  stationLabel: string;
  fragrance: Fragrance;
  sprays: number;
  onSpraysChange: (sprays: number) => void;
  onOpenSelector: () => void;
  isDominant?: boolean;
}

export const FlaconStation: React.FC<FlaconStationProps> = ({
  station,
  stationLabel,
  fragrance,
  sprays,
  onSpraysChange,
  onOpenSelector,
  isDominant = false
}) => {
  const palette = getLabPalette(fragrance.fragrance_family);

  return (
    <div
      className={`relative p-5 sm:p-6 rounded-3xl bg-[#14100C]/90 border ${
        isDominant ? 'border-amber-500/50 shadow-[0_15px_40px_rgba(212,175,55,0.12)]' : 'border-stone-800/80'
      } flex flex-col justify-between transition-all duration-300 backdrop-blur-xl group`}
    >
      {/* Station Brass Header Tag */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 text-stone-950 text-[10px] font-mono font-bold flex items-center justify-center shadow-xs">
            {station}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-200/90 font-medium">
            {stationLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSelector}
          className="text-[11px] font-mono text-stone-400 hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-stone-900/60 hover:bg-stone-800 border border-stone-800"
          title={`Replace Specimen ${station}`}
        >
          <RefreshCw className="w-3 h-3 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
          <span>Switch</span>
        </button>
      </div>

      {/* Flacon Staged on Coaster */}
      <div className="my-5 flex flex-col items-center justify-center relative">
        {/* Ambient Scent Aura Halo behind bottle */}
        <div
          className="absolute w-36 h-36 rounded-full blur-2xl opacity-40 pointer-events-none -z-10 transition-all duration-700"
          style={{ background: palette.glowColor }}
        />

        {/* Physical 3D Flacon Silhouette */}
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={MOTION_SPRINGS.luxurySoft}
          className="w-24 h-32 relative flex flex-col items-center justify-end cursor-pointer"
          onClick={onOpenSelector}
        >
          {/* Flacon Cap (Brushed Gold/Brass) */}
          <div className="w-7 h-5 rounded-t-sm bg-gradient-to-b from-[#E2C675] via-[#B8860B] to-[#78540E] border-t border-x border-[#F5E298]/60 shadow-md relative z-20">
            <div className="w-full h-1 bg-white/30" />
          </div>

          {/* Flacon Neck Collar */}
          <div className="w-9 h-1.5 bg-[#8C6615] border-x border-[#4A3408] z-10" />

          {/* Flacon Glass Vessel */}
          <div className="w-24 h-26 rounded-2xl bg-gradient-to-b from-white/15 via-white/5 to-black/60 border border-white/25 shadow-xl relative overflow-hidden flex flex-col justify-end p-2 backdrop-blur-md">
            {/* Specular glass reflection */}
            <div className="absolute top-0 left-2 w-4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-15deg] pointer-events-none" />

            {/* Liquid Meniscus inside */}
            <motion.div
              initial={{ height: '55%' }}
              animate={{ height: `${Math.min(85, 45 + sprays * 8)}%` }}
              transition={{ duration: 0.6, ease: MOTION_EASINGS.luxuryDecel }}
              className="w-full rounded-b-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(to top, ${palette.vaporRgbaA}, ${palette.vaporRgbaB})`
              }}
            >
              {/* Liquid surface wave */}
              <div className="w-full h-1 bg-white/40 opacity-70" />
            </motion.div>

            {/* Vessel Label Plate */}
            <div className="absolute inset-x-3 top-4 bottom-4 rounded-lg bg-stone-950/70 border border-amber-500/20 flex flex-col items-center justify-center p-1 text-center pointer-events-none">
              <span className="text-[8px] font-mono uppercase tracking-wider text-stone-400 truncate w-full">
                {fragrance.brand}
              </span>
              <span className="font-serif text-[11px] font-bold text-amber-200 truncate w-full leading-tight">
                {fragrance.name}
              </span>
            </div>
          </div>

          {/* Walnut & Brass Blending Table Coaster */}
          <div className="w-28 h-3 rounded-full bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border border-amber-500/30 shadow-lg mt-1 relative">
            <div className="absolute inset-x-2 top-0.5 h-0.5 bg-amber-500/30 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Identity & Botanical Notes */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${palette.tagBg} ${palette.tagText} border-amber-500/30 font-semibold`}>
            {fragrance.fragrance_family}
          </span>
          <span className="text-[10px] font-mono text-stone-400 px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800">
            {fragrance.concentration || 'Eau de Parfum'}
          </span>
        </div>

        <h3 className="font-serif text-lg font-medium text-stone-100 truncate">
          {fragrance.name}
        </h3>
        <p className="text-xs text-amber-300/80 font-mono truncate">
          {fragrance.brand}
        </p>

        {/* Botanical Micro-Notes */}
        <div className="pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-1.5 text-left text-[11px]">
          <div className="p-1.5 rounded-lg bg-stone-900/50 border border-stone-800/60 truncate">
            <span className="text-[9px] font-mono uppercase text-amber-400/80 block">Top</span>
            <span className="text-stone-300 truncate block font-sans">
              {fragrance.top_notes?.slice(0, 2).join(', ') || 'Volatiles'}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-stone-900/50 border border-stone-800/60 truncate">
            <span className="text-[9px] font-mono uppercase text-amber-400/80 block">Base</span>
            <span className="text-stone-300 truncate block font-sans">
              {fragrance.base_notes?.slice(0, 2).join(', ') || 'Fixatives'}
            </span>
          </div>
        </div>
      </div>

      {/* Spray Volume Stepper Dial */}
      <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between">
        <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
          <Droplets className="w-3.5 h-3.5 text-amber-400" />
          <span>Application:</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSpraysChange(Math.max(1, sprays - 1))}
            disabled={sprays <= 1}
            className="w-6 h-6 rounded-md bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition border border-stone-700"
            aria-label={`Decrease sprays for Specimen ${station}`}
          >
            -
          </button>
          <span className="text-xs font-mono font-bold text-amber-300 min-w-[3.5rem] text-center">
            {sprays} {sprays === 1 ? 'spray' : 'sprays'}
          </span>
          <button
            type="button"
            onClick={() => onSpraysChange(Math.min(5, sprays + 1))}
            disabled={sprays >= 5}
            className="w-6 h-6 rounded-md bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition border border-stone-700"
            aria-label={`Increase sprays for Specimen ${station}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
