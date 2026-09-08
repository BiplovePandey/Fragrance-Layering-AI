import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server/db.js';
import { recommendTopFragrances } from './server/ml/similarity.js';
import { findBestLayeringCombinations } from './server/ml/layering.js';
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
