import {
  NormalizedOlfactoryContext,
  RawOlfactoryContextInput,
  NormalizedContextResponse,
  WeatherContext,
  TemporalContext,
  OccasionContext,
  MoodContext,
  OutfitContext,
  EnvironmentContext,
  UserContext,
  ContextConstraints,
  ContextConfidence,
  ContextExplanation,
  TemperatureCategory,
  HumidityCategory,
  TimeOfDayCategory,
  Season,
  Occasion,
  DailyMoodId,
  UserPreferences,
  WeatherCondition
} from '../types.js';
import { DAILY_MOOD_PRESETS } from '../data/moods.js';
import { updateWeatherCondition } from './weatherEngine.js';

// ================= 1. CONFIGURABLE THRESHOLDS & BOUNDARIES =================

export const TEMPERATURE_THRESHOLDS = {
  SCORCHING: 38,
  HOT: 30,
  WARM: 25,
  MILD: 19,
  COOL: 14,
  COLD: 5,
  MIN_VALID: -40,
  MAX_VALID: 60
} as const;

export const HUMIDITY_THRESHOLDS = {
  DRY_MAX: 40,
  MODERATE_MAX: 70,
  HUMID_MIN: 71,
  TROPICAL_MIN: 85,
  MIN_VALID: 0,
  MAX_VALID: 100
} as const;

export const TIME_BOUNDARIES = {
  MORNING_START: 5,   // 05:00 - 11:59
  AFTERNOON_START: 12, // 12:00 - 16:59
  EVENING_START: 17,  // 17:00 - 21:59
  NIGHT_START: 22     // 22:00 - 04:59
} as const;

// Known Occasion Lexicon & Normalization Rules
const OCCASION_TAXONOMY: {
  keywords: string[];
  canonical: Occasion;
  formality: OccasionContext['formality'];
  defaultDuration?: OccasionContext['duration'];
}[] = [
  {
    keywords: ['office', 'work', 'job interview', 'interview', 'corporate', 'meeting', 'desk', 'boardroom', 'client meeting'],
    canonical: 'Office',
    formality: 'business',
    defaultDuration: 'workday'
  },
  {
    keywords: ['wedding', 'shaadi', 'reception', 'sangeet', 'mehendi', 'festive', 'puja', 'pooja', 'diwali', 'eid', 'festival', 'celebration'],
    canonical: 'Festive / Wedding',
    formality: 'festive',
    defaultDuration: 'evening_event'
  },
  {
    keywords: ['date', 'romantic', 'dinner date', 'first date', 'anniversary', 'rendezvous'],
    canonical: 'Date',
    formality: 'smart_casual',
    defaultDuration: 'evening_event'
  },
  {
    keywords: ['formal', 'black tie', 'white tie', 'gala', 'ceremony', 'tuxedo', 'award show', 'state dinner'],
    canonical: 'Formal',
    formality: 'formal',
    defaultDuration: 'evening_event'
  },
  {
    keywords: ['evening', 'night out', 'party', 'cocktail', 'club', 'drinks', 'bar', 'late night'],
    canonical: 'Evening',
    formality: 'smart_casual',
    defaultDuration: 'evening_event'
  },
  {
    keywords: ['casual', 'errands', 'weekend', 'home', 'chill', 'coffee', 'hanging out', 'brunch', 'gym', 'workout', 'walking'],
    canonical: 'Casual',
    formality: 'casual',
    defaultDuration: 'brief'
  },
  {
    keywords: ['meditation', 'spiritual', 'temple', 'prayer', 'yoga', 'mindfulness'],
    canonical: 'Meditation / Spiritual',
    formality: 'spiritual',
    defaultDuration: 'brief'
  },
  {
    keywords: ['special event', 'milestone', 'launch', 'premier'],
    canonical: 'Special Event',
    formality: 'formal',
    defaultDuration: 'evening_event'
  },
  {
    keywords: ['signature', 'everyday signature', 'daily signature', 'all day'],
    canonical: 'Signature',
    formality: 'casual',
    defaultDuration: 'all_day'
  }
];

// Known Mood Lexicon & Preset Mapping
const MOOD_TAXONOMY: {
  keywords: string[];
  presetId?: DailyMoodId;
  canonicalLabel: string;
}[] = [
  {
    keywords: ['fresh', 'energetic', 'invigorated', 'vibrant', 'active', 'lively', 'refreshed'],
    presetId: 'fresh_energetic',
    canonicalLabel: 'Fresh & Energetic'
  },
  {
    keywords: ['seductive', 'sultry', 'alluring', 'sensual', 'intimate', 'sexy', 'warm and seductive'],
    presetId: 'warm_seductive',
    canonicalLabel: 'Warm & Seductive'
  },
  {
    keywords: ['calm', 'relaxed', 'peaceful', 'serene', 'mindful', 'zen', 'clean', 'tranquil', 'cozy'],
    presetId: 'clean_calm',
    canonicalLabel: 'Clean & Calm'
  },
  {
    keywords: ['romantic', 'soft', 'gentle', 'sweet', 'affectionate', 'dreamy'],
    presetId: 'romantic_soft',
    canonicalLabel: 'Romantic & Soft'
  },
  {
    keywords: ['dark', 'woody', 'mysterious', 'moody', 'brooding', 'bold', 'edgy', 'smoky'],
    presetId: 'dark_woody',
    canonicalLabel: 'Dark & Woody'
  },
  {
    keywords: ['indian soul', 'traditional', 'heritage', 'devotional', 'petrichor soul', 'earthy soul'],
    presetId: 'indian_soul',
    canonicalLabel: 'Indian Soul'
  },
  {
    keywords: ['surprise me', 'adventurous', 'playful', 'spontaneous', 'experimental'],
    presetId: 'surprise_me',
    canonicalLabel: 'Surprise Me'
  },
  // Free-form descriptors that are recognized without preset override
  {
    keywords: ['confident', 'assertive', 'commanding', 'bold leadership'],
    canonicalLabel: 'Confident'
  },
  {
    keywords: ['sophisticated', 'elegant', 'refined', 'chic', 'aristocratic'],
    canonicalLabel: 'Sophisticated'
  },
  {
    keywords: ['professional', 'focused', 'sharp', 'executive'],
    canonicalLabel: 'Professional'
  }
];

// Outfit Parser Lexicon
const OUTFIT_COLORS = [
  'black', 'white', 'navy', 'blue', 'grey', 'gray', 'charcoal',
  'red', 'maroon', 'burgundy', 'green', 'olive', 'emerald',
  'brown', 'tan', 'beige', 'cream', 'khaki', 'pink', 'yellow',
  'gold', 'silver', 'purple', 'violet'
];

const OUTFIT_FORMALITIES: { keywords: string[]; formality: OutfitContext['formality'] }[] = [
  { keywords: ['formal', 'black tie', 'tuxedo', 'three-piece', 'suit', 'evening gown', 'sherwani'], formality: 'formal' },
  { keywords: ['business casual', 'office wear', 'work wear', 'blazer and slacks'], formality: 'business_casual' },
  { keywords: ['smart casual', 'blazer', 'polo', 'chinos', 'dress shirt'], formality: 'smart_casual' },
  { keywords: ['festive', 'traditional', 'ethnic', 'kurta', 'saree', 'lehenga', 'anarkali', 'bandhgala', 'dhoti'], formality: 'festive' },
  { keywords: ['athleisure', 'gym', 'tracksuit', 'joggers', 'activewear', 'hoodie'], formality: 'athleisure' },
  { keywords: ['casual', 'jeans', 't-shirt', 'tee', 'shorts', 'cotton shirt', 'linen shirt', 'sneakers'], formality: 'casual' }
];

const OUTFIT_STYLES = [
  'suit', 'tuxedo', 'sherwani', 'kurta', 'saree', 'lehenga', 'anarkali', 'bandhgala',
  'blazer', 'dress', 'gown', 'jacket', 't-shirt', 'shirt', 'jeans', 'chinos',
  'trousers', 'shorts', 'hoodie', 'sweater', 'linen shirt', 'cotton shirt', 'polo'
];

// Ambiguous or non-informative phrases that must not trigger false positive normalization
const AMBIGUOUS_INTENT_PATTERNS = [
  /just want to smell (amazing|good|nice|great)/i,
  /surprise me/i,
  /anything/i,
  /whatever/i,
  /idk/i,
  /not sure/i,
  /help me choose/i
];

// ================= 2. DETERMINISTIC NORMALIZATION FUNCTIONS =================

/**
 * Normalizes temperature and determines its categorical classification
 */
export function normalizeTemperature(temp?: number | null): {
  temperatureC?: number;
  category?: TemperatureCategory;
  valid: boolean;
} {
  if (temp === undefined || temp === null || isNaN(Number(temp))) {
    return { valid: false };
  }

  const t = Number(temp);
  if (t < TEMPERATURE_THRESHOLDS.MIN_VALID || t > TEMPERATURE_THRESHOLDS.MAX_VALID) {
    return { valid: false };
  }

  let category: TemperatureCategory;
  if (t >= TEMPERATURE_THRESHOLDS.SCORCHING) category = 'scorching';
  else if (t >= TEMPERATURE_THRESHOLDS.HOT) category = 'hot';
  else if (t >= TEMPERATURE_THRESHOLDS.WARM) category = 'warm';
  else if (t >= TEMPERATURE_THRESHOLDS.MILD) category = 'mild';
  else if (t >= TEMPERATURE_THRESHOLDS.COOL) category = 'cool';
  else if (t >= TEMPERATURE_THRESHOLDS.COLD) category = 'cold';
  else category = 'freezing';

  return {
    temperatureC: Math.round(t * 10) / 10,
    category,
    valid: true
  };
}

/**
 * Normalizes humidity and determines its categorical classification
 */
export function normalizeHumidity(humidity?: number | null): {
  humidityPercent?: number;
  category?: HumidityCategory;
  valid: boolean;
} {
  if (humidity === undefined || humidity === null || isNaN(Number(humidity))) {
    return { valid: false };
  }

  const h = Number(humidity);
  if (h < HUMIDITY_THRESHOLDS.MIN_VALID || h > HUMIDITY_THRESHOLDS.MAX_VALID) {
    return { valid: false };
  }

  let category: HumidityCategory;
  if (h >= HUMIDITY_THRESHOLDS.TROPICAL_MIN) category = 'tropical';
  else if (h > HUMIDITY_THRESHOLDS.MODERATE_MAX) category = 'humid';
  else if (h >= HUMIDITY_THRESHOLDS.DRY_MAX) category = 'moderate';
  else category = 'dry';

  return {
    humidityPercent: Math.round(h),
    category,
    valid: true
  };
}

/**
 * Time and temporal normalization respecting explicit time, timestamps, and local timezone
 */
export function normalizeTemporal(
  inputTimestamp?: string,
  explicitTimeOfDay?: string,
  explicitSeason?: string,
  temp?: number,
  condition?: string
): {
  temporal: TemporalContext;
  confidence: number;
} {
  let timeOfDay: TimeOfDayCategory | undefined = undefined;
  let season: Season | undefined = undefined;
  let dayType: 'weekday' | 'weekend' | undefined = undefined;
  let validTimestamp: string | undefined = undefined;
  let temporalConfidence = 0;

  // 1. Process explicit time of day if provided
  if (explicitTimeOfDay && typeof explicitTimeOfDay === 'string' && explicitTimeOfDay.trim()) {
    const clean = explicitTimeOfDay.trim().toLowerCase();
    if (clean.includes('morn')) timeOfDay = 'Morning';
    else if (clean.includes('after')) timeOfDay = 'Afternoon';
    else if (clean.includes('even')) timeOfDay = 'Evening';
    else if (clean.includes('night')) timeOfDay = 'Night';
    
    if (timeOfDay) {
      temporalConfidence = Math.max(temporalConfidence, 0.9);
    }
  }

  // 2. Process timestamp if provided
  if (inputTimestamp && typeof inputTimestamp === 'string' && inputTimestamp.trim()) {
    const trimmed = inputTimestamp.trim();
    // Check if valid date
    const parsedDate = new Date(trimmed);
    if (!isNaN(parsedDate.getTime())) {
      validTimestamp = trimmed;

      // Extract local hour from string if ISO offset exists (e.g. 2026-09-17T18:30:00+05:30)
      const isoTimeMatch = trimmed.match(/T(\d{2}):(\d{2})/);
      let hour: number;
      if (isoTimeMatch && !trimmed.endsWith('Z')) {
        // String has explicit local hour specified in the ISO time component
        hour = parseInt(isoTimeMatch[1], 10);
      } else {
        hour = parsedDate.getHours();
      }

      // If timeOfDay was not explicitly passed, derive from hour
      if (!timeOfDay) {
        if (hour >= TIME_BOUNDARIES.MORNING_START && hour < TIME_BOUNDARIES.AFTERNOON_START) {
          timeOfDay = 'Morning';
        } else if (hour >= TIME_BOUNDARIES.AFTERNOON_START && hour < TIME_BOUNDARIES.EVENING_START) {
          timeOfDay = 'Afternoon';
        } else if (hour >= TIME_BOUNDARIES.EVENING_START && hour < TIME_BOUNDARIES.NIGHT_START) {
          timeOfDay = 'Evening';
        } else {
          timeOfDay = 'Night';
        }
      }

      const day = parsedDate.getDay();
      dayType = (day === 0 || day === 6) ? 'weekend' : 'weekday';
      temporalConfidence = 1.0;
    } else {
      // Malformed timestamp: fail gracefully without crashing
      validTimestamp = undefined;
    }
  }

  // 3. Process season following project conventions (from weatherEngine.ts)
  if (explicitSeason && typeof explicitSeason === 'string') {
    const cleanSeason = explicitSeason.trim().toLowerCase();
    if (cleanSeason.includes('monsoon') || cleanSeason.includes('rain')) season = 'Monsoon';
    else if (cleanSeason.includes('summer')) season = 'Summer';
    else if (cleanSeason.includes('winter')) season = 'Winter';
    else if (cleanSeason.includes('spring')) season = 'Spring';
    else if (cleanSeason.includes('fall') || cleanSeason.includes('autumn')) season = 'Fall';
  }

  // Derive season if not explicitly set and weather conditions are known
  if (!season) {
    if (condition && (condition.toLowerCase().includes('monsoon') || condition.toLowerCase().includes('rain'))) {
      season = 'Monsoon';
    } else if (temp !== undefined && !isNaN(temp)) {
      if (temp <= 17) season = 'Winter';
      else if (temp <= 23) season = 'Fall';
      else if (temp <= 27) season = 'Spring';
      else season = 'Summer';
    } else if (validTimestamp) {
      const month = new Date(validTimestamp).getMonth(); // 0-11
      if (month >= 5 && month <= 8) season = 'Monsoon'; // June - Sept Indian monsoon
      else if (month >= 2 && month <= 4) season = 'Summer'; // March - May
      else if (month >= 9 && month <= 10) season = 'Fall'; // Oct - Nov
      else season = 'Winter'; // Dec - Feb
    }
  }

  return {
    temporal: {
      timestamp: validTimestamp,
      timeOfDay,
      season,
      dayType,
      isoDate: validTimestamp ? validTimestamp.split('T')[0] : undefined
    },
    confidence: temporalConfidence
  };
}

/**
 * Normalizes occasion from natural language or structured input
 */
export function normalizeOccasion(raw?: string | { type?: string; formality?: string; duration?: string } | null): {
  occasion: OccasionContext;
  confidence: number;
} {
  if (!raw) {
    return { occasion: {}, confidence: 0 };
  }

  if (typeof raw === 'object') {
    return {
      occasion: {
        type: raw.type,
        formality: raw.formality as any,
        duration: raw.duration as any,
        rawInput: JSON.stringify(raw)
      },
      confidence: raw.type ? 0.9 : 0.4
    };
  }

  const rawStr = String(raw).trim();
  if (!rawStr) {
    return { occasion: {}, confidence: 0 };
  }

  // Reject generic ambiguous statements (e.g. "I just want to smell amazing today")
  for (const pattern of AMBIGUOUS_INTENT_PATTERNS) {
    if (pattern.test(rawStr)) {
      return {
        occasion: { rawInput: rawStr },
        confidence: 0
      };
    }
  }

  const lower = rawStr.toLowerCase();

  for (const item of OCCASION_TAXONOMY) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        return {
          occasion: {
            type: item.canonical,
            formality: item.formality,
            duration: item.defaultDuration,
            rawInput: rawStr
          },
          confidence: 0.95
        };
      }
    }
  }

  // Unknown or unmapped occasion: preserve raw input conservatively without hallucination
  return {
    occasion: {
      rawInput: rawStr
    },
    confidence: 0.3
  };
}

/**
 * Normalizes mood from natural language or structured input
 */
export function normalizeMood(raw?: string | { primary?: string; secondary?: string } | null): {
  mood: MoodContext;
  confidence: number;
} {
  if (!raw) {
    return { mood: {}, confidence: 0 };
  }

  if (typeof raw === 'object') {
    return {
      mood: {
        primary: raw.primary,
        secondary: raw.secondary,
        rawInput: JSON.stringify(raw)
      },
      confidence: raw.primary ? 0.9 : 0.3
    };
  }

  const rawStr = String(raw).trim();
  if (!rawStr) {
    return { mood: {}, confidence: 0 };
  }

  // Check for ambiguous query phrases
  for (const pattern of AMBIGUOUS_INTENT_PATTERNS) {
    if (pattern.test(rawStr)) {
      return {
        mood: { rawInput: rawStr },
        confidence: 0
      };
    }
  }

  const lower = rawStr.toLowerCase();

  // Check existing DAILY_MOOD_PRESETS from moods.ts
  const matchedPreset = DAILY_MOOD_PRESETS.find(p =>
    p.id.toLowerCase() === lower ||
    p.title.toLowerCase() === lower ||
    lower.includes(p.id) ||
    lower.includes(p.title.toLowerCase())
  );

  if (matchedPreset) {
    return {
      mood: {
        primary: matchedPreset.id,
        primaryLabel: matchedPreset.title,
        rawInput: rawStr
      },
      confidence: 1.0
    };
  }

  // Check Mood Taxonomy
  for (const item of MOOD_TAXONOMY) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        return {
          mood: {
            primary: item.presetId || item.canonicalLabel.toLowerCase().replace(/\s+/g, '_'),
            primaryLabel: item.canonicalLabel,
            rawInput: rawStr
          },
          confidence: item.presetId ? 0.95 : 0.85
        };
      }
    }
  }

  // Unrecognized mood: retain raw input faithfully
  return {
    mood: {
      rawInput: rawStr
    },
    confidence: 0.3
  };
}

/**
 * Conservative outfit parser.
 * Returns undefined for properties that cannot be reliably detected.
 */
export function parseOutfit(raw?: string | { description?: string; formality?: string; color?: string; style?: string } | null): {
  outfit: OutfitContext;
  confidence: number;
} {
  if (!raw) {
    return { outfit: {}, confidence: 0 };
  }

  if (typeof raw === 'object') {
    const hasProps = Boolean(raw.description || raw.formality || raw.color || raw.style);
    return {
      outfit: {
        description: raw.description,
        formality: raw.formality as any,
        color: raw.color,
        style: raw.style,
        rawInput: JSON.stringify(raw)
      },
      confidence: hasProps ? 0.9 : 0.2
    };
  }

  const rawStr = String(raw).trim();
  if (!rawStr) {
    return { outfit: {}, confidence: 0 };
  }

  // Ambiguous input check
  for (const pattern of AMBIGUOUS_INTENT_PATTERNS) {
    if (pattern.test(rawStr)) {
      return {
        outfit: { rawInput: rawStr },
        confidence: 0
      };
    }
  }

  const lower = rawStr.toLowerCase();

  // 1. Color extraction
  let detectedColor: string | undefined = undefined;
  for (const color of OUTFIT_COLORS) {
    // Word boundary match
    const regex = new RegExp(`\\b${color}\\b`, 'i');
    if (regex.test(lower)) {
      detectedColor = color;
      break;
    }
  }

  // 2. Formality extraction
  let detectedFormality: OutfitContext['formality'] = undefined;
  for (const item of OUTFIT_FORMALITIES) {
    for (const kw of item.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(lower)) {
        detectedFormality = item.formality;
        break;
      }
    }
    if (detectedFormality) break;
  }

  // 3. Style extraction
  let detectedStyle: string | undefined = undefined;
  for (const style of OUTFIT_STYLES) {
    const regex = new RegExp(`\\b${style}\\b`, 'i');
    if (regex.test(lower)) {
      detectedStyle = style;
      break;
    }
  }

  // If nothing could be extracted and it doesn't sound like an outfit
  if (!detectedColor && !detectedFormality && !detectedStyle) {
    return {
      outfit: { rawInput: rawStr },
      confidence: 0.1
    };
  }

  let confidence = 0.5;
  if (detectedColor && detectedFormality && detectedStyle) confidence = 0.95;
  else if (detectedFormality && detectedStyle) confidence = 0.85;
  else if (detectedFormality) confidence = 0.75;

  return {
    outfit: {
      description: rawStr,
      formality: detectedFormality,
      color: detectedColor,
      style: detectedStyle,
      rawInput: rawStr
    },
    confidence
  };
}

/**
 * Builds structured human-readable explanation of normalized context
 */
export function generateContextExplanation(context: NormalizedOlfactoryContext): ContextExplanation {
  const factors: string[] = [];

  // Weather factor
  if (context.weather.temperatureC !== undefined) {
    const cat = context.weather.temperatureCategory ? ` (${context.weather.temperatureCategory})` : '';
    factors.push(`${context.weather.temperatureC}°C${cat}`);
  }
  if (context.weather.humidityPercent !== undefined) {
    const cat = context.weather.humidityCategory ? ` (${context.weather.humidityCategory})` : '';
    factors.push(`${context.weather.humidityPercent}% humidity${cat}`);
  }
  if (context.weather.condition) {
    factors.push(context.weather.condition);
  }

  // Temporal factor
  if (context.temporal.timeOfDay) {
    factors.push(context.temporal.timeOfDay);
  }
  if (context.temporal.season) {
    factors.push(`${context.temporal.season} season`);
  }

  // Occasion factor
  if (context.occasion.type) {
    factors.push(`${context.occasion.type} occasion`);
  } else if (context.occasion.rawInput) {
    factors.push(`Context: "${context.occasion.rawInput}"`);
  }

  // Mood factor
  if (context.mood.primaryLabel) {
    factors.push(`${context.mood.primaryLabel} mood`);
  } else if (context.mood.primary) {
    factors.push(`${context.mood.primary} mood`);
  }

  // Outfit factor
  if (context.outfit.description) {
    factors.push(`${context.outfit.description} outfit`);
  }

  // Summary generation
  let summary = '';
  const tempDesc = context.weather.temperatureCategory || (context.weather.temperatureC ? `${context.weather.temperatureC}°C` : '');
  const humidDesc = context.weather.humidityCategory ? ` ${context.weather.humidityCategory}` : '';
  const timeDesc = context.temporal.timeOfDay || '';
  const occDesc = context.occasion.type ? `for a ${context.occasion.type.toLowerCase()} occasion` : '';

  if (tempDesc || humidDesc || timeDesc || occDesc) {
    const weatherPart = [tempDesc, humidDesc].filter(Boolean).join('');
    const timePart = timeDesc ? ` ${timeDesc.toLowerCase()}` : '';
    const occPart = occDesc ? ` ${occDesc}` : '';
    summary = `${(weatherPart + timePart).trim() || 'Atmospheric conditions'}${occPart}`.trim();
    // Capitalize first letter
    summary = summary.charAt(0).toUpperCase() + summary.slice(1);
  } else if (factors.length > 0) {
    summary = factors.slice(0, 3).join(' • ');
  } else {
    summary = 'General everyday context';
  }

  return {
    summary,
    factors
  };
}

// ================= 3. CENTRAL ENGINE ENTRYPOINT =================

/**
 * Normalizes raw sensory and situational context into a verified, strongly-typed OlfactoryContext
 */
export function normalizeOlfactoryContext(input: RawOlfactoryContextInput): NormalizedContextResponse {
  // 1. Weather Normalization
  const rawWeather = input.weather || {};
  const rawTemp = rawWeather.temperatureC ?? rawWeather.temperature_c;
  const rawHumidity = rawWeather.humidityPercent ?? rawWeather.humidity_pct;
  const rawCondition = rawWeather.condition;
  const rawPrecip = rawWeather.precipitation;
  const rawWind = rawWeather.windSpeedKph ?? rawWeather.wind_kph;

  const tempNorm = normalizeTemperature(rawTemp);
  const humidNorm = normalizeHumidity(rawHumidity);

  let weatherConfidence = 0;
  if (tempNorm.valid && humidNorm.valid) weatherConfidence = 1.0;
  else if (tempNorm.valid || humidNorm.valid) weatherConfidence = 0.6;
  else if (rawCondition) weatherConfidence = 0.4;

  const weatherContext: WeatherContext = {
    temperatureC: tempNorm.valid ? tempNorm.temperatureC : undefined,
    temperatureCategory: tempNorm.category,
    humidityPercent: humidNorm.valid ? humidNorm.humidityPercent : undefined,
    humidityCategory: humidNorm.category,
    condition: rawCondition,
    precipitation: rawPrecip,
    windSpeedKph: rawWind && !isNaN(Number(rawWind)) ? Number(rawWind) : undefined
  };

  // 2. Temporal Normalization
  const timestampInput = input.timestamp || input.temporal?.timestamp;
  const timeOfDayInput = input.timeOfDay || input.temporal?.timeOfDay;
  const seasonInput = input.season || input.temporal?.season;

  const { temporal: temporalContext, confidence: temporalConfidence } = normalizeTemporal(
    timestampInput,
    timeOfDayInput,
    seasonInput,
    weatherContext.temperatureC,
    weatherContext.condition
  );

  // 3. Occasion Normalization
  const { occasion: occasionContext, confidence: occasionConfidence } = normalizeOccasion(input.occasion);

  // 4. Mood Normalization
  const { mood: moodContext, confidence: moodConfidence } = normalizeMood(input.mood);

  // 5. Outfit Normalization
  const { outfit: outfitContext, confidence: outfitConfidence } = parseOutfit(input.outfit);

  // 6. Environment Normalization
  const envInput = input.environment || {};
  const environmentContext: EnvironmentContext = {
    indoorOutdoor: envInput.indoorOutdoor as any,
    locationType: envInput.locationType,
    crowdLevel: envInput.crowdLevel
  };

  // 7. User Context & Wardrobe Normalization
  const userInput = input.user || {};
  const userContext: UserContext = {
    preferenceVector: userInput.preferenceVector,
    wardrobeFragranceIds: userInput.wardrobeFragranceIds?.map(id => typeof id === 'number' ? id : parseInt(String(id), 10)).filter(n => !isNaN(n)),
    dislikedFragranceIds: userInput.dislikedFragranceIds?.map(id => typeof id === 'number' ? id : parseInt(String(id), 10)).filter(n => !isNaN(n)),
    favoriteFragranceIds: userInput.favoriteFragranceIds?.map(id => typeof id === 'number' ? id : parseInt(String(id), 10)).filter(n => !isNaN(n)),
    preferences: userInput.preferences,
    userId: userInput.userId
  };

  // 8. Constraints
  const constraintsInput = input.constraints || {};
  const constraintsContext: ContextConstraints = {
    projectionPreference: constraintsInput.projectionPreference,
    longevityPreference: constraintsInput.longevityPreference,
    fragranceIntensityPreference: constraintsInput.fragranceIntensityPreference,
    avoidNotes: constraintsInput.avoidNotes,
    preferredNotes: constraintsInput.preferredNotes
  };

  // 9. Aggregate Confidence Calculation
  const activeComponents = [
    { conf: weatherConfidence, active: weatherConfidence > 0 },
    { conf: temporalConfidence, active: temporalConfidence > 0 },
    { conf: occasionConfidence, active: occasionConfidence > 0 },
    { conf: moodConfidence, active: moodConfidence > 0 },
    { conf: outfitConfidence, active: outfitConfidence > 0 }
  ].filter(c => c.active);

  const overallConfidence = activeComponents.length > 0
    ? Math.round((activeComponents.reduce((sum, c) => sum + c.conf, 0) / activeComponents.length) * 100) / 100
    : 0.5;

  const confidence: ContextConfidence = {
    overall: overallConfidence,
    weather: weatherConfidence,
    temporal: temporalConfidence,
    occasion: occasionConfidence,
    mood: moodConfidence,
    outfit: outfitConfidence
  };

  // 10. Compile Normalized Context
  const normalized: NormalizedOlfactoryContext = {
    weather: weatherContext,
    temporal: temporalContext,
    occasion: occasionContext,
    mood: moodContext,
    outfit: outfitContext,
    environment: environmentContext,
    user: userContext,
    constraints: constraintsContext,
    confidence,
    explanation: { summary: '', factors: [] }
  };

  const explanation = generateContextExplanation(normalized);
  normalized.explanation = explanation;

  return {
    context: normalized,
    explanation,
    confidence
  };
}

// ================= 4. ADAPTERS FOR EXISTING ML / ENGINES =================

/**
 * Transforms NormalizedOlfactoryContext into UserPreferences compatible with
 * server/ml/features.ts, server/ml/similarity.ts, and server/ml/layering.ts
 */
export function contextToUserPreferences(
  context: NormalizedOlfactoryContext,
  existingPrefs?: UserPreferences
): UserPreferences {
  // Base parameters from existing preferences or defaults
  let sweetness = existingPrefs?.sweetness ?? 5;
  let freshness = existingPrefs?.freshness ?? 5;
  let intensity = existingPrefs?.intensity ?? 6;

  // Temperature adjustments
  if (context.weather.temperatureC !== undefined) {
    if (context.weather.temperatureC >= 30) {
      // Hot weather: favor freshness, tone down sweetness
      freshness = Math.max(freshness, 8);
      sweetness = Math.min(sweetness, 4);
    } else if (context.weather.temperatureC <= 18) {
      // Cold weather: favor sweetness and intensity
      sweetness = Math.max(sweetness, 7);
      intensity = Math.max(intensity, 8);
    }
  }

  // Mood adjustments
  if (context.mood.primary) {
    const matchedPreset = DAILY_MOOD_PRESETS.find(p => p.id === context.mood.primary);
    if (matchedPreset) {
      sweetness = matchedPreset.sweetness;
      freshness = matchedPreset.freshness;
      intensity = matchedPreset.intensity;
    }
  }

  // Occasion adjustments
  let mappedOccasion: Occasion | undefined = undefined;
  if (context.occasion.type) {
    mappedOccasion = context.occasion.type as Occasion;
  } else if (existingPrefs?.occasion) {
    mappedOccasion = existingPrefs.occasion;
  }

  // Time of day adjustments
  let timeOfDay: 'Day' | 'Evening' | 'Night' | 'Any' = 'Any';
  if (context.temporal.timeOfDay === 'Morning' || context.temporal.timeOfDay === 'Afternoon') {
    timeOfDay = 'Day';
  } else if (context.temporal.timeOfDay === 'Evening') {
    timeOfDay = 'Evening';
  } else if (context.temporal.timeOfDay === 'Night') {
    timeOfDay = 'Night';
  }

  return {
    ...existingPrefs,
    sweetness,
    freshness,
    intensity,
    season: context.temporal.season || existingPrefs?.season || 'Summer',
    occasion: mappedOccasion,
    time_of_day: timeOfDay,
    preferred_notes: [
      ...(existingPrefs?.preferred_notes || []),
      ...(context.constraints?.preferredNotes || [])
    ],
    owned_fragrance_id: existingPrefs?.owned_fragrance_id
  };
}

/**
 * Transforms NormalizedOlfactoryContext into WeatherCondition compatible with
 * src/services/weatherEngine.ts
 */
export function contextToWeatherCondition(context: NormalizedOlfactoryContext): WeatherCondition {
  const temp = context.weather.temperatureC ?? 28;
  const humidity = context.weather.humidityPercent ?? 70;
  const timeOfDay = context.temporal.timeOfDay || 'Evening';

  let conditionId: WeatherCondition['condition'] = 'temperate';
  if (context.weather.condition?.toLowerCase().includes('monsoon') || context.temporal.season === 'Monsoon') {
    conditionId = 'monsoon_rain';
  } else if (temp >= 32) {
    conditionId = humidity >= 70 ? 'tropical_humid' : 'sunny_warm';
  } else if (temp <= 16) {
    conditionId = 'chilly_winter';
  } else if (context.temporal.season === 'Fall') {
    conditionId = 'crisp_autumn';
  }

  return updateWeatherCondition(temp, humidity, conditionId, timeOfDay);
}
