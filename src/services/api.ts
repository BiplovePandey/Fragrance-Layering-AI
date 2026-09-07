import {
  Fragrance,
  Brand,
  NoteTaxonomyEntry,
  UserPreferences,
  RecommendationScore,
  LayeringResult,
  SavedCombination,
  ClusterInfo,
  UserRating
} from '../types.js';

export const api = {
  // Brands
  async getBrands(): Promise<Brand[]> {
    const res = await fetch('/api/brands');
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  async getBrandById(id: number): Promise<Brand & { fragrances: Fragrance[] }> {
    const res = await fetch(`/api/brands/${id}`);
    if (!res.ok) throw new Error('Failed to fetch brand details');
    return res.json();
  },

  // Taxonomy
  async getTaxonomy(): Promise<NoteTaxonomyEntry[]> {
    const res = await fetch('/api/taxonomy');
    if (!res.ok) throw new Error('Failed to fetch note taxonomy');
    return res.json();
  },

  // Fragrances
  async getFragrances(): Promise<Fragrance[]> {
    const res = await fetch('/api/fragrances');
    if (!res.ok) throw new Error('Failed to fetch fragrances');
    return res.json();
  },

  async getFragranceById(id: number): Promise<Fragrance> {
    const res = await fetch(`/api/fragrances/${id}`);
    if (!res.ok) throw new Error('Failed to fetch fragrance details');
    return res.json();
  },

  // Clusters
  async getClusters(): Promise<ClusterInfo[]> {
    const res = await fetch('/api/clusters');
    if (!res.ok) throw new Error('Failed to fetch clusters');
    return res.json();
  },

  // Single Recommendation
  async getSingleRecommendations(preferences: UserPreferences): Promise<RecommendationScore[]> {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!res.ok) throw new Error('Failed to calculate single recommendations');
    return res.json();
  },

  // Layering Recommendations
  async getLayeringCombinations(params: {
    preferences: UserPreferences;
    owned_fragrance_id?: number;
    candidate_ids?: number[];
    limit?: number;
  }): Promise<LayeringResult[]> {
    const res = await fetch('/api/layer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate layering combinations');
    return res.json();
  },

  // User Collection
  async getCollection(): Promise<{ ownedIds: number[]; fragrances: Fragrance[] }> {
    const res = await fetch('/api/collection');
    if (!res.ok) throw new Error('Failed to fetch user collection');
    return res.json();
  },

  async addToCollection(fragranceId: number): Promise<void> {
    const res = await fetch('/api/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragrance_id: fragranceId }),
    });
    if (!res.ok) throw new Error('Failed to add to collection');
  },

  async removeFromCollection(fragranceId: number): Promise<void> {
    const res = await fetch(`/api/collection/${fragranceId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove from collection');
  },

  // User Preferences
  async getUserPreferences(userId: number = 1): Promise<UserPreferences> {
    const res = await fetch(`/api/users/${userId}/preferences`);
    if (!res.ok) throw new Error('Failed to fetch user preferences');
    return res.json();
  },

  async saveUserPreferences(preferences: UserPreferences, userId: number = 1): Promise<void> {
    const res = await fetch(`/api/users/${userId}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!res.ok) throw new Error('Failed to save preferences');
  },

  // Ratings
  async submitRating(data: {
    fragrance_a_id: number;
    fragrance_b_id: number;
    rating: number;
    feedback_tag?: string;
  }): Promise<{ success: boolean; id: number }> {
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit rating');
    return res.json();
  },

  async getRatings(): Promise<UserRating[]> {
    const res = await fetch('/api/ratings');
    if (!res.ok) throw new Error('Failed to fetch ratings');
    return res.json();
  },

  // Saved Combinations
  async getSavedCombinations(): Promise<SavedCombination[]> {
    const res = await fetch('/api/saved-combinations');
    if (!res.ok) throw new Error('Failed to fetch saved combinations');
    return res.json();
  },

  async saveCombination(data: {
    fragrance_a_id: number;
    fragrance_b_id: number;
    compatibility_score: number;
    explanation: string;
    season: string;
    occasion: string;
  }): Promise<{ success: boolean; id: number }> {
    const res = await fetch('/api/saved-combinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save combination');
    return res.json();
  },

  async deleteSavedCombination(id: number): Promise<void> {
    const res = await fetch(`/api/saved-combinations/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete saved combination');
  }
};
