import React from 'react';
import {
  Thermometer,
  Droplets,
  CloudSun,
  Wind,
  Calendar,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { WeatherCondition } from '../../types.js';

interface AtmosphericSensorStripProps {
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
}

export const AtmosphericSensorStrip: React.FC<AtmosphericSensorStripProps> = ({
  weather,
  onOpenWeatherModal
}) => {
  const temp = weather.temperature_c;
  const humidity = weather.humidity_pct;
  const condition = weather.condition || 'temperate';

  // Physical evaporation model description based on weatherEngine principles
  let evaporationExplanation = '';
  let resonanceAffinity = '';

  if (temp >= 30) {
    evaporationExplanation = `High ambient temperature (${temp}°C) accelerates volatile molecular evaporation. Light citrus and floral top notes flash quickly; deep woods, earthy petrichor, and botanical attars maintain molecular stability.`;
    resonanceAffinity = 'Airy Vetiver, Clean White Musk, Mitti Attar & Ruh Khus';
  } else if (temp <= 18) {
    evaporationExplanation = `Cool ambient temperature (${temp}°C) compresses light volatile dispersion. Dense resins, amber, aged Mysore sandalwood, and warm spices blossom with radiant body heat without overwhelming close spaces.`;
    resonanceAffinity = 'Mysore Sandalwood, Aged Amber, Cardamom & Assam Oud';
  } else {
    evaporationExplanation = `Temperate equilibrium (${temp}°C) provides balanced volatility. Fragrance pyramids transition linearly from top to heart and base without thermal distortion.`;
    resonanceAffinity = 'Full-Pyramid Florals, Chypres, Green Aromatics & Soft Woods';
  }

  if (humidity >= 70) {
    evaporationExplanation += ` Elevated humidity (${humidity}%) creates a dense moisture buffer that holds aquatic, earthy petrichor, and white floral vapors suspended in your immediate sillage.`;
  } else if (humidity <= 40) {
    evaporationExplanation += ` Dry air (${humidity}%) promotes rapid diffusion into the atmosphere, benefiting from richer concentration bases (Extrait or Attar).`;
  }

  return (
    <section
      id="wear-today-atmosphere"
      aria-label="Chapter III: The Atmosphere"
      className="rounded-3xl p-6 sm:p-8 bg-[#14110E] border border-amber-900/30 text-stone-200 shadow-xl space-y-5"
    >
      {/* Eyebrow & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
            Chapter III &bull; The Atmosphere
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-100 font-normal">
            Today&apos;s Atmospheric Physics
          </h2>
        </div>

        {/* Scientific Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700/60 text-[11px] font-mono text-stone-400">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>MODELLED WEATHER RESONANCE</span>
        </div>
      </div>

      {/* Cinematic Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Temperature */}
        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Temperature
            </div>
            <div className="text-base sm:text-lg font-serif font-medium text-stone-100">
              {temp}&deg;C
            </div>
          </div>
        </div>

        {/* Metric 2: Humidity */}
        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Humidity
            </div>
            <div className="text-base sm:text-lg font-serif font-medium text-stone-100">
              {humidity}%
            </div>
          </div>
        </div>

        {/* Metric 3: Season & Condition */}
        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Atmosphere
            </div>
            <div className="text-sm font-medium text-stone-200 truncate capitalize">
              {condition.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        {/* Metric 4: Astronomical Season */}
        <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Season
            </div>
            <div className="text-sm font-medium text-stone-200">
              {weather.season || 'Monsoon'}
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Volatility Narrative & Affinity */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/60 border border-amber-900/20 space-y-3">
        <div className="flex items-start gap-3">
          <Wind className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-medium block">
              Atmospheric Evaporation &amp; Sillage Dynamics
            </span>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {evaporationExplanation}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-mono text-[11px] uppercase">
              Natural Affinities Today:
            </span>
            <span className="text-amber-200 font-serif font-medium">
              {resonanceAffinity}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenWeatherModal}
            className="text-stone-400 hover:text-amber-300 transition text-[11px] font-mono underline cursor-pointer"
          >
            Adjust Sensor Conditions &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};
