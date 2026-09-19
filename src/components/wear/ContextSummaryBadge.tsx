import React from 'react';
import {
  CloudSun,
  Clock,
  Briefcase,
  Shirt,
  Sparkles,
  Layers,
  Edit3,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { NormalizedOlfactoryContext, RawOlfactoryContextInput } from '../../types.js';

interface ContextSummaryBadgeProps {
  normalized?: NormalizedOlfactoryContext | null;
  rawInput?: RawOlfactoryContextInput;
  isWardrobeOnly: boolean;
  onEditContext: () => void;
  onRecalculate: () => void;
  isLoading?: boolean;
}

export const ContextSummaryBadge: React.FC<ContextSummaryBadgeProps> = ({
  normalized,
  rawInput,
  isWardrobeOnly,
  onEditContext,
  onRecalculate,
  isLoading = false
}) => {
  // Extract real context values without fabrication
  const weatherTemp = normalized?.weather.temperatureC ?? rawInput?.weather?.temperature_c;
  const weatherHumidity = normalized?.weather.humidityPercent ?? rawInput?.weather?.humidity_pct;
  const weatherLabel = weatherTemp !== undefined
    ? `${weatherTemp}°C${weatherHumidity !== undefined ? ` · ${weatherHumidity}% Humidity` : ''}`
    : rawInput?.weather?.condition || null;

  const timeOfDay = normalized?.temporal.timeOfDay ?? rawInput?.temporal?.timeOfDay;
  const occasion = normalized?.occasion.type ?? (typeof rawInput?.occasion === 'string' ? rawInput.occasion : rawInput?.occasion?.type);
  const mood = normalized?.mood.primaryLabel ?? normalized?.mood.primary ?? (typeof rawInput?.mood === 'string' ? rawInput.mood : rawInput?.mood?.primary);
  
  const outfitFormality = normalized?.outfit.formality ?? (typeof rawInput?.outfit === 'object' ? rawInput?.outfit?.formality : undefined);
  const outfitColor = normalized?.outfit.color ?? (typeof rawInput?.outfit === 'object' ? rawInput?.outfit?.color : undefined);
  const outfitText = [outfitColor, outfitFormality?.replace('_', ' ')].filter(Boolean).join(' ') || (typeof rawInput?.outfit === 'string' ? rawInput.outfit : null);

  const envAc = normalized?.environment.airConditioned ?? rawInput?.environment?.ac;
  const envOutdoor = normalized?.environment.outdoor ?? rawInput?.environment?.outdoor;
  const envText = envAc ? 'Indoor AC' : (envOutdoor ? 'Outdoor' : null);

  return (
    <div className="rounded-3xl liquid-glass p-5 sm:p-6 border border-white/80 shadow-[0_8px_32px_0_rgba(95,70,40,0.06)] relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Summary Title and Chips */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-lab uppercase tracking-widest text-amber-900 font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-200">
              Your Olfactory Context
            </span>
            {isWardrobeOnly && (
              <span className="text-[10px] font-mono-lab uppercase tracking-wider text-emerald-800 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                Wardrobe Only
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Weather factor */}
            <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
              weatherLabel ? 'bg-white/85 text-[#1A1613] font-medium border border-[#E3DACB]' : 'bg-[#F2ECE1]/60 text-[#7A6F66] border border-transparent'
            }`}>
              <CloudSun className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{weatherLabel || 'Weather not specified'}</span>
            </div>

            {/* Time factor */}
            <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
              timeOfDay ? 'bg-white/85 text-[#1A1613] font-medium border border-[#E3DACB]' : 'bg-[#F2ECE1]/60 text-[#7A6F66] border border-transparent'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{timeOfDay || 'Time not specified'}</span>
            </div>

            {/* Occasion factor */}
            <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
              occasion ? 'bg-white/85 text-[#1A1613] font-medium border border-[#E3DACB]' : 'bg-[#F2ECE1]/60 text-[#7A6F66] border border-transparent'
            }`}>
              <Briefcase className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{occasion || 'Occasion not specified'}</span>
            </div>

            {/* Mood factor */}
            <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
              mood ? 'bg-white/85 text-[#1A1613] font-medium border border-[#E3DACB]' : 'bg-[#F2ECE1]/60 text-[#7A6F66] border border-transparent'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{mood || 'Mood not specified'}</span>
            </div>

            {/* Outfit factor (if present) */}
            {outfitText && (
              <div className="px-3 py-1.5 rounded-xl text-xs bg-white/85 text-[#1A1613] font-medium border border-[#E3DACB] flex items-center gap-1.5 capitalize">
                <Shirt className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{outfitText}</span>
              </div>
            )}

            {/* Environment factor (if present) */}
            {envText && (
              <div className="px-3 py-1.5 rounded-xl text-xs bg-white/85 text-[#1A1613] font-medium border border-[#E3DACB] flex items-center gap-1.5">
                <span>{envText}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={onEditContext}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5A5046] hover:text-[#1A1613] bg-white/70 hover:bg-white border border-[#E3DACB] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
            <span>Edit Context</span>
          </button>

          <button
            type="button"
            onClick={onRecalculate}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 border border-amber-500/50 transition cursor-pointer flex items-center gap-1.5 shadow-[0_4px_16px_rgba(217,119,6,0.25)] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Recalculating...' : 'Recalculate Fit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
