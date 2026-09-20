import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { CabinetBottle } from './CabinetBottle.js';

interface CabinetShelfProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  fragrances: Fragrance[];
  bottleLevels: Record<number, number>;
  favoriteIds: Set<number>;
  onInspect: (fragrance: Fragrance) => void;
  onWear: (fragrance: Fragrance) => void;
  onLayer: (fragrance: Fragrance) => void;
  onToggleFavorite: (fragranceId: number) => void;
  isSpecialShelf?: boolean;
}

export const CabinetShelf: React.FC<CabinetShelfProps> = ({
  id,
  title,
  subtitle,
  icon: Icon = Sparkles,
  fragrances,
  bottleLevels,
  favoriteIds,
  onInspect,
  onWear,
  onLayer,
  onToggleFavorite,
  isSpecialShelf = false
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!fragrances || fragrances.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id={`shelf-${id}`}
      aria-label={`${title} shelf containing ${fragrances.length} fragrances`}
      className="relative w-full rounded-3xl overflow-hidden border border-stone-800/80 bg-gradient-to-b from-[#16120E] via-[#100D0A] to-[#0A0806] shadow-2xl p-4 sm:p-6"
    >
      {/* Background Soft Smoked Glass Backboard Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af3708_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
      
      {/* Top Ambient Downward Illumination Spotlights */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Shelf Header Plaque */}
      <div className="relative z-10 flex items-center justify-between pb-3 mb-2 border-b border-stone-800/80">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border flex items-center justify-center ${
            isSpecialShelf
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              : 'bg-stone-900/90 border-stone-700/50 text-stone-300'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-medium text-stone-100 tracking-wide">
                {title}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-amber-300/80">
                {fragrances.length} {fragrances.length === 1 ? 'flacon' : 'flacons'}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-stone-400 font-sans mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Shelf Scroll Buttons (Desktop & Tablet) */}
        {fragrances.length > 3 && (
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Flacon Row on Shelf */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={`${title} flacon row`}
        className="relative z-10 flex items-end gap-4 sm:gap-6 overflow-x-auto pt-2 pb-6 px-2 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent snap-x snap-mandatory focus:outline-none focus:ring-1 focus:ring-amber-500/40"
      >
        {fragrances.map((frag) => {
          const level = bottleLevels[frag.id] ?? 80;
          const isFav = favoriteIds.has(frag.id);

          return (
            <div key={frag.id} className="snap-center shrink-0">
              <CabinetBottle
                fragrance={frag}
                fillLevel={level}
                isFavorite={isFav}
                onInspect={onInspect}
                onWear={onWear}
                onLayer={onLayer}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          );
        })}
      </div>

      {/* Physical Solid Dark Walnut Shelf Ledge with Brass Trim */}
      <div className="relative w-full h-5 mt-[-14px] z-20">
        {/* Walnut Deck Top Face */}
        <div className="w-full h-2 bg-gradient-to-r from-[#201812] via-[#2F241B] to-[#201812] border-t border-stone-700/60 shadow-inner" />
        {/* Aged Brass Front Lip Accent */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#8B651B] via-[#D4AF37] to-[#8B651B] border-b border-black/80 shadow-md" />
        {/* Contact Drop Shadow Cast Below the Shelf Ledge */}
        <div className="w-full h-2.5 bg-gradient-to-b from-black/80 to-transparent" />
      </div>
    </section>
  );
};
