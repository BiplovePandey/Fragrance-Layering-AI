import React from 'react';
import { Sparkles, Layers, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { Fragrance } from '../../types.js';

interface NoteHarmonicsMatrixProps {
  fragA: Fragrance;
  fragB: Fragrance;
}

export const NoteHarmonicsMatrix: React.FC<NoteHarmonicsMatrixProps> = ({
  fragA,
  fragB
}) => {
  const notesA = [...(fragA.top_notes || []), ...(fragA.middle_notes || []), ...(fragA.base_notes || [])];
  const notesB = [...(fragB.top_notes || []), ...(fragB.middle_notes || []), ...(fragB.base_notes || [])];

  // Find shared notes (case-insensitive substring match)
  const sharedNotes: string[] = [];
  notesA.forEach((nA) => {
    const match = notesB.find((nB) => nA.toLowerCase() === nB.toLowerCase() || nB.toLowerCase().includes(nA.toLowerCase()) || nA.toLowerCase().includes(nB.toLowerCase()));
    if (match && !sharedNotes.includes(match)) {
      sharedNotes.push(match);
    }
  });

  // Top notes of A lifting Base notes of B (or vice versa)
  const topA = fragA.top_notes || [];
  const baseB = fragB.base_notes || [];
  const topB = fragB.top_notes || [];
  const baseA = fragA.base_notes || [];

  // Derive scent character tags based strictly on available notes and families
  const characterTags: string[] = [];
  const allNotes = [...notesA, ...notesB].join(' ').toLowerCase();
  const allFam = `${fragA.fragrance_family} ${fragB.fragrance_family}`.toLowerCase();

  if (allFam.includes('wood') || allNotes.includes('sandalwood') || allNotes.includes('cedar') || allNotes.includes('vetiver')) {
    characterTags.push('Woody Depth');
  }
  if (allFam.includes('amber') || allFam.includes('resin') || allNotes.includes('amber') || allNotes.includes('myrrh') || allNotes.includes('benzoin')) {
    characterTags.push('Resinous Warmth');
  }
  if (allFam.includes('citrus') || allFam.includes('fresh') || allNotes.includes('bergamot') || allNotes.includes('lemon') || allNotes.includes('lime')) {
    characterTags.push('Solar Effervescence');
  }
  if (allFam.includes('earth') || allNotes.includes('mitti') || allNotes.includes('petrichor') || allNotes.includes('geosmin')) {
    characterTags.push('Alluvial Petrichor');
  }
  if (allFam.includes('floral') || allNotes.includes('rose') || allNotes.includes('jasmine') || allNotes.includes('neroli')) {
    characterTags.push('Floral Radiance');
  }
  if (allFam.includes('spic') || allNotes.includes('cardamom') || allNotes.includes('saffron') || allNotes.includes('pepper') || allNotes.includes('cinnamon')) {
    characterTags.push('Aromatic Spice');
  }

  if (characterTags.length === 0) {
    characterTags.push('Harmonic Scent Profile', 'Complex Sillage');
  }

  return (
    <div className="p-6 rounded-3xl bg-[#14100C]/90 border border-stone-800 backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif text-lg font-medium text-stone-100">
            Botanical Note Harmonics &amp; Bridges
          </h3>
        </div>
        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
          Taxonomic Accord Bridge
        </span>
      </div>

      {/* Scent Character Badges */}
      <div>
        <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block mb-2 font-semibold">
          Resulting Chord Scent Character
        </span>
        <div className="flex flex-wrap gap-2">
          {characterTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-700/10 border border-amber-500/30 text-amber-200 text-xs font-mono font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Shared Notes (Bridging Atoms) */}
      <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
        <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider block font-semibold">
          Shared Botanical Anchors (Natural Resonance)
        </span>
        {sharedNotes.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {sharedNotes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{note}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 font-sans">
            No direct note overlaps detected. The chord functions purely through complementary volatility contrast rather than note reinforcement.
          </p>
        )}
      </div>

      {/* Volatile Lift & Anchor Counterbalance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Stream 1 */}
        <div className="p-3.5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1.5">
          <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
            Volatile Lift &rarr; Base Anchor
          </div>
          <div className="text-stone-300 font-medium flex items-center gap-2">
            <span className="text-amber-300">{topA[0] || 'Top Accord'} ({fragA.name.slice(0, 10)})</span>
            <ArrowRight className="w-3 h-3 text-stone-500 shrink-0" />
            <span className="text-amber-200">{baseB[0] || 'Fixative Base'} ({fragB.name.slice(0, 10)})</span>
          </div>
          <p className="text-[11px] text-stone-400 font-sans">
            Fast evaporating top molecules diffuse off the skin while anchored by deep resins.
          </p>
        </div>

        {/* Stream 2 */}
        <div className="p-3.5 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1.5">
          <div className="text-[10px] font-mono text-rose-400 uppercase font-semibold">
            Complementary Diffusion
          </div>
          <div className="text-stone-300 font-medium flex items-center gap-2">
            <span className="text-rose-300">{topB[0] || 'Heart Accord'} ({fragB.name.slice(0, 10)})</span>
            <ArrowRight className="w-3 h-3 text-stone-500 shrink-0" />
            <span className="text-rose-200">{baseA[0] || 'Core Fixative'} ({fragA.name.slice(0, 10)})</span>
          </div>
          <p className="text-[11px] text-stone-400 font-sans">
            Creates multi-layered sillage waves throughout the transition period.
          </p>
        </div>
      </div>
    </div>
  );
};
