import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { MotionPage, MotionModal } from './motion/index.js';
import { AtelierNavbar } from './components/AtelierNavbar.js';
import { AppBottomNav } from './components/AppBottomNav.js';
import { AtmosphericFragranceCanvas, ScentFamilyAtmosphere, ATMOSPHERE_PROFILES } from './components/AtmosphericFragranceCanvas.js';
import { AmbientAtmosphereControl, getAtmosphereFromFragrance } from './components/AmbientAtmosphereControl.js';
import { WeatherAtmosphereModal } from './components/WeatherAtmosphereModal.js';
import { FragranceChamberModal } from './components/FragranceChamberModal.js';
import { OpeningExperience } from './components/OpeningExperience.js';
import { RecommendationLoadingModal } from './components/RecommendationLoadingModal.js';
import { PreferenceForm } from './components/PreferenceForm.js';
import { SurpriseMeModal } from './components/ui/index.js';
import { resolveVisualWorld } from './utils/visualWorlds.js';

// Views
import { AtelierView } from './components/views/AtelierView.js';
import { LayerLaboratoryView } from './components/views/LayerLaboratoryView.js';
import { FragranceUniverseView } from './components/views/FragranceUniverseView.js';
import { WardrobeView } from './components/views/WardrobeView.js';
import { HeritageAtlasView } from './components/views/HeritageAtlasView.js';
import { CommunityView } from './components/views/CommunityView.js';
import { MyDnaView } from './components/views/MyDnaView.js';
import { DiscoverView } from './components/views/DiscoverView.js';
import { WhatShouldIWearView } from './components/views/WhatShouldIWearView.js';
import { ScannerView } from './components/views/ScannerView.js';
import { AcademyView } from './components/views/AcademyView.js';

import { api } from './services/api.js';
import { updateWeatherCondition } from './services/weatherEngine.js';
import { getGamificationState, awardXP } from './services/gamificationEngine.js';
import { olfactoryIntelligence } from './services/olfactoryIntelligence.js';
import {
  Fragrance,
  Brand,
  NoteTaxonomyEntry,
  UserPreferences,
  LayeringResult,
  RecommendationScore,
  SavedCombination,
  ClusterInfo,
  DailyMoodId,
  DailyMoodPreset,
  MainNavId,
  WeatherCondition,
  UserGamification
} from './types.js';
import { CheckCircle2, SlidersHorizontal, Sparkles, X } from 'lucide-react';

export default function App() {
  const [showOpening, setShowOpening] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('has_seen_olfactive_opening') !== 'true';
    } catch {
      return true;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainNavId>('atelier');

  // Weather & Atmosphere Engine State
  const [weather, setWeather] = useState<WeatherCondition>(() =>
    updateWeatherCondition(28, 65, 'temperate', 'Evening')
  );
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);
  const [isAtmosphereModalOpen, setIsAtmosphereModalOpen] = useState<boolean>(false);
  const [currentAtmosphere, setCurrentAtmosphere] = useState<ScentFamilyAtmosphere>('rose');

  // Gamification & User Rank State
  const [gamification, setGamification] = useState<UserGamification>(() => getGamificationState());

  // Fragrance Chamber Modal State
  const [chamberFragrance, setChamberFragrance] = useState<Fragrance | null>(null);
  const [isChamberOpen, setIsChamberOpen] = useState<boolean>(false);

  // Scent Lab Selected Fragrance Pair
  const [labFragA, setLabFragA] = useState<Fragrance | undefined>(undefined);
  const [labFragB, setLabFragB] = useState<Fragrance | undefined>(undefined);

  // Custom Preferences Form Modal
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState<boolean>(false);

  // Magical Surprise Me Serendipity State
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState<boolean>(false);

  // Core Data Collections
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [taxonomy, setTaxonomy] = useState<NoteTaxonomyEntry[]>([]);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [ownedFragrances, setOwnedFragrances] = useState<Fragrance[]>([]);
  const [savedCombinations, setSavedCombinations] = useState<SavedCombination[]>([]);
  const [layeringResults, setLayeringResults] = useState<LayeringResult[]>([]);
  const [singleRecommendations, setSingleRecommendations] = useState<RecommendationScore[]>([]);

  // Daily Mood State
  const [selectedMoodId, setSelectedMoodId] = useState<DailyMoodId | null>(null);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    sweetness: 5,
    freshness: 7,
    intensity: 6,
    preferred_gender: 'all',
    season: 'Summer',
    occasion: 'Date',
    time_of_day: 'Evening',
    favorite_family: ['Woody Aromatic', 'Amber Vanilla'],
    preferred_notes: ['Bergamot', 'Sandalwood']
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showRewardingModal, setShowRewardingModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type?: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [fragsRes, clsRes, colRes, savedRes, prefsRes, brandListRes, taxListRes] = await Promise.allSettled([
          api.getFragrances(),
          api.getClusters(),
          api.getCollection(),
          api.getSavedCombinations(),
          api.getUserPreferences(1),
          api.getBrands(),
          api.getTaxonomy()
        ]);

        const frags = fragsRes.status === 'fulfilled' ? fragsRes.value : [];
        const cls = clsRes.status === 'fulfilled' ? clsRes.value : [];
        const col = colRes.status === 'fulfilled' ? colRes.value : { fragrances: [] };
        const saved = savedRes.status === 'fulfilled' ? savedRes.value : [];
        const prefs = prefsRes.status === 'fulfilled' ? prefsRes.value : null;
        const brandList = brandListRes.status === 'fulfilled' ? brandListRes.value : [];
        const taxList = taxListRes.status === 'fulfilled' ? taxListRes.value : [];

        setFragrances(Array.isArray(frags) ? frags : []);
        setClusters(Array.isArray(cls) ? cls : []);
        setOwnedFragrances(Array.isArray(col?.fragrances) ? col.fragrances : []);
        setSavedCombinations(Array.isArray(saved) ? saved : []);
        setBrands(Array.isArray(brandList) ? brandList : []);
        setTaxonomy(Array.isArray(taxList) ? taxList : []);

        if (prefs && Object.keys(prefs).length > 0) {
          setPreferences(prev => ({ ...prev, ...prefs }));
        }

        if (Array.isArray(frags) && frags.length >= 2) {
          setLabFragA(frags[0]);
          setLabFragB(frags[1]);
        }
      } catch (err) {
        console.warn('Non-fatal issue initializing some application data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Handlers
  const handleCalculateLayering = async (customCandidateIds?: number[], triggerModal: boolean = false) => {
    if (triggerModal) {
      setShowRewardingModal(true);
    }
    setIsLoading(true);
    try {
      await api.saveUserPreferences(preferences, 1);
      const results = await api.getLayeringCombinations({
        preferences,
        owned_fragrance_id: preferences.owned_fragrance_id,
        candidate_ids: customCandidateIds,
        limit: 5
      });
      setLayeringResults(results);
      if (!triggerModal) {
        setActiveTab('layer');
        showNotification('Calculated optimal complementary chords and layering rituals.');
      }
    } catch (err: any) {
      console.error(err);
      showNotification('Failed to generate layering results', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewardingModalFinish = () => {
    setShowRewardingModal(false);
    setActiveTab('layer');
    showNotification('✨ Scent chord formulated successfully!');
  };

  const handleSaveCombination = async (result: any) => {
    try {
      const res = await api.saveCombination({
        fragrance_a_id: result.fragrance_a.id,
        fragrance_b_id: result.fragrance_b.id,
        compatibility_score: result.compatibility_score,
        explanation: result.explanation,
        season: result.best_season || weather.season,
        occasion: result.best_occasion || 'Signature'
      });

      if (res.success) {
        const updatedSaved = await api.getSavedCombinations();
        setSavedCombinations(updatedSaved);
        const { state } = awardXP(50, 'first_chord');
        setGamification(state);
        showNotification(`Saved "${result.fragrance_a.name} + ${result.fragrance_b.name}" to your Vault (+50 XP).`);
      }
    } catch (err) {
      console.error(err);
      showNotification('Could not save combination', 'info');
    }
  };

  const handleAddToCabinet = async (fragId: number) => {
    try {
      await api.addToCollection(fragId);
      const updated = await api.getCollection();
      setOwnedFragrances(updated.fragrances);
      const { state } = awardXP(30, 'curators_vault');
      setGamification(state);
      showNotification('Flacon added to your digital wardrobe (+30 XP).');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromCabinet = async (fragId: number) => {
    try {
      await api.removeFromCollection(fragId);
      setOwnedFragrances(prev => prev.filter(f => f.id !== fragId));
      showNotification('Flacon removed from cabinet shelf.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleInspectInChamber = (frag: Fragrance) => {
    setChamberFragrance(frag);
    setIsChamberOpen(true);
    const targetAtm = getAtmosphereFromFragrance(frag);
    if (targetAtm && targetAtm !== 'default') {
      setCurrentAtmosphere(targetAtm);
    }
  };

  const handleSendToLaboratory = (fragA: Fragrance, fragB?: Fragrance) => {
    setLabFragA(fragA);
    if (fragB) {
      setLabFragB(fragB);
    }
    setActiveTab('layer');
    showNotification(`Sent ${fragA.name}${fragB ? ` & ${fragB.name}` : ''} to AI Laboratory.`);
  };

  const handleWearToday = (frag: Fragrance, partner?: Fragrance) => {
    try {
      olfactoryIntelligence.recordWear({
        fragranceId: frag.id,
        fragranceName: frag.name,
        weatherCondition: weather,
        occasion: 'Signature Wear',
        partnerFragranceId: partner?.id,
        partnerFragranceName: partner?.name,
        satisfactionRating: 9
      });
      const { state } = awardXP(40, 'wear_today');
      setGamification(state);
      showNotification(`Recorded Scent of the Day: ${frag.name}${partner ? ` + ${partner.name}` : ''} (+40 XP).`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateWeather = (newWeather: WeatherCondition) => {
    setWeather(newWeather);
    const { state } = awardXP(20, 'weather_attuned');
    setGamification(state);
    showNotification(`Atmosphere calibrated to ${newWeather.temperature_c}°C & ${newWeather.humidity_pct}% humidity.`);
  };

  const handleSelectMood = async (preset: DailyMoodPreset) => {
    setSelectedMoodId(preset.id);
    const updated: UserPreferences = {
      ...preferences,
      sweetness: preset.sweetness,
      freshness: preset.freshness,
      intensity: preset.intensity,
      season: preset.season as any,
      occasion: preset.occasion as any,
      time_of_day: preset.timeOfDay as any,
      favorite_family: preset.favoriteFamily,
      preferred_notes: preset.preferredNotes,
      origin_filter: preset.originFilter,
      format_filter: preset.formatFilter || 'all'
    };
    setPreferences(updated);
    showNotification(`Vibe set to ${preset.title} ${preset.emoji}`);
    handleCalculateLayering(undefined, true);
  };

  const handleCompleteTinderVibe = (discovered: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...discovered
    }));
    handleCalculateLayering(undefined, true);
  };

  const handleAddNoteToPreferences = (noteName: string) => {
    if (!preferences.preferred_notes.includes(noteName)) {
      setPreferences(prev => ({
        ...prev,
        preferred_notes: [...prev.preferred_notes, noteName]
      }));
      showNotification(`Added ${noteName} to your preferred chords!`);
    } else {
      showNotification(`${noteName} is already in your preferred notes.`);
    }
  };

  const handleCompleteOpening = () => {
    setShowOpening(false);
    try {
      sessionStorage.setItem('has_seen_olfactive_opening', 'true');
    } catch {}
  };

  const currentWorld = resolveVisualWorld(activeTab);

  return (
    <div className={`relative min-h-screen ${currentWorld.backdropClass} text-[#1A1613] flex flex-col font-sans selection:bg-amber-500/20 pb-24 md:pb-0 overflow-x-hidden transition-colors duration-700`}>
      {/* Dynamic Scent Family Atmospheric Canvas Background */}
      <AtmosphericFragranceCanvas
        atmosphere={currentAtmosphere}
        intensity={weather.perceived_modifiers.intensityFactor}
      />

      {/* Opening Intro Sequence */}
      {showOpening && (
        <OpeningExperience onComplete={handleCompleteOpening} />
      )}

      {/* Loading Animation Modal */}
      <RecommendationLoadingModal
        isOpen={showRewardingModal}
        onFinish={handleRewardingModalFinish}
      />

      {/* Weather Atmosphere Modal */}
      <WeatherAtmosphereModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        currentWeather={weather}
        onUpdateWeather={handleUpdateWeather}
      />

      {/* Fragrance Chamber Detail Modal */}
      <FragranceChamberModal
        fragrance={chamberFragrance}
        isOpen={isChamberOpen}
        onClose={() => setIsChamberOpen(false)}
        onSendToLab={(f) => handleSendToLaboratory(f)}
        onAddToWardrobe={(f) => handleAddToCabinet(f.id)}
        weather={weather}
        allFragrances={fragrances}
        onImmerseAtmosphere={(f) => {
          const atm = getAtmosphereFromFragrance(f);
          setCurrentAtmosphere(atm);
          showNotification(`Atmosphere shifted to ${ATMOSPHERE_PROFILES[atm]?.name || atm}.`);
        }}
        onWearToday={(f) => handleWearToday(f)}
        onExploreHeritage={() => {
          setIsChamberOpen(false);
          setActiveTab('heritage');
        }}
      />

      {/* Magical Serendipity Surprise Me Modal */}
      <SurpriseMeModal
        isOpen={isSurpriseMeOpen}
        onClose={() => setIsSurpriseMeOpen(false)}
        allFragrances={fragrances}
        weather={weather}
        onWearThis={(f) => {
          handleWearToday(f);
          showNotification(`Wearing ${f.name} today (+40 XP).`);
        }}
        onOpenChamber={handleInspectInChamber}
      />

      {/* Floating Ambient Atmosphere Controller & Audio Soundscape Modal */}
      <AmbientAtmosphereControl
        currentAtmosphere={currentAtmosphere}
        onSetAtmosphere={setCurrentAtmosphere}
        activeFragrance={chamberFragrance || labFragA}
        isOpen={isAtmosphereModalOpen}
        onOpenChange={setIsAtmosphereModalOpen}
      />

      {/* Top Luxury Atelier Navbar */}
      <AtelierNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
        currentAtmosphere={currentAtmosphere}
        onOpenAtmosphere={() => setIsAtmosphereModalOpen(true)}
        gamification={gamification}
        wardrobeCount={ownedFragrances?.length || 0}
        onTriggerSurprise={() => setIsSurpriseMeOpen(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-24 md:bottom-8 right-6 z-50 flex items-center gap-2.5 px-4 py-3 liquid-glass-elevated text-[#1A1613] rounded-2xl shadow-[0_12px_36px_rgba(95,70,40,0.15)] border border-white text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        <AnimatePresence mode="wait">
          {/* PILLAR 1: ATELIER DASHBOARD */}
          {activeTab === 'atelier' && (
            <MotionPage key="atelier">
              <AtelierView
                fragrances={fragrances}
                weather={weather}
                onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
                gamification={gamification}
                wardrobeFragrances={ownedFragrances}
                onNavigate={(tab) => setActiveTab(tab)}
                onSelectFragranceForChamber={handleInspectInChamber}
                onSendToLaboratory={handleSendToLaboratory}
                onSetAtmosphere={setCurrentAtmosphere}
                currentAtmosphere={currentAtmosphere}
                onWearToday={handleWearToday}
                onAddToWardrobe={handleAddToCabinet}
              />
            </MotionPage>
          )}

          {/* WHAT SHOULD I WEAR? OLFACTORY RECOMMENDATION ATELIER */}
          {activeTab === 'wear' && (
            <MotionPage key="wear">
              <WhatShouldIWearView
                fragrances={fragrances}
                wardrobeFragrances={ownedFragrances}
                weather={weather}
                onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
                onSelectFragranceForChamber={handleInspectInChamber}
                onSendToLaboratory={handleSendToLaboratory}
                onWearToday={handleWearToday}
                onAddToWardrobe={handleAddToCabinet}
                onNavigate={(tab) => setActiveTab(tab)}
                onNavigateToHeritageAtlas={(_materialId) => setActiveTab('heritage')}
              />
            </MotionPage>
          )}

          {/* PILLAR 2: AI FRAGRANCE LABORATORY & SCENT SIMULATOR */}
          {activeTab === 'layer' && (
            <MotionPage key="layer">
              <LayerLaboratoryView
                fragrances={fragrances}
                selectedFragranceA={labFragA}
                selectedFragranceB={labFragB}
                weather={weather}
                onSaveCombination={handleSaveCombination}
                onWearToday={(fragA, fragB) => handleWearToday(fragA, fragB)}
              />
            </MotionPage>
          )}

          {/* PILLAR 3: FRAGRANCE UNIVERSE & OLFACTORY GALAXY */}
          {activeTab === 'explore' && (
            <MotionPage key="explore">
              <FragranceUniverseView
                fragrances={fragrances}
                brands={brands}
                clusters={clusters}
                weather={weather}
                onSelectFragranceForChamber={handleInspectInChamber}
                onSendToLab={(f) => handleSendToLaboratory(f)}
              />
            </MotionPage>
          )}

          {/* PILLAR 4: DIGITAL FRAGRANCE WARDROBE & COLLECTION GAPS */}
          {activeTab === 'wardrobe' && (
            <MotionPage key="wardrobe">
              <WardrobeView
                allFragrances={fragrances}
                ownedFragrances={ownedFragrances}
                onAddToCollection={handleAddToCabinet}
                onRemoveFromCollection={handleRemoveFromCabinet}
                onSendToLab={(f) => handleSendToLaboratory(f)}
                weather={weather}
                onWearToday={handleWearToday}
                onNavigate={setActiveTab}
              />
            </MotionPage>
          )}

          {/* PILLAR 5: INDIAN FRAGRANCE HERITAGE ATLAS */}
          {activeTab === 'heritage' && (
            <MotionPage key="heritage">
              <HeritageAtlasView
                onSendToLab={handleSendToLaboratory}
                allFragrances={fragrances}
                ownedFragrances={ownedFragrances}
                onInspectInChamber={handleInspectInChamber}
                onWearToday={handleWearToday}
                onNavigate={setActiveTab}
              />
            </MotionPage>
          )}

          {/* PILLAR 6: THE PRIVATE FRAGRANCE SOCIETY */}
          {activeTab === 'community' && (
            <MotionPage key="community">
              <CommunityView
                onSendToLab={handleSendToLaboratory}
                allFragrances={fragrances}
                weather={weather}
                onInspectInChamber={handleInspectInChamber}
                onAddToCabinet={(frag) => handleAddToCabinet(frag.id)}
                onExploreHeritage={() => setActiveTab('heritage')}
                wardrobeFragrances={ownedFragrances}
                gamification={gamification}
                showNotification={showNotification}
              />
            </MotionPage>
          )}

          {/* PILLAR 7: PERSONAL SCENT DNA & OLFACTORY PORTRAIT */}
          {activeTab === 'mydna' && (
            <MotionPage key="mydna">
              <MyDnaView
                gamification={gamification}
                preferences={preferences}
                onOpenPreferencesModal={() => setIsPreferencesModalOpen(true)}
                allFragrances={fragrances}
                ownedFragrances={ownedFragrances}
                weather={weather}
                onNavigate={(tab) => setActiveTab(tab)}
                onInspectInChamber={handleInspectInChamber}
                onSendToLab={(f) => handleSendToLaboratory(f)}
                onSendToLabChord={(fragA, fragB) => handleSendToLaboratory(fragA, fragB)}
                onWearToday={handleWearToday}
                onNavigateToHeritageAtlas={(_materialId) => setActiveTab('heritage')}
                onAddNoteToPreferences={handleAddNoteToPreferences}
                onCompleteVibeCheck={handleCompleteTinderVibe}
              />
            </MotionPage>
          )}

          {/* PILLAR 8: TASTE DECK & VIBE DISCOVERY */}
          {activeTab === 'discover' && (
            <MotionPage key="discover">
              <DiscoverView
                fragrances={fragrances}
                selectedMoodId={selectedMoodId}
                onSelectMood={handleSelectMood}
                showCustomForm={showCustomForm}
                onToggleCustomForm={() => setShowCustomForm(prev => !prev)}
                onInstantCalculate={() => handleCalculateLayering(undefined, true)}
                isLoading={isLoading}
                onCompleteVibeCheck={handleCompleteTinderVibe}
                onAddNoteToPreferences={handleAddNoteToPreferences}
                onSelectIndianFragrance={(fragId) => {
                  setPreferences(prev => ({ ...prev, owned_fragrance_id: fragId }));
                  handleCalculateLayering(undefined, true);
                }}
              />
            </MotionPage>
          )}

          {/* PILLAR 9A: THE SCENT SCANNER */}
          {activeTab === 'scanner' && (
            <MotionPage key="scanner">
              <ScannerView
                allFragrances={fragrances}
                onAddToWardrobe={(id) => handleAddToCabinet(id)}
                onSelectFragranceForChamber={handleInspectInChamber}
                onSendToLaboratory={handleSendToLaboratory}
                onNavigate={setActiveTab}
                onNavigateToHeritageAtlas={(_matId) => setActiveTab('heritage')}
              />
            </MotionPage>
          )}

          {/* PILLAR 9B: THE SCENT ACADEMY */}
          {activeTab === 'academy' && (
            <MotionPage key="academy">
              <AcademyView
                fragrances={fragrances}
                wardrobeFragrances={ownedFragrances}
                onSelectFragranceForChamber={handleInspectInChamber}
                onSendToLaboratory={handleSendToLaboratory}
                onAddToWardrobe={(f) => handleAddToCabinet(f.id)}
                onNavigate={setActiveTab}
                onNavigateToHeritageAtlas={(_matId) => setActiveTab('heritage')}
              />
            </MotionPage>
          )}
        </AnimatePresence>
      </main>

      {/* Preferences Recalibration Modal */}
      <MotionModal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <div className="relative w-full rounded-3xl bg-[#14120F] border border-white/[0.12] p-6 sm:p-8 text-stone-200 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif text-2xl font-medium text-stone-100">
                Recalibrate Olfactory Preferences
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsPreferencesModalOpen(false)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6">
            <PreferenceForm
              preferences={preferences}
              setPreferences={setPreferences}
              fragrances={fragrances}
              onSubmitLayering={() => {
                setIsPreferencesModalOpen(false);
                handleCalculateLayering(undefined, true);
              }}
              isLoading={isLoading}
              onReset={() => {
                setPreferences({
                  sweetness: 5,
                  freshness: 7,
                  intensity: 6,
                  preferred_gender: 'all',
                  season: 'Summer',
                  occasion: 'Date',
                  time_of_day: 'Evening',
                  favorite_family: ['Woody Aromatic', 'Amber Vanilla'],
                  preferred_notes: []
                });
                showNotification('Preferences restored to baseline.');
              }}
            />
          </div>
        </div>
      </MotionModal>

      {/* Atelier Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#0E0C0A]/90 mt-16 py-10 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif text-base font-medium text-stone-200">
              Olfactory AI
            </span>
            <span>&bull;</span>
            <span className="text-stone-400">Fragrance Layering &amp; Heritage Scent Engine</span>
          </div>

          <p className="text-stone-500 text-center sm:text-right font-mono text-[11px]">
            Calibrated with Atmospheric Kinetics, Deg-Bhapka Botanical Archives, and 8-D Vector Embeddings.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <AppBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wardrobeCount={ownedFragrances?.length || 0}
      />
    </div>
  );
}
