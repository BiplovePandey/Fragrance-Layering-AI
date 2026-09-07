import { Fragrance, UserPreferences, LayeringResult } from '../../src/types.js';
import { cosineSimilarity } from './similarity.js';
import { createUserPreferenceVector } from './features.js';

// Pairwise chord synergy matrix (harmony of complementary olfactory families)
const CHORD_COMPATIBILITY: Record<string, Record<string, { score: number; reason: string }>> = {
  citrus: {
    woody: { score: 95, reason: 'Sparkling citrus elevates the rich woody base, creating crisp contrast and refined longevity' },
    gourmand: { score: 85, reason: 'Zesty citrus cuts through heavy sweetness, preventing cloying notes while adding effervescence' },
    amber: { score: 88, reason: 'Bright citrus illuminates deep resinous amber with golden warmth' },
    floral: { score: 90, reason: 'Fresh bergamot and neroli brighten lush floral petals for effortless daytime elegance' },
    spicy: { score: 82, reason: 'Crisp citrus balances exotic pepper and cardamom with a lively zing' },
    fresh: { score: 75, reason: 'Double fresh notes are pleasant and clean, though lower in contrast and depth' },
    earthy: { score: 97, reason: 'Sunlit Italian citrus illuminates damp baked monsoon earth, recreating fresh petrichor after a thunderstorm' }
  },
  woody: {
    gourmand: { score: 96, reason: 'Creamy sandalwood and cedar provide a sturdy foundation that anchors sweet vanilla and tonka' },
    floral: { score: 92, reason: 'Smoky woods ground romantic rose and jasmine, lending unisex allure and mysterious character' },
    spicy: { score: 90, reason: 'Warm spices like cardamom and cinnamon weave seamlessly into deep cedarwood and vetiver' },
    amber: { score: 92, reason: 'Rich resins blend into sacred woods for an opulent, regal sillage' },
    citrus: { score: 95, reason: 'Grounding woods anchor luminous citrus top notes through the drydown' },
    earthy: { score: 93, reason: 'Ancient riverbed clay and sacred sandalwood meld into a meditative, grounding aura' }
  },
  floral: {
    gourmand: { score: 88, reason: 'Lush floral bouquets meet warm praline or vanilla, developing a delectable sensual trail' },
    woody: { score: 92, reason: 'Velvety rose and iris gain modern sophistication against dry cedar and smoky birch' },
    spicy: { score: 86, reason: 'Pink pepper and nutmeg add provocative tension to delicate white florals' },
    citrus: { score: 90, reason: 'Effervescent citrus blossoms into rich floral bouquets' },
    earthy: { score: 94, reason: 'Indian Sambac Jasmine or Damask Rose blooms with intoxicating realism against damp alluvial petrichor' }
  },
  gourmand: {
    spicy: { score: 92, reason: 'Fiery spices temper creamy caramel and Madagascar vanilla with sultry warmth' },
    woody: { score: 96, reason: 'Earthy vetiver or sandalwood balances sweet confectionery notes with refined restraint' },
    citrus: { score: 85, reason: 'Acidic citrus cuts through dense honey or vanilla gourmands' },
    gourmand: { score: 45, reason: 'Stacking two heavy sweet gourmands risks becoming overpowering and overly dense' },
    earthy: { score: 87, reason: 'Earthy roots cut through sweet vanilla, providing sophisticated gourmand depth' }
  },
  spicy: {
    woody: { score: 90, reason: 'Exotic spices infuse dry woods with hypnotic warmth' },
    floral: { score: 86, reason: 'Cardamom and clove impart seductive edge to delicate florals' },
    citrus: { score: 82, reason: 'Sharp citrus zest refreshes warm aromatic spices' },
    gourmand: { score: 92, reason: 'Warm baking spices bring edible depth to rich vanillic bases' },
    earthy: { score: 91, reason: 'Warm Himalayan spices blend effortlessly with damp earth and vetiver roots' }
  },
  earthy: {
    citrus: { score: 97, reason: 'Sparkling citrus lifts petrichor and clay into an effervescent summer storm signature' },
    floral: { score: 94, reason: 'Damp monsoon soil anchors lush rose and jasmine petals with organic intimacy' },
    woody: { score: 93, reason: 'Sacred sandalwood and vetiver amplify baked clay into a serene meditative aura' },
    spicy: { score: 91, reason: 'Zesty pepper and cardamom animate damp alluvial soil with radiant warmth' },
    gourmand: { score: 87, reason: 'Clay and vetiver roots ground sweet tonka and vanilla with earthy sophistication' }
  }
};

/**
 * Calculates note compatibility between Fragrance A and Fragrance B
 */
export function calculateNoteCompatibility(fragA: Fragrance, fragB: Fragrance): { score: number; chordReason: string } {
  const familyA = (fragA.fragrance_family || '').toLowerCase();
  const familyB = (fragB.fragrance_family || '').toLowerCase();

  const getDominantCategory = (family: string, notes: string[]): string => {
    const combined = (family + ' ' + (notes || []).join(' ')).toLowerCase();
    if (combined.includes('mitti') || combined.includes('petrichor') || combined.includes('earth') || combined.includes('clay')) return 'earthy';
    if (combined.includes('wood') || combined.includes('cedar') || combined.includes('sandalwood') || combined.includes('chandan') || combined.includes('vetiver') || combined.includes('khus') || combined.includes('oud')) return 'woody';
    if (combined.includes('citrus') || combined.includes('bergamot') || combined.includes('lemon') || combined.includes('lime') || combined.includes('kewra')) return 'citrus';
    if (combined.includes('vanilla') || combined.includes('gourmand') || combined.includes('tonka') || combined.includes('praline') || combined.includes('chai')) return 'gourmand';
    if (combined.includes('floral') || combined.includes('rose') || combined.includes('gulab') || combined.includes('jasmine') || combined.includes('mogra') || combined.includes('motia') || combined.includes('nargis')) return 'floral';
    if (combined.includes('spic') || combined.includes('cardamom') || combined.includes('cinnamon') || combined.includes('pepper') || combined.includes('kesar') || combined.includes('saffron') || combined.includes('shamama')) return 'spicy';
    if (combined.includes('amber') || combined.includes('resin')) return 'amber';
    return 'fresh';
  };

  const catA = getDominantCategory(familyA, [...(fragA.top_notes || []), ...(fragA.base_notes || [])]);
  const catB = getDominantCategory(familyB, [...(fragB.top_notes || []), ...(fragB.base_notes || [])]);

  const lookup = CHORD_COMPATIBILITY[catA]?.[catB] || CHORD_COMPATIBILITY[catB]?.[catA];
  if (lookup) {
    return { score: lookup.score, chordReason: lookup.reason };
  }

  // Same category matching
  if (catA === catB) {
    if (catA === 'gourmand') return { score: 48, chordReason: 'Both scents are heavily sweet; pairing may feel overwhelming.' };
    if (catA === 'woody') return { score: 82, chordReason: 'Harmonious woody resonance with rich texture, creating an enduring signature.' };
    if (catA === 'earthy') return { score: 85, chordReason: 'Deep petrichor and root resonance evocative of cooling monsoons.' };
    return { score: 78, chordReason: `Complementary nuances within the ${catA} spectrum create a cohesive scent bubble.` };
  }

  return { score: 82, chordReason: 'Balanced contrast between distinct olfactory profiles.' };
}

/**
 * Calculates diversity factor:
 * Fragrances with moderate vector distance (0.2 - 0.7) score highest.
 * Identical fragrances (cosine sim close to 1.0) or totally clashing profiles are penalized.
 */
function calculateDiversityFactor(cosSim: number): number {
  if (cosSim >= 0.95) return 30; // Almost identical, low diversity benefit
  if (cosSim >= 0.85) return 60; // Very similar
  if (cosSim >= 0.40 && cosSim <= 0.80) return 98; // Sweet spot of complementary contrast!
  if (cosSim >= 0.20 && cosSim < 0.40) return 85;
  return 65; // Very distant, may clash
}

/**
 * Generates structured explanation and application tip
 */
function generateLayeringExplanation(
  fragA: Fragrance,
  fragB: Fragrance,
  score: number,
  chordReason: string,
  season: string,
  occasion: string,
  isCrossOrigin: boolean
): { explanation: string; why_it_works: { opening_harmony: string; drydown_depth: string; application_tip: string }; layering_method: string } {
  // Determine oil vs spray dynamics
  const isAOil = Boolean(fragA.is_oil_based || fragA.format === 'Attar' || fragA.format === 'Concentrated Perfume Oil' || fragA.format === 'Pure Oud Oil');
  const isBOil = Boolean(fragB.is_oil_based || fragB.format === 'Attar' || fragB.format === 'Concentrated Perfume Oil' || fragB.format === 'Pure Oud Oil');

  let baseScent = fragA;
  let topScent = fragB;
  let layeringMethod = 'Dual Spray Sillage Synergy';
  let applicationTip = '';

  if (isAOil && !isBOil) {
    baseScent = fragA;
    topScent = fragB;
    layeringMethod = 'Attar Pulse-Point Base + Spray Diffusion (East-Meets-West Ritual)';
    applicationTip = `Dab 1-2 small drops of ${baseScent.name} onto warm pulse points (wrists and base of the neck). Wait 60-90 seconds for skin heat to unlock the oil-based sandalwood and earthy resins, then spray 1-2 mists of ${topScent.name} across your chest and collarbones. The alcohol mist projects radiant top notes while the attar anchors all-day longevity.`;
  } else if (isBOil && !isAOil) {
    baseScent = fragB;
    topScent = fragA;
    layeringMethod = 'Attar Pulse-Point Base + Spray Diffusion (East-Meets-West Ritual)';
    applicationTip = `Dab 1-2 small drops of ${baseScent.name} onto warm pulse points (wrists and throat). Allow body heat 60-90 seconds to warm the natural attar foundation, then mist ${topScent.name} from 6 inches away. This creates an ethereal diffusion bubble anchored by sacred natural botanicals.`;
  } else if (isAOil && isBOil) {
    layeringMethod = 'Dual Attar Pulse-Point Compounding';
    const isAHeavier = (fragA.intensity || 5) >= (fragB.intensity || 5);
    baseScent = isAHeavier ? fragA : fragB;
    topScent = isAHeavier ? fragB : fragA;
    applicationTip = `Warm one drop of ${baseScent.name} between inner wrists as your grounding root. Gently dab a half-drop of ${topScent.name} on the hollow of your neck and behind ears without rubbing vigorously. The two pure oils will fuse intimately with your body's natural chemistry.`;
  } else {
    // Both sprays
    const isAHeavier = ((fragA.intensity || 5) + (fragA.sweetness || 5)) >= ((fragB.intensity || 5) + (fragB.sweetness || 5));
    baseScent = isAHeavier ? fragA : fragB;
    topScent = isAHeavier ? fragB : fragA;
    layeringMethod = 'Dual Spray Sillage Synergy';
    applicationTip = `Apply 2 sprays of ${baseScent.name} first to warm pulse points (chest and throat) as your anchor. Wait 30 seconds, then mist 1-2 sprays of ${topScent.name} over collarbones and wrists for a shimmering, multidimensional diffusion.`;
  }

  const openingNotes = `${(topScent.top_notes || []).slice(0, 2).join(' and ')}`;
  const baseNotes = `${(baseScent.base_notes || []).slice(0, 2).join(' and ')}`;

  const openingHarmony = `The radiant opening of ${topScent.name} (${openingNotes || 'bright accords'}) diffuses luminous vibrancy on initial contact, while ${baseScent.name} establishes an intimate, structured anchor.`;
  const drydownDepth = `As the accords settle, ${chordReason.toLowerCase()}. The drydown marries ${baseNotes || 'deep resins and woods'} with airy undertones, ensuring enduring sillage without olfactory fatigue.`;

  const fusionText = isCrossOrigin ? ' This cross-origin pairing harmoniously bridges Indian heritage botanicals with international luxury perfumery.' : '';
  const explanation = `This bespoke layering creates a multifaceted olfactory signature. ${chordReason}${fusionText} Tailor-made for ${season} atmospheres and ${occasion} occasions.`;

  return {
    explanation,
    why_it_works: {
      opening_harmony: openingHarmony,
      drydown_depth: drydownDepth,
      application_tip: applicationTip
    },
    layering_method: layeringMethod
  };
}

/**
 * Evaluates a single pair of fragrances for layering compatibility
 */
export function scoreLayeringPair(
  fragA: Fragrance & { vector: number[] },
  fragB: Fragrance & { vector: number[] },
  preferences: UserPreferences
): LayeringResult | null {
  if (fragA.id === fragB.id) return null; // Avoid pairing same fragrance with itself

  // 1. Note compatibility (40%)
  const { score: noteCompScore, chordReason } = calculateNoteCompatibility(fragA, fragB);

  // 2. User preference match (20%)
  const prefVector = createUserPreferenceVector(preferences);
  const userSimA = cosineSimilarity(prefVector, fragA.vector);
  const userSimB = cosineSimilarity(prefVector, fragB.vector);
  const prefMatchScore = Math.round(((userSimA + userSimB) / 2) * 100);

  // 3. Season compatibility (15%)
  const targetSeason = preferences.season || 'Summer';
  const aHasSeason = (fragA.season || []).some(s => s.toLowerCase() === targetSeason.toLowerCase());
  const bHasSeason = (fragB.season || []).some(s => s.toLowerCase() === targetSeason.toLowerCase());
  const seasonScore = (aHasSeason && bHasSeason) ? 100 : (aHasSeason || bHasSeason) ? 75 : 45;

  // 4. Occasion compatibility (15%)
  const targetOccasion = preferences.occasion || 'Signature';
  const aHasOccasion = (fragA.occasion || []).some(o => o.toLowerCase() === targetOccasion.toLowerCase());
  const bHasOccasion = (fragB.occasion || []).some(o => o.toLowerCase() === targetOccasion.toLowerCase());
  const occasionScore = (aHasOccasion && bHasOccasion) ? 100 : (aHasOccasion || bHasOccasion) ? 75 : 45;

  // 5. Complementary note & Diversity score (10%)
  const pairwiseSim = cosineSimilarity(fragA.vector, fragB.vector);
  let diversityFactor = calculateDiversityFactor(pairwiseSim);

  // Cross-origin detection and origin style categorization
  const isAIndian = (fragA.origin_style || '').toLowerCase().includes('indian') || (fragA.brand_country || '').toLowerCase() === 'india' || fragA.is_oil_based;
  const isBIndian = (fragB.origin_style || '').toLowerCase().includes('indian') || (fragB.brand_country || '').toLowerCase() === 'india' || fragB.is_oil_based;
  const isCrossOrigin = (isAIndian && !isBIndian) || (!isAIndian && isBIndian);

  let originPairingType: 'cross_origin_fusion' | 'pure_indian_heritage' | 'pure_western_luxury' | 'western_middle_eastern' = 'pure_western_luxury';
  if (isCrossOrigin) {
    originPairingType = 'cross_origin_fusion';
    diversityFactor = Math.min(100, diversityFactor + 10); // Reward cross-cultural complementary layering
  } else if (isAIndian && isBIndian) {
    originPairingType = 'pure_indian_heritage';
  } else {
    originPairingType = 'pure_western_luxury';
  }

  // Layering Score Formula:
  // 40% compatibility + 20% user preference + 15% season + 15% occasion + 10% complementary-note/diversity
  const totalScore = Math.round(
    (0.40 * noteCompScore) +
    (0.20 * prefMatchScore) +
    (0.15 * seasonScore) +
    (0.15 * occasionScore) +
    (0.10 * diversityFactor)
  );

  const clampedScore = Math.min(99, Math.max(30, totalScore));

  // Determine best season & occasion based on shared strengths
  const commonSeasons = (fragA.season || []).filter(s => (fragB.season || []).includes(s));
  const bestSeason = commonSeasons.length > 0 ? commonSeasons[0] : (fragA.season[0] || 'All Year');

  const commonOccasions = (fragA.occasion || []).filter(o => (fragB.occasion || []).includes(o));
  const bestOccasion = commonOccasions.length > 0 ? commonOccasions[0] : (fragA.occasion[0] || 'Signature');

  const bestTime = ((fragA.intensity || 5) + (fragB.intensity || 5) >= 15) ? 'Evening / Night' : 'Daytime / All Day';

  const { explanation, why_it_works, layering_method } = generateLayeringExplanation(
    fragA,
    fragB,
    clampedScore,
    chordReason,
    bestSeason,
    bestOccasion,
    isCrossOrigin
  );

  return {
    id: `${fragA.id}-${fragB.id}`,
    fragrance_a: fragA,
    fragrance_b: fragB,
    compatibility_score: clampedScore,
    breakdown: {
      note_compatibility: noteCompScore,
      user_preference_match: prefMatchScore,
      season_compatibility: seasonScore,
      occasion_compatibility: occasionScore,
      complementary_note_score: Math.round(diversityFactor),
      diversity_factor: Math.round(diversityFactor)
    },
    is_cross_origin: isCrossOrigin,
    origin_pairing_type: originPairingType,
    layering_method,
    explanation,
    why_it_works,
    best_season: bestSeason,
    best_occasion: bestOccasion,
    best_time_of_day: bestTime
  };
}

/**
 * Finds top layering combinations:
 * - If ownedFragranceId is provided: pairs that fragrance with all other fragrances
 * - If user provides custom collection: only pairs from within that collection
 * - Supports origin_filter ('indian', 'international', 'fusion') and format_filter
 */
export function findBestLayeringCombinations(
  fragrances: (Fragrance & { vector: number[] })[],
  preferences: UserPreferences,
  ownedFragranceId?: number,
  candidateCollectionIds?: number[],
  limit: number = 6
): LayeringResult[] {
  let pool = fragrances;

  if (candidateCollectionIds && candidateCollectionIds.length >= 2) {
    pool = fragrances.filter(f => candidateCollectionIds.includes(f.id));
  }

  // Filter pool by preferences if specific origin is requested
  if (preferences.origin_filter === 'indian') {
    pool = pool.filter(f => (f.origin_style || '').toLowerCase().includes('indian') || (f.brand_country || '').toLowerCase() === 'india' || f.is_oil_based);
  } else if (preferences.origin_filter === 'international') {
    pool = pool.filter(f => !(f.origin_style || '').toLowerCase().includes('indian') && (f.brand_country || '').toLowerCase() !== 'india');
  }

  // Format filter
  if (preferences.format_filter === 'attar') {
    pool = pool.filter(f => f.format === 'Attar' || f.is_oil_based || f.format === 'Concentrated Perfume Oil');
  } else if (preferences.format_filter === 'edp') {
    pool = pool.filter(f => f.format === 'Eau de Parfum' || f.format === 'Extrait de Parfum');
  }

  // Brand category filter
  if (preferences.brand_category_filter && preferences.brand_category_filter !== 'all') {
    const targetCat = preferences.brand_category_filter.toLowerCase();
    const catFiltered = pool.filter(f => (f.category || '').toLowerCase().includes(targetCat) || (f.brand_type || '').toLowerCase().includes(targetCat));
    if (catFiltered.length >= 2) {
      pool = catFiltered;
    }
  }

  // If pool was filtered down too narrow (< 3 items), fallback to whole collection so user always gets rich results
  if (pool.length < 3) {
    pool = fragrances;
  }

  const results: LayeringResult[] = [];

  if (ownedFragranceId) {
    const ownedFrag = fragrances.find(f => f.id === ownedFragranceId);
    if (ownedFrag) {
      for (const other of pool) {
        if (other.id !== ownedFrag.id) {
          const res = scoreLayeringPair(ownedFrag, other, preferences);
          if (res) results.push(res);
        }
      }
    }
  } else {
    // Check combinations across pool
    const seenPairs = new Set<string>();
    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        const pairKey = [pool[i].id, pool[j].id].sort().join('-');
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          const res = scoreLayeringPair(pool[i], pool[j], preferences);
          if (res) results.push(res);
        }
      }
    }
  }

  // If preferences.origin_filter === 'fusion', prioritize cross-origin results
  if (preferences.origin_filter === 'fusion') {
    results.sort((a, b) => {
      if (a.is_cross_origin && !b.is_cross_origin) return -1;
      if (!a.is_cross_origin && b.is_cross_origin) return 1;
      return b.compatibility_score - a.compatibility_score;
    });
  } else {
    // Sort descending by compatibility score
    results.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }

  return results.slice(0, limit);
}
