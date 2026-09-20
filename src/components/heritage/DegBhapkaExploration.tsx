import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Droplets,
  Waves,
  ShieldAlert,
  Info,
  Layers,
  ChevronRight,
  FlaskConical,
  Wind,
  Sparkles
} from 'lucide-react';
import { TRADITIONAL_CRAFT_PROCESSES } from '../../data/heritageAtlas.js';

export const DegBhapkaExploration: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const degProcess = TRADITIONAL_CRAFT_PROCESSES[0]; // deg-bhapka process

  const stages = degProcess.stages;
  const currentStage = stages[activeStageIndex];

  return (
    <div className="space-y-6">
      {/* Honesty & Transparency Notice Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#2A1E16] border border-[#78350F]/50 text-xs text-[#FDE68A]">
        <Info className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono-lab uppercase tracking-widest text-[10px] text-[#FBBF24] font-semibold">
            Scientific & Historical Transparency
          </div>
          <p className="text-[#D6C7B2] leading-relaxed">
            {degProcess.scientific_honesty_note}
          </p>
        </div>
      </div>

      {/* Main Interactive Apparatus Container */}
      <div className="bg-[#1C1713] rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#3E3228] shadow-[0_16px_48px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* Subtle Workshop Amber Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_70%)] pointer-events-none" />

        {/* Section Heading */}
        <div className="space-y-2 pb-6 border-b border-[#3E3228]">
          <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            <Flame className="w-3.5 h-3.5" />
            Traditional Distillation Apparatus
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0]">
            The Deg & Bhapka Closed-Loop Still
          </h3>
          <p className="text-sm text-[#A8988B] max-w-2xl">
            For four centuries, Kannauj perfumers have eschewed steel condensers and pressurized coils,
            relying on raw clay, copper, and hollow river bamboo to hydro-distill delicate botanical and mineral vapors.
          </p>
        </div>

        {/* Stage Timeline Navigation Tabs */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {stages.map((stg, idx) => {
              const isActive = activeStageIndex === idx;
              return (
                <button
                  key={stg.stage_number}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between gap-1.5 ${
                    isActive
                      ? 'bg-[#B45309] border-[#F59E0B] text-white shadow-[0_4px_16px_rgba(180,83,9,0.4)]'
                      : 'bg-[#241B16] border-[#3E3228] text-[#B0A294] hover:bg-[#32251D] hover:text-[#FAF5F0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-lab uppercase opacity-80">
                      Stage 0{stg.stage_number}
                    </span>
                    {isActive && <Sparkles className="w-3 h-3 text-[#FEF3C7]" />}
                  </div>
                  <div className="text-xs font-serif font-medium leading-snug line-clamp-2">
                    {stg.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Apparatus Diagram & Stage Breakdown */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Schematic Vector Apparatus Visualizer */}
          <div className="lg:col-span-6 bg-[#16120F] rounded-2xl p-6 border border-[#3E3228] relative overflow-hidden flex flex-col items-center justify-center">
            <div className="text-[10px] font-mono-lab uppercase tracking-widest text-[#8C7D70] mb-4 self-start">
              Apparatus Schematic • Hydro-Distillation Flow
            </div>

            <svg
              viewBox="0 0 320 220"
              className="w-full max-w-[360px] h-auto select-none"
              aria-label="Deg and Bhapka Apparatus Diagram"
            >
              <defs>
                {/* Copper gradient for Deg & Bhapka */}
                <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="50%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
                {/* Bamboo gradient for Chonga */}
                <linearGradient id="bambooGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#84CC16" />
                  <stop offset="100%" stopColor="#65A30D" />
                </linearGradient>
                {/* Cold water pool gradient */}
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0369A1" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* 1. Wood Hearth / Bhatti Furnace Base */}
              <rect x="25" y="160" width="90" height="40" rx="6" fill="#292019" stroke="#5A4738" strokeWidth="1" />
              {/* Hearth Flames */}
              <path
                d="M 45,185 Q 55,165 65,185 Q 75,160 85,185 Q 95,170 100,185"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.5"
                className="animate-pulse"
              />

              {/* 2. Copper Deg Cauldron */}
              <path
                d="M 35,160 C 30,120 40,85 70,85 C 100,85 110,120 105,160 Z"
                fill="url(#copperGrad)"
                stroke={activeStageIndex === 1 ? '#FEF3C7' : '#D97706'}
                strokeWidth={activeStageIndex === 1 ? '2' : '1'}
              />
              {/* Deg Lid & Mud Clay Seal */}
              <ellipse cx="70" cy="85" rx="20" ry="6" fill="#A16207" stroke="#FEF08A" strokeWidth="0.8" />
              <text x="70" y="130" textAnchor="middle" fontSize="9" fontFamily="serif" fill="#FEF3C7" fontWeight="600">
                DEG (देग)
              </text>

              {/* 3. Bamboo Chonga (Connecting Steam Pipe) */}
              <path
                d="M 70,82 C 100,45 190,45 220,110"
                fill="none"
                stroke={activeStageIndex === 2 ? '#FEF08A' : '#A3E635'}
                strokeWidth={activeStageIndex === 2 ? '4.5' : '3.5'}
                strokeLinecap="round"
              />
              <text x="145" y="48" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#D9F99D">
                CHONGA (च्योंगा Bamboo)
              </text>

              {/* 4. Cold Water Tank (Ganda) */}
              <rect x="180" y="125" width="115" height="75" rx="8" fill="url(#waterGrad)" stroke="#38BDF8" strokeWidth="1" />
              <text x="237" y="192" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill="#BAE6FD">
                GANDA (Cold Water Tank)
              </text>

              {/* 5. Bhapka Receiver (Inside Cold Water Tank) */}
              <path
                d="M 215,110 L 225,110 L 228,140 C 240,145 245,160 238,175 C 230,185 210,185 202,175 C 195,160 200,145 212,140 Z"
                fill="url(#copperGrad)"
                stroke={activeStageIndex === 3 ? '#FEF3C7' : '#F59E0B'}
                strokeWidth={activeStageIndex === 3 ? '2' : '1'}
              />
              <text x="220" y="165" textAnchor="middle" fontSize="8" fontFamily="serif" fill="#FEF3C7" fontWeight="600">
                BHAPKA
              </text>
              <text x="220" y="174" textAnchor="middle" fontSize="5.5" fontFamily="monospace" fill="#FDE68A">
                (Sandalwood Oil)
              </text>

              {/* Flow Arrows Indicator */}
              <circle cx="70" cy="85" r="3" fill="#EF4444" className="animate-ping" />
              <circle cx="220" cy="110" r="3" fill="#38BDF8" />
            </svg>

            {/* Quick Component Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[10px] font-mono-lab text-[#C8BAAB]">
              <span className="px-2 py-0.5 rounded bg-[#2A211B] border border-[#44362B]">
                Firewood Bhatti
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2A211B] border border-[#44362B]">
                Copper Deg
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2A211B] border border-[#44362B]">
                Bamboo Conduit
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2A211B] border border-[#44362B]">
                Sandalwood Base
              </span>
            </div>
          </div>

          {/* Right: Detailed Stage Exploration Card */}
          <div className="lg:col-span-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStageIndex}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="bg-[#241C16] p-6 rounded-2xl border border-[#3E3228] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#3E3228] pb-3">
                  <span className="text-[11px] font-mono-lab uppercase tracking-widest text-[#D97706] font-semibold">
                    Stage {currentStage.stage_number} of 5
                  </span>
                  <span className="text-xs font-mono-lab text-[#E5D7C7] bg-[#1C1713] px-2.5 py-1 rounded-lg border border-[#3E3228]">
                    {currentStage.vessel_or_material}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-xl sm:text-2xl text-[#FAF5F0]">
                    {currentStage.title}
                  </h4>
                  <p className="text-sm text-[#C8BAAB] leading-relaxed pt-1">
                    {currentStage.details}
                  </p>
                </div>

                {/* Craftsmanship Scientific Insight */}
                <div className="p-3.5 rounded-xl bg-[#1C1713] border border-[#44362B] text-xs text-[#D6C7B2] space-y-1">
                  <div className="font-mono-lab text-[10px] uppercase text-[#F59E0B] tracking-wider">
                    {activeStageIndex === 0 && 'Terroir & Substrate Balance'}
                    {activeStageIndex === 1 && 'Low-Pressure Atmospheric Physics'}
                    {activeStageIndex === 2 && 'Thermal & Acoustic Insulation'}
                    {activeStageIndex === 3 && 'Lipid-Binding Santalol Absorption'}
                    {activeStageIndex === 4 && 'Breathable Kupi Semipermeability'}
                  </div>
                  <p className="text-[#A8988B] leading-relaxed">
                    {activeStageIndex === 0 && 'Gangetic clay disks absorb sun heat before monsoon clouds break. The parched silt contains concentrated geosmin lipids released when immersed in well water.'}
                    {activeStageIndex === 1 && 'Sarson mitti (clay and mustard cake paste) cooks solid against the boiling copper seam, forming a flexible hermetic seal that gives way safely if internal pressure spikes.'}
                    {activeStageIndex === 2 && 'Unlike brass or steel pipes which conduct rapid heat and condense volatile esters prematurely, hollow bamboo maintains a constant thermal gradient along the arc.'}
                    {activeStageIndex === 3 && 'Pure Mysore sandalwood oil is high in alpha and beta santalol. These heavy sesquiterpene molecules form lipophilic bonds with rising floral and mineral steam.'}
                    {activeStageIndex === 4 && 'Traditional camel-leather kupis contain microscopic micropores that let water moisture evaporate over months while locking in precious non-volatile essential oils.'}
                  </p>
                </div>

                {/* Stage Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={activeStageIndex === 0}
                    onClick={() => setActiveStageIndex((p) => Math.max(0, p - 1))}
                    className="text-xs font-mono-lab uppercase text-[#A8988B] hover:text-white disabled:opacity-30 disabled:hover:text-[#A8988B] transition-colors py-1.5 px-3 rounded-lg bg-[#1C1713] border border-[#3E3228]"
                  >
                    Previous Stage
                  </button>
                  <button
                    disabled={activeStageIndex === stages.length - 1}
                    onClick={() => setActiveStageIndex((p) => Math.min(stages.length - 1, p + 1))}
                    className="text-xs font-mono-lab uppercase text-[#FEF3C7] hover:bg-[#D97706] transition-colors py-1.5 px-3 rounded-lg bg-[#B45309] font-medium"
                  >
                    Next Stage
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
