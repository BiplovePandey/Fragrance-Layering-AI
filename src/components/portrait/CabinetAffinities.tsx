import React from 'react';
import {
  Sparkles,
  Eye,
  Beaker,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import {
  OlfactoryVector8D,
  extractFragranceVector8D,
  computeCosineSimilarity8D,
  LivingOlfactoryDNA
} from '../../services/olfactoryIntelligence.js';
import { ScentBottle } from '../ui/ScentBottle.js';

interface CabinetAffinitiesProps {
  livingDNA: LivingOlfactoryDNA;
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  onInspectInChamber: (fragrance: Fragrance) => void;
  onSendToLab: (fragrance: Fragrance) => void;
  onWearToday: (fragrance: Fragrance) => void;
  onNavigateToCabinet: () => void;
}

export const CabinetAffinities: React.FC<CabinetAffinitiesProps> = ({
  livingDNA,
  ownedFragrances,
  allFragrances,
  onInspectInChamber,
  onSendToLab,
  onWearToday,
  onNavigateToCabinet
}) => {
  const hasOwned = ownedFragrances && ownedFragrances.length > 0;
  const pool = hasOwned ? ownedFragrances : allFragrances;

  // Compute cosine compatibility with user DNA
  const scoredFragrances = pool.map(frag => {
    const vec = extractFragranceVector8D(frag);
    const sim = computeCosineSimilarity8D(livingDNA.vector, vec);
    return {
      frag,
      score: Math.round(sim * 100),
      vec
    };
  }).sort((a, b) => b.score - a.score);

  const heroAlignment = scoredFragrances[0];
  const secondaryAlignments = scoredFragrances.slice(1, 4);

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl text-[#FAF5F0] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter VI • Your Fragrance Affinities</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Cabinet DNA Affinities
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            {hasOwned
              ? 'Ranked compatibility of your personal wardrobe against your 8-dimensional olfactory coordinates.'
              : 'Atelier specimens demonstrating the highest mathematical harmony with your baseline profile.'}
          </p>
        </div>

        <button
          onClick={onNavigateToCabinet}
          className="px-4 py-2 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#FEF3C7] text-xs font-mono-lab uppercase tracking-wider border border-[#3E3228] transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <span>View Full Cabinet</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Alignment Showcase */}
      {heroAlignment && (
        <div className="rounded-2xl bg-gradient-to-r from-[#241912] via-[#1B130E] to-[#120E0B] border border-[#523A25] p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Flacon Pedestal */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4">
              <ScentBottle
                name={heroAlignment.frag.name}
                brand={heroAlignment.frag.brand_name || heroAlignment.frag.brand}
                family={heroAlignment.frag.fragrance_family}
                size="lg"
                fillLevel={85}
                showAura={true}
                interactive={true}
              />
              <div className="mt-3 text-center">
                <span className="px-3 py-1 rounded-full bg-[#342217] border border-[#5A3825] text-xs font-mono-lab text-[#F59E0B]">
                  {heroAlignment.score}% DNA Resonance
                </span>
              </div>
            </div>

            {/* Details & Rationale */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-lab uppercase text-[#D97706]">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <span>Primary DNA Mirror</span>
              </div>

              <div>
                <h3 className="font-serif text-3xl text-[#FAF5F0] font-medium">
                  {heroAlignment.frag.name}
                </h3>
                <div className="text-sm text-[#A8988B] mt-0.5">
                  {heroAlignment.frag.brand_name || heroAlignment.frag.brand} &bull; {heroAlignment.frag.fragrance_family}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#14100D] border border-[#3E3228] space-y-2">
                <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                  Why It Resonates with Your Portrait
                </div>
                <p className="text-xs sm:text-sm text-[#E6DACB] leading-relaxed">
                  This composition mirrors your {livingDNA.personalityTitle} identity by balancing
                  dry heartwoods with {(heroAlignment.frag.top_notes || []).slice(0, 2).join(' and ')}
                  without triggering unwanted sweetness. Its {heroAlignment.frag.format || 'EDP'} structure
                  delivers the exact {livingDNA.vector.intensity >= 70 ? 'commanding projection' : 'intimate sillage'} you favor.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onInspectInChamber(heroAlignment.frag)}
                  className="px-3.5 py-2 rounded-xl bg-[#2E2219] hover:bg-[#443224] text-xs font-mono-lab uppercase text-[#FEF3C7] border border-[#523A25] transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Inspect in Chamber</span>
                </button>

                <button
                  onClick={() => onSendToLab(heroAlignment.frag)}
                  className="px-3.5 py-2 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-xs font-mono-lab uppercase text-[#FAF5F0] border border-[#3E3228] transition-colors flex items-center gap-1.5"
                >
                  <Beaker className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Layer in Lab</span>
                </button>

                <button
                  onClick={() => onWearToday(heroAlignment.frag)}
                  className="px-3.5 py-2 rounded-xl bg-[#B45309] hover:bg-[#D97706] text-xs font-mono-lab uppercase text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Wear Ritual Today</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Resonating Wardrobe Candidates */}
      <div className="space-y-3">
        <div className="text-xs font-mono-lab uppercase tracking-wider text-[#A8988B]">
          Secondary High-Resonance Wardrobe Flacons
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {secondaryAlignments.map(({ frag, score }) => (
            <div
              key={frag.id}
              className="p-4 rounded-xl bg-[#1C1612] border border-[#3E3228] flex flex-col justify-between space-y-3 hover:border-[#5A402D] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8C7D70] font-mono-lab text-[10px] uppercase">
                    {frag.fragrance_family}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#2A1E16] text-[#F59E0B] font-mono-lab text-[10px] font-semibold">
                    {score}% Match
                  </span>
                </div>
                <h4 className="font-serif text-base text-[#FAF5F0] font-medium mt-1">
                  {frag.name}
                </h4>
                <div className="text-[11px] text-[#A8988B]">
                  {frag.brand_name || frag.brand}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#2E241D]">
                <button
                  onClick={() => onInspectInChamber(frag)}
                  className="w-full py-1.5 rounded-lg bg-[#241B16] hover:bg-[#34261F] text-[10px] font-mono-lab uppercase text-[#D6C7B2] border border-[#3E3228] transition-colors"
                >
                  Chamber
                </button>
                <button
                  onClick={() => onSendToLab(frag)}
                  className="w-full py-1.5 rounded-lg bg-[#241B16] hover:bg-[#34261F] text-[10px] font-mono-lab uppercase text-[#D6C7B2] border border-[#3E3228] transition-colors"
                >
                  Lab
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
