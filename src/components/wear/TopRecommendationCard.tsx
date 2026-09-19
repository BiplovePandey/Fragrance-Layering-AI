import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  FlaskConical,
  Compass,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Briefcase,
  ShieldCheck,
  Heart,
  Droplets,
  Layers,
  Crown
} from 'lucide-react';
import { WearRecommendation, Fragrance } from '../../types.js';
import { SignalBreakdown } from './SignalBreakdown.js';
import { getFlaconLayoutId, SHARED_FLACON_TRANSITION } from '../../motion/sharedElements.js';
import { motion } from 'motion/react';

interface TopRecommendationCardProps {
  recommendation: WearRecommendation;
  onWearToday: (frag: Fragrance) => void;
  onInspectInChamber: (frag: Fragrance) => void;
  onSendToLab?: (frag: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
}

export const TopRecommendationCard: React.FC<TopRecommendationCardProps> = ({
  recommendation,
  onWearToday,
  onInspectInChamber,
  onSendToLab,
  onAddToWardrobe
}) => {
  const [showReasoning, setShowReasoning] = useState<boolean>(false);
  const { fragrance, score, reasons, match, ownership } = recommendation;
  const isOwned = ownership?.owned ?? false;

  // Categorize returned reasons based on actual text
  const weatherReason = reasons.find(r => /temperature|heat|weather|cold|cool|humidity|diffusion|atmosphere/i.test(r));
  const occasionReason = reasons.find(r => /formal|office|casual|festive|wedding|evening|day|date|setting|attire/i.test(r) && r !== weatherReason);
  const characterReason = reasons.find(r => /affinity|mood|mindset|compositions|character|confidence|sensual|serene/i.test(r));
  const performanceReason = reasons.find(r => /endurance|sillage|longevity|projection|hours/i.test(r));
  const wardrobeReason = reasons.find(r => /wardrobe|rotation|owned/i.test(r));

  // Fallback to primary reasons if not specifically classified
  const otherReasons = reasons.filter(r =>
    r !== weatherReason &&
    r !== occasionReason &&
    r !== characterReason &&
    r !== performanceReason &&
    r !== wardrobeReason
  );

  return (
    <div className="rounded-3xl liquid-glass p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-[0_12px_44px_rgba(95,70,40,0.08)] space-y-6">
      {/* Decorative subtle ambient bloom */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/25 via-rose-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Eyebrow */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-xs font-mono-lab">
          <Crown className="w-3.5 h-3.5 text-amber-700" />
          <span className="font-semibold tracking-wider">TODAY'S SIGNATURE</span>
        </div>

        {/* Ownership Badge */}
        <div className="flex items-center gap-2">
          {isOwned ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>In Your Wardrobe</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F5EE] border border-[#DDD3C2] text-[#6B6056] text-xs font-medium">
              <Layers className="w-3.5 h-3.5 text-[#8A7E74]" />
              <span>From Curated Catalog</span>
            </span>
          )}

          {/* Compatibility Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/80">
            <span className="text-[11px] font-mono-lab text-[#7A6F66]">Context Match:</span>
            <span className="text-sm font-mono-lab font-bold text-amber-900">
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Fragrance Overview */}
      <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
        {/* Flacon Visual Anchor */}
        <motion.div
          layoutId={getFlaconLayoutId(fragrance.id)}
          transition={SHARED_FLACON_TRANSITION}
          onClick={() => onInspectInChamber(fragrance)}
          className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-white border border-amber-300 flex flex-col items-center justify-center shrink-0 cursor-pointer shadow-xs hover:scale-105 transition-transform group"
          title="Click to inspect in Fragrance Chamber"
        >
          <div className="w-5 h-2.5 rounded-xs bg-amber-700/80 border border-amber-600/40 mb-1" />
          <div className="w-10 h-12 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-700 group-hover:rotate-12 transition-transform" />
          </div>
        </motion.div>

        {/* Fragrance Metadata */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
              {fragrance.name}
            </h2>
            <span className="text-sm font-sans text-amber-800 font-semibold">
              by {fragrance.brand}
            </span>
            <span className="text-[10px] font-mono-lab uppercase tracking-wider px-2 py-0.5 rounded bg-[#F2ECE1] text-[#5A5046] border border-[#DDD3C2]">
              {fragrance.concentration || fragrance.format || 'Fine Parfum'}
            </span>
            {fragrance.origin_style && (
              <span className="text-[10px] font-mono-lab uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {fragrance.origin_style}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#4D433A] leading-relaxed max-w-3xl">
            {fragrance.description}
          </p>

          {/* Note Pyramids */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {(fragrance.top_notes || []).slice(0, 3).map((n) => (
              <span key={n} className="px-2.5 py-1 rounded-lg bg-white/80 border border-[#E3DACB] text-[11px] text-[#3D352E] font-medium">
                Top: {n}
              </span>
            ))}
            {(fragrance.middle_notes || []).slice(0, 2).map((n) => (
              <span key={n} className="px-2.5 py-1 rounded-lg bg-white/80 border border-[#E3DACB] text-[11px] text-[#3D352E] font-medium">
                Heart: {n}
              </span>
            ))}
            {(fragrance.base_notes || []).slice(0, 2).map((n) => (
              <span key={n} className="px-2.5 py-1 rounded-lg bg-white/80 border border-[#E3DACB] text-[11px] text-[#3D352E] font-medium">
                Base: {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WHY IT FITS: Signal Evidence Section */}
      <div className="space-y-3 pt-2 relative z-10">
        <h3 className="text-xs font-mono-lab uppercase tracking-widest text-[#7A6F66]">
          Why It Fits Your Day
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {weatherReason && (
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E3DACB] flex items-start gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 block">Atmospheric Harmonization</span>
                <p className="text-xs text-[#5A5046] mt-0.5 leading-relaxed">{weatherReason}</p>
              </div>
            </div>
          )}

          {occasionReason && (
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E3DACB] flex items-start gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 block">Occasion &amp; Formality</span>
                <p className="text-xs text-[#5A5046] mt-0.5 leading-relaxed">{occasionReason}</p>
              </div>
            </div>
          )}

          {characterReason && (
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E3DACB] flex items-start gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 block">Aura &amp; Mindset Resonance</span>
                <p className="text-xs text-[#5A5046] mt-0.5 leading-relaxed">{characterReason}</p>
              </div>
            </div>
          )}

          {performanceReason && (
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E3DACB] flex items-start gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 block">Performance Envelope</span>
                <p className="text-xs text-[#5A5046] mt-0.5 leading-relaxed">{performanceReason}</p>
              </div>
            </div>
          )}

          {wardrobeReason && (
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E3DACB] flex items-start gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-emerald-900 block">Wardrobe Status</span>
                <p className="text-xs text-[#5A5046] mt-0.5 leading-relaxed">{wardrobeReason}</p>
              </div>
            </div>
          )}

          {otherReasons.map((r, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white/70 border border-[#E3DACB] flex items-start gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 block">Context Match</span>
                <p className="text-xs text-[#5A5046] mt-0.5 leading-relaxed">{r}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Reasoning Breakdown */}
      <div className="border-t border-[#E8DFD3] pt-4 relative z-10">
        <button
          type="button"
          onClick={() => setShowReasoning(prev => !prev)}
          className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <span>{showReasoning ? 'Hide Detailed Reasoning' : 'See the Reasoning Breakdown'}</span>
          {showReasoning ? <ChevronUp className="w-4 h-4 text-amber-700" /> : <ChevronDown className="w-4 h-4 text-amber-700" />}
        </button>

        {showReasoning && (
          <div className="pt-3">
            <SignalBreakdown match={match} score={score} />
          </div>
        )}
      </div>

      {/* Primary Actions */}
      <div className="border-t border-[#E8DFD3] pt-5 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Wear Today action */}
          <button
            type="button"
            onClick={() => onWearToday(fragrance)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 border border-amber-500/50 shadow-[0_4px_16px_rgba(217,119,6,0.25)] transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Wear Today (Set as SOTD)</span>
          </button>

          {/* Add to Wardrobe if not owned */}
          {!isOwned && onAddToWardrobe && (
            <button
              type="button"
              onClick={() => onAddToWardrobe(fragrance.id)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>Add to Wardrobe</span>
            </button>
          )}

          {/* Send to Lab */}
          {onSendToLab && (
            <button
              type="button"
              onClick={() => onSendToLab(fragrance)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A5046] hover:text-[#1A1613] bg-white/80 hover:bg-white border border-[#E3DACB] transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
              <span>Pair in Lab</span>
            </button>
          )}
        </div>

        {/* Inspect in 3D Chamber */}
        <button
          type="button"
          onClick={() => onInspectInChamber(fragrance)}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <span>Inspect in Fragrance Chamber</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
