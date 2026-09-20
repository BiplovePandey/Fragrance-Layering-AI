import React from 'react';
import { Bot, Sparkles, X, ArrowRight, Compass } from 'lucide-react';
import { CommunityRecipe } from '../../types.js';

interface SocietyRemixModalProps {
  recipe: CommunityRecipe | null;
  suggestion: string | null;
  onClose: () => void;
  onLaunchInLab: (recipe: CommunityRecipe) => void;
}

export const SocietyRemixModal: React.FC<SocietyRemixModalProps> = ({
  recipe,
  suggestion,
  onClose,
  onLaunchInLab
}) => {
  if (!recipe) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="remix-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#14110E] border border-amber-500/25 p-6 sm:p-8 text-[#F8F5EE] shadow-2xl shadow-black/80 overflow-hidden"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(217, 119, 6, 0.15)'
        }}
      >
        {/* Smoked glass & ambient amber glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-amber-400/90 block">
                The Perfumer's Society
              </span>
              <h3 id="remix-modal-title" className="font-serif text-2xl font-medium text-[#F8F5EE]">
                Alchemical Remix Engine
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close remix dialogue"
            className="p-2 rounded-xl text-stone-400 hover:text-[#F8F5EE] hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="relative my-6 space-y-5">
          {/* Base Chord Reference */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-lab uppercase text-amber-400/80 tracking-wider block">
                Base Society Chord
              </span>
              <h4 className="font-serif text-lg font-medium text-[#F8F5EE] mt-0.5">
                {recipe.title}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                {recipe.chord_name} • {recipe.fragrance_a?.name} + {recipe.fragrance_b?.name}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono-lab text-stone-400 block">Synergy</span>
              <span className="text-sm font-mono-lab text-amber-400 font-semibold">
                {recipe.compatibility_score}%
              </span>
            </div>
          </div>

          {/* AI Guidance Box */}
          <div className="p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-brand tracking-wider uppercase text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Microclimate &amp; Olfactory Calibration</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans whitespace-pre-line">
              {suggestion}
            </p>
          </div>

          <div className="text-[11px] font-mono-lab text-stone-400/90 italic flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-amber-400/70" />
            <span>Remix calibrates spray sequence and evaporation balance for your live ambient climate.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-mono-lab text-stone-400 hover:text-stone-200 transition cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => onLaunchInLab(recipe)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-900/30 transition cursor-pointer flex items-center gap-2"
          >
            <span>Launch in Layering Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
