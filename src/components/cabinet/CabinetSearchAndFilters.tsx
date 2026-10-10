import React from 'react';
import { Search, SlidersHorizontal, Heart, Sparkles, X, RotateCcw } from 'lucide-react';
import {
  AllCollectionsGlyph,
  ForHimGlyph,
  ForHerGlyph,
  UnisexNicheGlyph,
  UnclassifiedGlyph
} from '../ui/AtelierGlyphs.js';

export type CabinetCollectionFilter = 'all' | 'for-him' | 'for-her' | 'unisex-niche' | 'unclassified';

interface CabinetSearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCollection: CabinetCollectionFilter;
  onSelectCollection: (col: CabinetCollectionFilter) => void;
  selectedFamily: string | null;
  onSelectFamily: (fam: string | null) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  showHeritageOnly: boolean;
  onToggleHeritageOnly: () => void;
  availableFamilies: string[];
  totalResults: number;
  collectionCounts?: {
    all: number;
    'for-him': number;
    'for-her': number;
    'unisex-niche': number;
    unclassified: number;
  };
}

export const CabinetSearchAndFilters: React.FC<CabinetSearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCollection,
  onSelectCollection,
  selectedFamily,
  onSelectFamily,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  showHeritageOnly,
  onToggleHeritageOnly,
  availableFamilies,
  totalResults,
  collectionCounts
}) => {
  const collectionOptions: { id: CabinetCollectionFilter; label: string; glyph: any; count?: number }[] = [
    { id: 'all', label: 'All Collections', glyph: AllCollectionsGlyph, count: collectionCounts?.all },
    { id: 'for-him', label: 'For Him', glyph: ForHimGlyph, count: collectionCounts?.['for-him'] },
    { id: 'for-her', label: 'For Her', glyph: ForHerGlyph, count: collectionCounts?.['for-her'] },
    { id: 'unisex-niche', label: 'Unisex & Niche', glyph: UnisexNicheGlyph, count: collectionCounts?.['unisex-niche'] },
    { id: 'unclassified', label: 'Unclassified', glyph: UnclassifiedGlyph, count: collectionCounts?.unclassified }
  ];

  const hasActiveFilters =
    selectedCollection !== 'all' ||
    Boolean(selectedFamily) ||
    showFavoritesOnly ||
    showHeritageOnly ||
    searchQuery.trim() !== '';

  const handleClearFilters = () => {
    onSelectCollection('all');
    onSelectFamily(null);
    if (showFavoritesOnly) onToggleFavoritesOnly();
    if (showHeritageOnly) onToggleHeritageOnly();
    onSearchChange('');
  };

  return (
    <div className="space-y-3.5">
      {/* Search Bar & Total Cabinet Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

        <div className="text-xs font-mono text-stone-400 px-3 py-2.5 rounded-2xl bg-stone-900/60 border border-stone-800 shrink-0 text-center sm:text-left flex items-center justify-center gap-2">
          <span>Cabinet:</span>
          <span className="text-amber-300 font-semibold">{totalResults}</span>
          <span>flacons</span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="ml-2 text-[10px] text-amber-400 hover:text-amber-200 font-mono flex items-center gap-1 underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Collection Filter Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
            Collection Filter:
          </span>
          <span className="font-mono text-[10px] text-stone-500">
            Filter owned wardrobe by catalogue classification
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {collectionOptions.map((opt) => {
            const isSelected = selectedCollection === opt.id;
            const GlyphComp = opt.glyph;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectCollection(opt.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs tracking-wider flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/60 font-semibold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
                aria-pressed={isSelected}
              >
                <GlyphComp size={14} strokeWidth={1.4} />
                <span>{opt.label}</span>
                {opt.count !== undefined && (
                  <span className={`text-[10px] ml-0.5 ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                    ({opt.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2: Secondary Attributes (Favorites, Heritage Attars, Families) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs pt-1 border-t border-stone-800/60">
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
        {availableFamilies.map((fam) => (
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
