import React from 'react';
import {
  Heart,
  Ban,
  Sparkles,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { UserPreferences, Fragrance } from '../../types.js';
import { LivingOlfactoryDNA } from '../../services/olfactoryIntelligence.js';

interface GravitatePreferencesProps {
  preferences: UserPreferences | null;
  livingDNA: LivingOlfactoryDNA;
  ownedFragrances: Fragrance[];
  onOpenPreferencesModal: () => void;
  onAddNote?: (note: string) => void;
}

export const GravitatePreferences: React.FC<GravitatePreferencesProps> = ({
  preferences,
  livingDNA,
  ownedFragrances,
  onOpenPreferencesModal,
  onAddNote
}) => {
  // Derive families of attraction based on vector and preferences
  const favoriteFamilies = (preferences?.favorite_family && preferences.favorite_family.length > 0)
    ? preferences.favorite_family
    : ['Woody Aromatic', 'Chypre Earthy', 'Oriental Resinous'];

  const preferredNotes = (preferences?.preferred_notes && preferences.preferred_notes.length > 0)
    ? preferences.preferred_notes
    : ['Sandalwood', 'Vetiver', 'Mitti', 'Cardamom', 'Bergamot'];

  const avoidNotes = ['Overpowering Ethyl Maltol', 'Synthetic Praline', 'Cotton Candy'];

  const preferenceCards = [
    {
      family: 'Woody & Heartwoods',
      affinityPct: Math.round(livingDNA.vector.woody),
      notes: ['Mysore Sandalwood', 'Cedarwood', 'Assam Oud'],
      tag: 'Primary Sanctuary',
      bg: 'from-[#291C12] to-[#17100A]',
      border: 'border-[#6E421E]',
      desc: 'You consistently return to comforting, grounded, dry and creamy wood structures that age like fine parchment on warm skin.'
    },
    {
      family: 'Earthy & Petrichor',
      affinityPct: Math.round(livingDNA.vector.earthy_clay),
      notes: ['Mitti Clay', 'Ruh Khus Vetiver', 'Geosmin'],
      tag: 'Elemental Resonance',
      bg: 'from-[#261A13] to-[#140E0A]',
      border: 'border-[#7E4B25]',
      desc: 'High sensitivity to damp earth and rain-kissed loam. You find psychological stillness in mineral, non-sweet aromatic textures.'
    },
    {
      family: 'Aromatic Citrus & Clean Air',
      affinityPct: Math.round(livingDNA.vector.freshness),
      notes: ['Calabrian Bergamot', 'Green Neroli', 'Cardamom Pod'],
      tag: 'Morning Clarity',
      bg: 'from-[#262214] to-[#14120A]',
      border: 'border-[#756220]',
      desc: 'A secondary appetite for sparkling, effervescent top accords that cut through humidity and establish refined focus.'
    }
  ];

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl text-[#FAF5F0] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter V • What You Gravitate Toward</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Curated Scent Gravitations
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            A distilled record of the chords, raw ingredients, and structures your senses instinctually welcome.
          </p>
        </div>

        <button
          onClick={onOpenPreferencesModal}
          className="px-4 py-2 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#FEF3C7] text-xs font-mono-lab uppercase tracking-wider border border-[#3E3228] transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Adjust Palate</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {preferenceCards.map((card) => (
          <div
            key={card.family}
            className={`rounded-2xl p-6 bg-gradient-to-b ${card.bg} border ${card.border} space-y-4`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#D97706]">
                {card.tag}
              </span>
              <span className="font-serif text-2xl font-semibold text-[#FAF5F0]">
                {card.affinityPct}%
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-[#FAF5F0]">
                {card.family}
              </h3>
              <p className="text-xs text-[#C8BAAB] mt-2 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
                Core Notes
              </div>
              <div className="flex flex-wrap gap-1.5">
                {card.notes.map((n) => (
                  <span
                    key={n}
                    className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono-lab text-[#E6DACB]"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Sensitivity Comparison: Welcome vs Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#3E3228]">
        {/* Cherished Raw Materials */}
        <div className="p-5 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#34D399]" />
            <h4 className="font-serif text-base font-medium text-[#FAF5F0]">
              Cherished Botanical Notes
            </h4>
          </div>
          <p className="text-xs text-[#A8988B] leading-relaxed">
            Aromatics that trigger positive neurological calm and high satisfaction across your wearing logs:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {preferredNotes.map((note) => (
              <span
                key={note}
                className="px-2.5 py-1 rounded-lg bg-[#241E18] border border-[#443528] text-xs font-mono-lab text-[#34D399] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Olfactory Sensitivities / Overwhelm Guards */}
        <div className="p-5 rounded-2xl bg-[#1C1612] border border-[#3E3228] space-y-3">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-[#F87171]" />
            <h4 className="font-serif text-base font-medium text-[#FAF5F0]">
              Olfactory Sensitivities &amp; Ceilings
            </h4>
          </div>
          <p className="text-xs text-[#A8988B] leading-relaxed">
            Notes calibrated with lower tolerance or filtered out of your recommendation engine:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {avoidNotes.map((note) => (
              <span
                key={note}
                className="px-2.5 py-1 rounded-lg bg-[#281818] border border-[#4E2424] text-xs font-mono-lab text-[#FCA5A5] flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F87171]" />
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
