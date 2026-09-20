import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Sparkles, Layers } from 'lucide-react';
import { Fragrance, OlfactoryVector8D } from '../../types.js';
import { extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import { getDimensionGlyph } from '../ui/AtelierGlyphs.js';

interface Vector8DChordVisualizerProps {
  fragA: Fragrance;
  fragB: Fragrance;
  spraysA: number;
  spraysB: number;
}

const AXIS_CONFIG: { key: keyof OlfactoryVector8D; label: string; desc: string }[] = [
  { key: 'freshness', label: 'Freshness', desc: 'Citrus, aromatic, aldehydes' },
  { key: 'sweetness', label: 'Sweetness', desc: 'Gourmand, vanilla, honey' },
  { key: 'intensity', label: 'Intensity & Sillage', desc: 'Diffusive projection' },
  { key: 'woody', label: 'Woody Depth', desc: 'Cedar, vetiver, patchouli' },
  { key: 'floral', label: 'Floral Radiance', desc: 'Jasmine, rose, neroli' },
  { key: 'warm_resinous_spices', label: 'Warmth & Spices', desc: 'Amber, cardamom, saffron' },
  { key: 'earthy_clay', label: 'Earthy Clay / Mitti', desc: 'Petrichor, damp soil' },
  { key: 'longevity_fixative', label: 'Fixative Anchor', desc: 'Musk, oud, sandalwood' }
];

export const Vector8DChordVisualizer: React.FC<Vector8DChordVisualizerProps> = ({
  fragA,
  fragB,
  spraysA,
  spraysB
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'bars'>('radar');

  const vecA = extractFragranceVector8D(fragA);
  const vecB = extractFragranceVector8D(fragB);

  // Compute combined chord vector based on spray weighting
  const totalSprays = spraysA + spraysB;
  const chordVector: OlfactoryVector8D = {
    freshness: Math.round((vecA.freshness * spraysA + vecB.freshness * spraysB) / totalSprays),
    sweetness: Math.round((vecA.sweetness * spraysA + vecB.sweetness * spraysB) / totalSprays),
    intensity: Math.round((vecA.intensity * spraysA + vecB.intensity * spraysB) / totalSprays),
    woody: Math.round((vecA.woody * spraysA + vecB.woody * spraysB) / totalSprays),
    floral: Math.round((vecA.floral * spraysA + vecB.floral * spraysB) / totalSprays),
    warm_resinous_spices: Math.round((vecA.warm_resinous_spices * spraysA + vecB.warm_resinous_spices * spraysB) / totalSprays),
    earthy_clay: Math.round((vecA.earthy_clay * spraysA + vecB.earthy_clay * spraysB) / totalSprays),
    longevity_fixative: Math.round((vecA.longevity_fixative * spraysA + vecB.longevity_fixative * spraysB) / totalSprays)
  };

  // Radar chart geometry for 8 axes
  const size = 260;
  const center = size / 2;
  const maxR = 95;

  const getCoordinates = (vector: OlfactoryVector8D) => {
    return AXIS_CONFIG.map((axis, i) => {
      const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
      const value = vector[axis.key] || 20;
      const r = (value / 100) * maxR;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    });
  };

  const pointsA = getCoordinates(vecA).map(p => `${p.x},${p.y}`).join(' ');
  const pointsB = getCoordinates(vecB).map(p => `${p.x},${p.y}`).join(' ');
  const pointsChord = getCoordinates(chordVector).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div
      role="region"
      aria-label={`8-Dimensional Scent Vector Synthesis for chord between ${fragA.name} and ${fragB.name}`}
      className="p-6 sm:p-7 rounded-3xl bg-[#14100C]/90 border border-stone-800 backdrop-blur-xl flex flex-col justify-between"
    >
      {/* Screen-reader accessible data summary */}
      <div className="sr-only">
        <h4>8-Dimensional Accord Synthesis Data</h4>
        <table>
          <thead>
            <tr>
              <th>Axis</th>
              <th>{fragA.name}</th>
              <th>{fragB.name}</th>
              <th>Synthesized Chord</th>
            </tr>
          </thead>
          <tbody>
            {AXIS_CONFIG.map((axis) => (
              <tr key={axis.key}>
                <td>{axis.label}</td>
                <td>{vecA[axis.key] || 20}%</td>
                <td>{vecB[axis.key] || 20}%</td>
                <td>{chordVector[axis.key] || 20}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>8-Dimensional Scent Vector Synthesis</span>
          </span>
          <h3 className="font-serif text-xl font-medium text-stone-100 mt-1">
            Olfactory Chord Fingerprint
          </h3>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('radar')}
            aria-pressed={viewMode === 'radar'}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
              viewMode === 'radar' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Geometry
          </button>
          <button
            type="button"
            onClick={() => setViewMode('bars')}
            aria-pressed={viewMode === 'bars'}
            className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${
              viewMode === 'bars' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Matrix
          </button>
        </div>
      </div>

      {/* Main Vector Display */}
      {viewMode === 'radar' ? (
        <div className="my-4 flex flex-col items-center justify-center">
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
              {/* Outer Brass Calibration Ring & Degree Ticks */}
              <circle
                cx={center}
                cy={center}
                r={maxR + 10}
                fill="none"
                stroke="#C59A3F"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const isOctant = i % 3 === 0;
                const r1 = maxR + 8;
                const r2 = isOctant ? maxR + 13 : maxR + 10.5;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={`chord-tick-${i}`}
                    x1={center + r1 * Math.cos(rad)}
                    y1={center + r1 * Math.sin(rad)}
                    x2={center + r2 * Math.cos(rad)}
                    y2={center + r2 * Math.sin(rad)}
                    stroke="#D4AF37"
                    strokeWidth={isOctant ? '1' : '0.5'}
                    strokeOpacity={isOctant ? '0.6' : '0.3'}
                  />
                );
              })}

              {/* Concentric 8-sided reference rings */}
              {[0.25, 0.5, 0.75, 1.0].map((lvl) => (
                <polygon
                  key={lvl}
                  points={AXIS_CONFIG.map((_, i) => {
                    const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
                    const r = maxR * lvl;
                    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                  }).join(' ')}
                  fill="none"
                  stroke={lvl === 1.0 ? '#C59A3F' : '#3E342B'}
                  strokeOpacity={lvl === 1.0 ? 0.45 : 0.7}
                  strokeWidth="1"
                  strokeDasharray={lvl === 1.0 ? 'none' : '3 3'}
                />
              ))}

              {/* 8 Champagne Axis Rays */}
              {AXIS_CONFIG.map((axis, i) => {
                const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
                return (
                  <line
                    key={axis.key}
                    x1={center}
                    y1={center}
                    x2={center + maxR * Math.cos(angle)}
                    y2={center + maxR * Math.sin(angle)}
                    stroke="rgba(245, 222, 179, 0.2)"
                    strokeWidth="0.75"
                  />
                );
              })}

              {/* Polygon A (Amber/Gold outline) */}
              <polygon
                points={pointsA}
                fill="rgba(245, 158, 11, 0.08)"
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity={0.7}
              />

              {/* Polygon B (Rose outline) */}
              <polygon
                points={pointsB}
                fill="rgba(244, 63, 94, 0.08)"
                stroke="#F43F5E"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                opacity={0.7}
              />

              {/* Polygon Chord (Solid Glowing Core) */}
              <polygon
                points={pointsChord}
                fill="rgba(212, 175, 55, 0.28)"
                stroke="#D4AF37"
                strokeWidth="2.5"
              />
            </svg>

            {/* Botanical Glyphs and Labels along perimeter */}
            {AXIS_CONFIG.map((axis, i) => {
              const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
              const labelR = maxR + 26;
              const lx = center + labelR * Math.cos(angle);
              const ly = center + labelR * Math.sin(angle);
              const BotanicalGlyph = getDimensionGlyph(axis.key);

              return (
                <div
                  key={axis.key}
                  className="absolute flex items-center gap-1 text-[8.5px] font-mono tracking-wider text-stone-300 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 px-1 py-0.5 rounded-full border border-stone-800"
                  style={{
                    left: `${(lx / size) * 100}%`,
                    top: `${(ly / size) * 100}%`
                  }}
                >
                  <BotanicalGlyph size={10} strokeWidth={1.3} className="text-amber-400" />
                  <span className="hidden sm:inline">{axis.label.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs font-mono mt-2">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full border border-amber-400 border-dashed" />
              {fragA.name.slice(0, 14)}
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full border border-rose-400 border-dashed" />
              {fragB.name.slice(0, 14)}
            </span>
            <span className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              Synthesized Chord
            </span>
          </div>
        </div>
      ) : (
        /* Matrix Bars View */
        <div className="my-4 space-y-2.5">
          {AXIS_CONFIG.map((axis) => {
            const valA = vecA[axis.key] || 20;
            const valB = vecB[axis.key] || 20;
            const valChord = chordVector[axis.key] || 20;

            return (
              <div key={axis.key} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-stone-300 font-sans">{axis.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400/70">{valA}%</span>
                    <span className="text-stone-600">+</span>
                    <span className="text-rose-400/70">{valB}%</span>
                    <span className="text-stone-600">=</span>
                    <span className="text-[#D4AF37] font-bold">{valChord}%</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                    style={{ width: `${valChord}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scientific honesty footnote */}
      <div className="pt-3 border-t border-stone-800/80 text-[10px] font-mono text-stone-500 text-center">
        8-D Vector Simulation &bull; Mathematical accord convergence model based on note taxonomy and volatility indices.
      </div>
    </div>
  );
};
