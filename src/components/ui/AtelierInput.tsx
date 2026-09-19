import React from 'react';
import { Search, X } from 'lucide-react';

export interface AtelierInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  isSearch?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AtelierInput = React.forwardRef<HTMLInputElement, AtelierInputProps>(
  (
    {
      label,
      error,
      hint,
      isSearch = false,
      leftIcon,
      rightIcon,
      onClear,
      size = 'md',
      className = '',
      value,
      onChange,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'py-1.5 px-3 text-xs min-h-[36px]',
      md: 'py-2.5 px-4 text-sm min-h-[44px]',
      lg: 'py-3.5 px-5 text-base min-h-[52px]',
    }[size];

    const hasValue = value !== undefined && value !== '';

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium tracking-wider text-[#5A5046] uppercase font-sans select-none"
          >
            {label}
          </label>
        )}

        <div className="relative w-full flex items-center">
          {isSearch && !leftIcon && (
            <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none shrink-0" />
          )}

          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none shrink-0 text-stone-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            value={value}
            onChange={onChange}
            className={`
              w-full rounded-2xl
              bg-white/70 backdrop-blur-md
              text-[#1A1613] placeholder-stone-400
              border border-[#DCD4C8]
              shadow-[inset_0_1.5px_2px_rgba(80,60,40,0.04)]
              focus:outline-none focus:bg-white focus:border-amber-500 focus-ring-amber
              transition-all duration-200
              ${isSearch || leftIcon ? 'pl-10' : ''}
              ${rightIcon || (onClear && hasValue) ? 'pr-10' : ''}
              ${error ? 'border-rose-300 focus:border-rose-500' : ''}
              ${sizeClasses}
              ${className}
            `}
            {...rest}
          />

          {onClear && hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
              aria-label="Clear input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {rightIcon && !(onClear && hasValue) && (
            <div className="absolute right-3.5 pointer-events-none shrink-0 text-stone-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-[#9A3412] mt-0.5">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#7A6F66] mt-0.5">{hint}</p>
        ) : null}
      </div>
    );
  }
);

AtelierInput.displayName = 'AtelierInput';
