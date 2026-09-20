import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Zap,
  ShieldAlert,
  Info
} from 'lucide-react';
import { awardXP } from '../../services/gamificationEngine.js';

interface AcademyLessonLayeringScienceProps {
  onExperimentInLab?: () => void;
}

const LAYERING_PRINCIPLES = [
  {
    id: 'anchor',
    name: 'The Anchor Principle (Heavy First)',
    role: 'Substantive Base Substrate',
    rule: 'Always apply high-density, low-volatility formulations (pure oils, Attars, dense Sandalwood/Amber bases) first.',
    reason:
      'Applying light alcohol-based citruses underneath heavy oils causes the alcohol to dissolve and flash off the oils prematurely. An oil base establishes an epidermal lipid foundation.',
    example: 'Apply 1 drop of Kannauj Mitti Attar or Mysore Sandalwood to pulse points before misting citrus.',
  },
  {
    id: 'lift',
    name: 'The Lift Principle (Solar Spark)',
    role: 'High Volatility Diffusion',
    rule: 'Top with light, high-vapor-pressure aromatics (Bergamot, Neroli, Cardamom, Mint) on exterior fabric or neck.',
    reason:
      'High-volatility compounds create immediate projection and aura (sillage) while drawing ambient air towards the heavy anchor.',
    example: 'A crisp Italian bergamot or green cardamom spray misted over collar and chest.',
  },
  {
    id: 'bridge',
    name: 'The Molecular Bridge',
    role: 'Harmonic Cohesion',
    rule: 'Connect disparate accords using a common shared terpene or floral middle (such as Rose, Iris, or Pink Pepper).',
    reason:
      'If two scents have zero overlapping notes, the olfactory brain perceives them as two separate clashing odors. A bridge compound blends their boundary.',
    example: 'Damascena Rose bridges fresh citrus tops with deep resinous oudh bases.',
  },
  {
    id: 'contrast',
    name: 'Dynamic Olfactory Contrast',
    role: 'Tension & Sophistication',
    rule: 'Pair warmth with chill, or bitter mineral roots with sweet balsamic creams.',
    reason:
      'Uniform tones quickly induce olfactory receptor desensitization (nose blindness). Subtle contrast keeps the olfactory epithelium stimulated throughout the day.',
    example: 'Bitter earth (Wild Ruh Khus) balanced against creamy Bourbon vanilla.',
  },
];

export const AcademyLessonLayeringScience: React.FC<AcademyLessonLayeringScienceProps> = ({
  onExperimentInLab,
}) => {
  const [activePrincipleId, setActivePrincipleId] = useState<string>('anchor');
  const [hasClaimedXP, setHasClaimedXP] = useState<boolean>(false);

  const currentPrinciple =
    LAYERING_PRINCIPLES.find((p) => p.id === activePrincipleId) ||
    LAYERING_PRINCIPLES[0];

  const handleClaimXP = () => {
    if (!hasClaimedXP) {
      awardXP(55, 'academy_layering_lesson');
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
              Chamber 09 &bull; Compounding Alchemy
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              [ EDUCATIONAL SIMPLIFICATION ]
            </span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-1">
            The Physics &amp; Rules of Scent Layering
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Layering is not spraying two random perfumes together. It is molecular architecture: anchoring high-vapor-pressure volatiles with low-volatility fixative substrates.
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
          <span>{hasClaimedXP ? 'Compounding Mastered (+55 XP)' : 'Claim Chamber (+55 XP)'}</span>
        </button>
      </div>

      {/* Principles Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {LAYERING_PRINCIPLES.map((p) => {
          const isActive = activePrincipleId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePrincipleId(p.id)}
              className={`p-4 rounded-2xl text-left transition cursor-pointer border flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                  : 'bg-[#14110E] border-white/[0.06] text-stone-400 hover:border-amber-500/30'
              }`}
            >
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                {p.role}
              </span>
              <h4 className="font-serif text-base text-stone-200 font-medium">
                {p.name}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Principle Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110E] border border-amber-500/30 space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Principle Mandate:
          </span>
          <h3 className="font-serif text-2xl font-medium text-[#F8F5EE] mt-0.5">
            {currentPrinciple.name}
          </h3>
          <p className="text-sm text-stone-300 font-serif italic mt-2 border-l-2 border-amber-400/60 pl-4 py-0.5">
            &ldquo;{currentPrinciple.rule}&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="font-mono text-[10px] uppercase text-stone-400 font-bold block">
              Why This Works (Physics &amp; Biology)
            </span>
            <p className="text-stone-300 leading-relaxed font-sans">
              {currentPrinciple.reason}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
            <span className="font-mono text-[10px] uppercase text-amber-400 font-bold block">
              Atelier Practical Recipe
            </span>
            <p className="text-amber-200/90 font-mono">
              {currentPrinciple.example}
            </p>
          </div>
        </div>
      </div>

      {/* Lab Bridge */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <span className="text-stone-400">
          Ready to compound real flacons from the catalogue with live compatibility scores?
        </span>

        {onExperimentInLab && (
          <button
            type="button"
            onClick={onExperimentInLab}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs font-mono transition flex items-center gap-2 cursor-pointer shadow-md hover:brightness-110"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Try It in the Layering Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
