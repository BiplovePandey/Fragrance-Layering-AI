import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ArrowRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import { Fragrance } from '../../types.js';
import { extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import { awardXP } from '../../services/gamificationEngine.js';

interface AcademyLessonNoseTrainerProps {
  allFragrances: Fragrance[];
}

interface ChallengeQuestion {
  id: string;
  prompt: string;
  targetDimension: 'freshness' | 'woody' | 'earthy_clay' | 'warm_resinous_spices';
  dimensionLabel: string;
  fragAIdx: number;
  fragBIdx: number;
  explanation: string;
}

export const AcademyLessonNoseTrainer: React.FC<AcademyLessonNoseTrainerProps> = ({
  allFragrances,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Pick pairs of fragrances from the catalogue
  const fragA = allFragrances[currentIdx * 2] || allFragrances[0];
  const fragB = allFragrances[currentIdx * 2 + 1] || allFragrances[1] || allFragrances[0];

  const vecA = extractFragranceVector8D(fragA);
  const vecB = extractFragranceVector8D(fragB);

  // Challenges list
  const challenges: ChallengeQuestion[] = [
    {
      id: 'q1',
      prompt: 'Which specimen possesses the higher Woody & Heartwood Vector intensity?',
      targetDimension: 'woody',
      dimensionLabel: 'Woody & Heartwood Dimension',
      fragAIdx: 0,
      fragBIdx: 1,
      explanation:
        'Heartwood density depends on Mysore sandalwood, Himalayan cedar, and aged vetiver rhizomes in the base formulation.',
    },
    {
      id: 'q2',
      prompt: 'Which specimen exhibits the higher Earth & Alluvial Clay (Mitti) accord?',
      targetDimension: 'earthy_clay',
      dimensionLabel: 'Earth & Clay Dimension',
      fragAIdx: 2,
      fragBIdx: 3,
      explanation:
        'Geosmin, baked Gangetic mud, and hydro-distilled Ruh Khus roots contribute to high Earth & Clay coordinates.',
    },
    {
      id: 'q3',
      prompt: 'Which specimen radiates higher Solar Freshness & Citrus Volatility?',
      targetDimension: 'freshness',
      dimensionLabel: 'Freshness Dimension',
      fragAIdx: 4,
      fragBIdx: 5,
      explanation:
        'Limonene and linalool terpene concentrations in bergamot and neroli generate rapid vapor diffusion and higher freshness scores.',
    },
    {
      id: 'q4',
      prompt: 'Which specimen carries deeper Warm Resinous Spices & Amber depth?',
      targetDimension: 'warm_resinous_spices',
      dimensionLabel: 'Warm Resinous Spices Dimension',
      fragAIdx: 6,
      fragBIdx: 7,
      explanation:
        'Kashmiri saffron, warm green cardamom pods, and balsamic myrrh create elevated warm-spice vector values.',
    },
  ];

  const activeChallenge = challenges[currentIdx % challenges.length];

  const valueA = vecA[activeChallenge.targetDimension];
  const valueB = vecB[activeChallenge.targetDimension];
  const correctAnswer: 'A' | 'B' = valueA >= valueB ? 'A' : 'B';

  const handleSelectAnswer = (choice: 'A' | 'B') => {
    if (showResult) return;
    setSelectedAnswer(choice);
    setShowResult(true);

    if (choice === correctAnswer) {
      setScore((s) => s + 1);
      awardXP(25, 'nose_trainer_correct_answer');
    }
  };

  const handleNextChallenge = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIdx((prev) => (prev + 1) % challenges.length);
  };

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-10 text-stone-200 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Chamber 15 &bull; Sensory Calibration
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
              [ SENSORY GYM &bull; +25 XP PER DISCOVERY ]
            </span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-1">
            Developing Your Nose: The Olfactory Gym
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Train your mental nose by comparing real specimens from the Atelier. Predict which composition carries greater botanical weight in a specific dimension.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 font-mono text-xs text-amber-300 flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>Challenges Solved: {score}</span>
        </div>
      </div>

      {/* Active Challenge Prompt */}
      <div className="p-6 rounded-2xl bg-[#14110E] border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold">
            Sensory Challenge {currentIdx + 1} of {challenges.length}
          </span>
          <span className="text-xs font-mono text-stone-400">
            Target Dimension: <strong className="text-amber-300">{activeChallenge.dimensionLabel}</strong>
          </span>
        </div>

        <h3 className="font-serif text-xl sm:text-2xl text-[#F8F5EE] font-medium leading-snug">
          {activeChallenge.prompt}
        </h3>
      </div>

      {/* Dual Candidate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Candidate A */}
        <div
          onClick={() => handleSelectAnswer('A')}
          className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
            selectedAnswer === 'A'
              ? showResult
                ? correctAnswer === 'A'
                  ? 'border-emerald-400 bg-emerald-950/20'
                  : 'border-red-400 bg-red-950/20'
                : 'border-amber-400 bg-amber-500/10'
              : 'border-white/[0.08] bg-[#14110E] hover:border-amber-500/40 hover:bg-[#1A1613]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-2">
              <span className="text-amber-400 uppercase font-bold">Candidate A</span>
              <span className="text-stone-400">{fragA?.format || 'EDP'}</span>
            </div>
            <span className="text-xs text-stone-400 font-mono block">
              {fragA?.brand_name || fragA?.brand}
            </span>
            <h4 className="font-serif text-2xl text-[#F8F5EE] font-medium mt-0.5">
              {fragA?.name}
            </h4>
            <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
              {fragA?.description || `Rich composition with notes of ${fragA?.top_notes?.join(', ')}.`}
            </p>
          </div>

          {showResult ? (
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
              <span className="text-stone-400">Verified 8D Coordinate:</span>
              <span className="text-amber-300 font-bold text-sm">{valueA}%</span>
            </div>
          ) : (
            <div className="pt-2 text-center text-xs font-mono text-amber-400/90 font-semibold uppercase tracking-wider">
              Select Candidate A
            </div>
          )}
        </div>

        {/* Candidate B */}
        <div
          onClick={() => handleSelectAnswer('B')}
          className={`p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
            selectedAnswer === 'B'
              ? showResult
                ? correctAnswer === 'B'
                  ? 'border-emerald-400 bg-emerald-950/20'
                  : 'border-red-400 bg-red-950/20'
                : 'border-amber-400 bg-amber-500/10'
              : 'border-white/[0.08] bg-[#14110E] hover:border-amber-500/40 hover:bg-[#1A1613]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono mb-2">
              <span className="text-cyan-400 uppercase font-bold">Candidate B</span>
              <span className="text-stone-400">{fragB?.format || 'EDP'}</span>
            </div>
            <span className="text-xs text-stone-400 font-mono block">
              {fragB?.brand_name || fragB?.brand}
            </span>
            <h4 className="font-serif text-2xl text-[#F8F5EE] font-medium mt-0.5">
              {fragB?.name}
            </h4>
            <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
              {fragB?.description || `A refined composition with notes of ${fragB?.top_notes?.join(', ')}.`}
            </p>
          </div>

          {showResult ? (
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-xs">
              <span className="text-stone-400">Verified 8D Coordinate:</span>
              <span className="text-cyan-300 font-bold text-sm">{valueB}%</span>
            </div>
          ) : (
            <div className="pt-2 text-center text-xs font-mono text-cyan-400/90 font-semibold uppercase tracking-wider">
              Select Candidate B
            </div>
          )}
        </div>
      </div>

      {/* Result Explanation Panel */}
      {showResult && (
        <div className="p-6 rounded-2xl bg-[#14110E] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2">
            {selectedAnswer === correctAnswer ? (
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Superb Perception! (+25 Atelier XP Awarded)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>Sensory Calibration Insight:</span>
              </div>
            )}
          </div>

          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            {activeChallenge.explanation}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleNextChallenge}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs font-mono transition flex items-center gap-2 cursor-pointer hover:brightness-110"
            >
              <span>Next Sensory Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
