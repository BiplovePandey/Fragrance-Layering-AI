import urllib.request
import urllib.error
import json
import time
import sqlite3

BASE_URL = "http://localhost:3000"

def post_json(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    req_body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=req_body,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            return status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        return e.code, json.loads(body) if body else {}

def test_endpoint():
    print("=" * 60)
    print("RUNNING STEP 6B WEAR RECOMMENDATION ENGINE AUDIT")
    print("=" * 60)

    # Database Pre-check
    conn = sqlite3.connect("fragrances.db")
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM fragrances")
    f_count_pre = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM brands")
    b_count_pre = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM note_taxonomy")
    t_count_pre = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM fragrance_notes")
    fn_count_pre = c.fetchone()[0]
    c.execute("SELECT id FROM fragrances")
    all_valid_ids = set(r[0] for r in c.fetchall())

    c.execute("SELECT fragrance_id FROM user_collection WHERE user_id = 1")
    user_wardrobe_ids = set(r[0] for r in c.fetchall())
    print(f"User 1 Owned Wardrobe IDs: {sorted(list(user_wardrobe_ids))}")

    # ==========================================
    # SECTION 1: MANDATORY CONTEXT SCENARIOS
    # ==========================================
    print("\n--- SECTION 1: MANDATORY CONTEXT SCENARIOS (1 - 6) ---")

    # TEST 1: FORMAL EVENING
    t0 = time.perf_counter()
    status1, d1 = post_json("/api/recommend/wear", {
        "context": {
            "weather": {"temperature_c": 31, "humidity_pct": 75},
            "temporal": {"timeOfDay": "Evening"},
            "occasion": "Formal",
            "outfit": "black suit",
            "mood": "confident"
        },
        "limit": 5
    })
    lat1 = (time.perf_counter() - t0) * 1000
    assert status1 == 200, f"Test 1 failed: {d1}"
    recs1 = d1["recommendations"]
    assert len(recs1) == 5, f"Expected 5 recs, got {len(recs1)}"
    for r in recs1:
        assert r["fragranceId"] in all_valid_ids, f"Invalid ID: {r['fragranceId']}"
        assert r["score"] > 0
        assert len(r["reasons"]) > 0
    print(f"TEST 1 (Formal Evening): HTTP 200, {lat1:.2f}ms")
    print(f"  Top pick: #{recs1[0]['fragranceId']} {recs1[0]['fragrance']['name']} by {recs1[0]['fragrance']['brand_name']} (Score: {recs1[0]['score']})")
    print(f"  Reasons: {recs1[0]['reasons']}")
    print("  -> TEST 1: PASS")

    # TEST 2: HOT CASUAL
    t0 = time.perf_counter()
    status2, d2 = post_json("/api/recommend/wear", {
        "context": {
            "weather": {"temperature_c": 38, "humidity_pct": 85},
            "temporal": {"timeOfDay": "Afternoon"},
            "occasion": "Casual",
            "outfit": "T-shirt and jeans",
            "mood": "relaxed"
        },
        "limit": 5
    })
    lat2 = (time.perf_counter() - t0) * 1000
    assert status2 == 200, f"Test 2 failed: {d2}"
    recs2 = d2["recommendations"]
    assert len(recs2) == 5
    for r in recs2:
        assert r["fragranceId"] in all_valid_ids
        assert "weather" in r["match"]
    print(f"TEST 2 (Hot Casual): HTTP 200, {lat2:.2f}ms")
    print(f"  Top pick: #{recs2[0]['fragranceId']} {recs2[0]['fragrance']['name']} (Family: {recs2[0]['fragrance']['fragrance_family']}, Score: {recs2[0]['score']}, WeatherMatch: {recs2[0]['match']['weather']})")
    print(f"  Reasons: {recs2[0]['reasons']}")
    print("  -> TEST 2: PASS")

    # TEST 3: DATE NIGHT
    t0 = time.perf_counter()
    status3, d3 = post_json("/api/recommend/wear", {
        "context": {
            "weather": {"temperature_c": 22, "humidity_pct": 45},
            "temporal": {"timeOfDay": "Evening"},
            "occasion": "Date",
            "outfit": "smart casual",
            "mood": "romantic"
        },
        "limit": 5
    })
    lat3 = (time.perf_counter() - t0) * 1000
    assert status3 == 200, f"Test 3 failed: {d3}"
    recs3 = d3["recommendations"]
    assert len(recs3) == 5
    print(f"TEST 3 (Date Night): HTTP 200, {lat3:.2f}ms")
    print(f"  Top pick: #{recs3[0]['fragranceId']} {recs3[0]['fragrance']['name']} (Score: {recs3[0]['score']}, OccasionMatch: {recs3[0]['match']['occasion']}, MoodMatch: {recs3[0]['match']['mood']})")
    print(f"  Reasons: {recs3[0]['reasons']}")
    print("  -> TEST 3: PASS")

    # TEST 4: COOL FORMAL
    t0 = time.perf_counter()
    status4, d4 = post_json("/api/recommend/wear", {
        "context": {
            "weather": {"temperature_c": 18, "humidity_pct": 40},
            "temporal": {"timeOfDay": "Night"},
            "occasion": "Formal",
            "outfit": "black suit",
            "mood": "sophisticated"
        },
        "limit": 5
    })
    lat4 = (time.perf_counter() - t0) * 1000
    assert status4 == 200, f"Test 4 failed: {d4}"
    recs4 = d4["recommendations"]
    assert len(recs4) == 5
    print(f"TEST 4 (Cool Formal): HTTP 200, {lat4:.2f}ms")
    print(f"  Top pick: #{recs4[0]['fragranceId']} {recs4[0]['fragrance']['name']} (Score: {recs4[0]['score']}, WeatherMatch: {recs4[0]['match']['weather']})")
    print(f"  Reasons: {recs4[0]['reasons']}")
    print("  -> TEST 4: PASS")

    # TEST 5: INDIAN FESTIVE
    t0 = time.perf_counter()
    status5, d5 = post_json("/api/recommend/wear", {
        "context": {
            "temporal": {"season": "Monsoon", "timeOfDay": "Evening"},
            "weather": {"condition": "monsoon_rain", "humidity_pct": 90},
            "occasion": "Festive / Wedding",
            "outfit": "traditional Indian kurta sherwani",
            "mood": "Indian Soul"
        },
        "limit": 5
    })
    lat5 = (time.perf_counter() - t0) * 1000
    assert status5 == 200, f"Test 5 failed: {d5}"
    recs5 = d5["recommendations"]
    assert len(recs5) == 5
    indian_recs = [r for r in recs5 if "india" in (r["fragrance"].get("brand_country") or "").lower() or "indian" in (r["fragrance"].get("origin_style") or "").lower() or r["fragrance"].get("format") == "Attar" or r["fragrance"].get("is_oil_based")]
    print(f"TEST 5 (Indian Festive): HTTP 200, {lat5:.2f}ms")
    print(f"  Top pick: #{recs5[0]['fragranceId']} {recs5[0]['fragrance']['name']} by {recs5[0]['fragrance']['brand_name']} (Origin: {recs5[0]['fragrance'].get('origin_style')}, Score: {recs5[0]['score']})")
    print(f"  Indian heritage representation in top 5: {len(indian_recs)}/5")
    print(f"  Reasons: {recs5[0]['reasons']}")
    assert len(indian_recs) >= 1, "Expected at least 1 Indian heritage fragrance in top 5 for Indian Festive"
    print("  -> TEST 5: PASS")

    # TEST 6: MINIMAL CONTEXT
    t0 = time.perf_counter()
    status6, d6 = post_json("/api/recommend/wear", {
        "context": "I just want to smell amazing today",
        "limit": 5
    })
    lat6 = (time.perf_counter() - t0) * 1000
    assert status6 == 200, f"Test 6 failed: {d6}"
    recs6 = d6["recommendations"]
    assert len(recs6) == 5
    meta6 = d6["metadata"]
    conf6 = meta6["confidence"]
    print(f"TEST 6 (Minimal Context): HTTP 200, {lat6:.2f}ms")
    print(f"  Top pick: #{recs6[0]['fragranceId']} {recs6[0]['fragrance']['name']} (Score: {recs6[0]['score']})")
    print(f"  Confidence: weather={conf6.get('weather')}, occasion={conf6.get('occasion')}, mood={conf6.get('mood')}")
    assert conf6.get("weather", 0) == 0, "Weather must not be fabricated"
    assert conf6.get("occasion", 0) == 0, "Occasion must not be fabricated"
    assert conf6.get("mood", 0) == 0, "Mood must not be fabricated"
    print("  -> TEST 6: PASS (Zero context hallucination)")

    # ==========================================
    # SECTION 2: WARDROBE TESTS
    # ==========================================
    print("\n--- SECTION 2: WARDROBE TESTS (A - D) ---")

    # Test A & B: Ownership flags
    status_cat, res_cat = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "source": {"includeCatalog": True, "wardrobeOnly": False},
        "limit": 10
    })
    assert status_cat == 200
    for r in res_cat["recommendations"]:
        is_owned = r["ownership"]["owned"]
        fid = r["fragranceId"]
        if fid in user_wardrobe_ids:
            assert is_owned == True, f"Fragrance #{fid} is in DB wardrobe, expected ownership.owned=true"
        else:
            assert is_owned == False, f"Fragrance #{fid} is NOT in DB wardrobe, expected ownership.owned=false"
    print(f"  Test A (Ownership detection when owned): PASS")
    print(f"  Test B (Ownership detection when not owned): PASS")

    # Test C: Wardrobe-only mode
    status_w, res_wardrobe = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "source": {"wardrobeOnly": True},
        "limit": 5
    })
    assert status_w == 200
    w_recs = res_wardrobe["recommendations"]
    assert len(w_recs) > 0, "Expected recommendations from wardrobe"
    for r in w_recs:
        assert r["fragranceId"] in user_wardrobe_ids, f"Fragrance #{r['fragranceId']} returned in wardrobe-only mode but not in wardrobe!"
        assert r["ownership"]["owned"] == True
    print(f"  Test C (Wardrobe-only mode): PASS ({len(w_recs)} recs, all strictly inside user collection {list(user_wardrobe_ids)})")

    # Test D: Exclusion list
    excluded_target = recs1[0]["fragranceId"]
    status_excl, res_excl = post_json("/api/recommend/wear", {
        "context": {
            "weather": {"temperature_c": 31, "humidity_pct": 75},
            "temporal": {"timeOfDay": "Evening"},
            "occasion": "Formal",
            "outfit": "black suit",
            "mood": "confident"
        },
        "excludeFragranceIds": [excluded_target],
        "limit": 5
    })
    assert status_excl == 200
    for r in res_excl["recommendations"]:
        assert r["fragranceId"] != excluded_target, f"Excluded ID #{excluded_target} was returned in recommendations!"
    print(f"  Test D (Exclusion list): PASS (Excluded ID #{excluded_target} never appeared)")

    # ==========================================
    # SECTION 3: EDGE CASES
    # ==========================================
    print("\n--- SECTION 3: EDGE CASES ---")

    # 1. Empty wardrobe in wardrobe-only mode
    status_ew, res_empty_w = post_json("/api/recommend/wear", {
        "context": {"occasion": "Office", "user": {"userId": 99999, "wardrobeFragranceIds": []}},
        "source": {"wardrobeOnly": True},
        "limit": 5
    })
    assert status_ew == 200
    assert len(res_empty_w["recommendations"]) == 0
    print("  Edge case 'empty wardrobe': PASS (Returned 0 items gracefully)")

    # 2. No preference vector
    status_np, res_nopref = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual", "user": {}},
        "limit": 5
    })
    assert status_np == 200
    assert len(res_nopref["recommendations"]) == 5
    print("  Edge case 'no preference vector': PASS (Used neutral baseline without error)")

    # 3. Missing weather, occasion, mood, outfit (all missing)
    status_miss, res_all_missing = post_json("/api/recommend/wear", {
        "context": {},
        "limit": 5
    })
    assert status_miss == 200
    assert len(res_all_missing["recommendations"]) == 5
    print("  Edge case 'all context factors missing': PASS")

    # 4. All candidates excluded
    status_ae, res_all_excl = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "excludeFragranceIds": list(all_valid_ids),
        "limit": 5
    })
    assert status_ae == 200
    assert len(res_all_excl["recommendations"]) == 0
    print("  Edge case 'all candidates excluded': PASS (Returned empty list gracefully)")

    # 5. Invalid / non-existent fragrance IDs in exclusions
    status_inv, res_invalid_id = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "excludeFragranceIds": [-999, "abc", 999999],
        "limit": 5
    })
    assert status_inv == 200
    assert len(res_invalid_id["recommendations"]) == 5
    print("  Edge case 'invalid excluded IDs': PASS (Skipped safely)")

    # 6. Duplicate candidate input / duplicate exclusions
    status_dup, res_dupe = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "excludeFragranceIds": [1, 1, 1, 2, 2],
        "limit": 5
    })
    assert status_dup == 200
    for r in res_dupe["recommendations"]:
        assert r["fragranceId"] not in [1, 2]
    print("  Edge case 'duplicate exclusions': PASS")

    # 7. Limit = 1
    status_l1, res_lim1 = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "limit": 1
    })
    assert status_l1 == 200
    assert len(res_lim1["recommendations"]) == 1
    print("  Edge case 'limit = 1': PASS")

    # 8. Limit = 5
    status_l5, res_lim5 = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "limit": 5
    })
    assert status_l5 == 200
    assert len(res_lim5["recommendations"]) == 5
    print("  Edge case 'limit = 5': PASS")

    # 9. Limit larger than catalog size (e.g. 500)
    status_l500, res_lim500 = post_json("/api/recommend/wear", {
        "context": {"occasion": "Casual"},
        "limit": 500
    })
    assert status_l500 == 200
    rec_count = len(res_lim500["recommendations"])
    assert rec_count == 124, f"Expected 124, got {rec_count}"
    print(f"  Edge case 'limit > catalog (500)': PASS (Returned all {rec_count} available catalog fragrances)")

    # ==========================================
    # SECTION 4: DETERMINISM TEST (10 RUNS)
    # ==========================================
    print("\n--- SECTION 4: DETERMINISM TEST (10 IDENTICAL RUNS) ---")
    payload_det = {
        "context": {
            "weather": {"temperature_c": 28, "humidity_pct": 60},
            "temporal": {"timeOfDay": "Evening"},
            "occasion": "Date",
            "mood": "romantic"
        },
        "limit": 5
    }

    first_result = None
    all_identical = True
    for i in range(10):
        status_det, res = post_json("/api/recommend/wear", payload_det)
        assert status_det == 200, f"Determinism run {i+1} failed: {res}"
        ids = [r["fragranceId"] for r in res["recommendations"]]
        scores = [r["score"] for r in res["recommendations"]]
        if i == 0:
            first_result = (ids, scores)
        else:
            if (ids, scores) != first_result:
                all_identical = False
                print(f"  Run {i+1} diverged! Got {ids}, expected {first_result[0]}")
                break

    assert all_identical, "Determinism test failed: identical inputs gave different outputs!"
    print(f"  10/10 runs produced identical IDs {first_result[0]} and scores {first_result[1]}")
    print("  -> DETERMINISM TEST: PASS")

    # ==========================================
    # SECTION 5: PERFORMANCE BENCHMARK
    # ==========================================
    print("\n--- SECTION 5: PERFORMANCE BENCHMARK (50 ITERATIONS) ---")
    latencies_catalog = []
    latencies_wardrobe = []

    for _ in range(50):
        t0 = time.perf_counter()
        post_json("/api/recommend/wear", payload_det)
        latencies_catalog.append((time.perf_counter() - t0) * 1000)

        t0 = time.perf_counter()
        post_json("/api/recommend/wear", {
            "context": {"occasion": "Office"},
            "source": {"wardrobeOnly": True},
            "limit": 5
        })
        latencies_wardrobe.append((time.perf_counter() - t0) * 1000)

    avg_cat = sum(latencies_catalog) / len(latencies_catalog)
    p95_cat = sorted(latencies_catalog)[int(len(latencies_catalog) * 0.95)]
    avg_ward = sum(latencies_wardrobe) / len(latencies_wardrobe)
    p95_ward = sorted(latencies_wardrobe)[int(len(latencies_wardrobe) * 0.95)]

    print(f"  Full Catalog Recommendation (50 runs):")
    print(f"    Average Latency: {avg_cat:.2f} ms (Target: < 100 ms)")
    print(f"    P95 Latency:     {p95_cat:.2f} ms")
    print(f"  Wardrobe-Only Recommendation (50 runs):")
    print(f"    Average Latency: {avg_ward:.2f} ms (Target: < 50 ms)")
    print(f"    P95 Latency:     {p95_ward:.2f} ms")

    assert avg_cat < 100, f"Catalog average {avg_cat:.2f}ms exceeds 100ms"
    assert avg_ward < 50, f"Wardrobe average {avg_ward:.2f}ms exceeds 50ms"
    print("  -> PERFORMANCE TARGETS: PASS")

    # ==========================================
    # SECTION 6: BACKWARD COMPATIBILITY TEST (/api/recommend)
    # ==========================================
    print("\n--- SECTION 6: BACKWARD COMPATIBILITY (/api/recommend) ---")
    status_leg, legacy_data = post_json("/api/recommend", {
        "season": "Summer",
        "occasion": "Casual",
        "freshness": 8
    })
    assert status_leg == 200
    assert isinstance(legacy_data, list), "Expected list for legacy /api/recommend"
    print(f"  Legacy /api/recommend call: HTTP 200, returned {len(legacy_data)} items")

    status_unif, unified_data = post_json("/api/recommend", {
        "context": {"occasion": "Formal", "weather": {"temperature_c": 31}},
        "limit": 5
    })
    assert status_unif == 200
    assert "recommendations" in unified_data, "Expected recommendations in unified /api/recommend"
    print(f"  Unified /api/recommend call: HTTP 200, returned {len(unified_data['recommendations'])} items")
    print("  -> BACKWARD COMPATIBILITY: PASS")

    # ==========================================
    # SECTION 7: DATABASE SAFETY CHECK
    # ==========================================
    print("\n--- SECTION 7: DATABASE SAFETY CHECK ---")
    c.execute("SELECT COUNT(*) FROM fragrances")
    f_count_post = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM brands")
    b_count_post = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM note_taxonomy")
    t_count_post = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM fragrance_notes")
    fn_count_post = c.fetchone()[0]

    print(f"  Fragrances count:     {f_count_post} (pre: {f_count_pre})")
    print(f"  Brands count:         {b_count_post} (pre: {b_count_pre})")
    print(f"  Taxonomy count:       {t_count_post} (pre: {t_count_pre})")
    print(f"  Fragrance notes count:{fn_count_post} (pre: {fn_count_pre})")

    assert f_count_post == f_count_pre == 124, "Fragrance count changed!"
    assert b_count_post == b_count_pre == 80, "Brand count changed!"
    assert t_count_post == t_count_pre == 60, "Taxonomy count changed!"
    assert fn_count_post == fn_count_pre == 1024, "Fragrance notes count changed!"
    print("  -> DATABASE COUNTS IDENTICAL (124/80/60/1024): PASS")

    print("\n" + "=" * 60)
    print("ALL STEP 6B AUDIT CHECKS COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_endpoint()
