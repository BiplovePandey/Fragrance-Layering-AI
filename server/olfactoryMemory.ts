import {
  OlfactoryBehaviorEvent,
  OlfactoryBehaviorEventType,
  OlfactoryPreferenceEvidence,
  FragranceBehaviorSummary,
  ContextualBehaviorPattern,
  OlfactoryMemorySnapshot,
  NormalizedOlfactoryContext,
  Fragrance
} from '../src/types.js';
import { dbService } from './db.js';
import { FEATURE_NAMES, FeatureKey } from './ml/features.js';

export const ALLOWED_EVENT_TYPES: Set<OlfactoryBehaviorEventType> = new Set([
  'RECOMMENDATION_SHOWN',
  'RECOMMENDATION_OPENED',
  'RECOMMENDATION_SAVED',
  'RECOMMENDATION_DISMISSED',
  'FRAGRANCE_VIEWED',
  'FRAGRANCE_WORN',
  'FRAGRANCE_RATED',
  'FRAGRANCE_ADDED_TO_WARDROBE',
  'FRAGRANCE_REMOVED_FROM_WARDROBE',
  'SOTD_SELECTED',
  'LAYERING_EXPERIMENT_CREATED',
  'LAYERING_EXPERIMENT_RATED',
  'JOURNAL_ENTRY_CREATED',
  'FRAGRANCE_SHARED',
  'USER_PREFERENCE_UPDATED'
]);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates an incoming behavioral event against structural constraints,
 * ID validity, context ranges, and privacy/payload limits.
 */
export function validateBehaviorEvent(
  event: any,
  validFragranceIds?: Set<number>
): ValidationResult {
  const errors: string[] = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event payload must be a non-null object'] };
  }

  // 1. ID validation
  if (!event.id || typeof event.id !== 'string' || !event.id.trim()) {
    errors.push('Event must have a valid non-empty string id');
  }

  // 2. User ID validation
  if (typeof event.userId !== 'number' || isNaN(event.userId) || event.userId <= 0) {
    errors.push('Event userId must be a positive number');
  }

  // 3. Event Type validation
  if (!event.eventType || !ALLOWED_EVENT_TYPES.has(event.eventType)) {
    errors.push(`Invalid eventType "${event.eventType}". Must be one of allowed OlfactoryBehaviorEventType values`);
  }

  // 4. Source validation
  if (!event.source || typeof event.source !== 'string' || !event.source.trim()) {
    errors.push('Event must specify a non-empty source string');
  }

  // 5. Fragrance ID validation (if provided)
  if (event.fragranceId !== undefined && event.fragranceId !== null) {
    if (typeof event.fragranceId !== 'number' || isNaN(event.fragranceId) || event.fragranceId <= 0) {
      errors.push('fragranceId must be a positive integer if specified');
    } else if (validFragranceIds && !validFragranceIds.has(event.fragranceId)) {
      errors.push(`Fragrance with ID ${event.fragranceId} does not exist in catalog`);
    }
  }

  // 6. Context snapshot validation (if provided)
  if (event.contextSnapshot !== undefined && event.contextSnapshot !== null) {
    if (typeof event.contextSnapshot !== 'object') {
      errors.push('contextSnapshot must be an object');
    } else {
      const cs = event.contextSnapshot as Partial<NormalizedOlfactoryContext>;
      if (cs.weather?.temperatureC !== undefined) {
        const temp = cs.weather.temperatureC;
        if (typeof temp !== 'number' || temp < -50 || temp > 65) {
          errors.push(`contextSnapshot weather temperatureC out of physical bounds (-50°C to 65°C): ${temp}`);
        }
      }
      if (cs.weather?.humidityPercent !== undefined) {
        const hum = cs.weather.humidityPercent;
        if (typeof hum !== 'number' || hum < 0 || hum > 100) {
          errors.push(`contextSnapshot weather humidityPercent out of bounds (0% to 100%): ${hum}`);
        }
      }
    }
  }

  // 7. Metadata validation and size bounds (max 16KB serialized)
  if (event.metadata !== undefined && event.metadata !== null) {
    if (typeof event.metadata !== 'object') {
      errors.push('metadata must be a JSON object');
    } else {
      try {
        const metaStr = JSON.stringify(event.metadata);
        if (metaStr.length > 16384) {
          errors.push(`metadata exceeds maximum allowed size of 16KB (${metaStr.length} bytes)`);
        }
      } catch (err: any) {
        errors.push(`metadata is not JSON-serializable: ${err.message}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculates decayed evidence strength based on half-life decay.
 * Note: Historical records in SQLite remain immutable; decay is applied dynamically during aggregation.
 */
export function calculateDecayedStrength(
  baseStrength: number,
  lastObservedIso: string,
  halfLifeDays: number = 30,
  nowMs?: number
): number {
  const current = nowMs !== undefined ? nowMs : Date.now();
  const observed = Date.parse(lastObservedIso);
  if (isNaN(observed) || observed > current) return baseStrength;

  const elapsedDays = (current - observed) / (1000 * 60 * 60 * 24);
  const decayFactor = Math.pow(0.5, elapsedDays / halfLifeDays);
  return parseFloat((baseStrength * decayFactor).toFixed(4));
}

export class OlfactoryMemoryService {
  /**
   * Records a behavioral event after validation.
   */
  recordEvent(event: OlfactoryBehaviorEvent): { success: boolean; eventId: string; inserted: boolean; duplicate: boolean; errors?: string[] } {
    const allFragrances = dbService.getAllFragrances();
    const validIds = new Set(allFragrances.map(f => f.id));

    const validation = validateBehaviorEvent(event, validIds);
    if (!validation.valid) {
      return {
        success: false,
        eventId: event.id,
        inserted: false,
        duplicate: false,
        errors: validation.errors
      };
    }

    const res = dbService.recordBehaviorEvent(event);
    return {
      success: true,
      eventId: event.id,
      inserted: res.inserted,
      duplicate: res.duplicate
    };
  }

  /**
   * Records a batch of behavioral events with individual validation.
   */
  recordBatch(events: OlfactoryBehaviorEvent[]): {
    success: boolean;
    count: number;
    inserted: number;
    duplicates: number;
    rejected: number;
    errors: string[];
  } {
    if (!Array.isArray(events)) {
      return {
        success: false,
        count: 0,
        inserted: 0,
        duplicates: 0,
        rejected: 0,
        errors: ['events must be an array']
      };
    }

    const allFragrances = dbService.getAllFragrances();
    const validIds = new Set(allFragrances.map(f => f.id));
    const validEvents: OlfactoryBehaviorEvent[] = [];
    const allErrors: string[] = [];
    let rejected = 0;

    for (const ev of events) {
      const v = validateBehaviorEvent(ev, validIds);
      if (v.valid) {
        validEvents.push(ev);
      } else {
        rejected++;
        allErrors.push(`Event ${ev?.id || 'unknown'}: ${v.errors.join('; ')}`);
      }
    }

    const batchRes = dbService.recordBehaviorEventsBatch(validEvents);
    return {
      success: rejected === 0,
      count: events.length,
      inserted: batchRes.inserted,
      duplicates: batchRes.duplicates,
      rejected,
      errors: allErrors
    };
  }

  /**
   * Synthesizes the complete OlfactoryMemorySnapshot for a user.
   * Completely transparent, deterministic, and preserves explicit vs. implicit separation.
   */
  getMemorySnapshot(userId: number = 1): OlfactoryMemorySnapshot {
    const startTime = Date.now();
    const allFragrances = dbService.getAllFragrances();
    const fragranceMap = new Map<number, Fragrance & { vector: number[] }>();
    allFragrances.forEach(f => fragranceMap.set(f.id, f));

    const events = dbService.getAllBehaviorEventsForAggregation(userId, 1000);
    const userPrefs = dbService.getUserPreferences(userId);

    // Empty state check
    if (events.length === 0 && (!userPrefs.favorite_family || userPrefs.favorite_family.length === 0) && (!userPrefs.preferred_notes || userPrefs.preferred_notes.length === 0)) {
      return {
        userId,
        generatedAt: new Date().toISOString(),
        totalEvents: 0,
        explicitSignals: [],
        implicitSignals: [],
        topPositiveSignals: [],
        topNegativeSignals: [],
        contextPatterns: [],
        frequentlyWornFragrances: [],
        frequentlySavedFragrances: [],
        recentlyRejectedFragrances: [],
        confidence: 0,
        diagnostics: {
          eventsProcessed: 0,
          durationMs: Date.now() - startTime
        }
      };
    }

    // 1. Collect EXPLICIT evidence
    const explicitSignals: OlfactoryPreferenceEvidence[] = [];

    // From user_preferences
    if (userPrefs.favorite_family && Array.isArray(userPrefs.favorite_family)) {
      for (const fam of userPrefs.favorite_family) {
        explicitSignals.push({
          userId,
          dimension: `family:${fam}`,
          value: 'preferred',
          direction: 'positive',
          evidenceType: 'EXPLICIT',
          evidenceStrength: 0.95,
          confidence: 0.90,
          evidenceCount: 1,
          lastObserved: new Date().toISOString(),
          source: 'user_preferences.favorite_family'
        });
      }
    }

    if (userPrefs.preferred_notes && Array.isArray(userPrefs.preferred_notes)) {
      for (const note of userPrefs.preferred_notes) {
        explicitSignals.push({
          userId,
          dimension: `note:${note}`,
          value: 'preferred',
          direction: 'positive',
          evidenceType: 'EXPLICIT',
          evidenceStrength: 0.90,
          confidence: 0.85,
          evidenceCount: 1,
          lastObserved: new Date().toISOString(),
          source: 'user_preferences.preferred_notes'
        });
      }
    }

    // From explicit FRAGRANCE_RATED events
    const ratingsMap = new Map<number, { count: number; sum: number; lastObserved: string }>();
    for (const ev of events) {
      if (ev.eventType === 'FRAGRANCE_RATED' && ev.fragranceId) {
        const rating = (ev.metadata?.rating !== undefined) ? Number(ev.metadata.rating) : 5;
        const entry = ratingsMap.get(ev.fragranceId) || { count: 0, sum: 0, lastObserved: ev.timestamp };
        entry.count++;
        entry.sum += rating;
        if (entry.lastObserved < ev.timestamp) entry.lastObserved = ev.timestamp;
        ratingsMap.set(ev.fragranceId, entry);
      }
    }

    for (const [fragId, data] of ratingsMap.entries()) {
      const frag = fragranceMap.get(fragId);
      if (!frag) continue;
      const avg = data.sum / data.count;
      if (avg >= 4) {
        explicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: avg.toFixed(1),
          direction: 'positive',
          evidenceType: 'EXPLICIT',
          evidenceStrength: Math.min(1.0, 0.70 + (avg - 4) * 0.25),
          confidence: Math.min(1.0, data.count * 0.35 + 0.3),
          evidenceCount: data.count,
          lastObserved: data.lastObserved,
          source: `FRAGRANCE_RATED (avg ${avg.toFixed(1)}/5, ${data.count}x)`
        });
        if (frag.fragrance_family) {
          explicitSignals.push({
            userId,
            dimension: `family:${frag.fragrance_family}`,
            value: 'rated_high',
            direction: 'positive',
            evidenceType: 'EXPLICIT',
            evidenceStrength: 0.80,
            confidence: 0.75,
            evidenceCount: data.count,
            lastObserved: data.lastObserved,
            source: `FRAGRANCE_RATED on ${frag.name}`
          });
        }
      } else if (avg <= 2) {
        explicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: avg.toFixed(1),
          direction: 'negative',
          evidenceType: 'EXPLICIT',
          evidenceStrength: Math.min(1.0, 0.70 + (2 - avg) * 0.25),
          confidence: Math.min(1.0, data.count * 0.35 + 0.3),
          evidenceCount: data.count,
          lastObserved: data.lastObserved,
          source: `FRAGRANCE_RATED low (avg ${avg.toFixed(1)}/5, ${data.count}x)`
        });
        if (frag.fragrance_family) {
          explicitSignals.push({
            userId,
            dimension: `family:${frag.fragrance_family}`,
            value: 'rated_low',
            direction: 'negative',
            evidenceType: 'EXPLICIT',
            evidenceStrength: 0.75,
            confidence: 0.65,
            evidenceCount: data.count,
            lastObserved: data.lastObserved,
            source: `FRAGRANCE_RATED low on ${frag.name}`
          });
        }
      }
    }

    // 2. Collect IMPLICIT evidence
    // Rules:
    // - RECOMMENDATION_SHOWN: NEVER creates preference evidence!
    // - FRAGRANCE_VIEWED: weak evidence (0.10)
    // - RECOMMENDATION_OPENED: weak evidence (0.25)
    // - RECOMMENDATION_SAVED / FRAGRANCE_ADDED_TO_WARDROBE: moderate evidence (0.50 - 0.70)
    // - FRAGRANCE_WORN / SOTD_SELECTED: moderate/strong evidence (0.45 - 0.85)
    // - RECOMMENDATION_DISMISSED: negative evidence (0.35)

    const fragranceCounts = new Map<number, {
      views: number;
      opens: number;
      saves: number;
      wears: number;
      dismisses: number;
      lastObserved: string;
    }>();

    for (const ev of events) {
      if (!ev.fragranceId) continue;
      const cur = fragranceCounts.get(ev.fragranceId) || {
        views: 0,
        opens: 0,
        saves: 0,
        wears: 0,
        dismisses: 0,
        lastObserved: ev.timestamp
      };

      if (ev.eventType === 'FRAGRANCE_VIEWED') cur.views++;
      else if (ev.eventType === 'RECOMMENDATION_OPENED') cur.opens++;
      else if (ev.eventType === 'RECOMMENDATION_SAVED' || ev.eventType === 'FRAGRANCE_ADDED_TO_WARDROBE') cur.saves++;
      else if (ev.eventType === 'FRAGRANCE_WORN' || ev.eventType === 'SOTD_SELECTED') cur.wears++;
      else if (ev.eventType === 'RECOMMENDATION_DISMISSED') cur.dismisses++;

      if (ev.timestamp > cur.lastObserved) cur.lastObserved = ev.timestamp;
      fragranceCounts.set(ev.fragranceId, cur);
    }

    const implicitSignals: OlfactoryPreferenceEvidence[] = [];

    // Family and note affinity accumulator
    const familyAffinity = new Map<string, { wears: number; saves: number; opens: number; views: number; dismisses: number; lastObserved: string }>();
    const vectorAffinity = new Map<FeatureKey, { weightedSum: number; totalWeight: number; count: number; lastObserved: string }>();

    for (const [fragId, counts] of fragranceCounts.entries()) {
      const frag = fragranceMap.get(fragId);
      if (!frag) continue;

      // Calculate implicit strength for this fragrance
      // Wears have highest weight, then saves, then opens, then views.
      // Notice: views have minimal weight!
      if (counts.wears > 0) {
        const wearStrength = Math.min(0.95, 0.45 + (counts.wears - 1) * 0.15);
        implicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: `${counts.wears} wears`,
          direction: 'positive',
          evidenceType: 'IMPLICIT',
          evidenceStrength: parseFloat(wearStrength.toFixed(3)),
          confidence: Math.min(1.0, 0.4 + counts.wears * 0.15),
          evidenceCount: counts.wears,
          lastObserved: counts.lastObserved,
          source: `FRAGRANCE_WORN x${counts.wears}`
        });
      } else if (counts.saves > 0) {
        const saveStrength = Math.min(0.80, 0.50 + (counts.saves - 1) * 0.10);
        implicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: `${counts.saves} saves`,
          direction: 'positive',
          evidenceType: 'IMPLICIT',
          evidenceStrength: parseFloat(saveStrength.toFixed(3)),
          confidence: Math.min(0.75, 0.35 + counts.saves * 0.10),
          evidenceCount: counts.saves,
          lastObserved: counts.lastObserved,
          source: `RECOMMENDATION_SAVED x${counts.saves}`
        });
      } else if (counts.opens > 0) {
        const openStrength = Math.min(0.40, 0.20 + counts.opens * 0.05);
        implicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: `${counts.opens} opens`,
          direction: 'positive',
          evidenceType: 'IMPLICIT',
          evidenceStrength: parseFloat(openStrength.toFixed(3)),
          confidence: Math.min(0.50, 0.15 + counts.opens * 0.05),
          evidenceCount: counts.opens,
          lastObserved: counts.lastObserved,
          source: `RECOMMENDATION_OPENED x${counts.opens}`
        });
      } else if (counts.views > 0) {
        const viewStrength = Math.min(0.20, 0.08 + counts.views * 0.02);
        implicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: `${counts.views} views`,
          direction: 'positive',
          evidenceType: 'IMPLICIT',
          evidenceStrength: parseFloat(viewStrength.toFixed(3)),
          confidence: Math.min(0.30, 0.10 + counts.views * 0.02),
          evidenceCount: counts.views,
          lastObserved: counts.lastObserved,
          source: `FRAGRANCE_VIEWED x${counts.views}`
        });
      }

      // Negative dismissal signal
      if (counts.dismisses > 0 && counts.wears === 0 && counts.saves === 0) {
        implicitSignals.push({
          userId,
          dimension: `fragrance:${frag.name}`,
          value: `${counts.dismisses} dismissals`,
          direction: 'negative',
          evidenceType: 'IMPLICIT',
          evidenceStrength: Math.min(0.60, 0.30 + counts.dismisses * 0.10),
          confidence: Math.min(0.65, 0.25 + counts.dismisses * 0.15),
          evidenceCount: counts.dismisses,
          lastObserved: counts.lastObserved,
          source: `RECOMMENDATION_DISMISSED x${counts.dismisses}`
        });
      }

      // Accumulate family metrics
      const fam = frag.fragrance_family;
      if (fam) {
        const famEntry = familyAffinity.get(fam) || { wears: 0, saves: 0, opens: 0, views: 0, dismisses: 0, lastObserved: counts.lastObserved };
        famEntry.wears += counts.wears;
        famEntry.saves += counts.saves;
        famEntry.opens += counts.opens;
        famEntry.views += counts.views;
        famEntry.dismisses += counts.dismisses;
        if (counts.lastObserved > famEntry.lastObserved) famEntry.lastObserved = counts.lastObserved;
        familyAffinity.set(fam, famEntry);
      }

      // Accumulate 8D vector affinity
      if (frag.vector && Array.isArray(frag.vector) && frag.vector.length === 8) {
        const weight = counts.wears * 3 + counts.saves * 2 + counts.opens * 1 + counts.views * 0.2;
        if (weight > 0) {
          FEATURE_NAMES.forEach((key, idx) => {
            const val = frag.vector[idx];
            const entry = vectorAffinity.get(key) || { weightedSum: 0, totalWeight: 0, count: 0, lastObserved: counts.lastObserved };
            entry.weightedSum += val * weight;
            entry.totalWeight += weight;
            entry.count += (counts.wears + counts.saves + counts.opens + counts.views);
            if (counts.lastObserved > entry.lastObserved) entry.lastObserved = counts.lastObserved;
            vectorAffinity.set(key, entry);
          });
        }
      }
    }

    // Convert family affinity to implicit signals
    for (const [fam, data] of familyAffinity.entries()) {
      if (data.wears >= 1 || data.saves >= 2) {
        const strength = Math.min(0.90, 0.40 + data.wears * 0.12 + data.saves * 0.08);
        implicitSignals.push({
          userId,
          dimension: `family:${fam}`,
          value: `${data.wears} wears, ${data.saves} saves`,
          direction: 'positive',
          evidenceType: 'IMPLICIT',
          evidenceStrength: parseFloat(strength.toFixed(3)),
          confidence: Math.min(0.95, (data.wears * 2 + data.saves) / 5),
          evidenceCount: data.wears + data.saves,
          lastObserved: data.lastObserved,
          source: `Observed activity in ${fam}`
        });
      } else if (data.dismisses >= 2 && data.wears === 0 && data.saves === 0) {
        implicitSignals.push({
          userId,
          dimension: `family:${fam}`,
          value: `${data.dismisses} dismissals`,
          direction: 'negative',
          evidenceType: 'IMPLICIT',
          evidenceStrength: 0.45,
          confidence: 0.50,
          evidenceCount: data.dismisses,
          lastObserved: data.lastObserved,
          source: `Frequent dismissals in ${fam}`
        });
      }
    }

    // Top Positive and Top Negative signals
    const allEvidence = [...explicitSignals, ...implicitSignals];
    const topPositiveSignals = allEvidence
      .filter(e => e.direction === 'positive')
      .sort((a, b) => b.evidenceStrength * b.confidence - a.evidenceStrength * a.confidence)
      .slice(0, 10);

    const topNegativeSignals = allEvidence
      .filter(e => e.direction === 'negative')
      .sort((a, b) => b.evidenceStrength * b.confidence - a.evidenceStrength * a.confidence)
      .slice(0, 10);

    // 3. Contextual Behavior Patterns
    const contextPatterns: ContextualBehaviorPattern[] = [];
    const contextEvents = events.filter(e =>
      (e.eventType === 'FRAGRANCE_WORN' || e.eventType === 'SOTD_SELECTED' || e.eventType === 'RECOMMENDATION_OPENED') &&
      e.contextSnapshot &&
      e.fragranceId
    );

    const contextGroups = new Map<string, {
      dimension: 'weather_band' | 'season' | 'occasion' | 'time_of_day' | 'outfit_formality' | 'environment';
      value: string;
      families: Map<string, number>;
      notes: Map<string, number>;
      totalOccurrences: number;
      lastObserved: string;
    }>();

    for (const ev of contextEvents) {
      const snap = ev.contextSnapshot!;
      const frag = fragranceMap.get(ev.fragranceId!);
      if (!frag) continue;

      const family = frag.fragrance_family;
      const topNote = (frag.top_notes && frag.top_notes[0]) || (frag.base_notes && frag.base_notes[0]);

      // Check occasion
      if (snap.occasion?.type) {
        const occ = String(snap.occasion.type);
        const key = `occasion:${occ}`;
        const group = contextGroups.get(key) || {
          dimension: 'occasion',
          value: occ,
          families: new Map(),
          notes: new Map(),
          totalOccurrences: 0,
          lastObserved: ev.timestamp
        };
        group.totalOccurrences++;
        if (family) group.families.set(family, (group.families.get(family) || 0) + 1);
        if (topNote) group.notes.set(topNote, (group.notes.get(topNote) || 0) + 1);
        if (ev.timestamp > group.lastObserved) group.lastObserved = ev.timestamp;
        contextGroups.set(key, group);
      }

      // Check time_of_day
      if (snap.temporal?.timeOfDay) {
        const tod = String(snap.temporal.timeOfDay);
        const key = `time_of_day:${tod}`;
        const group = contextGroups.get(key) || {
          dimension: 'time_of_day',
          value: tod,
          families: new Map(),
          notes: new Map(),
          totalOccurrences: 0,
          lastObserved: ev.timestamp
        };
        group.totalOccurrences++;
        if (family) group.families.set(family, (group.families.get(family) || 0) + 1);
        if (topNote) group.notes.set(topNote, (group.notes.get(topNote) || 0) + 1);
        if (ev.timestamp > group.lastObserved) group.lastObserved = ev.timestamp;
        contextGroups.set(key, group);
      }

      // Check weather band
      if (snap.weather?.temperatureC !== undefined) {
        const temp = snap.weather.temperatureC;
        let band = 'moderate (20-30°C)';
        if (temp >= 30) band = 'high_heat (>30°C)';
        else if (temp <= 19) band = 'cool (<20°C)';

        const key = `weather_band:${band}`;
        const group = contextGroups.get(key) || {
          dimension: 'weather_band',
          value: band,
          families: new Map(),
          notes: new Map(),
          totalOccurrences: 0,
          lastObserved: ev.timestamp
        };
        group.totalOccurrences++;
        if (family) group.families.set(family, (group.families.get(family) || 0) + 1);
        if (topNote) group.notes.set(topNote, (group.notes.get(topNote) || 0) + 1);
        if (ev.timestamp > group.lastObserved) group.lastObserved = ev.timestamp;
        contextGroups.set(key, group);
      }
    }

    for (const group of contextGroups.values()) {
      const famArr = Array.from(group.families.entries()).map(([f, c]) => ({ family: f, count: c })).sort((a, b) => b.count - a.count);
      const notesArr = Array.from(group.notes.entries()).map(([n, c]) => ({ note: n, count: c })).sort((a, b) => b.count - a.count);
      contextPatterns.push({
        dimension: group.dimension,
        value: group.value,
        associatedFamilies: famArr,
        dominantNotes: notesArr,
        totalOccurrences: group.totalOccurrences,
        lastObserved: group.lastObserved
      });
    }

    // 4. Fragrance-level behavior summaries
    const fragranceSummaries: FragranceBehaviorSummary[] = [];
    const ownedIds = new Set(dbService.getUserCollection(userId));

    for (const [fragId, counts] of fragranceCounts.entries()) {
      const frag = fragranceMap.get(fragId);
      if (!frag) continue;
      const ratingData = ratingsMap.get(fragId);
      fragranceSummaries.push({
        fragranceId: frag.id,
        fragranceName: frag.name,
        brandName: frag.brand_name || frag.brand || 'Unknown',
        fragranceFamily: frag.fragrance_family,
        views: counts.views,
        opens: counts.opens,
        saves: counts.saves,
        wears: counts.wears,
        ratingsCount: ratingData ? ratingData.count : 0,
        averageRating: ratingData && ratingData.count > 0 ? parseFloat((ratingData.sum / ratingData.count).toFixed(1)) : undefined,
        sotdCount: counts.wears,
        isOwned: ownedIds.has(frag.id),
        lastInteracted: counts.lastObserved,
        observedVector: frag.vector
      });
    }

    const frequentlyWornFragrances = fragranceSummaries
      .filter(f => f.wears > 0)
      .sort((a, b) => b.wears - a.wears || b.lastInteracted.localeCompare(a.lastInteracted))
      .slice(0, 5);

    const frequentlySavedFragrances = fragranceSummaries
      .filter(f => f.saves > 0)
      .sort((a, b) => b.saves - a.saves || b.lastInteracted.localeCompare(a.lastInteracted))
      .slice(0, 5);

    const recentlyRejectedFragrances = fragranceSummaries
      .filter(f => (fragranceCounts.get(f.fragranceId)?.dismisses || 0) > 0)
      .sort((a, b) => (fragranceCounts.get(b.fragranceId)?.dismisses || 0) - (fragranceCounts.get(a.fragranceId)?.dismisses || 0))
      .slice(0, 5);

    // Global memory confidence calculation:
    // Scale confidence based on event richness:
    // - 0 events: 0.0
    // - 1-5 events: 0.15 - 0.40
    // - 6-20 events: 0.40 - 0.75
    // - 20+ events: 0.75 - 0.95
    let calculatedConfidence = 0.0;
    if (events.length > 0 || explicitSignals.length > 0) {
      const explicitFactor = Math.min(0.40, explicitSignals.length * 0.10);
      const eventFactor = Math.min(0.55, events.length / 25);
      calculatedConfidence = parseFloat((explicitFactor + eventFactor).toFixed(2));
    }

    const oldestEvent = events.length > 0 ? events[events.length - 1].timestamp : undefined;
    const newestEvent = events.length > 0 ? events[0].timestamp : undefined;

    return {
      userId,
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      explicitSignals,
      implicitSignals,
      topPositiveSignals,
      topNegativeSignals,
      contextPatterns,
      frequentlyWornFragrances,
      frequentlySavedFragrances,
      recentlyRejectedFragrances,
      confidence: calculatedConfidence,
      diagnostics: {
        eventsProcessed: events.length,
        durationMs: Date.now() - startTime,
        oldestEventAt: oldestEvent,
        newestEventAt: newestEvent
      }
    };
  }
}

export const olfactoryMemoryService = new OlfactoryMemoryService();
