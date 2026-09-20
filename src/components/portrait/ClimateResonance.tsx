import React from 'react';
import {
  CloudRain,
  Snowflake,
  Sun,
  Flame,
  Moon,
  Compass,
  Thermometer,
  Droplets,
  Wind
} from 'lucide-react';
import { WeatherCondition } from '../../types.js';
import { OlfactoryVector8D } from '../../services/olfactoryIntelligence.js';

interface ClimateResonanceProps {
  weather: WeatherCondition;
  vector: OlfactoryVector8D;
}

interface ClimateZone {
  id: string;
  name: string;
  seasonName: string;
  idealAccords: string[];
  icon: React.ComponentType<{ className?: string }>;
  resonanceScore: number;
  bgGradient: string;
  accentBorder: string;
  notesSummary: string;
  scientificImpact: string;
}

export const ClimateResonance: React.FC<ClimateResonanceProps> = ({
  weather,
  vector
}) => {
  // Compute climate resonance based on vector properties
  const monsoonScore = Math.round(vector.earthy_clay * 0.7 + vector.woody * 0.3);
  const winterScore = Math.round(vector.warm_resinous_spices * 0.6 + vector.woody * 0.4);
  const summerScore = Math.round(vector.freshness * 0.7 + (100 - vector.sweetness) * 0.3);
  const dryHeatScore = Math.round(vector.earthy_clay * 0.5 + vector.freshness * 0.5);
  const eveningScore = Math.round(vector.floral * 0.4 + vector.warm_resinous_spices * 0.3 + vector.woody * 0.3);

  const zones: ClimateZone[] = [
    {
      id: 'monsoon',
      name: 'Monsoon Atmospheric Humidity',
      seasonName: 'Pre-Monsoon & Rainfall',
      idealAccords: ['Geosmin / Mitti', 'Ruh Khus', 'Petrichor', 'Damp Sandalwood'],
      icon: CloudRain,
      resonanceScore: monsoonScore,
      bgGradient: 'from-[#192429] via-[#12191D] to-[#0D1214]',
      accentBorder: 'border-[#2C4854]',
      notesSummary: 'High humidity suspends heavy earthy sesquiterpenes effortlessly in the ambient air.',
      scientificImpact: 'Water vapor particles amplify human olfactory sensitivity to baked clay geosmin.'
    },
    {
      id: 'winter',
      name: 'Crisp Winter Hearth',
      seasonName: 'Cold & Dry Winter',
      idealAccords: ['Assam Oud', 'Mysore Sandalwood', 'Kashmiri Saffron', 'Warm Resins'],
      icon: Snowflake,
      resonanceScore: winterScore,
      bgGradient: 'from-[#1C2028] via-[#13161C] to-[#0D0F13]',
      accentBorder: 'border-[#2D394C]',
      notesSummary: 'Cold air suppresses volatile citrus; deep heartwoods and thermal resins flourish.',
      scientificImpact: 'Dense molecular weight accords preserve skin longevity despite low ambient temperatures.'
    },
    {
      id: 'summer',
      name: 'Solar Summer Daylight',
      seasonName: 'High Summer & Sunlight',
      idealAccords: ['Calabrian Bergamot', 'Green Neroli', 'Crushed Mint', 'Petitgrain'],
      icon: Sun,
      resonanceScore: summerScore,
      bgGradient: 'from-[#2B2313] via-[#1C170E] to-[#110E08]',
      accentBorder: 'border-[#6B551A]',
      notesSummary: 'Extreme heat accelerates evaporation; crisp volatile top notes create invigorating sillage.',
      scientificImpact: 'Fast evaporation requires reapplying or anchoring with light, non-cloying lipid bases.'
    },
    {
      id: 'dry_heat',
      name: 'Arid Dry Heat',
      seasonName: 'Desert & Sunbaked Winds',
      idealAccords: ['Cooling Vetiver (Khus)', 'Rose Hydrosol', 'White Sandalwood'],
      icon: Flame,
      resonanceScore: dryHeatScore,
      bgGradient: 'from-[#2C1914] via-[#1D110D] to-[#120B08]',
      accentBorder: 'border-[#693926]',
      notesSummary: 'Dry air thirsts for botanical cooling; vetiver roots create a natural psychological oasis.',
      scientificImpact: 'Indian traditional use of vetiver mats (khas tattis) mirrors this exact thermal chemistry.'
    },
    {
      id: 'cool_evening',
      name: 'Temperate Evening Sillage',
      seasonName: 'Nocturnal & Autumn Twilight',
      idealAccords: ['Damask Rose', 'Green Cardamom', 'Silky Benzoin', 'Golden Amber'],
      icon: Moon,
      resonanceScore: eveningScore,
      bgGradient: 'from-[#241A26] via-[#171119] to-[#0F0B10]',
      accentBorder: 'border-[#55365C]',
      notesSummary: 'Balanced temperatures allow all three pyramid levels (top, heart, base) to unfold harmoniously.',
      scientificImpact: 'Moderate vapor pressure maintains multi-hour balance without accord collapse.'
    }
  ].sort((a, b) => b.resonanceScore - a.resonanceScore);

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl text-[#FAF5F0] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Thermometer className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter VIII • Climate Resonance</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Atmospheric &amp; Climate Resonance
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            Live environmental chemistry: how temperature, vapor density, and seasonal humidity interact with your olfactory profile.
          </p>
        </div>

        {/* Live Weather Widget */}
        <div className="p-3 rounded-2xl bg-[#1C1612] border border-[#3E3228] flex items-center gap-4 text-xs font-mono-lab">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[#FAF5F0] font-semibold">{weather.temperature_c}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[#FAF5F0]">{weather.humidity_pct}% Humidity</span>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-[#2A1E16] text-[#D97706] uppercase text-[10px]">
            {weather.season}
          </div>
        </div>
      </div>

      {/* Climate Zones Spectrum Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone, idx) => {
          const Icon = zone.icon;
          const isHighest = idx === 0;

          return (
            <div
              key={zone.id}
              className={`rounded-2xl p-6 bg-gradient-to-b ${zone.bgGradient} border ${zone.accentBorder} space-y-4 relative overflow-hidden`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#A8988B]">
                  {zone.seasonName}
                </span>
                <span className={`font-serif text-2xl font-semibold ${isHighest ? 'text-[#F59E0B]' : 'text-[#FAF5F0]'}`}>
                  {zone.resonanceScore}%
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  <Icon className={`w-5 h-5 ${isHighest ? 'text-[#F59E0B]' : 'text-[#A8988B]'}`} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#FAF5F0] leading-tight">
                    {zone.name}
                  </h3>
                  {isHighest && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#3A2616] text-[#F59E0B] text-[10px] font-mono-lab uppercase">
                      Peak Resonance Environment
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#C8BAAB] leading-relaxed">
                {zone.notesSummary}
              </p>

              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                  Thriving Botanical Accords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {zone.idealAccords.map((acc) => (
                    <span
                      key={acc}
                      className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono-lab text-[#E6DACB]"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] text-[#A8988B] leading-relaxed">
                <span className="text-[#FAF5F0] font-medium">Diffusion Physics: </span>
                {zone.scientificImpact}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
