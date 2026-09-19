import React, { useState, useEffect } from 'react';
import {
  Fragrance,
  WeatherCondition,
  UserGamification
} from '../../types.js';
import { calculateWeatherAlignmentScore } from '../../services/weatherEngine.js';
import { ScentFamilyAtmosphere } from '../AtmosphericFragranceCanvas.js';
import { ambientAudioEngine, SoundscapeType } from '../../services/ambientAudioEngine.js';
import { WhatShouldIWearModal } from '../WhatShouldIWearModal.js';
import { AiPerfumerDrawer } from '../AiPerfumerDrawer.js';
import { AiFragranceScannerModal } from '../AiFragranceScannerModal.js';
import { ScentAcademyModal } from '../ScentAcademyModal.js';

// Modular Atelier Components
import { AtelierHero } from '../atelier/AtelierHero.js';
import { AlchemicalChordCard } from '../atelier/AlchemicalChordCard.js';
import { DrydownSection } from '../atelier/DrydownSection.js';
import { AtelierAtmosphereSoundscape } from '../atelier/AtelierAtmosphereSoundscape.js';
import { AtelierPortals } from '../atelier/AtelierPortals.js';
import { AtelierIntelligence } from '../atelier/AtelierIntelligence.js';
import { ChapterDivider } from '../atelier/ChapterDivider.js';

interface AtelierViewProps {
  fragrances: Fragrance[];
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  gamification: UserGamification;
  wardrobeFragrances: Fragrance[];
  onNavigate: (tab: any) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  currentAtmosphere: ScentFamilyAtmosphere;
  onWearToday?: (frag: Fragrance, partner?: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
}

export const AtelierView: React.FC<AtelierViewProps> = ({
  fragrances = [],
  weather,
  onOpenWeatherModal,
  gamification,
  wardrobeFragrances = [],
  onNavigate,
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onSetAtmosphere,
  currentAtmosphere,
  onWearToday,
  onAddToWardrobe
}) => {
  // Modal & Drawer States
  const [showTodayAdvisor, setShowTodayAdvisor] = useState(false);
  const [showAiPerfumer, setShowAiPerfumer] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAcademy, setShowAcademy] = useState(false);

  // Live Soundscape Audio State
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>(ambientAudioEngine.getActiveSoundscape());
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(ambientAudioEngine.isPlaying());
  const [audioVolume, setAudioVolume] = useState<number>(ambientAudioEngine.getVolume());

  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setActiveSoundscape(ambientAudioEngine.getActiveSoundscape());
      setIsAudioPlaying(ambientAudioEngine.isPlaying());
      setAudioVolume(ambientAudioEngine.getVolume());
    });
    return unsub;
  }, []);

  const handleToggleSound = (presetId?: SoundscapeType) => {
    if (presetId) {
      if (activeSoundscape === presetId && isAudioPlaying) {
        ambientAudioEngine.stopSoundscape();
      } else {
        ambientAudioEngine.startSoundscape(presetId);
      }
    } else {
      if (isAudioPlaying) {
        ambientAudioEngine.stopSoundscape();
      } else {
        const fallback = activeSoundscape !== 'none' ? activeSoundscape : 'monsoon_deg';
        ambientAudioEngine.startSoundscape(fallback);
      }
    }
  };

  // Scent of the day calculation: choose a high-weather-compatibility perfume
  const safeFrags = Array.isArray(fragrances) ? fragrances : [];
  const rankedByWeather = safeFrags.map((f) => ({
    frag: f,
    ...calculateWeatherAlignmentScore(f, weather)
  })).sort((a, b) => b.score - a.score);

  const scentOfTheDay = rankedByWeather[0]?.frag || safeFrags[0];
  const scentOfTheDayScore = rankedByWeather[0]?.score || 94;
  const scentOfTheDayAdvisory = rankedByWeather[0]?.advisory || '';

  // Recommended Chord: Complementary companion perfume
  const partnerFrag = safeFrags.find(
    (f) => f.id !== scentOfTheDay?.id && f.fragrance_family !== scentOfTheDay?.fragrance_family
  ) || safeFrags[1] || safeFrags[0];

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
      {/* CHAPTER I: THE ATELIER HERO (GREETING, HERO FLACON, SCORE, WEAR CTA, MIST ATMOSPHERE) */}
      <AtelierHero
        scentOfTheDay={scentOfTheDay}
        scentOfTheDayScore={scentOfTheDayScore}
        scentOfTheDayAdvisory={scentOfTheDayAdvisory}
        partnerFrag={partnerFrag}
        weather={weather}
        currentAtmosphere={currentAtmosphere}
        onSetAtmosphere={onSetAtmosphere}
        onOpenWeatherModal={onOpenWeatherModal}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
        onSendToLaboratory={onSendToLaboratory}
        onWearToday={onWearToday}
        onOpenWhatShouldIWear={() => setShowTodayAdvisor(true)}
        onNavigate={onNavigate}
      />

      {/* CHAPTER II: THE DAY'S ACCORD */}
      {scentOfTheDay && partnerFrag && (
        <>
          <ChapterDivider
            chapter="CHAPTER II"
            title="THE DAY'S ACCORD"
            subtitle="Harmonic synergy of volatile sparks and alluvial fixative foundations"
          />
          <AlchemicalChordCard
            baseFragrance={scentOfTheDay}
            sparkFragrance={partnerFrag}
            harmonyScore={96}
            onSendToLaboratory={onSendToLaboratory}
            onSelectFragranceForChamber={onSelectFragranceForChamber}
          />
        </>
      )}

      {/* CHAPTER III: TIME REVEALS THE COMPOSITION */}
      {scentOfTheDay && (
        <>
          <ChapterDivider
            chapter="CHAPTER III"
            title="TIME REVEALS THE COMPOSITION"
            subtitle="Isothermal evaporation dynamics and continuous skin drydown kinetics"
          />
          <DrydownSection fragrance={scentOfTheDay} />
        </>
      )}

      {/* CHAPTER IV: THE AIR AROUND THE SCENT */}
      <ChapterDivider
        chapter="CHAPTER IV"
        title="THE AIR AROUND THE SCENT"
        subtitle="Synesthetic acoustics, atmospheric humidity, and Kannauj hydrodistillation soundscapes"
      />
      <AtelierAtmosphereSoundscape
        weather={weather}
        gamification={gamification}
        currentAtmosphere={currentAtmosphere}
        onSetAtmosphere={onSetAtmosphere}
        onOpenWeatherModal={onOpenWeatherModal}
        activeSoundscape={activeSoundscape}
        isAudioPlaying={isAudioPlaying}
        audioVolume={audioVolume}
        onToggleSound={handleToggleSound}
      />

      {/* CHAPTER V: THE ATELIER'S INSTRUMENTS */}
      <ChapterDivider
        chapter="CHAPTER V"
        title="THE ATELIER'S INSTRUMENTS"
        subtitle="Artisanal heritage portals and computational olfactory intelligence"
      />
      <AtelierPortals
        wardrobeCount={wardrobeFragrances?.length || 0}
        onNavigate={onNavigate}
      />

      <AtelierIntelligence
        onOpenAiPerfumer={() => setShowAiPerfumer(true)}
        onOpenScanner={() => setShowScanner(true)}
        onOpenAcademy={() => setShowAcademy(true)}
      />

      {/* =========================================================================
          INTELLIGENT MODALS & DRAWERS (PRESERVED FUNCTIONALITY)
          ========================================================================= */}

      {/* "What Should I Wear Today?" Full Modal */}
      <WhatShouldIWearModal
        isOpen={showTodayAdvisor}
        onClose={() => setShowTodayAdvisor(false)}
        allFragrances={fragrances}
        ownedFragrances={wardrobeFragrances}
        weather={weather}
        onSendToLab={onSendToLaboratory}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
        onWearToday={(frag, partner) => {
          onWearToday?.(frag, partner);
          setShowTodayAdvisor(false);
        }}
      />

      {/* AI Master Perfumer Drawer */}
      <AiPerfumerDrawer
        isOpen={showAiPerfumer}
        onClose={() => setShowAiPerfumer(false)}
        allFragrances={fragrances}
        ownedFragrances={wardrobeFragrances}
        weather={weather}
        onSendToLab={onSendToLaboratory}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
      />

      {/* AI Bottle Scanner Modal */}
      <AiFragranceScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        allFragrances={fragrances}
        onAddToWardrobe={(id) => onAddToWardrobe?.(id)}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
      />

      {/* Scent Academy Modal */}
      <ScentAcademyModal
        isOpen={showAcademy}
        onClose={() => setShowAcademy(false)}
      />
    </div>
  );
};
