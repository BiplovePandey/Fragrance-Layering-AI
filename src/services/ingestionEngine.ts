import { AIProductSubmission, Fragrance } from '../types.js';

export const INITIAL_SUBMISSIONS: AIProductSubmission[] = [
  {
    id: 'sub-101',
    brand: 'Nisara Perfumes',
    product: 'Santal Dusk Extrait',
    collection: 'Artisanal Wood Series',
    concentration: 'Extrait de Parfum (30%)',
    format: 'Extrait de Parfum',
    notes: {
      top: ['Cardamom', 'Violet Leaf', 'Australian Lime'],
      heart: ['Papyrus', 'Iris', 'Cedarwood'],
      base: ['Mysore Sandalwood', 'Leather', 'Golden Amber']
    },
    accords: ['Woody', 'Powdery', 'Warm Spicy', 'Leather'],
    description: 'A dense, nocturnal exploration of creamy heartwood layered with powdery Florentine iris and smoky cardamom pods.',
    country: 'India',
    launch_year: 2025,
    perfumer: 'Arunav Sengupta',
    source_url: 'https://nisaraperfumes.example.com/santal-dusk',
    status: 'approved',
    confidence_score: 96,
    validation_flags: {
      passFineFragrance: true,
      duplicateDetected: false,
      completeData: true,
      concentrationValid: true
    },
    submitted_by: 'Community_Curator',
    submitted_at: 'Yesterday'
  },
  {
    id: 'sub-102',
    brand: 'Bombay Shaving Company',
    product: 'Velvet Spice Deodorant Body Spray 150ml',
    collection: 'Daily Body Essentials',
    concentration: 'Aerosol Gas Body Spray (<2%)',
    format: 'Deodorant / Body Spray',
    notes: {
      top: ['Citrus Gas'],
      heart: ['Synthetic Lavender'],
      base: ['Musk']
    },
    accords: ['Fresh Synthetic'],
    description: 'High pressure aerosol propellant with anti-perspirant agents and generic spice fragrance oils.',
    country: 'India',
    source_url: 'https://ecommerce.example.com/bsc-deodorant',
    status: 'rejected',
    confidence_score: 24,
    validation_flags: {
      passFineFragrance: false, // Explicitly rejected: aerosol deodorant
      duplicateDetected: false,
      completeData: false,
      concentrationValid: false
    },
    submitted_by: 'Auto_Scraper_Bot',
    submitted_at: '3 hours ago'
  },
  {
    id: 'sub-103',
    brand: 'Gulabsingh Johrimal',
    product: 'Shamama Al-Sharq Attar',
    collection: 'Purani Dilli Master Reserves',
    concentration: 'Pure Perfume Oil (100%)',
    format: 'Attar',
    notes: {
      top: ['Saffron', 'Mace', 'Nutmeg'],
      heart: ['Kapur Kachri', 'Nagarmotha', 'Damask Rose'],
      base: ['Aged Sandalwood Oil', 'Black Musk', 'Amber Resin']
    },
    accords: ['Warm Spicy', 'Resinous', 'Earthy', 'Herbal'],
    description: 'Authentic 40-herb winter compound distilled over sandalwood oil in Dariba Kalan copper vats.',
    country: 'India',
    launch_year: 1988,
    perfumer: 'Ram Singh Gundhi',
    source_url: 'https://gulabsingh.example.com/shamama-sharq',
    status: 'pending',
    confidence_score: 94,
    validation_flags: {
      passFineFragrance: true,
      duplicateDetected: false,
      completeData: true,
      concentrationValid: true
    },
    submitted_by: 'HeritageArchivist',
    submitted_at: 'Just now'
  }
];

export function validateFineFragranceCandidate(candidate: Partial<AIProductSubmission>, existingCatalog: Fragrance[] = []): {
  flags: AIProductSubmission['validation_flags'];
  confidenceScore: number;
  reason: string;
  isValid: boolean;
} {
  const name = (candidate.product || '').toLowerCase();
  const format = (candidate.format || '').toLowerCase();
  const concentration = (candidate.concentration || '').toLowerCase();
  const desc = (candidate.description || '').toLowerCase();

  // Banned non-fine-fragrance keywords
  const bannedKeywords = ['deodorant', 'body spray', 'aerosol', 'talcum', 'talc', 'body lotion', 'shower gel', 'shampoo', 'body wash', 'gift pack with pouch', 'comb set'];
  const hasBannedWord = bannedKeywords.some(k => name.includes(k) || format.includes(k) || desc.includes(k));

  const validFormats = ['eau de parfum', 'edp', 'eau de toilette', 'edt', 'extrait', 'parfum', 'attar', 'ittar', 'perfume oil', 'solid perfume', 'pure oud'];
  const hasValidFormat = validFormats.some(f => format.includes(f) || concentration.includes(f) || name.includes(f));

  const passFineFragrance = !hasBannedWord && (hasValidFormat || Boolean(candidate.notes?.top?.length));

  // Duplicate detection
  const duplicateDetected = existingCatalog.some(f =>
    f.name.toLowerCase().trim() === (candidate.product || '').toLowerCase().trim() &&
    f.brand.toLowerCase().trim() === (candidate.brand || '').toLowerCase().trim()
  );

  const completeData = Boolean(
    candidate.brand &&
    candidate.product &&
    (candidate.notes?.top?.length || candidate.notes?.base?.length) &&
    candidate.description
  );

  const concentrationValid = Boolean(candidate.concentration && candidate.concentration.length > 2);

  let confidenceScore = 40;
  if (passFineFragrance) confidenceScore += 30;
  if (!duplicateDetected) confidenceScore += 10;
  if (completeData) confidenceScore += 15;
  if (concentrationValid) confidenceScore += 5;

  let reason = '';
  if (!passFineFragrance) {
    reason = 'Strict Fine-Fragrance Policy: Aerosol deodorants, body sprays, talcs, lotions, and gift pouches are excluded.';
  } else if (duplicateDetected) {
    reason = 'Duplicate Detected: This perfume already exists in the Olfactory AI master catalog.';
  } else if (!completeData) {
    reason = 'Incomplete Note Pyramid: Requires top, heart, or base notes and authentic house description.';
  } else {
    reason = 'High-confidence fine fragrance candidate. Verified concentration and notes taxonomy.';
  }

  const isValid = passFineFragrance && !duplicateDetected && !hasBannedWord;

  return {
    flags: {
      passFineFragrance,
      duplicateDetected,
      completeData,
      concentrationValid
    },
    confidenceScore,
    reason,
    isValid
  };
}
