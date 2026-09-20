import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

export interface ScentMistProps {
  color?: string;
  density?: 'light' | 'medium' | 'rich';
  className?: string;
  direction?: 'up' | 'radiant';
}

interface ParticleConfig {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const GENERATE_PARTICLES = (count: number): ParticleConfig[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: (i % 5) * 20 - 40 + (Math.sin(i) * 15),
    y: (i * 12) % 40,
    size: 4 + ((i * 3) % 8),
    delay: (i * 0.45) % 3,
    duration: 3 + ((i * 0.7) % 2.5),
  }));
};

const ScentMistComponent: React.FC<ScentMistProps> = ({
  color = 'rgba(217, 119, 6, 0.35)',
  density = 'medium',
  className = '',
  direction = 'up',
}) => {
  const reducedMotion = usePrefersReducedMotion();

  const particleCount = density === 'light' ? 6 : density === 'medium' ? 10 : 16;
  const particles = React.useMemo(() => GENERATE_PARTICLES(particleCount), [particleCount]);

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 opacity-20 filter blur-xl ${className}`}
        style={{ background: color }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-visible flex items-center justify-center -z-5 ${className}`}
    >
      {/* Soft atmospheric plume */}
      <motion.div
        className="absolute w-32 h-32 rounded-full filter blur-2xl"
        style={{ background: color }}
        animate={{
          scale: [0.9, 1.25, 0.9],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating vapor particles */}
      {particles.map((p) => {
        const initialY = direction === 'up' ? 20 : 0;
        const targetY = direction === 'up' ? -65 : -35;

        return (
          <motion.span
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${color} 0%, transparent 80%)`,
              transform: 'translateZ(0)',
              willChange: 'transform, opacity',
            }}
            initial={{
              x: p.x,
              y: initialY,
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              x: [p.x, p.x + (p.id % 2 === 0 ? 12 : -12), p.x],
              y: [initialY, targetY],
              opacity: [0, 0.7, 0],
              scale: [0.6, 1.4, 0.8],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

export const ScentMist = React.memo(ScentMistComponent);

