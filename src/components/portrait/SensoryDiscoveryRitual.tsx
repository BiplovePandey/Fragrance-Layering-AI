import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Ban,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Compass,
  Volume2
} from 'lucide-react';
import { TINDER_VIBE_CARDS, TinderVibeCard } from '../../theme.js';
import { UserPreferences } from '../../types.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';

interface SensoryDiscoveryRitualProps {
  onCompleteRitual: (discoveredPreferences: Partial<UserPreferences>) => void;
  onClose?: () => void;
}

export const SensoryDiscoveryRitual: React.FC<SensoryDiscoveryRitualProps> = ({
  onCompleteRitual,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedCards, setLikedCards] = useState<TinderVibeCard[]>([]);
  const [passedCards, setPassedCards] = useState<TinderVibeCard[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const isFinished = currentIndex >= TINDER_VIBE_CARDS.length;
  const currentCard = TINDER_VIBE_CARDS[currentIndex];

  const handleVote = (liked: boolean) => {
    if (!currentCard) return;

    setDirection(liked ? 'right' : 'left');

    setTimeout(() => {
      if (liked) {
        setLikedCards(prev => [...prev, currentCard]);
      } else {
        setPassedCards(prev => [...prev, currentCard]);
      }
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 250);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLikedCards([]);
    setPassedCards([]);
    setDirection(null);
  };

  const handleSynthesize = () => {
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

    onCompleteRitual({
      favorite_family: favoriteFamilies.length > 0 ? favoriteFamilies : ['Woody Aromatic', 'Chypre Earthy'],
      preferred_notes: preferredNotes.length > 0 ? preferredNotes : ['Sandalwood', 'Vetiver', 'Mitti'],
      sweetness: avgSweetness,
      freshness: avgFreshness,
      intensity: avgIntensity
    });
  };

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-2xl text-[#FAF5F0] space-y-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter II • Discovery Ritual</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Sensory Taste Ritual
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            Respond instinctually. In five atmospheric impressions, we calibrate your personal scent portrait.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2">
          {TINDER_VIBE_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-[#D97706]'
                  : idx < currentIndex
                  ? 'w-3 bg-[#34D399]'
                  : 'w-2 bg-[#3E3228]'
              }`}
            />
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="max-w-md mx-auto space-y-6">
          {/* Card Container */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#523A25] shadow-2xl flex flex-col justify-between p-8 text-[#FAF5F0] bg-gradient-to-b from-[#2A1D15] via-[#1C140E] to-[#120E0A]">
            {/* Luminous aura behind card emoji */}
            <div
              className="absolute inset-0 opacity-20 transition-all duration-700"
              style={{ backgroundColor: currentCard.accentColor }}
            />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono-lab uppercase tracking-wider text-[#FEF3C7]">
                {currentCard.family}
              </span>
              <span className="text-xs font-mono-lab text-[#8C7D70]">
                0{currentIndex + 1} / 0{TINDER_VIBE_CARDS.length}
              </span>
            </div>

            {/* Central Aromatic Icon & Name */}
            <div className="relative z-10 text-center space-y-3 my-auto">
              <div className="text-6xl sm:text-7xl filter drop-shadow-md select-none transform transition-transform hover:scale-110 duration-300">
                {currentCard.emoji}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF5F0]">
                {currentCard.name}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {currentCard.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono-lab text-[#D6C7B2]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Cue */}
            <div className="relative z-10 text-center text-xs font-serif italic text-[#FDE68A]">
              "Does this atmosphere call to your senses?"
            </div>
          </div>

          {/* Action Buttons: Pass or Welcome */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button
              onClick={() => handleVote(false)}
              className="w-14 h-14 rounded-full bg-[#1F1612] hover:bg-[#2A1D17] border border-[#443328] text-[#8C7D70] hover:text-[#F87171] transition-all flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer"
              title="Pass / Not for me"
            >
              <Ban className="w-6 h-6" />
            </button>

            <button
              onClick={() => handleVote(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B45309] to-[#F59E0B] text-white transition-all flex items-center justify-center shadow-[0_4px_20px_rgba(217,119,6,0.5)] hover:scale-110 cursor-pointer"
              title="Welcome / Gravitate toward this"
            >
              <Heart className="w-7 h-7 fill-current" />
            </button>
          </div>
        </div>
      ) : (
        /* Completion State */
        <div className="max-w-md mx-auto text-center space-y-6 py-6">
          <div className="w-16 h-16 rounded-2xl bg-[#2A1F17] border border-[#523A25] text-[#F59E0B] flex items-center justify-center mx-auto text-3xl shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] font-medium">
              Ritual Calibrated
            </h3>
            <p className="text-xs sm:text-sm text-[#A8988B] max-w-sm mx-auto">
              You embraced {likedCards.length} of {TINDER_VIBE_CARDS.length} olfactory impressions.
              We are ready to harmonize your living 8D scent signature.
            </p>
          </div>

          {/* Liked Cards Summary */}
          {likedCards.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {likedCards.map(c => (
                <span
                  key={c.id}
                  className="px-3 py-1 rounded-xl bg-[#1C1612] border border-[#3E3228] text-xs font-mono-lab text-[#FEF3C7] flex items-center gap-1.5"
                >
                  <span>{c.emoji}</span>
                  <span>{c.name}</span>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-[#1F1813] hover:bg-[#2E2219] text-[#A8988B] text-xs font-mono-lab uppercase tracking-wider border border-[#3E3228] transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            <button
              onClick={handleSynthesize}
              className="px-6 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#D97706] text-white text-xs font-mono-lab uppercase tracking-wider font-semibold transition-all shadow-[0_4px_16px_rgba(180,83,9,0.4)] flex items-center gap-2"
            >
              <span>Harmonize My Portrait</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
