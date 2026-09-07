import React from 'react';
import { Sparkles, Wine, ArrowRight, Heart, Droplets, Compass, Layers } from 'lucide-react';

interface HomeHeroProps {
  onStart: () => void;
  onOpenCabinet: () => void;
  onOpenClusters: () => void;
  onSurpriseMe?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStart,
  onOpenCabinet,
  onOpenClusters,
  onSurpriseMe
}) => {
  return (
    <div className="space-y-8">
      {/* Visual Pinterest/Sephora Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-[#FAF0E6] to-[#FCEEE6] border border-[#F0E6DD] p-8 sm:p-12 lg:p-14 shadow-xs">
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-[#E86A92]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 rounded-full bg-[#F2A65A]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-60 h-60 rounded-full bg-[#7B3F98]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#F8B4CB] text-[#991B4C] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E86A92]" />
            <span>Harmonic Olfactory Engine &bull; Scent Universe</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.12] text-[#292323]">
            Find a scent that feels like <span className="italic text-[#7B3F98]">YOU</span>.
          </h1>

          <p className="text-base sm:text-lg text-[#786F6A] font-normal leading-relaxed max-w-2xl font-sans">
            Move beyond single perfumes. Pair luminous citrus openings with ancient Mysore sandalwood anchors and petrichor attars. Explore cross-cultural olfactory pairings that merge into your personalized signature sillage.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              id="hero-start-btn"
              type="button"
              onClick={onStart}
              className="px-7 py-3.5 bg-gradient-to-r from-[#7B3F98] via-[#8E44AD] to-[#E86A92] hover:opacity-95 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Explore My Layering Vibe</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {onSurpriseMe && (
              <button
                id="hero-surprise-btn"
                type="button"
                onClick={onSurpriseMe}
                className="px-5 py-3.5 bg-white hover:bg-stone-50 text-[#7B3F98] border border-[#E9D9F3] font-semibold text-xs sm:text-sm rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✨ Surprise Me</span>
              </button>
            )}

            <button
              id="hero-cabinet-btn"
              type="button"
              onClick={onOpenCabinet}
              className="px-5 py-3.5 bg-white hover:bg-stone-50 text-[#292323] border border-[#F0E6DD] font-medium text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wine className="w-4 h-4 text-[#E86A92]" />
              <span>My Cabinet Shelf</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Scent Universe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEBF2] text-[#991B4C] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-[#E86A92]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#292323] leading-tight">
              Chord Synergy &amp; Complementarity
            </h3>
            <p className="text-xs text-[#786F6A] leading-relaxed">
              Pairing complementary notes rather than stacking duplicates: a sheer dewy rose top layer elevated over a warm balsamic sandalwood base.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 mt-4 text-[11px] font-mono text-[#E86A92] font-semibold uppercase tracking-wider">
            Harmonic Chords
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCE3D8] text-[#90331A] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#D95D39]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#292323] leading-tight">
              Indian Botanical Heritage + Modern Niche
            </h3>
            <p className="text-xs text-[#786F6A] leading-relaxed">
              Bridging hydro-distilled Kannauj mitti and wild ruh khus attars with avant-garde French extraits for extraordinary warmth and projection.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 mt-4">
            <button
              type="button"
              onClick={onOpenClusters}
              className="text-xs font-semibold text-[#D95D39] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Explore K-Means Math</span> &rarr;
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 shadow-xs flex flex-col justify-between h-full">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBFBFA] text-[#0F766E] flex items-center justify-center shrink-0">
              <Wine className="w-5 h-5 text-[#55BFA3]" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#292323] leading-tight">
              Physical Cabinet Optimization
            </h3>
            <p className="text-xs text-[#786F6A] leading-relaxed">
              Check off bottles already in your possession. Our algorithm computes the highest-scoring bespoke pairing strictly from your actual vanity.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 mt-4">
            <button
              type="button"
              onClick={onOpenCabinet}
              className="text-xs font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Open My Shelf</span> &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
