import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type GlassLevel = 'ambient' | 'atelier' | 'chamber';
export type GlassRadius = 'sm' | 'md' | 'lg' | 'atelier' | 'luxury' | 'hero' | 'full';

export interface GlassSurfaceProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  level?: GlassLevel;
  radius?: GlassRadius;
  interactive?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const RADIUS_MAP: Record<GlassRadius, string> = {
  sm: 'rounded-lg',          // 8px
  md: 'rounded-xl',          // 12px
  lg: 'rounded-2xl',         // 16px
  atelier: 'rounded-[20px]',  // 20px
  luxury: 'rounded-3xl',     // 24px
  hero: 'rounded-[32px]',    // 32px
  full: 'rounded-full',
};

const LEVEL_MAP: Record<GlassLevel, string> = {
  ambient: 'glass-ambient text-[#1A1613]',
  atelier: 'glass-atelier text-[#1A1613]',
  chamber: 'glass-chamber text-[#F8F5EF]',
};

/**
 * Reusable GlassSurface component for the Olfactory AI design system.
 * Implements the three-tier tactile glassmorphism architecture.
 */
export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  level = 'atelier',
  radius = 'luxury',
  interactive = false,
  bordered = true,
  elevated = false,
  className = '',
  children,
  ...rest
}) => {
  const radiusClass = RADIUS_MAP[radius];
  const levelClass = LEVEL_MAP[level];

  return (
    <motion.div
      className={`
        ${levelClass}
        ${radiusClass}
        ${elevated ? 'shadow-2xl' : ''}
        ${interactive ? 'cursor-pointer transition-transform duration-300' : ''}
        relative overflow-hidden
        ${className}
      `}
      whileHover={interactive ? { y: -2, scale: 1.005 } : undefined}
      whileTap={interactive ? { scale: 0.995 } : undefined}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
