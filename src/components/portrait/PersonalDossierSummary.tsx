import React from 'react';
import {
  Sparkles,
  Award,
  Compass,
  Layers,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react';
import { LivingOlfactoryDNA } from '../../services/olfactoryIntelligence.js';
import { Fragrance, WeatherCondition } from '../../types.js';

interface PersonalDossierSummaryProps {
  livingDNA: LivingOlfactoryDNA;
  weather: WeatherCondition;
  ownedFragrances: Fragrance[];
  allFragrances: Fragrance[];
  onInspectInChamber: (fragrance: Fragrance) => void;
}

export const PersonalDossierSummary: React.FC<PersonalDossierSummaryProps> = ({
  livingDNA,
  weather,
  ownedFragrances,
  allFragrances,
  onInspectInChamber
}) => {
  const vec = livingDNA.vector;
  const [copied, setCopied] = React.useState(false);

  const topMatches = (ownedFragrances.length >= 3 ? ownedFragrances : allFragrances).slice(0, 3);

  const handleCopyDossier = () => {
    const text = `OLFACTORY AI • PERSONAL SCENT DOSSIER\nArchetype: ${livingDNA.personalityTitle}\n"${livingDNA.personalityDescription}"\nCore 8D Profile: Woody ${vec.woody}%, Earthy ${vec.earthy_clay}%, Fresh ${vec.freshness}%, Sweet ${vec.sweetness}%\nPrimary Heritage Material: Mysore Sandalwood & Kannauj Mitti Attar\nAtmospheric Resonance: ${weather.temperature_c}°C (${weather.season})`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#523A25] p-6 sm:p-10 lg:p-12 shadow-2xl text-[#FAF5F0] space-y-8 relative overflow-hidden">
      {/* Subtle luxury seal watermark in background */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 text-[#3E3228]/30 font-serif text-[180px] select-none pointer-events-none font-bold">
        ⚜
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A1F17] text-[#D97706] border border-[#443325] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter X • The Personal Fragrance Portrait</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF5F0] font-medium tracking-tight">
            Master Perfumer's Archival Dossier
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1">
            An unalterable distillation of your olfactory identity, instincts, and sensory orientation.
          </p>
        </div>

        <button
          onClick={handleCopyDossier}
          className="px-4 py-2 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#FEF3C7] text-xs font-mono-lab uppercase tracking-wider border border-[#3E3228] transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          {copied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Dossier Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Copy Archival Dossier</span>
            </>
          )}
        </button>
      </div>

      {/* Central Dossier Manuscript Plaque */}
      <div className="rounded-2xl bg-gradient-to-b from-[#1C1612] to-[#120E0A] border border-[#3E3228] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#3E3228] pb-4">
          <span className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            Olfactory Identity Synthesis
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] font-medium mt-1">
            {livingDNA.personalityTitle}
          </h3>
          <p className="font-serif italic text-base sm:text-lg text-[#FDE68A] mt-1">
            "{livingDNA.personalityDescription}"
          </p>
        </div>

        {/* 4 Architectural Summary Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#17120E] border border-[#3E3228] space-y-1">
            <span className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
              Dominant Territory
            </span>
            <div className="font-serif text-base text-[#FAF5F0] font-medium">
              {vec.woody >= 70 ? 'The Wooded Territory' : 'The Earth Sanctuary'}
            </div>
            <p className="text-[11px] text-[#A8988B] leading-tight">
              Rooted in sacred Mysore Sandalwood and Himalayan heartwoods.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#17120E] border border-[#3E3228] space-y-1">
            <span className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
              Preferred Atmosphere
            </span>
            <div className="font-serif text-base text-[#FAF5F0] font-medium">
              Monsoon &amp; Cool Twilight
            </div>
            <p className="text-[11px] text-[#A8988B] leading-tight">
              Atmospheric humidity enhances your affinity for petrichor and woods.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#17120E] border border-[#3E3228] space-y-1">
            <span className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
              Layering Instinct
            </span>
            <div className="font-serif text-base text-[#FAF5F0] font-medium">
              The Anchor Seeker
            </div>
            <p className="text-[11px] text-[#A8988B] leading-tight">
              Grounding ethereal citrus tops onto long-tenacity attar bases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#17120E] border border-[#3E3228] space-y-1">
            <span className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">
              Heritage Kinship
            </span>
            <div className="font-serif text-base text-[#FAF5F0] font-medium">
              Kannauj Deg-Bhapka
            </div>
            <p className="text-[11px] text-[#A8988B] leading-tight">
              Direct botanical kinship with pure Mitti and hydro-distilled Ruh Khus.
            </p>
          </div>
        </div>

        {/* 3 Strongest Cabinet Matches */}
        <div className="space-y-3 pt-3 border-t border-[#3E3228]">
          <div className="text-xs font-mono-lab uppercase text-[#A8988B]">
            Primary Wardrobe Pillars
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topMatches.map((frag, idx) => (
              <div
                key={frag.id}
                onClick={() => onInspectInChamber(frag)}
                className="p-3.5 rounded-xl bg-[#14100D] border border-[#3E3228] hover:border-[#523A25] cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono-lab text-[#D97706] uppercase">
                    Pillar 0{idx + 1}
                  </span>
                  <h4 className="font-serif text-sm font-medium text-[#FAF5F0] mt-0.5">
                    {frag.name}
                  </h4>
                  <div className="text-[10px] text-[#8C7D70]">
                    {frag.brand_name || frag.brand} &bull; {frag.fragrance_family}
                  </div>
                </div>
                <span className="text-xs font-mono-lab text-[#D97706]">Inspect &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
