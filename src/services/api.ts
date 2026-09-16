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
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(`Failed to fetch user preferences: ${err.error || res.statusText}`);
    }
    return res.json();
  },

  async saveUserPreferences(preferences: UserPreferences, userId: number = 1): Promise<void> {
    const res = await fetch(`/api/users/${userId}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(`Failed to save preferences: ${err.error || res.statusText}`);
    }
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
  },

  // Brand Intelligence
  async getBrandIntelligence(): Promise<any> {
    const res = await fetch('/api/brand-intelligence');
    if (!res.ok) throw new Error('Failed to fetch brand intelligence');
    return res.json();
  },

  // Scent Battle
  async runScentBattle(fragrance_a_id: number, fragrance_b_id: number): Promise<any> {
    const res = await fetch('/api/scent-battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fragrance_a_id, fragrance_b_id })
    });
    if (!res.ok) throw new Error('Failed to compute scent battle confrontation');
    return res.json();
  },

  // Discovery Box
  async configureDiscoveryBox(params: { budget_inr?: number; preferred_families?: string[] }): Promise<any> {
    const res = await fetch('/api/discovery-box', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to curate discovery box');
    return res.json();
  },

  // Retail Salesperson AI
  async getRetailRecommendations(params: {
    occasion?: string;
    target_notes?: string[];
    budget?: number;
    customer_preference?: string;
  }): Promise<any> {
    const res = await fetch('/api/retail-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to generate retail consultation');
    return res.json();
  },

  // Weather Recommendations
  async getWeatherRecommendation(params: { temp?: number; condition?: string; time_of_day?: string }): Promise<any> {
    const query = new URLSearchParams();
    if (params.temp) query.set('temp', params.temp.toString());
    if (params.condition) query.set('condition', params.condition);
    if (params.time_of_day) query.set('time_of_day', params.time_of_day);

    const res = await fetch(`/api/weather-recommendation?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch weather scent recommendation');
    return res.json();
  },

  // Journal
  async getJournal(): Promise<any[]> {
    const res = await fetch('/api/journal');
    if (!res.ok) throw new Error('Failed to fetch scent journal');
    return res.json();
  },

  async getJournalEntries(): Promise<any[]> {
    return this.getJournal();
  },

  async addJournalEntry(entry: any): Promise<{ success: boolean; id: string }> {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error('Failed to save journal entry');
    return res.json();
  },

  // Ingestion Submissions
  async getIngestionSubmissions(): Promise<any[]> {
    const res = await fetch('/api/ingestion/submissions');
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return res.json();
  },

  async submitProduct(submission: any): Promise<{ success: boolean; id: string }> {
    const res = await fetch('/api/ingestion/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
    if (!res.ok) throw new Error('Failed to submit product');
    return res.json();
  },

  async submitProductIngestion(submission: any): Promise<{ success: boolean; id: string }> {
    return this.submitProduct(submission);
  },

  async reviewSubmission(id: string, status: 'approved' | 'rejected'): Promise<{ success: boolean }> {
    const res = await fetch(`/api/ingestion/submissions/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to review submission');
    return res.json();
  }
};
