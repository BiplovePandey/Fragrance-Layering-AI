import React, { useState } from 'react';
import { Fragrance, MainNavId, LivingOlfactoryDNA } from '../../types.js';
import { AcademyHero, ACADEMY_LESSONS } from '../academy/AcademyHero.js';
import { AcademyLessonEvaporation } from '../academy/AcademyLessonEvaporation.js';
import { AcademyLesson8DVector } from '../academy/AcademyLesson8DVector.js';
import { AcademyLessonIndianHeritage } from '../academy/AcademyLessonIndianHeritage.js';
import { AcademyLessonLayeringScience } from '../academy/AcademyLessonLayeringScience.js';
import { AcademyLessonNoseTrainer } from '../academy/AcademyLessonNoseTrainer.js';
import { AcademyCabinetBridge } from '../academy/AcademyCabinetBridge.js';
import { olfactoryIntelligence } from '../../services/olfactoryIntelligence.js';

interface AcademyViewProps {
  fragrances: Fragrance[];
  wardrobeFragrances?: Fragrance[];
  onSelectFragranceForChamber: (fragrance: Fragrance) => void;
  onSendToLaboratory: (fragrance: Fragrance, fragB?: Fragrance) => void;
  onAddToWardrobe: (fragrance: Fragrance) => void;
  onNavigate: (tab: MainNavId) => void;
  onNavigateToHeritageAtlas?: (materialId?: string) => void;
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  fragrances,
  wardrobeFragrances = [],
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onAddToWardrobe,
  onNavigate,
  onNavigateToHeritageAtlas,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>('04-evaporation');
  const [currentXP, setCurrentXP] = useState<number>(380);

  // Retrieve user's living DNA profile
  const userDNA = olfactoryIntelligence.getLivingDNA();

  return (
    <div className="min-h-screen bg-[#0A0908] text-stone-200 pb-24 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Academy Master Hero Banner & Curriculum Grid */}
        <AcademyHero
          currentXP={currentXP}
          activeLessonId={activeLessonId}
          onSelectLesson={(id) => setActiveLessonId(id)}
          userDNA={userDNA}
          onNavigateToScanner={() => onNavigate('scanner')}
        />

        {/* Dynamic Learning Chamber Content */}
        <main className="space-y-10">
          {activeLessonId === '04-evaporation' && (
            <AcademyLessonEvaporation
              onExperimentInLab={() => onNavigate('layer')}
            />
          )}

          {(activeLessonId === '11-8d-vector' || activeLessonId === '12-cosine-similarity') && (
            <AcademyLesson8DVector
              allFragrances={fragrances}
              onInspectInChamber={onSelectFragranceForChamber}
              onSendToLaboratory={(fA, fB) => onSendToLaboratory(fA, fB)}
            />
          )}

          {(activeLessonId === '13-indian-perfumery' || activeLessonId === '14-deg-bhapka') && (
            <AcademyLessonIndianHeritage
              onNavigateToHeritageAtlas={onNavigateToHeritageAtlas}
            />
          )}

          {activeLessonId === '09-layering' && (
            <AcademyLessonLayeringScience
              onExperimentInLab={() => onNavigate('layer')}
            />
          )}

          {activeLessonId === '15-nose-gym' && (
            <AcademyLessonNoseTrainer
              allFragrances={fragrances}
            />
          )}

          {/* Foundation & Architecture Fallback Chamber */}
          {activeLessonId !== '04-evaporation' &&
            activeLessonId !== '11-8d-vector' &&
            activeLessonId !== '12-cosine-similarity' &&
            activeLessonId !== '13-indian-perfumery' &&
            activeLessonId !== '14-deg-bhapka' &&
            activeLessonId !== '09-layering' &&
            activeLessonId !== '15-nose-gym' && (
              <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-10 text-stone-200 shadow-2xl space-y-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
                    Foundational Lecture
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-stone-400 border border-white/[0.08] font-mono">
                    [ EDUCATIONAL OVERVIEW ]
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-medium text-[#F8F5EE]">
                  {ACADEMY_LESSONS.find((l) => l.id === activeLessonId)?.title || 'Olfactory Foundations'}
                </h2>
                <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
                  {ACADEMY_LESSONS.find((l) => l.id === activeLessonId)?.subtitle ||
                    'Mastering the delicate balance between volatile materials, epidermal warmth, and aesthetic balance.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#14110E] border border-white/[0.06] space-y-2">
                    <span className="text-amber-400 font-mono font-bold block">1. Volatile Classification</span>
                    <p className="text-stone-400">
                      Materials are grouped by vapor pressure: High (Citrus/Aromatics), Medium (Florals/Spices), and Low (Heartwoods/Resins).
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#14110E] border border-white/[0.06] space-y-2">
                    <span className="text-amber-400 font-mono font-bold block">2. Epidermal Binding</span>
                    <p className="text-stone-400">
                      Skin warmth and sebum lipid concentration dictate sillage expansion and drydown retention curves.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#14110E] border border-white/[0.06] space-y-2">
                    <span className="text-amber-400 font-mono font-bold block">3. Heritage Lineage</span>
                    <p className="text-stone-400">
                      Ancient Kannauj hydro-distillation anchors volatile steam into sandalwood beds without chemical synthetic fixatives.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Academy + Cabinet Personal Comparison Bridge */}
          <AcademyCabinetBridge
            wardrobeFragrances={wardrobeFragrances}
            onInspectInChamber={onSelectFragranceForChamber}
            onSendToLaboratory={(fA, fB) => onSendToLaboratory(fA, fB)}
            onNavigateToCabinet={() => onNavigate('wardrobe')}
          />
        </main>
      </div>
    </div>
  );
};
