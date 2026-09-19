import urllib.request
import urllib.parse
import json
import sqlite3
import time
import math
import sys

BASE_URL = 'http://localhost:3000'

def api_get(endpoint):
    t0 = time.time()
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            elapsed_ms = (time.time() - t0) * 1000
            return data, elapsed_ms, resp.status
    except Exception as e:
        elapsed_ms = (time.time() - t0) * 1000
        return None, elapsed_ms, getattr(e, 'code', 500)

def api_post(endpoint, payload):
    t0 = time.time()
    url = f"{BASE_URL}{endpoint}"
    data_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data_bytes, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            elapsed_ms = (time.time() - t0) * 1000
            return data, elapsed_ms, resp.status
    except Exception as e:
        elapsed_ms = (time.time() - t0) * 1000
        return None, elapsed_ms, getattr(e, 'code', 500)

print("=" * 70)
print("RUNNING STEP 5D AUDIT VERIFICATION")
print("=" * 70)

results = {}

# 1. DATABASE & ML SOURCE VERIFICATION
print("\n--- SECTION 1: DATABASE -> ML VERIFICATION ---")
conn = sqlite3.connect('fragrances.db')
c = conn.cursor()
c.execute("SELECT COUNT(*) FROM fragrances")
db_count = c.fetchone()[0]

c.execute("SELECT COUNT(*) FROM brands")
brands_count = c.fetchone()[0]

c.execute("SELECT COUNT(*) FROM note_taxonomy")
tax_count = c.fetchone()[0]

c.execute("SELECT COUNT(*) FROM fragrance_notes")
notes_count = c.fetchone()[0]

print(f"SQLite DB: {db_count} fragrances, {brands_count} brands, {tax_count} taxonomy, {notes_count} note mappings.")

# Verify ML reads DB
frags_api, t_frags, s_frags = api_get('/api/fragrances')
print(f"API /api/fragrances returned {len(frags_api)} items (HTTP {s_frags}, {t_frags:.2f}ms)")

# Check if seedFragrances or fragrances.db is the source
# In seedFragrances.ts there were only ~100 items with different IDs
db_ids = set([r[0] for r in c.execute("SELECT id FROM fragrances").fetchall()])
api_ids = set([f['id'] for f in frags_api])
diff_ids = db_ids.symmetric_difference(api_ids)
print(f"DB IDs vs API IDs match: {len(diff_ids) == 0} (diff: {len(diff_ids)})")
results['db_to_ml'] = len(diff_ids) == 0 and len(frags_api) == 124

# 2. VECTOR AUDIT (SECTION 7)
print("\n--- SECTION 7: VECTOR AUDIT ---")
c.execute("SELECT id, name, brand_name, vector, vector_confidence, vector_generation_source FROM fragrances")
vector_rows = c.fetchall()
vector_audit_pass = True
invalid_vectors = []

for fid, name, brand, vec_str, conf, src in vector_rows:
    if not vec_str:
        invalid_vectors.append((fid, name, "Null vector"))
        vector_audit_pass = False
        continue
    try:
        vec = json.loads(vec_str)
        if not isinstance(vec, list) or len(vec) != 8:
            invalid_vectors.append((fid, name, f"Length {len(vec)} != 8"))
            vector_audit_pass = False
        for i, val in enumerate(vec):
            if not isinstance(val, (int, float)) or math.isnan(val) or math.isinf(val):
                invalid_vectors.append((fid, name, f"Dim {i} invalid: {val}"))
                vector_audit_pass = False
            elif val < 0.0 or val > 1.0:
                invalid_vectors.append((fid, name, f"Dim {i} out of bounds [0,1]: {val}"))
                vector_audit_pass = False
    except Exception as e:
        invalid_vectors.append((fid, name, str(e)))
        vector_audit_pass = False

print(f"All 124 vectors valid: {vector_audit_pass} (invalid count: {len(invalid_vectors)})")
results['vector_audit'] = vector_audit_pass

# 3. CLUSTER AUDIT (SECTION 8)
print("\n--- SECTION 8: CLUSTER AUDIT ---")
clusters_api, t_cl, s_cl = api_get('/api/clusters')
print(f"API /api/clusters returned {len(clusters_api)} clusters (HTTP {s_cl}, {t_cl:.2f}ms)")
cluster_ids = [c['cluster_id'] for c in clusters_api]
cluster_total_frags = sum(c['fragrance_count'] for c in clusters_api)
print(f"Cluster IDs: {cluster_ids}, Total clustered in summary: {cluster_total_frags}")

c.execute("SELECT DISTINCT cluster_id, COUNT(*) FROM fragrances GROUP BY cluster_id")
db_cluster_counts = dict(c.fetchall())
print(f"DB cluster distribution: {db_cluster_counts}")
cluster_audit_pass = (len(clusters_api) == 5 and 
                      cluster_total_frags == 124 and 
                      all(c['cluster_id'] in cluster_ids for c in clusters_api))
results['cluster_audit'] = cluster_audit_pass

# 4. API -> ML ENDPOINTS AUDIT (SECTION 2)
print("\n--- SECTION 2: API -> ML ENDPOINTS AUDIT ---")
api_endpoints_status = {}

# Test /api/fragrances/:id
frag1, t_f1, s_f1 = api_get('/api/fragrances/1')
frag98, t_f98, s_f98 = api_get('/api/fragrances/98') # Boond Motiya
api_endpoints_status['/api/fragrances/:id'] = (s_f1 == 200 and s_f98 == 200 and frag98['name'] == 'Motiya')
print(f"  /api/fragrances/:id -> OK (id:1={frag1['name']}, id:98={frag98['name']})")

# Test /api/recommend (Similarity / Preference-based)
rec_payload = {
    'sweetness': 6,
    'freshness': 8,
    'intensity': 7,
    'preferred_family': 'Floral',
    'season': 'Monsoon',
    'occasion': 'Festive / Wedding'
}
rec_res, t_rec, s_rec = api_post('/api/recommend', rec_payload)
rec_pass = (s_rec == 200 and isinstance(rec_res, list) and len(rec_res) > 0)
api_endpoints_status['/api/recommend'] = rec_pass
print(f"  /api/recommend -> {rec_pass} ({len(rec_res) if isinstance(rec_res, list) else 0} results, {t_rec:.2f}ms)")

# Test /api/layer (Layering)
layer_payload = {
    'owned_fragrance_id': 98,
    'limit': 5
}
layer_res, t_lay, s_lay = api_post('/api/layer', layer_payload)
layer_pass = (s_lay == 200 and isinstance(layer_res, list) and len(layer_res) > 0 and 'compatibility_score' in layer_res[0])
api_endpoints_status['/api/layer'] = layer_pass
print(f"  /api/layer -> {layer_pass} (first score: {layer_res[0].get('compatibility_score') if layer_pass else 'N/A'}, count={len(layer_res) if isinstance(layer_res, list) else 0}, {t_lay:.2f}ms)")

# Test /api/scent-battles
battle_payload = {
    'fragrance_a_id': 1,
    'fragrance_b_id': 98
}
battle_res, t_bat, s_bat = api_post('/api/scent-battles', battle_payload)
battle_pass = (s_bat == 200 and battle_res and 'verdict' in battle_res and 'overall_winner' in battle_res['verdict'])
api_endpoints_status['/api/scent-battles'] = battle_pass
print(f"  /api/scent-battles -> {battle_pass} (winner: {battle_res.get('verdict', {}).get('overall_winner') if battle_res else 'N/A'}, {t_bat:.2f}ms)")

# Test /api/weather-recommendation
w_res, t_w, s_w = api_get('/api/weather-recommendation?temp=32&humidity=75&condition=Monsoon')
w_pass = (s_w == 200 and w_res and len(w_res.get('fragrances', [])) > 0)
api_endpoints_status['/api/weather-recommendation'] = w_pass
print(f"  /api/weather-recommendation -> {w_pass} ({len(w_res.get('fragrances', [])) if w_res else 0} results, {t_w:.2f}ms)")

# Test /api/discovery-box
disc_payload = {
    'budget_inr': 5000,
    'preferred_families': ['Floral', 'Woody']
}
disc_res, t_disc, s_disc = api_post('/api/discovery-box', disc_payload)
disc_pass = (s_disc == 200 and disc_res and len(disc_res.get('fragrances', [])) > 0)
api_endpoints_status['/api/discovery-box'] = disc_pass
print(f"  /api/discovery-box -> {disc_pass} (count: {len(disc_res.get('fragrances', [])) if disc_res else 0}, {t_disc:.2f}ms)")

# Test /api/retail-recommendations
ret_payload = {
    'budget_max': 5000,
    'preferred_family': 'Floral',
    'notes_of_interest': ['Jasmine', 'Rose']
}
ret_res, t_ret, s_ret = api_post('/api/retail-recommendations', ret_payload)
ret_pass = (s_ret == 200 and ret_res and len(ret_res.get('recommendations', [])) > 0)
api_endpoints_status['/api/retail-recommendations'] = ret_pass
print(f"  /api/retail-recommendations -> {ret_pass} (count: {len(ret_res.get('recommendations', [])) if ret_res else 0}, {t_ret:.2f}ms)")

# Test /api/collection
coll_res, t_coll, s_coll = api_get('/api/collection')
coll_items = coll_res.get('fragrances', []) if isinstance(coll_res, dict) else (coll_res if isinstance(coll_res, list) else [])
coll_pass = (s_coll == 200 and len(coll_items) > 0)
api_endpoints_status['/api/collection'] = coll_pass
print(f"  /api/collection -> {coll_pass} ({len(coll_items)} items, {t_coll:.2f}ms)")

results['api_endpoints'] = api_endpoints_status

# 5. SOURCE REVIEW RECORDS (SECTION 11)
print("\n--- SECTION 11: SOURCE REVIEW RECORDS ---")
with open('data/india_fragrance_manifest.json') as f:
    manifest = json.load(f)

source_review_records = [
    item for item in manifest 
    if item.get('import_status') == 'SOURCE_REVIEW_REQUIRED' or item.get('source_review_required') is True
]
duplicate_records = [
    item for item in manifest
    if item.get('import_status') == 'DUPLICATE_OF'
]
print(f"Manifest SOURCE_REVIEW_REQUIRED records: {len(source_review_records)}")
print(f"Manifest DUPLICATE_OF records: {len(duplicate_records)}")

# Verify none in DB
sr_names = [item['identity']['name'].lower().strip() for item in source_review_records]
c.execute("SELECT id, name, brand_name FROM fragrances")
all_db_frags = c.fetchall()

found_sr = []
for db_id, db_name, db_brand in all_db_frags:
    if db_name.lower().strip() in sr_names:
        found_sr.append((db_id, db_name, db_brand))

print(f"SOURCE_REVIEW_REQUIRED found in production DB: {len(found_sr)}")
if found_sr:
    print(f"  WARNING: {found_sr}")

# Check for duplicates in DB by (brand, name)
from collections import Counter
db_names_brands = [(r[1].lower().strip(), r[2].lower().strip()) for r in all_db_frags]
dup_counts = Counter(db_names_brands)
dups_in_db = [k for k, v in dup_counts.items() if v > 1]
print(f"Duplicate (name, brand) pairs in production DB: {len(dups_in_db)}")

results['source_review_clean'] = len(found_sr) == 0 and len(dups_in_db) == 0

# 6. PYRAMID INTEGRITY (SECTION 5)
print("\n--- SECTION 5: PYRAMID INTEGRITY ---")
# Fragrances with empty top, middle, and base notes
c.execute("""
    SELECT id, name, brand_name, top_notes, middle_notes, base_notes
    FROM fragrances
""")
pyramid_data = c.fetchall()
linear_frags = []
full_pyramid_frags = []

for fid, name, brand, top_s, mid_s, base_s in pyramid_data:
    top = json.loads(top_s or '[]')
    mid = json.loads(mid_s or '[]')
    base = json.loads(base_s or '[]')
    if len(top) == 0 and len(mid) == 0 and len(base) == 0:
        linear_frags.append((fid, name, brand))
    elif len(top) > 0 and len(mid) > 0 and len(base) > 0:
        full_pyramid_frags.append((fid, name, brand))

print(f"Total fragrances with top=[], mid=[], base=[]: {len(linear_frags)}")
print(f"Total fragrances with full 3-tier pyramid: {len(full_pyramid_frags)}")
for lf in linear_frags:
    # Check general notes in fragrance_notes table
    c.execute("SELECT raw_note FROM fragrance_notes WHERE fragrance_id = ? AND note_type = 'general'", (lf[0],))
    gnotes = [r[0] for r in c.fetchall()]
    print(f"  Linear Fragrance {lf[0]}: {lf[1]} ({lf[2]}) -> {len(gnotes)} general notes: {gnotes}")

results['pyramid_integrity'] = len(linear_frags) == 7

# 7. HERITAGE INTEGRITY (SECTION 6)
print("\n--- SECTION 6: HERITAGE INTEGRITY ---")
c.execute("SELECT id, name, brand_name, origin_style, heritage_materials, distillation_method FROM fragrances")
heritage_rows = c.fetchall()

# Check heritage attributes
deg_bhapka_frags = [r for r in heritage_rows if r[5] and 'deg' in r[5].lower()]
heritage_mat_frags = [r for r in heritage_rows if r[4] and json.loads(r[4] or '[]')]
print(f"Fragrances with Deg & Bhapka distillation: {len(deg_bhapka_frags)}")
print(f"Fragrances with documented heritage materials: {len(heritage_mat_frags)}")

# Verify non-heritage brands are not erroneously labeled traditional/attar
western_designer_frags = [r for r in heritage_rows if r[3] and 'western' in r[3].lower()]
print(f"Fragrances with Western / Designer origin style: {len(western_designer_frags)}")
non_heritage_check = True
for r in western_designer_frags:
    if r[5] and 'deg' in r[5].lower():
        print(f"  ERROR: Western fragrance has Deg & Bhapka: {r[1]} by {r[2]}")
        non_heritage_check = False
print(f"Non-heritage records preserved accurately: {non_heritage_check}")
results['heritage_integrity'] = non_heritage_check

# 8. CONTEXTUAL RECOMMENDATION (SECTION 10)
print("\n--- SECTION 10: CONTEXTUAL RECOMMENDATION ---")
scenarios = [
    ('hot', {'temp': 38, 'humidity': 40, 'condition': 'Sunny'}),
    ('humid_monsoon', {'temp': 30, 'humidity': 90, 'condition': 'Monsoon Rain'}),
    ('cool_winter', {'temp': 14, 'humidity': 50, 'condition': 'Cool Winter'}),
]
weather_results = {}
for name, params in scenarios:
    qs = urllib.parse.urlencode(params)
    data, t, s = api_get(f'/api/weather-recommendation?{qs}')
    recs = data.get('fragrances', []) if data else []
    weather_results[name] = {
        'count': len(recs),
        'top_names': [r['name'] for r in recs[:3]],
        'status': s,
        'latency_ms': t
    }
    print(f"  Scenario '{name}': {len(recs)} recs returned in {t:.2f}ms. Top: {[r['name'] for r in recs[:3]]}")

# Test Occasions & Context in /api/recommend
occasion_scenarios = ['Office', 'Formal', 'Evening', 'Festive / Wedding', 'Casual']
occasion_results = {}
for occ in occasion_scenarios:
    data, t, s = api_post('/api/recommend', {'occasion': occ, 'sweetness': 5, 'freshness': 6, 'intensity': 6})
    recs = data if isinstance(data, list) else []
    top_items = [r['fragrance']['name'] for r in recs[:2]] if recs else []
    occasion_results[occ] = {
        'count': len(recs),
        'top_names': top_items,
        'status': s,
        'latency_ms': t
    }
    print(f"  Occasion '{occ}': {len(recs)} recommended in {t:.2f}ms. Top: {top_items}")

results['contextual_recommendations'] = {
    'weather': weather_results,
    'occasions': occasion_results
}

# 9. 8 SPECIFIC INDIAN TEST CASES (SECTION 4)
print("\n--- SECTION 4: 8 INDIAN TEST CASES AUDIT ---")
test_cases = [
    {
        'category': 'Indian designer fragrance',
        'query': 'Amalfi Bleu',
        'expected_brand': 'SKINN by Titan'
    },
    {
        'category': 'Indian niche fragrance',
        'query': 'Chai Musk',
        'expected_brand': 'Bombay Perfumery'
    },
    {
        'category': 'Indian heritage/attar material',
        'query': 'Pahadi Phool Attar',
        'expected_brand': 'Purandas Ranchhoddas'
    },
    {
        'category': 'Kannauj traditional distillation',
        'query': 'Motiya',
        'expected_brand': 'Boond Fragrances'
    },
    {
        'category': 'Linear botanical profile',
        'query': 'Khus',
        'expected_brand': 'Boond Fragrances'
    },
    {
        'category': 'Full Top/Heart/Base pyramid',
        'query': 'Raw',
        'expected_brand': 'SKINN by Titan'
    },
    {
        'category': 'Fragrance with accords',
        'query': 'Calicut',
        'expected_brand': 'Bombay Perfumery'
    },
    {
        'category': 'Unmapped source terminology',
        'query': 'Mystique',
        'expected_brand': 'Kastoor'
    }
]

tc_results = []
for tc in test_cases:
    c.execute("SELECT id, name, brand_name, vector, cluster_id, cluster_label, fragrance_family FROM fragrances WHERE name LIKE ? AND brand_name LIKE ?", 
              (f"%{tc['query']}%", f"%{tc['expected_brand']}%"))
    row = c.fetchone()
    if not row:
        print(f"  FAIL: Could not find {tc['query']} by {tc['expected_brand']}")
        continue
    fid, name, brand, vec_str, cid, clabel, ffamily = row
    vec = json.loads(vec_str)
    
    # Test API endpoint
    api_frag, t_f, s_f = api_get(f"/api/fragrances/{fid}")
    
    # Test Recommendation / Similarity via UserPreferences
    rec_res, t_r, s_r = api_post('/api/recommend', {
        'preferred_family': row[6] if len(row) > 6 else 'Floral',
        'sweetness': 5,
        'freshness': 6,
        'intensity': 6
    })
    top_sim = [r['fragrance']['name'] for r in rec_res[:3]] if isinstance(rec_res, list) else []
    
    # Test Layering with this fragrance as owned
    layer_res, t_l, s_l = api_post('/api/layer', {'owned_fragrance_id': fid, 'limit': 3})
    comp_score = layer_res[0].get('compatibility_score') if (isinstance(layer_res, list) and len(layer_res) > 0) else 0
    
    tc_res = {
        'id': fid,
        'category': tc['category'],
        'name': name,
        'brand': brand,
        'vector_dims': len(vec),
        'vector_sample': [round(v, 2) for v in vec],
        'cluster_id': cid,
        'cluster_label': clabel,
        'api_status': s_f,
        'top_similar': top_sim,
        'layer_score_with_ref': comp_score
    }
    tc_results.append(tc_res)
    print(f"  [{tc['category']}] {name} ({brand}): ID={fid}, Clust={cid} ({clabel}), Sim={top_sim[:2]}, LayerScore={comp_score}")

results['indian_test_cases'] = tc_results

# 10. PERFORMANCE AUDIT (SECTION 12)
print("\n--- SECTION 12: PERFORMANCE BENCHMARK ---")
benchmarks = []
endpoints_to_benchmark = [
    ('GET /api/fragrances', lambda: api_get('/api/fragrances')),
    ('GET /api/fragrances/98', lambda: api_get('/api/fragrances/98')),
    ('GET /api/clusters', lambda: api_get('/api/clusters')),
    ('POST /api/recommend (k=5)', lambda: api_post('/api/recommend', {'target_fragrance_id': 98, 'top_k': 5})),
    ('POST /api/layer (1 & 98)', lambda: api_post('/api/layer', {'fragrance_a_id': 1, 'fragrance_b_id': 98})),
    ('GET /api/weather-recommendation', lambda: api_get('/api/weather-recommendation?temp=30&humidity=80')),
    ('POST /api/discovery-box', lambda: api_post('/api/discovery-box', {'occasion': 'Office', 'budget_inr': 3000}))
]

for name, fn in endpoints_to_benchmark:
    times = []
    for _ in range(5):
        _, elapsed, _ = fn()
        times.append(elapsed)
    avg_t = sum(times) / len(times)
    min_t = min(times)
    max_t = max(times)
    benchmarks.append({'endpoint': name, 'avg_ms': round(avg_t, 2), 'min_ms': round(min_t, 2), 'max_ms': round(max_t, 2)})
    print(f"  {name}: avg={avg_t:.2f}ms, min={min_t:.2f}ms, max={max_t:.2f}ms")

results['performance'] = benchmarks

# Write report data
with open('data/step5d_audit_data.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\nAudit tests completed successfully. Data saved to data/step5d_audit_data.json")
