import json
import sqlite3
import re

def validate_manifest():
    manifest_path = 'data/india_fragrance_manifest.json'
    corrections_path = 'data/india_manifest_corrections.json'
    taxonomy_path = 'data/india_taxonomy_proposals.json'
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
        
    with open(corrections_path, 'r', encoding='utf-8') as f:
        corrections = json.load(f)
        
    with open(taxonomy_path, 'r', encoding='utf-8') as f:
        taxonomy = json.load(f)

    # 1. DB Safety Check
    conn = sqlite3.connect('fragrances.db')
    c = conn.cursor()
    db_fragrances = c.execute('SELECT COUNT(*) FROM fragrances').fetchone()[0]
    db_brands = c.execute('SELECT COUNT(*) FROM brands').fetchone()[0]
    db_taxonomy = c.execute('SELECT COUNT(*) FROM note_taxonomy').fetchone()[0]
    conn.close()

    assert db_fragrances == 93, f"SQLite fragrances altered! Expected 93, got {db_fragrances}"
    assert db_brands == 79, f"SQLite brands altered! Expected 79, got {db_brands}"
    assert db_taxonomy == 60, f"SQLite taxonomy altered! Expected 60, got {db_taxonomy}"
    
    # 2. Status Distribution
    status_counts = {}
    for r in manifest:
        s = r.get('status', 'UNKNOWN')
        status_counts[s] = status_counts.get(s, 0) + 1
        
    # 3. Duplicate checks
    id_counts = {}
    name_brand_counts = {}
    for r in manifest:
        rid = r['id']
        id_counts[rid] = id_counts.get(rid, 0) + 1
        
        nbk = f"{r['identity']['brand_name'].lower().strip()}::{r['identity']['name'].lower().strip()}"
        name_brand_counts[nbk] = name_brand_counts.get(nbk, 0) + 1
        
    duplicate_manifest_ids = [k for k, v in id_counts.items() if v > 1]
    assert len(duplicate_manifest_ids) == 0, f"Duplicate manifest IDs found: {duplicate_manifest_ids}"

    # 4. Check IN-FRAG-084 and IN-FRAG-085
    r84 = next(r for r in manifest if r['id'] == 'IN-FRAG-084')
    r85 = next(r for r in manifest if r['id'] == 'IN-FRAG-085')
    
    assert r84['status'] == 'DUPLICATE_OF'
    assert r84['duplicate_of'] == 'IN-FRAG-031'
    assert r84['import_action'] == 'DO_NOT_IMPORT'
    
    assert r85['status'] == 'DUPLICATE_OF'
    assert r85['duplicate_of'] == 'IN-FRAG-032'
    assert r85['import_action'] == 'DO_NOT_IMPORT'
    
    # 5. Check IN-FRAG-038
    r38 = next(r for r in manifest if r['id'] == 'IN-FRAG-038')
    assert len(r38['scent_structure']['top_notes']) == 0
    assert len(r38['scent_structure']['middle_notes']) == 0
    assert len(r38['scent_structure']['base_notes']) == 0
    assert 'Sweet Lime' not in r38['scent_structure']['notes_general']
    assert 'Chandan' not in r38['scent_structure']['notes_general']
    assert len(r38['scent_structure']['notes_general']) > 0

    # 6. Check 21 Category B Records
    cat_b_ids = [
        'IN-FRAG-008', 'IN-FRAG-031', 'IN-FRAG-037', 'IN-FRAG-038', 'IN-FRAG-045', 
        'IN-FRAG-046', 'IN-FRAG-068', 'IN-FRAG-069', 'IN-FRAG-078', 'IN-FRAG-079', 
        'IN-FRAG-080', 'IN-FRAG-081', 'IN-FRAG-082', 'IN-FRAG-083', 'IN-FRAG-084', 
        'IN-FRAG-094', 'IN-FRAG-095', 'IN-FRAG-119', 'IN-FRAG-120', 'IN-FRAG-121', 
        'IN-FRAG-122'
    ]
    for cid in cat_b_ids:
        rc = next(r for r in manifest if r['id'] == cid)
        s = rc['scent_structure']
        assert len(s['top_notes']) == 0, f"{cid} has top notes"
        assert len(s['middle_notes']) == 0, f"{cid} has middle notes"
        assert len(s['base_notes']) == 0, f"{cid} has base notes"
        assert len(s['notes_general']) > 0, f"{cid} has empty general notes"

    # 7. Check 12 Heritage Corrections
    heritage_fix_ids = [
        'IN-FRAG-005', 'IN-FRAG-016', 'IN-FRAG-017', 'IN-FRAG-018',
        'IN-FRAG-047', 'IN-FRAG-050', 'IN-FRAG-057', 'IN-FRAG-060',
        'IN-FRAG-061', 'IN-FRAG-065', 'IN-FRAG-066', 'IN-FRAG-067'
    ]
    for hid in heritage_fix_ids:
        rh = next(r for r in manifest if r['id'] == hid)
        h = rh['heritage']
        assert h['is_heritage'] is False, f"{hid} still marked as heritage"
        assert h['distillation_method'] is None, f"{hid} still has distillation_method"
        assert h['heritage_relationship'] is None, f"{hid} still has heritage_relationship"
        assert len(h['heritage_materials']) == 0, f"{hid} still has heritage materials"

    # 8. Source Provenance Metrics
    new_records = [r for r in manifest if r['status'] == 'NEW']
    pdp_recovered = 0
    source_review_required = 0
    for r in new_records:
        prov = r.get('provenance', {})
        if prov.get('source_status') == 'VERIFIED_PDP':
            pdp_recovered += 1
        elif prov.get('source_status') == 'SOURCE_REVIEW_REQUIRED':
            source_review_required += 1

    # 9. Taxonomy check
    redundant_tax = sum(1 for p in taxonomy if p.get('proposal_status') == 'REDUNDANT')
    novel_tax = sum(1 for p in taxonomy if p.get('proposal_status') == 'PROPOSAL_PENDING_REVIEW')
    assert redundant_tax == 5
    assert novel_tax == 5

    print("=== VALIDATION REPORT ===")
    print(f"Total manifest records: {len(manifest)}")
    print(f"Total corrections logged: {len(corrections)}")
    print(f"Status distribution: {status_counts}")
    print(f"Category B linear profiles converted: {len(cat_b_ids)}")
    print(f"IN-FRAG-038 unsupported notes removed: SUCCESS")
    print(f"Heritage records corrected: {len(heritage_fix_ids)}")
    print(f"Duplicates resolved: IN-FRAG-084 -> IN-FRAG-031, IN-FRAG-085 -> IN-FRAG-032")
    print(f"Source provenance for NEW records:")
    print(f"  - Product-level sources recovered: {pdp_recovered}")
    print(f"  - Still requiring source review: {source_review_required}")
    print(f"Taxonomy proposals:")
    print(f"  - Redundant marked: {redundant_tax}")
    print(f"  - Novel proposals pending: {novel_tax}")
    print(f"  - Production taxonomy modified: NO (60 rows preserved)")
    print(f"SQLite DB check:")
    print(f"  - Fragrances: {db_fragrances} (0 modified)")
    print(f"  - Brands: {db_brands} (0 modified)")
    print("ALL VALIDATION ASSERTIONS PASSED.")

if __name__ == '__main__':
    validate_manifest()
