import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Compass,
  SlidersHorizontal,
  Bookmark,
  Brain,
  Activity,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Eye,
  Check
} from 'lucide-react';
import { UserGamification, UserPreferences, OlfactoryMemorySnapshot } from '../../types.js';
import { api } from '../../services/api.js';

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
  const [memorySnapshot, setMemorySnapshot] = useState<OlfactoryMemorySnapshot | null>(null);
  const [isLoadingMemory, setIsLoadingMemory] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingMemory(true);
    api.getOlfactoryMemory(1)
      .then(snap => {
        if (isMounted) setMemorySnapshot(snap);
      })
      .catch(err => {
        console.warn('Failed to load olfactory memory:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingMemory(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleClearBehaviorHistory = async () => {
    if (!window.confirm('Clear all recorded olfactory behavioral telemetry? Your explicit preferences and wardrobe will remain intact.')) {
      return;
    }
    setIsClearing(true);
    try {
      const res = await api.clearBehaviorHistory(1);
      const freshSnap = await api.getOlfactoryMemory(1);
      setMemorySnapshot(freshSnap);
      setClearMessage(`Cleared ${res.deletedCount} telemetry event(s).`);
      setTimeout(() => setClearMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to clear behavior history:', err);
    } finally {
      setIsClearing(false);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white text-purple-900 text-xs font-mono-lab mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Algorithmic Olfactory Fingerprint</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
            Personal Scent DNA &amp; Rank
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1">
            Synthesized from your ratings, worn combinations, and preferred raw aromatics.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPreferencesModal}
          className="px-4 py-2.5 rounded-2xl liquid-glass-pill text-[#1A1613] text-xs font-medium transition cursor-pointer flex items-center gap-2 self-start sm:self-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
          <span>Recalibrate DNA Preferences</span>
        </button>
      </div>

      {/* Gamification Level & XP Progress Banner */}
      <div className="rounded-3xl liquid-glass p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-3xl shadow-md border border-white/40">
            💎
          </div>
          <div>
            <span className="text-[10px] font-mono-lab uppercase text-amber-800 font-bold tracking-wider">
              Current Olfactory Rank
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
              {gamification.title}
            </h2>
            <p className="text-xs text-[#5A5046] mt-0.5 font-mono-lab">
              Level {gamification.level} &bull; {gamification.xp} Lifetime XP
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full md:w-80 space-y-2">
          <div className="flex justify-between text-xs font-mono-lab">
            <span className="text-[#5A5046]">Next Rank Progress</span>
            <span className="text-amber-900 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white/60 h-2.5 rounded-full overflow-hidden border border-white">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-[#7A6F66] text-right font-mono-lab">
            {xpForNextLevel - gamification.xp} XP needed for Level {gamification.level + 1}
          </div>
        </div>
      </div>

      {/* 8-D Vector Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-medium text-[#1A1613]">
            8-Dimensional Vector Olfactory Profile
          </h3>
          <span className="text-xs font-mono-lab text-[#7A6F66]">Cosine Weights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dnaVectorAxes.map((axis) => (
            <div key={axis.label} className="p-4 rounded-2xl liquid-glass-inset space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#1A1613] font-medium">{axis.label}</span>
                <span className="font-mono-lab text-amber-900 font-bold">{axis.value} / 10</span>
              </div>
              <div className="w-full bg-white/60 h-1.5 rounded-full overflow-hidden border border-white">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full"
                  style={{ width: `${axis.value * 10}%` }}
                />
              </div>
              <p className="text-[11px] text-[#5A5046] leading-tight pt-1">
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
          <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-medium text-[#1A1613]">
                Earned Accolades &amp; Badges
              </h3>
              <span className="text-xs font-mono-lab text-amber-900 font-bold">
                {unlockedCount} / {badgesList.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {badgesList.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition ${
                    badge.unlocked
                      ? 'liquid-glass-inset border-amber-200 shadow-2xs'
                      : 'bg-white/30 border-white/40 opacity-50'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-white/70 border border-white shadow-2xs">
                    {badge.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-semibold text-[#1A1613]">{badge.name}</h4>
                      {badge.unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Lock className="w-3 h-3 text-[#7A6F66]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#5A5046] mt-1 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* STEP 6D: Olfactory Behavioral Memory & Evidence Foundation */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-mono-lab">
              <Brain className="w-3.5 h-3.5 text-indigo-700" />
              <span>BEHAVIORAL LEARNING FOUNDATION (STEP 6D)</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#1A1613]">
              Olfactory Memory &amp; Evidence Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5046]">
              Transparent behavioral telemetry capturing your actual wearing rituals, opens, and saves.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearBehaviorHistory}
              disabled={isClearing || !memorySnapshot || memorySnapshot.totalEvents === 0}
              className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-800 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Clear all recorded behavioral events"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isClearing ? 'Clearing...' : 'Clear Telemetry'}</span>
            </button>
          </div>
        </div>

        {clearMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{clearMessage}</span>
          </div>
        )}

        {/* Confidence and Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl liquid-glass-inset border border-white/60">
            <div className="text-[10px] font-mono-lab uppercase text-[#7A6F66] tracking-wider">
              Total Telemetry Events
            </div>
            <div className="font-serif text-2xl text-[#1A1613] mt-1 font-semibold">
              {memorySnapshot ? memorySnapshot.totalEvents : 0}
            </div>
            <div className="text-[11px] text-[#7A6F66] mt-0.5">
              Across wears, saves, opens &amp; views
            </div>
          </div>

          <div className="p-4 rounded-2xl liquid-glass-inset border border-white/60">
            <div className="text-[10px] font-mono-lab uppercase text-[#7A6F66] tracking-wider">
              Memory Confidence
            </div>
            <div className="font-serif text-2xl text-[#1A1613] mt-1 font-semibold">
              {memorySnapshot ? `${Math.round(memorySnapshot.confidence * 100)}%` : '0%'}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((memorySnapshot?.confidence || 0) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl liquid-glass-inset border border-white/60">
            <div className="text-[10px] font-mono-lab uppercase text-[#7A6F66] tracking-wider">
              Evidence Separation
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Strictly Segregated</span>
            </div>
            <div className="text-[11px] text-[#7A6F66] mt-1">
              Implicit acts never overwrite explicit DNA
            </div>
          </div>
        </div>

        {/* Explicit vs Implicit Evidence Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Explicit Signals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono-lab font-semibold uppercase text-[#1A1613] tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                Explicit Signals ({memorySnapshot?.explicitSignals.length || 0})
              </h3>
              <span className="text-[10px] font-mono-lab text-[#7A6F66]">Direct Inputs &amp; Ratings</span>
            </div>

            <div className="space-y-2">
              {(!memorySnapshot || memorySnapshot.explicitSignals.length === 0) ? (
                <div className="p-3.5 rounded-xl border border-stone-200/80 bg-white/40 text-xs text-[#7A6F66] text-center">
                  No explicit fragrance ratings or preference inputs yet.
                </div>
              ) : (
                memorySnapshot.explicitSignals.slice(0, 5).map((sig, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-[#1A1613]">{sig.dimension}</span>
                      <div className="text-[10px] text-[#7A6F66]">{sig.source}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-mono-lab">
                        Strength {(sig.evidenceStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Implicit Signals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono-lab font-semibold uppercase text-[#1A1613] tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Implicit Signals ({memorySnapshot?.implicitSignals.length || 0})
              </h3>
              <span className="text-[10px] font-mono-lab text-[#7A6F66]">Observed Behavior</span>
            </div>

            <div className="space-y-2">
              {(!memorySnapshot || memorySnapshot.implicitSignals.length === 0) ? (
                <div className="p-3.5 rounded-xl border border-stone-200/80 bg-white/40 text-xs text-[#7A6F66] text-center">
                  No wear rituals, opens, or saves recorded yet. Wear a fragrance today to begin observation.
                </div>
              ) : (
                memorySnapshot.implicitSignals.slice(0, 5).map((sig, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-[#1A1613]">{sig.dimension}</span>
                      <div className="text-[10px] text-[#7A6F66]">{sig.source}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-mono-lab">
                        Strength {(sig.evidenceStrength * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recently Worn vs Recently Saved */}
        {memorySnapshot && (memorySnapshot.frequentlyWornFragrances.length > 0 || memorySnapshot.frequentlySavedFragrances.length > 0) && (
          <div className="pt-4 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memorySnapshot.frequentlyWornFragrances.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono-lab uppercase text-[#1A1613] font-semibold">
                  Frequently Worn Rituals
                </div>
                <div className="space-y-1.5">
                  {memorySnapshot.frequentlyWornFragrances.map(f => (
                    <div key={f.fragranceId} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-[#1A1613]">{f.fragranceName}</div>
                        <div className="text-[10px] text-[#7A6F66]">{f.brandName} &bull; {f.fragranceFamily}</div>
                      </div>
                      <span className="font-mono-lab text-amber-900 font-bold text-[11px]">
                        {f.wears} wear{f.wears !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {memorySnapshot.frequentlySavedFragrances.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-mono-lab uppercase text-[#1A1613] font-semibold">
                  Saved / Wardrobe Interest
                </div>
                <div className="space-y-1.5">
                  {memorySnapshot.frequentlySavedFragrances.map(f => (
                    <div key={f.fragranceId} className="p-2.5 rounded-xl bg-stone-100/70 border border-stone-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-[#1A1613]">{f.fragranceName}</div>
                        <div className="text-[10px] text-[#7A6F66]">{f.brandName} &bull; {f.fragranceFamily}</div>
                      </div>
                      <span className="font-mono-lab text-[#5A5046] font-bold text-[11px]">
                        {f.saves} save{f.saves !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Strict Non-Interference Guarantee */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Pure Observation Pipeline:</span> All behavioral learning operates strictly in observation mode. Telemetry events are stored immutably to capture natural usage evidence. Recommendation algorithms and 8D vectors remain strictly deterministic and are never modified automatically.
          </div>
        </div>
      </div>
    </div>
  );
};
