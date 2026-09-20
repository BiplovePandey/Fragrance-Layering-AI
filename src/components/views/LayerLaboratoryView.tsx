import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  Clock,
  Droplets,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  Share2,
  Wind,
  CheckCircle2,
  Flame,
  Shirt,
  User,
  Sliders,
  Wrench,
  Activity,
  Plus,
  Trash2,
  ArrowRight,
  Star,
  RefreshCw,
  Shuffle
} from 'lucide-react';
import {
  Fragrance,
  WeatherCondition,
  ScentEvolutionStep,
  SavedCombination,
  FixMyLayerDiagnosis,
  LayerExperiment
} from '../../types.js';
import { runScentSimulation } from '../../services/scentSimulation.js';
import { calculateWeatherAlignmentScore } from '../../services/weatherEngine.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';

import { FlaconStation } from '../laboratory/FlaconStation.js';
import { ScentVaporMerge } from '../laboratory/ScentVaporMerge.js';
import { HarmonicScoreInstrument } from '../laboratory/HarmonicScoreInstrument.js';
import { Vector8DChordVisualizer } from '../laboratory/Vector8DChordVisualizer.js';
import { NoteHarmonicsMatrix } from '../laboratory/NoteHarmonicsMatrix.js';
import { ChordEvolutionTimeline } from '../laboratory/ChordEvolutionTimeline.js';
import { FragranceSelectorDrawer } from '../laboratory/FragranceSelectorDrawer.js';
import { deriveChordPoeticName } from '../laboratory/LaboratoryAtmosphere.js';

interface LayerLaboratoryViewProps {
  fragrances: Fragrance[];
  selectedFragranceA?: Fragrance;
  selectedFragranceB?: Fragrance;
  weather: WeatherCondition;
  onSaveCombination: (combo: any) => void;
  isSaved?: boolean;
  onWearToday?: (fragA: Fragrance, fragB?: Fragrance) => void;
}

export const LayerLaboratoryView: React.FC<LayerLaboratoryViewProps> = ({
  fragrances,
  selectedFragranceA,
  selectedFragranceB,
  weather,
  onSaveCombination,
  onWearToday
}) => {
  const [activeLabTab, setActiveLabTab] = useState<'synthesis' | 'troubleshoot' | 'experiment'>('synthesis');

  // Fragrance IDs with reactivity to props (e.g. from "Formulate Chords in Lab")
  const [fragAId, setFragAId] = useState<number>(selectedFragranceA?.id || fragrances[0]?.id || 1);
  const [fragBId, setFragBId] = useState<number>(selectedFragranceB?.id || fragrances[1]?.id || 2);
  const [useTripleLayer, setUseTripleLayer] = useState<boolean>(false);
  const [fragCId, setFragCId] = useState<number>(fragrances[2]?.id || 3);

  // Sync props if user selects a new fragrance in Chamber and clicks "Formulate in Lab"
  useEffect(() => {
    if (selectedFragranceA) {
      setFragAId(selectedFragranceA.id);
      // Ensure specimen B is not an accidental duplicate of specimen A
      if (fragBId === selectedFragranceA.id) {
        const alt = fragrances.find((f) => f.id !== selectedFragranceA.id);
        if (alt) setFragBId(alt.id);
      }
    }
  }, [selectedFragranceA]);

  useEffect(() => {
    if (selectedFragranceB) {
      setFragBId(selectedFragranceB.id);
    }
  }, [selectedFragranceB]);

  // Spray Volumes & Ratios
  const [spraysA, setSpraysA] = useState<number>(2);
  const [spraysB, setSpraysB] = useState<number>(1);
  const [spraysC, setSpraysC] = useState<number>(1);

  // Status states
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [hasWornToday, setHasWornToday] = useState<boolean>(false);

  // Selector Drawer Modal State
  const [selectorTarget, setSelectorTarget] = useState<'A' | 'B' | null>(null);

  // Troubleshoot State
  const [selectedProblem, setSelectedProblem] = useState<string>('too_sweet');

  // Experiment Tracker State
  const [expTitle, setExpTitle] = useState<string>('Solar Sandalwood & Bergamot Field Test');
  const [expOpening, setExpOpening] = useState<number>(9);
  const [expHalfHour, setExpHalfHour] = useState<number>(8);
  const [expTwoHour, setExpTwoHour] = useState<number>(9);
  const [expFiveHour, setExpFiveHour] = useState<number>(8);
  const [expDrydown, setExpDrydown] = useState<number>(9);
  const [expBalance, setExpBalance] = useState<number>(9);
  const [expEnjoyment, setExpEnjoyment] = useState<number>(9);
  const [expMemo, setExpMemo] = useState<string>('Layered 2 sprays of citrus over 1 drop of attar. High humidity amplified the petrichor beautifully.');
  const [expSaved, setExpSaved] = useState<boolean>(false);

  // Active fragrance objects
  const fragA = useMemo(() => fragrances.find((f) => f.id === fragAId) || fragrances[0], [fragAId, fragrances]);
  const fragB = useMemo(() => fragrances.find((f) => f.id === fragBId) || fragrances[1], [fragBId, fragrances]);
  const fragC = useMemo(() => fragrances.find((f) => f.id === fragCId) || fragrances[2], [fragCId, fragrances]);

  // Compatibility Calculation using authoritative existing logic
  const calculation = useMemo(() => {
    const famA = (fragA?.fragrance_family || '').toLowerCase();
    const famB = (fragB?.fragrance_family || '').toLowerCase();
    const weatherA = calculateWeatherAlignmentScore(fragA, weather);
    const weatherB = calculateWeatherAlignmentScore(fragB, weather);

    // Complementary score
    let baseScore = 84;
    let chordName = 'Alchemical Resonance';

    if ((famA.includes('citrus') && famB.includes('wood')) || (famA.includes('wood') && famB.includes('citrus'))) {
      baseScore = 96;
      chordName = 'Solar Heartwood Alchemy';
    } else if (famA.includes('earth') || famB.includes('earth') || famA.includes('mitti') || famB.includes('mitti')) {
      baseScore = 94;
      chordName = 'Alluvial Monsoon Petrichor Chord';
    } else if (famA.includes('floral') && (famB.includes('wood') || famB.includes('amber'))) {
      baseScore = 92;
      chordName = 'Velvet Damascus Sillage';
    } else if (famA.includes('gourmand') && famB.includes('gourmand')) {
      baseScore = 58;
      chordName = 'Heavy Confectionery Overload';
    } else {
      baseScore = 88;
      chordName = `${fragA?.fragrance_family?.split(' ')[0] || 'Aromatic'} & ${fragB?.fragrance_family?.split(' ')[0] || 'Woody'} Synergy`;
    }

    const weatherFactor = (weatherA.score + weatherB.score) / 2;
    const finalScore = Math.min(99, Math.round(baseScore * 0.7 + weatherFactor * 0.3));

    return {
      score: finalScore,
      chordName,
      weatherFactor: Math.round(weatherFactor),
      explanation:
        finalScore >= 85
          ? `${fragA?.name} and ${fragB?.name} form an exceptionally balanced olfactory harmony. The volatile top notes of ${fragA?.name} illuminate the heavier base fixatives of ${fragB?.name} without accord crowding.`
          : `${fragA?.name} and ${fragB?.name} share closely competing accord densities. Adjusting spray ratios or applying to separate pulse zones will prevent one overshadowing the other.`,
      applicationRitual: {
        baseAnchor: (fragA?.intensity || 7) >= (fragB?.intensity || 5) ? fragA?.name || 'Base Anchor' : fragB?.name || 'Base Anchor',
        sparkTop: (fragA?.intensity || 7) >= (fragB?.intensity || 5) ? fragB?.name || 'Diffusion Spark' : fragA?.name || 'Diffusion Spark',
        waitTime: '45 seconds',
        recommendedRatio: `${spraysA} sprays ${fragA?.name || 'Specimen A'} : ${spraysB} sprays ${fragB?.name || 'Specimen B'}`
      }
    };
  }, [fragA, fragB, weather, spraysA, spraysB]);

  // Handle Save Scent Chord
  const handleSave = () => {
    onSaveCombination({
      fragrance_a: fragA,
      fragrance_b: fragB,
      compatibility_score: calculation.score,
      explanation: calculation.explanation,
      best_season: weather.season,
      best_occasion: 'Signature Chord'
    });
    try {
      ambientAudioEngine.playSpatialChord([528, 660, 792], 0.12);
    } catch {}
    awardXP(50, 'first_chord');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Handle Wear Chord
  const handleWear = () => {
    try {
      ambientAudioEngine.playSpatialChord([440, 554, 659], 0.14);
    } catch {}
    setHasWornToday(true);
    if (onWearToday) {
      onWearToday(fragA, fragB);
    }
  };

  // Surprise Me Serendipity: Pick a harmonious pair based on complementary families
  const handleSurpriseMe = () => {
    try {
      ambientAudioEngine.playSpatialChord([528, 660, 792, 1056], 0.12);
    } catch {}
    // Pick random candidate A
    const randomIdxA = Math.floor(Math.random() * fragrances.length);
    const candA = fragrances[randomIdxA] || fragrances[0];

    // Pick candidate B with contrasting family
    const candB =
      fragrances.find((f) => f.id !== candA.id && f.fragrance_family !== candA.fragrance_family) ||
      fragrances[(randomIdxA + 1) % fragrances.length];

    setFragAId(candA.id);
    setFragBId(candB.id);
    setHasWornToday(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ============================================================
          LABORATORY HEADER
      ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Alchemical Perfumery Laboratory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-stone-100 tracking-tight">
            Olfactory Layering Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-sans mt-1">
            Compose temporary fragrance chords on the master perfumer's blending table.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Serendipitous alchemical pairing"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Surprise Me</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-md"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-950" />
            <span>{savedSuccess ? 'Saved to Vault!' : 'Save Chord'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          LABORATORY SUB-NAVIGATION TABS
      ============================================================ */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-3 text-xs font-mono overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveLabTab('synthesis')}
          className={`px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'synthesis'
              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-bold shadow-xs'
              : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
          <span>Synthesis &amp; Scent Simulator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLabTab('troubleshoot')}
          className={`px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'troubleshoot'
              ? 'bg-rose-500/20 border border-rose-500/50 text-rose-200 font-bold shadow-xs'
              : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-rose-400" />
          <span>Fix My Layer (AI Diagnostic)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLabTab('experiment')}
          className={`px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'experiment'
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 font-bold shadow-xs'
              : 'bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Layer Experiment Tracker</span>
        </button>
      </div>

      {/* ============================================================
          VIEW 1: PRIMARY SYNTHESIS & SCENT SIMULATION TABLE
      ============================================================ */}
      {activeLabTab === 'synthesis' && (
        <div className="space-y-8">
          {/* THE TWO FLACON STATIONS (BLENDING BENCH) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FlaconStation
              station="A"
              stationLabel="Specimen A (Base Anchor)"
              fragrance={fragA}
              sprays={spraysA}
              onSpraysChange={setSpraysA}
              onOpenSelector={() => setSelectorTarget('A')}
              isDominant={spraysA >= spraysB}
            />

            <FlaconStation
              station="B"
              stationLabel="Specimen B (Diffusion Companion)"
              fragrance={fragB}
              sprays={spraysB}
              onSpraysChange={setSpraysB}
              onOpenSelector={() => setSelectorTarget('B')}
              isDominant={spraysB > spraysA}
            />
          </div>

          {/* THE HERO INTERACTION: SCENT VAPOR MERGE */}
          <section aria-label="Alchemical scent vapor collision chamber">
            <ScentVaporMerge
              fragA={fragA}
              fragB={fragB}
              compatibilityScore={calculation.score}
              spraysA={spraysA}
              spraysB={spraysB}
            />
          </section>

          {/* CENTRAL INSTRUMENT: HARMONIC SCORE & ACTION RITUAL */}
          <section aria-label="Harmonic chord evaluation and application ritual">
            <HarmonicScoreInstrument
              fragA={fragA}
              fragB={fragB}
              score={calculation.score}
              explanation={calculation.explanation}
              weatherFactor={calculation.weatherFactor}
              weather={weather}
              applicationRitual={calculation.applicationRitual}
              onSaveChord={handleSave}
              isSaved={savedSuccess}
              onWearChord={handleWear}
              hasWornToday={hasWornToday}
            />
          </section>

          {/* PARALLEL ANALYSIS: 8D VECTOR SYNTHESIS & NOTE HARMONICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Vector8DChordVisualizer
              fragA={fragA}
              fragB={fragB}
              spraysA={spraysA}
              spraysB={spraysB}
            />

            <NoteHarmonicsMatrix
              fragA={fragA}
              fragB={fragB}
            />
          </div>

          {/* TEMPORAL EVAPORATION & SILLAGE TIMELINE */}
          <section aria-label="Temporal evaporation and sillage simulation">
            <ChordEvolutionTimeline
              fragA={fragA}
              fragB={fragB}
              spraysA={spraysA}
              spraysB={spraysB}
              weather={weather}
            />
          </section>
        </div>
      )}

      {/* ============================================================
          VIEW 2: FIX MY LAYER (AI TROUBLESHOOTING ENGINE)
      ============================================================ */}
      {activeLabTab === 'troubleshoot' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#14100C]/95 border border-rose-500/30 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-300 font-mono text-xs uppercase font-semibold">
              <Wrench className="w-4 h-4 text-rose-400" />
              <span>Layer Troubleshooting &bull; Active Flacons: {fragA.name} + {fragB.name}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              What seems off with this scent combination?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-sans">
              Select the olfactory symptom you are experiencing on your skin or test strip:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
              {[
                { id: 'too_sweet', label: 'Too Sweet / Cloying' },
                { id: 'too_strong', label: 'Too Strong / Loud' },
                { id: 'too_floral', label: 'Too Floral' },
                { id: 'too_dry', label: 'Too Dry / Sharp' },
                { id: 'doesnt_last', label: "Doesn't Last Long" },
                { id: 'too_heavy', label: 'Too Heavy / Suffocating' },
                { id: 'too_weak', label: 'Too Weak / Faint' },
                { id: 'too_sharp', label: 'Too Acidic / Piercing' },
                { id: 'too_boring', label: 'Too Flat / Boring' }
              ].map((prob) => (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => setSelectedProblem(prob.id)}
                  className={`p-3 rounded-2xl border text-xs font-mono font-medium cursor-pointer transition text-center ${
                    selectedProblem === prob.id
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-200 font-bold shadow-xs'
                      : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {prob.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Diagnosis Result */}
          {(() => {
            const diag = olfactoryIntelligence.diagnoseAndFixLayer(
              fragA,
              fragB,
              useTripleLayer ? fragC : undefined,
              selectedProblem
            );
            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#14100C]/95 border border-rose-500/40 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                      AI Diagnostic Report &bull; {diag.problemType}
                    </span>
                    <h4 className="font-serif text-2xl font-medium text-stone-100">
                      Root Cause &amp; Prescription
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    Action: {diag.suggestedAction.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Identified causes */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-stone-400 font-semibold">
                    1. Chemical &amp; Accord Drivers
                  </span>
                  <div className="space-y-2">
                    {diag.identifiedCauses.map((c, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-stone-900/50 border border-stone-800 text-xs flex items-center justify-between">
                        <span className="text-stone-200 font-medium">{c.fragranceName}</span>
                        <span className="text-rose-400 font-mono font-semibold">{c.accordOrNote}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Ratio & Application */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                      Corrected Ratio Protocol
                    </span>
                    <div className="text-xs text-stone-300 space-y-1">
                      <p><strong className="text-stone-100">{fragA.name}:</strong> {diag.recommendedRatio.ratioA}% ({diag.recommendedRatio.spraysA} spray)</p>
                      <p><strong className="text-stone-100">{fragB.name}:</strong> {diag.recommendedRatio.ratioB}% ({diag.recommendedRatio.spraysB} spray)</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-semibold">
                      Substrate &amp; Order Technique
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {diag.recommendedOrder}
                    </p>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200">
                  <strong className="text-rose-100">Expected Olfactory Outcome:</strong> {diag.expectedOutcome}
                </div>

                {/* Suggested additions */}
                {diag.suggestedWardrobeAdditions && diag.suggestedWardrobeAdditions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-2">
                    <span className="text-xs font-mono uppercase text-teal-400 font-semibold">
                      Optional Companion Counterbalance
                    </span>
                    {diag.suggestedWardrobeAdditions.map((item, idx) => (
                      <p key={idx} className="text-xs text-stone-300 font-sans">
                        &bull; <strong className="text-stone-100">{item.note}</strong> ({item.category}): {item.explanation}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================
          VIEW 3: LAYER EXPERIMENT TRACKER
      ============================================================ */}
      {activeLabTab === 'experiment' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14100C]/95 border border-emerald-500/40 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-semibold mb-1">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Field Wear Experimentation Tracker</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                Log Live Skin Wear Results
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                olfactoryIntelligence.saveExperiment({
                  title: expTitle,
                  fragranceA: fragA,
                  fragranceB: fragB,
                  ratioA: 60,
                  ratioB: 40,
                  spraysA,
                  spraysB,
                  applicationOrder: `${fragA.name} first on skin; ${fragB.name} on collar`,
                  substrateA: 'skin',
                  substrateB: 'clothing',
                  waitTimeSeconds: 45,
                  recordedEvolution: {
                    openingNotesRating: expOpening,
                    halfHourProjection: expHalfHour,
                    twoHourLongevity: expTwoHour,
                    fiveHourRemaining: expFiveHour,
                    drydownQuality: expDrydown
                  },
                  balanceScore: expBalance,
                  personalEnjoyment: expEnjoyment,
                  reviewMemo: expMemo
                });
                awardXP(50, 'log_layer_experiment');
                setExpSaved(true);
                setTimeout(() => setExpSaved(false), 4000);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-stone-100 text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{expSaved ? 'Saved to Olfactory DNA!' : 'Save & Calibrate DNA (+50 XP)'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-stone-400 block mb-1 font-semibold">Experiment Title</label>
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Timeline ratings */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Time-Step Evolution Scores (1–10)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">Opening (0m)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expOpening}
                    onChange={(e) => setExpOpening(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expOpening}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">Heart (30m)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expHalfHour}
                    onChange={(e) => setExpHalfHour(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expHalfHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">2 Hours In</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expTwoHour}
                    onChange={(e) => setExpTwoHour(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expTwoHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">5 Hours In</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expFiveHour}
                    onChange={(e) => setExpFiveHour(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expFiveHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">Drydown Quality</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expDrydown}
                    onChange={(e) => setExpDrydown(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expDrydown}/10</div>
                </div>
              </div>
            </div>

            {/* Overall Balance & Enjoyment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                <span className="text-xs font-mono uppercase text-stone-300 font-semibold">Accord Harmonic Balance</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expBalance}
                  onChange={(e) => setExpBalance(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="text-right text-xs font-mono text-emerald-400 font-bold">{expBalance}/10</div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-1">
                <span className="text-xs font-mono uppercase text-stone-300 font-semibold">Personal Scent Enjoyment</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expEnjoyment}
                  onChange={(e) => setExpEnjoyment(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="text-right text-xs font-mono text-emerald-400 font-bold">{expEnjoyment}/10</div>
              </div>
            </div>

            {/* Review memo */}
            <div>
              <label className="text-xs font-mono uppercase text-stone-400 block mb-1 font-semibold">Wear Diary &amp; Observations</label>
              <textarea
                rows={3}
                value={expMemo}
                onChange={(e) => setExpMemo(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          FLACON SELECTOR DRAWER MODAL
      ============================================================ */}
      <FragranceSelectorDrawer
        isOpen={selectorTarget !== null}
        onClose={() => setSelectorTarget(null)}
        onSelect={(selectedFrag) => {
          if (selectorTarget === 'A') {
            setFragAId(selectedFrag.id);
          } else if (selectorTarget === 'B') {
            setFragBId(selectedFrag.id);
          }
          setHasWornToday(false);
        }}
        currentSelectedId={selectorTarget === 'A' ? fragAId : fragBId}
        partnerFragrance={selectorTarget === 'A' ? fragB : fragA}
        allFragrances={fragrances}
        targetStation={selectorTarget || 'A'}
      />
    </div>
  );
};
