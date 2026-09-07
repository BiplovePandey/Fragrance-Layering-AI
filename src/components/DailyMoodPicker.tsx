import React from 'react';
import { DailyMoodPreset, DailyMoodId } from '../types.js';
import { DAILY_MOOD_PRESETS } from '../data/moods.js';
import { Sparkles, SlidersHorizontal, ArrowRight, Check, Heart } from 'lucide-react';
import { getFamilyTheme } from '../theme.js';

interface DailyMoodPickerProps {
  selectedMoodId: DailyMoodId | null;
  onSelectMood: (preset: DailyMoodPreset) => void;
  onExploreCustom: () => void;
  showCustomForm: boolean;
  onToggleCustomForm: () => void;
  onInstantCalculate?: () => void;
  isLoading?: boolean;
}

// Mood card styling map matching Scent Universe specs
const MOOD_CARD_THEMES: Record<string, {
  gradient: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
}> = {
  romantic_soft: {
    gradient: 'from-[#FFEBF2] via-[#FFD6E5] to-[#FCE4EC]',
    borderColor: '#E86A92',
    accentColor: '#E86A92',
    textColor: '#8A1C49'
  },
  warm_seductive: {
    gradient: 'from-[#FFF7ED] via-[#FFE8D1] to-[#FED7AA]',
    borderColor: '#F2A65A',
    accentColor: '#F2A65A',
    textColor: '#8A4A0A'
  },
  fresh_energetic: {
    gradient: 'from-[#EBFBFA] via-[#D8F8EE] to-[#E6FAF4]',
    borderColor: '#55BFA3',
    accentColor: '#55BFA3',
    textColor: '#116955'
  },
  clean_calm: {
    gradient: 'from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]',
    borderColor: '#4ADE80',
    accentColor: '#22C55E',
    textColor: '#15803D'
  },
  dark_woody: {
    gradient: 'from-[#FAF6F0] via-[#EEDDC6] to-[#E4CEB0]',
    borderColor: '#B58A58',
    accentColor: '#B58A58',
    textColor: '#4E371C'
  },
  indian_soul: {
    gradient: 'from-[#FCF4EE] via-[#FCE3D8] to-[#FAD4C0]',
    borderColor: '#D95D39',
    accentColor: '#D95D39',
    textColor: '#7D2611'
  },
  surprise_me: {
    gradient: 'from-[#F9F3FC] via-[#E9D9F3] to-[#DEC6EE]',
    borderColor: '#7B3F98',
    accentColor: '#7B3F98',
    textColor: '#4B1C63'
  }
};

export const DailyMoodPicker: React.FC<DailyMoodPickerProps> = ({
  selectedMoodId,
  onSelectMood,
  onExploreCustom,
  showCustomForm,
  onToggleCustomForm,
  onInstantCalculate,
  isLoading
}) => {
  const activePreset = DAILY_MOOD_PRESETS.find(p => p.id === selectedMoodId);

  return (
    <div id="daily-mood-picker-section" className="space-y-6 pt-2 pb-2">
      {/* Editorial Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4EE] text-[#991B4C] text-[11px] font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#E86A92]" />
          <span>Olfactory State of Mind</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#292323] tracking-tight">
          How do you want to smell today?
        </h2>

        <p className="text-xs sm:text-sm text-[#786F6A] leading-relaxed font-sans">
          Tap a mood card to instantly harmonize your chords, or customize your visual preferences below.
        </p>
      </div>

      {/* Visual Mood Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5 pt-2 items-stretch">
        {DAILY_MOOD_PRESETS.map((preset) => {
          const isSelected = selectedMoodId === preset.id;
          const theme = MOOD_CARD_THEMES[preset.id] || {
            gradient: 'from-stone-50 to-stone-100',
            borderColor: '#E86A92',
            accentColor: '#7B3F98',
            textColor: '#292323'
          };

          return (
            <button
              key={preset.id}
              id={`mood-btn-${preset.id}`}
              type="button"
              onClick={() => onSelectMood(preset)}
              className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-br ${theme.gradient} shadow-md scale-[1.03] ring-2`
                  : 'bg-white text-[#292323] border-[#F0E6DD] hover:shadow-xs hover:border-[#E86A92]/40'
              }`}
              style={{
                borderColor: isSelected ? theme.borderColor : undefined,
                boxShadow: isSelected ? `0 0 0 2px ${theme.borderColor}50, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` : undefined
              }}
            >
              {/* Active Checkmark Pill */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] shadow"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-115 duration-200 shrink-0">
                  {preset.emoji}
                </div>
                <div>
                  <div className="h-10 flex items-center">
                    <h3
                      className="font-serif text-base font-bold leading-tight line-clamp-2"
                      style={{ color: isSelected ? theme.textColor : '#292323' }}
                    >
                      {preset.title}
                    </h3>
                  </div>
                  <p className="text-[11px] leading-snug mt-1 h-8 line-clamp-2 text-[#786F6A]">
                    {preset.tagline}
                  </p>
                </div>
              </div>

              {/* Note hints */}
              <div className="mt-auto pt-2.5 border-t border-black/5 text-[10px] space-y-1">
                <div className="font-mono uppercase tracking-wider text-[9px] text-[#786F6A] font-bold">
                  Chords
                </div>
                <div className="truncate font-medium text-[#292323]">
                  {preset.preferredNotes.slice(0, 2).join(', ')}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mood Action Ribbon */}
      {activePreset && (
        <div className="mt-4 p-4 sm:p-5 rounded-3xl bg-white border border-[#F0E6DD] text-[#292323] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="text-3xl p-3 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] shrink-0 leading-none shadow-2xs">
              {activePreset.emoji}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif text-xl font-bold text-[#7B3F98]">
                  {activePreset.title} Active
                </span>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9F3] text-[#D95D39] border border-[#F0E6DD] shrink-0">
                  {activePreset.season} &bull; {activePreset.occasion}
                </span>
              </div>
              <p className="text-xs text-[#786F6A] max-w-xl mt-1 leading-relaxed">
                {activePreset.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              id="mood-instant-calculate-btn"
              type="button"
              onClick={onInstantCalculate}
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-[#7B3F98] via-[#8E44AD] to-[#E86A92] hover:opacity-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{isLoading ? 'Composing...' : 'Compute Layering Pairs'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            <button
              id="mood-toggle-sliders-btn"
              type="button"
              onClick={onToggleCustomForm}
              className="px-3.5 py-2.5 bg-[#FFF9F3] hover:bg-stone-100 text-[#292323] text-xs font-medium rounded-xl border border-[#F0E6DD] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7B3F98] shrink-0" />
              <span>{showCustomForm ? 'Hide Form' : 'Fine-Tune Sliders'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
