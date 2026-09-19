import {
  Fragrance,
  Brand,
  NoteTaxonomyEntry,
  UserPreferences,
  RecommendationScore,
  LayeringResult,
  SavedCombination,
  ClusterInfo,
  UserRating,
  CanonicalFragranceImport,
  RawOlfactoryContextInput,
  NormalizedContextResponse,
  WearRecommendationRequest,
  WearRecommendationResponse,
  OlfactoryBehaviorEvent,
  OlfactoryMemorySnapshot,
  FragranceBehaviorSummary
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

  async createBrand(brand: Partial<Brand>): Promise<Brand> {
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create brand');
    }
    return res.json();
  },

  async updateBrand(id: number, brand: Partial<Brand>): Promise<Brand> {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update brand');
    }
    return res.json();
  },

  async deleteBrand(id: number): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`/api/brands/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete brand');
    }
    return res.json();
  },

  // Taxonomy
  async getTaxonomy(): Promise<NoteTaxonomyEntry[]> {
    const res = await fetch('/api/taxonomy');
    if (!res.ok) throw new Error('Failed to fetch note taxonomy');
    return res.json();
  },

  async createTaxonomyEntry(entry: Partial<NoteTaxonomyEntry>): Promise<NoteTaxonomyEntry> {
    const res = await fetch('/api/taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create note taxonomy entry');
    }
    return res.json();
  },

  async updateTaxonomyEntry(id: number, entry: Partial<NoteTaxonomyEntry>): Promise<NoteTaxonomyEntry> {
    const res = await fetch(`/api/taxonomy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update note taxonomy entry');
    }
    return res.json();
  },

  async deleteTaxonomyEntry(id: number): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`/api/taxonomy/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete note taxonomy entry');
    }
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

  async createFragrance(fragrance: Partial<Fragrance>): Promise<Fragrance> {
    const res = await fetch('/api/fragrances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fragrance)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create fragrance');
    }
    return res.json();
  },

  async updateFragrance(id: number, fragrance: Partial<Fragrance>): Promise<Fragrance> {
    const res = await fetch(`/api/fragrances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fragrance)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update fragrance');
    }
    return res.json();
  },

  async deleteFragrance(id: number): Promise<{ success: boolean; id: number }> {
    const res = await fetch(`/api/fragrances/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete fragrance');
    }
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
  },

  // Canonical Fragrance Import
  async importCanonicalFragrance(payload: CanonicalFragranceImport): Promise<any> {
    const res = await fetch('/api/canonical-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to import canonical fragrance');
    }
    return res.json();
  },

  // Central Olfactory Context Normalization
  async normalizeContext(input: RawOlfactoryContextInput): Promise<NormalizedContextResponse> {
    const res = await fetch('/api/context/normalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to normalize olfactory context');
    }
    return res.json();
  },

  // What Should I Wear? Olfactory Recommendation Engine
  async recommendWear(request: WearRecommendationRequest): Promise<WearRecommendationResponse> {
    const res = await fetch('/api/recommend/wear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate wear recommendations');
    }
    return res.json();
  },

  // ================= OLFACTORY MEMORY & BEHAVIORAL TELEMETRY (STEP 6D) =================

  async recordBehaviorEvent(event: Partial<OlfactoryBehaviorEvent> & { eventType: OlfactoryBehaviorEvent['eventType']; source: string }): Promise<{ success: boolean; eventId: string; inserted: boolean; duplicate: boolean }> {
    const payload: OlfactoryBehaviorEvent = {
      id: event.id || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: event.userId || 1,
      eventType: event.eventType,
      fragranceId: event.fragranceId ?? null,
      contextSnapshot: event.contextSnapshot ?? null,
      metadata: event.metadata ?? null,
      source: event.source,
      timestamp: event.timestamp || new Date().toISOString(),
      sessionId: event.sessionId ?? null
    };

    const res = await fetch('/api/behavior/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to record olfactory behavior event');
    }
    return res.json();
  },

  async recordBehaviorEvents(events: (Partial<OlfactoryBehaviorEvent> & { eventType: OlfactoryBehaviorEvent['eventType']; source: string })[]): Promise<{ success: boolean; count: number; inserted: number; duplicates: number }> {
    const payloads: OlfactoryBehaviorEvent[] = events.map(ev => ({
      id: ev.id || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId: ev.userId || 1,
      eventType: ev.eventType,
      fragranceId: ev.fragranceId ?? null,
      contextSnapshot: ev.contextSnapshot ?? null,
      metadata: ev.metadata ?? null,
      source: ev.source,
      timestamp: ev.timestamp || new Date().toISOString(),
      sessionId: ev.sessionId ?? null
    }));

    const res = await fetch('/api/behavior/events/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: payloads })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to record behavior events batch');
    }
    return res.json();
  },

  async getOlfactoryMemory(userId: number = 1): Promise<OlfactoryMemorySnapshot> {
    const res = await fetch(`/api/behavior/memory?userId=${userId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch olfactory memory snapshot');
    }
    return res.json();
  },

  async getBehaviorHistory(params: {
    userId?: number;
    limit?: number;
    offset?: number;
    eventType?: string;
    source?: string;
    fragranceId?: number;
  } = {}): Promise<{ events: OlfactoryBehaviorEvent[]; total: number }> {
    const query = new URLSearchParams();
    if (params.userId) query.set('userId', String(params.userId));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.offset) query.set('offset', String(params.offset));
    if (params.eventType) query.set('eventType', params.eventType);
    if (params.source) query.set('source', params.source);
    if (params.fragranceId) query.set('fragranceId', String(params.fragranceId));

    const res = await fetch(`/api/behavior/history?${query.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch behavior history');
    }
    return res.json();
  },

  async getFragranceBehavior(id: number, userId: number = 1): Promise<FragranceBehaviorSummary> {
    const res = await fetch(`/api/behavior/fragrance/${id}?userId=${userId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch behavior for fragrance ${id}`);
    }
    return res.json();
  },

  async clearBehaviorHistory(userId: number = 1): Promise<{ success: boolean; message: string; deletedCount: number }> {
    const res = await fetch(`/api/behavior/history?userId=${userId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to clear behavior history');
    }
    return res.json();
  }
};
