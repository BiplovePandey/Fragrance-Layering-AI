import React, { useState } from 'react';
import { Clock, Wind, Atom, Droplets, Sparkles, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { awardXP } from '../../services/gamificationEngine.js';

interface AcademyLessonEvaporationProps {
  onExperimentInLab?: () => void;
}

const TIMELINE_STAGES = [
  {
    time: '0 min',
    title: 'Initial Atomization',
    subtitle: 'High volatility flashpoint & alcohol vaporization',
    activeNotes: ['Sicilian Bergamot', 'Pink Pepper', 'Cardamom Pods'],
    dominantMolecules: 'Limonene, Linalool, Pinene (Molecular Weight < 150 g/mol)',
    vaporPressure: 'Very High (~0.1 to 1.5 mmHg)',
    visualColor: '#FBBF24',
    description:
      'Immediately upon contact with warm skin (34°C), the highest-vapor-pressure molecules vaporize into the ambient air, creating the immediate sillage trail.',
    science:
      'Lighter terpenes and aliphatic aldehydes lack heavy hydroxyl bonding, escaping within seconds. This phase is intended to introduce rather than sustain.',
  },
  {
    time: '15 min',
    title: 'Top-to-Heart Transition',
    subtitle: 'Flash volatiles dissipate; heart accords bloom',
    activeNotes: ['Cardamom Core', 'Damascena Rose Petals', 'Crisp Lavender'],
    dominantMolecules: 'Citronellol, Geraniol, Linalyl Acetate (MW 150-180 g/mol)',
    vaporPressure: 'Moderate (~0.01 to 0.1 mmHg)',
    visualColor: '#F59E0B',
    description:
      'The alcohol carrier is 100% evaporated. The true biological skin chemistry begins interacting with intermediate terpenes and floral alcohols.',
    science:
      'Lipids on the stratum corneum slow down the evaporation of moderate-chain alcohols through weak Van der Waals attractions.',
  },
  {
    time: '1 hr',
    title: 'Full Heart Dominance',
    subtitle: 'The melodic theme and compositional soul',
    activeNotes: ['Florentine Orris', 'Jasmine Sambac', 'Kannauj Mitti Steam'],
    dominantMolecules: 'Alpha-Irones, Eugenol, Geosmin (MW 180-220 g/mol)',
    vaporPressure: 'Low (~0.001 to 0.01 mmHg)',
    visualColor: '#D97706',
    description:
      'The fragrance reveals its intended identity. Harsh initial edges soften into warm floral-mineral body warmth that projects within arm’s length.',
    science:
      'Medium volatility molecules exhibit boiling points between 220°C and 280°C. They define the lasting identity before drydown anchors take over.',
  },
  {
    time: '2 hr',
    title: 'Heart-to-Base Transmutation',
    subtitle: 'Woody foundations and amber resins awaken',
    activeNotes: ['Cedarwood Virginiana', 'Nagarmotha Roots', 'Labdanum Gum'],
    dominantMolecules: 'Cedrol, Cyperene, Labdane diterpenes (MW 220-280 g/mol)',
    vaporPressure: 'Very Low (~0.0001 mmHg)',
    visualColor: '#B45309',
    description:
      'The floral shimmer transitions into deep resinous and woody resonance. Projection draws inward toward personal intimate space.',
    science:
      'Diterpenes and sesquiterpenols start polymerizing and bonding directly with sebum lipids, resisting ambient thermal agitation.',
  },
  {
    time: '6 hr',
    title: 'The Deep Drydown',
    subtitle: 'Heavy fixatives & skin-bonding heartwoods',
    activeNotes: ['Mysore Sandalwood (Chandan)', 'Dark Amber Resin', 'Oakmoss'],
    dominantMolecules: 'Alpha & Beta-Santalol, Vanillin, Ambergris terpenes',
    vaporPressure: 'Trace (< 0.00005 mmHg)',
    visualColor: '#92400E',
    description:
      'Only the heaviest macrocyclic and high-boiling molecules remain, radiating an intimate, warm skin scent that survives perspiration and breeze.',
    science:
      'High-santalol heartwood fractions act as natural molecular nets, holding trace volatile remnants in a slow continuous desorption equilibrium.',
  },
  {
    time: '12 hr+',
    title: 'Fixative Scent Ghost (Anchor Memory)',
    subtitle: 'Substantive lipid residue on skin & textiles',
    activeNotes: ['Santalol Fixative Bed', 'Clean White Musk', 'Cured Oud'],
    dominantMolecules: 'Macrocyclic Musks, Santalol complexes, Guaiacol condensates',
    vaporPressure: 'Extremely Sub-microscopic',
    visualColor: '#78350F',
    description:
      'Even after a full day, substantive molecules linger in fabric weaves and stratum corneum pores, whispering memory of the original chord.',
    science:
      'Textile cellulose and skin keratin act as high-affinity substrates for high molecular weight fixatives (> 300 g/mol), allowing multi-day persistence.',
  },
];

export const AcademyLessonEvaporation: React.FC<AcademyLessonEvaporationProps> = ({
  onExperimentInLab,
}) => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [disclosureLevel, setDisclosureLevel] = useState<number>(3);
  const [hasClaimedXP, setHasClaimedXP] = useState<boolean>(false);

  const currentStage = TIMELINE_STAGES[activeStageIdx];

  const handleClaimXP = () => {
    if (!hasClaimedXP) {
      awardXP(50, 'academy_evaporation_lesson');
      setHasClaimedXP(true);
    }
  };

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-10 text-stone-200 shadow-2xl space-y-8">
      {/* Header & Epistemological Tagging */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Chamber 04 &bull; Scent Physics
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              [ MODELLED DRYDOWN ]
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-stone-400 border border-white/[0.08] font-mono">
              [ EDUCATIONAL SIMPLIFICATION ]
            </span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-1">
            Evaporation Kinetics &amp; The Note Pyramid
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Why perfumes transform over time: Raoult’s law of partial vapor pressures, molecular weight fractionation, and epidermal lipid adsorption.
          </p>
        </div>

        {/* Progressive Disclosure Level Selector */}
        <div className="flex items-center gap-1.5 bg-[#14110E] p-1.5 rounded-2xl border border-white/[0.08]">
          <span className="text-[10px] font-mono text-stone-500 px-2 uppercase">Depth:</span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setDisclosureLevel(lvl)}
              className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                disclosureLevel === lvl
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.05]'
              }`}
              title={`Level ${lvl} explanation`}
            >
              L{lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Evaporation Time Scrubber */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase text-amber-400 font-semibold tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Interactive Drydown Scrubber (0 min to 12+ hours)</span>
          </span>
          <span className="text-xs font-mono text-stone-400">
            Selected: <strong className="text-amber-300">{currentStage.time}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {TIMELINE_STAGES.map((stg, idx) => (
            <button
              key={stg.time}
              type="button"
              onClick={() => setActiveStageIdx(idx)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                activeStageIdx === idx
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md scale-102'
                  : 'bg-[#14110E] border-white/[0.06] text-stone-400 hover:border-amber-500/30'
              }`}
            >
              <span className="font-mono text-xs font-bold text-amber-400">{stg.time}</span>
              <span className="font-serif text-[11px] text-stone-200 mt-1 leading-snug line-clamp-1">
                {stg.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Stage Simulation Chamber */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110E] border border-amber-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentStage.visualColor }} />
              <h3 className="font-serif text-2xl font-medium text-[#F8F5EE]">
                {currentStage.title} ({currentStage.time})
              </h3>
            </div>
            <p className="text-xs text-amber-300/80 font-mono mt-0.5">
              {currentStage.subtitle}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-stone-300">
            Vapor Pressure: <strong className="text-amber-300">{currentStage.vaporPressure}</strong>
          </div>
        </div>

        {/* Level 1: Poetic Introduction */}
        {disclosureLevel >= 1 && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border-l-2 border-amber-500/70 text-sm text-stone-300 font-serif italic leading-relaxed">
            &ldquo;{currentStage.description}&rdquo;
          </div>
        )}

        {/* Active Volatile Notes Display */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block">
            Prominent Volatile Accords in Plume:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentStage.activeNotes.map((note) => (
              <span
                key={note}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 font-mono text-xs"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Level 3+: Molecular Chemistry & Physical Kinetics */}
        {disclosureLevel >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Dominant Volatile Compounds (Level 3-4)
              </span>
              <p className="text-stone-300 font-mono">
                {currentStage.dominantMolecules}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                Epidermal Kinetics (Level 4-5)
              </span>
              <p className="text-stone-300 leading-relaxed font-sans">
                {currentStage.science}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions: Claim XP & Experiment in Lab */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClaimXP}
            disabled={hasClaimedXP}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs transition flex items-center gap-2 cursor-pointer ${
              hasClaimedXP
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-amber-500 text-stone-950 font-bold hover:brightness-110 shadow-md'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{hasClaimedXP ? 'Module Mastered (+50 XP)' : 'Mark Chamber Mastered (+50 XP)'}</span>
          </button>
        </div>

        {onExperimentInLab && (
          <button
            type="button"
            onClick={onExperimentInLab}
            className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-stone-200 text-xs font-mono transition flex items-center gap-2 cursor-pointer"
          >
            <span>Simulate Layering in Laboratory</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        )}
      </div>
    </div>
  );
};
