import React, { useState } from 'react';
import { CloudSun, X, Wind, Droplets, Thermometer, Sparkles, Check } from 'lucide-react';
import { WeatherCondition } from '../types.js';
import { WEATHER_PRESETS, updateWeatherCondition } from '../services/weatherEngine.js';

interface WeatherAtmosphereModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeather: WeatherCondition;
  onUpdateWeather: (w: WeatherCondition) => void;
}

export const WeatherAtmosphereModal: React.FC<WeatherAtmosphereModalProps> = ({
  isOpen,
  onClose,
  currentWeather,
  onUpdateWeather
}) => {
  if (!isOpen) return null;

  const [temp, setTemp] = useState<number>(currentWeather.temperature_c);
  const [humidity, setHumidity] = useState<number>(currentWeather.humidity_pct);
  const [selectedCondition, setSelectedCondition] = useState<WeatherCondition['condition']>(currentWeather.condition);
  const [timeOfDay, setTimeOfDay] = useState<WeatherCondition['time_of_day']>(currentWeather.time_of_day);

  const handleApplyPreset = (preset: typeof WEATHER_PRESETS[0]) => {
    setTemp(preset.temp);
    setHumidity(preset.humidity);
    setSelectedCondition(preset.id);
    const updated = updateWeatherCondition(preset.temp, preset.humidity, preset.id, timeOfDay);
    onUpdateWeather(updated);
  };

  const handleApplyCustom = () => {
    const updated = updateWeatherCondition(temp, humidity, selectedCondition, timeOfDay);
    onUpdateWeather(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#13110E] border border-amber-600/30 p-6 sm:p-8 text-stone-200 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-medium text-stone-100">
                Atmospheric Laboratory
              </h2>
              <p className="text-xs text-stone-400">
                Simulate environmental volatility, humidity &amp; temperature mechanics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="my-6">
          <label className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-3">
            Atmospheric Climate Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {WEATHER_PRESETS.map((preset) => {
              const isSelected = selectedCondition === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/60 shadow-xs'
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{preset.icon}</span>
                    <div>
                      <span className="text-xs font-medium text-stone-200 block">
                        {preset.label.split('(')[0].trim()}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {preset.temp}°C • {preset.humidity}% Hum.
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature:
              </span>
              <span className="font-mono text-amber-300 font-bold">{temp}°C</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span>5°C (Chilled)</span>
              <span>24°C (Temperate)</span>
              <span>45°C (Heatwave)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-stone-300">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Relative Humidity:
              </span>
              <span className="font-mono text-cyan-300 font-bold">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
              <span>20% (Dry Air)</span>
              <span>60% (Optimal)</span>
              <span>95% (Torrential Monsoon)</span>
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="text-xs text-stone-300 block mb-2">Time of Day:</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeOfDay(t)}
                  className={`py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                    timeOfDay === t
                      ? 'bg-amber-500/25 border-amber-500/60 text-amber-200'
                      : 'bg-white/[0.03] border-white/[0.08] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCustom}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 text-stone-100 text-xs font-semibold shadow-lg hover:brightness-110 transition cursor-pointer"
          >
            Calibrate Engine
          </button>
        </div>
      </div>
    </div>
  );
};
