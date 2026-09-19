import json
import sqlite3
import os

def run_corrections():
    manifest_path = 'data/india_fragrance_manifest.json'
    corrections_path = 'data/india_manifest_corrections.json'
    
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
        
    corrections = []
    
    cat_b_ids = [
        'IN-FRAG-008', 'IN-FRAG-031', 'IN-FRAG-037', 'IN-FRAG-038', 'IN-FRAG-045', 
        'IN-FRAG-046', 'IN-FRAG-068', 'IN-FRAG-069', 'IN-FRAG-078', 'IN-FRAG-079', 
        'IN-FRAG-080', 'IN-FRAG-081', 'IN-FRAG-082', 'IN-FRAG-083', 'IN-FRAG-084', 
        'IN-FRAG-094', 'IN-FRAG-095', 'IN-FRAG-119', 'IN-FRAG-120', 'IN-FRAG-121', 
        'IN-FRAG-122'
    ]
    
    heritage_fix_ids = [
        'IN-FRAG-005', 'IN-FRAG-016', 'IN-FRAG-017', 'IN-FRAG-018',
        'IN-FRAG-047', 'IN-FRAG-050', 'IN-FRAG-057', 'IN-FRAG-060',
        'IN-FRAG-061', 'IN-FRAG-065', 'IN-FRAG-066', 'IN-FRAG-067'
    ]
    
    verified_pdp_urls = {
        'IN-FRAG-088': 'https://www.33north.in/products/bad-influence',
        'IN-FRAG-089': 'https://www.33north.in/products/siente',
        'IN-FRAG-094': 'https://kastoorperfumery.com/products/mystique'
    }
    
    root_new_ids = [
        'IN-FRAG-075', 'IN-FRAG-077', 'IN-FRAG-081', 'IN-FRAG-082', 'IN-FRAG-083',
        'IN-FRAG-087', 'IN-FRAG-088', 'IN-FRAG-089', 'IN-FRAG-093', 'IN-FRAG-094',
        'IN-FRAG-095', 'IN-FRAG-096', 'IN-FRAG-097', 'IN-FRAG-098', 'IN-FRAG-099',
        'IN-FRAG-100', 'IN-FRAG-101', 'IN-FRAG-105', 'IN-FRAG-107', 'IN-FRAG-108',
        'IN-FRAG-109', 'IN-FRAG-111', 'IN-FRAG-120', 'IN-FRAG-123', 'IN-FRAG-124'
    ]
    
    for r in manifest:
        rid = r['id']
        scent = r.get('scent_structure', {})
        
        # 1 & 2. Artificial Pyramids & IN-FRAG-038
        if rid in cat_b_ids:
            prev_top = list(scent.get('top_notes', []))
            prev_mid = list(scent.get('middle_notes', []))
            prev_base = list(scent.get('base_notes', []))
            prev_general = list(scent.get('notes_general', []))
            
            if rid == 'IN-FRAG-038':
                # Special handling for IN-FRAG-038: remove Sweet Lime and Chandan
                corrected_general = ['Ruh Khus (Wild Vetiver)', 'Green Vetiver Root']
                scent['top_notes'] = []
                scent['middle_notes'] = []
                scent['base_notes'] = []
                scent['notes_general'] = corrected_general
                
                corrections.append({
                    "record_id": rid,
                    "field": "scent_structure",
                    "previous_value": {
                        "top_notes": prev_top,
                        "middle_notes": prev_mid,
                        "base_notes": prev_base,
                        "notes_general": prev_general
                    },
                    "corrected_value": {
                        "top_notes": [],
                        "middle_notes": [],
                        "base_notes": [],
                        "notes_general": corrected_general
                    },
                    "reason": "Removed unsupported notes ('Sweet Lime', 'Chandan') and converted artificial 3-tier pyramid into linear single-botanical profile.",
                    "source_evidence": "Authentic Kannauj Ruh Khus is 100% wild vetiver root hydro-distillate in copper degs; source documentation contains neither lime nor sandalwood.",
                    "correction_type": "PYRAMID_AND_NOTE_CORRECTION"
                })
            else:
                # Deduplicate notes in order of appearance
                all_notes = []
                for n in prev_top + prev_mid + prev_base:
                    if n and n not in all_notes:
                        all_notes.append(n)
                
                scent['top_notes'] = []
                scent['middle_notes'] = []
                scent['base_notes'] = []
                scent['notes_general'] = all_notes
                
                corrections.append({
                    "record_id": rid,
                    "field": "scent_structure",
                    "previous_value": {
                        "top_notes": prev_top,
                        "middle_notes": prev_mid,
                        "base_notes": prev_base,
                        "notes_general": prev_general
                    },
                    "corrected_value": {
                        "top_notes": [],
                        "middle_notes": [],
                        "base_notes": [],
                        "notes_general": all_notes
                    },
                    "reason": "Converted synthetic 3-tier pyramid to linear/general note profile because source documents materials without explicit top/middle/base hierarchy.",
                    "source_evidence": "Product formulation documentation describes single-botanical ruh, deg-bhapka attar, or linear blend without tiered olfactory pyramid.",
                    "correction_type": "PYRAMID_CORRECTION"
                })

        # 3. Heritage Classifications
        if rid in heritage_fix_ids:
            prev_heritage = dict(r.get('heritage', {}))
            r['heritage'] = {
                "is_heritage": False,
                "category": None,
                "heritage_materials": [],
                "distillation_method": None,
                "region": prev_heritage.get('region'),
                "heritage_relationship": None
            }
            corrections.append({
                "record_id": rid,
                "field": "heritage",
                "previous_value": prev_heritage,
                "corrected_value": r['heritage'],
                "reason": "Removed unsupported heritage classification. Modern FMCG/mass-market commercial fragrances were improperly tagged as heritage by automated heuristic.",
                "source_evidence": "Brand and product are modern commercial fine fragrances produced with modern compounding; no traditional Deg-Bhapka, GI-tag, or generational heritage distillation.",
                "correction_type": "HERITAGE_CLASSIFICATION_CORRECTION"
            })

        # 4. Duplicates
        if rid == 'IN-FRAG-084':
            prev_status = r.get('status')
            r['status'] = 'DUPLICATE_OF'
            r['duplicate_of'] = 'IN-FRAG-031'
            r['import_action'] = 'DO_NOT_IMPORT'
            corrections.append({
                "record_id": rid,
                "field": "status",
                "previous_value": prev_status,
                "corrected_value": "DUPLICATE_OF",
                "reason": "Explicitly marked as duplicate of IN-FRAG-031 (existing SQLite ID 35) to prevent duplicate import while preserving record for audit history.",
                "source_evidence": "Same product ('First Rain / Mitti' by Isak Fragrances) already cataloged under IN-FRAG-031.",
                "correction_type": "DUPLICATE_RESOLUTION"
            })
            
        if rid == 'IN-FRAG-085':
            prev_status = r.get('status')
            r['status'] = 'DUPLICATE_OF'
            r['duplicate_of'] = 'IN-FRAG-032'
            r['import_action'] = 'DO_NOT_IMPORT'
            corrections.append({
                "record_id": rid,
                "field": "status",
                "previous_value": prev_status,
                "corrected_value": "DUPLICATE_OF",
                "reason": "Explicitly marked as duplicate of IN-FRAG-032 (existing SQLite ID 36) to avoid creating duplicate record for SQLite ID 36.",
                "source_evidence": "Same product ('1854' by Isak Fragrances) already cataloged under IN-FRAG-032.",
                "correction_type": "DUPLICATE_RESOLUTION"
            })

        # 5. Product Provenance
        if rid in root_new_ids:
            prov = r.setdefault('provenance', {})
            sources = prov.setdefault('sources', [])
            prev_url = sources[0].get('url') if sources else None
            
            if rid in verified_pdp_urls:
                new_url = verified_pdp_urls[rid]
                if sources:
                    sources[0]['url'] = new_url
                    sources[0]['source_type'] = 'Tier 1 — Official Product Detail Page'
                prov['source_status'] = 'VERIFIED_PDP'
                prov['data_confidence'] = 0.98
                corrections.append({
                    "record_id": rid,
                    "field": "provenance.sources[0].url",
                    "previous_value": prev_url,
                    "corrected_value": new_url,
                    "reason": "Upgraded root domain URL to verified official product-detail URL.",
                    "source_evidence": f"Verified live product page on {new_url}",
                    "correction_type": "PROVENANCE_PDP_RECOVERY"
                })
            else:
                prov['source_status'] = 'SOURCE_REVIEW_REQUIRED'
                review_notes = prov.setdefault('notes_requiring_review', [])
                msg = "SOURCE_REVIEW_REQUIRED: Product-specific PDP URL not verified; root domain cited."
                if msg not in review_notes:
                    review_notes.append(msg)
                prov['data_confidence'] = 0.85
                corrections.append({
                    "record_id": rid,
                    "field": "provenance.source_status",
                    "previous_value": "UNFLAGGED_ROOT",
                    "corrected_value": "SOURCE_REVIEW_REQUIRED",
                    "reason": "Flagged as SOURCE_REVIEW_REQUIRED with calibrated confidence (0.85) because only root homepage domain was verified; product-specific PDP URL is required.",
                    "source_evidence": f"Root domain ({prev_url}) does not explicitly verify specific composition notes.",
                    "correction_type": "PROVENANCE_AUDIT_FLAG"
                })

    # Save corrected manifest
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        
    # Save corrections log
    with open(corrections_path, 'w', encoding='utf-8') as f:
        json.dump(corrections, f, indent=2, ensure_ascii=False)

    print(f"Successfully processed {len(manifest)} manifest records.")
    print(f"Generated {len(corrections)} correction records in {corrections_path}.")

if __name__ == '__main__':
    run_corrections()
