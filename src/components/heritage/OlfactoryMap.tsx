import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Compass, ArrowRight, Sparkles, Award, ExternalLink } from 'lucide-react';
import { HERITAGE_MAP_REGIONS, HeritageMapRegion } from '../../services/heritageService.js';
import { HeritageEntry } from '../../types.js';

interface OlfactoryMapProps {
  onSelectSpecimen: (entry: HeritageEntry) => void;
  heritageEntries: HeritageEntry[];
}

export const OlfactoryMap: React.FC<OlfactoryMapProps> = ({
  onSelectSpecimen,
  heritageEntries
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('kannauj');
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const activeRegion = HERITAGE_MAP_REGIONS.find((r) => r.id === selectedRegionId) || HERITAGE_MAP_REGIONS[1];

  const regionSpecimens = heritageEntries.filter((e) =>
    activeRegion.heritageIds.includes(e.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#3E3228] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            <Compass className="w-3.5 h-3.5" />
            Cartographic Scent Geography
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] mt-1">
            The Olfactory Map of India
          </h2>
          <p className="text-sm text-[#A8988B] mt-1 max-w-xl">
            Seven historically documented botanical and attar micro-climates where specific terroir,
            soil, and traditional extraction methods yield world-renowned olfactory signatures.
          </p>
        </div>
        <div className="text-xs font-mono-lab text-[#D6C7B2] bg-[#2A221C] px-3.5 py-1.5 rounded-xl border border-[#44362B] self-start md:self-auto">
          Interactive Terracotta & Brass Projection
        </div>
      </div>

      {/* Main Map & Region Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Illustrated Archival Map Canvas */}
        <div className="lg:col-span-7 bg-[#1A1512] rounded-3xl p-6 sm:p-8 border border-[#3E3228] shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center justify-center">
          {/* Subtle Cartographic Graticule & Topographic Rings */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,#D97706_1px,transparent_1px)] [background-size:32px_32px]" />
          
          {/* Decorative Compass Rose */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center opacity-40 pointer-events-none select-none">
            <Compass className="w-8 h-8 text-[#D97706]" />
            <span className="text-[8px] font-mono-lab text-[#D97706] tracking-widest mt-0.5">NORTH</span>
          </div>

          <div className="relative w-full max-w-[440px] aspect-[4/5] mx-auto select-none">
            {/* Hand-drawn SVG Stylized Map of the Indian Subcontinent Contour */}
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              aria-label="Olfactory Map of India"
            >
              {/* Landmass Outlines & Archival Shading */}
              <defs>
                <linearGradient id="parchmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2A211B" />
                  <stop offset="50%" stopColor="#241B16" />
                  <stop offset="100%" stopColor="#1B130E" />
                </linearGradient>
                <filter id="brassGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* India Simplified Outline Silhouette */}
              <path
                d="M 32,10 
                   C 36,9 42,12 40,16 
                   C 45,15 48,18 45,22 
                   C 48,25 54,26 58,26 
                   C 66,27 75,26 85,28 
                   C 92,30 94,36 88,38 
                   C 82,40 76,36 72,40 
                   C 68,43 65,48 64,54 
                   C 63,60 60,66 54,72 
                   C 48,78 44,84 42,94 
                   C 40,97 38,98 37,94 
                   C 34,86 32,78 30,70 
                   C 28,64 26,56 26,50 
                   C 24,44 26,38 27,32 
                   C 26,26 27,20 30,14 Z"
                fill="url(#parchmentGrad)"
                stroke="#5A4738"
                strokeWidth="0.8"
                strokeDasharray="1.5,1"
              />

              {/* Topographic internal mountain and river lines */}
              {/* Indus/Gangetic river curve */}
              <path
                d="M 33,22 Q 44,28 56,36 Q 66,42 70,48"
                fill="none"
                stroke="#47382B"
                strokeWidth="0.4"
                strokeDasharray="2,2"
              />
              {/* Western Ghats ridge */}
              <path
                d="M 28,52 Q 31,68 36,86"
                fill="none"
                stroke="#47382B"
                strokeWidth="0.4"
                strokeDasharray="1.5,1.5"
              />

              {/* Geographic Region Marker Nodes */}
              {HERITAGE_MAP_REGIONS.map((region) => {
                const isSelected = selectedRegionId === region.id;
                const isHovered = hoveredRegionId === region.id;

                return (
                  <g
                    key={region.id}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setSelectedRegionId(region.id)}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select region ${region.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedRegionId(region.id);
                      }
                    }}
                  >
                    {/* Outer Pulse Ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={region.svgCoordinates.x}
                        cy={region.svgCoordinates.y}
                        r={isSelected ? 6.5 : 5}
                        fill="none"
                        stroke={region.color}
                        strokeWidth="0.6"
                        opacity={isSelected ? 0.8 : 0.4}
                        className="animate-ping"
                      />
                    )}

                    {/* Secondary Aura */}
                    <circle
                      cx={region.svgCoordinates.x}
                      cy={region.svgCoordinates.y}
                      r={isSelected ? 4.2 : 3}
                      fill={region.color}
                      opacity={isSelected ? 0.35 : 0.18}
                    />

                    {/* Core Solid Brass Pin */}
                    <circle
                      cx={region.svgCoordinates.x}
                      cy={region.svgCoordinates.y}
                      r={isSelected ? 2.5 : 1.8}
                      fill={isSelected ? '#FAF5F0' : region.color}
                      stroke={isSelected ? region.color : '#1C1713'}
                      strokeWidth="0.8"
                      filter="url(#brassGlow)"
                    />

                    {/* Region Label Tag */}
                    <text
                      x={region.svgCoordinates.x + (region.svgCoordinates.x > 60 ? -3 : 4)}
                      y={region.svgCoordinates.y + 0.8}
                      textAnchor={region.svgCoordinates.x > 60 ? 'end' : 'start'}
                      fontSize="3.2"
                      fontFamily="serif"
                      fill={isSelected ? '#FDE68A' : '#C8BAAB'}
                      fontWeight={isSelected ? '600' : '400'}
                      className="transition-colors pointer-events-none"
                    >
                      {region.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Region Selector Pills */}
          <div className="w-full pt-4 flex flex-wrap items-center justify-center gap-2 border-t border-[#3E3228]/70 mt-4">
            {HERITAGE_MAP_REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono-lab uppercase tracking-wider transition-all ${
                  selectedRegionId === region.id
                    ? 'bg-[#D97706] text-white font-medium shadow-[0_2px_8px_rgba(217,119,6,0.4)]'
                    : 'bg-[#241C16] text-[#B0A294] hover:bg-[#342921] hover:text-[#FAF5F0] border border-[#3E3228]'
                }`}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active Region Dossier & Specimens */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            key={activeRegion.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1C1713] rounded-3xl p-6 sm:p-8 border border-[#3E3228] shadow-[0_12px_36px_rgba(0,0,0,0.35)] relative overflow-hidden"
          >
            {/* Top Regional Seal */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3E3228]">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeRegion.color }}
                />
                <span className="text-[11px] font-mono-lab uppercase tracking-widest text-[#D97706] font-medium">
                  {activeRegion.state}
                </span>
              </div>
              <span className="text-xs font-serif italic text-[#C8BAAB]">
                {activeRegion.hindiName}
              </span>
            </div>

            {/* Region Title */}
            <div className="py-4 space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0]">
                {activeRegion.name}
              </h3>
              <p className="text-xs font-mono-lab text-[#F59E0B] tracking-wide">
                Signature: {activeRegion.signatureMaterial}
              </p>
              <p className="text-sm text-[#B0A294] leading-relaxed pt-1">
                {activeRegion.botanicalTradition}
              </p>
            </div>

            {/* Historical Period Badge */}
            <div className="bg-[#261E18] p-3.5 rounded-2xl border border-[#3E3228] text-xs text-[#D6C7B2] flex items-center gap-2.5">
              <Award className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>{activeRegion.historicalPeriod}</span>
            </div>

            {/* Linked Botanical & Attar Specimens in this Region */}
            <div className="pt-6 space-y-3">
              <div className="text-[11px] font-mono-lab uppercase tracking-widest text-[#E5D7C7] flex items-center justify-between">
                <span>Archival Specimens from this Terroir</span>
                <span className="text-[10px] text-[#A8988B]">{regionSpecimens.length} registered</span>
              </div>

              <div className="space-y-2.5">
                {regionSpecimens.map((specimen) => (
                  <div
                    key={specimen.id}
                    onClick={() => onSelectSpecimen(specimen)}
                    className="group cursor-pointer p-3.5 rounded-2xl bg-[#241B16] hover:bg-[#32251D] border border-[#3E3228] hover:border-[#D97706]/60 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#FAF5F0] group-hover:text-[#FDE68A] transition-colors">
                          {specimen.name}
                        </span>
                        {specimen.gi_tag && (
                          <span className="text-[9px] font-mono-lab uppercase px-1.5 py-0.5 rounded bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/30">
                            GI
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#B0A294] font-serif italic truncate max-w-xs">
                        {specimen.hindi_name}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1C1713] flex items-center justify-center border border-[#44362B] group-hover:bg-[#D97706] group-hover:text-white transition-all text-[#C8BAAB]">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
