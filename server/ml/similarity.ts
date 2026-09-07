import { Fragrance, UserPreferences, RecommendationScore } from '../../src/types.js';
import { createUserPreferenceVector } from './features.js';

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dotProduct / denominator;
}

/**
 * Calculates single fragrance recommendation score using user preferences:
 * 30% preference similarity (vector cosine similarity)
 * 25% season match
 * 20% occasion match
 * 15% note similarity
 * 10% intensity match
 */
export function calculateFragranceRecommendationScore(
  fragrance: Fragrance & { vector: number[] },
  preferences: UserPreferences
): RecommendationScore {
  const prefVector = createUserPreferenceVector(preferences);

  // 1. Vector cosine similarity (0 - 100)
  const cosSim = Math.max(0, cosineSimilarity(prefVector, fragrance.vector));
  const prefSimilarityScore = Math.round(cosSim * 100);

  // 2. Season match (0 - 100)
  let seasonMatch = 50; // default baseline if season not specified
  if (preferences.season) {
    const hasSeason = (fragrance.season || []).some(s => s.toLowerCase() === preferences.season?.toLowerCase());
    seasonMatch = hasSeason ? 100 : 20;
  }

  // 3. Occasion match (0 - 100)
  let occasionMatch = 50;
  if (preferences.occasion) {
    const hasOccasion = (fragrance.occasion || []).some(o => o.toLowerCase() === preferences.occasion?.toLowerCase());
    occasionMatch = hasOccasion ? 100 : 30;
  }

  // 4. Note similarity (0 - 100)
  let noteSimilarity = 50;
  if (preferences.preferred_notes && preferences.preferred_notes.length > 0) {
    const allFragNotes = [
      ...fragrance.top_notes,
      ...fragrance.middle_notes,
      ...fragrance.base_notes
    ].map(n => n.toLowerCase());

    let matchCount = 0;
    for (const note of preferences.preferred_notes) {
      if (allFragNotes.some(fn => fn.includes(note.toLowerCase()))) {
        matchCount++;
      }
    }
    noteSimilarity = Math.min(100, Math.round((matchCount / preferences.preferred_notes.length) * 100));
  }

  // 5. Intensity match (0 - 100)
  const targetIntensity = preferences.intensity || 5;
  const intensityDiff = Math.abs(fragrance.intensity - targetIntensity);
  const intensityMatch = Math.max(0, 100 - (intensityDiff * 12));

  // Weighted total:
  // 30% preference + 25% season + 20% occasion + 15% note + 10% intensity
  const total = Math.round(
    (0.30 * prefSimilarityScore) +
    (0.25 * seasonMatch) +
    (0.20 * occasionMatch) +
    (0.15 * noteSimilarity) +
    (0.10 * intensityMatch)
  );

  return {
    fragrance,
    total_score: Math.min(99, Math.max(10, total)),
    breakdown: {
      preference_similarity: prefSimilarityScore,
      season_match: seasonMatch,
      occasion_match: occasionMatch,
      note_similarity: noteSimilarity,
      intensity_match: Math.round(intensityMatch)
    }
  };
}

export function recommendTopFragrances(
  fragrances: (Fragrance & { vector: number[] })[],
  preferences: UserPreferences,
  limit: number = 6
): RecommendationScore[] {
  let filtered = fragrances;

  // Gender filter if desired
  if (preferences.preferred_gender && preferences.preferred_gender !== 'all') {
    filtered = fragrances.filter(f => f.gender === 'unisex' || f.gender === preferences.preferred_gender);
    if (filtered.length < 3) filtered = fragrances; // fallback if too strict
  }

  // Origin filter
  if (preferences.origin_filter === 'indian') {
    const originFiltered = filtered.filter(f => (f.origin_style || '').toLowerCase().includes('indian') || (f.brand_country || '').toLowerCase() === 'india' || f.is_oil_based);
    if (originFiltered.length >= 2) filtered = originFiltered;
  } else if (preferences.origin_filter === 'international') {
    const originFiltered = filtered.filter(f => !(f.origin_style || '').toLowerCase().includes('indian') && (f.brand_country || '').toLowerCase() !== 'india');
    if (originFiltered.length >= 2) filtered = originFiltered;
  }

  // Format filter
  if (preferences.format_filter === 'attar') {
    const formatFiltered = filtered.filter(f => f.format === 'Attar' || f.is_oil_based || f.format === 'Concentrated Perfume Oil');
    if (formatFiltered.length >= 2) filtered = formatFiltered;
  } else if (preferences.format_filter === 'edp') {
    const formatFiltered = filtered.filter(f => f.format === 'Eau de Parfum' || f.format === 'Extrait de Parfum');
    if (formatFiltered.length >= 2) filtered = formatFiltered;
  }

  // Brand category filter
  if (preferences.brand_category_filter && preferences.brand_category_filter !== 'all') {
    const targetCat = preferences.brand_category_filter.toLowerCase();
    const catFiltered = filtered.filter(f => (f.category || '').toLowerCase().includes(targetCat) || (f.brand_type || '').toLowerCase().includes(targetCat));
    if (catFiltered.length >= 2) filtered = catFiltered;
  }

  const scored = filtered.map(f => calculateFragranceRecommendationScore(f, preferences));
  scored.sort((a, b) => b.total_score - a.total_score);

  return scored.slice(0, limit);
}
