import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { awardXP } from '../../services/gamificationEngine.js';

interface AcademyLessonIndianHeritageProps {
  onNavigateToHeritageAtlas?: (materialId?: string) => void;
}

const DEG_BHAPKA_STEPS = [
  {
    step: 1,
    title: 'Charging the Copper Deg Cauldron',
    hindiTerm: 'देग भराई (Deg Bharai)',
    vessel: 'Handmade Copper Deg Cauldron',
    fuel: 'Wood and Dried Cow Dung Fires',
    materials: 'Sun-baked clay disks (kullhads), fresh pre-dawn rose petals, or wild vetiver roots with pure well water.',
    details:
      'The massive copper cauldron is loaded with botanical specimens and water. Copper conducts heat uniformly, preventing pyrolytic charring of subtle aromatic esters.',
    insight: 'Over 400 years of metallurgical refinement in Kannauj cobblestone alleyways.',
  },
  {
    step: 2,
    title: 'Hermetic Clay Sealing (Sarson-Mitti)',
    hindiTerm: 'सरसों मिट्टी की सील (Sarson-Mitti Seal)',
    vessel: 'Sarson Mitti Ribbon & Deg Lid',
    fuel: 'Hermetic Sealing Process',
    materials: 'Cotton twine ribbons soaked in alluvial river mud and mustard oil paste.',
    details:
      'The heavy copper lid is sealed tightly by hand using ribbons saturated with wet alluvial mud and mustard seed paste. As heat rises, the mud dries rock-hard, trapping 100% of high-pressure aromatic steam without rubber gaskets.',
    insight: 'Zero synthetic polymers or artificial sealants are ever introduced.',
  },
  {
    step: 3,
    title: 'Vapor Journey Through Bamboo Chonga',
    hindiTerm: 'चूंगा वाष्प प्रवाह (Bamboo Chonga)',
    vessel: 'Hollow Bent Bamboo Pipe wrapped in Twine',
    fuel: 'Subtle Steam Physics',
    materials: 'Natural bamboo culms wrapped with coarse jute twine.',
    details:
      'As the cauldron simmers, steam carrying ethereal volatile compounds rises through the bamboo conduit (Chonga). Bamboo provides natural thermal insulation, ensuring steam does not condense prematurely or absorb metallic off-flavors.',
    insight: 'Organic conduit material preserving the unadulterated botanical soul.',
  },
  {
    step: 4,
    title: 'Submersion in the Cooling Ganda Tank',
    hindiTerm: 'गंडा शीतलन कुंड (Ganda Cooling Reservoir)',
    vessel: 'Bhapka in Cold Water Tank',
    fuel: 'Submerged Copper Bhapka',
    materials: 'Circulating cold fresh groundwater.',
    details:
      'The receiver vessel (Bhapka) is submerged in a large cooling water basin (Ganda). The master distiller periodically tests the temperature by hand, adding cool water to ensure immediate, shock condensation of rising vapors.',
    insight: 'Manual thermal calibration guided by generational tactile intuition.',
  },
  {
    step: 5,
    title: 'Sandalwood Base Lipid Fixation',
    hindiTerm: 'चंदन आधार तेल अवशोषण (Chandan Base Absorption)',
    vessel: 'Pure Mysore Sandalwood Oil Matrix',
    fuel: 'Liquid Absorption Chamber',
    materials: 'High-santalol aged Santalum album heartwood oil.',
    details:
      'Inside the Bhapka, pure sandalwood oil awaits the condensing drops. Sandalwood acts as a biological fixative bed, capturing fragile volatile top notes (like geosmin or rose damascenone) in its rich santalol lipid structure over 15 to 20 daily cycles.',
    insight: 'Living fixative chemistry that holds delicate floral notes for 12 to 24 hours.',
  },
  {
    step: 6,
    title: 'Maturation in Camel-Hide Kupi Flasks',
    hindiTerm: 'कुपी परिपक्वता (Kupi Dehydration & Aging)',
    vessel: 'Semi-Porous Camel-Hide Kupi',
    fuel: 'Sun & Micro-Transpiration',
    materials: 'Traditional leather kupi decanters.',
    details:
      'After daily decanting, the raw attar contains trace residual water. It is poured into semi-porous camel-hide kupis. The leather allows water molecules to transpire and evaporate into the warm dry air while retaining all precious aromatic oils, naturally concentrating the fragrance.',
    insight: 'Ancient micro-filtration without boiling, vacuum centrifuges, or chemicals.',
  },
];

export const AcademyLessonIndianHeritage: React.FC<AcademyLessonIndianHeritageProps> = ({
  onNavigateToHeritageAtlas,
}) => {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [hasClaimedXP, setHasClaimedXP] = useState<boolean>(false);

  const step = DEG_BHAPKA_STEPS[activeStepIdx];

  const handleClaimXP = () => {
    if (!hasClaimedXP) {
      awardXP(65, 'academy_deg_bhapka_lesson');
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
              Chamber 14 &bull; Heritage Metallurgy &amp; Distillation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              [ VERIFIED HERITAGE INFORMATION ]
            </span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-1">
            The Kannauj Deg-Bhapka Hydro-Distillation
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
            For over four centuries, Kannauj perfumers have captured petrichor (Mitti Attar), wild vetiver (Ruh Khus), and Damask rose (Ruh Gulab) using pure steam, hollow bamboo, copper cauldrons, and sandalwood oil.
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
          <span>{hasClaimedXP ? 'Heritage Mastered (+65 XP)' : 'Claim Chamber (+65 XP)'}</span>
        </button>
      </div>

      {/* Step Sequence Tabs */}
      <div className="space-y-3">
        <span className="font-mono text-xs uppercase text-amber-400 font-semibold tracking-wider block">
          Interactive Distillation Sequence (6 Canonical Stages):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DEG_BHAPKA_STEPS.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStepIdx(idx)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                activeStepIdx === idx
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md scale-102'
                  : 'bg-[#14110E] border-white/[0.06] text-stone-400 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold text-amber-400 mb-1">
                <span>Stage 0{s.step}</span>
              </div>
              <h4 className="font-serif text-[11px] text-stone-200 line-clamp-2 leading-snug">
                {s.title}
              </h4>
            </button>
          ))}
        </div>
      </div>

      {/* Active Stage Detail Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#14110E] border border-amber-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="font-serif text-2xl font-medium text-[#F8F5EE]">
                {step.title}
              </h3>
            </div>
            <p className="text-xs font-mono text-amber-300/80 mt-0.5">
              {step.hindiTerm}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] font-mono text-xs text-stone-300">
            Vessel: <strong className="text-amber-300">{step.vessel}</strong>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          {step.details}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="font-mono text-[10px] uppercase text-stone-400 font-bold block">
              Physical Materials &amp; Medium
            </span>
            <p className="text-stone-300 font-mono">
              {step.materials}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
            <span className="font-mono text-[10px] uppercase text-amber-400 font-bold block">
              Heritage Artisanal Wisdom
            </span>
            <p className="text-amber-200/90 font-serif italic">
              &ldquo;{step.insight}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Heritage Atlas Bridge */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <span className="text-stone-400">
          Trace physical botanicals, interactive maps, and authentic Indian distillations:
        </span>

        {onNavigateToHeritageAtlas && (
          <button
            type="button"
            onClick={() => onNavigateToHeritageAtlas('kannauj-mitti-attar')}
            className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-mono transition flex items-center gap-2 cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Living Heritage Atlas</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        )}
      </div>
    </div>
  );
};
