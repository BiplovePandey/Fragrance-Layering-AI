import React from 'react';
import { motion } from 'motion/react';

export interface AtelierChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const AtelierChip: React.FC<AtelierChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';

  return (
    <motion.button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5
        rounded-full border whitespace-nowrap
        font-medium select-none
        transition-all duration-200
        ${sizeClass}
        ${selected
          ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-[0_2px_8px_-2px_rgba(217,119,6,0.3)] font-semibold'
          : 'bg-white/70 text-[#5A5046] border-[#DCD4C8] hover:bg-white hover:border-amber-500/40 hover:text-[#1A1613] shadow-sm'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus-ring-amber
        ${className}
      `}
      whileHover={!disabled ? { y: -1 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
};
