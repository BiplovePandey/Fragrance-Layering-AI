import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Shirt, Sparkles, Thermometer, CloudRain, Clock, Droplet, CheckCircle2, ArrowRight } from 'lucide-react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { calculateWeatherAlignmentScore } from '../../services/weatherEngine.js';
import { CabinetBottle } from './CabinetBottle.js';

interface CabinetTodaysEditProps {
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  weather: WeatherCondition;
  onWearToday: (fragrance: Fragrance, partner?: Fragrance) => void;
  onInspect: (fragrance: Fragrance) => void;
  onLayer: (fragrance: Fragrance) => void;
  onToggleFavorite: (fragranceId: number) => void;
  bottleLevels: Record<number, number>;
  favoriteIds: Set<number>;
}

export const CabinetTodaysEdit: React.FC<CabinetTodaysEditProps> = ({
  ownedFragrances,
  allFragrances,
  weather,
  onWearToday,
  onInspect,
  onLayer,
  onToggleFavorite,
  bottleLevels,
  favoriteIds
}) => {
  // Generate recommendation strictly from owned wardrobe if available
  const recommendation = useMemo(() => {
    const list = ownedFragrances.length > 0 ? ownedFragrances : allFragrances.slice(0, 4);
    if (list.length === 0) return null;

    // Score all candidates by weather alignment
    const scored = list.map(f => {
      const { score, advisory } = calculateWeatherAlignmentScore(f, weather);
      return { fragrance: f, score, advisory };
    }).sort((a, b) => b.score - a.score);

    const top = scored[0];
    const partner = list.find(f => f.id !== top.fragrance.id) || null;

    const isHot = weather.temperature_c >= 28;
    const isAttar = top.fragrance.format === 'Attar' || top.fragrance.is_oil_based;

    return {
      fragrance: top.fragrance,
      compatibilityScore: top.score,
      layerPartner: partner,
      applicationRitual: {
        spraysA: isAttar ? 1 : isHot ? 3 : 4,
        placementA: isAttar ? 'Wrist pulse point & base of throat' : 'Chest, clavicles & pulse points',
        skinVsClothing: isAttar ? 'Apply directly to skin lipids' : 'Pulse points first; 1 mist on cotton lapel'
      },
      reasoning: {
        primaryVerdict: `Optimized for ${weather.season} ${weather.time_of_day || 'Day'}`,
        weatherReasoning: top.advisory,
        personalDnaReasoning: `Calibrated for ambient humidity of ${weather.humidity_pct}% and ${weather.temperature_c}°C.`
      }
    };
  }, [ownedFragrances, allFragrances, weather]);

  if (!recommendation || !recommendation.fragrance) {
    return null;
  }

  const primaryFrag = recommendation.fragrance;
  const partnerFrag = recommendation.layerPartner;
  const ritual = recommendation.applicationRitual;
  const reasoning = recommendation.reasoning;

  return (
    <section
      aria-label="Today's Cabinet Edit"
      className="relative rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#18130E] via-[#100D0A] to-[#0A0806] p-6 sm:p-8 shadow-2xl text-stone-100 overflow-hidden"
    >
      {/* Background Amber Spotlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.14),transparent_70%)] pointer-events-none" />

      {/* Header Plaque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Shirt className="w-3.5 h-3.5" />
            <span>Today&apos;s Cabinet Edit &bull; Curated Selection</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
            What Should I Wear Today?
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Calibrated against today&apos;s ambient conditions ({weather.temperature_c}°C &bull; {weather.humidity_pct}% humidity &bull; {weather.condition}).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-500/30 text-xs font-mono text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Alignment Score: {recommendation.compatibilityScore}%</span>
        </div>
      </div>

      {/* Main Feature Layout: Bottle on Left, Intelligent Reasoning on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Recommended Bottle Presentation (Md: cols 4) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-900/40 border border-stone-800/60">
          <CabinetBottle
            fragrance={primaryFrag}
            fillLevel={bottleLevels[primaryFrag.id] ?? 85}
            isFavorite={favoriteIds.has(primaryFrag.id)}
            onInspect={onInspect}
            onWear={(f) => onWearToday(f, partnerFrag || undefined)}
            onLayer={onLayer}
            onToggleFavorite={onToggleFavorite}
          />
          <span className="mt-3 text-[11px] font-mono text-amber-300 uppercase tracking-widest text-center">
            Definitive Choice
          </span>
        </div>

        {/* Intelligence, Reasoning, and Application Ritual (Md: cols 8) */}
        <div className="md:col-span-8 space-y-4">
          {/* Primary Verdict Card */}
          <div className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2">
            <h4 className="font-serif text-lg font-medium text-stone-100">
              {reasoning.primaryVerdict}
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {reasoning.weatherReasoning}
            </p>
            {reasoning.personalDnaReasoning && (
              <p className="text-xs text-stone-400 border-t border-stone-800 pt-2 font-mono">
                {reasoning.personalDnaReasoning}
              </p>
            )}
          </div>

          {/* Application Ritual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                Sprays / Drops
              </span>
              <span className="font-serif text-base font-medium text-amber-300 mt-0.5 block">
                {ritual.spraysA} {primaryFrag.format === 'Attar' ? 'Drop' : 'Sprays'}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5 truncate">
                {ritual.placementA}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                Placement Site
              </span>
              <span className="font-serif text-base font-medium text-stone-200 mt-0.5 block truncate">
                Pulse Points
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5 truncate">
                {ritual.skinVsClothing}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                Evolution
              </span>
              <span className="font-serif text-base font-medium text-stone-200 mt-0.5 block">
                {primaryFrag.longevity || '7-9 Hours'}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5 truncate">
                {primaryFrag.sillage || 'Moderate Radiance'}
              </span>
            </div>
          </div>

          {/* Action Ribbon */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onWearToday(primaryFrag, partnerFrag || undefined)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-[0_4px_16px_rgba(217,119,6,0.35)] transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-stone-950" />
              <span>Wear This Scent Today</span>
            </button>

            <button
              type="button"
              onClick={() => onInspect(primaryFrag)}
              className="px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-stone-100 border border-stone-700 text-xs sm:text-sm transition cursor-pointer"
            >
              <span>Inspect Specimen Details</span>
            </button>

            {partnerFrag && (
              <button
                type="button"
                onClick={() => onLayer(primaryFrag)}
                className="px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Pair with {partnerFrag.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
