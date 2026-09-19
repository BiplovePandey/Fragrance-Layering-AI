import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface AtelierSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AtelierSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: AtelierSelectOption[];
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AtelierSelect = React.forwardRef<HTMLSelectElement, AtelierSelectProps>(
  (
    {
      label,
      options = [],
      error,
      hint,
      size = 'md',
      className = '',
      children,
      id,
      ...rest
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'py-1.5 pl-3 pr-8 text-xs min-h-[36px]',
      md: 'py-2.5 pl-4 pr-10 text-sm min-h-[44px]',
      lg: 'py-3.5 pl-5 pr-12 text-base min-h-[52px]',
    }[size];

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium tracking-wider text-[#5A5046] uppercase font-sans select-none"
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            className={`
              w-full appearance-none rounded-2xl
              bg-white/80 backdrop-blur-md
              text-[#1A1613]
              border border-[#DCD4C8]
              shadow-[inset_0_1px_2px_rgba(80,60,40,0.03)]
              focus:outline-none focus:border-amber-500 focus-ring-amber
              transition-all duration-200 cursor-pointer
              ${error ? 'border-rose-300' : ''}
              ${sizeClasses}
              ${className}
            `}
            {...rest}
          >
            {children ||
              options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))}
          </select>

          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
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

AtelierSelect.displayName = 'AtelierSelect';
