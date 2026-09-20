import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, RefreshCw, Check } from 'lucide-react';
import { Fragrance, WeatherCondition } from '../../types.js';
import { ScentBottle } from './ScentBottle.js';
import { ScentMist } from './ScentMist.js';
import { WhyThisScent } from './WhyThisScent.js';
import { AtelierButton } from './AtelierButton.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { ambientAudioEngine } from '../../services/ambientAudioEngine.js';

export interface SurpriseMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  allFragrances: Fragrance[];
  weather?: WeatherCondition;
  onWearThis: (fragrance: Fragrance) => void;
  onOpenChamber?: (fragrance: Fragrance) => void;
}

const POETIC_IMPRESSIONS = [
  'Warm, intimate and slightly mysterious.',
  'Sunlight through amber leaves with crisp morning air.',
  'Smoky woods softened by a whispered floral breeze.',
  'Deep resinous warmth for quiet evening confidence.',
  'Effortless citrus brightness with grounded earthy depth.',
  'A magnetic, velvety trail that lingers close to the skin.',
  'Pure petrichor and fresh rainwater on warm terra-cotta.',
  'Regal sandalwood draped in subtle exotic spices.',
];

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  isOpen,
  onClose,
  allFragrances,
  weather,
  onWearThis,
  onOpenChamber,
}) => {
  const [selectedFragrance, setSelectedFragrance] = useState<Fragrance | null>(null);
  const [poeticPhrase, setPoeticPhrase] = useState<string>('');
  const [headline, setHeadline] = useState<string>('');
  const [isUnveiling, setIsUnveiling] = useState<boolean>(true);
  const [hasWorn, setHasWorn] = useState<boolean>(false);
  const reducedMotion = usePrefersReducedMotion();

  const pickSerendipity = () => {
    if (!allFragrances || allFragrances.length === 0) return;
    setIsUnveiling(true);
    setHasWorn(false);

    // Pick random fragrance
    const randomIdx = Math.floor(Math.random() * allFragrances.length);
    const frag = allFragrances[randomIdx];
    setSelectedFragrance(frag);

    const randomPoetic = POETIC_IMPRESSIONS[Math.floor(Math.random() * POETIC_IMPRESSIONS.length)];
    setPoeticPhrase(randomPoetic);

    const topNote = frag.top_notes?.[0] || frag.scent_family || 'woods';
    const timeOfDay = weather?.time_of_day || 'This moment';
    setHeadline(`${timeOfDay} feels like ${topNote.toLowerCase()}.`);

    // Play subtle bell/chime if audio enabled
    try {
      ambientAudioEngine.playSpatialChord([528, 660, 792], 0.12);
    } catch {}

    // Transition from vapor veil to revelation
    const timer = setTimeout(() => {
      setIsUnveiling(false);
    }, reducedMotion ? 100 : 900);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (isOpen) {
      pickSerendipity();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0E0C0A]/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#FBF9F5] border border-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)] p-6 sm:p-8 text-[#1A1613] overflow-hidden my-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#7A6F66] hover:text-[#1A1613] hover:bg-black/5 transition cursor-pointer z-20"
            aria-label="Close surprise"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Unveiling Vapor State */}
          {isUnveiling ? (
            <div className="relative py-16 flex flex-col items-center justify-center text-center space-y-4">
              <ScentMist color="rgba(217, 119, 6, 0.4)" density="rich" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-amber-600" />
              </motion.div>
              <p className="font-serif text-xl sm:text-2xl text-[#1A1613] italic">
                Gathering botanical vapors…
              </p>
              <p className="text-xs text-[#7A6F66] font-mono">
                Listening to the atmosphere and your collection
              </p>
            </div>
          ) : selectedFragrance ? (
            /* Revealed Serendipity State */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center text-center space-y-5"
            >
              {/* Top Atmospheric Statement */}
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-900 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Atmospheric Serendipity
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1613] font-medium tracking-tight pt-1">
                  {headline}
                </h3>
              </div>

              {/* Scent Bottle */}
              <div className="py-2">
                <ScentBottle
                  name={selectedFragrance.name}
                  brand={selectedFragrance.brand}
                  family={selectedFragrance.scent_family}
                  size="lg"
                  showAura={true}
                  showMist={true}
                  interactive={true}
                  onClick={() => onOpenChamber?.(selectedFragrance)}
                />
              </div>

              {/* Fragrance Name & One-Line Impression */}
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1613]">
                  {selectedFragrance.name}
                </h4>
                <p className="text-xs font-mono uppercase tracking-widest text-[#7A6F66]">
                  {selectedFragrance.brand || 'Atelier Selection'} &bull; {selectedFragrance.scent_family || 'Heritage Accord'}
                </p>
                <p className="font-serif italic text-sm sm:text-base text-[#5A5046] pt-1">
                  “{poeticPhrase}”
                </p>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
                <AtelierButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    onWearThis(selectedFragrance);
                    setHasWorn(true);
                  }}
                  disabled={hasWorn}
                  leftIcon={hasWorn ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  {hasWorn ? 'Recorded for Today' : 'Wear This'}
                </AtelierButton>

                <button
                  type="button"
                  onClick={pickSerendipity}
                  className="px-4 py-3 rounded-2xl bg-white/80 hover:bg-white border border-[#DCD4C8] text-[#5A5046] hover:text-[#1A1613] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Surprise Again</span>
                </button>
              </div>

              {/* Progressive Disclosure: Why This One? */}
              <div className="w-full text-left pt-2">
                <WhyThisScent
                  fragrance={selectedFragrance}
                  weather={weather}
                  reason={poeticPhrase}
                  harmonyScore={91}
                />
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
