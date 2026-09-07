import React, { useState, useEffect } from 'react';
import { Navbar, MainNavTab } from './components/Navbar.js';
import { AppBottomNav } from './components/AppBottomNav.js';
import { HomeHero } from './components/HomeHero.js';
import { DailyMoodPicker } from './components/DailyMoodPicker.js';
import { FloatingNoteBubbles } from './components/FloatingNoteBubbles.js';
import { TinderVibeDeck } from './components/TinderVibeDeck.js';
import { IndianSoulSection } from './components/IndianSoulSection.js';
import { VisualPreferenceCards } from './components/VisualPreferenceCards.js';
import { PreferenceForm } from './components/PreferenceForm.js';
import { LayeringResultCard } from './components/LayeringResultCard.js';
import { ScentProfileView } from './components/ScentProfileView.js';
import { MyCollectionCabinet } from './components/MyCollectionCabinet.js';
import { SingleRecommendationView } from './components/SingleRecommendationView.js';
import { FragranceExplorer } from './components/FragranceExplorer.js';
import { SavedCombinationsList } from './components/SavedCombinationsList.js';
import { BrandCatalogView } from './components/BrandCatalogView.js';
import { OpeningExperience } from './components/OpeningExperience.js';
import { RecommendationLoadingModal } from './components/RecommendationLoadingModal.js';
import { api } from './services/api.js';
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
  DailyMoodPreset
} from './types.js';
import { Sparkles, CheckCircle2, SlidersHorizontal, ArrowRight, Layers, Compass, Building2 } from 'lucide-react';
import { DAILY_MOOD_PRESETS } from './data/moods.js';

export default function App() {
  const [showOpening, setShowOpening] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('has_seen_olfactive_opening') !== 'true';
    } catch {
      return true;
    }
  });

  const [selectedMoodId, setSelectedMoodId] = useState<DailyMoodId | null>(null);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [exploreSubTab, setExploreSubTab] = useState<'catalog' | 'houses' | 'clusters'>('catalog');

  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [taxonomy, setTaxonomy] = useState<NoteTaxonomyEntry[]>([]);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [ownedFragrances, setOwnedFragrances] = useState<Fragrance[]>([]);
  const [savedCombinations, setSavedCombinations] = useState<SavedCombination[]>([]);
  const [layeringResults, setLayeringResults] = useState<LayeringResult[]>([]);
  const [singleRecommendations, setSingleRecommendations] = useState<RecommendationScore[]>([]);

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
        const [frags, cls, col, saved, prefs, brandList, taxList] = await Promise.all([
          api.getFragrances(),
          api.getClusters(),
          api.getCollection(),
          api.getSavedCombinations(),
          api.getUserPreferences(1),
          api.getBrands(),
          api.getTaxonomy()
        ]);

        setFragrances(frags);
        setClusters(cls);
        setOwnedFragrances(col.fragrances);
        setSavedCombinations(saved);
        setBrands(brandList);
        setTaxonomy(taxList);
        if (prefs && Object.keys(prefs).length > 0) {
          setPreferences(prev => ({ ...prev, ...prefs }));
        }

        const initialPairs = await api.getLayeringCombinations({
          preferences: prefs && Object.keys(prefs).length > 0 ? prefs : preferences,
          limit: 4
        });
        setLayeringResults(initialPairs);
      } catch (err) {
        console.error('Error initializing application data:', err);
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
    showNotification('✨ Your signature scent match is composed!');
    setTimeout(() => {
      const el = document.getElementById('layering-results-anchor');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleCalculateSingle = async () => {
    setIsLoading(true);
    try {
      const results = await api.getSingleRecommendations(preferences);
      setSingleRecommendations(results);
      setActiveTab('explore');
      setExploreSubTab('catalog');
      showNotification('Ranked top individual perfume matches.');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCombination = async (result: LayeringResult) => {
    try {
      const res = await api.saveCombination({
        fragrance_a_id: result.fragrance_a.id,
        fragrance_b_id: result.fragrance_b.id,
        compatibility_score: result.compatibility_score,
        explanation: result.explanation,
        season: result.best_season,
        occasion: result.best_occasion
      });

      if (res.success) {
        const updatedSaved = await api.getSavedCombinations();
        setSavedCombinations(updatedSaved);
        showNotification(`Saved "${result.fragrance_a.name} + ${result.fragrance_b.name}" to your Wardrobe.`);
      }
    } catch (err) {
      console.error(err);
      showNotification('Could not save combination', 'info');
    }
  };

  const handleRateCombination = async (fragAId: number, fragBId: number, rating: number, feedbackTag?: string) => {
    try {
      await api.submitRating({
        fragrance_a_id: fragAId,
        fragrance_b_id: fragBId,
        rating,
        feedback_tag: feedbackTag
      });
      showNotification(`Thank you! Rating (${rating} stars) recorded to personalize future pairings.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSaved = async (id: number) => {
    try {
      await api.deleteSavedCombination(id);
      setSavedCombinations(prev => prev.filter(item => item.id !== id));
      showNotification('Combination removed from archive.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCabinet = async (fragId: number) => {
    try {
      await api.addToCollection(fragId);
      const updated = await api.getCollection();
      setOwnedFragrances(updated.fragrances);
      showNotification('Bottle added to your personal cabinet shelf.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromCabinet = async (fragId: number) => {
    try {
      await api.removeFromCollection(fragId);
      setOwnedFragrances(prev => prev.filter(f => f.id !== fragId));
      showNotification('Bottle removed from shelf.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLayerFromCabinet = () => {
    const ownedIds = ownedFragrances.map(f => f.id);
    handleCalculateLayering(ownedIds, true);
  };

  const handleResetPreferences = () => {
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
    setSelectedMoodId(null);
    showNotification('Preferences restored to baseline.');
  };

  const handleCompleteOpening = () => {
    setShowOpening(false);
    try {
      sessionStorage.setItem('has_seen_olfactive_opening', 'true');
    } catch {}
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

    // Compute bespoke layering
    handleCalculateLayering(undefined, true);
  };

  const handleSurpriseMe = () => {
    const surprisePreset = DAILY_MOOD_PRESETS.find(p => p.id === 'surprise_me') || DAILY_MOOD_PRESETS[0];
    handleSelectMood(surprisePreset);
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

  const indianFragrances = fragrances.filter(f => f.is_indian_house);

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#292323] flex flex-col font-sans selection:bg-[#FFE8D1] pb-20 sm:pb-0">
      {/* Opening Intro Sequence */}
      {showOpening && (
        <OpeningExperience onComplete={handleCompleteOpening} />
      )}

      {/* Playful 1.5-2s Loading Reward Animation */}
      <RecommendationLoadingModal
        isOpen={showRewardingModal}
        onFinish={handleRewardingModalFinish}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedCombinations.length}
        cabinetCount={ownedFragrances.length}
        onReplayOpening={() => setShowOpening(true)}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#292323] text-white rounded-2xl shadow-xl border border-[#E86A92]/40 text-xs font-medium animate-bounce-short">
          <CheckCircle2 className="w-4 h-4 text-[#F2A65A] shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">
        {/* =========================================================================
            TAB 1: HOME (Scent Universe, Vibe Cards, Tinder Deck, Bubbles, Indian Soul)
           ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Showcase */}
            <HomeHero
              onStart={() => {
                const el = document.getElementById('daily-mood-picker-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCabinet={() => setActiveTab('collection')}
              onOpenClusters={() => {
                setActiveTab('explore');
                setExploreSubTab('clusters');
              }}
              onSurpriseMe={handleSurpriseMe}
            />

            {/* Daily Mood Cards (Sephora/Pinterest style) */}
            <DailyMoodPicker
              selectedMoodId={selectedMoodId}
              onSelectMood={handleSelectMood}
              onExploreCustom={() => setShowCustomForm(true)}
              showCustomForm={showCustomForm}
              onToggleCustomForm={() => setShowCustomForm(prev => !prev)}
              onInstantCalculate={() => handleCalculateLayering(undefined, true)}
              isLoading={isLoading}
            />

            {/* Tinder-style Fragrance Swipe Taste Deck */}
            <TinderVibeDeck
              onCompleteVibeCheck={handleCompleteTinderVibe}
            />

            {/* Floating Interactive Note Bubbles */}
            <FloatingNoteBubbles
              onAddNoteToPreferences={handleAddNoteToPreferences}
            />

            {/* Indian Soul: Modern Luxury Indian Perfumery Section */}
            <IndianSoulSection
              indianFragrances={indianFragrances}
              onSelectIndianFragrance={(fragId) => {
                setPreferences(prev => ({ ...prev, owned_fragrance_id: fragId }));
                handleCalculateLayering(undefined, true);
              }}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 2: LAYER (Layering Studio, Visual Selectors, Dual Card Results & Mist)
           ========================================================================= */}
        {activeTab === 'layer' && (
          <div className="space-y-10 animate-fade-in">
            {/* Visual Selectors: Season, Occasion, Budget, Heritage */}
            <VisualPreferenceCards
              preferences={preferences}
              setPreferences={setPreferences}
              onInstantCalculate={() => handleCalculateLayering(undefined, true)}
              isLoading={isLoading}
            />

            {/* Toggleable Deep Fine-Tuning Slider Form */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCustomForm(prev => !prev)}
                className="text-xs font-semibold text-[#7B3F98] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showCustomForm ? 'Hide Advanced Sliders' : 'Open Numeric Precision Sliders'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetPreferences}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Reset to Defaults
              </button>
            </div>

            {showCustomForm && (
              <div id="custom-sliders-container" className="pt-2 animate-fade-in">
                <PreferenceForm
                  preferences={preferences}
                  setPreferences={setPreferences}
                  fragrances={fragrances}
                  onSubmitLayering={() => handleCalculateLayering(undefined, true)}
                  isLoading={isLoading}
                  onReset={handleResetPreferences}
                />
              </div>
            )}

            {/* Layering Results Section */}
            <div id="layering-results-anchor" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E6DD] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#E86A92]" />
                    <h2 className="font-serif text-3xl font-medium text-[#292323] tracking-tight">
                      Layering Recommendations &amp; Olfactory Rituals
                    </h2>
                  </div>
                  <p className="text-xs text-[#786F6A] mt-1">
                    Ranked by note complementarity, contrast harmony, seasonal appropriateness, and personal affinities.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCalculateSingle}
                    className="px-4 py-2 bg-white hover:bg-stone-50 border border-[#F0E6DD] text-[#7B3F98] text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    View Single Scent Matches &rarr;
                  </button>
                </div>
              </div>

              {layeringResults.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#F0E6DD] p-12 text-center text-[#786F6A] space-y-3">
                  <span className="text-4xl">🧪</span>
                  <h4 className="font-serif text-xl font-medium text-[#292323]">Ready to blend chords?</h4>
                  <p className="text-xs max-w-sm mx-auto">
                    Select your season, occasion, or tap &ldquo;Calculate Layer Pairs&rdquo; to explore harmonic pairings.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCalculateLayering(undefined, true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B3F98] to-[#E86A92] text-white text-xs font-semibold shadow-xs"
                  >
                    Calculate Layering Now
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {layeringResults.map((result) => {
                    const isAlreadySaved = savedCombinations.some(
                      s => (s.fragrance_a.id === result.fragrance_a.id && s.fragrance_b.id === result.fragrance_b.id) ||
                           (s.fragrance_a.id === result.fragrance_b.id && s.fragrance_b.id === result.fragrance_a.id)
                    );
                    return (
                      <LayeringResultCard
                        key={`${result.fragrance_a.id}-${result.fragrance_b.id}`}
                        result={result}
                        onSave={handleSaveCombination}
                        onRate={handleRateCombination}
                        isSaved={isAlreadySaved}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: EXPLORE (Fragrance & Notes Catalog, Houses, K-Means Math)
           ========================================================================= */}
        {activeTab === 'explore' && (
          <div className="space-y-8 animate-fade-in">
            {/* Subnav Pill Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#F0E6DD] w-fit shadow-2xs">
              <button
                type="button"
                onClick={() => setExploreSubTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  exploreSubTab === 'catalog'
                    ? 'bg-[#7B3F98] text-white shadow-xs'
                    : 'text-[#786F6A] hover:text-[#292323]'
                }`}
              >
                Individual Scents &amp; Rankings
              </button>

              <button
                type="button"
                onClick={() => setExploreSubTab('houses')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  exploreSubTab === 'houses'
                    ? 'bg-[#7B3F98] text-white shadow-xs'
                    : 'text-[#786F6A] hover:text-[#292323]'
                }`}
              >
                Indian &amp; Global Houses
              </button>

              <button
                type="button"
                onClick={() => setExploreSubTab('clusters')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  exploreSubTab === 'clusters'
                    ? 'bg-[#7B3F98] text-white shadow-xs'
                    : 'text-[#786F6A] hover:text-[#292323]'
                }`}
              >
                K-Means Vector Space
              </button>
            </div>

            {exploreSubTab === 'catalog' && (
              <div className="space-y-8">
                <SingleRecommendationView
                  recommendations={singleRecommendations.length > 0 ? singleRecommendations : []}
                  isLoading={isLoading}
                  onSelectForLayering={(fragranceId) => {
                    setPreferences(prev => ({ ...prev, owned_fragrance_id: fragranceId }));
                    handleCalculateLayering(undefined, true);
                  }}
                />

                {singleRecommendations.length === 0 && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleCalculateSingle}
                      className="px-6 py-3 bg-gradient-to-r from-[#7B3F98] to-[#E86A92] text-white rounded-2xl text-xs font-semibold shadow-md hover:opacity-95 transition-all"
                    >
                      Compute Single Scent Recommendations
                    </button>
                  </div>
                )}
              </div>
            )}

            {exploreSubTab === 'houses' && (
              <BrandCatalogView
                brands={brands}
                fragrances={fragrances}
                taxonomy={taxonomy}
                onSelectFragranceToLayer={(fragId) => {
                  setPreferences(prev => ({ ...prev, owned_fragrance_id: fragId }));
                  handleCalculateLayering(undefined, true);
                  showNotification('Selected fragrance as anchor.');
                }}
              />
            )}

            {exploreSubTab === 'clusters' && (
              <FragranceExplorer
                fragrances={fragrances}
                clusters={clusters}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: COLLECTION (Vanity Cabinet Shelf & Saved Pairings)
           ========================================================================= */}
        {activeTab === 'collection' && (
          <div className="space-y-12 animate-fade-in">
            {/* Shelf / Cabinet */}
            <MyCollectionCabinet
              allFragrances={fragrances}
              ownedFragrances={ownedFragrances}
              onAddToCabinet={handleAddToCabinet}
              onRemoveFromCabinet={handleRemoveFromCabinet}
              onFindCombinationsFromCabinet={handleLayerFromCabinet}
            />

            {/* Saved Pairings Archive */}
            <SavedCombinationsList
              savedList={savedCombinations}
              onDelete={handleDeleteSaved}
              onExplorePair={(fragAId) => {
                setPreferences(prev => ({ ...prev, owned_fragrance_id: fragAId }));
                handleCalculateLayering(undefined, true);
              }}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 5: PROFILE (Spotify-Wrapped Style Scent Profile, Badges & Milestones)
           ========================================================================= */}
        {activeTab === 'profile' && (
          <ScentProfileView
            preferences={preferences}
            savedCombinations={savedCombinations}
            ownedFragrances={ownedFragrances.map(f => f.id)}
            allFragrances={fragrances}
            onExploreLayering={() => {
              setActiveTab('layer');
              handleCalculateLayering(undefined, true);
            }}
          />
        )}
      </main>

      {/* Sleek Scent Universe Footer */}
      <footer className="border-t border-[#F0E6DD] bg-white mt-16 py-10 text-[#786F6A] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#292323]">
              Scently
            </span>
            <span>&bull;</span>
            <span>Harmonic Olfactory Architecture</span>
          </div>

          <p className="text-stone-400">
            Powered by K-Means Olfactory Vectors, Cosine Similarity, and Botanical Chord Chemistry.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <AppBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedCombinations.length}
        cabinetCount={ownedFragrances.length}
      />
    </div>
  );
}
