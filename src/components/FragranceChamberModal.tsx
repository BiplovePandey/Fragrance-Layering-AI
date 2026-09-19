import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Droplets,
  FlaskConical,
  Bookmark,
  Thermometer,
  Layers,
  Activity,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Fragrance, WeatherCondition } from '../types.js';
import { calculateWeatherAlignmentScore } from '../services/weatherEngine.js';
import { MotionModal, MotionNumber, MotionButton } from '../motion/components.js';
import { getFlaconLayoutId, SHARED_FLACON_TRANSITION } from '../motion/sharedElements.js';
import { MOTION_SPRINGS, MOTION_DURATIONS, MOTION_EASINGS } from '../motion/config.js';
import { EvaporationTimeline } from './EvaporationTimeline.js';

interface FragranceChamberModalProps {
  fragrance: Fragrance | null;
  isOpen: boolean;
  onClose: () => void;
  onSendToLab: (frag: Fragrance) => void;
  onAddToWardrobe: (frag: Fragrance) => void;
  weather: WeatherCondition;
  allFragrances: Fragrance[];
  onImmerseAtmosphere?: (frag: Fragrance) => void;
}

export const FragranceChamberModal: React.FC<FragranceChamberModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSendToLab,
  onAddToWardrobe,
  weather,
  allFragrances,
  onImmerseAtmosphere
}) => {
  if (!isOpen || !fragrance) return null;

  const [activeTab, setActiveTab] = useState<'dna' | 'pyramid' | 'timeline' | 'layering'>('dna');
  const [inWardrobe, setInWardrobe] = useState(false);
  const [hasImmersed, setHasImmersed] = useState(false);

  const weatherFit = calculateWeatherAlignmentScore(fragrance, weather);

  // Find 3 recommended layering partners
  const recommendedPartners = allFragrances
    .filter(f => f.id !== fragrance.id && f.fragrance_family !== fragrance.fragrance_family)
    .slice(0, 3);

  // Derive secondary characteristics
  const secondaryChars = [
    { name: 'Citrus', val: (fragrance.top_notes || []).some(n => /lemon|bergamot|orange|mandarin|lime/i.test(n)) ? 85 : 20 },
    { name: 'Green', val: (fragrance.top_notes || []).some(n => /grass|vetiver|khus|mint|leaf/i.test(n)) ? 80 : 15 },
    { name: 'Aquatic', val: (fragrance.fragrance_family || '').includes('Aquatic') ? 90 : 10 },
    { name: 'Aromatic', val: (fragrance.top_notes || []).some(n => /cardamom|pepper|lavender|thyme/i.test(n)) ? 75 : 25 },
    { name: 'Smoky', val: (fragrance.base_notes || []).some(n => /oud|birch|smoke|leather/i.test(n)) ? 85 : 15 },
    { name: 'Powdery', val: (fragrance.middle_notes || []).some(n => /iris|violet|rose/i.test(n)) ? 70 : 20 },
    { name: 'Musky', val: (fragrance.base_notes || []).some(n => /musk/i.test(n)) ? 80 : 30 },
    { name: 'Creamy', val: (fragrance.base_notes || []).some(n => /sandalwood|chandan|vanilla/i.test(n)) ? 85 : 25 },
    { name: 'Dry', val: (fragrance.base_notes || []).some(n => /cedar|vetiver/i.test(n)) ? 75 : 20 },
    { name: 'Mineral', val: (fragrance.description || '').includes('mitti') || (fragrance.description || '').includes('petrichor') ? 95 : 10 },
    { name: 'Fruity', val: (fragrance.top_notes || []).some(n => /apple|peach|berry|grapefruit/i.test(n)) ? 65 : 15 },
    { name: 'Leathery', val: (fragrance.base_notes || []).some(n => /leather|saffron/i.test(n)) ? 80 : 10 }
  ];

  // Animated Scent Aura Color based on family
  const getAuraGradient = () => {
    const fam = (fragrance.fragrance_family || '').toLowerCase();
    if (fam.includes('floral') || fam.includes('rose')) return 'from-rose-500/20 via-pink-600/10 to-transparent';
    if (fam.includes('wood') || fam.includes('oud')) return 'from-amber-600/20 via-purple-900/15 to-transparent';
    if (fam.includes('earth') || fam.includes('mitti')) return 'from-amber-700/20 via-orange-950/15 to-transparent';
    if (fam.includes('fresh') || fam.includes('citrus')) return 'from-emerald-500/20 via-yellow-500/10 to-transparent';
    if (fam.includes('aquatic')) return 'from-cyan-500/20 via-blue-600/10 to-transparent';
    return 'from-amber-500/20 via-rose-500/10 to-transparent';
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="relative w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14110E]/90 border border-white/20 text-stone-200 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-3xl p-6 sm:p-8 liquid-specular-rim">
        {/* Atmospheric Scent Aura Glow */}
        <div
          className={`absolute -top-12 -right-12 w-96 h-96 rounded-full bg-gradient-to-br ${getAuraGradient()} blur-3xl pointer-events-none opacity-70`}
        />

        {/* Top Header with Shared Flacon Visual */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/[0.08] relative z-10 gap-4">
          <div className="flex items-center gap-4">
            {/* Shared Flacon Element */}
            <motion.div
              layoutId={getFlaconLayoutId(fragrance.id)}
              transition={SHARED_FLACON_TRANSITION}
              className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-black/40 border border-amber-500/30 flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg"
            >
              {/* Flacon Cap & Body Silhouette */}
              <div className="flex flex-col items-center">
                <div className="w-5 h-2.5 rounded-xs bg-amber-400/80 border border-amber-300/40 shadow-xs mb-1" />
                <div className="w-10 h-12 rounded-lg bg-gradient-to-b from-amber-400/20 to-amber-900/40 border border-amber-400/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
              </div>
            </motion.div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  {fragrance.concentration || fragrance.fragrance_type || 'Fine Fragrance'}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  {fragrance.brand_country || 'Fine House'} &bull; {fragrance.gender}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-medium text-stone-100">
                {fragrance.name}
              </h1>
              <p className="text-sm text-amber-400 font-sans font-medium">
                by {fragrance.brand} {fragrance.collection ? `(${fragrance.collection})` : ''}
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] transition cursor-pointer self-start sm:self-auto"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Navigation Tabs with Liquid Layout Indicator */}
        <div className="flex items-center gap-2 mt-5 border-b border-white/[0.06] pb-3 text-xs font-mono relative overflow-x-auto">
          {(['dna', 'pyramid', 'timeline', 'layering'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer relative z-10 whitespace-nowrap transition-colors ${
                  isActive ? 'text-amber-200 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="chamber-active-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-amber-500/20 border border-amber-500/40 -z-10 shadow-xs"
                    transition={MOTION_SPRINGS.spatialLayout}
                  />
                )}
                {tab === 'dna' && 'Olfactory DNA (8-D)'}
                {tab === 'pyramid' && 'Note Pyramid'}
                {tab === 'timeline' && 'Evaporation Curve'}
                {tab === 'layering' && 'Layering Partners'}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="py-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* Tab 1: Olfactory DNA */}
            {activeTab === 'dna' && (
              <motion.div
                key="dna"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-6"
              >
                <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
                  {fragrance.description}
                </p>

                {/* 12 Secondary Characteristics Grid */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-3">
                    12 Secondary Olfactory Descriptors
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {secondaryChars.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: MOTION_DURATIONS.standard }}
                        className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                      >
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-stone-300">{item.name}</span>
                          <span className="text-amber-400 font-mono font-bold">
                            <MotionNumber value={item.val} suffix="%" />
                          </span>
                        </div>
                        <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            transition={{ duration: 0.8, ease: MOTION_EASINGS.luxuryDecel, delay: index * 0.02 }}
                            className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Weather Diagnostics with MotionNumber */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400">Current Atmosphere Alignment</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Thermometer className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-stone-200">
                        {weather.temperature_c}°C &bull; {weather.season} Compatibility:{' '}
                        <span className="font-mono font-bold text-amber-300">
                          <MotionNumber value={weatherFit.score} suffix="%" />
                        </span>
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{weatherFit.advisory}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-stone-400">Longevity:</span>
                    <span className="text-sm font-mono font-bold text-amber-300 block">{fragrance.longevity || '8-10 hrs'}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Note Pyramid & Haute Chemical Classification */}
            {activeTab === 'pyramid' && (
              <motion.div
                key="pyramid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-lab uppercase text-amber-300 font-semibold flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5" /> Top Volatiles &bull; Vapor Pressure (0m – 30m)
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Boiling Pt: &lt; 250°C</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fragrance.top_notes?.map(n => (
                      <span key={n} className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-medium">{n}</span>
                      </span>
                    )) || <span className="text-xs text-stone-500">Not recorded</span>}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-lab uppercase text-rose-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Heart Accord &bull; Core Diffusion (30m – 3h)
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Boiling Pt: 250°C – 320°C</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fragrance.middle_notes?.map(n => (
                      <span key={n} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span className="font-medium">{n}</span>
                      </span>
                    )) || <span className="text-xs text-stone-500">Not recorded</span>}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-lab uppercase text-amber-400 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Base Fixatives &bull; Macromolecular Anchors (3h – 12h+)
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Boiling Pt: &gt; 320°C</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fragrance.base_notes?.map(n => (
                      <span key={n} className="px-3 py-1.5 rounded-xl bg-amber-600/10 border border-amber-600/30 text-xs text-amber-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="font-medium">{n}</span>
                      </span>
                    )) || <span className="text-xs text-stone-500">Not recorded</span>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Timeline Curve & Interactive Evaporation */}
            {activeTab === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-4"
              >
                <EvaporationTimeline fragrance={fragrance} />
              </motion.div>
            )}

            {/* Tab 4: Layering Partners */}
            {activeTab === 'layering' && (
              <motion.div
                key="layering"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-3"
              >
                <h4 className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Recommended Cross-Family Layering Partners
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recommendedPartners.map((partner) => (
                    <div key={partner.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                          {partner.fragrance_family}
                        </span>
                        <h5 className="font-serif text-lg text-stone-100 font-medium mt-1">
                          {partner.name}
                        </h5>
                        <span className="text-xs text-stone-400">{partner.brand}</span>
                      </div>

                      <MotionButton
                        variant="tactile"
                        onClick={() => {
                          onClose();
                          onSendToLab(partner);
                        }}
                        className="mt-4 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FlaskConical className="w-3 h-3" />
                        <span>Pair in Lab</span>
                      </MotionButton>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MotionButton
              variant="tactile"
              onClick={() => {
                onAddToWardrobe(fragrance);
                setInWardrobe(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-stone-200 text-xs font-medium transition cursor-pointer flex items-center gap-2"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>{inWardrobe ? 'Added to Wardrobe!' : 'Add to Digital Wardrobe'}</span>
            </MotionButton>

            {onImmerseAtmosphere && (
              <MotionButton
                variant="tactile"
                onClick={() => {
                  onImmerseAtmosphere(fragrance);
                  setHasImmersed(true);
                }}
                className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-2 ${
                  hasImmersed
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] text-stone-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{hasImmersed ? 'Ambiance Immersed' : 'Immerse Room Ambiance'}</span>
              </MotionButton>
            )}
          </div>

          <MotionButton
            variant="primary"
            onClick={() => {
              onClose();
              onSendToLab(fragrance);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-500 hover:to-rose-600 text-stone-100 text-xs font-semibold shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Formulate Scent Chords in Lab &rarr;</span>
          </MotionButton>
        </div>
      </div>
    </MotionModal>
  );
};
