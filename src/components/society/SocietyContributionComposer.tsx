import React, { useState } from 'react';
import {
  FlaskConical,
  BookOpen,
  Sparkles,
  Layers,
  Check,
  ShieldCheck,
  Send,
  AlertCircle,
  Clock,
  Droplets,
  Thermometer,
  ShieldAlert,
  Archive
} from 'lucide-react';
import { Fragrance, WeatherCondition, CommunityRecipe, AIProductSubmission } from '../../types.js';
import { ScentBottle } from '../ui/ScentBottle.js';

export type ContributionMode = 'journal' | 'chord' | 'candidate';

interface SocietyContributionComposerProps {
  allFragrances: Fragrance[];
  weather: WeatherCondition;
  onAddJournalEntry: (entry: {
    fragrance_id: number;
    fragrance_name: string;
    brand: string;
    occasion: string;
    longevity_hours: number;
    compliments_count: number;
    weather_temp: number;
    weather_humidity: number;
    notes: string;
  }) => Promise<void>;
  onAddChord: (chord: CommunityRecipe) => void;
  onSubmitCandidate: (candidate: {
    name: string;
    brand_name: string;
    concentration: string;
    fragrance_family: string;
    notes_list: string;
    description: string;
  }) => Promise<void>;
  onClose?: () => void;
}

export const SocietyContributionComposer: React.FC<SocietyContributionComposerProps> = ({
  allFragrances,
  weather,
  onAddJournalEntry,
  onAddChord,
  onSubmitCandidate,
  onClose,
}) => {
  const [activeMode, setActiveMode] = useState<ContributionMode>('journal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- Form 1: Journal Entry State ---
  const [selectedFragranceId, setSelectedFragranceId] = useState<number>(allFragrances[0]?.id || 1);
  const [journalOccasion, setJournalOccasion] = useState<string>('Evening Salon');
  const [journalLongevity, setJournalLongevity] = useState<number>(8);
  const [journalCompliments, setJournalCompliments] = useState<number>(1);
  const [journalNotes, setJournalNotes] = useState<string>('');

  // --- Form 2: Layering Chord State ---
  const [chordFragAId, setChordFragAId] = useState<number>(allFragrances[0]?.id || 1);
  const [chordFragBId, setChordFragBId] = useState<number>(allFragrances[1]?.id || 2);
  const [chordTitle, setChordTitle] = useState<string>('');
  const [chordName, setChordName] = useState<string>('');
  const [chordRatio, setChordRatio] = useState<string>('2 Sprays Base Anchor : 1 Spray Diffusion Spark');
  const [chordSprayOrder, setChordSprayOrder] = useState<string>('Anchor on pulse points, wait 45s, mist diffusion spark overhead');
  const [chordReview, setChordReview] = useState<string>('');
  const [chordSeason, setChordSeason] = useState<string>('Monsoon');

  // --- Form 3: Candidate Gatekeeper State ---
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateBrand, setCandidateBrand] = useState<string>('');
  const [candidateFamily, setCandidateFamily] = useState<string>('Woody');
  const [candidateConcentration, setCandidateConcentration] = useState<string>('Extrait de Parfum');
  const [candidateNotes, setCandidateNotes] = useState<string>('');
  const [candidateDesc, setCandidateDesc] = useState<string>('');

  const handleJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNotes.trim()) {
      setErrorMessage('Please share how the fragrance evolved on your skin.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const selectedFrag = allFragrances.find((f) => f.id === selectedFragranceId) || allFragrances[0];
      await onAddJournalEntry({
        fragrance_id: selectedFrag.id,
        fragrance_name: selectedFrag.name,
        brand: selectedFrag.brand_name || selectedFrag.brand,
        occasion: journalOccasion,
        longevity_hours: journalLongevity,
        compliments_count: journalCompliments,
        weather_temp: weather.temperature_c,
        weather_humidity: weather.humidity_pct,
        notes: journalNotes.trim(),
      });
      setSuccessMessage('Your wear journal entry has been inscribed into the Society archives.');
      setJournalNotes('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to record journal entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chordName.trim() || !chordReview.trim()) {
      setErrorMessage('Please provide a name for the chord and an alchemical review.');
      return;
    }
    const fragA = allFragrances.find((f) => f.id === chordFragAId) || allFragrances[0];
    const fragB = allFragrances.find((f) => f.id === chordFragBId) || allFragrances[1];

    const newChord: CommunityRecipe = {
      id: `chord-${Date.now()}`,
      title: chordTitle.trim() || `${fragB.name} & ${fragA.name}`,
      chord_name: chordName.trim(),
      description: chordReview.trim(),
      author: 'You',
      author_name: 'You (Atelier Member)',
      author_level: 'Society Nose',
      author_badge: '👑',
      fragrance_a: fragA,
      fragrance_b: fragB,
      ratio: chordRatio,
      spray_order: chordSprayOrder,
      wait_time: '45 seconds',
      compatibility_score: 91,
      likes: 1,
      upvotes: 1,
      has_liked: true,
      season: chordSeason,
      occasion: 'Bespoke Layering',
      review: chordReview.trim(),
      remixes_count: 0,
      created_at: new Date().toISOString(),
      tags: [chordSeason, 'Bespoke', 'Artisanal Chord'],
    };

    onAddChord(newChord);
    setSuccessMessage('Your bespoke layering chord has been shared with the Private Fragrance Society.');
    setChordTitle('');
    setChordName('');
    setChordReview('');
  };

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateBrand.trim() || !candidateDesc.trim()) {
      setErrorMessage('Please supply the flacon name, perfume house, and olfactory description.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onSubmitCandidate({
        name: candidateName.trim(),
        brand_name: candidateBrand.trim(),
        fragrance_family: candidateFamily,
        concentration: candidateConcentration,
        notes_list: candidateNotes.trim(),
        description: candidateDesc.trim(),
      });
      setSuccessMessage('Fine fragrance candidate submitted for peer validation & cataloging.');
      setCandidateName('');
      setCandidateBrand('');
      setCandidateNotes('');
      setCandidateDesc('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Candidate validation error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-[#14110E] border border-amber-500/25 p-6 sm:p-10 text-[#F8F5EE] shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-brand tracking-[0.16em] uppercase text-amber-400">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Chapter VIII • Your Contribution</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#F8F5EE] mt-1">
            What are you experiencing?
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 font-sans">
            Preserve your skin wear diary, publish an alchemical layering chord, or submit a new fine fragrance candidate to the society catalogue.
          </p>
        </div>

        {/* Contribution Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => {
              setActiveMode('journal');
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'journal'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Wear Diary</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('chord');
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'chord'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Layering Chord</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('candidate');
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-lab transition cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'candidate'
                ? 'bg-amber-600 text-stone-950 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Candidate Flacon</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form 1: Log Scent Journal */}
      {activeMode === 'journal' && (
        <form onSubmit={handleJournalSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">
                Select Fragrance Worn Today
              </label>
              <select
                value={selectedFragranceId}
                onChange={(e) => setSelectedFragranceId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              >
                {allFragrances.map((frag) => (
                  <option key={frag.id} value={frag.id} className="bg-[#14110E] text-[#F8F5EE]">
                    {frag.name} — {frag.brand_name || frag.brand} ({frag.fragrance_family})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">
                Occasion / Atmosphere
              </label>
              <input
                type="text"
                value={journalOccasion}
                onChange={(e) => setJournalOccasion(e.target.value)}
                placeholder="e.g. Evening Salon, Monsoon Terrace, Solitary Reading"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono-lab text-stone-300">
                <span>Observed Longevity</span>
                <span className="text-amber-300 font-semibold">{journalLongevity} hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                value={journalLongevity}
                onChange={(e) => setJournalLongevity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono-lab text-stone-300">
                <span>Compliments Received</span>
                <span className="text-amber-300 font-semibold">{journalCompliments}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={journalCompliments}
                onChange={(e) => setJournalCompliments(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono-lab text-stone-400 space-y-1">
              <div className="text-stone-300">Ambient Telemetry:</div>
              <div>{weather.city || 'Atelier'}: {weather.temperature_c}°C • {weather.humidity_pct}% RH</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono-lab text-stone-300 block">
              Olfactory Narrative &amp; Skin Evolution
            </label>
            <textarea
              rows={4}
              value={journalNotes}
              onChange={(e) => setJournalNotes(e.target.value)}
              placeholder="Describe how the opening notes dispersed, how the heart accord engaged with your skin warmth, and the texture of the drydown..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono-lab text-stone-400 italic">
              Awards +25 Society Experience Points upon submission
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold text-xs font-brand uppercase tracking-wider shadow-lg shadow-amber-900/30 transition cursor-pointer flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Inscribe Journal Entry</span>
            </button>
          </div>
        </form>
      )}

      {/* Form 2: Share Layering Chord */}
      {activeMode === 'chord' && (
        <form onSubmit={handleChordSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">
                Base Anchor (Layer 1 • Apply First)
              </label>
              <select
                value={chordFragBId}
                onChange={(e) => setChordFragBId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              >
                {allFragrances.map((frag) => (
                  <option key={frag.id} value={frag.id} className="bg-[#14110E] text-[#F8F5EE]">
                    {frag.name} ({frag.fragrance_family})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">
                Diffusion Spark (Layer 2 • Volatile Top)
              </label>
              <select
                value={chordFragAId}
                onChange={(e) => setChordFragAId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              >
                {allFragrances.map((frag) => (
                  <option key={frag.id} value={frag.id} className="bg-[#14110E] text-[#F8F5EE]">
                    {frag.name} ({frag.fragrance_family})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Chord Poetic Name</label>
              <input
                type="text"
                value={chordName}
                onChange={(e) => setChordName(e.target.value)}
                placeholder="e.g. Monsoon Cedar Mirage"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Season Recommendation</label>
              <select
                value={chordSeason}
                onChange={(e) => setChordSeason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              >
                <option value="Monsoon" className="bg-[#14110E]">Monsoon</option>
                <option value="Summer" className="bg-[#14110E]">Summer</option>
                <option value="Autumn" className="bg-[#14110E]">Autumn</option>
                <option value="Winter" className="bg-[#14110E]">Winter</option>
                <option value="All Seasons" className="bg-[#14110E]">All Seasons</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Formula Ratio</label>
              <input
                type="text"
                value={chordRatio}
                onChange={(e) => setChordRatio(e.target.value)}
                placeholder="e.g. 2 sprays base : 1 spray spark"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono-lab text-stone-300 block">
              Application Sequence &amp; Evaporation Rhythm
            </label>
            <input
              type="text"
              value={chordSprayOrder}
              onChange={(e) => setChordSprayOrder(e.target.value)}
              placeholder="e.g. Apply anchor to neck and wrists. Allow 45s drydown. Mist diffusion spark overhead."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono-lab text-stone-300 block">
              Alchemical Chord Review
            </label>
            <textarea
              rows={3}
              value={chordReview}
              onChange={(e) => setChordReview(e.target.value)}
              placeholder="Explain the sensory synergy: how the notes complement or contrast each other..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono-lab text-stone-400 italic">
              Awards +35 Society Experience Points upon publication
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-xs font-brand uppercase tracking-wider shadow-lg shadow-amber-900/30 transition cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Publish Layering Chord</span>
            </button>
          </div>
        </form>
      )}

      {/* Form 3: Candidate Gatekeeper */}
      {activeMode === 'candidate' && (
        <form onSubmit={handleCandidateSubmit} className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 text-xs text-stone-300 space-y-1">
            <div className="flex items-center gap-2 font-brand tracking-wider uppercase text-amber-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Fine Fragrance Gatekeeper Protocol</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              To preserve archival standards, submissions must represent genuine fine perfumery (EDT, EDP, Extrait, or Traditional Attar) with traceable notes and olfactive structure. Deodorants, synthetically mass-market body sprays, and cosmetic washes are strictly rejected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Flacon Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Terra Alluvia"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Perfume House / Brand</label>
              <input
                type="text"
                value={candidateBrand}
                onChange={(e) => setCandidateBrand(e.target.value)}
                placeholder="e.g. Kastoor or Nasheman Kannauj"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Concentration</label>
              <select
                value={candidateConcentration}
                onChange={(e) => setCandidateConcentration(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              >
                <option value="Extrait de Parfum" className="bg-[#14110E]">Extrait de Parfum (20–40%)</option>
                <option value="Eau de Parfum" className="bg-[#14110E]">Eau de Parfum (15–20%)</option>
                <option value="Pure Attar / Ruh" className="bg-[#14110E]">Pure Attar / Ruh (100% Oil)</option>
                <option value="Eau de Toilette" className="bg-[#14110E]">Eau de Toilette (5–15%)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Olfactory Family</label>
              <select
                value={candidateFamily}
                onChange={(e) => setCandidateFamily(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              >
                <option value="Woody" className="bg-[#14110E]">Woody</option>
                <option value="Earthy" className="bg-[#14110E]">Earthy / Mineral</option>
                <option value="Floral" className="bg-[#14110E]">Floral</option>
                <option value="Amber" className="bg-[#14110E]">Amber / Oriental</option>
                <option value="Aromatic" className="bg-[#14110E]">Aromatic / Fougère</option>
                <option value="Citrus" className="bg-[#14110E]">Citrus / Fresh</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-lab text-stone-300 block">Key Notes List</label>
              <input
                type="text"
                value={candidateNotes}
                onChange={(e) => setCandidateNotes(e.target.value)}
                placeholder="e.g. Terracotta, Vetiver, Sandalwood"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono-lab text-stone-300 block">
              Olfactory Narrative &amp; Distillation Context
            </label>
            <textarea
              rows={3}
              value={candidateDesc}
              onChange={(e) => setCandidateDesc(e.target.value)}
              placeholder="Provide the composition narrative, extraction method, or historical inspiration..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs text-[#F8F5EE] focus:outline-none focus:border-amber-500/50 leading-relaxed font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono-lab text-stone-400 italic">
              Awards +40 Society Experience Points upon verification
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-semibold text-xs font-brand uppercase tracking-wider shadow-lg shadow-amber-900/30 transition cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Submit for Ingestion</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
