import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server/db.js';
import { recommendTopFragrances } from './server/ml/similarity.js';
import { findBestLayeringCombinations, scoreLayeringPair } from './server/ml/layering.js';
import { UserPreferences } from './src/types.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize SQLite database and ML models
  await dbService.initialize();
  console.log('Olfactory ML database and K-Means clustering initialized.');

  // ================= API ROUTES =================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET /api/brands - returns all brands
  app.get('/api/brands', (req, res) => {
    try {
      const brands = dbService.getAllBrands();
      res.json(brands);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/brands/:id - returns brand details and its fragrances
  app.get('/api/brands/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const brand = dbService.getBrandById(id);
      if (!brand) return res.status(404).json({ error: 'Brand not found' });
      const allFragrances = dbService.getAllFragrances();
      const brandFragrances = allFragrances.filter(f => f.brand_id === id);
      res.json({ ...brand, fragrances: brandFragrances });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/taxonomy - returns normalized notes taxonomy
  app.get('/api/taxonomy', (req, res) => {
    try {
      const taxonomy = dbService.getNoteTaxonomy();
      res.json(taxonomy);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/fragrances - returns all fragrances
  app.get('/api/fragrances', (req, res) => {
    try {
      const fragrances = dbService.getAllFragrances();
      res.json(fragrances);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/fragrances/:id - returns single fragrance
  app.get('/api/fragrances/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const fragrance = dbService.getFragranceById(id);
      if (!fragrance) {
        return res.status(404).json({ error: 'Fragrance not found' });
      }
      res.json(fragrance);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/clusters - returns K-Means clusters and dominant features
  app.get('/api/clusters', (req, res) => {
    try {
      const clusters = dbService.getClusters();
      res.json(clusters);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/recommend - recommend single fragrances based on preferences
  app.post('/api/recommend', (req, res) => {
    try {
      const preferences: UserPreferences = req.body;
      const allFragrances = dbService.getAllFragrances();
      const recommendations = recommendTopFragrances(allFragrances, preferences, 8);
      res.json(recommendations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/layer - rank fragrance layering pairs
  app.post(['/api/layer', '/api/layering/combinations'], (req, res) => {
    try {
      const {
        preferences,
        owned_fragrance_id,
        candidate_ids,
        limit = 6
      } = req.body;

      const userPrefs: UserPreferences = preferences || {
        sweetness: 5,
        freshness: 6,
        intensity: 6,
        season: 'Summer',
        occasion: 'Date'
      };

      const allFragrances = dbService.getAllFragrances();
      const ownedId = owned_fragrance_id ? parseInt(owned_fragrance_id, 10) : undefined;
      const candidateList = Array.isArray(candidate_ids) ? candidate_ids.map((id: any) => parseInt(id, 10)) : undefined;

      const combinations = findBestLayeringCombinations(
        allFragrances,
        userPrefs,
        ownedId,
        candidateList,
        limit
      );

      res.json(combinations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // User collection endpoints
  app.get('/api/collection', (req, res) => {
    try {
      const ownedIds = dbService.getUserCollection(1);
      const allFragrances = dbService.getAllFragrances();
      const collection = allFragrances.filter(f => ownedIds.includes(f.id));
      res.json({ ownedIds, fragrances: collection });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/collection', (req, res) => {
    try {
      const { fragrance_id } = req.body;
      if (!fragrance_id) return res.status(400).json({ error: 'fragrance_id required' });
      dbService.addToCollection(parseInt(fragrance_id, 10), 1);
      res.json({ success: true, message: 'Added to collection' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/collection/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      dbService.removeFromCollection(id, 1);
      res.json({ success: true, message: 'Removed from collection' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // User preferences endpoints
  app.get(['/api/preferences', '/api/users/:id/preferences'], (req, res) => {
    try {
      const userId = req.params.id ? parseInt(req.params.id, 10) : 1;
      const prefs = dbService.getUserPreferences(userId || 1);
      res.json(prefs || {});
    } catch (err: any) {
      console.error('[API Error] GET preferences:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post(['/api/preferences', '/api/users/:id/preferences'], (req, res) => {
    try {
      const userId = req.params.id ? parseInt(req.params.id, 10) : 1;
      dbService.saveUserPreferences(req.body, userId || 1);
      res.json({ success: true, preferences: req.body });
    } catch (err: any) {
      console.error('[API Error] POST preferences:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Ratings endpoints (Step 14: feedback)
  app.post('/api/ratings', (req, res) => {
    try {
      const { fragrance_a_id, fragrance_b_id, rating, feedback_tag } = req.body;
      if (!fragrance_a_id || !fragrance_b_id || !rating) {
        return res.status(400).json({ error: 'fragrance_a_id, fragrance_b_id, and rating (1-5) required' });
      }
      const ratingId = dbService.addRating(fragrance_a_id, fragrance_b_id, rating, feedback_tag, 1);
      res.json({ success: true, id: ratingId, message: 'Rating saved' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/ratings', (req, res) => {
    try {
      const ratings = dbService.getUserRatings(1);
      res.json(ratings);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Saved combinations endpoints
  app.get('/api/saved-combinations', (req, res) => {
    try {
      const saved = dbService.getSavedCombinations();
      res.json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/saved-combinations', (req, res) => {
    try {
      const { fragrance_a_id, fragrance_b_id, compatibility_score, explanation, season, occasion } = req.body;
      const id = dbService.saveCombination(
        fragrance_a_id,
        fragrance_b_id,
        compatibility_score,
        explanation,
        season || 'All Year',
        occasion || 'Signature'
      );
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/saved-combinations/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      dbService.deleteSavedCombination(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/brand-intelligence
  app.get('/api/brand-intelligence', (req, res) => {
    try {
      const stats = dbService.getBrandIntelligenceStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/scent-battles
  app.post('/api/scent-battles', (req, res) => {
    try {
      const { fragrance_a_id, fragrance_b_id } = req.body;
      const fragA = dbService.getFragranceById(Number(fragrance_a_id));
      const fragB = dbService.getFragranceById(Number(fragrance_b_id));

      if (!fragA || !fragB) {
        return res.status(404).json({ error: 'Fragrance not found' });
      }

      const parseLongevityHours = (l: string = '') => {
        const match = l.match(/\d+/);
        return match ? parseInt(match[0], 10) : 8;
      };

      const metrics = [
        {
          metric: 'Longevity & Staying Power',
          a_score: Math.min(10, Math.round(parseLongevityHours(fragA.longevity) * 0.9)),
          b_score: Math.min(10, Math.round(parseLongevityHours(fragB.longevity) * 0.9)),
          notes: `${fragA.name} provides ${fragA.longevity} vs ${fragB.name} with ${fragB.longevity}`
        },
        {
          metric: 'Projection & Sillage Intensity',
          a_score: fragA.intensity,
          b_score: fragB.intensity,
          notes: `${fragA.name} intensity: ${fragA.intensity}/10 vs ${fragB.name}: ${fragB.intensity}/10`
        },
        {
          metric: 'Freshness & Opening Impact',
          a_score: fragA.freshness,
          b_score: fragB.freshness,
          notes: `${fragA.name} freshness: ${fragA.freshness}/10 vs ${fragB.name}: ${fragB.freshness}/10`
        },
        {
          metric: 'Sweetness & Gourmand Appeal',
          a_score: fragA.sweetness,
          b_score: fragB.sweetness,
          notes: `${fragA.name} sweetness: ${fragA.sweetness}/10 vs ${fragB.name}: ${fragB.sweetness}/10`
        },
        {
          metric: 'Versatility (Occasions & Seasons)',
          a_score: Math.min(10, (fragA.season?.length || 2) * 1.5 + (fragA.occasion?.length || 2)),
          b_score: Math.min(10, (fragB.season?.length || 2) * 1.5 + (fragB.occasion?.length || 2)),
          notes: `Covers ${(fragA.season || []).join(', ')} vs ${(fragB.season || []).join(', ')}`
        },
        {
          metric: 'Value for Money (Concentration / Price)',
          a_score: fragA.price_inr && fragA.price_inr < 2000 ? 9 : fragA.price_inr < 5000 ? 8 : 7,
          b_score: fragB.price_inr && fragB.price_inr < 2000 ? 9 : fragB.price_inr < 5000 ? 8 : 7,
          notes: `₹${fragA.price_inr || 'N/A'} vs ₹${fragB.price_inr || 'N/A'}`
        }
      ];

      const aTotal = metrics.reduce((acc, m) => acc + m.a_score, 0);
      const bTotal = metrics.reduce((acc, m) => acc + m.b_score, 0);
      const overallWinner = aTotal > bTotal ? 'fragrance_a' : aTotal < bTotal ? 'fragrance_b' : 'tie';

      const defaultPrefs: UserPreferences = {
        sweetness: 5, freshness: 5, intensity: 6, preferred_gender: 'all',
        season: 'Summer', occasion: 'Signature', time_of_day: 'Evening'
      };
      const layeringResult = scoreLayeringPair(fragA, fragB, defaultPrefs);

      res.json({
        fragrance_a: fragA,
        fragrance_b: fragB,
        metrics,
        verdict: {
          overall_winner: overallWinner,
          score_a: aTotal,
          score_b: bTotal,
          summary: overallWinner === 'fragrance_a'
            ? `${fragA.name} edges out ${fragB.name} with greater versatility and robust performance profile.`
            : overallWinner === 'fragrance_b'
            ? `${fragB.name} wins the confrontation with exceptional presence, longevity, and accord resonance.`
            : `A magnificent deadlock! Both creations showcase world-class craftsmanship with distinct character.`
        },
        layering_potential: layeringResult ? {
          compatibility_score: layeringResult.compatibility_score,
          can_layer: layeringResult.compatibility_score >= 70,
          explanation: layeringResult.explanation,
          technique: layeringResult.layering_method
        } : null
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/discovery-box
  app.post('/api/discovery-box', (req, res) => {
    try {
      const { budget_inr = 3500, preferred_families = [] } = req.body;
      const allFrags = dbService.getAllFragrances();

      let candidatePool = allFrags;
      if (preferred_families.length > 0) {
        const matched = allFrags.filter(f => preferred_families.some((fam: string) => (f.fragrance_family || '').toLowerCase().includes(fam.toLowerCase())));
        if (matched.length >= 3) candidatePool = matched;
      }

      const attars = candidatePool.filter(f => f.format === 'Attar' || f.is_oil_based);
      const fresh = candidatePool.filter(f => f.freshness >= 7 && !f.is_oil_based);
      const woodyOud = candidatePool.filter(f => (f.fragrance_family || '').toLowerCase().includes('wood') || (f.fragrance_family || '').toLowerCase().includes('oud'));
      const floralAmber = candidatePool.filter(f => (f.fragrance_family || '').toLowerCase().includes('floral') || (f.fragrance_family || '').toLowerCase().includes('amber') || f.sweetness >= 6);

      const selectedSamples: any[] = [];
      if (attars.length > 0) selectedSamples.push(attars[0]);
      if (fresh.length > 0 && !selectedSamples.some(s => s.id === fresh[0].id)) selectedSamples.push(fresh[0]);
      if (woodyOud.length > 0 && !selectedSamples.some(s => s.id === woodyOud[0].id)) selectedSamples.push(woodyOud[0]);
      if (floralAmber.length > 0 && !selectedSamples.some(s => s.id === floralAmber[0].id)) selectedSamples.push(floralAmber[0]);

      while (selectedSamples.length < 4 && candidatePool.length > selectedSamples.length) {
        const remaining = candidatePool.find(f => !selectedSamples.some(s => s.id === f.id));
        if (remaining) selectedSamples.push(remaining);
        else break;
      }

      const calculatedPrice = Math.min(budget_inr, 2499);

      res.json({
        title: 'Bespoke Discovery Atelier Box',
        box_price_inr: calculatedPrice,
        sample_count: selectedSamples.length,
        sample_size_ml: 5,
        fragrances: selectedSamples,
        curation_concept: 'Hand-curated olfactory spectrum spanning rare Kannauj hydro-distillates, modern Indian niche, and iconic designer accords.',
        layering_guide: 'Mix any fresh daytime spritz with the evening attar base for your personalized signature accord.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/retail-recommendations
  app.post('/api/retail-recommendations', (req, res) => {
    try {
      const { occasion = 'Office', target_notes = [], budget = 3000, customer_preference = 'Fresh and woody' } = req.body;
      const allFrags = dbService.getAllFragrances();

      const recommendations = allFrags
        .map(frag => {
          let matchScore = 70;
          if ((frag.occasion || []).some(o => o.toLowerCase() === occasion.toLowerCase())) matchScore += 15;
          if (target_notes.some((n: string) => (frag.top_notes || []).concat(frag.middle_notes || [], frag.base_notes || []).some(fn => fn.toLowerCase().includes(n.toLowerCase())))) {
            matchScore += 12;
          }
          if (frag.price_inr && frag.price_inr <= budget) matchScore += 5;
          return { frag, matchScore: Math.min(99, matchScore) };
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3)
        .map(({ frag, matchScore }) => {
          const companion = allFrags.find(f => f.id !== frag.id && f.format !== frag.format) || allFrags[1];
          return {
            fragrance: frag,
            match_score: matchScore,
            salesperson_pitch: `For a customer seeking ${customer_preference}, ${frag.name} by ${frag.brand_name} delivers an exquisite opening of ${(frag.top_notes || []).slice(0, 2).join(' and ')} that settles into sophisticated ${(frag.base_notes || []).slice(0, 2).join(' and ')}. It projects confidence without overwhelming the room.`,
            why_it_works: `Combines ${frag.freshness}/10 freshness with ${frag.longevity} endurance, ideal for ${occasion} settings.`,
            layering_upsell: {
              companion_fragrance: companion,
              upsell_reason: `Suggest layering with ${companion.name} (${companion.format}) on pulse points to double longevity and create a one-of-a-kind signature.`
            }
          };
        });

      res.json({ recommendations });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/weather-recommendation
  app.get('/api/weather-recommendation', (req, res) => {
    try {
      const temp = parseFloat(req.query.temp as string) || 28;
      const condition = (req.query.condition as string) || 'Warm & Humid';
      const timeOfDay = (req.query.time_of_day as string) || 'Afternoon';

      const allFrags = dbService.getAllFragrances();
      let bestSeason = 'Summer';
      if (temp < 20) bestSeason = 'Winter';
      else if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('monsoon')) bestSeason = 'Monsoon';

      const candidates = allFrags.filter(f => {
        if (temp >= 28) return f.freshness >= 6 || f.format === 'Attar';
        if (temp <= 18) return f.sweetness >= 6 || f.intensity >= 7;
        return true;
      });

      const topRecommendations = (candidates.length >= 3 ? candidates : allFrags).slice(0, 4);

      res.json({
        weather_context: {
          temp_c: temp,
          condition,
          time_of_day: timeOfDay,
          olfactory_advice: temp >= 28
            ? 'High temperatures amplify evaporation. Choose effervescent citrus, aquatic minerals, or pure botanical mitti/khus attars that evolve cleanly on warm skin.'
            : 'Cool temperatures compress aroma molecules. Choose resinous amber, warm spices, and rich agarwood that blossom gently with body heat.'
        },
        fragrances: topRecommendations
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET & POST /api/journal
  app.get('/api/journal', (req, res) => {
    try {
      const journal = dbService.getFragranceJournal(1);
      res.json(journal);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/journal', (req, res) => {
    try {
      const id = dbService.addFragranceJournalEntry(req.body, 1);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Ingestion Submissions
  app.get('/api/ingestion/submissions', (req, res) => {
    try {
      const subs = dbService.getProductSubmissions();
      res.json(subs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ingestion/submissions', (req, res) => {
    try {
      const id = dbService.createProductSubmission(req.body);
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ingestion/submissions/:id/review', (req, res) => {
    try {
      const { status } = req.body;
      dbService.reviewProductSubmission(req.params.id, status);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ================= VITE MIDDLEWARE SETUP =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fragrance Layering AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
