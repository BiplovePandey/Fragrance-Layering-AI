import React from 'react';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';

interface MinimalContextBannerProps {
  onAddContext: () => void;
}

export const MinimalContextBanner: React.FC<MinimalContextBannerProps> = ({ onAddContext }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/85 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-semibold text-amber-950 block">
            "Let's work with what we know."
          </span>
          <p className="text-xs text-[#5A5046] mt-0.5 max-w-2xl leading-relaxed">
            Recommendations are anchored on your personal Scent DNA and general atmospheric versatility. No mood, occasion, or outfit was assumed.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddContext}
        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-white/90 hover:bg-white border border-amber-300 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs self-end sm:self-center"
      >
        <span>Add Day Details</span>
        <ArrowRight className="w-3 h-3 text-amber-700" />
      </button>
    </div>
  );
};
