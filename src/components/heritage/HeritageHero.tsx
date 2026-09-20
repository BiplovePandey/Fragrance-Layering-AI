import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  MapPin,
  Flame,
  Award,
  BookOpen,
  Waves
} from 'lucide-react';
import { ambientAudioEngine, SoundscapeType, SOUNDSCAPE_PRESETS } from '../../services/ambientAudioEngine.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';

interface HeritageHeroProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
  totalSpecimens: number;
  cabinetMatchesCount: number;
}

export const HeritageHero: React.FC<HeritageHeroProps> = ({
  onSelectTab,
  activeTab,
  totalSpecimens,
  cabinetMatchesCount
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>(ambientAudioEngine.getActiveSoundscape());
  const [isMuted, setIsMuted] = useState(!ambientAudioEngine.isPlaying());
  const [volume, setVolume] = useState(ambientAudioEngine.getVolume());

  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setActiveSoundscape(ambientAudioEngine.getActiveSoundscape());
      setIsMuted(!ambientAudioEngine.isPlaying());
      setVolume(ambientAudioEngine.getVolume());
    });
    return unsub;
  }, []);

  const handleSoundscapeToggle = (presetId: SoundscapeType) => {
    if (activeSoundscape === presetId && !isMuted) {
      ambientAudioEngine.stopSoundscape();
    } else {
      ambientAudioEngine.startSoundscape(presetId);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#1C1713] text-[#F5EFEB] border border-[#3E3228] shadow-[0_16px_48px_rgba(0,0,0,0.35)] p-6 sm:p-10 lg:p-14">
      {/* Archival Parchment & Atmospheric Lighting Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,6,0.18),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(180,83,9,0.15),transparent_50%)] pointer-events-none" />
      
      {/* Subtle Dust & Vapor Shimmer (respecting reduced motion) */}
      {!prefersReduced && (
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E2D9CE_1px,transparent_1px)] [background-size:24px_24px]" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        {/* Left Column: Title & Archival Introduction */}
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-lab uppercase tracking-widest bg-[#D97706]/15 text-[#FBBF24] border border-[#D97706]/30">
              <Award className="w-3 h-3 text-[#F59E0B]" />
              GI-Protected Traditions & Ancient Manuscripts
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-lab uppercase tracking-widest bg-[#451A03]/40 text-[#FDE68A] border border-[#78350F]/40">
              <Flame className="w-3 h-3 text-[#D97706]" />
              400+ Years Deg & Bhapka Still
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#FAF5F0] leading-tight">
            The Heritage Atlas
          </h1>
          
          <p className="font-serif italic text-lg sm:text-xl text-[#D6C7B2] font-light">
            An olfactory map of India’s living fragrance traditions.
          </p>

          <p className="text-sm sm:text-base text-[#B0A294] font-sans leading-relaxed pt-1">
            Step into a living digital museum of classical Indian perfumery. From the rain-drenched
            copper cauldrons of Kannauj to the sacred sandalwood forests of Mysore, explore the
            botanical field records, four centuries of hydro-distillation craft, and their living
            continuity in your personal fragrance cabinet.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-lab text-[#C8BAAB]">
            <div className="flex items-center gap-1.5 bg-[#2A221C] px-3 py-1.5 rounded-xl border border-[#44362B]">
              <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
              <span>7 Verified Regions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#2A221C] px-3 py-1.5 rounded-xl border border-[#44362B]">
              <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{totalSpecimens} Botanical & Attar Specimens</span>
            </div>
            {cabinetMatchesCount > 0 && (
              <div className="flex items-center gap-1.5 bg-[#451A03]/60 px-3 py-1.5 rounded-xl border border-[#B45309]/50 text-[#FDE68A]">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{cabinetMatchesCount} in Your Cabinet</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ambient Audio Controller */}
        <div className="w-full lg:w-80 flex flex-col gap-3 p-4 rounded-2xl bg-[#251E19]/90 border border-[#3E3228] backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[11px] font-mono-lab uppercase tracking-widest text-[#E5D7C7] font-medium">
                Archival Soundscapes
              </span>
            </div>
            <span className="text-[10px] font-mono-lab text-[#9C8D80]">
              Procedural Web Audio
            </span>
          </div>

          <p className="text-[11px] text-[#A8988B] leading-snug">
            Real-time acoustic resonance generated directly in your browser without external audio files.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {SOUNDSCAPE_PRESETS.filter(p => p.id !== 'none').map((preset) => {
              const isSelected = activeSoundscape === preset.id && !isMuted;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSoundscapeToggle(preset.id)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-sans text-left transition-all ${
                    isSelected
                      ? 'bg-[#B45309] text-white font-medium shadow-[0_2px_8px_rgba(180,83,9,0.5)]'
                      : 'bg-[#1C1713] text-[#C8BAAB] hover:bg-[#342921] hover:text-[#FAF5F0] border border-[#3E3228]'
                  }`}
                >
                  <span className="text-sm">{preset.icon}</span>
                  <div className="truncate">
                    <div className="truncate text-[11px] font-medium leading-tight">
                      {preset.id === 'monsoon_deg' ? 'Monsoon Deg' : preset.id === 'temple_breeze' ? 'Temple Wind' : 'Amber Hearth'}
                    </div>
                    <div className="text-[9px] opacity-75 truncate">
                      {isSelected ? 'Playing' : 'Listen'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mute and Volume Control */}
          <div className="flex items-center justify-between pt-1 border-t border-[#3E3228]/60 text-xs text-[#A8988B]">
            <button
              onClick={() => {
                ambientAudioEngine.toggleMute();
              }}
              className="flex items-center gap-1.5 hover:text-[#FAF5F0] transition-colors py-1"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#F87171]" />
                  <span className="text-[10px] font-mono-lab uppercase">Sound Off</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="text-[10px] font-mono-lab uppercase">Sound Active</span>
                </>
              )}
            </button>
            <span className="text-[9px] font-mono-lab text-[#8C7D70]">
              Zero-latency synthesis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
