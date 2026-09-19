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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono-lab mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
            <span>AI Fragrance Laboratory</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
            Olfactory Layering Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1">
            Simulate chord synergy, evaporation kinetics, and molecular harmony across time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-semibold transition cursor-pointer flex items-center gap-2 shadow-2xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-800" />
            <span>{savedSuccess ? 'Saved to Vault!' : 'Save Scent Chord'}</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DFD3] pb-3">
        <button
          type="button"
          onClick={() => setActiveLabTab('synthesis')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'synthesis'
              ? 'bg-[#1A1613] text-[#FAF7F2] shadow-sm'
              : 'bg-[#F8F5EE] text-[#5A5046] hover:bg-[#F0EBE1] border border-[#E3DACB]'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
          <span>Synthesis &amp; Time Machine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLabTab('troubleshoot')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'troubleshoot'
              ? 'bg-[#8A3B2B] text-white shadow-sm'
              : 'bg-[#F8F5EE] text-[#5A5046] hover:bg-[#F0EBE1] border border-[#E3DACB]'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-rose-500" />
          <span>Fix My Layer (AI Diagnostic)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLabTab('experiment')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition flex items-center gap-2 ${
            activeLabTab === 'experiment'
              ? 'bg-[#2E5E4E] text-white shadow-sm'
              : 'bg-[#F8F5EE] text-[#5A5046] hover:bg-[#F0EBE1] border border-[#E3DACB]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>Layer Experiment Tracker</span>
        </button>
      </div>

      {activeLabTab === 'synthesis' && (
        <>
          {/* Triple Layer Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-lab text-[#7A6F66]">
              {useTripleLayer ? 'Triple Accord Chord Mode (3 Flacons)' : 'Dual Layer Harmony (2 Flacons)'}
            </span>
            <button
              type="button"
              onClick={() => setUseTripleLayer(prev => !prev)}
              className="text-xs font-mono-lab text-amber-800 hover:text-amber-950 font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {useTripleLayer ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{useTripleLayer ? 'Remove Fragrance C (Switch to Dual)' : '+ Add 3rd Fragrance (Triple Chord)'}</span>
            </button>
          </div>

          {/* Fragrance Selectors Box */}
          <div className={`grid grid-cols-1 ${useTripleLayer ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 p-6 rounded-3xl liquid-glass`}>
            {/* Fragrance A Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-lab uppercase tracking-wider text-amber-900 font-semibold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-white/80 border border-white text-amber-900 text-[10px] flex items-center justify-center font-bold shadow-2xs">1</span>
                  Base Anchor (Fragrance A)
                </label>
                <span className="text-[11px] text-[#7A6F66] font-mono-lab">
                  Intensity: {fragA.intensity}/10
                </span>
              </div>

              <select
                value={fragAId}
                onChange={(e) => setFragAId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl liquid-glass-inset text-[#1A1613] text-sm font-medium focus:outline-none"
              >
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white text-[#1A1613]">
                    {f.name} — {f.brand} ({f.fragrance_family})
                  </option>
                ))}
              </select>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-xs text-[#5A5046] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7A6F66]">Top:</span>
                  <span className="text-[#1A1613] font-medium truncate ml-2">{fragA?.top_notes?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F66]">Base:</span>
                  <span className="text-[#1A1613] font-medium truncate ml-2">{fragA?.base_notes?.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Fragrance B Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-lab uppercase tracking-wider text-rose-900 font-semibold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-[10px] flex items-center justify-center font-bold">2</span>
                  Mid/Spark Companion (Fragrance B)
                </label>
                <span className="text-[11px] text-[#7A6F66] font-mono-lab">
                  Intensity: {fragB?.intensity || 7}/10
                </span>
              </div>

              <select
                value={fragBId}
                onChange={(e) => setFragBId(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-[#1A1613] text-sm font-medium focus:outline-none focus:border-rose-500"
              >
                {fragrances.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white text-[#1A1613]">
                    {f.name} — {f.brand} ({f.fragrance_family})
                  </option>
                ))}
              </select>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-xs text-[#5A5046] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#7A6F66]">Top:</span>
                  <span className="text-[#1A1613] font-medium truncate ml-2">{fragB?.top_notes?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F66]">Base:</span>
                  <span className="text-[#1A1613] font-medium truncate ml-2">{fragB?.base_notes?.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Optional Fragrance C Selector */}
            {useTripleLayer && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono-lab uppercase tracking-wider text-teal-900 font-semibold flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 border border-teal-300 text-teal-900 text-[10px] flex items-center justify-center font-bold">3</span>
                    Airy Veil (Fragrance C)
                  </label>
                  <span className="text-[11px] text-[#7A6F66] font-mono-lab">
                    Intensity: {fragC?.intensity || 6}/10
                  </span>
                </div>

                <select
                  value={fragCId}
                  onChange={(e) => setFragCId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-[#1A1613] text-sm font-medium focus:outline-none focus:border-teal-500"
                >
                  {fragrances.map((f) => (
                    <option key={f.id} value={f.id} className="bg-white text-[#1A1613]">
                      {f.name} — {f.brand} ({f.fragrance_family})
                    </option>
                  ))}
                </select>

                <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-xs text-[#5A5046] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#7A6F66]">Top:</span>
                    <span className="text-[#1A1613] font-medium truncate ml-2">{fragC?.top_notes?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6F66]">Base:</span>
                    <span className="text-[#1A1613] font-medium truncate ml-2">{fragC?.base_notes?.join(', ') || 'N/A'}</span>
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
          <div className="p-6 rounded-3xl bg-white/95 border border-rose-200 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-rose-800 font-mono-lab text-xs uppercase font-semibold">
              <Wrench className="w-4 h-4 text-rose-700" />
              <span>Layer Troubleshooting &bull; Active Flacons: {fragA.name} + {fragB.name}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
              What seems off with this scent combination?
            </h3>
            <p className="text-xs sm:text-sm text-[#5A5046]">
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
                      ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold shadow-2xs'
                      : 'bg-[#F8F5EE] border-[#E3DACB] text-[#5A5046] hover:bg-[#F0EBE1]'
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
              <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-rose-300 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD3]">
                  <div>
                    <span className="text-[10px] font-mono-lab uppercase text-rose-800 font-semibold">
                      AI Diagnostic Report &bull; {diag.problemType}
                    </span>
                    <h4 className="font-serif text-2xl font-medium text-[#1A1613]">
                      Root Cause &amp; Prescription
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-mono-lab">
                    Action: {diag.suggestedAction.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Identified causes */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-lab uppercase text-[#7A6F66] font-semibold">
                    1. Chemical &amp; Accord Drivers
                  </span>
                  <div className="space-y-2">
                    {diag.identifiedCauses.map((c, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] text-xs flex items-center justify-between">
                        <span className="text-[#1A1613] font-medium">{c.fragranceName}</span>
                        <span className="text-rose-800 font-mono-lab font-semibold">{c.accordOrNote}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Ratio & Application */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-2">
                    <span className="text-[10px] font-mono-lab uppercase text-amber-800 font-semibold">
                      Corrected Ratio Protocol
                    </span>
                    <div className="text-xs text-[#5A5046] space-y-1">
                      <p><strong className="text-[#1A1613]">{fragA.name}:</strong> {diag.recommendedRatio.ratioA}% ({diag.recommendedRatio.spraysA} spray)</p>
                      <p><strong className="text-[#1A1613]">{fragB.name}:</strong> {diag.recommendedRatio.ratioB}% ({diag.recommendedRatio.spraysB} spray)</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-2">
                    <span className="text-[10px] font-mono-lab uppercase text-teal-800 font-semibold">
                      Substrate &amp; Order Technique
                    </span>
                    <p className="text-xs text-[#5A5046] leading-relaxed">
                      {diag.recommendedOrder}
                    </p>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                  <strong>Expected Olfactory Outcome:</strong> {diag.expectedOutcome}
                </div>

                {/* Suggested additions */}
                {diag.suggestedWardrobeAdditions && diag.suggestedWardrobeAdditions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-2">
                    <span className="text-xs font-mono-lab uppercase text-teal-800 font-semibold">
                      Optional Companion Counterbalance
                    </span>
                    {diag.suggestedWardrobeAdditions.map((item, idx) => (
                      <p key={idx} className="text-xs text-[#5A5046]">
                        &bull; <strong className="text-[#1A1613]">{item.note}</strong> ({item.category}): {item.explanation}
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-emerald-300 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD3]">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-mono-lab text-xs uppercase font-semibold mb-1">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Field Wear Experimentation Tracker</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613]">
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
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{expSaved ? 'Saved to Olfactory DNA!' : 'Save & Calibrate DNA (+50 XP)'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono-lab uppercase text-[#7A6F66] block mb-1 font-semibold">Experiment Title</label>
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                className="w-full bg-[#F8F5EE] border border-[#E3DACB] rounded-xl px-4 py-2.5 text-xs text-[#1A1613] outline-none focus:border-emerald-500"
              />
            </div>

            {/* Timeline ratings */}
            <div className="space-y-2">
              <span className="text-xs font-mono-lab uppercase text-amber-800 font-semibold">
                Time-Step Evolution Scores (1–10)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">Opening (0m)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expOpening}
                    onChange={(e) => setExpOpening(Number(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                  <div className="text-right text-xs font-mono-lab text-amber-900 font-bold">{expOpening}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">Heart (30m)</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expHalfHour}
                    onChange={(e) => setExpHalfHour(Number(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                  <div className="text-right text-xs font-mono-lab text-amber-900 font-bold">{expHalfHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">2 Hours In</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expTwoHour}
                    onChange={(e) => setExpTwoHour(Number(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                  <div className="text-right text-xs font-mono-lab text-amber-900 font-bold">{expTwoHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">5 Hours In</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expFiveHour}
                    onChange={(e) => setExpFiveHour(Number(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                  <div className="text-right text-xs font-mono-lab text-amber-900 font-bold">{expFiveHour}/10</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab">Drydown Quality</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={expDrydown}
                    onChange={(e) => setExpDrydown(Number(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                  <div className="text-right text-xs font-mono-lab text-amber-900 font-bold">{expDrydown}/10</div>
                </div>
              </div>
            </div>

            {/* Overall Balance & Enjoyment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                <span className="text-xs font-mono-lab uppercase text-[#3D352E] font-semibold">Accord Harmonic Balance</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expBalance}
                  onChange={(e) => setExpBalance(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
                <div className="text-right text-xs font-mono-lab text-emerald-800 font-bold">{expBalance}/10</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] space-y-1">
                <span className="text-xs font-mono-lab uppercase text-[#3D352E] font-semibold">Personal Scent Enjoyment</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={expEnjoyment}
                  onChange={(e) => setExpEnjoyment(Number(e.target.value))}
                  className="w-full accent-emerald-700"
                />
                <div className="text-right text-xs font-mono-lab text-emerald-800 font-bold">{expEnjoyment}/10</div>
              </div>
            </div>

            {/* Review memo */}
            <div>
              <label className="text-xs font-mono-lab uppercase text-[#7A6F66] block mb-1 font-semibold">Wear Diary &amp; Observations</label>
              <textarea
                rows={3}
                value={expMemo}
                onChange={(e) => setExpMemo(e.target.value)}
                className="w-full bg-[#F8F5EE] border border-[#E3DACB] rounded-xl px-4 py-2.5 text-xs text-[#1A1613] outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Output & Chord Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chord Card */}
        <div className="lg:col-span-2 rounded-3xl liquid-glass p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-white text-amber-900 text-xs font-mono-lab shadow-2xs">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>FORMULATED SCENT CHORD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7A6F66] font-mono-lab">Compatibility:</span>
                <span className={`text-base font-mono-lab font-bold px-2.5 py-0.5 rounded-lg border ${
                  calculation.score >= 85
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900'
                    : 'bg-amber-100/90 border-amber-300 text-amber-900'
                }`}>
                  {calculation.score}%
                </span>
              </div>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
              {calculation.chordName}
            </h2>

            <p className="text-sm text-[#5A5046] mt-3 leading-relaxed">
              {calculation.explanation}
            </p>

            {/* Application Protocol */}
            <div className="mt-6 pt-5 border-t border-white/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl liquid-glass-inset">
                <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Layer 1 (Base Anchor)</span>
                <span className="text-xs font-semibold text-amber-900 mt-1 block truncate">{calculation.applicationRitual.baseAnchor}</span>
                <span className="text-[10px] text-[#7A6F66] mt-0.5 block">Apply to warm pulse point</span>
              </div>
              <div className="p-3 rounded-xl liquid-glass-inset">
                <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Wait Interval</span>
                <span className="text-xs font-semibold text-[#1A1613] mt-1 block">{calculation.applicationRitual.waitTime}</span>
                <span className="text-[10px] text-[#7A6F66] mt-0.5 block">Allow solvent evaporation</span>
              </div>
              <div className="p-3 rounded-xl liquid-glass-inset">
                <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Layer 2 (Diffusion)</span>
                <span className="text-xs font-semibold text-rose-900 mt-1 block truncate">{calculation.applicationRitual.sparkTop}</span>
                <span className="text-[10px] text-[#7A6F66] mt-0.5 block">Mist over collarbone</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between text-xs text-[#7A6F66]">
            <span>Atmospheric Alignment: <strong className="text-[#1A1613]">{calculation.weatherFactor}%</strong></span>
            <span>Recommended Occasion: <strong className="text-[#1A1613]">Evening / Signature</strong></span>
          </div>
        </div>

        {/* Dynamic Radar Chart Card */}
        <div className="rounded-3xl liquid-glass p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono-lab uppercase tracking-wider text-amber-800 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" /> Temporal Radar
            </span>
            <span className="text-xs font-mono-lab text-[#7A6F66]">
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
                  stroke="#E3DACB"
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
                    stroke="#E3DACB"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radar Area Polygon */}
              <polygon
                points={pointsString}
                fill="rgba(217, 119, 6, 0.20)"
                stroke="#B45309"
                strokeWidth="2"
              />

              {/* Points */}
              {radarPoints.map((p, idx) => (
                <circle key={idx} cx={p.x} cy={p.y} r="3.5" fill="#92400E" />
              ))}
            </svg>
          </div>

          {/* Radar Legend */}
          <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] font-mono-lab text-[#5A5046]">
            <div>Fresh: <span className="text-amber-900 font-bold">{currentStep.radar_values.freshness}</span></div>
            <div>Sweet: <span className="text-amber-900 font-bold">{currentStep.radar_values.sweetness}</span></div>
            <div>Intense: <span className="text-amber-900 font-bold">{currentStep.radar_values.intensity}</span></div>
            <div>Woody: <span className="text-amber-900 font-bold">{currentStep.radar_values.woody}</span></div>
            <div>Floral: <span className="text-amber-900 font-bold">{currentStep.radar_values.floral}</span></div>
            <div>Warmth: <span className="text-amber-900 font-bold">{currentStep.radar_values.warmth}</span></div>
          </div>
        </div>
      </div>

      {/* SCENT SIMULATOR: Time Machine Slider & Kinetic Modifiers */}
      <section className="rounded-3xl liquid-glass p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-xs font-mono-lab mb-2">
              <Clock className="w-3.5 h-3.5 text-cyan-700" />
              <span>TEMPORAL SCENT SIMULATOR (TIME MACHINE)</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#1A1613]">
              Evaporation &amp; Sillage Projection Timeline
            </h3>
            <p className="text-xs text-[#5A5046] mt-0.5">
              Observe how your layered blend transitions from initial alcohol flash to deep drydown over 8+ hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-lab text-[#7A6F66]">Simulated Stage:</span>
            <span className="text-xs font-mono-lab font-bold px-3 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
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
            className="w-full accent-amber-700 cursor-pointer h-2 bg-[#E8DFD3] rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[11px] font-mono-lab text-[#7A6F66] px-1">
            {evolutionSteps.map((step, idx) => (
              <button
                key={step.time_label}
                type="button"
                onClick={() => setSimulationStepIdx(idx)}
                className={`cursor-pointer transition ${
                  simulationStepIdx === idx ? 'text-amber-900 font-bold scale-110' : 'hover:text-[#1A1613]'
                }`}
              >
                {step.time_label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB]">
            <span className="text-[10px] font-mono-lab uppercase text-[#7A6F66]">Projection Radius</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono-lab font-bold text-teal-800">
                {currentStep.projection_radius_feet} ft
              </span>
              <span className="text-xs text-[#7A6F66]">Aura Diameter</span>
            </div>
            <p className="text-[11px] text-[#5A5046] mt-2">
              {currentStep.projection_radius_feet >= 4
                ? 'Expansive sillage cloud perceptible to nearby companions.'
                : 'Intimate second-skin scent bubble requiring close proximity.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB]">
            <span className="text-[10px] font-mono-lab uppercase text-[#7A6F66]">Remaining Intensity</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-mono-lab font-bold text-amber-900">
                {currentStep.remaining_intensity_pct}%
              </span>
              <span className="text-xs text-[#7A6F66]">Molecular Density</span>
            </div>
            <p className="text-[11px] text-[#5A5046] mt-2">
              Base fixatives (resins, woods, musks) preserve the heart structure.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB]">
            <span className="text-[10px] font-mono-lab uppercase text-[#7A6F66]">Active Dominant Accords</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentStep.active_accords.map((accord) => (
                <span key={accord} className="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-xs text-amber-900 font-mono-lab font-medium">
                  {accord}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Modifiers Panel */}
        <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-[#E3DACB] flex flex-wrap items-center justify-between gap-4">
          {/* Substrate Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A5046] font-mono-lab flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-700" /> Substrate:
            </span>
            {(['skin', 'clothing', 'hair'] as const).map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSubstrate(sub)}
                className={`px-3 py-1 rounded-xl text-xs capitalize transition cursor-pointer ${
                  substrate === sub
                    ? 'bg-amber-200 border border-amber-400 text-amber-950 font-semibold'
                    : 'bg-white text-[#5A5046] hover:bg-[#FAF7F2] border border-[#E3DACB]'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Location Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5A5046] font-mono-lab flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-rose-700" /> Pulse Point:
            </span>
            {(['collarbone', 'wrists', 'neck', 'chest'] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setLocation(loc)}
                className={`px-3 py-1 rounded-xl text-xs capitalize transition cursor-pointer ${
                  location === loc
                    ? 'bg-rose-100 border border-rose-400 text-rose-950 font-semibold'
                    : 'bg-white text-[#5A5046] hover:bg-[#FAF7F2] border border-[#E3DACB]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Spray Ratio */}
          <div className="flex items-center gap-2 text-xs font-mono-lab text-[#5A5046]">
            <span>Sprays:</span>
            <button
              type="button"
              onClick={() => setSpraysA(Math.max(1, spraysA - 1))}
              className="px-2 py-0.5 rounded bg-white border border-[#E3DACB] hover:bg-[#FAF7F2] text-[#1A1613] font-bold"
            >
              -
            </button>
            <span className="text-amber-900 font-bold">{spraysA} A</span>
            <button
              type="button"
              onClick={() => setSpraysA(Math.min(5, spraysA + 1))}
              className="px-2 py-0.5 rounded bg-white border border-[#E3DACB] hover:bg-[#FAF7F2] text-[#1A1613] font-bold"
            >
              +
            </button>
            <span className="text-[#C4B9A9]">/</span>
            <button
              type="button"
              onClick={() => setSpraysB(Math.max(1, spraysB - 1))}
              className="px-2 py-0.5 rounded bg-white border border-[#E3DACB] hover:bg-[#FAF7F2] text-[#1A1613] font-bold"
            >
              -
            </button>
            <span className="text-rose-900 font-bold">{spraysB} B</span>
            <button
              type="button"
              onClick={() => setSpraysB(Math.min(5, spraysB + 1))}
              className="px-2 py-0.5 rounded bg-white border border-[#E3DACB] hover:bg-[#FAF7F2] text-[#1A1613] font-bold"
            >
              +
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
