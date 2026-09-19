import React from 'react';

export type ScoreType = 'atmosphere' | 'harmony' | 'longevity' | 'compatibility' | 'confidence';

export interface ScoreBadgeProps {
  score: number; // 0 - 100
  type?: ScoreType;
  label?: string;
  explanation?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TYPE_LABELS: Record<ScoreType, string> = {
  atmosphere: 'Atmospheric Fit',
  harmony: 'Synergy Harmony',
  longevity: 'Longevity Index',
  compatibility: 'Compatibility',
  confidence: 'Confidence Score',
};

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  type = 'atmosphere',
  label,
  explanation,
  size = 'md',
  className = '',
}) => {
  const displayLabel = label || TYPE_LABELS[type];

  let tierName = 'Moderate';
  let tierColor = 'text-amber-800 bg-amber-50/80 border-amber-200/60';
  if (score >= 90) {
    tierName = 'Exemplary Match';
    tierColor = 'text-amber-950 bg-amber-100/80 border-amber-300/80';
  } else if (score >= 80) {
    tierName = 'Harmonic Synergy';
    tierColor = 'text-amber-900 bg-amber-50/90 border-amber-200/80';
  } else if (score < 65) {
    tierName = 'Experimental';
    tierColor = 'text-stone-700 bg-stone-100/90 border-stone-200';
  }

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="font-mono-lab text-sm font-bold text-amber-900">
          {score}%
        </span>
        <span className="text-xs font-medium text-[#5A5046]">
          {displayLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`
        inline-flex flex-col gap-1 p-3.5 sm:p-4 rounded-2xl
        bg-white/75 backdrop-blur-md border border-[#DCD4C8]
        shadow-[0_4px_16px_-2px_rgba(95,70,40,0.05)]
        ${className}
      `}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono-lab text-2xl sm:text-3xl font-bold tracking-tight text-amber-950">
          {score}%
        </span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${tierColor}`}>
          {tierName}
        </span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1613] font-sans mt-0.5">
        {displayLabel}
      </p>

      {explanation && (
        <p className="text-[11px] leading-relaxed text-[#7A6F66] mt-0.5">
          {explanation}
        </p>
      )}
    </div>
  );
};
