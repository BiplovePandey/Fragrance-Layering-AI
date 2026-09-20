import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HERITAGE_ENTRIES } from '../../data/heritageAtlas.js';
import { HeritageEntry, Fragrance, MainNavId } from '../../types.js';
import { awardXP } from '../../services/gamificationEngine.js';
import { HeritageHero } from '../heritage/HeritageHero.js';
import { OlfactoryMap } from '../heritage/OlfactoryMap.js';
import { BotanicalArchive } from '../heritage/BotanicalArchive.js';
import { KannaujHeroSection } from '../heritage/KannaujHeroSection.js';
import { DegBhapkaExploration } from '../heritage/DegBhapkaExploration.js';
import { AttarArchive } from '../heritage/AttarArchive.js';
import { CraftArchive } from '../heritage/CraftArchive.js';
import { HeritageSearchAndFilter, HeritageViewTab } from '../heritage/HeritageSearchAndFilter.js';
import { HeritageSpecimenDetail } from '../heritage/HeritageSpecimenDetail.js';
import { HeritageCabinetBridge } from '../heritage/HeritageCabinetBridge.js';
import { findCabinetMatchesForHeritage } from '../../services/heritageService.js';

interface HeritageAtlasViewProps {
  onSendToLab: (fragA: Fragrance, fragB?: Fragrance) => void;
  allFragrances: Fragrance[];
  ownedFragrances?: Fragrance[];
  onInspectInChamber?: (fragrance: Fragrance) => void;
  onWearToday?: (fragrance: Fragrance) => void;
  onNavigate?: (tab: MainNavId) => void;
}

export const HeritageAtlasView: React.FC<HeritageAtlasViewProps> = ({
  onSendToLab,
  allFragrances,
  ownedFragrances = [],
  onInspectInChamber,
  onWearToday,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<HeritageViewTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecimen, setSelectedSpecimen] = useState<HeritageEntry | null>(null);

  // Compute how many specimens connect to the user's personal cabinet
  const totalCabinetMatches = useMemo(() => {
    let count = 0;
    for (const entry of HERITAGE_ENTRIES) {
      const matches = findCabinetMatchesForHeritage(entry, ownedFragrances);
      if (matches.length > 0) count++;
    }
    return count;
  }, [ownedFragrances]);

  // Kannauj-specific specimens
  const kannaujEntries = useMemo(() => {
    return HERITAGE_ENTRIES.filter((e) => e.region.toLowerCase().includes('kannauj'));
  }, []);

  const handleOpenSpecimen = (entry: HeritageEntry) => {
    setSelectedSpecimen(entry);
    awardXP(25, 'heritage_voyager');
  };

  // Filtered specimens if searching globally
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return HERITAGE_ENTRIES.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.hindi_name.toLowerCase().includes(q) ||
        (e.botanical_name || '').toLowerCase().includes(q) ||
        e.region.toLowerCase().includes(q) ||
        e.olfactory_profile.notes.some((n) => n.toLowerCase().includes(q)) ||
        e.olfactory_profile.dominant_families.some((f) => f.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Cinematic Hero Header */}
      <HeritageHero
        onSelectTab={(t) => setActiveTab(t as HeritageViewTab)}
        activeTab={activeTab}
        totalSpecimens={HERITAGE_ENTRIES.length}
        cabinetMatchesCount={totalCabinetMatches}
      />

      {/* 2. Archival Search & Secondary Filter Controls */}
      <HeritageSearchAndFilter
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cabinetMatchesCount={totalCabinetMatches}
      />

      {/* Global Search Results Layer (if user typed in search) */}
      {searchQuery.trim().length > 0 ? (
        <div className="space-y-6">
          <div className="text-xs font-mono-lab uppercase tracking-widest text-[#D97706] border-b border-[#3E3228] pb-3">
            Search Results for "{searchQuery}" ({searchResults.length} specimens)
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((specimen) => (
                <div
                  key={specimen.id}
                  onClick={() => handleOpenSpecimen(specimen)}
                  className="cursor-pointer p-6 rounded-3xl bg-[#1C1713] border border-[#3E3228] hover:border-[#D97706] transition-all space-y-3"
                >
                  <div className="text-[10px] font-mono-lab uppercase text-[#D97706]">
                    {specimen.region}
                  </div>
                  <h3 className="font-serif text-2xl text-[#FAF5F0]">
                    {specimen.name}
                  </h3>
                  <div className="font-serif italic text-sm text-[#FDE68A]">
                    {specimen.hindi_name}
                  </div>
                  <p className="text-xs text-[#A8988B] line-clamp-2">
                    {specimen.olfactory_profile.description}
                  </p>
                  <div className="text-xs font-mono-lab text-[#FEF3C7] pt-2">
                    Open Archival Dossier →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-[#1C1713] border border-[#3E3228] text-center text-sm text-[#A8988B]">
              No heritage specimens found matching "{searchQuery}".
            </div>
          )}
        </div>
      ) : (
        /* Standard Pillar Views based on Active Tab */
        <div className="space-y-16">
          {/* TAB: ALL ARCHIVE */}
          {activeTab === 'all' && (
            <div className="space-y-16">
              {/* Section 1: Olfactory Map */}
              <OlfactoryMap
                heritageEntries={HERITAGE_ENTRIES}
                onSelectSpecimen={handleOpenSpecimen}
              />

              {/* Section 2: Kannauj Hero Workshop Experience */}
              <KannaujHeroSection
                kannaujEntries={kannaujEntries}
                onSelectSpecimen={handleOpenSpecimen}
              />

              {/* Section 3: Botanical Field Journal */}
              <BotanicalArchive
                heritageEntries={HERITAGE_ENTRIES}
                onSelectSpecimen={handleOpenSpecimen}
              />

              {/* Section 4: Traditional Craft Archive */}
              <CraftArchive />

              {/* Section 5: The Attar Archive */}
              <AttarArchive
                heritageEntries={HERITAGE_ENTRIES}
                allFragrances={allFragrances}
                ownedFragrances={ownedFragrances}
                onSelectSpecimen={handleOpenSpecimen}
                onInspectInChamber={onInspectInChamber}
              />

              {/* Section 6: Cabinet Connection */}
              <HeritageCabinetBridge
                ownedFragrances={ownedFragrances}
                heritageEntries={HERITAGE_ENTRIES}
                onSelectSpecimen={handleOpenSpecimen}
                onInspectInChamber={onInspectInChamber}
                onSendToLab={onSendToLab}
                onWearToday={onWearToday}
                onNavigate={onNavigate}
              />
            </div>
          )}

          {/* TAB: OLFACTORY MAP */}
          {activeTab === 'map' && (
            <OlfactoryMap
              heritageEntries={HERITAGE_ENTRIES}
              onSelectSpecimen={handleOpenSpecimen}
            />
          )}

          {/* TAB: BOTANICALS */}
          {activeTab === 'botanicals' && (
            <BotanicalArchive
              heritageEntries={HERITAGE_ENTRIES}
              onSelectSpecimen={handleOpenSpecimen}
            />
          )}

          {/* TAB: KANNAUJ WORKSHOP */}
          {activeTab === 'kannauj' && (
            <div className="space-y-12">
              <KannaujHeroSection
                kannaujEntries={kannaujEntries}
                onSelectSpecimen={handleOpenSpecimen}
              />
            </div>
          )}

          {/* TAB: CRAFT & STILLS */}
          {activeTab === 'craft' && (
            <div className="space-y-12">
              <DegBhapkaExploration />
              <CraftArchive />
            </div>
          )}

          {/* TAB: ATTARS */}
          {activeTab === 'attars' && (
            <AttarArchive
              heritageEntries={HERITAGE_ENTRIES}
              allFragrances={allFragrances}
              ownedFragrances={ownedFragrances}
              onSelectSpecimen={handleOpenSpecimen}
              onInspectInChamber={onInspectInChamber}
            />
          )}

          {/* TAB: IN MY CABINET */}
          {activeTab === 'cabinet' && (
            <HeritageCabinetBridge
              ownedFragrances={ownedFragrances}
              heritageEntries={HERITAGE_ENTRIES}
              onSelectSpecimen={handleOpenSpecimen}
              onInspectInChamber={onInspectInChamber}
              onSendToLab={onSendToLab}
              onWearToday={onWearToday}
              onNavigate={onNavigate}
            />
          )}
        </div>
      )}

      {/* 5-Level Progressive Disclosure Archival Specimen Modal */}
      <AnimatePresence>
        {selectedSpecimen && (
          <HeritageSpecimenDetail
            specimen={selectedSpecimen}
            onClose={() => setSelectedSpecimen(null)}
            ownedFragrances={ownedFragrances}
            allFragrances={allFragrances}
            onInspectInChamber={onInspectInChamber}
            onSendToLab={onSendToLab}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
