import React from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { CabinetShelf } from './CabinetShelf.js';

interface HeritageShelfPortalProps {
  heritageFragrances: Fragrance[];
  bottleLevels: Record<number, number>;
  favoriteIds: Set<number>;
  onInspect: (fragrance: Fragrance) => void;
  onWear: (fragrance: Fragrance) => void;
  onLayer: (fragrance: Fragrance) => void;
  onToggleFavorite: (fragranceId: number) => void;
  onNavigateToHeritage: () => void;
}

export const HeritageShelfPortal: React.FC<HeritageShelfPortalProps> = ({
  heritageFragrances,
  bottleLevels,
  favoriteIds,
  onInspect,
  onWear,
  onLayer,
  onToggleFavorite,
  onNavigateToHeritage
}) => {
  return (
    <div className="space-y-4">
      {/* If user has heritage fragrances in their cabinet, display the dedicated shelf */}
      {heritageFragrances.length > 0 && (
        <CabinetShelf
          id="heritage"
          title="Artisanal Heritage & Deg-Bhapka Shelf"
          subtitle="Hydro-distilled Mitti attars, pure Mysore sandalwood, and classical Indian compositions."
          icon={HeartHandshake}
          fragrances={heritageFragrances}
          bottleLevels={bottleLevels}
          favoriteIds={favoriteIds}
          onInspect={onInspect}
          onWear={onWear}
          onLayer={onLayer}
          onToggleFavorite={onToggleFavorite}
          isSpecialShelf
        />
      )}

      {/* Heritage Portal Invitation Card */}
      <div className="rounded-3xl border border-amber-600/30 bg-gradient-to-r from-[#1E140F] via-[#2A1B14] to-[#1E140F] p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-100 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[radial-gradient(circle,rgba(217,93,57,0.2),transparent_70%)] pointer-events-none" />

        <div className="space-y-1 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E0A96D]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Living Olfactory Heritage</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-medium text-[#F5EEDB]">
            The Kannauj Distillation Archive
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Discover four centuries of copper still hydro-distillation traditions, artisanal farmers, and geographically indicated Indian perfumery essences.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToHeritage}
          className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer z-10"
        >
          <span>Explore Heritage Archive</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
