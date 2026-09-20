import React, { useState } from 'react';
import {
  Archive,
  ArrowRight,
  Eye,
  FlaskConical,
  Sparkles,
  Heart,
  Share2,
  Compass
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';

interface CabinetShelfStory {
  id: string;
  title: string;
  curator: string;
  curatorBadge: string;
  theme: string;
  description: string;
  fragranceIds: number[];
}

interface SocietyCabinetStoriesProps {
  allFragrances: Fragrance[];
  wardrobeFragrances?: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLab?: (fragA: Fragrance, fragB?: Fragrance) => void;
  onShareItem: (title: string, note: string) => void;
}

export const SocietyCabinetStories: React.FC<SocietyCabinetStoriesProps> = ({
  allFragrances,
  wardrobeFragrances = [],
  onInspectInChamber,
  onSendToLab,
  onShareItem,
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState<string>('monsoon');

  const cabinetStories: CabinetShelfStory[] = [
    {
      id: 'monsoon',
      title: 'My Monsoon Shelf',
      curator: 'Aarav Nose',
      curatorBadge: '🧪',
      theme: 'Petrichor, Rain-washed Roots & Steaming Spices',
      description: 'When the monsoon winds break over northern India, I retreat to these bottles. Mineral baked earth, smoky grassy roots, and skin musks that resist humid air.',
      fragranceIds: [33, 11, 6], // B680 Vetiver, Chai Musk, Mysore Sandalwood & Vetiver
    },
    {
      id: 'woods',
      title: 'The Woods I Return To',
      curator: 'Elena Perfumista',
      curatorBadge: '🌿',
      theme: 'Heartwood Sandalwood, Sacred Cedar & Smoky Guaiac',
      description: 'A sanctuary of sacred Indian woods. Creamy Santalum album distilled in Karnataka combined with smoky resinous bases that anchor contemplation.',
      fragranceIds: [6, 1, 5], // Mysore Sandalwood, Raw (Guaiac), Nox Oud
    },
    {
      id: 'heritage',
      title: 'My Heritage Corner',
      curator: 'Vikram S.',
      curatorBadge: '🏛️',
      theme: 'Traditional Hydro-distillations & Subcontinental Niche',
      description: 'Treasures of Indian perfumery: small-batch attars and modern artisanal extractions carrying centuries of botanical wisdom.',
      fragranceIds: [7, 33, 6], // Nargis, B680 Vetiver, Mysore Sandalwood
    },
    {
      id: 'first_five',
      title: 'My Foundational Five',
      curator: 'Rohan K.',
      curatorBadge: '🧭',
      theme: 'The Quintet That Built an Olfactory Vocabulary',
      description: 'The five flacons that taught me how to dissect top notes, observe slow drydowns, and master contrast layering.',
      fragranceIds: [1, 5, 11], // Raw, Nox Oud, Chai Musk
    },
  ];

  const activeStory = cabinetStories.find((s) => s.id === selectedStoryId) || cabinetStories[0];

  return (
    <div className="space-y-8">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-amber-400">
            <Archive className="w-3.5 h-3.5" />
            <span>Chapter V • Cabinet Stories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
            Curated Collector Shelves
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1 font-sans">
            Glimpses into private fragrance cabinets. Discover how seasoned collectors organize their flacons by mood, seasonal shift, and botanical heritage.
          </p>
        </div>

        {/* Shelf Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono-lab">
          {cabinetStories.map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setSelectedStoryId(story.id)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer whitespace-nowrap ${
                selectedStoryId === story.id
                  ? 'bg-amber-900/10 text-amber-900 border-amber-500/40 font-semibold'
                  : 'bg-white/60 text-[#7A6F66] border-[#E3DACB] hover:text-[#1A1613]'
              }`}
            >
              {story.title}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Cabinet Showcase */}
      <div className="rounded-3xl bg-[#14110E] border border-amber-500/25 p-6 sm:p-10 text-[#F8F5EE] shadow-2xl space-y-8">
        {/* Shelf Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base">{activeStory.curatorBadge}</span>
              <span className="text-xs font-serif text-amber-200 font-medium">
                Curated by {activeStory.curator}
              </span>
              <span className="text-[10px] font-mono-lab text-stone-400">• Private Cabinet</span>
            </div>
            <h3 className="font-serif text-3xl font-medium text-[#F8F5EE]">
              {activeStory.title}
            </h3>
            <p className="text-xs font-brand tracking-wider uppercase text-amber-400">
              {activeStory.theme}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onShareItem(
                `${activeStory.title} by ${activeStory.curator}`,
                activeStory.description
              )
            }
            aria-label="Share shelf story"
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-xs font-mono-lab border border-white/[0.08] transition cursor-pointer flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Shelf</span>
          </button>
        </div>

        {/* Narrative */}
        <p className="text-sm text-stone-300 leading-relaxed font-serif italic max-w-3xl">
          &ldquo;{activeStory.description}&rdquo;
        </p>

        {/* The Smoked Glass Shelf with Bottles */}
        <div className="relative pt-4 pb-8">
          {/* Wooden Shelf Baseline */}
          <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-r from-[#221B14] via-[#35291E] to-[#221B14] rounded-full border-t border-amber-500/30 shadow-lg" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {activeStory.fragranceIds.map((id) => {
              const frag = allFragrances.find((f) => f.id === id);
              if (!frag) return null;

              return (
                <div
                  key={frag.id}
                  className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] p-5 flex flex-col justify-between transition group backdrop-blur-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-lab text-amber-400/90 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {frag.fragrance_family}
                      </span>
                      <span className="text-[10px] font-mono-lab text-stone-400">
                        {frag.longevity || '8h'}
                      </span>
                    </div>

                    <div className="flex justify-center py-4">
                      <ScentBottle
                        name={frag.name}
                        brand={frag.brand_name || frag.brand}
                        family={frag.fragrance_family}
                        size="md"
                        showAura={false}
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="font-serif text-lg font-medium text-[#F8F5EE] group-hover:text-amber-300 transition">
                        {frag.name}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {frag.brand_name || frag.brand}
                      </p>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 italic font-serif leading-relaxed text-center">
                      &ldquo;{frag.description}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-2">
                    {onInspectInChamber && (
                      <button
                        type="button"
                        onClick={() => onInspectInChamber(frag)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 text-xs font-mono-lab border border-white/[0.08] transition cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Chamber</span>
                      </button>
                    )}

                    {onSendToLab && (
                      <button
                        type="button"
                        onClick={() => onSendToLab(frag)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-500/30 text-amber-200 text-xs font-mono-lab border border-amber-500/30 transition cursor-pointer flex items-center gap-1"
                      >
                        <FlaskConical className="w-3 h-3" />
                        <span>Layer</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User's Own Cabinet Status Callout */}
        {wardrobeFragrances.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                Your Private Cabinet holds <strong className="text-amber-300">{wardrobeFragrances.length}</strong> indexed flacons.
              </span>
            </div>
            <span className="text-[11px] font-mono-lab text-stone-400">
              Cabinet contents remain private to your atelier session.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
