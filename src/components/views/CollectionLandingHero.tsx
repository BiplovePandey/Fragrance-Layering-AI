import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Layers,
  Building2,
  Droplet,
  Eye,
  FlaskConical,
  Award
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import {
  DiscoveryCollectionId,
  DISCOVERY_COLLECTIONS,
  getMarketedClassification
} from '../../utils/collectionClassification.js';
import {
  ForHimGlyph,
  ForHerGlyph,
  UnisexNicheGlyph
} from '../ui/AtelierGlyphs.js';
import { HeroFlacon } from '../atelier/HeroFlacon.js';

interface CollectionLandingHeroProps {
  collectionId: DiscoveryCollectionId;
  collectionFragrances: Fragrance[];
  onSelectFamily: (fam: string) => void;
  onSelectBrand: (brand: string) => void;
  onSelectConcentration: (concentration: string) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLab: (frag: Fragrance) => void;
  onViewCatalog: () => void;
}

export const CollectionLandingHero: React.FC<CollectionLandingHeroProps> = ({
  collectionId,
  collectionFragrances,
  onSelectFamily,
  onSelectBrand,
  onSelectConcentration,
  onSelectFragranceForChamber,
  onSendToLab,
  onViewCatalog
}) => {
  if (collectionId === 'all') return null;

  const config = DISCOVERY_COLLECTIONS[collectionId];
  if (!config) return null;

  // Real data metrics derived strictly from actual catalogue records
  const totalInCollection = collectionFragrances.length;

  // Fragrance families in this collection
  const familyCounts = useMemo(() => {
    const map = new Map<string, number>();
    collectionFragrances.forEach((f) => {
      const fam = f.fragrance_family?.split(' ')[0] || f.fragrance_family || 'Other';
      map.set(fam, (map.get(fam) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([family, count]) => ({ family, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [collectionFragrances]);

  // Featured Brands / Houses in this collection
  const topHouses = useMemo(() => {
    const map = new Map<string, number>();
    collectionFragrances.forEach((f) => {
      if (f.brand) map.set(f.brand, (map.get(f.brand) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [collectionFragrances]);

  // Concentrations in this collection
  const concentrations = useMemo(() => {
    const map = new Map<string, number>();
    collectionFragrances.forEach((f) => {
      const conc = f.concentration?.split(' ')[0] || f.format || 'EDP';
      map.set(conc, (map.get(conc) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([conc, count]) => ({ conc, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [collectionFragrances]);

  // Indian Heritage fragrances in this collection
  const indianHeritageFrags = useMemo(() => {
    return collectionFragrances.filter((f) => {
      const b = (f.brand_country || '').toLowerCase();
      const name = (f.name || '').toLowerCase();
      const desc = (f.description || '').toLowerCase();
      return (
        b.includes('india') ||
        f.format === 'Attar' ||
        f.is_oil_based ||
        name.includes('attar') ||
        desc.includes('kannauj') ||
        ['SKINN by Titan', 'Forest Essentials', 'Bombay Perfumery', 'Gulabsingh Johrimal', 'Nasheman Kannauj', 'Muzna Fragrances', 'Kastoor', 'Ismail Koya'].includes(f.brand)
      );
    });
  }, [collectionFragrances]);

  // Featured real fragrances (up to 3 specimens)
  const featuredFragrances = useMemo(() => {
    return collectionFragrances.slice(0, 3);
  }, [collectionFragrances]);

  // Glyph selection
  const GlyphComponent =
    collectionId === 'for-him'
      ? ForHimGlyph
      : collectionId === 'for-her'
      ? ForHerGlyph
      : UnisexNicheGlyph;

  // Visual Atmosphere styling based on collection art direction
  const styling = useMemo(() => {
    switch (collectionId) {
      case 'for-him':
        return {
          bannerBg: 'from-[#1E1510]/95 via-[#16110D]/95 to-[#0F0B09]/95',
          bannerBorder: 'border-amber-700/40',
          glow: 'bg-amber-700/20',
          accentText: 'text-[#E6B87D]',
          badgeBorder: 'border-amber-600/30',
          badgeBg: 'bg-amber-950/50',
          btnBg: 'bg-[#C28B45]/20 hover:bg-[#C28B45]/30 text-amber-200 border-[#C28B45]/50'
        };
      case 'for-her':
        return {
          bannerBg: 'from-[#221519]/95 via-[#190F14]/95 to-[#120B0E]/95',
          bannerBorder: 'border-rose-700/40',
          glow: 'bg-rose-900/20',
          accentText: 'text-rose-200',
          badgeBorder: 'border-rose-500/30',
          badgeBg: 'bg-rose-950/50',
          btnBg: 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 border-rose-400/50'
        };
      case 'unisex-niche':
      default:
        return {
          bannerBg: 'from-[#111A16]/95 via-[#0E1511]/95 to-[#0A0F0D]/95',
          bannerBorder: 'border-emerald-700/40',
          glow: 'bg-emerald-900/20',
          accentText: 'text-emerald-200',
          badgeBorder: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-950/50',
          btnBg: 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border-emerald-400/50'
        };
    }
  }, [collectionId]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label={config.landingHeadline}
      className={`rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-b ${styling.bannerBg} border ${styling.bannerBorder} text-stone-200 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-8`}
    >
      {/* Ambient Backlight Halo */}
      <div
        className={`absolute -top-24 right-1/4 w-96 h-96 rounded-full blur-[110px] pointer-events-none -z-10 opacity-60 ${styling.glow}`}
      />

      {/* Cinematic Hero Dossier */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center">
              <GlyphComponent size={18} strokeWidth={1.4} className={styling.accentText} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Editorial Collection Landing &bull; {config.label}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${styling.badgeBorder} ${styling.badgeBg} text-stone-300`}>
              {totalInCollection} Verified Flacons
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#F8F5EE] tracking-tight leading-tight">
            {config.landingHeadline}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
            {config.landingEditorial}
          </p>

          <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Catalogue Positioning Metadata &bull; Open &amp; wearable by every patron</span>
          </div>
        </div>

        {/* View Full Collection Button */}
        <div className="self-start lg:self-center shrink-0 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onViewCatalog}
            className={`px-5 py-3 rounded-2xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-2 border ${styling.btnBg} shadow-md`}
          >
            <span>Explore Complete {config.label}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Featured Real Flacons from this Collection */}
      {featuredFragrances.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured in the Atelier</span>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              Verified catalogue records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredFragrances.map((frag) => (
              <div
                key={frag.id}
                className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] hover:border-white/[0.2] transition flex flex-col justify-between group/card"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-amber-300">
                      {frag.brand}
                    </span>
                    <span className="text-[9px] font-mono text-stone-400">
                      {frag.concentration || 'EDP'}
                    </span>
                  </div>

                  <div className="h-24 py-2 flex items-center justify-center">
                    <HeroFlacon fragrance={frag} size="mini" />
                  </div>

                  <h4 className="font-serif text-lg font-medium text-stone-100 group-hover/card:text-amber-200 transition mt-2 truncate">
                    {frag.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 font-sans line-clamp-1 mt-0.5">
                    {frag.fragrance_family}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectFragranceForChamber(frag)}
                    className="text-xs font-mono text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chamber</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendToLab(frag)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-mono transition cursor-pointer flex items-center gap-1"
                  >
                    <FlaskConical className="w-3 h-3" />
                    <span>Layer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discovery Facets Exploration (Families, Houses, Concentrations & Heritage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Fragrance Families */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Layers className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Fragrance Families</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {familyCounts.map(({ family, count }) => (
              <button
                key={family}
                type="button"
                onClick={() => onSelectFamily(family)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-stone-300 hover:text-white transition cursor-pointer"
              >
                <span>{family}</span>
                <span className="ml-1 text-stone-500">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Houses & Brands */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Building2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Featured Houses</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topHouses.map(({ brand, count }) => (
              <button
                key={brand}
                type="button"
                onClick={() => onSelectBrand(brand)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-stone-300 hover:text-white transition cursor-pointer truncate max-w-[140px]"
                title={brand}
              >
                <span className="truncate">{brand}</span>
                <span className="ml-1 text-stone-500">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formats & Concentrations */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Droplet className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Concentrations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {concentrations.map(({ conc, count }) => (
              <button
                key={conc}
                type="button"
                onClick={() => onSelectConcentration(conc)}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-stone-300 hover:text-white transition cursor-pointer"
              >
                <span>{conc}</span>
                <span className="ml-1 text-stone-500">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Indian Heritage Connection */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Indian Heritage</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            {indianHeritageFrags.length} flacons in this collection represent verified Indian botanical perfumery and Kannauj heritage stills.
          </p>
          <div className="text-[10px] font-mono text-amber-400">
            {indianHeritageFrags.slice(0, 2).map((f) => f.name).join(' &bull; ')}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
