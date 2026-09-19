import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { GlassSurface } from '../ui/GlassSurface.js';

interface AtelierPortalsProps {
  wardrobeCount: number;
  onNavigate: (tab: any) => void;
}

export const AtelierPortals: React.FC<AtelierPortalsProps> = ({
  wardrobeCount,
  onNavigate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Indian Fragrance Heritage Atlas: Archival Perfume Book Aesthetic */}
      <GlassSurface
        surface="atelier"
        radius="luxury"
        onClick={() => onNavigate('heritage')}
        className="p-6 sm:p-8 hover:border-amber-400/80 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-2xs"
      >
        {/* Archival Book Gilding & Subtle Watermark Tone */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none -z-10" />
        <div className="absolute top-3 right-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#8A7E74] opacity-75">
          VOL. I &bull; KANNAUJ ARCHIVES
        </div>

        <div>
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/70 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform shadow-2xs">
              <BookOpen className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <span className="font-brand text-[10px] uppercase text-amber-800 tracking-[0.2em] font-semibold block">
                Archival Lineage
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1A1613] font-medium leading-tight">
                Indian Fragrance Heritage Atlas
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5A5046] leading-relaxed font-sans">
            Discover four centuries of Kannauj <span className="font-serif italic text-[#1A1613]">Deg-Bhapka</span> hydro-distillation, subterranean Ruh Khus wild vetiver, Assam agarwood resins, and how ancient indigenous extracts layer with modern haute perfumery.
          </p>

          {/* Archival Material Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-mono text-amber-900">
              Mitti Attar
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-mono text-emerald-900">
              Ruh Khus
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200/80 text-[10px] font-mono text-rose-900">
              Gulab Damask
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[10px] font-mono text-orange-900">
              Assam Oud
            </span>
          </div>
        </div>

        <div className="mt-6 pt-3.5 border-t border-[#E8DFD3]/80 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-950">
          <span>Explore 6 Heritage Master Profiles</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </GlassSurface>

      {/* Personal Digital Wardrobe: Private Perfume Cabinet Aesthetic */}
      <GlassSurface
        surface="atelier"
        radius="luxury"
        onClick={() => onNavigate('wardrobe')}
        className="p-6 sm:p-8 hover:border-amber-400/80 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-2xs"
      >
        {/* Cabinet Ambient Tone */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/5 rounded-full blur-2xl pointer-events-none -z-10" />
        <div className="absolute top-3 right-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#8A7E74] opacity-75">
          PRIVATE VAULT
        </div>

        <div>
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200/70 border border-rose-300 flex items-center justify-center text-rose-900 group-hover:scale-105 transition-transform shadow-2xs">
              <Layers className="w-5 h-5 text-rose-900" />
            </div>
            <div>
              <span className="font-brand text-[10px] uppercase text-rose-800 tracking-[0.2em] font-semibold block">
                Curator&apos;s Cabinet
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1A1613] font-medium leading-tight">
                Digital Fragrance Wardrobe
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5A5046] leading-relaxed font-sans">
            Catalog your physical collection, test decant discovery samples, map your multi-dimensional olfactory DNA, and identify blind-spot accords in your personal fragrance rotation.
          </p>

          {/* Flacon Silhouettes Preview Strip */}
          <div className="flex items-center gap-2 mt-4 p-2.5 rounded-xl bg-white/70 border border-[#E8DFD3]">
            <div className="flex items-center -space-x-2">
              {[...Array(Math.min(4, Math.max(2, wardrobeCount)))].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-9 rounded-md border border-amber-300/80 bg-gradient-to-b from-amber-50 to-amber-100/90 flex items-center justify-center shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-700/70" />
                </div>
              ))}
            </div>
            <span className="text-xs font-mono font-medium text-[#2E2620] ml-2">
              {wardrobeCount} Flacon{wardrobeCount !== 1 ? 's' : ''} in Personal Sanctuary
            </span>
          </div>
        </div>

        <div className="mt-6 pt-3.5 border-t border-[#E8DFD3]/80 flex items-center justify-between text-xs font-semibold text-rose-800 group-hover:text-rose-950">
          <span>Open Fragrance Vault</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </GlassSurface>
    </div>
  );
};
