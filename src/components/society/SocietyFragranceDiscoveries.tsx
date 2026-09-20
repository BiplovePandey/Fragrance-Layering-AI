import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  FlaskConical,
  Archive,
  Eye,
  Flame,
  Clock,
  Compass,
  Check
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';

interface DiscoveryLane {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  curatorNote: string;
  fragranceIds: number[];
}

interface SocietyFragranceDiscoveriesProps {
  allFragrances: Fragrance[];
  wardrobeFragrances?: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLab?: (fragA: Fragrance, fragB?: Fragrance) => void;
  onAddToCabinet?: (fragrance: Fragrance) => void;
}

export const SocietyFragranceDiscoveries: React.FC<SocietyFragranceDiscoveriesProps> = ({
  allFragrances,
  wardrobeFragrances = [],
  onInspectInChamber,
  onSendToLab,
  onAddToCabinet,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});

  const ownedIdSet = new Set(wardrobeFragrances.map((f) => f.id));

  // Editorial categories derived cleanly from database attributes
  const discoveryLanes: DiscoveryLane[] = [
    {
      id: 'first_impressions',
      title: 'First Impressions',
      subtitle: 'Fragrances whose opening 15 minutes captivate the salon',
      badge: 'Opening Radiance',
      curatorNote: 'High top-note effervescence featuring sparkling citrus, bergamot, and floral vapors.',
      fragranceIds: [1, 7, 33], // Raw (SKINN), Nargis (Forest Essentials), B680 Vetiver
    },
    {
      id: 'unexpected_favorites',
      title: 'Unexpected Favorites',
      subtitle: 'Unconventional accords that surprised the society',
      badge: 'Avant-Garde Harmony',
      curatorNote: 'Pairings of medicinal herbal vetivers with creamy spiced skin musks.',
      fragranceIds: [11, 6, 2], // Chai Musk, Mysore Sandalwood & Vetiver, Steele
    },
    {
      id: 'hidden_gems',
      title: 'Artisanal Hidden Gems',
      subtitle: 'Small-batch Indian botanical extractions & indie flacons',
      badge: 'Niche Terroir',
      curatorNote: 'Distilled with heritage craft in Kannauj, Bharatpur, and Mysore.',
      fragranceIds: [33, 7, 11], // Muzna B680, Forest Essentials Nargis, Bombay Perfumery
    },
    {
      id: 'rediscovered_classics',
      title: 'Rediscovered Classics',
      subtitle: 'Timeless compositions anchoring modern wardrobes',
      badge: 'Masterwork Sillage',
      curatorNote: 'Heavy resins, Assam agarwood, and amberwood with 12+ hour staying power.',
      fragranceIds: [5, 6, 1], // Nox Oud, Mysore Sandalwood, Raw
    },
  ];

  const handleAdd = (frag: Fragrance) => {
    if (onAddToCabinet) {
      onAddToCabinet(frag);
      setAddedIds((prev) => ({ ...prev, [frag.id]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [frag.id]: false }));
      }, 2500);
    }
  };

  const filteredLanes =
    activeCategory === 'all'
      ? discoveryLanes
      : discoveryLanes.filter((l) => l.id === activeCategory);

  return (
    <div className="space-y-8">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chapter III • Society Discoveries</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
            Fragrance Discoveries
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1 font-sans">
            Curated discovery shelves highlighting remarkable opening projections, hidden Indian artisanal distillates, and enduring classics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono-lab">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl border transition cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-amber-900/10 text-amber-900 border-amber-500/40 font-semibold'
                : 'bg-white/60 text-[#7A6F66] border-[#E3DACB] hover:text-[#1A1613]'
            }`}
          >
            All Shelves ({discoveryLanes.length})
          </button>
          {discoveryLanes.map((lane) => (
            <button
              key={lane.id}
              type="button"
              onClick={() => setActiveCategory(lane.id)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer whitespace-nowrap ${
                activeCategory === lane.id
                  ? 'bg-amber-900/10 text-amber-900 border-amber-500/40 font-semibold'
                  : 'bg-white/60 text-[#7A6F66] border-[#E3DACB] hover:text-[#1A1613]'
              }`}
            >
              {lane.title}
            </button>
          ))}
        </div>
      </div>

      {/* Discovery Shelves */}
      <div className="space-y-10">
        {filteredLanes.map((lane) => {
          const laneFragrances = lane.fragranceIds
            .map((id) => allFragrances.find((f) => f.id === id))
            .filter((f): f is Fragrance => Boolean(f));

          return (
            <div
              key={lane.id}
              className="rounded-3xl bg-[#14110E] border border-amber-500/20 p-6 sm:p-8 text-[#F8F5EE] shadow-xl relative overflow-hidden space-y-6"
            >
              {/* Subtle background wooden shelf line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/15 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-amber-400">
                      {lane.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#F8F5EE] mt-0.5">
                    {lane.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {lane.subtitle}
                  </p>
                </div>
                <p className="text-xs text-amber-200/70 font-mono-lab italic max-w-sm sm:text-right">
                  &ldquo;{lane.curatorNote}&rdquo;
                </p>
              </div>

              {/* Horizontal Flacon Shelf */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {laneFragrances.map((frag) => {
                  const isOwned = ownedIdSet.has(frag.id);
                  const isRecentlyAdded = addedIds[frag.id];

                  return (
                    <div
                      key={frag.id}
                      className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] p-5 flex flex-col justify-between transition group"
                    >
                      <div className="space-y-4">
                        {/* Bottle Centerpiece */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-lab text-amber-400/90 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {frag.fragrance_family || 'Fine Fragrance'}
                          </span>
                          {isOwned && (
                            <span className="text-[10px] font-mono-lab text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                              In Cabinet
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 py-2">
                          <div className="shrink-0">
                            <ScentBottle
                              name={frag.name}
                              brand={frag.brand_name || frag.brand}
                              family={frag.fragrance_family}
                              size="md"
                              showAura={false}
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif text-lg font-medium text-[#F8F5EE] group-hover:text-amber-300 transition leading-snug">
                              {frag.name}
                            </h4>
                            <p className="text-xs text-stone-400">
                              {frag.brand_name || frag.brand}
                            </p>
                            <p className="text-[11px] font-mono-lab text-stone-400 pt-1">
                              Longevity: {frag.longevity || '8 hrs'}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed italic font-serif">
                          &ldquo;{frag.description}&rdquo;
                        </p>

                        {/* Top / Base Notes Preview */}
                        {frag.top_notes && (
                          <div className="text-[10px] font-mono-lab text-stone-400 pt-1 border-t border-white/[0.06]">
                            <span className="text-stone-400">Notes:</span>{' '}
                            {frag.top_notes.slice(0, 2).join(', ')} • {frag.base_notes?.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>

                      {/* Action Links: Chamber, Lab, Cabinet */}
                      <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                        {onInspectInChamber && (
                          <button
                            type="button"
                            onClick={() => onInspectInChamber(frag)}
                            aria-label={`Inspect ${frag.name} in Fragrance Chamber`}
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-[11px] font-mono-lab border border-white/[0.08] transition cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Chamber</span>
                          </button>
                        )}

                        {onSendToLab && (
                          <button
                            type="button"
                            onClick={() => onSendToLab(frag)}
                            aria-label={`Layer ${frag.name} in Laboratory`}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-mono-lab border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                          >
                            <FlaskConical className="w-3 h-3" />
                            <span>Layer</span>
                          </button>
                        )}

                        {onAddToCabinet && !isOwned && (
                          <button
                            type="button"
                            onClick={() => handleAdd(frag)}
                            aria-label={`Add ${frag.name} to private cabinet`}
                            className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-emerald-950/50 text-stone-300 hover:text-emerald-300 text-[11px] font-mono-lab border border-white/[0.08] transition cursor-pointer flex items-center gap-1"
                          >
                            {isRecentlyAdded ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Added</span>
                              </>
                            ) : (
                              <>
                                <Archive className="w-3 h-3" />
                                <span>Cabinet</span>
                              </>
                            )}
                          </button>
                        )}
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
  );
};
