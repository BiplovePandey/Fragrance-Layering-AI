import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Droplets, Sparkles, Award, ShieldAlert, ArrowRight, Compass, FlaskConical } from 'lucide-react';
import { HeritageEntry, Fragrance } from '../../types.js';

interface AttarArchiveProps {
  onSelectSpecimen: (entry: HeritageEntry) => void;
  heritageEntries: HeritageEntry[];
  allFragrances: Fragrance[];
  ownedFragrances: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
}

export const AttarArchive: React.FC<AttarArchiveProps> = ({
  onSelectSpecimen,
  heritageEntries,
  allFragrances,
  ownedFragrances,
  onInspectInChamber
}) => {
  const attarFragrances = allFragrances.filter(
    (f) => f.format === 'Attar' || f.is_oil_based || (f.name && f.name.toLowerCase().includes('attar'))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#3E3228] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            <Droplets className="w-3.5 h-3.5" />
            Non-Alcoholic Lipid Extraction
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] mt-1">
            The Attar Archive
          </h2>
          <p className="text-sm text-[#A8988B] mt-1 max-w-xl">
            Concentrated natural perfume oils (Ittar) distilled directly into pure sandalwood or carrier lipids.
            No denatured ethanol, no artificial propellant spray.
          </p>
        </div>

        <div className="text-xs font-mono-lab text-[#D6C7B2] bg-[#2A221C] px-3.5 py-1.5 rounded-xl border border-[#44362B] self-start md:self-auto">
          {attarFragrances.length} Oil-Based Masterpieces
        </div>
      </div>

      {/* Attar Physics & Science vs. Ethanol Comparison Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#1C1713] border border-[#3E3228] space-y-2">
          <div className="text-[10px] font-mono-lab uppercase text-[#F59E0B] tracking-wider">
            Zero Ethanol Evaporation Spike
          </div>
          <h3 className="font-serif text-base text-[#FAF5F0]">
            Skin Chemistry Fusion
          </h3>
          <p className="text-xs text-[#A8988B] leading-relaxed">
            Unlike 80% alcohol sprays that flash-evaporate top notes in 15 minutes, pure oil warms
            delicately with your skin pulse points, releasing floral volatiles in subtle concentric waves.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C1713] border border-[#3E3228] space-y-2">
          <div className="text-[10px] font-mono-lab uppercase text-[#F59E0B] tracking-wider">
            Santalol Sesquiterpenes
          </div>
          <h3 className="font-serif text-base text-[#FAF5F0]">
            Natural Fixative Medium
          </h3>
          <p className="text-xs text-[#A8988B] leading-relaxed">
            Mysore sandalwood base oil acts as a molecular anchor. Its high molecular weight prevents
            rapid evaporation, yielding an intimate 12 to 24-hour scent aura without synthetic fixatives.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C1713] border border-[#3E3228] space-y-2">
          <div className="text-[10px] font-mono-lab uppercase text-[#F59E0B] tracking-wider">
            Intimate Personal Sillage
          </div>
          <h3 className="font-serif text-base text-[#FAF5F0]">
            Aura Over Projection
          </h3>
          <p className="text-xs text-[#A8988B] leading-relaxed">
            Attars radiate close to the body. They reward proximity and movement rather than filling
            entire rooms with chemical vapor, making them ideal for personal ritual and warm humid days.
          </p>
        </div>
      </div>

      {/* Curated Attar Flacons Showcase */}
      <div className="space-y-4 pt-2">
        <div className="text-xs font-mono-lab uppercase tracking-widest text-[#D97706]">
          Archival Attar Specimens in Atelier Collection
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {attarFragrances.map((frag) => {
            const isOwned = ownedFragrances.some((of) => of.id === frag.id);

            return (
              <div
                key={frag.id}
                className="group rounded-3xl p-6 bg-[#1F1813] border border-[#3E3228] hover:border-[#D97706]/70 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-lab uppercase text-[#D97706] bg-[#2A1F17] px-2 py-0.5 rounded border border-[#443325]">
                      {frag.format || 'Attar'}
                    </span>
                    {isOwned && (
                      <span className="text-[10px] font-mono-lab uppercase px-2 py-0.5 rounded bg-[#451A03] text-[#FDE68A] border border-[#B45309]/50">
                        In Your Cabinet
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-mono-lab text-[#9C8D80] uppercase">
                      {frag.brand}
                    </div>
                    <h4 className="font-serif text-xl text-[#FAF5F0] group-hover:text-[#FDE68A] transition-colors mt-0.5">
                      {frag.name}
                    </h4>
                  </div>

                  <p className="text-xs text-[#B0A294] line-clamp-2 leading-relaxed">
                    {frag.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {[...(frag.top_notes || []), ...(frag.base_notes || [])].slice(0, 3).map((n, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#2A2019] text-[#D6C7B2] border border-[#3E3228]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#3E3228]/70 flex items-center justify-between">
                  <div className="text-[10px] font-mono-lab text-[#9C8D80]">
                    {frag.longevity || '12-24 hrs'}
                  </div>

                  {onInspectInChamber && (
                    <button
                      onClick={() => onInspectInChamber(frag)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2E2219] hover:bg-[#D97706] text-xs font-mono-lab text-[#FAF5F0] transition-colors border border-[#4A3728]"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Inspect Flacon
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
