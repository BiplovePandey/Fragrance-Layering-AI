import React, { useState } from 'react';
import { Sparkles, Compass, Layers, Droplets, MapPin, ArrowRight } from 'lucide-react';
import { Fragrance } from '../types.js';

interface IndianSoulSectionProps {
  indianFragrances: Fragrance[];
  onSelectIndianFragrance: (fragranceId: number) => void;
  onExploreKannaujAttars?: () => void;
}

interface HeritageNote {
  name: string;
  english: string;
  emoji: string;
  origin: string;
  description: string;
  gradient: string;
  accent: string;
}

const HERITAGE_NOTES: HeritageNote[] = [
  {
    name: 'Mitti Attar',
    english: 'Petrichor / Baked Earth',
    emoji: '🌧️',
    origin: 'Kannauj, Uttar Pradesh',
    description: 'The intoxicating scent of parched alluvial clay receiving the first monsoon raindrops, distilled into Mysore sandalwood.',
    gradient: 'from-[#FCE3D8] to-[#FAD4C0]',
    accent: '#D95D39'
  },
  {
    name: 'Ruh Gulab',
    english: 'Pure Damascena Rose',
    emoji: '🌹',
    origin: 'Aligarh & Hasayan',
    description: 'Hydro-distilled in traditional deg-bhapka copper stills before sunrise. Lush, deeply sweet, and celestial.',
    gradient: 'from-[#FFEBF2] to-[#FFD6E5]',
    accent: '#E86A92'
  },
  {
    name: 'Mysore Chandan',
    english: 'Sandalwood Heartwood',
    emoji: '🪵',
    origin: 'Karnataka',
    description: 'The ancient foundation of all royal Indian perfumery. Milky, serene, balsamic, and sacred.',
    gradient: 'from-[#FAF6F0] to-[#EEDDC6]',
    accent: '#B58A58'
  },
  {
    name: 'Ruh Khus',
    english: 'Wild Riverbed Vetiver',
    emoji: '🌿',
    origin: 'Rajasthan & Uttar Pradesh',
    description: 'Wild harvested vetiver roots imparting an emerald green, cooling petrichor with profound longevity.',
    gradient: 'from-[#EBFBFA] to-[#D8F8EE]',
    accent: '#55BFA3'
  },
  {
    name: 'Mogra & Chameli',
    english: 'Jasmine Sambac',
    emoji: '🌼',
    origin: 'Madurai, Tamil Nadu',
    description: 'Night-blooming blossoms radiating white floral intensity, worn in festive ceremonies and royal courtyards.',
    gradient: 'from-[#FFFBEB] to-[#FEF3C7]',
    accent: '#D97706'
  },
  {
    name: 'Kewda Attar',
    english: 'Pandanus Flower',
    emoji: '🌸',
    origin: 'Ganjam, Odisha',
    description: 'Exotic golden male inflorescence with a honeyed, fruity-herbaceous profile unique to coastal India.',
    gradient: 'from-[#FFF7ED] to-[#FFEDD5]',
    accent: '#EA580C'
  },
  {
    name: 'Kashmiri Zafran',
    english: 'Pampore Saffron Threads',
    emoji: '✨',
    origin: 'Pampore, Kashmir',
    description: 'Precious hand-plucked crimson stigmas imparting warmth, metallic luxury, and golden leather.',
    gradient: 'from-[#FEF2F2] to-[#FEE2E2]',
    accent: '#DC2626'
  },
  {
    name: 'Assam Dehn Al Oud',
    english: 'Pure Agarwood Oil',
    emoji: '🪵',
    origin: 'Upper Assam Rainforests',
    description: 'Aged wild resinous wood yielding complex, smoky, animalic, and deeply meditative aura.',
    gradient: 'from-[#F9F3FC] to-[#E9D9F3]',
    accent: '#7B3F98'
  }
];

export const IndianSoulSection: React.FC<IndianSoulSectionProps> = ({
  indianFragrances,
  onSelectIndianFragrance,
  onExploreKannaujAttars
}) => {
  const [selectedNoteFilter, setSelectedNoteFilter] = useState<string | null>(null);

  // Filter Indian fragrances by selected note or return top curated
  const displayedFrags = selectedNoteFilter
    ? indianFragrances.filter(f => {
        const allNotes = [...f.top_notes, ...f.middle_notes, ...f.base_notes].join(' ').toLowerCase();
        return allNotes.includes(selectedNoteFilter.toLowerCase());
      })
    : indianFragrances.slice(0, 6);

  return (
    <div id="indian-soul-section" className="space-y-8 pt-4">
      {/* Editorial Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F3] via-[#FAF0E6] to-[#F5E6D8] border border-[#F0E6DD] p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE0D2] text-[#90331A] text-[11px] font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Modern Indian Luxury &bull; Scent Heritage</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#292323] leading-tight">
            Indian Soul: The Cradle of Botanical Attars
          </h2>

          <p className="text-xs sm:text-sm text-[#786F6A] leading-relaxed max-w-2xl">
            From the 400-year-old copper stills of Kannauj to modern artisanal perfume houses in Mumbai and Delhi, Indian perfumery captures petrichor, wild roots, and sacred woods. Discover pure hydro-distilled oils and contemporary niche extraits.
          </p>
        </div>
      </div>

      {/* 8 Iconic Indian Heritage Notes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#292323]">
            Iconic Heritage Accords
          </h3>
          {selectedNoteFilter && (
            <button
              type="button"
              onClick={() => setSelectedNoteFilter(null)}
              className="text-xs text-[#D95D39] font-medium hover:underline cursor-pointer"
            >
              Clear filter ({selectedNoteFilter})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-stretch">
          {HERITAGE_NOTES.map((note) => {
            const isSelected = selectedNoteFilter === note.name;
            return (
              <button
                key={note.name}
                id={`heritage-note-${note.name.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => setSelectedNoteFilter(isSelected ? null : note.name)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-full transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#D95D39] shadow-md scale-[1.02] ring-2 ring-[#D95D39]/20'
                    : 'bg-white hover:bg-[#FAF9F6] border-[#F0E6DD] hover:border-[#D95D39]/50 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-2xl">{note.emoji}</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 truncate max-w-[110px]">
                      {note.origin}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#292323] leading-tight">
                    {note.name}
                  </h4>
                  <p className="text-[11px] text-[#786F6A] font-medium">
                    {note.english}
                  </p>
                </div>

                <p className="text-[11px] text-stone-500 line-clamp-2 mt-2 pt-2 border-t border-stone-100 leading-snug">
                  {note.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Indian Niche & Heritage Bottles Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#292323]">
              Curated Indian Niche &amp; Attar Creations
            </h3>
            <p className="text-xs text-[#786F6A]">
              Pair an oil-based Indian attar as an anchor base with an airy western eau de parfum.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {displayedFrags.map((frag) => (
            <div
              key={frag.id}
              className="bg-white rounded-2xl border border-[#F0E6DD] p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 min-h-[50px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#90331A] bg-[#FCE0D2] px-2 py-0.5 rounded-full border border-[#F4B097]">
                      {frag.format || 'Attar'} &bull; {frag.category || 'Indian Niche'}
                    </span>
                    <h4 className="font-serif text-xl font-medium text-[#292323] mt-1 leading-snug">
                      {frag.name}
                    </h4>
                    <p className="text-xs text-[#786F6A] font-medium">{frag.brand}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-[#FFF9F3] border border-[#F0E6DD] text-[#7B3F98] shrink-0">
                    ₹{frag.price_inr || frag.price_min || 'Curated'}
                  </span>
                </div>

                <p className="text-xs text-[#786F6A] line-clamp-2 leading-relaxed">
                  {frag.description}
                </p>

                <div className="space-y-1 text-xs pt-2 border-t border-stone-100">
                  <div className="text-stone-500 truncate">
                    <span className="font-medium text-[#292323]">Key Chords:</span> {[...frag.top_notes.slice(0, 2), ...frag.base_notes.slice(0, 1)].join(', ')}
                  </div>
                  <div className="text-stone-400 text-[11px] truncate">
                    Seasons: {frag.season.join(', ')}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#D95D39] font-medium">
                  {frag.is_oil_based ? 'Pure Oil Base' : 'Extrait / Spray'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectIndianFragrance(frag.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D95D39] to-[#F2A65A] hover:opacity-90 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Layer with this</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
