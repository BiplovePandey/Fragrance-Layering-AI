import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bookmark, CheckCircle2, Thermometer, Volume2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { MotionButton } from '../../motion/components.js';
import { deriveChordPoeticName } from './LaboratoryAtmosphere.js';

interface HarmonicScoreInstrumentProps {
  fragA: Fragrance;
  fragB: Fragrance;
  score: number;
  explanation: string;
  weatherFactor: number;
  weather: WeatherCondition;
  applicationRitual: {
    baseAnchor: string;
    sparkTop: string;
    waitTime: string;
    recommendedRatio: string;
  };
  onSaveChord: () => void;
  isSaved: boolean;
  onWearChord?: () => void;
  hasWornToday?: boolean;
}

export const HarmonicScoreInstrument: React.FC<HarmonicScoreInstrumentProps> = ({
  fragA,
  fragB,
  score,
  explanation,
  weatherFactor,
  weather,
  applicationRitual,
  onSaveChord,
  isSaved,
  onWearChord,
  hasWornToday
}) => {
  const chordName = deriveChordPoeticName(fragA, fragB);
  const isHarmonic = score >= 85;
  const isTension = score >= 70 && score < 85;

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-[#14100C]/90 border border-stone-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col justify-between space-y-6">
      {/* Top Instrument Bezel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-[11px] font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ALCHEMICAL CHORD EVALUATION</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-medium text-stone-100 tracking-tight">
            {chordName}
          </h2>
          <p className="text-xs text-amber-200/80 font-mono mt-0.5">
            {fragA.name} &bull; {fragB.name}
          </p>
        </div>

        {/* Physical Brass Harmony Instrument */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none">
            {/* Outer Physical Brass Instrument Bezel */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              {/* Outer Engraved Brass Ring */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#C59A3F"
                strokeWidth="0.8"
                strokeOpacity="0.45"
              />
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="#16120E"
                stroke="#45382A"
                strokeWidth="1.2"
              />

              {/* Fine Circular Degree Tick Marks (Antique Alchemical Balance) */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const isQuarter = i % 6 === 0;
                const r1 = 40;
                const r2 = isQuarter ? 35 : 37.5;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={50 + r1 * Math.cos(rad)}
                    y1={50 + r1 * Math.sin(rad)}
                    x2={50 + r2 * Math.cos(rad)}
                    y2={50 + r2 * Math.sin(rad)}
                    stroke="#D4AF37"
                    strokeWidth={isQuarter ? '1' : '0.5'}
                    strokeOpacity={isQuarter ? '0.7' : '0.35'}
                  />
                );
              })}

              {/* Subtly Responding Calibrated Brass Arc (Never neon) */}
              {(() => {
                const radius = 37;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
                return (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeOpacity="0.85"
                    transform="rotate(-90 50 50)"
                  />
                );
              })()}

              {/* Inner Concentric Rim */}
              <circle
                cx="50"
                cy="50"
                r="29"
                fill="none"
                stroke="#8A7350"
                strokeWidth="0.6"
                strokeOpacity="0.4"
              />
            </svg>

            {/* Central Precision Inscription */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-lg sm:text-xl font-semibold text-[#F7F4EF] tracking-tight leading-none">
                {score}%
              </span>
              <span className="text-[7.5px] font-mono tracking-[0.22em] text-[#C59A3F] uppercase mt-0.5 leading-none">
                Harmony
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rationale in Human Language */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400/90 font-semibold">
          Why This Chord Works
        </h4>
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          {explanation}
        </p>
      </div>

      {/* Application Protocol Ritual */}
      <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-800">
          <span className="text-[9px] font-mono text-stone-400 uppercase block">1. Base Anchor (Pulse Point)</span>
          <span className="font-semibold text-amber-300 mt-0.5 block truncate">{applicationRitual.baseAnchor}</span>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Apply to warm skin barrier</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-800">
          <span className="text-[9px] font-mono text-stone-400 uppercase block">2. Wait Interval</span>
          <span className="font-semibold text-stone-200 mt-0.5 block">{applicationRitual.waitTime}</span>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Allow alcohol flash-off</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-900/50 border border-stone-800">
          <span className="text-[9px] font-mono text-stone-400 uppercase block">3. Spark Diffusion</span>
          <span className="font-semibold text-rose-300 mt-0.5 block truncate">{applicationRitual.sparkTop}</span>
          <span className="text-[10px] text-stone-500 mt-0.5 block">Mist over collarbone</span>
        </div>
      </div>

      {/* Atmospheric Resonance & Actions */}
      <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-stone-400 font-mono">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <span>Atmosphere Resonance: <strong className="text-amber-300">{weatherFactor}%</strong> ({weather.temperature_c}°C &bull; {weather.season})</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onWearChord && (
            <MotionButton
              variant="tactile"
              onClick={onWearChord}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
                hasWornToday
                  ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-900 hover:bg-stone-800 border-amber-500/30 text-amber-200'
              }`}
            >
              {hasWornToday ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Worn Today (+40 XP)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wear Chord Today</span>
                </>
              )}
            </MotionButton>
          )}

          <MotionButton
            variant="primary"
            onClick={onSaveChord}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                <span>Saved to Vault!</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-stone-950" />
                <span>Save Scent Chord (+50 XP)</span>
              </>
            )}
          </MotionButton>
        </div>
      </div>

      {/* Scientific honesty footnote */}
      <div className="pt-3 border-t border-stone-800/80 text-[10px] font-mono text-stone-500 text-center">
        Algorithmic Harmony Index &bull; Mathematical accord fit (0–100) simulated from note pyramids, evaporation curves, and fixative balance.
      </div>
    </div>
  );
};
