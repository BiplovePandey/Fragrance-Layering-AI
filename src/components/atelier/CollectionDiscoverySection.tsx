import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { Fragrance } from '../../types.js';
import {
  DiscoveryCollectionId,
  computeCollectionCounts,
  getMarketedClassification
} from '../../utils/collectionClassification.js';
import {
  ForHimGlyph,
  ForHerGlyph,
  UnisexNicheGlyph
} from '../ui/AtelierGlyphs.js';
import { HeroFlacon } from './HeroFlacon.js';

interface CollectionDiscoverySectionProps {
  fragrances: Fragrance[];
  onExploreCollection: (collectionId: DiscoveryCollectionId) => void;
  onSelectFragranceForChamber?: (fragrance: Fragrance) => void;
}

export const CollectionDiscoverySection: React.FC<CollectionDiscoverySectionProps> = ({
  fragrances = [],
  onExploreCollection,
  onSelectFragranceForChamber
}) => {
  const counts = computeCollectionCounts(fragrances);

  // Retrieve actual representative flacons from the verified dataset
  const forHimSpecimen = fragrances.find((f) => getMarketedClassification(f) === 'masculine') || fragrances[0];
  const forHerSpecimen = fragrances.find((f) => getMarketedClassification(f) === 'feminine') || fragrances[1] || fragrances[0];
  const unisexSpecimen = fragrances.find((f) => getMarketedClassification(f) === 'unisex') || fragrances[2] || fragrances[0];

  const collections = [
    {
      id: 'for-him' as DiscoveryCollectionId,
      name: 'FOR HIM',
      subtitle: 'The Architectural & Aromatic',
      glyph: ForHimGlyph,
      count: counts['for-him'],
      specimen: forHimSpecimen,
      notesChord: 'Vetiver &bull; Smoked Cedar &bull; Ambergris',
      description:
        'Resonant woods, smoked resins, leather accords, and aromatic botanical greens. Structured compositions designed with architectural depth and presence.',
      cardBg: 'from-[#1C140E]/95 via-[#15100C]/90 to-[#0F0C09]/95',
      borderColor: 'border-amber-700/35 hover:border-amber-500/60',
      glowColor: 'bg-amber-700/15',
      badgeBg: 'bg-[#C28B45]/15 text-[#E6B87D] border-[#C28B45]/30',
      accentColor: 'text-[#D4AF37]',
      btnBg: 'bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 border-amber-600/40'
    },
    {
      id: 'for-her' as DiscoveryCollectionId,
      name: 'FOR HER',
      subtitle: 'The Luminous & Petal-Spun',
      glyph: ForHerGlyph,
      count: counts['for-her'],
      specimen: forHerSpecimen,
      notesChord: 'Damask Rose &bull; White Jasmine &bull; Warm Vanilla',
      description:
        'Luminous florals, warm ivory champagne notes, golden balsams, and velvety drydowns. Diaphanous compositions celebrated for radiance and emotional resonance.',
      cardBg: 'from-[#201417]/95 via-[#180F12]/90 to-[#100A0D]/95',
      borderColor: 'border-rose-700/35 hover:border-rose-400/60',
      glowColor: 'bg-rose-900/15',
      badgeBg: 'bg-rose-950/40 text-rose-200 border-rose-500/30',
      accentColor: 'text-rose-300',
      btnBg: 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border-rose-500/40'
    },
    {
      id: 'unisex-niche' as DiscoveryCollectionId,
      name: 'UNISEX & NICHE',
      subtitle: 'Beyond Boundaries & Conventions',
      glyph: UnisexNicheGlyph,
      count: counts['unisex-niche'],
      specimen: unisexSpecimen,
      notesChord: 'Kannauj Mitti &bull; Aged Sandalwood &bull; Pure Resins',
      description:
        'Ancient hydrodistillates, mineral monsoon petrichor, artisanal attars, and boundary-free haute parfumerie conceived purely for olfactory truth.',
      cardBg: 'from-[#121915]/95 via-[#0F1412]/90 to-[#0A0E0C]/95',
      borderColor: 'border-emerald-700/35 hover:border-emerald-500/60',
      glowColor: 'bg-emerald-900/15',
      badgeBg: 'bg-emerald-950/40 text-emerald-200 border-emerald-500/30',
      accentColor: 'text-emerald-300',
      btnBg: 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border-emerald-500/40'
    }
  ];

  return (
    <section
      aria-label="Find Your Fragrance World"
      className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#14100C]/95 via-[#0E0B09]/90 to-[#090706]/95 border border-white/[0.08] text-stone-200 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden space-y-8"
    >
      {/* Background Atmosphere Light */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-amber-600/10 via-rose-600/10 to-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-300 text-xs font-mono uppercase tracking-widest mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Core Discovery Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F5EE] font-medium tracking-tight">
            Find Your Fragrance World
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Explore scents by collection, character, and the way you want to feel. Fragrance is intensely personal — any perfume in our atelier can be worn and cherished by anyone.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onExploreCollection('all')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-stone-300 hover:text-white transition cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>View All {counts.all} Flacons</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* 3 Visually Distinctive Collection Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col) => {
          const GlyphComponent = col.glyph;
          return (
            <motion.div
              key={col.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-3xl p-6 bg-gradient-to-b ${col.cardBg} border ${col.borderColor} transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group`}
            >
              {/* Restrained Atmospheric Ambient Halo */}
              <div
                className={`absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl pointer-events-none -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 ${col.glowColor}`}
              />

              <div className="space-y-4">
                {/* Panel Top Meta & Custom Glyphs */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-stone-200 group-hover:border-amber-400/50 transition">
                      <GlyphComponent size={18} strokeWidth={1.4} className={col.accentColor} />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-stone-400">
                      Collection
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${col.badgeBg}`}>
                    {col.count} verified flacons
                  </span>
                </div>

                {/* Collection Title */}
                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-100 group-hover:text-amber-200 transition">
                    {col.name}
                  </h3>
                  <p className="text-[11px] font-mono text-stone-400 tracking-wide mt-0.5">
                    {col.subtitle}
                  </p>
                </div>

                {/* Editorial Description */}
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                  {col.description}
                </p>

                {/* Specimen Preview Card */}
                {col.specimen && (
                  <div className="pt-2">
                    <div
                      onClick={() => onSelectFragranceForChamber?.(col.specimen!)}
                      className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] hover:border-white/[0.15] transition cursor-pointer flex items-center gap-3 group/specimen"
                    >
                      <div className="w-12 h-14 shrink-0 flex items-center justify-center">
                        <HeroFlacon fragrance={col.specimen} size="mini" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400/90 block truncate">
                          Featured: {col.specimen.brand}
                        </span>
                        <div className="text-xs font-serif text-stone-200 group-hover/specimen:text-white truncate">
                          {col.specimen.name}
                        </div>
                        <div
                          className="text-[10px] text-stone-400 truncate mt-0.5"
                          dangerouslySetInnerHTML={{ __html: col.notesChord }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => onExploreCollection(col.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-2 border ${col.btnBg} shadow-sm`}
                >
                  <span>Explore {col.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
