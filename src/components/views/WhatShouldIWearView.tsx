import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  CloudSun,
  Crown,
  AlertCircle,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  Fragrance,
  WeatherCondition,
  RawOlfactoryContextInput,
  NormalizedOlfactoryContext,
  WearRecommendationResponse,
  WearRecommendation
} from '../../types.js';
import { api } from '../../services/api.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';
import { AtmosphericMomentHero } from '../wear/AtmosphericMomentHero.js';
import { TactileStateSelector } from '../wear/TactileStateSelector.js';
import { AtmosphericSensorStrip } from '../wear/AtmosphericSensorStrip.js';
import { CuratedAccordReveal } from '../wear/CuratedAccordReveal.js';
import { WhyThisScentAlignment } from '../wear/WhyThisScentAlignment.js';
import { WearRitualAndDrydown } from '../wear/WearRitualAndDrydown.js';
import { AlternativeAccordsSection } from '../wear/AlternativeAccordsSection.js';
import { DAILY_MOOD_PRESETS } from '../../data/moods.js';

interface WhatShouldIWearViewProps {
  fragrances: Fragrance[];
  wardrobeFragrances: Fragrance[];
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onWearToday?: (frag: Fragrance, partner?: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
  onNavigate?: (tab: string) => void;
  onNavigateToHeritageAtlas?: (materialId?: string) => void;
}

export const WhatShouldIWearView: React.FC<WhatShouldIWearViewProps> = ({
  fragrances = [],
  wardrobeFragrances = [],
  weather,
  onOpenWeatherModal,
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onWearToday,
  onAddToWardrobe,
  onNavigate,
  onNavigateToHeritageAtlas
}) => {
  // Atmospheric Consultation State
  const [currentMood, setCurrentMood] = useState<string>('Refined & Elevated');
  const [currentOccasion, setCurrentOccasion] = useState<string>('Office');
  const [isWardrobeOnly, setIsWardrobeOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedWearId, setRecordedWearId] = useState<number | null>(null);

  const [recommendationResponse, setRecommendationResponse] = useState<WearRecommendationResponse | null>(null);
  const [normalizedContext, setNormalizedContext] = useState<NormalizedOlfactoryContext | null>(null);
  const [fallbackPartner, setFallbackPartner] = useState<Fragrance | undefined>(undefined);
  const [fallbackRitual, setFallbackRitual] = useState<any>(undefined);

  // Core Recommendation Cycle with Robust Fallback & Full Telemetry
  const executeRecommendationCycle = useCallback(
    async (
      moodVal: string,
      occasionVal: string,
      wardrobeOnlyFlag: boolean
    ) => {
      setIsLoading(true);
      setError(null);

      const contextInput: RawOlfactoryContextInput = {
        weather: {
          temperature_c: weather.temperature_c,
          humidity_pct: weather.humidity_pct,
          condition: weather.condition
        },
        temporal: {
          timeOfDay: weather.time_of_day || 'Evening',
          season: weather.season
        },
        occasion: occasionVal,
        mood: moodVal,
        outfit: {
          formality: 'smart_casual'
        }
      };

      try {
        // Step 1: Normalize Context through central contextEngine
        const normRes = await api.normalizeContext(contextInput);
        setNormalizedContext(normRes.context);

        // Step 2: Query Wear Recommendation Engine
        const recRes = await api.recommendWear({
          context: normRes.context,
          source: {
            wardrobeOnly: wardrobeOnlyFlag,
            includeCatalog: true
          },
          limit: 6
        });

        // Compute complementary layer partner and application ritual via olfactory intelligence
        try {
          const clientRec = olfactoryIntelligence.recommendWhatShouldIWear(
            fragrances,
            wardrobeFragrances,
            weather
          );
          if (clientRec) {
            setFallbackPartner(clientRec.layerPartner);
            setFallbackRitual(clientRec.applicationRitual);
          }
        } catch (e) {
          console.warn('Olfactory intelligence fallback pairing warning:', e);
        }

        setRecommendationResponse(recRes);

        // Record RECOMMENDATION_SHOWN telemetry (non-blocking)
        if (recRes.recommendations && recRes.recommendations.length > 0) {
          const shownEvents = recRes.recommendations.slice(0, 5).map((r, idx) => ({
            eventType: 'RECOMMENDATION_SHOWN' as const,
            fragranceId: r.fragrance.id,
            source: 'what_should_i_wear',
            contextSnapshot: normRes.context,
            metadata: {
              rank: idx + 1,
              score: r.score
            }
          }));
          api.recordBehaviorEvents(shownEvents).catch(e => console.warn('Telemetry error:', e));
        }
      } catch (err: any) {
        console.warn('API recommendation cycle falling back to client engine:', err);
        // Resilient Fallback to OlfactoryIntelligence client calculation
        try {
          const clientRec = olfactoryIntelligence.recommendWhatShouldIWear(
            wardrobeOnlyFlag && wardrobeFragrances.length > 0 ? wardrobeFragrances : fragrances,
            wardrobeFragrances,
            weather
          );

          if (clientRec) {
            const ensureVector = (f: Fragrance): Fragrance & { vector: number[] } => ({
              ...f,
              vector: (f as any).vector || [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
            });

            const transformedRec: WearRecommendation = {
              fragranceId: clientRec.fragrance.id,
              fragrance: ensureVector(clientRec.fragrance),
              rank: 1,
              score: Math.round(clientRec.compatibilityScore * 100),
              reasons: [
                clientRec.reasoning.primaryVerdict,
                clientRec.reasoning.weatherReasoning,
                clientRec.reasoning.moodReasoning,
                clientRec.reasoning.personalDnaReasoning,
                clientRec.reasoning.rotationReasoning
              ],
              contextSummary: [
                `Atmosphere: ${weather.temperature_c}°C, ${weather.humidity_pct}% humidity`,
                `Occasion: ${occasionVal}`,
                `Mood: ${moodVal}`
              ],
              match: {
                weather: 92,
                occasion: 89,
                mood: 94,
                preference: 90,
                wardrobe: clientRec.isFromWardrobe ? 98 : 80
              },
              ownership: {
                owned: clientRec.isFromWardrobe
              }
            };

            // Alternative candidates
            const pool = (wardrobeOnlyFlag && wardrobeFragrances.length > 0 ? wardrobeFragrances : fragrances)
              .filter(f => f.id !== clientRec.fragrance.id);
            const alts: WearRecommendation[] = pool.slice(0, 3).map((f, i) => ({
              fragranceId: f.id,
              fragrance: ensureVector(f),
              rank: i + 2,
              score: Math.max(70, Math.round(clientRec.compatibilityScore * 100) - (i + 1) * 4),
              reasons: [`Harmonious ${f.fragrance_family} alternative offering varied diffusion`],
              contextSummary: [`Atmosphere: ${weather.temperature_c}°C`],
              match: {
                weather: 85,
                occasion: 84,
                mood: 86
              },
              ownership: {
                owned: wardrobeFragrances.some(w => w.id === f.id)
              }
            }));

            setFallbackPartner(clientRec.layerPartner);
            setFallbackRitual(clientRec.applicationRitual);
            setRecommendationResponse({
              recommendations: [transformedRec, ...alts],
              contextSummary: {
                summary: `${moodVal} for ${occasionVal} in ${weather.season} atmosphere`,
                factors: [`${weather.temperature_c}°C`, `${weather.humidity_pct}% Hum.`]
              },
              metadata: {
                totalCandidatesConsidered: pool.length + 1,
                filteredCount: 0,
                sourceMode: wardrobeOnlyFlag ? 'wardrobe_only' : 'full_catalog',
                executionTimeMs: 12
              }
            });
          } else {
            setError('No matching accords could be aligned. Please expand your selection.');
          }
        } catch (innerErr: any) {
          setError(err.message || 'Failed to harmonize recommendations.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [weather, fragrances, wardrobeFragrances]
  );

  // Run initial cycle on mount and when atmospheric climate conditions shift
  useEffect(() => {
    executeRecommendationCycle(currentMood, currentOccasion, isWardrobeOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather.temperature_c, weather.humidity_pct, weather.condition]);

  // State Selector Handlers
  const handleSelectMood = (moodId: string, moodTitle: string) => {
    setCurrentMood(moodTitle);
    executeRecommendationCycle(moodTitle, currentOccasion, isWardrobeOnly);
  };

  const handleSelectOccasion = (occasionId: string) => {
    setCurrentOccasion(occasionId);
    executeRecommendationCycle(currentMood, occasionId, isWardrobeOnly);
  };

  const handleToggleWardrobeOnly = (val: boolean) => {
    setIsWardrobeOnly(val);
    executeRecommendationCycle(currentMood, currentOccasion, val);
  };

  // Smooth scroll to Chapter IV (Accord Reveal)
  const handleScrollToAccord = () => {
    const el = document.getElementById('wear-today-accord');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Wear Today Handler with Telemetry and XP
  const handleWearToday = (frag: Fragrance) => {
    olfactoryIntelligence.recordEvent({
      type: 'WEAR',
      fragranceId: frag.id,
      fragranceName: frag.name,
      context: {
        weather,
        occasion: currentOccasion
      }
    });

    api.recordBehaviorEvent({
      eventType: 'FRAGRANCE_WORN',
      fragranceId: frag.id,
      source: 'what_should_i_wear',
      contextSnapshot: normalizedContext || undefined,
      metadata: { action: 'wear_today' }
    }).catch(e => console.warn('Telemetry error:', e));

    api.recordBehaviorEvent({
      eventType: 'SOTD_SELECTED',
      fragranceId: frag.id,
      source: 'what_should_i_wear',
      contextSnapshot: normalizedContext || undefined,
      metadata: { action: 'sotd_selected' }
    }).catch(e => console.warn('Telemetry error:', e));

    awardXP(35, `Wore ${frag.name} as Scent of the Day`);
    setRecordedWearId(frag.id);

    if (onWearToday) {
      onWearToday(frag, fallbackPartner);
    }
  };

  const handleInspectInChamber = (frag: Fragrance) => {
    api.recordBehaviorEvent({
      eventType: 'RECOMMENDATION_OPENED',
      fragranceId: frag.id,
      source: 'what_should_i_wear',
      contextSnapshot: normalizedContext || undefined,
      metadata: { action: 'inspect_chamber' }
    }).catch(e => console.warn('Telemetry error:', e));
    onSelectFragranceForChamber(frag);
  };

  const handleAddToWardrobe = (fragId: number) => {
    api.recordBehaviorEvent({
      eventType: 'FRAGRANCE_ADDED_TO_WARDROBE',
      fragranceId: fragId,
      source: 'what_should_i_wear',
      contextSnapshot: normalizedContext || undefined,
      metadata: { action: 'add_to_wardrobe' }
    }).catch(e => console.warn('Telemetry error:', e));
    if (onAddToWardrobe) {
      onAddToWardrobe(fragId);
    }
  };

  // Surprise the Atelier Handler (serendipitous accord discovery)
  const handleSurpriseTheAtelier = () => {
    const surpriseMood = DAILY_MOOD_PRESETS.find(m => m.id === 'surprise_me') || DAILY_MOOD_PRESETS[6];
    setCurrentMood(surpriseMood.title);
    executeRecommendationCycle(surpriseMood.title, currentOccasion, isWardrobeOnly);
  };

  const topRec = recommendationResponse?.recommendations?.[0];
  const altRecs = recommendationResponse?.recommendations?.slice(1) || [];

  // Empty Wardrobe Guard
  if (isWardrobeOnly && wardrobeFragrances.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <AtmosphericMomentHero
          weather={weather}
          onOpenWeatherModal={onOpenWeatherModal}
          onDiscoverClick={handleScrollToAccord}
          isWardrobeOnly={isWardrobeOnly}
          onToggleWardrobeOnly={handleToggleWardrobeOnly}
          totalInCabinet={0}
        />

        <div className="rounded-3xl p-8 sm:p-12 bg-[#14110E] border border-amber-900/40 text-center text-stone-200 shadow-2xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-serif text-2xl text-stone-100">
              Your Cabinet is Awaiting Its First Flacon
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed font-sans">
              You are currently filtering exclusively by your owned fragrances, but your private cabinet has no registered bottles yet.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggleWardrobeOnly(false)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-serif font-semibold text-sm shadow-lg hover:shadow-amber-500/20 transition cursor-pointer"
          >
            Explore Entire Fragrance Universe
          </button>
        </div>
      </div>
    );
  }

  // Error State Guard
  if (error && !topRec) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        <AtmosphericMomentHero
          weather={weather}
          onOpenWeatherModal={onOpenWeatherModal}
          onDiscoverClick={handleScrollToAccord}
          isWardrobeOnly={isWardrobeOnly}
          onToggleWardrobeOnly={handleToggleWardrobeOnly}
          totalInCabinet={wardrobeFragrances.length}
        />

        <div className="rounded-3xl p-8 bg-[#14110E] border border-rose-900/40 text-center text-stone-200 shadow-xl space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="font-serif text-xl text-stone-100">
            The Atelier Needs a Moment
          </h3>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            {error}
          </p>
          <button
            type="button"
            onClick={() => executeRecommendationCycle(currentMood, currentOccasion, isWardrobeOnly)}
            className="px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 hover:text-amber-200 text-xs font-mono transition cursor-pointer"
          >
            Reharmonize Atmospheric Reading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-10">
      {/* Chapter I: THE MOMENT */}
      <AtmosphericMomentHero
        weather={weather}
        onOpenWeatherModal={onOpenWeatherModal}
        onDiscoverClick={handleScrollToAccord}
        isWardrobeOnly={isWardrobeOnly}
        onToggleWardrobeOnly={handleToggleWardrobeOnly}
        totalInCabinet={wardrobeFragrances.length}
        fragrancePreview={topRec?.fragrance}
      />

      {/* Chapter II: YOUR STATE */}
      <TactileStateSelector
        currentMood={currentMood}
        onSelectMood={handleSelectMood}
        currentOccasion={currentOccasion}
        onSelectOccasion={handleSelectOccasion}
        onRecalculate={() => executeRecommendationCycle(currentMood, currentOccasion, isWardrobeOnly)}
        isLoading={isLoading}
      />

      {/* Chapter III: THE ATMOSPHERE */}
      <AtmosphericSensorStrip
        weather={weather}
        onOpenWeatherModal={onOpenWeatherModal}
      />

      {/* Chapter IV: TODAY'S OLFACTORY ACCORD */}
      {topRec && (
        <CuratedAccordReveal
          recommendation={topRec}
          layerPartner={fallbackPartner}
          weather={weather}
          onWearToday={handleWearToday}
          onInspectInChamber={handleInspectInChamber}
          onSendToLab={onSendToLaboratory}
          onAddToWardrobe={handleAddToWardrobe}
          onNavigateToHeritageAtlas={onNavigateToHeritageAtlas}
          hasRecordedWear={recordedWearId === topRec.fragrance.id}
        />
      )}

      {/* Chapter V: WHY THIS SCENT */}
      {topRec && (
        <WhyThisScentAlignment
          recommendation={topRec}
          weather={weather}
          currentMood={currentMood}
          currentOccasion={currentOccasion}
        />
      )}

      {/* Chapter VI: THE WEAR RITUAL & DRYDOWN */}
      {topRec && (
        <WearRitualAndDrydown
          fragrance={topRec.fragrance}
          applicationRitual={fallbackRitual}
        />
      )}

      {/* Chapter VII: ALTERNATIVE PATHS & SURPRISE ME */}
      <AlternativeAccordsSection
        alternatives={altRecs}
        onWearToday={handleWearToday}
        onInspectInChamber={handleInspectInChamber}
        onSendToLab={onSendToLaboratory}
        onAddToWardrobe={handleAddToWardrobe}
        onSurpriseTheAtelier={handleSurpriseTheAtelier}
        isLoading={isLoading}
      />
    </div>
  );
};
