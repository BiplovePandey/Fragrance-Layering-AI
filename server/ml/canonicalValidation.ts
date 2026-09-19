import {
  CanonicalFragranceImport,
  CanonicalImportValidationResult,
  CanonicalImportResolution,
  Fragrance
} from '../../src/types.js';

/**
 * Validates array of strings
 */
export function validateStringArray(arr: any, fieldName: string): { valid: boolean; error?: string; value: string[] } {
  if (arr === null || arr === undefined) {
    return { valid: true, value: [] };
  }
  if (!Array.isArray(arr)) {
    return { valid: false, error: `${fieldName} must be an array of strings` , value: [] };
  }
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'string') {
      return { valid: false, error: `${fieldName}[${i}] must be a string`, value: [] };
    }
  }
  return { valid: true, value: arr.map(s => s.trim()).filter(Boolean) };
}

/**
 * Validates 8D numerical vector
 */
export function validate8DVector(vec: any): { valid: boolean; error?: string; value?: number[] } {
  if (!Array.isArray(vec)) {
    return { valid: false, error: 'Vector must be an array' };
  }
  if (vec.length !== 8) {
    return { valid: false, error: `Vector must have exactly 8 dimensions, received ${vec.length}` };
  }
  const parsed: number[] = [];
  for (let i = 0; i < 8; i++) {
    const val = Number(vec[i]);
    if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
      return { valid: false, error: `Vector[${i}] must be a finite number, received ${vec[i]}` };
    }
    parsed.push(Number(val.toFixed(4)));
  }
  return { valid: true, value: parsed };
}

/**
 * Validates canonical projection values
 */
export function validateProjection(proj: any): { valid: boolean; error?: string; value: string | null } {
  if (!proj) return { valid: true, value: null };
  const allowed = ['intimate', 'moderate', 'strong', 'room-filling'];
  const normalized = String(proj).toLowerCase().trim();
  if (!allowed.includes(normalized)) {
    return { valid: false, error: `Invalid projection '${proj}'. Must be one of: ${allowed.join(', ')}`, value: null };
  }
  return { valid: true, value: normalized };
}

/**
 * Normalizes string for canonical matching
 */
export function normalizeKey(str: string): string {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Computes deterministic vector confidence based on completeness of inputs
 *
 * Formula:
 * Base: 0.50
 * + 0.15 if structured notes exist in all 3 tiers (top, middle/heart, base)
 * + 0.10 if fragrance family is explicitly documented and known
 * + 0.10 if intensity, sweetness, and freshness are explicitly documented (not default fallback)
 * + 0.10 if longevity or concentration is verified
 * + 0.05 if accords or heritage materials are documented
 * Capped between 0.20 and 0.99
 */
export function calculateVectorConfidence(fragrance: {
  top_notes?: string[];
  middle_notes?: string[];
  base_notes?: string[];
  fragrance_family?: string;
  intensity?: number;
  sweetness?: number;
  freshness?: number;
  longevity?: string;
  concentration?: string;
  accords?: string[];
  heritage_materials?: string[];
}): number {
  let score = 0.50;

  const hasTop = Array.isArray(fragrance.top_notes) && fragrance.top_notes.length > 0;
  const hasMid = Array.isArray(fragrance.middle_notes) && fragrance.middle_notes.length > 0;
  const hasBase = Array.isArray(fragrance.base_notes) && fragrance.base_notes.length > 0;
  const hasGeneral = Array.isArray((fragrance as any).notes_general) && (fragrance as any).notes_general.length > 0;

  if (hasTop && hasMid && hasBase) {
    score += 0.15;
  } else if ((hasTop && hasBase) || (hasMid && hasBase) || hasGeneral) {
    score += 0.08;
  }

  if (fragrance.fragrance_family && fragrance.fragrance_family.trim().length > 0) {
    score += 0.10;
  }

  if (
    typeof fragrance.intensity === 'number' &&
    typeof fragrance.sweetness === 'number' &&
    typeof fragrance.freshness === 'number'
  ) {
    score += 0.10;
  }

  if (fragrance.concentration && fragrance.concentration.trim().length > 0) {
    score += 0.10;
  }

  if ((Array.isArray(fragrance.accords) && fragrance.accords.length > 0) ||
      (Array.isArray(fragrance.heritage_materials) && fragrance.heritage_materials.length > 0)) {
    score += 0.05;
  }

  return Math.min(0.99, Math.max(0.20, Number(score.toFixed(2))));
}

/**
 * Validates a Canonical Fragrance Import object against quality rules
 */
export function validateCanonicalImport(record: any): CanonicalImportValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: ['Record must be a non-null object'], warnings };
  }

  // 1. Identity validation
  if (!record.identity || typeof record.identity !== 'object') {
    errors.push('Missing identity block');
  } else {
    if (!record.identity.name || typeof record.identity.name !== 'string' || !record.identity.name.trim()) {
      errors.push('identity.name is required');
    }
    if (!record.identity.brand_name || typeof record.identity.brand_name !== 'string' || !record.identity.brand_name.trim()) {
      errors.push('identity.brand_name is required');
    }
    if (record.identity.gender && !['unisex', 'masculine', 'feminine'].includes(record.identity.gender.toLowerCase())) {
      warnings.push(`Unrecognized gender '${record.identity.gender}', defaulting to unisex`);
    }
  }

  // 2. Scent structure validation
  if (!record.scent_structure || typeof record.scent_structure !== 'object') {
    errors.push('Missing scent_structure block');
  } else {
    const topCheck = validateStringArray(record.scent_structure.top_notes, 'scent_structure.top_notes');
    const midCheck = validateStringArray(record.scent_structure.middle_notes, 'scent_structure.middle_notes');
    const baseCheck = validateStringArray(record.scent_structure.base_notes, 'scent_structure.base_notes');
    const genCheck = validateStringArray((record.scent_structure as any).notes_general, 'scent_structure.notes_general');
    const accordsCheck = validateStringArray(record.scent_structure.accords, 'scent_structure.accords');

    if (!topCheck.valid) errors.push(topCheck.error!);
    if (!midCheck.valid) errors.push(midCheck.error!);
    if (!baseCheck.valid) errors.push(baseCheck.error!);
    if (!genCheck.valid) errors.push(genCheck.error!);
    if (!accordsCheck.valid) errors.push(accordsCheck.error!);

    const totalNotes = (topCheck.value?.length || 0) + (midCheck.value?.length || 0) + (baseCheck.value?.length || 0) + (genCheck.value?.length || 0);
    if (totalNotes === 0 && (!accordsCheck.value || accordsCheck.value.length === 0)) {
      warnings.push('No notes or accords documented; olfactory features will rely solely on family defaults');
    }
  }

  // 3. Performance validation
  if (record.performance) {
    if (record.performance.projection !== undefined && record.performance.projection !== null) {
      const projCheck = validateProjection(record.performance.projection);
      if (!projCheck.valid) errors.push(projCheck.error!);
    }
    if (record.performance.intensity !== undefined) {
      const val = Number(record.performance.intensity);
      if (Number.isNaN(val) || val < 1 || val > 10) errors.push('performance.intensity must be between 1 and 10');
    }
    if (record.performance.sweetness !== undefined) {
      const val = Number(record.performance.sweetness);
      if (Number.isNaN(val) || val < 1 || val > 10) errors.push('performance.sweetness must be between 1 and 10');
    }
    if (record.performance.freshness !== undefined) {
      const val = Number(record.performance.freshness);
      if (Number.isNaN(val) || val < 1 || val > 10) errors.push('performance.freshness must be between 1 and 10');
    }
  }

  // 4. Context validation
  if (record.context) {
    const todCheck = validateStringArray(record.context.time_of_day, 'context.time_of_day');
    if (!todCheck.valid) errors.push(todCheck.error!);
    const seasonCheck = validateStringArray(record.context.seasons, 'context.seasons');
    if (!seasonCheck.valid) errors.push(seasonCheck.error!);
    const occCheck = validateStringArray(record.context.occasions, 'context.occasions');
    if (!occCheck.valid) errors.push(occCheck.error!);
  }

  // 5. Heritage validation
  if (record.heritage) {
    const matCheck = validateStringArray(record.heritage.heritage_materials, 'heritage.heritage_materials');
    if (!matCheck.valid) errors.push(matCheck.error!);
  }

  // 6. Provenance validation
  if (record.provenance) {
    if (record.provenance.data_confidence !== undefined) {
      const conf = Number(record.provenance.data_confidence);
      if (Number.isNaN(conf) || conf < 0 || conf > 1) {
        errors.push('provenance.data_confidence must be between 0.0 and 1.0');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Deduplication & Conflict Resolution Engine
 *
 * Canonical identity is defined by:
 * normalized(brand) + "::" + normalized(name) + "::" + normalized(concentration)
 */
export function resolveImportConflict(
  incoming: CanonicalFragranceImport,
  existingCatalog: Fragrance[]
): CanonicalImportResolution {
  const brandKey = normalizeKey(incoming.identity.brand_name);
  const nameKey = normalizeKey(incoming.identity.name);
  const concKey = normalizeKey(incoming.identity.concentration || incoming.identity.format || 'edp');

  const incomingIdentity = `${brandKey}::${nameKey}::${concKey}`;

  const match = existingCatalog.find(f => {
    const existingBrandKey = normalizeKey(f.brand_name || f.brand);
    const existingNameKey = normalizeKey(f.name);
    const existingConcKey = normalizeKey(f.concentration || f.format || 'edp');
    return `${existingBrandKey}::${existingNameKey}::${existingConcKey}` === incomingIdentity;
  });

  if (!match) {
    return {
      action: 'insert',
      reason: 'No matching brand, name, and concentration found in existing catalog.'
    };
  }

  const existingConfidence = match.data_confidence ?? 0.95;
  const incomingConfidence = incoming.provenance?.data_confidence ?? 0.80;

  // RULE 7: Never allow lower-confidence data to overwrite higher-confidence verified data.
  if (incomingConfidence <= existingConfidence) {
    return {
      action: 'skip',
      existingFragrance: match,
      reason: `Existing verified record has higher or equal confidence (${existingConfidence.toFixed(2)} vs incoming ${incomingConfidence.toFixed(2)}). Preserving verified data.`
    };
  }

  return {
    action: 'update',
    existingFragrance: match,
    reason: `Incoming record has higher confidence (${incomingConfidence.toFixed(2)} > ${existingConfidence.toFixed(2)}). Candidate for verified update.`
  };
}
