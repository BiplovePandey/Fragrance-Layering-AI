import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  Heart,
  Share2,
  FlaskConical,
  Plus,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Bot,
  MapPin,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Calendar,
  BarChart3,
  Flame,
  Award
} from 'lucide-react';
import { CommunityRecipe, Fragrance, AIProductSubmission, WeatherCondition } from '../../types.js';
import { COMMUNITY_RECIPES } from '../../data/communitySeed.js';
import { validateFineFragranceCandidate } from '../../services/ingestionEngine.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { api } from '../../services/api.js';

interface CommunityViewProps {
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  allFragrances: Fragrance[];
  weather: WeatherCondition;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  onSendToLab,
  allFragrances,
  weather
}) => {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>(COMMUNITY_RECIPES);
  const [activeTab, setActiveTab] = useState<'recipes' | 'sotd' | 'journal' | 'submit'>('recipes');

  // AI Remix State
  const [remixModalRecipe, setRemixModalRecipe] = useState<CommunityRecipe | null>(null);
  const [remixSuggestion, setRemixSuggestion] = useState<string | null>(null);

  // Ingestion Form State
  const [submissionName, setSubmissionName] = useState('');
  const [submissionBrand, setSubmissionBrand] = useState('');
  const [submissionCategory, setSubmissionCategory] = useState('eau_de_parfum');
  const [submissionDesc, setSubmissionDesc] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateFineFragranceCandidate> | null>(null);

  // Journal State
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const [newJournalFragId, setNewJournalFragId] = useState<number>(allFragrances[0]?.id || 1);
  const [newJournalOccasion, setNewJournalOccasion] = useState('Daily Office');
  const [newJournalHours, setNewJournalHours] = useState(8);
  const [newJournalCompliments, setNewJournalCompliments] = useState(2);
  const [newJournalNotes, setNewJournalNotes] = useState('');
  const [journalSuccess, setJournalSuccess] = useState(false);

  // Brand Intelligence Stats State
  const [brandIntelligence, setBrandIntelligence] = useState<any | null>(null);

  useEffect(() => {
    // Fetch journal entries
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

  const handleAddJournalEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const frag = allFragrances.find(f => f.id === newJournalFragId) || allFragrances[0];
    try {
      await api.addJournalEntry({
        fragrance_id: newJournalFragId,
        fragrance_name: frag.name,
        brand: frag.brand_name || frag.brand,
        occasion: newJournalOccasion,
        weather_temp: weather.temperature_c,
        weather_humidity: weather.humidity_pct,
        longevity_hours: newJournalHours,
        compliments_count: newJournalCompliments,
        notes: newJournalNotes
      });
      awardXP(25, 'journal_entry');
      setJournalSuccess(true);
      setTimeout(() => setJournalSuccess(false), 3000);
      const updated = await api.getJournalEntries();
      setJournalEntries(updated);
      setNewJournalNotes('');
    } catch (err) {
      console.error('Failed to save journal entry', err);
    }
  };

  const handleUpvote = (id: string) => {
    setRecipes(prev => prev.map(r => {
      if (r.id === id) {
        const currentLikes = r.upvotes ?? r.likes ?? 0;
        return { ...r, upvotes: currentLikes + 1, likes: currentLikes + 1 };
      }
      return r;
    }));
    awardXP(10, 'community_engagement');
  };

  const handleOpenRemix = (recipe: CommunityRecipe) => {
    setRemixModalRecipe(recipe);
    // Generate intelligent AI remix advice
    const weatherNote = weather.humidity_pct > 60
      ? `Due to high relative humidity (${weather.humidity_pct}%), invert the spray order: spray ${recipe.fragrance_b.name} first as a moisture-trapping anchor, reducing ${recipe.fragrance_a.name} by 1 spray to avoid cloying.`
      : `In crisp air (${weather.temperature_c}°C), boost ${recipe.fragrance_a.name} by +1 spray to accelerate radiant citrus diffusion over the ${recipe.fragrance_b.name} base.`;

    setRemixSuggestion(`AI Alchemical Remix for ${recipe.title}:
${weatherNote}
Alternative Companion: For a deeper nocturnal twist, substitute ${recipe.fragrance_b.name} with an aged sandalwood or smoked agarwood.`);
  };

  const handleValidateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateFineFragranceCandidate({
      product: submissionName,
      brand: submissionBrand,
      format: submissionCategory,
      description: submissionDesc
    }, allFragrances);
    setValidationResult(result);
    if (result.isValid) {
      awardXP(40, 'gatekeeper');
      try {
        await api.submitProductIngestion({
          name: submissionName,
          brand: submissionBrand,
          format: submissionCategory,
          description: submissionDesc,
          notes_raw: ''
        });
      } catch (err) {
        console.error('Ingestion error', err);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Social Fragrance Connoisseurs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-100">
            Community Alchemical Commons
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Discover peer-tested layering chords, AI-powered recipe remixing, and verified fine fragrance curation.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🧪 Layering Recipes ({recipes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sotd')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'sotd'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🌍 Global SOTD Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'journal'
                ? 'bg-purple-500/25 text-purple-200 border border-purple-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scent Journal ({journalEntries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🛡️ Submit &amp; Intel
          </button>
        </div>
      </div>

      {/* TAB 1: Recipes Feed */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 backdrop-blur-md shadow-xl flex flex-col justify-between group hover:border-cyan-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{recipe.author_badge || '🧪'}</span>
                    <span className="text-xs font-medium text-stone-200">{recipe.author_name || recipe.author || 'Atelier Nose'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-700/30">
                    {(recipe.season_tags && recipe.season_tags[0]) || recipe.season || (recipe.tags && recipe.tags[0]) || 'All Seasons'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-stone-100 group-hover:text-cyan-200 transition">
                  {recipe.title}
                </h3>
                <p className="text-xs text-amber-400/90 font-mono mt-0.5">
                  {recipe.chord_name}
                </p>

                <p className="text-xs text-stone-300 mt-3 leading-relaxed">
                  {recipe.description || recipe.review || ''}
                </p>

                {/* Fragrance Duo Pill */}
                <div className="mt-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Layer 1 (Base):</span>
                    <span className="text-amber-300 font-medium">{recipe.fragrance_b?.name || 'Base Anchor'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Layer 2 (Diffusion):</span>
                    <span className="text-rose-300 font-medium">{recipe.fragrance_a?.name || 'Spark Top'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleUpvote(recipe.id)}
                  className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-rose-400 transition cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span className="font-mono font-bold">{recipe.upvotes ?? recipe.likes ?? 0}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenRemix(recipe)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Remix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSendToLab(recipe.fragrance_a, recipe.fragrance_b);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Lab</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Global SOTD Feed */}
      {activeTab === 'sotd' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] backdrop-blur-md">
            <h3 className="font-serif text-2xl text-stone-100 font-medium">
              Real-Time Connoisseur Scent of the Day Feed
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Synchronized global telemetry across fragrance hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { user: 'Vikram S.', city: 'New Delhi', temp: '32°C', scent: 'Kannauj Mitti Attar + Raw by SKINN', comment: 'Cooling petrichor cuts right through high afternoon dry heat.' },
              { user: 'Camille L.', city: 'Paris', temp: '16°C', scent: 'Maison Francis Kurkdjian Baccarat Rouge 540', comment: 'Crisp spring breeze magnifies saffron crystal projection.' },
              { user: 'Ananya R.', city: 'Mumbai', temp: '29°C (82% Hum)', scent: 'Ruh Khus + Forest Essentials Sandalwood', comment: 'High humidity keeps the green vetiver root vibrant for 10+ hours.' },
              { user: 'Kenji T.', city: 'Kyoto', temp: '20°C', scent: 'Diptyque Tam Dao + Hinoki Woods', comment: 'Peaceful incense and cedar harmony for temple walks.' }
            ].map((sotd, i) => (
              <div key={i} className="p-5 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-stone-200">{sotd.user}</span>
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {sotd.city} ({sotd.temp})
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-amber-300">
                    {sotd.scent}
                  </h4>
                  <p className="text-xs text-stone-300 mt-2 italic leading-relaxed">
                    &ldquo;{sotd.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] text-[10px] font-mono text-stone-500">
                  Logged 38 minutes ago
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Fine Fragrance Ingestion Validator */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] backdrop-blur-md shadow-2xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Strict Fine Fragrance Gatekeeper</span>
            </div>
            <h2 className="font-serif text-3xl font-medium text-stone-100">
              Submit New Fine Fragrance to Universe
            </h2>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              We exclusively index fine perfumes (EDP, EDT, Extrait, Pure Parfum, Traditional Attar).
              Aerosol body sprays, talcs, lotions, and gift sets are strictly rejected by the AI ingestion validator.
            </p>
          </div>

          <form onSubmit={handleValidateSubmission} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Fragrance Name:
              </label>
              <input
                type="text"
                required
                value={submissionName}
                onChange={(e) => setSubmissionName(e.target.value)}
                placeholder="e.g. Celestial Vetiver Extrait"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-stone-200 text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Brand / Perfume House:
                </label>
                <input
                  type="text"
                  required
                  value={submissionBrand}
                  onChange={(e) => setSubmissionBrand(e.target.value)}
                  placeholder="e.g. Nasheman Kannauj"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-stone-200 text-xs focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                  Concentration / Category:
                </label>
                <select
                  value={submissionCategory}
                  onChange={(e) => setSubmissionCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#181512] border border-white/[0.08] text-stone-200 text-xs focus:outline-none"
                >
                  <option value="eau_de_parfum">Eau de Parfum (EDP)</option>
                  <option value="extrait_de_parfum">Extrait de Parfum</option>
                  <option value="pure_parfum">Pure Parfum</option>
                  <option value="attar">Traditional Deg-Bhapka Attar</option>
                  <option value="eau_de_toilette">Eau de Toilette (EDT)</option>
                  <option value="body_spray">Deodorant / Aerosol Body Spray (Will Reject)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Description &amp; Key Notes:
              </label>
              <textarea
                rows={3}
                required
                value={submissionDesc}
                onChange={(e) => setSubmissionDesc(e.target.value)}
                placeholder="Include note pyramid (top, heart, base) and formulation details..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-stone-200 text-xs focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-stone-100 font-semibold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validate &amp; Ingest into Olfactory Engine</span>
            </button>
          </form>

          {/* Validation Result Box */}
          {validationResult && (
            <div className={`p-5 rounded-2xl border ${
              validationResult.isValid
                ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-600/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-medium text-sm">
                {validationResult.isValid ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Validated as Fine Fragrance! (+40 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>Submission Rejected by Strict Fine-Fragrance Policy</span>
                  </>
                )}
              </div>
              <p className="text-xs mt-2 leading-relaxed opacity-90">
                {validationResult.reason}
              </p>
            </div>
          )}

          {/* Brand Intelligence Analytics Card */}
          {brandIntelligence && (
            <div className="mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase text-cyan-300 font-semibold tracking-wider">
                    Catalogue Brand Intelligence
                  </span>
                </div>
                <span className="text-xs font-mono text-stone-400">
                  Total Bottles: {brandIntelligence.total_fragrances}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-stone-400 block">Total Brands</span>
                  <span className="text-xl font-serif text-stone-100 font-bold">{brandIntelligence.total_brands}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-stone-400 block">Indian Houses</span>
                  <span className="text-xl font-serif text-amber-400 font-bold">{brandIntelligence.indian_houses_count}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-stone-400 block">Unique Notes</span>
                  <span className="text-xl font-serif text-cyan-300 font-bold">{brandIntelligence.unique_notes_count}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] font-mono text-stone-400 block">Indian Heritage</span>
                  <span className="text-xl font-serif text-emerald-400 font-bold">{brandIntelligence.indian_heritage_percentage}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Scent Journal */}
      {activeTab === 'journal' && (
        <div className="space-y-8">
          {/* New Entry Card */}
          <div className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
            <div>
              <span className="text-xs font-mono uppercase text-purple-400 font-semibold tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Chronological Wear Diary
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
                Log Your Scent of the Day
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Track how fragrances perform on your skin under real ambient weather conditions.
              </p>
            </div>

            <form onSubmit={handleAddJournalEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
                    Select Worn Fragrance
                  </label>
                  <select
                    value={newJournalFragId}
                    onChange={(e) => setNewJournalFragId(Number(e.target.value))}
                    className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {allFragrances.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} &bull; {f.brand_name || f.brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
                    Occasion / Context
                  </label>
                  <input
                    type="text"
                    value={newJournalOccasion}
                    onChange={(e) => setNewJournalOccasion(e.target.value)}
                    placeholder="e.g. Evening gallery opening, Client meeting"
                    className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                      Longevity (Hours on Skin)
                    </label>
                    <span className="text-xs font-mono text-purple-400 font-bold">{newJournalHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={18}
                    value={newJournalHours}
                    onChange={(e) => setNewJournalHours(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                      Compliments Received
                    </label>
                    <span className="text-xs font-mono text-purple-400 font-bold">{newJournalCompliments}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={newJournalCompliments}
                    onChange={(e) => setNewJournalCompliments(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-1.5">
                  Sensory Impressions &amp; Drydown Notes
                </label>
                <textarea
                  value={newJournalNotes}
                  onChange={(e) => setNewJournalNotes(e.target.value)}
                  placeholder="How did the top notes open? Did the base note project warmly in the heat?"
                  rows={2}
                  className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl p-3 text-stone-100 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] font-mono text-stone-400">
                  Ambient Weather: {weather.temperature_c}°C &bull; {weather.humidity_pct}% Humidity ({weather.season})
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-stone-100 text-xs font-semibold shadow-lg transition cursor-pointer"
                >
                  Save Log Entry (+25 XP)
                </button>
              </div>

              {journalSuccess && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Entry recorded to your personal fragrance journal!</span>
                </div>
              )}
            </form>
          </div>

          {/* Past Log Entries */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-medium text-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Past Journal Entries</span>
            </h3>

            {isJournalLoading ? (
              <div className="p-8 text-center text-xs font-mono text-stone-400">Loading journal logs...</div>
            ) : journalEntries.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-stone-500 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                No journal entries yet. Log your first scent of the day above!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-[#14120F]/80 border border-white/[0.06] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-medium text-stone-100">
                          {entry.fragrance_name}
                        </h4>
                        <span className="text-xs text-amber-400 font-sans block">
                          by {entry.brand} &bull; {entry.occasion}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 px-2 py-0.5 rounded bg-white/[0.04]">
                        {new Date(entry.worn_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] font-mono text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/30 text-purple-300">
                        ⏳ {entry.longevity_hours}h longevity
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/30 text-amber-300">
                        💬 {entry.compliments_count} compliments
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] text-stone-400">
                        🌡️ {entry.weather_temp}°C / {entry.weather_humidity}% RH
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-stone-300 italic leading-relaxed pt-1 border-t border-white/[0.04]">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Remix Modal */}
      {remixModalRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#14120F] border border-cyan-500/40 p-6 sm:p-8 text-stone-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="font-serif text-2xl font-medium text-stone-100">
                  AI Alchemical Remix Engine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRemixModalRecipe(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
                <span className="text-[10px] font-mono text-cyan-400 uppercase block">Base Recipe</span>
                <h4 className="font-serif text-lg font-medium text-stone-100 mt-0.5">
                  {remixModalRecipe.title}
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  {remixModalRecipe.chord_name}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-stone-300 whitespace-pre-line leading-relaxed">
                {remixSuggestion}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRemixModalRecipe(null)}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemixModalRecipe(null);
                  onSendToLab(remixModalRecipe.fragrance_a, remixModalRecipe.fragrance_b);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-700 text-stone-100 font-semibold text-xs shadow-md cursor-pointer"
              >
                Launch Remix in Lab &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
