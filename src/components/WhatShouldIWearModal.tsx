import React, { useState } from 'react';
import {
  Sparkles,
  CloudSun,
  Droplets,
  Calendar,
  Compass,
  ArrowRight,
  FlaskConical,
  CheckCircle2,
  Bookmark,
  Shuffle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Thermometer,
  Clock,
  Heart,
  Wind
} from 'lucide-react';
import {
  Fragrance,
  WeatherCondition,
  WhatShouldIWearRecommendation,
  DailyMoodId
} from '../types.js';
import { olfactoryIntelligence } from '../services/olfactoryIntelligence.js';
import { MotionModal, MotionButton, MotionCard } from '../motion/index.js';
import { awardXP } from '../services/gamificationEngine.js';

interface WhatShouldIWearModalProps {
  isOpen: boolean;
  onClose: () => void;
  allFragrances: Fragrance[];
  ownedFragrances: Fragrance[];
  weather: WeatherCondition;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onWearToday: (frag: Fragrance, partner?: Fragrance) => void;
}

export const WhatShouldIWearModal: React.FC<WhatShouldIWearModalProps> = ({
  isOpen,
  onClose,
  allFragrances,
  ownedFragrances,
  weather,
  onSendToLab,
  onSelectFragranceForChamber,
  onWearToday
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('Refined & Elevated');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Office / Daytime Focus');
  const [expandDetails, setExpandDetails] = useState<boolean>(true);
  const [hasRecordedWear, setHasRecordedWear] = useState<boolean>(false);
  const [variationSeed, setVariationSeed] = useState<number>(0);

  const moodOptions = [
    { label: 'Refined & Elevated', emoji: '✨' },
    { label: 'Bold & Magnetic', emoji: '🔥' },
    { label: 'Serene & Calming', emoji: '🌿' },
    { label: 'Fresh & Energized', emoji: '⚡' },
    { label: 'Mysterious & Sensual', emoji: '🌙' },
    { label: 'Festive & Regal', emoji: '👑' }
  ];

  const occasionOptions = [
    'Office / Daytime Focus',
    'Evening Dinner & Date',
    'Casual Weekend Stroll',
    'Formal Gala / Festive',
    'Meditation & Solitude',
    'High-Heat Outdoor Transit'
  ];

  // Calculate recommendation using central Olfactory Intelligence Engine
  const recommendation: WhatShouldIWearRecommendation = React.useMemo(() => {
    // If user clicked "Surprise Me / Alternate Vibe", temporarily perturb or rotate
    const pool = variationSeed > 0
      ? [...allFragrances].sort(() => 0.5 - Math.random())
      : allFragrances;

    return olfactoryIntelligence.recommendWhatShouldIWear(
      pool,
      ownedFragrances,
      weather,
      selectedMood,
      selectedOccasion
    );
  }, [allFragrances, ownedFragrances, weather, selectedMood, selectedOccasion, variationSeed]);

  const frag = recommendation.fragrance;
  const partner = recommendation.layerPartner;

  const handleRecordWear = () => {
    olfactoryIntelligence.recordEvent({
      type: 'WEAR',
      fragranceId: frag.id,
      fragranceName: frag.name,
      layerPartnerId: partner?.id,
      layerPartnerName: partner?.name,
      context: {
        weather,
        mood: selectedMood,
        occasion: selectedOccasion,
        timeOfDay: weather.time_of_day,
        season: weather.season
      },
      value: 5,
      notes: `Worn on ${new Date().toLocaleDateString()}: ${frag.name}${partner ? ` layered with ${partner.name}` : ''}`
    }, frag);

    awardXP(40, 'wear_today');
    setHasRecordedWear(true);
    onWearToday(frag, partner);
    setTimeout(() => {
      setHasRecordedWear(false);
    }, 4000);
  };

  const handleSurpriseMe = () => {
    setVariationSeed(prev => prev + 1);
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="relative w-full rounded-3xl bg-[#14110E] border border-amber-600/30 text-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-950/40 via-[#191512] to-rose-950/30 border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-stone-100 shadow-lg shadow-amber-950/50">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider mb-1">
                Central Olfactory Intelligence &bull; Personal AI Decision
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                What Should I Wear?
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Real-time Context Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
              <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">Atmosphere</span>
                <p className="text-xs font-medium text-stone-200">{weather.temperature_c}°C &bull; {weather.humidity_pct}% Hum</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
              <CloudSun className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">Season &amp; Time</span>
                <p className="text-xs font-medium text-stone-200">{weather.season} &bull; {weather.time_of_day}</p>
              </div>
            </div>

            {/* Mood selector */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" /> Vibe / Mood
              </span>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl text-xs text-stone-200 px-2 py-1 outline-none cursor-pointer focus:border-amber-500"
              >
                {moodOptions.map(m => (
                  <option key={m.label} value={m.label} className="bg-[#181512] text-stone-200">
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion selector */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Occasion
              </span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl text-xs text-stone-200 px-2 py-1 outline-none cursor-pointer focus:border-amber-500"
              >
                {occasionOptions.map(o => (
                  <option key={o} value={o} className="bg-[#181512] text-stone-200">
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Recommendation Card */}
          {frag && (
            <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1814] via-[#15120F] to-[#120F0D] border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                      Today's Primary Signature Scent
                    </span>
                    {recommendation.isFromWardrobe ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                        From Your Wardrobe Shelf
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                        Atelier Discovery Pick
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-medium text-stone-100">
                    {frag.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-400 font-sans">
                    by <span className="text-stone-200 font-semibold">{frag.brand_name || frag.brand}</span> &bull; {frag.format || 'Fine Fragrance'} &bull; {frag.fragrance_family}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-amber-300">
                      {recommendation.compatibilityScore}%
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Personal Match</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xl font-serif">
                    🎯
                  </div>
                </div>
              </div>

              {/* Accords & Notes Badge Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Olfactory Architecture</span>
                <div className="flex flex-wrap gap-2">
                  {(frag.top_notes || []).slice(0, 3).map(n => (
                    <span key={n} className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-medium">
                      Top: {n}
                    </span>
                  ))}
                  {(frag.middle_notes || []).slice(0, 2).map(n => (
                    <span key={n} className="px-2.5 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs font-medium">
                      Heart: {n}
                    </span>
                  ))}
                  {(frag.base_notes || []).slice(0, 3).map(n => (
                    <span key={n} className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-xs font-medium">
                      Base: {n}
                    </span>
                  ))}
                </div>
              </div>

              {/* Explainable AI Reasoning Panel */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Why This Exact Fragrance Today
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpandDetails(prev => !prev)}
                    className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer flex items-center gap-1"
                  >
                    {expandDetails ? 'Hide Details' : 'Explain Why'}
                    {expandDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                  {recommendation.reasoning.primaryVerdict}
                </p>

                {expandDetails && (
                  <div className="pt-3 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                      <span className="font-mono text-[10px] uppercase text-cyan-300 font-semibold flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-cyan-300" /> Weather &amp; Temperature Dynamics
                      </span>
                      <p className="text-stone-300 leading-relaxed text-[11px]">
                        {recommendation.reasoning.weatherReasoning}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                      <span className="font-mono text-[10px] uppercase text-purple-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-300" /> Personal Scent DNA Fit
                      </span>
                      <p className="text-stone-300 leading-relaxed text-[11px]">
                        {recommendation.reasoning.personalDnaReasoning}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                      <span className="font-mono text-[10px] uppercase text-rose-300 font-semibold flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-300" /> Mood &amp; Occasion Alignment
                      </span>
                      <p className="text-stone-300 leading-relaxed text-[11px]">
                        {recommendation.reasoning.moodReasoning}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                      <span className="font-mono text-[10px] uppercase text-emerald-300 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-300" /> Wardrobe Rotation AI
                      </span>
                      <p className="text-stone-300 leading-relaxed text-[11px]">
                        {recommendation.reasoning.rotationReasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Layering Partner Chord */}
              {partner && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 to-rose-950/20 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-rose-400" />
                      Recommended Dual Layering Companion
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">
                      Chord Balance: 94%
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif text-xl font-medium text-stone-100">
                        Layer with {partner.name}
                      </h4>
                      <p className="text-xs text-stone-400 font-sans">
                        by {partner.brand_name || partner.brand} ({partner.format || 'Fine Fragrance'})
                      </p>
                    </div>

                    <MotionButton
                      variant="tactile"
                      onClick={() => {
                        onClose();
                        onSendToLab(frag, partner);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold cursor-pointer transition flex items-center gap-2 self-start sm:self-center"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Formulate in Layer Lab &rarr;</span>
                    </MotionButton>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {frag.name} provides the radiant effervescent opening, while {partner.name} anchors the drydown with deep structural fixatives.
                  </p>
                </div>
              )}

              {/* Application Ritual & Evolution Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                    Application Ritual
                  </span>
                  <ul className="text-xs text-stone-300 space-y-1.5 font-sans">
                    <li>&bull; <strong className="text-stone-200">{recommendation.applicationRitual.spraysA} sprays</strong> of {frag.name} on {recommendation.applicationRitual.placementA}</li>
                    {partner && (
                      <li>&bull; <strong className="text-stone-200">{recommendation.applicationRitual.spraysB} spray(s)</strong> of {partner.name} on {recommendation.applicationRitual.placementB}</li>
                    )}
                    <li>&bull; <span className="text-stone-400">{recommendation.applicationRitual.waitTime}</span></li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold tracking-wider">
                    Predicted Evolution
                  </span>
                  <div className="text-[11px] text-stone-300 space-y-1 font-sans">
                    <p>{recommendation.expectedEvolution.opening}</p>
                    <p>{recommendation.expectedEvolution.heart}</p>
                    <p>{recommendation.expectedEvolution.drydown}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-3">
              <MotionButton
                variant="primary"
                onClick={handleRecordWear}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-stone-100 font-semibold text-xs shadow-xl cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{hasRecordedWear ? 'Worn! Added to Scent Diary (+40 XP)' : 'I Wore This Today'}</span>
              </MotionButton>

              <MotionButton
                variant="tactile"
                onClick={handleSurpriseMe}
                className="px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-stone-200 text-xs font-medium transition cursor-pointer flex items-center gap-2"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                <span>Surprise Me / Different Vibe</span>
              </MotionButton>
            </div>

            <div className="flex items-center gap-3">
              {frag && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectFragranceForChamber(frag);
                  }}
                  className="text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  Inspect in Chamber &rarr;
                </button>
              )}
              <MotionButton
                variant="tactile"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 text-xs font-medium cursor-pointer"
              >
                Done
              </MotionButton>
            </div>
          </div>
        </div>
      </div>
    </MotionModal>
  );
};
