export interface Brand {
  id: number;
  name: string;
  country: string;
  brand_type: string; // e.g. 'major_indian_mass' | 'indian_niche' | 'heritage_attar' | 'luxury_ayurvedic' | 'perfume_oils' | 'international_niche' | 'international_designer';
  category: string; // 'Designer / mass Indian' | 'Indian niche' | 'Attar' | 'Traditional Kannauj' | 'Perfume oils' | 'Luxury Indian' | 'Ayurvedic fragrance' | 'Indie/D2C' | 'Oud-focused' | 'Natural/essential-oil' | 'International luxury';
  origin_style: string;
  description: string;
  founded_year?: number;
  website?: string;
  city?: string;
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
  image_url?: string;
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
export type Occasion = 'Office' | 'Date' | 'Casual' | 'Evening' | 'Signature' | 'Special Event' | 'Wedding' | 'Festive / Puja' | 'Meditation / Spiritual';

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

