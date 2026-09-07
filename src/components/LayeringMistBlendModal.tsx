import React, { useEffect, useState } from 'react';
import { Sparkles, X, Heart, Award, ArrowRight, Droplets } from 'lucide-react';
import { LayeringResult } from '../types.js';
import { getFamilyTheme } from '../theme.js';

interface LayeringMistBlendModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: LayeringResult | null;
  onSave?: (result: LayeringResult) => void;
  isSaved?: boolean;
}

export const LayeringMistBlendModal: React.FC<LayeringMistBlendModalProps> = ({
  isOpen,
  onClose,
  result,
  onSave,
  isSaved
}) => {
  const [animationStage, setAnimationStage] = useState<'approaching' | 'merging' | 'harmonized'>('approaching');

  useEffect(() => {
    if (!isOpen || !result) {
      setAnimationStage('approaching');
      return;
    }

    setAnimationStage('approaching');
    const timer1 = setTimeout(() => {
      setAnimationStage('merging');
    }, 700);

    const timer2 = setTimeout(() => {
      setAnimationStage('harmonized');
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const fragA = result.fragrance_a;
  const fragB = result.fragrance_b;
  const themeA = getFamilyTheme(fragA.dominant_family);
  const themeB = getFamilyTheme(fragB.dominant_family);

  const overallPercent = Math.round(result.overall_score * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FFF9F3] rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors cursor-pointer z-20 shadow-2xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9D6F5] text-[#5B2186] text-[11px] font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#7B3F98]" />
            <span>Harmonic Mist Fusion</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292323]">
            {animationStage === 'harmonized' ? '✨ Your Signature Sillage' : 'Blending Scent Mists...'}
          </h3>
        </div>

        {/* Visual Animated Mist Stage */}
        <div className="relative h-56 w-full rounded-3xl bg-white border border-[#F0E6DD] overflow-hidden flex items-center justify-center p-4 shadow-inner">
          {/* Left Mist (Fragrance A) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl opacity-70 transition-all duration-1000 ${
              animationStage === 'approaching'
                ? 'left-0 scale-95'
                : animationStage === 'merging'
                ? 'left-1/4 scale-110'
                : 'left-1/3 scale-125'
            }`}
            style={{
              background: `radial-gradient(circle, ${themeA.borderColor} 0%, rgba(255,255,255,0) 70%)`
            }}
          />

          {/* Right Mist (Fragrance B) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl opacity-70 transition-all duration-1000 ${
              animationStage === 'approaching'
                ? 'right-0 scale-95'
                : animationStage === 'merging'
                ? 'right-1/4 scale-110'
                : 'right-1/3 scale-125'
            }`}
            style={{
              background: `radial-gradient(circle, ${themeB.borderColor} 0%, rgba(255,255,255,0) 70%)`
            }}
          />

          {/* Center Fusion Glow when harmonized */}
          {animationStage === 'harmonized' && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#E86A92]/15 via-[#7B3F98]/20 to-[#F2A65A]/15 animate-pulse rounded-3xl pointer-events-none" />
          )}

          {/* Dual Bottles Representation */}
          <div className="relative z-10 w-full flex items-center justify-around">
            <div className={`text-center space-y-1 transition-transform duration-700 ${animationStage === 'harmonized' ? 'scale-105' : ''}`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white border-2 flex items-center justify-center text-2xl shadow-sm" style={{ borderColor: themeA.borderColor }}>
                {fragA.is_oil_based ? '🧪' : '🧴'}
              </div>
              <div className="text-xs font-bold text-[#292323] max-w-[120px] truncate">{fragA.name}</div>
              <div className="text-[10px] font-mono text-[#786F6A]">{fragA.dominant_family}</div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className={`text-xl transition-transform duration-500 ${animationStage === 'harmonized' ? 'scale-125 text-[#7B3F98]' : 'text-stone-400'}`}>
                +
              </span>
              {animationStage === 'harmonized' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 mt-1">
                  Fused
                </span>
              )}
            </div>

            <div className={`text-center space-y-1 transition-transform duration-700 ${animationStage === 'harmonized' ? 'scale-105' : ''}`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white border-2 flex items-center justify-center text-2xl shadow-sm" style={{ borderColor: themeB.borderColor }}>
                {fragB.is_oil_based ? '🧪' : '🧴'}
              </div>
              <div className="text-xs font-bold text-[#292323] max-w-[120px] truncate">{fragB.name}</div>
              <div className="text-[10px] font-mono text-[#786F6A]">{fragB.dominant_family}</div>
            </div>
          </div>
        </div>

        {/* Harmonized Match Results Breakdown */}
        <div className="space-y-3 bg-white rounded-2xl border border-[#F0E6DD] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F2A65A]" />
              <span className="font-serif text-lg font-bold text-[#292323]">
                Compatibility Harmonic Score
              </span>
            </div>
            <span className="text-sm font-mono font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#7B3F98] to-[#E86A92] text-white shadow-xs">
              {overallPercent}% BEAUTIFUL MATCH
            </span>
          </div>

          <p className="text-xs text-[#786F6A] leading-relaxed">
            {result.explanation_text}
          </p>

          <div className="p-3 rounded-xl bg-[#FFF9F3] border border-[#F0E6DD] text-xs space-y-1">
            <div className="font-bold text-[#7B3F98] text-[11px] uppercase tracking-wider">
              Application Ritual
            </div>
            <div className="text-[#292323] font-medium">
              {result.spray_ratio}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(result)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-stone-100 text-stone-700'
                  : 'bg-[#7B3F98] hover:bg-[#6A3385] text-white shadow-sm'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-[#E86A92]' : ''}`} />
              <span>{isSaved ? 'Saved to Cabinet' : 'Save this Pair'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Close View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
