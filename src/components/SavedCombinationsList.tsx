import React from 'react';
import { SavedCombination } from '../types.js';
import { Bookmark, Trash2, Star, Sparkles, Award } from 'lucide-react';

interface SavedCombinationsListProps {
  savedList: SavedCombination[];
  onDelete: (id: number) => void;
  onExplorePair: (fragAId: number, fragBId: number) => void;
}

export const SavedCombinationsList: React.FC<SavedCombinationsListProps> = ({
  savedList,
  onDelete,
  onExplorePair
}) => {
  if (savedList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
        <Bookmark className="w-12 h-12 text-stone-300 mx-auto" />
        <h3 className="font-serif text-xl font-medium text-stone-800">No Saved Pairings Yet</h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          Whenever you discover a compelling fragrance combination in the Layering Studio, click &ldquo;Save Combination&rdquo; to store it in your personal archive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Olfactory Archive
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
            Saved Layering Combinations
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Your saved formulas, compatibility scores, ratings, and master explanations.
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-3 py-1.5 bg-stone-100 rounded-lg text-stone-700 self-start sm:self-auto">
          {savedList.length} Archived Formulas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {savedList.map((item) => (
          <div
            key={item.id}
            id={`saved-item-${item.id}`}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 min-h-[52px]">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    Formula #{item.id} &bull; Saved {new Date(item.saved_at).toLocaleDateString()}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-stone-900 mt-1 leading-tight">
                    {item.fragrance_a.name} <span className="text-amber-500 font-light">+</span> {item.fragrance_b.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {item.fragrance_a.brand} &times; {item.fragrance_b.brand}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    <span className="text-xs font-serif font-bold text-amber-800">
                      {item.compatibility_score}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    title="Remove from saved"
                    className="text-stone-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/60 min-h-[56px] flex items-center">
                <p className="text-xs text-stone-700 italic font-serif leading-relaxed line-clamp-3">
                  &ldquo;{item.explanation}&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 font-medium">
                  ☀️ {item.best_season}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 font-medium">
                  💼 {item.best_occasion}
                </span>
                {item.user_rating && (
                  <span className="ml-auto flex items-center gap-1 font-mono font-semibold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {item.user_rating}/5
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-stone-400 truncate">
                Notes: {item.fragrance_a?.top_notes?.[0] || 'Heartwood'} &bull; {item.fragrance_b?.top_notes?.[0] || 'Balsam'}
              </span>
              <button
                type="button"
                onClick={() => onExplorePair(item.fragrance_a.id, item.fragrance_b.id)}
                className="text-xs font-semibold text-stone-900 hover:text-amber-700 transition-colors cursor-pointer shrink-0"
              >
                Re-evaluate in Studio &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
