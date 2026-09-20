import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Lock,
  Compass,
  SlidersHorizontal,
  Brain,
  ShieldCheck,
  Eye,
  Layers,
  Thermometer,
  BookOpen,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import {
  UserGamification,
  UserPreferences,
  Fragrance,
  WeatherCondition
} from '../../types.js';
import { olfactoryIntelligence, LivingOlfactoryDNA } from '../../services/olfactoryIntelligence.js';
import { PortraitHero } from '../portrait/PortraitHero.js';
import { InteractiveScentConstellation } from '../portrait/InteractiveScentConstellation.js';
import { ScentTerritories } from '../portrait/ScentTerritories.js';
import { GravitatePreferences } from '../portrait/GravitatePreferences.js';
import { CabinetAffinities } from '../portrait/CabinetAffinities.js';
import { LayeringPersonality } from '../portrait/LayeringPersonality.js';
import { ClimateResonance } from '../portrait/ClimateResonance.js';
import { HeritageAffinities } from '../portrait/HeritageAffinities.js';
import { PersonalDossierSummary } from '../portrait/PersonalDossierSummary.js';
import { SensoryDiscoveryRitual } from '../portrait/SensoryDiscoveryRitual.js';
import { EvidenceTelemetryDrawer } from '../portrait/EvidenceTelemetryDrawer.js';
import { api } from '../../services/api.js';

export interface MyDnaViewProps {
  gamification: UserGamification;
  preferences: UserPreferences | null;
  onOpenPreferencesModal: () => void;
  allFragrances?: Fragrance[];
  ownedFragrances?: Fragrance[];
  weather?: WeatherCondition;
  onNavigate?: (tab: string) => void;
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onSendToLab?: (fragrance: Fragrance) => void;
  onSendToLabChord?: (baseFrag: Fragrance, topFrag: Fragrance) => void;
  onWearToday?: (fragrance: Fragrance) => void;
  onNavigateToHeritageAtlas?: (materialId?: string) => void;
  onAddNoteToPreferences?: (note: string) => void;
  onCompleteVibeCheck?: (discovered: Partial<UserPreferences>) => void;
}

export const MyDnaView: React.FC<MyDnaViewProps> = ({
  gamification,
  preferences,
  onOpenPreferencesModal,
  allFragrances = [],
  ownedFragrances = [],
  weather = {
    temperature_c: 24,
    humidity_pct: 65,
    condition: 'Partly Cloudy',
    season: 'Monsoon Transition'
  },
  onNavigate = (_tab: string) => {},
  onInspectInChamber = (_fragrance: Fragrance) => {},
  onSendToLab = (_fragrance: Fragrance) => {},
  onSendToLabChord = (_baseFrag: Fragrance, _topFrag: Fragrance) => {},
  onWearToday = (_fragrance: Fragrance) => {},
  onNavigateToHeritageAtlas = (_materialId?: string) => {},
  onAddNoteToPreferences = (_note: string) => {},
  onCompleteVibeCheck = (_discovered: Partial<UserPreferences>) => {}
}) => {
  const [livingDNA, setLivingDNA] = useState<LivingOlfactoryDNA>(olfactoryIntelligence.getLivingDNA());
  const [activeChapter, setActiveChapter] = useState<string>('all');
  const [showDiscoveryRitual, setShowDiscoveryRitual] = useState<boolean>(false);
  const [fragrancesList, setFragrancesList] = useState<Fragrance[]>(allFragrances);

  const constellationRef = useRef<HTMLDivElement>(null);
  const ritualRef = useRef<HTMLDivElement>(null);

  // Refresh DNA when component mounts
  useEffect(() => {
    setLivingDNA(olfactoryIntelligence.getLivingDNA());
  }, [preferences]);

  // Load fragrances if not passed from parent
  useEffect(() => {
    if (allFragrances && allFragrances.length > 0) {
      setFragrancesList(allFragrances);
    } else {
      api.getFragrances().then(data => {
        if (data && data.length > 0) setFragrancesList(data);
      }).catch(err => console.warn('Failed to load fragrances for DNA view:', err));
    }
  }, [allFragrances]);

  const handleStartDiscoveryRitual = () => {
    setShowDiscoveryRitual(true);
    setTimeout(() => {
      ritualRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCompleteDiscoveryRitual = (discovered: Partial<UserPreferences>) => {
    // Record event to DNA engine
    olfactoryIntelligence.recordEvent({
      type: 'RATE',
      value: 5,
      context: { occasion: 'Sensory Ritual' },
      notes: `Vibe check completed: favored ${(discovered.favorite_family || []).join(', ')}`
    });

    onCompleteVibeCheck(discovered);
    setLivingDNA(olfactoryIntelligence.getLivingDNA());
    setShowDiscoveryRitual(false);
  };

  const badgesList = [
    { id: 'first_chord', name: 'First Alchemical Chord', desc: 'Synthesized dual fragrance chord in lab', icon: '🧪', unlocked: true },
    { id: 'heritage_voyager', name: 'Heritage Voyager', desc: 'Explored traditional Indian Deg-Bhapka archives', icon: '🏛️', unlocked: true },
    { id: 'weather_attuned', name: 'Atmospherically Attuned', desc: 'Calibrated formulation to live weather telemetry', icon: '🌤️', unlocked: true },
    { id: 'master_alchemist', name: 'Grand Master Alchemist', desc: 'Formulated 10 high-compatibility chords', icon: '👑', unlocked: (gamification?.xp || 0) >= 300 },
    { id: 'curator_grand', name: 'Cabinet Collector', desc: 'Curated 6 fine fragrances in digital wardrobe', icon: '🗄️', unlocked: ownedFragrances.length >= 6 },
    { id: 'archivist_submission', name: 'Guardian of Fine Perfumery', desc: 'Validated and submitted a new perfume candidate', icon: '🛡️', unlocked: Boolean(gamification?.badges?.includes('archivist_submission')) }
  ];

  const chaptersNav = [
    { id: 'portrait', label: 'I • Portrait' },
    { id: 'ritual', label: 'II • Discovery' },
    { id: 'constellation', label: 'III • 8D Constellation' },
    { id: 'territories', label: 'IV • Territories' },
    { id: 'preferences', label: 'V • Gravitations' },
    { id: 'affinities', label: 'VI • Cabinet' },
    { id: 'layering', label: 'VII • Layering' },
    { id: 'climate', label: 'VIII • Climate' },
    { id: 'heritage', label: 'IX • Heritage' },
    { id: 'dossier', label: 'X • Dossier' }
  ];

  const handleScrollToChapter = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(`chapter-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 pb-24 text-[#FAF5F0]">
      {/* Chapter Quick Navigation Bar */}
      <div className="sticky top-20 z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-[#0D0A08]/85 backdrop-blur-md border-y sm:border sm:rounded-2xl border-[#3E3228]/80 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {chaptersNav.map((chap) => (
            <button
              key={chap.id}
              onClick={() => handleScrollToChapter(chap.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase whitespace-nowrap transition-all ${
                activeChapter === chap.id
                  ? 'bg-[#2E2219] text-[#FEF3C7] border border-[#D97706] shadow-sm font-semibold'
                  : 'text-[#8C7D70] hover:text-[#D6C7B2] hover:bg-[#1A1410]'
              }`}
            >
              {chap.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHAPTER I: THE OLFACTORY PORTRAIT HERO */}
      <div id="chapter-portrait">
        <PortraitHero
          livingDNA={livingDNA}
          gamification={gamification}
          onOpenPreferencesModal={onOpenPreferencesModal}
          onStartDiscoveryRitual={handleStartDiscoveryRitual}
          activeTab={activeChapter}
          onSelectTab={handleScrollToChapter}
          cabinetCount={ownedFragrances.length}
        />
      </div>

      {/* CHAPTER II: DISCOVERY RITUAL (Toggleable or Inlined) */}
      <div id="chapter-ritual" ref={ritualRef}>
        {showDiscoveryRitual ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowDiscoveryRitual(false)}
                className="px-3 py-1.5 rounded-xl bg-[#241B16] text-xs font-mono-lab text-[#8C7D70] hover:text-[#FAF5F0] border border-[#3E3228]"
              >
                Close Discovery Ritual
              </button>
            </div>
            <SensoryDiscoveryRitual
              onCompleteRitual={handleCompleteDiscoveryRitual}
              onClose={() => setShowDiscoveryRitual(false)}
            />
          </div>
        ) : (
          <div className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-lab uppercase text-[#D97706] tracking-wider">
                Chapter II • Sensory Interview
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF5F0] font-medium">
                Calibrate Your Scent Instincts
              </h3>
              <p className="text-xs text-[#A8988B]">
                Begin a 5-step tactile sensory interview to reshape your 8D coordinates.
              </p>
            </div>

            <button
              onClick={() => setShowDiscoveryRitual(true)}
              className="px-4 py-2.5 rounded-xl bg-[#2E2219] hover:bg-[#443224] text-[#FEF3C7] text-xs font-mono-lab uppercase tracking-wider border border-[#523A25] transition-colors flex items-center gap-2 shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Launch Discovery Ritual</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* CHAPTER III: INTERACTIVE SCENT CONSTELLATION */}
      <div id="chapter-constellation" ref={constellationRef}>
        <InteractiveScentConstellation
          vector={livingDNA.vector}
          ownedFragrances={ownedFragrances}
          allFragrances={fragrancesList}
          onInspectInChamber={onInspectInChamber}
          onExploreHeritage={(matId) => onNavigateToHeritageAtlas(matId)}
        />
      </div>

      {/* CHAPTER IV: SCENT TERRITORIES */}
      <div id="chapter-territories">
        <ScentTerritories
          vector={livingDNA.vector}
        />
      </div>

      {/* CHAPTER V: WHAT YOU GRAVITATE TOWARD */}
      <div id="chapter-preferences">
        <GravitatePreferences
          preferences={preferences}
          livingDNA={livingDNA}
          ownedFragrances={ownedFragrances}
          onOpenPreferencesModal={onOpenPreferencesModal}
          onAddNote={onAddNoteToPreferences}
        />
      </div>

      {/* CHAPTER VI: CABINET AFFINITIES */}
      <div id="chapter-affinities">
        <CabinetAffinities
          livingDNA={livingDNA}
          ownedFragrances={ownedFragrances}
          allFragrances={fragrancesList}
          onInspectInChamber={onInspectInChamber}
          onSendToLab={onSendToLab}
          onWearToday={onWearToday}
          onNavigateToCabinet={() => onNavigate('wardrobe')}
        />
      </div>

      {/* CHAPTER VII: LAYERING PERSONALITY */}
      <div id="chapter-layering">
        <LayeringPersonality
          livingDNA={livingDNA}
          ownedFragrances={ownedFragrances}
          allFragrances={fragrancesList}
          onSendToLabChord={onSendToLabChord}
          onNavigateToLab={() => onNavigate('layer')}
        />
      </div>

      {/* CHAPTER VIII: CLIMATE RESONANCE */}
      <div id="chapter-climate">
        <ClimateResonance
          weather={weather}
          vector={livingDNA.vector}
        />
      </div>

      {/* CHAPTER IX: HERITAGE AFFINITIES */}
      <div id="chapter-heritage">
        <HeritageAffinities
          vector={livingDNA.vector}
          onNavigateToHeritageAtlas={onNavigateToHeritageAtlas}
        />
      </div>

      {/* CHAPTER X: MASTER PERFUMER'S ARCHIVAL DOSSIER */}
      <div id="chapter-dossier">
        <PersonalDossierSummary
          livingDNA={livingDNA}
          weather={weather}
          ownedFragrances={ownedFragrances}
          allFragrances={fragrancesList}
          onInspectInChamber={onInspectInChamber}
        />
      </div>

      {/* EARNED ACCOLADES & ARCHIVAL BADGES */}
      <section className="rounded-3xl bg-[#14100D] border border-[#3E3228] p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#3E3228] pb-4">
          <div>
            <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#D97706]">
              Mastery Progress
            </span>
            <h3 className="font-serif text-2xl text-[#FAF5F0] font-medium">
              Earned Accolades &amp; Badges
            </h3>
          </div>
          <span className="text-xs font-mono-lab text-[#F59E0B] font-semibold">
            {badgesList.filter(b => b.unlocked).length} / {badgesList.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 transition ${
                badge.unlocked
                  ? 'bg-[#1C1612] border-[#523A25] shadow-sm'
                  : 'bg-[#14100D]/50 border-[#2E241D] opacity-40'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-[#241B15] border border-[#3E3228]">
                {badge.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-[#FAF5F0]">{badge.name}</h4>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  ) : (
                    <Lock className="w-3 h-3 text-[#8C7D70]" />
                  )}
                </div>
                <p className="text-[11px] text-[#A8988B] mt-1 leading-snug">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LEVEL 5: SCIENTIFIC TRANSPARENCY & BEHAVIORAL TELEMETRY DRAWER */}
      <EvidenceTelemetryDrawer
        onRecalibrateDNA={onOpenPreferencesModal}
      />
    </div>
  );
};
