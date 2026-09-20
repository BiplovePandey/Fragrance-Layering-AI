import React from 'react';
import { Search, SlidersHorizontal, Heart, Sparkles, X } from 'lucide-react';

interface CabinetSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFamily: string | null;
  onSelectFamily: (fam: string | null) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  showHeritageOnly: boolean;
  onToggleHeritageOnly: () => void;
  availableFamilies: string[];
  totalResults: number;
}

export const CabinetSearchAndFilters: React.FC<CabinetSearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFamily,
  onSelectFamily,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  showHeritageOnly,
  onToggleHeritageOnly,
  availableFamilies,
  totalResults
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search flacon name, perfume house, or note in your cabinet..."
            className="w-full h-11 pl-10 pr-9 rounded-2xl bg-stone-900/80 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Total Results Count */}
        <div className="text-xs font-mono text-stone-400 px-3 py-2.5 rounded-2xl bg-stone-900/60 border border-stone-800 shrink-0 text-center sm:text-left">
          Cabinet: <span className="text-amber-300 font-semibold">{totalResults}</span> flacons
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {/* All button */}
        <button
          type="button"
          onClick={() => {
            onSelectFamily(null);
            if (showFavoritesOnly) onToggleFavoritesOnly();
            if (showHeritageOnly) onToggleHeritageOnly();
          }}
          className={`px-3 py-1.5 rounded-xl font-mono uppercase tracking-wider transition cursor-pointer shrink-0 ${
            !selectedFamily && !showFavoritesOnly && !showHeritageOnly
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
              : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          All Flacons
        </button>

        {/* Favorites Chip */}
        <button
          type="button"
          onClick={onToggleFavoritesOnly}
          className={`px-3 py-1.5 rounded-xl font-mono uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            showFavoritesOnly
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 font-semibold shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          <Heart className={`w-3 h-3 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>Curated Favorites</span>
        </button>

        {/* Heritage Chip */}
        <button
          type="button"
          onClick={onToggleHeritageOnly}
          className={`px-3 py-1.5 rounded-xl font-mono uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            showHeritageOnly
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 font-semibold'
              : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Heritage Attars</span>
        </button>

        <span className="w-[1px] h-4 bg-stone-800 shrink-0 mx-1" />

        {/* Family Chips */}
        {availableFamilies.map(fam => (
          <button
            key={fam}
            type="button"
            onClick={() => onSelectFamily(selectedFamily === fam ? null : fam)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
              selectedFamily === fam
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {fam}
          </button>
        ))}
      </div>
    </div>
  );
};
