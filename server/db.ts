import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import {
  Fragrance,
  Brand,
  NoteTaxonomyEntry,
  UserPreferences,
  SavedCombination,
  ClusterInfo,
  UserRating,
  CanonicalFragranceImport,
  CanonicalImportValidationResult,
  CanonicalImportResolution,
  OlfactoryBehaviorEvent,
  FragranceBehaviorSummary
} from '../src/types.js';
import { extractFragranceVector, setDynamicTaxonomy, resolveTaxonomyNote } from './ml/features.js';
import { performKMeansClustering } from './ml/clustering.js';
import {
  validateStringArray,
  validate8DVector,
  validateProjection,
  calculateVectorConfidence,
  validateCanonicalImport,
  resolveImportConflict
} from './ml/canonicalValidation.js';

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

    // Ensure fragrances table has all canonical olfactory intelligence columns
    try {
      const checkFrag = this.db.exec("PRAGMA table_info(fragrances);");
      if (checkFrag[0]) {
        const existingCols = checkFrag[0].values.map(row => row[1]);
        const canonicalColumns = [
          { name: 'accords', ddl: 'ALTER TABLE fragrances ADD COLUMN accords TEXT;' },
          { name: 'projection', ddl: 'ALTER TABLE fragrances ADD COLUMN projection TEXT;' },
          { name: 'time_of_day', ddl: 'ALTER TABLE fragrances ADD COLUMN time_of_day TEXT;' },
          { name: 'heritage_materials', ddl: 'ALTER TABLE fragrances ADD COLUMN heritage_materials TEXT;' },
          { name: 'distillation_method', ddl: 'ALTER TABLE fragrances ADD COLUMN distillation_method TEXT;' },
          { name: 'heritage_relationship', ddl: 'ALTER TABLE fragrances ADD COLUMN heritage_relationship TEXT;' },
          { name: 'vector', ddl: 'ALTER TABLE fragrances ADD COLUMN vector TEXT;' },
          { name: 'vector_confidence', ddl: 'ALTER TABLE fragrances ADD COLUMN vector_confidence REAL;' },
          { name: 'vector_generation_source', ddl: 'ALTER TABLE fragrances ADD COLUMN vector_generation_source TEXT;' }
        ];

        for (const col of canonicalColumns) {
          if (!existingCols.includes(col.name)) {
            console.log(`Migrating fragrances table: adding ${col.name} column...`);
            this.db.run(col.ddl);
          }
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
        accords TEXT,
        projection TEXT,
        time_of_day TEXT,
        heritage_materials TEXT,
        distillation_method TEXT,
        heritage_relationship TEXT,
        vector TEXT,
        vector_confidence REAL,
        vector_generation_source TEXT,
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

      CREATE TABLE IF NOT EXISTS fragrance_journal (
        id TEXT PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        date TEXT NOT NULL,
        fragrance_id INTEGER NOT NULL,
        fragrance_name TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        is_layering INTEGER DEFAULT 0,
        layering_partner_id INTEGER,
        layering_partner_name TEXT,
        weather_temp_c REAL,
        weather_condition TEXT,
        occasion TEXT,
        spray_count INTEGER DEFAULT 3,
        application_spots TEXT,
        observed_longevity_hours REAL,
        observed_projection TEXT,
        mood TEXT,
        rating INTEGER DEFAULT 5,
        notes_memo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS product_submissions (
        id TEXT PRIMARY KEY,
        brand TEXT NOT NULL,
        product TEXT NOT NULL,
        collection TEXT,
        concentration TEXT,
        format TEXT,
        top_notes TEXT,
        heart_notes TEXT,
        base_notes TEXT,
        accords TEXT,
        description TEXT,
        country TEXT,
        launch_year INTEGER,
        perfumer TEXT,
        source_url TEXT,
        status TEXT DEFAULT 'pending',
        confidence_score REAL DEFAULT 0.95,
        submitted_by TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS olfactory_behavior_events (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1,
        event_type TEXT NOT NULL,
        fragrance_id INTEGER,
        source TEXT NOT NULL,
        context_json TEXT,
        metadata_json TEXT,
        session_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fragrance_id) REFERENCES fragrances (id)
      );

      CREATE INDEX IF NOT EXISTS idx_behavior_user ON olfactory_behavior_events(user_id);
      CREATE INDEX IF NOT EXISTS idx_behavior_type ON olfactory_behavior_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_behavior_fragrance ON olfactory_behavior_events(fragrance_id);
      CREATE INDEX IF NOT EXISTS idx_behavior_created ON olfactory_behavior_events(created_at);
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
    setDynamicTaxonomy(this.taxonomyCache);
  }

  computeVectorsAndClusters() {
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
        top_notes: typeof obj.top_notes === 'string' ? JSON.parse(obj.top_notes) : (Array.isArray(obj.top_notes) ? obj.top_notes : []),
        middle_notes: typeof obj.middle_notes === 'string' ? JSON.parse(obj.middle_notes) : (Array.isArray(obj.middle_notes) ? obj.middle_notes : []),
        base_notes: typeof obj.base_notes === 'string' ? JSON.parse(obj.base_notes) : (Array.isArray(obj.base_notes) ? obj.base_notes : []),
        accords: typeof obj.accords === 'string' ? JSON.parse(obj.accords) : (Array.isArray(obj.accords) ? obj.accords : []),
        projection: obj.projection || null,
        time_of_day: typeof obj.time_of_day === 'string' ? JSON.parse(obj.time_of_day) : (Array.isArray(obj.time_of_day) ? obj.time_of_day : []),
        heritage_materials: typeof obj.heritage_materials === 'string' ? JSON.parse(obj.heritage_materials) : (Array.isArray(obj.heritage_materials) ? obj.heritage_materials : []),
        distillation_method: obj.distillation_method || null,
        heritage_relationship: obj.heritage_relationship || null,
        vector_confidence: typeof obj.vector_confidence === 'number' ? obj.vector_confidence : undefined,
        vector_generation_source: obj.vector_generation_source || 'rule_based_taxonomy'
      };
    });

    // Compute vectors and vector confidence
    const withVectors = rawList.map(frag => {
      const vector = extractFragranceVector(frag);
      const vectorConfidence = frag.vector_confidence !== undefined && frag.vector_confidence !== null
        ? frag.vector_confidence
        : calculateVectorConfidence(frag);
      const vectorGenSource = frag.vector_generation_source || 'rule_based_taxonomy';

      return {
        ...frag,
        vector,
        vector_confidence: vectorConfidence,
        vector_generation_source: vectorGenSource
      };
    });

    // Perform K-Means clustering (k = 5)
    const kMeansResult = performKMeansClustering(withVectors, 5);
    this.clustersCache = kMeansResult.clusterInfos;

    // Assign cluster label, id and persist vector + metadata into database
    this.fragrancesCache = withVectors.map(frag => {
      const clusterId = kMeansResult.clusterAssignments.get(frag.id) ?? 0;
      const info = kMeansResult.clusterInfos.find(ci => ci.cluster_id === clusterId);
      const label = info ? info.name : `Cluster ${clusterId + 1}`;

      // Update DB with cluster, vector, vector_confidence, vector_generation_source
      this.db?.run(
        `UPDATE fragrances SET
          cluster_id = ?,
          cluster_label = ?,
          vector = ?,
          vector_confidence = ?,
          vector_generation_source = ?
         WHERE id = ?`,
        [
          clusterId,
          label,
          JSON.stringify(frag.vector),
          frag.vector_confidence,
          frag.vector_generation_source,
          frag.id
        ]
      );

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

  getBrandIntelligenceStats() {
    const brands = this.getAllBrands();
    const frags = this.getAllFragrances();

    const attarCount = brands.filter(b => (b.brand_type === 'heritage_attar' || (b.category || '').toLowerCase().includes('attar'))).length;
    const nicheCount = brands.filter(b => (b.brand_type === 'indian_niche' || b.brand_type === 'international_niche')).length;
    const massCount = brands.filter(b => (b.brand_type === 'major_indian_mass')).length;
    const heritageCount = brands.filter(b => ((b.category || '').toLowerCase().includes('traditional') || (b.category || '').toLowerCase().includes('heritage'))).length;
    const verifiedCount = frags.filter(f => f.status === 'verified').length;
    const needsReview = frags.length - verifiedCount;

    // Category distribution
    const catMap: Record<string, number> = {};
    frags.forEach(f => {
      const cat = f.category || 'Fine Fragrance';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const categoryCoverage = Object.entries(catMap).map(([category, count]) => ({ category, count }));

    return {
      total_brands: brands.length,
      total_products: frags.length,
      verified_count: verifiedCount,
      needs_review_count: needsReview,
      attar_houses_count: attarCount,
      niche_houses_count: nicheCount,
      mass_brands_count: massCount,
      heritage_houses_count: heritageCount,
      discontinued_count: 0,
      duplicate_candidates_count: 0,
      growth_rate_pct: 38.5,
      coverage_by_category: categoryCoverage
    };
  }

  getFragranceJournal(userId: number = 1) {
    if (!this.db) return [];
    const res = this.db.exec(`SELECT * FROM fragrance_journal WHERE user_id = ? ORDER BY date DESC`, [userId]);
    if (!res[0]) return [];
    const cols = res[0].columns;
    return res[0].values.map(vals => {
      const obj: any = {};
      cols.forEach((c, idx) => { obj[c] = vals[idx]; });
      return {
        id: obj.id,
        date: obj.date,
        fragrance_id: obj.fragrance_id,
        fragrance_name: obj.fragrance_name,
        brand_name: obj.brand_name,
        is_layering: Boolean(obj.is_layering),
        layering_partner_id: obj.layering_partner_id,
        layering_partner_name: obj.layering_partner_name,
        weather_temp_c: obj.weather_temp_c,
        weather_condition: obj.weather_condition,
        occasion: obj.occasion,
        spray_count: obj.spray_count,
        application_spots: obj.application_spots ? JSON.parse(obj.application_spots) : [],
        observed_longevity_hours: obj.observed_longevity_hours,
        observed_projection: obj.observed_projection,
        mood: obj.mood,
        rating: obj.rating,
        notes_memo: obj.notes_memo
      };
    });
  }

  addFragranceJournalEntry(entry: any, userId: number = 1) {
    if (!this.db) return;
    const entryId = entry.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.db.run(
      `INSERT INTO fragrance_journal (
        id, user_id, date, fragrance_id, fragrance_name, brand_name, is_layering,
        layering_partner_id, layering_partner_name, weather_temp_c, weather_condition,
        occasion, spray_count, application_spots, observed_longevity_hours, observed_projection,
        mood, rating, notes_memo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entryId,
        userId,
        entry.date || new Date().toISOString().split('T')[0],
        entry.fragrance_id,
        entry.fragrance_name,
        entry.brand_name,
        entry.is_layering ? 1 : 0,
        entry.layering_partner_id ?? null,
        entry.layering_partner_name ?? null,
        entry.weather_temp_c ?? null,
        entry.weather_condition ?? null,
        entry.occasion || 'Signature',
        entry.spray_count || 3,
        JSON.stringify(entry.application_spots || ['Wrists', 'Neck']),
        entry.observed_longevity_hours || 8,
        entry.observed_projection || 'Moderate',
        entry.mood || 'Confident',
        entry.rating || 5,
        entry.notes_memo || ''
      ]
    );
    this.saveToFile();
    return entryId;
  }

  getProductSubmissions() {
    if (!this.db) return [];
    const res = this.db.exec(`SELECT * FROM product_submissions ORDER BY submitted_at DESC`);
    if (!res[0]) return [];
    const cols = res[0].columns;
    return res[0].values.map(vals => {
      const obj: any = {};
      cols.forEach((c, idx) => { obj[c] = vals[idx]; });
      return {
        id: obj.id,
        brand: obj.brand,
        product: obj.product,
        collection: obj.collection,
        concentration: obj.concentration,
        format: obj.format,
        notes: {
          top: obj.top_notes ? JSON.parse(obj.top_notes) : [],
          heart: obj.heart_notes ? JSON.parse(obj.heart_notes) : [],
          base: obj.base_notes ? JSON.parse(obj.base_notes) : []
        },
        accords: obj.accords ? JSON.parse(obj.accords) : [],
        description: obj.description,
        country: obj.country,
        launch_year: obj.launch_year,
        perfumer: obj.perfumer,
        source_url: obj.source_url,
        status: obj.status,
        confidence_score: obj.confidence_score,
        submitted_by: obj.submitted_by,
        submitted_at: obj.submitted_at
      };
    });
  }

  createProductSubmission(sub: any) {
    if (!this.db) return;
    const subId = sub.id || `sub_${Date.now()}`;
    this.db.run(
      `INSERT INTO product_submissions (
        id, brand, product, collection, concentration, format,
        top_notes, heart_notes, base_notes, accords, description,
        country, launch_year, perfumer, source_url, status, confidence_score, submitted_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        subId,
        sub.brand,
        sub.product,
        sub.collection || 'Core Series',
        sub.concentration || 'Eau de Parfum',
        sub.format || 'Eau de Parfum',
        JSON.stringify(sub.notes?.top || sub.top_notes || []),
        JSON.stringify(sub.notes?.heart || sub.heart_notes || []),
        JSON.stringify(sub.notes?.base || sub.base_notes || []),
        JSON.stringify(sub.accords || []),
        sub.description || '',
        sub.country || 'India',
        sub.launch_year ?? null,
        sub.perfumer ?? null,
        sub.source_url || '',
        'pending',
        sub.confidence_score || 0.95,
        sub.submitted_by || 'Community Perfumery Contributor'
      ]
    );
    this.saveToFile();
    return subId;
  }

  reviewProductSubmission(id: string, status: 'approved' | 'rejected') {
    if (!this.db) return;
    this.db.run(`UPDATE product_submissions SET status = ? WHERE id = ?`, [status, id]);
    this.saveToFile();
    return true;
  }

  // ================= CRUD: BRANDS =================

  createBrand(data: Partial<Brand>): Brand {
    if (!this.db) throw new Error('Database not initialized');
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new Error('Brand name is required');
    }

    const trimmedName = data.name.trim();

    // Duplicate check
    const existing = this.brandsCache.find(
      b => b.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existing) {
      throw new Error(`Brand "${trimmedName}" already exists (ID: ${existing.id})`);
    }

    // Determine ID
    let newId = data.id;
    if (!newId) {
      const maxRes = this.db.exec(`SELECT MAX(id) FROM brands`);
      const maxId = (maxRes[0]?.values[0]?.[0] as number) || 0;
      newId = maxId + 1;
    }

    this.db.run(
      `INSERT INTO brands (id, name, country, brand_type, category, origin_style, description, founded_year, website, city)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        trimmedName,
        data.country?.trim() || 'India',
        data.brand_type?.trim() || 'indian_niche',
        data.category?.trim() || 'Indian niche',
        data.origin_style?.trim() || 'Indian / Traditional',
        data.description?.trim() || '',
        data.founded_year ?? null,
        data.website?.trim() || null,
        data.city?.trim() || null
      ]
    );

    this.saveToFile();
    this.refreshBrandsCache();

    const created = this.getBrandById(newId);
    if (!created) throw new Error('Failed to retrieve newly created brand');
    return created;
  }

  updateBrand(id: number, data: Partial<Brand>): Brand {
    if (!this.db) throw new Error('Database not initialized');
    const existing = this.getBrandById(id);
    if (!existing) {
      throw new Error(`Brand with ID ${id} not found`);
    }

    if (data.name && data.name.trim()) {
      const trimmedName = data.name.trim();
      const duplicate = this.brandsCache.find(
        b => b.id !== id && b.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Brand "${trimmedName}" already exists (ID: ${duplicate.id})`);
      }
    }

    const updatedName = data.name !== undefined ? data.name.trim() : existing.name;
    const updatedCountry = data.country !== undefined ? data.country.trim() : existing.country;
    const updatedBrandType = data.brand_type !== undefined ? data.brand_type.trim() : existing.brand_type;
    const updatedCategory = data.category !== undefined ? data.category.trim() : existing.category;
    const updatedOriginStyle = data.origin_style !== undefined ? data.origin_style.trim() : existing.origin_style;
    const updatedDescription = data.description !== undefined ? data.description.trim() : existing.description;
    const updatedFoundedYear = data.founded_year !== undefined ? data.founded_year : existing.founded_year;
    const updatedWebsite = data.website !== undefined ? data.website.trim() : existing.website;
    const updatedCity = data.city !== undefined ? data.city.trim() : existing.city;

    this.db.run(
      `UPDATE brands SET
        name = ?, country = ?, brand_type = ?, category = ?, origin_style = ?,
        description = ?, founded_year = ?, website = ?, city = ?
       WHERE id = ?`,
      [
        updatedName,
        updatedCountry,
        updatedBrandType,
        updatedCategory,
        updatedOriginStyle,
        updatedDescription,
        updatedFoundedYear ?? null,
        updatedWebsite ?? null,
        updatedCity ?? null,
        id
      ]
    );

    // If brand name changed, also update brand_name in fragrances
    if (updatedName !== existing.name) {
      this.db.run(`UPDATE fragrances SET brand_name = ? WHERE brand_id = ?`, [updatedName, id]);
    }

    this.saveToFile();
    this.refreshBrandsCache();
    this.computeVectorsAndClusters();

    return this.getBrandById(id)!;
  }

  deleteBrand(id: number): boolean {
    if (!this.db) throw new Error('Database not initialized');
    const existing = this.getBrandById(id);
    if (!existing) {
      throw new Error(`Brand with ID ${id} not found`);
    }

    // Check if any fragrances reference this brand
    const checkFrags = this.db.exec(`SELECT COUNT(*) FROM fragrances WHERE brand_id = ?`, [id]);
    const count = (checkFrags[0]?.values[0]?.[0] as number) || 0;
    if (count > 0) {
      throw new Error(`Cannot delete brand "${existing.name}" because it has ${count} associated fragrance(s). Delete or reassign the fragrances first.`);
    }

    this.db.run(`DELETE FROM brands WHERE id = ?`, [id]);
    this.saveToFile();
    this.refreshBrandsCache();
    return true;
  }

  // ================= CRUD: FRAGRANCES =================

  createFragrance(data: Partial<Fragrance>): Fragrance & { vector: number[] } {
    if (!this.db) throw new Error('Database not initialized');
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new Error('Fragrance name is required');
    }

    // Resolve Brand
    let brandId = data.brand_id;
    let brandName = data.brand_name || data.brand;

    if (brandId) {
      const foundBrand = this.getBrandById(brandId);
      if (!foundBrand) {
        throw new Error(`Brand with ID ${brandId} does not exist`);
      }
      brandName = foundBrand.name;
    } else if (brandName && brandName.trim()) {
      const trimmedBrand = brandName.trim();
      const existingBrand = this.brandsCache.find(
        b => b.name.toLowerCase() === trimmedBrand.toLowerCase()
      );
      if (existingBrand) {
        brandId = existingBrand.id;
        brandName = existingBrand.name;
      } else {
        // Auto-create brand if it doesn't exist
        const createdBrand = this.createBrand({
          name: trimmedBrand,
          country: data.brand_country || 'India',
          brand_type: data.brand_type || 'indian_niche',
          category: data.category || 'Indian niche',
          origin_style: data.origin_style || 'Indian / Traditional'
        });
        brandId = createdBrand.id;
        brandName = createdBrand.name;
      }
    } else {
      throw new Error('Either brand_id or brand name is required');
    }

    const trimmedName = data.name.trim();

    // Duplicate check: Same brand + same fragrance name
    const existingFrag = this.fragrancesCache.find(
      f => (f.brand_id === brandId || f.brand_name?.toLowerCase() === brandName!.toLowerCase()) &&
           f.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (existingFrag) {
      throw new Error(`Fragrance "${trimmedName}" by "${brandName}" already exists (ID: ${existingFrag.id})`);
    }

    // Determine ID
    let newId = data.id;
    if (!newId) {
      const maxRes = this.db.exec(`SELECT MAX(id) FROM fragrances`);
      const maxId = (maxRes[0]?.values[0]?.[0] as number) || 0;
      newId = maxId + 1;
    }

    const topNotes = Array.isArray(data.top_notes) ? data.top_notes : [];
    const middleNotes = Array.isArray(data.middle_notes) ? data.middle_notes : [];
    const baseNotes = Array.isArray(data.base_notes) ? data.base_notes : [];
    const accords = Array.isArray(data.accords) ? data.accords : [];
    const timeOfDay = Array.isArray(data.time_of_day) ? data.time_of_day : [];
    const heritageMaterials = Array.isArray(data.heritage_materials) ? data.heritage_materials : [];
    const season = Array.isArray(data.season) ? data.season : ['Spring', 'Summer', 'Monsoon', 'Winter'];
    const occasion = Array.isArray(data.occasion) ? data.occasion : ['Office', 'Casual', 'Evening'];

    this.db.run(
      `INSERT INTO fragrances (
        id, brand_id, brand_name, collection, name, format, fragrance_type, concentration,
        gender, category, description, origin_style, price_min, price_max, price_inr, currency,
        volume_ml, is_oil_based, fragrance_family, top_notes, middle_notes, base_notes,
        season, occasion, intensity, sweetness, freshness, longevity, source, source_url,
        source_date, last_verified, data_confidence, status, active, is_gift_set, product_category,
        accords, projection, time_of_day, heritage_materials, distillation_method, heritage_relationship
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        brandId,
        brandName,
        data.collection?.trim() || 'Core Perfume Range',
        trimmedName,
        data.format || 'Eau de Parfum',
        data.fragrance_type || data.format || 'Eau de Parfum',
        data.concentration || 'EDP (15-20%)',
        data.gender || 'unisex',
        data.category || 'Designer / mass Indian',
        data.description || '',
        data.origin_style || 'International / Western',
        data.price_min ?? null,
        data.price_max ?? null,
        data.price_inr ?? (data.price_min ? Math.round((data.price_min + (data.price_max || data.price_min)) / 2) : 2500),
        data.currency || 'INR',
        data.volume_ml ?? null,
        data.is_oil_based ? 1 : 0,
        data.fragrance_family || 'Woody',
        JSON.stringify(topNotes),
        JSON.stringify(middleNotes),
        JSON.stringify(baseNotes),
        JSON.stringify(season),
        JSON.stringify(occasion),
        data.intensity || 6,
        data.sweetness || 5,
        data.freshness || 6,
        data.longevity || '8 hrs',
        data.source || 'curated_catalog',
        data.source_url || null,
        data.source_date || '2025-2026',
        data.last_verified || new Date().toISOString().split('T')[0],
        data.data_confidence ?? 0.95,
        data.status || 'verified',
        data.active !== false ? 1 : 0,
        data.is_gift_set ? 1 : 0,
        data.product_category || 'fine_perfume',
        JSON.stringify(accords),
        data.projection || null,
        JSON.stringify(timeOfDay),
        JSON.stringify(heritageMaterials),
        data.distillation_method || null,
        data.heritage_relationship || null
      ]
    );

    // Sync fragrance_notes normalized table
    for (const note of topNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(
        `INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`,
        [newId, res.raw_note, res.normalized_name, 'top']
      );
    }
    for (const note of middleNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(
        `INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`,
        [newId, res.raw_note, res.normalized_name, 'middle']
      );
    }
    for (const note of baseNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(
        `INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`,
        [newId, res.raw_note, res.normalized_name, 'base']
      );
    }
    const generalNotes = (data as any).notes_general || [];
    for (const note of generalNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(
        `INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`,
        [newId, res.raw_note, res.normalized_name, 'general']
      );
    }

    this.saveToFile();
    this.computeVectorsAndClusters();

    const created = this.getFragranceById(newId);
    if (!created) throw new Error('Failed to retrieve newly created fragrance');
    return created;
  }

  updateFragrance(id: number, data: Partial<Fragrance>): Fragrance & { vector: number[] } {
    if (!this.db) throw new Error('Database not initialized');
    const existing = this.getFragranceById(id);
    if (!existing) {
      throw new Error(`Fragrance with ID ${id} not found`);
    }

    let brandId = data.brand_id !== undefined ? data.brand_id : existing.brand_id;
    let brandName = data.brand_name || data.brand;

    if (data.brand_id !== undefined) {
      const foundBrand = this.getBrandById(data.brand_id);
      if (!foundBrand) throw new Error(`Brand with ID ${data.brand_id} not found`);
      brandName = foundBrand.name;
    } else if (brandName && brandName.trim()) {
      const existingBrand = this.brandsCache.find(b => b.name.toLowerCase() === brandName!.trim().toLowerCase());
      if (existingBrand) {
        brandId = existingBrand.id;
        brandName = existingBrand.name;
      }
    } else {
      brandName = existing.brand_name || existing.brand;
    }

    const updatedName = data.name !== undefined ? data.name.trim() : existing.name;

    // Check duplicate if name or brand changed
    if (updatedName.toLowerCase() !== existing.name.toLowerCase() || (brandId && brandId !== existing.brand_id)) {
      const duplicate = this.fragrancesCache.find(
        f => f.id !== id &&
             (f.brand_id === brandId || f.brand_name?.toLowerCase() === brandName?.toLowerCase()) &&
             f.name.toLowerCase() === updatedName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Fragrance "${updatedName}" by "${brandName}" already exists (ID: ${duplicate.id})`);
      }
    }

    const topNotes = data.top_notes !== undefined ? (Array.isArray(data.top_notes) ? data.top_notes : []) : existing.top_notes;
    const middleNotes = data.middle_notes !== undefined ? (Array.isArray(data.middle_notes) ? data.middle_notes : []) : existing.middle_notes;
    const baseNotes = data.base_notes !== undefined ? (Array.isArray(data.base_notes) ? data.base_notes : []) : existing.base_notes;
    const accords = data.accords !== undefined ? (Array.isArray(data.accords) ? data.accords : []) : (existing.accords || []);
    const timeOfDay = data.time_of_day !== undefined ? (Array.isArray(data.time_of_day) ? data.time_of_day : []) : (existing.time_of_day || []);
    const heritageMaterials = data.heritage_materials !== undefined ? (Array.isArray(data.heritage_materials) ? data.heritage_materials : []) : (existing.heritage_materials || []);
    const season = data.season !== undefined ? (Array.isArray(data.season) ? data.season : []) : existing.season;
    const occasion = data.occasion !== undefined ? (Array.isArray(data.occasion) ? data.occasion : []) : existing.occasion;

    this.db.run(
      `UPDATE fragrances SET
        brand_id = ?, brand_name = ?, collection = ?, name = ?, format = ?,
        fragrance_type = ?, concentration = ?, gender = ?, category = ?,
        description = ?, origin_style = ?, price_min = ?, price_max = ?,
        price_inr = ?, currency = ?, volume_ml = ?, is_oil_based = ?,
        fragrance_family = ?, top_notes = ?, middle_notes = ?, base_notes = ?,
        season = ?, occasion = ?, intensity = ?, sweetness = ?, freshness = ?,
        longevity = ?, source = ?, source_url = ?, source_date = ?,
        last_verified = ?, data_confidence = ?, status = ?, active = ?,
        is_gift_set = ?, product_category = ?, accords = ?, projection = ?,
        time_of_day = ?, heritage_materials = ?, distillation_method = ?,
        heritage_relationship = ?
       WHERE id = ?`,
      [
        brandId ?? existing.brand_id ?? 1,
        brandName ?? existing.brand_name ?? 'Unknown',
        data.collection !== undefined ? data.collection : existing.collection,
        updatedName,
        data.format !== undefined ? data.format : existing.format,
        data.fragrance_type !== undefined ? data.fragrance_type : existing.fragrance_type,
        data.concentration !== undefined ? data.concentration : existing.concentration,
        data.gender !== undefined ? data.gender : existing.gender,
        data.category !== undefined ? data.category : existing.category,
        data.description !== undefined ? data.description : existing.description,
        data.origin_style !== undefined ? data.origin_style : existing.origin_style,
        data.price_min !== undefined ? data.price_min : existing.price_min,
        data.price_max !== undefined ? data.price_max : existing.price_max,
        data.price_inr !== undefined ? data.price_inr : existing.price_inr,
        data.currency !== undefined ? data.currency : existing.currency,
        data.volume_ml !== undefined ? data.volume_ml : existing.volume_ml,
        data.is_oil_based !== undefined ? (data.is_oil_based ? 1 : 0) : (existing.is_oil_based ? 1 : 0),
        data.fragrance_family !== undefined ? data.fragrance_family : existing.fragrance_family,
        JSON.stringify(topNotes),
        JSON.stringify(middleNotes),
        JSON.stringify(baseNotes),
        JSON.stringify(season),
        JSON.stringify(occasion),
        data.intensity !== undefined ? data.intensity : existing.intensity,
        data.sweetness !== undefined ? data.sweetness : existing.sweetness,
        data.freshness !== undefined ? data.freshness : existing.freshness,
        data.longevity !== undefined ? data.longevity : existing.longevity,
        data.source !== undefined ? data.source : existing.source,
        data.source_url !== undefined ? data.source_url : existing.source_url,
        data.source_date !== undefined ? data.source_date : existing.source_date,
        data.last_verified !== undefined ? data.last_verified : new Date().toISOString().split('T')[0],
        data.data_confidence !== undefined ? data.data_confidence : existing.data_confidence,
        data.status !== undefined ? data.status : existing.status,
        data.active !== undefined ? (data.active ? 1 : 0) : (existing.active !== false ? 1 : 0),
        data.is_gift_set !== undefined ? (data.is_gift_set ? 1 : 0) : (existing.is_gift_set ? 1 : 0),
        data.product_category !== undefined ? data.product_category : existing.product_category,
        JSON.stringify(accords),
        data.projection !== undefined ? data.projection : (existing.projection || null),
        JSON.stringify(timeOfDay),
        JSON.stringify(heritageMaterials),
        data.distillation_method !== undefined ? data.distillation_method : (existing.distillation_method || null),
        data.heritage_relationship !== undefined ? data.heritage_relationship : (existing.heritage_relationship || null),
        id
      ]
    );

    // Update notes table
    this.db.run(`DELETE FROM fragrance_notes WHERE fragrance_id = ?`, [id]);
    for (const note of topNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [id, res.raw_note, res.normalized_name, 'top']);
    }
    for (const note of middleNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [id, res.raw_note, res.normalized_name, 'middle']);
    }
    for (const note of baseNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [id, res.raw_note, res.normalized_name, 'base']);
    }
    const generalNotes = (data as any).notes_general || [];
    for (const note of generalNotes) {
      const res = resolveTaxonomyNote(note);
      this.db.run(`INSERT OR IGNORE INTO fragrance_notes (fragrance_id, raw_note, normalized_name, note_type) VALUES (?, ?, ?, ?)`, [id, res.raw_note, res.normalized_name, 'general']);
    }

    this.saveToFile();
    this.computeVectorsAndClusters();

    return this.getFragranceById(id)!;
  }

  deleteFragrance(id: number): boolean {
    if (!this.db) throw new Error('Database not initialized');
    const existing = this.getFragranceById(id);
    if (!existing) {
      throw new Error(`Fragrance with ID ${id} not found`);
    }

    // Cascade delete relations
    this.db.run(`DELETE FROM fragrance_notes WHERE fragrance_id = ?`, [id]);
    this.db.run(`DELETE FROM user_collection WHERE fragrance_id = ?`, [id]);
    this.db.run(`DELETE FROM user_ratings WHERE fragrance_a_id = ? OR fragrance_b_id = ?`, [id, id]);
    this.db.run(`DELETE FROM layering_combinations WHERE fragrance_a_id = ? OR fragrance_b_id = ?`, [id, id]);
    this.db.run(`DELETE FROM fragrance_journal WHERE fragrance_id = ? OR layering_partner_id = ?`, [id, id]);
    this.db.run(`DELETE FROM fragrances WHERE id = ?`, [id]);

    this.saveToFile();
    this.computeVectorsAndClusters();
    return true;
  }

  // ================= CRUD: NOTES / TAXONOMY =================

  createNoteTaxonomy(entry: Partial<NoteTaxonomyEntry>): NoteTaxonomyEntry {
    if (!this.db) throw new Error('Database not initialized');
    if (!entry.raw_term || typeof entry.raw_term !== 'string' || !entry.raw_term.trim()) {
      throw new Error('raw_term is required');
    }

    const trimmedRaw = entry.raw_term.trim();
    const existing = this.taxonomyCache.find(
      t => t.raw_term.toLowerCase() === trimmedRaw.toLowerCase()
    );
    if (existing) {
      throw new Error(`Note taxonomy entry for "${trimmedRaw}" already exists (ID: ${existing.id})`);
    }

    this.db.run(
      `INSERT INTO note_taxonomy (
        raw_term, original_note, normalized_name, note_family, category,
        origin, english_equivalent, cultural_context
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trimmedRaw,
        entry.original_note?.trim() || trimmedRaw,
        entry.normalized_name?.trim() || trimmedRaw,
        entry.note_family || 'Floral',
        entry.category || 'floral',
        entry.origin || 'Indian',
        entry.english_equivalent?.trim() || null,
        entry.cultural_context?.trim() || null
      ]
    );

    this.saveToFile();
    this.refreshTaxonomyCache();
    this.computeVectorsAndClusters();

    const created = this.taxonomyCache.find(
      t => t.raw_term.toLowerCase() === trimmedRaw.toLowerCase()
    );
    if (!created) throw new Error('Failed to create note taxonomy entry');
    return created;
  }

  updateNoteTaxonomy(id: number, entry: Partial<NoteTaxonomyEntry>): NoteTaxonomyEntry {
    if (!this.db) throw new Error('Database not initialized');
    const existing = this.taxonomyCache.find(t => t.id === id);
    if (!existing) {
      throw new Error(`Note taxonomy entry with ID ${id} not found`);
    }

    if (entry.raw_term && entry.raw_term.trim()) {
      const trimmedRaw = entry.raw_term.trim();
      const duplicate = this.taxonomyCache.find(
        t => t.id !== id && t.raw_term.toLowerCase() === trimmedRaw.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Note taxonomy entry for "${trimmedRaw}" already exists (ID: ${duplicate.id})`);
      }
    }

    this.db.run(
      `UPDATE note_taxonomy SET
        raw_term = ?, original_note = ?, normalized_name = ?,
        note_family = ?, category = ?, origin = ?,
        english_equivalent = ?, cultural_context = ?
       WHERE id = ?`,
      [
        entry.raw_term !== undefined ? entry.raw_term.trim() : existing.raw_term,
        entry.original_note !== undefined ? entry.original_note.trim() : existing.original_note,
        entry.normalized_name !== undefined ? entry.normalized_name.trim() : existing.normalized_name,
        entry.note_family !== undefined ? entry.note_family : existing.note_family,
        entry.category !== undefined ? entry.category : existing.category,
        entry.origin !== undefined ? entry.origin : existing.origin,
        entry.english_equivalent !== undefined ? entry.english_equivalent?.trim() : existing.english_equivalent,
        entry.cultural_context !== undefined ? entry.cultural_context?.trim() : existing.cultural_context,
        id
      ]
    );

    this.saveToFile();
    this.refreshTaxonomyCache();
    this.computeVectorsAndClusters();

    return this.taxonomyCache.find(t => t.id === id)!;
  }

  deleteNoteTaxonomy(id: number): boolean {
    if (!this.db) throw new Error('Database not initialized');
    const existing = this.taxonomyCache.find(t => t.id === id);
    if (!existing) {
      throw new Error(`Note taxonomy entry with ID ${id} not found`);
    }

    this.db.run(`DELETE FROM note_taxonomy WHERE id = ?`, [id]);
    this.saveToFile();
    this.refreshTaxonomyCache();
    this.computeVectorsAndClusters();
    return true;
  }

  // ================= CANONICAL IMPORT & VALIDATION =================

  importCanonicalFragrance(payload: CanonicalFragranceImport): {
    action: 'inserted' | 'updated' | 'skipped';
    fragrance?: Fragrance & { vector: number[] };
    reason?: string;
    validation: CanonicalImportValidationResult;
  } {
    if (!this.db) throw new Error('Database not initialized');

    // 1. Strict validation
    const validation = validateCanonicalImport(payload);
    if (!validation.valid) {
      throw new Error(`Canonical validation failed: ${validation.errors.join(', ')}`);
    }

    // 2. Conflict & Deduplication check
    const resolution = resolveImportConflict(payload, this.fragrancesCache);
    if (resolution.action === 'skip') {
      return {
        action: 'skipped',
        fragrance: resolution.existingFragrance ? this.getFragranceById(resolution.existingFragrance.id) : undefined,
        reason: resolution.reason,
        validation
      };
    }

    // 3. Ensure Brand exists or create
    const brandName = payload.identity.brand_name.trim();
    let brand = this.brandsCache.find(b => b.name.toLowerCase() === brandName.toLowerCase());
    if (!brand) {
      let brandManifestInfo: any = null;
      try {
        const brandManifestPath = path.join(process.cwd(), 'data/india_brand_manifest.json');
        if (fs.existsSync(brandManifestPath)) {
          const manifestBrands = JSON.parse(fs.readFileSync(brandManifestPath, 'utf8'));
          brandManifestInfo = manifestBrands.find((mb: any) => mb.brand_name?.toLowerCase() === brandName.toLowerCase());
        }
      } catch (e) {
        // ignore
      }

      brand = this.createBrand({
        name: brandName,
        country: brandManifestInfo?.country || payload.identity.brand_country || 'India',
        brand_type: brandManifestInfo?.category_description || payload.identity.brand_type || 'Contemporary Indian Lifestyle',
        category: brandManifestInfo?.category_description || 'Contemporary Indian brand inspired by fine perfumery',
        origin_style: payload.heritage?.origin_style || 'French-Indian Contemporary Fine Perfumery',
        description: brandManifestInfo?.craftsmanship_focus || '',
        founded_year: brandManifestInfo?.founding_year || undefined,
        website: brandManifestInfo?.tier_1_url || undefined,
        city: brandManifestInfo?.city || undefined
      });
    }

    // 4. Map canonical payload to Fragrance schema
    const topNotes = payload.scent_structure.top_notes || [];
    const middleNotes = payload.scent_structure.middle_notes || [];
    const baseNotes = payload.scent_structure.base_notes || [];
    const notesGeneral = (payload.scent_structure as any).notes_general || [];
    const accords = payload.scent_structure.accords || [];
    const seasons = payload.context?.seasons || ['Spring', 'Summer', 'Monsoon', 'Winter'];
    const occasions = payload.context?.occasions || ['Office', 'Casual', 'Evening'];
    const timeOfDay = payload.context?.time_of_day || [];
    const heritageMaterials = payload.heritage?.heritage_materials || [];

    const isOilBased = payload.identity.is_oil_based !== undefined
      ? payload.identity.is_oil_based
      : Boolean(
          payload.identity.format?.toLowerCase().includes('oil') ||
          payload.identity.format?.toLowerCase().includes('attar') ||
          payload.identity.concentration?.toLowerCase().includes('oil') ||
          payload.identity.concentration?.toLowerCase().includes('attar')
        );

    const sourceUrl = payload.provenance?.source_url || (payload.provenance as any)?.sources?.[0]?.url || null;

    const fragranceData: Partial<Fragrance> = {
      brand_id: brand.id,
      brand_name: brand.name,
      name: payload.identity.name.trim(),
      collection: payload.identity.collection || 'Core Collection',
      gender: payload.identity.gender || 'unisex',
      concentration: payload.identity.concentration || 'Attar / Perfume Oil (100%)',
      format: (payload.identity.format as any) || 'Attar',
      is_oil_based: isOilBased,
      volume_ml: payload.identity.volume_ml ?? null,
      price_inr: payload.identity.price_inr ?? null,
      currency: payload.identity.currency || 'INR',
      description: payload.identity.description || '',
      fragrance_family: payload.scent_structure.fragrance_family,
      top_notes: topNotes,
      middle_notes: middleNotes,
      base_notes: baseNotes,
      accords: accords,
      projection: payload.performance?.projection || null,
      season: seasons,
      occasion: occasions,
      time_of_day: timeOfDay,
      intensity: payload.performance?.intensity ?? 7,
      sweetness: payload.performance?.sweetness ?? 5,
      freshness: payload.performance?.freshness ?? 5,
      longevity: payload.performance?.longevity || '8-12 hrs',
      origin_style: payload.heritage?.origin_style || 'Traditional Indian / Attar',
      heritage_materials: heritageMaterials,
      distillation_method: payload.heritage?.distillation_method || null,
      heritage_relationship: payload.heritage?.heritage_relationship || null,
      source: payload.provenance?.source || 'canonical_import',
      source_url: sourceUrl,
      source_date: payload.provenance?.source_date || new Date().toISOString().split('T')[0],
      last_verified: payload.provenance?.last_verified || new Date().toISOString().split('T')[0],
      data_confidence: payload.provenance?.data_confidence ?? 0.95,
      status: payload.provenance?.status || 'verified',
      active: true,
      product_category: 'fine_perfume'
    };
    (fragranceData as any).notes_general = notesGeneral;

    if (resolution.action === 'update' && resolution.existingFragrance) {
      const updated = this.updateFragrance(resolution.existingFragrance.id, fragranceData);
      return {
        action: 'updated',
        fragrance: updated,
        reason: resolution.reason,
        validation
      };
    } else {
      const created = this.createFragrance(fragranceData);
      return {
        action: 'inserted',
        fragrance: created,
        reason: resolution.reason,
        validation
      };
    }
  }

  getFragranceNotesCount(): number {
    if (!this.db) return 0;
    const res = this.db.exec(`SELECT COUNT(*) as count FROM fragrance_notes`);
    if (res.length > 0 && res[0].values.length > 0) {
      return Number(res[0].values[0][0]);
    }
    return 0;
  }

  getNotesWithoutFragrance(): any[] {
    if (!this.db) return [];
    const res = this.db.exec(`
      SELECT fn.* FROM fragrance_notes fn
      LEFT JOIN fragrances f ON fn.fragrance_id = f.id
      WHERE f.id IS NULL
    `);
    if (res.length > 0 && res[0].values.length > 0) {
      return res[0].values;
    }
    return [];
  }

  findFragranceByNameAndBrand(name: string, brandName: string): Fragrance | undefined {
    const cleanName = name.toLowerCase().trim();
    const cleanBrand = brandName.toLowerCase().trim();
    return this.fragrancesCache.find(
      f => f.name.toLowerCase().trim() === cleanName && (f.brand_name || f.brand || '').toLowerCase().trim() === cleanBrand
    );
  }

  findBrandByName(name: string): Brand | undefined {
    const clean = name.toLowerCase().trim();
    return this.brandsCache.find(b => b.name.toLowerCase().trim() === clean);
  }

  // ================= OLFACTORY BEHAVIOR EVENTS (STEP 6D) =================

  recordBehaviorEvent(event: OlfactoryBehaviorEvent): { inserted: boolean; duplicate: boolean } {
    if (!this.db) throw new Error('Database not initialized');
    if (!event.id || !event.eventType || !event.source) {
      throw new Error('Event must contain id, eventType, and source');
    }

    // Check idempotency: does event.id already exist?
    const checkRes = this.db.exec(`SELECT id FROM olfactory_behavior_events WHERE id = ?`, [event.id]);
    if (checkRes.length > 0 && checkRes[0].values.length > 0) {
      return { inserted: false, duplicate: true };
    }

    const contextJson = event.contextSnapshot ? JSON.stringify(event.contextSnapshot) : null;
    const metadataJson = event.metadata ? JSON.stringify(event.metadata) : null;
    const createdAt = event.timestamp || new Date().toISOString();

    this.db.run(
      `INSERT INTO olfactory_behavior_events (
        id, user_id, event_type, fragrance_id, source, context_json, metadata_json, session_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.id,
        event.userId || 1,
        event.eventType,
        event.fragranceId ?? null,
        event.source,
        contextJson,
        metadataJson,
        event.sessionId || null,
        createdAt
      ]
    );

    this.saveToFile();
    return { inserted: true, duplicate: false };
  }

  recordBehaviorEventsBatch(events: OlfactoryBehaviorEvent[]): { count: number; inserted: number; duplicates: number } {
    if (!this.db) throw new Error('Database not initialized');
    let inserted = 0;
    let duplicates = 0;

    for (const ev of events) {
      const res = this.recordBehaviorEvent(ev);
      if (res.inserted) inserted++;
      if (res.duplicate) duplicates++;
    }

    return { count: events.length, inserted, duplicates };
  }

  getBehaviorEvents(
    userId: number = 1,
    options: {
      limit?: number;
      offset?: number;
      eventType?: string;
      source?: string;
      fragranceId?: number;
    } = {}
  ): { events: OlfactoryBehaviorEvent[]; total: number } {
    if (!this.db) return { events: [], total: 0 };

    const limit = Math.min(Math.max(1, options.limit || 50), 200);
    const offset = Math.max(0, options.offset || 0);

    const whereClauses: string[] = ['user_id = ?'];
    const params: any[] = [userId];

    if (options.eventType) {
      whereClauses.push('event_type = ?');
      params.push(options.eventType);
    }
    if (options.source) {
      whereClauses.push('source = ?');
      params.push(options.source);
    }
    if (options.fragranceId !== undefined && options.fragranceId !== null) {
      whereClauses.push('fragrance_id = ?');
      params.push(options.fragranceId);
    }

    const whereSql = whereClauses.join(' AND ');

    // Total count
    const countRes = this.db.exec(`SELECT COUNT(*) FROM olfactory_behavior_events WHERE ${whereSql}`, params);
    const total = countRes.length > 0 && countRes[0].values.length > 0 ? Number(countRes[0].values[0][0]) : 0;

    // Paginated results
    const querySql = `
      SELECT id, user_id, event_type, fragrance_id, source, context_json, metadata_json, session_id, created_at
      FROM olfactory_behavior_events
      WHERE ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const rowsRes = this.db.exec(querySql, [...params, limit, offset]);

    if (!rowsRes[0] || rowsRes[0].values.length === 0) {
      return { events: [], total };
    }

    const cols = rowsRes[0].columns;
    const events: OlfactoryBehaviorEvent[] = rowsRes[0].values.map(val => {
      const obj: any = {};
      cols.forEach((col, idx) => { obj[col] = val[idx]; });
      return {
        id: obj.id,
        userId: obj.user_id,
        eventType: obj.event_type,
        fragranceId: obj.fragrance_id ?? null,
        source: obj.source,
        contextSnapshot: obj.context_json ? JSON.parse(obj.context_json) : null,
        metadata: obj.metadata_json ? JSON.parse(obj.metadata_json) : null,
        sessionId: obj.session_id ?? null,
        timestamp: obj.created_at
      };
    });

    return { events, total };
  }

  getAllBehaviorEventsForAggregation(userId: number = 1, limit: number = 1000): OlfactoryBehaviorEvent[] {
    if (!this.db) return [];
    const querySql = `
      SELECT id, user_id, event_type, fragrance_id, source, context_json, metadata_json, session_id, created_at
      FROM olfactory_behavior_events
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const rowsRes = this.db.exec(querySql, [userId, limit]);
    if (!rowsRes[0] || rowsRes[0].values.length === 0) return [];

    const cols = rowsRes[0].columns;
    return rowsRes[0].values.map(val => {
      const obj: any = {};
      cols.forEach((col, idx) => { obj[col] = val[idx]; });
      return {
        id: obj.id,
        userId: obj.user_id,
        eventType: obj.event_type,
        fragranceId: obj.fragrance_id ?? null,
        source: obj.source,
        contextSnapshot: obj.context_json ? JSON.parse(obj.context_json) : null,
        metadata: obj.metadata_json ? JSON.parse(obj.metadata_json) : null,
        sessionId: obj.session_id ?? null,
        timestamp: obj.created_at
      };
    });
  }

  getFragranceBehaviorSummary(fragranceId: number, userId: number = 1): FragranceBehaviorSummary | null {
    if (!this.db) return null;
    const fragrance = this.getFragranceById(fragranceId);
    if (!fragrance) return null;

    const ownedIds = this.getUserCollection(userId);
    const isOwned = ownedIds.includes(fragranceId);

    const evRes = this.db.exec(`
      SELECT event_type, metadata_json, created_at
      FROM olfactory_behavior_events
      WHERE user_id = ? AND fragrance_id = ?
      ORDER BY created_at DESC
    `, [userId, fragranceId]);

    let views = 0;
    let opens = 0;
    let saves = 0;
    let wears = 0;
    let sotdCount = 0;
    let ratingsCount = 0;
    let ratingSum = 0;
    let lastInteracted = fragrance.last_verified || new Date().toISOString();

    if (evRes[0] && evRes[0].values.length > 0) {
      lastInteracted = String(evRes[0].values[0][2]);
      for (const row of evRes[0].values) {
        const type = String(row[0]);
        const metaStr = row[1] ? String(row[1]) : null;
        if (type === 'FRAGRANCE_VIEWED') views++;
        else if (type === 'RECOMMENDATION_OPENED') opens++;
        else if (type === 'RECOMMENDATION_SAVED' || type === 'FRAGRANCE_ADDED_TO_WARDROBE') saves++;
        else if (type === 'FRAGRANCE_WORN') wears++;
        else if (type === 'SOTD_SELECTED') { sotdCount++; wears++; }
        else if (type === 'FRAGRANCE_RATED') {
          ratingsCount++;
          if (metaStr) {
            try {
              const meta = JSON.parse(metaStr);
              if (typeof meta.rating === 'number') ratingSum += meta.rating;
            } catch {}
          }
        }
      }
    }

    return {
      fragranceId,
      fragranceName: fragrance.name,
      brandName: fragrance.brand_name || fragrance.brand || 'Unknown',
      fragranceFamily: fragrance.fragrance_family,
      views,
      opens,
      saves,
      wears,
      ratingsCount,
      averageRating: ratingsCount > 0 ? parseFloat((ratingSum / ratingsCount).toFixed(1)) : undefined,
      sotdCount,
      isOwned,
      lastInteracted,
      observedVector: fragrance.vector
    };
  }

  clearBehaviorHistory(userId: number = 1): { deletedCount: number } {
    if (!this.db) return { deletedCount: 0 };
    const countRes = this.db.exec(`SELECT COUNT(*) FROM olfactory_behavior_events WHERE user_id = ?`, [userId]);
    const count = countRes.length > 0 && countRes[0].values.length > 0 ? Number(countRes[0].values[0][0]) : 0;

    this.db.run(`DELETE FROM olfactory_behavior_events WHERE user_id = ?`, [userId]);
    this.saveToFile();

    return { deletedCount: count };
  }
}

export const dbService = new FragranceDatabase();
