import React from 'react';
import { motion } from 'motion/react';
import { Clock, Wind, Sparkles } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { EvaporationTimeline } from '../EvaporationTimeline.js';
import { GlassSurface } from '../ui/GlassSurface.js';

interface DrydownSectionProps {
  fragrance: Fragrance;
}

export const DrydownSection: React.FC<DrydownSectionProps> = ({ fragrance }) => {
  return (
    <section className="relative my-10 py-4">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <GlassSurface
        surface="atelier"
        radius="luxury"
        className="p-6 sm:p-10 space-y-6"
      >
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8DFD3]/75 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-mono mb-2 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>CHAPTER III &bull; THE DRYDOWN</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#1A1613] tracking-tight">
              Fragrance Evolution &amp; Volatility
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5046] mt-1 max-w-xl leading-relaxed">
              Observe how <span className="font-serif italic text-[#1A1613]">{fragrance.name}</span> transforms over time — from radiant top note diffusion into an intimate, fixated skin accord.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs text-[#7A6F66]">
            <Wind className="w-3.5 h-3.5 text-teal-700" />
            <span>Lifespan: {fragrance.longevity_hours || 8}+ Hours</span>
          </div>
        </div>

        {/* Embedded Interactive Scrubber */}
        <EvaporationTimeline fragrance={fragrance} className="!p-0 !border-0 !shadow-none !bg-transparent" />
      </GlassSurface>
    </section>
  );
};
