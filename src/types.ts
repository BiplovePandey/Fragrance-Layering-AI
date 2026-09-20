export type BrandClassification =
  | 'Indian Mass Fragrance'
  | 'Indian Designer'
  | 'Indian Luxury'
  | 'Indian Niche'
  | 'Indian Artisan'
  | 'Indian Attar House'
  | 'Kannauj Attar House'
  | 'Heritage Perfumery'
  | 'Botanical Fragrance House'
  | 'Institutional / Traditional'
  | 'International Niche'
  | 'International Luxury'
  | 'Other';

export type BrandOriginType = 'INDIAN_ORIGIN' | 'INTERNATIONAL_AVAILABLE_IN_INDIA';

export interface OlfactoryVector8D {
  freshness: number; // 0 - 100
  sweetness: number; // 0 - 100
  intensity: number; // 0 - 100
  woody: number; // 0 - 100
  floral: number; // 0 - 100
  warm_resinous_spices: number; // 0 - 100
  earthy_clay: number; // 0 - 100
  longevity_fixative: number; // 0 - 100
}

export interface Brand {
  id: number;
  name: string;
  country: string;
  brand_type: string; // e.g. 'major_indian_mass' | 'indian_niche' | 'heritage_attar' | 'luxury_ayurvedic' | 'perfume_oils' | 'international_niche' | 'international_designer';
  category: string; // 'Designer / mass Indian' | 'Indian niche' | 'Attar' | 'Traditional Kannauj' | 'Perfume oils' | 'Luxury Indian' | 'Ayurvedic fragrance' | 'Indie/D2C' | 'Oud-focused' | 'Natural/essential-oil' | 'International luxury';
  brand_classification?: BrandClassification;
  origin_type?: BrandOriginType;
  origin_style: string;
  description: string;
  founded_year?: number;
  website?: string;
  city?: string;
  logo?: string;
}

export interface NoteTaxonomyEntry {
  id?: number;
  raw_term: string;
  original_note: string;
  normalized_name: string;
  note_family: 'Floral' | 'Woody' | 'Earthy' | 'Spices' | 'Fruits / Indian ingredients' | 'Citrus' | 'Sweet / gourmand' | 'Resinous / warm';
  category: string;
  origin: 'Indian' | 'International' | 'Both';
  english_equivalent?: string;
  cultural_context?: string;
}

export interface Fragrance {
  id: number;
  brand_id?: number;
  brand: string;
  brand_name?: string;
  brand_country?: string;
  brand_type?: string;
  category?: string;
  collection?: string; // e.g. "Men's Fine Fragrance", "Code Series", "Intense Perfume", "Solid Perfume"
  name: string;
  format?: 'Attar' | 'Concentrated Perfume Oil' | 'Eau de Parfum' | 'Eau de Toilette' | 'Extrait de Parfum' | 'Eau de Cologne' | 'Parfum' | 'Pure Oud Oil' | 'Bakhoor' | 'Fine Fragrance Mist' | 'Solid Perfume' | 'Pure Botanical Distillate' | 'Body Perfume' | 'Deodorant / Body Spray';
  fragrance_type?: string; // e.g. 'Eau de Parfum', 'Intense Perfume', 'Solid Perfume', 'Pure Oil'
  concentration?: string; // e.g. 'EDP (15-20%)', 'EDT (8-15%)', 'Extrait (25-35%)', 'Pure Perfume Oil (100%)', 'Solid Perfume Wax'
  gender: 'unisex' | 'masculine' | 'feminine';
  description: string;
  origin_style?: string; // 'Indian / Traditional' | 'Western Designer' | 'French Haute Parfumerie' | 'Fusion' | 'Middle Eastern / Oriental'
  price_min?: number | null;
  price_max?: number | null;
  price_inr?: number | null;
  currency?: string; // 'INR' | 'USD' | 'EUR'
  volume_ml?: number | null;
  is_oil_based?: boolean;
  season: string[]; // e.g. ['Spring', 'Summer', 'Monsoon', 'Winter', 'Fall']
  occasion: string[]; // e.g. ['Office', 'Date', 'Casual', 'Evening', 'Wedding', 'Festive / Puja', 'Meditation / Spiritual']
  intensity: number; // 1-10
  sweetness: number; // 1-10
  freshness: number; // 1-10
  longevity: string;
  fragrance_family: string;
  top_notes: string[];
  middle_notes: string[];
  base_notes: string[];
  normalized_notes?: string[];
  source?: string; // 'brand_official' | 'curated_catalog'
  source_url?: string;
  source_date?: string;
  last_verified?: string; // e.g. '2026-09-08'
  data_confidence?: number;
  status?: 'verified' | 'needs_verification';
  active?: boolean;
  is_gift_set?: boolean; // false for individual perfumes
  product_category?: 'fine_perfume' | 'deodorant_spray' | 'talc_lotion' | 'gift_set';
  cluster_id?: number;
  cluster_label?: string;
  vector?: number[];
  vector_confidence?: number;
  vector_generation_source?: 'rule_based_taxonomy' | 'manual' | 'expert_consensus' | 'hybrid';
  accords?: string[];
  projection?: 'intimate' | 'moderate' | 'strong' | 'room-filling' | string | null;
  time_of_day?: string[];
  heritage_materials?: string[];
  distillation_method?: string | null;
  heritage_relationship?: string | null;
  image_url?: string;
}

export interface CanonicalFragranceImport {
  identity: {
    name: string;
    brand_name: string;
    brand_country?: string;
    brand_type?: string;
    collection?: string;
    gender?: 'unisex' | 'masculine' | 'feminine';
    concentration?: string;
    format?: string;
    is_oil_based?: boolean;
    volume_ml?: number | null;
    price_inr?: number | null;
    currency?: string;
    description?: string;
  };
  scent_structure: {
    fragrance_family: string;
    top_notes?: string[];
    middle_notes?: string[];
    base_notes?: string[];
    notes_general?: string[];
    accords?: string[];
  };
  performance?: {
    intensity?: number;
    freshness?: number;
    sweetness?: number;
    longevity?: string;
    projection?: 'intimate' | 'moderate' | 'strong' | 'room-filling' | null;
  };
  context?: {
    seasons?: string[];
    occasions?: string[];
    time_of_day?: string[];
  };
  heritage?: {
    is_heritage?: boolean;
    origin_style?: string;
    heritage_materials?: string[];
    heritage_region?: string;
    region?: string;
    distillation_method?: string | null;
    heritage_relationship?: string | null;
  };
  provenance?: {
    source?: string;
    source_url?: string | null;
    source_date?: string;
    last_verified?: string;
    data_confidence?: number;
    status?: 'verified' | 'needs_verification';
  };
  ml_metadata?: {
    vector?: number[];
    vector_confidence?: number;
    vector_generation_source?: 'rule_based_taxonomy' | 'manual' | 'expert_consensus' | 'hybrid';
  };
}

export interface CanonicalImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CanonicalImportResolution {
  action: 'insert' | 'update' | 'skip';
  existingFragrance?: Fragrance;
  reason: string;
}

export interface MasterCatalogSchemaRow {
  brand: string;
  collection: string;
  name: string;
  gender: string;
  type: string;
  concentration: string;
  top_notes: string;
  heart_notes: string;
  base_notes: string;
  source_url: string;
  last_verified: string;
  status: 'verified' | 'needs_verification';
}

export interface Note {
  id: number;
  name: string;
  category: 'citrus' | 'floral' | 'woody' | 'gourmand' | 'warm' | 'spicy' | 'fresh' | 'aromatic' | 'oriental' | 'fruity' | 'aquatic' | 'leather' | 'earthy_clay';
}

export type Season = 'Spring' | 'Summer' | 'Monsoon' | 'Fall' | 'Winter';
export type Occasion = 'Office' | 'Date' | 'Casual' | 'Evening' | 'Signature' | 'Special Event' | 'Formal' | 'Festive / Wedding' | 'Wedding' | 'Festive / Puja' | 'Meditation / Spiritual';

export interface UserPreferences {
  favorite_family?: string[];
  preferred_notes?: string[];
  sweetness: number; // 1-10
  freshness: number; // 1-10
  intensity: number; // 1-10
  preferred_gender?: 'all' | 'unisex' | 'masculine' | 'feminine';
  season?: Season;
  occasion?: Occasion;
  time_of_day?: 'Day' | 'Evening' | 'Night' | 'Any';
  origin_filter?: 'all' | 'indian' | 'international' | 'fusion';
  format_filter?: 'all' | 'attar' | 'edp' | 'oil';
  brand_category_filter?: 'all' | 'Designer / mass Indian' | 'Indian niche' | 'Attar' | 'Traditional Kannauj' | 'Perfume oils' | 'Luxury Indian' | 'Ayurvedic fragrance' | 'Indie/D2C' | 'Oud-focused' | 'Natural/essential-oil' | 'International luxury';
  owned_fragrance_id?: number;
}

export type DailyMoodId =
  | 'fresh_energetic'
  | 'warm_seductive'
  | 'clean_calm'
  | 'romantic_soft'
  | 'dark_woody'
  | 'indian_soul'
  | 'surprise_me';

export interface DailyMoodPreset {
  id: DailyMoodId;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  preferredNotes: string[];
  favoriteFamily: string[];
  sweetness: number;
  freshness: number;
  intensity: number;
  season: string;
  occasion: string;
  timeOfDay: string;
  originFilter: 'all' | 'indian' | 'international';
  formatFilter?: 'all' | 'attar' | 'edp';
  accentColor: string;
  secondaryColor: string;
}

export interface RecommendationScore {
  fragrance: Fragrance;
  total_score: number; // 0 - 100
  breakdown: {
    preference_similarity: number;
    season_match: number;
    occasion_match: number;
    note_similarity: number;
    intensity_match: number;
  };
}

export interface LayeringResult {
  id?: string;
  fragrance_a: Fragrance;
  fragrance_b: Fragrance;
  compatibility_score: number; // 0 - 100
  breakdown: {
    note_compatibility: number;
    user_preference_match: number;
    season_compatibility: number;
    occasion_compatibility: number;
    complementary_note_score: number;
    diversity_factor: number;
  };
  explanation: string;
  why_it_works: {
    opening_harmony: string;
    drydown_depth: string;
    application_tip: string;
  };
  is_cross_origin?: boolean;
  origin_pairing_type?: 'cross_origin_fusion' | 'pure_indian_heritage' | 'pure_western_luxury' | 'western_middle_eastern';
  layering_method?: string; // e.g. 'Attar Base + Spray Diffusion' | 'Dual Spray Synergy' | 'Dual Attar Compounding'
  best_season: string;
  best_occasion: string;
  best_time_of_day: string;
  created_at?: string;
}

export interface UserRating {
  id?: number;
  fragrance_a_id: number;
  fragrance_b_id: number;
  rating: number; // 1 - 5
  feedback_tag?: string;
  created_at?: string;
}

export interface SavedCombination {
  id: number;
  fragrance_a: Fragrance;
  fragrance_b: Fragrance;
  compatibility_score: number;
  explanation: string;
  best_season: string;
  best_occasion: string;
  saved_at: string;
  user_rating?: number;
}

export interface ClusterInfo {
  cluster_id: number;
  name: string;
  description: string;
  dominant_features: {
    feature: string;
    value: number;
  }[];
  fragrance_count: number;
  sample_fragrances: { id: number; name: string; brand: string }[];
}

export type MainNavId =
  | 'atelier'
  | 'wear'
  | 'layer'
  | 'explore'
  | 'wardrobe'
  | 'discover'
  | 'heritage'
  | 'community'
  | 'mydna'
  | 'scanner'
  | 'academy';

export interface SecondaryOlfactoryCharacteristics {
  citrus: number;      // 0 - 100
  green: number;       // 0 - 100
  aquatic: number;     // 0 - 100
  aromatic: number;    // 0 - 100
  smoky: number;       // 0 - 100
  powdery: number;     // 0 - 100
  musky: number;       // 0 - 100
  creamy: number;      // 0 - 100
  dry: number;         // 0 - 100
  mineral: number;     // 0 - 100
  fruity: number;      // 0 - 100
  leathery: number;    // 0 - 100
}

export interface WeatherCondition {
  temperature_c: number;
  humidity_pct: number;
  condition: 'sunny_warm' | 'monsoon_rain' | 'crisp_autumn' | 'chilly_winter' | 'tropical_humid' | 'temperate';
  label: string;
  season: Season;
  time_of_day: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  perceived_modifiers: {
    intensityFactor: number;
    freshnessFactor: number;
    projectionFactor: number;
    longevityHoursMod: number;
  };
}

export interface ScentEvolutionStep {
  time_label: '0m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h+';
  minutes: number;
  phase_title: string;
  dominant_phase: 'Top Notes Effervescence' | 'Heart Accord Transition' | 'Full Drydown Base Anchor';
  projection_radius_feet: number;
  remaining_intensity_pct: number;
  active_accords: string[];
  description: string;
  radar_values: {
    freshness: number;
    sweetness: number;
    intensity: number;
    woody: number;
    floral: number;
    warmth: number;
  };
}

export interface UserWardrobeBottle {
  id: string;
  fragrance_id: number;
  fragrance: Fragrance;
  status: 'owned' | 'sample' | 'wishlist';
  level_pct: number; // 0 to 100
  personal_rating?: number;
  wear_count: number;
  last_worn?: string;
  notes_memo?: string;
  added_date: string;
  layering_partner_id?: number;
}

export interface WardrobeAnalytics {
  totalBottles: number;
  ownedCount: number;
  samplesCount: number;
  wishlistCount: number;
  familyDistribution: { family: string; count: number; percentage: number }[];
  dominantNotes: { note: string; count: number }[];
  seasonalCoverage: { season: string; coverage: 'Optimal' | 'Balanced' | 'Low'; count: number }[];
  occasionCoverage: { occasion: string; count: number }[];
  collectionGaps: { category: string; description: string; recommendedFragrance: string }[];
  possibleLayeringCount: number;
}

export interface CommunityRecipe {
  id: string;
  title: string;
  author: string;
  author_name?: string;
  author_avatar?: string;
  author_badge?: string;
  author_level: string;
  fragrance_a: Fragrance;
  fragrance_b: Fragrance;
  fragrance_c?: Fragrance;
  chord_name: string;
  compatibility_score: number;
  ratio: string;
  spray_order: string;
  wait_time: string;
  review: string;
  description?: string;
  season: string;
  season_tags?: string[];
  occasion: string;
  likes: number;
  upvotes?: number;
  has_liked?: boolean;
  remixes_count: number;
  created_at: string;
  tags: string[];
}

export interface HeritageEntry {
  id: string;
  name: string;
  hindi_name: string;
  botanical_name?: string;
  region: string;
  historical_period: string;
  extraction_method: string;
  olfactory_profile: {
    description: string;
    dominant_families: string[];
    notes: string[];
    evocative_imagery: string;
  };
  traditional_role: string;
  modern_indian_fragrances: { name: string; brand: string; id?: number }[];
  international_equivalents: { name: string; brand: string }[];
  layering_chords: { companion_family: string; chord_title: string; technique: string }[];
  coordinates?: { lat: number; lng: number };
  category?: 'attar' | 'botanical' | 'wood' | 'spice' | 'mineral';
  atmosphere_preset?: string;
  gi_tag?: string;
}

export interface UserGamification {
  xp: number;
  level: number;
  title: 'Scent Explorer' | 'Note Hunter' | 'Layering Apprentice' | 'Fragrance Alchemist' | 'Olfactory Expert' | 'Olfactory Master';
  nextLevelXp: number;
  badges?: string[];
  achievements: {
    id: string;
    title: string;
    desc: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    max: number;
  }[];
}

export interface AIProductSubmission {
  id: string;
  brand: string;
  product: string;
  collection: string;
  concentration: string;
  format: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  accords: string[];
  description: string;
  country: string;
  launch_year?: number;
  perfumer?: string;
  source_url: string;
  status: 'pending' | 'approved' | 'rejected';
  confidence_score: number;
  validation_flags: {
    passFineFragrance: boolean;
    duplicateDetected: boolean;
    completeData: boolean;
    concentrationValid: boolean;
  };
  submitted_by: string;
  submitted_at: string;
}

export interface FragranceJournalEntry {
  id: string;
  date: string;
  fragrance_id: number;
  fragrance_name: string;
  brand_name: string;
  is_layering?: boolean;
  layering_partner_id?: number;
  layering_partner_name?: string;
  weather_temp_c?: number;
  weather_condition?: string;
  occasion: string;
  spray_count: number;
  application_spots: string[];
  observed_longevity_hours: number;
  observed_projection: 'Intimate' | 'Moderate' | 'Strong' | 'Room-filling';
  mood: string;
  rating: number; // 1-5
  notes_memo: string;
}

export interface ScentBattleMetric {
  metric: string;
  fragrance_a_score: number; // 0-100
  fragrance_b_score: number; // 0-100
  winner: 'a' | 'b' | 'tie';
  verdict: string;
}

export interface ScentBattleComparison {
  fragrance_a: Fragrance;
  fragrance_b: Fragrance;
  overall_winner: 'a' | 'b' | 'tie';
  summary: string;
  metrics: ScentBattleMetric[];
  layering_potential: {
    can_layer_together: boolean;
    compatibility_score: number;
    tip: string;
  };
}

export interface SampleDiscoveryBoxConfig {
  budget_inr: number;
  user_preferences?: UserPreferences;
  selected_samples: Fragrance[];
  total_price_inr: number;
  diversity_score: number; // 0-100
  curation_reason: string;
  families_covered: string[];
  missing_families_addressed: string[];
}

export interface RetailSalespersonOutput {
  customer_profile_summary: string;
  top_recommendations: {
    fragrance: Fragrance;
    sales_pitch: string;
    why_for_customer: string;
    suggested_layer_with?: Fragrance;
    upsell_note?: string;
  }[];
  sample_set_suggestion: Fragrance[];
}

export interface BrandIntelligenceSummary {
  total_brands: number;
  total_products: number;
  verified_count: number;
  needs_review_count: number;
  attar_houses_count: number;
  niche_houses_count: number;
  mass_brands_count: number;
  heritage_houses_count: number;
  discontinued_count: number;
  duplicate_candidates_count: number;
  growth_rate_pct: number;
  coverage_by_category: { category: string; count: number }[];
}

// ================= OLFACTORY INTELLIGENCE SYSTEM V2 TYPES =================

export type OlfactoryEventType =
  | 'SWIPE'
  | 'LIKE'
  | 'DISLIKE'
  | 'WEAR'
  | 'RATE'
  | 'LAYER'
  | 'SAVE'
  | 'SKIP'
  | 'JOURNAL'
  | 'EXPERIMENT';

export interface OlfactoryEvent {
  id: string;
  type: OlfactoryEventType;
  fragranceId?: number;
  fragranceName?: string;
  layerPartnerId?: number;
  layerPartnerName?: string;
  context?: {
    weather?: WeatherCondition;
    mood?: string;
    occasion?: string;
    timeOfDay?: string;
    season?: string;
  };
  value?: number;
  feedbackTag?: string;
  timestamp: string;
  notes?: string;
}

export interface LivingOlfactoryDNA {
  vector: OlfactoryVector8D;
  recentDeltas: Partial<Record<keyof OlfactoryVector8D, number>>;
  evolutionReasons: {
    date: string;
    summary: string;
    axis: keyof OlfactoryVector8D;
    delta: number;
  }[];
  personalityTitle: string;
  personalityDescription: string;
  lastUpdated: string;
}

export interface ScentWearHistoryEntry {
  fragranceId: number;
  fragranceName: string;
  weatherCondition?: WeatherCondition;
  occasion?: string;
  partnerFragranceId?: number;
  partnerFragranceName?: string;
  satisfactionRating?: number;
  timestamp: string;
}

export interface PersonalScentMemory {
  likes: number[];
  dislikes: number[];
  strongDislikes: number[];
  favoriteNotes: string[];
  avoidNotes: string[];
  favoriteFamilies: string[];
  preferredIntensity: number;
  preferredSweetness: number;
  preferredProjection: string;
  preferredLongevity: string;
  weatherPreferences: {
    hotWeatherNotes: string[];
    coldWeatherNotes: string[];
    monsoonNotes: string[];
  };
  history: ScentWearHistoryEntry[];
}

export interface LayerExperiment {
  id: string;
  title: string;
  fragranceA: Fragrance;
  fragranceB: Fragrance;
  fragranceC?: Fragrance;
  ratioA: number;
  ratioB: number;
  ratioC?: number;
  spraysA: number;
  spraysB: number;
  spraysC?: number;
  applicationOrder: string;
  substrateA: 'skin' | 'clothing';
  substrateB: 'skin' | 'clothing';
  waitTimeSeconds: number;
  recordedEvolution: {
    openingNotesRating: number;
    halfHourProjection: number;
    twoHourLongevity: number;
    fiveHourRemaining: number;
    drydownQuality: number;
  };
  balanceScore: number;
  personalEnjoyment: number;
  reviewMemo: string;
  createdAt: string;
}

export interface WhatShouldIWearRecommendation {
  fragrance: Fragrance;
  layerPartner?: Fragrance;
  compatibilityScore: number;
  isFromWardrobe: boolean;
  reasoning: {
    primaryVerdict: string;
    weatherReasoning: string;
    moodReasoning: string;
    personalDnaReasoning: string;
    rotationReasoning: string;
  };
  applicationRitual: {
    spraysA: number;
    spraysB?: number;
    placementA: string;
    placementB?: string;
    skinVsClothing: string;
    waitTime: string;
  };
  expectedEvolution: {
    opening: string;
    heart: string;
    drydown: string;
  };
  confidence: 'High' | 'Optimal' | 'Experimental';
}

export interface PurchaseAdvisorAnalysis {
  fragrance: Fragrance;
  score: number;
  wardrobeOverlapPct: number;
  similarOwnedFragrances: Fragrance[];
  pros: string[];
  cons: string[];
  gapContribution: string;
  verdict: string;
  shouldBuy: boolean;
}

export interface TravelCapsule {
  destination: string;
  durationDays: number;
  weatherSummary: string;
  activities: string[];
  coverageScorePct: number;
  fragrances: {
    role: 'Day / Heat' | 'Evening / Dinner' | 'Flexible / All-Rounder';
    fragrance: Fragrance;
    why: string;
  }[];
  suggestedLayerChord?: {
    fragA: Fragrance;
    fragB: Fragrance;
    technique: string;
  };
}

export interface NaturalLanguageScentResult {
  query: string;
  interpretedVector: OlfactoryVector8D;
  interpretedNotes: string[];
  interpretedMood: string;
  matches: {
    fragrance: Fragrance;
    matchPercentage: number;
    explanation: string;
    matchType: 'exact_accord' | 'semantic_approximation' | 'ai_interpretation';
  }[];
}

export interface MismatchAnalysis {
  fragrance: Fragrance;
  isPotentialMismatch: boolean;
  mismatchScore: number;
  largestDeltas: {
    axis: string;
    userValue: number;
    fragranceValue: number;
    difference: number;
  }[];
  reasons: string[];
  previousRatingsWarning?: string;
  recommendation: string;
}

export interface FragranceTwinResult {
  fragrance: Fragrance;
  dnaCompatibilityScore: number;
  matchingAxes: {
    axis: string;
    userScore: number;
    fragranceScore: number;
    alignmentPercentage: number;
  }[];
  narrative: string;
}

export interface ComfortZoneRecommendation {
  level: 'FAMILIAR' | 'ADJACENT' | 'EXPERIMENTAL' | 'RADICAL';
  fragrance: Fragrance;
  familiarAnchorNotes: string[];
  challengingNotes: string[];
  whyItWorks: string;
  comfortBridgeScore: number;
}

export interface FixMyLayerDiagnosis {
  problemType: string;
  identifiedCauses: {
    fragranceName: string;
    accordOrNote: string;
    contributionLevel: 'high' | 'moderate';
  }[];
  suggestedAction: 'adjust_ratio' | 'swap_order' | 'add_companion' | 'remove_fragrance';
  recommendedRatio: {
    ratioA: number;
    ratioB: number;
    ratioC?: number;
    spraysA: number;
    spraysB: number;
    spraysC?: number;
  };
  recommendedOrder: string;
  suggestedWardrobeAdditions?: {
    category: string;
    note: string;
    explanation: string;
  }[];
  expectedOutcome: string;
}

export interface PurchaseDecisionAnalysis {
  recommendation: 'STRONG_ADDITION' | 'CONSIDER_DECANT_FIRST' | 'REDUNDANT_DUPLICATE';
  redundancyScore: number;
  mostSimilarOwnedFragrance: Fragrance;
  gapsFilled: string[];
  estimatedWearDaysPerYear: number;
  explanation: string;
}

export interface RecentWearItem {
  id: string;
  fragranceId: number;
  fragranceName: string;
  occasion: string;
  weatherSummary: string;
  satisfactionRating: number;
  timestamp: string;
}

// ================= STEP 6A: CENTRAL OLFACTORY CONTEXT ENGINE =================

export type TemperatureCategory = 'freezing' | 'cold' | 'cool' | 'mild' | 'warm' | 'hot' | 'scorching';
export type HumidityCategory = 'dry' | 'moderate' | 'humid' | 'tropical';
export type TimeOfDayCategory = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface WeatherContext {
  temperatureC?: number;
  temperatureCategory?: TemperatureCategory;
  humidityPercent?: number;
  humidityCategory?: HumidityCategory;
  condition?: string;
  precipitation?: boolean;
  windSpeedKph?: number;
}

export interface TemporalContext {
  timestamp?: string;
  timeOfDay?: TimeOfDayCategory;
  season?: Season;
  dayType?: 'weekday' | 'weekend';
  isoDate?: string;
}

export interface OccasionContext {
  type?: Occasion | string;
  rawInput?: string;
  formality?: 'casual' | 'smart_casual' | 'business' | 'formal' | 'festive' | 'spiritual';
  duration?: 'brief' | 'workday' | 'evening_event' | 'all_day';
}

export interface MoodContext {
  primary?: DailyMoodId | string;
  primaryLabel?: string;
  secondary?: string;
  rawInput?: string;
}

export interface OutfitContext {
  description?: string;
  formality?: 'casual' | 'smart_casual' | 'business_casual' | 'formal' | 'festive' | 'athleisure';
  color?: string;
  style?: string;
  rawInput?: string;
}

export interface EnvironmentContext {
  indoorOutdoor?: 'indoor' | 'outdoor' | 'mixed';
  locationType?: 'air_conditioned_office' | 'open_air' | 'closed_venue' | 'home' | 'transit' | string;
  crowdLevel?: 'intimate' | 'small_group' | 'crowded' | 'public_transit' | string;
}

export interface UserContext {
  preferenceVector?: number[];
  wardrobeFragranceIds?: (number | string)[];
  dislikedFragranceIds?: (number | string)[];
  favoriteFragranceIds?: (number | string)[];
  preferences?: UserPreferences;
  userId?: number;
}

export interface ContextConstraints {
  projectionPreference?: 'intimate' | 'moderate' | 'strong' | 'beast_mode' | string;
  longevityPreference?: 'fleeting' | 'moderate' | 'long_lasting' | 'all_day' | string;
  fragranceIntensityPreference?: 'subtle' | 'balanced' | 'bold' | string;
  avoidNotes?: string[];
  preferredNotes?: string[];
}

export interface ContextConfidence {
  overall: number; // 0 - 1
  weather?: number; // 0 - 1
  temporal?: number; // 0 - 1
  occasion?: number; // 0 - 1
  mood?: number; // 0 - 1
  outfit?: number; // 0 - 1
}

export interface ContextExplanation {
  summary: string;
  factors: string[];
}

export interface NormalizedOlfactoryContext {
  weather: WeatherContext;
  temporal: TemporalContext;
  occasion: OccasionContext;
  mood: MoodContext;
  outfit: OutfitContext;
  environment: EnvironmentContext;
  user: UserContext;
  constraints: ContextConstraints;
  confidence: ContextConfidence;
  explanation: ContextExplanation;
}

export interface RawOlfactoryContextInput {
  weather?: {
    temperature_c?: number;
    temperatureC?: number;
    humidity_pct?: number;
    humidityPercent?: number;
    condition?: string;
    precipitation?: boolean;
    wind_kph?: number;
    windSpeedKph?: number;
  };
  temporal?: {
    timestamp?: string;
    timeOfDay?: string;
    season?: string;
    dayType?: string;
  };
  timestamp?: string;
  timeOfDay?: string;
  season?: string;
  occasion?: string | { type?: string; formality?: string; duration?: string };
  mood?: string | { primary?: string; secondary?: string };
  outfit?: string | { description?: string; formality?: string; color?: string; style?: string };
  environment?: {
    indoorOutdoor?: string;
    locationType?: string;
    crowdLevel?: string;
  };
  user?: {
    preferenceVector?: number[];
    wardrobeFragranceIds?: (number | string)[];
    dislikedFragranceIds?: (number | string)[];
    favoriteFragranceIds?: (number | string)[];
    preferences?: UserPreferences;
    userId?: number;
  };
  constraints?: {
    projectionPreference?: string;
    longevityPreference?: string;
    fragranceIntensityPreference?: string;
    avoidNotes?: string[];
    preferredNotes?: string[];
  };
}

export interface NormalizedContextResponse {
  context: NormalizedOlfactoryContext;
  explanation: ContextExplanation;
  confidence: ContextConfidence;
}

// ==========================================
// STEP 6B: WEAR RECOMMENDATION TYPES
// ==========================================

export interface WearRecommendationSource {
  wardrobeOnly?: boolean;
  includeCatalog?: boolean;
}

export interface WearRecommendationRequest {
  context: NormalizedOlfactoryContext | RawOlfactoryContextInput;
  source?: WearRecommendationSource;
  limit?: number;
  excludeFragranceIds?: (number | string)[];
}

export interface WearRecommendationMatchBreakdown {
  preference?: number;
  weather?: number;
  season?: number;
  occasion?: number;
  timeOfDay?: number;
  mood?: number;
  performance?: number;
  wardrobe?: number;
  olfactory?: number;
}

export interface WearRecommendation {
  fragranceId: number;
  fragrance: Fragrance & { vector: number[] };
  rank: number;
  score: number;
  match: WearRecommendationMatchBreakdown;
  reasons: string[];
  negativeExplanations?: string[];
  contextSummary: string[];
  ownership?: {
    owned: boolean;
    favorite?: boolean;
  };
}

export interface WearRecommendationResponse {
  recommendations: WearRecommendation[];
  contextSummary: {
    summary: string;
    factors: string[];
  };
  metadata: {
    totalCandidatesConsidered: number;
    filteredCount: number;
    sourceMode: 'wardrobe_only' | 'full_catalog';
    executionTimeMs: number;
    diversityApplied: boolean;
    confidence: ContextConfidence;
  };
}

// ==========================================
// STEP 6D: OLFACTORY MEMORY & BEHAVIORAL LEARNING TYPES
// ==========================================

export type OlfactoryBehaviorEventType =
  | 'RECOMMENDATION_SHOWN'
  | 'RECOMMENDATION_OPENED'
  | 'RECOMMENDATION_SAVED'
  | 'RECOMMENDATION_DISMISSED'
  | 'FRAGRANCE_VIEWED'
  | 'FRAGRANCE_WORN'
  | 'FRAGRANCE_RATED'
  | 'FRAGRANCE_ADDED_TO_WARDROBE'
  | 'FRAGRANCE_REMOVED_FROM_WARDROBE'
  | 'SOTD_SELECTED'
  | 'LAYERING_EXPERIMENT_CREATED'
  | 'LAYERING_EXPERIMENT_RATED'
  | 'JOURNAL_ENTRY_CREATED'
  | 'FRAGRANCE_SHARED'
  | 'USER_PREFERENCE_UPDATED';

export type OlfactoryBehaviorEventSource =
  | 'wear_today'
  | 'wardrobe'
  | 'fragrance_detail'
  | 'sotd'
  | 'layer_lab'
  | 'community'
  | 'dna'
  | 'discovery'
  | (string & {});

export interface OlfactoryBehaviorEvent {
  id: string; // Unique UUID or client idempotency key
  userId: number;
  eventType: OlfactoryBehaviorEventType;
  fragranceId?: number | null;
  contextSnapshot?: NormalizedOlfactoryContext | null;
  metadata?: Record<string, any> | null;
  source: OlfactoryBehaviorEventSource;
  timestamp: string; // ISO 8601 string
  sessionId?: string | null;
}

export type EvidenceType = 'EXPLICIT' | 'IMPLICIT' | 'SYSTEM';
export type EvidenceDirection = 'positive' | 'negative';

export interface OlfactoryPreferenceEvidence {
  userId: number;
  dimension: string; // e.g. "woody", "freshness", "evening", "formal", "fragrance_family:Woody"
  value: string | number; // e.g. "positive", "high", 8.5
  direction: EvidenceDirection;
  evidenceType: EvidenceType;
  evidenceStrength: number; // 0.0 - 1.0 deterministic score
  confidence: number; // 0.0 - 1.0 confidence based on sample volume
  evidenceCount: number;
  lastObserved: string;
  source: string; // explanatory source string e.g. "FRAGRANCE_WORN x4"
}

export interface FragranceBehaviorSummary {
  fragranceId: number;
  fragranceName: string;
  brandName: string;
  fragranceFamily: string;
  views: number;
  opens: number;
  saves: number;
  wears: number;
  ratingsCount: number;
  averageRating?: number;
  sotdCount: number;
  isOwned: boolean;
  lastInteracted: string;
  observedVector?: number[];
}

export interface ContextualBehaviorPattern {
  dimension: 'weather_band' | 'season' | 'occasion' | 'time_of_day' | 'outfit_formality' | 'environment';
  value: string;
  associatedFamilies: { family: string; count: number }[];
  dominantNotes: { note: string; count: number }[];
  totalOccurrences: number;
  lastObserved: string;
}

export interface OlfactoryMemorySnapshot {
  userId: number;
  generatedAt: string;
  totalEvents: number;
  explicitSignals: OlfactoryPreferenceEvidence[];
  implicitSignals: OlfactoryPreferenceEvidence[];
  topPositiveSignals: OlfactoryPreferenceEvidence[];
  topNegativeSignals: OlfactoryPreferenceEvidence[];
  contextPatterns: ContextualBehaviorPattern[];
  frequentlyWornFragrances: FragranceBehaviorSummary[];
  frequentlySavedFragrances: FragranceBehaviorSummary[];
  recentlyRejectedFragrances: FragranceBehaviorSummary[];
  confidence: number;
  diagnostics?: {
    eventsProcessed: number;
    durationMs: number;
    oldestEventAt?: string;
    newestEventAt?: string;
  };
}

