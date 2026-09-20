import React, { useState, useEffect } from 'react';
import {
  Users,
  Compass,
  BookOpen,
  Sparkles,
  Layers,
  Archive,
  Landmark,
  FlaskConical,
  MessageSquare,
  Share2,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import {
  CommunityRecipe,
  Fragrance,
  WeatherCondition,
  UserGamification
} from '../../types.js';
import { COMMUNITY_RECIPES } from '../../data/communitySeed.js';
import { validateFineFragranceCandidate } from '../../services/ingestionEngine.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { api } from '../../services/api.js';

// Society Modular Chapter Components
import { SocietySalonHero, SocietySectionTab } from '../society/SocietySalonHero.js';
import { SocietyScentJournal } from '../society/SocietyScentJournal.js';
import { SocietyFragranceDiscoveries } from '../society/SocietyFragranceDiscoveries.js';
import { SocietyLayeringChords } from '../society/SocietyLayeringChords.js';
import { SocietyCabinetStories } from '../society/SocietyCabinetStories.js';
import { SocietyHeritageConversations } from '../society/SocietyHeritageConversations.js';
import { SocietyPeopleCallingCards } from '../society/SocietyPeopleCallingCards.js';
import { SocietyContributionComposer } from '../society/SocietyContributionComposer.js';
import { SocietyRemixModal } from '../society/SocietyRemixModal.js';
import { SocietyCommentsModal, SocietyComment } from '../society/SocietyCommentsModal.js';

export interface CommunityViewProps {
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  allFragrances: Fragrance[];
  weather: WeatherCondition;
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onAddToCabinet?: (fragrance: Fragrance) => void;
  onExploreHeritage?: () => void;
  wardrobeFragrances?: Fragrance[];
  gamification?: UserGamification;
  showNotification?: (message: string, type?: 'success' | 'amber' | 'info') => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onSendToLab,
  allFragrances,
  weather,
  onInspectInChamber,
  onAddToCabinet,
  onExploreHeritage,
  wardrobeFragrances = [],
  gamification = {
    xp: 240,
    level: 3,
    current_title: 'Journeyman Nose',
    next_level_xp: 400,
    achievements: [],
    recent_unlock: null
  },
  showNotification
}) => {
  // Navigation across Society Chapters
  const [activeSection, setActiveSection] = useState<SocietySectionTab>('salon');

  // Recipes & Chords State
  const [recipes, setRecipes] = useState<CommunityRecipe[]>(COMMUNITY_RECIPES);

  // AI Alchemical Remix State
  const [remixModalRecipe, setRemixModalRecipe] = useState<CommunityRecipe | null>(null);
  const [remixSuggestion, setRemixSuggestion] = useState<string | null>(null);

  // Journal State
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [isJournalLoading, setIsJournalLoading] = useState(false);

  // Brand Intelligence Stats State
  const [brandIntelligence, setBrandIntelligence] = useState<any | null>(null);

  // Comments / Salon Reflections State
  const [activeCommentsTarget, setActiveCommentsTarget] = useState<{ id: string; title: string } | null>(null);
  const [comments, setComments] = useState<SocietyComment[]>(() => {
    try {
      const saved = localStorage.getItem('society_salon_reflections');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'c1',
        targetId: 'recipe-1',
        author: 'Elena Perfumista',
        authorBadge: '✨',
        content: 'The peppery cardamom in Chai Musk provides the exact bridge needed to soften the sharp aquatic opening of Raw.',
        timestamp: '2 hours ago'
      },
      {
        id: 'c2',
        targetId: 'recipe-2',
        author: 'Aarav Nose',
        authorBadge: '🧪',
        content: 'In 34°C humid weather, wait a full 60 seconds before applying the vetiver mist to let the sandalwood bond with pulse points.',
        timestamp: 'Yesterday'
      },
      {
        id: 'c3',
        targetId: 'thread-kannauj-mitti',
        author: 'Vikram S.',
        authorBadge: '🏛️',
        content: 'The authentic Deg condensation process creates a distinct mineral sweetness that synthetic geosmin molecules can never replicate.',
        timestamp: '3 days ago'
      }
    ];
  });

  // Share Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    if (showNotification) {
      showNotification(msg, 'amber');
    }
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  useEffect(() => {
    const fetchJournal = async () => {
      setIsJournalLoading(true);
      try {
        const entries = await api.getJournalEntries();
        setJournalEntries(entries);
      } catch (err) {
        console.error('Failed to load journal', err);
      } finally {
        setIsJournalLoading(false);
      }
    };

    const fetchBrandIntel = async () => {
      try {
        const intel = await api.getBrandIntelligence();
        setBrandIntelligence(intel);
      } catch (err) {
        console.error('Failed to load brand intel', err);
      }
    };

    fetchJournal();
    fetchBrandIntel();
  }, []);

  // --- Handlers ---
  const handleAddJournalEntry = async (entryData: {
    fragrance_id: number;
    fragrance_name: string;
    brand: string;
    occasion: string;
    longevity_hours: number;
    compliments_count: number;
    weather_temp: number;
    weather_humidity: number;
    notes: string;
  }) => {
    await api.addJournalEntry(entryData);
    awardXP(25, 'journal_entry');
    const updated = await api.getJournalEntries();
    setJournalEntries(updated);
    displayToast(`Inscribed "${entryData.fragrance_name}" into your Wear Diary (+25 XP).`);
  };

  const handleAddChord = (newChord: CommunityRecipe) => {
    setRecipes((prev) => [newChord, ...prev]);
    awardXP(35, 'community_engagement');
    displayToast(`Published chord "${newChord.chord_name}" to the Society (+35 XP).`);
  };

  const handleSubmitCandidate = async (candidateData: {
    name: string;
    brand_name: string;
    concentration: string;
    fragrance_family: string;
    notes_list: string;
    description: string;
  }) => {
    const validation = validateFineFragranceCandidate({
      product: candidateData.name,
      brand: candidateData.brand_name,
      format: candidateData.concentration,
      description: candidateData.description
    }, allFragrances);

    if (!validation.isValid) {
      throw new Error(`Rejected by Fine Fragrance Gatekeeper: ${validation.reason}`);
    }

    await api.submitProductIngestion({
      name: candidateData.name,
      brand: candidateData.brand_name,
      format: candidateData.concentration,
      description: candidateData.description,
      notes_raw: candidateData.notes_list
    });

    awardXP(40, 'gatekeeper');
    displayToast(`Validated & Ingested "${candidateData.name}" into Catalogue (+40 XP).`);
  };

  const handleUpvote = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const wasLiked = r.has_liked;
          const currentLikes = r.upvotes ?? r.likes ?? 0;
          return {
            ...r,
            upvotes: wasLiked ? currentLikes - 1 : currentLikes + 1,
            likes: wasLiked ? currentLikes - 1 : currentLikes + 1,
            has_liked: !wasLiked
          };
        }
        return r;
      })
    );
    awardXP(10, 'community_engagement');
  };

  const handleOpenRemix = (recipe: CommunityRecipe) => {
    setRemixModalRecipe(recipe);
    const weatherNote =
      weather.humidity_pct > 60
        ? `Given high ambient humidity (${weather.humidity_pct}%), apply ${recipe.fragrance_b?.name || 'the base anchor'} first onto warm pulse points. Wait 60 seconds for the fixation to stabilize before layering ${recipe.fragrance_a?.name || 'the top spark'} to prevent water-vapor entrapment.`
        : `Under current ambient conditions (${weather.temperature_c}°C), the volatility of ${recipe.fragrance_a?.name || 'the top note'} provides an initial 2-hour sillage radius, harmonizing with the drydown of ${recipe.fragrance_b?.name || 'the base'}.`;

    setRemixSuggestion(`AI Alchemical Society Remix for "${recipe.title}":

• Microclimate Calibration: ${weatherNote}

• Evaporation Harmony: Ensure a 2:1 ratio favoring the resinous base so the citrus diffusion spark doesn't overpower the drydown.

• Alternative Botanical Counterpoint: Consider pairing with an authentic Kannauj Mitti Attar or Mysore Sandalwood anchor for added mineral warmth.`);
  };

  const handleLaunchRemixInLab = (recipe: CommunityRecipe) => {
    setRemixModalRecipe(null);
    onSendToLab(recipe.fragrance_a, recipe.fragrance_b);
    displayToast(`Transferred "${recipe.chord_name}" to AI Layering Laboratory.`);
  };

  const handleAddComment = (targetId: string, content: string, author: string) => {
    const newComm: SocietyComment = {
      id: `comm-${Date.now()}`,
      targetId,
      author,
      authorBadge: '✒️',
      content,
      timestamp: 'Just now'
    };
    const updated = [...comments, newComm];
    setComments(updated);
    try {
      localStorage.setItem('society_salon_reflections', JSON.stringify(updated));
    } catch {}
    awardXP(5, 'community_engagement');
    displayToast('Your reflection has been recorded in the salon conversation.');
  };

  const handleShareCitation = (title: string, note: string) => {
    const citation = `[The Private Fragrance Society]\n${title}\n"${note}"\n— Olfactory AI Atelier`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(citation);
    }
    displayToast(`Copied formula citation for "${title}" to clipboard.`);
  };

  const featuredChord = recipes[0] || COMMUNITY_RECIPES[0];
  const featuredFragrance = allFragrances[0] || {
    id: 1,
    name: 'Raw',
    brand: 'SKINN by Titan',
    brand_name: 'SKINN by Titan',
    fragrance_family: 'Citrus / Woody',
    longevity: '8-10 hrs',
    description: 'Crisp bergamot and mandarin opening grounded by patchouli and guaiac wood.'
  } as Fragrance;

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#14110E] border border-amber-500/40 text-amber-200 text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CHAPTER I: THE SALON (Cinematic Entrance & Featured Triptych) */}
      <section id="society-salon">
        <SocietySalonHero
          activeSection={activeSection}
          onSelectSection={(tab) => {
            setActiveSection(tab);
            const el = document.getElementById(`society-${tab}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          featuredChord={featuredChord}
          featuredFragrance={featuredFragrance}
          weather={weather}
          onSendToLab={onSendToLab}
          onInspectInChamber={onInspectInChamber}
          onExploreHeritage={onExploreHeritage}
        />
      </section>

      {/* CHAPTER II: SCENT JOURNAL */}
      <section id="society-journal">
        <SocietyScentJournal
          entries={journalEntries}
          isLoading={isJournalLoading}
          allFragrances={allFragrances}
          weather={weather}
          onOpenComposer={() => {
            setActiveSection('contribute');
            const el = document.getElementById('society-contribute');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          onInspectInChamber={onInspectInChamber}
          onSendToLab={onSendToLab}
          onOpenComments={(targetId, title) => setActiveCommentsTarget({ id: targetId, title })}
          onShareItem={handleShareCitation}
        />
      </section>

      {/* CHAPTER III: FRAGRANCE DISCOVERIES */}
      <section id="society-discoveries">
        <SocietyFragranceDiscoveries
          allFragrances={allFragrances}
          wardrobeFragrances={wardrobeFragrances}
          onInspectInChamber={onInspectInChamber}
          onSendToLab={onSendToLab}
          onAddToCabinet={onAddToCabinet}
        />
      </section>

      {/* CHAPTER IV: THE SOCIETY'S CHORDS */}
      <section id="society-chords">
        <SocietyLayeringChords
          recipes={recipes}
          onSendToLab={onSendToLab}
          onOpenRemix={handleOpenRemix}
          onUpvoteRecipe={handleUpvote}
          onOpenComments={(targetId, title) => setActiveCommentsTarget({ id: targetId, title })}
          onShareChord={handleShareCitation}
          onInspectInChamber={onInspectInChamber}
        />
      </section>

      {/* CHAPTER V: CABINET STORIES */}
      <section id="society-cabinets">
        <SocietyCabinetStories
          allFragrances={allFragrances}
          wardrobeFragrances={wardrobeFragrances}
          onInspectInChamber={onInspectInChamber}
          onSendToLab={onSendToLab}
          onShareItem={handleShareCitation}
        />
      </section>

      {/* CHAPTER VI: HERITAGE CONVERSATIONS */}
      <section id="society-heritage">
        <SocietyHeritageConversations
          onNavigateToAtlas={onExploreHeritage}
          onOpenComments={(targetId, title) => setActiveCommentsTarget({ id: targetId, title })}
          onShareItem={handleShareCitation}
        />
      </section>

      {/* CHAPTER VII: PEOPLE OF THE ATELIER */}
      <section id="society-people">
        <SocietyPeopleCallingCards
          gamification={gamification}
          allFragrances={allFragrances}
          recipes={recipes}
          onSendToLab={onSendToLab}
          onInspectInChamber={onInspectInChamber}
        />
      </section>

      {/* CHAPTER VIII: YOUR CONTRIBUTION & BRAND INTELLIGENCE */}
      <section id="society-contribute" className="space-y-8">
        <SocietyContributionComposer
          allFragrances={allFragrances}
          weather={weather}
          onAddJournalEntry={handleAddJournalEntry}
          onAddChord={handleAddChord}
          onSubmitCandidate={handleSubmitCandidate}
        />

        {/* Brand Intelligence Analytics (Preserved from original) */}
        {brandIntelligence && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14110E] border border-amber-500/20 text-[#F8F5EE] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-xl font-medium text-[#F8F5EE]">
                  Society Catalogue Intelligence
                </h3>
              </div>
              <span className="text-[11px] font-mono-lab text-stone-400">
                Audited Fine Perfumery Index: {brandIntelligence.total_fragrances} Flacons
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono-lab text-stone-400 uppercase block">Total Houses</span>
                <span className="text-2xl font-serif text-[#F8F5EE] font-medium">{brandIntelligence.total_brands}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono-lab text-amber-400/90 uppercase block">Indian Houses</span>
                <span className="text-2xl font-serif text-amber-300 font-medium">{brandIntelligence.indian_houses_count}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono-lab text-stone-400 uppercase block">Unique Notes</span>
                <span className="text-2xl font-serif text-[#F8F5EE] font-medium">{brandIntelligence.unique_notes_count}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="text-[10px] font-mono-lab text-emerald-400/90 uppercase block">Indian Heritage</span>
                <span className="text-2xl font-serif text-emerald-300 font-medium">{brandIntelligence.indian_heritage_percentage}%</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* AI Alchemical Remix Modal */}
      <SocietyRemixModal
        recipe={remixModalRecipe}
        suggestion={remixSuggestion}
        onClose={() => setRemixModalRecipe(null)}
        onLaunchInLab={handleLaunchRemixInLab}
      />

      {/* Salon Reflections Dialogue Modal */}
      {activeCommentsTarget && (
        <SocietyCommentsModal
          title={activeCommentsTarget.title}
          subtitle="The Private Fragrance Society Dialogue"
          targetId={activeCommentsTarget.id}
          comments={comments}
          onAddComment={handleAddComment}
          onClose={() => setActiveCommentsTarget(null)}
        />
      )}
    </div>
  );
};
