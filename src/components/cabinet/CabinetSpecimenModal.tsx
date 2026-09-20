import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Shirt,
  FlaskConical,
  Heart,
  Droplet,
  Trash2,
  Sparkles,
  ChevronDown,
  Info,
  Clock,
  Layers,
  Wind,
  CheckCircle2
} from 'lucide-react';
import { Fragrance, WeatherCondition, OlfactoryVector8D } from '../../types.js';
import { extractFragranceVector8D } from '../../services/olfactoryIntelligence.js';
import { HeroFlacon } from '../atelier/HeroFlacon.js';
import { getChamberPalette } from '../chamber/ChamberAtmosphere.js';
import { ScentSignatureVisualizer } from '../chamber/ScentSignatureVisualizer.js';
import { ChamberDrydownMachine } from '../chamber/ChamberDrydownMachine.js';
import { ChamberWhyThisFragrance } from '../chamber/ChamberWhyThisFragrance.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { MOTION_DURATIONS, MOTION_EASINGS } from '../../motion/config.js';

interface CabinetSpecimenModalProps {
  fragrance: Fragrance | null;
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherCondition;
  fillLevel: number;
  onAdjustFillLevel: (id: number, level: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onWearToday: (fragrance: Fragrance) => void;
  onSendToLab: (fragrance: Fragrance) => void;
  onRemoveFromCabinet: (id: number) => void;
}

export const CabinetSpecimenModal: React.FC<CabinetSpecimenModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  weather,
  fillLevel,
  onAdjustFillLevel,
  isFavorite,
  onToggleFavorite,
  onWearToday,
  onSendToLab,
  onRemoveFromCabinet
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState<'profile' | 'intelligence' | 'vector' | 'drydown'>('profile');
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  if (!isOpen || !fragrance) return null;

  const palette = getChamberPalette(fragrance.fragrance_family, fragrance.name);
  const vector8D: OlfactoryVector8D = extractFragranceVector8D(fragrance);

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="specimen-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-3xl border border-stone-800/80 bg-gradient-to-b from-[#18130E] via-[#100D0A] to-[#0A0806] shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden text-stone-100 my-auto"
        >
          {/* Ambient Family Backlight */}
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px] pointer-events-none -z-10"
            style={{ background: palette.pedestalGlow }}
          />

          {/* Top Bar with Title and Close */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                Collector&apos;s Specimen View
              </span>
              <span className="text-stone-600">&bull;</span>
              <span className="text-xs text-stone-400 font-mono">
                Vault #{fragrance.id.toString().padStart(3, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(fragrance.id)}
                aria-label={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                className={`p-2 rounded-full border transition cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                    : 'bg-stone-900 border-stone-700/60 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close specimen inspection view"
                className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Inspection Grid: Left Flacon Stage, Right Progressive Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
            {/* LEFT COLUMN: Physical Flacon Pedestal & Tactical Level Controls (Lg: cols 5) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-stone-800/80 bg-stone-950/40">
              <div className="w-full flex flex-col items-center">
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                  Physical Flacon Geometry
                </span>

                {/* Grand Flacon Rendering with Liquid Aura */}
                <div className="my-6 relative py-4">
                  <HeroFlacon
                    fragrance={fragrance}
                    size="chord"
                  />
                  {/* Under-bottle contact shadow on pedestal */}
                  <div className="w-32 h-4 rounded-full mt-1 bg-black/80 blur-[4px] mx-auto pointer-events-none" />
                </div>

                <div className="text-center">
                  <h3 id="specimen-modal-title" className="font-serif text-2xl font-medium text-[#F5EEDB]">
                    {fragrance.name}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-mono mt-0.5">
                    {fragrance.brand} &bull; {fragrance.concentration || 'Fine Parfum'}
                  </p>
                </div>
              </div>

              {/* Fluid Volume Adjustment Slider */}
              <div className="w-full mt-6 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-400 flex items-center gap-1.5 font-sans">
                    <Droplet className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fluid Volume Remaining:</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">{fillLevel}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fillLevel}
                  onChange={(e) => onAdjustFillLevel(fragrance.id, Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                  aria-label={`Adjust fluid volume for ${fragrance.name}`}
                />

                <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => onAdjustFillLevel(fragrance.id, pct)}
                      className="hover:text-amber-300 cursor-pointer transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onWearToday(fragrance);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Shirt className="w-3.5 h-3.5 text-stone-950" />
                  <span>Wear Today</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSendToLab(fragrance);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send to Lab</span>
                </button>
              </div>

              {/* Remove Flacon Toggle */}
              <div className="w-full mt-3 pt-3 border-t border-stone-800/80 text-center">
                {showConfirmRemove ? (
                  <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-center justify-between text-xs">
                    <span className="text-rose-300">Remove from vault?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onRemoveFromCabinet(fragrance.id);
                          onClose();
                        }}
                        className="px-2 py-1 rounded-lg bg-rose-700 text-white font-semibold text-[10px] cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmRemove(false)}
                        className="px-2 py-1 rounded-lg bg-stone-800 text-stone-300 text-[10px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmRemove(true)}
                    className="text-[11px] text-stone-500 hover:text-rose-400 font-mono transition cursor-pointer inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove from cabinet</span>
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: 5 Progressive Disclosure Tabs (Lg: cols 7) */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-stone-950/80 border border-stone-800 flex-wrap">
                {[
                  { id: 'profile', label: '1 & 2: Architecture' },
                  { id: 'intelligence', label: '3: Why This Scent?' },
                  { id: 'vector', label: '4: 8D Vector' },
                  { id: 'drydown', label: '5: Modeled Drydown' },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panels */}
              <div className="flex-1">
                {/* TAB 1: EMOTION & OLFACTORY ARCHITECTURE */}
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                        Sensory Poetics
                      </span>
                      <p className="font-serif italic text-base sm:text-lg text-stone-200 mt-1 leading-relaxed">
                        &ldquo;{fragrance.description || 'A timeless symphony honoring noble natural essences.'}&rdquo;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                        <span className="text-[10px] font-mono uppercase text-stone-500 block">Family</span>
                        <span className="text-xs font-medium text-amber-300 mt-0.5 block">{fragrance.fragrance_family}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                        <span className="text-[10px] font-mono uppercase text-stone-500 block">Season</span>
                        <span className="text-xs font-medium text-stone-200 mt-0.5 block">{fragrance.season || 'All Season'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
                        <span className="text-[10px] font-mono uppercase text-stone-500 block">Occasion</span>
                        <span className="text-xs font-medium text-stone-200 mt-0.5 block">{fragrance.occasion || 'Signature Wear'}</span>
                      </div>
                    </div>

                    {/* Note Architecture */}
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">
                        Note Pyramid Hierarchy:
                      </span>
                      <div className="space-y-1.5 text-xs font-sans">
                        <div className="p-2.5 rounded-xl bg-stone-900/50 border border-stone-800 flex items-start gap-2">
                          <span className="w-14 shrink-0 font-mono text-[10px] uppercase text-amber-400/90 pt-0.5">Top:</span>
                          <span className="text-stone-300">{(fragrance.top_notes || []).join(', ') || 'Citrus & Spices'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-900/50 border border-stone-800 flex items-start gap-2">
                          <span className="w-14 shrink-0 font-mono text-[10px] uppercase text-rose-400/90 pt-0.5">Heart:</span>
                          <span className="text-stone-300">{(fragrance.middle_notes || []).join(', ') || 'Damask Petals & Florals'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-900/50 border border-stone-800 flex items-start gap-2">
                          <span className="w-14 shrink-0 font-mono text-[10px] uppercase text-amber-500/90 pt-0.5">Base:</span>
                          <span className="text-stone-300">{(fragrance.base_notes || []).join(', ') || 'Mysore Sandalwood & Resins'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: WHY THIS FRAGRANCE? */}
                {activeTab === 'intelligence' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <ChamberWhyThisFragrance
                      fragrance={fragrance}
                      weather={weather}
                      vector8D={vector8D}
                      palette={palette}
                    />
                  </motion.div>
                )}

                {/* TAB 3: 8D SCENT SIGNATURE VECTOR */}
                {activeTab === 'vector' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <ScentSignatureVisualizer
                      vector8D={vector8D}
                      palette={palette}
                      fragranceName={fragrance.name}
                    />
                  </motion.div>
                )}

                {/* TAB 4: MODELED DRYDOWN EVOLUTION */}
                {activeTab === 'drydown' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <ChamberDrydownMachine
                      fragrance={fragrance}
                      palette={palette}
                    />
                  </motion.div>
                )}
              </div>

              {/* Bottom Scientific Transparency Footnote */}
              <div className="pt-4 border-t border-stone-800/60 text-[11px] text-stone-500 font-mono flex items-center justify-between">
                <span>Olfactory AI Specimen Verification</span>
                <span>Modeled &bull; Algorithmic</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
