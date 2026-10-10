import React from 'react';
import {
  Sparkles,
  Shuffle,
  Crown,
  Eye,
  Layers,
  FlaskConical,
  CheckCircle2,
  Plus,
  Info,
  ShieldCheck
} from 'lucide-react';
import { WearRecommendation, Fragrance } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';
import { getAlternativeDifference } from '../../utils/recommendationExplanation.js';

interface AlternativeAccordsSectionProps {
  alternatives: WearRecommendation[];
  protagonist?: Fragrance;
  onWearToday: (frag: Fragrance) => void;
  onInspectInChamber: (frag: Fragrance) => void;
  onSendToLab?: (frag: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
  onSurpriseTheAtelier?: () => void;
  isLoading?: boolean;
}

export const AlternativeAccordsSection: React.FC<AlternativeAccordsSectionProps> = ({
  alternatives = [],
  protagonist,
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
            Seeking a Different Olfactory Direction?
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Alternative candidates evaluated by actual note and family differences, not ranked as better or worse.
          </p>
        </div>

        {onSurpriseTheAtelier && (
          <button
            type="button"
            onClick={onSurpriseTheAtelier}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700/80 to-rose-800/80 hover:from-amber-600 hover:to-rose-700 text-amber-100 border border-amber-500/40 text-xs font-mono transition cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Explore an alternative qualified candidate"
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
            const { fragrance, score, ownership } = rec;
            const isOwned = ownership?.owned ?? false;

            // Compute factual difference relative to protagonist or benchmark
            const diff = getAlternativeDifference(
              fragrance,
              protagonist || alternatives[0]?.fragrance || fragrance,
              idx
            );

            return (
              <div
                key={fragrance?.id || idx}
                className="p-5 rounded-2xl bg-stone-900/50 border border-stone-800/90 hover:border-amber-700/40 transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Factual Difference Badge & Alignment Score */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-[10px] font-mono uppercase tracking-wider font-semibold">
                      {diff.badge}
                    </span>
                    <span className="text-xs font-mono font-medium text-stone-300 flex items-center gap-1">
                      <span>{score}% Alignment</span>
                      <span className="text-[9px] text-stone-500 uppercase">CALCULATED</span>
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
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-amber-400/90 font-mono">
                          {fragrance.concentration || 'Eau de Parfum'}
                        </span>
                        <span className="text-stone-600">&bull;</span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {fragrance.fragrance_family}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Factual Difference Explanation (No better/worse bias) */}
                  <div className="p-3 rounded-xl bg-stone-950/50 border border-stone-800 text-xs text-stone-300 space-y-1">
                    <div className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">
                      Difference Dimension &bull; {diff.dimension}
                    </div>
                    <p className="leading-relaxed text-[11px] font-sans text-stone-300">
                      {diff.explanation}
                    </p>
                  </div>

                  {/* Note Chips */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {(fragrance.top_notes || []).slice(0, 2).map((n) => (
                      <span
                        key={n}
                        className="px-2 py-0.5 rounded-md bg-stone-950/70 border border-stone-800 text-[10px] text-stone-400 font-mono"
                      >
                        {n}
                      </span>
                    ))}
                    {(fragrance.base_notes || []).slice(0, 2).map((n) => (
                      <span
                        key={n}
                        className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-900/30 text-[10px] text-amber-300/80 font-mono"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onWearToday(fragrance)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Wear</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectInChamber(fragrance)}
                      className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
                      title="Inspect in Fragrance Chamber"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {onSendToLab && (
                      <button
                        type="button"
                        onClick={() => onSendToLab(fragrance)}
                        className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
                        title="Send to Layering Laboratory"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {!isOwned && onAddToWardrobe && (
                    <button
                      type="button"
                      onClick={() => onAddToWardrobe(fragrance.id)}
                      className="text-[11px] font-mono text-stone-400 hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Cabinet</span>
                    </button>
                  )}

                  {isOwned && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Owned</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 text-center text-xs text-stone-400">
          No alternative paths currently required. You are viewing today’s optimal accord.
        </div>
      )}
    </section>
  );
};
