import React from 'react';
import { motion } from 'motion/react';
import { Heart, Briefcase, GraduationCap, PartyPopper, Compass, Moon, Sun, Crown } from 'lucide-react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { GPU_ACCELERATED_STYLE } from '../../motion/performance.js';

export interface OccasionConfig {
  id: string;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

export const OCCASION_PRESETS: OccasionConfig[] = [
  { id: 'date', label: 'Date', tagline: 'Intimate, warm & alluring', icon: Heart, accentColor: '#E11D48' },
  { id: 'work', label: 'Work', tagline: 'Crisp, polite & discreet', icon: Briefcase, accentColor: '#0284C7' },
  { id: 'college', label: 'College', tagline: 'Youthful, breezy & clean', icon: GraduationCap, accentColor: '#059669' },
  { id: 'party', label: 'Party', tagline: 'Bold, diffusive & radiant', icon: PartyPopper, accentColor: '#D97706' },
  { id: 'travel', label: 'Travel', tagline: 'Refreshing & versatile', icon: Compass, accentColor: '#7C3AED' },
  { id: 'evening', label: 'Evening', tagline: 'Deep, mysterious & rich', icon: Moon, accentColor: '#475569' },
  { id: 'everyday', label: 'Everyday', tagline: 'Effortless signature trail', icon: Sun, accentColor: '#D97706' },
  { id: 'special', label: 'Special Occasion', tagline: 'Grand, regal & unforgettable', icon: Crown, accentColor: '#B45309' },
];

export interface OccasionCardProps {
  occasion: OccasionConfig;
  isSelected?: boolean;
  onSelect: (occ: OccasionConfig) => void;
  className?: string;
}

export const OccasionCard: React.FC<OccasionCardProps> = ({
  occasion,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const IconComponent = occasion.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(occasion)}
      whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={GPU_ACCELERATED_STYLE}
      className={`relative flex flex-col items-start p-4 rounded-2xl cursor-pointer text-left transition-all duration-300 w-full select-none ${
        isSelected
          ? 'bg-white text-[#1A1613] border-2 border-amber-500 shadow-[0_10px_28px_-4px_rgba(217,119,6,0.25)]'
          : 'bg-white/70 hover:bg-white text-[#3D352E] hover:text-[#1A1613] border border-[#DCD4C8] shadow-xs'
      } ${className}`}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between w-full mb-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
          style={{
            backgroundColor: isSelected ? `${occasion.accentColor}15` : 'rgba(0, 0, 0, 0.04)',
            color: isSelected ? occasion.accentColor : '#5A5046',
          }}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        {isSelected && (
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(217,119,6,0.8)]" />
        )}
      </div>

      <span className="font-serif text-base font-semibold tracking-tight text-[#1A1613] block">
        {occasion.label}
      </span>
      <span className="text-[11px] text-[#7A6F66] mt-0.5 leading-snug line-clamp-1">
        {occasion.tagline}
      </span>
    </motion.button>
  );
};
