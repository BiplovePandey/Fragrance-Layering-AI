import React from 'react';
import {
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Compass,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { UserGamification, UserPreferences } from '../../types.js';

interface MyDnaViewProps {
  gamification: UserGamification;
  preferences: UserPreferences | null;
  onOpenPreferencesModal: () => void;
}

export const MyDnaView: React.FC<MyDnaViewProps> = ({
  gamification,
  preferences,
  onOpenPreferencesModal
}) => {
  const xpForNextLevel = gamification.level * 200;
  const progressPercent = Math.min(100, Math.round((gamification.xp / xpForNextLevel) * 100));

  const dnaVectorAxes = [
    { label: 'Freshness', value: 8.4, desc: 'High preference for sparkling citrus and green leaves' },
    { label: 'Woody & Resins', value: 9.1, desc: 'Dominant anchor affinity: Mysore Sandalwood & Cedar' },
    { label: 'Floral Delicacy', value: 6.8, desc: 'Selective affinity: Damask Rose & Neroli' },
    { label: 'Warmth / Spice', value: 7.9, desc: 'Loves Cardamom, Saffron & Warm Amber' },
    { label: 'Earth & Clay', value: 9.5, desc: 'Petrichor / Geosmin enthusiast' },
    { label: 'Aquatic / Marine', value: 5.2, desc: 'Moderate affinity for oceanic ozone' },
    { label: 'Sweet / Gourmand', value: 4.1, desc: 'Low tolerance for sugary confections' },
    { label: 'Smoky / Leather', value: 8.6, desc: 'High appreciation for birch tar and Assam oud' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Olfactory Fingerprint</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-100">
            Personal Scent DNA &amp; Rank
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Synthesized from your ratings, worn combinations, and preferred raw aromatics.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPreferencesModal}
          className="px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-stone-200 text-xs font-medium transition cursor-pointer flex items-center gap-2 self-start sm:self-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Recalibrate DNA Preferences</span>
        </button>
      </div>

      {/* Gamification Level & XP Progress Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/30 via-[#15120F]/90 to-amber-950/30 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
            💎
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
              Current Olfactory Rank
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              {gamification.title}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Level {gamification.level} &bull; {gamification.xp} Lifetime XP
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full md:w-80 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Next Rank Progress</span>
            <span className="text-amber-300 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white/[0.08] h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-stone-500 text-right font-mono">
            {xpForNextLevel - gamification.xp} XP needed for Level {gamification.level + 1}
          </div>
        </div>
      </div>

      {/* 8-D Vector Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] backdrop-blur-md shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-medium text-stone-100">
            8-Dimensional Vector Olfactory Profile
          </h3>
          <span className="text-xs font-mono text-stone-400">Cosine Weights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dnaVectorAxes.map((axis) => (
            <div key={axis.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-200 font-medium">{axis.label}</span>
                <span className="font-mono text-amber-400 font-bold">{axis.value} / 10</span>
              </div>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full"
                  style={{ width: `${axis.value * 10}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-400 leading-tight pt-1">
                {axis.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      {(() => {
        const badgesList = [
          { id: 'first_chord', name: 'First Alchemical Chord', desc: 'Synthesized your first dual fragrance chord in the lab', icon: '🧪', unlocked: true },
          { id: 'heritage_voyager', name: 'Heritage Voyager', desc: 'Explored traditional Indian Deg-Bhapka botanical archives', icon: '🏛️', unlocked: true },
          { id: 'weather_attuned', name: 'Atmospherically Attuned', desc: 'Calibrated fragrance formulation to live weather telemetry', icon: '🌤️', unlocked: true },
          { id: 'master_alchemist', name: 'Grand Master Alchemist', desc: 'Formulated 10 high-compatibility scent chords', icon: '👑', unlocked: (gamification?.xp || 0) >= 300 },
          { id: 'curator_grand', name: 'Cabinet Collector', desc: 'Curated 6 fine fragrances in your digital wardrobe', icon: '🗄️', unlocked: false },
          { id: 'archivist_submission', name: 'Guardian of Fine Perfumery', desc: 'Validated and submitted a new perfume candidate', icon: '🛡️', unlocked: Boolean(gamification?.badges?.includes('archivist_submission') || gamification?.achievements?.some(a => a.id === 'gatekeeper' && a.unlocked)) }
        ];
        const unlockedCount = badgesList.filter(b => b.unlocked).length;

        return (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] backdrop-blur-md shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-medium text-stone-100">
                Earned Accolades &amp; Badges
              </h3>
              <span className="text-xs font-mono text-amber-400">
                {unlockedCount} / {badgesList.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {badgesList.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition ${
                    badge.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-white/[0.01] border-white/[0.04] opacity-50'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-white/[0.04]">
                    {badge.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-stone-100">{badge.name}</h4>
                      {badge.unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-stone-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
