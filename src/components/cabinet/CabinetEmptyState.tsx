import React from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, Plus, Compass } from 'lucide-react';
import { Fragrance } from '../../types.js';

interface CabinetEmptyStateProps {
  curatedSuggestions: Fragrance[];
  onAddToCabinet: (fragranceId: number) => void;
  onExploreUniverse: () => void;
}

export const CabinetEmptyState: React.FC<CabinetEmptyStateProps> = ({
  curatedSuggestions,
  onAddToCabinet,
  onExploreUniverse
}) => {
  return (
    <div className="rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#18130E] via-[#100D0A] to-[#0A0806] p-8 sm:p-12 shadow-2xl text-center max-w-3xl mx-auto space-y-6 text-stone-100">
      {/* Icon */}
      <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(217,119,6,0.2)]">
        <Layers className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          Private Sanctuary
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#F5EEDB]">
          The Cabinet Awaits
        </h3>
        <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
          Your personal fragrance vault has not yet been populated. Place your first flacons here to unlock harmonic chord formulations, daily rotation intelligence, and 8D collection analytics.
        </p>
      </div>

      {/* Suggested Starters */}
      {curatedSuggestions.length > 0 && (
        <div className="pt-4 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
            Suggested Iconic Flacons to Begin:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            {curatedSuggestions.slice(0, 3).map((frag) => (
              <div
                key={frag.id}
                className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                    {frag.brand}
                  </span>
                  <h4 className="font-serif text-base font-medium text-stone-100 mt-0.5">
                    {frag.name}
                  </h4>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    {frag.fragrance_family}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCabinet(frag.id)}
                  className="w-full py-2 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cabinet</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onExploreUniverse}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-sm inline-flex items-center gap-2 shadow-lg transition cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Explore The Fragrance Universe</span>
        </button>
      </div>
    </div>
  );
};
