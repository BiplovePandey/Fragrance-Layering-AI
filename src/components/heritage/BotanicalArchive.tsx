import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, MapPin, Award, Layers, ArrowRight, Filter, Search } from 'lucide-react';
import { HeritageEntry } from '../../types.js';

interface BotanicalArchiveProps {
  heritageEntries: HeritageEntry[];
  onSelectSpecimen: (entry: HeritageEntry) => void;
  selectedSpecimenId?: string;
}

export const BotanicalArchive: React.FC<BotanicalArchiveProps> = ({
  heritageEntries,
  onSelectSpecimen,
  selectedSpecimenId
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEntries = heritageEntries.filter((entry) => {
    const matchesCategory =
      filterCategory === 'all' || entry.category === filterCategory;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesSearch =
      entry.name.toLowerCase().includes(query) ||
      entry.hindi_name.toLowerCase().includes(query) ||
      (entry.botanical_name || '').toLowerCase().includes(query) ||
      entry.region.toLowerCase().includes(query) ||
      entry.olfactory_profile.notes.some((n) => n.toLowerCase().includes(query)) ||
      entry.olfactory_profile.dominant_families.some((f) => f.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#3E3228] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
            <BookOpen className="w-3.5 h-3.5" />
            Botanical Field Journal & Mineral Taxa
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] mt-1">
            The Botanical Archive
          </h2>
          <p className="text-sm text-[#A8988B] mt-1 max-w-xl">
            Archival field records of India’s most venerated natural perfumery materials, their
            botanical nomenclature, extraction traditions, and olfactory vectors.
          </p>
        </div>

        {/* Search and Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7D70]" />
            <input
              type="text"
              placeholder="Search botanical or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#241B16] text-xs text-[#FAF5F0] pl-8 pr-3 py-1.5 rounded-xl border border-[#3E3228] focus:outline-none focus:border-[#D97706] placeholder-[#8C7D70] w-full sm:w-48"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-[#1C1713] p-1 rounded-xl border border-[#3E3228] overflow-x-auto">
            {['all', 'botanical', 'wood', 'mineral', 'spice', 'attar'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-lab uppercase tracking-wider whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-[#B45309] text-white font-medium'
                    : 'text-[#A8988B] hover:text-[#FAF5F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botanical Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((specimen) => {
          const isSelected = selectedSpecimenId === specimen.id;

          return (
            <motion.div
              key={specimen.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectSpecimen(specimen)}
              className={`group cursor-pointer rounded-3xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-[#2A2019] border-[#F59E0B] shadow-[0_12px_36px_rgba(217,119,6,0.25)] ring-1 ring-[#F59E0B]/50'
                  : 'bg-[#1C1713] border-[#3E3228] hover:border-[#D97706]/60 hover:bg-[#241B16] shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
              }`}
            >
              {/* Parchment Specimen Tag at top */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706] font-medium bg-[#2B1F17] px-2 py-0.5 rounded border border-[#4A3728]">
                    {specimen.category || 'botanical'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-lab text-[#9C8D80]">
                    <MapPin className="w-3 h-3 text-[#D97706]" />
                    <span className="truncate max-w-[120px]">{specimen.region.split(',')[0]}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#FAF5F0] group-hover:text-[#FDE68A] transition-colors">
                    {specimen.name}
                  </h3>
                  <div className="text-xs font-serif italic text-[#C8BAAB] mt-0.5">
                    {specimen.hindi_name}
                  </div>
                  {specimen.botanical_name && (
                    <div className="text-[11px] font-mono-lab text-[#D97706] italic mt-1 truncate">
                      {specimen.botanical_name}
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#B0A294] line-clamp-3 leading-relaxed">
                  {specimen.olfactory_profile.description}
                </p>

                {/* Dominant Notes Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {specimen.olfactory_profile.notes.slice(0, 3).map((note, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-[#2B211A] text-[#D6C7B2] border border-[#3E3228]"
                    >
                      {note}
                    </span>
                  ))}
                  {specimen.olfactory_profile.notes.length > 3 && (
                    <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-md bg-[#2B211A] text-[#8C7D70]">
                      +{specimen.olfactory_profile.notes.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: GI tag & Explore action */}
              <div className="pt-5 mt-5 border-t border-[#3E3228]/70 flex items-center justify-between">
                {specimen.gi_tag ? (
                  <span className="text-[9px] font-mono-lab uppercase text-[#F59E0B] flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    GI Heritage
                  </span>
                ) : (
                  <span className="text-[9px] font-mono-lab uppercase text-[#8C7D70]">
                    Natural Extract
                  </span>
                )}

                <div className="flex items-center gap-1 text-xs font-mono-lab text-[#FAF5F0] group-hover:text-[#FDE68A] transition-colors">
                  <span>Inspect Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#1C1713] border border-[#3E3228] text-[#A8988B] space-y-2">
          <BookOpen className="w-8 h-8 text-[#D97706] mx-auto opacity-50" />
          <p className="font-serif text-lg text-[#FAF5F0]">No specimens match this criteria</p>
          <p className="text-xs text-[#8C7D70]">Try clearing your search query or selecting "ALL".</p>
        </div>
      )}
    </div>
  );
};
