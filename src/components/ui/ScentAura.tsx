import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

export interface ScentAuraProps {
  family?: string;
  intensity?: 'subtle' | 'medium' | 'vibrant';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  pulse?: boolean;
}

const FAMILY_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  floral: { from: '#FCE4EE', to: '#F8D5E2', glow: 'rgba(244, 114, 182, 0.25)' },
  fresh: { from: '#D8F8EE', to: '#E6FAF4', glow: 'rgba(85, 191, 163, 0.28)' },
  sweet: { from: '#FFE8D1', to: '#FED7AA', glow: 'rgba(251, 146, 60, 0.25)' },
  woody: { from: '#EEDDC6', to: '#E4CEB0', glow: 'rgba(180, 138, 88, 0.3)' },
  oriental: { from: '#FCECD7', to: '#F5D8B4', glow: 'rgba(217, 119, 6, 0.3)' },
  earthy: { from: '#FCE3D8', to: '#FAD4C0', glow: 'rgba(217, 93, 57, 0.28)' },
  aquatic: { from: '#DCEEFB', to: '#C7E4F9', glow: 'rgba(56, 189, 248, 0.28)' },
  spicy: { from: '#FFE3DC', to: '#FED2C7', glow: 'rgba(239, 68, 68, 0.28)' },
  amber: { from: '#FEF3C7', to: '#FDE68A', glow: 'rgba(245, 158, 11, 0.32)' },
  default: { from: '#F3EEE5', to: '#E8DFD3', glow: 'rgba(201, 149, 59, 0.25)' },
};

const SIZE_CLASSES = {
  sm: 'w-24 h-24 blur-xl',
  md: 'w-44 h-44 blur-2xl',
  lg: 'w-64 h-64 blur-3xl',
  xl: 'w-80 h-80 blur-3xl',
  full: 'w-full h-full blur-3xl',
};

const INTENSITY_OPACITY = {
  subtle: 0.35,
  medium: 0.6,
  vibrant: 0.85,
};

export const ScentAura: React.FC<ScentAuraProps> = ({
  family = 'default',
  intensity = 'medium',
  size = 'md',
  className = '',
  pulse = true,
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const normalizedKey = (family || 'default').toLowerCase().trim();
  const matchedKey = Object.keys(FAMILY_COLORS).find((k) => normalizedKey.includes(k)) || 'default';
  const colors = FAMILY_COLORS[matchedKey] || FAMILY_COLORS.default;
  const baseOpacity = INTENSITY_OPACITY[intensity];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full flex items-center justify-center transition-opacity duration-700 ${SIZE_CLASSES[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, ${colors.glow} 0%, ${colors.from}40 45%, transparent 70%)`,
        opacity: baseOpacity,
      }}
    >
      {pulse && !reducedMotion && (
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 65%)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [baseOpacity * 0.7, baseOpacity, baseOpacity * 0.7],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};
