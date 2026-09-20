import React, { useState, useMemo } from 'react';
import { Layers, ArrowRight, Eye, FlaskConical, Sliders, Sparkles } from 'lucide-react';
import { Fragrance } from '../../types.js';
import {
  extractFragranceVector8D,
  computeCosineSimilarity8D
} from '../../services/olfactoryIntelligence.js';

interface AcademyCabinetBridgeProps {
  wardrobeFragrances: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLaboratory?: (fragA: Fragrance, fragB: Fragrance) => void;
  onNavigateToCabinet?: () => void;
}

export const AcademyCabinetBridge: React.FC<AcademyCabinetBridgeProps> = ({
  wardrobeFragrances,
  onInspectInChamber,
  onSendToLaboratory,
  onNavigateToCabinet,
}) => {
  const [selectedAId, setSelectedAId] = useState<string>(
    wardrobeFragrances[0]?.id || ''
  );
  const [selectedBId, setSelectedBId] = useState<string>(
    wardrobeFragrances[1]?.id || wardrobeFragrances[0]?.id || ''
  );

  const fragA = useMemo(
    () => wardrobeFragrances.find((f) => f.id === selectedAId) || wardrobeFragrances[0],
    [wardrobeFragrances, selectedAId]
  );
  const fragB = useMemo(
    () => wardrobeFragrances.find((f) => f.id === selectedBId) || wardrobeFragrances[1] || wardrobeFragrances[0],
    [wardrobeFragrances, selectedBId]
  );

  const vecA = useMemo(() => extractFragranceVector8D(fragA), [fragA]);
  const vecB = useMemo(() => extractFragranceVector8D(fragB), [fragB]);
  const similarity = useMemo(
    () => (fragA && fragB ? computeCosineSimilarity8D(vecA, vecB) : 0),
    [fragA, fragB, vecA, vecB]
  );

  if (!wardrobeFragrances || wardrobeFragrances.length < 2) {
    return (
      <div className="p-8 rounded-3xl bg-[#14110E] border border-amber-900/40 text-center space-y-3">
        <Layers className="w-10 h-10 text-amber-400 mx-auto" />
        <h4 className="font-serif text-2xl text-[#F8F5EE] font-medium">
          Personal Cabinet Comparison Studio
        </h4>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Add at least two fine fragrances to your Private Cabinet to unlock personalized comparative vector diagnostics and layering compatibility curves.
        </p>
        {onNavigateToCabinet && (
          <button
            type="button"
            onClick={onNavigateToCabinet}
            className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-mono text-amber-300 transition cursor-pointer"
          >
            Explore &amp; Populate Cabinet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-8 text-stone-200 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Cabinet Kinship Study
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              {wardrobeFragrances.length} Cabinet Specimens Available
            </span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#F8F5EE] mt-0.5">
            Compare Your Own Fragrance Bottles
          </h3>
        </div>

        <span className="text-xs font-mono text-stone-400">
          Similarity Alignment: <strong className="text-amber-300">{(similarity * 100).toFixed(0)}%</strong>
        </span>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[11px] font-mono text-amber-400 uppercase">First Bottle</label>
          <select
            value={selectedAId}
            onChange={(e) => setSelectedAId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
          >
            {wardrobeFragrances.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.brand_name || f.brand})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-mono text-cyan-400 uppercase">Second Bottle</label>
          <select
            value={selectedBId}
            onChange={(e) => setSelectedBId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-cyan-400 focus:outline-hidden"
          >
            {wardrobeFragrances.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.brand_name || f.brand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Comparison Dossier */}
      <div className="p-5 rounded-2xl bg-[#14110E] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-mono text-amber-300 font-bold block">{fragA?.name}</span>
          <p className="text-stone-400">
            Family: <span className="text-stone-200">{fragA?.fragrance_family}</span>
          </p>
          <p className="text-stone-400">
            Top: <span className="text-stone-300">{fragA?.top_notes?.slice(0, 3).join(', ')}</span>
          </p>
          <p className="text-stone-400">
            Base: <span className="text-stone-300">{fragA?.base_notes?.slice(0, 3).join(', ')}</span>
          </p>
        </div>

        <div className="space-y-1">
          <span className="font-mono text-cyan-300 font-bold block">{fragB?.name}</span>
          <p className="text-stone-400">
            Family: <span className="text-stone-200">{fragB?.fragrance_family}</span>
          </p>
          <p className="text-stone-400">
            Top: <span className="text-stone-300">{fragB?.top_notes?.slice(0, 3).join(', ')}</span>
          </p>
          <p className="text-stone-400">
            Base: <span className="text-stone-300">{fragB?.base_notes?.slice(0, 3).join(', ')}</span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-[11px] font-mono text-stone-500">
          Source: Your private cabinet specimens.
        </div>
        <div className="flex items-center gap-2">
          {fragA && onInspectInChamber && (
            <button
              type="button"
              onClick={() => onInspectInChamber(fragA)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-stone-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Chamber Specimen A</span>
            </button>
          )}
          {fragA && fragB && onSendToLaboratory && (
            <button
              type="button"
              onClick={() => onSendToLaboratory(fragA, fragB)}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-mono text-amber-200 transition cursor-pointer flex items-center gap-1.5 font-semibold"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
              <span>Send Pair to Layering Lab</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
