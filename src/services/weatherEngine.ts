import { WeatherCondition, Fragrance, Season } from '../types.js';

export function getDefaultEnvironment(): WeatherCondition {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night' = 'Evening';
  if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
  else if (hour >= 17 && hour < 22) timeOfDay = 'Evening';
  else timeOfDay = 'Night';

  // Default atmospheric baseline: Warm monsoon evening
  return {
    temperature_c: 28,
    humidity_pct: 72,
    condition: 'monsoon_rain',
    label: 'Humid & Overcast • Post-Monsoon Breeze',
    season: 'Monsoon',
    time_of_day: timeOfDay,
    perceived_modifiers: {
      intensityFactor: 1.15,
      freshnessFactor: 1.2,
      projectionFactor: 1.1,
      longevityHoursMod: -1.0
    }
  };
}

export const WEATHER_PRESETS: { id: WeatherCondition['condition']; label: string; temp: number; humidity: number; season: Season; icon: string }[] = [
  { id: 'monsoon_rain', label: 'Tropical Monsoon (28°C • 75% Hum.)', temp: 28, humidity: 75, season: 'Monsoon', icon: '🌧️' },
  { id: 'sunny_warm', label: 'Scorching Summer (36°C • 40% Hum.)', temp: 36, humidity: 40, season: 'Summer', icon: '☀️' },
  { id: 'crisp_autumn', label: 'Crisp Autumn (21°C • 50% Hum.)', temp: 21, humidity: 50, season: 'Fall', icon: '🍂' },
  { id: 'chilly_winter', label: 'Chilly Winter Evening (14°C • 55% Hum.)', temp: 14, humidity: 55, season: 'Winter', icon: '❄️' },
  { id: 'tropical_humid', label: 'Coastal Sea Breeze (30°C • 85% Hum.)', temp: 30, humidity: 85, season: 'Summer', icon: '🌊' },
  { id: 'temperate', label: 'Temperate Spring Day (24°C • 45% Hum.)', temp: 24, humidity: 45, season: 'Spring', icon: '🌸' }
];

export function updateWeatherCondition(
  temp: number,
  humidity: number,
  conditionId: WeatherCondition['condition'],
  timeOfDay: WeatherCondition['time_of_day']
): WeatherCondition {
  // Atmospheric evaporation physics:
  // - High heat (>30°C): Top notes evaporate 2.2x faster, heavy gourmands become cloying
  // - High humidity (>65%): Damp air traps aromatic petrichor and flowers, projecting larger scent clouds
  // - Cold weather (<18°C): Restricts projection; dense resins and spices bloom gracefully
  const isHot = temp >= 30;
  const isCold = temp <= 18;
  const isHumid = humidity >= 65;

  let season: Season = 'Summer';
  if (temp <= 17) season = 'Winter';
  else if (conditionId === 'monsoon_rain') season = 'Monsoon';
  else if (temp <= 23) season = 'Fall';
  else if (temp <= 27) season = 'Spring';

  const intensityFactor = isHot ? (isHumid ? 1.25 : 1.15) : (isCold ? 0.85 : 1.0);
  const freshnessFactor = isHot ? 1.3 : 1.0;
  const projectionFactor = isHumid ? 1.2 : (isCold ? 0.8 : 1.0);
  const longevityHoursMod = isHot ? -2.0 : (isCold ? +2.5 : 0);

  const preset = WEATHER_PRESETS.find(p => p.id === conditionId) || WEATHER_PRESETS[0];

  return {
    temperature_c: temp,
    humidity_pct: humidity,
    condition: conditionId,
    label: `${preset.icon} ${preset.label}`,
    season,
    time_of_day: timeOfDay,
    perceived_modifiers: {
      intensityFactor,
      freshnessFactor,
      projectionFactor,
      longevityHoursMod
    }
  };
}

/**
 * Calculates a weather alignment score (0 - 100) for a given fragrance
 */
export function calculateWeatherAlignmentScore(frag?: Fragrance | null, weather?: WeatherCondition | null): {
  score: number;
  advisory: string;
} {
  if (!frag) {
    return {
      score: 75,
      advisory: 'Balanced performance across ambient conditions.'
    };
  }

  const safeWeather: WeatherCondition = weather || getDefaultEnvironment();

  let score = 75;
  const notes = [...(frag.top_notes || []), ...(frag.middle_notes || []), ...(frag.base_notes || [])].join(' ').toLowerCase();
  const family = (frag.fragrance_family || '').toLowerCase();

  // Season check
  if (frag.season && frag.season.includes(safeWeather.season)) {
    score += 15;
  }

  // Hot conditions: penalize heavy cloying gourmands, reward fresh, citrus, green vetiver
  if (safeWeather.temperature_c >= 30) {
    if (family.includes('gourmand') || notes.includes('vanilla') || notes.includes('caramel')) {
      score -= 20;
    }
    if (family.includes('fresh') || notes.includes('citrus') || notes.includes('bergamot') || notes.includes('vetiver') || notes.includes('khus')) {
      score += 15;
    }
  }

  // Cold conditions: reward heavy woods, spices, oud, amber; penalize ultra-light colognes
  if (safeWeather.temperature_c <= 18) {
    if (family.includes('woody') || family.includes('amber') || notes.includes('oud') || notes.includes('cardamom') || notes.includes('sandalwood')) {
      score += 15;
    }
    if (family.includes('aquatic') || (frag.intensity || 5) <= 4) {
      score -= 10;
    }
  }

  // Monsoon & humid conditions: petrichor, mitti, rose, and green grass bloom intensely
  if (safeWeather.humidity_pct >= 65 || safeWeather.condition === 'monsoon_rain') {
    if (notes.includes('mitti') || notes.includes('petrichor') || notes.includes('clay') || notes.includes('rose') || notes.includes('khus')) {
      score += 20;
    }
  }

  score = Math.min(99, Math.max(45, score));

  let advisory = '';
  if (score >= 90) {
    advisory = `Exceptional alignment with ${safeWeather.temperature_c}°C ${safeWeather.season} atmosphere. Top notes will diffuse effortlessly.`;
  } else if (score >= 75) {
    advisory = `Balanced performance in current humidity (${safeWeather.humidity_pct}%). Sillage remains structured.`;
  } else {
    advisory = `Atmospheric friction: may project slightly heavy in ${safeWeather.temperature_c}°C weather; consider reducing spray count.`;
  }

  return { score, advisory };
}
