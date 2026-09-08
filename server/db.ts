import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { Fragrance, Brand, NoteTaxonomyEntry, UserPreferences, SavedCombination, ClusterInfo, UserRating } from '../src/types.js';
import { extractFragranceVector } from './ml/features.js';
import { performKMeansClustering } from './ml/clustering.js';

const DB_FILE_PATH = path.join(process.cwd(), 'fragrances.db');
const BRANDS_JSON_PATH = path.join(process.cwd(), 'data', 'brands.json');
const TAXONOMY_JSON_PATH = path.join(process.cwd(), 'data', 'notes_taxonomy.json');
const FRAGRANCES_JSON_PATH = path.join(process.cwd(), 'data', 'fragrances.json');

export class FragranceDatabase {
  private db: Database | null = null;
  private fragrancesCache: (Fragrance & { vector: number[] })[] = [];
  private brandsCache: Brand[] = [];
  private taxonomyCache: NoteTaxonomyEntry[] = [];
  private clustersCache: ClusterInfo[] = [];

  async initialize() {
    const SQL = await initSqlJs();
    
    // Create new database instance
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const fileBuffer = fs.readFileSync(DB_FILE_PATH);
        this.db = new SQL.Database(fileBuffer);
      } catch (err) {
        console.warn('Failed to read existing DB file, creating fresh one:', err);
        this.db = new SQL.Database();
      }
    } else {
      this.db = new SQL.Database();
    }

    this.createTables();
    this.seedInitialData();
    this.computeVectorsAndClusters();
    this.saveToFile();
  }

  private createTables() {
    if (!this.db) return;

    // Check if fragrances table has collection column; if not, recreate to upgrade schema cleanly
    try {
      const checkCol = this.db.exec("PRAGMA table_info(fragrances);");
      const hasCollection = checkCol[0]?.values.some(row => row[1] === 'collection');
      if (checkCol[0] && !hasCollection) {
        console.log('Migrating database to include collection, concentration, verification status, and master catalog schema...');
        this.db.run(`DROP TABLE IF EXISTS fragrance_notes;`);
        this.db.run(`DROP TABLE IF EXISTS fragrances;`);
        this.db.run(`DROP TABLE IF EXISTS note_taxonomy;`);
        this.db.run(`DROP TABLE IF EXISTS brands;`);
      }
    } catch (e) {
      // Table doesn't exist yet, proceed
    }

    // Ensure user_preferences table has all necessary columns if created in earlier versions
    try {
      const checkPrefs = this.db.exec("PRAGMA table_info(user_preferences);");
      if (checkPrefs[0]) {
        const existingCols = checkPrefs[0].values.map(row => row[1]);
        if (!existingCols.includes('brand_category_filter')) {
          console.log('Migrating user_preferences table: adding brand_category_filter column...');
          this.db.run("ALTER TABLE user_preferences ADD COLUMN brand_category_filter TEXT DEFAULT 'all';");
        }
        if (!existingCols.includes('owned_fragrance_id')) {
          console.log('Migrating user_preferences table: adding owned_fragrance_id column...');
          this.db.run("ALTER TABLE user_preferences ADD COLUMN owned_fragrance_id INTEGER;");
        }
      }
    } catch (e) {
      // Table doesn't exist yet, proceed
    }

    this.db.run(`
      CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        country TEXT NOT NULL,
        brand_type TEXT NOT NULL,
        category TEXT NOT NULL,
        origin_style TEXT NOT NULL,
        description TEXT,
        founded_year INTEGER,
        website TEXT,
        city TEXT
      );

      CREATE TABLE IF NOT EXISTS note_taxonomy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        raw_term TEXT UNIQUE NOT NULL,
        original_note TEXT NOT NULL,
        normalized_name TEXT NOT NULL,
        note_family TEXT NOT NULL,
        category TEXT NOT NULL,
        origin TEXT NOT NULL,
        english_equivalent TEXT,
        cultural_context TEXT
      );

      CREATE TABLE IF NOT EXISTS fragrances (
        id INTEGER PRIMARY KEY,
        brand_id INTEGER NOT NULL,
        brand_name TEXT NOT NULL,
        collection TEXT,
        name TEXT NOT NULL,
        format TEXT NOT NULL,
        fragrance_type TEXT,
        concentration TEXT,
        gender TEXT NOT NULL,
        category TEXT,
        description TEXT,
        origin_style TEXT NOT NULL,
        price_min REAL,
        price_max REAL,
        price_inr REAL,
        currency TEXT DEFAULT 'INR',
        volume_ml REAL,
        is_oil_based INTEGER DEFAULT 0,
        fragrance_family TEXT NOT NULL,
        top_notes TEXT,
        middle_notes TEXT,
        base_notes TEXT,
        season TEXT,
        occasion TEXT,
        intensity INTEGER NOT NULL,
        sweetness INTEGER NOT NULL,
        freshness INTEGER NOT NULL,
        longevity TEXT,
        source TEXT,
        source_url TEXT,
        source_date TEXT,
        last_verified TEXT,
        data_confidence REAL DEFAULT 0.95,
        status TEXT DEFAULT 'verified',
        active INTEGER DEFAULT 1,
        is_gift_set INTEGER DEFAULT 0,
        product_category TEXT DEFAULT 'fine_perfume',
        cluster_id INTEGER,
        cluster_label TEXT,
        FOREIGN KEY (brand_id) REFERENCES brands (id)
      );

      CREATE TABLE IF NOT EXISTS fragrance_notes (
        fragrance_id INTEGER NOT NULL,
        raw_note TEXT NOT NULL,
        normalized_name TEXT,
        note_type TEXT NOT NULL, -- 'top', 'middle', 'base'
        PRIMARY KEY (fragrance_id, raw_note, note_type),
        FOREIGN KEY (fragrance_id) REFERENCES fragrances (id)
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY,
        favorite_family TEXT,
        preferred_notes TEXT,
        sweetness INTEGER DEFAULT 5,
        freshness INTEGER DEFAULT 5,
        intensity INTEGER DEFAULT 5,
        preferred_gender TEXT DEFAULT 'all',
        season TEXT,
        occasion TEXT,
        time_of_day TEXT DEFAULT 'Any',
        origin_filter TEXT DEFAULT 'all',
        format_filter TEXT DEFAULT 'all',
        brand_category_filter TEXT DEFAULT 'all'
      );

      CREATE TABLE IF NOT EXISTS user_ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        fragrance_a_id INTEGER NOT NULL,
        fragrance_b_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        feedback_tag TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS layering_combinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fragrance_a_id INTEGER NOT NULL,
        fragrance_b_id INTEGER NOT NULL,
        compatibility_score INTEGER NOT NULL,
        explanation TEXT NOT NULL,
        season TEXT,
        occasion TEXT,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_collection (
        user_id INTEGER DEFAULT 1,
        fragrance_id INTEGER NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, fragrance_id)
      );
    `);
  }

  private seedInitialData() {
    if (!this.db) return;

    // 1. Seed Brands
    if (fs.existsSync(BRANDS_JSON_PATH)) {
      try {
        const rawBrands: Brand[] = JSON.parse(fs.readFileSync(BRANDS_JSON_PATH, 'utf-8'));
        for (const b of rawBrands) {
          this.db.run(
            `INSERT INTO brands (id, name, country, brand_type, category, origin_style, description, founded_year, website, city)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(name) DO UPDATE SET
               country=excluded.country,
               brand_type=excluded.brand_type,
               category=excluded.category,
               origin_style=excluded.origin_style,
               description=excluded.description,
               founded_year=excluded.founded_year,
               website=excluded.website,
               city=excluded.city`,
            [b.id, b.name, b.country, b.brand_type, b.category || 'Designer / mass Indian', b.origin_style, b.description, b.founded_year ?? null, b.website ?? null, b.city ?? null]
          );
        }
      } catch (err) {
        console.error('Error seeding brands:', err);
      }
    }

    // 2. Seed Note Taxonomy
    if (fs.existsSync(TAXONOMY_JSON_PATH)) {
      try {
        const rawTaxa: NoteTaxonomyEntry[] = JSON.parse(fs.readFileSync(TAXONOMY_JSON_PATH, 'utf-8'));
        for (const t of rawTaxa) {
          this.db.run(
            `INSERT INTO note_taxonomy (raw_term, original_note, normalized_name, note_family, category, origin, english_equivalent, cultural_context)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(raw_term) DO UPDATE SET
               original_note=excluded.original_note,
               normalized_name=excluded.normalized_name,
               note_family=excluded.note_family,
               category=excluded.category,
               origin=excluded.origin,
               english_equivalent=excluded.english_equivalent,
               cultural_context=excluded.cultural_context`,
            [t.raw_term.toLowerCase().trim(), t.original_note, t.normalized_name, t.note_family, t.category, t.origin, t.english_equivalent ?? null, t.cultural_context ?? null]
          );
        }
      } catch (err) {
        console.error('Error seeding taxonomy:', err);
      }
    }

    // 3. Seed Fragrances
    const countRes = this.db.exec(`SELECT COUNT(*) as count FROM fragrances`);
    const count = (countRes[0]?.values[0]?.[0] as number) || 0;

    if (count === 0 && fs.existsSync(FRAGRANCES_JSON_PATH)) {
      console.log('Seeding brand-agnostic fragrance dataset into SQLite...');
      try {
        const rawFrags = JSON.parse(fs.readFileSync(FRAGRANCES_JSON_PATH, 'utf-8'));

        for (const frag of rawFrags) {
          this.db.run(
            `INSERT INTO fragrances (
              id, brand_id, brand_name, collection, name, format, fragrance_type, concentration,
              gender, category, description, origin_style, price_min, price_max, price_inr, currency,
              volume_ml, is_oil_based, fragrance_family, top_notes, middle_notes, base_notes,
              season, occasion, intensity, sweetness, freshness, longevity, source, source_url,
              source_date, last_verified, data_confidence, status, active, is_gift_set, product_category
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              frag.id,
              frag.brand_id,
              frag.brand_name || 'Unknown',
              frag.collection || 'Core Perfume Range',
              frag.name,
              frag.format || 'Eau de Parfum',
              frag.fragrance_type || frag.format || 'Eau de Parfum',
              frag.concentration || 'EDP (15-20%)',
              frag.gender || 'unisex',
              frag.category || 'Designer / mass Indian',
              frag.description || '',
              frag.origin_style || 'International / Western',
              frag.price_min ?? null,
              frag.price_max ?? null,
              frag.price_inr ?? (frag.price_min ? Math.round((frag.price_min + (frag.price_max || frag.price_min)) / 2) : 2500),
              frag.currency || 'INR',
              frag.volume_ml ?? null,
              frag.is_oil_based ? 1 : 0,
              frag.fragrance_family,
              JSON.stringify(frag.top_notes || []),
              JSON.stringify(frag.middle_notes || []),
              JSON.stringify(frag.base_notes || []),
              JSON.stringify(frag.season || []),
              JSON.stringify(frag.occasion || []),
              frag.intensity || 6,
              frag.sweetness || 5,
              frag.freshness || 6,
              frag.longevity || '8 hrs',
              frag.source || 'curated_catalog',
              frag.source_url || null,
              frag.source_date || '2025-2026',
              frag.last_verified || '2026-09-08',
              frag.data_confidence ?? 0.95,
              frag.status || 'verified',
              frag.active !== false ? 1 : 0,
              frag.is_gift_set ? 1 : 0,
              frag.product_category || 'fine_perfume'
            ]
          );

          // Populate fragrance_notes with both raw and normalized terms
          for (const note of (frag.top_notes || [])) {
            this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [frag.id, note, note, 'top']);
          }
          for (const note of (frag.middle_notes || [])) {
            this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [frag.id, note, note, 'middle']);
          }
          for (const note of (frag.base_notes || [])) {
            this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [frag.id, note, note, 'base']);
          }
        }
      } catch (err) {
        console.error('Error seeding fragrances from JSON:', err);
      }

      // Add sample user
      this.db.run(`INSERT OR IGNORE INTO users (id, name, email) VALUES (1, 'Connoisseur', 'user@olfactory.ai')`);

      // Seed sample collection: Raw (1), Mysore Sandalwood & Vetiver (6), Chai Musk (23), Mitti Attar (39), Baccarat Rouge 540 (53)
      this.db.run(`INSERT OR IGNORE INTO user_collection (user_id, fragrance_id) VALUES (1, 1), (1, 6), (1, 23), (1, 39), (1, 53)`);
    }

    // Cache brands
    this.refreshBrandsCache();
    this.refreshTaxonomyCache();
  }

  private refreshBrandsCache() {
    if (!this.db) return;
    const res = this.db.exec(`SELECT * FROM brands ORDER BY name ASC`);
    if (!res[0]) return;
    const cols = res[0].columns;
    this.brandsCache = res[0].values.map(vals => {
      const obj: any = {};
      cols.forEach((col, idx) => { obj[col] = vals[idx]; });
      return {
        id: obj.id,
        name: obj.name,
        country: obj.country,
        brand_type: obj.brand_type,
        category: obj.category,
        origin_style: obj.origin_style,
        description: obj.description,
        founded_year: obj.founded_year,
        website: obj.website,
        city: obj.city
      };
    });
  }

  private refreshTaxonomyCache() {
    if (!this.db) return;
    const res = this.db.exec(`SELECT * FROM note_taxonomy ORDER BY normalized_name ASC`);
    if (!res[0]) return;
    const cols = res[0].columns;
    this.taxonomyCache = res[0].values.map(vals => {
      const obj: any = {};
      cols.forEach((col, idx) => { obj[col] = vals[idx]; });
      return {
        id: obj.id,
        raw_term: obj.raw_term,
        original_note: obj.original_note,
        normalized_name: obj.normalized_name,
        note_family: obj.note_family,
        category: obj.category,
        origin: obj.origin,
        english_equivalent: obj.english_equivalent,
        cultural_context: obj.cultural_context
      };
    });
  }

  private computeVectorsAndClusters() {
    if (!this.db) return;

    const rows = this.db.exec(`
      SELECT f.*, b.name as brand, b.country as brand_country, b.brand_type
      FROM fragrances f
      LEFT JOIN brands b ON f.brand_id = b.id
    `);
    if (!rows[0]) return;

    const columns = rows[0].columns;
    const rawList: Fragrance[] = rows[0].values.map(vals => {
      const obj: any = {};
      columns.forEach((col, idx) => {
        obj[col] = vals[idx];
      });
      return {
        id: obj.id,
        brand_id: obj.brand_id,
        brand: obj.brand || obj.brand_name,
        brand_name: obj.brand_name || obj.brand,
        brand_country: obj.brand_country,
        brand_type: obj.brand_type,
        collection: obj.collection || 'Core Perfume Range',
        name: obj.name,
        format: obj.format,
        fragrance_type: obj.fragrance_type || obj.format || 'Eau de Parfum',
        concentration: obj.concentration || 'EDP (15-20%)',
        gender: obj.gender,
        category: obj.category || 'Designer / mass Indian',
        description: obj.description,
        origin_style: obj.origin_style,
        price_min: obj.price_min,
        price_max: obj.price_max,
        price_inr: obj.price_inr || (obj.price_min ? Math.round((obj.price_min + (obj.price_max || obj.price_min)) / 2) : 2500),
        currency: obj.currency || 'INR',
        volume_ml: obj.volume_ml,
        is_oil_based: Boolean(obj.is_oil_based),
        season: typeof obj.season === 'string' ? JSON.parse(obj.season) : obj.season,
        occasion: typeof obj.occasion === 'string' ? JSON.parse(obj.occasion) : obj.occasion,
        intensity: obj.intensity,
        sweetness: obj.sweetness,
        freshness: obj.freshness,
        longevity: obj.longevity,
        fragrance_family: obj.fragrance_family,
        source: obj.source,
        source_url: obj.source_url,
        source_date: obj.source_date,
        last_verified: obj.last_verified || '2026-09-08',
        data_confidence: obj.data_confidence ?? 0.95,
        status: obj.status || 'verified',
        active: Boolean(obj.active !== 0),
        is_gift_set: Boolean(obj.is_gift_set),
        product_category: obj.product_category || 'fine_perfume',
        top_notes: typeof obj.top_notes === 'string' ? JSON.parse(obj.top_notes) : obj.top_notes,
        middle_notes: typeof obj.middle_notes === 'string' ? JSON.parse(obj.middle_notes) : obj.middle_notes,
        base_notes: typeof obj.base_notes === 'string' ? JSON.parse(obj.base_notes) : obj.base_notes
      };
    });

    // Compute vectors
    const withVectors = rawList.map(frag => ({
      ...frag,
      vector: extractFragranceVector(frag)
    }));

    // Perform K-Means clustering (k = 5)
    const kMeansResult = performKMeansClustering(withVectors, 5);
    this.clustersCache = kMeansResult.clusterInfos;

    // Assign cluster label and id
    this.fragrancesCache = withVectors.map(frag => {
      const clusterId = kMeansResult.clusterAssignments.get(frag.id) ?? 0;
      const info = kMeansResult.clusterInfos.find(ci => ci.cluster_id === clusterId);
      const label = info ? info.name : `Cluster ${clusterId + 1}`;

      // Update DB with cluster
      this.db?.run(`UPDATE fragrances SET cluster_id = ?, cluster_label = ? WHERE id = ?`, [clusterId, label, frag.id]);

      return {
        ...frag,
        cluster_id: clusterId,
        cluster_label: label
      };
    });
  }

  saveToFile() {
    if (!this.db) return;
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_FILE_PATH, buffer);
    } catch (err) {
      console.error('Error saving SQLite DB to file:', err);
    }
  }

  getAllBrands(): Brand[] {
    return this.brandsCache;
  }

  getBrandById(id: number): Brand | undefined {
    return this.brandsCache.find(b => b.id === id);
  }

  getNoteTaxonomy(): NoteTaxonomyEntry[] {
    return this.taxonomyCache;
  }

  getAllFragrances(): (Fragrance & { vector: number[] })[] {
    return this.fragrancesCache;
  }

  getFragranceById(id: number): (Fragrance & { vector: number[] }) | undefined {
    return this.fragrancesCache.find(f => f.id === id);
  }

  getClusters(): ClusterInfo[] {
    return this.clustersCache;
  }

  getUserCollection(userId: number = 1): number[] {
    if (!this.db) return [];
    const res = this.db.exec(`SELECT fragrance_id FROM user_collection WHERE user_id = ?`, [userId]);
    if (!res[0]) return [];
    return res[0].values.map(v => v[0] as number);
  }

  addToCollection(fragranceId: number, userId: number = 1): boolean {
    if (!this.db) return false;
    this.db.run(`INSERT OR IGNORE INTO user_collection (user_id, fragrance_id) VALUES (?, ?)`, [userId, fragranceId]);
    this.saveToFile();
    return true;
  }

  removeFromCollection(fragranceId: number, userId: number = 1): boolean {
    if (!this.db) return false;
    this.db.run(`DELETE FROM user_collection WHERE user_id = ? AND fragrance_id = ?`, [userId, fragranceId]);
    this.saveToFile();
    return true;
  }

  getUserPreferences(userId: number = 1): UserPreferences | null {
    if (!this.db) return null;
    const res = this.db.exec(`SELECT * FROM user_preferences WHERE user_id = ?`, [userId]);
    if (!res[0] || res[0].values.length === 0) {
      return {
        sweetness: 5,
        freshness: 6,
        intensity: 6,
        preferred_gender: 'all',
        season: 'Summer',
        occasion: 'Date',
        time_of_day: 'Evening',
        origin_filter: 'all',
        format_filter: 'all'
      };
    }
    const cols = res[0].columns;
    const vals = res[0].values[0];
    const data: any = {};
    cols.forEach((col, idx) => { data[col] = vals[idx]; });

    return {
      favorite_family: data.favorite_family ? JSON.parse(data.favorite_family) : [],
      preferred_notes: data.preferred_notes ? JSON.parse(data.preferred_notes) : [],
      sweetness: data.sweetness,
      freshness: data.freshness,
      intensity: data.intensity,
      preferred_gender: data.preferred_gender,
      season: data.season,
      occasion: data.occasion,
      time_of_day: data.time_of_day,
      origin_filter: data.origin_filter || 'all',
      format_filter: data.format_filter || 'all',
      brand_category_filter: data.brand_category_filter || 'all',
      owned_fragrance_id: data.owned_fragrance_id ?? undefined
    };
  }

  saveUserPreferences(prefs: UserPreferences, userId: number = 1) {
    if (!this.db) return;
    this.db.run(
      `INSERT INTO user_preferences (
        user_id, favorite_family, preferred_notes, sweetness, freshness, intensity,
        preferred_gender, season, occasion, time_of_day, origin_filter, format_filter, brand_category_filter, owned_fragrance_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        favorite_family=excluded.favorite_family,
        preferred_notes=excluded.preferred_notes,
        sweetness=excluded.sweetness,
        freshness=excluded.freshness,
        intensity=excluded.intensity,
        preferred_gender=excluded.preferred_gender,
        season=excluded.season,
        occasion=excluded.occasion,
        time_of_day=excluded.time_of_day,
        origin_filter=excluded.origin_filter,
        format_filter=excluded.format_filter,
        brand_category_filter=excluded.brand_category_filter,
        owned_fragrance_id=excluded.owned_fragrance_id`,
      [
        userId,
        JSON.stringify(prefs.favorite_family || []),
        JSON.stringify(prefs.preferred_notes || []),
        prefs.sweetness,
        prefs.freshness,
        prefs.intensity,
        prefs.preferred_gender || 'all',
        prefs.season || 'Summer',
        prefs.occasion || 'Date',
        prefs.time_of_day || 'Evening',
        prefs.origin_filter || 'all',
        prefs.format_filter || 'all',
        prefs.brand_category_filter || 'all',
        prefs.owned_fragrance_id ?? null
      ]
    );
    this.saveToFile();
  }

  addRating(fragAId: number, fragBId: number, rating: number, feedbackTag?: string, userId: number = 1): number {
    if (!this.db) return 0;
    this.db.run(
      `INSERT INTO user_ratings (user_id, fragrance_a_id, fragrance_b_id, rating, feedback_tag) VALUES (?, ?, ?, ?, ?)`,
      [userId, fragAId, fragBId, rating, feedbackTag || null]
    );
    this.saveToFile();

    const idRes = this.db.exec(`SELECT last_insert_rowid()`);
    return (idRes[0]?.values[0]?.[0] as number) || 0;
  }

  getUserRatings(userId: number = 1): UserRating[] {
    if (!this.db) return [];
    const res = this.db.exec(`SELECT * FROM user_ratings WHERE user_id = ? ORDER BY created_at DESC`, [userId]);
    if (!res[0]) return [];
    const cols = res[0].columns;
    return res[0].values.map(vals => {
      const obj: any = {};
      cols.forEach((col, idx) => { obj[col] = vals[idx]; });
      return {
        id: obj.id,
        fragrance_a_id: obj.fragrance_a_id,
        fragrance_b_id: obj.fragrance_b_id,
        rating: obj.rating,
        feedback_tag: obj.feedback_tag,
        created_at: obj.created_at
      };
    });
  }

  saveCombination(fragAId: number, fragBId: number, score: number, explanation: string, season: string, occasion: string): number {
    if (!this.db) return 0;
    this.db.run(
      `INSERT INTO layering_combinations (fragrance_a_id, fragrance_b_id, compatibility_score, explanation, season, occasion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fragAId, fragBId, score, explanation, season, occasion]
    );
    this.saveToFile();
    const idRes = this.db.exec(`SELECT last_insert_rowid()`);
    return (idRes[0]?.values[0]?.[0] as number) || 0;
  }

  getSavedCombinations(): SavedCombination[] {
    if (!this.db) return [];
    const res = this.db.exec(`
      SELECT lc.*, ur.rating as user_rating
      FROM layering_combinations lc
      LEFT JOIN user_ratings ur ON (
        (ur.fragrance_a_id = lc.fragrance_a_id AND ur.fragrance_b_id = lc.fragrance_b_id) OR
        (ur.fragrance_a_id = lc.fragrance_b_id AND ur.fragrance_b_id = lc.fragrance_a_id)
      )
      ORDER BY lc.saved_at DESC
    `);
    if (!res[0]) return [];
    const cols = res[0].columns;
    const results: SavedCombination[] = [];

    for (const vals of res[0].values) {
      const obj: any = {};
      cols.forEach((col, idx) => { obj[col] = vals[idx]; });
      const fragA = this.getFragranceById(obj.fragrance_a_id);
      const fragB = this.getFragranceById(obj.fragrance_b_id);
      if (fragA && fragB) {
        results.push({
          id: obj.id,
          fragrance_a: fragA,
          fragrance_b: fragB,
          compatibility_score: obj.compatibility_score,
          explanation: obj.explanation,
          best_season: obj.season,
          best_occasion: obj.occasion,
          saved_at: obj.saved_at,
          user_rating: obj.user_rating
        });
      }
    }
    return results;
  }

  deleteSavedCombination(id: number): boolean {
    if (!this.db) return false;
    this.db.run(`DELETE FROM layering_combinations WHERE id = ?`, [id]);
    this.saveToFile();
    return true;
  }
}

export const dbService = new FragranceDatabase();
