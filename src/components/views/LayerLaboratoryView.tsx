import React, { useState, useMemo } from 'react';
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
  Star
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

interface LayerLaboratoryViewProps {
  fragrances: Fragrance[];
  selectedFragranceA?: Fragrance;
  selectedFragranceB?: Fragrance;
  weather: WeatherCondition;
  onSaveCombination: (combo: any) => void;
  isSaved?: boolean;
}

export const LayerLaboratoryView: React.FC<LayerLaboratoryViewProps> = ({
  fragrances,
  selectedFragranceA,
  selectedFragranceB,
  weather,
  onSaveCombination
}) => {
  const [activeLabTab, setActiveLabTab] = useState<'synthesis' | 'troubleshoot' | 'experiment'>('synthesis');

  const [fragAId, setFragAId] = useState<number>(selectedFragranceA?.id || fragrances[0]?.id || 1);
  const [fragBId, setFragBId] = useState<number>(selectedFragranceB?.id || fragrances[1]?.id || 2);
  const [useTripleLayer, setUseTripleLayer] = useState<boolean>(false);
  const [fragCId, setFragCId] = useState<number>(fragrances[2]?.id || 3);

  // Time Machine Slider State
  const [simulationStepIdx, setSimulationStepIdx] = useState<number>(0);
  const [spraysA, setSpraysA] = useState<number>(2);
  const [spraysB, setSpraysB] = useState<number>(1);
  const [spraysC, setSpraysC] = useState<number>(1);
  const [ratioA, setRatioA] = useState<number>(60);
  const [location, setLocation] = useState<'wrists' | 'neck' | 'chest' | 'collarbone'>('collarbone');
  const [substrate, setSubstrate] = useState<'skin' | 'clothing' | 'hair'>('skin');

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

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

  const fragA = useMemo(() => fragrances.find(f => f.id === fragAId) || fragrances[0], [fragAId, fragrances]);
  const fragB = useMemo(() => fragrances.find(f => f.id === fragBId) || fragrances[1], [fragBId, fragrances]);
  const fragC = useMemo(() => fragrances.find(f => f.id === fragCId) || fragrances[2], [fragCId, fragrances]);

  // Compatibility Calculation
  const calculation = useMemo(() => {
    const famA = (fragA?.fragrance_family || '').toLowerCase();
    const famB = (fragB?.fragrance_family || '').toLowerCase();
    const weatherA = calculateWeatherAlignmentScore(fragA, weather);
    const weatherB = calculateWeatherAlignmentScore(fragB, weather);

    // Complementary score
    let baseScore = 84;
    let chordName = 'Alchemical Resonance';

    if (famA.includes('citrus') && famB.includes('wood')) {
      baseScore = 96;
      chordName = 'Solar Heartwood Alchemy';
    } else if (famA.includes('wood') && famB.includes('citrus')) {
      baseScore = 96;
      chordName = 'Solar Heartwood Alchemy';
    } else if (famA.includes('earth') || famB.includes('earth')) {
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
      explanation: finalScore >= 85
        ? `${fragA?.name} and ${fragB?.name} form a sophisticated thermodynamic bond. The volatile top of ${fragA?.name} illuminates the heavier base fixatives of ${fragB?.name} without olfactory crowding.`
        : `${fragA?.name} and ${fragB?.name} share closely competing accord densities. Consider adjusting spray ratios to prevent one overpowering the other.`,
      applicationRitual: {
        baseAnchor: (fragA?.intensity || 7) >= (fragB?.intensity || 5) ? (fragA?.name || 'Base') : (fragB?.name || 'Base'),
        sparkTop: (fragA?.intensity || 7) >= (fragB?.intensity || 5) ? (fragB?.name || 'Top') : (fragA?.name || 'Top'),
        waitTime: '45 seconds',
        recommendedRatio: `${spraysA} sprays ${fragA?.name || 'Specimen A'} : ${spraysB} sprays ${fragB?.name || 'Specimen B'}`
      }
    };
  }, [fragA, fragB, weather, spraysA, spraysB]);

  // Run Scent Simulator for time steps
  const evolutionSteps = useMemo(() => {
    return runScentSimulation({
      fragranceA: fragA,
      fragranceB: fragB,
      spraysA,
      spraysB,
      location,
      substrate,
      temperature_c: weather.temperature_c,
      humidity_pct: weather.humidity_pct
    });
  }, [fragA, fragB, spraysA, spraysB, location, substrate, weather]);

  const currentStep: ScentEvolutionStep = evolutionSteps[simulationStepIdx] || evolutionSteps[0];

  const handleSave = () => {
    onSaveCombination({
      fragrance_a: fragA,
      fragrance_b: fragB,
      compatibility_score: calculation.score,
      explanation: calculation.explanation,
      best_season: weather.season,
      best_occasion: 'Signature'
    });
    awardXP(50, 'first_chord');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Helper for Radar SVG Coordinates (6 axes: Freshness, Sweetness, Intensity, Woody, Floral, Warmth)
  const radarAxes = [
    { label: 'Freshness', value: currentStep.radar_values.freshness },
    { label: 'Sweetness', value: currentStep.radar_values.sweetness },
    { label: 'Intensity', value: currentStep.radar_values.intensity },
    { label: 'Woody', value: currentStep.radar_values.woody },
    { label: 'Floral', value: currentStep.radar_values.floral },
    { label: 'Warmth', value: currentStep.radar_values.warmth }
  ];

  const center = 110;
  const maxR = 85;
  const radarPoints = radarAxes.map((axis, i) => {
    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
    const r = (axis.value / 10) * maxR;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  });
  const pointsString = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>AI Fragrance Laboratory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-100">
            Olfactory Layering Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Simulate chord synergy, evaporation kinetics, and molecular harmony across time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-semibold transition cursor-pointer flex items-center gap-2"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved to Vault!' : 'Save Scent Chord'}</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        <button
          type="button"
          onClick={() => setActiveLabTab('synthesis')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'synthesis'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] border border-white/[0.06]'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Synthesis &amp; Time Machine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLabTab('troubleshoot')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'troubleshoot'
              ? 'bg-rose-500 text-stone-950 shadow-md'
              : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] border border-white/[0.06]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Fix My Layer (AI Diagnostic)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLabTab('experiment')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'experiment'
              ? 'bg-emerald-500 text-stone-950 shadow-md'
              : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] border border-white/[0.06]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Layer Experiment Tracker</span>
        </button>
      </div>

      {activeLabTab === 'synthesis' && (
        <>
          {/* Triple Layer Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-400">
              {useTripleLayer ? 'Triple Accord Chord Mode (3 Flacons)' : 'Dual Layer Harmony (2 Flacons)'}
            </span>
            <button
              type="button"
              onClick={() => setUseTripleLayer(prev => !prev)}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 cursor-pointer flex items-center gap-1.5"
            >
              {useTripleLayer ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{useTripleLayer ? 'Remove Fragrance C (Switch to Dual)' : '+ Add 3rd Fragrance (Triple Chord)'}</span>
            </button>
          </div>

          {/* Fragrance Selectors Box */}
          <div className={`grid grid-cols-1 ${useTripleLayer ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 p-6 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] backdrop-blur-md shadow-xl`}>
            {/* Fragrance A Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] flex items-center justify-center font-bold">1</span>
                  Base Anchor (Fragrance A)
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  Intensity: {fragA.intensity}/10
                </span>
              </div>

              <select
                value={fragAId}
                onChange={(e) => setFragAId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-stone-200 text-sm font-medium focus:outline-none focus:border-amber-500/60"
              >
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#181512] text-stone-200">
                    {f.name} — {f.brand} ({f.fragrance_family})
                  </option>
                ))}
              </select>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-stone-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-400">Top:</span>
                  <span className="text-stone-200 font-medium truncate ml-2">{fragA?.top_notes?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Base:</span>
                  <span className="text-stone-200 font-medium truncate ml-2">{fragA?.base_notes?.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Fragrance B Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] flex items-center justify-center font-bold">2</span>
                  Mid/Spark Companion (Fragrance B)
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  Intensity: {fragB?.intensity || 7}/10
                </span>
              </div>

              <select
                value={fragBId}
                onChange={(e) => setFragBId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-stone-200 text-sm font-medium focus:outline-none focus:border-rose-500/60"
              >
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#181512] text-stone-200">
                    {f.name} — {f.brand} ({f.fragrance_family})
                  </option>
                ))}
              </select>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-stone-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-400">Top:</span>
                  <span className="text-stone-200 font-medium truncate ml-2">{fragB?.top_notes?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Base:</span>
                  <span className="text-stone-200 font-medium truncate ml-2">{fragB?.base_notes?.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Optional Fragrance C Selector */}
            {useTripleLayer && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center justify-center font-bold">3</span>
                    Airy Veil (Fragrance C)
                  </label>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Intensity: {fragC?.intensity || 6}/10
                  </span>
                </div>

                <select
                  value={fragCId}
                  onChange={(e) => setFragCId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.12] text-stone-200 text-sm font-medium focus:outline-none focus:border-cyan-500/60"
                >
                  {fragrances.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[#181512] text-stone-200">
                      {f.name} — {f.brand} ({f.fragrance_family})
                    </option>
                  ))}
                </select>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-stone-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Top:</span>
                    <span className="text-stone-200 font-medium truncate ml-2">{fragC?.top_notes?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Base:</span>
                    <span className="text-stone-200 font-medium truncate ml-2">{fragC?.base_notes?.join(', ') || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. FIX MY LAYER (AI TROUBLESHOOTING ENGINE) */}
      {activeLabTab === 'troubleshoot' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#14120F]/90 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs uppercase font-semibold">
              <Wrench className="w-4 h-4" />
              <span>Layer Troubleshooting &bull; Active Flacons: {fragA.name} + {fragB.name}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
              What seems off with this scent combination?
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
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
              ].map(prob => (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => setSelectedProblem(prob.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium cursor-pointer transition text-center ${
                    selectedProblem === prob.id
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-semibold'
                      : 'bg-white/[0.02] border-white/[0.08] text-stone-300 hover:bg-white/[0.06]'
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
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1A1312] to-[#120F0E] border border-rose-500/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                      AI Diagnostic Report &bull; {diag.problemType}
                    </span>
                    <h4 className="font-serif text-2xl font-medium text-stone-100">
                      Root Cause &amp; Prescription
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
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
                      <div key={i} className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-xs flex items-center justify-between">
                        <span className="text-stone-200 font-medium">{c.fragranceName}</span>
                        <span className="text-rose-300 font-mono">{c.accordOrNote}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Ratio & Application */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                      Corrected Ratio Protocol
                    </span>
                    <div className="text-xs text-stone-300 space-y-1">
                      <p><strong>{fragA.name}:</strong> {diag.recommendedRatio.ratioA}% ({diag.recommendedRatio.spraysA} spray)</p>
                      <p><strong>{fragB.name}:</strong> {diag.recommendedRatio.ratioB}% ({diag.recommendedRatio.spraysB} spray)</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-[10px] font-mono uppercase text-teal-400 font-semibold">
                      Substrate &amp; Order Technique
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {diag.recommendedOrder}
                    </p>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
                  <strong>Expected Olfactory Outcome:</strong> {diag.expectedOutcome}
                </div>

                {/* Suggested additions */}
                {diag.suggestedWardrobeAdditions && diag.suggestedWardrobeAdditions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                      Optional Companion Counterbalance
                    </span>
                    {diag.suggestedWardrobeAdditions.map((item, idx) => (
                      <p key={idx} className="text-xs text-stone-300">
                        &bull; <strong className="text-cyan-200">{item.note}</strong> ({item.category}): {item.explanation}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. LAYER EXPERIMENT TRACKER */}
      {activeLabTab === 'experiment' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14120F]/90 border border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-semibold mb-1">
                <Activity className="w-4 h-4" />
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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-stone-100 text-xs font-semibold shadow-lg cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{expSaved ? 'Saved to Olfactory DNA!' : 'Save & Calibrate DNA (+50 XP)'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-stone-400 block mb-1">Experiment Title</label>
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Timeline ratings */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Time-Step Evolution Scores (1–10)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">Opening (0m)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expOpening}
                    onChange={(e) => setExpOpening(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expOpening}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">Heart (30m)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expHalfHour}
                    onChange={(e) => setExpHalfHour(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expHalfHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">2 Hours In</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expTwoHour}
                    onChange={(e) => setExpTwoHour(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expTwoHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">5 Hours In</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expFiveHour}
                    onChange={(e) => setExpFiveHour(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expFiveHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">Drydown Quality</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expDrydown}
                    onChange={(e) => setExpDrydown(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="text-right text-xs font-mono text-amber-300 font-bold">{expDrydown}/10</div>
                </div>
              </div>
            </div>

            {/* Overall Balance & Enjoyment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-xs font-mono uppercase text-stone-300">Accord Harmonic Balance</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expBalance}
                  onChange={(e) => setExpBalance(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <div className="text-right text-xs font-mono text-emerald-300 font-bold">{expBalance}/10</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-xs font-mono uppercase text-stone-300">Personal Scent Enjoyment</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expEnjoyment}
                  onChange={(e) => setExpEnjoyment(Number(e.target.value))}
                  className="w-full accent-emerald-400"
                />
                <div className="text-right text-xs font-mono text-emerald-300 font-bold">{expEnjoyment}/10</div>
              </div>
            </div>

            {/* Review memo */}
            <div>
              <label className="text-xs font-mono uppercase text-stone-400 block mb-1">Wear Diary &amp; Observations</label>
              <textarea
                rows={3}
                value={expMemo}
                onChange={(e) => setExpMemo(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-stone-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Output & Chord Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chord Card */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-amber-950/20 via-[#15120F]/90 to-purple-950/20 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Sparkles className="w-3 h-3" />
                <span>FORMULATED SCENT CHORD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono">Compatibility:</span>
                <span className={`text-base font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                  calculation.score >= 85
                    ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-700/50 text-amber-300'
                }`}>
                  {calculation.score}%
                </span>
              </div>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-100">
              {calculation.chordName}
            </h2>

            <p className="text-sm text-stone-300 mt-3 leading-relaxed">
              {calculation.explanation}
            </p>

            {/* Application Protocol */}
            <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Layer 1 (Base Anchor)</span>
                <span className="text-xs font-medium text-amber-300 mt-1 block truncate">{calculation.applicationRitual.baseAnchor}</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Apply to warm pulse point</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Wait Interval</span>
                <span className="text-xs font-medium text-stone-200 mt-1 block">{calculation.applicationRitual.waitTime}</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Allow solvent evaporation</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Layer 2 (Diffusion)</span>
                <span className="text-xs font-medium text-rose-300 mt-1 block truncate">{calculation.applicationRitual.sparkTop}</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Mist over collarbone</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-stone-400">
            <span>Atmospheric Alignment: <strong className="text-stone-200">{calculation.weatherFactor}%</strong></span>
            <span>Recommended Occasion: <strong className="text-stone-200">Evening / Signature</strong></span>
          </div>
        </div>

        {/* Dynamic Radar Chart Card */}
        <div className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 backdrop-blur-md shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Temporal Radar
            </span>
            <span className="text-xs font-mono text-stone-400">
              t = {currentStep.time_label}
            </span>
          </div>

          {/* SVG Radar Chart */}
          <div className="relative w-[220px] h-[220px] my-2">
            <svg width="220" height="220" className="overflow-visible">
              {/* Concentric rings */}
              {[0.25, 0.5, 0.75, 1.0].map((level) => (
                <polygon
                  key={level}
                  points={radarAxes.map((_, i) => {
                    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                    const r = maxR * level;
                    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              ))}

              {/* Axis rays */}
              {radarAxes.map((axis, i) => {
                const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                return (
                  <line
                    key={axis.label}
                    x1={center}
                    y1={center}
                    x2={center + maxR * Math.cos(angle)}
                    y2={center + maxR * Math.sin(angle)}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radar Area Polygon */}
              <polygon
                points={pointsString}
                fill="rgba(245, 158, 11, 0.25)"
                stroke="#F59E0B"
                strokeWidth="2"
              />

              {/* Points */}
              {radarPoints.map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r="3" fill="#FDE68A" />
              ))}
            </svg>
          </div>

          {/* Radar Legend */}
          <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] font-mono text-stone-400">
            <div>Fresh: <span className="text-amber-300 font-bold">{currentStep.radar_values.freshness}</span></div>
            <div>Sweet: <span className="text-amber-300 font-bold">{currentStep.radar_values.sweetness}</span></div>
            <div>Intense: <span className="text-amber-300 font-bold">{currentStep.radar_values.intensity}</span></div>
            <div>Woody: <span className="text-amber-300 font-bold">{currentStep.radar_values.woody}</span></div>
            <div>Floral: <span className="text-amber-300 font-bold">{currentStep.radar_values.floral}</span></div>
            <div>Warmth: <span className="text-amber-300 font-bold">{currentStep.radar_values.warmth}</span></div>
          </div>
        </div>
      </div>

      {/* SCENT SIMULATOR: Time Machine Slider & Kinetic Modifiers */}
      <section className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-700/40 text-cyan-300 text-xs font-mono mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>TEMPORAL SCENT SIMULATOR (TIME MACHINE)</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-stone-100">
              Evaporation &amp; Sillage Projection Timeline
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Observe how your layered blend transitions from initial alcohol flash to deep drydown over 8+ hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-400">Simulated Stage:</span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {currentStep?.time_label || '0 min'} ({currentStep?.dominant_phase ? currentStep.dominant_phase.split(' ')[0] : 'Opening'})
            </span>
          </div>
        </div>

        {/* Time Steps Progress Track */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={evolutionSteps.length - 1}
            value={simulationStepIdx}
            onChange={(e) => setSimulationStepIdx(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-white/[0.08] rounded-lg"
          />
          <div className="flex justify-between text-[11px] font-mono text-stone-400 px-1">
            {evolutionSteps.map((step, idx) => (
              <button
                key={step.time_label}
                type="button"
                onClick={() => setSimulationStepIdx(idx)}
                className={`cursor-pointer transition ${
                  simulationStepIdx === idx ? 'text-amber-300 font-bold scale-110' : 'hover:text-stone-200'
                }`}
              >
                {step.time_label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-stone-400">Projection Radius</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono font-bold text-cyan-300">
                {currentStep.projection_radius_feet} ft
              </span>
              <span className="text-xs text-stone-400">Aura Diameter</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              {currentStep.projection_radius_feet >= 4
                ? 'Expansive sillage cloud perceptible to nearby companions.'
                : 'Intimate second-skin scent bubble requiring close proximity.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-stone-400">Remaining Intensity</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono font-bold text-amber-300">
                {currentStep.remaining_intensity_pct}%
              </span>
              <span className="text-xs text-stone-400">Molecular Density</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Base fixatives (resins, woods, musks) preserve the heart structure.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase text-stone-400">Active Dominant Accords</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentStep.active_accords.map((accord) => (
                <span key={accord} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  {accord}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Modifiers Panel */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
          {/* Substrate Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Substrate:
            </span>
            {(['skin', 'clothing', 'hair'] as const).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubstrate(sub)}
                className={`px-3 py-1 rounded-xl text-xs capitalize transition cursor-pointer ${
                  substrate === sub
                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-medium'
                    : 'bg-white/[0.03] text-stone-400 hover:text-stone-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Pulse Point:
            </span>
            {(['collarbone', 'wrists', 'neck', 'chest'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className={`px-3 py-1 rounded-xl text-xs capitalize transition cursor-pointer ${
                  location === loc
                    ? 'bg-rose-500/20 border border-rose-500/50 text-rose-200 font-medium'
                    : 'bg-white/[0.03] text-stone-400 hover:text-stone-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Spray Ratio */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <span>Sprays:</span>
            <button
              type="button"
              onClick={() => setSpraysA(Math.max(1, spraysA - 1))}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
            >
              -
            </button>
            <span className="text-amber-300 font-bold">{spraysA} A</span>
            <button
              type="button"
              onClick={() => setSpraysA(Math.min(5, spraysA + 1))}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
            >
              +
            </button>
            <span className="text-stone-600">/</span>
            <button
              type="button"
              onClick={() => setSpraysB(Math.max(1, spraysB - 1))}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
            >
              -
            </button>
            <span className="text-rose-300 font-bold">{spraysB} B</span>
            <button
              type="button"
              onClick={() => setSpraysB(Math.min(5, spraysB + 1))}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
            >
              +
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
