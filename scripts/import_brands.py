#!/usr/bin/env python3
"""
Data ingestion pipeline script for Fragrance Layering AI.
Loads brand-agnostic data from data/brands.json, data/notes_taxonomy.json, and data/fragrances.json,
normalizes and validates records, and populates the SQLite database.
"""

import json
import os
import sqlite3
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "fragrances.db")
BRANDS_PATH = os.path.join(BASE_DIR, "data", "brands.json")
TAXONOMY_PATH = os.path.join(BASE_DIR, "data", "notes_taxonomy.json")
FRAGRANCES_PATH = os.path.join(BASE_DIR, "data", "fragrances.json")

def initialize_database(conn):
    cursor = conn.cursor()
    
    # Check if existing schema needs upgrade
    try:
        cursor.execute("PRAGMA table_info(brands);")
        cols = [r[1] for r in cursor.fetchall()]
        if cols and "category" not in cols:
            print("Upgrading database schema for Indian fragrance categories & provenance...")
            cursor.execute("DROP TABLE IF EXISTS fragrance_notes;")
            cursor.execute("DROP TABLE IF EXISTS fragrances;")
            cursor.execute("DROP TABLE IF EXISTS note_taxonomy;")
            cursor.execute("DROP TABLE IF EXISTS brands;")
            conn.commit()
    except Exception as e:
        pass

    # 1. Brands table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    """)

    # 2. Note Taxonomy table
    cursor.execute("""
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
    """)

    # 3. Fragrances table (supporting hierarchy, origin, format, price, and ML cluster)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fragrances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_id INTEGER NOT NULL,
        brand_name TEXT NOT NULL,
        name TEXT NOT NULL,
        format TEXT NOT NULL,
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
        data_confidence REAL DEFAULT 0.95,
        cluster_id INTEGER,
        cluster_label TEXT,
        FOREIGN KEY (brand_id) REFERENCES brands (id)
    );
    """)

    # 4. Fragrance Notes join table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS fragrance_notes (
        fragrance_id INTEGER NOT NULL,
        raw_note TEXT NOT NULL,
        normalized_name TEXT,
        note_type TEXT NOT NULL, -- 'top', 'middle', 'base'
        PRIMARY KEY (fragrance_id, raw_note, note_type),
        FOREIGN KEY (fragrance_id) REFERENCES fragrances (id)
    );
    """)

    # 5. Supporting user & interaction tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
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
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER DEFAULT 1,
        fragrance_a_id INTEGER NOT NULL,
        fragrance_b_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        feedback_tag TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
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
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_collection (
        user_id INTEGER DEFAULT 1,
        fragrance_id INTEGER NOT NULL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, fragrance_id)
    );
    """)

    conn.commit()
    print("Database schema verified.")

def import_brands(conn):
    if not os.path.exists(BRANDS_PATH):
        print(f"Brands file not found: {BRANDS_PATH}")
        return {}

    with open(BRANDS_PATH, "r", encoding="utf-8") as f:
        brands = json.load(f)

    cursor = conn.cursor()
    brand_map = {}
    for b in brands:
        cursor.execute("""
        INSERT INTO brands (id, name, country, brand_type, category, origin_style, description, founded_year, website, city)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(name) DO UPDATE SET
            country=excluded.country,
            brand_type=excluded.brand_type,
            category=excluded.category,
            origin_style=excluded.origin_style,
            description=excluded.description,
            founded_year=excluded.founded_year,
            website=excluded.website,
            city=excluded.city
        """, (
            b.get("id"),
            b["name"],
            b["country"],
            b["brand_type"],
            b.get("category", "Designer / mass Indian"),
            b["origin_style"],
            b.get("description"),
            b.get("founded_year"),
            b.get("website"),
            b.get("city")
        ))
        brand_map[b["name"].lower()] = b.get("id")

    conn.commit()
    print(f"Imported/Updated {len(brands)} brands.")
    return brand_map

def import_taxonomy(conn):
    if not os.path.exists(TAXONOMY_PATH):
        print(f"Taxonomy file not found: {TAXONOMY_PATH}")
        return {}

    with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
        taxa = json.load(f)

    cursor = conn.cursor()
    taxonomy_lookup = {}
    for t in taxa:
        cursor.execute("""
        INSERT INTO note_taxonomy (raw_term, original_note, normalized_name, note_family, category, origin, english_equivalent, cultural_context)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(raw_term) DO UPDATE SET
            original_note=excluded.original_note,
            normalized_name=excluded.normalized_name,
            note_family=excluded.note_family,
            category=excluded.category,
            origin=excluded.origin,
            english_equivalent=excluded.english_equivalent,
            cultural_context=excluded.cultural_context
        """, (
            t["raw_term"].lower().strip(),
            t.get("original_note", t["normalized_name"]),
            t["normalized_name"],
            t.get("note_family", "Aromatic"),
            t["category"],
            t.get("origin", "Both"),
            t.get("english_equivalent"),
            t.get("cultural_context")
        ))
        taxonomy_lookup[t["raw_term"].lower().strip()] = t["normalized_name"]

    conn.commit()
    print(f"Imported/Updated {len(taxa)} taxonomy terms.")
    return taxonomy_lookup

def map_note_name(raw_note, taxonomy_lookup):
    cleaned = raw_note.lower().strip()
    for term, norm in taxonomy_lookup.items():
        if term in cleaned:
            return norm
    return raw_note

def import_fragrances(conn, brand_map, taxonomy_lookup):
    if not os.path.exists(FRAGRANCES_PATH):
        print(f"Fragrances file not found: {FRAGRANCES_PATH}")
        return

    with open(FRAGRANCES_PATH, "r", encoding="utf-8") as f:
        fragrances = json.load(f)

    cursor = conn.cursor()
    cursor.execute("DELETE FROM fragrance_notes")
    cursor.execute("DELETE FROM fragrances")

    for frag in fragrances:
        brand_id = frag.get("brand_id")
        if not brand_id and frag.get("brand_name"):
            brand_id = brand_map.get(frag["brand_name"].lower())

        price_min = frag.get("price_min")
        price_max = frag.get("price_max")
        price_inr = frag.get("price_inr") or (int((price_min + (price_max or price_min)) / 2) if price_min else 2500)

        cursor.execute("""
        INSERT INTO fragrances (
            id, brand_id, brand_name, name, format, gender, category, description, origin_style,
            price_min, price_max, price_inr, currency, volume_ml, is_oil_based, fragrance_family,
            top_notes, middle_notes, base_notes, season, occasion, intensity,
            sweetness, freshness, longevity, source, source_url, source_date, data_confidence
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            frag["id"],
            brand_id,
            frag.get("brand_name", "Unknown Brand"),
            frag["name"],
            frag.get("format", "Eau de Parfum"),
            frag.get("gender", "unisex"),
            frag.get("category", "Designer / mass Indian"),
            frag.get("description"),
            frag.get("origin_style", "International / Western"),
            price_min,
            price_max,
            price_inr,
            frag.get("currency", "INR"),
            frag.get("volume_ml"),
            1 if frag.get("is_oil_based") else 0,
            frag["fragrance_family"],
            json.dumps(frag.get("top_notes", [])),
            json.dumps(frag.get("middle_notes", [])),
            json.dumps(frag.get("base_notes", [])),
            json.dumps(frag.get("season", [])),
            json.dumps(frag.get("occasion", [])),
            frag.get("intensity", 6),
            frag.get("sweetness", 5),
            frag.get("freshness", 6),
            frag.get("longevity", "8 hrs"),
            frag.get("source", "curated_catalog"),
            frag.get("source_url"),
            frag.get("source_date", "2025-2026"),
            frag.get("data_confidence", 0.95)
        ))

        # Insert normalized note links
        for note in frag.get("top_notes", []):
            norm = map_note_name(note, taxonomy_lookup)
            cursor.execute("INSERT OR IGNORE INTO fragrance_notes VALUES (?, ?, ?, ?)", (frag["id"], note, norm, "top"))
        for note in frag.get("middle_notes", []):
            norm = map_note_name(note, taxonomy_lookup)
            cursor.execute("INSERT OR IGNORE INTO fragrance_notes VALUES (?, ?, ?, ?)", (frag["id"], note, norm, "middle"))
        for note in frag.get("base_notes", []):
            norm = map_note_name(note, taxonomy_lookup)
            cursor.execute("INSERT OR IGNORE INTO fragrance_notes VALUES (?, ?, ?, ?)", (frag["id"], note, norm, "base"))

    # Add default user and sample collection
    cursor.execute("INSERT OR IGNORE INTO users (id, name, email) VALUES (1, 'Connoisseur', 'user@olfactory.ai')")
    # Seed sample collection: Raw (1), Mysore Sandalwood & Vetiver (6), Chai Musk (23), Mitti Attar (39), Baccarat Rouge 540 (53)
    for fid in [1, 6, 23, 39, 53]:
        cursor.execute("INSERT OR IGNORE INTO user_collection (user_id, fragrance_id) VALUES (1, ?)", (fid,))

    conn.commit()
    print(f"Imported {len(fragrances)} fragrances and mapped olfactory notes.")

def main():
    print("Starting data ingestion into SQLite...")
    conn = sqlite3.connect(DB_PATH)
    try:
        initialize_database(conn)
        brand_map = import_brands(conn)
        taxonomy_lookup = import_taxonomy(conn)
        import_fragrances(conn, brand_map, taxonomy_lookup)
        print("Data ingestion completed successfully!")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
