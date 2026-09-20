import React from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  BookOpen,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { OlfactoryVector8D } from '../../services/olfactoryIntelligence.js';

interface HeritageAffinitiesProps {
  vector: OlfactoryVector8D;
  onNavigateToHeritageAtlas: (materialId?: string) => void;
}

interface HeritageMaterialAffinity {
  id: string;
  name: string;
  traditionalName: string;
  region: string;
  affinityScore: number;
  botanicalFamily: string;
  distillationType: string;
  description: string;
  matchingAxes: string[];
}

export const HeritageAffinities: React.FC<HeritageAffinitiesProps> = ({
  vector,
  onNavigateToHeritageAtlas
}) => {
  // Score heritage materials based on real vector dimensions
  const materials: HeritageMaterialAffinity[] = [
    {
      id: 'sandalwood',
      name: 'Mysore Sandalwood',
      traditionalName: 'Chandan',
      region: 'Karnataka',
      affinityScore: Math.round(vector.woody * 0.8 + vector.longevity_fixative * 0.2),
      botanicalFamily: 'Santalaceae (Santalum album)',
      distillationType: 'Traditional Hydro-Distillation in Deg-Bhapka',
      description: 'Velvety, milky heartwood containing upwards of 90% santalol isomers. Acts as the sacred fixative base upon which centuries of Indian perfumery rest.',
      matchingAxes: ['Woody Anchor', 'Longevity Fixative']
    },
    {
      id: 'mitti',
      name: 'Baked Earth Attar',
      traditionalName: 'Mitti Attar (Gil-e-Hikmat)',
      region: 'Kannauj, Uttar Pradesh',
      affinityScore: Math.round(vector.earthy_clay * 0.85 + (100 - vector.sweetness) * 0.15),
      botanicalFamily: 'Baked Alluvial Terracotta Clay',
      distillationType: 'Closed Copper Deg Distillation into Sandalwood Receiver',
      description: 'The smell of the parched Indian soil kissed by first monsoon showers. High concentration of geosmin trapped in creamy sandalwood oil.',
      matchingAxes: ['Earthy / Baked Clay', 'Low Sweetness']
    },
    {
      id: 'ruh_khus',
      name: 'Wild Green Vetiver',
      traditionalName: 'Ruh Khus (Desi Khus)',
      region: 'Bharatpur & Kannauj',
      affinityScore: Math.round(vector.earthy_clay * 0.5 + vector.freshness * 0.5),
      botanicalFamily: 'Poaceae (Chrysopogon zizanioides)',
      distillationType: 'Slow Direct-Fired Copper Deg Hydro-Distillation',
      description: 'Deep forest-emerald oil distilled from nocturnal tangled roots. Unmatched cooling psychological relief against intense summer heat.',
      matchingAxes: ['Freshness', 'Earthy Loam']
    },
    {
      id: 'damask_rose',
      name: 'Kannauj Damask Rose',
      traditionalName: 'Ruh Gulab',
      region: 'Kannauj & Hasayan',
      affinityScore: Math.round(vector.floral * 0.8 + vector.freshness * 0.2),
      botanicalFamily: 'Rosaceae (Rosa damascena)',
      distillationType: 'Dawn-Picked Direct Hydro-Distillation',
      description: 'Over 4,000 kilograms of freshly gathered dawn petals yield a single kilogram of pure rooh. Intensely radiant, honeyed, and spiritual.',
      matchingAxes: ['Floral Delicacy', 'Fresh Dew']
    },
    {
      id: 'shamama',
      name: 'Spiced Herbal Complex',
      traditionalName: 'Shamamat-ul-Amber',
      region: 'Kannauj, Uttar Pradesh',
      affinityScore: Math.round(vector.warm_resinous_spices * 0.75 + vector.woody * 0.25),
      botanicalFamily: 'Multi-Botanical Heritage Compound (40+ Herbs)',
      distillationType: 'Sequential Multi-Stage Distillation over Days',
      description: 'The crowning alchemical masterpiece of Kannauj: saffron, cinnamon, musk ambrette, and subterranean barks co-distilled into sandalwood.',
      matchingAxes: ['Warm Spices', 'Woody Resin']
    },
    {
      id: 'oudh',
      name: 'Assam Wild Agarwood',
      traditionalName: 'Dehn al Oudh (Hindi Oudh)',
      region: 'Upper Assam',
      affinityScore: Math.round(vector.woody * 0.5 + vector.warm_resinous_spices * 0.5),
      botanicalFamily: 'Thymelaeaceae (Aquilaria agallocha)',
      distillationType: 'Fermented Heartwood Hydro-Distillation',
      description: 'Resinated heartwood produced naturally when wild Aquilaria trees defend against fungal inoculation. Profound, smoky, leather-warm.',
      matchingAxes: ['Woody Heartwood', 'Smoky Resin']
    }
  ].sort((a, b) => b.affinityScore - a.affinityScore);

  const topHeritage = materials[0];

  return (
    <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl text-[#FAF5F0] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3228] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D97706] border border-[#3E3228] text-xs font-mono-lab uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Chapter IX • Heritage Affinities</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#FAF5F0] font-medium tracking-tight">
            Indian Heritage Material Affinities
          </h2>
          <p className="text-xs sm:text-sm text-[#A8988B] mt-1 max-w-xl">
            A bridge between your personal scent profile and the 5,000-year living history of Indian Deg-Bhapka botanical distillation.
          </p>
        </div>

        <button
          onClick={() => onNavigateToHeritageAtlas()}
          className="px-4 py-2 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#FEF3C7] text-xs font-mono-lab uppercase tracking-wider border border-[#3E3228] transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Open Heritage Atlas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary Heritage Affinity Plaque */}
      {topHeritage && (
        <div className="rounded-2xl bg-gradient-to-r from-[#2B1B12] via-[#20140D] to-[#140E0A] border border-[#6E421E] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#D97706]">
              Your Primary Heritage Kinship ({topHeritage.affinityScore}% Vector Alignment)
            </span>
            <span className="flex items-center gap-1 text-xs font-mono-lab text-[#A8988B]">
              <MapPin className="w-3 h-3 text-[#D97706]" />
              <span>{topHeritage.region}</span>
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5F0] font-medium">
              {topHeritage.name} ({topHeritage.traditionalName})
            </h3>
            <div className="text-xs font-mono-lab text-[#F59E0B]">
              {topHeritage.botanicalFamily} &bull; {topHeritage.distillationType}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#E6DACB] leading-relaxed max-w-3xl">
            {topHeritage.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToHeritageAtlas(topHeritage.id)}
              className="px-4 py-2 rounded-xl bg-[#B45309] hover:bg-[#D97706] text-white text-xs font-mono-lab uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
            >
              <span>Explore {topHeritage.traditionalName} in Atlas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Heritage Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {materials.slice(1).map((mat) => (
          <div
            key={mat.id}
            className="p-5 rounded-2xl bg-[#1C1612] border border-[#3E3228] flex flex-col justify-between space-y-3 hover:border-[#5A402D] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C7D70] font-mono-lab text-[10px] uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D97706]" />
                  {mat.region}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#241B16] text-[#F59E0B] font-mono-lab text-[10px] font-semibold">
                  {mat.affinityScore}%
                </span>
              </div>

              <h4 className="font-serif text-lg text-[#FAF5F0] font-medium mt-2">
                {mat.name}
              </h4>
              <div className="text-xs font-mono-lab text-[#D97706]">
                {mat.traditionalName}
              </div>

              <p className="text-xs text-[#A8988B] mt-2 leading-relaxed line-clamp-3">
                {mat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#2E241D] flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {mat.matchingAxes.map((axis) => (
                  <span
                    key={axis}
                    className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono-lab text-[#C8BAAB]"
                  >
                    {axis}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onNavigateToHeritageAtlas(mat.id)}
                className="p-1.5 rounded-lg bg-[#241B16] hover:bg-[#34261F] text-[#FEF3C7] border border-[#3E3228] transition-colors"
                title={`Open ${mat.name} in Heritage Atlas`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
