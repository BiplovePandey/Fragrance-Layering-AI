import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, Compass, Shirt, Plus, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Fragrance } from '../../types.js';

interface CabinetHeroProps {
  ownedFragrances: Fragrance[];
  onScrollToShelves: () => void;
  onOpenAddModal: () => void;
  onOpenTodaysEdit: () => void;
  onOpenIntelligence: () => void;
}

export const CabinetHero: React.FC<CabinetHeroProps> = ({
  ownedFragrances,
  onScrollToShelves,
  onOpenAddModal,
  onOpenTodaysEdit,
  onOpenIntelligence
}) => {
  const totalCount = ownedFragrances.length;

  // Real statistics derived from actual owned collection
  const houses = new Set(ownedFragrances.map(f => f.brand || f.brand_name).filter(Boolean));
  const houseCount = houses.size;

  const families = new Set(ownedFragrances.map(f => f.fragrance_family).filter(Boolean));
  const familyCount = families.size;

  const heritageScents = ownedFragrances.filter(f =>
    f.format === 'Attar' ||
    f.is_oil_based ||
    f.fragrance_origin === 'Indian' ||
    (f.description || '').toLowerCase().includes('kannauj') ||
    (f.description || '').toLowerCase().includes('mitti') ||
    (f.name || '').toLowerCase().includes('attar')
  );
  const heritageCount = heritageScents.length;

  return (
    <section
      aria-label="Private Fragrance Cabinet Overview"
      className="relative w-full rounded-3xl overflow-hidden border border-stone-800/80 bg-gradient-to-b from-[#18130E] via-[#100D0A] to-[#0A0806] p-6 sm:p-10 shadow-2xl text-stone-100 backdrop-blur-xl"
    >
      {/* Ambient Room Illumination */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[240px] bg-[radial-gradient(ellipse_at_top,rgba(217,119,6,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4af3708_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
        {/* Subtle Archival Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curator&apos;s Private Archive</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F5EEDB] leading-[1.15]">
          My Fragrance Cabinet
        </h1>

        {/* Cinematic Epigraph */}
        <p className="font-serif italic text-base sm:text-xl text-stone-300/90 max-w-xl">
          &ldquo;Every bottle is a memory. Every accord, a possibility.&rdquo;
        </p>

        {/* Real Wardrobe Analytics Ribbon */}
        <div className="w-full pt-4 pb-2 border-y border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2 sm:p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <span className="block font-serif text-2xl sm:text-3xl font-medium text-amber-300">
              {totalCount}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-stone-400">
              {totalCount === 1 ? 'Fragrance' : 'Fragrances'}
            </span>
          </div>

          <div className="p-2 sm:p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <span className="block font-serif text-2xl sm:text-3xl font-medium text-amber-300">
              {houseCount}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-stone-400">
              {houseCount === 1 ? 'Perfume House' : 'Perfume Houses'}
            </span>
          </div>

          <div className="p-2 sm:p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <span className="block font-serif text-2xl sm:text-3xl font-medium text-amber-300">
              {familyCount}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-stone-400">
              Scent Families
            </span>
          </div>

          <div className="p-2 sm:p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <span className="block font-serif text-2xl sm:text-3xl font-medium text-amber-300">
              {heritageCount}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-stone-400">
              Heritage Scents
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onScrollToShelves}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-[0_4px_20px_rgba(217,119,6,0.3)] transition cursor-pointer"
          >
            <Layers className="w-4 h-4 text-stone-950" />
            <span>Enter The Shelves</span>
          </button>

          <button
            type="button"
            onClick={onOpenTodaysEdit}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-medium text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>Today&apos;s Cabinet Edit</span>
          </button>

          <button
            type="button"
            onClick={onOpenIntelligence}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-700/60 text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span>Collection Intelligence</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-200 border border-stone-800 text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Flacon</span>
          </button>
        </div>
      </div>
    </section>
  );
};
