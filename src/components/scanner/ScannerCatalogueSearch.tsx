import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Fragrance } from '../../types.js';

interface ScannerCatalogueSearchProps {
  allFragrances: Fragrance[];
  onSelectFragrance: (fragrance: Fragrance) => void;
}

export const ScannerCatalogueSearch: React.FC<ScannerCatalogueSearchProps> = ({
  allFragrances,
  onSelectFragrance,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [onlyIndian, setOnlyIndian] = useState<boolean>(false);

  // Unique fragrance families
  const families = useMemo(() => {
    const set = new Set<string>();
    allFragrances.forEach((f) => {
      if (f.fragrance_family) {
        set.add(f.fragrance_family.split('/')[0].trim());
      }
    });
    return ['all', ...Array.from(set)];
  }, [allFragrances]);

  // Filtered list
  const filtered = useMemo(() => {
    return allFragrances.filter((f) => {
      const q = query.toLowerCase().trim();
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        (f.brand_name || f.brand || '').toLowerCase().includes(q) ||
        (f.fragrance_family || '').toLowerCase().includes(q) ||
        (f.top_notes || []).some((n) => n.toLowerCase().includes(q)) ||
        (f.base_notes || []).some((n) => n.toLowerCase().includes(q));

      const matchFamily =
        selectedFamily === 'all' ||
        (f.fragrance_family || '').toLowerCase().includes(selectedFamily.toLowerCase());

      const matchIndian =
        !onlyIndian ||
        f.is_indian_heritage ||
        (f.brand_name || f.brand || '').toLowerCase().includes('skinn') ||
        (f.brand_name || f.brand || '').toLowerCase().includes('kannauj') ||
        (f.brand_name || f.brand || '').toLowerCase().includes('kastoor') ||
        (f.brand_name || f.brand || '').toLowerCase().includes('bombay perfumery') ||
        (f.brand_name || f.brand || '').toLowerCase().includes('gulabsingh') ||
        (f.brand_name || f.brand || '').toLowerCase().includes('naseem') ||
        (f.brand_name || f.brand || '').toLowerCase().includes('forest essentials');

      return matchQuery && matchFamily && matchIndian;
    });
  }, [allFragrances, query, selectedFamily, onlyIndian]);

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-8 text-stone-200 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Archival Index
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              {filtered.length} Flacons Indexed
            </span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#F8F5EE] mt-0.5">
            Search the Atelier Master Catalogue
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setOnlyIndian(!onlyIndian)}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
            onlyIndian
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-white/[0.04] border-white/[0.1] text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Indian Heritage Houses Only</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by fragrance title, house, note (e.g. Cardamom, Sandalwood, Mitti), or family..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#14110E] border border-amber-500/30 text-stone-100 placeholder-stone-500 text-sm focus:outline-hidden focus:border-amber-400 transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400 hover:text-stone-200"
          >
            Clear
          </button>
        )}
      </div>

      {/* Fragrance Family Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        {families.map((fam) => (
          <button
            key={fam}
            type="button"
            onClick={() => setSelectedFamily(fam)}
            className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition cursor-pointer ${
              selectedFamily === fam
                ? 'bg-amber-500/20 border border-amber-400 text-amber-200 font-semibold'
                : 'bg-white/[0.03] border border-white/[0.08] text-stone-400 hover:text-stone-200'
            }`}
          >
            {fam.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search Results List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
        {filtered.length > 0 ? (
          filtered.map((frag) => (
            <div
              key={frag.id}
              onClick={() => onSelectFragrance(frag)}
              className="p-4 rounded-2xl bg-[#14110E] border border-white/[0.06] hover:border-amber-500/40 hover:bg-[#1A1613] transition cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-1">
                  <span className="text-amber-400/90 font-semibold uppercase truncate max-w-[140px]">
                    {frag.brand_name || frag.brand}
                  </span>
                  <span>{frag.format || 'EDP'}</span>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#F8F5EE] group-hover:text-amber-300 transition-colors">
                  {frag.name}
                </h4>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {frag.description || `A refined composition within the ${frag.fragrance_family} family.`}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="truncate max-w-[150px]">{frag.fragrance_family}</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Select <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-stone-400 space-y-2">
            <p className="font-serif text-lg text-stone-300">
              No matching fragrances found in the Atelier catalogue
            </p>
            <p className="text-xs max-w-md mx-auto">
              If this is an uncatalogued perfume, you can enter its details and submit it to the Fine Fragrance Gatekeeper.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
