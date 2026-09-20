import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { GPU_ACCELERATED_STYLE } from '../../motion/performance.js';

export interface MoodConfig {
  id: string;
  emoji: string;
  label: string;
  familyHint?: string;
  glowColor?: string;
}

export const MOOD_PRESETS: MoodConfig[] = [
  { id: 'confident', emoji: '✨', label: 'Confident', familyHint: 'Amber / Woody', glowColor: 'rgba(217, 119, 6, 0.35)' },
  { id: 'mysterious', emoji: '🌙', label: 'Mysterious', familyHint: 'Oriental / Incense', glowColor: 'rgba(126, 34, 206, 0.35)' },
  { id: 'fresh', emoji: '🌿', label: 'Fresh', familyHint: 'Citrus / Green', glowColor: 'rgba(13, 148, 136, 0.35)' },
  { id: 'magnetic', emoji: '🔥', label: 'Magnetic', familyHint: 'Spicy / Leather', glowColor: 'rgba(225, 29, 72, 0.35)' },
  { id: 'energetic', emoji: '☀️', label: 'Energetic', familyHint: 'Aquatic / Aldehydic', glowColor: 'rgba(234, 88, 12, 0.35)' },
  { id: 'calm', emoji: '🧘', label: 'Calm', familyHint: 'Khus / Sandalwood', glowColor: 'rgba(101, 163, 13, 0.35)' },
  { id: 'romantic', emoji: '🌸', label: 'Romantic', familyHint: 'Rose / Jasmine', glowColor: 'rgba(236, 72, 153, 0.35)' },
  { id: 'grounded', emoji: '🪵', label: 'Grounded', familyHint: 'Cedar / Vetiver', glowColor: 'rgba(180, 83, 9, 0.35)' },
];

export interface MoodChipProps {
  mood: MoodConfig;
  isSelected?: boolean;
  onSelect: (mood: MoodConfig) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MoodChip: React.FC<MoodChipProps> = ({
  mood,
  isSelected = false,
  onSelect,
  size = 'md',
  className = '',
}) => {
  const reducedMotion = usePrefersReducedMotion();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl min-h-[36px]',
    md: 'px-4 py-2.5 text-sm gap-2.5 rounded-2xl min-h-[46px]',
    lg: 'px-5 py-3 text-base gap-3 rounded-2xl min-h-[54px]',
  }[size];

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mood)}
      whileHover={reducedMotion ? undefined : { scale: 1.03, y: -1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={GPU_ACCELERATED_STYLE}
      className={`relative inline-flex items-center justify-center font-medium cursor-pointer transition-colors duration-300 select-none ${sizeClasses} ${
        isSelected
          ? 'bg-white text-[#1A1613] border-2 border-amber-500 shadow-[0_8px_24px_-4px_rgba(217,119,6,0.3)]'
          : 'bg-white/80 hover:bg-white text-[#3D352E] hover:text-[#1A1613] border border-[#DCD4C8] shadow-xs'
      } ${className}`}
      aria-pressed={isSelected}
    >
      {/* Selected Radial Ambient Glow */}
      {isSelected && (
        <motion.div
          layoutId="mood-active-glow"
          className="absolute -inset-1 rounded-2xl -z-10 filter blur-md pointer-events-none"
          style={{ background: mood.glowColor || 'rgba(217, 119, 6, 0.3)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      <span className="text-lg leading-none" role="img" aria-hidden="true">
        {mood.emoji}
      </span>
      <span className="font-sans font-semibold tracking-tight">{mood.label}</span>

      {mood.familyHint && (
        <span
          className={`text-[10px] ml-1 transition-opacity ${
            isSelected ? 'text-amber-800/80 font-medium' : 'text-[#7A6F66] opacity-70'
          }`}
        >
          &bull; {mood.familyHint}
        </span>
      )}
    </motion.button>
  );
};
