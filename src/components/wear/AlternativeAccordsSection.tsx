import React from 'react';
import {
  Sparkles,
  Shuffle,
  Crown,
  Eye,
  Layers,
  FlaskConical,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { WearRecommendation, Fragrance } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';

interface AlternativeAccordsSectionProps {
  alternatives: WearRecommendation[];
  onWearToday: (frag: Fragrance) => void;
  onInspectInChamber: (frag: Fragrance) => void;
  onSendToLab?: (frag: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
  onSurpriseTheAtelier?: () => void;
  isLoading?: boolean;
}

export const AlternativeAccordsSection: React.FC<AlternativeAccordsSectionProps> = ({
  alternatives = [],
  onWearToday,
  onInspectInChamber,
  onSendToLab,
  onAddToWardrobe,
  onSurpriseTheAtelier,
  isLoading = false
}) => {
  if (alternatives.length === 0 && !onSurpriseTheAtelier) {
    return null;
  }

  // Determine nuance badge based on fragrance characteristics
  const getNuanceBadge = (frag: Fragrance, idx: number): string => {
    const family = (frag.fragrance_family || '').toLowerCase();
    const notes = [
      ...(frag.top_notes || []),
      ...(frag.middle_notes || []),
      ...(frag.base_notes || [])
    ].join(' ').toLowerCase();

    if (family.includes('fresh') || notes.includes('bergamot') || notes.includes('citrus')) {
      return 'More Fresh & Solar';
    }
    if (family.includes('woody') || notes.includes('sandalwood') || notes.includes('cedar')) {
      return 'More Deep & Woody';
    }
    if (family.includes('amber') || family.includes('oriental') || notes.includes('vanilla')) {
      return 'More Intimate & Amber';
    }
    if (notes.includes('rose') || notes.includes('jasmine') || family.includes('floral')) {
      return 'More Regal & Floral';
    }
    return `Alternative Path #${idx + 1}`;
  };

  return (
    <section
      id="wear-today-alternatives"
      aria-label="Chapter VII: Alternative Paths"
      className="rounded-3xl p-6 sm:p-8 bg-[#14110E] border border-amber-900/30 text-stone-200 shadow-xl space-y-6"
    >
      {/* Header & Surprise CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Chapter VII &bull; Alternative Paths
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            Not Quite Your Mood?
          </h2>
        </div>

        {onSurpriseTheAtelier && (
          <button
            type="button"
            onClick={onSurpriseTheAtelier}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-700/80 to-rose-800/80 hover:from-amber-600 hover:to-rose-700 text-amber-100 border border-amber-500/40 text-xs font-mono transition cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Let the atelier choose a surprising harmony"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Surprise the Atelier</span>
          </button>
        )}
      </div>

      {/* Alternative Cards Grid */}
      {alternatives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alternatives.slice(0, 3).map((rec, idx) => {
            const { fragrance, score, reasons, ownership } = rec;
            const isOwned = ownership?.owned ?? false;
            const nuance = getNuanceBadge(fragrance, idx);
            const primaryReason = reasons[0] || `${fragrance.fragrance_family} composition offering high diurnal balance.`;

            return (
              <div
                key={fragrance.id}
                className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800/90 hover:border-amber-700/40 transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Nuance Badge & Score */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider">
                      {nuance}
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-300">
                      {score}% Match
                    </span>
                  </div>

                  {/* Bottle Icon & Title */}
                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-14 h-20 shrink-0 flex items-center justify-center bg-stone-950/60 rounded-xl border border-white/[0.04] p-1">
                      <ScentBottle
                        name={fragrance.name}
                        brand={fragrance.brand_name || fragrance.brand}
                        family={fragrance.fragrance_family?.toLowerCase()}
                        size="sm"
                        fillLevel={80}
                      />
                    </div>

                    <div className="overflow-hidden">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block truncate">
                        {fragrance.brand_name || fragrance.brand}
                      </span>
                      <h4 className="font-serif text-base text-stone-100 font-medium truncate group-hover:text-amber-200 transition-colors">
                        {fragrance.name}
                      </h4>
                      <span className="text-[11px] text-amber-400/90 font-mono block mt-0.5">
                        {fragrance.concentration || 'Eau de Parfum'}
                      </span>
                    </div>
                  </div>

                  {/* One-Line Reason */}
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-sans">
                    {primaryReason}
                  </p>
                </div>

                {/* Ownership Tag & Quick Action Strip */}
                <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    {isOwned ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>In Cabinet</span>
                      </span>
                    ) : (
                      <span className="text-stone-500">From Atelier Catalog</span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {/* Wear This */}
                    <button
                      type="button"
                      onClick={() => onWearToday(fragrance)}
                      className="py-1.5 px-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-semibold text-xs transition cursor-pointer text-center"
                    >
                      Wear
                    </button>

                    {/* Inspect */}
                    <button
                      type="button"
                      onClick={() => onInspectInChamber(fragrance)}
                      className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition cursor-pointer text-center"
                    >
                      Inspect
                    </button>

                    {/* Layer / Lab */}
                    {onSendToLab ? (
                      <button
                        type="button"
                        onClick={() => onSendToLab(fragrance)}
                        className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition cursor-pointer text-center"
                      >
                        Layer
                      </button>
                    ) : !isOwned && onAddToWardrobe ? (
                      <button
                        type="button"
                        onClick={() => onAddToWardrobe(fragrance.id)}
                        className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition cursor-pointer text-center"
                      >
                        + Cabinet
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 text-center text-xs text-stone-400 font-mono">
          No secondary variations found matching current filters.
        </div>
      )}
    </section>
  );
};
