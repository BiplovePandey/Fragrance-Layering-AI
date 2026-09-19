import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`
        w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8
        ${isCenter ? 'text-center items-center sm:items-center' : ''}
        ${className}
      `}
    >
      <div className={`max-w-2xl ${isCenter ? 'mx-auto' : ''}`}>
        {eyebrow && (
          <p className="font-brand text-[11px] tracking-[0.16em] uppercase text-amber-800 font-semibold mb-1.5 select-none">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl sm:text-4xl text-[#1A1613] font-medium tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-[#5A5046] mt-2 leading-relaxed font-sans">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className={`shrink-0 flex items-center ${isCenter ? 'justify-center' : ''}`}>
          {action}
        </div>
      )}
    </div>
  );
};
