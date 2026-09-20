import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { ScentMist } from './ScentMist.js';

export interface ScentLoadingProps {
  message?: string;
  subtext?: string;
  className?: string;
}

export const ScentLoading: React.FC<ScentLoadingProps> = ({
  message = 'Consulting the Alchemical Ether…',
  subtext = 'Distilling botanical notes, evaporation volatility and climate synergy',
  className = '',
}) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-center select-none ${className}`}
    >
      {/* Scent Flacon Breathing Silhouette with Rising Vapor */}
      <div className="relative w-24 h-32 flex flex-col items-center justify-center mb-6">
        <ScentMist density="medium" color="rgba(217, 119, 6, 0.35)" />

        {/* Breathing Halo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-amber-500/20 filter blur-xl"
          animate={reducedMotion ? undefined : { scale: [0.85, 1.2, 0.85], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Flacon Silhouette Graphic */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={reducedMotion ? undefined : { y: [-2, 2, -2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Cap */}
          <div className="w-6 h-4 rounded-xs bg-gradient-to-b from-amber-300 to-amber-600 shadow-xs border border-amber-200/50" />
          {/* Neck */}
          <div className="w-3.5 h-1.5 bg-amber-500/80" />
          {/* Bottle Body */}
          <div className="relative w-14 h-18 rounded-xl bg-white/60 backdrop-blur-md border border-amber-300/60 shadow-lg overflow-hidden flex flex-col justify-end">
            {/* Shimmering Liquid Wave */}
            <motion.div
              className="w-full bg-gradient-to-t from-amber-600/70 to-amber-400/40"
              animate={reducedMotion ? { height: '60%' } : { height: ['45%', '70%', '45%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-full h-1 bg-white/40" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <h3 className="font-serif text-xl sm:text-2xl text-[#1A1613] font-medium tracking-tight">
        {message}
      </h3>
      {subtext && (
        <p className="text-xs text-[#7A6F66] mt-1.5 max-w-sm font-mono tracking-wide leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
