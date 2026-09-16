import React from 'react';
import { UserPreferences, Fragrance, SavedCombination } from '../types.js';
import { determinePersonality } from '../theme.js';
import { Sparkles, Award, Compass, Heart, Share2, Wine, Bookmark, ArrowRight } from 'lucide-react';

interface ScentProfileViewProps {
  preferences: UserPreferences;
  savedCombinations: SavedCombination[];
  ownedFragrances: number[];
  allFragrances: Fragrance[];
  onExploreLayering: () => void;
}

interface ExplorerBadge {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  unlocked: boolean;
  bgGradient: string;
  borderColor: string;
}

export const ScentProfileView: React.FC<ScentProfileViewProps> = ({
  preferences,
  savedCombinations,
  ownedFragrances,
  allFragrances,
  onExploreLayering
}) => {
  // Compute profile distribution based on preferences and saved/owned fragrances
  const floralWeight = preferences.favorite_family.some(f => f.toLowerCase().includes('floral')) ? 85 : 62;
  const woodyWeight = preferences.favorite_family.some(f => f.toLowerCase().includes('wood')) ? 88 : 74;
  const sweetWeight = Math.min(100, preferences.sweetness * 10 + 15);
  const freshWeight = Math.min(100, preferences.freshness * 10 + 10);
  const intensityWeight = Math.min(100, preferences.intensity * 10);
  const earthyWeight = preferences.preferred_notes.some(n => ['Mitti', 'Khus', 'Vetiver'].includes(n)) ? 90 : 68;

  const personality = determinePersonality({
    floral: floralWeight,
    woody: woodyWeight,
    sweet: sweetWeight,
    fresh: freshWeight,
    spicy: Math.round((sweetWeight + intensityWeight) / 2),
    earthy: earthyWeight
  });

  const discoveredCount = Math.max(allFragrances.length, 24);
  const indianCount = allFragrances.filter(f => f.is_indian_house).length;
  const uniqueNotes = Array.from(
    new Set(allFragrances.flatMap(f => f ? [...(f.top_notes || []), ...(f.middle_notes || []), ...(f.base_notes || [])] : []))
  ).length;

  const badges: ExplorerBadge[] = [
    {
      id: 'indian_explorer',
      name: 'Indian Fragrance Explorer',
      emoji: '🇮🇳',
      category: 'Heritage',
      description: 'Explored hydro-distilled Kannauj Mitti and royal Mysore sandalwood accords.',
      unlocked: true,
      bgGradient: 'from-[#FFF7ED] to-[#FFE8D1]',
      borderColor: '#D95D39'
    },
    {
      id: 'layering_master',
      name: 'Layering Alchemist',
      emoji: '🧪',
      category: 'Ritual',
      description: 'Calculated and saved multi-chord fragrance pairings with >90% harmony.',
      unlocked: savedCombinations.length > 0 || ownedFragrances.length >= 2,
      bgGradient: 'from-[#F9F3FC] to-[#E9D9F3]',
      borderColor: '#7B3F98'
    },
    {
      id: 'floral_lover',
      name: 'Petal & Sillage Lover',
      emoji: '🌹',
      category: 'Accord',
      description: 'Appreciates delicate morning Damascena roses and sambac jasmine notes.',
      unlocked: floralWeight > 70,
      bgGradient: 'from-[#FFEBF2] to-[#FFD6E5]',
      borderColor: '#E86A92'
    },
    {
      id: 'oud_explorer',
      name: 'Deep Oud Connoisseur',
      emoji: '🪵',
      category: 'Precious Woods',
      description: 'Investigated ancient Assam agarwood, aged resins, and balsamic woods.',
      unlocked: woodyWeight > 75,
      bgGradient: 'from-[#FAF6F0] to-[#EEDDC6]',
      borderColor: '#B58A58'
    },
    {
      id: 'global_nose',
      name: 'Global Cross-Cultural Nose',
      emoji: '🌎',
      category: 'World Perfumery',
      description: 'Seamlessly bridged Indian botanical attars with French and niche extraits.',
      unlocked: true,
      bgGradient: 'from-[#EBFBFA] to-[#D8F8EE]',
      borderColor: '#55BFA3'
    }
  ];

  return (
    <div id="scent-profile-view" className="space-y-8 animate-fade-in">
      {/* Spotify Wrapped-Style Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7B3F98] via-[#8E44AD] to-[#E86A92] text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-[#F2A65A]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 translate-y-12 w-48 h-48 bg-[#55BFA3]/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-200 text-xs font-semibold uppercase tracking-widest backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Spotify Wrapped &bull; Olfactory Edition</span>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="text-5xl sm:text-6xl p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              {personality.emoji}
            </span>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-200 font-bold block">
                Your Fragrance Archetype
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
                {personality.title}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-sans">
            {personality.tagline}. {personality.paletteDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/15 text-white/90">
              <span className="text-white/60">Signature Chords:</span> <strong className="text-amber-200">{personality.signatureChords}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/15 text-white/90">
              <span className="text-white/60">Core Mood:</span> <strong className="text-white">{preferences.occasion} in {preferences.season}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Radar / Bars on Left, Explorer Milestones on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Scent Dimension Breakdown */}
        <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0E6DD] pb-3">
            <div>
              <h3 className="font-serif text-2xl font-medium text-[#292323]">
                Your Scent Palette Breakdown
              </h3>
              <p className="text-xs text-[#786F6A]">
                Mathematical calibration across 6 key olfactory spectra
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#7B3F98] bg-[#F9F3FC] px-2.5 py-1 rounded-full border border-[#E9D9F3]">
              8D Normalized
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292323]">
                <span className="flex items-center gap-1.5">
                  <span>🌹</span>
                  <span>Floral (Damask Rose, Mogra, Neroli)</span>
                </span>
                <span className="font-mono text-[#E86A92]">{floralWeight}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD6E5] to-[#E86A92] transition-all duration-700"
                  style={{ width: `${floralWeight}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292323]">
                <span className="flex items-center gap-1.5">
                  <span>🪵</span>
                  <span>Woody (Sandalwood, Cedar, Oudh)</span>
                </span>
                <span className="font-mono text-[#B58A58]">{woodyWeight}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#EEDDC6] to-[#B58A58] transition-all duration-700"
                  style={{ width: `${woodyWeight}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292323]">
                <span className="flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>Fresh &amp; Citrus (Bergamot, Mint, Tea)</span>
                </span>
                <span className="font-mono text-[#55BFA3]">{freshWeight}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D8F8EE] to-[#55BFA3] transition-all duration-700"
                  style={{ width: `${freshWeight}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292323]">
                <span className="flex items-center gap-1.5">
                  <span>🍯</span>
                  <span>Sweet &amp; Gourmand (Bourbon Vanilla, Amber)</span>
                </span>
                <span className="font-mono text-[#F2A65A]">{sweetWeight}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFE8D1] to-[#F2A65A] transition-all duration-700"
                  style={{ width: `${sweetWeight}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#292323]">
                <span className="flex items-center gap-1.5">
                  <span>🌧️</span>
                  <span>Earthy &amp; Petrichor (Mitti Attar, Ruh Khus)</span>
                </span>
                <span className="font-mono text-[#D95D39]">{earthyWeight}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FCE3D8] to-[#D95D39] transition-all duration-700"
                  style={{ width: `${earthyWeight}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scent Explorer Stats & Cabinet Snapshot */}
        <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-[#F0E6DD] pb-3">
              <h3 className="font-serif text-2xl font-medium text-[#292323]">
                Scent Explorer Milestones
              </h3>
              <p className="text-xs text-[#786F6A]">
                Your journey through world and Indian botanical perfumery
              </p>
            </div>

            {/* 4 Big Numbers Bento Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD]">
                <span className="text-3xl font-serif font-bold text-[#7B3F98]">
                  {discoveredCount}
                </span>
                <div className="text-xs font-bold text-[#292323] mt-1">
                  Fragrances In Matrix
                </div>
                <div className="text-[11px] text-[#786F6A]">
                  Across global &amp; Indian catalog
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD]">
                <span className="text-3xl font-serif font-bold text-[#D95D39]">
                  {indianCount}
                </span>
                <div className="text-xs font-bold text-[#292323] mt-1">
                  Indian Heritage Houses
                </div>
                <div className="text-[11px] text-[#786F6A]">
                  Kannauj, Mumbai &amp; Delhi
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD]">
                <span className="text-3xl font-serif font-bold text-[#55BFA3]">
                  {uniqueNotes}
                </span>
                <div className="text-xs font-bold text-[#292323] mt-1">
                  Notes Mapped
                </div>
                <div className="text-[11px] text-[#786F6A]">
                  In olfactory chord vectors
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-[#F0E6DD]">
                <span className="text-3xl font-serif font-bold text-[#E86A92]">
                  {savedCombinations.length}
                </span>
                <div className="text-xs font-bold text-[#292323] mt-1">
                  Saved Rituals
                </div>
                <div className="text-[11px] text-[#786F6A]">
                  In personal vault
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-[#786F6A]">
              Ready to create a new signature combination?
            </span>
            <button
              type="button"
              onClick={onExploreLayering}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B3F98] to-[#E86A92] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-90 transition-all"
            >
              <span>Compose Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Badges Unlocked Showcase */}
      <div className="bg-white rounded-3xl border border-[#F0E6DD] p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9D6F5] text-[#5B2186] text-[11px] font-semibold tracking-wider uppercase mb-1">
            <Award className="w-3.5 h-3.5 text-[#7B3F98]" />
            <span>Gamified Explorer Badges</span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#292323]">
            Olfactory Badges &amp; Masteries
          </h3>
          <p className="text-xs text-[#786F6A]">
            Unlocked as you sample chords, save pairings, and discover heritage botanicals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 items-stretch">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between h-full transition-all duration-200 ${
                badge.unlocked
                  ? `bg-gradient-to-br ${badge.bgGradient} shadow-2xs`
                  : 'bg-stone-50 border-stone-200 opacity-50 grayscale'
              }`}
              style={{ borderColor: badge.unlocked ? badge.borderColor : undefined }}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{badge.emoji}</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-white/80 text-stone-700 font-bold border border-white">
                    {badge.category}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#292323] leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[11px] text-[#786F6A] leading-snug">
                  {badge.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                <span className="font-mono text-stone-500">Status</span>
                <span className={`font-bold ${badge.unlocked ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {badge.unlocked ? '✓ Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
