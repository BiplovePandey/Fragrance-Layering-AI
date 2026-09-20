import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ScentAura } from './ScentAura.js';
import { ScentMist } from './ScentMist.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { GPU_ACCELERATED_STYLE } from '../../motion/performance.js';

export interface ScentBottleProps {
  name?: string;
  brand?: string;
  family?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fillLevel?: number; // 0 to 100
  showAura?: boolean;
  showMist?: boolean;
  interactive?: boolean;
  floating?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_SPECS = {
  sm: {
    container: 'w-20 h-28',
    cap: 'w-6 h-5',
    neck: 'w-4 h-2',
    body: 'w-16 h-20 rounded-xl',
    label: 'text-[9px]',
    brand: 'text-[7px]',
  },
  md: {
    container: 'w-28 h-40',
    cap: 'w-9 h-7',
    neck: 'w-6 h-3',
    body: 'w-24 h-30 rounded-2xl',
    label: 'text-[11px]',
    brand: 'text-[8px]',
  },
  lg: {
    container: 'w-36 h-52',
    cap: 'w-11 h-9',
    neck: 'w-8 h-3.5',
    body: 'w-32 h-40 rounded-2xl',
    label: 'text-xs',
    brand: 'text-[9px]',
  },
  xl: {
    container: 'w-48 h-68',
    cap: 'w-16 h-12',
    neck: 'w-10 h-4.5',
    body: 'w-42 h-52 rounded-3xl',
    label: 'text-sm',
    brand: 'text-[10px]',
  },
};

const LIQUID_GRADIENTS: Record<string, string> = {
  floral: 'linear-gradient(180deg, rgba(251, 113, 133, 0.45) 0%, rgba(244, 63, 94, 0.75) 100%)',
  fresh: 'linear-gradient(180deg, rgba(45, 212, 191, 0.4) 0%, rgba(13, 148, 136, 0.7) 100%)',
  sweet: 'linear-gradient(180deg, rgba(251, 146, 60, 0.45) 0%, rgba(234, 88, 12, 0.75) 100%)',
  woody: 'linear-gradient(180deg, rgba(217, 119, 6, 0.4) 0%, rgba(180, 83, 9, 0.75) 100%)',
  oriental: 'linear-gradient(180deg, rgba(245, 158, 11, 0.5) 0%, rgba(194, 65, 12, 0.8) 100%)',
  earthy: 'linear-gradient(180deg, rgba(217, 93, 57, 0.45) 0%, rgba(146, 64, 14, 0.8) 100%)',
  aquatic: 'linear-gradient(180deg, rgba(56, 189, 248, 0.4) 0%, rgba(3, 105, 161, 0.75) 100%)',
  spicy: 'linear-gradient(180deg, rgba(239, 68, 68, 0.45) 0%, rgba(185, 28, 28, 0.8) 100%)',
  amber: 'linear-gradient(180deg, rgba(251, 191, 36, 0.5) 0%, rgba(217, 119, 6, 0.85) 100%)',
  default: 'linear-gradient(180deg, rgba(217, 119, 6, 0.45) 0%, rgba(180, 83, 9, 0.8) 100%)',
};

const ScentBottleComponent: React.FC<ScentBottleProps> = ({
  name = 'Scent of the Atelier',
  brand = 'Olfactory AI',
  family = 'woody',
  size = 'md',
  fillLevel = 75,
  showAura = true,
  showMist = false,
  interactive = true,
  floating = true,
  className = '',
  onClick,
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const bottleRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 20 });

  const specs = SIZE_SPECS[size];
  const normalizedKey = (family || 'default').toLowerCase().trim();
  const matchedKey = Object.keys(LIQUID_GRADIENTS).find((k) => normalizedKey.includes(k)) || 'default';
  const liquidGradient = LIQUID_GRADIENTS[matchedKey];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || reducedMotion || !bottleRef.current) return;
    const rect = bottleRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (!interactive || reducedMotion) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={bottleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${specs.container} ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* Scent Aura Backdrop */}
      {showAura && (
        <ScentAura
          family={family}
          size={size === 'xl' ? 'xl' : size === 'lg' ? 'lg' : 'md'}
          intensity="medium"
        />
      )}

      {/* Optional Fragrance Mist */}
      {showMist && <ScentMist density="medium" direction="up" />}

      {/* Main Animated Flacon */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-full h-full"
        style={{
          ...GPU_ACCELERATED_STYLE,
          rotateX: interactive && !reducedMotion ? rotateX : 0,
          rotateY: interactive && !reducedMotion ? rotateY : 0,
        }}
        animate={{
          y: floating && !reducedMotion ? [-3, 3, -3] : 0,
        }}
        whileHover={interactive && !reducedMotion ? { scale: 1.04 } : undefined}
        whileTap={interactive && !reducedMotion ? { scale: 0.97 } : undefined}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Flacon Cap (Gold/Brushed Brass) */}
        <div
          className={`relative ${specs.cap} rounded-sm shadow-md flex items-center justify-center overflow-hidden`}
          style={{
            background: 'linear-gradient(135deg, #E6C887 0%, #C9953B 50%, #8E651E 100%)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Cap metallic highlight */}
          <div className="absolute inset-x-1 top-0.5 h-[1px] bg-white/70" />
          <div className="w-1 h-full bg-white/20 blur-[1px] absolute left-2" />
        </div>

        {/* Atomizer Collar Neck */}
        <div
          className={`${specs.neck} bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 shadow-inner`}
        />

        {/* Glass Bottle Body */}
        <div
          className={`relative ${specs.body} overflow-hidden shadow-2xl flex flex-col justify-end`}
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 245, 239, 0.25) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255, 255, 255, 0.65)',
            boxShadow:
              '0 12px 36px -4px rgba(95, 70, 40, 0.16), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Liquid Fill */}
          <div
            className="w-full transition-all duration-700 relative overflow-hidden"
            style={{
              height: `${Math.max(15, Math.min(100, fillLevel))}%`,
              background: liquidGradient,
            }}
          >
            {/* Liquid Surface Meniscus */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/40 shadow-xs" />
            {/* Liquid Shimmer Wave */}
            {!reducedMotion && (
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.8) 0%, transparent 60%)',
                }}
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>

          {/* Minimalist Flacon Parchment Label */}
          <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
            <div className="px-2 py-1 rounded-sm bg-white/90 backdrop-blur-xs border border-[#E3DACB] shadow-xs text-center max-w-[85%]">
              <p
                className={`font-serif tracking-tight text-[#1A1613] font-medium leading-none truncate ${specs.label}`}
              >
                {name}
              </p>
              {brand && (
                <p
                  className={`font-mono text-[#7A6F66] uppercase tracking-widest leading-none mt-0.5 truncate ${specs.brand}`}
                >
                  {brand}
                </p>
              )}
            </div>
          </div>

          {/* Glass Specular Reflection Highlight */}
          <div
            className="absolute inset-y-1 left-1.5 w-1 rounded-full bg-gradient-to-b from-white/90 via-white/40 to-transparent pointer-events-none"
          />
        </div>
      </motion.div>
    </div>
  );
};

export const ScentBottle = React.memo(ScentBottleComponent);
