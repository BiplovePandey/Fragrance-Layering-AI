#!/usr/bin/env python3
"""
STEP 6C — "WHAT SHOULD I WEAR?" PREMIER OLFACTORY ATELIER UI & INTEGRATION AUDIT
"""
import os
import sys
import sqlite3
import json
import urllib.request

BASE_URL = "http://localhost:3000"
DB_PATH = "fragrances.db"

def run_query(url, payload):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        return resp.getcode(), json.loads(resp.read().decode("utf-8"))

def test_step6c():
    print("=" * 60)
    print("RUNNING STEP 6C: WHAT SHOULD I WEAR? ATELIER AUDIT")
    print("=" * 60)

    # 1. Verify Database Safety
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM fragrances")
    frag_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM brands")
    brand_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM note_taxonomy")
    tax_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM fragrance_notes")
    fn_count = c.fetchone()[0]
    conn.close()

    print(f"Database Verification:")
    print(f"  Fragrances:     {frag_count} (Expected 124)")
    print(f"  Brands:         {brand_count} (Expected 80)")
    print(f"  Taxonomy:       {tax_count} (Expected 60)")
    print(f"  Mappings:       {fn_count} (Expected 1024)")
    assert frag_count == 124, f"Expected 124 fragrances, got {frag_count}"
    assert brand_count == 80, f"Expected 80 brands, got {brand_count}"
    assert tax_count == 60, f"Expected 60 taxonomy entries, got {tax_count}"
    assert fn_count == 1024, f"Expected 1024 fragrance notes, got {fn_count}"
    print("  -> DATABASE INTEGRITY PASS\n")

    # 2. Verify Frontend Component Structure
    expected_files = [
      "src/components/views/WhatShouldIWearView.tsx",
      "src/components/wear/QuickStartBar.tsx",
      "src/components/wear/ContextBuilder.tsx",
      "src/components/wear/ContextSummaryBadge.tsx",
      "src/components/wear/TopRecommendationCard.tsx",
      "src/components/wear/AlternativeRecommendationsList.tsx",
      "src/components/wear/SignalBreakdown.tsx",
      "src/components/wear/MinimalContextBanner.tsx",
      "src/components/wear/EmptyOrErrorState.tsx"
    ]
    for f in expected_files:
        assert os.path.exists(f), f"Missing expected component file: {f}"
        print(f"  Found component: {f}")
    print("  -> COMPONENT PRESENCE PASS\n")

    # 3. Test Full-Context Normalization & Recommendation Flow
    print("Testing Full-Context Recommendation Flow...")
    code, norm_res = run_query(f"{BASE_URL}/api/context/normalize", {
        "weather": {"temperature_c": 31, "humidity_pct": 75, "condition": "sunny_warm"},
        "temporal": {"timeOfDay": "Evening", "season": "Summer"},
        "occasion": "Formal",
        "mood": "Refined & Elevated",
        "outfit": {"formality": "black_tie", "color": "Black"}
    })
    assert code == 200, f"Normalize failed with status {code}"
    assert "context" in norm_res, "Normalized context missing"

    code, rec_res = run_query(f"{BASE_URL}/api/recommend/wear", {
        "context": norm_res["context"],
        "source": {"wardrobeOnly": False},
        "limit": 5
    })
    assert code == 200, f"Recommend wear failed with status {code}"
    recs = rec_res.get("recommendations", [])
    assert len(recs) == 5, f"Expected 5 recommendations, got {len(recs)}"
    top = recs[0]
    assert "fragrance" in top, "Top rec missing fragrance"
    assert "score" in top, "Top rec missing score"
    assert "match" in top, "Top rec missing match breakdown"
    assert "reasons" in top, "Top rec missing reasons"
    print(f"  Top Pick: {top['fragrance']['name']} by {top['fragrance']['brand']} (Score: {top['score']}%)")
    print(f"  Match Signals: {list(top['match'].keys())}")
    print(f"  Primary Reason: {top['reasons'][0]}")
    print("  -> FULL-CONTEXT FLOW PASS\n")

    # 4. Test Minimal-Context Mode Flow
    print("Testing Minimal-Context Flow ('I just want to smell amazing today')...")
    code, norm_min = run_query(f"{BASE_URL}/api/context/normalize", {
        "weather": {"temperature_c": 26, "humidity_pct": 55}
    })
    assert code == 200
    code, rec_min = run_query(f"{BASE_URL}/api/recommend/wear", {
        "context": norm_min["context"],
        "limit": 5
    })
    assert code == 200
    recs_min = rec_min.get("recommendations", [])
    assert len(recs_min) > 0, "Minimal context must produce recommendations"
    print(f"  Top Minimal Pick: {recs_min[0]['fragrance']['name']} (Score: {recs_min[0]['score']}%)")
    print("  -> MINIMAL-CONTEXT FLOW PASS\n")

    # 5. Test Quick-Start Preset Flows
    print("Testing Quick-Start Presets...")
    presets = [
      ("Office", {"occasion": "Office", "temporal": {"timeOfDay": "Morning"}}),
      ("Date Night", {"occasion": "Date", "temporal": {"timeOfDay": "Evening"}}),
      ("Hot Day", {"weather": {"temperature_c": 36, "humidity_pct": 80}, "occasion": "Casual"}),
      ("Formal Evening", {"occasion": "Formal", "temporal": {"timeOfDay": "Night"}}),
      ("Casual Weekend", {"occasion": "Casual", "temporal": {"timeOfDay": "Day"}}),
      ("Festive / Wedding", {"occasion": "Festive / Wedding", "temporal": {"timeOfDay": "Evening"}})
    ]
    for name, p_ctx in presets:
        c_code, c_norm = run_query(f"{BASE_URL}/api/context/normalize", p_ctx)
        assert c_code == 200
        r_code, r_rec = run_query(f"{BASE_URL}/api/recommend/wear", {"context": c_norm["context"], "limit": 3})
        assert r_code == 200
        top_name = r_rec["recommendations"][0]["fragrance"]["name"]
        print(f"  Preset '{name}': Top Pick -> {top_name}")
    print("  -> ALL 6 QUICK-START PRESETS PASS\n")

    # 6. Test Wardrobe-Only Mode
    print("Testing Wardrobe-Only Mode...")
    code, w_rec = run_query(f"{BASE_URL}/api/recommend/wear", {
        "context": norm_res["context"],
        "source": {"wardrobeOnly": True},
        "limit": 5
    })
    assert code == 200
    for r in w_rec.get("recommendations", []):
        assert r.get("ownership", {}).get("owned") == True, f"Item {r['fragrance']['id']} must be owned"
    print(f"  Wardrobe picks count: {len(w_rec.get('recommendations', []))}")
    print("  -> WARDROBE-ONLY MODE PASS\n")

    print("=" * 60)
    print("ALL STEP 6C AUDIT CHECKS PASSED PERFECTLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_step6c()
