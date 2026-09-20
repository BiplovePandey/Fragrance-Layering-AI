import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Wind, Droplets, Sparkles, BookOpen, Layers } from 'lucide-react';
import { DegBhapkaExploration } from './DegBhapkaExploration.js';
import { HeritageEntry } from '../../types.js';

interface KannaujHeroSectionProps {
  onSelectSpecimen: (entry: HeritageEntry) => void;
  kannaujEntries: HeritageEntry[];
}

export const KannaujHeroSection: React.FC<KannaujHeroSectionProps> = ({
  onSelectSpecimen,
  kannaujEntries
}) => {
  const [showDistillationDetails, setShowDistillationDetails] = useState<boolean>(true);

  return (
    <div className="space-y-8">
      {/* Kannauj Atmosphere Canvas Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2B1B12] via-[#20140D] to-[#160E09] border border-[#52331C] p-6 sm:p-10 lg:p-12 text-[#FAF5F0] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        {/* Warm Terracotta and Wood Smoke Light Gradient */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(234,88,12,0.2),transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[radial-gradient(circle,rgba(180,83,9,0.18),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono-lab uppercase tracking-widest bg-[#EA580C]/20 text-[#FED7AA] border border-[#EA580C]/40 flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-[#F97316]" />
              The Grasse of the East • GI Registered
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono-lab uppercase tracking-widest bg-[#2A1E17] text-[#D6C7B2] border border-[#44362B]">
              400+ Years Living Artisanship
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF5F0] tracking-tight">
            Kannauj — The Attar Tradition
          </h2>

          <p className="font-serif italic text-lg text-[#FDE68A]">
            Where parched summer earth, morning rose petals, and sacred woods meet in copper and steam.
          </p>

          <p className="text-sm sm:text-base text-[#D4C3B3] leading-relaxed">
            Perched beside the holy Ganges in Uttar Pradesh, Kannauj has maintained an unbroken
            lineage of natural fragrance creation since the Mughal era. Here, master distillers
            (*Dighas*) control firewood fires by touch, seal cauldrons with mud, and capture the
            ethereal spirit of rain falling on soil using sandalwood oil as a living alchemical vessel.
          </p>

          {/* Quick Pillars of Kannauj Scent Craft */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="bg-[#1C120A]/80 p-3.5 rounded-2xl border border-[#442B1A] space-y-1">
              <div className="text-[10px] font-mono-lab uppercase tracking-wider text-[#F97316]">
                Pure Raw Materials
              </div>
              <div className="text-xs font-serif text-[#FAF5F0] font-medium">
                Alluvial Clay & Wild Botanicals
              </div>
              <p className="text-[11px] text-[#A8988B] leading-snug">
                Clay harvested from local riverbeds and sun-baked before June downpours.
              </p>
            </div>

            <div className="bg-[#1C120A]/80 p-3.5 rounded-2xl border border-[#442B1A] space-y-1">
              <div className="text-[10px] font-mono-lab uppercase tracking-wider text-[#F97316]">
                Zero Synthetic Solvents
              </div>
              <div className="text-xs font-serif text-[#FAF5F0] font-medium">
                Closed-Loop Hydro-Distillation
              </div>
              <p className="text-[11px] text-[#A8988B] leading-snug">
                Extracted purely using river water, firewood heat, and bamboo conduits.
              </p>
            </div>

            <div className="bg-[#1C120A]/80 p-3.5 rounded-2xl border border-[#442B1A] space-y-1">
              <div className="text-[10px] font-mono-lab uppercase tracking-wider text-[#F97316]">
                Sandalwood Bed
              </div>
              <div className="text-xs font-serif text-[#FAF5F0] font-medium">
                Lipid Sesquiterpene Binding
              </div>
              <p className="text-[11px] text-[#A8988B] leading-snug">
                Molecules bound to Mysore santalol for non-alcoholic, all-day skin retention.
              </p>
            </div>
          </div>
        </div>

        {/* Kannauj Heritage Specimens Quick Action Row */}
        <div className="pt-8 border-t border-[#442B1A] mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-mono-lab text-[#D6C7B2]">
            Master Specimens from Kannauj:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {kannaujEntries.map((specimen) => (
              <button
                key={specimen.id}
                onClick={() => onSelectSpecimen(specimen)}
                className="px-3 py-1.5 rounded-xl bg-[#351E11] hover:bg-[#4A2B19] border border-[#5E361F] hover:border-[#EA580C] text-xs font-serif text-[#FAF5F0] transition-all flex items-center gap-1.5"
              >
                <span>{specimen.name}</span>
                <span className="text-[10px] text-[#F97316] font-mono-lab">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deg & Bhapka Interactive Explorer Embedded Section */}
      <DegBhapkaExploration />
    </div>
  );
};
