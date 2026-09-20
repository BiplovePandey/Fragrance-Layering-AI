import React, { useState, useMemo } from 'react';
import {
  Atom,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  HelpCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { Fragrance, OlfactoryVector8D } from '../../types.js';
import {
  extractFragranceVector8D,
  computeCosineSimilarity8D
} from '../../services/olfactoryIntelligence.js';
import { awardXP } from '../../services/gamificationEngine.js';

interface AcademyLesson8DVectorProps {
  allFragrances: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLaboratory?: (fragA: Fragrance, fragB: Fragrance) => void;
}

const VECTOR_DIMENSIONS: {
  key: keyof OlfactoryVector8D;
  label: string;
  description: string;
  botanicalMarkers: string;
  color: string;
}[] = [
  {
    key: 'freshness',
    label: 'Freshness & Solar Citrus',
    description: 'High vapor pressure sparkling top-notes, bergamot, neroli, ozone, mint.',
    botanicalMarkers: 'Calabrian Bergamot, Green Mandarin, Elemi Resin',
    color: '#38BDF8',
  },
  {
    key: 'sweetness',
    label: 'Gourmand Sweetness',
    description: 'Warm lactones, Madagascar vanillin, honeycomb, tonka bean kumarin.',
    botanicalMarkers: 'Bourbon Vanilla, Beeswax, Benzoin Siam',
    color: '#F472B6',
  },
  {
    key: 'intensity',
    label: 'Sillage & Olfactory Projection',
    description: 'Diffusive acoustic volume and atmospheric expansion beyond personal space.',
    botanicalMarkers: 'Iso E Super, Ambroxan, High Concentration Oils',
    color: '#FB923C',
  },
  {
    key: 'woody',
    label: 'Heartwood & Root Architecture',
    description: 'Structural backbone of cedar, sandalwood, vetiver roots, and oudh chips.',
    botanicalMarkers: 'Mysore Sandalwood, Atlas Cedarwood, Wild Vetiver Rhizomes',
    color: '#A16207',
  },
  {
    key: 'floral',
    label: 'Floral Heart Harmony',
    description: 'Indolic richness, damask rose petals, jasmine mogra, powdery orris.',
    botanicalMarkers: 'Kannauj Damascena Rose, Mogra Sambac, Florentine Iris',
    color: '#E879F9',
  },
  {
    key: 'warm_resinous_spices',
    label: 'Warm Resinous Spices',
    description: 'Incense, myrrh, golden saffron filaments, cracked green cardamom pods.',
    botanicalMarkers: 'Kashmiri Kesar, Green Cardamom, Frankincense tears',
    color: '#EA580C',
  },
  {
    key: 'earthy_clay',
    label: 'Earth & Terracotta Clay',
    description: 'Geosmin, wet alluvial soil, baked river mud, petrichor of monsoon rain.',
    botanicalMarkers: 'Kannauj Mitti Attar, Geosmin, Peat Moss',
    color: '#C2410C',
  },
  {
    key: 'longevity_fixative',
    label: 'Longevity & Lipid Fixative',
    description: 'Substantive low-volatility anchor holding ethereal molecules to the skin.',
    botanicalMarkers: 'Santalol heavy fractions, Labdanum, Macrocyclic Musks',
    color: '#10B981',
  },
];

export const AcademyLesson8DVector: React.FC<AcademyLesson8DVectorProps> = ({
  allFragrances,
  onInspectInChamber,
  onSendToLaboratory,
}) => {
  const [fragranceAId, setFragranceAId] = useState<string>(
    allFragrances[0]?.id || ''
  );
  const [fragranceBId, setFragranceBId] = useState<string>(
    allFragrances[1]?.id || ''
  );

  const [hasClaimedXP, setHasClaimedXP] = useState<boolean>(false);

  // Selected fragrances
  const fragA = useMemo(
    () => allFragrances.find((f) => f.id === fragranceAId) || allFragrances[0],
    [allFragrances, fragranceAId]
  );
  const fragB = useMemo(
    () => allFragrances.find((f) => f.id === fragranceBId) || allFragrances[1] || allFragrances[0],
    [allFragrances, fragranceBId]
  );

  // Computed 8D vectors from real engine
  const vectorA = useMemo(() => extractFragranceVector8D(fragA), [fragA]);
  const vectorB = useMemo(() => extractFragranceVector8D(fragB), [fragB]);

  // Cosine similarity
  const cosineSim = useMemo(
    () => computeCosineSimilarity8D(vectorA, vectorB),
    [vectorA, vectorB]
  );

  // Compatibility vs Similarity analysis
  const similarityPct = Math.round(cosineSim * 100);
  const compatibilityScore = useMemo(() => {
    // If they are too similar (> 90%), layering is redundant
    // If they share good balance (complementary axes), layering is optimal (75-88%)
    if (similarityPct > 92) return { score: 65, label: 'Redundant Overlap (Too Similar)' };
    if (similarityPct < 30) return { score: 55, label: 'High Discordance (Extreme Contrast)' };
    return { score: 88, label: 'Harmonic Counterpoint (Ideal Layering Pair)' };
  }, [similarityPct]);

  const handleClaimXP = () => {
    if (!hasClaimedXP) {
      awardXP(60, 'academy_8d_vector_lesson');
      setHasClaimedXP(true);
    }
  };

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-10 text-stone-200 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Chamber 11 &bull; Mathematical Olfactory Space
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              [ ALGORITHMIC CALCULATION ]
            </span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-1">
            The 8-Dimensional Olfactory Vector
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Instead of vague descriptions, Olfactory AI represents every perfume as an 8-dimensional unit vector in mathematical Euclidean space. Compare two specimens to observe how Cosine Similarity calculates exact distance and layering affinity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClaimXP}
          disabled={hasClaimedXP}
          className={`px-4 py-2 rounded-xl font-mono text-xs transition flex items-center gap-2 cursor-pointer self-start sm:self-auto ${
            hasClaimedXP
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
              : 'bg-amber-500 text-stone-950 font-bold hover:brightness-110'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{hasClaimedXP ? 'Module Mastered (+60 XP)' : 'Claim Module (+60 XP)'}</span>
        </button>
      </div>

      {/* Fragrance Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Specimen A */}
        <div className="p-4 rounded-2xl bg-[#14110E] border border-amber-500/30 space-y-2">
          <label className="block text-xs font-mono uppercase text-amber-400 font-bold">
            Specimen A (Primary Coordinate)
          </label>
          <select
            value={fragA?.id || ''}
            onChange={(e) => setFragranceAId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
          >
            {allFragrances.map((f) => (
              <option key={f.id} value={f.id}>
                {f.brand_name || f.brand} — {f.name} ({f.fragrance_family})
              </option>
            ))}
          </select>
          <div className="text-[11px] text-stone-400 line-clamp-1">
            Family: <strong className="text-stone-200">{fragA?.fragrance_family}</strong>
          </div>
        </div>

        {/* Specimen B */}
        <div className="p-4 rounded-2xl bg-[#14110E] border border-cyan-500/30 space-y-2">
          <label className="block text-xs font-mono uppercase text-cyan-400 font-bold">
            Specimen B (Counterpoint Coordinate)
          </label>
          <select
            value={fragB?.id || ''}
            onChange={(e) => setFragranceBId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-stone-100 text-sm focus:border-cyan-400 focus:outline-hidden"
          >
            {allFragrances.map((f) => (
              <option key={f.id} value={f.id}>
                {f.brand_name || f.brand} — {f.name} ({f.fragrance_family})
              </option>
            ))}
          </select>
          <div className="text-[11px] text-stone-400 line-clamp-1">
            Family: <strong className="text-stone-200">{fragB?.fragrance_family}</strong>
          </div>
        </div>
      </div>

      {/* Cosine Metric Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-black/40 to-cyan-950/20 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
            Mathematical Vector Similarity (Cos &theta;):
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-amber-300">
              {cosineSim.toFixed(3)}
            </span>
            <span className="text-sm font-sans text-stone-300">
              ({similarityPct}% Directional Alignment)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-sans max-w-sm">
          <span className="font-mono text-[10px] text-amber-400 font-semibold block uppercase">
            Layering Diagnosis:
          </span>
          <p className="text-stone-300 mt-0.5">
            {compatibilityScore.label}. In perfumery, identical profiles cancel out, while moderate similarity (60–85%) produces multidimensional chords.
          </p>
        </div>
      </div>

      {/* Interactive 8-Dimensional Bar Chart Breakdown */}
      <div className="space-y-4">
        <span className="font-mono text-xs uppercase text-amber-400 font-bold block tracking-wider">
          Direct 8D Dimensional Comparison
        </span>

        <div className="space-y-3">
          {VECTOR_DIMENSIONS.map((dim) => {
            const valA = vectorA[dim.key];
            const valB = vectorB[dim.key];

            return (
              <div
                key={dim.key}
                className="p-3.5 rounded-2xl bg-[#14110E] border border-white/[0.05] space-y-2 hover:border-white/[0.12] transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dim.color }} />
                    <span className="font-mono font-semibold text-stone-200">{dim.label}</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-sans italic">
                    Markers: {dim.botanicalMarkers}
                  </span>
                </div>

                {/* Comparative Dual Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Specimen A */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span className="text-amber-300 truncate max-w-[140px]">{fragA?.name}</span>
                      <span>{valA}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/60 overflow-hidden border border-white/[0.05]">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-amber-400"
                        style={{ width: `${valA}%` }}
                      />
                    </div>
                  </div>

                  {/* Specimen B */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400">
                      <span className="text-cyan-300 truncate max-w-[140px]">{fragB?.name}</span>
                      <span>{valB}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/60 overflow-hidden border border-white/[0.05]">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-cyan-400"
                        style={{ width: `${valB}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Links */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-400">
          <span>Experiment with these two fragrances live:</span>
        </div>

        <div className="flex items-center gap-2">
          {fragA && onInspectInChamber && (
            <button
              type="button"
              onClick={() => onInspectInChamber(fragA)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-stone-300 transition flex items-center gap-1.5 cursor-pointer font-mono text-xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Inspect Specimen A</span>
            </button>
          )}

          {fragA && fragB && onSendToLaboratory && (
            <button
              type="button"
              onClick={() => onSendToLaboratory(fragA, fragB)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 transition flex items-center gap-1.5 cursor-pointer font-mono text-xs font-semibold"
            >
              <span>Load Both into Layering Lab</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
