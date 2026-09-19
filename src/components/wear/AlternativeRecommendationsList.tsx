import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { WearRecommendation, Fragrance } from '../../types.js';
import { SignalBreakdown } from './SignalBreakdown.js';

interface AlternativeRecommendationsListProps {
  recommendations: WearRecommendation[];
  onWearToday: (frag: Fragrance) => void;
  onInspectInChamber: (frag: Fragrance) => void;
  onSendToLab?: (frag: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
}

export const AlternativeRecommendationsList: React.FC<AlternativeRecommendationsListProps> = ({
  recommendations,
  onWearToday,
  onInspectInChamber,
  onSendToLab,
  onAddToWardrobe
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono-lab uppercase tracking-widest text-[#7A6F66]">
          Alternative Olfactory Directions ({recommendations.length})
        </span>
        <span className="text-[11px] text-[#7A6F66]">
          Ranked by multi-factor harmony
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const { fragrance, score, reasons, match, ownership, rank } = rec;
          const isOwned = ownership?.owned ?? false;
          const isExpanded = expandedId === fragrance.id;

          return (
            <div
              key={fragrance.id}
              className="p-5 rounded-3xl liquid-glass border border-white/80 hover:border-amber-300 transition shadow-[0_4px_24px_rgba(95,70,40,0.04)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Rank + Score + Ownership */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-mono-lab font-bold flex items-center justify-center">
                      #{rank}
                    </span>
                    {isOwned ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Wardrobe
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#7A6F66] bg-[#F2ECE1] border border-[#DDD3C2] px-2 py-0.5 rounded-full">
                        Catalog
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono-lab font-bold text-amber-900 bg-amber-50/80 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                    <span>{score}%</span>
                    <span className="text-[10px] font-normal text-[#7A6F66]">Fit</span>
                  </div>
                </div>

                {/* Fragrance Name & Brand */}
                <div>
                  <h3
                    onClick={() => onInspectInChamber(fragrance)}
                    className="font-serif text-lg text-[#1A1613] font-medium hover:text-amber-900 transition cursor-pointer leading-tight"
                  >
                    {fragrance.name}
                  </h3>
                  <span className="text-xs text-amber-800 font-semibold block mt-0.5">
                    by {fragrance.brand}
                  </span>
                </div>

                {/* Primary Reason */}
                {reasons.length > 0 && (
                  <p className="text-xs text-[#5A5046] leading-relaxed">
                    {reasons[0]}
                  </p>
                )}

                {/* Notes Pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(fragrance.top_notes || []).slice(0, 2).map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-md bg-white/80 border border-[#E3DACB] text-[10px] text-[#5A5046]">
                      {n}
                    </span>
                  ))}
                  {(fragrance.middle_notes || []).slice(0, 1).map((n) => (
                    <span key={n} className="px-2 py-0.5 rounded-md bg-white/80 border border-[#E3DACB] text-[10px] text-[#5A5046]">
                      {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expandable Reasoning Details */}
              {isExpanded && (
                <div className="pt-2 border-t border-[#E8DFD3]">
                  <SignalBreakdown match={match} score={score} />
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-white/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onWearToday(fragrance)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Wear Today</span>
                  </button>

                  {!isOwned && onAddToWardrobe && (
                    <button
                      type="button"
                      onClick={() => onAddToWardrobe(fragrance.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs text-[#5A5046] hover:text-[#1A1613] bg-white/70 hover:bg-white border border-[#E3DACB] transition cursor-pointer"
                      title="Add to Wardrobe"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onSendToLab && (
                    <button
                      type="button"
                      onClick={() => onSendToLab(fragrance)}
                      className="px-2.5 py-1.5 rounded-lg text-xs text-[#5A5046] hover:text-[#1A1613] bg-white/70 hover:bg-white border border-[#E3DACB] transition cursor-pointer"
                      title="Pair in Laboratory"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : fragrance.id)}
                    className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide' : 'Signals'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onInspectInChamber(fragrance)}
                    className="text-xs text-[#7A6F66] hover:text-[#1A1613] flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
