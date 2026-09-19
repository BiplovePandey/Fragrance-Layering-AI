import {
  Fragrance,
  UserPreferences,
  NormalizedOlfactoryContext,
  RawOlfactoryContextInput,
  WearRecommendation,
  WearRecommendationRequest,
  WearRecommendationResponse,
  WearRecommendationMatchBreakdown,
  ContextConfidence
} from '../../src/types.js';
import { cosineSimilarity } from './similarity.js';
import { createUserPreferenceVector } from './features.js';
import { calculateWeatherAlignmentScore } from '../../src/services/weatherEngine.js';
import {
  normalizeOlfactoryContext,
  contextToWeatherCondition,
  contextToUserPreferences,
  generateContextExplanation
} from '../../src/services/contextEngine.js';
import { DAILY_MOOD_PRESETS } from '../../src/data/moods.js';

/**
 * STEP 6B: Configurable named baseline weights for the multi-signal recommendation engine.
 *
 * Signal Descriptions:
 * - PREFERENCE (0.25): 8D vector cosine similarity against user preference DNA + preferred notes overlap.
 * - WEATHER (0.15): Atmospheric thermodynamics (evaporation speed, humidity sillage expansion) from weatherEngine.
 * - SEASON (0.10): Meteorological seasonality alignment (Spring, Summer, Monsoon, Fall, Winter).
 * - OCCASION (0.20): Situational appropriateness, venue formality, and dress code harmony.
 * - MOOD (0.10): Psychological resonance with emotional state, matching mood presets and accords.
 * - TIME_OF_DAY (0.10): Diurnal cycle harmony (Morning, Afternoon, Evening, Night).
 * - PERFORMANCE (0.10): Sillage projection and longevity endurance matching context duration.
 *
 * Dynamic Confidence Scaling:
 * When confidence for an inferred context factor is low or 0 (e.g. weather unavailable or ambiguous text),
 * its effective weight is scaled down by its confidence score (0.0 - 1.0).
 * Active weights are then dynamically normalized to sum to 1.0 so unprovided context never penalizes candidates.
 */
export const WEAR_SIGNAL_WEIGHTS = {
  PREFERENCE: 0.25,
  WEATHER: 0.15,
  SEASON: 0.10,
  OCCASION: 0.20,
  MOOD: 0.10,
  TIME_OF_DAY: 0.10,
  PERFORMANCE: 0.10
} as const;

/**
 * Maximum score delta allowed when promoting an alternative candidate from an underrepresented
 * olfactory cluster during the diversity pass.
 */
export const DIVERSITY_SCORE_TOLERANCE = 4;

/**
 * Maximum cosine similarity between candidates to be considered olfactorily distinct.
 */
export const DIVERSITY_COSINE_THRESHOLD = 0.88;

interface ScoredCandidate {
  fragrance: Fragrance & { vector: number[] };
  totalScore: number;
  match: WearRecommendationMatchBreakdown;
  reasons: string[];
  negativeExplanations: string[];
  isOwned: boolean;
  isFavorite: boolean;
}

/**
 * Evaluates preference match: cosine similarity between user 8D vector and fragrance vector,
 * plus note overlap intersection.
 */
function evaluatePreferenceMatch(
  fragrance: Fragrance & { vector: number[] },
  userPrefVector: number[] | null,
  preferredNotes: string[]
): { score: number; noteOverlapCount: number } {
  let cosSimScore = 70; // baseline if no preference vector
  if (userPrefVector && userPrefVector.length === fragrance.vector?.length) {
    const sim = cosineSimilarity(userPrefVector, fragrance.vector);
    cosSimScore = Math.max(0, Math.min(100, Math.round(sim * 100)));
  }

  let noteScore = 70;
  let noteOverlapCount = 0;
  if (preferredNotes.length > 0) {
    const allNotes = [
      ...(fragrance.top_notes || []),
      ...(fragrance.middle_notes || []),
      ...(fragrance.base_notes || [])
    ].map(n => n.toLowerCase());

    for (const note of preferredNotes) {
      if (allNotes.some(fn => fn.includes(note.toLowerCase()))) {
        noteOverlapCount++;
      }
    }
    noteScore = Math.round((noteOverlapCount / preferredNotes.length) * 100);
  }

  // 70% vector cosine similarity + 30% explicit note overlap
  const finalScore = Math.round(cosSimScore * 0.7 + noteScore * 0.3);
  return { score: Math.min(99, Math.max(10, finalScore)), noteOverlapCount };
}

/**
 * Evaluates weather alignment using the existing weatherEngine.
 */
function evaluateWeatherMatch(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext
): { score: number; advisory: string } {
  const weatherConf = context.confidence?.weather ?? 0;
  if (weatherConf === 0 || context.weather.temperatureC === undefined) {
    return { score: 75, advisory: 'Balanced performance across ambient conditions.' };
  }

  const weatherCond = contextToWeatherCondition(context);
  const result = calculateWeatherAlignmentScore(fragrance, weatherCond);
  return result;
}

/**
 * Evaluates season alignment.
 */
function evaluateSeasonMatch(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext
): { score: number; isDirectMatch: boolean } {
  const season = context.temporal.season;
  if (!season) {
    return { score: 70, isDirectMatch: false };
  }

  const fragSeasons = (fragrance.season || []).map(s => s.toLowerCase());
  const target = season.toLowerCase();

  if (fragSeasons.some(s => s === target)) {
    return { score: 95, isDirectMatch: true };
  }
  if (fragSeasons.some(s => s === 'all year' || s === 'all seasons' || s === 'any')) {
    return { score: 85, isDirectMatch: true };
  }

  return { score: 35, isDirectMatch: false };
}

/**
 * Evaluates occasion and formality alignment.
 */
function evaluateOccasionMatch(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext
): { score: number; isDirectMatch: boolean; formalityBonus: number } {
  const occasionType = context.occasion.type;
  const occasionConf = context.confidence?.occasion ?? 0;

  if (occasionConf === 0 || !occasionType) {
    return { score: 70, isDirectMatch: false, formalityBonus: 0 };
  }

  const occLower = occasionType.toLowerCase();
  const fragOccasions = (fragrance.occasion || []).map(o => o.toLowerCase());

  let score = 50;
  let isDirectMatch = false;

  // Direct occasion match
  if (fragOccasions.some(o => o.includes(occLower) || occLower.includes(o))) {
    score = 90;
    isDirectMatch = true;
  } else if (fragOccasions.some(o => o.includes('signature') || o.includes('everyday') || o.includes('casual'))) {
    score = 75;
  } else {
    score = 45;
  }

  // Formality & Outfit context modifiers
  const formality = context.occasion?.formality || context.outfit?.formality || 'smart_casual';
  let formalityBonus = 0;

  const family = (fragrance.fragrance_family || '').toLowerCase();
  const notesText = [
    ...(fragrance.top_notes || []),
    ...(fragrance.middle_notes || []),
    ...(fragrance.base_notes || [])
  ].join(' ').toLowerCase();

  if (formality === 'formal') {
    if (fragrance.intensity >= 6 || family.includes('woody') || family.includes('amber') || family.includes('oriental') || family.includes('chypre')) {
      formalityBonus += 8;
    }
    if (fragrance.intensity <= 4 && (family.includes('aquatic') || family.includes('citrus'))) {
      formalityBonus -= 8;
    }
  } else if (formality === 'festive') {
    const isIndianHeritage = (fragrance.origin_style || '').toLowerCase().includes('indian') ||
      (fragrance.brand_country || '').toLowerCase() === 'india' ||
      fragrance.is_oil_based ||
      fragrance.format === 'Attar';
    const hasFestiveNotes = notesText.includes('saffron') || notesText.includes('sandalwood') ||
      notesText.includes('rose') || notesText.includes('oud') || notesText.includes('marigold') ||
      notesText.includes('mitti') || notesText.includes('chandan');

    if (isIndianHeritage || hasFestiveNotes || fragOccasions.some(o => o.includes('festive') || o.includes('wedding'))) {
      formalityBonus += 15;
    }
  } else if (formality === 'casual') {
    if (family.includes('fresh') || family.includes('citrus') || family.includes('aquatic') || (fragrance.intensity >= 4 && fragrance.intensity <= 7)) {
      formalityBonus += 8;
    }
    if (fragrance.intensity >= 9 && family.includes('oud')) {
      formalityBonus -= 8;
    }
  }

  score = Math.min(99, Math.max(10, score + formalityBonus));
  return { score, isDirectMatch, formalityBonus };
}

/**
 * Evaluates time-of-day alignment.
 */
function evaluateTimeOfDayMatch(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext
): { score: number; isDirectMatch: boolean } {
  const timeOfDay = context.temporal.timeOfDay;
  const temporalConf = context.confidence?.temporal ?? 0;

  if (temporalConf === 0 || !timeOfDay) {
    return { score: 70, isDirectMatch: false };
  }

  const fragTime = (fragrance.time_of_day || []).map(t => t.toLowerCase());
  const target = timeOfDay.toLowerCase();

  if (fragTime.length === 0 || fragTime.some(t => t === 'any' || t === 'all day')) {
    return { score: 85, isDirectMatch: true };
  }

  if (fragTime.some(t => t === target)) {
    return { score: 95, isDirectMatch: true };
  }

  // Day vs Morning/Afternoon
  if ((target === 'morning' || target === 'afternoon') && fragTime.some(t => t === 'day')) {
    return { score: 90, isDirectMatch: true };
  }

  // Clashing times
  if ((target === 'morning' || target === 'afternoon') && fragTime.every(t => t === 'night' || t === 'evening')) {
    return { score: 40, isDirectMatch: false };
  }
  if ((target === 'evening' || target === 'night') && fragTime.every(t => t === 'morning' || t === 'day')) {
    return { score: 45, isDirectMatch: false };
  }

  return { score: 65, isDirectMatch: false };
}

/**
 * Evaluates mood alignment against presets and psychological archetypes.
 */
function evaluateMoodMatch(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext
): { score: number; matchedPresetTitle?: string } {
  const moodPrimary = context.mood.primary;
  const moodConf = context.confidence?.mood ?? 0;

  if (moodConf === 0 || !moodPrimary) {
    return { score: 70 };
  }

  const normMood = moodPrimary.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const preset = DAILY_MOOD_PRESETS.find(p => p.id === normMood || p.title.toLowerCase() === moodPrimary.toLowerCase());

  const family = (fragrance.fragrance_family || '').toLowerCase();
  const notesText = [
    ...(fragrance.top_notes || []),
    ...(fragrance.middle_notes || []),
    ...(fragrance.base_notes || [])
  ].join(' ').toLowerCase();

  let score = 70;

  if (preset) {
    let familyMatch = preset.favoriteFamily.some(f => family.includes(f.toLowerCase()));
    let noteMatchCount = 0;
    preset.preferredNotes.forEach(n => {
      if (notesText.includes(n.toLowerCase())) noteMatchCount++;
    });

    const sweetDiff = Math.abs(fragrance.sweetness - preset.sweetness);
    const freshDiff = Math.abs(fragrance.freshness - preset.freshness);
    const intDiff = Math.abs(fragrance.intensity - preset.intensity);
    const paramPenalty = (sweetDiff + freshDiff + intDiff) * 3;

    score = 75;
    if (familyMatch) score += 15;
    score += Math.min(10, noteMatchCount * 5);
    score -= Math.min(20, paramPenalty);

    return {
      score: Math.min(99, Math.max(25, Math.round(score))),
      matchedPresetTitle: preset.title
    };
  }

  // Fallback keyword parsing for freeform moods
  if (normMood.includes('confident')) {
    if (fragrance.intensity >= 6 || notesText.includes('cedar') || notesText.includes('leather') || notesText.includes('vetiver')) {
      score = 90;
    }
  } else if (normMood.includes('sophisticated')) {
    if (family.includes('woody') || family.includes('chypre') || notesText.includes('iris') || notesText.includes('sandalwood')) {
      score = 92;
    }
  } else if (normMood.includes('relaxed') || normMood.includes('calm')) {
    if (family.includes('fresh') || notesText.includes('tea') || notesText.includes('musk') || notesText.includes('lavender')) {
      score = 90;
    }
  } else if (normMood.includes('romantic')) {
    if (notesText.includes('rose') || notesText.includes('vanilla') || notesText.includes('amber') || notesText.includes('jasmine')) {
      score = 92;
    }
  }

  return { score: Math.min(99, Math.max(20, score)) };
}

/**
 * Evaluates performance and endurance against occasion duration and user constraints.
 */
function evaluatePerformanceMatch(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext
): { score: number } {
  let score = 75;

  const duration = context.occasion.duration;
  const longevityPref = context.constraints?.longevityPreference;
  const projectionPref = context.constraints?.projectionPreference;
  const intensityPref = context.constraints?.fragranceIntensityPreference;

  // Duration requirements
  if (duration === 'all_day' || duration === 'workday' || longevityPref === 'long_lasting' || longevityPref === 'all_day') {
    const long = (fragrance.longevity || '').toLowerCase();
    if (long.includes('8') || long.includes('10') || long.includes('12') || long.includes('long') || fragrance.intensity >= 7) {
      score += 15;
    } else if (long.includes('2') || long.includes('3') || fragrance.intensity <= 4) {
      score -= 15;
    }
  }

  // Projection requirements
  const proj = (fragrance.projection || '').toLowerCase();
  if (projectionPref === 'intimate' || context.occasion.type === 'Office') {
    if (proj.includes('intimate') || proj.includes('moderate') || fragrance.intensity <= 6) {
      score += 10;
    } else if (proj.includes('radiant') || proj.includes('beast') || fragrance.intensity >= 9) {
      score -= 15;
    }
  } else if (projectionPref === 'beast_mode' || projectionPref === 'strong' || context.occasion.type === 'Formal') {
    if (proj.includes('strong') || proj.includes('radiant') || fragrance.intensity >= 7) {
      score += 10;
    }
  }

  // Intensity preference
  if (intensityPref === 'subtle' && fragrance.intensity <= 4) score += 10;
  if (intensityPref === 'bold' && fragrance.intensity >= 8) score += 10;

  return { score: Math.min(99, Math.max(30, score)) };
}

/**
 * Builds explainable reasons for a recommendation based on its underlying signals.
 */
function generateCandidateReasons(
  fragrance: Fragrance,
  context: NormalizedOlfactoryContext,
  match: WearRecommendationMatchBreakdown,
  isOwned: boolean,
  isFavorite: boolean
): { reasons: string[]; negativeExplanations: string[] } {
  const reasons: string[] = [];
  const negativeExplanations: string[] = [];

  // 1. Wardrobe & Ownership
  if (isFavorite) {
    reasons.push('One of your personal favorites in your wardrobe.');
  } else if (isOwned) {
    reasons.push('Already part of your owned wardrobe rotation.');
  }

  // 2. Weather & Atmosphere
  const weatherConf = context.confidence?.weather ?? 0;
  if (weatherConf > 0.3 && match.weather !== undefined) {
    const temp = context.weather.temperatureC;
    if (match.weather >= 85) {
      if (temp !== undefined && temp >= 30) {
        reasons.push(`Ideal for the high ${temp}°C heat with crisp, non-cloying diffusion.`);
      } else if (temp !== undefined && temp <= 18) {
        reasons.push(`Provides comforting warmth and elegant sillage in cool ${temp}°C conditions.`);
      } else if (context.weather.humidityPercent && context.weather.humidityPercent >= 65) {
        reasons.push('Rich botanical notes bloom effortlessly in high atmospheric humidity.');
      } else {
        reasons.push('Harmonizes seamlessly with current ambient atmospheric conditions.');
      }
    } else if (match.weather < 60) {
      if (temp !== undefined && temp >= 30) {
        negativeExplanations.push(`Strong composition, but may feel somewhat dense in ${temp}°C heat.`);
      } else if (temp !== undefined && temp <= 18) {
        negativeExplanations.push(`Light profile that may project mildly in ${temp}°C cool air.`);
      }
    }
  }

  // 3. Occasion & Formality
  const occasionConf = context.confidence?.occasion ?? 0;
  if (occasionConf > 0.3 && match.occasion !== undefined) {
    const occ = context.occasion?.type;
    const formality = context.occasion?.formality || context.outfit?.formality;

    if (match.occasion >= 80) {
      if (occ === 'Formal') {
        reasons.push('Distinguished, composed profile suited for a formal evening setting.');
      } else if (occ === 'Festive / Wedding') {
        reasons.push('Opulent and celebratory, pairing naturally with traditional festive attire.');
      } else if (occ === 'Office') {
        reasons.push('Refined and polite with respectful sillage for a professional environment.');
      } else if (occ === 'Date') {
        reasons.push('Intimate and alluring scent trail tailored for a date night.');
      } else if (occ === 'Casual') {
        reasons.push('Effortless and versatile for relaxed everyday wear.');
      } else {
        reasons.push(`Tailored specifically for ${occ} settings.`);
      }
    }
  }

  // 4. Mood
  const moodConf = context.confidence?.mood ?? 0;
  if (moodConf > 0.3 && match.mood !== undefined && match.mood >= 80) {
    const mood = (context.mood.primary || '').toLowerCase();
    if (mood.includes('confident')) {
      reasons.push('Commanding and self-assured character that matches a confident mindset.');
    } else if (mood.includes('calm') || mood.includes('clean')) {
      reasons.push('Provides a serene, clean sanctuary that calms the senses.');
    } else if (mood.includes('romantic')) {
      reasons.push('Soft, seductive floral-amber harmony that enhances romantic ambiance.');
    } else if (mood.includes('indian')) {
      reasons.push('Evokes traditional Indian perfumery heritage with authentic botanicals.');
    } else if (mood.includes('energetic') || mood.includes('fresh')) {
      reasons.push('Luminous and uplifting effervescence that energizes your day.');
    }
  }

  // 5. User Preference Fit
  if (match.preference !== undefined && match.preference >= 80) {
    reasons.push(`Matches your personal affinity for ${(fragrance.fragrance_family || 'fine').toLowerCase()} compositions.`);
  }

  // Fallback if no specific high reasons triggered
  if (reasons.length === 0) {
    reasons.push('High overall compatibility across your current sensory and situational context.');
  }

  return { reasons, negativeExplanations };
}

/**
 * The Central "What Should I Wear?" Olfactory Recommendation Engine.
 */
export function generateWearRecommendations(
  allFragrances: (Fragrance & { vector: number[] })[],
  request: WearRecommendationRequest,
  userCollectionIds: number[] = [],
  userPreferences?: UserPreferences | null
): WearRecommendationResponse {
  const startTime = performance.now();

  // Normalize context if raw input passed
  const isAlreadyNormalized = Boolean(
    request.context &&
    typeof (request.context as any).confidence?.overall === 'number' &&
    (request.context as any).weather &&
    (request.context as any).temporal &&
    (request.context as any).outfit
  );

  const context: NormalizedOlfactoryContext = isAlreadyNormalized
    ? (request.context as NormalizedOlfactoryContext)
    : normalizeOlfactoryContext(request.context as RawOlfactoryContextInput).context;

  const source = request.source || {};
  const isWardrobeOnly = source.wardrobeOnly === true;
  const limit = Math.max(1, request.limit ?? 5);

  // Combine excluded IDs from request and user context
  const excludedIdsSet = new Set<number>();
  (request.excludeFragranceIds || []).forEach(id => {
    const num = typeof id === 'number' ? id : parseInt(id, 10);
    if (!isNaN(num)) excludedIdsSet.add(num);
  });
  (context.user?.dislikedFragranceIds || []).forEach(id => {
    const num = typeof id === 'number' ? id : parseInt(id, 10);
    if (!isNaN(num)) excludedIdsSet.add(num);
  });

  // Combine wardrobe IDs
  const wardrobeIdsSet = new Set<number>(userCollectionIds);
  (context.user?.wardrobeFragranceIds || []).forEach(id => {
    const num = typeof id === 'number' ? id : parseInt(id, 10);
    if (!isNaN(num)) wardrobeIdsSet.add(num);
  });

  const favoriteIdsSet = new Set<number>();
  (context.user?.favoriteFragranceIds || []).forEach(id => {
    const num = typeof id === 'number' ? id : parseInt(id, 10);
    if (!isNaN(num)) favoriteIdsSet.add(num);
  });

  // User preference resolution
  const resolvedPrefs = contextToUserPreferences(context, userPreferences || context.user?.preferences);
  let userPrefVector: number[] | null = null;
  if (context.user?.preferenceVector && context.user.preferenceVector.length === 8) {
    userPrefVector = context.user.preferenceVector;
  } else if (resolvedPrefs) {
    userPrefVector = createUserPreferenceVector(resolvedPrefs);
  }

  const preferredNotes = [
    ...(resolvedPrefs.preferred_notes || []),
    ...(context.constraints?.preferredNotes || [])
  ];

  const avoidNotes = (context.constraints?.avoidNotes || []).map(n => n.toLowerCase());

  // 1. Candidate Retrieval
  let candidates = allFragrances;
  if (isWardrobeOnly) {
    candidates = allFragrances.filter(f => wardrobeIdsSet.has(f.id));
  }

  const totalConsidered = candidates.length;

  // 2. Hard Constraint Filtering
  const filteredCandidates = candidates.filter(frag => {
    // Valid record check
    if (!frag || typeof frag.id !== 'number' || !frag.name) return false;
    if (frag.active === false) return false;

    // Explicit exclusions
    if (excludedIdsSet.has(frag.id)) return false;

    // Avoid notes constraint
    if (avoidNotes.length > 0) {
      const allNotes = [
        ...(frag.top_notes || []),
        ...(frag.middle_notes || []),
        ...(frag.base_notes || [])
      ].join(' ').toLowerCase();

      if (avoidNotes.some(avoid => allNotes.includes(avoid))) {
        return false;
      }
    }

    return true;
  });

  const filteredCount = totalConsidered - filteredCandidates.length;

  // 3. Dynamic Weight Scaling based on Context Confidence
  const conf: ContextConfidence = context.confidence || { overall: 1.0 };
  const wWeather = WEAR_SIGNAL_WEIGHTS.WEATHER * (conf.weather !== undefined ? conf.weather : (context.weather.temperatureC !== undefined ? 1.0 : 0.0));
  const wSeason = WEAR_SIGNAL_WEIGHTS.SEASON * (conf.temporal !== undefined ? conf.temporal : 1.0);
  const wOccasion = WEAR_SIGNAL_WEIGHTS.OCCASION * (conf.occasion !== undefined ? conf.occasion : (context.occasion.type ? 1.0 : 0.0));
  const wMood = WEAR_SIGNAL_WEIGHTS.MOOD * (conf.mood !== undefined ? conf.mood : (context.mood.primary ? 1.0 : 0.0));
  const wTimeOfDay = WEAR_SIGNAL_WEIGHTS.TIME_OF_DAY * (conf.temporal !== undefined ? conf.temporal : (context.temporal.timeOfDay ? 1.0 : 0.0));
  const wPerformance = WEAR_SIGNAL_WEIGHTS.PERFORMANCE;
  const wPreference = WEAR_SIGNAL_WEIGHTS.PREFERENCE;

  const totalActiveWeight = wPreference + wWeather + wSeason + wOccasion + wMood + wTimeOfDay + wPerformance;
  const normW = {
    preference: totalActiveWeight > 0 ? wPreference / totalActiveWeight : 0.3,
    weather: totalActiveWeight > 0 ? wWeather / totalActiveWeight : 0,
    season: totalActiveWeight > 0 ? wSeason / totalActiveWeight : 0,
    occasion: totalActiveWeight > 0 ? wOccasion / totalActiveWeight : 0,
    mood: totalActiveWeight > 0 ? wMood / totalActiveWeight : 0,
    timeOfDay: totalActiveWeight > 0 ? wTimeOfDay / totalActiveWeight : 0,
    performance: totalActiveWeight > 0 ? wPerformance / totalActiveWeight : 0.1
  };

  // 4. Candidate Scoring
  const scoredCandidates: ScoredCandidate[] = filteredCandidates.map(frag => {
    const isOwned = wardrobeIdsSet.has(frag.id);
    const isFavorite = favoriteIdsSet.has(frag.id);

    const prefResult = evaluatePreferenceMatch(frag, userPrefVector, preferredNotes);
    const weatherResult = evaluateWeatherMatch(frag, context);
    const seasonResult = evaluateSeasonMatch(frag, context);
    const occasionResult = evaluateOccasionMatch(frag, context);
    const timeOfDayResult = evaluateTimeOfDayMatch(frag, context);
    const moodResult = evaluateMoodMatch(frag, context);
    const perfResult = evaluatePerformanceMatch(frag, context);

    const matchBreakdown: WearRecommendationMatchBreakdown = {
      preference: prefResult.score,
      olfactory: prefResult.score,
      weather: weatherResult.score,
      season: seasonResult.score,
      occasion: occasionResult.score,
      timeOfDay: timeOfDayResult.score,
      mood: moodResult.score,
      performance: perfResult.score,
      wardrobe: isFavorite ? 100 : (isOwned ? 90 : 70)
    };

    let totalScore = (
      (normW.preference * prefResult.score) +
      (normW.weather * weatherResult.score) +
      (normW.season * seasonResult.score) +
      (normW.occasion * occasionResult.score) +
      (normW.mood * moodResult.score) +
      (normW.timeOfDay * timeOfDayResult.score) +
      (normW.performance * perfResult.score)
    );

    // Subtle wardrobe affinity boost in full catalog mode (+2 for owned, +4 for favorite)
    if (!isWardrobeOnly) {
      if (isFavorite) totalScore += 4;
      else if (isOwned) totalScore += 2;
    }

    const clampedTotal = Math.min(99, Math.max(10, Math.round(totalScore)));

    const { reasons, negativeExplanations } = generateCandidateReasons(
      frag,
      context,
      matchBreakdown,
      isOwned,
      isFavorite
    );

    return {
      fragrance: frag,
      totalScore: clampedTotal,
      match: matchBreakdown,
      reasons,
      negativeExplanations,
      isOwned,
      isFavorite
    };
  });

  // 5. Deterministic Initial Ranking
  // Sort descending by totalScore, tie-break ascending by fragrance.id
  scoredCandidates.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return a.fragrance.id - b.fragrance.id;
  });

  // 6. Deterministic Olfactory Diversity Pass
  const selected: ScoredCandidate[] = [];
  let diversityApplied = false;

  if (scoredCandidates.length <= limit) {
    selected.push(...scoredCandidates);
  } else {
    // Always preserve Rank 1 (the absolute best match)
    selected.push(scoredCandidates[0]);
    const selectedIds = new Set<number>([scoredCandidates[0].fragrance.id]);
    const clusterCounts = new Map<number, number>();
    const c0 = scoredCandidates[0].fragrance.cluster_id ?? 0;
    clusterCounts.set(c0, 1);

    for (let slot = 1; slot < limit; slot++) {
      let candidateFound = false;

      // Check remaining candidates in score order
      for (let i = 1; i < scoredCandidates.length; i++) {
        const candidate = scoredCandidates[i];
        if (selectedIds.has(candidate.fragrance.id)) continue;

        const candidateCluster = candidate.fragrance.cluster_id ?? 0;
        const currentClusterCount = clusterCounts.get(candidateCluster) || 0;

        // If this cluster already has >= 2 representatives, check if a diverse alternative exists within tolerance
        if (currentClusterCount >= 2) {
          let alternative: ScoredCandidate | null = null;
          for (let j = i + 1; j < Math.min(scoredCandidates.length, i + 12); j++) {
            const alt = scoredCandidates[j];
            if (selectedIds.has(alt.fragrance.id)) continue;
            const altCluster = alt.fragrance.cluster_id ?? 0;

            if ((clusterCounts.get(altCluster) || 0) < 2 && (candidate.totalScore - alt.totalScore) <= DIVERSITY_SCORE_TOLERANCE) {
              // Check vector distinctness against already selected items
              const maxSimilarity = Math.max(...selected.map(s => cosineSimilarity(s.fragrance.vector, alt.fragrance.vector)));
              if (maxSimilarity <= DIVERSITY_COSINE_THRESHOLD) {
                alternative = alt;
                break;
              }
            }
          }

          if (alternative) {
            selected.push(alternative);
            selectedIds.add(alternative.fragrance.id);
            const altC = alternative.fragrance.cluster_id ?? 0;
            clusterCounts.set(altC, (clusterCounts.get(altC) || 0) + 1);
            candidateFound = true;
            diversityApplied = true;
            alternative.reasons.push('Offers an olfactory profile distinct from the rest of your lineup.');
            break;
          }
        }

        // Otherwise select standard highest-scoring candidate
        selected.push(candidate);
        selectedIds.add(candidate.fragrance.id);
        clusterCounts.set(candidateCluster, currentClusterCount + 1);
        candidateFound = true;
        break;
      }

      if (!candidateFound) break;
    }
  }

  // 7. Format Recommendations
  const contextSummaryText = context.explanation?.summary
    ? context.explanation.summary
    : generateContextExplanation(context).summary;

  const recommendations: WearRecommendation[] = selected.map((c, index) => ({
    fragranceId: c.fragrance.id,
    fragrance: c.fragrance,
    rank: index + 1,
    score: c.totalScore,
    match: c.match,
    reasons: c.reasons,
    negativeExplanations: c.negativeExplanations.length > 0 ? c.negativeExplanations : undefined,
    contextSummary: context.explanation?.factors || [contextSummaryText],
    ownership: {
      owned: c.isOwned,
      favorite: c.isFavorite
    }
  }));

  const endTime = performance.now();

  return {
    recommendations,
    contextSummary: {
      summary: contextSummaryText,
      factors: context.explanation?.factors || [contextSummaryText]
    },
    metadata: {
      totalCandidatesConsidered: totalConsidered,
      filteredCount,
      sourceMode: isWardrobeOnly ? 'wardrobe_only' : 'full_catalog',
      executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
      diversityApplied,
      confidence: conf
    }
  };
}
