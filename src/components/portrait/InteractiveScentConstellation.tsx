import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Info,
  Compass,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Atom
} from 'lucide-react';
import { OlfactoryVector8D } from '../../services/olfactoryIntelligence.js';
import { Fragrance } from '../../types.js';

interface InteractiveScentConstellationProps {
  vector: OlfactoryVector8D;
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onExploreHeritage?: (materialId: string) => void;
}

interface DimensionMeta {
  key: keyof OlfactoryVector8D;
  label: string;
  shortLabel: string;
  descriptorHigh: string;
  descriptorLow: string;
  heritageMaterial: string;
  heritageMaterialId: string;
  relatedFamilies: string[];
  scientificExplanation: string;
  color: string;
  glowColor: string;
  angle: number; // in degrees, 0 to 360
}

const DIMENSIONS: DimensionMeta[] = [
  {
    key: 'freshness',
    label: 'Freshness',
    shortLabel: 'FRESH',
    descriptorHigh: 'Sparkling citrus zest, verdant morning leaves, and cooling atmospheric aldehydes.',
    descriptorLow: 'Deep, dense, non-volatile warmth with muted effervescence.',
    heritageMaterial: 'Kashmiri Bergamot & Ganjam Kewda',
    heritageMaterialId: 'kewda',
    relatedFamilies: ['Citrus Aromatic', 'Green Chypre', 'Aquatic'],
    scientificExplanation: 'Quantifies highly volatile top-note terpene fractions and monoterpenes with high vapor pressure.',
    color: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    angle: 0
  },
  {
    key: 'floral',
    label: 'Floral Delicacy',
    shortLabel: 'FLORAL',
    descriptorHigh: 'Damask rose petal velvet, night-blooming Madurai jasmine, and ethereal indoles.',
    descriptorLow: 'Subdued botanical presence, leaning mineral, dry, or leathery.',
    heritageMaterial: 'Kannauj Ruh Gulab & Madurai Mogra',
    heritageMaterialId: 'damask_rose',
    relatedFamilies: ['Floral Oriental', 'Soliflore', 'Powdery Floral'],
    scientificExplanation: 'Represents phenolic and ester compounds (geraniol, citronellol, linalool) creating petal radiance.',
    color: '#F472B6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    angle: 45
  },
  {
    key: 'sweetness',
    label: 'Sweetness / Gourmand',
    shortLabel: 'SWEET',
    descriptorHigh: 'Golden Madagascar vanilla pods, warm tonka bean coumarin, and honeyed resins.',
    descriptorLow: 'Dry, austere, sugar-free profile prioritizing woods and crisp botanicals.',
    heritageMaterial: 'Vanilla & Benzoin Resins',
    heritageMaterialId: 'saffron',
    relatedFamilies: ['Amber Vanilla', 'Gourmand', 'Sweet Oriental'],
    scientificExplanation: 'Measures high-density lactonic, vanillin, and ethyl maltol molecular resonance.',
    color: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    angle: 90
  },
  {
    key: 'warm_resinous_spices',
    label: 'Warm Resinous / Spices',
    shortLabel: 'SPICES',
    descriptorHigh: 'Kerala green cardamom, Kashmiri saffron, royal frankincense, and aged benzoin.',
    descriptorLow: 'Crisp, airy compositions that avoid dense culinary and balsamic friction.',
    heritageMaterial: 'Shamamat-ul-Amber & Saffron',
    heritageMaterialId: 'shamama',
    relatedFamilies: ['Spicy Oriental', 'Amber Woody', 'Balsamic Incense'],
    scientificExplanation: 'Tracks sesquiterpene and phenylpropanoid density providing radiating thermal sillage.',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    angle: 135
  },
  {
    key: 'woody',
    label: 'Woody Anchor',
    shortLabel: 'WOODY',
    descriptorHigh: 'Silky Mysore sandalwood heartwood, Himalayan cedar, and noble Assam agarwood.',
    descriptorLow: 'Lighter compositions sustained by musks and green stems rather than timber.',
    heritageMaterial: 'Mysore Sandalwood (Chandan)',
    heritageMaterialId: 'sandalwood',
    relatedFamilies: ['Woody Aromatic', 'Dry Woods', 'Oud Oriental'],
    scientificExplanation: 'Measures santalol, cedrol, and heavy terpene skeletons that provide architectural backbone.',
    color: '#A16207',
    glowColor: 'rgba(161, 98, 7, 0.4)',
    angle: 180
  },
  {
    key: 'earthy_clay',
    label: 'Earthy / Baked Clay',
    shortLabel: 'EARTH',
    descriptorHigh: 'Geosmin-saturated monsoon rain, baked riverbed terra-cotta, and roots of Ruh Khus.',
    descriptorLow: 'Pure polished clean compositions detached from damp soil or roots.',
    heritageMaterial: 'Kannauj Mitti Attar & Ruh Khus',
    heritageMaterialId: 'mitti',
    relatedFamilies: ['Mineral Clay', 'Earthy Chypre', 'Petrichor Attar'],
    scientificExplanation: 'Reflects geosmin, vetivone, and pyrazine soil chemistry evoking the smell of first monsoon rain.',
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    angle: 225
  },
  {
    key: 'intensity',
    label: 'Intensity & Projection',
    shortLabel: 'POWER',
    descriptorHigh: 'Expansive sillage, rich diffuse aura commanding physical room presence.',
    descriptorLow: 'Intimate skin-scent projection designed solely for close personal embrace.',
    heritageMaterial: 'Pure Hydro-Distilled Rooh',
    heritageMaterialId: 'shamama',
    relatedFamilies: ['Extrait de Parfum', 'Pure Attar', 'Beastmode'],
    scientificExplanation: 'Calculated from total dissolved olfactory concentrate and vapor phase dispersion speed.',
    color: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.4)',
    angle: 270
  },
  {
    key: 'longevity_fixative',
    label: 'Longevity / Fixative',
    shortLabel: 'FIXATIVE',
    descriptorHigh: 'Tenacious multi-hour endurance clinging to pulse points and textiles across 12+ hours.',
    descriptorLow: 'Ephemeral cologne splash style designed for conscious reapplication rituals.',
    heritageMaterial: 'Sandalwood Base Oil & Natural Oudh',
    heritageMaterialId: 'oudh',
    relatedFamilies: ['Attar', 'Parfum', 'Resinous Base'],
    scientificExplanation: 'Determined by molecular weight of macrocyclic fixatives and non-evaporating lipid bases.',
    color: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    angle: 315
  }
];

export const InteractiveScentConstellation: React.FC<InteractiveScentConstellationProps> = ({
  vector,
  ownedFragrances,
  allFragrances,
  onInspectInChamber,
  onExploreHeritage
}) => {
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<keyof OlfactoryVector8D>('woody');
  const [hoveredDimensionKey, setHoveredDimensionKey] = useState<keyof OlfactoryVector8D | null>(null);

  const activeKey = hoveredDimensionKey || selectedDimensionKey;
  const activeMeta = DIMENSIONS.find(d => d.key === activeKey) || DIMENSIONS[0];
  const activeValue = vector[activeKey] ?? 70;

  // Geometry calculations for SVG
  const size = 440;
  const center = size / 2;
  const maxRadius = 160;

  // Generate polygon points for the user's vector
  const polygonPoints = DIMENSIONS.map(dim => {
    const val = (vector[dim.key] ?? 50) / 100;
    const r = Math.max(25, val * maxRadius);
    const rad = (dim.angle - 90) * (Math.PI / 180);
    const x = center + r * Math.cos(rad);
    const y = center + r * Math.sin(rad);
    return `${x},${y}`;
  }).join(' ');

  // Filter owned fragrances that have high presence in this dimension
  const associatedOwned = (ownedFragrances.length > 0 ? ownedFragrances : allFragrances.slice(0, 3)).filter(f => {
    const text = [f.name, f.fragrance_family, ...(f.top_notes || []), ...(f.base_notes || [])].join(' ').toLowerCase();
    if (activeKey === 'freshness') return text.includes('bergamot') || text.includes('citrus') || text.includes('lemon') || (f.freshness || 0) >= 7;
    if (activeKey === 'floral') return text.includes('rose') || text.includes('jasmine') || text.includes('floral');
    if (activeKey === 'sweetness') return text.includes('vanilla') || text.includes('amber') || (f.sweetness || 0) >= 7;
    if (activeKey === 'warm_resinous_spices') return text.includes('cardamom') || text.includes('saffron') || text.includes('spice');
    if (activeKey === 'woody') return text.includes('sandalwood') || text.includes('cedar') || text.includes('wood') || text.includes('oud');
    if (activeKey === 'earthy_clay') return text.includes('mitti') || text.includes('vetiver') || text.includes('clay') || text.includes('earth');
    if (activeKey === 'intensity') return (f.intensity || 0) >= 7;
    return f.longevity?.includes('8') || f.longevity?.includes('12') || f.format === 'Attar';
  }).slice(0, 3);

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-[#FAF5F0]">
      {/* Background celestial glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full transition-all duration-700 pointer-events-none opacity-25 blur-3xl"
        style={{ backgroundColor: activeMeta.color }}
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3E3228] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter III • The Scent Signature</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Interactive 8D Scent Constellation
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            Touch or hover any orbital axis to illuminate your molecular coordinates,
            associated cabinet specimens, and ancient Indian heritage parallels.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1F1813] border border-[#3E3228] text-xs font-mono-lab text-[#D6C7B2]">
          <Atom className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Real Cosine 8-D Geometry</span>
        </div>
      </div>

      {/* Main Grid: SVG Constellation (Left) + Dimension Details Dossier (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Interactive Scent Constellation */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.6))' }}
            >
              {/* Concentric Guide Circles (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1.0].map((frac, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={frac * maxRadius}
                  fill="none"
                  stroke="#3E3228"
                  strokeWidth="1"
                  strokeDasharray={i === 3 ? 'none' : '3 4'}
                  opacity={i === 3 ? 0.8 : 0.4}
                />
              ))}

              {/* Radial Axis Spokes */}
              {DIMENSIONS.map((dim) => {
                const rad = (dim.angle - 90) * (Math.PI / 180);
                const x2 = center + maxRadius * Math.cos(rad);
                const y2 = center + maxRadius * Math.sin(rad);
                const isCurrent = dim.key === activeKey;

                return (
                  <g key={dim.key}>
                    <line
                      x1={center}
                      y1={center}
                      x2={x2}
                      y2={y2}
                      stroke={isCurrent ? dim.color : '#3E3228'}
                      strokeWidth={isCurrent ? 2 : 1}
                      opacity={isCurrent ? 0.9 : 0.4}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}

              {/* 8D Filled Polygonal Contour */}
              <polygon
                points={polygonPoints}
                fill={activeMeta.color}
                fillOpacity="0.22"
                stroke={activeMeta.color}
                strokeWidth="2.5"
                className="transition-all duration-500 ease-out"
                style={{
                  filter: `drop-shadow(0 0 12px ${activeMeta.glowColor})`
                }}
              />

              {/* Central Luminous Core */}
              <circle
                cx={center}
                cy={center}
                r="7"
                fill="#FAF5F0"
                stroke={activeMeta.color}
                strokeWidth="3"
                className="animate-pulse"
              />

              {/* 8 Interactive Nodes */}
              {DIMENSIONS.map((dim) => {
                const val = (vector[dim.key] ?? 50) / 100;
                const r = Math.max(25, val * maxRadius);
                const rad = (dim.angle - 90) * (Math.PI / 180);
                const x = center + r * Math.cos(rad);
                const y = center + r * Math.sin(rad);

                // Label Position outside max radius
                const labelR = maxRadius + 32;
                const lx = center + labelR * Math.cos(rad);
                const ly = center + labelR * Math.sin(rad);

                const isCurrent = dim.key === activeKey;

                return (
                  <g
                    key={dim.key}
                    className="cursor-pointer group"
                    onClick={() => setSelectedDimensionKey(dim.key)}
                    onMouseEnter={() => setHoveredDimensionKey(dim.key)}
                    onMouseLeave={() => setHoveredDimensionKey(null)}
                  >
                    {/* Pulsing ring for active node */}
                    {isCurrent && (
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill="none"
                        stroke={dim.color}
                        strokeWidth="1.5"
                        opacity="0.6"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer node glow */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isCurrent ? 9 : 6}
                      fill={dim.color}
                      stroke="#14100D"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />

                    {/* Dimension Tag on Outer Rim */}
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isCurrent ? '#FAF5F0' : '#8C7D70'}
                      fontSize={isCurrent ? '11' : '9'}
                      fontFamily="monospace"
                      fontWeight={isCurrent ? 'bold' : 'normal'}
                      className="transition-all duration-300 pointer-events-auto"
                    >
                      {dim.shortLabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dimension Selector Pills for Quick Touch/Click */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 max-w-md">
            {DIMENSIONS.map((dim) => {
              const isCurrent = dim.key === activeKey;
              return (
                <button
                  key={dim.key}
                  onClick={() => setSelectedDimensionKey(dim.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-lab uppercase transition-all ${
                    isCurrent
                      ? 'bg-[#2E2219] text-[#FEF3C7] border border-[#D97706] shadow-sm'
                      : 'bg-[#1C1612] text-[#8C7D70] hover:text-[#C8BAAB] border border-[#3E3228]'
                  }`}
                >
                  {dim.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimension Deep-Dive Dossier Plaque */}
        <div className="lg:col-span-5 bg-[#1A1512] rounded-2xl p-6 sm:p-7 border border-[#3E3228] space-y-6">
          <div className="flex items-center justify-between border-b border-[#3E3228] pb-4">
            <div>
              <span className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
                Dimension Analysis
              </span>
              <h3 className="font-serif text-2xl text-[#FAF5F0] font-medium flex items-center gap-2 mt-0.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: activeMeta.color }}
                />
                {activeMeta.label}
              </h3>
            </div>

            <div className="text-right">
              <div className="font-serif text-3xl font-semibold text-[#FAF5F0]">
                {activeValue}<span className="text-sm font-normal text-[#8C7D70]">/100</span>
              </div>
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                Calibrated Weight
              </div>
            </div>
          </div>

          {/* Interpretation / Descriptor */}
          <div className="space-y-2">
            <div className="text-xs font-mono-lab uppercase text-[#D97706]">
              {activeValue >= 60 ? 'Dominant Trait Interpretation' : 'Controlled Baseline Interpretation'}
            </div>
            <p className="text-sm text-[#E6DACB] leading-relaxed italic font-serif">
              "{activeValue >= 60 ? activeMeta.descriptorHigh : activeMeta.descriptorLow}"
            </p>
          </div>

          {/* Scientific Molecular Rationale */}
          <div className="p-3.5 rounded-xl bg-[#14100D] border border-[#3E3228] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono-lab uppercase text-[#A8988B]">
              <Info className="w-3 h-3 text-[#D97706]" />
              <span>Olfactory Science &amp; Volatility</span>
            </div>
            <p className="text-xs text-[#C8BAAB] leading-relaxed">
              {activeMeta.scientificExplanation}
            </p>
          </div>

          {/* Heritage Bridge Material */}
          <div className="p-3.5 rounded-xl bg-[#241A14] border border-[#443325] flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono-lab uppercase text-[#D97706]">
                Traditional Indian Heritage Parallel
              </div>
              <div className="font-serif text-sm text-[#FAF5F0] font-medium mt-0.5">
                {activeMeta.heritageMaterial}
              </div>
            </div>
            {onExploreHeritage && (
              <button
                onClick={() => onExploreHeritage(activeMeta.heritageMaterialId)}
                className="px-3 py-1.5 rounded-lg bg-[#3A291C] hover:bg-[#4E3725] text-xs font-mono-lab text-[#FEF3C7] border border-[#5A402D] transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Atlas Entry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Associated Fragrances from Wardrobe / Catalog */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs font-mono-lab">
              <span className="text-[#A8988B] uppercase">Resonating Flacons</span>
              <span className="text-[#8C7D70]">{associatedOwned.length} Identified</span>
            </div>

            {associatedOwned.length === 0 ? (
              <p className="text-xs text-[#8C7D70] italic">
                Add more flacons to your cabinet to reveal resonant alignments with this dimension.
              </p>
            ) : (
              <div className="space-y-2">
                {associatedOwned.map((frag) => (
                  <div
                    key={frag.id}
                    className="p-2.5 rounded-xl bg-[#14100D] border border-[#3E3228] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-medium text-[#FAF5F0]">{frag.name}</div>
                      <div className="text-[10px] text-[#8C7D70]">{frag.brand_name || frag.brand} &bull; {frag.fragrance_family}</div>
                    </div>
                    {onInspectInChamber && (
                      <button
                        onClick={() => onInspectInChamber(frag)}
                        className="px-2.5 py-1 rounded-lg bg-[#241B16] hover:bg-[#34261F] text-[10px] font-mono-lab text-[#D6C7B2] border border-[#3E3228] transition-colors"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
