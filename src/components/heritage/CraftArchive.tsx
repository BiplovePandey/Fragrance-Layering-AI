import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Droplets, Clock, Layers, Sparkles, Award, Info, ChevronRight } from 'lucide-react';
import { TRADITIONAL_CRAFT_PROCESSES, TraditionalCraftProcess } from '../../data/heritageAtlas.js';

export const CraftArchive: React.FC = () => {
  const [selectedProcessId, setSelectedProcessId] = useState<string>('deg-bhapka');

  const activeProcess =
    TRADITIONAL_CRAFT_PROCESSES.find((p) => p.id === selectedProcessId) ||
    TRADITIONAL_CRAFT_PROCESSES[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#3E3228] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            <Layers className="w-3.5 h-3.5" />
            Traditional Artisanal Techniques
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] mt-1">
            The Craft Archive
          </h2>
          <p className="text-sm text-[#A8988B] mt-1 max-w-xl">
            Verifiable artisanal methodologies preserved across centuries of Indian perfumery:
            from wood-fired hydro-distillation to seasonal dawn harvesting.
          </p>
        </div>

        <div className="text-xs font-mono-lab text-[#D6C7B2] bg-[#2A221C] px-3.5 py-1.5 rounded-xl border border-[#44362B] self-start md:self-auto">
          Historical Artisanal Documentation
        </div>
      </div>

      {/* Craft Method Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRADITIONAL_CRAFT_PROCESSES.map((process) => {
          const isSelected = selectedProcessId === process.id;
          return (
            <button
              key={process.id}
              onClick={() => setSelectedProcessId(process.id)}
              className={`text-left p-5 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-[#2A2019] border-[#F59E0B] shadow-[0_8px_24px_rgba(217,119,6,0.25)] ring-1 ring-[#F59E0B]/50'
                  : 'bg-[#1C1713] border-[#3E3228] hover:bg-[#241B16] hover:border-[#D97706]/60'
              }`}
            >
              <div className="space-y-1">
                <div className="text-[10px] font-mono-lab uppercase tracking-wider text-[#D97706]">
                  {process.hindi_term}
                </div>
                <h3 className="font-serif text-lg text-[#FAF5F0] font-medium leading-snug">
                  {process.title}
                </h3>
              </div>
              <p className="text-xs text-[#A8988B] line-clamp-2 leading-relaxed">
                {process.tagline}
              </p>
              <div className="text-[10px] font-mono-lab text-[#F59E0B] flex items-center gap-1 mt-1">
                <span>{process.stages.length} Verified Stages</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Craft Dossier */}
      <motion.div
        key={activeProcess.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1C1713] rounded-3xl p-6 sm:p-10 border border-[#3E3228] shadow-[0_16px_48px_rgba(0,0,0,0.35)] space-y-6"
      >
        <div className="border-b border-[#3E3228] pb-5 space-y-2">
          <div className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            {activeProcess.hindi_term}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0]">
            {activeProcess.title}
          </h3>
          <p className="text-sm text-[#C8BAAB] leading-relaxed max-w-2xl">
            {activeProcess.description}
          </p>
        </div>

        {/* Process Stages Visual Timeline */}
        <div className="space-y-4 pt-2">
          <div className="text-xs font-mono-lab uppercase tracking-widest text-[#E5D7C7]">
            Sequential Extraction Protocol
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProcess.stages.map((stg) => (
              <div
                key={stg.stage_number}
                className="p-5 rounded-2xl bg-[#241B16] border border-[#3E3228] space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono-lab text-[#D97706]">
                    <span>STAGE 0{stg.stage_number}</span>
                    <span className="text-[#8C7D70]">{stg.vessel_or_material}</span>
                  </div>
                  <h4 className="font-serif text-base text-[#FAF5F0]">
                    {stg.title}
                  </h4>
                  <p className="text-xs text-[#A8988B] leading-relaxed">
                    {stg.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific Honesty Callout */}
        <div className="p-4 rounded-2xl bg-[#2A1E16] border border-[#78350F]/40 flex items-start gap-3 text-xs text-[#FDE68A]">
          <Info className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-mono-lab uppercase text-[10px] text-[#FBBF24]">
              Archival Provenance Note
            </div>
            <p className="text-[#D6C7B2] leading-relaxed">
              {activeProcess.scientific_honesty_note}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
