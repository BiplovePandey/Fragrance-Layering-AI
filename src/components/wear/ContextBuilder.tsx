import React, { useState } from 'react';
import {
  CloudSun,
  Clock,
  Briefcase,
  Sparkles,
  Shirt,
  Compass,
  Check,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Wind
} from 'lucide-react';
import {
  RawOlfactoryContextInput,
  WeatherCondition,
  Occasion
} from '../../types.js';
import { DAILY_MOOD_PRESETS } from '../../data/moods.js';

interface ContextBuilderProps {
  initialContext: RawOlfactoryContextInput;
  liveWeather: WeatherCondition;
  isWardrobeOnly: boolean;
  onWardrobeOnlyChange: (val: boolean) => void;
  onSubmit: (context: RawOlfactoryContextInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const OCCASIONS: { id: string; label: string; icon: string }[] = [
  { id: 'Casual', label: 'Casual Day', icon: '☕' },
  { id: 'Office', label: 'Office / Focus', icon: '💼' },
  { id: 'Date', label: 'Date Night', icon: '🍷' },
  { id: 'Evening', label: 'Evening Soiree', icon: '🌙' },
  { id: 'Formal', label: 'Formal Gala', icon: '✨' },
  { id: 'Festive / Wedding', label: 'Festive / Wedding', icon: '👑' },
  { id: 'Signature', label: 'Daily Signature', icon: '💎' },
  { id: 'Meditation / Spiritual', label: 'Meditation / Temple', icon: '🪔' }
];

const TIMES_OF_DAY = [
  { id: 'Morning', label: 'Morning', icon: '🌅', desc: '6 AM – 12 PM' },
  { id: 'Afternoon', label: 'Afternoon', icon: '☀️', desc: '12 PM – 5 PM' },
  { id: 'Evening', label: 'Evening', icon: '🌇', desc: '5 PM – 9 PM' },
  { id: 'Night', label: 'Night', icon: '🌙', desc: '9 PM – 4 AM' }
];

const FORMALITIES = [
  { id: 'casual', label: 'Casual' },
  { id: 'smart_casual', label: 'Smart Casual' },
  { id: 'business', label: 'Business' },
  { id: 'formal', label: 'Formal' },
  { id: 'black_tie', label: 'Black Tie' },
  { id: 'traditional', label: 'Traditional / Ethnic' }
];

const OUTFIT_COLORS = [
  { id: 'black', label: 'Black', hex: '#1C1917' },
  { id: 'white', label: 'White / Cream', hex: '#FAF5EE' },
  { id: 'blue', label: 'Navy / Blue', hex: '#1E3A8A' },
  { id: 'earth', label: 'Earth / Brown', hex: '#78350F' },
  { id: 'red', label: 'Burgundy / Red', hex: '#991B1B' },
  { id: 'green', label: 'Emerald / Green', hex: '#065F46' }
];

export const ContextBuilder: React.FC<ContextBuilderProps> = ({
  initialContext,
  liveWeather,
  isWardrobeOnly,
  onWardrobeOnlyChange,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  // Form State
  const [temp, setTemp] = useState<number>(
    initialContext.weather?.temperature_c ?? liveWeather.temperature_c ?? 28
  );
  const [humidity, setHumidity] = useState<number>(
    initialContext.weather?.humidity_pct ?? liveWeather.humidity_pct ?? 65
  );
  const [weatherCondition, setWeatherCondition] = useState<string>(
    initialContext.weather?.condition ?? liveWeather.condition ?? 'temperate'
  );

  const [timeOfDay, setTimeOfDay] = useState<string>(
    initialContext.temporal?.timeOfDay ?? liveWeather.time_of_day ?? 'Evening'
  );

  const [occasion, setOccasion] = useState<string>(
    typeof initialContext.occasion === 'string'
      ? initialContext.occasion
      : initialContext.occasion?.type ?? 'Office'
  );

  const [selectedMoodPresetId, setSelectedMoodPresetId] = useState<string | null>(
    typeof initialContext.mood === 'string'
      ? (DAILY_MOOD_PRESETS.find(p => p.title.toLowerCase() === initialContext.mood || p.id === initialContext.mood)?.id ?? null)
      : initialContext.mood?.primary ?? null
  );

  const [freeformMood, setFreeformMood] = useState<string>(
    typeof initialContext.mood === 'string'
      ? initialContext.mood
      : initialContext.mood?.rawInput ?? ''
  );

  const [formality, setFormality] = useState<string>(
    typeof initialContext.outfit === 'object' ? initialContext.outfit?.formality ?? 'smart_casual' : 'smart_casual'
  );

  const [outfitColor, setOutfitColor] = useState<string>(
    typeof initialContext.outfit === 'object' ? initialContext.outfit?.color ?? '' : ''
  );

  const [outfitStyle, setOutfitStyle] = useState<string>(
    typeof initialContext.outfit === 'object' ? initialContext.outfit?.style ?? '' : ''
  );

  const [isAc, setIsAc] = useState<boolean>(initialContext.environment?.ac ?? true);
  const [isOutdoor, setIsOutdoor] = useState<boolean>(initialContext.environment?.outdoor ?? false);

  // Progressive Disclosure: Additional Context Options
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Sync with live weather
  const handleSyncLiveWeather = () => {
    setTemp(liveWeather.temperature_c);
    setHumidity(liveWeather.humidity_pct);
    setWeatherCondition(liveWeather.condition);
    if (liveWeather.time_of_day) {
      setTimeOfDay(liveWeather.time_of_day);
    }
  };

  // Auto-detect current local time
  const handleDetectCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('Morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('Afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('Evening');
    else setTimeOfDay('Night');
  };

  // Helper text for temperature
  const getTempSensation = (t: number) => {
    if (t <= 16) return 'Cool / Chilly (favors ambery & spicy warmth)';
    if (t <= 24) return 'Mild & Balanced (versatile for all accords)';
    if (t <= 31) return 'Warm (favors woody & aromatic diffusion)';
    return 'Scorching Heat (favors effervescent citrus & aquatic crispness)';
  };

  const getHumiditySensation = (h: number) => {
    if (h <= 40) return 'Crisp & Dry (rapid sillage evaporation)';
    if (h <= 70) return 'Temperate (steady natural olfactory progression)';
    return 'Humid / Monsoon (dense atmospheric moisture fixes notes)';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Compile clean context
    const moodInput = freeformMood.trim()
      ? freeformMood.trim()
      : (selectedMoodPresetId
          ? DAILY_MOOD_PRESETS.find(p => p.id === selectedMoodPresetId)?.title ?? selectedMoodPresetId
          : undefined);

    const compiled: RawOlfactoryContextInput = {
      weather: {
        temperature_c: temp,
        humidity_pct: humidity,
        condition: weatherCondition
      },
      temporal: {
        timeOfDay: timeOfDay as any,
        season: liveWeather.season
      },
      occasion,
      mood: moodInput,
      outfit: {
        formality: formality as any,
        color: outfitColor || undefined,
        style: outfitStyle.trim() || undefined
      },
      environment: {
        indoorOutdoor: isOutdoor ? 'outdoor' : 'indoor',
        locationType: isAc ? 'air_conditioned' : undefined
      }
    };

    onSubmit(compiled);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl liquid-glass p-6 sm:p-8 space-y-8 border border-white/80 shadow-[0_12px_40px_rgba(95,70,40,0.08)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFD3] pb-4">
        <div>
          <span className="text-[10px] font-mono-lab uppercase tracking-widest text-amber-900 font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-200">
            Olfactory Context Calibration
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1A1613] mt-1">
            What is your day like?
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5046]">
            Provide as much or as little context as you wish. Our atelier engine matches your atmosphere, schedule, and mood.
          </p>
        </div>

        {/* Quick Sync & Wardrobe Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleSyncLiveWeather}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition cursor-pointer flex items-center gap-1.5"
            title="Sync with ambient sensor weather"
          >
            <CloudSun className="w-3.5 h-3.5 text-amber-700" />
            <span>Use Live Weather</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ATMOSPHERE & WEATHER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1613]">
              1. Atmospheric Conditions
            </h3>
          </div>
          <span className="text-xs font-mono-lab text-amber-800">
            {temp}°C · {humidity}% Humidity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl liquid-glass-inset">
          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5A5046] font-medium">Ambient Temperature</span>
              <span className="font-mono-lab font-bold text-amber-900">{temp}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            <p className="text-[11px] text-[#7A6F66] italic">
              {getTempSensation(temp)}
            </p>
          </div>

          {/* Humidity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5A5046] font-medium">Relative Humidity</span>
              <span className="font-mono-lab font-bold text-teal-800">{humidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={humidity}
              onChange={(e) => setHumidity(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
            <p className="text-[11px] text-[#7A6F66] italic">
              {getHumiditySensation(humidity)}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: TIME OF DAY & OCCASION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Time of Day (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1613]">
                2. Time of Day
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDetectCurrentTime}
              className="text-[11px] text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              Current Time
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {TIMES_OF_DAY.map((t) => {
              const isSelected = timeOfDay.toLowerCase() === t.id.toLowerCase();
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeOfDay(t.id)}
                  className={`p-2.5 rounded-xl text-left transition cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-2xs font-bold'
                      : 'bg-white/70 hover:bg-white border-[#E3DACB] text-[#5A5046]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{t.icon}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                  </div>
                  <span className="text-xs font-semibold block mt-1">{t.label}</span>
                  <span className="text-[10px] text-[#7A6F66] font-mono-lab block">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Occasion (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1613]">
              3. Occasion &amp; Setting
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {OCCASIONS.map((occ) => {
              const isSelected = occasion.toLowerCase() === occ.id.toLowerCase();
              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setOccasion(occ.id)}
                  className={`p-2.5 rounded-xl text-center transition cursor-pointer border flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-2xs font-bold'
                      : 'bg-white/70 hover:bg-white border-[#E3DACB] text-[#5A5046]'
                  }`}
                >
                  <span className="text-lg">{occ.icon}</span>
                  <span className="text-xs font-medium mt-1 leading-tight">{occ.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: MOOD & INTENT */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1A1613]">
            4. Desired Mood &amp; Psychological Persona
          </h3>
        </div>

        {/* Mood Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAILY_MOOD_PRESETS.map((preset) => {
            const isSelected = selectedMoodPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedMoodPresetId(preset.id);
                  setFreeformMood(preset.title);
                }}
                className={`p-2.5 rounded-xl text-left transition cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-2xs font-bold'
                    : 'bg-white/70 hover:bg-white border-[#E3DACB] text-[#5A5046]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg">{preset.emoji}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                </div>
                <span className="text-xs font-semibold mt-1 leading-tight">{preset.title}</span>
              </button>
            );
          })}
        </div>

        {/* Freeform Mood Input */}
        <div className="pt-2">
          <input
            type="text"
            value={freeformMood}
            onChange={(e) => {
              setFreeformMood(e.target.value);
              setSelectedMoodPresetId(null);
            }}
            placeholder="Or describe your mood in your own words (e.g. confident and quiet, nostalgic, electric)..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/80 border border-[#E3DACB] text-xs text-[#1A1613] placeholder-[#8A7E74] focus:outline-none focus:border-amber-500 focus:bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* SECTION 4: PROGRESSIVE DISCLOSURE (OUTFIT & ENVIRONMENT) */}
      <div className="border-t border-[#E8DFD3] pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(prev => !prev)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#5A5046] hover:text-[#1A1613] py-2 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Shirt className="w-4 h-4 text-amber-700" />
            <span>Optional: Attire Formality &amp; Micro-Environment</span>
          </div>
          <div className="flex items-center gap-1 text-amber-800">
            <span>{showAdvanced ? 'Hide Details' : 'Specify Outfit & Environment'}</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAdvanced && (
          <div className="space-y-5 pt-4">
            {/* Formality Selection */}
            <div>
              <span className="text-xs font-medium text-[#5A5046] block mb-2">Attire Formality</span>
              <div className="flex flex-wrap gap-2">
                {FORMALITIES.map((f) => {
                  const isSelected = formality === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormality(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                          : 'bg-white/70 hover:bg-white border-[#E3DACB] text-[#5A5046]'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dominant Color */}
            <div>
              <span className="text-xs font-medium text-[#5A5046] block mb-2">Dominant Outfit Color</span>
              <div className="flex flex-wrap gap-2">
                {OUTFIT_COLORS.map((c) => {
                  const isSelected = outfitColor.toLowerCase() === c.id.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setOutfitColor(isSelected ? '' : c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold'
                          : 'bg-white/70 hover:bg-white border-[#E3DACB] text-[#5A5046]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Environment Toggle */}
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-white/70 border border-[#E3DACB] text-xs text-[#1A1613] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAc}
                  onChange={(e) => setIsAc(e.target.checked)}
                  className="rounded-sm accent-amber-700"
                />
                <span>Air Conditioned / Climate Controlled</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-white/70 border border-[#E3DACB] text-xs text-[#1A1613] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOutdoor}
                  onChange={(e) => setIsOutdoor(e.target.checked)}
                  className="rounded-sm accent-amber-700"
                />
                <span>Predominantly Outdoor / Open Air</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: WARDROBE CONSTRAINT & ACTIONS */}
      <div className="border-t border-[#E8DFD3] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Wardrobe Mode Toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isWardrobeOnly}
            onChange={(e) => onWardrobeOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded-sm accent-amber-700 cursor-pointer"
          />
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-semibold text-[#1A1613]">
              Recommend only from my Owned Wardrobe
            </span>
          </div>
        </label>

        {/* Buttons */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5A5046] hover:text-[#1A1613] transition cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 border border-amber-500/50 shadow-[0_4px_18px_rgba(217,119,6,0.3)] transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{isLoading ? 'Calibrating Scent...' : 'Find My Scent'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
