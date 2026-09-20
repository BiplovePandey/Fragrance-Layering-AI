import React from 'react';
import { motion } from 'motion/react';
import {
  Sun,
  Flower2,
  TreeDeciduous,
  Flame,
  Mountain,
  Wind,
  Sparkles,
  Compass
} from 'lucide-react';
import { OlfactoryVector8D } from '../../services/olfactoryIntelligence.js';

interface ScentTerritoriesProps {
  vector: OlfactoryVector8D;
  onSelectTerritory?: (territoryId: string) => void;
}

interface Territory {
  id: string;
  name: string;
  title: string;
  accords: string[];
  icon: React.ComponentType<{ className?: string }>;
  score: number;
  bgGradient: string;
  accentBorder: string;
  description: string;
  status: 'Dominant Sanctum' | 'Active Exploration' | 'Uncharted Horizon';
}

export const ScentTerritories: React.FC<ScentTerritoriesProps> = ({
  vector,
  onSelectTerritory
}) => {
  // Score calculations based on vector
  const solarScore = Math.round((vector.freshness * 0.7 + (100 - vector.sweetness) * 0.3));
  const botanicalScore = Math.round((vector.floral * 0.8 + vector.freshness * 0.2));
  const woodedScore = Math.round((vector.woody * 0.75 + vector.longevity_fixative * 0.25));
  const resinousScore = Math.round((vector.warm_resinous_spices * 0.7 + vector.sweetness * 0.3));
  const earthScore = Math.round((vector.earthy_clay * 0.8 + vector.woody * 0.2));
  const marineScore = Math.round((vector.freshness * 0.6 + (100 - vector.warm_resinous_spices) * 0.4));

  const getStatus = (score: number): 'Dominant Sanctum' | 'Active Exploration' | 'Uncharted Horizon' => {
    if (score >= 70) return 'Dominant Sanctum';
    if (score >= 50) return 'Active Exploration';
    return 'Uncharted Horizon';
  };

  const territories: Territory[] = [
    {
      id: 'wooded',
      name: 'The Wooded Territory',
      title: 'Heartwoods, Ancient Roots & Noble Barks',
      accords: ['Mysore Sandalwood', 'Himalayan Cedar', 'Assam Agarwood', 'Cypress'],
      icon: TreeDeciduous,
      score: woodedScore,
      bgGradient: 'from-[#2A1D13] via-[#1E150F] to-[#120E0A]',
      accentBorder: 'border-[#784A22]',
      description: 'Your fundamental pillar. You inhabit compositions anchored in heavy lignified heartwoods that warm gently on skin over long durations.',
      status: getStatus(woodedScore)
    },
    {
      id: 'earth',
      name: 'The Earth Territory',
      title: 'Petrichor, Baked Clay & Moist Soil',
      accords: ['Geosmin', 'Kannauj Mitti', 'Roots of Ruh Khus', 'Dark Patchouli'],
      icon: Mountain,
      score: earthScore,
      bgGradient: 'from-[#261B14] via-[#1A120E] to-[#0F0C0A]',
      accentBorder: 'border-[#9A5B2D]',
      description: 'An instinctive affinity for pre-monsoon atmospheric ozone, baked terracotta, and cooling subterranean vetiver roots.',
      status: getStatus(earthScore)
    },
    {
      id: 'resinous',
      name: 'The Resinous Territory',
      title: 'Spiced Amber, Frankincense & Thermal Balsams',
      accords: ['Kashmiri Saffron', 'Green Cardamom', 'Benzoin Tears', 'Myrrh'],
      icon: Flame,
      score: resinousScore,
      bgGradient: 'from-[#301C11] via-[#20130D] to-[#120B07]',
      accentBorder: 'border-[#A35218]',
      description: 'Thermal radiance that provides comforting sillage during crisp evenings and temperate weather transitions.',
      status: getStatus(resinousScore)
    },
    {
      id: 'solar',
      name: 'The Solar Territory',
      title: 'Zesty Bergamot, Green Stems & Daylight Citrus',
      accords: ['Italian Bergamot', 'Neroli Blossoms', 'Crushed Mint', 'Petitgrain'],
      icon: Sun,
      score: solarScore,
      bgGradient: 'from-[#2B2313] via-[#1C170E] to-[#100E08]',
      accentBorder: 'border-[#8A7023]',
      description: 'Bright, invigorating effervescence providing immediate lift, crisp mental clarity, and crystalline morning projection.',
      status: getStatus(solarScore)
    },
    {
      id: 'botanical',
      name: 'The Botanical Territory',
      title: 'Damask Roses, Night Jasmine & Dewy Petals',
      accords: ['Damascena Rose', 'Madurai Mogra', 'Orange Blossom', 'Tuberose'],
      icon: Flower2,
      score: botanicalScore,
      bgGradient: 'from-[#2C191D] via-[#1E1114] to-[#110A0C]',
      accentBorder: 'border-[#8A3B4F]',
      description: 'Velvety floral architecture that softens woody anchors with intoxicating nocturnal elegance.',
      status: getStatus(botanicalScore)
    },
    {
      id: 'marine',
      name: 'The Marine & Air Territory',
      title: 'Oceanic Ozone, Sea Salt & High Alpine Mist',
      accords: ['Sea Mineral Accord', 'Coastal Mist', 'Clean Ozone', 'Driftwood'],
      icon: Wind,
      score: marineScore,
      bgGradient: 'from-[#172227] via-[#10171A] to-[#0A0E10]',
      accentBorder: 'border-[#2D5866]',
      description: 'Expansive breathability that introduces airy negative space between dense oriental and woody accords.',
      status: getStatus(marineScore)
    }
  ].sort((a, b) => b.score - a.score);

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl text-[#FAF5F0]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter IV • Scent Territories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            The Six Olfactory Territories
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            How your 8-dimensional coordinates map onto natural geographic and material realms of the fragrance world.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono-lab text-[#8C7D70]">Dominant Realm</span>
          <div className="font-serif text-lg text-[#F59E0B] font-medium">
            {territories[0].name} ({territories[0].score}%)
          </div>
        </div>
      </div>

      {/* Territories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {territories.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className={`rounded-2xl p-6 bg-gradient-to-b ${t.bgGradient} border ${t.accentBorder} space-y-4 relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}
            >
              {/* Badge & Ranking */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#A8988B]">
                  0{idx + 1} &bull; {t.status}
                </span>
                <span className="font-serif text-2xl font-semibold text-[#FAF5F0]">
                  {t.score}%
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  <Icon className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#FAF5F0] leading-tight">
                    {t.name}
                  </h3>
                  <div className="text-[11px] text-[#A8988B] mt-0.5">
                    {t.title}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#C8BAAB] leading-relaxed">
                {t.description}
              </p>

              {/* Accords Pills */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                  Signature Resonating Accords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.accords.map((accord) => (
                    <span
                      key={accord}
                      className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono-lab text-[#E6DACB]"
                    >
                      {accord}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
