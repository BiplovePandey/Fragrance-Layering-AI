import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Clock, Droplets, Wind, User, Sliders, ShieldCheck } from 'lucide-react';
import { Fragrance, ScentEvolutionStep, WeatherCondition } from '../../types.js';
import { runScentSimulation } from '../../services/scentSimulation.js';

interface ChordEvolutionTimelineProps {
  fragA: Fragrance;
  fragB: Fragrance;
  spraysA: number;
  spraysB: number;
  weather: WeatherCondition;
}

export const ChordEvolutionTimeline: React.FC<ChordEvolutionTimelineProps> = ({
  fragA,
  fragB,
  spraysA,
  spraysB,
  weather
}) => {
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [substrate, setSubstrate] = useState<'skin' | 'clothing' | 'hair'>('skin');
  const [location, setLocation] = useState<'collarbone' | 'wrists' | 'neck' | 'chest'>('collarbone');

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

  const currentStep: ScentEvolutionStep = evolutionSteps[stepIdx] || evolutionSteps[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#14100C]/90 border border-stone-800 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Temporal Vaporization Simulator (Modelled Drydown)</span>
          </div>
          <h3 className="font-serif text-2xl font-medium text-stone-100 mt-1">
            Chord Evaporation &amp; Sillage Evolution
          </h3>
          <p className="text-xs text-stone-400 font-sans mt-0.5">
            Computational simulation of how both fragrances co-evaporate over time under today&apos;s atmospheric temperature and humidity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-stone-400">Current Phase:</span>
          <span className="px-3 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-bold">
            {currentStep.time_label} &bull; {currentStep.dominant_phase.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Interactive Time Track Scrubber */}
      <div className="space-y-3">
        <input
          type="range"
          min="0"
          max={evolutionSteps.length - 1}
          value={stepIdx}
          onChange={(e) => setStepIdx(Number(e.target.value))}
          className="w-full accent-[#D4AF37] cursor-pointer h-2.5 bg-stone-900 rounded-lg appearance-none border border-stone-800"
          aria-label="Evaporation timeline step scrubber"
        />

        <div className="flex justify-between text-xs font-mono text-stone-400 px-1">
          {evolutionSteps.map((step, idx) => (
            <button
              key={step.time_label}
              type="button"
              onClick={() => setStepIdx(idx)}
              className={`cursor-pointer transition ${
                stepIdx === idx ? 'text-[#D4AF37] font-bold scale-110' : 'hover:text-stone-200'
              }`}
            >
              {step.time_label}
            </button>
          ))}
        </div>
      </div>

      {/* Evaporation Diagnostics Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Sillage Projection Radius with Visual Halo */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 relative overflow-hidden flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400 block">Sillage Radius</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-teal-300">
                {currentStep.projection_radius_feet} ft
              </span>
              <span className="text-xs text-stone-500 font-mono">Diffusion Bubble</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-sans">
              {currentStep.projection_radius_feet >= 4
                ? 'Wide, radiating projection noticeable to anyone in your immediate orbit.'
                : 'Intimate second-skin scent veil requiring close personal proximity.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-900 flex items-center justify-between text-[10px] font-mono text-teal-400">
            <span>Atmospheric Air Mass</span>
            <span>{weather.temperature_c}°C &bull; {weather.humidity_pct}% RH</span>
          </div>
        </div>

        {/* Molecular Intensity */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400 block">Molecular Substantivity</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
                {currentStep.remaining_intensity_pct}%
              </span>
              <span className="text-xs text-stone-500 font-mono">Skin Density</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-sans">
              Alcohol vehicle completely dispersed; heavy fixative macromolecules anchor the heart accords.
            </p>
          </div>

          <div className="mt-3 w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${currentStep.remaining_intensity_pct}%` }}
            />
          </div>
        </div>

        {/* Active Dominant Accords at this hour */}
        <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-stone-400 block">Diffusing Dominant Accords</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {currentStep.active_accords.map((accord) => (
                <span
                  key={accord}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 font-mono"
                >
                  {accord}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-stone-400 mt-3 font-sans line-clamp-2">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Dynamic Substrate & Pulse Modifiers */}
      <div className="p-4 rounded-2xl bg-stone-950/40 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Substrate Selector */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-400" /> Substrate:
          </span>
          {(['skin', 'clothing', 'hair'] as const).map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => setSubstrate(sub)}
              className={`px-3 py-1 rounded-xl uppercase tracking-wider transition cursor-pointer ${
                substrate === sub
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-rose-400" /> Pulse Zone:
          </span>
          {(['collarbone', 'wrists', 'neck', 'chest'] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              className={`px-3 py-1 rounded-xl uppercase tracking-wider transition cursor-pointer ${
                location === loc
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300 font-bold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Scientific honesty disclaimer */}
      <div className="pt-2 text-[10px] font-mono text-stone-500 text-center">
        Simulated Chord Evolution &bull; Mathematical vapor pressure decay model accounting for ambient temperature, humidity, and substrate retention.
      </div>
    </div>
  );
};
