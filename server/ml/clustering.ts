import { Fragrance, ClusterInfo } from '../../src/types.js';
import { FEATURE_NAMES } from './features.js';

export interface KMeansResult {
  clusterAssignments: Map<number, number>; // fragranceId -> clusterIndex
  centroids: number[][];
  clusterInfos: ClusterInfo[];
}

function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function performKMeansClustering(
  fragrances: (Fragrance & { vector: number[] })[],
  k: number = 5,
  maxIterations: number = 30
): KMeansResult {
  if (fragrances.length === 0) {
    return { clusterAssignments: new Map(), centroids: [], clusterInfos: [] };
  }

  const actualK = Math.min(k, fragrances.length);
  const dimension = fragrances[0].vector.length;

  // Initialize centroids using K-Means++ style spread
  const centroids: number[][] = [];
  centroids.push([...fragrances[0].vector]);

  for (let c = 1; c < actualK; c++) {
    let bestCandidate: number[] = fragrances[c % fragrances.length].vector;
    let maxMinDist = -1;

    for (const frag of fragrances) {
      // Find distance to closest existing centroid
      let minDist = Infinity;
      for (const cent of centroids) {
        const d = euclideanDistance(frag.vector, cent);
        if (d < minDist) minDist = d;
      }
      if (minDist > maxMinDist) {
        maxMinDist = minDist;
        bestCandidate = [...frag.vector];
      }
    }
    centroids.push(bestCandidate);
  }

  const assignments = new Map<number, number>();

  // Iterative refinement
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assignment step
    for (const frag of fragrances) {
      let closestCentroid = 0;
      let minDistance = Infinity;

      for (let c = 0; c < actualK; c++) {
        const dist = euclideanDistance(frag.vector, centroids[c]);
        if (dist < minDistance) {
          minDistance = dist;
          closestCentroid = c;
        }
      }

      if (assignments.get(frag.id) !== closestCentroid) {
        assignments.set(frag.id, closestCentroid);
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // Update centroids
    const sums: number[][] = Array.from({ length: actualK }, () => Array(dimension).fill(0));
    const counts: number[] = Array(actualK).fill(0);

    for (const frag of fragrances) {
      const clusterIdx = assignments.get(frag.id) ?? 0;
      counts[clusterIdx]++;
      for (let d = 0; d < dimension; d++) {
        sums[clusterIdx][d] += frag.vector[d];
      }
    }

    for (let c = 0; c < actualK; c++) {
      if (counts[c] > 0) {
        for (let d = 0; d < dimension; d++) {
          centroids[c][d] = sums[c][d] / counts[c];
        }
      }
    }
  }

  // Generate dynamic human-readable labels from dominant centroid features
  const clusterInfos: ClusterInfo[] = [];

  for (let c = 0; c < actualK; c++) {
    const centroid = centroids[c];
    const rankedFeatures = FEATURE_NAMES.map((name, idx) => ({
      feature: name,
      value: Number(centroid[idx].toFixed(2))
    })).sort((a, b) => b.value - a.value);

    const dominant1 = rankedFeatures[0];
    const dominant2 = rankedFeatures[1];

    let clusterName = `${dominant1.feature.charAt(0).toUpperCase() + dominant1.feature.slice(1)} & ${dominant2.feature.charAt(0).toUpperCase() + dominant2.feature.slice(1)}`;
    if (dominant1.feature === 'sweetness' && dominant2.feature === 'warm_resinous_spices') {
      clusterName = 'Warm Amber & Gourmand Indulgence';
    } else if (dominant1.feature === 'freshness') {
      clusterName = 'Solar Freshness & Marine Breeze';
    } else if (dominant1.feature === 'woody' || dominant2.feature === 'woody') {
      clusterName = 'Noble Woods & Earthy Depths';
    } else if (dominant1.feature === 'floral' || dominant2.feature === 'floral') {
      clusterName = 'Opulent Floral Bouquet';
    } else if (dominant1.feature === 'warm_resinous_spices') {
      clusterName = 'Exotic Spices & Smoked Woods';
    } else if (dominant1.feature === 'earthy_clay') {
      clusterName = 'Petrichor Earth & Sacral Roots';
    }

    const members = fragrances.filter(f => assignments.get(f.id) === c);

    clusterInfos.push({
      cluster_id: c,
      name: clusterName,
      description: `Characterized by high ${dominant1.feature} (${Math.round(dominant1.value * 10)}/10) balanced by ${dominant2.feature} (${Math.round(dominant2.value * 10)}/10).`,
      dominant_features: rankedFeatures.slice(0, 4),
      fragrance_count: members.length,
      sample_fragrances: members.slice(0, 3).map(m => ({ id: m.id, name: m.name, brand: m.brand }))
    });
  }

  return {
    clusterAssignments: assignments,
    centroids,
    clusterInfos
  };
}
