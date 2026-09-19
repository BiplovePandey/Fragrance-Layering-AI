import React from 'react';
import { Compass } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        p-8 sm:p-12 rounded-3xl
        glass-ambient border border-[#DCD4C8]
        max-w-md mx-auto
        ${className}
      `}
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-amber-800 mb-4 shadow-sm">
        {icon || <Compass className="w-6 h-6 stroke-[1.5]" />}
      </div>

      <h3 className="font-display text-2xl text-[#1A1613] font-medium tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-[#7A6F66] mt-2 max-w-sm leading-relaxed font-sans">
        {description}
      </p>

      {action && <div className="mt-6 flex items-center justify-center">{action}</div>}
    </div>
  );
};
