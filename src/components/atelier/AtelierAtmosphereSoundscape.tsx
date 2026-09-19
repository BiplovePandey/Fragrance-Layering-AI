import React from 'react';
import { motion } from 'motion/react';
import {
  CloudSun,
  Volume2,
  Play,
  Pause,
  Check,
  Compass,
  Wind
} from 'lucide-react';
import { WeatherCondition, UserGamification } from '../../types.js';
import { ScentFamilyAtmosphere, ATMOSPHERE_PROFILES } from '../AtmosphericFragranceCanvas.js';
import { ambientAudioEngine, SOUNDSCAPE_PRESETS, SoundscapeType } from '../../services/ambientAudioEngine.js';
import { GlassSurface } from '../ui/GlassSurface.js';

interface AtelierAtmosphereSoundscapeProps {
  weather: WeatherCondition;
  gamification: UserGamification;
  currentAtmosphere: ScentFamilyAtmosphere;
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  onOpenWeatherModal: () => void;
  activeSoundscape: SoundscapeType;
  isAudioPlaying: boolean;
  audioVolume: number;
  onToggleSound: (presetId?: SoundscapeType) => void;
}

export const AtelierAtmosphereSoundscape: React.FC<AtelierAtmosphereSoundscapeProps> = ({
  weather,
  gamification,
  currentAtmosphere,
  onSetAtmosphere,
  onOpenWeatherModal,
  activeSoundscape,
  isAudioPlaying,
  audioVolume,
  onToggleSound
}) => {
  const activeProfile = ATMOSPHERE_PROFILES[currentAtmosphere];

  return (
    <section className="relative my-8 py-2">
      {/* Background Room Tone */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[360px] bg-gradient-to-r from-amber-400/5 via-teal-400/5 to-rose-400/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <GlassSurface
        surface="atelier"
        radius="luxury"
        className="p-6 sm:p-10 space-y-7"
      >
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8DFD3]/75 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-mono mb-2 shadow-2xs">
              <CloudSun className="w-3.5 h-3.5 text-amber-700" />
              <span>CHAPTER IV &bull; THE AIR AROUND THE SCENT</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#1A1613] tracking-tight">
              Acoustic Ambiance &amp; Meteorology
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5046] mt-1 max-w-xl leading-relaxed">
              Harmonize room acoustics with authentic Kannauj copper-deg hydrodistillation soundscapes and live volatility factors.
            </p>
          </div>

          {/* Master Audio Instrument Toggle */}
          <button
            type="button"
            onClick={() => onToggleSound()}
            className={`px-4 py-2.5 rounded-full border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs self-start sm:self-center select-none ${
              isAudioPlaying
                ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-semibold'
                : 'bg-white border-[#E3DACB] text-[#3D352E] hover:bg-[#FAF8F5] hover:border-amber-300'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-amber-700 animate-pulse rounded-full" />
                  <span className="w-0.5 h-3 bg-amber-700 animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-2.5 bg-amber-700 animate-pulse delay-150 rounded-full" />
                </span>
                <span className="tracking-tight">{SOUNDSCAPE_PRESETS.find((s) => s.id === activeSoundscape)?.title || 'Ambiance Live'}</span>
                <Pause className="w-3.5 h-3.5 text-amber-800 ml-0.5" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-700" />
                <span>Play Soundscape</span>
              </>
            )}
          </button>
        </div>

        {/* 2-Column Ambiance Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Precision Brass Meteorological Instruments & Accord Matrix (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* Precision Brass Meteorological Instruments */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-amber-800" />
                  <span className="font-brand text-[10px] uppercase tracking-[0.2em] text-[#7A6F66] font-semibold">
                    Atmospheric Telemetry
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onOpenWeatherModal}
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 cursor-pointer"
                >
                  Recalibrate
                </button>
              </div>

              {/* Four Precision Instrument Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white border border-[#E8DFD3] text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A7E74] block">Temperature</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-[#1A1613] mt-0.5 block">
                    {weather.temperature_c}°C
                  </span>
                  <span className="text-[9px] text-[#7A6F66] font-sans">Ambient Dry-Bulb</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8DFD3] text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A7E74] block">Relative Humidity</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-teal-800 mt-0.5 block">
                    {weather.humidity_pct}%
                  </span>
                  <span className="text-[9px] text-[#7A6F66] font-sans">Moisture Gradient</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8DFD3] text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A7E74] block">Climate Season</span>
                  <span className="font-serif text-sm sm:text-base font-medium text-[#1A1613] mt-0.5 block truncate">
                    {weather.season}
                  </span>
                  <span className="text-[9px] text-[#7A6F66] font-sans capitalize">{weather.time_of_day}</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8DFD3] text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A7E74] block">Volatility Flux</span>
                  <span className="font-mono text-base sm:text-lg font-bold text-amber-800 mt-0.5 block">
                    {weather.perceived_modifiers.intensityFactor}x
                  </span>
                  <span className="text-[9px] text-[#7A6F66] font-sans">Evaporation Speed</span>
                </div>
              </div>
            </div>

            {/* Accord Light Atmosphere Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-brand text-[10px] uppercase tracking-[0.2em] text-[#7A6F66] font-semibold">
                  Atelier Light Nuances
                </span>
                <span className="font-mono text-[10px] text-amber-800 font-semibold">
                  {activeProfile?.name || 'Signature Accord'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['earthy', 'khus', 'oud', 'alpine', 'rose', 'citrus'] as ScentFamilyAtmosphere[]).map((key) => {
                  const profile = ATMOSPHERE_PROFILES[key];
                  const isSelected = currentAtmosphere === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSetAtmosphere(key)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-white border-amber-400 shadow-2xs'
                          : 'bg-[#FAF8F5] border-[#E8DFD3] hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-2xs transition-transform group-hover:scale-110"
                        style={{ backgroundColor: profile.accentColor }}
                      />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-[#1A1613] block truncate">
                          {profile.name.split('&')[0].trim()}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3 h-3 text-amber-700 ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gamification Rank Footer */}
            <div className="pt-2 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs text-[#7A6F66]">
              <span>Alchemist Title:</span>
              <span className="font-mono font-semibold text-amber-800">
                {gamification.title} ({gamification.xp} XP)
              </span>
            </div>
          </div>

          {/* Right Column: Authentic Kannauj Deg Acoustic Player (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] flex flex-col justify-between space-y-4 shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E8DFD3] pb-2">
                <span className="font-brand text-[10px] uppercase tracking-[0.2em] text-[#7A6F66] font-semibold">
                  Kannauj Deg Soundscapes
                </span>
                <span className="font-mono text-[9px] text-[#8A7E74]">Acoustic Synthesis</span>
              </div>

              <div className="space-y-2">
                {SOUNDSCAPE_PRESETS.map((preset) => {
                  const isCurrent = activeSoundscape === preset.id && isAudioPlaying;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => onToggleSound(preset.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                        isCurrent
                          ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-medium shadow-2xs'
                          : 'bg-white border-[#E8DFD3] hover:bg-[#FAF8F5] text-[#3D352E]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{preset.icon}</span>
                        <div className="truncate">
                          <span className="text-xs font-semibold text-[#1A1613] block truncate">
                            {preset.title}
                          </span>
                          <span className="text-[10px] text-[#6B6056] truncate block">
                            {preset.description}
                          </span>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono text-[9px] uppercase shrink-0 font-bold">
                          Live
                        </span>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-[#8A7E74] hover:text-[#1A1613] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sound Volume Slider */}
            <div className="pt-3 border-t border-[#E8DFD3]">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#7A6F66] mb-2">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Instrument Volume</span>
                </span>
                <span>{Math.round(audioVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioVolume}
                onChange={(e) => ambientAudioEngine.setVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer h-2 bg-[#E8DFD3] rounded-lg appearance-none"
              />
            </div>
          </div>
        </div>
      </GlassSurface>
    </section>
  );
};
