import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Briefcase, RefreshCw, Compass } from 'lucide-react';
import { DAILY_MOOD_PRESETS } from '../../data/moods.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface TactileStateSelectorProps {
  currentMood: string;
  onSelectMood: (moodId: string, moodTitle: string) => void;
  currentOccasion: string;
  onSelectOccasion: (occasion: string) => void;
  onRecalculate?: () => void;
  isLoading?: boolean;
}

const OCCASIONS: { id: string; label: string; icon: string; desc: string }[] = [
  { id: 'Office', label: 'Office / Focus', icon: '💼', desc: 'Discreet sillage & refined focus' },
  { id: 'Casual', label: 'Casual Day', icon: '☕', desc: 'Effortless, breezy comfort' },
  { id: 'Date', label: 'Date Night', icon: '🍷', desc: 'Magnetic intimacy & warm drydown' },
  { id: 'Evening', label: 'Evening Soiree', icon: '🌙', desc: 'Radiant projection & depth' },
  { id: 'Formal', label: 'Formal Gala', icon: '✨', desc: 'Regal composure & elegance' },
  { id: 'Festive / Wedding', label: 'Festive / Wedding', icon: '👑', desc: 'Opulent florals, saffron & oud' },
  { id: 'Signature', label: 'Daily Signature', icon: '💎', desc: 'Your balanced personal baseline' },
  { id: 'Meditation / Spiritual', label: 'Meditation / Temple', icon: '🪔', desc: 'Calming sandalwood & khus' }
];

export const TactileStateSelector: React.FC<TactileStateSelectorProps> = ({
  currentMood,
  onSelectMood,
  currentOccasion,
  onSelectOccasion,
  onRecalculate,
  isLoading = false
}) => {
  const prefersReduced = usePrefersReducedMotion();

  // Match current mood to preset if possible
  const activeMoodPreset = DAILY_MOOD_PRESETS.find(
    m => m.id === currentMood || m.title.toLowerCase() === currentMood.toLowerCase()
  );

  return (
    <section
      id="wear-today-state"
      aria-label="Chapter II: Your State"
      className="rounded-3xl p-6 sm:p-8 bg-[#14110E] border border-amber-900/30 text-stone-200 shadow-xl space-y-6"
    >
      {/* Chapter Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Chapter II &bull; Your State
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            Align Your Internal Compass
          </h2>
        </div>

        {onRecalculate && (
          <button
            type="button"
            onClick={onRecalculate}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900/80 border border-stone-700/50 hover:border-amber-500/40 text-stone-300 hover:text-amber-200 text-xs font-mono transition cursor-pointer disabled:opacity-50"
            title="Recalculate Olfactory Accord"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Harmonize</span>
          </button>
        )}
      </div>

      {/* Part 1: How Do You Feel? (Mood Selector) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>How do you feel? (Internal Aura)</span>
          </label>
          {activeMoodPreset && (
            <span className="text-[11px] text-amber-400 font-mono hidden sm:inline">
              {activeMoodPreset.tagline}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {DAILY_MOOD_PRESETS.map((preset) => {
            const isSelected =
              currentMood === preset.id ||
              currentMood.toLowerCase() === preset.title.toLowerCase();

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectMood(preset.id, preset.title)}
                className={`p-3 rounded-2xl border text-left transition relative overflow-hidden group cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-500/60 text-stone-100 shadow-md shadow-amber-950/50 ring-1 ring-amber-500/40'
                    : 'bg-stone-900/50 border-stone-800/80 hover:border-amber-700/40 text-stone-400 hover:text-stone-200'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {preset.emoji}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-xs sm:text-sm text-stone-200 leading-tight">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                    {(preset.preferredNotes || []).slice(0, 3).join(', ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 2: Where Are You Going? (Occasion Selector) */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-mono uppercase tracking-wider text-stone-400 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
          <span>Where are you going? (External Canvas)</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occ) => {
            const isSelected =
              currentOccasion === occ.id ||
              currentOccasion.toLowerCase() === occ.id.toLowerCase() ||
              currentOccasion.toLowerCase() === occ.label.toLowerCase();

            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => onSelectOccasion(occ.id)}
                className={`px-3.5 py-2 rounded-xl text-xs border transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-900/60 border-amber-500/70 text-amber-100 font-medium shadow-sm shadow-amber-950/40 ring-1 ring-amber-500/30'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
                aria-pressed={isSelected}
                title={occ.desc}
              >
                <span>{occ.icon}</span>
                <span>{occ.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
