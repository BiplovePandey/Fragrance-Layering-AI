import React, { useState, useEffect } from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Landmark,
  Layers,
  Archive,
  Users
} from 'lucide-react';
import { Fragrance, CommunityRecipe, WeatherCondition } from '../../types.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';
import { ScentBottle } from '../ui/ScentBottle.js';
import { ScoreBadge } from '../ui/ScoreBadge.js';

export type SocietySectionTab =
  | 'salon'
  | 'journal'
  | 'discoveries'
  | 'chords'
  | 'cabinets'
  | 'heritage'
  | 'people'
  | 'contribute';

interface SocietySalonHeroProps {
  activeSection: SocietySectionTab;
  onSelectSection: (tab: SocietySectionTab) => void;
  featuredChord: CommunityRecipe;
  featuredFragrance: Fragrance;
  weather: WeatherCondition;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onExploreHeritage?: () => void;
}

export const SocietySalonHero: React.FC<SocietySalonHeroProps> = ({
  activeSection,
  onSelectSection,
  featuredChord,
  featuredFragrance,
  weather,
  onSendToLab,
  onInspectInChamber,
  onExploreHeritage,
}) => {
  const [isPlaying, setIsPlaying] = useState(ambientAudioEngine.isPlaying());
  const [activeSoundscape, setActiveSoundscape] = useState(ambientAudioEngine.getActiveSoundscape());

  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setIsPlaying(ambientAudioEngine.isPlaying());
      setActiveSoundscape(ambientAudioEngine.getActiveSoundscape());
    });
    return unsub;
  }, []);

  const handleToggleSound = () => {
    if (!isPlaying) {
      ambientAudioEngine.startSoundscape(activeSoundscape === 'none' ? 'temple_breeze' : activeSoundscape);
    } else {
      ambientAudioEngine.toggleMute();
    }
  };

  const navItems: { id: SocietySectionTab; label: string; icon: React.ReactNode }[] = [
    { id: 'salon', label: 'The Salon', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'journal', label: 'Scent Journal', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'discoveries', label: 'Discoveries', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'chords', label: "Society's Chords", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'cabinets', label: 'Cabinet Stories', icon: <Archive className="w-3.5 h-3.5" /> },
    { id: 'heritage', label: 'Heritage Threads', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'people', label: 'People of Atelier', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'contribute', label: 'Your Contribution', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#120F0D] border border-amber-500/20 text-[#F8F5EE] shadow-2xl shadow-black/80">
      {/* Background Ambient Vapor & Warm Botanical Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-950/40 via-[#14110E] to-[#0E0C0A] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Atmospheric Texture Grain / Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative p-6 sm:p-10 lg:p-12 space-y-8">
        {/* Top Bar: Identity & Atmosphere Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/15 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-brand tracking-[0.16em] uppercase">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Chapter I • The Private Fragrance Society</span>
            </div>
            <p className="text-xs font-mono-lab text-stone-400 pt-0.5">
              Where fragrance becomes conversation • Synchronized to {weather.city || 'Atelier'} ({weather.temperature_c}°C, {weather.season})
            </p>
          </div>

          {/* Ambient Soundscape & Activity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={!isPlaying ? 'Unmute atelier ambient soundscape' : 'Mute ambient soundscape'}
              className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-amber-500/15 border border-amber-500/20 text-stone-300 hover:text-amber-300 text-xs font-mono-lab flex items-center gap-2 transition cursor-pointer"
            >
              {!isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span>Salon Audio: Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Salon Ambiance: Active</span>
                </>
              )}
            </button>

            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono-lab text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Sanctuary Open</span>
            </span>
          </div>
        </div>

        {/* Hero Headline & Editorial Subtitle */}
        <div className="max-w-3xl space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F8F5EE] font-medium leading-[1.08] tracking-tight">
            The Private Fragrance Society
          </h1>
          <p className="font-serif text-lg sm:text-2xl text-amber-200/90 italic font-light leading-relaxed">
            &ldquo;Where collectors, explorers and perfumers share the scents that stay with them.&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-2xl font-sans pt-1">
            An intimate salon dedicated to the art of olfaction. Here, the fragrance is the protagonist:
            peer-tested layering chords, personal skin wear diaries, and botanical heritage threads replace ephemeral feeds.
          </p>
        </div>

        {/* Featured Triptych: Scent Story + Featured Chord + Heritage Discovery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          {/* Card 1: Featured Fragrance Story */}
          <div className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-amber-500/20 p-5 flex flex-col justify-between transition group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-amber-400/90">
                  Featured Scent Story
                </span>
                <span className="text-[10px] font-mono-lab px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {featuredFragrance?.fragrance_family || 'Fine Flacon'}
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="shrink-0">
                  <ScentBottle
                    name={featuredFragrance?.name}
                    brand={featuredFragrance?.brand_name || featuredFragrance?.brand}
                    family={featuredFragrance?.fragrance_family}
                    size="sm"
                    showAura={false}
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#F8F5EE] group-hover:text-amber-300 transition">
                    {featuredFragrance?.name || 'Raw'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {featuredFragrance?.brand_name || featuredFragrance?.brand || 'SKINN by Titan'}
                  </p>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed italic">
                    &ldquo;{featuredFragrance?.description || 'A luminous composition capturing aquatic freshness and woody depth.'}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-mono-lab text-stone-400">
                Longevity: {featuredFragrance?.longevity || '8-10 hrs'}
              </span>
              {onInspectInChamber && (
                <button
                  type="button"
                  onClick={() => onInspectInChamber(featuredFragrance)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Flacon</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Featured Society Chord */}
          <div className="rounded-2xl bg-amber-500/[0.04] hover:bg-amber-500/[0.07] border border-amber-500/30 p-5 flex flex-col justify-between transition group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-amber-300">
                  Featured Alchemical Chord
                </span>
                <ScoreBadge
                  score={featuredChord?.compatibility_score || 94}
                  type="compatibility"
                  size="sm"
                />
              </div>

              <div>
                <h3 className="font-serif text-xl font-medium text-[#F8F5EE] group-hover:text-amber-300 transition">
                  {featuredChord?.chord_name || 'Verdant Assam Cloudburst'}
                </h3>
                <p className="text-xs text-amber-300/80 font-mono-lab mt-0.5">
                  {featuredChord?.title}
                </p>
              </div>

              {/* Duo Preview */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-400 font-mono-lab">Base Anchor:</span>
                  <span className="text-amber-200 font-medium">
                    {featuredChord?.fragrance_b?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-stone-400 font-mono-lab">Diffusion Spark:</span>
                  <span className="text-rose-200 font-medium">
                    {featuredChord?.fragrance_a?.name}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-400 line-clamp-2 italic leading-relaxed">
                &ldquo;{featuredChord?.review || featuredChord?.description}&rdquo;
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-amber-500/20 flex items-center justify-between">
              <span className="text-[10px] font-mono-lab text-stone-400">
                Shared by {featuredChord?.author}
              </span>
              <button
                type="button"
                onClick={() => onSendToLab(featuredChord.fragrance_a, featuredChord.fragrance_b)}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Try in Laboratory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Featured Heritage Discovery */}
          <div className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-amber-500/20 p-5 flex flex-col justify-between transition group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-brand tracking-[0.16em] uppercase text-emerald-400/90">
                  Living Heritage Thread
                </span>
                <span className="text-[10px] font-mono-lab px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Kannauj Deg &amp; Bhapka
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-medium text-[#F8F5EE] group-hover:text-emerald-300 transition">
                  Kannauj Mitti Attar
                </h3>
                <p className="text-xs text-emerald-400/70 font-mono-lab mt-0.5">
                  मिट्टी का अत्तर • Rain-baked Alluvial Clay
                </p>
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  Hydro-distilled in antique copper cauldrons over firewood. The primordial scent of dry earth meeting the first June monsoon thundercloud.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-[11px] font-mono-lab text-stone-300">
                Pairing Tradition: 1 drop on wrist anchors sparkling citrus mists for 12+ hours.
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-mono-lab text-stone-400">
                GI Registered Heritage
              </span>
              <button
                type="button"
                onClick={onExploreHeritage}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Atlas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs (Progressive Salon Experience) */}
        <div className="pt-4 border-t border-amber-500/15">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {navItems.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectSection(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-brand tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/40 font-semibold'
                      : 'bg-white/[0.03] text-stone-400 hover:text-[#F8F5EE] hover:bg-white/[0.07] border border-white/[0.06]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
