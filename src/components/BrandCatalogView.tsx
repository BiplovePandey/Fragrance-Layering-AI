import React, { useState, useMemo } from 'react';
import { Brand, Fragrance, NoteTaxonomyEntry } from '../types.js';
import { Building2, Globe, Sparkles, BookOpen, Layers, ExternalLink, Filter, Search, Tag, MapPin, Droplet, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { DataIngestionPipelineView } from './DataIngestionPipelineView.js';

interface BrandCatalogViewProps {
  brands: Brand[];
  fragrances: Fragrance[];
  taxonomy: NoteTaxonomyEntry[];
  onSelectFragranceToLayer: (fragranceId: number) => void;
}

export const BrandCatalogView: React.FC<BrandCatalogViewProps> = ({
  brands,
  fragrances,
  taxonomy,
  onSelectFragranceToLayer
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hierarchy' | 'pipeline' | 'brands' | 'taxonomy'>('hierarchy');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hierarchyBrandFilter, setHierarchyBrandFilter] = useState<string>('all');
  const [hierarchyStatusFilter, setHierarchyStatusFilter] = useState<'all' | 'verified' | 'needs_verification'>('all');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Group fragrances hierarchically: Brand -> Collection -> Fragrance[]
  const hierarchyData = useMemo(() => {
    const map = new Map<string, Map<string, Fragrance[]>>();

    fragrances.forEach(frag => {
      const bName = frag.brand_name || frag.brand || 'Independent';
      const cName = frag.collection || 'Core Fine Fragrance Range';

      if (!map.has(bName)) {
        map.set(bName, new Map<string, Fragrance[]>());
      }
      const collMap = map.get(bName)!;
      if (!collMap.has(cName)) {
        collMap.set(cName, []);
      }
      collMap.get(cName)!.push(frag);
    });

    return map;
  }, [fragrances]);

  // Filtered Hierarchy Brands
  const filteredHierarchyBrands = useMemo(() => {
    let brandKeys: string[] = Array.from(hierarchyData.keys());
    if (hierarchyBrandFilter !== 'all') {
      brandKeys = brandKeys.filter((b: string) => b.toLowerCase() === hierarchyBrandFilter.toLowerCase());
    }
    if (searchQuery) {
      brandKeys = brandKeys.filter((b: string) => {
        const matchesBrand = b.toLowerCase().includes(searchQuery.toLowerCase());
        const colls = hierarchyData.get(b);
        let matchesFrags = false;
        if (colls) {
          colls.forEach((frags, cName) => {
            if (cName.toLowerCase().includes(searchQuery.toLowerCase())) matchesFrags = true;
            if (frags.some(f => 
              f && (
                (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (f.top_notes || []).some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (f.middle_notes || []).some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (f.base_notes || []).some(n => n.toLowerCase().includes(searchQuery.toLowerCase()))
              )
            )) {
              matchesFrags = true;
            }
          });
        }
        return matchesBrand || matchesFrags;
      });
    }
    return brandKeys.sort();
  }, [hierarchyData, hierarchyBrandFilter, searchQuery]);

  // Filter brands
  const filteredBrands = brands.filter(b => {
    const matchesCountry = selectedCountry === 'all' || b.country.toLowerCase() === selectedCountry.toLowerCase();
    const matchesQuery = !searchQuery || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.origin_style.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  // Unique countries
  const countries = ['all', ...Array.from(new Set(brands.map(b => b.country)))];

  // Group fragrances by brand
  const getFragrancesForBrand = (brandId: number) => {
    return fragrances.filter(f => f.brand_id === brandId);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Fragrance Taxonomy &amp; Catalog
              </span>
              <span className="text-xs text-stone-500">
                {brands.length} Houses &bull; {fragrances.length} Fine Perfumes &bull; {taxonomy.length} Botanical Accords
              </span>
            </div>
            <h2 className="font-serif text-3xl font-medium text-stone-900">
              Heritage Houses, Attar Distillers &amp; Taxonomy
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Structured strictly as <strong className="text-stone-900">Brand &rarr; Collection &rarr; Fragrance</strong>. We deliberately filter out deodorants, talcs, shower gels, and gift sets to ensure pure perfume olfactory vectors.
            </p>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex flex-wrap items-center bg-stone-100 p-1 rounded-xl border border-stone-200 self-start xl:self-auto shrink-0 gap-1">
            <button
              id="subtab-hierarchy-btn"
              onClick={() => setActiveSubTab('hierarchy')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'hierarchy'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Brand &rarr; Collection Tree</span>
            </button>
            <button
              id="subtab-pipeline-btn"
              onClick={() => setActiveSubTab('pipeline')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'pipeline'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>Ingestion Pipeline &amp; CSV</span>
            </button>
            <button
              id="subtab-brands-btn"
              onClick={() => setActiveSubTab('brands')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'brands'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Houses ({brands.length})</span>
            </button>
            <button
              id="subtab-taxonomy-btn"
              onClick={() => setActiveSubTab('taxonomy')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === 'taxonomy'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Notes Taxonomy ({taxonomy.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* HIERARCHY TREE TAB */}
      {activeSubTab === 'hierarchy' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search brand, collection, scent..."
                  className="w-full h-9.5 pl-9 pr-3 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:border-amber-500 text-stone-900"
                />
              </div>

              <select
                value={hierarchyBrandFilter}
                onChange={e => setHierarchyBrandFilter(e.target.value)}
                className="h-9.5 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Brands ({Array.from(hierarchyData.keys()).length})</option>
                {Array.from(hierarchyData.keys()).sort().map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={hierarchyStatusFilter}
                onChange={e => setHierarchyStatusFilter(e.target.value as any)}
                className="h-9.5 px-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Verification Statuses</option>
                <option value="verified">Verified Official Catalog</option>
                <option value="needs_verification">Needs Catalog Check</option>
              </select>
            </div>

            <div className="text-xs text-stone-500 flex items-center gap-1.5 self-end sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Fine Perfumes &bull; 0 Deodorants / 0 Talcs</span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredHierarchyBrands.map(brandName => {
              const collectionsMap = hierarchyData.get(brandName);
              if (!collectionsMap) return null;

              let brandFragCount = 0;
              collectionsMap.forEach(frags => {
                brandFragCount += frags.filter(f => hierarchyStatusFilter === 'all' || f.status === hierarchyStatusFilter).length;
              });

              if (brandFragCount === 0) return null;

              return (
                <div key={brandName} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-900 font-serif font-bold text-base">
                        {brandName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-medium text-stone-900">{brandName}</h3>
                        <p className="text-xs text-stone-500">
                          {collectionsMap.size} Curated Collections &bull; {brandFragCount} Fine Fragrances
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {Array.from(collectionsMap.entries()).map(([collectionName, frags]) => {
                      const filteredFrags = frags.filter(f => hierarchyStatusFilter === 'all' || f.status === hierarchyStatusFilter);
                      if (filteredFrags.length === 0) return null;

                      return (
                        <div key={collectionName} className="space-y-3 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                              <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wider">
                                {collectionName}
                              </h4>
                            </div>
                            <span className="text-[11px] text-stone-500 font-mono">
                              {filteredFrags.length} {filteredFrags.length === 1 ? 'perfume' : 'perfumes'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredFrags.map(frag => (
                              <div
                                key={frag.id}
                                className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col justify-between space-y-2.5 hover:border-amber-400 hover:shadow-xs transition-all"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h5 className="font-serif text-sm font-medium text-stone-900">
                                      {frag.name}
                                    </h5>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border shrink-0 ${
                                      frag.status === 'verified'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                      {frag.status === 'verified' ? 'Verified' : 'Check'}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500">
                                    <span className="capitalize">{frag.gender}</span>
                                    <span>&bull;</span>
                                    <span className="font-mono">{frag.concentration || frag.format}</span>
                                  </div>

                                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                                    {frag.description}
                                  </p>

                                  <div className="space-y-0.5 pt-1 text-[10px]">
                                    <div className="truncate text-stone-600">
                                      <span className="text-amber-700 font-medium">Top:</span> {(frag.top_notes || []).join(', ')}
                                    </div>
                                    <div className="truncate text-stone-600">
                                      <span className="text-rose-700 font-medium">Heart:</span> {(frag.middle_notes || []).join(', ')}
                                    </div>
                                    <div className="truncate text-stone-600">
                                      <span className="text-purple-700 font-medium">Base:</span> {(frag.base_notes || []).join(', ')}
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-stone-500">
                                    {frag.fragrance_family}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onSelectFragranceToLayer(frag.id)}
                                    className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-semibold border border-amber-200 transition-all cursor-pointer"
                                  >
                                    Layer &rarr;
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PIPELINE & MASTER CSV TAB */}
      {activeSubTab === 'pipeline' && (
        <DataIngestionPipelineView
          fragrances={fragrances}
          brands={brands}
        />
      )}

      {/* BRANDS TAB */}
      {activeSubTab === 'brands' && (
        <div className="space-y-6">
          {/* Controls: Search and Country Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative w-full sm:w-80 shrink-0">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="brand-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search houses, cities, heritage..."
                className="w-full h-10 pl-9.5 pr-4 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-stone-900"
              />
            </div>

            {/* Country Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-stone-400 font-medium mr-1 inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Origin:
              </span>
              {countries.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`h-8 px-3 rounded-full text-xs font-medium transition-all capitalize inline-flex items-center justify-center cursor-pointer ${
                    selectedCountry === c
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {c === 'all' ? 'All Origins' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredBrands.map(brand => {
              const brandFrags = getFragrancesForBrand(brand.id);
              const isIndian = brand.country.toLowerCase() === 'india';

              return (
                <div
                  key={brand.id}
                  id={`brand-card-${brand.id}`}
                  className="bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  {/* Top Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 min-h-[52px]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-xl font-medium text-stone-900 group-hover:text-amber-800 transition-colors leading-tight">
                            {brand.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            {brand.country}
                          </span>
                          {brand.founded_year && (
                            <>
                              <span>&bull;</span>
                              <span>Est. {brand.founded_year}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Origin Style Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                        isIndian 
                          ? 'bg-amber-50 text-amber-900 border-amber-200' 
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}>
                        {brand.origin_style}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 min-h-[48px]">
                      {brand.description}
                    </p>
                  </div>

                  {/* Brand Offerings & Action */}
                  <div className="pt-5 mt-auto border-t border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Curated Fragrances:</span>
                      <span className="font-semibold text-stone-900">{brandFrags.length} registered</span>
                    </div>

                    {brandFrags.length > 0 && (
                      <div className="space-y-1.5">
                        {brandFrags.slice(0, 2).map(frag => (
                          <div
                            key={frag.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-stone-50 text-xs border border-stone-100"
                          >
                            <div className="truncate pr-2">
                              <span className="font-medium text-stone-900 truncate block">{frag.name}</span>
                              <span className="text-[10px] text-stone-500">{frag.format} &bull; {frag.fragrance_family}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onSelectFragranceToLayer(frag.id)}
                              className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 text-[11px] font-medium border border-amber-300/40 shrink-0 inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Layers className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>Layer</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NOTES TAXONOMY TAB */}
      {activeSubTab === 'taxonomy' && (
        <div className="space-y-6">
          <div className="bg-[#FAF9F6] p-6 rounded-xl border border-stone-200">
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
              Cross-Cultural Olfactory Taxonomy
            </h3>
            <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
              Traditional Indian perfumery uses artisanal materials derived from local botanicals, hydro-distilled clay, and roots. Our taxonomy normalizes vernacular terminology into the universal 8D feature space while preserving historical provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {taxonomy.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-xs hover:border-amber-300 transition-colors flex flex-col justify-between h-full"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 min-h-[44px]">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 block">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-lg font-medium text-stone-900 capitalize leading-snug">
                        {item.raw_term}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-800 border border-stone-200 shrink-0">
                      {item.normalized_name}
                    </span>
                  </div>

                  {item.english_equivalent && (
                    <div className="text-xs text-stone-600 flex items-center gap-1.5">
                      <span className="text-stone-400 font-medium">Western Equivalent:</span>
                      <span className="font-medium text-stone-800">{item.english_equivalent}</span>
                    </div>
                  )}
                </div>

                {item.cultural_context && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed italic mt-auto">
                    &ldquo;{item.cultural_context}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
