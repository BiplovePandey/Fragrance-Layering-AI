import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  SlidersHorizontal,
  Compass,
  Volume2,
  VolumeX,
  Award,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { UserGamification, UserPreferences } from '../../types.js';
import { LivingOlfactoryDNA } from '../../services/olfactoryIntelligence.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';

interface PortraitHeroProps {
  livingDNA: LivingOlfactoryDNA;
  gamification: UserGamification;
  onOpenPreferencesModal: () => void;
  onStartDiscoveryRitual: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  cabinetCount: number;
}

export const PortraitHero: React.FC<PortraitHeroProps> = ({
  livingDNA,
  gamification,
  onOpenPreferencesModal,
  onStartDiscoveryRitual,
  activeTab,
  onSelectTab,
  cabinetCount
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(ambientAudioEngine.isPlaying());
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setIsPlayingAudio(ambientAudioEngine.isPlaying());
    });
    return unsub;
  }, []);

  const handleToggleAudio = () => {
    if (ambientAudioEngine.isPlaying()) {
      ambientAudioEngine.stopSoundscape();
    } else {
      ambientAudioEngine.startSoundscape('amber_hearth');
    }
  };

  const xpForNextLevel = gamification.level * 200;
  const progressPercent = Math.min(100, Math.round((gamification.xp / xpForNextLevel) * 100));

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C1612] via-[#14100D] to-[#0D0A08] border border-[#3E3228] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-10 lg:p-12 text-[#FAF5F0]">
      {/* Smoked glass & warm amber ambient lighting layer */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(217,119,6,0.14),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(180,83,9,0.1),transparent_70%)] pointer-events-none" />

      {/* Top Bar: Archival Tag, Audio Control & Actions */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#3E3228]/80 pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A1F17] text-[#D97706] border border-[#443325] text-xs font-mono-lab uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            <span>Chapter I • The Olfactory Portrait</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241B15] text-[#D6C7B2] border border-[#3E3228] text-xs font-mono-lab">
            <Award className="w-3 h-3 text-[#F59E0B]" />
            <span>Rank: {gamification.title} (Level {gamification.level})</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle Ambient Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            className="px-3 py-1.5 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-xs font-mono-lab text-[#C8BAAB] hover:text-[#FAF5F0] border border-[#3E3228] transition-colors flex items-center gap-1.5"
            title="Toggle Atelier Ambient Hearth"
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[10px] uppercase">Atmosphere On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8C7D70]" />
                <span className="text-[10px] uppercase">Hearth Audio</span>
              </>
            )}
          </button>

          {/* Recalibrate Preferences Trigger */}
          <button
            onClick={onOpenPreferencesModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#2E2219] hover:bg-[#443224] text-xs font-mono-lab text-[#FEF3C7] border border-[#523A25] transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Main Title & Archetype Composition */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono-lab uppercase tracking-widest text-[#D97706] flex items-center gap-2">
            <span>A Living Map of How You Experience Fragrance</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF5F0] tracking-tight leading-[1.1]">
            {livingDNA.personalityTitle || 'The Olfactory Portrait'}
          </h1>

          <p className="font-serif italic text-lg sm:text-xl text-[#FDE68A]">
            "{livingDNA.personalityDescription || 'A bespoke reflection of your olfactory instincts.'}"
          </p>

          <p className="text-sm text-[#C8BAAB] leading-relaxed max-w-xl">
            Synthesized deterministically from your 8-dimensional olfactory coordinates,
            wardrobe selections ({cabinetCount} flacons), wear rituals, and aromatic sensitivities.
            Every facet reveals who you are in the living world of fragrance.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onStartDiscoveryRitual}
              className="px-4 py-2.5 rounded-xl bg-[#B45309] hover:bg-[#D97706] text-white text-xs font-mono-lab uppercase tracking-wider font-semibold transition-all shadow-[0_4px_16px_rgba(180,83,9,0.4)] flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sensory Discovery Ritual</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onSelectTab('constellation')}
              className="px-4 py-2.5 rounded-xl bg-[#241B16] hover:bg-[#34261F] text-[#FAF5F0] text-xs font-mono-lab uppercase tracking-wider transition-colors border border-[#3E3228] flex items-center gap-2"
            >
              <span>Explore 8D Constellation</span>
            </button>
          </div>
        </div>

        {/* Right Side: Perfumer's Dossier Plaque & XP Progress */}
        <div className="lg:col-span-5 bg-[#16120F]/90 rounded-2xl p-6 border border-[#3E3228] space-y-5">
          <div className="flex items-center justify-between border-b border-[#3E3228] pb-3">
            <span className="text-[10px] font-mono-lab uppercase tracking-widest text-[#D97706]">
              Private Perfumer's Assessment
            </span>
            <span className="text-[10px] font-mono-lab text-[#8C7D70]">
              Status: Active &bull; Living
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#1F1813] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">Core Anchor</div>
              <div className="font-serif text-base text-[#FAF5F0] font-medium mt-0.5">
                {livingDNA.vector.woody >= 70 ? 'Mysore Woods' : livingDNA.vector.earthy_clay >= 70 ? 'Petrichor Clay' : 'Resinous Amber'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#1F1813] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">Intensity Aura</div>
              <div className="font-serif text-base text-[#FAF5F0] font-medium mt-0.5">
                {livingDNA.vector.intensity >= 70 ? 'Expansive & Bold' : 'Intimate & Close'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#1F1813] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">Sweetness Ceiling</div>
              <div className="font-serif text-base text-[#FAF5F0] font-medium mt-0.5">
                {livingDNA.vector.sweetness <= 45 ? 'Dry & Restrained' : 'Warm Balsamic'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#1F1813] border border-[#3E3228]">
              <div className="text-[10px] font-mono-lab uppercase text-[#8C7D70]">Fixative Depth</div>
              <div className="font-serif text-base text-[#FAF5F0] font-medium mt-0.5">
                {livingDNA.vector.longevity_fixative >= 75 ? '12+ Hours Lipid' : 'Moderate Arc'}
              </div>
            </div>
          </div>

          {/* Gamification Progress */}
          <div className="space-y-2 pt-2 border-t border-[#3E3228]">
            <div className="flex items-center justify-between text-xs font-mono-lab">
              <span className="text-[#A8988B]">Olfactory Mastery Progression</span>
              <span className="text-[#F59E0B] font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#241B16] h-2 rounded-full overflow-hidden border border-[#3E3228]">
              <div
                className="h-full bg-gradient-to-r from-[#B45309] to-[#F59E0B] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono-lab text-[#8C7D70]">
              <span>Level {gamification.level}</span>
              <span>{xpForNextLevel - gamification.xp} XP to Level {gamification.level + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
