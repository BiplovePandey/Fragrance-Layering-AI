import React, { useState } from 'react';
import {
  Layers,
  FlaskConical,
  Bot,
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Clock,
  Droplets,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { CommunityRecipe, Fragrance } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';
import { ScoreBadge } from '../ui/ScoreBadge.js';

interface SocietyLayeringChordsProps {
  recipes: CommunityRecipe[];
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  onOpenRemix: (recipe: CommunityRecipe) => void;
  onUpvoteRecipe: (id: string) => void;
  onOpenComments: (targetId: string, title: string) => void;
  onShareChord: (title: string, chordNotes: string) => void;
  onInspectInChamber?: (fragrance: Fragrance) => void;
}

export const SocietyLayeringChords: React.FC<SocietyLayeringChordsProps> = ({
  recipes,
  onSendToLab,
  onOpenRemix,
  onUpvoteRecipe,
  onOpenComments,
  onShareChord,
  onInspectInChamber,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [savedChords, setSavedChords] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('society_saved_chords');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleSave = (id: string) => {
    setSavedChords((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('society_saved_chords', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const filteredRecipes = recipes.filter((r) => {
    if (selectedSeason === 'all') return true;
    if (selectedSeason === 'saved') return savedChords[r.id];
    return r.season?.toLowerCase().includes(selectedSeason.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-amber-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Chapter IV • The Society's Chords</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
            Peer-Tested Alchemical Pairings
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1 font-sans">
            Combinations crafted by Master Noses. Each chord documents the base anchor, volatile diffusion spark, application ratio, and evaporation rhythm.
          </p>
        </div>

        {/* Season Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono-lab">
          {[
            { id: 'all', label: `All Chords (${recipes.length})` },
            { id: 'monsoon', label: 'Monsoon' },
            { id: 'summer', label: 'Summer' },
            { id: 'spring', label: 'Spring' },
            { id: 'winter', label: 'Winter' },
            { id: 'saved', label: 'Bookmarked' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedSeason(tab.id)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer whitespace-nowrap ${
                selectedSeason === tab.id
                  ? 'bg-amber-900/10 text-amber-900 border-amber-500/40 font-semibold'
                  : 'bg-white/60 text-[#7A6F66] border-[#E3DACB] hover:text-[#1A1613]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chords Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => {
          const isSaved = savedChords[recipe.id];
          const likesCount = recipe.upvotes ?? recipe.likes ?? 0;

          return (
            <div
              key={recipe.id}
              className="rounded-3xl bg-[#14110E] border border-amber-500/25 p-6 sm:p-7 text-[#F8F5EE] shadow-xl flex flex-col justify-between group hover:border-amber-500/45 transition"
            >
              <div className="space-y-4">
                {/* Author Calling Card & Compatibility Score */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{recipe.author_badge || '🧪'}</span>
                    <div>
                      <span className="font-serif text-sm font-medium text-amber-200 block leading-tight">
                        {recipe.author_name || recipe.author}
                      </span>
                      <span className="text-[10px] font-mono-lab text-stone-400">
                        {recipe.author_level || 'Society Nose'}
                      </span>
                    </div>
                  </div>

                  <ScoreBadge
                    score={recipe.compatibility_score}
                    type="compatibility"
                    size="sm"
                  />
                </div>

                {/* Chord Title & Identity */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-lab text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {recipe.season || 'All Seasons'}
                    </span>
                    <span className="text-[10px] font-mono-lab text-stone-400">
                      {recipe.occasion || 'Signature Wear'}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#F8F5EE] group-hover:text-amber-300 transition mt-1.5">
                    {recipe.chord_name}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-mono-lab mt-0.5">
                    {recipe.title}
                  </p>
                </div>

                {/* Duo Flacon Showcase: Flacon A + Flacon B */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <div className="grid grid-cols-2 gap-3 items-center">
                    {/* Flacon B: Base Anchor */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-3">
                      <div className="shrink-0">
                        <ScentBottle
                          name={recipe.fragrance_b?.name}
                          brand={recipe.fragrance_b?.brand}
                          family={recipe.fragrance_b?.fragrance_family}
                          size="sm"
                          showAura={false}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono-lab text-stone-400 uppercase block">
                          Base Anchor (Layer 1)
                        </span>
                        <h4 className="font-serif text-sm font-medium text-amber-200 truncate">
                          {recipe.fragrance_b?.name || 'Anchor'}
                        </h4>
                        <p className="text-[10px] text-stone-400 truncate">
                          {recipe.fragrance_b?.brand}
                        </p>
                      </div>
                    </div>

                    {/* Flacon A: Diffusion Spark */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center gap-3">
                      <div className="shrink-0">
                        <ScentBottle
                          name={recipe.fragrance_a?.name}
                          brand={recipe.fragrance_a?.brand}
                          family={recipe.fragrance_a?.fragrance_family}
                          size="sm"
                          showAura={false}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono-lab text-stone-400 uppercase block">
                          Diffusion Spark (Layer 2)
                        </span>
                        <h4 className="font-serif text-sm font-medium text-rose-200 truncate">
                          {recipe.fragrance_a?.name || 'Spark'}
                        </h4>
                        <p className="text-[10px] text-stone-400 truncate">
                          {recipe.fragrance_a?.brand}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ratio & Application Sequence */}
                  <div className="text-[11px] font-mono-lab text-stone-300 space-y-1 pt-1 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-amber-300/90">
                      <Droplets className="w-3 h-3 text-amber-400" />
                      <span>Ratio: {recipe.ratio}</span>
                    </div>
                    {recipe.spray_order && (
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Wait Time: {recipe.wait_time || '45 seconds'} • {recipe.spray_order}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Perfumer Review / Experience */}
                <p className="text-xs text-stone-300 leading-relaxed italic font-serif p-2">
                  &ldquo;{recipe.review || recipe.description}&rdquo;
                </p>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                {/* Subtle aged brass social interactions */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onUpvoteRecipe(recipe.id)}
                    aria-label={`Resonate with chord ${recipe.chord_name}`}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        recipe.has_liked ? 'fill-amber-400 text-amber-400' : 'text-stone-400'
                      }`}
                    />
                    <span className="font-mono-lab text-[11px]">{likesCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenComments(
                        recipe.id,
                        `${recipe.chord_name} (${recipe.title})`
                      )
                    }
                    aria-label="Discuss chord in salon"
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono-lab text-[11px]">Reflect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSave(recipe.id)}
                    aria-label="Bookmark chord"
                    className={`p-1 text-xs transition cursor-pointer ${
                      isSaved ? 'text-amber-400' : 'text-stone-400 hover:text-amber-300'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onShareChord(
                        `Chord: ${recipe.chord_name}`,
                        `${recipe.ratio} • ${recipe.review}`
                      )
                    }
                    aria-label="Share chord formula citation"
                    className="p-1 text-xs text-stone-400 hover:text-amber-300 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Atelier Actions: AI Remix & Try in Lab */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenRemix(recipe)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 hover:text-amber-300 text-xs font-mono-lab border border-white/[0.08] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Bot className="w-3.5 h-3.5 text-teal-400" />
                    <span>AI Remix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSendToLab(recipe.fragrance_a, recipe.fragrance_b)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs font-mono-lab shadow-md shadow-amber-900/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Try in Lab</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
