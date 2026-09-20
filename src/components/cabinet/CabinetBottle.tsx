import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Shirt, FlaskConical, Heart, Droplet } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { HeroFlacon } from '../atelier/HeroFlacon.js';
import { getCabinetPalette } from './CabinetAtmosphere.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { MOTION_SPRINGS } from '../../motion/config.js';

interface CabinetBottleProps {
  fragrance: Fragrance;
  fillLevel?: number; // 0 to 100
  isFavorite?: boolean;
  onInspect: (fragrance: Fragrance) => void;
  onWear: (fragrance: Fragrance) => void;
  onLayer: (fragrance: Fragrance) => void;
  onToggleFavorite: (fragranceId: number) => void;
  onAdjustLevel?: (fragranceId: number, level: number) => void;
}

export const CabinetBottle: React.FC<CabinetBottleProps> = ({
  fragrance,
  fillLevel = 80,
  isFavorite = false,
  onInspect,
  onWear,
  onLayer,
  onToggleFavorite
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const palette = getCabinetPalette(fragrance.fragrance_family);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 6), y: x * 6 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group flex flex-col items-center justify-end min-w-[150px] sm:min-w-[170px] max-w-[200px] select-none pt-6 pb-2"
      style={{ perspective: 1000 }}
    >
      {/* Background Scent Halo & Environmental Glow */}
      <div
        className="absolute -top-4 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background: palette.ambientGlow,
          opacity: isHovered ? 0.9 : 0.45
        }}
      />

      {/* Favorite Ribbon Badge (if marked favorite) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(fragrance.id);
        }}
        aria-label={isFavorite ? `Remove ${fragrance.name} from curated favorites` : `Add ${fragrance.name} to curated favorites`}
        className={`absolute top-2 right-2 z-30 p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
          isFavorite
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
            : 'bg-stone-900/60 border-stone-700/40 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-stone-200'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
      </button>

      {/* Physical Flacon with Tilt & Lift Physics */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                y: isHovered ? -8 : 0,
                rotateX: tilt.x,
                rotateY: tilt.y
              }
        }
        transition={MOTION_SPRINGS.spatialLayout}
        onClick={() => onInspect(fragrance)}
        className="relative z-10 cursor-pointer flex flex-col items-center"
      >
        <HeroFlacon
          fragrance={fragrance}
          size="mini"
          onClick={() => onInspect(fragrance)}
        />
      </motion.div>

      {/* Physical Bottle Contact Shadow on Shelf */}
      <div
        className="w-24 h-4 rounded-full mt-1 blur-[3px] pointer-events-none transition-all duration-300"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(10,8,6,0.5) 60%, transparent 100%)',
          transform: isHovered ? 'scale(1.15) translateY(2px)' : 'scale(1)',
          opacity: isHovered ? 0.65 : 0.95
        }}
      />

      {/* Flacon Plaque (Identity & Fluid Volume) */}
      <div
        onClick={() => onInspect(fragrance)}
        className="w-full mt-2.5 px-3 py-2.5 rounded-xl border border-stone-800/80 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center text-center shadow-lg group-hover:border-amber-500/40 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
        style={{
          background: palette.plaqueBg
        }}
      >
        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 truncate max-w-full">
          {fragrance.brand}
        </span>
        <h4 className="font-serif text-sm font-medium text-stone-100 mt-0.5 truncate max-w-full line-clamp-1 group-hover:text-amber-200 transition-colors">
          {fragrance.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-stone-400 font-sans">
          <span className="truncate">{fragrance.fragrance_family}</span>
          <span className="text-stone-600">&bull;</span>
          <span className="text-amber-400/90 font-mono text-[9px]">{fragrance.concentration || 'Parfum'}</span>
        </div>

        {/* Liquid Volume Bar */}
        <div className="w-full mt-2 pt-2 border-t border-stone-800/60 flex items-center justify-between text-[9px] font-mono text-stone-400">
          <span className="flex items-center gap-1 text-stone-500">
            <Droplet className="w-2.5 h-2.5 text-amber-500/80" />
            <span>Vol.</span>
          </span>
          <div className="w-14 h-1.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${fillLevel}%`,
                background: `linear-gradient(to right, ${palette.brassAccent}, #F59E0B)`
              }}
            />
          </div>
          <span className="text-amber-300/90 font-semibold">{fillLevel}%</span>
        </div>
      </div>

      {/* Floating Tactical Interaction Action Strip (Revealed on Hover / Focus) */}
      <div
        className={`w-full mt-2 flex items-center justify-center gap-1 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none md:pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWear(fragrance);
          }}
          title="Wear Today"
          aria-label={`Wear ${fragrance.name} as scent of the day`}
          className="p-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-medium text-[10px] flex items-center justify-center transition shadow-sm cursor-pointer"
        >
          <Shirt className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect(fragrance);
          }}
          title="Inspect Specimen"
          aria-label={`Inspect ${fragrance.name} in collector's view`}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] flex items-center justify-center transition border border-stone-700/60 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLayer(fragrance);
          }}
          title="Formulate a Chord (Layer Lab)"
          aria-label={`Formulate layering chord with ${fragrance.name}`}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[10px] flex items-center justify-center transition border border-stone-700/60 cursor-pointer"
        >
          <FlaskConical className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
