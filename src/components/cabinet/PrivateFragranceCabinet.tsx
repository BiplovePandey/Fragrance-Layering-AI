import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  Search,
  Plus,
  Heart,
  X,
  CheckCircle2,
  TreePine,
  Flower2,
  Sun,
  Waves,
  HeartHandshake
} from 'lucide-react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { CabinetHero } from './CabinetHero.js';
import { CabinetShelf } from './CabinetShelf.js';
import { CabinetSearchAndFilters } from './CabinetSearchAndFilters.js';
import { CabinetSpecimenModal } from './CabinetSpecimenModal.js';
import { CollectionIntelligenceMap } from './CollectionIntelligenceMap.js';
import { CollectionShapeAndGaps } from './CollectionShapeAndGaps.js';
import { CabinetTodaysEdit } from './CabinetTodaysEdit.js';
import { CollectionRotation } from './CollectionRotation.js';
import { HeritageShelfPortal } from './HeritageShelfPortal.js';
import { CabinetEmptyState } from './CabinetEmptyState.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface PrivateFragranceCabinetProps {
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  weather: WeatherCondition;
  onWearToday: (fragrance: Fragrance, partner?: Fragrance) => void;
  onSendToLab: (fragrance: Fragrance) => void;
  onAddToCabinet: (fragranceId: number) => void;
  onRemoveFromCabinet: (fragranceId: number) => void;
  onNavigate: (view: any) => void;
}

const STORAGE_KEY_LEVELS = 'olfactory_cabinet_bottle_levels_v1';
const STORAGE_KEY_FAVORITES = 'olfactory_cabinet_favorites_v1';

export const PrivateFragranceCabinet: React.FC<PrivateFragranceCabinetProps> = ({
  ownedFragrances,
  allFragrances,
  weather,
  onWearToday,
  onSendToLab,
  onAddToCabinet,
  onRemoveFromCabinet,
  onNavigate
}) => {
  const shelvesRef = useRef<HTMLDivElement>(null);
  const todaysEditRef = useRef<HTMLDivElement>(null);
  const intelligenceRef = useRef<HTMLDivElement>(null);

  // Fluid Volume Levels (default 80-95%)
  const [bottleLevels, setBottleLevels] = useState<Record<number, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LEVELS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }
    const init: Record<number, number> = {};
    ownedFragrances.forEach((f, idx) => {
      init[f.id] = 75 + ((f.id * 7) % 25);
    });
    return init;
  });

  // Curated Favorites Set
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (stored) return new Set(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
    // Default: mark first 2 owned as favorite
    return new Set(ownedFragrances.slice(0, 2).map(f => f.id));
  });

  // Modal Specimen state
  const [inspectingFragrance, setInspectingFragrance] = useState<Fragrance | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showHeritageOnly, setShowHeritageOnly] = useState(false);

  // Wear Feedback Toast
  const [wearToast, setWearToast] = useState<{ name: string; time: string } | null>(null);

  // Persist bottle levels
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEVELS, JSON.stringify(bottleLevels));
    } catch (e) {
      // ignore
    }
  }, [bottleLevels]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favoriteIds)));
    } catch (e) {
      // ignore
    }
  }, [favoriteIds]);

  // Adjust fluid level handler
  const handleAdjustFillLevel = (id: number, level: number) => {
    setBottleLevels(prev => ({ ...prev, [id]: level }));
  };

  // Toggle favorite handler
  const handleToggleFavorite = (id: number) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Wear action wrapper
  const handleWear = (fragrance: Fragrance, partner?: Fragrance) => {
    onWearToday(fragrance, partner);
    setWearToast({
      name: fragrance.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setTimeout(() => {
      setWearToast(null);
    }, 4500);
  };

  // Available families for filtering
  const availableFamilies = useMemo(() => {
    const set = new Set<string>();
    ownedFragrances.forEach(f => {
      if (f.fragrance_family) set.add(f.fragrance_family);
    });
    return Array.from(set);
  }, [ownedFragrances]);

  // Filtered collection based on search & chips
  const filteredFragrances = useMemo(() => {
    return ownedFragrances.filter(f => {
      if (showFavoritesOnly && !favoriteIds.has(f.id)) return false;

      if (showHeritageOnly) {
        const isHerit =
          f.format === 'Attar' ||
          f.is_oil_based ||
          f.fragrance_origin === 'Indian' ||
          (f.description || '').toLowerCase().includes('kannauj') ||
          (f.description || '').toLowerCase().includes('mitti') ||
          (f.name || '').toLowerCase().includes('attar');
        if (!isHerit) return false;
      }

      if (selectedFamily && f.fragrance_family !== selectedFamily) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (f.name || '').toLowerCase().includes(q);
        const matchBrand = (f.brand || '').toLowerCase().includes(q);
        const matchFam = (f.fragrance_family || '').toLowerCase().includes(q);
        const matchNotes = [
          ...(f.top_notes || []),
          ...(f.middle_notes || []),
          ...(f.base_notes || [])
        ].some(n => n.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchFam && !matchNotes) return false;
      }

      return true;
    });
  }, [ownedFragrances, favoriteIds, showFavoritesOnly, showHeritageOnly, selectedFamily, searchQuery]);

  // Curated Shelves logic
  // 1. Favorites Shelf
  const favoriteFragrances = useMemo(() => {
    return filteredFragrances.filter(f => favoriteIds.has(f.id));
  }, [filteredFragrances, favoriteIds]);

  // 2. Woody / Resinous
  const woodyFragrances = useMemo(() => {
    return filteredFragrances.filter(f => {
      const fam = (f.fragrance_family || '').toLowerCase();
      return fam.includes('wood') || fam.includes('oud') || fam.includes('oriental') || fam.includes('amber') || fam.includes('spicy');
    });
  }, [filteredFragrances]);

  // 3. Floral / Petals
  const floralFragrances = useMemo(() => {
    return filteredFragrances.filter(f => {
      const fam = (f.fragrance_family || '').toLowerCase();
      return fam.includes('floral') || fam.includes('rose') || fam.includes('jasmine');
    });
  }, [filteredFragrances]);

  // 4. Fresh / Citrus / Green
  const freshFragrances = useMemo(() => {
    return filteredFragrances.filter(f => {
      const fam = (f.fragrance_family || '').toLowerCase();
      return fam.includes('citrus') || fam.includes('fresh') || fam.includes('aromatic') || fam.includes('green');
    });
  }, [filteredFragrances]);

  // 5. Aquatic / Marine
  const aquaticFragrances = useMemo(() => {
    return filteredFragrances.filter(f => {
      const fam = (f.fragrance_family || '').toLowerCase();
      return fam.includes('aquatic') || fam.includes('marine') || fam.includes('water');
    });
  }, [filteredFragrances]);

  // 6. Indian Heritage Attars
  const heritageFragrances = useMemo(() => {
    return filteredFragrances.filter(f =>
      f.format === 'Attar' ||
      f.is_oil_based ||
      f.fragrance_origin === 'Indian' ||
      (f.description || '').toLowerCase().includes('kannauj') ||
      (f.description || '').toLowerCase().includes('mitti') ||
      (f.name || '').toLowerCase().includes('attar')
    );
  }, [filteredFragrances]);

  // Candidates to add (allFragrances not currently in cabinet)
  const candidateAddFragrances = useMemo(() => {
    const ownedSet = new Set(ownedFragrances.map(f => f.id));
    return allFragrances.filter(f => !ownedSet.has(f.id));
  }, [allFragrances, ownedFragrances]);

  return (
    <div className="min-h-screen bg-[#0A0806] text-stone-100 pb-28 pt-2 sm:pt-4 px-3 sm:px-6 max-w-7xl mx-auto space-y-10 selection:bg-amber-500/30 selection:text-amber-200">
      {/* WEAR CONFIRMATION TOAST */}
      <AnimatePresence>
        {wearToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#1C1510] border border-amber-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Scent of the Day Logged
              </span>
              <p className="font-serif text-sm text-stone-100 font-medium">
                Wearing {wearToast.name}
              </p>
              <span className="text-[10px] text-stone-400 font-mono block">
                Logged at {wearToast.time} &bull; +25 Scent XP
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <CabinetHero
        ownedFragrances={ownedFragrances}
        onScrollToShelves={() => shelvesRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenTodaysEdit={() => todaysEditRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenIntelligence={() => intelligenceRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* TODAY'S CABINET EDIT SECTION */}
      <div ref={todaysEditRef} id="cabinet-todays-edit">
        <CabinetTodaysEdit
          ownedFragrances={ownedFragrances}
          allFragrances={allFragrances}
          weather={weather}
          onWearToday={handleWear}
          onInspect={(f) => setInspectingFragrance(f)}
          onLayer={(f) => onSendToLab(f)}
          onToggleFavorite={handleToggleFavorite}
          bottleLevels={bottleLevels}
          favoriteIds={favoriteIds}
        />
      </div>

      {/* SHELVES CONTROLS & SEARCH */}
      <div ref={shelvesRef} id="cabinet-shelves" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Atmospheric Physical Shelving</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-0.5">
              The Curated Shelves
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/40 text-amber-300 text-xs font-medium self-start sm:self-auto flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Place Flacon in Cabinet</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <CabinetSearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFamily={selectedFamily}
          onSelectFamily={setSelectedFamily}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(prev => !prev)}
          showHeritageOnly={showHeritageOnly}
          onToggleHeritageOnly={() => setShowHeritageOnly(prev => !prev)}
          availableFamilies={availableFamilies}
          totalResults={filteredFragrances.length}
        />

        {/* If no fragrances at all in collection */}
        {ownedFragrances.length === 0 ? (
          <CabinetEmptyState
            curatedSuggestions={allFragrances.slice(0, 3)}
            onAddToCabinet={onAddToCabinet}
            onExploreUniverse={() => onNavigate('atelier')}
          />
        ) : filteredFragrances.length === 0 ? (
          /* Empty filter search state */
          <div className="p-8 text-center rounded-3xl bg-stone-900/40 border border-stone-800 space-y-3">
            <Search className="w-8 h-8 text-stone-600 mx-auto" />
            <p className="font-serif text-lg text-stone-300">
              No flacons matched your filter criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedFamily(null);
                setShowFavoritesOnly(false);
                setShowHeritageOnly(false);
              }}
              className="text-xs font-mono text-amber-400 underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          /* PHYSICAL SHELVES CASCADE */
          <div className="space-y-8">
            {/* 1. Curated Favorites Shelf (if active) */}
            {favoriteFragrances.length > 0 && (
              <CabinetShelf
                id="favorites"
                title="The Inner Shelf &bull; Curated Favorites"
                subtitle="Your most cherished personal signatures, held in highest honor."
                icon={Heart}
                fragrances={favoriteFragrances}
                bottleLevels={bottleLevels}
                favoriteIds={favoriteIds}
                onInspect={(f) => setInspectingFragrance(f)}
                onWear={handleWear}
                onLayer={(f) => onSendToLab(f)}
                onToggleFavorite={handleToggleFavorite}
                isSpecialShelf
              />
            )}

            {/* 2. Woody & Resinous Shelf */}
            {woodyFragrances.length > 0 && (
              <CabinetShelf
                id="woody"
                title="Noble Woods, Resins & Amber"
                subtitle="Mysore sandalwood, aged agarwood, frankincense, and warm spice structures."
                icon={TreePine}
                fragrances={woodyFragrances}
                bottleLevels={bottleLevels}
                favoriteIds={favoriteIds}
                onInspect={(f) => setInspectingFragrance(f)}
                onWear={handleWear}
                onLayer={(f) => onSendToLab(f)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* 3. Floral Radiance Shelf */}
            {floralFragrances.length > 0 && (
              <CabinetShelf
                id="floral"
                title="Damask Petals & Night-Blooming Florals"
                subtitle="Lush Kannauj roses, Sambac jasmine, and radiant orange blossom chords."
                icon={Flower2}
                fragrances={floralFragrances}
                bottleLevels={bottleLevels}
                favoriteIds={favoriteIds}
                onInspect={(f) => setInspectingFragrance(f)}
                onWear={handleWear}
                onLayer={(f) => onSendToLab(f)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* 4. Solar Citrus & Fresh Shelf */}
            {freshFragrances.length > 0 && (
              <CabinetShelf
                id="fresh"
                title="Solar Citrus, Neroli & Green Aromatics"
                subtitle="Sparkling citrus terpenes, crushed herbs, and vibrant daytime freshness."
                icon={Sun}
                fragrances={freshFragrances}
                bottleLevels={bottleLevels}
                favoriteIds={favoriteIds}
                onInspect={(f) => setInspectingFragrance(f)}
                onWear={handleWear}
                onLayer={(f) => onSendToLab(f)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* 5. Marine & Aquatic Shelf */}
            {aquaticFragrances.length > 0 && (
              <CabinetShelf
                id="aquatic"
                title="Marine Horizons & Coastal Mist"
                subtitle="Ozone accords, salty coastal breezes, and cooling aquatic reflections."
                icon={Waves}
                fragrances={aquaticFragrances}
                bottleLevels={bottleLevels}
                favoriteIds={favoriteIds}
                onInspect={(f) => setInspectingFragrance(f)}
                onWear={handleWear}
                onLayer={(f) => onSendToLab(f)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {/* 6. Indian Heritage Portal Shelf */}
            <HeritageShelfPortal
              heritageFragrances={heritageFragrances}
              bottleLevels={bottleLevels}
              favoriteIds={favoriteIds}
              onInspect={(f) => setInspectingFragrance(f)}
              onWear={handleWear}
              onLayer={(f) => onSendToLab(f)}
              onToggleFavorite={handleToggleFavorite}
              onNavigateToHeritage={() => onNavigate('heritage')}
            />
          </div>
        )}
      </div>

      {/* COLLECTION INTELLIGENCE & SHAPE */}
      <div ref={intelligenceRef} id="cabinet-intelligence" className="space-y-8 pt-6 border-t border-stone-800">
        <CollectionIntelligenceMap
          ownedFragrances={ownedFragrances}
          onSelectFragrance={(f) => setInspectingFragrance(f)}
        />

        <CollectionShapeAndGaps
          ownedFragrances={ownedFragrances}
          allFragrances={allFragrances}
          onExploreDirection={(query) => {
            onNavigate('atelier');
          }}
        />

        <CollectionRotation
          ownedFragrances={ownedFragrances}
          onInspect={(f) => setInspectingFragrance(f)}
          onWearToday={handleWear}
        />
      </div>

      {/* COLLECTOR'S SPECIMEN VIEW MODAL */}
      <CabinetSpecimenModal
        fragrance={inspectingFragrance}
        isOpen={Boolean(inspectingFragrance)}
        onClose={() => setInspectingFragrance(null)}
        weather={weather}
        fillLevel={inspectingFragrance ? (bottleLevels[inspectingFragrance.id] ?? 80) : 80}
        onAdjustFillLevel={handleAdjustFillLevel}
        isFavorite={inspectingFragrance ? favoriteIds.has(inspectingFragrance.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onWearToday={handleWear}
        onSendToLab={(f) => onSendToLab(f)}
        onRemoveFromCabinet={(id) => onRemoveFromCabinet(id)}
      />

      {/* ADD FLACON MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] rounded-3xl border border-stone-800 bg-[#16120E] p-6 shadow-2xl overflow-y-auto space-y-4 text-stone-100"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-400" />
                  <h3 className="font-serif text-xl font-medium text-stone-100">
                    Place Flacon in Your Cabinet
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-400">
                Select from our curated catalogue flacons to place directly onto your private shelves:
              </p>

              <div className="space-y-2">
                {candidateAddFragrances.map((frag) => (
                  <div
                    key={frag.id}
                    className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/40 flex items-center justify-between gap-3 transition"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                        {frag.brand}
                      </span>
                      <h4 className="font-serif text-base font-medium text-stone-100">
                        {frag.name}
                      </h4>
                      <span className="text-xs text-stone-400 block">
                        {frag.fragrance_family} &bull; {frag.concentration || 'Parfum'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCabinet(frag.id);
                        setIsAddModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs transition cursor-pointer"
                    >
                      Place on Shelf
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
