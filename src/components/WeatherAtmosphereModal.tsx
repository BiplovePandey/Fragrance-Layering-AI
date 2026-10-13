import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [temp, setTemp] = useState<number>(currentWeather.temperature_c);
  const [humidity, setHumidity] = useState<number>(currentWeather.humidity_pct);
  const [selectedCondition, setSelectedCondition] = useState<WeatherCondition['condition']>(currentWeather.condition);
  const [timeOfDay, setTimeOfDay] = useState<WeatherCondition['time_of_day']>(currentWeather.time_of_day);

  // Sync internal state when modal opens or currentWeather updates
  useEffect(() => {
    if (isOpen) {
      setTemp(currentWeather.temperature_c);
      setHumidity(currentWeather.humidity_pct);
      setSelectedCondition(currentWeather.condition);
      setTimeOfDay(currentWeather.time_of_day);
    }
  }, [isOpen, currentWeather]);

  // Handle ESC key to dismiss modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

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
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="atmospheric-lab-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop overlay - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-label="Close modal backdrop"
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#13110E] border border-amber-600/30 text-stone-200 shadow-2xl overflow-hidden z-10 my-auto"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header (Sticky top so close button is always visible) */}
            <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-white/[0.08] bg-[#13110E]/95 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="atmospheric-lab-title" className="font-serif text-xl sm:text-2xl font-medium text-stone-100">
                    Atmospheric Laboratory
                  </h2>
                  <p className="text-xs text-stone-400">
                    Simulate environmental volatility, humidity &amp; temperature mechanics
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="close-weather-modal-btn"
                onClick={onClose}
                aria-label="Close atmospheric laboratory"
                className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-stone-300 hover:text-white border border-white/10 hover:border-amber-500/40 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6 overscroll-contain">
              {/* Presets Grid */}
              <div>
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
            </div>

            {/* Action Buttons (Sticky bottom so always accessible) */}
            <div className="shrink-0 p-4 sm:p-6 pt-4 border-t border-white/[0.08] bg-[#13110E]/95 backdrop-blur-md flex items-center justify-between gap-3 sticky bottom-0 z-20">
              <button
                type="button"
                id="cancel-weather-modal-btn"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-white/[0.05] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="apply-weather-modal-btn"
                onClick={handleApplyCustom}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-500 hover:to-rose-600 text-stone-100 text-xs font-semibold shadow-lg hover:brightness-110 transition cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Calibrate &amp; Close</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
