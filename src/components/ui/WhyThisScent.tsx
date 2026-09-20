import React from 'react';
import { ProgressiveDisclosure } from './ProgressiveDisclosure.js';
import { Fragrance, WeatherCondition } from '../../types.js';
import { Wind, Clock, Sparkles } from 'lucide-react';

export interface WhyThisScentProps {
  fragrance: Fragrance;
  weather?: WeatherCondition;
  reason?: string;
  harmonyScore?: number;
  secondaryFragrance?: Fragrance;
  className?: string;
}

export const WhyThisScent: React.FC<WhyThisScentProps> = ({
  fragrance,
  weather,
  reason,
  harmonyScore,
  secondaryFragrance,
  className = '',
}) => {
  const level2Content = (
    <div className="space-y-3">
      {/* Primary Narrative Reason */}
      {reason && (
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[#3D352E] leading-relaxed">
          <span className="font-semibold text-amber-900 block mb-0.5 text-[11px] uppercase tracking-wider">
            Olfactory Rationale
          </span>
          <p className="italic font-serif text-sm">“{reason}”</p>
        </div>
      )}

      {/* Weather & Environmental Resonance */}
      {weather && (
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <Wind className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <div>
              <span className="text-stone-500 block text-[9px] uppercase">Climate Match</span>
              <span className="font-medium text-stone-800">
                {weather.temperature_c}°C &bull; {weather.season}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div>
              <span className="text-stone-500 block text-[9px] uppercase">Longevity</span>
              <span className="font-medium text-stone-800">
                {fragrance.longevity_hours || 6} to {(fragrance.longevity_hours || 6) + 2} Hours
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Note Architecture */}
      <div>
        <span className="text-stone-500 text-[10px] font-mono uppercase tracking-wider block mb-1.5">
          Fragrance Pyramid
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(fragrance.top_notes || []).slice(0, 3).map((n) => (
            <span
              key={n}
              className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] text-stone-700"
            >
              🌿 Top: {n}
            </span>
          ))}
          {(fragrance.middle_notes || []).slice(0, 2).map((n) => (
            <span
              key={n}
              className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] text-rose-800"
            >
              🌸 Heart: {n}
            </span>
          ))}
          {(fragrance.base_notes || []).slice(0, 2).map((n) => (
            <span
              key={n}
              className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] text-amber-900 font-medium"
            >
              🪵 Base: {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const level3Content = (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-stone-400 text-[10px]">
        <span>Scent Family Affinity:</span>
        <span className="text-amber-300 font-bold">{fragrance.scent_family || 'Woody'}</span>
      </div>

      {harmonyScore !== undefined && (
        <div className="flex items-center justify-between text-stone-400 text-[10px]">
          <span>Calculated Scent Harmony:</span>
          <span className="text-emerald-400 font-bold">{Math.round(harmonyScore)}%</span>
        </div>
      )}

      {/* 8D Vector Preview */}
      {fragrance.vector && fragrance.vector.length > 0 && (
        <div className="pt-1.5">
          <span className="text-stone-400 text-[9px] block mb-1">
            8-D Olfactory Vector Embeddings:
          </span>
          <div className="grid grid-cols-4 gap-1 text-[9px]">
            {fragrance.vector.slice(0, 8).map((val, i) => (
              <div
                key={i}
                className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-center"
              >
                <span className="text-stone-500">v{i + 1}:</span>{' '}
                <span className="text-amber-200 font-mono">{val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {secondaryFragrance && (
        <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-amber-200 text-[10px]">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Alchemical pairing with {secondaryFragrance.name}</span>
        </div>
      )}
    </div>
  );

  return (
    <ProgressiveDisclosure
      curiousTitle="Why this scent? ▾"
      level2Content={level2Content}
      level3Content={level3Content}
      className={className}
    />
  );
};
