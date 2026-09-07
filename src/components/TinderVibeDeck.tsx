import React, { useState } from 'react';
import { TINDER_VIBE_CARDS, TinderVibeCard } from '../theme.js';
import { Heart, ThumbsDown, Sparkles, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-[#FAF1E8] to-[#F7E7DC] border border-[#F0E6DD] p-6 sm:p-8 shadow-xs">
      <div className="text-center max-w-lg mx-auto space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9D6F5] text-[#5B2186] text-[11px] font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#7B3F98]" />
          <span>Scent Taste Matcher</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#292323]">
          Swipe Your Scent Vibe
        </h3>
        <p className="text-xs text-[#786F6A]">
          Quickly like or pass on iconic chords. In 5 taps, we decode your olfactory fingerprint.
        </p>
      </div>

      {!isFinished ? (
        <div className="max-w-xs mx-auto space-y-5">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {TINDER_VIBE_CARDS.map((card, idx) => (
              <div
                key={card.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-[#7B3F98]'
                    : idx < currentIndex
                    ? 'w-3 bg-[#E86A92]'
                    : 'w-2 bg-stone-300'
                }`}
              />
            ))}
          </div>

          {/* Swipe Card */}
          <div className="relative h-72 w-full">
            <div
              className={`absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-between text-center border-2 transition-all duration-300 shadow-md ${
                currentCard.gradient
              } ${
                swipeFeedback === 'liked'
                  ? 'translate-x-12 rotate-6 opacity-40 border-emerald-400'
                  : swipeFeedback === 'passed'
                  ? '-translate-x-12 -rotate-6 opacity-40 border-rose-400'
                  : 'translate-x-0 rotate-0 border-white/80 hover:scale-[1.02]'
              }`}
            >
              {/* Feedback Stamps */}
              {swipeFeedback === 'liked' && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md tracking-wider uppercase">
                  Love It ❤️
                </div>
              )}
              {swipeFeedback === 'passed' && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-500 text-white font-bold text-xs shadow-md tracking-wider uppercase">
                  Not for me 👎
                </div>
              )}

              <span className="text-5xl mt-2 select-none animate-bounce-short">
                {currentCard.emoji}
              </span>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#786F6A]">
                  {currentCard.family}
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#292323] leading-tight">
                  {currentCard.name}
                </h4>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {currentCard.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/70 text-[#292323] border border-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-[#786F6A] font-mono">
                Chord {currentIndex + 1} of {TINDER_VIBE_CARDS.length}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-5 pt-2">
            <button
              id="vibe-pass-btn"
              type="button"
              onClick={() => handleVote(false)}
              className="w-14 h-14 rounded-full bg-white hover:bg-stone-50 border border-stone-200 shadow-sm flex items-center justify-center text-stone-400 hover:text-stone-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Not for me"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>

            <button
              id="vibe-like-btn"
              type="button"
              onClick={() => handleVote(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E86A92] to-[#7B3F98] text-white shadow-lg hover:shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Love this"
            >
              <Heart className="w-7 h-7 fill-current text-white" />
            </button>
          </div>

          <p className="text-[11px] text-center text-[#786F6A]">
            Tap <span className="font-semibold text-[#7B3F98]">Heart</span> to include or <span className="font-semibold text-stone-500">Thumb</span> to skip
          </p>
        </div>
      ) : (
        /* Finished State */
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 text-center space-y-5 shadow-sm animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E0F7F2] text-[#0F766E] flex items-center justify-center text-3xl">
            🎯
          </div>

          <div className="space-y-1.5">
            <h4 className="font-serif text-2xl font-semibold text-[#292323]">
              We&rsquo;ve Got Your Vibe!
            </h4>
            <p className="text-xs text-[#786F6A]">
              You resonated with {likedCards.length} of {TINDER_VIBE_CARDS.length} iconic olfactory accords.
            </p>
          </div>

          {likedCards.length > 0 ? (
            <div className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD] space-y-2 text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#7B3F98] block">
                Your Affinity Highlights
              </span>
              <div className="flex flex-wrap gap-1.5">
                {likedCards.map(c => (
                  <span
                    key={c.id}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#E86A92]/40 text-[#292323] inline-flex items-center gap-1 shadow-2xs"
                  >
                    <span>{c.emoji}</span>
                    <span>{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">
              You passed on all sample chords. We will calibrate a neutral baseline.
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="vibe-apply-results-btn"
              type="button"
              onClick={handleApplyVibes}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#7B3F98] to-[#E86A92] hover:opacity-95 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Reveal My Scent Layer Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
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
