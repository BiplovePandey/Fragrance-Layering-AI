import React, { useState } from 'react';
import {
  HeartHandshake,
  Sparkles,
  BookOpen,
  ArrowRight,
  FlaskConical,
  Compass,
  Layers,
  MapPin
} from 'lucide-react';
import { HERITAGE_ENTRIES } from '../../data/heritageAtlas.js';
import { HeritageEntry, Fragrance } from '../../types.js';
import { awardXP } from '../../services/gamificationEngine.js';

interface HeritageAtlasViewProps {
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  allFragrances: Fragrance[];
}

export const HeritageAtlasView: React.FC<HeritageAtlasViewProps> = ({
  onSendToLab,
  allFragrances
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string>(HERITAGE_ENTRIES[0].id);

  const selectedEntry = HERITAGE_ENTRIES.find(e => e.id === selectedEntryId) || HERITAGE_ENTRIES[0];

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    awardXP(25, 'heritage_voyager');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white text-amber-900 text-xs font-mono-lab mb-2 shadow-2xs">
          <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
          <span>Living Indian Botanical Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
          Indian Fragrance Heritage Atlas
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5046] mt-1 max-w-3xl">
          Tracing 400+ years of copper Deg &amp; Bhapka hydro-distillation, sacred sandalwood bases, and traditional botanical distillates into contemporary luxury perfumery.
        </p>
      </div>

      {/* Horizontal Heritage Material Selector */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {HERITAGE_ENTRIES.map((entry) => {
          const isSelected = entry.id === selectedEntryId;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleSelectEntry(entry.id)}
              className={`px-4 py-3 rounded-2xl text-left shrink-0 transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white/95 border border-white text-amber-950 shadow-md ring-2 ring-amber-500/20'
                  : 'liquid-glass-pill text-[#3D352E] hover:bg-white/90'
              }`}
            >
              <span className="text-[10px] font-mono-lab text-amber-800 font-semibold block">{entry.region.split(',')[0]}</span>
              <span className="text-sm font-serif font-semibold text-[#1A1613] mt-0.5">{entry.name}</span>
              <span className="text-[10px] text-[#6B6056] mt-1">{entry.hindi_name.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Deep Interactive Connection Matrix:
          Traditional Material -> Deg-Bhapka Extraction -> Olfactory Profile -> Modern Indian Fragrance -> International Luxury Equivalents -> Layering Chords */}
      <div className="rounded-3xl liquid-glass p-6 sm:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Cultural Context */}
        <div className="space-y-2 border-b border-white/60 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono-lab uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold shadow-2xs">
              {selectedEntry.historical_period}
            </span>
            <span className="text-xs text-[#5A5046] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-700" /> {selectedEntry.region}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1A1613] mt-2">
            {selectedEntry.name}
          </h2>
          <p className="text-lg font-serif text-amber-900 italic">
            {selectedEntry.hindi_name}
          </p>
          <p className="text-sm text-[#5A5046] leading-relaxed max-w-3xl pt-2">
            {selectedEntry.olfactory_profile.description}
          </p>
        </div>

        {/* 6-Step Botanical Connection Path */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Box 1: Extraction & Distillation */}
          <div className="p-5 rounded-2xl liquid-glass-inset space-y-2">
            <span className="text-[10px] font-mono-lab uppercase text-amber-800 font-semibold block">
              01 &bull; Artisanal Extraction Method
            </span>
            <h4 className="font-serif text-lg font-medium text-[#1A1613]">
              Deg &amp; Bhapka Hydro-Distillation
            </h4>
            <p className="text-xs text-[#5A5046] leading-relaxed">
              {selectedEntry.extraction_method}
            </p>
          </div>

          {/* Box 2: Olfactory Profile & Imagery */}
          <div className="p-5 rounded-2xl liquid-glass-inset space-y-2">
            <span className="text-[10px] font-mono-lab uppercase text-rose-800 font-semibold block">
              02 &bull; Evocative Olfactory Imagery
            </span>
            <h4 className="font-serif text-lg font-medium text-[#1A1613]">
              Scent Experience
            </h4>
            <p className="text-xs text-[#5A5046] leading-relaxed italic">
              &ldquo;{selectedEntry.olfactory_profile.evocative_imagery}&rdquo;
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedEntry.olfactory_profile.notes.map(n => (
                <span key={n} className="px-2 py-0.5 rounded-md bg-amber-100/90 text-[10px] text-amber-900 font-mono-lab border border-amber-300">
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Box 3: Traditional Role */}
          <div className="p-5 rounded-2xl liquid-glass-inset space-y-2">
            <span className="text-[10px] font-mono-lab uppercase text-emerald-800 font-semibold block">
              03 &bull; Ayurvedic &amp; Royal History
            </span>
            <h4 className="font-serif text-lg font-medium text-[#1A1613]">
              Traditional Purpose
            </h4>
            <p className="text-xs text-[#5A5046] leading-relaxed">
              {selectedEntry.traditional_role}
            </p>
          </div>

          {/* Box 4: Modern Indian Fragrances */}
          <div className="p-5 rounded-2xl liquid-glass-inset space-y-2">
            <span className="text-[10px] font-mono-lab uppercase text-amber-800 font-semibold block">
              04 &bull; Modern Indian Perfumes
            </span>
            <h4 className="font-serif text-lg font-medium text-[#1A1613]">
              Contemporary Expressions
            </h4>
            <ul className="space-y-1.5 pt-1">
              {selectedEntry.modern_indian_fragrances.map((f, i) => (
                <li key={i} className="text-xs text-[#3D352E] flex items-center justify-between">
                  <span className="font-medium text-[#1A1613]">{f.name}</span>
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">{f.brand}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 5: International Luxury Equivalents */}
          <div className="p-5 rounded-2xl liquid-glass-inset space-y-2">
            <span className="text-[10px] font-mono-lab uppercase text-teal-800 font-semibold block">
              05 &bull; Global Parfumerie Equivalents
            </span>
            <h4 className="font-serif text-lg font-medium text-[#1A1613]">
              International Parallels
            </h4>
            <ul className="space-y-1.5 pt-1">
              {selectedEntry.international_equivalents.map((f, i) => (
                <li key={i} className="text-xs text-[#3D352E] flex items-center justify-between">
                  <span className="font-medium text-[#1A1613]">{f.name}</span>
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">{f.brand}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 6: Layering Possibility */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono-lab uppercase text-amber-900 font-semibold block">
                06 &bull; Alchemical Layering Chord
              </span>
              <h4 className="font-serif text-lg font-medium text-[#1A1613]">
                {selectedEntry.layering_chords?.[0]?.chord_title || 'Sacred Synergy'}
              </h4>
              <p className="text-xs text-[#5A5046] leading-relaxed mt-1">
                {selectedEntry.layering_chords?.[0]?.technique || 'Harmonious layering technique'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const companion = allFragrances.find(f => f.fragrance_family?.includes('Wood') || f.fragrance_family?.includes('Citrus')) || allFragrances[0];
                const baseFrag = allFragrances.find(f => f.name.toLowerCase().includes((selectedEntry.name || '').toLowerCase().split(' ')[1] || '')) || allFragrances[1] || allFragrances[0];
                onSendToLab(baseFrag, companion);
              }}
              className="mt-3 px-3.5 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-800" />
              <span>Experiment with this Chord in Lab</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
