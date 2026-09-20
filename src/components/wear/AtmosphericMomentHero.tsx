import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CloudSun,
  Sparkles,
  ArrowDown,
  Volume2,
  VolumeX,
  Compass,
  Layers,
  Calendar,
  Clock,
  Droplets,
  Wind
} from 'lucide-react';
import { WeatherCondition, Fragrance } from '../../types.js';
import { ambientAudioEngine, SOUNDSCAPE_PRESETS, SoundscapeType } from '../../services/ambientAudioEngine.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { ScentMist } from '../ui/ScentMist.js';

interface AtmosphericMomentHeroProps {
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  onDiscoverClick: () => void;
  isWardrobeOnly: boolean;
  onToggleWardrobeOnly: (val: boolean) => void;
  totalInCabinet: number;
  fragrancePreview?: Fragrance;
}

export const AtmosphericMomentHero: React.FC<AtmosphericMomentHeroProps> = ({
  weather,
  onOpenWeatherModal,
  onDiscoverClick,
  isWardrobeOnly,
  onToggleWardrobeOnly,
  totalInCabinet,
  fragrancePreview
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [currentDateString, setCurrentDateString] = useState<string>('');
  const [currentTimeString, setCurrentTimeString] = useState<string>('');

  // Audio Engine State
  const [isPlayingAudio, setIsPlayingAudio] = useState(ambientAudioEngine.isPlaying());
  const [activeSoundscape, setActiveSoundscape] = useState<SoundscapeType>(ambientAudioEngine.getActiveSoundscape());
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  useEffect(() => {
    const unsub = ambientAudioEngine.subscribe(() => {
      setIsPlayingAudio(ambientAudioEngine.isPlaying());
      setActiveSoundscape(ambientAudioEngine.getActiveSoundscape());
    });
    return unsub;
  }, []);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateString(
        now.toLocaleDateString(undefined, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
      setCurrentTimeString(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    if (isPlayingAudio) {
      ambientAudioEngine.stopSoundscape();
    } else {
      // Pick soundscape best matching weather
      const condition = weather.condition || '';
      let target: SoundscapeType = 'amber_hearth';
      if (condition.includes('rain') || condition.includes('monsoon') || weather.humidity_pct >= 70) {
        target = 'monsoon_deg';
      } else if (weather.time_of_day === 'Evening' || weather.time_of_day === 'Night') {
        target = 'temple_breeze';
      }
      ambientAudioEngine.startSoundscape(target);
    }
  };

  const handleSoundscapeSelect = (id: SoundscapeType) => {
    if (id === 'none') {
      ambientAudioEngine.stopSoundscape();
    } else {
      ambientAudioEngine.startSoundscape(id);
    }
    setShowAudioMenu(false);
  };

  // Atmospheric aura styling derived from current weather
  const isRain = weather.condition?.includes('rain') || weather.condition?.includes('monsoon') || weather.humidity_pct >= 75;
  const isCold = weather.temperature_c <= 18;
  const isHot = weather.temperature_c >= 30;

  const atmosphereTheme = isRain
    ? {
        name: 'Monsoon Mist & Petrichor',
        tagline: 'Cool damp air suspending heavy earthy and floral molecules',
        glow: 'from-teal-950/40 via-[#131718] to-[#0D1011]',
        border: 'border-teal-700/30',
        badgeBg: 'bg-teal-950/70 border-teal-500/30 text-teal-200',
        mistColor: 'rgba(45, 212, 191, 0.25)',
        iconColor: 'text-teal-400'
      }
    : isCold
    ? {
        name: 'Crisp Amber Hearth',
        tagline: 'Dense cold air calling for warm resinous anchors and spices',
        glow: 'from-[#24160E]/50 via-[#17120E] to-[#0F0C0A]',
        border: 'border-amber-700/30',
        badgeBg: 'bg-amber-950/70 border-amber-500/30 text-amber-200',
        mistColor: 'rgba(217, 119, 6, 0.25)',
        iconColor: 'text-amber-400'
      }
    : isHot
    ? {
        name: 'High Summer Solar Radiance',
        tagline: 'Thermal currents demanding airy botanical freshness and petrichor',
        glow: 'from-[#291C08]/45 via-[#18130B] to-[#100D08]',
        border: 'border-yellow-600/30',
        badgeBg: 'bg-amber-950/70 border-yellow-500/30 text-yellow-200',
        mistColor: 'rgba(245, 158, 11, 0.25)',
        iconColor: 'text-yellow-400'
      }
    : {
        name: 'Temperate Sandalwood Breeze',
        tagline: 'Equilibrium atmosphere allowing nuanced accords to unfold linearly',
        glow: 'from-[#1E1712]/50 via-[#14100D] to-[#0B0907]',
        border: 'border-amber-700/25',
        badgeBg: 'bg-[#221B15] border-amber-600/30 text-amber-200',
        mistColor: 'rgba(202, 138, 4, 0.22)',
        iconColor: 'text-amber-300'
      };

  return (
    <section
      id="wear-today-moment"
      aria-label="Chapter I: The Moment"
      className="relative rounded-3xl overflow-hidden border border-amber-900/30 shadow-2xl bg-gradient-to-b from-[#181410] via-[#120F0C] to-[#0A0907] p-6 sm:p-10 lg:p-12 text-stone-200"
    >
      {/* Dynamic Environmental Glow Layers */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${atmosphereTheme.glow} opacity-80 pointer-events-none transition-colors duration-1000`}
      />

      {/* Atmospheric Vapor & Particle Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <ScentMist
          active={true}
          color={atmosphereTheme.mistColor}
          intensity="subtle"
          className="w-full h-full"
        />
      </div>

      {/* Ambient sound texture subtle ripple */}
      {isPlayingAudio && (
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-radial from-amber-500/10 via-amber-700/5 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
      )}

      {/* Content Container */}
      <div className="relative z-10 flex flex-col gap-8">
        {/* Top Operational Bar: Date & Audio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          {/* Live Date & Time Display */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono text-stone-400 tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
            <span>{currentDateString || 'Saturday, 19 September 2026'}</span>
            <span className="text-stone-600">&bull;</span>
            <Clock className="w-3.5 h-3.5 text-amber-500/80" />
            <span>{currentTimeString || '06:25 AM'}</span>
          </div>

          {/* Soundscape & Audio Consultation Controller */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={handleAudioToggle}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition border ${
                isPlayingAudio
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-sm shadow-amber-950/50'
                  : 'bg-stone-900/70 border-stone-700/40 text-stone-400 hover:text-stone-200'
              }`}
              title={isPlayingAudio ? 'Pause Atelier Soundscape' : 'Awaken Atelier Soundscape'}
              aria-label={isPlayingAudio ? 'Pause Soundscape' : 'Play Soundscape'}
            >
              {isPlayingAudio ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              )}
              <span>{isPlayingAudio ? 'Soundscape Active' : 'Silent Atelier'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              className="p-1.5 rounded-full bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-amber-200 text-xs transition cursor-pointer"
              title="Change Soundscape Environment"
              aria-label="Open soundscape presets"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            {/* Audio Environment Dropdown */}
            {showAudioMenu && (
              <div className="absolute right-0 top-10 w-64 p-2 rounded-2xl bg-[#181410] border border-amber-700/40 shadow-2xl z-50 text-xs space-y-1">
                <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                  Atelier Acoustics
                </span>
                {SOUNDSCAPE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSoundscapeSelect(preset.id)}
                    className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition ${
                      activeSoundscape === preset.id
                        ? 'bg-amber-950/70 text-amber-200 font-medium'
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    }`}
                  >
                    <span>{preset.icon}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs truncate">{preset.title}</div>
                      <div className="text-[10px] text-stone-500 truncate">{preset.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Atmospheric Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border shadow-xs transition-colors duration-500">
              <span className={`w-2 h-2 rounded-full ${atmosphereTheme.iconColor} bg-current animate-ping`} />
              <span className={atmosphereTheme.iconColor}>{atmosphereTheme.name}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-100 tracking-tight leading-[1.1]">
              What Should You Wear Today?
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-amber-200/90 max-w-2xl leading-relaxed">
              &ldquo;Let the atmosphere decide.&rdquo;
            </p>

            <p className="text-sm sm:text-base text-stone-400 max-w-2xl leading-relaxed font-sans">
              A private morning consultation at the master perfumer&apos;s bench. We synthesize current barometric humidity, thermal evaporation rates, your personal scent profile, and today&apos;s occasion into a single definitive accord.
            </p>

            {/* Quick Context Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Weather Plaque Clickable */}
              <button
                type="button"
                onClick={onOpenWeatherModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900/80 border border-stone-700/50 hover:border-amber-500/50 transition cursor-pointer text-left group"
                title="Adjust atmospheric conditions"
              >
                <CloudSun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-stone-300">
                  <strong className="text-stone-100 font-semibold">{weather.temperature_c}°C</strong> &bull; {weather.humidity_pct}% Hum. &bull; {weather.season}
                </span>
              </button>

              {/* Cabinet / Source Mode Selector */}
              <div className="inline-flex items-center rounded-xl bg-stone-900/80 border border-stone-700/50 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => onToggleWardrobeOnly(false)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    !isWardrobeOnly
                      ? 'bg-amber-950/80 text-amber-200 border border-amber-600/30 font-medium'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Entire Universe
                </button>
                <button
                  type="button"
                  onClick={() => onToggleWardrobeOnly(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    isWardrobeOnly
                      ? 'bg-amber-950/80 text-amber-200 border border-amber-600/30 font-medium'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>My Cabinet {totalInCabinet > 0 ? `(${totalInCabinet})` : ''}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Hero Teaser & Primary CTA */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-stone-900/80 to-[#14100C] border border-amber-800/30 text-center w-full max-w-xs shadow-xl space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-radial from-amber-500/20 via-amber-900/10 to-transparent flex items-center justify-center border border-amber-500/30 text-amber-400">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  Atelier Scent Engine
                </span>
                <h3 className="font-serif text-lg text-stone-100 font-medium">
                  {fragrancePreview ? fragrancePreview.name : 'Today’s Olfactory Accord'}
                </h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {fragrancePreview
                    ? `${fragrancePreview.brand_name || fragrancePreview.brand} • ${fragrancePreview.fragrance_family}`
                    : 'Harmonized for your state and today’s atmosphere.'}
                </p>
              </div>

              {/* Primary Ritual CTA */}
              <button
                type="button"
                onClick={onDiscoverClick}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-serif font-semibold text-sm tracking-wide shadow-lg shadow-amber-950/50 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                id="cta-discover-accord"
              >
                <span>DISCOVER TODAY&apos;S ACCORD</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
