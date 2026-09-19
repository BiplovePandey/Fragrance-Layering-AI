import React from 'react';

export interface AtelierSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  unit?: string;
  displayValue?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const AtelierSlider: React.FC<AtelierSliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  unit = '',
  displayValue,
  onChange,
  className = '',
  id,
  ...rest
}) => {
  const sliderId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={sliderId}
            className="text-xs font-medium tracking-wider text-[#5A5046] uppercase font-sans select-none"
          >
            {label}
          </label>
        )}
        <span className="font-mono-lab text-xs font-semibold text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
          {displayValue !== undefined ? displayValue : `${value}${unit}`}
        </span>
      </div>

      <div className="relative flex items-center h-6">
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          style={{
            background: `linear-gradient(to right, #D97706 ${percentage}%, #DCD4C8 ${percentage}%)`,
          }}
          className="
            w-full h-1.5 rounded-lg appearance-none cursor-pointer
            focus:outline-none focus-ring-amber
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-amber-600
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(217,119,6,0.4)]
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-95
          "
          {...rest}
        />
      </div>
    </div>
  );
};
