import React, { useState } from 'react';
import { TINDER_VIBE_CARDS, TinderVibeCard } from '../theme.js';
import { Heart, Ban, Sparkles, RotateCcw, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { UserPreferences } from '../types.js';

interface TinderVibeDeckProps {
  onCompleteVibeCheck: (discoveredPreferences: Partial<UserPreferences>) => void;
}

export const TinderVibeDeck: React.FC<TinderVibeDeckProps> = ({
  onCompleteVibeCheck
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedCards, setLikedCards] = useState<TinderVibeCard[]>([]);
  const [passedCards, setPassedCards] = useState<TinderVibeCard[]>([]);
  const [swipeFeedback, setSwipeFeedback] = useState<'liked' | 'passed' | null>(null);

  const isFinished = currentIndex >= TINDER_VIBE_CARDS.length;
  const currentCard = TINDER_VIBE_CARDS[currentIndex];

  const handleVote = (liked: boolean) => {
    if (!currentCard) return;

    setSwipeFeedback(liked ? 'liked' : 'passed');

    setTimeout(() => {
      if (liked) {
        setLikedCards(prev => [...prev, currentCard]);
      } else {
        setPassedCards(prev => [...prev, currentCard]);
      }
      setSwipeFeedback(null);
      setCurrentIndex(prev => prev + 1);
    }, 280);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedCards([]);
    setPassedCards([]);
    setSwipeFeedback(null);
  };

  const handleApplyVibes = () => {
    // Synthesize preferences from liked cards
    const favoriteFamilies = Array.from(new Set(likedCards.map(c => c.targetPreferences.family)));
    const preferredNotes = likedCards.map(c => c.targetPreferences.note);

    const avgSweetness = likedCards.length > 0
      ? Math.round(likedCards.reduce((acc, c) => acc + c.targetPreferences.sweetness, 0) / likedCards.length)
      : 5;
    const avgFreshness = likedCards.length > 0
      ? Math.round(likedCards.reduce((acc, c) => acc + c.targetPreferences.freshness, 0) / likedCards.length)
      : 6;
    const avgIntensity = likedCards.length > 0
      ? Math.round(likedCards.reduce((acc, c) => acc + c.targetPreferences.intensity, 0) / likedCards.length)
      : 7;

    onCompleteVibeCheck({
      favorite_family: favoriteFamilies.length > 0 ? favoriteFamilies : ['Woody Aromatic', 'Amber Vanilla'],
      preferred_notes: preferredNotes.length > 0 ? preferredNotes : ['Bergamot', 'Sandalwood'],
      sweetness: avgSweetness,
      freshness: avgFreshness,
      intensity: avgIntensity
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-2xl text-[#FAF5F0]">
      {/* Background ambient radiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-8 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Chapter II • Taste Discovery Ritual</span>
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#FAF5F0] tracking-tight">
          Sensory Accord Calibration
        </h3>
        <p className="text-xs sm:text-sm text-[#A8988B] leading-relaxed">
          Respond instinctually. In 5 tactile impressions, we calibrate your personal scent profile against iconic fragrance structures.
        </p>
      </div>

      {!isFinished ? (
        <div className="max-w-sm mx-auto space-y-6 relative z-10">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {TINDER_VIBE_CARDS.map((card, idx) => (
              <div
                key={card.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-[#D97706]'
                    : idx < currentIndex
                    ? 'w-3 bg-[#34D399]'
                    : 'w-2 bg-[#2A1E16]'
                }`}
              />
            ))}
          </div>

          {/* Swipe Card */}
          <div className="relative h-80 w-full">
            <div
              className={`absolute inset-0 rounded-3xl p-7 flex flex-col items-center justify-between text-center border transition-all duration-300 shadow-2xl bg-gradient-to-b from-[#241912] via-[#1B120D] to-[#120D0A] ${
                swipeFeedback === 'liked'
                  ? 'translate-x-12 rotate-6 opacity-40 border-[#34D399]'
                  : swipeFeedback === 'passed'
                  ? '-translate-x-12 -rotate-6 opacity-40 border-[#F87171]'
                  : 'translate-x-0 rotate-0 border-[#523A25] hover:scale-[1.01]'
              }`}
            >
              {/* Radial glow tailored to the card */}
              <div
                className="absolute inset-0 opacity-15 rounded-3xl pointer-events-none transition-opacity duration-500"
                style={{ backgroundColor: currentCard.accentColor }}
              />

              {/* Feedback Stamps */}
              {swipeFeedback === 'liked' && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#183424] border border-[#276B45] text-[#86EFAC] font-mono-lab font-semibold text-xs shadow-md tracking-wider uppercase">
                  Love It ❤️
                </div>
              )}
              {swipeFeedback === 'passed' && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#381818] border border-[#6B2727] text-[#FCA5A5] font-mono-lab font-semibold text-xs shadow-md tracking-wider uppercase">
                  Not for me 👎
                </div>
              )}

              <span className="text-6xl mt-2 select-none filter drop-shadow-md transform hover:scale-110 transition-transform">
                {currentCard.emoji}
              </span>

              <div className="space-y-1.5 relative z-10">
                <span className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706] block">
                  {currentCard.family}
                </span>
                <h4 className="font-serif text-2xl font-medium text-[#FAF5F0] leading-tight">
                  {currentCard.name}
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {currentCard.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-mono-lab bg-black/40 text-[#D6C7B2] border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-[#8C7D70] font-mono-lab">
                Impression 0{currentIndex + 1} of 0{TINDER_VIBE_CARDS.length}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              id="vibe-pass-btn"
              type="button"
              onClick={() => handleVote(false)}
              className="w-14 h-14 rounded-full bg-[#1F1612] hover:bg-[#2A1D17] border border-[#443328] shadow-md flex items-center justify-center text-[#8C7D70] hover:text-[#F87171] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Not for me"
            >
              <Ban className="w-5 h-5" />
            </button>

            <button
              id="vibe-like-btn"
              type="button"
              onClick={() => handleVote(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B45309] to-[#F59E0B] text-white shadow-[0_4px_20px_rgba(217,119,6,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Love this"
            >
              <Heart className="w-7 h-7 fill-current text-white" />
            </button>
          </div>

          <p className="text-[11px] text-center text-[#8C7D70] font-mono-lab">
            Tap <span className="text-[#F59E0B] font-semibold">Heart</span> to welcome or <span className="text-[#8C7D70] font-semibold">Circle</span> to pass
          </p>
        </div>
      ) : (
        /* Finished State */
        <div className="max-w-md mx-auto bg-[#1C1612] rounded-3xl border border-[#523A25] p-6 sm:p-8 text-center space-y-6 shadow-2xl relative z-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2A1F17] border border-[#523A25] text-[#F59E0B] flex items-center justify-center text-3xl shadow-md">
            🎯
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-2xl font-medium text-[#FAF5F0]">
              Taste Profile Calibrated
            </h4>
            <p className="text-xs sm:text-sm text-[#A8988B] leading-relaxed">
              You resonated with {likedCards.length} of {TINDER_VIBE_CARDS.length} iconic olfactory accords.
              Ready to synchronize your living scent signature.
            </p>
          </div>

          {likedCards.length > 0 ? (
            <div className="p-4 rounded-2xl bg-[#14100D] border border-[#3E3228] space-y-2 text-left">
              <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#D97706] block">
                Your Affinity Accords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {likedCards.map(c => (
                  <span
                    key={c.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono-lab bg-[#241B16] border border-[#443325] text-[#FEF3C7] inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{c.emoji}</span>
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8C7D70] italic">
              You passed on all sample chords. A restrained, minimal baseline will be applied.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="vibe-apply-results-btn"
              type="button"
              onClick={handleApplyVibes}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#B45309] to-[#D97706] hover:opacity-95 text-white font-semibold text-xs font-mono-lab uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FEF3C7]" />
              <span>Apply Scent DNA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#D6C7B2] font-mono-lab text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1.5 cursor-pointer border border-[#3E3228] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
