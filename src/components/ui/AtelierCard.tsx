import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type CardVariant = 'feature' | 'information' | 'action' | 'fragrance' | 'insight';

export interface AtelierCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: CardVariant;
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const AtelierCard: React.FC<AtelierCardProps> = ({
  variant = 'information',
  interactive = false,
  className = '',
  children,
  ...rest
}) => {
  let variantClasses = '';

  switch (variant) {
    case 'feature':
      variantClasses = `
        glass-atelier rounded-3xl p-6 sm:p-8
        border border-white/90
        shadow-[0_24px_60px_-12px_rgba(95,70,40,0.12),inset_0_1.5px_1.5px_rgba(255,255,255,1)]
      `;
      break;
    case 'action':
      variantClasses = `
        glass-ambient rounded-2xl p-5 sm:p-6
        border border-[#DCD4C8]
        hover:border-amber-500/40
        shadow-[0_8px_24px_-4px_rgba(95,70,40,0.06)]
      `;
      break;
    case 'fragrance':
      variantClasses = `
        glass-atelier rounded-2xl p-5
        border border-white/80
        shadow-[0_12px_32px_-6px_rgba(95,70,40,0.08)]
      `;
      break;
    case 'insight':
      variantClasses = `
        bg-white/50 backdrop-blur-md rounded-2xl p-4 sm:p-5
        border border-[#DCD4C8]/80
        text-[#5A5046]
        shadow-[0_4px_16px_-2px_rgba(95,70,40,0.03)]
      `;
      break;
    case 'information':
    default:
      variantClasses = `
        glass-ambient rounded-2xl p-5 sm:p-6
        border border-[#DCD4C8]
        shadow-[0_8px_24px_-4px_rgba(95,70,40,0.05)]
      `;
      break;
  }

  return (
    <motion.div
      className={`
        relative overflow-hidden transition-all duration-300
        ${variantClasses}
        ${interactive ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
      whileHover={interactive ? { y: -2, scale: 1.005 } : undefined}
      whileTap={interactive ? { scale: 0.995 } : undefined}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
