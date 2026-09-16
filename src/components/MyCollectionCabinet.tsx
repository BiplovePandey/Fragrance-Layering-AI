import React, { useState } from 'react';
import { Fragrance } from '../types.js';
import { Plus, Trash2, Sparkles, Check, Search, Wine, Layers } from 'lucide-react';

interface MyCollectionCabinetProps {
  allFragrances: Fragrance[];
  ownedFragrances: Fragrance[];
  onAddToCabinet: (id: number) => void;
  onRemoveFromCabinet: (id: number) => void;
  onFindCombinationsFromCabinet: () => void;
}

export const MyCollectionCabinet: React.FC<MyCollectionCabinetProps> = ({
  allFragrances,
  ownedFragrances,
  onAddToCabinet,
  onRemoveFromCabinet,
  onFindCombinationsFromCabinet
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToAdd, setSelectedToAdd] = useState<number | ''>('');

  const ownedIds = new Set(ownedFragrances.map(f => f.id));
  const availableToAdd = allFragrances.filter(f => !ownedIds.has(f.id));

  const filteredOwned = ownedFragrances.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.fragrance_family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (typeof selectedToAdd === 'number') {
      onAddToCabinet(selectedToAdd);
      setSelectedToAdd('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-amber-100 text-amber-900">
                <Wine className="w-5 h-5 text-amber-700" />
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight">
                My Fragrance Cabinet
              </h2>
            </div>
            <p className="text-sm text-stone-500 mt-1 max-w-2xl">
              Catalogue the perfume bottles currently in your personal collection. Our ML engine pairs solely within your physical bottles to generate daily layering rituals.
            </p>
          </div>

          {/* Action Button: Layer My Collection */}
          <button
            id="layer-my-cabinet-btn"
            type="button"
            disabled={ownedFragrances.length < 2}
            onClick={onFindCombinationsFromCabinet}
            className="px-6 py-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-300 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md transition-all self-start md:self-auto cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Layer My Cabinet ({ownedFragrances.length} bottles)</span>
          </button>
        </div>

        {/* Add Bottle Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:flex-1">
            <select
              id="add-bottle-select"
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value ? Number(e.target.value) : '')}
              className="w-full h-11 rounded-xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-900 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="">+ Select a bottle to add to your cabinet...</option>
              {availableToAdd.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.brand} ({f.fragrance_family})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={typeof selectedToAdd !== 'number'}
            className="w-full sm:w-auto h-11 px-5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Bottle</span>
          </button>

          {/* Search Owned */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search owned..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-9.5 pr-3 text-sm rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Collection Grid */}
      {ownedFragrances.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <Wine className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-xl font-medium text-stone-800">Your cabinet is empty</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Add at least 2 fragrances you own to unlock personalized layering recommendations using your real collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {filteredOwned.map(frag => (
            <div
              key={frag.id}
              id={`cabinet-item-${frag.id}`}
              className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2 min-h-[58px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {frag.fragrance_family}
                    </span>
                    <h4 className="font-serif text-xl font-medium text-stone-900 mt-1 leading-tight">
                      {frag.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">{frag.brand}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFromCabinet(frag.id)}
                    title="Remove from cabinet"
                    className="text-stone-300 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed min-h-[32px]">
                  {frag.description}
                </p>

                <div className="pt-2 border-t border-stone-100 text-[11px] space-y-1">
                  <div className="text-stone-500 truncate">
                    <span className="font-medium text-stone-700">Top:</span> {(frag.top_notes || []).join(', ')}
                  </div>
                  <div className="text-stone-500 truncate">
                    <span className="font-medium text-stone-700">Base:</span> {(frag.base_notes || []).join(', ')}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span>{frag.format || 'EDP'}</span>
                <span className="font-mono">{frag.intensity}/10 Intensity</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
