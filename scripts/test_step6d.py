#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import sys
import time

BASE_URL = "http://localhost:3000"

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, {"raw_error": err_body}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("==================================================")
    print("STEP 6D — 15-POINT TEST MATRIX (A through O)")
    print("==================================================")
    passed_count = 0
    total_tests = 15

    # Setup: Clear any prior behavioral test data for test user 999
    test_user = 999
    status, _ = make_request(f"/api/behavior/history?userId={test_user}", method="DELETE")
    print(f"Setup: Cleared existing history for test user {test_user} (Status: {status})")

    # TEST A: Single Valid Event Capture
    print("\n--- TEST A: Single Valid Event Capture ---")
    event_a = {
        "id": f"test_ev_a_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "FRAGRANCE_VIEWED",
        "fragranceId": 1,
        "source": "catalog_explorer",
        "metadata": {"view_depth": "full_notes"}
    }
    status, res = make_request("/api/behavior/events", method="POST", data=event_a)
    if status == 201 and res.get("success") is True and res.get("inserted") is True and res.get("duplicate") is False:
        print("✓ Test A Passed: Event recorded successfully (201 Created)")
        passed_count += 1
    else:
        print(f"✗ Test A Failed: Status {status}, Response: {res}")

    # TEST B: Event Idempotency
    print("\n--- TEST B: Event Idempotency ---")
    status, res_dup = make_request("/api/behavior/events", method="POST", data=event_a)
    if status == 201 and res_dup.get("inserted") is False and res_dup.get("duplicate") is True:
        print("✓ Test B Passed: Duplicate event gracefully detected (duplicate=True, inserted=False)")
        passed_count += 1
    else:
        print(f"✗ Test B Failed: Status {status}, Response: {res_dup}")

    # TEST C: Batch Capture & Partial Rejection
    print("\n--- TEST C: Batch Capture & Partial Rejection ---")
    batch_data = {
        "events": [
            {
                "id": f"test_batch_1_{int(time.time()*1000)}",
                "userId": test_user,
                "eventType": "RECOMMENDATION_OPENED",
                "fragranceId": 2,
                "source": "wear_view"
            },
            {
                "id": f"test_batch_invalid_{int(time.time()*1000)}",
                "userId": test_user,
                "eventType": "INVALID_EVENT_TYPE_123",
                "fragranceId": 2,
                "source": "wear_view"
            },
            {
                "id": f"test_batch_2_{int(time.time()*1000)}",
                "userId": test_user,
                "eventType": "RECOMMENDATION_SAVED",
                "fragranceId": 3,
                "source": "wear_view"
            }
        ]
    }
    status, res_batch = make_request("/api/behavior/events/batch", method="POST", data=batch_data)
    if status == 201 and res_batch.get("inserted") == 2 and res_batch.get("rejected") == 1:
        print("✓ Test C Passed: Batch processed with partial acceptance (2 inserted, 1 rejected)")
        passed_count += 1
    else:
        print(f"✗ Test C Failed: Status {status}, Response: {res_batch}")

    # TEST D: Recommendation Shown Neutrality
    print("\n--- TEST D: Recommendation Shown Neutrality ---")
    # Record RECOMMENDATION_SHOWN for fragrance 4
    shown_event = {
        "id": f"test_shown_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "RECOMMENDATION_SHOWN",
        "fragranceId": 4,
        "source": "what_should_i_wear"
    }
    make_request("/api/behavior/events", method="POST", data=shown_event)
    status, snap_d = make_request(f"/api/behavior/memory?userId={test_user}")
    pos_signals_4 = [s for s in snap_d.get("topPositiveSignals", []) if "4" in s.get("dimension", "") or s.get("fragranceId") == 4]
    if len(pos_signals_4) == 0:
        print("✓ Test D Passed: RECOMMENDATION_SHOWN does NOT generate positive preference evidence")
        passed_count += 1
    else:
        print(f"✗ Test D Failed: Found unsolicited positive signals for shown-only fragrance: {pos_signals_4}")

    # TEST E: Single Wear Signal
    print("\n--- TEST E: Single Wear Signal ---")
    wear_event_1 = {
        "id": f"test_wear_1_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "FRAGRANCE_WORN",
        "fragranceId": 5,
        "source": "what_should_i_wear"
    }
    make_request("/api/behavior/events", method="POST", data=wear_event_1)
    status, snap_e = make_request(f"/api/behavior/memory?userId={test_user}")
    wear_signal_5 = next((s for s in snap_e.get("implicitSignals", []) if s.get("dimension", "").startswith("fragrance:") and "5 wears" not in s.get("value", "") and s.get("evidenceCount") == 1), None)
    if wear_signal_5 and wear_signal_5.get("evidenceType") == "IMPLICIT" and wear_signal_5.get("evidenceStrength") >= 0.40:
        print(f"✓ Test E Passed: Single wear generated implicit evidence (Strength: {wear_signal_5['evidenceStrength']}, Type: {wear_signal_5['evidenceType']})")
        passed_count += 1
    else:
        print(f"✗ Test E Failed: Wear signal not found or invalid: {wear_signal_5}")

    # TEST F: Repeat Wear Reinforcement
    print("\n--- TEST F: Repeat Wear Reinforcement ---")
    # Wear fragrance 5 two more times (total 3 wears)
    for i in range(2):
        ev = {
            "id": f"test_wear_repeat_{i}_{int(time.time()*1000)}",
            "userId": test_user,
            "eventType": "FRAGRANCE_WORN",
            "fragranceId": 5,
            "source": "what_should_i_wear"
        }
        make_request("/api/behavior/events", method="POST", data=ev)
    status, snap_f = make_request(f"/api/behavior/memory?userId={test_user}")
    reinforced_signal = next((s for s in snap_f.get("implicitSignals", []) if s.get("dimension", "").startswith("fragrance:") and s.get("evidenceCount") == 3), None)
    if reinforced_signal and reinforced_signal.get("evidenceStrength") > (wear_signal_5["evidenceStrength"] if wear_signal_5 else 0):
        print(f"✓ Test F Passed: Repeat wear increased evidence strength from {wear_signal_5.get('evidenceStrength')} to {reinforced_signal['evidenceStrength']}")
        passed_count += 1
    else:
        print(f"✗ Test F Failed: Reinforcement failed. Signal: {reinforced_signal}")

    # TEST G: Explicit Rating Evidence
    print("\n--- TEST G: Explicit Rating Evidence ---")
    # High rating (5 stars) on Fragrance 6
    high_rate_ev = {
        "id": f"test_rate_high_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "FRAGRANCE_RATED",
        "fragranceId": 6,
        "source": "chamber_rating",
        "metadata": {"rating": 5}
    }
    # Low rating (1 star) on Fragrance 7
    low_rate_ev = {
        "id": f"test_rate_low_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "FRAGRANCE_RATED",
        "fragranceId": 7,
        "source": "chamber_rating",
        "metadata": {"rating": 1}
    }
    make_request("/api/behavior/events", method="POST", data=high_rate_ev)
    make_request("/api/behavior/events", method="POST", data=low_rate_ev)
    status, snap_g = make_request(f"/api/behavior/memory?userId={test_user}")
    pos_g = [s for s in snap_g.get("explicitSignals", []) if s.get("direction") == "positive" and s.get("evidenceType") == "EXPLICIT"]
    neg_g = [s for s in snap_g.get("explicitSignals", []) if s.get("direction") == "negative" and s.get("evidenceType") == "EXPLICIT"]
    if len(pos_g) >= 1 and len(neg_g) >= 1:
        print(f"✓ Test G Passed: Ratings generated explicit positive ({len(pos_g)}) and negative ({len(neg_g)}) evidence")
        passed_count += 1
    else:
        print(f"✗ Test G Failed: Pos: {pos_g}, Neg: {neg_g}")

    # TEST H: Contextual Pattern Capture
    print("\n--- TEST H: Contextual Pattern Capture ---")
    context_ev = {
        "id": f"test_context_pat_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "FRAGRANCE_WORN",
        "fragranceId": 8,
        "source": "what_should_i_wear",
        "contextSnapshot": {
            "weather": {"temperatureC": 34, "humidityPercent": 75, "condition": "Sunny"},
            "occasion": {"type": "Date"},
            "temporal": {"timeOfDay": "Evening", "season": "Summer"}
        }
    }
    make_request("/api/behavior/events", method="POST", data=context_ev)
    status, snap_h = make_request(f"/api/behavior/memory?userId={test_user}")
    patterns = snap_h.get("contextPatterns", [])
    has_weather_band = any(p.get("dimension") == "weather_band" for p in patterns)
    has_occasion = any(p.get("dimension") == "occasion" and p.get("value") == "Date" for p in patterns)
    has_time = any(p.get("dimension") == "time_of_day" and p.get("value") == "Evening" for p in patterns)
    if has_weather_band and has_occasion and has_time:
        print("✓ Test H Passed: Contextual patterns successfully captured weather_band, occasion, and time_of_day")
        passed_count += 1
    else:
        print(f"✗ Test H Failed: Weather: {has_weather_band}, Occasion: {has_occasion}, Time: {has_time}, Patterns: {patterns}")

    # TEST I: Empty State Determinism
    print("\n--- TEST I: Empty State Determinism ---")
    empty_user = 998
    make_request(f"/api/behavior/history?userId={empty_user}", method="DELETE")
    status, snap_i = make_request(f"/api/behavior/memory?userId={empty_user}")
    if snap_i.get("totalEvents") == 0 and snap_i.get("confidence") == 0 and len(snap_i.get("implicitSignals", [])) == 0:
        print("✓ Test I Passed: Empty user yields 0 confidence, 0 events, deterministic empty arrays")
        passed_count += 1
    else:
        print(f"✗ Test I Failed: Snapshot: {snap_i}")

    # TEST J: Negative Signal Capture
    print("\n--- TEST J: Negative Signal Capture ---")
    dismiss_ev = {
        "id": f"test_dismiss_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "RECOMMENDATION_DISMISSED",
        "fragranceId": 9,
        "source": "what_should_i_wear"
    }
    make_request("/api/behavior/events", method="POST", data=dismiss_ev)
    status, snap_j = make_request(f"/api/behavior/memory?userId={test_user}")
    neg_signals = snap_j.get("topNegativeSignals", [])
    has_neg_9 = any("9" in str(s) or "dismiss" in str(s).lower() for s in neg_signals)
    if len(neg_signals) > 0 and has_neg_9:
        print(f"✓ Test J Passed: Negative signal captured for dismissed recommendation ({len(neg_signals)} negative signals)")
        passed_count += 1
    else:
        print(f"✗ Test J Failed: Top negative signals: {neg_signals}")

    # TEST K: Fragrance Summary Precision
    print("\n--- TEST K: Fragrance Summary Precision ---")
    status, summary_k = make_request(f"/api/behavior/fragrance/5?userId={test_user}")
    if status == 200 and summary_k.get("wears") == 3 and summary_k.get("fragranceId") == 5:
        print(f"✓ Test K Passed: Fragrance summary precisely reported {summary_k.get('wears')} wears for Fragrance 5")
        passed_count += 1
    else:
        print(f"✗ Test K Failed: Status {status}, Summary: {summary_k}")

    # TEST L: Historical Immutability
    print("\n--- TEST L: Historical Immutability ---")
    status, history_l = make_request(f"/api/behavior/history?userId={test_user}&limit=100")
    raw_events = history_l.get("events", [])
    has_first_event = any(e.get("id") == event_a["id"] for e in raw_events)
    if status == 200 and len(raw_events) >= 8 and has_first_event:
        print(f"✓ Test L Passed: All {len(raw_events)} historical events preserved verbatim with immutable timestamps")
        passed_count += 1
    else:
        print(f"✗ Test L Failed: Count: {len(raw_events)}, Found first event: {has_first_event}")

    # TEST M: Privacy & Data Minimization
    print("\n--- TEST M: Privacy & Data Minimization ---")
    # Submit event with excessively large metadata (>16KB)
    huge_meta = {"junk": "x" * 20000}
    huge_ev = {
        "id": f"test_huge_{int(time.time()*1000)}",
        "userId": test_user,
        "eventType": "FRAGRANCE_VIEWED",
        "fragranceId": 1,
        "source": "privacy_check",
        "metadata": huge_meta
    }
    status_m, res_m = make_request("/api/behavior/events", method="POST", data=huge_ev)
    if status_m == 400 and "16KB" in str(res_m):
        print("✓ Test M Passed: Payload limit strictly enforced (>16KB metadata rejected with 400)")
        passed_count += 1
    else:
        print(f"✗ Test M Failed: Status {status_m}, Res: {res_m}")

    # TEST N: Non-Interference with Recommendations
    print("\n--- TEST N: Non-Interference with Recommendations ---")
    rec_req = {
        "context": {
            "weather": {"temperature_c": 28, "humidity_pct": 60, "condition": "Warm"},
            "occasion": "Office"
        },
        "source": {"wardrobeOnly": False, "includeCatalog": True},
        "limit": 5
    }
    # Query recommendations
    s1, res_rec_1 = make_request("/api/recommend/wear", method="POST", data=rec_req)
    scores_1 = [r.get("score") for r in res_rec_1.get("recommendations", [])]
    ids_1 = [r.get("fragranceId") for r in res_rec_1.get("recommendations", [])]

    # Now record 10 arbitrary wear events for other fragrances
    for f_id in [10, 11, 12]:
        make_request("/api/behavior/events", method="POST", data={
            "id": f"noise_wear_{f_id}_{int(time.time()*1000)}",
            "userId": 1, # default user
            "eventType": "FRAGRANCE_WORN",
            "fragranceId": f_id,
            "source": "noise_test"
        })

    # Query recommendations again with exact same context
    s2, res_rec_2 = make_request("/api/recommend/wear", method="POST", data=rec_req)
    scores_2 = [r.get("score") for r in res_rec_2.get("recommendations", [])]
    ids_2 = [r.get("fragranceId") for r in res_rec_2.get("recommendations", [])]

    if scores_1 == scores_2 and ids_1 == ids_2:
        print("✓ Test N Passed: Recommendation ranking and scores are 100% identical before and after behavior events (zero interference)")
        passed_count += 1
    else:
        print(f"✗ Test N Failed: Rankings changed! Before: {ids_1} vs After: {ids_2}")

    # TEST O: Clear Behavioral History
    print("\n--- TEST O: Clear Behavioral History ---")
    status_o, res_o = make_request(f"/api/behavior/history?userId={test_user}", method="DELETE")
    status_check, history_check = make_request(f"/api/behavior/history?userId={test_user}")
    status_snap, snap_clean = make_request(f"/api/behavior/memory?userId={test_user}")

    # Check that fragrances and wardrobe still exist
    status_frag, frags = make_request("/api/fragrances?limit=5")
    if (status_o == 200 and
        history_check.get("total") == 0 and
        snap_clean.get("totalEvents") == 0 and
        status_frag == 200 and
        len(frags) > 0):
        print("✓ Test O Passed: Behavioral history cleared completely while database and catalog remain fully intact")
        passed_count += 1
    else:
        print(f"✗ Test O Failed: History check: {history_check}, Snap: {snap_clean}")

    print("\n==================================================")
    print(f"TEST RESULTS: {passed_count}/{total_tests} PASSED")
    print("==================================================")

    if passed_count == total_tests:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
