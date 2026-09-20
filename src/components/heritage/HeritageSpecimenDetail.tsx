import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  Sparkles,
  MapPin,
  Flame,
  Droplets,
  Layers,
  FlaskConical,
  Compass,
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { HeritageEntry, Fragrance } from '../../types.js';
import {
  extractHeritageVector8D,
  findCabinetMatchesForHeritage,
  findRelatedFragrancesForHeritage
} from '../../services/heritageService.js';
import { ScentSignatureVisualizer } from '../chamber/ScentSignatureVisualizer.js';
import { CHAMBER_PALETTES } from '../chamber/ChamberAtmosphere.js';

interface HeritageSpecimenDetailProps {
  specimen: HeritageEntry;
  onClose: () => void;
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLab?: (fragranceA: Fragrance, fragranceB?: Fragrance) => void;
  onNavigate?: (tab: any) => void;
}

export const HeritageSpecimenDetail: React.FC<HeritageSpecimenDetailProps> = ({
  specimen,
  onClose,
  ownedFragrances,
  allFragrances,
  onInspectInChamber,
  onSendToLab,
  onNavigate
}) => {
  const [activeLevel, setActiveLevel] = useState<number>(1);

  const vector8D = extractHeritageVector8D(specimen);
  const paletteKey = specimen.atmosphere_preset || 'earthy';
  const palette = CHAMBER_PALETTES[paletteKey] || CHAMBER_PALETTES.earthy;

  const cabinetMatches = findCabinetMatchesForHeritage(specimen, ownedFragrances);
  const relatedFragrances = findRelatedFragrancesForHeritage(specimen, allFragrances, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl p-4 sm:p-6 lg:p-10 flex items-center justify-center"
    >
      <div
        className="relative w-full max-w-4xl bg-[#181310] border border-[#3E3228] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.7)] text-[#FAF5F0] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Atmospheric Backdrop Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ background: palette.glow }}
        />

        {/* Header Modal Bar */}
        <div className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#3E3228]/80 bg-[#1C1612]/90">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706] bg-[#2A1F17] px-2.5 py-1 rounded-lg border border-[#443325]">
              Archival Specimen No. {specimen.id.replace('kannauj-', '').toUpperCase()}
            </span>
            {specimen.gi_tag && (
              <span className="text-[10px] font-mono-lab uppercase text-[#F59E0B] flex items-center gap-1 hidden sm:inline-flex">
                <Award className="w-3 h-3" />
                {specimen.gi_tag}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#241B16] hover:bg-[#3E3228] text-[#C8BAAB] hover:text-[#FAF5F0] transition-colors flex items-center justify-center border border-[#3E3228]"
            aria-label="Close specimen dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Level Progressive Disclosure Navigation Tabs */}
        <div className="relative z-10 px-6 sm:px-8 pt-4 pb-2 border-b border-[#3E3228]/60 bg-[#16110E] overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            {[
              { level: 1, title: 'I. Identity & Terroir' },
              { level: 2, title: 'II. Tradition & Story' },
              { level: 3, title: 'III. Craft & Distillation' },
              { level: 4, title: 'IV. 8D Olfactory Vector' },
              { level: 5, title: 'V. Cabinet & Parallels' }
            ].map((tab) => {
              const isActive = activeLevel === tab.level;
              return (
                <button
                  key={tab.level}
                  onClick={() => setActiveLevel(tab.level)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#B45309] text-white font-medium shadow-[0_2px_8px_rgba(180,83,9,0.4)]'
                      : 'text-[#A8988B] hover:text-[#FAF5F0] hover:bg-[#241B16]'
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="relative z-10 p-6 sm:p-8 max-h-[72vh] overflow-y-auto space-y-8">
          {/* LEVEL 1: Visual Identity & Atmosphere */}
          {activeLevel === 1 && (
            <motion.div
              key="lvl-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-lab text-[#D97706]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{specimen.region}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF5F0]">
                  {specimen.name}
                </h2>
                <div className="font-serif italic text-lg text-[#FDE68A]">
                  {specimen.hindi_name}
                </div>
                {specimen.botanical_name && (
                  <div className="text-xs font-mono-lab text-[#C8BAAB] tracking-wide">
                    Botanical Taxon: {specimen.botanical_name}
                  </div>
                )}
              </div>

              {/* Evocative Imagery Quote Box */}
              <div className="p-5 rounded-2xl bg-[#221914] border border-[#443325] text-sm font-serif italic text-[#D6C7B2] leading-relaxed">
                "{specimen.olfactory_profile.evocative_imagery}"
              </div>

              {/* Olfactory Summary Description */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono-lab uppercase tracking-widest text-[#E5D7C7]">
                  Olfactory Character & Atmosphere
                </div>
                <p className="text-sm text-[#C8BAAB] leading-relaxed">
                  {specimen.olfactory_profile.description}
                </p>
              </div>

              {/* Dominant Families & Notes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-2">
                  <div className="text-[10px] font-mono-lab uppercase text-[#D97706] tracking-wider">
                    Dominant Scent Families
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {specimen.olfactory_profile.dominant_families.map((fam, i) => (
                      <span
                        key={i}
                        className="text-xs font-sans px-2.5 py-1 rounded-lg bg-[#2A2019] text-[#FEF3C7] border border-[#443325]"
                      >
                        {fam}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-2">
                  <div className="text-[10px] font-mono-lab uppercase text-[#D97706] tracking-wider">
                    Harmonic Notes
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {specimen.olfactory_profile.notes.map((note, i) => (
                      <span
                        key={i}
                        className="text-xs font-sans px-2.5 py-1 rounded-lg bg-[#2A2019] text-[#E5D7C7] border border-[#3E3228]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LEVEL 2: Tradition & Story */}
          {activeLevel === 2 && (
            <motion.div
              key="lvl-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-mono-lab uppercase tracking-widest text-[#D97706]">
                  Historical Period & Provenance
                </div>
                <h3 className="font-serif text-2xl text-[#FAF5F0]">
                  {specimen.historical_period}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-mono-lab uppercase tracking-widest text-[#E5D7C7]">
                  Traditional & Ceremonial Role
                </div>
                <div className="p-5 rounded-2xl bg-[#221914] border border-[#443325] text-sm text-[#D6C7B2] leading-relaxed">
                  {specimen.traditional_role}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[11px] font-mono-lab uppercase tracking-widest text-[#E5D7C7]">
                  Living Heritage Continuity
                </div>
                <p className="text-sm text-[#A8988B] leading-relaxed">
                  Unlike industrial perfumes dissolved in denatured ethanol, authentic Indian distillates
                  like {specimen.name} operate as lipid-based aromatics. They bind intimately with the
                  wearer’s natural skin chemistry, softening rather than dissipating in warm climates.
                </p>
              </div>
            </motion.div>
          )}

          {/* LEVEL 3: Craft & Distillation */}
          {activeLevel === 3 && (
            <motion.div
              key="lvl-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-mono-lab uppercase tracking-widest text-[#D97706]">
                  Artisanal Extraction Method
                </div>
                <h3 className="font-serif text-2xl text-[#FAF5F0]">
                  Hydro-Distillation Mechanics
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-[#221914] border border-[#443325] text-sm text-[#D6C7B2] leading-relaxed space-y-2">
                <p>{specimen.extraction_method}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-1.5">
                  <div className="text-[10px] font-mono-lab uppercase text-[#F59E0B]">
                    Thermal Regulation
                  </div>
                  <p className="text-xs text-[#A8988B] leading-relaxed">
                    Firewood and dried dung fuel supply gentle, low-gradient heat, preventing thermal
                    pyrolysis of subtle top notes.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-1.5">
                  <div className="text-[10px] font-mono-lab uppercase text-[#F59E0B]">
                    Condensation Absorption
                  </div>
                  <p className="text-xs text-[#A8988B] leading-relaxed">
                    Vapors are quenched in cold receiver vessels containing aged sandalwood oil,
                    forming resilient sesquiterpene bonds.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* LEVEL 4: 8D Olfactory Vector */}
          {activeLevel === 4 && (
            <motion.div
              key="lvl-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Scientific Honesty Notice */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#2A1E16] border border-[#78350F]/40 text-xs text-[#FDE68A]">
                <Info className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <p>
                  <strong>Heritage Computational Olfactory Signature:</strong> Mathematical projection
                  synthesized from historical documentation and chemical accord profiles within our 8-D vector space.
                </p>
              </div>

              {/* Render Vector8D Radar Component */}
              <div className="bg-[#1C1612] p-4 sm:p-6 rounded-2xl border border-[#3E3228] flex flex-col items-center">
                <ScentSignatureVisualizer
                  vector8D={vector8D}
                  palette={palette}
                  fragranceName={specimen.name}
                />
              </div>

              {/* Vector Coordinates Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[
                  { label: 'Freshness', val: vector8D.freshness },
                  { label: 'Floral', val: vector8D.floral },
                  { label: 'Sweetness', val: vector8D.sweetness },
                  { label: 'Warm Spice', val: vector8D.warm_resinous_spices },
                  { label: 'Intensity', val: vector8D.intensity },
                  { label: 'Earthy Clay', val: vector8D.earthy_clay },
                  { label: 'Woody Depth', val: vector8D.woody },
                  { label: 'Fixative Retention', val: vector8D.longevity_fixative }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#241B16] p-2.5 rounded-xl border border-[#3E3228] text-center">
                    <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">{stat.label}</div>
                    <div className="font-mono-lab text-base font-semibold text-[#FEF3C7]">{stat.val}/100</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* LEVEL 5: Cabinet Connection & Modern Parallels */}
          {activeLevel === 5 && (
            <motion.div
              key="lvl-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* SECTION A: IN YOUR CABINET */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-[11px] font-mono-lab uppercase tracking-widest text-[#FAF5F0] font-semibold">
                      In Your Cabinet
                    </span>
                  </div>
                  <span className="text-xs font-mono-lab text-[#A8988B]">
                    {cabinetMatches.length} matching bottles
                  </span>
                </div>

                {cabinetMatches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cabinetMatches.map(({ fragrance, matchReason }) => (
                      <div
                        key={fragrance.id}
                        className="p-4 rounded-2xl bg-[#241B16] border border-[#3E3228] hover:border-[#D97706]/70 transition-all space-y-2.5"
                      >
                        <div>
                          <div className="text-[10px] font-mono-lab uppercase text-[#F59E0B]">
                            {fragrance.brand}
                          </div>
                          <div className="font-serif text-lg text-[#FAF5F0] font-medium">
                            {fragrance.name}
                          </div>
                          <div className="text-xs text-[#B0A294] mt-0.5">
                            {matchReason}
                          </div>
                        </div>

                        {/* Direct Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          {onInspectInChamber && (
                            <button
                              onClick={() => {
                                onInspectInChamber(fragrance);
                                onClose();
                              }}
                              className="text-xs font-mono-lab px-2.5 py-1 rounded-lg bg-[#3A2A1E] text-[#FEF3C7] hover:bg-[#D97706] hover:text-white transition-colors flex items-center gap-1"
                            >
                              <Compass className="w-3 h-3" />
                              Inspect
                            </button>
                          )}
                          {onSendToLab && (
                            <button
                              onClick={() => {
                                onSendToLab(fragrance);
                                onClose();
                              }}
                              className="text-xs font-mono-lab px-2.5 py-1 rounded-lg bg-[#3A2A1E] text-[#FEF3C7] hover:bg-[#D97706] hover:text-white transition-colors flex items-center gap-1"
                            >
                              <FlaskConical className="w-3 h-3" />
                              To Lab
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#221914] border border-[#3E3228] text-center space-y-2">
                    <p className="font-serif text-base text-[#FAF5F0]">
                      Your cabinet has no direct matches yet for this material.
                    </p>
                    <p className="text-xs text-[#A8988B] max-w-md mx-auto">
                      Explore our catalog or discover contemporary fragrances below that feature {specimen.name}.
                    </p>
                    {onNavigate && (
                      <button
                        onClick={() => {
                          onNavigate('atelier');
                          onClose();
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B45309] text-xs font-mono-lab uppercase text-white hover:bg-[#D97706] transition-colors"
                      >
                        Explore in Atelier
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION B: MODERN INDIAN HOUSES & INTERNATIONAL PARALLELS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Modern Indian Formulations */}
                <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-2.5">
                  <div className="text-[10px] font-mono-lab uppercase text-[#D97706] tracking-wider">
                    Modern Indian Creations
                  </div>
                  <div className="space-y-1.5">
                    {specimen.modern_indian_fragrances.map((item, i) => (
                      <div key={i} className="text-xs text-[#D6C7B2] flex items-center justify-between">
                        <span className="font-medium text-[#FAF5F0]">{item.name}</span>
                        <span className="text-[11px] text-[#A8988B]">{item.brand}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* International Artistic Equivalents */}
                <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-2.5">
                  <div className="text-[10px] font-mono-lab uppercase text-[#D97706] tracking-wider">
                    Global Artistic Equivalents
                  </div>
                  <div className="space-y-1.5">
                    {specimen.international_equivalents.map((item, i) => (
                      <div key={i} className="text-xs text-[#D6C7B2] flex items-center justify-between">
                        <span className="font-medium text-[#FAF5F0]">{item.name}</span>
                        <span className="text-[11px] text-[#A8988B]">{item.brand}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION C: ALCHEMICAL LAYERING CHORD */}
              {specimen.layering_chords && specimen.layering_chords.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#241B16] border border-[#523A25] space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#F59E0B]">
                    <FlaskConical className="w-3.5 h-3.5" />
                    Recommended Layering Chord
                  </div>
                  {specimen.layering_chords.map((chord, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="font-serif text-lg text-[#FEF3C7]">
                        {chord.chord_title}
                      </div>
                      <div className="text-xs text-[#A8988B] font-mono-lab">
                        Companion Accord: {chord.companion_family}
                      </div>
                      <p className="text-xs text-[#D6C7B2] leading-relaxed pt-1">
                        {chord.technique}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="relative z-10 px-6 sm:px-8 py-4 border-t border-[#3E3228]/80 bg-[#16110E] flex items-center justify-between">
          <div className="text-xs font-mono-lab text-[#8C7D70]">
            Level {activeLevel} of 5
          </div>
          <div className="flex items-center gap-2">
            {activeLevel > 1 && (
              <button
                onClick={() => setActiveLevel((p) => p - 1)}
                className="px-3 py-1.5 rounded-xl bg-[#241B16] text-xs font-mono-lab uppercase text-[#C8BAAB] hover:text-[#FAF5F0] border border-[#3E3228]"
              >
                Back
              </button>
            )}
            {activeLevel < 5 ? (
              <button
                onClick={() => setActiveLevel((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-xl bg-[#B45309] text-xs font-mono-lab uppercase text-white hover:bg-[#D97706] font-medium"
              >
                Next Level →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-[#3E3228] text-xs font-mono-lab uppercase text-[#FAF5F0] hover:bg-[#4E3F33]"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
