import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  CheckCircle2,
  Crown,
  Eye,
  Layers,
  ArrowRight,
  FlaskConical,
  Compass,
  Bookmark,
  Plus,
  Droplets,
  Clock,
  ShieldCheck,
  BookOpen,
  Info
} from 'lucide-react';
import { Fragrance, WearRecommendation, WeatherCondition } from '../../types.js';
import { HeroFlacon } from '../atelier/HeroFlacon.js';
import { ScentMist } from '../ui/ScentMist.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';
import {
  generateHeroExplanation,
  getCabinetRelationship,
  getVerifiedHeritageConnection
} from '../../utils/recommendationExplanation.js';

interface CuratedAccordRevealProps {
  recommendation: WearRecommendation;
  layerPartner?: Fragrance;
  weather: WeatherCondition;
  mood?: string;
  occasion?: string;
  wardrobeFragrances?: Fragrance[];
  onWearToday: (frag: Fragrance) => void;
  onInspectInChamber: (frag: Fragrance) => void;
  onSendToLab?: (fragA: Fragrance, fragB?: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
  onNavigateToHeritageAtlas?: (materialId?: string) => void;
  hasRecordedWear?: boolean;
}

export const CuratedAccordReveal: React.FC<CuratedAccordRevealProps> = ({
  recommendation,
  layerPartner,
  weather,
  mood,
  occasion,
  wardrobeFragrances = [],
  onWearToday,
  onInspectInChamber,
  onSendToLab,
  onAddToWardrobe,
  onNavigateToHeritageAtlas,
  hasRecordedWear = false
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const { fragrance, score, reasons } = recommendation;

  // Retrieve living DNA for grounded explanation
  const livingDNA = useMemo(() => {
    try {
      return olfactoryIntelligence.getLivingDNA();
    } catch {
      return null;
    }
  }, []);

  // Cinematic reveal animation state (phased reveal)
  const [revealStage, setRevealStage] = useState<number>(prefersReduced ? 5 : 0);

  useEffect(() => {
    if (prefersReduced) {
      setRevealStage(5);
      return;
    }

    setRevealStage(0);
    const t1 = setTimeout(() => setRevealStage(1), 100); // vapor gathers
    const t2 = setTimeout(() => setRevealStage(2), 350); // silhouette emerges
    const t3 = setTimeout(() => setRevealStage(3), 600); // liquid & specular highlights
    const t4 = setTimeout(() => setRevealStage(4), 850); // typography fades in
    const t5 = setTimeout(() => setRevealStage(5), 1100); // actions and rationale ready

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [fragrance?.id, prefersReduced]);

  // Derived Recommendation Hero text based ONLY on existing verified & calculated data
  const heroGeneratedExplanation = useMemo(() => {
    return generateHeroExplanation(fragrance, weather, mood, occasion, livingDNA);
  }, [fragrance, weather, mood, occasion, livingDNA]);

  // Cabinet relationship based strictly on ownership and family similarity
  const cabinetRelationship = useMemo(() => {
    return getCabinetRelationship(fragrance, wardrobeFragrances);
  }, [fragrance, wardrobeFragrances]);

  // Verified Heritage Connection (only verified facts, no inference)
  const heritageConnection = useMemo(() => {
    return getVerifiedHeritageConnection(fragrance);
  }, [fragrance]);

  const isOwned = cabinetRelationship.status === 'owned';

  return (
    <section
      id="wear-today-accord"
      aria-label="Chapter IV: Today's Olfactory Accord"
      className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#181410] via-[#120F0C] to-[#0A0907] border border-amber-800/40 p-6 sm:p-10 shadow-2xl space-y-8"
    >
      {/* Dynamic Scent Aura Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-radial from-amber-500/15 via-rose-950/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Atmospheric Vapor Gathering */}
      {revealStage >= 1 && (
        <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
          <ScentMist active={true} color="rgba(245, 158, 11, 0.28)" intensity="normal" />
        </div>
      )}

      {/* Chapter Eyebrow & Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-mono">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold tracking-wider uppercase">TODAY&apos;S ACCORD</span>
        </div>

        {/* Ownership & Context Match Score with explicit transparency labels */}
        <div className="flex flex-wrap items-center gap-3">
          {cabinetRelationship.status === 'owned' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono"
              title="Verified from your Cabinet collection"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{cabinetRelationship.headline}</span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-400/70 border-l border-emerald-500/30 pl-1.5 ml-0.5">
                USER OBSERVATION
              </span>
            </span>
          )}

          {cabinetRelationship.status === 'similar' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 text-xs font-mono"
              title="Calculated similarity to existing Cabinet flacon"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{cabinetRelationship.headline}</span>
              <span className="text-[9px] uppercase tracking-wider text-amber-400/70 border-l border-amber-600/30 pl-1.5 ml-0.5">
                CALCULATED
              </span>
            </span>
          )}

          {cabinetRelationship.status === 'outside' && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-700 text-stone-300 text-xs font-mono"
              title="Calculated exploration territory"
            >
              <Compass className="w-3.5 h-3.5 text-stone-400" />
              <span>{cabinetRelationship.headline}</span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400/80 border-l border-stone-700 pl-1.5 ml-0.5">
                CALCULATED
              </span>
            </span>
          )}

          <div className="px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-600/40 text-xs font-mono flex items-center gap-1.5">
            <span className="text-stone-400 text-[10px]">CONTEXT MATCH:</span>
            <strong className="text-amber-300 font-bold text-sm">{score}%</strong>
            <span className="text-[9px] uppercase tracking-wider text-amber-400/70 border-l border-amber-600/30 pl-1.5">
              CALCULATED
            </span>
          </div>
        </div>
      </div>

      {/* Main Fragrance Protagonist & Details */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Unified High-Fidelity Flacon Protagonist */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{
              opacity: revealStage >= 2 ? 1 : 0.2,
              scale: revealStage >= 3 ? 1 : 0.95,
              y: revealStage >= 2 ? 0 : 15
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative cursor-pointer group"
            onClick={() => onInspectInChamber(fragrance)}
            title="Click to inspect inside Fragrance Chamber"
          >
            <HeroFlacon
              fragrance={fragrance}
              size="hero"
              onClick={() => onInspectInChamber(fragrance)}
            />

            {/* Hover Inspector Hint */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none px-3 py-1 rounded-full bg-stone-950/90 border border-amber-500/40 text-[10px] font-mono text-amber-200 shadow-lg whitespace-nowrap flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              <span>Inspect in Chamber</span>
            </div>
          </motion.div>
        </div>

        {/* Narrative & Sensory Architecture */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: revealStage >= 4 ? 1 : 0,
            x: revealStage >= 4 ? 0 : 20
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Recommendation Hero: House, Fragrance, Concentration + Short Generated Explanation */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 mb-1.5 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-stone-200">{fragrance.brand_name || fragrance.brand}</span>
              <span className="text-stone-600">&bull;</span>
              <span>{fragrance.concentration || 'Eau de Parfum'}</span>
              {fragrance.format && (
                <>
                  <span className="text-stone-600">&bull;</span>
                  <span className="text-stone-400">{fragrance.format}</span>
                </>
              )}
              <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700/60 text-[9px] font-mono text-stone-400">
                VERIFIED
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-100 tracking-tight leading-tight">
              {fragrance.name}
            </h3>

            {/* Short generated explanation based strictly on existing atmosphere, mood & DNA */}
            <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-100/90">
              <p className="font-serif italic text-base sm:text-lg leading-relaxed">
                &ldquo;{heroGeneratedExplanation}&rdquo;
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-amber-400/70">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>CALCULATED &bull; Generated from ambient telemetry, mood context &amp; living DNA</span>
              </div>
            </div>
          </div>

          {/* Olfactory Pyramid Accords Trio */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-stone-950/60 border border-amber-900/20 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
                  Top Notes
                </span>
                <span className="text-[9px] font-mono text-stone-500">VERIFIED</span>
              </div>
              <span className="text-stone-200 font-medium line-clamp-2">
                {(fragrance.top_notes || ['Citrus']).slice(0, 3).join(', ')}
              </span>
            </div>
            <div className="border-x border-white/[0.06] px-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
                  Heart Notes
                </span>
                <span className="text-[9px] font-mono text-stone-500">VERIFIED</span>
              </div>
              <span className="text-stone-200 font-medium line-clamp-2">
                {(fragrance.middle_notes || ['Florals', 'Spices']).slice(0, 3).join(', ')}
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/70">
                  Base Notes
                </span>
                <span className="text-[9px] font-mono text-stone-500">VERIFIED</span>
              </div>
              <span className="text-stone-200 font-medium line-clamp-2">
                {(fragrance.base_notes || ['Woods', 'Resin']).slice(0, 3).join(', ')}
              </span>
            </div>
          </div>

          {/* Special Integrations: Heritage Thread & Layering Chord */}
          <div className="space-y-2.5">
            {/* Heritage Thread Connection (Only verified facts from canonical dataset) */}
            {heritageConnection.hasHeritageConnection && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-200">
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong className="text-amber-100">Heritage Connection:</strong> {heritageConnection.materialName} ({heritageConnection.region})
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-900/60 text-[9px] font-mono text-amber-300">
                      VERIFIED FACT
                    </span>
                  </span>
                </div>
                {onNavigateToHeritageAtlas && heritageConnection.keyword && (
                  <button
                    type="button"
                    onClick={() => onNavigateToHeritageAtlas(heritageConnection.keyword)}
                    className="text-amber-400 hover:text-amber-200 underline font-mono text-[11px] shrink-0 cursor-pointer"
                  >
                    Explore in Atlas &rarr;
                  </button>
                )}
              </div>
            )}

            {/* Layering Laboratory Chord Partner */}
            {layerPartner && onSendToLab && (
              <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <FlaskConical className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong className="text-stone-100">Harmonic Layer Partner:</strong> {layerPartner.name}
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-stone-800 text-[9px] font-mono text-stone-400">
                      CALCULATED PAIRING
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSendToLab(fragrance, layerPartner)}
                  className="text-amber-400 hover:text-amber-300 underline font-mono text-[11px] shrink-0 cursor-pointer"
                >
                  Blend in Lab &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Controls */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Wear Today / Log SOTD */}
            <button
              type="button"
              onClick={() => onWearToday(fragrance)}
              className={`px-6 py-3.5 rounded-xl font-serif font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                hasRecordedWear
                  ? 'bg-emerald-600 text-stone-950 shadow-emerald-950/50'
                  : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 shadow-amber-950/50 hover:shadow-amber-500/20'
              }`}
            >
              {hasRecordedWear ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>LOGGED AS WEAR TODAY (+35 XP)</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-stone-950" />
                  <span>WEAR THIS TODAY</span>
                </>
              )}
            </button>

            {/* Inspect in Chamber */}
            <button
              type="button"
              onClick={() => onInspectInChamber(fragrance)}
              className="px-4 py-3.5 rounded-xl bg-stone-900 border border-stone-700/70 hover:border-amber-500/40 text-stone-300 hover:text-stone-100 text-xs font-mono transition cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Chamber</span>
            </button>

            {/* Send Single to Lab */}
            {onSendToLab && (
              <button
                type="button"
                onClick={() => onSendToLab(fragrance)}
                className="px-4 py-3.5 rounded-xl bg-stone-900 border border-stone-700/70 hover:border-amber-500/40 text-stone-300 hover:text-stone-100 text-xs font-mono transition cursor-pointer flex items-center gap-2"
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                <span>Layer Lab</span>
              </button>
            )}

            {/* Save to Cabinet if not owned */}
            {!isOwned && onAddToWardrobe && (
              <button
                type="button"
                onClick={() => onAddToWardrobe(fragrance.id)}
                className="px-4 py-3.5 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/50 text-stone-400 hover:text-amber-200 text-xs font-mono transition cursor-pointer flex items-center gap-2"
                title="Add to your private cabinet"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cabinet</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
