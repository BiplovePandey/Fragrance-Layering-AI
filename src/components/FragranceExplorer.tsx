import React, { useState } from 'react';
import { Fragrance, ClusterInfo } from '../types.js';
import { Search, Compass, BarChart3, Filter, Tag, Layers, ChevronRight } from 'lucide-react';

interface FragranceExplorerProps {
  fragrances: Fragrance[];
  clusters: ClusterInfo[];
}

export const FragranceExplorer: React.FC<FragranceExplorerProps> = ({
  fragrances,
  clusters
}) => {
  const [selectedCluster, setSelectedCluster] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFragrance, setActiveFragrance] = useState<Fragrance | null>(fragrances[0] || null);

  const filtered = fragrances.filter(f => {
    const matchesCluster = selectedCluster === 'all' || f.cluster_id === selectedCluster;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fragrance_family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      [...f.top_notes, ...f.middle_notes, ...f.base_notes].some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCluster && matchesSearch;
  });

  const featureLabels = [
    'Sweetness', 'Freshness', 'Woody', 'Floral', 'Citrus', 'Spicy', 'Gourmand', 'Intensity'
  ];

  return (
    <div className="space-y-8">
      {/* Clustering Architecture Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-stone-900 text-amber-300">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 tracking-tight">
                K-Means Olfactory Clusters & 8D Feature Vectors
              </h2>
            </div>
            <p className="text-sm text-stone-500 mt-1 max-w-3xl">
              Each perfume is projected into an 8-dimensional normalized vector space across olfactory coordinates. K-Means discovers mathematical centroids that group scents without human bias.
            </p>
          </div>
        </div>

        {/* Cluster Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <button
            type="button"
            onClick={() => setSelectedCluster('all')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedCluster === 'all'
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs uppercase tracking-wider">All Scents</span>
              <span className="text-xs font-mono">{fragrances.length} bottles</span>
            </div>
            <p className="text-xs opacity-70 mt-1">Complete olfactory catalog</p>
          </button>

          {clusters.map(cluster => (
            <button
              type="button"
              key={cluster.cluster_id}
              onClick={() => setSelectedCluster(cluster.cluster_id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedCluster === cluster.cluster_id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-medium truncate pr-2">
                  {cluster.name}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  Cluster #{cluster.cluster_id + 1}
                </span>
              </div>
              <p className="text-xs opacity-80 mt-1 line-clamp-2 leading-snug">
                {cluster.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Fragrance List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by perfume name, brand, notes (e.g. 'bergamot', 'oud', 'Creed')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filtered.map(frag => {
              const isSelected = activeFragrance?.id === frag.id;
              return (
                <div
                  key={frag.id}
                  onClick={() => setActiveFragrance(frag)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        {frag.cluster_label || frag.fragrance_family}
                      </span>
                      <h4 className="font-serif text-xl font-medium text-stone-900">
                        {frag.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-stone-500">
                        <span className="font-medium text-stone-700">{frag.brand}</span>
                        <span>&bull;</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 font-medium border border-amber-200 text-[10px]">
                          {frag.format || 'EDP'}
                        </span>
                        {frag.origin_style && (
                          <span className="text-[10px] text-stone-500">({frag.origin_style})</span>
                        )}
                        {frag.price_inr && (
                          <span className="text-[10px] font-medium text-stone-600">
                            &bull; ₹{frag.price_inr.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-mono font-medium px-2 py-0.5 bg-stone-100 rounded text-stone-700 shrink-0">
                      Int: {frag.intensity}/10
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-stone-600 line-clamp-1">
                    <span className="font-semibold text-stone-700">Notes:</span> {[...frag.top_notes, ...frag.middle_notes, ...frag.base_notes].slice(0, 5).join(', ')}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Fragrance 8D Vector Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {activeFragrance ? (
            <div className="sticky top-28 bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Vector & Profile Inspector
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
                  {activeFragrance.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500">
                  <span className="font-medium text-stone-800">{activeFragrance.brand}</span>
                  <span>&bull;</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium text-[11px]">
                    {activeFragrance.format || 'EDP'}
                  </span>
                  {activeFragrance.origin_style && (
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[11px]">
                      {activeFragrance.origin_style}
                    </span>
                  )}
                  {activeFragrance.volume_ml && (
                    <span className="text-stone-500">{activeFragrance.volume_ml} ml</span>
                  )}
                  {activeFragrance.price_inr && (
                    <span className="font-semibold text-stone-900">₹{activeFragrance.price_inr.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {activeFragrance.description}
              </p>

              {/* 8-Dimensional Feature Vector Bar Visualization */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    8D Feature Vector Representation
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">[0.0 - 1.0]</span>
                </div>

                <div className="space-y-2">
                  {(activeFragrance.vector || []).map((val, idx) => (
                    <div key={featureLabels[idx] || idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">{featureLabels[idx]}</span>
                        <span className="font-mono text-stone-900 font-bold">{val.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-stone-900 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round(val * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Pyramid Breakdown */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-800 uppercase tracking-wider block">
                  Olfactory Pyramid
                </span>
                <div><span className="font-semibold text-stone-700">Top:</span> {activeFragrance.top_notes.join(', ')}</div>
                <div><span className="font-semibold text-stone-700">Heart:</span> {activeFragrance.middle_notes.join(', ')}</div>
                <div><span className="font-semibold text-stone-700">Base:</span> {activeFragrance.base_notes.join(', ')}</div>
              </div>

              {/* Data Provenance & Verification (Agnostic Pipeline Standard) */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/70 text-xs space-y-1.5 text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-amber-900">
                    Verified Provenance & Quality
                  </span>
                  {activeFragrance.data_confidence && (
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      {Math.round(activeFragrance.data_confidence * 100)}% Confidence
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-600 space-y-0.5">
                  <div>
                    <span className="text-stone-400">Category:</span> {activeFragrance.category || 'Curated House'}
                  </div>
                  {activeFragrance.source_url && (
                    <div className="truncate">
                      <span className="text-stone-400">Official Catalog:</span>{' '}
                      <a
                        href={activeFragrance.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-800 hover:underline inline-flex items-center gap-1"
                      >
                        {activeFragrance.source_url.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  {activeFragrance.source_date && (
                    <div>
                      <span className="text-stone-400">Verified Date:</span> {activeFragrance.source_date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400">
              Select a fragrance to inspect its vector coordinates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
