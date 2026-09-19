import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';

export type BadgeVariant =
  | 'default'
  | 'family'
  | 'concentration'
  | 'heritage'
  | 'weather'
  | 'occasion'
  | 'compatibility'
  | 'verified'
  | 'wardrobe'
  | 'active_filter';

export interface AtelierBadgeProps {
  variant?: BadgeVariant;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const AtelierBadge: React.FC<AtelierBadgeProps> = ({
  variant = 'default',
  label,
  icon,
  active = false,
  onRemove,
  onClick,
  size = 'md',
  className = '',
}) => {
  let styleClasses = 'bg-stone-100/80 text-[#5A5046] border-stone-200/80';

  switch (variant) {
    case 'family':
      styleClasses = 'bg-amber-50/70 text-amber-900/90 border-amber-200/60';
      break;
    case 'concentration':
      styleClasses = 'bg-white/80 text-[#1A1613] border-[#DCD4C8] font-mono text-[11px] tracking-wider uppercase';
      break;
    case 'heritage':
      styleClasses = 'bg-orange-50/80 text-[#9A3412] border-orange-200/70';
      break;
    case 'weather':
      styleClasses = 'bg-teal-50/70 text-teal-900/90 border-teal-200/60';
      break;
    case 'occasion':
      styleClasses = 'bg-stone-100/90 text-stone-800 border-stone-300/70';
      break;
    case 'compatibility':
      styleClasses = 'bg-amber-100/80 text-amber-950 border-amber-300/80 font-semibold';
      break;
    case 'verified':
      styleClasses = 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80';
      break;
    case 'wardrobe':
      styleClasses = 'bg-stone-100/90 text-[#1A1613] border-stone-300/80 font-medium';
      break;
    case 'active_filter':
      styleClasses = active
        ? 'bg-amber-500 text-stone-950 border-amber-600 font-semibold shadow-sm'
        : 'bg-white/60 text-[#5A5046] border-[#DCD4C8] hover:bg-white hover:text-[#1A1613]';
      break;
    default:
      break;
  }

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[11px] min-h-[22px]'
    : 'px-3 py-1 text-xs min-h-[28px]';

  const isClickable = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        rounded-full border whitespace-nowrap select-none
        transition-all duration-200
        ${sizeClasses}
        ${styleClasses}
        ${isClickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {icon ? (
        <span className="inline-flex shrink-0 text-current">{icon}</span>
      ) : variant === 'verified' ? (
        <Check className="w-3 h-3 text-emerald-700 shrink-0" />
      ) : null}

      <span className="truncate">{label}</span>

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-amber-500"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3 h-3 text-current" />
        </button>
      )}
    </span>
  );
};
