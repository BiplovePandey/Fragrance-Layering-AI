import React from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Flame,
  ChevronRight,
  Atom,
  Wind,
  Compass,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { LivingOlfactoryDNA } from '../../types.js';

export interface AcademyLessonMeta {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'foundations' | 'physics' | 'vector' | 'heritage' | 'mastery';
  xpReward: number;
  completed?: boolean;
}

export const ACADEMY_LESSONS: AcademyLessonMeta[] = [
  {
    id: '01-language',
    number: '01',
    title: 'The Language of Scent',
    subtitle: 'From poetic imagery to chemical reality: notes, accords, and sillage.',
    category: 'foundations',
    xpReward: 30,
  },
  {
    id: '02-architecture',
    number: '02',
    title: 'The Architecture of a Fragrance',
    subtitle: 'Pyramid structure, composition balance, and harmony.',
    category: 'foundations',
    xpReward: 35,
  },
  {
    id: '04-evaporation',
    number: '04',
    title: 'Top / Heart / Base & Evaporation Kinetics',
    subtitle: 'Molecular vapor pressure across 0m, 15m, 1h, 6h, and 12h+ drydown.',
    category: 'physics',
    xpReward: 50,
  },
  {
    id: '05-concentration',
    number: '05',
    title: 'Concentration & Format Taxonomy',
    subtitle: 'EDT, EDP, Extrait (20-40%), and pure Attar oil distillates.',
    category: 'physics',
    xpReward: 35,
  },
  {
    id: '08-families',
    number: '08',
    title: 'The Fragrance Family Atlas',
    subtitle: 'Woody, Amber, Floral, Earthy/Petrichor, Citrus, Green, Aquatic.',
    category: 'foundations',
    xpReward: 40,
  },
  {
    id: '09-layering',
    number: '09',
    title: 'The Science of Layering',
    subtitle: 'Anchor, lift, bridge, contrast, and fixative support principles.',
    category: 'mastery',
    xpReward: 55,
  },
  {
    id: '10-climate',
    number: '10',
    title: 'Weather & Atmospheric Diffusion',
    subtitle: 'How temperature and relative humidity accelerate or mute scent sillage.',
    category: 'physics',
    xpReward: 45,
  },
  {
    id: '11-8d-vector',
    number: '11',
    title: 'The 8D Olfactory Vector Engine',
    subtitle: 'Mapping perfumes into 8-dimensional mathematical scent space.',
    category: 'vector',
    xpReward: 60,
  },
  {
    id: '12-cosine-similarity',
    number: '12',
    title: 'Cosine Similarity vs. Compatibility',
    subtitle: 'Why similar fragrances overlap, but complementary vectors harmonize.',
    category: 'vector',
    xpReward: 60,
  },
  {
    id: '13-indian-perfumery',
    number: '13',
    title: 'Indian Perfumery & Heritage Materials',
    subtitle: 'Kannauj Mitti, Wild Ruh Khus, Mysore Sandalwood, and Attar traditions.',
    category: 'heritage',
    xpReward: 50,
  },
  {
    id: '14-deg-bhapka',
    number: '14',
    title: 'Interactive Deg-Bhapka Distillation',
    subtitle: 'From copper cauldron to bamboo chonga, ganda tank, and kupi maturation.',
    category: 'heritage',
    xpReward: 65,
  },
  {
    id: '15-nose-gym',
    number: '15',
    title: 'Developing Your Nose: Sensory Gym',
    subtitle: 'Interactive blind challenges: predict volatility, detect chords, earn XP.',
    category: 'mastery',
    xpReward: 75,
  },
];

interface AcademyHeroProps {
  currentXP: number;
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  userDNA?: LivingOlfactoryDNA;
  onNavigateToScanner?: () => void;
}

export const AcademyHero: React.FC<AcademyHeroProps> = ({
  currentXP,
  activeLessonId,
  onSelectLesson,
  userDNA,
  onNavigateToScanner,
}) => {
  // Derive user rank title
  const getRankTitle = (xp: number) => {
    if (xp >= 800) return 'Advanced Connoisseur';
    if (xp >= 500) return 'Olfactory Practitioner';
    if (xp >= 300) return 'Fragrance Student';
    if (xp >= 150) return 'Scent Explorer';
    return 'Atelier Apprentice';
  };

  const rank = getRankTitle(currentXP);

  return (
    <div className="space-y-8">
      {/* Academy Master Chamber Entrance Banner */}
      <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-10 text-stone-200 shadow-2xl relative overflow-hidden">
        {/* Smoked glass & soft brass amber ambient backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
                The Research Wing &bull; Instrument 02
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#F8F5EE] font-medium tracking-tight mt-1.5">
              The Scent Academy
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-amber-200/80 mt-1">
              &ldquo;Learn to read fragrance.&rdquo;
            </p>
            <p className="text-xs text-stone-400 max-w-2xl mt-2 leading-relaxed font-sans">
              An interactive school of olfactory physics, volatile kinetics, 8-dimensional vector analysis, and centuries-old Kannauj hydro-distillation traditions. Every principle is taught through direct observation, mathematical simulation, and interactive challenges.
            </p>
          </div>

          {/* Right Side: Scholar Progress Dossier & Scanner Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[#14110E] border border-amber-500/30 flex items-center gap-3.5 shadow-inner">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 block">
                  Scholar Standing
                </span>
                <span className="font-serif text-base text-[#F8F5EE] font-medium">
                  {rank}
                </span>
                <span className="text-[11px] text-stone-400 font-mono block">
                  {currentXP} Atelier XP Accrued
                </span>
              </div>
            </div>

            {onNavigateToScanner && (
              <button
                type="button"
                onClick={onNavigateToScanner}
                className="px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-stone-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Switch to Scanner</span>
              </button>
            )}
          </div>
        </div>

        {/* Personalized Olfactory Portrait Bridge (if DNA exists) */}
        {userDNA && (
          <div className="relative z-10 mt-6 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-stone-300">
                <strong className="text-amber-200">Personalized to Your Olfactory DNA:</strong>{' '}
                Your profile reflects <span className="font-semibold text-white">{userDNA.personalityTitle}</span> (Woody {userDNA.vector?.woody || 75}%, Earthy {userDNA.vector?.earthy_clay || 85}%). Lessons adapt examples to your natural affinities.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest shrink-0">
              [ ADAPTIVE CURRICULUM ]
            </span>
          </div>
        )}

        {/* Scientific Honesty Disclaimer Badge */}
        <div className="relative z-10 mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-stone-500">
          <span className="flex items-center gap-1.5">
            <Atom className="w-3 h-3 text-amber-400" />
            <span>Strict Epistemological Taxonomy: Verified Data, Modelled Physics, &amp; Educational Simplifications are explicitly tagged.</span>
          </span>
          <span className="text-amber-400/80">CANONICAL ACADEMY REPOSITORY</span>
        </div>
      </div>

      {/* Curriculum Chamber Grid Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold">
            Curriculum Learning Chambers ({ACADEMY_LESSONS.length} Interactive Modules)
          </span>
          <span className="text-xs font-mono text-stone-500">
            Select a chamber to engage
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {ACADEMY_LESSONS.map((lesson) => {
            const isActive = activeLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                  isActive
                    ? 'bg-amber-500/20 border-2 border-amber-400 text-stone-100 shadow-lg'
                    : 'bg-[#14110E] border border-white/[0.06] hover:border-amber-500/40 text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className={isActive ? 'text-amber-300 font-bold' : 'text-stone-500'}>
                    CH-{lesson.number}
                  </span>
                  <span className="text-amber-400/80 font-semibold">+{lesson.xpReward} XP</span>
                </div>
                <h4
                  className={`font-serif text-xs font-medium line-clamp-2 ${
                    isActive ? 'text-amber-200 font-semibold' : 'group-hover:text-stone-100'
                  }`}
                >
                  {lesson.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
