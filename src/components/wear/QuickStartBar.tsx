import React from 'react';
import { Briefcase, Heart, Flame, Sparkles, Coffee, PartyPopper, Compass } from 'lucide-react';
import { RawOlfactoryContextInput } from '../../types.js';

export interface QuickStartPreset {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  context: RawOlfactoryContextInput;
  wardrobeOnly?: boolean;
}

export const QUICK_START_PRESETS: QuickStartPreset[] = [
  {
    id: 'office',
    label: 'Office / Focus',
    icon: Briefcase,
    tagline: 'Refined sillage with polite presence',
    context: {
      occasion: 'Office',
      temporal: { timeOfDay: 'Morning' },
      mood: 'Clean & Calm',
      outfit: { formality: 'smart_casual', style: 'Tailored' },
      environment: { indoorOutdoor: 'indoor', locationType: 'office' }
    }
  },
  {
    id: 'date_night',
    label: 'Date Night',
    icon: Heart,
    tagline: 'Warm sensual chords with intimate aura',
    context: {
      occasion: 'Date',
      temporal: { timeOfDay: 'Evening' },
      mood: 'Warm & Seductive',
      outfit: { formality: 'formal', color: 'Black' }
    }
  },
  {
    id: 'hot_day',
    label: 'Hot & Humid Day',
    icon: Flame,
    tagline: 'Crisp citrus & sparkling woods that resist heat',
    context: {
      weather: { temperature_c: 34, humidity_pct: 75, condition: 'sunny_warm' },
      temporal: { timeOfDay: 'Afternoon', season: 'Summer' },
      occasion: 'Casual',
      mood: 'Fresh & Energetic',
      outfit: { formality: 'casual', style: 'Light linen' }
    }
  },
  {
    id: 'formal_evening',
    label: 'Formal Evening',
    icon: Sparkles,
    tagline: 'Distinguished profile for galas and celebrations',
    context: {
      occasion: 'Formal',
      temporal: { timeOfDay: 'Night' },
      mood: 'Dark & Woody',
      outfit: { formality: 'black_tie', color: 'Black' },
      constraints: { longevityPreference: '8h+' }
    }
  },
  {
    id: 'casual_day',
    label: 'Casual Weekend',
    icon: Coffee,
    tagline: 'Effortless, breezy everyday signature',
    context: {
      occasion: 'Casual',
      temporal: { timeOfDay: 'Day' },
      outfit: { formality: 'casual' }
    }
  },
  {
    id: 'festive_wedding',
    label: 'Festive / Wedding',
    icon: PartyPopper,
    tagline: 'Opulent Indian heritage, saffron & royal oud',
    context: {
      occasion: 'Festive / Wedding',
      temporal: { timeOfDay: 'Evening' },
      mood: 'Indian Soul',
      outfit: { formality: 'traditional', style: 'Kurta / Sherwani' },
      constraints: { projectionPreference: 'Strong' }
    }
  }
];

interface QuickStartBarProps {
  onSelectPreset: (preset: QuickStartPreset) => void;
  onMinimalContext: () => void;
  isLoading?: boolean;
}

export const QuickStartBar: React.FC<QuickStartBarProps> = ({
  onSelectPreset,
  onMinimalContext,
  isLoading = false
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono-lab uppercase tracking-widest text-[#7A6F66]">
          Curated Atelier Scenarios
        </span>
        <button
          type="button"
          onClick={onMinimalContext}
          disabled={isLoading}
          className="text-xs font-medium text-amber-800 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
        >
          <Compass className="w-3.5 h-3.5 text-amber-700" />
          <span>I just want to smell amazing today</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {QUICK_START_PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectPreset(preset)}
              className="p-3 sm:p-3.5 rounded-2xl liquid-glass-pill hover:bg-white/90 border border-white/80 hover:border-amber-300 transition-all cursor-pointer flex flex-col items-start text-left group shadow-2xs hover:shadow-xs disabled:opacity-50"
            >
              <div className="w-7 h-7 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800 mb-2 group-hover:scale-110 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#1A1613] leading-tight block">
                {preset.label}
              </span>
              <span className="text-[10px] text-[#7A6F66] line-clamp-2 mt-1 leading-snug">
                {preset.tagline}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
