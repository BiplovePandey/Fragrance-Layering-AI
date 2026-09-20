import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Compass, MapPin, Sparkles, Feather, ArrowRight, ShieldCheck } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { HERITAGE_ENTRIES } from '../../data/heritageAtlas.js';

interface ChamberHeritageArchivalProps {
  fragrance: Fragrance;
  onExploreHeritage?: () => void;
}

export const ChamberHeritageArchival: React.FC<ChamberHeritageArchivalProps> = ({
  fragrance,
  onExploreHeritage
}) => {
  // Check if fragrance has explicit heritage fields or matches known heritage botanicals
  const combinedText = `${fragrance.name} ${fragrance.brand} ${fragrance.fragrance_family} ${(fragrance.heritage_materials || []).join(' ')} ${(fragrance.top_notes || []).join(' ')} ${(fragrance.middle_notes || []).join(' ')} ${(fragrance.base_notes || []).join(' ')}`.toLowerCase();

  const matchingEntry = HERITAGE_ENTRIES.find((entry) => {
    return (
      combinedText.includes(entry.name.toLowerCase()) ||
      combinedText.includes(entry.id.replace(/-/g, ' ')) ||
      entry.modern_indian_fragrances.some((m) => m.name.toLowerCase() === fragrance.name.toLowerCase())
    );
  }) || (fragrance.heritage_materials?.length || fragrance.distillation_method ? HERITAGE_ENTRIES[0] : null);

  const hasHeritage = Boolean(
    fragrance.heritage_materials?.length ||
    fragrance.distillation_method ||
    fragrance.heritage_relationship ||
    matchingEntry
  );

  if (!hasHeritage) {
    return null;
  }

  const region = fragrance.brand_country || matchingEntry?.region || 'Kannauj & Mysore, India';
  const distillation = fragrance.distillation_method || matchingEntry?.extraction_method || 'Artisanal Copper Deg & Bhapka Hydro-distillation';
  const botanicalArchive = fragrance.heritage_materials?.length
    ? fragrance.heritage_materials
    : matchingEntry?.olfactory_profile.notes || ['Alluvial Terra Cotta', 'Mysore Sandalwood Base', 'Damask Rose Petals'];

  return (
    <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#1C1712] via-[#16120E] to-[#0F0C09]">
      {/* Background Archival Watermark Seal */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full border-2 border-dashed border-[#D4AF37]/15 flex items-center justify-center pointer-events-none -z-0">
        <div className="w-48 h-48 rounded-full border border-[#D4AF37]/20 flex items-center justify-center">
          <span className="font-serif text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]/25 rotate-12">
            Indian Botanical Heritage Seal &bull; 1816
          </span>
        </div>
      </div>

      <div className="relative z-10 space-y-5">
        {/* Archival Header with Wax Seal Tone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/60 flex items-center justify-center text-[#D4AF37] shadow-sm">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                Archival Collector’s Catalogue
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-[#FFF8ED] font-medium leading-tight">
                Living Heritage Provenance
              </h4>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-mono text-[#D4AF37] self-start sm:self-auto">
            <MapPin className="w-3 h-3" />
            <span>{region}</span>
          </div>
        </div>

        {/* Narrative Provenance Description */}
        <div className="p-4 rounded-2xl bg-[#0D0A08]/60 border border-[#D4AF37]/20 font-serif text-sm sm:text-base text-[#F5EBE1]/90 leading-relaxed italic">
          “{matchingEntry?.olfactory_profile.description ||
            `Rooted in traditional hydro-distillation traditions, capturing authentic Indian botanicals across copper stills and aged natural fixative foundations.`}”
        </div>

        {/* Technical Heritage Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] block font-semibold">
              Distillation &amp; Extraction Method:
            </span>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              {distillation}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] block font-semibold">
              Sacred Botanical Materials:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {botanicalArchive.map((mat) => (
                <span
                  key={mat}
                  className="px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[10px] font-mono text-amber-200"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Link to Indian Heritage Atlas */}
        {onExploreHeritage && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onExploreHeritage}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-amber-700/20 hover:from-[#D4AF37]/30 hover:to-amber-700/30 border border-[#D4AF37]/50 text-xs font-mono text-amber-200 hover:text-white transition shadow-sm cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Kannauj &amp; Vedic Atlas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
