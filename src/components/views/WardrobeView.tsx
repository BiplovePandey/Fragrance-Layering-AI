import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  FlaskConical,
  Plus,
  Trash2,
  AlertCircle,
  PieChart,
  CheckCircle2,
  Droplet,
  ShoppingBag,
  RotateCcw,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Fragrance, WardrobeAnalytics, WeatherCondition } from '../../types.js';
import { MotionCard, MotionButton, MotionNumber, MotionReveal } from '../../motion/components.js';
import { getFlaconLayoutId, SHARED_FLACON_TRANSITION } from '../../motion/sharedElements.js';
import { MOTION_SPRINGS, MOTION_DURATIONS, MOTION_EASINGS } from '../../motion/config.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface WardrobeViewProps {
  allFragrances: Fragrance[];
  ownedFragrances: Fragrance[];
  onAddToCollection: (id: number) => void;
  onRemoveFromCollection: (id: number) => void;
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  weather: WeatherCondition;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  allFragrances,
  ownedFragrances,
  onAddToCollection,
  onRemoveFromCollection,
  onSendToLab,
  weather
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cabinet' | 'analytics' | 'gaps' | 'should_i_buy' | 'rotation'>('cabinet');
  const [selectedFragranceToAdd, setSelectedFragranceToAdd] = useState<number>(allFragrances[0]?.id || 1);
  const [candidateFragId, setCandidateFragId] = useState<number>(allFragrances[3]?.id || 4);
  const [bottleLevels, setBottleLevels] = useState<Record<number, number>>({
    1: 85,
    6: 60,
    7: 90,
    11: 45
  });

  // Calculate deep wardrobe analytics
  const analytics: WardrobeAnalytics = useMemo(() => {
    const safeOwned = Array.isArray(ownedFragrances) ? ownedFragrances : [];
    const safeAll = Array.isArray(allFragrances) ? allFragrances : [];
    const list = safeOwned.length > 0 ? safeOwned : safeAll.slice(0, 4);
    const listLength = list.length || 1;

    // Family distribution
    const familyCounts: Record<string, number> = {};
    list.forEach(f => {
      const fam = f.fragrance_family || 'Woody';
      familyCounts[fam] = (familyCounts[fam] || 0) + 1;
    });

    const familyDistribution = Object.entries(familyCounts).map(([family, count]) => ({
      family,
      count,
      percentage: Math.round((count / listLength) * 100)
    }));

    // Dominant notes
    const noteCounts: Record<string, number> = {};
    list.forEach(f => {
      [...(f.top_notes || []), ...(f.middle_notes || []), ...(f.base_notes || [])].forEach(n => {
        noteCounts[n] = (noteCounts[n] || 0) + 1;
      });
    });

    const dominantNotes = Object.entries(noteCounts)
      .map(([note, count]) => ({ note, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Seasonal coverage
    const seasons = ['Summer', 'Monsoon', 'Fall', 'Winter', 'Spring'] as const;
    const seasonalCoverage = seasons.map(season => {
      const count = list.filter(f => f.season && f.season.includes(season)).length;
      return {
        season,
        coverage: (count >= 2 ? 'Optimal' : (count === 1 ? 'Balanced' : 'Low')) as 'Optimal' | 'Balanced' | 'Low',
        count
      };
    });

    // Collection Gaps
    const hasAquatic = list.some(f => (f.fragrance_family || '').includes('Aquatic') || (f.description || '').includes('marine'));
    const hasEarthyMitti = list.some(f => (f.description || '').includes('mitti') || (f.description || '').includes('petrichor'));
    const hasDarkOud = list.some(f => (f.fragrance_family || '').includes('Oud') || (f.description || '').includes('oud'));

    const collectionGaps = [];
    if (!hasAquatic) {
      collectionGaps.push({
        category: 'Aquatic / High-Heat Marine',
        description: 'Your wardrobe lacks a crisp, high-salinity oceanic fragrance for sweltering summer afternoons.',
        recommendedFragrance: 'Raw by SKINN or Acqua di Gio'
      });
    }
    if (!hasEarthyMitti) {
      collectionGaps.push({
        category: 'Artisanal Petrichor / Mitti Attar',
        description: 'You do not have a traditional baked earth or geosmin perfume for cooling monsoon evenings.',
        recommendedFragrance: 'Kannauj Mitti Attar by Gulabsingh Johrimal'
      });
    }
    if (!hasDarkOud) {
      collectionGaps.push({
        category: 'Resinous Assam Oud / Leather',
        description: 'Missing a deep nocturnal anchor for formal winter celebrations and grand evening events.',
        recommendedFragrance: 'Nox Oud by SKINN by Titan'
      });
    }

    const possibleLayeringCount = Math.round((list.length * (list.length - 1)) / 2);

    return {
      totalBottles: list.length,
      ownedCount: list.length,
      samplesCount: 2,
      wishlistCount: 3,
      familyDistribution,
      dominantNotes,
      seasonalCoverage,
      occasionCoverage: [],
      collectionGaps,
      possibleLayeringCount
    };
  }, [ownedFragrances, allFragrances]);

  const handleLevelChange = (fragId: number, newLevel: number) => {
    setBottleLevels(prev => ({
      ...prev,
      [fragId]: newLevel
    }));
  };

  const safeOwned = Array.isArray(ownedFragrances) ? ownedFragrances : [];
  const safeAll = Array.isArray(allFragrances) ? allFragrances : [];
  const displayedList = safeOwned.length > 0 ? safeOwned : safeAll.slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white text-rose-900 text-xs font-mono-lab mb-2 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-rose-700" />
            <span>Digital Fragrance Wardrobe</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A1613]">
            Curator's Olfactory Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5046] mt-1">
            Organize owned flacons, track testing samples, and unlock{' '}
            <span className="text-amber-800 font-semibold font-mono-lab">
              <MotionNumber value={analytics.possibleLayeringCount} />
            </span>{' '}
            internal layering chords.
          </p>
        </div>

        {/* Sub-Tab Navigation with Liquid Indicator */}
        <div className="flex items-center gap-1 p-1.5 rounded-2xl liquid-glass-pill self-start sm:self-center relative flex-wrap">
          {(['cabinet', 'analytics', 'gaps', 'should_i_buy', 'rotation'] as const).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSubTab(tab)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-mono-lab uppercase tracking-wider transition-colors cursor-pointer z-10 ${
                  isActive ? 'text-[#1A1613] font-bold' : 'text-[#6B6056] hover:text-[#1A1613]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="wardrobe-subtab-indicator"
                    className="absolute inset-0 rounded-xl bg-white/90 border border-white -z-10 shadow-2xs"
                    transition={MOTION_SPRINGS.spatialLayout}
                  />
                )}
                {tab === 'cabinet' && `🗄️ Cabinet (${displayedList.length})`}
                {tab === 'analytics' && '📊 Olfactory DNA'}
                {tab === 'gaps' && `⚠️ Gaps (${analytics?.collectionGaps?.length || 0})`}
                {tab === 'should_i_buy' && '🛍️ Should I Buy This?'}
                {tab === 'rotation' && '🔄 Rotation AI'}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SUB-VIEW 1: Fragrance Cabinet */}
        {activeSubTab === 'cabinet' && (
          <motion.div
            key="cabinet"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
            className="space-y-6"
          >
            {/* Add Bottle Form */}
            <div className="p-4 rounded-3xl liquid-glass flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-lab uppercase text-amber-900 font-semibold">
                  Add Flacon to Wardrobe:
                </span>
                <select
                  value={selectedFragranceToAdd}
                  onChange={(e) => setSelectedFragranceToAdd(Number(e.target.value))}
                  className="px-3.5 py-2 rounded-xl liquid-glass-inset text-[#1A1613] text-xs focus:outline-none cursor-pointer"
                >
                  {allFragrances.map((f) => (
                    <option key={f.id} value={f.id} className="bg-white text-[#1A1613]">
                      {f.name} — {f.brand}
                    </option>
                  ))}
                </select>
              </div>

              <MotionButton
                variant="primary"
                onClick={() => onAddToCollection(selectedFragranceToAdd)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer border border-white/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cabinet</span>
              </MotionButton>
            </div>

            {/* Grid of Bottles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedList.map((frag, idx) => {
                const level = bottleLevels[frag.id] ?? 80;
                return (
                  <MotionCard
                    key={frag.id}
                    enableTilt
                    className="rounded-3xl liquid-glass p-6 shadow-sm flex flex-col justify-between group hover:border-rose-400 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-lab uppercase px-2.5 py-0.5 rounded-lg bg-white/80 text-[#5A5046] border border-white shadow-2xs">
                            {frag.brand}
                          </span>
                          <span className="text-[10px] font-mono-lab text-rose-800 font-bold">
                            {frag.concentration || 'Fine Parfum'}
                          </span>
                        </div>

                        {/* Shared Flacon Graphic */}
                        <motion.div
                          layoutId={getFlaconLayoutId(frag.id)}
                          transition={SHARED_FLACON_TRANSITION}
                          className="w-8 h-11 rounded-lg bg-gradient-to-b from-amber-200/50 to-rose-200/50 border border-amber-300/60 flex items-center justify-center shrink-0 shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-700" />
                        </motion.div>
                      </div>

                      <h3 className="font-serif text-2xl font-medium text-[#1A1613]">
                        {frag.name}
                      </h3>
                      <p className="text-xs text-[#5A5046] mt-0.5">{frag.fragrance_family}</p>

                      {/* Bottle Fill Level Visual */}
                      <div className="mt-5 p-3.5 rounded-2xl liquid-glass-inset space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#6B6056] flex items-center gap-1.5">
                            <Droplet className="w-3.5 h-3.5 text-amber-700" /> Flacon Volume Remaining:
                          </span>
                          <span className="font-mono-lab text-amber-900 font-bold">
                            <MotionNumber value={level} suffix="%" />
                          </span>
                        </div>
                        <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden border border-white">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${level}%` }}
                            transition={{ duration: 0.6, ease: MOTION_EASINGS.luxuryDecel }}
                            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#7A6F66] pt-1 font-mono-lab">
                          {[25, 50, 75, 100].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => handleLevelChange(frag.id, pct)}
                              className={`hover:text-[#1A1613] transition-colors cursor-pointer ${
                                level === pct ? 'text-amber-800 font-bold' : ''
                              }`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-white/60 flex items-center justify-between">
                      <MotionButton
                        variant="tactile"
                        onClick={() => onSendToLab(frag)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
                        <span>Layer in Lab</span>
                      </MotionButton>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15, color: '#e11d48' }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onRemoveFromCollection(frag.id)}
                        className="p-2 rounded-xl text-[#7A6F66] hover:bg-white/60 transition cursor-pointer"
                        title="Remove from Wardrobe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </MotionCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SUB-VIEW 2: Olfactory DNA Analytics */}
        {activeSubTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Scent Family Distribution */}
            <MotionCard className="p-6 rounded-3xl liquid-glass space-y-4">
              <h3 className="font-serif text-2xl font-medium text-[#1A1613] flex items-center gap-2">
                <PieChart className="w-5 h-5 text-rose-700" /> Scent Family Distribution
              </h3>
              <p className="text-xs text-[#5A5046] leading-relaxed">
                Breakdown of olfactory families present across your wardrobe flacons:
              </p>
              <div className="space-y-3 pt-2">
                {analytics.familyDistribution.map((item, i) => (
                  <div key={item.family} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#2E2620] font-medium">{item.family}</span>
                      <span className="font-mono-lab text-amber-900 font-bold">
                        <MotionNumber value={item.percentage} suffix="%" /> ({item.count} flacons)
                      </span>
                    </div>
                    <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden border border-white">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.7, ease: MOTION_EASINGS.luxuryDecel, delay: i * 0.05 }}
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </MotionCard>

            {/* Seasonal Coverage Matrix */}
            <MotionCard className="p-6 rounded-3xl liquid-glass space-y-4">
              <h3 className="font-serif text-2xl font-medium text-[#1A1613] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Seasonal Coverage Matrix
              </h3>
              <p className="text-xs text-[#5A5046] leading-relaxed">
                How well your current wardrobe covers each climatic season:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {analytics.seasonalCoverage.map((item) => (
                  <div key={item.season} className="p-3.5 rounded-2xl liquid-glass-inset">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#1A1613] font-medium">{item.season}</span>
                      <span className={`text-[10px] font-mono-lab uppercase px-2 py-0.5 rounded font-semibold ${
                        item.coverage === 'Optimal'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : (item.coverage === 'Balanced' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300')
                      }`}>
                        {item.coverage}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A6F66] font-mono-lab mt-1 block">
                      {item.count} flacons aligned
                    </span>
                  </div>
                ))}
              </div>
            </MotionCard>
          </motion.div>
        )}

        {/* SUB-VIEW 3: Collection Gaps */}
        {activeSubTab === 'gaps' && (
          <motion.div
            key="gaps"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
            className="space-y-4"
          >
            <div className="p-6 rounded-3xl liquid-glass border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-2xl text-[#1A1613] font-medium">
                  Olfactory Blind Spots &amp; Missing Profiles
                </h3>
              </div>
              <p className="text-xs text-[#5A5046] leading-relaxed max-w-2xl">
                Our olfactory engine scans your wardrobe coordinates to identify missing accords needed to complete a versatile, year-round fragrance wardrobe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.collectionGaps.map((gap, i) => (
                <MotionCard
                  key={i}
                  enableTilt
                  className="p-5 rounded-3xl liquid-glass flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono-lab uppercase text-amber-800 font-bold block mb-1">
                      Gap #{i + 1}
                    </span>
                    <h4 className="font-serif text-xl font-medium text-[#1A1613]">
                      {gap.category}
                    </h4>
                    <p className="text-xs text-[#5A5046] mt-2 leading-relaxed">
                      {gap.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/60">
                    <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Recommended Solution:</span>
                    <span className="text-xs font-semibold text-rose-800 mt-0.5 block">{gap.recommendedFragrance}</span>
                  </div>
                </MotionCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* SUB-VIEW 4: Should I Buy This? (Purchase Decision AI) */}
        {activeSubTab === 'should_i_buy' && (
          <motion.div
            key="should_i_buy"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl liquid-glass">
              <div className="flex items-center gap-2.5 text-amber-800 font-mono-lab text-xs uppercase font-semibold mb-1">
                <ShoppingBag className="w-4 h-4" />
                <span>Purchase Intelligence &bull; Redundancy &amp; Gap Analysis</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1613] font-medium">
                Should I Buy This Fragrance?
              </h3>
              <p className="text-xs text-[#5A5046] mt-1 max-w-2xl">
                Select any prospective fragrance. Our olfactory matrix cross-analyzes its 8D vector against your existing flacons to prevent redundant purchases and highlight true blind spots.
              </p>

              {/* Selector */}
              <div className="mt-5 max-w-md">
                <label className="text-xs font-mono-lab uppercase text-[#6B6056] block mb-1">
                  Evaluate Candidate Flacon
                </label>
                <select
                  value={candidateFragId}
                  onChange={(e) => setCandidateFragId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl liquid-glass-inset text-[#1A1613] text-xs font-medium focus:outline-none"
                >
                  {allFragrances.map((f) => (
                    <option key={f.id} value={f.id} className="bg-white text-[#1A1613]">
                      {f.name} — {f.brand} ({f.fragrance_family})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Analysis Card */}
            {(() => {
              const candidate = allFragrances.find(f => f.id === candidateFragId) || allFragrances[0];
              const decision = olfactoryIntelligence.analyzePurchaseDecision(candidate, displayedList);

              const badgeColors = {
                STRONG_ADDITION: 'bg-emerald-100 border-emerald-300 text-emerald-900',
                CONSIDER_DECANT_FIRST: 'bg-amber-100 border-amber-300 text-amber-900',
                REDUNDANT_DUPLICATE: 'bg-rose-100 border-rose-300 text-rose-900'
              };

              return (
                <div className="p-6 sm:p-8 rounded-3xl liquid-glass space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/60">
                    <div>
                      <span className="text-[10px] font-mono-lab uppercase tracking-wider text-[#7A6F66]">
                        Candidate Evaluation
                      </span>
                      <h4 className="font-serif text-2xl font-medium text-[#1A1613] mt-0.5">
                        {candidate.name} <span className="text-[#5A5046] font-sans text-base">by {candidate.brand}</span>
                      </h4>
                    </div>

                    <div className={`px-4 py-2 rounded-2xl border text-xs font-mono-lab font-bold uppercase tracking-wider shadow-2xs ${badgeColors[decision.recommendation]}`}>
                      {decision.recommendation.replace(/_/g, ' ')}
                    </div>
                  </div>

                  {/* Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl liquid-glass-inset">
                      <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Wardrobe Overlap</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-mono-lab font-bold text-amber-900">{decision.redundancyScore}%</span>
                        <span className="text-xs text-[#5A5046]">Similarity</span>
                      </div>
                      <p className="text-[11px] text-[#5A5046] mt-2">
                        {decision.redundancyScore > 75 ? 'High accord repetition with your collection.' : 'Distinct olfactory signature.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl liquid-glass-inset">
                      <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Closest Owned Twin</span>
                      <div className="text-base font-semibold text-[#1A1613] mt-1 truncate">
                        {decision.mostSimilarOwnedFragrance.name}
                      </div>
                      <span className="text-[11px] text-[#7A6F66] font-mono-lab block mt-1">
                        {decision.mostSimilarOwnedFragrance.brand} &bull; {decision.mostSimilarOwnedFragrance.fragrance_family}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl liquid-glass-inset">
                      <span className="text-[10px] font-mono-lab text-[#7A6F66] uppercase block">Projected Wear Frequency</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-mono-lab font-bold text-teal-800">{decision.estimatedWearDaysPerYear}</span>
                        <span className="text-xs text-[#5A5046]">days/year</span>
                      </div>
                      <p className="text-[11px] text-[#5A5046] mt-2">
                        Estimated based on local weather &amp; seasonal opportunities.
                      </p>
                    </div>
                  </div>

                  {/* Rationale & Gaps Filled */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-[#3D352E] leading-relaxed space-y-1">
                    <strong className="text-amber-900 font-mono-lab uppercase block text-[10px]">Atelier Curatorial Rationale</strong>
                    <p>{decision.explanation}</p>
                  </div>

                  {decision.gapsFilled.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono-lab uppercase text-emerald-800 font-semibold">
                        Unique Gaps Addressed in Your Vault:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {decision.gapsFilled.map((gap, i) => (
                          <span key={i} className="px-3 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-medium">
                            ✓ {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* SUB-VIEW 5: Rotation AI & Scent Calendar */}
        {activeSubTab === 'rotation' && (
          <motion.div
            key="rotation"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl liquid-glass">
              <div className="flex items-center gap-2.5 text-teal-800 font-mono-lab text-xs uppercase font-semibold mb-1">
                <RotateCcw className="w-4 h-4" />
                <span>Rotation Optimization &bull; Neglect Prevention</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1613] font-medium">
                Flacon Rotation &amp; Scent Calendar
              </h3>
              <p className="text-xs text-[#5A5046] mt-1 max-w-2xl">
                Prevent bottle spoilage and olfactory fatigue by rotating seasonal gems. Discover which bottles haven't left your cabinet recently and review your wear history.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Neglected Flacons */}
              <div className="p-6 rounded-3xl liquid-glass space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <h4 className="font-serif text-xl font-medium text-[#1A1613]">
                    Neglected Flacons (Ready for Rotation)
                  </h4>
                </div>

                <div className="space-y-3">
                  {olfactoryIntelligence.getNeglectedFragrances(displayedList).map((f) => (
                    <div key={f.id} className="p-4 rounded-2xl liquid-glass-inset flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#1A1613]">{f.name}</div>
                        <div className="text-[11px] text-[#5A5046]">{f.brand} &bull; {f.fragrance_family}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSendToLab(f)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-950 text-xs font-semibold cursor-pointer border border-amber-300 shadow-2xs"
                      >
                        Wear Today
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scent Calendar & Recent History */}
              <div className="p-6 rounded-3xl liquid-glass space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <h4 className="font-serif text-xl font-medium text-[#1A1613]">
                    Scent Calendar Log
                  </h4>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 no-scrollbar">
                  {olfactoryIntelligence.getRecentWears().slice(0, 6).map((wear) => (
                    <div key={wear.id} className="p-3.5 rounded-2xl liquid-glass-inset space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1A1613] font-medium">{wear.fragranceName}</span>
                        <span className="text-[10px] font-mono-lab text-[#7A6F66]">
                          {new Date(wear.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#5A5046]">
                        <span className="capitalize">{wear.occasion}</span>
                        <span>&bull;</span>
                        <span>{wear.weatherSummary}</span>
                        <span>&bull;</span>
                        <span className="text-amber-900 font-mono-lab">Rating: {wear.satisfactionRating}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
