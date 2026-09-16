import { Fragrance, ScentEvolutionStep, WeatherCondition } from '../types.js';

export interface SimulationParams {
  fragranceA?: Fragrance | null;
  fragranceB?: Fragrance | null;
  spraysA: number; // 1 - 6
  spraysB?: number; // 0 - 6
  location: 'wrists' | 'neck' | 'chest' | 'collarbone';
  substrate: 'skin' | 'clothing' | 'hair';
  temperature_c: number;
  humidity_pct: number;
}

const TIME_STEPS: { label: ScentEvolutionStep['time_label']; minutes: number; phase: ScentEvolutionStep['dominant_phase'] }[] = [
  { label: '0m', minutes: 0, phase: 'Top Notes Effervescence' },
  { label: '15m', minutes: 15, phase: 'Top Notes Effervescence' },
  { label: '30m', minutes: 30, phase: 'Top Notes Effervescence' },
  { label: '1h', minutes: 60, phase: 'Heart Accord Transition' },
  { label: '2h', minutes: 120, phase: 'Heart Accord Transition' },
  { label: '4h', minutes: 240, phase: 'Heart Accord Transition' },
  { label: '6h', minutes: 360, phase: 'Full Drydown Base Anchor' },
  { label: '8h+', minutes: 480, phase: 'Full Drydown Base Anchor' }
];

export function runScentSimulation(params: SimulationParams): ScentEvolutionStep[] {
  const {
    fragranceA,
    fragranceB,
    spraysA = 2,
    spraysB = 0,
    substrate,
    temperature_c = 24,
    humidity_pct = 60
  } = params;

  if (!fragranceA) {
    return TIME_STEPS.map((step) => ({
      time_label: step.label,
      minutes: step.minutes,
      phase_title: `${step.label} • ${step.phase}`,
      dominant_phase: step.phase,
      projection_radius_feet: 0,
      remaining_intensity_pct: 0,
      active_accords: ['Awaiting flacon selection'],
      description: 'Awaiting flacon selection in laboratory.',
      radar_values: {
        freshness: 5,
        sweetness: 5,
        intensity: 0,
        woody: 5,
        floral: 5,
        warmth: 5
      }
    }));
  }

  // Modifiers
  const totalSprays = spraysA + (spraysB || 0);
  const isClothing = substrate === 'clothing';
  const isHair = substrate === 'hair';

  // Heat evaporation coefficient (faster in heat)
  const heatFactor = Math.max(0.7, Math.min(1.6, temperature_c / 24));
  // Humidity retention coefficient (humid air sustains sillage cloud)
  const humidityFactor = Math.max(0.8, Math.min(1.3, humidity_pct / 60));

  // Volatility rates:
  // Clothing retains top notes 2.5x longer because body heat doesn't flash them off
  const topEvapSpeed = (isClothing ? 0.4 : (isHair ? 0.6 : 1.0)) * heatFactor;
  const baseRetention = (isClothing ? 1.4 : 1.0) / heatFactor;

  const topNotesA = fragranceA.top_notes || [];
  const midNotesA = fragranceA.middle_notes || [];
  const baseNotesA = fragranceA.base_notes || [];

  const topNotesB = fragranceB ? (fragranceB.top_notes || []) : [];
  const midNotesB = fragranceB ? (fragranceB.middle_notes || []) : [];
  const baseNotesB = fragranceB ? (fragranceB.base_notes || []) : [];

  return TIME_STEPS.map((step) => {
    const mins = step.minutes;

    // Intensity decay curve based on half-life
    const decayBase = Math.exp(-mins / (180 * baseRetention));
    const rawIntensity = Math.min(100, Math.round((totalSprays / 3) * (decayBase * 85 + 15)));

    // Projection radius (in feet)
    let radius = 5.5 * (totalSprays / 3) * humidityFactor;
    if (mins < 30) radius *= 1.3; // Initial sillage blast
    else if (mins >= 60 && mins < 240) radius *= 0.85; // Intimate scent bubble
    else if (mins >= 240) radius *= 0.45; // Skin scent / close aura
    radius = Math.round(Math.max(0.8, Math.min(8.0, radius)) * 10) / 10;

    // Active notes & accords at this time stage
    let activeAccords: string[] = [];
    let description = '';

    if (mins <= 30) {
      // Top note dominant
      activeAccords = Array.from(new Set([...topNotesA.slice(0, 3), ...topNotesB.slice(0, 2)]));
      description = `Sparkling opening burst: volatile citrus, aldehydes, and aromatic herbs diffuse vigorously into the atmosphere. Sillage is expansive (${radius} ft).`;
    } else if (mins <= 180) {
      // Heart transition
      activeAccords = Array.from(new Set([...midNotesA.slice(0, 3), ...midNotesB.slice(0, 2), ...topNotesA.slice(0, 1)]));
      description = `Heart blooming phase: top citrus recedes as florals, spices, and tea accords reach thermodynamic equilibrium. Seamless chord synergy.`;
    } else {
      // Base drydown
      activeAccords = Array.from(new Set([...baseNotesA.slice(0, 3), ...baseNotesB.slice(0, 2), ...midNotesA.slice(0, 1)]));
      description = `Deep drydown anchor: heavy macromolecules (sandalwood, amber, oud, vetiver roots) meld with skin chemistry for an intimate, enduring aura.`;
    }

    if (activeAccords.length === 0) {
      activeAccords = ['Ethereal Skin Musk', 'Warm Sandalwood', 'Ambergris'];
    }

    // Dynamic radar values at this point in time
    const topWeight = Math.max(0.1, 1.0 - (mins / 120) * topEvapSpeed);
    const midWeight = mins <= 60 ? (mins / 60) : Math.max(0.2, 1.0 - ((mins - 60) / 240));
    const baseWeight = Math.min(1.0, 0.2 + (mins / 200));

    const avgFreshness = ((fragranceA.freshness || 6) + (fragranceB ? fragranceB.freshness : 6)) / 2;
    const avgSweetness = ((fragranceA.sweetness || 5) + (fragranceB ? fragranceB.sweetness : 5)) / 2;
    const avgIntensity = ((fragranceA.intensity || 6) + (fragranceB ? fragranceB.intensity : 6)) / 2;

    const radar = {
      freshness: Math.round(Math.max(1, Math.min(10, avgFreshness * topWeight))),
      sweetness: Math.round(Math.max(1, Math.min(10, avgSweetness * (0.6 + midWeight * 0.4)))),
      intensity: Math.round(Math.max(1, Math.min(10, (rawIntensity / 10)))),
      woody: Math.round(Math.max(1, Math.min(10, 7 * baseWeight))),
      floral: Math.round(Math.max(1, Math.min(10, 6 * midWeight))),
      warmth: Math.round(Math.max(1, Math.min(10, 5 * baseWeight + (temperature_c >= 28 ? 2 : 0))))
    };

    return {
      time_label: step.label,
      minutes: mins,
      phase_title: `${step.label} • ${step.phase}`,
      dominant_phase: step.phase,
      projection_radius_feet: radius,
      remaining_intensity_pct: rawIntensity,
      active_accords: activeAccords,
      description,
      radar_values: radar
    };
  });
}
