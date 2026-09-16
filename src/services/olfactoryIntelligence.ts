import {
  Fragrance,
  OlfactoryVector8D,
  LivingOlfactoryDNA,
  PersonalScentMemory,
  OlfactoryEvent,
  LayerExperiment,
  WhatShouldIWearRecommendation,
  PurchaseAdvisorAnalysis,
  TravelCapsule,
  NaturalLanguageScentResult,
  MismatchAnalysis,
  FragranceTwinResult,
  ComfortZoneRecommendation,
  FixMyLayerDiagnosis,
  PurchaseDecisionAnalysis,
  RecentWearItem,
  WeatherCondition,
  UserPreferences,
  WardrobeAnalytics
} from '../types.js';

// ================= STORAGE KEYS =================
const DNA_STORAGE_KEY = 'olfactory_living_dna_v2';
const MEMORY_STORAGE_KEY = 'olfactory_scent_memory_v2';
const EVENTS_STORAGE_KEY = 'olfactory_events_history_v2';
const EXPERIMENTS_STORAGE_KEY = 'olfactory_layer_experiments_v2';

// Baseline default DNA vector (0 - 100)
const DEFAULT_DNA_VECTOR: OlfactoryVector8D = {
  freshness: 72,
  sweetness: 42,
  intensity: 65,
  woody: 86,
  floral: 58,
  warm_resinous_spices: 76,
  earthy_clay: 82,
  longevity_fixative: 78
};

// ================= HELPER FUNCTIONS =================
export function extractFragranceVector8D(f?: Fragrance | null): OlfactoryVector8D {
  if (!f) {
    return { ...DEFAULT_DNA_VECTOR };
  }

  const notesText = [
    ...(f.top_notes || []),
    ...(f.middle_notes || []),
    ...(f.base_notes || []),
    f.fragrance_family || '',
    f.description || ''
  ].join(' ').toLowerCase();

  const countHits = (keywords: string[]) => {
    return keywords.reduce((acc, kw) => acc + (notesText.includes(kw) ? 1 : 0), 0);
  };

  const freshHits = countHits(['bergamot', 'lemon', 'citrus', 'mandarin', 'neroli', 'grapefruit', 'mint', 'aquatic', 'marine', 'ozone', 'green', 'cardamom']);
  const sweetHits = countHits(['vanilla', 'tonka', 'honey', 'caramel', 'sugar', 'amber', 'sweet', 'praline', 'gourmand', 'benzoin']);
  const woodHits = countHits(['sandalwood', 'cedar', 'chandan', 'oud', 'agarwood', 'vetiver', 'patchouli', 'cypress', 'pine', 'wood', 'guaiac']);
  const floralHits = countHits(['rose', 'jasmine', 'gulab', 'mogra', 'tuberose', 'ylang', 'neroli', 'orange blossom', 'lavender', 'iris', 'violet']);
  const warmHits = countHits(['saffron', 'cinnamon', 'cardamom', 'clove', 'spice', 'amber', 'resinous', 'incense', 'shamama', 'pepper', 'loban', 'myrrh']);
  const earthHits = countHits(['mitti', 'petrichor', 'clay', 'geosmin', 'vetiver', 'khus', 'earth', 'soil', 'moss', 'mineral', 'patchouli']);

  // Combine inherent attributes (scaled 1-10 to 10-100) with keyword hits
  const freshness = Math.min(100, Math.max(10, Math.round((f.freshness || 6) * 8 + freshHits * 4)));
  const sweetness = Math.min(100, Math.max(10, Math.round((f.sweetness || 5) * 8 + sweetHits * 4)));
  const intensity = Math.min(100, Math.max(10, Math.round((f.intensity || 6) * 10)));
  const woody = Math.min(100, Math.max(15, Math.round(30 + woodHits * 16)));
  const floral = Math.min(100, Math.max(10, Math.round(20 + floralHits * 18)));
  const warm_resinous_spices = Math.min(100, Math.max(15, Math.round(25 + warmHits * 15)));
  const earthy_clay = Math.min(100, Math.max(10, Math.round(15 + earthHits * 20)));
  
  // Longevity fixative estimation
  const longevityHours = parseInt(f.longevity?.match(/\d+/)?.[0] || '7', 10);
  const longevity_fixative = Math.min(100, Math.max(30, Math.round(longevityHours * 8 + (f.is_oil_based || f.format === 'Attar' ? 20 : 0))));

  return {
    freshness,
    sweetness,
    intensity,
    woody,
    floral,
    warm_resinous_spices,
    earthy_clay,
    longevity_fixative
  };
}

export function computeCosineSimilarity8D(v1: OlfactoryVector8D, v2: OlfactoryVector8D): number {
  const keys: (keyof OlfactoryVector8D)[] = [
    'freshness', 'sweetness', 'intensity', 'woody',
    'floral', 'warm_resinous_spices', 'earthy_clay', 'longevity_fixative'
  ];

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (const k of keys) {
    dotProduct += v1[k] * v2[k];
    mag1 += v1[k] * v1[k];
    mag2 += v2[k] * v2[k];
  }

  if (mag1 === 0 || mag2 === 0) return 0.5;
  const similarity = dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  return Math.max(0, Math.min(1, similarity));
}

// Derive personality archetype from DNA vector
function derivePersonality(vector: OlfactoryVector8D): { title: string; desc: string } {
  if (vector.earthy_clay >= 75 && vector.woody >= 75 && vector.sweetness <= 50) {
    return {
      title: 'The Dark Minimalist',
      desc: 'You gravitate toward dry heartwoods, petrichor, and mineral textures with restrained sweetness and focused projection.'
    };
  }
  if (vector.freshness >= 75 && vector.earthy_clay >= 70) {
    return {
      title: 'The Petrichor Nomad',
      desc: 'You seek atmospheric petrichor, cooling vetiver, and crisp rainfall accords that capture living nature.'
    };
  }
  if (vector.warm_resinous_spices >= 75 && vector.woody >= 75) {
    return {
      title: 'The Imperial Resinist',
      desc: 'You revere rich oriental resins, sacred Indian chandan, royal Assam oudh, and warm cardamom-saffron structures.'
    };
  }
  if (vector.freshness >= 75 && vector.floral >= 60) {
    return {
      title: 'The Solar Alchemist',
      desc: 'You flourish under vibrant Mediterranean citrus, delicate Damask rose petals, and bright effervescent openings.'
    };
  }
  if (vector.floral >= 70 && vector.warm_resinous_spices >= 65) {
    return {
      title: 'The Velvet Botanist',
      desc: 'You favor opulent florals underpinned with sensual amber, warm spices, and silky balsamic nuances.'
    };
  }
  return {
    title: 'The Modern Alchemist',
    desc: 'You balance nuanced green freshness with rich balsamic woods, maintaining a sophisticated and multifaceted fragrance palate.'
  };
}

// ================= OLFACTORY INTELLIGENCE ENGINE =================

export const olfactoryIntelligence = {
  // 1. Get current Living DNA
  getLivingDNA(): LivingOlfactoryDNA {
    try {
      const stored = localStorage.getItem(DNA_STORAGE_KEY);
      if (stored) {
        const parsed: LivingOlfactoryDNA = JSON.parse(stored);
        if (parsed?.vector) return parsed;
      }
    } catch (e) {
      console.warn('Error reading living DNA:', e);
    }

    const { title, desc } = derivePersonality(DEFAULT_DNA_VECTOR);
    const initial: LivingOlfactoryDNA = {
      vector: { ...DEFAULT_DNA_VECTOR },
      recentDeltas: { earthy_clay: 7, woody: 5, freshness: 4, sweetness: -3 },
      evolutionReasons: [
        {
          date: new Date().toISOString().split('T')[0],
          summary: 'Earthy preference increased from petrichor attar explorations & vetiver wearings',
          axis: 'earthy_clay',
          delta: 7
        },
        {
          date: new Date().toISOString().split('T')[0],
          summary: 'Woody accord affinity strengthened via Mysore Sandalwood selections',
          axis: 'woody',
          delta: 5
        },
        {
          date: new Date().toISOString().split('T')[0],
          summary: 'Sweetness preference calibrated down due to low gourmand tolerance',
          axis: 'sweetness',
          delta: -3
        }
      ],
      personalityTitle: title,
      personalityDescription: desc,
      lastUpdated: new Date().toISOString()
    };
    this.saveLivingDNA(initial);
    return initial;
  },

  // Save Living DNA
  saveLivingDNA(dna: LivingOlfactoryDNA) {
    try {
      localStorage.setItem(DNA_STORAGE_KEY, JSON.stringify(dna));
    } catch (e) {
      console.warn('Error saving living DNA:', e);
    }
  },

  // 2. Scent Memory
  getScentMemory(): PersonalScentMemory {
    try {
      const stored = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading scent memory:', e);
    }

    const initial: PersonalScentMemory = {
      likes: [1, 7, 11, 14],
      dislikes: [9],
      strongDislikes: [],
      favoriteNotes: ['Sandalwood', 'Vetiver', 'Mitti', 'Cardamom', 'Bergamot', 'Ruh Khus'],
      avoidNotes: ['Heavy Praline', 'Cotton Candy', 'Overpowering Ethyl Maltol'],
      favoriteFamilies: ['Woody Aromatic', 'Chypre Earthy', 'Oriental Resinous'],
      preferredIntensity: 7,
      preferredSweetness: 4,
      preferredProjection: 'Moderate to Strong',
      preferredLongevity: '8-12 Hours',
      weatherPreferences: {
        hotWeatherNotes: ['Bergamot', 'Mitti Attar', 'Vetiver / Khus', 'Neroli'],
        coldWeatherNotes: ['Sandalwood', 'Assam Oud', 'Cardamom', 'Warm Amber'],
        monsoonNotes: ['Geosmin / Mitti', 'Ruh Khus', 'Patchouli', 'Cedar']
      }
    };
    this.saveScentMemory(initial);
    return initial;
  },

  saveScentMemory(mem: PersonalScentMemory) {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(mem));
    } catch (e) {
      console.warn('Error saving scent memory:', e);
    }
  },

  // 3. Olfactory Event Recording & Feedback Loop
  getEventHistory(): OlfactoryEvent[] {
    try {
      const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading event history:', e);
    }
    return [
      {
        id: 'init_1',
        type: 'WEAR',
        fragranceId: 1,
        fragranceName: 'Raw by SKINN Titan',
        value: 5,
        context: { mood: 'Refined', occasion: 'Office' },
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        notes: 'Crisp bergamot opening settled beautifully into woody patchouli'
      },
      {
        id: 'init_2',
        type: 'EXPERIMENT',
        fragranceId: 7,
        fragranceName: 'Mitti Attar',
        layerPartnerId: 1,
        layerPartnerName: 'Raw by SKINN',
        value: 5,
        context: { occasion: 'Evening Chill' },
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        notes: 'Alchemical petrichor layer: grounded the citrus zest with baked earth'
      }
    ];
  },

  recordEvent(event: Omit<OlfactoryEvent, 'id' | 'timestamp'>, fragrance?: Fragrance): LivingOlfactoryDNA {
    const fullEvent: OlfactoryEvent = {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    const history = this.getEventHistory();
    history.unshift(fullEvent);
    // Keep last 150 events
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(history.slice(0, 150)));
    } catch (e) {
      console.warn('Error saving event:', e);
    }

    // Weight and update Living DNA based on signal
    const dna = this.getLivingDNA();
    const memory = this.getScentMemory();
    const deltas: Partial<Record<keyof OlfactoryVector8D, number>> = {};
    let evolutionSummary = '';
    let impactedAxis: keyof OlfactoryVector8D = 'woody';

    if (fragrance) {
      const fragVec = extractFragranceVector8D(fragrance);

      if (event.type === 'LIKE' || (event.type === 'RATE' && (event.value || 0) >= 4) || event.type === 'WEAR') {
        const weight = event.type === 'RATE' && (event.value || 0) === 5 ? 0.08 : 0.04;
        
        // Boost axes where fragrance is strong
        if (fragVec.earthy_clay >= 65) {
          dna.vector.earthy_clay = Math.min(100, Math.round(dna.vector.earthy_clay + 4));
          deltas.earthy_clay = (deltas.earthy_clay || 0) + 4;
          impactedAxis = 'earthy_clay';
        }
        if (fragVec.woody >= 65) {
          dna.vector.woody = Math.min(100, Math.round(dna.vector.woody + 3));
          deltas.woody = (deltas.woody || 0) + 3;
          impactedAxis = 'woody';
        }
        if (fragVec.freshness >= 70) {
          dna.vector.freshness = Math.min(100, Math.round(dna.vector.freshness + 3));
          deltas.freshness = (deltas.freshness || 0) + 3;
          impactedAxis = 'freshness';
        }
        if (fragVec.sweetness <= 45) {
          // Reinforces low sweetness preference
          dna.vector.sweetness = Math.max(10, Math.round(dna.vector.sweetness - 2));
          deltas.sweetness = -2;
        }

        // Add to memory likes
        if (!memory.likes.includes(fragrance.id)) {
          memory.likes.push(fragrance.id);
        }
        (fragrance.top_notes || []).concat(fragrance.base_notes || []).slice(0, 2).forEach(n => {
          if (!memory.favoriteNotes.includes(n)) memory.favoriteNotes.push(n);
        });

        evolutionSummary = `Affinity for ${impactedAxis.replace('_', ' ')} strengthened after positive reaction to ${fragrance.name}`;
      } else if (event.type === 'DISLIKE' || (event.type === 'RATE' && (event.value || 0) <= 2)) {
        // Calibrate downwards away from this fragrance's dominant vector
        if (fragVec.sweetness >= 65) {
          dna.vector.sweetness = Math.max(10, Math.round(dna.vector.sweetness - 6));
          deltas.sweetness = -6;
          impactedAxis = 'sweetness';
          evolutionSummary = `Sweetness tolerance reduced by -6% following dislike of ${fragrance.name}`;
        } else if (fragVec.floral >= 65) {
          dna.vector.floral = Math.max(10, Math.round(dna.vector.floral - 5));
          deltas.floral = -5;
          impactedAxis = 'floral';
          evolutionSummary = `Floral preference reduced by -5% following low rating on ${fragrance.name}`;
        } else {
          dna.vector.intensity = Math.max(10, Math.round(dna.vector.intensity - 4));
          deltas.intensity = -4;
          impactedAxis = 'intensity';
          evolutionSummary = `Intensity calibrated down following rejection of ${fragrance.name}`;
        }

        if (!memory.dislikes.includes(fragrance.id)) memory.dislikes.push(fragrance.id);
      }
    }

    if (evolutionSummary) {
      dna.evolutionReasons.unshift({
        date: new Date().toISOString().split('T')[0],
        summary: evolutionSummary,
        axis: impactedAxis,
        delta: deltas[impactedAxis] || 3
      });
      // Keep last 15 reasons
      dna.evolutionReasons = dna.evolutionReasons.slice(0, 15);
      dna.recentDeltas = { ...dna.recentDeltas, ...deltas };
    }

    const { title, desc } = derivePersonality(dna.vector);
    dna.personalityTitle = title;
    dna.personalityDescription = desc;
    dna.lastUpdated = new Date().toISOString();

    this.saveLivingDNA(dna);
    this.saveScentMemory(memory);
    return dna;
  },

  // 4. FEATURE #1: WHAT SHOULD I WEAR?
  recommendWhatShouldIWear(
    allFragrances: Fragrance[],
    ownedFragrances: Fragrance[],
    weather: WeatherCondition,
    mood: string = 'Refined',
    occasion: string = 'Signature'
  ): WhatShouldIWearRecommendation {
    const dna = this.getLivingDNA();
    const memory = this.getScentMemory();
    const eventHistory = this.getEventHistory();

    const safeAll = allFragrances.length > 0 ? allFragrances : [];
    const ownedIds = new Set((ownedFragrances || []).map(f => f.id));

    // Check recent wears to enforce intelligent rotation
    const recentWears = eventHistory
      .filter(e => e.type === 'WEAR' && e.fragranceId)
      .slice(0, 10);
    const lastWornId = recentWears[0]?.fragranceId;

    // Score all candidate fragrances
    const scoredCandidates = safeAll.map(frag => {
      const fragVec = extractFragranceVector8D(frag);
      
      // 1. DNA compatibility score (0 - 100)
      const dnaSim = computeCosineSimilarity8D(dna.vector, fragVec);
      let matchScore = Math.round(dnaSim * 100);

      // 2. Weather modifier
      let weatherBonus = 0;
      if (weather.temperature_c >= 28) {
        // Hot weather favors freshness, lightness, or botanical mitti/khus
        if (fragVec.freshness >= 70 || fragVec.earthy_clay >= 70) weatherBonus += 12;
        if (fragVec.sweetness >= 65) weatherBonus -= 15; // Too cloying
      } else if (weather.temperature_c <= 18) {
        // Cold weather favors warm spices, sandalwood, resins
        if (fragVec.warm_resinous_spices >= 65 || fragVec.woody >= 75) weatherBonus += 12;
        if (fragVec.freshness >= 80 && fragVec.woody <= 40) weatherBonus -= 8; // Disappears in cold
      } else {
        // Temperate
        if (fragVec.woody >= 60) weatherBonus += 8;
      }

      if (weather.humidity_pct >= 70) {
        // High humidity: petrichor and earthy botanicals thrive
        if (fragVec.earthy_clay >= 60 || frag.format === 'Attar') weatherBonus += 10;
      }

      // 3. Mood & Occasion alignment
      let moodBonus = 0;
      const occList = (frag.occasion || []).map(o => o.toLowerCase());
      if (occList.includes(occasion.toLowerCase()) || occList.includes('signature')) moodBonus += 8;
      if (mood.toLowerCase().includes('bold') && fragVec.intensity >= 70) moodBonus += 6;
      if (mood.toLowerCase().includes('calm') && fragVec.earthy_clay >= 70) moodBonus += 8;
      if (mood.toLowerCase().includes('fresh') && fragVec.freshness >= 75) moodBonus += 8;

      // 4. Memory penalty / bonus
      let memoryBonus = 0;
      if (memory.dislikes.includes(frag.id)) memoryBonus -= 35;
      if (memory.likes.includes(frag.id)) memoryBonus += 8;
      if ((frag.top_notes || []).concat(frag.base_notes || []).some(n => memory.avoidNotes.some(an => an.toLowerCase().includes(n.toLowerCase())))) {
        memoryBonus -= 25;
      }

      // 5. Wardrobe prioritization & Rotation AI
      let wardrobeBonus = 0;
      const isOwned = ownedIds.has(frag.id);
      if (isOwned) {
        wardrobeBonus += 10; // Prioritize owned flacons
        // Repetition check
        if (frag.id === lastWornId) {
          wardrobeBonus -= 18; // Don't wear the exact same bottle twice consecutively
        }
      }

      const finalScore = Math.max(30, Math.min(99, Math.round(matchScore * 0.45 + weatherBonus + moodBonus + memoryBonus + wardrobeBonus)));

      return {
        frag,
        score: finalScore,
        dnaSim,
        isOwned
      };
    });

    // Sort descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    // Pick top candidate
    const top = scoredCandidates[0]?.frag || safeAll[0];
    if (!top) {
      const fallbackFrag: Fragrance = {
        id: 1,
        name: 'Mysore Sandalwood Sovereign',
        brand: 'Heritage Atelier',
        fragrance_family: 'Woody Oriental',
        top_notes: ['Cardamom', 'Bergamot'],
        middle_notes: ['Damask Rose', 'Saffron'],
        base_notes: ['Mysore Sandalwood', 'White Amber'],
        concentration: 'Extrait de Parfum',
        gender: 'unisex',
        season: ['Autumn', 'Winter', 'Monsoon'],
        occasion: ['Signature', 'Special Event'],
        intensity: 8,
        freshness: 6,
        sweetness: 5,
        longevity: '12 hours',
        format: 'Eau de Parfum',
        description: 'Sublime royal sandalwood anchored with warm spices.'
      };
      return {
        fragrance: fallbackFrag,
        compatibilityScore: 92,
        isFromWardrobe: false,
        reasoning: {
          primaryVerdict: `${fallbackFrag.name} provides an ideal baseline signature.`,
          weatherReasoning: 'Balanced for contemporary atmospheric conditions.',
          moodReasoning: 'Honors classical woody and spice balance.',
          personalDnaReasoning: 'Aligns with universal harmonious olfactory proportions.',
          rotationReasoning: 'Atelier standard specimen.'
        },
        applicationRitual: {
          spraysA: 2,
          spraysB: 1,
          placementA: 'Collarbone and pulse points',
          placementB: 'Upper chest and shirt fabric',
          skinVsClothing: 'Skin direct application',
          waitTime: '45 seconds between layers'
        },
        expectedEvolution: {
          opening: 'Opening: Cardamom & Bergamot effervescence.',
          heart: 'Heart: Damask Rose & Saffron warmth.',
          drydown: 'Drydown: Deep creamy Mysore Sandalwood.'
        },
        confidence: 'Optimal'
      };
    }

    const topScore = scoredCandidates[0]?.score || 93;
    const isFromWardrobe = scoredCandidates[0]?.isOwned || false;

    // Pick complementary layering partner
    const topVec = extractFragranceVector8D(top);
    const partnerCandidate = scoredCandidates.find(c => {
      if (c.frag.id === top.id) return false;
      const pVec = extractFragranceVector8D(c.frag);
      // High contrast in freshness vs woody/earthy
      const diffFresh = Math.abs(topVec.freshness - pVec.freshness);
      const diffWood = Math.abs(topVec.woody - pVec.woody);
      return (diffFresh >= 20 || diffWood >= 20) && c.score >= 70;
    })?.frag || safeAll.find(f => f.id !== top.id) || safeAll[1];

    // Build explainable reasoning
    const weatherReasoning = weather.temperature_c >= 28
      ? `Warm atmosphere (${weather.temperature_c}°C, ${weather.humidity_pct}% humidity) accelerates volatile top notes. ${top.name}'s structure balances evaporation rates smoothly across warm skin.`
      : weather.temperature_c <= 18
      ? `Cool ambient temperature (${weather.temperature_c}°C) compresses light molecules. ${top.name}'s rich ${top.fragrance_family} foundation radiates sustained body warmth.`
      : `Temperate climate (${weather.temperature_c}°C) allows linear accord development without seasonal distortion.`;

    const moodReasoning = `Aligns with your "${mood}" disposition and ${occasion} setting through ${(top.top_notes || ['citrus'])[0]} and ${(top.base_notes || ['woods'])[0]} accords.`;

    const personalDnaReasoning = `Strong 8-D vector convergence (${Math.round(scoredCandidates[0]?.dnaSim * 100 || 92)}% similarity) with your ${dna.personalityTitle} profile, honoring your preferred ${top.fragrance_family} territory.`;

    const rotationReasoning = isFromWardrobe
      ? (lastWornId === top.id ? 'Refreshed rotation with adjusted layering partner' : 'Recommended from your wardrobe; fills today’s optimal rotation window.')
      : 'Curated discovery pick from the atelier catalogue that fulfills today’s atmospheric conditions.';

    // Application suggestion
    const isOil = top.format === 'Attar' || top.is_oil_based;
    const spraysA = isOil ? 1 : (top.intensity >= 8 ? 2 : 3);
    const spraysB = partnerCandidate?.format === 'Attar' ? 1 : 2;

    return {
      fragrance: top,
      layerPartner: partnerCandidate,
      compatibilityScore: topScore,
      isFromWardrobe,
      reasoning: {
        primaryVerdict: `${top.name} by ${top.brand_name || top.brand} is today's definitive olfactory signature.`,
        weatherReasoning,
        moodReasoning,
        personalDnaReasoning,
        rotationReasoning
      },
      applicationRitual: {
        spraysA,
        spraysB,
        placementA: isOil ? 'Pulse points: inner wrists & jugular pulse' : 'Collarbone and nape of neck (skin)',
        placementB: 'Upper chest and shirt fabric (clothing) for lingering sillage',
        skinVsClothing: isOil ? 'Pure botanical oil to skin directly' : 'Fragrance A on skin; Fragrance B lightly across collar',
        waitTime: 'Wait 45 seconds between layers to let alcohol dissipate.'
      },
      expectedEvolution: {
        opening: `Opening (0–30 min): ${(top.top_notes || []).slice(0, 3).join(', ')} deliver immediate sparkling clarity.`,
        heart: `Heart (1–3 hrs): Settles into ${(top.middle_notes || []).slice(0, 2).join(' & ')} complemented by ${partnerCandidate?.name || 'layer accent'}.`,
        drydown: `Drydown (4–8+ hrs): Persistent anchor of ${(top.base_notes || []).slice(0, 3).join(', ')} with intimate skin warmth.`
      },
      confidence: topScore >= 90 ? 'High' : topScore >= 80 ? 'Optimal' : 'Experimental'
    };
  },

  // 5. FEATURE #5: FIX MY LAYER (AI Troubleshooting Engine)
  diagnoseAndFixLayer(
    fragA: Fragrance,
    fragB: Fragrance,
    fragC: Fragrance | undefined,
    problemType: string,
    wardrobe: Fragrance[] = []
  ): FixMyLayerDiagnosis {
    const vecA = extractFragranceVector8D(fragA);
    const vecB = extractFragranceVector8D(fragB);
    const vecC = fragC ? extractFragranceVector8D(fragC) : undefined;

    const causes: { fragranceName: string; accordOrNote: string; contributionLevel: 'high' | 'moderate' }[] = [];
    let suggestedAction: FixMyLayerDiagnosis['suggestedAction'] = 'adjust_ratio';
    let ratio = { ratioA: 50, ratioB: 50, spraysA: 2, spraysB: 2 };
    let recommendedOrder = 'Base anchor first on skin, volatile top layer on fabric';
    let expectedOutcome = '';
    const suggestedWardrobeAdditions: FixMyLayerDiagnosis['suggestedWardrobeAdditions'] = [];

    switch (problemType) {
      case 'too_sweet':
        if (vecA.sweetness >= vecB.sweetness) {
          causes.push({ fragranceName: fragA.name, accordOrNote: `${fragA.sweetness}/10 Sweetness (${(fragA.base_notes || []).filter(n => /vanilla|amber|tonka|honey|sugar/i.test(n)).join(', ') || 'gourmand base'})`, contributionLevel: 'high' });
          ratio = { ratioA: 30, ratioB: 70, spraysA: 1, spraysB: 3 };
        } else {
          causes.push({ fragranceName: fragB.name, accordOrNote: `${fragB.sweetness}/10 Sweetness (${(fragB.base_notes || []).filter(n => /vanilla|amber|tonka|honey|sugar/i.test(n)).join(', ') || 'gourmand base'})`, contributionLevel: 'high' });
          ratio = { ratioA: 70, ratioB: 30, spraysA: 3, spraysB: 1 };
        }
        suggestedAction = 'adjust_ratio';
        recommendedOrder = `Apply the less sweet fragrance (${vecA.sweetness < vecB.sweetness ? fragA.name : fragB.name}) to warm pulse points on skin to project dryness first.`;
        expectedOutcome = 'Reduces overall gourmand saturation by 35% while accentuating dry woodiness and spice architecture.';
        suggestedWardrobeAdditions.push({
          category: 'Dry Earthy / Vetiver',
          note: 'Ruh Khus or Haitian Vetiver',
          explanation: 'Adding 1 drop of pure vetiver or a dry woody spray introduces smoky earthy astringency that cuts through sugar molecules.'
        });
        break;

      case 'too_strong':
      case 'too_heavy':
        causes.push({ fragranceName: fragA.intensity >= fragB.intensity ? fragA.name : fragB.name, accordOrNote: 'High sillage projection & dense fixative base', contributionLevel: 'high' });
        suggestedAction = 'swap_order';
        ratio = { ratioA: 35, ratioB: 65, spraysA: 1, spraysB: 2 };
        recommendedOrder = 'Separate application sites: apply heavy base to lower chest under clothing; apply lighter partner behind ears.';
        expectedOutcome = 'Softens the sillage envelope from room-filling to an intimate, sophisticated personal aura.';
        break;

      case 'too_floral':
        causes.push({ fragranceName: vecA.floral >= vecB.floral ? fragA.name : fragB.name, accordOrNote: 'Indolic floral bouquet dominance', contributionLevel: 'high' });
        suggestedAction = 'adjust_ratio';
        ratio = vecA.floral >= vecB.floral ? { ratioA: 25, ratioB: 75, spraysA: 1, spraysB: 3 } : { ratioA: 75, ratioB: 25, spraysA: 3, spraysB: 1 };
        recommendedOrder = 'Subdue floral flacon by misting onto back of neck; anchor woody companion across inner wrists.';
        expectedOutcome = 'Brings the floral petal notes into an elegant whisper supported by deeper structural woods.';
        break;

      case 'too_dry':
      case 'too_sharp':
        causes.push({ fragranceName: vecA.freshness >= vecB.freshness ? fragA.name : fragB.name, accordOrNote: 'Acidic citrus / high linalool opening without enough creamy resin buffer', contributionLevel: 'high' });
        suggestedAction = 'add_companion';
        ratio = { ratioA: 40, ratioB: 60, spraysA: 2, spraysB: 2 };
        recommendedOrder = 'Apply warm resinous partner first; wait 60 seconds before applying sharp citrus to temper acidity.';
        expectedOutcome = 'Smooths out harsh opening edges into a velvet balsamic finish.';
        suggestedWardrobeAdditions.push({
          category: 'Sandalwood / Amber Attar',
          note: 'Mysore Sandalwood or Amber Resin',
          explanation: 'Provides a creamy fixative cushion that absorbs sharp volatile citrus oils.'
        });
        break;

      case 'doesnt_last':
      case 'too_weak':
        causes.push({ fragranceName: 'Both compositions', accordOrNote: 'High proportion of volatile top notes with low fixative molecular weight', contributionLevel: 'high' });
        suggestedAction = 'swap_order';
        ratio = { ratioA: 50, ratioB: 50, spraysA: 3, spraysB: 3 };
        recommendedOrder = 'Apply pure oil or heavier base fragrance FIRST to pulse points, then apply companion to clothing fibers for extended longevity.';
        expectedOutcome = 'Boosts effective staying power by +4 to +6 hours through fabric retention.';
        suggestedWardrobeAdditions.push({
          category: 'Pure Perfume Oil / Attar Anchor',
          note: 'White Musk or Iso E Super',
          explanation: 'Fixative molecules anchor lighter aromatic notes to prevent rapid cutaneous evaporation.'
        });
        break;

      default: // 'too_boring' or generic
        causes.push({ fragranceName: 'Layer synergy', accordOrNote: 'Both fragrances occupy very similar olfactory coordinates with minimal harmonic tension', contributionLevel: 'moderate' });
        suggestedAction = 'adjust_ratio';
        ratio = { ratioA: 70, ratioB: 30, spraysA: 3, spraysB: 1 };
        recommendedOrder = 'Create an asymmetrical chord: heavy dominant base (70%) with a single micro-accent drop (30%).';
        expectedOutcome = 'Injects dynamic contrast and curiosity without accord confusion.';
        break;
    }

    return {
      problemType: problemType.replace('_', ' ').toUpperCase(),
      identifiedCauses: causes,
      suggestedAction,
      recommendedRatio: ratio,
      recommendedOrder,
      suggestedWardrobeAdditions,
      expectedOutcome
    };
  },

  // 6. FEATURE #6: LAYER EXPERIMENT MODE
  getSavedExperiments(): LayerExperiment[] {
    try {
      const stored = localStorage.getItem(EXPERIMENTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading layer experiments:', e);
    }
    return [];
  },

  saveExperiment(exp: Omit<LayerExperiment, 'id' | 'createdAt'>): LayerExperiment {
    const fullExp: LayerExperiment = {
      ...exp,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString()
    };

    const list = this.getSavedExperiments();
    list.unshift(fullExp);
    try {
      localStorage.setItem(EXPERIMENTS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('Error saving experiment:', e);
    }

    // Trigger feedback learning event
    this.recordEvent({
      type: 'EXPERIMENT',
      fragranceId: exp.fragranceA.id,
      fragranceName: exp.fragranceA.name,
      layerPartnerId: exp.fragranceB.id,
      layerPartnerName: exp.fragranceB.name,
      value: exp.personalEnjoyment,
      notes: `Experiment "${exp.title}" rated ${exp.personalEnjoyment}/10. Balance: ${exp.balanceScore}/10.`
    }, exp.fragranceA);

    return fullExp;
  },

  // 7. FEATURE #7: NATURAL LANGUAGE SCENT SEARCH
  interpretNaturalLanguageSearch(query: string, allFragrances: Fragrance[]): NaturalLanguageScentResult {
    const q = query.toLowerCase();

    // Baseline vector initialized from query analysis
    const vector: OlfactoryVector8D = {
      freshness: 50,
      sweetness: 30,
      intensity: 60,
      woody: 50,
      floral: 40,
      warm_resinous_spices: 40,
      earthy_clay: 40,
      longevity_fixative: 70
    };

    const notesDetected: string[] = [];

    if (/wet soil|rain|petrichor|geosmin|clay|mitti|mud|monsoon/i.test(q)) {
      vector.earthy_clay = 95;
      vector.freshness = 70;
      vector.sweetness = 15;
      notesDetected.push('Baked Earth', 'Mitti Attar', 'Geosmin', 'Petrichor');
    }
    if (/dark forest|pine|cedar|deep woods|moss|wood|cypress/i.test(q)) {
      vector.woody = 92;
      vector.earthy_clay = 75;
      vector.freshness = 45;
      notesDetected.push('Cedarwood', 'Oakmoss', 'Patchouli', 'Pine Needle');
    }
    if (/clean.*not soapy|crisp|linen|mountain air|subtle/i.test(q)) {
      vector.freshness = 88;
      vector.sweetness = 25;
      vector.intensity = 45;
      notesDetected.push('White Musk', 'Bergamot', 'Ambroxan', 'Neroli');
    }
    if (/expensive.*subtle|quiet luxury|sophisticated|understated/i.test(q)) {
      vector.woody = 80;
      vector.intensity = 55;
      vector.sweetness = 35;
      vector.longevity_fixative = 85;
      notesDetected.push('Mysore Sandalwood', 'Orris', 'Iso E Super', 'Cardamom');
    }
    if (/warm.*seductive.*not sweet|smoky|leather|spicy|seductive/i.test(q)) {
      vector.warm_resinous_spices = 90;
      vector.sweetness = 28;
      vector.woody = 75;
      vector.intensity = 78;
      notesDetected.push('Black Cardamom', 'Birch Tar Leather', 'Dry Amber', 'Saffron');
    }
    if (/indian|attar|kannauj|shamama|ruh khus|traditional/i.test(q)) {
      vector.earthy_clay = Math.max(vector.earthy_clay, 80);
      vector.warm_resinous_spices = Math.max(vector.warm_resinous_spices, 80);
      notesDetected.push('Hydro-distilled Attar', 'Ruh Khus', 'Kannauj Rose', 'Shamama');
    }

    // Rank matching fragrances against interpreted vector
    const matches = allFragrances.map(frag => {
      const fragVec = extractFragranceVector8D(frag);
      const similarity = computeCosineSimilarity8D(vector, fragVec);
      const matchPct = Math.min(99, Math.round(similarity * 100));

      let matchType: 'exact_accord' | 'semantic_approximation' | 'ai_interpretation' = 'semantic_approximation';
      const allNotesStr = [...(frag.top_notes || []), ...(frag.middle_notes || []), ...(frag.base_notes || [])].join(' ').toLowerCase();

      const exactHit = notesDetected.some(n => allNotesStr.includes(n.toLowerCase()));
      if (exactHit) matchType = 'exact_accord';
      else if (matchPct >= 85) matchType = 'ai_interpretation';

      return {
        fragrance: frag,
        matchPercentage: matchPct,
        explanation: `${matchPct}% alignment with interpreted olfactory vector. Highlights ${(frag.top_notes || []).slice(0, 2).join(' & ')} over an anchor of ${(frag.base_notes || []).slice(0, 2).join(' & ')}.`,
        matchType
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 6);

    return {
      query,
      interpretedVector: vector,
      interpretedNotes: notesDetected.length > 0 ? notesDetected : ['Woody Accord', 'Aromatic Citrus', 'Resinous Base'],
      interpretedMood: `Interpreted olfactory aesthetic: ${notesDetected.slice(0, 3).join(', ') || 'Sophisticated Balanced Sillage'}`,
      matches
    };
  },

  // 8. FEATURE #9: SHOULD I BUY THIS? (Purchase Advisor)
  evaluatePurchaseAdvice(candidate: Fragrance, ownedFragrances: Fragrance[]): PurchaseAdvisorAnalysis {
    const dna = this.getLivingDNA();
    const candidateVec = extractFragranceVector8D(candidate);
    const dnaSim = computeCosineSimilarity8D(dna.vector, candidateVec);
    const dnaScore = Math.round(dnaSim * 100);

    const safeOwned = Array.isArray(ownedFragrances) ? ownedFragrances : [];

    // Check overlap with owned wardrobe
    let maxOverlap = 0;
    const similarOwned: Fragrance[] = [];

    safeOwned.forEach(owned => {
      const ownedVec = extractFragranceVector8D(owned);
      const sim = Math.round(computeCosineSimilarity8D(candidateVec, ownedVec) * 100);
      if (sim >= 70) {
        similarOwned.push(owned);
      }
      if (sim > maxOverlap) maxOverlap = sim;
    });

    const pros: string[] = [];
    const cons: string[] = [];

    if (dnaScore >= 80) {
      pros.push(`Exceptional alignment with your personal Olfactory DNA (${dnaScore}% compatibility).`);
    } else {
      cons.push(`Moderate divergence from your core preferences (${dnaScore}% DNA fit).`);
    }

    // Gap analysis contribution
    let gapContribution = 'Balanced signature addition';
    const hasFamily = safeOwned.some(o => (o.fragrance_family || '').toLowerCase() === (candidate.fragrance_family || '').toLowerCase());
    if (!hasFamily) {
      pros.push(`Fills a structural collection gap in your wardrobe: introduces ${candidate.fragrance_family}.`);
      gapContribution = `Fills ${candidate.fragrance_family} collection vacuum`;
    } else {
      cons.push(`You already own ${similarOwned.length} fragrance(s) occupying similar ${candidate.fragrance_family} territory.`);
    }

    if (maxOverlap >= 80) {
      cons.push(`High wardrobe overlap (${maxOverlap}%) with ${similarOwned[0]?.name || 'existing bottle'}.`);
    } else {
      pros.push(`Low redundancy (${maxOverlap}% maximum overlap) — expands your wearable scent horizons.`);
    }

    const price = candidate.price_inr || 2500;
    if (price < 2500) {
      pros.push(`Exceptional value per milliliter for an artisanal ${candidate.format || 'EDP'}.`);
    }

    // Overall Score (0 - 100)
    let purchaseScore = Math.round(dnaScore * 0.5 + (100 - maxOverlap) * 0.35 + (!hasFamily ? 15 : 5));
    purchaseScore = Math.max(25, Math.min(98, purchaseScore));

    const shouldBuy = purchaseScore >= 75;
    const verdict = shouldBuy
      ? `RECOMMENDED: A high-value addition that enriches your ${dna.personalityTitle} identity without creating redundant clutter.`
      : `CONSIDER SKIPPING: High redundancy with your current wardrobe flacons (${maxOverlap}% overlap with ${similarOwned[0]?.name || 'current bottle'}). Explore adjacent categories instead.`;

    return {
      fragrance: candidate,
      score: purchaseScore,
      wardrobeOverlapPct: maxOverlap,
      similarOwnedFragrances: similarOwned.slice(0, 3),
      pros,
      cons,
      gapContribution,
      verdict,
      shouldBuy
    };
  },

  // 9. FEATURE #15: WHY DON'T I LIKE THIS?
  explainMismatch(fragrance: Fragrance): MismatchAnalysis {
    const dna = this.getLivingDNA();
    const memory = this.getScentMemory();
    const fragVec = extractFragranceVector8D(fragrance);

    const axes: (keyof OlfactoryVector8D)[] = [
      'sweetness', 'earthy_clay', 'woody', 'freshness',
      'floral', 'warm_resinous_spices', 'intensity', 'longevity_fixative'
    ];

    const deltas = axes.map(axis => {
      const userVal = dna.vector[axis];
      const fragVal = fragVec[axis];
      const diff = fragVal - userVal;
      return {
        axis: axis.replace(/_/g, ' ').toUpperCase(),
        userValue: userVal,
        fragranceValue: fragVal,
        difference: diff
      };
    }).sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

    const reasons: string[] = [];
    deltas.slice(0, 3).forEach(d => {
      if (Math.abs(d.difference) >= 25) {
        if (d.difference > 0) {
          reasons.push(`${d.axis} is +${d.difference} points higher than your calibrated comfort ceiling (Fragrance: ${d.fragranceValue}/100 vs Your DNA: ${d.userValue}/100).`);
        } else {
          reasons.push(`${d.axis} is lacking (-${Math.abs(d.difference)} points below what your nose seeks for satisfaction).`);
        }
      }
    });

    const isPotentialMismatch = Math.abs(deltas[0].difference) >= 30;
    const mismatchScore = Math.min(99, Math.round(Math.abs(deltas[0].difference) * 1.2 + Math.abs(deltas[1]?.difference || 0) * 0.5));

    let previousRatingsWarning: string | undefined;
    if (memory.dislikes.includes(fragrance.id)) {
      previousRatingsWarning = `You previously flagged this exact fragrance as a personal dislike.`;
    }

    return {
      fragrance,
      isPotentialMismatch,
      mismatchScore,
      largestDeltas: deltas.slice(0, 4),
      reasons: reasons.length > 0 ? reasons : ['Minor accord tension with your core olfactory profile.'],
      previousRatingsWarning,
      recommendation: isPotentialMismatch
        ? `Likely accord mismatch: if you wish to wear this, layer it with a grounding dry woody attar to counterbalance the excess ${deltas[0].axis.toLowerCase()}.`
        : `Acceptable variance: this composition nudges your comfort boundaries without olfactory clash.`
    };
  },

  // 10. FEATURE #28: FRAGRANCE TWIN
  findFragranceTwin(allFragrances: Fragrance[]): FragranceTwinResult {
    const dna = this.getLivingDNA();
    const safeAll = allFragrances.length > 0 ? allFragrances : [];

    let bestMatch = safeAll[0];
    let highestSim = 0;

    safeAll.forEach(f => {
      const fVec = extractFragranceVector8D(f);
      const sim = computeCosineSimilarity8D(dna.vector, fVec);
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = f;
      }
    });

    const twinVec = extractFragranceVector8D(bestMatch);
    const axes: (keyof OlfactoryVector8D)[] = [
      'woody', 'earthy_clay', 'freshness', 'warm_resinous_spices', 'sweetness', 'intensity'
    ];

    const matchingAxes = axes.map(axis => ({
      axis: axis.replace(/_/g, ' ').toUpperCase(),
      userScore: dna.vector[axis],
      fragranceScore: twinVec[axis],
      alignmentPercentage: Math.max(50, Math.round(100 - Math.abs(dna.vector[axis] - twinVec[axis])))
    }));

    return {
      fragrance: bestMatch,
      dnaCompatibilityScore: Math.round(highestSim * 100),
      matchingAxes,
      narrative: `${bestMatch.name} by ${bestMatch.brand_name || bestMatch.brand} resonates at ${Math.round(highestSim * 100)}% with your ${dna.personalityTitle} identity. It mirrors your exact balance of ${(bestMatch.top_notes || []).slice(0, 2).join(' & ')} with base ${(bestMatch.base_notes || []).slice(0, 2).join(' & ')}.`
    };
  },

  // 11. FEATURE #29: COMFORT-ZONE CHALLENGER
  getComfortZoneChallengers(allFragrances: Fragrance[]): ComfortZoneRecommendation[] {
    const dna = this.getLivingDNA();
    const safeAll = allFragrances.length > 0 ? allFragrances : [];

    const scored = safeAll.map(frag => {
      const vec = extractFragranceVector8D(frag);
      const sim = computeCosineSimilarity8D(dna.vector, vec);
      return { frag, sim, vec };
    });

    const familiar = scored.find(s => s.sim >= 0.88 && s.sim <= 0.98) || scored[0];
    const adjacent = scored.find(s => s.sim >= 0.74 && s.sim < 0.88) || scored[1];
    const experimental = scored.find(s => s.sim >= 0.60 && s.sim < 0.74) || scored[2];
    const radical = scored.find(s => s.sim >= 0.40 && s.sim < 0.60) || scored[3];

    const makeRec = (level: ComfortZoneRecommendation['level'], item: typeof scored[0], why: string): ComfortZoneRecommendation => ({
      level,
      fragrance: item.frag,
      familiarAnchorNotes: (item.frag.base_notes || []).slice(0, 2),
      challengingNotes: (item.frag.top_notes || item.frag.middle_notes || []).slice(0, 2),
      whyItWorks: why,
      comfortBridgeScore: Math.round(item.sim * 100)
    });

    return [
      makeRec('FAMILIAR', familiar, 'Comfort baseline: closely matches your core 8-D vector coordinates with zero friction.'),
      makeRec('ADJACENT', adjacent, 'Preserves your dry woody base but introduces a contrasting floral or green top accord.'),
      makeRec('EXPERIMENTAL', experimental, 'Shifts your dominant accord balance while retaining familiar fixative anchors.'),
      makeRec('RADICAL', radical, 'A complete olfactory departure designed to stimulate new neural scent receptors.')
    ];
  },

  // 12. FEATURE #11: TRAVEL SCENT CAPSULE
  buildTravelCapsule(
    destination: string,
    durationDays: number,
    weatherContext: string,
    dressStyle: string,
    wardrobe: Fragrance[]
  ): TravelCapsule {
    const safe = wardrobe.length >= 3 ? wardrobe : this.getScentMemory().likes.length >= 3 ? wardrobe : wardrobe;

    // Pick 3 diverse flacons
    const dayFrag = safe.find(f => f.freshness >= 6) || safe[0];
    const eveningFrag = safe.find(f => f.id !== dayFrag.id && (f.intensity >= 7 || f.sweetness >= 6 || (f.fragrance_family || '').includes('Wood'))) || safe[1];
    const flexibleFrag = safe.find(f => f.id !== dayFrag.id && f.id !== eveningFrag.id) || safe[2] || safe[0];

    return {
      destination,
      durationDays,
      weatherSummary: weatherContext || 'Temperate to warm with variable humidity',
      activities: ['Sightseeing & Daytime Exploration', 'Formal Dining & Evening Lounge', 'Casual Transit'],
      coverageScorePct: 91,
      fragrances: [
        {
          role: 'Day / Heat',
          fragrance: dayFrag,
          why: `Effervescent ${(dayFrag.top_notes || []).slice(0, 2).join(', ')} handles morning warmth without becoming cloying.`
        },
        {
          role: 'Evening / Dinner',
          fragrance: eveningFrag,
          why: `Rich ${(eveningFrag.base_notes || []).slice(0, 2).join(' & ')} delivers magnetic evening presence.`
        },
        {
          role: 'Flexible / All-Rounder',
          fragrance: flexibleFrag,
          why: `Versatile signature that adapts effortlessly from casual strolls to business dinners.`
        }
      ],
      suggestedLayerChord: {
        fragA: dayFrag,
        fragB: eveningFrag,
        technique: '1 spritz day scent on collar + 1 spray evening base on wrists converts daytime wear into nightlife depth.'
      }
    };
  },

  // 13. PURCHASE DECISION INTELLIGENCE
  analyzePurchaseDecision(candidate: Fragrance, wardrobe: Fragrance[]): PurchaseDecisionAnalysis {
    const candidateVec = extractFragranceVector8D(candidate);
    const safeWardrobe = wardrobe.length > 0 ? wardrobe : [candidate];

    // Find highest similarity
    let highestSim = 0;
    let closestTwin = safeWardrobe[0];

    for (const owned of safeWardrobe) {
      const ownedVec = extractFragranceVector8D(owned);
      const sim = computeCosineSimilarity8D(candidateVec, ownedVec);
      if (sim > highestSim) {
        highestSim = sim;
        closestTwin = owned;
      }
    }

    const redundancyScore = Math.round(highestSim * 100);

    // Identify gaps filled
    const gapsFilled: string[] = [];
    if (candidateVec.freshness >= 75 && !safeWardrobe.some(f => extractFragranceVector8D(f).freshness >= 75)) {
      gapsFilled.push('High-Heat Solar Citrus / Aquatic Sillage');
    }
    if (candidateVec.earthy_clay >= 70 && !safeWardrobe.some(f => extractFragranceVector8D(f).earthy_clay >= 70)) {
      gapsFilled.push('Alluvial Mitti / Geosmin Petrichor Accord');
    }
    if (candidateVec.warm_resinous_spices >= 75 && !safeWardrobe.some(f => extractFragranceVector8D(f).warm_resinous_spices >= 75)) {
      gapsFilled.push('Deep Nocturnal Amber & Assam Resins');
    }
    if (candidate.format === 'Attar' && !safeWardrobe.some(f => f.format === 'Attar')) {
      gapsFilled.push('Alcohol-Free Pure Botanical Hydro-Distillate');
    }

    // Wear days calculation
    const estimatedWearDaysPerYear = Math.max(12, Math.round(55 * (1 - (redundancyScore / 130)) + gapsFilled.length * 8));

    let recommendation: 'STRONG_ADDITION' | 'CONSIDER_DECANT_FIRST' | 'REDUNDANT_DUPLICATE';
    let explanation: string;

    if (redundancyScore >= 85) {
      recommendation = 'REDUNDANT_DUPLICATE';
      explanation = `Heavy accord overlap with ${closestTwin.name} (${redundancyScore}% similarity). Both occupy the ${closestTwin.fragrance_family} axis with nearly indistinguishable base notes. Unless you are seeking a backup bottle, your collection already performs this exact role.`;
    } else if (redundancyScore >= 70 || gapsFilled.length === 0) {
      recommendation = 'CONSIDER_DECANT_FIRST';
      explanation = `Shares moderate structural alignment (${redundancyScore}%) with ${closestTwin.name}. We suggest acquiring a 5ml or 10ml travel decant to test how your dermal chemistry differentiates the heart notes before committing to a full luxury flacon.`;
    } else {
      recommendation = 'STRONG_ADDITION';
      explanation = `Fills genuine blind spots in your olfactory vault with low redundancy (${redundancyScore}% overlap). It diversifies your wardrobe and provides ${gapsFilled.join(', ')}. Estimated wear frequency of ~${estimatedWearDaysPerYear} days per year.`;
    }

    return {
      recommendation,
      redundancyScore,
      mostSimilarOwnedFragrance: closestTwin,
      gapsFilled,
      estimatedWearDaysPerYear,
      explanation
    };
  },

  // 14. ROTATION AI & NEGLECTED FLACONS
  getNeglectedFragrances(wardrobe: Fragrance[]): Fragrance[] {
    const memory = this.getScentMemory();
    const wornIds = new Set(memory.history.map(h => h.fragranceId));

    // Bottles not in recent history
    const unworn = wardrobe.filter(f => !wornIds.has(f.id));
    if (unworn.length > 0) return unworn.slice(0, 3);

    // Or reverse history to find least recently worn
    const sorted = [...wardrobe].sort((a, b) => {
      const idxA = memory.history.findIndex(h => h.fragranceId === a.id);
      const idxB = memory.history.findIndex(h => h.fragranceId === b.id);
      return idxA - idxB;
    });
    return sorted.slice(0, 3);
  },

  // 15. SCENT CALENDAR RECENT WEARS
  getRecentWears(): RecentWearItem[] {
    const memory = this.getScentMemory();
    if (memory.history.length === 0) {
      return [
        {
          id: 'w-mock-1',
          fragranceId: 1,
          fragranceName: 'Mysore Sandalwood & Mitti Attar',
          occasion: 'Evening Sanctuary',
          weatherSummary: '24°C • High Humidity',
          satisfactionRating: 10,
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'w-mock-2',
          fragranceId: 6,
          fragranceName: 'Raw by SKINN Titan',
          occasion: 'Morning Energy & Office',
          weatherSummary: '31°C • Sunny',
          satisfactionRating: 8,
          timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 'w-mock-3',
          fragranceId: 7,
          fragranceName: 'Assam Oud Sovereign',
          occasion: 'Celebration & Black Tie',
          weatherSummary: '19°C • Cool Evening',
          satisfactionRating: 9,
          timestamp: new Date(Date.now() - 259200000).toISOString()
        }
      ];
    }

    return memory.history.map((h, i) => ({
      id: `w-${i}-${h.timestamp}`,
      fragranceId: h.fragranceId,
      fragranceName: h.fragranceName,
      occasion: h.occasion,
      weatherSummary: `${Math.round(h.weatherCondition.temperature_c)}°C • ${h.weatherCondition.condition}`,
      satisfactionRating: h.satisfactionRating,
      timestamp: h.timestamp
    }));
  },

  // 16. NATURAL LANGUAGE SEARCH WRAPPER
  searchNaturalLanguage(query: string, allFragrances: Fragrance[]) {
    const res = this.interpretNaturalLanguageSearch(query, allFragrances);
    return res.matches.map(m => ({
      fragrance: m.fragrance,
      confidence: m.matchPercentage,
      explanation: m.explanation,
      matchedNotes: (m.fragrance.top_notes || []).concat(m.fragrance.base_notes || []).slice(0, 3)
    }));
  },

  // 17. DISLIKED FRAGRANCE DIAGNOSIS
  diagnoseDislikedFragrance(fragrance: Fragrance, allFragrances: Fragrance[]) {
    const mismatch = this.explainMismatch(fragrance);
    const dna = this.getLivingDNA();

    const culpritNotes = (fragrance.top_notes || [])
      .concat(fragrance.middle_notes || [])
      .concat(fragrance.base_notes || [])
      .filter(n => {
        const lower = n.toLowerCase();
        return (
          mismatch.largestDeltas.some(d => d.difference > 20 && lower.includes(d.axis.toLowerCase().slice(0, 4))) ||
          lower.includes('vanilla') ||
          lower.includes('indol') ||
          lower.includes('synthetic') ||
          lower.includes('civet')
        );
      })
      .slice(0, 4);

    const safeCulprits = culpritNotes.length > 0 ? culpritNotes : [(fragrance.top_notes || ['Intense opening'])[0]];

    const vectorGaps = mismatch.largestDeltas.map(d => ({
      axis: d.axis,
      userDNA: d.userValue,
      fragranceVal: d.fragranceValue,
      delta: d.difference
    }));

    // Find clean alternatives without culprits
    const cleanAlternatives = allFragrances
      .filter(f => f.id !== fragrance.id && !safeCulprits.some(c => (f.top_notes || []).concat(f.base_notes || []).includes(c)))
      .slice(0, 2);

    return {
      culpritNotes: safeCulprits,
      sensoryExplanation: mismatch.reasons.join(' ') || 'The accord ratios in this composition over-saturate your sensory receptors.',
      vectorGaps,
      cleanAlternatives
    };
  },

  // 18. FIND FRAGRANCE TWINS (ARRAY)
  findFragranceTwins(target: Fragrance, allFragrances: Fragrance[]) {
    const targetVec = extractFragranceVector8D(target);
    const others = allFragrances.filter(f => f.id !== target.id);

    return others
      .map(f => {
        const vec = extractFragranceVector8D(f);
        const sim = computeCosineSimilarity8D(targetVec, vec);
        const sharedNotes = (f.top_notes || [])
          .concat(f.base_notes || [])
          .filter(n => (target.top_notes || []).concat(target.base_notes || []).includes(n));

        return {
          fragrance: f,
          similarityScore: Math.round(sim * 100),
          sharedNotes: sharedNotes.length > 0 ? sharedNotes : (f.base_notes || []).slice(0, 2),
          narrative: `Shares ${Math.round(sim * 100)}% structural proximity with ${target.name}. Features harmonic notes of ${(f.top_notes || []).slice(0, 2).join(' & ')} with base ${(f.base_notes || []).slice(0, 2).join(' & ')}.`
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 3);
  },

  // 19. COMFORT ZONE RECOMMENDATIONS ALIAS
  getComfortZoneRecommendations(allFragrances: Fragrance[]): ComfortZoneRecommendation[] {
    return this.getComfortZoneChallengers(allFragrances);
  },

  // 20. RECORD WEAR EVENT
  recordWear(params: {
    fragranceId: number;
    fragranceName: string;
    weatherCondition: WeatherCondition;
    occasion: string;
    partnerFragranceId?: number;
    partnerFragranceName?: string;
    satisfactionRating?: number;
  }) {
    const memory = this.getScentMemory();
    const newEntry = {
      fragranceId: params.fragranceId,
      fragranceName: params.fragranceName,
      weatherCondition: params.weatherCondition,
      occasion: params.occasion,
      partnerFragranceId: params.partnerFragranceId,
      partnerFragranceName: params.partnerFragranceName,
      satisfactionRating: params.satisfactionRating || 9,
      timestamp: new Date().toISOString()
    };
    memory.history.unshift(newEntry);
    this.saveScentMemory(memory);
  }
};
