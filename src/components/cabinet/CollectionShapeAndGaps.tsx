import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Compass, Sparkles, Droplet, Sun, CloudRain, Flame, Snowflake, ArrowRight, ShoppingBag, CheckCircle2, ChevronDown } from 'lucide-react';
import { Fragrance } from '../../types.js';
import { extractFragranceVector8D, olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface CollectionShapeAndGapsProps {
  ownedFragrances: Fragrance[];
  allFragrances?: Fragrance[];
  onExploreDirection?: (queryOrFamily: string) => void;
}

export const CollectionShapeAndGaps: React.FC<CollectionShapeAndGapsProps> = ({
  ownedFragrances,
  allFragrances = [],
  onExploreDirection
}) => {
  const [candidateFragId, setCandidateFragId] = useState<number>(() => {
    const unowned = allFragrances.filter(f => !ownedFragrances.some(o => o.id === f.id));
    return unowned[0]?.id || allFragrances[0]?.id || 1;
  });
  const [isPurchaseEvaluatorOpen, setIsPurchaseEvaluatorOpen] = useState(false);
  const collectionData = useMemo(() => {
    const list = ownedFragrances || [];
    const total = list.length || 1;

    // Family counts
    const famMap: Record<string, number> = {};
    list.forEach(f => {
      const fam = f.fragrance_family || 'Woody';
      famMap[fam] = (famMap[fam] || 0) + 1;
    });

    const sortedFamilies = Object.entries(famMap)
      .map(([family, count]) => ({ family, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);

    const dominant = sortedFamilies[0]?.family || 'Woody';

    // Freshness vs Warmth average
    let freshSum = 0;
    let warmSum = 0;
    let intenseSum = 0;

    list.forEach(f => {
      const vec = extractFragranceVector8D(f);
      freshSum += vec.freshness;
      warmSum += (vec.woody + vec.warm_resinous_spices) / 2;
      intenseSum += vec.intensity;
    });

    const avgFreshness = Math.round(freshSum / total);
    const avgWarmth = Math.round(warmSum / total);
    const avgIntensity = Math.round(intenseSum / total);

    // Seasonal breakdown
    const seasons = [
      { name: 'Summer', icon: Sun, count: list.filter(f => (f.season || '').includes('Summer')).length },
      { name: 'Monsoon', icon: CloudRain, count: list.filter(f => (f.season || '').includes('Monsoon')).length },
      { name: 'Fall', icon: Sparkles, count: list.filter(f => (f.season || '').includes('Fall')).length },
      { name: 'Winter', icon: Snowflake, count: list.filter(f => (f.season || '').includes('Winter')).length },
    ];

    // Gaps detection
    const hasAquatic = list.some(f => (f.fragrance_family || '').toLowerCase().includes('aquatic') || (f.description || '').toLowerCase().includes('marine'));
    const hasMitti = list.some(f => (f.description || '').toLowerCase().includes('mitti') || (f.name || '').toLowerCase().includes('mitti'));
    const hasOud = list.some(f => (f.fragrance_family || '').toLowerCase().includes('oud') || (f.description || '').toLowerCase().includes('oud'));
    const hasCitrusFresh = list.some(f => (f.fragrance_family || '').toLowerCase().includes('citrus') || (f.fragrance_family || '').toLowerCase().includes('fresh'));

    const gaps = [];
    if (!hasAquatic) {
      gaps.push({
        id: 'aquatic',
        category: 'High-Heat Marine / Aquatic',
        description: 'Underrepresented in your current collection: a crisp oceanic accord for high humidity and sweltering summer afternoons.',
        exploreQuery: 'aquatic'
      });
    }
    if (!hasMitti) {
      gaps.push({
        id: 'mitti',
        category: 'Artisanal Baked Earth / Mitti Attar',
        description: 'Underrepresented in your current collection: a traditional geosmin petrichor formulation for cooling monsoon evenings.',
        exploreQuery: 'mitti'
      });
    }
    if (!hasOud) {
      gaps.push({
        id: 'oud',
        category: 'Resinous Assam Oud / Nocturnal Leather',
        description: 'Underrepresented in your current collection: a nocturnal woody foundation for formal winter gatherings.',
        exploreQuery: 'oud'
      });
    }
    if (!hasCitrusFresh && list.length >= 3) {
      gaps.push({
        id: 'citrus',
        category: 'Solar Sparkling Citrus / Neroli',
        description: 'Underrepresented in your current collection: an invigorating citrus burst to temper denser woody base layers.',
        exploreQuery: 'citrus'
      });
    }

    return {
      sortedFamilies,
      dominant,
      avgFreshness,
      avgWarmth,
      avgIntensity,
      seasons,
      gaps
    };
  }, [ownedFragrances]);

  return (
    <div className="space-y-6">
      {/* SECTION 1: THE SHAPE OF YOUR COLLECTION */}
      <div className="rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#16120E] to-[#0A0806] p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structural Balance</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100 mt-1">
            The Shape of Your Collection
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Your collection currently leans toward{' '}
            <span className="text-amber-300 font-semibold">{collectionData.dominant}</span> accords.
            The sensory architecture reveals a warmth-to-freshness equilibrium of{' '}
            <span className="text-amber-300 font-mono">{collectionData.avgWarmth}%</span> warmth vs{' '}
            <span className="text-teal-300 font-mono">{collectionData.avgFreshness}%</span> volatile freshness.
          </p>
        </div>

        {/* Metrics Bar & Season Balance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Scent Family Dominance */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Primary Accord Territories:
            </h4>
            <div className="space-y-2">
              {collectionData.sortedFamilies.slice(0, 4).map(f => (
                <div key={f.family} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-stone-300">{f.family}</span>
                    <span className="font-mono text-amber-300">{f.count} ({f.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Coverage Distribution */}
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Seasonal Alignment:
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {collectionData.seasons.map(s => {
                const Icon = s.icon;
                const status = s.count >= 2 ? 'Optimal' : s.count === 1 ? 'Balanced' : 'Low';
                const statusColor = status === 'Optimal' ? 'text-amber-300' : status === 'Balanced' ? 'text-stone-300' : 'text-stone-500';

                return (
                  <div key={s.name} className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-stone-200">{s.name}</span>
                    </div>
                    <span className={`text-xs font-mono font-medium ${statusColor}`}>
                      {s.count} ({status})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: COLLECTION GAPS & FRONTIER TERRITORIES */}
      {collectionData.gaps.length > 0 && (
        <div className="rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#18120D] to-[#0D0A08] p-6 sm:p-8 shadow-2xl space-y-4 text-stone-100">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Frontier Directions</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
            Underrepresented In Your Current Collection
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Expanding into these olfactory coordinates will unlock rich contrasts and new layering harmonies without duplicating your existing bottles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {collectionData.gaps.map(gap => (
              <div
                key={gap.id}
                className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex flex-col justify-between space-y-3 group hover:border-amber-500/40 transition"
              >
                <div>
                  <span className="text-xs font-mono text-amber-400 font-semibold block">
                    {gap.category}
                  </span>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {gap.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onExploreDirection && onExploreDirection(gap.exploreQuery)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>Explore This Direction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: ACQUISITION EVALUATOR (SHOULD I BUY IT?) */}
      {allFragrances.length > 0 && (
        <div className="rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#16120E] via-[#100D0A] to-[#0A0806] p-6 sm:p-8 shadow-2xl space-y-4 text-stone-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Acquisition Analysis &bull; Purchase Predictor</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-100 mt-1">
                Should I Buy It? — Intelligent Overlap Predictor
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsPurchaseEvaluatorOpen(prev => !prev)}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs text-stone-300 flex items-center gap-1 cursor-pointer"
            >
              <span>{isPurchaseEvaluatorOpen ? 'Collapse' : 'Evaluate Candidate'}</span>
              <motion.div animate={{ rotate: isPurchaseEvaluatorOpen ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          <p className="text-xs text-stone-400 max-w-2xl">
            Test any candidate fragrance against your owned collection to calculate redundancy, twin overlap, and projected annual wear frequency.
          </p>

          <AnimatePresence>
            {isPurchaseEvaluatorOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-3 border-t border-stone-800 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label htmlFor="candidate-frag-select" className="text-xs font-mono text-stone-400 uppercase tracking-wider shrink-0">
                    Select Candidate:
                  </label>
                  <select
                    id="candidate-frag-select"
                    value={candidateFragId}
                    onChange={(e) => setCandidateFragId(Number(e.target.value))}
                    className="w-full sm:max-w-md h-10 px-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {allFragrances.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.brand} ({f.fragrance_family})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const candidate = allFragrances.find(f => f.id === candidateFragId) || allFragrances[0];
                  const decision = olfactoryIntelligence.analyzePurchaseDecision(candidate, ownedFragrances.length > 0 ? ownedFragrances : allFragrances.slice(0, 4));

                  const badgeColors: Record<string, string> = {
                    STRONG_ADDITION: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
                    CONSIDER_DECANT_FIRST: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
                    REDUNDANT_DUPLICATE: 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                  };

                  return (
                    <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                        <div>
                          <h4 className="font-serif text-lg font-medium text-stone-100">
                            {candidate.name} <span className="text-stone-400 font-sans text-sm">by {candidate.brand}</span>
                          </h4>
                          <span className="text-xs text-stone-400">{candidate.fragrance_family} &bull; {candidate.concentration || 'Parfum'}</span>
                        </div>
                        <span className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold uppercase tracking-wider self-start sm:self-auto ${badgeColors[decision.recommendation] || 'bg-stone-800 text-stone-300'}`}>
                          {decision.recommendation.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 uppercase block">Wardrobe Overlap</span>
                          <span className="text-2xl font-serif font-bold text-amber-300 mt-0.5 block">{decision.redundancyScore}%</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {decision.redundancyScore > 70 ? 'High accord overlap' : 'Distinct scent profile'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 uppercase block">Closest Owned Twin</span>
                          <span className="text-sm font-medium text-stone-200 mt-1 block truncate">
                            {decision.mostSimilarOwnedFragrance.name}
                          </span>
                          <span className="text-[10px] text-stone-400 block truncate">
                            {decision.mostSimilarOwnedFragrance.brand}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800">
                          <span className="text-[10px] font-mono text-stone-400 uppercase block">Projected Wear</span>
                          <span className="text-2xl font-serif font-bold text-teal-300 mt-0.5 block">{decision.estimatedWearDaysPerYear}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">days / year</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 leading-relaxed">
                        {decision.explanation}
                      </p>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
