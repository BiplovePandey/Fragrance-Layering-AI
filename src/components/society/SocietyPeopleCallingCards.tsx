import React, { useState } from 'react';
import {
  Users,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  Shield,
  FlaskConical,
  Compass
} from 'lucide-react';
import { UserGamification, Fragrance, CommunityRecipe } from '../../types.js';

interface ConnoisseurProfile {
  id: string;
  name: string;
  title: string;
  badge: string;
  scentSignature: string[];
  favoriteFamilies: string[];
  cabinetHighlights: string[];
  sharedChordsCount: number;
  experienceYears: string;
  philosophy: string;
}

interface SocietyPeopleCallingCardsProps {
  gamification: UserGamification;
  allFragrances: Fragrance[];
  recipes: CommunityRecipe[];
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  onInspectInChamber?: (fragrance: Fragrance) => void;
}

export const SocietyPeopleCallingCards: React.FC<SocietyPeopleCallingCardsProps> = ({
  gamification,
  allFragrances,
  recipes,
  onSendToLab,
  onInspectInChamber,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('user');

  const communityProfiles: ConnoisseurProfile[] = [
    {
      id: 'user',
      name: 'You • Atelier Connoisseur',
      title: `${gamification.current_title || 'Novice Perfumer'} (Level ${gamification.level})`,
      badge: '👑',
      scentSignature: ['Alluvial Clay', 'Smoky Vetiver', 'Mysore Sandalwood'],
      favoriteFamilies: ['Earthy', 'Woody', 'Aromatic'],
      cabinetHighlights: ['Raw by SKINN', 'B680 Vetiver', 'Chai Musk'],
      sharedChordsCount: recipes.filter((r) => r.author === 'You').length || 1,
      experienceYears: 'Current Atelier Session',
      philosophy:
        'Observing how Indian microclimates and skin evaporation transform noble botanical extractions into living sillage.',
    },
    {
      id: 'aarav',
      name: 'Aarav Nose',
      title: 'Master Alchemist • Fellow of Kannauj',
      badge: '🧪',
      scentSignature: ['Wild Ruh Khus', 'Petrichor', 'Kashmiri Saffron'],
      favoriteFamilies: ['Earthy', 'Aromatic', 'Spicy'],
      cabinetHighlights: ['Wild Ruh Khus', 'Kannauj Mitti Attar', 'B680 Vetiver'],
      sharedChordsCount: 14,
      experienceYears: '12 Years in Traditional Distillation',
      philosophy:
        'The earth under the first monsoon cloud needs no synthetic fixative—nature has already written the perfect drydown.',
    },
    {
      id: 'elena',
      name: 'Elena Perfumista',
      title: 'Grand Connoisseur • Grasse & Mumbai',
      badge: '✨',
      scentSignature: ['Damask Rose', 'Mysore Sandalwood', 'White Amber'],
      favoriteFamilies: ['Floral', 'Woody', 'Oriental'],
      cabinetHighlights: ['Mysore Sandalwood & Vetiver', 'Nargis', 'Chai Musk'],
      sharedChordsCount: 9,
      experienceYears: '8 Years Classical Perfumery Study',
      philosophy:
        'Harmony in layering is achieved when the heavier base breathes through the top accord without smothering its light.',
    },
    {
      id: 'vikram',
      name: 'Vikram S.',
      title: 'Heritage Chronicler • Deg & Bhapka Curator',
      badge: '🏛️',
      scentSignature: ['Assam Oud', 'Black Pepper', 'Shamama Attar'],
      favoriteFamilies: ['Oriental', 'Woody', 'Amber'],
      cabinetHighlights: ['Nox Oud', 'Steele', 'Mitti Attar'],
      sharedChordsCount: 7,
      experienceYears: '15 Years Field Ethnography',
      philosophy:
        'Fragrance is liquid memory; an attar contains the soil, the woodsmoke of copper stills, and the patience of the distillers.',
    },
  ];

  const activeProfile =
    communityProfiles.find((p) => p.id === selectedProfileId) || communityProfiles[0];

  return (
    <div className="space-y-8">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-amber-400">
            <Users className="w-3.5 h-3.5" />
            <span>Chapter VII • People of the Atelier</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
            Connoisseur Calling Cards
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1 font-sans">
            Quiet olfactory calling cards. Each member shares their scent signature, favorite families, and guiding perfumery philosophy.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono-lab">
          {communityProfiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setSelectedProfileId(profile.id)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer whitespace-nowrap ${
                selectedProfileId === profile.id
                  ? 'bg-amber-900/10 text-amber-900 border-amber-500/40 font-semibold'
                  : 'bg-white/60 text-[#7A6F66] border-[#E3DACB] hover:text-[#1A1613]'
              }`}
            >
              {profile.name.split(' • ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Calling Card */}
      <div className="rounded-3xl bg-[#14110E] border border-amber-500/25 p-6 sm:p-10 text-[#F8F5EE] shadow-2xl space-y-8 relative overflow-hidden">
        {/* Subtle watermark / seal */}
        <div className="absolute top-6 right-6 opacity-5 pointer-events-none">
          <Shield className="w-48 h-48 text-amber-500" />
        </div>

        {/* Calling Card Head */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
              {activeProfile.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#F8F5EE]">
                  {activeProfile.name}
                </h3>
              </div>
              <p className="text-xs font-brand tracking-wider uppercase text-amber-400 mt-1">
                {activeProfile.title}
              </p>
              <p className="text-[11px] font-mono-lab text-stone-400 mt-0.5">
                {activeProfile.experienceYears}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-right">
              <span className="text-[10px] font-mono-lab text-stone-400 block">Shared Chords</span>
              <span className="text-sm font-mono-lab text-amber-300 font-semibold">
                {activeProfile.sharedChordsCount} Peer Chords
              </span>
            </div>
          </div>
        </div>

        {/* Scent Philosophy */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
          <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-amber-400/90 block">
            Guiding Philosophy
          </span>
          <p className="text-sm text-stone-300 italic font-serif leading-relaxed">
            &ldquo;{activeProfile.philosophy}&rdquo;
          </p>
        </div>

        {/* Three Data Columns: Scent Signature, Preferred Families, Cabinet Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Scent Signature Notes */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-brand tracking-wider uppercase text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Scent Signature</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeProfile.scentSignature.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-mono-lab text-stone-300"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Favorite Families */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-brand tracking-wider uppercase text-amber-300">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Olfactory Families</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeProfile.favoriteFamilies.map((fam) => (
                <span
                  key={fam}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs font-mono-lab text-amber-200"
                >
                  {fam}
                </span>
              ))}
            </div>
          </div>

          {/* Column 3: Cabinet Highlights */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 text-xs font-brand tracking-wider uppercase text-amber-300">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Cabinet Highlights</span>
            </div>
            <div className="space-y-1 text-xs font-serif text-stone-300">
              {activeProfile.cabinetHighlights.map((bottle) => (
                <p key={bottle} className="truncate">
                  • {bottle}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
