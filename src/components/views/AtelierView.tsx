import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  FlaskConical,
  Layers,
  CloudSun,
  Compass,
  ArrowRight,
  Droplets,
  Thermometer,
  ShieldCheck,
  Flame,
  Award,
  BookOpen,
  Camera,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import {
  Fragrance,
  WeatherCondition,
  LayeringResult,
  UserGamification,
  DailyMoodPreset
} from '../../types.js';
import { calculateWeatherAlignmentScore } from '../../services/weatherEngine.js';
import { ScentFamilyAtmosphere } from '../AtmosphericFragranceCanvas.js';
import { MotionCard, MotionButton, MotionModal, MotionNumber, MotionReveal } from '../../motion/components.js';
import { getFlaconLayoutId, SHARED_FLACON_TRANSITION } from '../../motion/sharedElements.js';
import { MOTION_SPRINGS, MOTION_DURATIONS, MOTION_EASINGS } from '../../motion/config.js';
import { WhatShouldIWearModal } from '../WhatShouldIWearModal.js';
import { AiPerfumerDrawer } from '../AiPerfumerDrawer.js';
import { AiFragranceScannerModal } from '../AiFragranceScannerModal.js';
import { ScentAcademyModal } from '../ScentAcademyModal.js';

interface AtelierViewProps {
  fragrances: Fragrance[];
  weather: WeatherCondition;
  onOpenWeatherModal: () => void;
  gamification: UserGamification;
  wardrobeFragrances: Fragrance[];
  onNavigate: (tab: any) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
  onSendToLaboratory: (fragA: Fragrance, fragB?: Fragrance) => void;
  onSetAtmosphere: (atm: ScentFamilyAtmosphere) => void;
  currentAtmosphere: ScentFamilyAtmosphere;
  onWearToday?: (frag: Fragrance, partner?: Fragrance) => void;
  onAddToWardrobe?: (fragId: number) => void;
}

export const AtelierView: React.FC<AtelierViewProps> = ({
  fragrances = [],
  weather,
  onOpenWeatherModal,
  gamification,
  wardrobeFragrances = [],
  onNavigate,
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onSetAtmosphere,
  currentAtmosphere,
  onWearToday,
  onAddToWardrobe
}) => {
  const [showTodayAdvisor, setShowTodayAdvisor] = useState(false);
  const [showAiPerfumer, setShowAiPerfumer] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAcademy, setShowAcademy] = useState(false);

  // Scent of the day: choose a high-weather-compatibility perfume
  const safeFrags = Array.isArray(fragrances) ? fragrances : [];
  const rankedByWeather = safeFrags.map((f) => ({
    frag: f,
    ...calculateWeatherAlignmentScore(f, weather)
  })).sort((a, b) => b.score - a.score);

  const scentOfTheDay = rankedByWeather[0]?.frag || safeFrags[0];
  const scentOfTheDayScore = rankedByWeather[0]?.score || 94;
  const scentOfTheDayAdvisory = rankedByWeather[0]?.advisory || '';

  // Recommended Chord: Choose 2 complementary perfumes
  const partnerFrag = safeFrags.find(f => f.id !== scentOfTheDay?.id && f.fragrance_family !== scentOfTheDay?.fragrance_family) || safeFrags[1];

  const atmosphereOptions: { id: ScentFamilyAtmosphere; label: string; icon: string }[] = [
    { id: 'rose', label: 'Damask Rose (Floating)', icon: '🌹' },
    { id: 'oud', label: 'Assam Oud (Dense Smoke)', icon: '🪵' },
    { id: 'citrus', label: 'Bergamot (Sparkling)', icon: '🍋' },
    { id: 'earthy', label: 'Mitti Attar (Petrichor Dust)', icon: '🌧️' },
    { id: 'aquatic', label: 'Marine Mist (Flowing)', icon: '🌊' },
    { id: 'woody', label: 'Mysore Sandal (Organic Drift)', icon: '🌲' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#181512]/90 via-[#13100E]/80 to-[#0F0D0B]/90 border border-amber-600/20 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Fragrance Atelier &bull; Living Universe</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-stone-100 leading-tight">
            Good {weather.time_of_day}, Alchemist.
          </h1>
          <p className="text-sm sm:text-base text-stone-300 mt-3 font-sans leading-relaxed max-w-2xl">
            The atelier is calibrated to <span className="text-amber-300 font-medium">{weather.temperature_c}°C</span> with{' '}
            <span className="text-cyan-300 font-medium">{weather.humidity_pct}% relative humidity</span> ({weather.season}).
            Atmospheric molecules favor volatile citrus diffusion and resinous woody anchors.
          </p>

          {/* Primary Action Row */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <MotionButton
              id="what-to-wear-today-btn"
              variant="primary"
              onClick={() => setShowTodayAdvisor(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-700 to-amber-700 hover:from-amber-500 hover:to-rose-600 text-stone-100 font-semibold text-sm shadow-xl shadow-amber-950/40 cursor-pointer flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>WHAT SHOULD I WEAR TODAY?</span>
              <ArrowRight className="w-4 h-4 text-amber-200 ml-1" />
            </MotionButton>

            <MotionButton
              id="enter-lab-btn"
              variant="tactile"
              onClick={() => onNavigate('layer')}
              className="px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-stone-200 text-sm font-medium transition cursor-pointer flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>Enter Scent Laboratory</span>
            </MotionButton>

            <MotionButton
              id="explore-galaxy-btn"
              variant="tactile"
              onClick={() => onNavigate('explore')}
              className="px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-stone-200 text-sm font-medium transition cursor-pointer flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Olfactory Galaxy</span>
            </MotionButton>
          </div>
        </div>

        {/* Ambient Particle Mood Switcher */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-amber-400" /> Ambient Fragrance Mist Physics:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {atmosphereOptions.map((opt) => (
              <motion.button
                key={opt.id}
                type="button"
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => onSetAtmosphere(opt.id)}
                className={`px-3 py-1 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 ${
                  currentAtmosphere === opt.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-medium shadow-xs'
                    : 'bg-white/[0.02] text-stone-400 hover:text-stone-200 border border-white/[0.06]'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label.split('(')[0].trim()}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Key Atelier Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scent of the Day Showcase (Large Card) */}
        <MotionCard
          enableTilt
          className="lg:col-span-2 rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-xl flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-700/40 text-rose-300 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>SCENT OF THE DAY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono">Atmospheric Fit:</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
                  <MotionNumber value={scentOfTheDayScore} suffix="%" />
                </span>
              </div>
            </div>

            {scentOfTheDay && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Flacon Visual Anchor with shared layout ID */}
                  <motion.div
                    layoutId={getFlaconLayoutId(scentOfTheDay.id)}
                    transition={SHARED_FLACON_TRANSITION}
                    onClick={() => onSelectFragranceForChamber(scentOfTheDay)}
                    className="w-14 h-18 sm:w-16 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-black/50 border border-amber-500/30 flex flex-col items-center justify-center shrink-0 cursor-pointer shadow-md group-hover:scale-105 transition-transform"
                    title="Click to inspect in 3D chamber"
                  >
                    <div className="w-4 h-2 rounded-xs bg-amber-400/80 border border-amber-300/40 mb-1" />
                    <div className="w-8 h-10 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                  </motion.div>

                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                        {scentOfTheDay.name}
                      </h2>
                      <span className="text-sm font-sans text-amber-400 font-medium">
                        by {scentOfTheDay.brand}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-stone-300 border border-white/[0.08] self-start">
                        {scentOfTheDay.concentration || scentOfTheDay.fragrance_type || 'Fine Parfum'}
                      </span>
                    </div>

                    <p className="text-sm text-stone-300 leading-relaxed max-w-2xl mt-2">
                      {scentOfTheDay.description}
                    </p>
                  </div>
                </div>

                {/* Notes Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {scentOfTheDay.top_notes?.slice(0, 3).map((n) => (
                    <span key={n} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-stone-300">
                      🌿 {n}
                    </span>
                  ))}
                  {scentOfTheDay.base_notes?.slice(0, 2).map((n) => (
                    <span key={n} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                      🪵 {n}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-stone-400 italic pt-1">
                  &ldquo;{scentOfTheDayAdvisory}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {scentOfTheDay && (
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <MotionButton
                variant="tactile"
                onClick={() => onSelectFragranceForChamber(scentOfTheDay)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer py-1"
              >
                <span>Inspect in Fragrance Chamber</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </MotionButton>

              <MotionButton
                variant="tactile"
                onClick={() => onSendToLaboratory(scentOfTheDay, partnerFrag)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Pair with {partnerFrag?.name || 'Companion'}</span>
              </MotionButton>
            </div>
          )}
        </MotionCard>

        {/* Environmental & Volatility Status Card */}
        <MotionCard
          enableTilt
          className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 backdrop-blur-md shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <CloudSun className="w-4 h-4" /> Live Atmosphere
              </span>
              <MotionButton
                variant="tactile"
                onClick={onOpenWeatherModal}
                className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
              >
                Change
              </MotionButton>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-400">Temperature</span>
                  <span className="text-sm font-mono font-bold text-amber-300">
                    <MotionNumber value={weather.temperature_c} suffix="°C" />
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-stone-400">Humidity</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    <MotionNumber value={weather.humidity_pct} suffix="%" />
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-stone-400">Season Context</span>
                  <span className="text-sm font-sans font-medium text-stone-200">{weather.season}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-600/20">
                <h4 className="text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5" /> Volatility Calculation
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Evaporation is operating at <strong className="text-stone-100">{weather.perceived_modifiers.intensityFactor}x baseline</strong>.
                  Top notes linger {weather.humidity_pct > 65 ? 'longer due to moisture retention' : 'sharply with fast sillage dispersal'}.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">Rank Progression:</span>
            <span className="text-xs font-mono font-semibold text-amber-400">
              {gamification.title} ({gamification.xp} XP)
            </span>
          </div>
        </MotionCard>
      </div>

      {/* Recommended Scent Chord Showcase */}
      <MotionReveal>
        <section className="rounded-3xl bg-gradient-to-r from-amber-950/25 via-[#16120F]/90 to-purple-950/25 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>TODAY'S ALCHEMICAL CHORD</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-stone-100">
                Chypre Petrichor &amp; Smoked Wood
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1">
                Harmonic fusion of Indian artisanal petrichor with high-altitude vetiver roots and sparkling bergamot.
              </p>
            </div>

            <MotionButton
              variant="tactile"
              onClick={() => onSendToLaboratory(scentOfTheDay, partnerFrag)}
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-semibold transition cursor-pointer flex items-center gap-2 self-start sm:self-center"
            >
              <span>Simulate this Chord in Lab</span>
              <ArrowRight className="w-4 h-4" />
            </MotionButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-stone-400">Base Anchor (Skin)</span>
              <h4 className="text-base font-serif text-stone-100 font-medium mt-1">
                {scentOfTheDay?.name || 'Mitti Attar'}
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Provides the alluvial clay heartwood foundation that fixes volatile top notes for 9+ hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-amber-400">Diffusion Spark (Collarbone)</span>
              <h4 className="text-base font-serif text-stone-100 font-medium mt-1">
                {partnerFrag?.name || 'Raw Citrus EDP'}
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Injects luminous effervescence and airy projection across the 1–3 hour opening envelope.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-300">Chord Synergy Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-mono font-bold text-amber-300">
                    <MotionNumber value={96} suffix="%" />
                  </span>
                  <span className="text-xs text-stone-400">Harmonic Match</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-300 mt-2">
                Application ritual: 1 spray base to chest; 2 sprays spark to collarbone. Wait 45 seconds before blending.
              </p>
            </div>
          </div>
        </section>
      </MotionReveal>

      {/* Quick Access to Heritage & Wardrobe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heritage Section Teaser */}
        <MotionCard
          enableTilt
          onClick={() => onNavigate('heritage')}
          className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 hover:border-amber-500/40 transition cursor-pointer group shadow-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/30 border border-amber-700/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">Artisanal Roots</span>
              <h3 className="font-serif text-xl text-stone-100 font-medium">Indian Fragrance Heritage Atlas</h3>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Discover 400+ years of Kannauj Deg-Bhapka distillation, wild Ruh Khus roots, Assam agarwood, and how these traditional materials layer with modern international perfumery.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
            <span>Explore 6 Heritage Master Profiles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </MotionCard>

        {/* Wardrobe Teaser */}
        <MotionCard
          enableTilt
          onClick={() => onNavigate('wardrobe')}
          className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 hover:border-rose-500/40 transition cursor-pointer group shadow-xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900/30 border border-rose-700/40 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-rose-400 tracking-wider">Curator's Cabinet</span>
              <h3 className="font-serif text-xl text-stone-100 font-medium">Personal Digital Wardrobe</h3>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Manage your owned flacons, track testing samples, analyze your olfactory DNA coverage, and uncover hidden gaps in your fragrance collection.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-400 group-hover:text-rose-300">
            <span>View {wardrobeFragrances?.length || 0} Curated Bottles &amp; Collection Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </MotionCard>
      </div>

      {/* PILLAR AI INTELLIGENCE SUITE: ATELIER TOOLS */}
      <div className="rounded-3xl bg-[#14120F]/90 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Computational Olfactory Instruments</span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-stone-100">
              Atelier Intelligence &amp; Laboratory Suite
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Apple Haptics &bull; Liquid Physics &bull; 8-D Olfactory Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: AI Perfumer Concierge */}
          <MotionCard
            enableTilt
            onClick={() => setShowAiPerfumer(true)}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#1c1815] to-[#120f0d] border border-amber-500/25 hover:border-amber-400/60 transition cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">Concierge AI</span>
              <h4 className="font-serif text-xl text-stone-100 font-medium mt-1">
                AI Master Perfumer
              </h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Consult an AI nose trained on olfactory chemistry, seasonal meteorology, and your personal scent memory.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>Open Concierge Drawer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </MotionCard>

          {/* Card 2: AI Flacon Scanner */}
          <MotionCard
            enableTilt
            onClick={() => setShowScanner(true)}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#1c1815] to-[#120f0d] border border-rose-500/25 hover:border-rose-400/60 transition cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-4 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block">Computer Vision</span>
              <h4 className="font-serif text-xl text-stone-100 font-medium mt-1">
                Flacon &amp; Box Scanner
              </h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Upload or photograph any perfume bottle or packaging box. Automatically extracts notes, accords, concentration, and adds to wardrobe.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-rose-300">
              <span>Scan Fragrance Flacon</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </MotionCard>

          {/* Card 3: Scent Academy */}
          <MotionCard
            enableTilt
            onClick={() => setShowAcademy(true)}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#1c1815] to-[#120f0d] border border-purple-500/25 hover:border-purple-400/60 transition cursor-pointer flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Perfumery Science</span>
              <h4 className="font-serif text-xl text-stone-100 font-medium mt-1">
                Scent Academy &amp; Physics
              </h4>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Deep dive into molecular volatility, skin lipid chemistry, hydro-distillation in Kannauj, and master fragrance testing quizzes for XP.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-purple-300">
              <span>Enter Academy (+XP)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </MotionCard>
        </div>
      </div>

      {/* "What Should I Wear Today?" Full Intelligent Modal */}
      <WhatShouldIWearModal
        isOpen={showTodayAdvisor}
        onClose={() => setShowTodayAdvisor(false)}
        allFragrances={fragrances}
        ownedFragrances={wardrobeFragrances}
        weather={weather}
        onSendToLab={onSendToLaboratory}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
        onWearToday={(frag, partner) => {
          onWearToday?.(frag, partner);
          setShowTodayAdvisor(false);
        }}
      />

      {/* AI Master Perfumer Drawer */}
      <AiPerfumerDrawer
        isOpen={showAiPerfumer}
        onClose={() => setShowAiPerfumer(false)}
        allFragrances={fragrances}
        ownedFragrances={wardrobeFragrances}
        weather={weather}
        onSendToLab={onSendToLaboratory}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
      />

      {/* AI Bottle Scanner Modal */}
      <AiFragranceScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        allFragrances={fragrances}
        onAddToWardrobe={(id) => onAddToWardrobe?.(id)}
        onSelectFragranceForChamber={onSelectFragranceForChamber}
      />

      {/* Scent Academy Modal */}
      <ScentAcademyModal
        isOpen={showAcademy}
        onClose={() => setShowAcademy(false)}
      />
    </div>
  );
};
