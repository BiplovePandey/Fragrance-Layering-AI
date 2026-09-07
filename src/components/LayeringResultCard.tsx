import React, { useState } from 'react';
import { LayeringResult } from '../types.js';
import { Bookmark, Star, Sparkles, Check, Droplets, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFamilyTheme } from '../theme.js';
import { LayeringMistBlendModal } from './LayeringMistBlendModal.js';

interface LayeringResultCardProps {
  result: LayeringResult;
  onSave: (result: LayeringResult) => void;
  onRate: (fragAId: number, fragBId: number, rating: number, feedbackTag?: string) => void;
  isSaved?: boolean;
}

export const LayeringResultCard: React.FC<LayeringResultCardProps> = ({
  result,
  onSave,
  onRate,
  isSaved = false
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isRated, setIsRated] = useState<boolean>(false);
  const [showMistModal, setShowMistModal] = useState<boolean>(false);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const { fragrance_a, fragrance_b, compatibility_score, explanation, why_it_works, best_season, best_occasion, best_time_of_day, breakdown } = result;

  const themeA = getFamilyTheme(fragrance_a.dominant_family);
  const themeB = getFamilyTheme(fragrance_b.dominant_family);

  const handleRate = (rating: number, tag?: string) => {
    setUserRating(rating);
    setIsRated(true);
    onRate(fragrance_a.id, fragrance_b.id, rating, tag || selectedTag);
  };

  const handleSaveClick = () => {
    onSave(result);
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#7B3F98', '#E86A92', '#F2A65A', '#55BFA3']
    });
  };

  return (
    <div id={`layering-card-${fragrance_a.id}-${fragrance_b.id}`} className="bg-white rounded-3xl border border-[#F0E6DD] shadow-xs overflow-hidden transition-all hover:shadow-md">
      {/* Top Banner: Dual Scent Fusion Header */}
      <div className="bg-gradient-to-r from-[#FFF9F3] via-[#FAF0E6] to-[#FCEEE6] border-b border-[#F0E6DD] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#991B4C] px-2.5 py-0.5 rounded-full bg-[#FFE4EE] border border-[#F8B4CB]">
              Harmonic Accord
            </span>
            {result.is_cross_origin && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5B2186] px-2.5 py-0.5 rounded-full bg-[#E9D6F5] border border-[#C79FE2] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#7B3F98]" />
                East &times; West Fusion
              </span>
            )}
            {result.origin_pairing_type === 'pure_indian_heritage' && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#90331A] px-2.5 py-0.5 rounded-full bg-[#FCE0D2] border border-[#F4B097]">
                🇮🇳 Pure Indian Heritage
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#292323] flex flex-wrap items-center gap-2">
            <span>{fragrance_a.name}</span>
            <span className="text-[#E86A92] font-light text-2xl">+</span>
            <span>{fragrance_b.name}</span>
          </h3>

          <p className="text-xs text-[#786F6A] flex flex-wrap items-center gap-x-2">
            <span className="font-medium text-[#292323]">{fragrance_a.brand}</span>
            <span className="text-stone-300">&bull;</span>
            <span className="text-stone-500">{fragrance_a.format || 'EDP'}</span>
            <span className="text-[#E86A92] font-bold">&times;</span>
            <span className="font-medium text-[#292323]">{fragrance_b.brand}</span>
            <span className="text-stone-300">&bull;</span>
            <span className="text-stone-500">{fragrance_b.format || 'EDP'}</span>
          </p>
        </div>

        {/* Score & Mist Fusion Trigger */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#F0E6DD] text-right shadow-2xs">
            <span className="block text-[9px] uppercase font-bold tracking-widest text-[#786F6A]">
              Compatibility
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#7B3F98] tracking-tight">
              {compatibility_score}%
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMistModal(true)}
            className="px-3.5 py-3 rounded-2xl bg-gradient-to-tr from-[#7B3F98] to-[#E86A92] text-white shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-xs font-semibold cursor-pointer shrink-0"
            title="Watch dual mists blend"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Blend Mists</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Context Badges: Season, Occasion, Time */}
        <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-stone-100 text-xs">
          <span className="text-[#786F6A] font-semibold uppercase tracking-wider mr-1 text-[11px]">Setting:</span>
          <span className="px-3 py-1 rounded-full bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] font-medium text-xs">
            ☀️ {best_season}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FAF6F0] text-[#634226] border border-[#EDE0CE] font-medium text-xs">
            💼 {best_occasion}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#F9F3FC] text-[#5B2186] border border-[#E9D9F3] font-medium text-xs">
            🌙 {best_time_of_day}
          </span>

          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="ml-auto text-xs text-[#7B3F98] hover:underline font-semibold cursor-pointer"
          >
            {showBreakdown ? 'Hide Chemistry Weights' : 'Why this Match? (ML Breakdown)'}
          </button>
        </div>

        {/* Math & Chemistry Breakdown (No Jargon, Clean Sephora/Spotify Style) */}
        {showBreakdown && (
          <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#F0E6DD] text-xs space-y-3 animate-fade-in">
            <div className="font-bold text-[#292323] uppercase tracking-wider flex items-center justify-between">
              <span>Why This Match Works (Harmonic Weights)</span>
              <span className="font-mono text-stone-400 text-[10px]">Optimal Equilibrium = 100%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              <div className="p-2 rounded-xl bg-white border border-[#F0E6DD]">
                <span className="text-[#786F6A] block text-[11px]">Note Synergy (40%)</span>
                <span className="font-mono font-bold text-[#7B3F98] text-sm">{breakdown.note_compatibility}%</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#F0E6DD]">
                <span className="text-[#786F6A] block text-[11px]">Your Taste Match (20%)</span>
                <span className="font-mono font-bold text-[#E86A92] text-sm">{breakdown.user_preference_match}%</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#F0E6DD]">
                <span className="text-[#786F6A] block text-[11px]">Season Fit (15%)</span>
                <span className="font-mono font-bold text-[#D97706] text-sm">{breakdown.season_compatibility}%</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#F0E6DD]">
                <span className="text-[#786F6A] block text-[11px]">Occasion Fit (15%)</span>
                <span className="font-mono font-bold text-[#0F766E] text-sm">{breakdown.occasion_compatibility}%</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#F0E6DD]">
                <span className="text-[#786F6A] block text-[11px]">Diversity Factor (10%)</span>
                <span className="font-mono font-bold text-[#D95D39] text-sm">{breakdown.diversity_factor}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Why this works editorial callout */}
        <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#F0E6DD] space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B3F98] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E86A92]" />
            Olfactory Synergy
          </h4>

          <p className="text-sm text-[#292323] leading-relaxed font-serif italic text-base">
            &ldquo;{explanation}&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-200/60 text-xs text-[#786F6A]">
            <div>
              <span className="font-bold text-[#292323] block mb-0.5">Opening Interaction:</span>
              <span>{why_it_works.opening_harmony}</span>
            </div>
            <div>
              <span className="font-bold text-[#292323] block mb-0.5">Drydown Evolution:</span>
              <span>{why_it_works.drydown_depth}</span>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#F0E6DD] text-xs text-[#292323] space-y-1">
            <div className="flex items-center gap-2 text-[#7B3F98] font-bold">
              <Droplets className="w-4 h-4 text-[#E86A92] shrink-0" />
              <span>Application Ritual: {result.layering_method || 'Pulse-Point Synergy'}</span>
            </div>
            <p className="text-[#786F6A] pl-6 leading-relaxed">
              {why_it_works.application_tip}
            </p>
          </div>
        </div>

        {/* Visual Note Pyramids Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 items-stretch">
          {/* Fragrance A Note Pyramid */}
          <div className="p-4 rounded-2xl border border-[#F0E6DD] bg-white flex flex-col justify-between h-full shadow-2xs">
            <div className="flex items-start justify-between gap-2 mb-3 min-h-[52px]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#786F6A] block">
                  Base Anchor
                </span>
                <h5 className="font-serif text-lg font-bold text-[#292323] leading-snug">
                  {fragrance_a.name}
                </h5>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-[#786F6A]">
                  <span className="font-medium text-[#292323]">{fragrance_a.brand}</span>
                  <span>&bull;</span>
                  <span className="px-1.5 py-0.5 bg-[#FFF9F3] text-[#7B3F98] rounded font-medium border border-[#F0E6DD] text-[10px]">
                    {fragrance_a.format || 'EDP'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 rounded-full text-stone-700 shrink-0">
                {fragrance_a.intensity}/10 Int.
              </span>
            </div>

            <div className="space-y-1.5 text-xs border-t border-stone-100 pt-3">
              <div className="flex items-start gap-2">
                <span className="w-12 text-[#786F6A] font-mono text-[10px] uppercase shrink-0 pt-0.5">Top:</span>
                <span className="text-[#292323] font-medium">{(fragrance_a.top_notes || []).join(', ')}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-12 text-[#786F6A] font-mono text-[10px] uppercase shrink-0 pt-0.5">Heart:</span>
                <span className="text-[#292323] font-medium">{(fragrance_a.middle_notes || []).join(', ')}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-12 text-[#786F6A] font-mono text-[10px] uppercase shrink-0 pt-0.5">Base:</span>
                <span className="text-[#292323] font-medium">{(fragrance_a.base_notes || []).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Fragrance B Note Pyramid */}
          <div className="p-4 rounded-2xl border border-[#F0E6DD] bg-white flex flex-col justify-between h-full shadow-2xs">
            <div className="flex items-start justify-between gap-2 mb-3 min-h-[52px]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#786F6A] block">
                  Top Veil
                </span>
                <h5 className="font-serif text-lg font-bold text-[#292323] leading-snug">
                  {fragrance_b.name}
                </h5>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-[#786F6A]">
                  <span className="font-medium text-[#292323]">{fragrance_b.brand}</span>
                  <span>&bull;</span>
                  <span className="px-1.5 py-0.5 bg-[#FFF9F3] text-[#7B3F98] rounded font-medium border border-[#F0E6DD] text-[10px]">
                    {fragrance_b.format || 'EDP'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 rounded-full text-stone-700 shrink-0">
                {fragrance_b.intensity}/10 Int.
              </span>
            </div>

            <div className="space-y-1.5 text-xs border-t border-stone-100 pt-3">
              <div className="flex items-start gap-2">
                <span className="w-12 text-[#786F6A] font-mono text-[10px] uppercase shrink-0 pt-0.5">Top:</span>
                <span className="text-[#292323] font-medium">{(fragrance_b.top_notes || []).join(', ')}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-12 text-[#786F6A] font-mono text-[10px] uppercase shrink-0 pt-0.5">Heart:</span>
                <span className="text-[#292323] font-medium">{(fragrance_b.middle_notes || []).join(', ')}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-12 text-[#786F6A] font-mono text-[10px] uppercase shrink-0 pt-0.5">Base:</span>
                <span className="text-[#292323] font-medium">{(fragrance_b.base_notes || []).join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Feedback Bar */}
        <div className="pt-3 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaved}
            className={`h-10 px-5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all inline-flex items-center justify-center gap-2 shrink-0 ${
              isSaved
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-gradient-to-r from-[#7B3F98] to-[#E86A92] hover:opacity-95 text-white shadow-xs cursor-pointer'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Saved to Wardrobe</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-amber-200 shrink-0" />
                <span>Save Combination</span>
              </>
            )}
          </button>

          {/* Star Rating Feedback */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-[#786F6A] font-medium whitespace-nowrap">
              {isRated ? 'Rating registered:' : 'Rate harmony:'}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRate(star)}
                  className="p-1 hover:scale-115 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      (hoverRating || userRating) >= star
                        ? 'fill-[#F2A65A] text-[#F2A65A]'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Quick Feedback Tags */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Balanced', 'Too Heavy', 'Loved It'].map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag);
                    if (userRating > 0) handleRate(userRating, tag);
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[#7B3F98] text-white border-[#7B3F98]'
                      : 'bg-white text-[#786F6A] border-[#F0E6DD] hover:bg-stone-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mist Blending Visual Modal */}
      {showMistModal && (
        <LayeringMistBlendModal
          isOpen={showMistModal}
          onClose={() => setShowMistModal(false)}
          result={result}
          onSave={onSave}
          isSaved={isSaved}
        />
      )}
    </div>
  );
};
