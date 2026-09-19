import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  CloudSun,
  Shirt,
  Layers,
  Compass,
  CheckCircle2,
  RefreshCw,
  Edit3,
  Flame,
  ArrowRight,
  ShieldCheck
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
import { QuickStartBar, QuickStartPreset } from '../wear/QuickStartBar.js';
import { ContextBuilder } from '../wear/ContextBuilder.js';
import { ContextSummaryBadge } from '../wear/ContextSummaryBadge.js';
import { TopRecommendationCard } from '../wear/TopRecommendationCard.js';
import { AlternativeRecommendationsList } from '../wear/AlternativeRecommendationsList.js';
import { MinimalContextBanner } from '../wear/MinimalContextBanner.js';
import { EmptyOrErrorState } from '../wear/EmptyOrErrorState.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface WhatShouldIWearViewProps {
  fragrances: Fragrance[];
  wardrobeFragrances: Fragrance[];
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onWearToday?: (frag: Fragrance, partner?: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
}

export const WhatShouldIWearView: React.FC<WhatShouldIWearViewProps> = ({
  fragrances = [],
  wardrobeFragrances = [],
  weather,
  onOpenWeatherModal,
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onWearToday,
  onAddToWardrobe
}) => {
  // State
  const [rawContext, setRawContext] = useState<RawOlfactoryContextInput>({
    weather: {
      temperature_c: weather.temperature_c,
      humidity_pct: weather.humidity_pct,
      condition: weather.condition
    },
    temporal: {
      timeOfDay: weather.time_of_day || 'Evening',
      season: weather.season
    },
    occasion: 'Office',
    mood: 'Refined & Elevated',
    outfit: {
      formality: 'smart_casual'
    }
  });

  const [normalizedContext, setNormalizedContext] = useState<NormalizedOlfactoryContext | null>(null);
  const [recommendationResponse, setRecommendationResponse] = useState<WearRecommendationResponse | null>(null);
  const [isWardrobeOnly, setIsWardrobeOnly] = useState<boolean>(false);
  const [isEditingContext, setIsEditingContext] = useState<boolean>(false);
  const [isMinimalContext, setIsMinimalContext] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recordedWearId, setRecordedWearId] = useState<number | null>(null);

  // Core Recommendation Cycle:
  // 1 context normalization request, 1 recommendation request per cycle.
  const executeRecommendationCycle = useCallback(
    async (contextInput: RawOlfactoryContextInput, wardrobeOnlyFlag: boolean, minimal: boolean = false) => {
      setIsLoading(true);
      setError(null);
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

        setRecommendationResponse(recRes);
        setIsMinimalContext(minimal);
        setIsEditingContext(false);

        // STEP 6D: Record RECOMMENDATION_SHOWN telemetry (non-blocking)
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
        console.error('Wear recommendation cycle failed:', err);
        setError(err.message || 'Failed to calculate recommendations. Please check server status.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load: Run default initial recommendation
  useEffect(() => {
    if (!recommendationResponse && !isLoading && !error) {
      executeRecommendationCycle(rawContext, isWardrobeOnly, false);
    }
  }, [executeRecommendationCycle, rawContext, isWardrobeOnly, recommendationResponse, isLoading, error]);

  // Handler: Select Quick-Start Preset
  const handleSelectQuickStart = (preset: QuickStartPreset) => {
    const merged: RawOlfactoryContextInput = {
      weather: {
        temperature_c: preset.context.weather?.temperature_c ?? weather.temperature_c,
        humidity_pct: preset.context.weather?.humidity_pct ?? weather.humidity_pct,
        condition: preset.context.weather?.condition ?? weather.condition
      },
      temporal: {
        timeOfDay: preset.context.temporal?.timeOfDay ?? weather.time_of_day ?? 'Evening',
        season: preset.context.temporal?.season ?? weather.season
      },
      occasion: preset.context.occasion,
      mood: preset.context.mood,
      outfit: preset.context.outfit,
      environment: preset.context.environment,
      constraints: preset.context.constraints
    };

    setRawContext(merged);
    executeRecommendationCycle(merged, isWardrobeOnly, false);
  };

  // Handler: Minimal-Context Mode ("I just want to smell amazing today")
  const handleMinimalContext = () => {
    const minimalInput: RawOlfactoryContextInput = {
      weather: {
        temperature_c: weather.temperature_c,
        humidity_pct: weather.humidity_pct,
        condition: weather.condition
      },
      temporal: {
        season: weather.season
      }
    };

    setRawContext(minimalInput);
    executeRecommendationCycle(minimalInput, isWardrobeOnly, true);
  };

  // Handler: Submit custom context builder
  const handleContextSubmit = (newContext: RawOlfactoryContextInput) => {
    setRawContext(newContext);
    executeRecommendationCycle(newContext, isWardrobeOnly, false);
  };

  // Handler: Recalculate with existing context
  const handleRecalculate = () => {
    executeRecommendationCycle(rawContext, isWardrobeOnly, isMinimalContext);
  };

  // Handler: Toggle Wardrobe Only Mode
  const handleWardrobeOnlyToggle = (newVal: boolean) => {
    setIsWardrobeOnly(newVal);
    executeRecommendationCycle(rawContext, newVal, isMinimalContext);
  };

  // Handler: Record Wear Today (Set as SOTD)
  const handleWearToday = (frag: Fragrance) => {
    olfactoryIntelligence.recordEvent({
      type: 'WEAR',
      fragranceId: frag.id,
      fragranceName: frag.name,
      context: {
        weather,
        occasion: typeof rawContext.occasion === 'string' ? rawContext.occasion : rawContext.occasion?.type
      }
    });

    // STEP 6D Behavioral Telemetry
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
      onWearToday(frag);
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

  const topRec = recommendationResponse?.recommendations?.[0];
  const altRecs = recommendationResponse?.recommendations?.slice(1) || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Atelier Page Header */}
      <section className="relative rounded-3xl liquid-glass p-6 sm:p-10 border border-white/80 overflow-hidden shadow-[0_8px_32px_rgba(95,70,40,0.06)]">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-br from-amber-400/20 via-rose-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono-lab">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>THE DIGITAL FRAGRANCE ATELIER</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1A1613] tracking-tight">
              What Should I Wear?
            </h1>

            <p className="text-sm sm:text-base text-[#5A5046] leading-relaxed">
              Real-time olfactory harmonization powered by environmental volatility dynamics, multi-factor occasion chemistry, and your personal scent preferences.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenWeatherModal}
              className="p-3.5 rounded-2xl liquid-glass-pill hover:bg-white/90 border border-white/80 transition cursor-pointer text-left md:text-right group"
              title="Click to change atmospheric weather"
            >
              <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#7A6F66] block">
                Atmosphere Sensor
              </span>
              <span className="text-sm font-semibold text-[#1A1613] flex items-center md:justify-end gap-1.5 mt-0.5">
                <CloudSun className="w-4 h-4 text-amber-700" />
                <span>{weather.temperature_c}°C · {weather.humidity_pct}% Humidity</span>
              </span>
            </button>

            {wardrobeFragrances.length > 0 && (
              <span className="text-xs font-mono-lab text-amber-800 bg-amber-50/90 border border-amber-200/80 px-3 py-1 rounded-xl">
                {wardrobeFragrances.length} fragrances in wardrobe
              </span>
            )}
          </div>
        </div>
      </section>

      {/* SOTD Success Notification if recorded */}
      {recordedWearId && topRec && recordedWearId === topRec.fragrance.id && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="text-xs font-semibold">
              {topRec.fragrance.name} logged as today's Scent of the Day (+35 XP). Your olfactory wear memory has been updated.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRecordedWearId(null)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Start Bar */}
      <QuickStartBar
        onSelectPreset={handleSelectQuickStart}
        onMinimalContext={handleMinimalContext}
        isLoading={isLoading}
      />

      {/* Main Interactive Area */}
      {isEditingContext ? (
        /* Expanded Context Builder */
        <ContextBuilder
          initialContext={rawContext}
          liveWeather={weather}
          isWardrobeOnly={isWardrobeOnly}
          onWardrobeOnlyChange={handleWardrobeOnlyToggle}
          onSubmit={handleContextSubmit}
          onCancel={() => setIsEditingContext(false)}
          isLoading={isLoading}
        />
      ) : (
        /* Collapsed Summary Badge */
        <ContextSummaryBadge
          normalized={normalizedContext}
          rawInput={rawContext}
          isWardrobeOnly={isWardrobeOnly}
          onEditContext={() => setIsEditingContext(true)}
          onRecalculate={handleRecalculate}
          isLoading={isLoading}
        />
      )}

      {/* Minimal-Context Mode Banner (if user asked for minimal context) */}
      {isMinimalContext && !isEditingContext && (
        <MinimalContextBanner onAddContext={() => setIsEditingContext(true)} />
      )}

      {/* Loading Atmospheric State */}
      {isLoading && (
        <div className="py-16 text-center space-y-4">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-amber-300 border-t-amber-700 animate-spin" />
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-700 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#1A1613]">
              Reading Today's Atmosphere &amp; Scent DNA...
            </h3>
            <p className="text-xs text-[#7A6F66] mt-1">
              Evaluating evaporation rates, seasonal resonance, and occasion harmony across the olfactory spectrum.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <EmptyOrErrorState
          type="error"
          errorMessage={error}
          onRetry={handleRecalculate}
        />
      )}

      {/* Empty Wardrobe Match State */}
      {!isLoading && !error && isWardrobeOnly && recommendationResponse?.recommendations?.length === 0 && (
        <EmptyOrErrorState
          type="empty_wardrobe"
          onSwitchToCatalog={() => handleWardrobeOnlyToggle(false)}
          onEditContext={() => setIsEditingContext(true)}
        />
      )}

      {/* No Recommendations State (e.g. over-constrained catalog) */}
      {!isLoading && !error && !isWardrobeOnly && recommendationResponse?.recommendations?.length === 0 && (
        <EmptyOrErrorState
          type="no_results"
          onEditContext={() => setIsEditingContext(true)}
        />
      )}

      {/* Recommendation Results */}
      {!isLoading && !error && topRec && (
        <div className="space-y-8">
          {/* Top Recommendation ("Today's Signature") */}
          <TopRecommendationCard
            recommendation={topRec}
            onWearToday={handleWearToday}
            onInspectInChamber={handleInspectInChamber}
            onSendToLab={(f) => onSendToLaboratory(f)}
            onAddToWardrobe={handleAddToWardrobe}
          />

          {/* Alternative Recommendations */}
          {altRecs.length > 0 && (
            <AlternativeRecommendationsList
              recommendations={altRecs}
              onWearToday={handleWearToday}
              onInspectInChamber={handleInspectInChamber}
              onSendToLab={(f) => onSendToLaboratory(f)}
              onAddToWardrobe={handleAddToWardrobe}
            />
          )}

          {/* Metadata Footer */}
          {recommendationResponse?.metadata && (
            <div className="pt-4 border-t border-[#E8DFD3] flex flex-wrap items-center justify-between text-[11px] font-mono-lab text-[#7A6F66] gap-2">
              <div className="flex items-center gap-2">
                <span>Evaluated {recommendationResponse.metadata.totalCandidatesConsidered} candidates</span>
                <span>&bull;</span>
                <span>Mode: {recommendationResponse.metadata.sourceMode.replace('_', ' ')}</span>
                <span>&bull;</span>
                <span>Latency: {recommendationResponse.metadata.executionTimeMs}ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Deterministic Scent Alignment</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
