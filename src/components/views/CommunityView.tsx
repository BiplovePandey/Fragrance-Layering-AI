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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white text-cyan-950 text-xs font-mono-lab mb-2 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-cyan-700" />
            <span>Social Fragrance Connoisseurs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
            Community Alchemical Commons
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1">
            Discover peer-tested layering chords, AI-powered recipe remixing, and verified fine fragrance curation.
          </p>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl liquid-glass-pill self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'recipes'
                ? 'bg-white/90 text-[#1A1613] font-bold shadow-xs'
                : 'text-[#5A5046] hover:text-[#1A1613]'
            }`}
          >
            🧪 Layering Recipes ({recipes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sotd')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'sotd'
                ? 'bg-white/90 text-[#1A1613] font-bold shadow-xs'
                : 'text-[#5A5046] hover:text-[#1A1613]'
            }`}
          >
            🌍 Global SOTD Feed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'journal'
                ? 'bg-purple-900 text-white font-bold shadow-xs'
                : 'text-[#5A5046] hover:text-[#1A1613]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scent Journal ({journalEntries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'text-[#5A5046] hover:text-[#1A1613]'
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
              className="rounded-3xl liquid-glass p-6 flex flex-col justify-between group hover:shadow-lg transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{recipe.author_badge || '🧪'}</span>
                    <span className="text-xs font-medium text-[#1A1613]">{recipe.author_name || recipe.author || 'Atelier Nose'}</span>
                  </div>
                  <span className="text-[10px] font-mono-lab text-cyan-900 px-2 py-0.5 rounded bg-cyan-100/90 border border-cyan-300">
                    {(recipe.season_tags && recipe.season_tags[0]) || recipe.season || (recipe.tags && recipe.tags[0]) || 'All Seasons'}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#1A1613] group-hover:text-amber-900 transition">
                  {recipe.title}
                </h3>
                <p className="text-xs text-amber-800 font-mono-lab mt-0.5 font-semibold">
                  {recipe.chord_name}
                </p>

                <p className="text-xs text-[#5A5046] mt-3 leading-relaxed">
                  {recipe.description || recipe.review || ''}
                </p>

                {/* Fragrance Duo Pill */}
                <div className="mt-4 p-3 rounded-2xl liquid-glass-inset text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7A6F66]">Layer 1 (Base):</span>
                    <span className="text-amber-900 font-medium">{recipe.fragrance_b?.name || 'Base Anchor'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6F66]">Layer 2 (Diffusion):</span>
                    <span className="text-rose-900 font-medium">{recipe.fragrance_a?.name || 'Spark Top'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleUpvote(recipe.id)}
                  className="flex items-center gap-1.5 text-xs text-[#7A6F66] hover:text-rose-600 transition cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span className="font-mono-lab font-bold">{recipe.upvotes ?? recipe.likes ?? 0}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenRemix(recipe)}
                    className="px-3 py-1.5 rounded-xl liquid-glass-pill text-[#1A1613] text-xs font-medium transition cursor-pointer flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5 text-teal-700" />
                    <span>AI Remix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSendToLab(recipe.fragrance_a, recipe.fragrance_b);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
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
          <div className="p-6 rounded-3xl bg-white/95 border border-[#E3DACB] backdrop-blur-md shadow-sm">
            <h3 className="font-serif text-2xl text-[#1A1613] font-medium">
              Real-Time Connoisseur Scent of the Day Feed
            </h3>
            <p className="text-xs text-[#5A5046] mt-1">
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
              <div key={i} className="p-5 rounded-3xl bg-white/95 border border-[#E3DACB] flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-[#1A1613]">{sotd.user}</span>
                    <span className="text-[10px] font-mono-lab text-teal-800 flex items-center gap-1 font-semibold">
                      <MapPin className="w-3 h-3 text-teal-700" /> {sotd.city} ({sotd.temp})
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-amber-900">
                    {sotd.scent}
                  </h4>
                  <p className="text-xs text-[#5A5046] mt-2 italic leading-relaxed">
                    &ldquo;{sotd.comment}&rdquo;
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DFD3] text-[10px] font-mono-lab text-[#7A6F66]">
                  Logged 38 minutes ago
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Fine Fragrance Ingestion Validator */}
      {activeTab === 'submit' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#E3DACB] backdrop-blur-md shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-mono-lab mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Strict Fine Fragrance Gatekeeper</span>
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#1A1613]">
              Submit New Fine Fragrance to Universe
            </h2>
            <p className="text-xs text-[#5A5046] mt-1 leading-relaxed">
              We exclusively index fine perfumes (EDP, EDT, Extrait, Pure Parfum, Traditional Attar).
              Aerosol body sprays, talcs, lotions, and gift sets are strictly rejected by the AI ingestion validator.
            </p>
          </div>

          <form onSubmit={handleValidateSubmission} className="space-y-4">
            <div>
              <label className="text-xs font-mono-lab uppercase tracking-wider text-[#7A6F66] block mb-1 font-semibold">
                Fragrance Name:
              </label>
              <input
                type="text"
                required
                value={submissionName}
                onChange={(e) => setSubmissionName(e.target.value)}
                placeholder="e.g. Celestial Vetiver Extrait"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-[#1A1613] text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono-lab uppercase tracking-wider text-[#7A6F66] block mb-1 font-semibold">
                  Brand / Perfume House:
                </label>
                <input
                  type="text"
                  required
                  value={submissionBrand}
                  onChange={(e) => setSubmissionBrand(e.target.value)}
                  placeholder="e.g. Nasheman Kannauj"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-[#1A1613] text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono-lab uppercase tracking-wider text-[#7A6F66] block mb-1 font-semibold">
                  Concentration / Category:
                </label>
                <select
                  value={submissionCategory}
                  onChange={(e) => setSubmissionCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-[#1A1613] text-xs focus:outline-none"
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
              <label className="text-xs font-mono-lab uppercase tracking-wider text-[#7A6F66] block mb-1 font-semibold">
                Description &amp; Key Notes:
              </label>
              <textarea
                rows={3}
                required
                value={submissionDesc}
                onChange={(e) => setSubmissionDesc(e.target.value)}
                placeholder="Include note pyramid (top, heart, base) and formulation details..."
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-[#1A1613] text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validate &amp; Ingest into Olfactory Engine</span>
            </button>
          </form>

          {/* Validation Result Box */}
          {validationResult && (
            <div className={`p-5 rounded-2xl border ${
              validationResult.isValid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 font-medium text-sm">
                {validationResult.isValid ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>Validated as Fine Fragrance! (+40 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-700" />
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
            <div className="mt-8 p-6 rounded-3xl bg-[#F8F5EE] border border-[#E3DACB] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-mono-lab uppercase text-teal-900 font-semibold tracking-wider">
                    Catalogue Brand Intelligence
                  </span>
                </div>
                <span className="text-xs font-mono-lab text-[#7A6F66]">
                  Total Bottles: {brandIntelligence.total_fragrances}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-[#E3DACB]">
                  <span className="text-[10px] font-mono-lab text-[#7A6F66] block">Total Brands</span>
                  <span className="text-xl font-serif text-[#1A1613] font-bold">{brandIntelligence.total_brands}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E3DACB]">
                  <span className="text-[10px] font-mono-lab text-[#7A6F66] block">Indian Houses</span>
                  <span className="text-xl font-serif text-amber-800 font-bold">{brandIntelligence.indian_houses_count}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E3DACB]">
                  <span className="text-[10px] font-mono-lab text-[#7A6F66] block">Unique Notes</span>
                  <span className="text-xl font-serif text-teal-800 font-bold">{brandIntelligence.unique_notes_count}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E3DACB]">
                  <span className="text-[10px] font-mono-lab text-[#7A6F66] block">Indian Heritage</span>
                  <span className="text-xl font-serif text-emerald-800 font-bold">{brandIntelligence.indian_heritage_percentage}%</span>
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
          <div className="rounded-3xl bg-white/95 border border-[#E3DACB] p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono-lab uppercase text-purple-900 font-semibold tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-700" /> Chronological Wear Diary
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613] mt-1">
                Log Your Scent of the Day
              </h2>
              <p className="text-xs text-[#5A5046] mt-1">
                Track how fragrances perform on your skin under real ambient weather conditions.
              </p>
            </div>

            <form onSubmit={handleAddJournalEntry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono-lab text-[#7A6F66] uppercase tracking-wider block mb-1.5 font-semibold">
                    Select Worn Fragrance
                  </label>
                  <select
                    value={newJournalFragId}
                    onChange={(e) => setNewJournalFragId(Number(e.target.value))}
                    className="w-full bg-[#F8F5EE] border border-[#E3DACB] rounded-xl px-3 py-2.5 text-[#1A1613] text-sm focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {allFragrances.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} &bull; {f.brand_name || f.brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono-lab text-[#7A6F66] uppercase tracking-wider block mb-1.5 font-semibold">
                    Occasion / Context
                  </label>
                  <input
                    type="text"
                    value={newJournalOccasion}
                    onChange={(e) => setNewJournalOccasion(e.target.value)}
                    placeholder="e.g. Evening gallery opening, Client meeting"
                    className="w-full bg-[#F8F5EE] border border-[#E3DACB] rounded-xl px-3 py-2.5 text-[#1A1613] text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono-lab text-[#7A6F66] uppercase tracking-wider font-semibold">
                      Longevity (Hours on Skin)
                    </label>
                    <span className="text-xs font-mono-lab text-purple-900 font-bold">{newJournalHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={18}
                    value={newJournalHours}
                    onChange={(e) => setNewJournalHours(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono-lab text-[#7A6F66] uppercase tracking-wider font-semibold">
                      Compliments Received
                    </label>
                    <span className="text-xs font-mono-lab text-purple-900 font-bold">{newJournalCompliments}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={newJournalCompliments}
                    onChange={(e) => setNewJournalCompliments(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono-lab text-[#7A6F66] uppercase tracking-wider block mb-1.5 font-semibold">
                  Sensory Impressions &amp; Drydown Notes
                </label>
                <textarea
                  value={newJournalNotes}
                  onChange={(e) => setNewJournalNotes(e.target.value)}
                  placeholder="How did the top notes open? Did the base note project warmly in the heat?"
                  rows={2}
                  className="w-full bg-[#F8F5EE] border border-[#E3DACB] rounded-xl p-3 text-[#1A1613] text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] font-mono-lab text-[#7A6F66]">
                  Ambient Weather: {weather.temperature_c}°C &bull; {weather.humidity_pct}% Humidity ({weather.season})
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  Save Log Entry (+25 XP)
                </button>
              </div>

              {journalSuccess && (
                <div className="p-3 rounded-xl bg-purple-100 border border-purple-300 text-purple-950 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700" />
                  <span>Entry recorded to your personal fragrance journal!</span>
                </div>
              )}
            </form>
          </div>

          {/* Past Log Entries */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1A1613] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-700" />
              <span>Past Journal Entries</span>
            </h3>

            {isJournalLoading ? (
              <div className="p-8 text-center text-xs font-mono-lab text-[#7A6F66]">Loading journal logs...</div>
            ) : journalEntries.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono-lab text-[#7A6F66] rounded-2xl bg-white border border-[#E3DACB]">
                No journal entries yet. Log your first scent of the day above!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-white/95 border border-[#E3DACB] space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-medium text-[#1A1613]">
                          {entry.fragrance_name}
                        </h4>
                        <span className="text-xs text-amber-800 font-sans block">
                          by {entry.brand} &bull; {entry.occasion}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-lab text-[#7A6F66] px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#E3DACB]">
                        {new Date(entry.worn_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] font-mono-lab text-[#5A5046]">
                      <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-300 text-purple-900">
                        ⏳ {entry.longevity_hours}h longevity
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900">
                        💬 {entry.compliments_count} compliments
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F8F5EE] border border-[#E3DACB] text-[#7A6F66]">
                        🌡️ {entry.weather_temp}°C / {entry.weather_humidity}% RH
                      </span>
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-[#5A5046] italic leading-relaxed pt-1 border-t border-[#E8DFD3]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#FAF7F2] border border-[#E3DACB] p-6 sm:p-8 text-[#1A1613] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD3]">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-teal-700" />
                <h3 className="font-serif text-2xl font-medium text-[#1A1613]">
                  AI Alchemical Remix Engine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRemixModalRecipe(null)}
                className="p-1.5 rounded-xl text-[#7A6F66] hover:text-[#1A1613] hover:bg-[#F0EBE1] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-mono-lab text-teal-800 uppercase block font-semibold">Base Recipe</span>
                <h4 className="font-serif text-lg font-medium text-[#1A1613] mt-0.5">
                  {remixModalRecipe.title}
                </h4>
                <p className="text-xs text-[#7A6F66] mt-1">
                  {remixModalRecipe.chord_name}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E3DACB] text-xs text-[#5A5046] whitespace-pre-line leading-relaxed">
                {remixSuggestion}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRemixModalRecipe(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#7A6F66] hover:text-[#1A1613] cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setRemixModalRecipe(null);
                  onSendToLab(remixModalRecipe.fragrance_a, remixModalRecipe.fragrance_b);
                }}
                className="px-5 py-2 rounded-xl bg-[#1A1613] hover:bg-black text-[#FAF7F2] font-semibold text-xs shadow-sm cursor-pointer"
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
