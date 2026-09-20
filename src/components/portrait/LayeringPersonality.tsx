import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Beaker,
  Compass
} from 'lucide-react';
import { LivingOlfactoryDNA } from '../../services/olfactoryIntelligence.js';
import { Fragrance } from '../../types.js';

interface LayeringPersonalityProps {
  livingDNA: LivingOlfactoryDNA;
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  onSendToLabChord?: (baseFrag: Fragrance, topFrag: Fragrance) => void;
  onNavigateToLab?: () => void;
}

export const LayeringPersonality: React.FC<LayeringPersonalityProps> = ({
  livingDNA,
  ownedFragrances,
  allFragrances,
  onSendToLabChord,
  onNavigateToLab
}) => {
  const vec = livingDNA.vector;

  // Derive archetype based on vector
  let archetype = 'The Anchor Seeker';
  let subtitle = 'Grounding Ethereal Top Notes with Ancient Heartwood Bases';
  let description = 'You instinctively pair sparkling, citrus, or green openings over deep, long-tenacity sandalwood or petrichor attars to prevent volatility drop-off.';
  let formula = 'Base: High-Santalol Attar (1-2 drops) + Top: Volatile Citrus EDT (3 sprays)';

  if (vec.earthy_clay >= 70 && vec.freshness >= 70) {
    archetype = 'The Earth & Air Alchemist';
    subtitle = 'Suspended Tension Between Atmospheric Rain and Bright Sunshine';
    description = 'You seek the exhilarating contrast of rain-soaked baked earth (Mitti/Geosmin) elevated by zesty bergamot or high-altitude mint.';
    formula = 'Base: Pure Mitti or Ruh Khus Attar + Top: Crisp Aromatic Bergamot Cologne';
  } else if (vec.warm_resinous_spices >= 70 && vec.woody >= 70) {
    archetype = 'The Imperial Harmony Builder';
    subtitle = 'Layering Saffron, Aged Oudh, and Mysore Sandalwood';
    description = 'You prefer harmonious, resonant tonal layering where spices meld seamlessly into sacred resins and heartwoods without high-contrast friction.';
    formula = 'Base: Smoked Agarwood / Benzoin + Top: Cardamom Saffron Eau de Parfum';
  } else if (vec.floral >= 65 && vec.earthy_clay >= 65) {
    archetype = 'The Petal & Clay Naturalist';
    subtitle = 'Softening Mineral Loam with Dewy Damask Rose Petals';
    description = 'You layer rich Ruh Gulab or Madurai jasmine over damp clay to create a photorealistic botanical garden after rainfall.';
    formula = 'Base: Clay / Vetiver Oil + Top: Hydro-distilled Damask Rose Extrait';
  }

  // Find candidate base and top bottles
  const pool = ownedFragrances.length >= 2 ? ownedFragrances : allFragrances;
  const baseFrag = pool.find(f => f.format === 'Attar' || (f.base_notes || []).some(n => n.toLowerCase().includes('sandalwood') || n.toLowerCase().includes('oud') || n.toLowerCase().includes('vetiver'))) || pool[0];
  const topFrag = pool.find(f => f.id !== baseFrag.id && ((f.top_notes || []).some(n => n.toLowerCase().includes('bergamot') || n.toLowerCase().includes('citrus') || n.toLowerCase().includes('rose')) || f.format === 'EDT' || f.format === 'EDP')) || pool[1] || pool[0];

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl text-[#FAF5F0] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter VII • Your Layering Personality</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Layering Instinct &amp; Chord Blueprint
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            Derived algorithmically from your wear sessions, accord compatibility matrix, and base-to-top note balance.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1F1813] border border-[#3E3228] text-xs font-mono-lab text-[#D6C7B2]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
          <span>Model-Derived Behavioral Pattern</span>
        </div>
      </div>

      {/* Layering Archetype Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#281A12] via-[#1E130D] to-[#140E0A] border border-[#6E421E] p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono-lab uppercase tracking-wider text-[#D97706]">
            Current Layering Pattern
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#FAF5F0]">
            {archetype}
          </h3>
          <p className="font-serif italic text-base text-[#FDE68A]">
            "{subtitle}"
          </p>
          <p className="text-xs sm:text-sm text-[#C8BAAB] leading-relaxed max-w-2xl pt-1">
            {description}
          </p>
        </div>

        {/* Recommended Formula Blueprint */}
        <div className="p-4 rounded-xl bg-[#14100D]/80 border border-[#3E3228] space-y-2">
          <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
            Recommended Ratio Architecture
          </div>
          <div className="text-xs sm:text-sm font-mono-lab text-[#FEF3C7]">
            {formula}
          </div>
        </div>

        {/* Candidate Chord Pair Preview */}
        {baseFrag && topFrag && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono-lab uppercase text-[#A8988B]">
              Recommended Chord From Your Collection / Catalog
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#17120E] border border-[#3E3228] space-y-1">
                <span className="text-[10px] font-mono-lab uppercase text-[#D97706]">
                  Layer 1 (The Anchor)
                </span>
                <div className="font-serif text-base text-[#FAF5F0] font-medium">
                  {baseFrag.name}
                </div>
                <div className="text-[11px] text-[#8C7D70]">
                  {baseFrag.brand_name || baseFrag.brand} &bull; {baseFrag.format || 'Attar'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#17120E] border border-[#3E3228] space-y-1">
                <span className="text-[10px] font-mono-lab uppercase text-[#34D399]">
                  Layer 2 (The Harmonic Top)
                </span>
                <div className="font-serif text-base text-[#FAF5F0] font-medium">
                  {topFrag.name}
                </div>
                <div className="text-[11px] text-[#8C7D70]">
                  {topFrag.brand_name || topFrag.brand} &bull; {topFrag.format || 'EDP'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              {onSendToLabChord && (
                <button
                  onClick={() => onSendToLabChord(baseFrag, topFrag)}
                  className="px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#D97706] text-white text-xs font-mono-lab uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
                >
                  <Beaker className="w-3.5 h-3.5" />
                  <span>Synthesize Chord in Laboratory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}

              {onNavigateToLab && (
                <button
                  onClick={onNavigateToLab}
                  className="px-4 py-2 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#FAF5F0] text-xs font-mono-lab uppercase tracking-wider border border-[#3E3228] transition-colors"
                >
                  Open Layering Lab
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
