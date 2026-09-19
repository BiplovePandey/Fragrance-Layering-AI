import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AtelierButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs font-medium gap-1.5 rounded-xl min-h-[36px]',
  md: 'px-5 py-2.5 text-sm font-medium gap-2 rounded-2xl min-h-[44px]',
  lg: 'px-7 py-3.5 text-base font-semibold gap-2.5 rounded-2xl min-h-[50px]',
};

export const AtelierButton: React.FC<AtelierButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled = false,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = `
        bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600
        text-[#1A1613] font-semibold
        border border-amber-400/40
        shadow-[0_4px_16px_-2px_rgba(217,119,6,0.3),inset_0_1px_1px_rgba(255,255,255,0.6)]
        hover:shadow-[0_8px_24px_-2px_rgba(217,119,6,0.42),inset_0_1px_1px_rgba(255,255,255,0.8)]
        hover:brightness-[1.03]
        active:brightness-[0.98]
      `;
      break;
    case 'secondary':
      variantClasses = `
        bg-white/70 backdrop-blur-md
        text-[#1A1613]
        border border-[#DCD4C8]
        shadow-[0_2px_8px_-2px_rgba(95,70,40,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]
        hover:bg-white/90 hover:border-amber-500/40 hover:text-amber-900
        hover:shadow-[0_4px_16px_-2px_rgba(95,70,40,0.1)]
      `;
      break;
    case 'tertiary':
      variantClasses = `
        bg-transparent
        text-[#5A5046]
        border border-transparent
        hover:text-[#1A1613] hover:bg-black/[0.04]
      `;
      break;
    case 'destructive':
      variantClasses = `
        bg-stone-100/90 backdrop-blur-md
        text-[#9A3412]
        border border-rose-200
        shadow-[0_2px_8px_-2px_rgba(154,52,18,0.08)]
        hover:bg-rose-50/90 hover:border-rose-300
      `;
      break;
  }

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center
        tracking-tight whitespace-nowrap
        select-none focus:outline-none focus-ring-amber
        transition-colors duration-200
        ${SIZE_CLASSES[size]}
        ${variantClasses}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!isDisabled ? { y: -1, scale: 1.01 } : undefined}
      whileTap={!isDisabled ? { y: 0.5, scale: 0.99 } : undefined}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
};
