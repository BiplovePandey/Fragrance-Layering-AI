import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Binary, ChevronDown, Activity, Info } from 'lucide-react';
import { OlfactoryVector8D } from '../../types.js';
import { ChamberAtmospherePalette } from './ChamberAtmosphere.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { getDimensionGlyph } from '../ui/AtelierGlyphs.js';

interface ScentSignatureVisualizerProps {
  vector8D: OlfactoryVector8D;
  palette: ChamberAtmospherePalette;
  fragranceName: string;
}

interface DimensionConfig {
  key: keyof OlfactoryVector8D;
  label: string;
  shortLabel: string;
  angleDeg: number;
  color: string;
  glowColor: string;
  description: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'freshness',
    label: 'Freshness',
    shortLabel: 'Fresh',
    angleDeg: -90, // 12 o'clock
    color: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    description: 'High-volatility citrus terpenes, aldehydes, and sparkling ozone accords.'
  },
  {
    key: 'floral',
    label: 'Floral Radiance',
    shortLabel: 'Floral',
    angleDeg: -45, // 1:30
    color: '#F472B6',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    description: 'Lush Damask petals, jasmine sambac, neroli, and white floral indoles.'
  },
  {
    key: 'sweetness',
    label: 'Sweetness',
    shortLabel: 'Sweet',
    angleDeg: 0, // 3 o'clock
    color: '#FB7185',
    glowColor: 'rgba(251, 113, 133, 0.4)',
    description: 'Balsamic gourmand lactones, golden honey, and rich vanilla pods.'
  },
  {
    key: 'warm_resinous_spices',
    label: 'Warm Resins & Spices',
    shortLabel: 'Resins / Spice',
    angleDeg: 45, // 4:30
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description: 'Frankincense, benzoin, cardamom, saffron, and clove bud warmth.'
  },
  {
    key: 'intensity',
    label: 'Projection & Intensity',
    shortLabel: 'Intensity',
    angleDeg: 90, // 6 o'clock
    color: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    description: 'Vapor pressure force and ambient diffusion radius off warm skin.'
  },
  {
    key: 'earthy_clay',
    label: 'Earthy Clay (Mitti)',
    shortLabel: 'Clay / Mitti',
    angleDeg: 135, // 7:30
    color: '#EA580C',
    glowColor: 'rgba(234, 88, 12, 0.4)',
    description: 'Alluvial geosmin, petrichor, terra cotta, and wet rain-quenched soil.'
  },
  {
    key: 'woody',
    label: 'Woody Depth',
    shortLabel: 'Woody',
    angleDeg: 180, // 9 o'clock
    color: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    description: 'Mysore sandalwood, cedarwood, aged agarwood oud, and dry patchouli.'
  },
  {
    key: 'longevity_fixative',
    label: 'Fixative Retention',
    shortLabel: 'Fixative',
    angleDeg: 225, // 10:30
    color: '#2DD4BF',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    description: 'Macrocyclic musks, ambroxan, and heavy fixatives binding to skin lipid.'
  }
];

export const ScentSignatureVisualizer: React.FC<ScentSignatureVisualizerProps> = ({
  vector8D,
  palette,
  fragranceName
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [activeDimension, setActiveDimension] = useState<DimensionConfig | null>(null);
  const [showDataSheet, setShowDataSheet] = useState(false);

  // SVG Geometry Dimensions
  const size = 320;
  const center = size / 2;
  const maxRadius = 118;
  const minRadius = 18;

  // Calculate polygon points from 8D values (0 to 100)
  const points = DIMENSIONS.map((dim) => {
    const rawVal = Math.max(8, Math.min(100, vector8D[dim.key] ?? 50));
    const r = minRadius + (rawVal / 100) * (maxRadius - minRadius);
    const rad = (dim.angleDeg * Math.PI) / 180;
    const x = center + r * Math.cos(rad);
    const y = center + r * Math.sin(rad);
    return { x, y, r, rawVal, dim };
  });

  const polygonPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className="rounded-3xl bg-[#14100D]/90 border border-white/10 p-5 sm:p-7 relative overflow-hidden backdrop-blur-xl shadow-xl">
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none -z-10"
        style={{ background: palette.pedestalGlow }}
      />

      {/* Header with Artistic Title */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>8-Dimensional Olfactory Fingerprint</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-medium mt-0.5">
            Scent Signature
          </h4>
        </div>

        <button
          type="button"
          onClick={() => setShowDataSheet((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-stone-300 transition cursor-pointer"
        >
          <Binary className="w-3 h-3 text-amber-400" />
          <span>{showDataSheet ? 'Interactive Map' : 'Exact Vector'}</span>
        </button>
      </div>

      {/* Main Visualizer Area */}
      <AnimatePresence mode="wait">
        {!showDataSheet ? (
          <motion.div
            key="signature-map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* SVG RADIAL SIGNATURE CANVAS */}
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Radial Fill Gradient */}
                  <radialGradient id="scentSignatureGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={palette.brassAccent} stopOpacity="0.45" />
                    <stop offset="60%" stopColor={palette.pedestalGlow} stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
                  </radialGradient>

                  {/* Core Glow Filter */}
                  <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Concentric Guide Orbit Rings - Precision Perfumer's Brass */}
                <circle
                  cx={center}
                  cy={center}
                  r={maxRadius + 6}
                  fill="none"
                  stroke="#C59A3F"
                  strokeWidth="0.75"
                  strokeOpacity="0.4"
                />
                {[0.25, 0.5, 0.75, 1.0].map((step, idx) => (
                  <circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={minRadius + step * (maxRadius - minRadius)}
                    fill="none"
                    stroke={idx === 3 ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.08)'}
                    strokeDasharray={idx === 3 ? 'none' : '2 4'}
                    strokeWidth={idx === 3 ? '1' : '0.75'}
                  />
                ))}

                {/* Fine Calibrated Degree Ticks on Outer Bezel */}
                {Array.from({ length: 32 }).map((_, i) => {
                  const angle = (i * 360) / 32;
                  const isMajor = i % 4 === 0;
                  const r1 = maxRadius + 3;
                  const r2 = isMajor ? maxRadius + 8 : maxRadius + 5.5;
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line
                      key={`tick-${i}`}
                      x1={center + r1 * Math.cos(rad)}
                      y1={center + r1 * Math.sin(rad)}
                      x2={center + r2 * Math.cos(rad)}
                      y2={center + r2 * Math.sin(rad)}
                      stroke="#C59A3F"
                      strokeWidth={isMajor ? '0.9' : '0.5'}
                      strokeOpacity={isMajor ? '0.6' : '0.25'}
                    />
                  );
                })}

                {/* 8 Champagne Radial Axis Rays */}
                {DIMENSIONS.map((dim) => {
                  const rad = (dim.angleDeg * Math.PI) / 180;
                  const x2 = center + maxRadius * Math.cos(rad);
                  const y2 = center + maxRadius * Math.sin(rad);
                  return (
                    <line
                      key={dim.key}
                      x1={center}
                      y1={center}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(245, 222, 179, 0.22)"
                      strokeWidth="0.75"
                    />
                  );
                })}

                {/* THE 8D OLFACTORY SIGNATURE POLYGON */}
                <motion.path
                  d={polygonPath}
                  fill="url(#scentSignatureGradient)"
                  stroke={palette.brassAccent}
                  strokeWidth="2"
                  filter="url(#coreGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* CENTRAL GLOWING SCENT CORE */}
                <circle
                  cx={center}
                  cy={center}
                  r="10"
                  fill="#FFFBEB"
                  stroke={palette.brassAccent}
                  strokeWidth="2.5"
                  className="animate-pulse"
                />
                <circle
                  cx={center}
                  cy={center}
                  r="18"
                  fill="none"
                  stroke={palette.brassAccent}
                  strokeWidth="1"
                  opacity="0.5"
                />

                {/* INTERACTIVE NODAL POINTS */}
                {points.map(({ x, y, rawVal, dim }) => {
                  const isSelected = activeDimension?.key === dim.key;
                  return (
                    <g
                      key={dim.key}
                      className="cursor-pointer"
                      onClick={() => setActiveDimension(dim)}
                      onMouseEnter={() => setActiveDimension(dim)}
                    >
                      {/* Outer touch target ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? '12' : '7'}
                        fill={dim.color}
                        opacity={isSelected ? 0.9 : 0.75}
                        filter="url(#coreGlow)"
                        className="transition-all duration-200"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#FFFFFF"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Surrounding Axis Labels & Botanical Glyphs */}
              {DIMENSIONS.map((dim) => {
                const rad = (dim.angleDeg * Math.PI) / 180;
                // Place labels slightly outside max radius with comfortable clearance
                const labelRadius = maxRadius + 28;
                const lx = center + labelRadius * Math.cos(rad);
                const ly = center + labelRadius * Math.sin(rad);
                const isSelected = activeDimension?.key === dim.key;
                const BotanicalGlyph = getDimensionGlyph(dim.key);

                return (
                  <button
                    key={dim.key}
                    type="button"
                    onClick={() => setActiveDimension(dim)}
                    onMouseEnter={() => setActiveDimension(dim)}
                    className={`absolute flex items-center gap-1 text-[9px] font-mono tracking-wider transition-all transform -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'text-amber-200 font-bold scale-110 bg-amber-950/60 border border-amber-500/40 shadow-[0_0_8px_rgba(217,119,6,0.3)]'
                        : 'text-stone-400 hover:text-stone-200 bg-black/20 hover:bg-black/40'
                    }`}
                    style={{
                      left: `${(lx / size) * 100}%`,
                      top: `${(ly / size) * 100}%`
                    }}
                  >
                    <BotanicalGlyph
                      size={11}
                      strokeWidth={1.3}
                      className={isSelected ? 'text-amber-400' : 'text-stone-400'}
                    />
                    <span>{dim.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Dimension Popover Card */}
            <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span
                  className="w-3 h-3 rounded-full mt-0.5 shrink-0"
                  style={{
                    backgroundColor: activeDimension ? activeDimension.color : palette.brassAccent
                  }}
                />
                <div>
                  <div className="font-medium text-stone-200 flex items-center gap-2">
                    <span>{activeDimension ? activeDimension.label : 'Tap any point to inspect'}</span>
                    {activeDimension && (
                      <span className="font-mono text-amber-300 font-bold text-xs">
                        {vector8D[activeDimension.key] ?? 50}%
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                    {activeDimension
                      ? activeDimension.description
                      : 'The radiant shape maps this flacon’s botanical geometry across 8 molecular axes.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* LEVEL 5 EXACT NUMERICAL MATRIX */
          <motion.div
            key="signature-data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2.5 py-1"
          >
            <div className="text-[10px] font-mono text-stone-400 flex justify-between border-b border-white/10 pb-1.5">
              <span>AXIS DIMENSION</span>
              <span>MOLECULAR FORCE (0-100%)</span>
            </div>

            {DIMENSIONS.map((dim) => {
              const val = vector8D[dim.key] ?? 50;
              return (
                <div key={dim.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dim.color }} />
                      {dim.label}
                    </span>
                    <span className="font-mono font-bold text-amber-300">{val}%</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dim.color }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 pl-3.5 leading-tight">{dim.description}</p>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
