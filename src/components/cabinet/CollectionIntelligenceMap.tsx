import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Layers, Info } from 'lucide-react';
import { Fragrance, OlfactoryVector8D } from '../../types.js';
import { extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface CollectionIntelligenceMapProps {
  ownedFragrances: Fragrance[];
  onSelectFragrance?: (fragrance: Fragrance) => void;
}

interface FamilyNode {
  key: string;
  label: string;
  angleDeg: number;
  color: string;
  glowColor: string;
  count: number;
  percentage: number;
  fragrances: Fragrance[];
  avgIntensity: number;
}

const FAMILIES_CONFIG = [
  { key: 'woody', label: 'Woody & Oud', angleDeg: -90, color: '#D97706', glowColor: 'rgba(217, 119, 6, 0.5)' },
  { key: 'floral', label: 'Floral Radiance', angleDeg: -45, color: '#F472B6', glowColor: 'rgba(244, 114, 182, 0.5)' },
  { key: 'sweet', label: 'Amber & Gourmand', angleDeg: 0, color: '#FB923C', glowColor: 'rgba(251, 146, 60, 0.5)' },
  { key: 'spicy', label: 'Warm Spices & Resins', angleDeg: 45, color: '#EF4444', glowColor: 'rgba(239, 68, 68, 0.5)' },
  { key: 'earthy', label: 'Mitti & Clay', angleDeg: 90, color: '#D95D39', glowColor: 'rgba(217, 93, 57, 0.5)' },
  { key: 'aquatic', label: 'Aquatic & Marine', angleDeg: 135, color: '#38BDF8', glowColor: 'rgba(56, 189, 248, 0.5)' },
  { key: 'fresh', label: 'Fresh Citrus', angleDeg: 180, color: '#34D399', glowColor: 'rgba(52, 211, 153, 0.5)' },
  { key: 'aromatic', label: 'Green & Aromatic', angleDeg: 225, color: '#A3E635', glowColor: 'rgba(163, 230, 53, 0.5)' },
];

export const CollectionIntelligenceMap: React.FC<CollectionIntelligenceMapProps> = ({
  ownedFragrances,
  onSelectFragrance
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedNode, setSelectedNode] = useState<FamilyNode | null>(null);

  // Derive distribution mathematically from collection
  const nodes: FamilyNode[] = useMemo(() => {
    const list = ownedFragrances || [];
    const total = list.length || 1;

    return FAMILIES_CONFIG.map(cfg => {
      const matched = list.filter(f => {
        const familyStr = (f.fragrance_family || '').toLowerCase();
        const desc = (f.description || '').toLowerCase();
        const notes = [...(f.top_notes || []), ...(f.middle_notes || []), ...(f.base_notes || [])].join(' ').toLowerCase();

        switch (cfg.key) {
          case 'woody':
            return familyStr.includes('wood') || familyStr.includes('oud') || notes.includes('sandalwood') || notes.includes('cedar');
          case 'floral':
            return familyStr.includes('floral') || familyStr.includes('rose') || notes.includes('jasmine') || notes.includes('rose');
          case 'sweet':
            return familyStr.includes('gourmand') || familyStr.includes('vanilla') || familyStr.includes('amber') || notes.includes('vanilla');
          case 'spicy':
            return familyStr.includes('spice') || familyStr.includes('oriental') || notes.includes('saffron') || notes.includes('cardamom');
          case 'earthy':
            return familyStr.includes('earth') || desc.includes('mitti') || desc.includes('petrichor') || notes.includes('vetiver');
          case 'aquatic':
            return familyStr.includes('aquatic') || familyStr.includes('marine') || desc.includes('ocean');
          case 'fresh':
            return familyStr.includes('fresh') || familyStr.includes('citrus') || notes.includes('bergamot') || notes.includes('lemon');
          case 'aromatic':
            return familyStr.includes('aromatic') || familyStr.includes('green') || notes.includes('lavender') || notes.includes('mint');
          default:
            return false;
        }
      });

      const count = matched.length;
      const percentage = Math.round((count / total) * 100);

      // Average 8D intensity for this cluster
      let totalIntensity = 0;
      matched.forEach(f => {
        const vec = extractFragranceVector8D(f);
        totalIntensity += vec.intensity;
      });
      const avgIntensity = count > 0 ? Math.round(totalIntensity / count) : 40;

      return {
        ...cfg,
        count,
        percentage,
        fragrances: matched,
        avgIntensity
      };
    });
  }, [ownedFragrances]);

  // Center radius calculations
  const cx = 160;
  const cy = 160;
  const orbitRadius = 105;

  return (
    <div className="rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#14100D] via-[#0E0C0A] to-[#0A0806] p-5 sm:p-8 shadow-2xl relative overflow-hidden text-stone-100">
      {/* Background ambient lighting */}
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(217,119,6,0.12),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Collection Constellation Map</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
            Your Olfactory Constellation
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Radial harmonic map representing the distribution of scent coordinates across your wardrobe.
          </p>
        </div>

        <div className="text-xs font-mono text-stone-400 self-start sm:self-auto px-3 py-1 rounded-xl bg-stone-900 border border-stone-800">
          Total Flacons: <span className="text-amber-300 font-semibold">{ownedFragrances.length}</span>
        </div>
      </div>

      {/* Main Celestial Constellation Canvas + Details Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Constellation Orbit (Lg: cols 7) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <svg
            viewBox="0 0 320 320"
            className="w-full max-w-[340px] sm:max-w-[400px] aspect-square overflow-visible"
            aria-label="Olfactory collection radial celestial chart"
          >
            {/* Celestial Concentric Orbital Rings */}
            <circle cx={cx} cy={cy} r={orbitRadius * 0.35} fill="none" stroke="#2D241C" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={cx} cy={cy} r={orbitRadius * 0.70} fill="none" stroke="#3D3025" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={orbitRadius} fill="none" stroke="#524032" strokeWidth="1" strokeDasharray="2 4" />

            {/* Radiant Axis Rays */}
            {nodes.map((node) => {
              const rad = (node.angleDeg * Math.PI) / 180;
              const x2 = cx + Math.cos(rad) * (orbitRadius + 14);
              const y2 = cy + Math.sin(rad) * (orbitRadius + 14);
              return (
                <line
                  key={`ray-${node.key}`}
                  x1={cx}
                  y1={cy}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(217, 119, 6, 0.15)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Inter-Node Harmonic Chords (Lines connecting nodes with active flacons) */}
            {nodes.map((nodeA, i) => {
              if (nodeA.count === 0) return null;
              return nodes.slice(i + 1).map((nodeB) => {
                if (nodeB.count === 0) return null;
                const radA = (nodeA.angleDeg * Math.PI) / 180;
                const radB = (nodeB.angleDeg * Math.PI) / 180;
                const rA = orbitRadius * (0.4 + (nodeA.percentage / 100) * 0.6);
                const rB = orbitRadius * (0.4 + (nodeB.percentage / 100) * 0.6);
                const xA = cx + Math.cos(radA) * rA;
                const yA = cy + Math.sin(radA) * rA;
                const xB = cx + Math.cos(radB) * rB;
                const yB = cy + Math.sin(radB) * rB;

                return (
                  <line
                    key={`chord-${nodeA.key}-${nodeB.key}`}
                    x1={xA}
                    y1={yA}
                    x2={xB}
                    y2={yB}
                    stroke="rgba(212, 175, 55, 0.22)"
                    strokeWidth="1"
                  />
                );
              });
            })}

            {/* Central Vault Anchor Star */}
            <circle cx={cx} cy={cy} r="18" fill="#1C1510" stroke="#D4AF37" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="6" fill="#F59E0B" />

            {/* Family Nodes (Stars) */}
            {nodes.map((node) => {
              const rad = (node.angleDeg * Math.PI) / 180;
              // Node distance scales with count/percentage
              const dynamicDist = node.count > 0 ? orbitRadius * (0.45 + (node.percentage / 100) * 0.55) : orbitRadius;
              const x = cx + Math.cos(rad) * dynamicDist;
              const y = cy + Math.sin(rad) * dynamicDist;
              const isSelected = selectedNode?.key === node.key;
              const nodeSize = node.count > 0 ? Math.min(16, 8 + node.count * 2.5) : 5;

              return (
                <g
                  key={`node-${node.key}`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {/* Outer Glow Halo if populated */}
                  {node.count > 0 && (
                    <circle
                      cx={x}
                      cy={y}
                      r={nodeSize * 2}
                      fill={node.glowColor}
                      opacity={isSelected ? 0.9 : 0.4}
                    />
                  )}

                  {/* Core Star Body */}
                  <circle
                    cx={x}
                    cy={y}
                    r={nodeSize}
                    fill={node.count > 0 ? node.color : '#2E251E'}
                    stroke={isSelected ? '#FFFFFF' : '#14100D'}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />

                  {/* Node Label */}
                  <text
                    x={cx + Math.cos(rad) * (orbitRadius + 28)}
                    y={cy + Math.sin(rad) * (orbitRadius + 28) + 4}
                    textAnchor="middle"
                    fill={node.count > 0 ? '#E7DFD5' : '#736657'}
                    fontSize="9.5"
                    fontFamily="sans-serif"
                    fontWeight={node.count > 0 ? '600' : '400'}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <span className="text-[11px] font-mono text-stone-400 mt-2">
            Click any stellar accord to inspect populated flacons.
          </span>
        </div>

        {/* Constellation Breakdown & Selected Node Details (Lg: cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-5 rounded-2xl bg-stone-900/80 border border-amber-500/30 space-y-3 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    />
                    <h4 className="font-serif text-lg font-medium text-stone-100">
                      {selectedNode.label}
                    </h4>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-stone-800 text-amber-300">
                    {selectedNode.count} {selectedNode.count === 1 ? 'flacon' : 'flacons'} ({selectedNode.percentage}%)
                  </span>
                </div>

                <p className="text-xs text-stone-300">
                  {selectedNode.count > 0
                    ? `This olfactory domain represents ${selectedNode.percentage}% of your current wardrobe holding.`
                    : 'This olfactory domain is currently empty in your personal cabinet.'}
                </p>

                {/* Fragrance List in this Node */}
                {selectedNode.fragrances.length > 0 ? (
                  <div className="space-y-1.5 pt-2 border-t border-stone-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                      Flacons in this accord:
                    </span>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                      {selectedNode.fragrances.map(f => (
                        <div
                          key={f.id}
                          onClick={() => onSelectFragrance && onSelectFragrance(f)}
                          className="flex items-center justify-between p-2 rounded-xl bg-stone-950/60 hover:bg-stone-800/80 border border-stone-800 text-xs transition cursor-pointer"
                        >
                          <span className="font-medium text-stone-200">{f.name}</span>
                          <span className="text-[10px] font-mono text-amber-400">{f.brand}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/80 flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Consider exploring this accord to diversify your signature.</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800/60 space-y-3">
                <h4 className="font-serif text-lg font-medium text-stone-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Constellation Overview</span>
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Your fragrance archive forms an interconnected network of accords. Accords with higher volume anchor your collection, while empty nodes reveal exciting frontier paths for your sensory journey.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2">
                  {nodes.slice(0, 4).map(n => (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => setSelectedNode(n)}
                      className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-left hover:border-amber-500/40 transition cursor-pointer"
                    >
                      <span className="text-[10px] font-mono text-stone-400 block truncate">{n.label}</span>
                      <span className="font-serif text-sm font-medium text-amber-300">{n.count} flacons</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
