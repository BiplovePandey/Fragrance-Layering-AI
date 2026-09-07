import React from 'react';
import { RecommendationScore } from '../types.js';
import { Award, Compass, Sparkles, Droplets, ArrowRight } from 'lucide-react';

interface SingleRecommendationViewProps {
  recommendations: RecommendationScore[];
  isLoading: boolean;
  onSelectForLayering: (fragranceId: number) => void;
}

export const SingleRecommendationView: React.FC<SingleRecommendationViewProps> = ({
  recommendations,
  isLoading,
  onSelectForLayering
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-stone-600 font-medium">
          Executing Content-Based Similarity & Multi-Criteria Ranking...
        </p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
        <Compass className="w-12 h-12 text-stone-300 mx-auto" />
        <h3 className="font-serif text-xl font-medium text-stone-800">No Single Match Results Yet</h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          Adjust your preferences or click &ldquo;Find Matches&rdquo; to evaluate each perfume individually against your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Single Scent Recommender
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
            Top Individual Scent Matches
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Ranked using 30% Preference Similarity + 25% Season Match + 20% Occasion Match + 15% Note Synergy + 10% Intensity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {recommendations.map(({ fragrance, total_score, breakdown }, idx) => (
          <div
            key={fragrance.id}
            id={`single-rec-${fragrance.id}`}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 min-h-[52px]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500">
                      {fragrance.brand}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-stone-900 mt-1 leading-tight">
                    {fragrance.name}
                  </h3>
                  <p className="text-xs text-amber-800 font-medium">{fragrance.fragrance_family}</p>
                </div>

                {/* Score badge */}
                <div className="text-right bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0">
                  <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block">
                    Score
                  </span>
                  <span className="text-2xl font-serif font-bold text-stone-900 leading-none">
                    {total_score}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed min-h-[36px]">
                {fragrance.description}
              </p>

              {/* Note Pyramid */}
              <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-200/60 text-xs space-y-1">
                <div><span className="font-semibold text-stone-700">Top:</span> {fragrance.top_notes.join(', ')}</div>
                <div><span className="font-semibold text-stone-700">Heart:</span> {fragrance.middle_notes.join(', ')}</div>
                <div><span className="font-semibold text-stone-700">Base:</span> {fragrance.base_notes.join(', ')}</div>
              </div>

              {/* Criteria score bar */}
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] pt-1 items-stretch">
                <div className="p-1.5 bg-stone-100 rounded flex flex-col justify-between min-h-[44px]">
                  <span className="text-stone-400 block text-[9px] uppercase">Pref (30%)</span>
                  <span className="font-mono font-bold text-stone-800">{breakdown.preference_similarity}%</span>
                </div>
                <div className="p-1.5 bg-stone-100 rounded flex flex-col justify-between min-h-[44px]">
                  <span className="text-stone-400 block text-[9px] uppercase">Season (25%)</span>
                  <span className="font-mono font-bold text-stone-800">{breakdown.season_match}%</span>
                </div>
                <div className="p-1.5 bg-stone-100 rounded flex flex-col justify-between min-h-[44px]">
                  <span className="text-stone-400 block text-[9px] uppercase">Occasion (20%)</span>
                  <span className="font-mono font-bold text-stone-800">{breakdown.occasion_match}%</span>
                </div>
                <div className="p-1.5 bg-stone-100 rounded flex flex-col justify-between min-h-[44px]">
                  <span className="text-stone-400 block text-[9px] uppercase">Notes (15%)</span>
                  <span className="font-mono font-bold text-stone-800">{breakdown.note_similarity}%</span>
                </div>
                <div className="p-1.5 bg-stone-100 rounded flex flex-col justify-between min-h-[44px]">
                  <span className="text-stone-400 block text-[9px] uppercase">Int. (10%)</span>
                  <span className="font-mono font-bold text-stone-800">{breakdown.intensity_match}%</span>
                </div>
              </div>
            </div>

            {/* CTA: Select this as base to layer */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="text-xs text-stone-500 truncate">
                Seasons: {fragrance.season.join(', ')}
              </span>

              <button
                type="button"
                onClick={() => onSelectForLayering(fragrance.id)}
                className="h-8 px-3.5 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <span>Layer with this</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
