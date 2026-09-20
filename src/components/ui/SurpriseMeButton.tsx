import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { GPU_ACCELERATED_STYLE } from '../../motion/performance.js';

export interface SurpriseMeButtonProps {
  onClick: () => void;
  size?: 'md' | 'lg';
  className?: string;
  label?: string;
}

export const SurpriseMeButton: React.FC<SurpriseMeButtonProps> = ({
  onClick,
  size = 'md',
  className = '',
  label = 'Surprise Me',
}) => {
  const reducedMotion = usePrefersReducedMotion();

  const sizeStyles =
    size === 'lg'
      ? 'px-6 py-3.5 text-base gap-2.5 rounded-2xl min-h-[52px]'
      : 'px-5 py-2.5 text-sm gap-2 rounded-2xl min-h-[44px]';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { scale: 1.03, y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={GPU_ACCELERATED_STYLE}
      className={`relative inline-flex items-center justify-center font-serif tracking-wide cursor-pointer overflow-hidden group select-none ${sizeStyles} ${className}`}
    >
      {/* Background with subtle warm gold aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/90 via-white/95 to-amber-100/90 backdrop-blur-md border border-amber-300/60 shadow-[0_4px_20px_-2px_rgba(217,119,6,0.18)] transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_6px_28px_-2px_rgba(217,119,6,0.28)]" />

      {/* Shimmer light sweep */}
      {!reducedMotion && (
        <motion.div
          className="absolute -inset-full bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none transform -skew-x-12"
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      )}

      {/* Content */}
      <span className="relative flex items-center gap-2 text-[#1A1613] font-semibold">
        <Sparkles className="w-4 h-4 text-amber-600 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        <span className="tracking-tight font-sans">{label}</span>
      </span>
    </motion.button>
  );
};
