import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, Droplets, Check, Compass, Layers } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';
import { getLabPalette } from './LaboratoryAtmosphere.js';
import {
  AllCollectionsGlyph,
  ForHimGlyph,
  ForHerGlyph,
  UnisexNicheGlyph,
  COLLECTION_GLYPH_MAP
} from '../ui/AtelierGlyphs.js';
import {
  DiscoveryCollectionId,
  getMarketedClassification,
  getMarketedClassificationBadge
} from '../../utils/collectionClassification.js';

interface FragranceSelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fragrance: Fragrance) => void;
  currentSelectedId: number;
  partnerFragrance?: Fragrance;
  allFragrances: Fragrance[];
  targetStation: 'A' | 'B';
}

export const FragranceSelectorDrawer: React.FC<FragranceSelectorDrawerProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentSelectedId,
  partnerFragrance,
  allFragrances,
  targetStation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<DiscoveryCollectionId>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  const families = useMemo(() => {
    const famSet = new Set<string>();
    allFragrances.forEach((f) => {
      if (f.fragrance_family) {
        famSet.add(f.fragrance_family.split(' ')[0]);
      }
    });
    return ['all', ...Array.from(famSet)];
  }, [allFragrances]);

  // Filtered fragrances
  const filtered = useMemo(() => {
    return allFragrances.filter((f) => {
      // Collection Filter
      if (selectedCollection !== 'all') {
        const c = getMarketedClassification(f);
        if (selectedCollection === 'for-him' && c !== 'masculine') return false;
        if (selectedCollection === 'for-her' && c !== 'feminine') return false;
        if (selectedCollection === 'unisex-niche' && c !== 'unisex') return false;
      }

      const matchesSearch =
        searchQuery === '' ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.top_notes || []).some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.base_notes || []).some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFamily =
        selectedFamily === 'all' ||
        (f.fragrance_family && f.fragrance_family.toLowerCase().includes(selectedFamily.toLowerCase()));

      return matchesSearch && matchesFamily;
    });
  }, [allFragrances, selectedCollection, searchQuery, selectedFamily]);

  if (!isOpen) return null;

  const collectionButtons = [
    { id: 'all' as DiscoveryCollectionId, label: 'All Collections', glyph: AllCollectionsGlyph },
    { id: 'for-him' as DiscoveryCollectionId, label: 'For Him', glyph: ForHimGlyph },
    { id: 'for-her' as DiscoveryCollectionId, label: 'For Her', glyph: ForHerGlyph },
    { id: 'unisex-niche' as DiscoveryCollectionId, label: 'Unisex & Niche', glyph: UnisexNicheGlyph }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-[#14100C] border border-amber-500/30 text-stone-200 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-6 pb-4 border-b border-stone-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>Laboratory Specimen Selection</span>
                <span className="text-stone-500">&bull; Station {targetStation}</span>
              </div>
              <h2 className="font-serif text-2xl font-medium text-stone-100 mt-1">
                Select Flacon for Specimen {targetStation}
              </h2>
              <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                Cross-collection layering supported &bull; Any fragrance can pair with any collection
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
              aria-label="Close fragrance selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-6 pt-4 pb-3 space-y-3 border-b border-stone-800/80">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by perfume name, house, or notes (e.g. oud, bergamot)..."
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/50"
                autoFocus
              />
            </div>

            {/* Collection Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
              {collectionButtons.map((btn) => {
                const isSelected = selectedCollection === btn.id;
                const GlyphComp = btn.glyph;

                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setSelectedCollection(btn.id)}
                    className={`px-3 py-1 rounded-xl uppercase tracking-wider transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500/25 border border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <GlyphComp size={12} strokeWidth={1.4} />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Families Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono border-t border-stone-800/60 pt-2">
              <span className="text-stone-500 uppercase tracking-wider text-[9px] mr-1">Family:</span>
              {families.map((fam) => (
                <button
                  key={fam}
                  type="button"
                  onClick={() => setSelectedFamily(fam)}
                  className={`px-2.5 py-0.5 rounded-lg uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                    selectedFamily === fam
                      ? 'bg-amber-900/40 border border-amber-600/40 text-amber-200 font-semibold'
                      : 'bg-stone-900/40 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>

          {/* Fragrance List */}
          <div className="flex-1 overflow-y-auto p-6 pt-3 space-y-2.5 scrollbar-thin scrollbar-thumb-amber-900/40">
            {filtered.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-stone-800/80 bg-stone-900/30 my-4 space-y-3">
                <p className="text-stone-400 text-sm font-serif">No matching specimens in laboratory archives</p>
                <p className="text-stone-500 text-xs font-mono">Try searching by note (e.g. &quot;Rose&quot;, &quot;Sandalwood&quot;) or clear your query.</p>
                {(searchQuery || selectedFamily !== 'all' || selectedCollection !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFamily('all');
                      setSelectedCollection('all');
                    }}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-mono transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              filtered.map((frag) => {
                const isCurrent = frag.id === currentSelectedId;
                const isPartner = partnerFragrance && frag.id === partnerFragrance.id;
                const palette = getLabPalette(frag.fragrance_family);
                const badge = getMarketedClassificationBadge(frag);
                const BadgeGlyph = COLLECTION_GLYPH_MAP[badge.collectionId] || AllCollectionsGlyph;

                return (
                  <button
                    key={frag.id}
                    type="button"
                    disabled={isPartner}
                    onClick={() => {
                      try {
                        ambientAudioEngine.playSpatialChord([587.33, 880], 0.1);
                      } catch {}
                      onSelect(frag);
                      onClose();
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between group ${
                      isCurrent
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                        : isPartner
                        ? 'opacity-40 cursor-not-allowed bg-stone-900/40 border-stone-800/40'
                        : 'bg-stone-900/40 hover:bg-stone-800/80 border-stone-800/80 text-stone-200'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${palette.tagBg} ${palette.tagText} border-amber-500/30`}>
                          {frag.fragrance_family}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 truncate">
                          {frag.brand} &bull; {frag.concentration || 'Eau de Parfum'}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${badge.bgClass} ${badge.borderClass} ${badge.colorClass} ml-auto flex items-center gap-1`}>
                          <BadgeGlyph size={10} strokeWidth={1.5} />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-medium text-stone-100 truncate group-hover:text-amber-200 transition">
                        {frag.name}
                      </h4>

                      <div className="flex items-center gap-2 text-[11px] text-stone-400 truncate">
                        <span>Top: {(frag.top_notes || []).slice(0, 2).join(', ')}</span>
                        <span>&bull;</span>
                        <span>Base: {(frag.base_notes || []).slice(0, 2).join(', ')}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isCurrent ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-xs flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : isPartner ? (
                        <span className="text-stone-500 font-mono text-xs">Partner Flacon</span>
                      ) : (
                        <span className="opacity-0 group-hover:opacity-100 transition text-amber-400 font-mono text-xs">
                          Select &rarr;
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
