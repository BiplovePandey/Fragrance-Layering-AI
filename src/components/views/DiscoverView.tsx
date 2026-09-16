import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Swords,
  Package,
  Store,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Layers,
  ChevronRight,
  TrendingUp,
  Droplets,
  Search,
  HelpCircle,
  EyeOff,
  Eye,
  Copy,
  Compass,
  AlertTriangle,
  Star
} from 'lucide-react';
import { TinderVibeDeck } from '../TinderVibeDeck.js';
import { DailyMoodPicker } from '../DailyMoodPicker.js';
import { FloatingNoteBubbles } from '../FloatingNoteBubbles.js';
import { IndianSoulSection } from '../IndianSoulSection.js';
import { Fragrance, DailyMoodId, DailyMoodPreset, UserPreferences } from '../../types.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { api } from '../../services/api.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface DiscoverViewProps {
  fragrances: Fragrance[];
  selectedMoodId: DailyMoodId | null;
  onSelectMood: (preset: DailyMoodPreset) => void;
  showCustomForm: boolean;
  onToggleCustomForm: () => void;
  onInstantCalculate: () => void;
  isLoading: boolean;
  onCompleteVibeCheck: (discovered: Partial<UserPreferences>) => void;
  onAddNoteToPreferences: (note: string) => void;
  onSelectIndianFragrance: (id: number) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  fragrances,
  selectedMoodId,
  onSelectMood,
  showCustomForm,
  onToggleCustomForm,
  onInstantCalculate,
  isLoading,
  onCompleteVibeCheck,
  onAddNoteToPreferences,
  onSelectIndianFragrance
}) => {
  const [activeTab, setActiveTab] = useState<
    'deck' | 'nl_search' | 'why_dislike' | 'blind_test' | 'twins' | 'comfort_zone' | 'battles' | 'box' | 'retail'
  >('deck');

  // Natural Language Search State
  const [nlQuery, setNlQuery] = useState<string>('smells like rainy tea in the Himalayas with cedarwood');

  // Why Don't I Like This State
  const [dislikedFragId, setDislikedFragId] = useState<number>(fragrances[4]?.id || 5);

  // Blind Discovery State
  const [blindFragIdx, setBlindFragIdx] = useState<number>(0);
  const [blindRevealed, setBlindRevealed] = useState<boolean>(false);
  const [blindRating, setBlindRating] = useState<number | null>(null);

  // Fragrance Twin State
  const [twinTargetId, setTwinTargetId] = useState<number>(fragrances[0]?.id || 1);

  // Scent Battle State
  const [battleFragAId, setBattleFragAId] = useState<number>(fragrances[0]?.id || 1);
  const [battleFragBId, setBattleFragBId] = useState<number>(fragrances[1]?.id || 2);
  const [battleResult, setBattleResult] = useState<any | null>(null);
  const [isBattleLoading, setIsBattleLoading] = useState<boolean>(false);

  // Discovery Box State
  const [boxBudget, setBoxBudget] = useState<number>(2500);
  const [boxFamily, setBoxFamily] = useState<string>('all');
  const [boxResult, setBoxResult] = useState<any | null>(null);
  const [isBoxLoading, setIsBoxLoading] = useState<boolean>(false);

  // Retail Consultation State
  const [retailOccasion, setRetailOccasion] = useState<string>('Office');
  const [retailBudget, setRetailBudget] = useState<number>(3500);
  const [retailCustomerVibe, setRetailCustomerVibe] = useState<string>('Sophisticated woody with subtle spice');
  const [retailResult, setRetailResult] = useState<any | null>(null);
  const [isRetailLoading, setIsRetailLoading] = useState<boolean>(false);

  const indianFragrances = fragrances.filter(f => f.is_indian_house);

  const handleRunBattle = async () => {
    setIsBattleLoading(true);
    try {
      const res = await api.runScentBattle(battleFragAId, battleFragBId);
      setBattleResult(res);
      awardXP(25, 'scent_battle');
    } catch (err) {
      console.error('Failed to run scent battle', err);
    } finally {
      setIsBattleLoading(false);
    }
  };

  const handleCurateBox = async () => {
    setIsBoxLoading(true);
    try {
      const res = await api.configureDiscoveryBox({
        budget_inr: boxBudget,
        preferred_families: boxFamily !== 'all' ? [boxFamily] : []
      });
      setBoxResult(res);
      awardXP(30, 'discovery_box');
    } catch (err) {
      console.error('Failed to curate discovery box', err);
    } finally {
      setIsBoxLoading(false);
    }
  };

  const handleRunRetailConsultation = async () => {
    setIsRetailLoading(true);
    try {
      const res = await api.getRetailRecommendations({
        occasion: retailOccasion,
        budget: retailBudget,
        customer_preference: retailCustomerVibe
      });
      setRetailResult(res);
      awardXP(20, 'retail_consult');
    } catch (err) {
      console.error('Failed to get retail recommendation', err);
    } finally {
      setIsRetailLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header & Sub-Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Interactive Discovery Laboratory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-100">
            Olfactory Discovery &amp; Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl">
            Explore taste accords, run scent head-to-head confrontations, curate bespoke atelier boxes, and consult our retail intelligence engine.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] self-start md:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('deck')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'deck'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Vibes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nl_search')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nl_search'
                ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Natural Search</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('why_dislike')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'why_dislike'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why Don't I Like This?</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blind_test')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'blind_test'
                ? 'bg-purple-500/25 text-purple-200 border border-purple-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Blind Testing</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('twins')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'twins'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Fragrance Twins</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comfort_zone')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comfort_zone'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Comfort Challenger</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('battles')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'battles'
                ? 'bg-rose-500/25 text-rose-200 border border-rose-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Battles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('box')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'box'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Discovery Box</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('retail')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'retail'
                ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/50 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Retail AI</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Vibe & Mood Deck */}
      {activeTab === 'deck' && (
        <div className="space-y-12">
          {/* Tinder-style Fragrance Swipe Taste Deck */}
          <TinderVibeDeck
            onCompleteVibeCheck={(prefs) => {
              onCompleteVibeCheck(prefs);
              awardXP(35, 'taste_deck');
            }}
          />

          {/* Daily Mood Cards */}
          <DailyMoodPicker
            selectedMoodId={selectedMoodId}
            onSelectMood={onSelectMood}
            onExploreCustom={onToggleCustomForm}
            showCustomForm={showCustomForm}
            onToggleCustomForm={onToggleCustomForm}
            onInstantCalculate={onInstantCalculate}
            isLoading={isLoading}
          />

          {/* Floating Interactive Note Bubbles */}
          <FloatingNoteBubbles
            onAddNoteToPreferences={(note) => {
              onAddNoteToPreferences(note);
              awardXP(15);
            }}
          />

          {/* Indian Soul Section */}
          <IndianSoulSection
            indianFragrances={indianFragrances}
            onSelectIndianFragrance={onSelectIndianFragrance}
          />
        </div>
      )}

      {/* TAB 2: Scent Battles Confrontation Arena */}
      {activeTab === 'battles' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl">
            <div className="max-w-xl mb-6">
              <span className="text-xs font-mono uppercase text-rose-400 font-semibold tracking-wider">
                Head-to-Head Confrontation Engine
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
                Fragrance Confrontation &amp; Longevity Duel
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Pit two fragrances against each other to evaluate performance, sillage projection, and layering synergy.
              </p>
            </div>

            {/* Selection Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Fragrance Alpha
                </label>
                <select
                  value={battleFragAId}
                  onChange={(e) => setBattleFragAId(Number(e.target.value))}
                  className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {fragrances.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.brand_name || f.brand} ({f.format})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Fragrance Beta
                </label>
                <select
                  value={battleFragBId}
                  onChange={(e) => setBattleFragBId(Number(e.target.value))}
                  className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2.5 text-stone-100 text-sm focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  {fragrances.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.brand_name || f.brand} ({f.format})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunBattle}
              disabled={isBattleLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-stone-100 text-sm font-semibold transition cursor-pointer shadow-lg shadow-rose-950/40 flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>{isBattleLoading ? 'Simulating Confrontation...' : 'INITIATE SCENT BATTLE'}</span>
            </button>
          </div>

          {/* Confrontation Result Cards */}
          {battleResult && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-r from-rose-950/30 via-[#15120F]/90 to-amber-950/30 border border-white/[0.1] p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                      AI Connoisseur Verdict
                    </span>
                    <h3 className="font-serif text-2xl text-stone-100">
                      {battleResult.verdict.summary}
                    </h3>
                  </div>
                </div>

                {/* Score Tally Banner */}
                <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-center">
                    <span className="text-xs text-stone-400 font-mono block">{battleResult.fragrance_a.name}</span>
                    <span className="text-3xl font-serif font-bold text-rose-300">{battleResult.verdict.score_a} pts</span>
                  </div>
                  <div className="text-center border-l border-white/[0.08]">
                    <span className="text-xs text-stone-400 font-mono block">{battleResult.fragrance_b.name}</span>
                    <span className="text-3xl font-serif font-bold text-amber-300">{battleResult.verdict.score_b} pts</span>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {battleResult.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#14120F]/80 border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs font-medium text-stone-200">
                      <span>{m.metric}</span>
                      <span className="font-mono text-amber-400">{m.a_score} vs {m.b_score}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden flex">
                      <div
                        className="bg-rose-500 h-full"
                        style={{ width: `${(m.a_score / (m.a_score + m.b_score || 1)) * 100}%` }}
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(m.b_score / (m.a_score + m.b_score || 1)) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">{m.notes}</p>
                  </div>
                ))}
              </div>

              {/* Layering Potential Section */}
              {battleResult.layering_potential && (
                <div className="p-6 rounded-2xl bg-[#14120F]/90 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase text-amber-400 font-semibold tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Can they be layered together?
                    </span>
                    <p className="text-sm text-stone-200">
                      Layering Compatibility: <span className="text-amber-300 font-bold">{battleResult.layering_potential.compatibility_score}%</span>
                    </p>
                    <p className="text-xs text-stone-400 max-w-xl">
                      {battleResult.layering_potential.explanation}
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono shrink-0">
                    {battleResult.layering_potential.technique}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Bespoke Discovery Atelier Box */}
      {activeTab === 'box' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl">
            <div className="max-w-xl mb-6">
              <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                Olfactory Sampling Atelier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
                Curate Your Bespoke Discovery Box
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Handpicked 5ml decants spanning traditional Kannauj hydro-distillates, modern Indian niche, and designer pairings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Target Budget (₹)
                  </label>
                  <span className="text-sm font-serif text-emerald-400 font-semibold">₹{boxBudget}</span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={5000}
                  step={250}
                  value={boxBudget}
                  onChange={(e) => setBoxBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Accord Emphasis
                </label>
                <select
                  value={boxFamily}
                  onChange={(e) => setBoxFamily(e.target.value)}
                  className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">Balanced Olfactory Spectrum (All Families)</option>
                  <option value="woody">Woody &amp; Agarwood Oud Core</option>
                  <option value="floral">Sacral Florals &amp; Jasmine Sambac</option>
                  <option value="fresh">Solar Citrus &amp; Petrichor Fresh</option>
                  <option value="amber">Warm Amber &amp; Resinous Spices</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCurateBox}
              disabled={isBoxLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-stone-100 text-sm font-semibold transition cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>{isBoxLoading ? 'Assembling Box...' : 'CURATE ATELIER BOX'}</span>
            </button>
          </div>

          {/* Box Result */}
          {boxResult && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-emerald-500/20 backdrop-blur-md shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      {boxResult.title}
                    </span>
                    <h3 className="font-serif text-3xl font-medium text-stone-100 mt-1">
                      4 &times; {boxResult.sample_size_ml}ml Decant Collection
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-xl">
                      {boxResult.curation_concept}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-stone-400 font-mono block">Complete Box Value</span>
                    <span className="text-3xl font-serif font-bold text-emerald-300">₹{boxResult.box_price_inr}</span>
                  </div>
                </div>

                {/* Fragrance Samples Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {boxResult.fragrances.map((f: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-emerald-400 mb-1">
                          <span>SAMPLE #{idx + 1}</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/[0.05]">{f.format}</span>
                        </div>
                        <h4 className="font-serif text-lg text-stone-100 font-medium leading-snug">{f.name}</h4>
                        <span className="text-xs text-amber-400 font-sans block">{f.brand_name || f.brand}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 line-clamp-2">
                        {f.description}
                      </div>
                      <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-stone-400">
                        {f.is_oil_based ? 'Pure Botanical Oil' : 'Fine Alcohol Diffusion'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Layering Guide Banner */}
                <div className="mt-6 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-700/30 text-xs text-emerald-300 font-mono">
                  ✨ {boxResult.layering_guide}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Retail Scent Consultation AI */}
      {activeTab === 'retail' && (
        <div className="space-y-8">
          <div className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl">
            <div className="max-w-xl mb-6">
              <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                Counter Intelligence &bull; Client Consultation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
                AI Fragrance Salesperson &amp; Upsell Engine
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Designed for boutique fragrance consultants to recommend bottles with persuasive sensory pitches and complementary layering upsells.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Occasion Context
                </label>
                <select
                  value={retailOccasion}
                  onChange={(e) => setRetailOccasion(e.target.value)}
                  className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Office">Corporate / Daily Office</option>
                  <option value="Wedding">Indian Wedding &amp; Celebrations</option>
                  <option value="Date">Intimate Evening / Date</option>
                  <option value="Spiritual">Spiritual / Meditation Sanctuary</option>
                  <option value="Summer">Hot Monsoon &amp; Summer Heat</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    Customer Budget (₹)
                  </label>
                  <span className="text-sm font-serif text-cyan-400 font-semibold">₹{retailBudget}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={8000}
                  step={500}
                  value={retailBudget}
                  onChange={(e) => setRetailBudget(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <label className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">
                  Customer Desired Vibe
                </label>
                <input
                  type="text"
                  value={retailCustomerVibe}
                  onChange={(e) => setRetailCustomerVibe(e.target.value)}
                  placeholder="e.g. Fresh vetiver with warm sandalwood"
                  className="w-full bg-[#0D0B0A] border border-white/[0.12] rounded-xl px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunRetailConsultation}
              disabled={isRetailLoading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-stone-100 text-sm font-semibold transition cursor-pointer shadow-lg shadow-cyan-950/40 flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>{isRetailLoading ? 'Consulting Intelligence Engine...' : 'GENERATE SALES RECOMMENDATIONS'}</span>
            </button>
          </div>

          {/* Consultation Result */}
          {retailResult && (
            <div className="space-y-6">
              {retailResult.recommendations.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] backdrop-blur-md shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-700/30">
                          {item.match_score}% MATCH
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          {item.fragrance.format} &bull; ₹{item.fragrance.price_inr || 'N/A'}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-medium text-stone-100 mt-1">
                        {item.fragrance.name}
                      </h3>
                      <span className="text-xs text-amber-400 font-sans">
                        by {item.fragrance.brand_name || item.fragrance.brand}
                      </span>
                    </div>
                  </div>

                  {/* Pitch Script for Retail Rep */}
                  <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-semibold block">
                      Consultant's Verbal Script:
                    </span>
                    <p className="text-sm text-stone-200 italic leading-relaxed">
                      "{item.salesperson_pitch}"
                    </p>
                  </div>

                  {/* Why it works */}
                  <p className="text-xs text-stone-400">
                    <strong className="text-stone-300">Technical Rationale:</strong> {item.why_it_works}
                  </p>

                  {/* Upsell companion */}
                  {item.layering_upsell && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold block">
                          Suggested Layering Upsell:
                        </span>
                        <p className="text-xs text-stone-200">
                          Add <strong className="text-amber-300">{item.layering_upsell.companion_fragrance.name}</strong> ({item.layering_upsell.companion_fragrance.brand})
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {item.layering_upsell.upsell_reason}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-stone-500 shrink-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Natural Language Scent Search */}
      {activeTab === 'nl_search' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase font-semibold mb-1">
              <Search className="w-4 h-4" />
              <span>Semantic Olfactory Search Engine</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Describe Scent in Human Memory &amp; Poetry
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Type sensory sensations, atmospheric memories, or poetic desires. Our semantic matching maps human impressions to chemical fragrance notes and accords.
            </p>

            <div className="mt-5 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  placeholder="e.g. Rainy tea in the Himalayas with cedarwood and cardamom"
                  className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-stone-100 text-sm focus:outline-none focus:border-rose-500 transition placeholder:text-stone-500"
                />
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-stone-500">Inspire Query:</span>
                {[
                  'Rain on red clay baked in summer heat',
                  'Smoky leather, dark cacao and bitter orange',
                  'Chilled gin & tonic with fresh mint and vetiver',
                  'Sensual nocturnal sandalwood and white jasmine'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNlQuery(preset)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-[11px] text-stone-300 transition cursor-pointer border border-white/[0.06]"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {(() => {
            const results = olfactoryIntelligence.searchNaturalLanguage(nlQuery, fragrances);
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400 px-1">
                  <span>Found {results.length} Olfactory Resonance Matches</span>
                  <span>Matched query: "{nlQuery}"</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.map((res) => (
                    <div
                      key={res.fragrance.id}
                      className="p-6 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] flex flex-col justify-between shadow-xl space-y-4 hover:border-rose-500/40 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40">
                            {res.confidence}% MATCH
                          </span>
                          <span className="text-[11px] font-mono text-stone-400">{res.fragrance.format}</span>
                        </div>

                        <h4 className="font-serif text-xl font-medium text-stone-100 mt-2">
                          {res.fragrance.name}
                        </h4>
                        <span className="text-xs text-amber-400 block mb-2">by {res.fragrance.brand}</span>

                        <p className="text-xs text-stone-300 leading-relaxed italic">
                          "{res.explanation}"
                        </p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                        <span className="text-[10px] font-mono text-stone-500 uppercase block">Resonating Notes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {res.matchedNotes.map((note, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-200 text-[11px]">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: Why Don't I Like This? */}
      {activeTab === 'why_dislike' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-semibold mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Sensory Friction &amp; Note Diagnosis</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Why Don't I Like This Fragrance?
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Identify precisely which notes, synthetic compounds, or accord balances caused olfactory fatigue, headache, or dislike.
            </p>

            <div className="mt-5 max-w-md">
              <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                Select Fragrance You Dislike or Struggle With:
              </label>
              <select
                value={dislikedFragId}
                onChange={(e) => setDislikedFragId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-stone-200 text-xs font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#181512] text-stone-200">
                    {f.name} — {f.brand} ({f.fragrance_family})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Diagnostic Breakdown */}
          {(() => {
            const disliked = fragrances.find(f => f.id === dislikedFragId) || fragrances[0];
            const diagnosis = olfactoryIntelligence.diagnoseDislikedFragrance(disliked, fragrances);

            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase">Diagnosis Target</span>
                    <h4 className="font-serif text-2xl font-medium text-stone-100">
                      {disliked.name} <span className="text-stone-400 font-sans text-sm">by {disliked.brand}</span>
                    </h4>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold">
                    {diagnosis.culpritNotes.length} Friction Points Identified
                  </div>
                </div>

                {/* Culprit notes */}
                <div>
                  <span className="text-xs font-mono uppercase text-rose-400 font-semibold block mb-2">
                    Suspected Culprit Notes &amp; Over-Saturations:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {diagnosis.culpritNotes.map((note, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>{note}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-stone-300 leading-relaxed space-y-2">
                  <strong className="text-amber-300 font-mono uppercase block text-[10px]">
                    Sensory Analysis
                  </strong>
                  <p>{diagnosis.sensoryExplanation}</p>
                </div>

                {/* Vector Gaps */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-stone-400 font-semibold block">
                    Vector Discrepancy (Your DNA Profile vs Flacon Coordinates):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {diagnosis.vectorGaps.map((gap, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <span className="text-[11px] font-mono text-stone-400 block">{gap.axis}</span>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-stone-400">Your DNA: <strong className="text-stone-200">{gap.userDNA}</strong></span>
                          <span className="text-stone-400">Flacon: <strong className="text-rose-300">{gap.fragranceVal}</strong></span>
                        </div>
                        <div className="text-[10px] font-mono text-amber-400 mt-1">
                          Delta: {gap.delta > 0 ? `+${gap.delta}` : gap.delta}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to try instead */}
                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-semibold block">
                    Curated Clean Alternatives (Retains structure without friction):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {diagnosis.cleanAlternatives.map((alt) => (
                      <div key={alt.id} className="p-4 rounded-2xl bg-emerald-950/15 border border-emerald-500/25 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-stone-200">{alt.name}</div>
                          <div className="text-[11px] text-stone-400">{alt.brand} &bull; {alt.fragrance_family}</div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          Zero Culprits
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: Blind Discovery & Testing */}
      {activeTab === 'blind_test' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase font-semibold mb-1">
              <EyeOff className="w-4 h-4" />
              <span>Unbiased Pure Sensory Evaluation</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Blind Testing Atelier
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Strip away marketing, brand hype, price tags, and packaging. Evaluate purely by accords, diffusion texture, and heart notes.
            </p>
          </div>

          {(() => {
            if (!fragrances || fragrances.length === 0) {
              return (
                <div className="p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] text-center text-stone-400 font-mono text-xs">
                  Loading blind scent evaluation specimens...
                </div>
              );
            }

            const currentBlind = fragrances[blindFragIdx % fragrances.length];
            if (!currentBlind) return null;

            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                      Specimen Sequence #{blindFragIdx + 1}
                    </span>
                    <h4 className="font-serif text-2xl font-medium text-stone-100 mt-0.5">
                      {blindRevealed ? currentBlind.name : `Atelier Code: SPECIMEN-0${(blindFragIdx % 9) + 1}`}
                    </h4>
                    <span className="text-xs text-stone-400 block mt-0.5">
                      {blindRevealed ? `Crafted by ${currentBlind.brand}` : 'Identity Sealed • Evaluating Scent Alone'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBlindRevealed(!blindRevealed);
                      if (!blindRevealed) awardXP(35, 'blind_test');
                    }}
                    className="px-4 py-2 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold cursor-pointer flex items-center gap-2"
                  >
                    {blindRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{blindRevealed ? 'Hide Identity' : 'Reveal Identity (+35 XP)'}</span>
                  </button>
                </div>

                {/* Scent Blueprint */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Dominant Accords</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(currentBlind.accords || [currentBlind.fragrance_family]).map((acc, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/[0.06] text-stone-200 text-xs">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Pyramid Heart</span>
                    <div className="text-xs text-stone-300 mt-2 space-y-1">
                      <div><strong className="text-stone-400">Opening:</strong> {(currentBlind.top_notes || []).join(', ') || 'Fresh Citrus & Herbal'}</div>
                      <div><strong className="text-stone-400">Heart:</strong> {(currentBlind.middle_notes || []).join(', ') || 'Spices & Floral Resins'}</div>
                      <div><strong className="text-stone-400">Base:</strong> {(currentBlind.base_notes || []).join(', ') || 'Woods, Amber, Fixative'}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-stone-400 uppercase block">Performance Metrics</span>
                    <div className="space-y-1 mt-2 text-xs text-stone-300">
                      <div>Longevity: <span className="text-amber-300 font-mono">{currentBlind.longevity_hours || 8} hrs</span></div>
                      <div>Projection: <span className="text-cyan-300 font-mono">{currentBlind.sillage || 'Moderate Radiance'}</span></div>
                      <div>Format: <span className="text-purple-300 font-mono">{currentBlind.format}</span></div>
                    </div>
                  </div>
                </div>

                {/* Blind Rating Interaction */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-400 block">Rate Your Unbiased Perception:</span>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setBlindRating(star)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            (blindRating || 0) >= star
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                              : 'bg-white/[0.02] border-white/[0.06] text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                      {blindRating && (
                        <span className="text-xs font-mono text-amber-300 ml-2 font-semibold">
                          {blindRating} / 5 Stars
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBlindFragIdx(blindFragIdx + 1);
                      setBlindRevealed(false);
                      setBlindRating(null);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-white text-stone-900 text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Next Blind Specimen &rarr;
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: Fragrance Twins */}
      {activeTab === 'twins' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold mb-1">
              <Copy className="w-4 h-4" />
              <span>Vector Similarity &bull; Twin Finder</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Find Olfactory Twins &amp; Heritage Counterparts
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Love a famous cult fragrance? Discover its closest scent twins across luxury western houses and ancient Indian attar traditions.
            </p>

            <div className="mt-5 max-w-md">
              <label className="text-xs font-mono uppercase text-stone-400 block mb-1">
                Select Base Reference Fragrance:
              </label>
              <select
                value={twinTargetId}
                onChange={(e) => setTwinTargetId(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-stone-200 text-xs font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#181512] text-stone-200">
                    {f.name} — {f.brand} ({f.fragrance_family})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Twins Results */}
          {(() => {
            const target = fragrances.find(f => f.id === twinTargetId) || fragrances[0];
            const twins = olfactoryIntelligence.findFragranceTwins(target, fragrances);

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {twins.map((twin) => (
                  <div
                    key={twin.fragrance.id}
                    className="p-6 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40">
                          {twin.similarityScore}% TWIN
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">
                          {(twin.fragrance.origin_style?.includes('Indian') || twin.fragrance.brand_country === 'India' || twin.fragrance.format === 'Attar') ? '🇮🇳 Heritage Twin' : 'Western House'}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl font-medium text-stone-100 mt-2">
                        {twin.fragrance.name}
                      </h4>
                      <span className="text-xs text-amber-400 block mb-3">by {twin.fragrance.brand}</span>

                      <p className="text-xs text-stone-300 leading-relaxed italic">
                        "{twin.narrative}"
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/[0.06]">
                      <span className="text-[10px] font-mono text-stone-400 uppercase block">Shared Accords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {twin.sharedNotes.map((note, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.05] text-stone-300 text-[11px]">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 6: Comfort-Zone Challenger */}
      {activeTab === 'comfort_zone' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-semibold mb-1">
              <Compass className="w-4 h-4" />
              <span>Palette Expansion Intelligence</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              Comfort-Zone Challenger
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Gently expand your olfactory palate. We anchor unfamiliar accords (like smoky birch tar or pungent oud) with notes you already love, across four stepped difficulty levels.
            </p>
          </div>

          {(() => {
            const steps = olfactoryIntelligence.getComfortZoneRecommendations(fragrances);

            const badgeStyles = {
              FAMILIAR: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
              ADJACENT: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
              EXPERIMENTAL: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              RADICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            };

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((rec) => (
                  <div
                    key={rec.level}
                    className="p-6 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${badgeStyles[rec.level]}`}>
                          {rec.level}
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          Bridge: {rec.comfortBridgeScore}%
                        </span>
                      </div>

                      <h4 className="font-serif text-xl font-medium text-stone-100 mt-3">
                        {rec.fragrance.name}
                      </h4>
                      <span className="text-xs text-amber-400 block mb-3">by {rec.fragrance.brand}</span>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {rec.whyItWorks}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/[0.06] text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase block">Familiar Anchor:</span>
                        <span className="text-stone-300 text-[11px]">{rec.familiarAnchorNotes.join(', ') || 'Woody base'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-rose-400 uppercase block">Challenging Note:</span>
                        <span className="text-stone-300 text-[11px]">{rec.challengingNotes.join(', ') || 'Unfamiliar accord'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

