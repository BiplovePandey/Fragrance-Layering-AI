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
  Compass,
  Clock,
  CheckCircle2,
  Heart,
  BookOpen,
  Share2,
  Volume2
} from 'lucide-react';
import { Fragrance, WeatherCondition, OlfactoryVector8D } from '../types.js';
import { MotionModal, MotionButton } from '../motion/components.js';
import { MOTION_SPRINGS, MOTION_DURATIONS, MOTION_EASINGS } from '../motion/config.js';
import { extractFragranceVector8D } from '../services/olfactoryIntelligence.js';
import { ambientAudioEngine } from '../services/ambientAudioEngine.js';
import { getChamberPalette } from './chamber/ChamberAtmosphere.js';
import { ChamberFlaconPedestal } from './chamber/ChamberFlaconPedestal.js';
import { ScentSignatureVisualizer } from './chamber/ScentSignatureVisualizer.js';
import { VisualNotePyramid } from './chamber/VisualNotePyramid.js';
import { ChamberDrydownMachine } from './chamber/ChamberDrydownMachine.js';
import { ChamberHeritageArchival } from './chamber/ChamberHeritageArchival.js';
import { ChamberWhyThisFragrance } from './chamber/ChamberWhyThisFragrance.js';

interface FragranceChamberModalProps {
  fragrance: Fragrance | null;
  isOpen: boolean;
  onClose: () => void;
  onSendToLab: (frag: Fragrance) => void;
  onAddToWardrobe: (frag: Fragrance) => void;
  weather: WeatherCondition;
  allFragrances: Fragrance[];
  onImmerseAtmosphere?: (frag: Fragrance) => void;
  onWearToday?: (frag: Fragrance) => void;
  onExploreHeritage?: () => void;
}

export const FragranceChamberModal: React.FC<FragranceChamberModalProps> = ({
  fragrance,
  isOpen,
  onClose,
  onSendToLab,
  onAddToWardrobe,
  weather,
  allFragrances,
  onImmerseAtmosphere,
  onWearToday,
  onExploreHeritage
}) => {
  if (!isOpen || !fragrance) return null;

  const [activeSection, setActiveSection] = useState<'signature' | 'pyramid' | 'drydown' | 'rationale' | 'layering'>('signature');
  const [inWardrobe, setInWardrobe] = useState<boolean>(false);
  const [hasWornToday, setHasWornToday] = useState<boolean>(false);
  const [hasImmersed, setHasImmersed] = useState<boolean>(false);

  // Palette & 8D Vector extraction
  const palette = getChamberPalette(fragrance.fragrance_family, fragrance.name);
  const vector8D: OlfactoryVector8D = extractFragranceVector8D(fragrance);

  // Layering partners
  const recommendedPartners = allFragrances
    .filter((f) => f.id !== fragrance.id && f.fragrance_family !== fragrance.fragrance_family)
    .slice(0, 3);

  const handleWear = () => {
    try {
      ambientAudioEngine.playSpatialChord([440, 554, 659], 0.14);
    } catch {
      // Audio fallback
    }
    setHasWornToday(true);
    if (onWearToday) {
      onWearToday(fragrance);
    }
  };

  const handleAddToWardrobe = () => {
    try {
      ambientAudioEngine.playSpatialChord([528, 660, 792], 0.1);
    } catch {
      // Audio fallback
    }
    setInWardrobe(true);
    onAddToWardrobe(fragrance);
  };

  const handleImmerseAtmosphere = () => {
    try {
      ambientAudioEngine.playSpatialChord([392, 493, 587], 0.12);
    } catch {
      // Audio fallback
    }
    setHasImmersed(true);
    if (onImmerseAtmosphere) {
      onImmerseAtmosphere(fragrance);
    }
  };

  return (
    <MotionModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      <div className="relative w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0F0C0A]/95 border border-amber-500/25 text-stone-200 shadow-[0_35px_100px_rgba(0,0,0,0.85)] backdrop-blur-3xl p-5 sm:p-8 liquid-specular-rim scrollbar-thin scrollbar-thumb-amber-900/40">
        {/* Dynamic Atmospheric Scent Aura Glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-40 -z-10"
          style={{ background: palette.pedestalGlow }}
        />

        {/* ============================================================
            1. CHAMBER HEADER & ARCHIVAL SPECIMEN TAG
        ============================================================ */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#D4AF37]">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="uppercase font-semibold">Private Olfactory Inspection Room</span>
            <span className="text-stone-500 hidden sm:inline">&bull; SPECIMEN #{fragrance.id}</span>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.08] transition cursor-pointer"
            aria-label="Close Inspection Chamber"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* ============================================================
            2. THE HERO OBJECT — FLACON ON LABORATORY PEDESTAL
        ============================================================ */}
        <div className="relative py-2">
          <ChamberFlaconPedestal
            fragrance={fragrance}
            palette={palette}
            vector8D={vector8D}
          />
        </div>

        {/* ============================================================
            3. FRAGRANCE IDENTITY & HIGH-IMPACT PHYSICAL ACTION BAR
        ============================================================ */}
        <div className="text-center space-y-3 pb-6 max-w-2xl mx-auto">
          {/* Concentration & Origin Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${palette.tagBg} ${palette.tagText} font-semibold shadow-xs`}>
              {fragrance.concentration || 'Fine Eau de Parfum'}
            </span>
            <span className="text-[11px] font-mono text-stone-400 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              {fragrance.brand_country || 'Heritage Origin'} &bull; {fragrance.gender || 'Unisex'}
            </span>
            <span className="text-[11px] font-mono text-amber-300 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              {palette.name}
            </span>
          </div>

          {/* Fragrance Name */}
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-stone-100 tracking-tight leading-tight">
            {fragrance.name}
          </h1>

          {/* Maker / House */}
          <p className="text-sm sm:text-base text-[#D4AF37] font-mono font-medium">
            Maison {fragrance.brand} {fragrance.collection ? `&bull; ${fragrance.collection}` : ''}
          </p>

          {/* ACTION BUTTONS */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {/* Primary Action: WEAR THIS */}
            <MotionButton
              variant="primary"
              onClick={handleWear}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide transition cursor-pointer flex items-center gap-2.5 shadow-xl ${
                hasWornToday
                  ? 'bg-emerald-800 text-emerald-100 border border-emerald-500/50'
                  : 'bg-gradient-to-r from-[#D4AF37] via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 shadow-amber-900/30'
              }`}
            >
              {hasWornToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Recorded as Scent of Day (+40 XP)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-stone-950" />
                  <span>Wear This Fragrance Today</span>
                </>
              )}
            </MotionButton>

            {/* Secondary Action: PAIR / FORMULATE IN LAB */}
            <MotionButton
              variant="tactile"
              onClick={() => {
                onClose();
                onSendToLab(fragrance);
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>Formulate Chords in Lab</span>
            </MotionButton>

            {/* Additional: ADD TO WARDROBE */}
            <MotionButton
              variant="tactile"
              onClick={handleAddToWardrobe}
              className="px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-stone-300 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>{inWardrobe ? 'In Wardrobe' : 'Save to Wardrobe'}</span>
            </MotionButton>

            {/* Additional: IMMERSE AMBIANCE */}
            {onImmerseAtmosphere && (
              <MotionButton
                variant="tactile"
                onClick={handleImmerseAtmosphere}
                className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
                  hasImmersed
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-stone-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{hasImmersed ? 'Ambiance Immersed' : 'Immerse Ambiance'}</span>
              </MotionButton>
            )}
          </div>
        </div>

        {/* ============================================================
            4. TACTILE CHAMBER NAVIGATION TABS
        ============================================================ */}
        <div className="flex items-center justify-start sm:justify-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-mono relative overflow-x-auto scrollbar-none my-4">
          {[
            { id: 'signature', label: 'Scent Signature (8D)', icon: Sparkles },
            { id: 'pyramid', label: 'Note Pyramid', icon: Droplets },
            { id: 'drydown', label: 'Drydown Time Machine', icon: Clock },
            { id: 'rationale', label: 'Why This Fragrance?', icon: Compass },
            { id: 'layering', label: 'Layering Partners', icon: Layers }
          ].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id as typeof activeSection)}
                className={`px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer relative z-10 whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'text-amber-200 font-bold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="chamber-section-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-700/20 border border-amber-500/40 -z-10 shadow-xs"
                    transition={MOTION_SPRINGS.spatialLayout}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================
            5. CHAMBER INSPECTION MODULE VIEWS
        ============================================================ */}
        <div className="py-4 space-y-6">
          <AnimatePresence mode="wait">
            {/* VIEW 1: 8D SCENT SIGNATURE */}
            {activeSection === 'signature' && (
              <motion.div
                key="signature-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-6"
              >
                <ScentSignatureVisualizer
                  vector8D={vector8D}
                  palette={palette}
                  fragranceName={fragrance.name}
                />

                {/* Cultural / Heritage provenance block if applicable */}
                <ChamberHeritageArchival
                  fragrance={fragrance}
                  onExploreHeritage={onExploreHeritage}
                />
              </motion.div>
            )}

            {/* VIEW 2: EVOLVING NOTE PYRAMID */}
            {activeSection === 'pyramid' && (
              <motion.div
                key="pyramid-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-6"
              >
                <VisualNotePyramid
                  fragrance={fragrance}
                  palette={palette}
                />
              </motion.div>
            )}

            {/* VIEW 3: DRYDOWN TIME MACHINE */}
            {activeSection === 'drydown' && (
              <motion.div
                key="drydown-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-6"
              >
                <ChamberDrydownMachine
                  fragrance={fragrance}
                  palette={palette}
                />
              </motion.div>
            )}

            {/* VIEW 4: HARMONIC RATIONALE (WHY THIS FRAGRANCE?) */}
            {activeSection === 'rationale' && (
              <motion.div
                key="rationale-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-6"
              >
                <ChamberWhyThisFragrance
                  fragrance={fragrance}
                  weather={weather}
                  vector8D={vector8D}
                  palette={palette}
                />

                <ChamberHeritageArchival
                  fragrance={fragrance}
                  onExploreHeritage={onExploreHeritage}
                />
              </motion.div>
            )}

            {/* VIEW 5: RECOMMENDED LAYERING PARTNERS */}
            {activeSection === 'layering' && (
              <motion.div
                key="layering-view"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Alchemical Counterpoint Principles</span>
                    </div>
                    <h4 className="font-serif text-xl sm:text-2xl text-stone-100 font-medium mt-0.5">
                      Cross-Family Layering Companions
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {recommendedPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between hover:border-amber-500/30 transition shadow-md"
                    >
                      <div>
                        <span className="text-[9px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                          {partner.fragrance_family}
                        </span>
                        <h5 className="font-serif text-lg text-stone-100 font-medium mt-2 leading-snug">
                          {partner.name}
                        </h5>
                        <span className="text-xs text-stone-400 block mt-0.5">{partner.brand}</span>
                        <p className="text-[11px] text-stone-400 line-clamp-2 mt-2 leading-relaxed">
                          {partner.description || 'Harmonious chord bridging complementary olfactive accords.'}
                        </p>
                      </div>

                      <MotionButton
                        variant="tactile"
                        onClick={() => {
                          onClose();
                          onSendToLab(partner);
                        }}
                        className="mt-4 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-500/30"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        <span>Pair in Laboratory &rarr;</span>
                      </MotionButton>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionModal>
  );
};
