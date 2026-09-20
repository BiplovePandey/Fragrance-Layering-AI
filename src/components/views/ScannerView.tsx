import React, { useState } from 'react';
import {
  Scan,
  Search,
  Edit3,
  GraduationCap,
  Sparkles,
  Layers,
  FlaskConical,
  Eye,
  HeartHandshake
} from 'lucide-react';
import { Fragrance, MainNavId } from '../../types.js';
import { ScannerOpticalChamber } from '../scanner/ScannerOpticalChamber.js';
import { ScannerCatalogueSearch } from '../scanner/ScannerCatalogueSearch.js';
import { ScannerIdentificationReveal } from '../scanner/ScannerIdentificationReveal.js';
import { ScannerUnknownSpecimen } from '../scanner/ScannerUnknownSpecimen.js';
import { ScannerIngestionReview } from '../scanner/ScannerIngestionReview.js';

interface ScannerViewProps {
  fragrances: Fragrance[];
  wardrobeFragrances?: Fragrance[];
  onSelectFragranceForChamber: (fragrance: Fragrance) => void;
  onSendToLaboratory: (fragrance: Fragrance) => void;
  onAddToWardrobe: (fragrance: Fragrance) => void;
  onNavigate: (tab: MainNavId) => void;
  onNavigateToHeritageAtlas?: (materialId?: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  fragrances,
  wardrobeFragrances = [],
  onSelectFragranceForChamber,
  onSendToLaboratory,
  onAddToWardrobe,
  onNavigate,
  onNavigateToHeritageAtlas,
}) => {
  // Pathway Mode: 'scan' | 'search' | 'manual'
  const [activePathway, setActivePathway] = useState<'scan' | 'search' | 'manual'>('scan');

  // Identification State
  const [identifiedSpecimen, setIdentifiedSpecimen] = useState<{
    fragrance: Fragrance;
    confidence: number;
    matchState: 'confirmed' | 'possible';
  } | null>(null);

  const [isUnknownSpecimen, setIsUnknownSpecimen] = useState<boolean>(false);
  const [unrecognizedLabel, setUnrecognizedLabel] = useState<string | undefined>(undefined);

  const handleIdentified = (
    frag: Fragrance,
    conf: number,
    matchState: 'confirmed' | 'possible'
  ) => {
    setIsUnknownSpecimen(false);
    setIdentifiedSpecimen({
      fragrance: frag,
      confidence: conf,
      matchState,
    });
  };

  const handleUnrecognized = (label?: string) => {
    setIdentifiedSpecimen(null);
    setUnrecognizedLabel(label);
    setIsUnknownSpecimen(true);
  };

  const handleReset = () => {
    setIdentifiedSpecimen(null);
    setIsUnknownSpecimen(false);
    setUnrecognizedLabel(undefined);
    setActivePathway('scan');
  };

  const isSpecimenInCabinet = identifiedSpecimen
    ? wardrobeFragrances.some((w) => w.id === identifiedSpecimen.fragrance.id)
    : false;

  return (
    <div className="min-h-screen bg-[#0A0908] text-stone-200 pb-24 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Research Wing Master Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-amber-900/30">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400 font-bold">
                The Research Wing &bull; Instrument 01
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#F8F5EE] font-medium tracking-tight mt-1.5">
              The Scent Scanner
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-amber-200/80 mt-1">
              &ldquo;Bring a fragrance into the Atelier.&rdquo;
            </p>
            <p className="text-xs text-stone-400 max-w-2xl mt-2 leading-relaxed font-sans">
              Precision optical recognition, archival catalogue indexing, and fine-perfumery ingestion. Capture any bottle or label to unpack notes, simulate drydowns in the Chamber, experiment in the Lab, or trace artisanal heritage roots.
            </p>
          </div>

          {/* Research Wing Toggle Bridge: Scanner <-> Academy */}
          <div className="flex items-center gap-2 bg-[#14110E] p-1.5 rounded-2xl border border-amber-500/30 shrink-0">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/50 text-xs font-mono font-semibold flex items-center gap-2 shadow-inner"
            >
              <Scan className="w-3.5 h-3.5 text-amber-300" />
              <span>Scent Scanner</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('academy')}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-mono flex items-center gap-2 transition cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Scent Academy</span>
            </button>
          </div>
        </header>

        {/* Primary Pathway Selector (when not showing identified specimen) */}
        {!identifiedSpecimen && !isUnknownSpecimen && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActivePathway('scan')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono transition flex items-center gap-2.5 cursor-pointer ${
                activePathway === 'scan'
                  ? 'bg-amber-500/25 border border-amber-400 text-amber-200 font-bold shadow-md'
                  : 'bg-[#14110E] border border-white/[0.08] text-stone-400 hover:text-stone-200'
              }`}
            >
              <Scan className="w-4 h-4 text-amber-400" />
              <span>Scan Fragrance (Camera / Photo)</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePathway('search')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono transition flex items-center gap-2.5 cursor-pointer ${
                activePathway === 'search'
                  ? 'bg-amber-500/25 border border-amber-400 text-amber-200 font-bold shadow-md'
                  : 'bg-[#14110E] border border-white/[0.08] text-stone-400 hover:text-stone-200'
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Master Catalogue</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePathway('manual')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono transition flex items-center gap-2.5 cursor-pointer ${
                activePathway === 'manual'
                  ? 'bg-amber-500/25 border border-amber-400 text-amber-200 font-bold shadow-md'
                  : 'bg-[#14110E] border border-white/[0.08] text-stone-400 hover:text-stone-200'
              }`}
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Enter Fragrance Details</span>
            </button>
          </div>
        )}

        {/* Main Content Render */}
        <main>
          {identifiedSpecimen ? (
            <ScannerIdentificationReveal
              fragrance={identifiedSpecimen.fragrance}
              confidence={identifiedSpecimen.confidence}
              matchState={identifiedSpecimen.matchState}
              onInspectInChamber={onSelectFragranceForChamber}
              onSendToLaboratory={onSendToLaboratory}
              onAddToCabinet={onAddToWardrobe}
              onTraceHeritage={onNavigateToHeritageAtlas}
              onScanAnother={handleReset}
              isInCabinet={isSpecimenInCabinet}
            />
          ) : isUnknownSpecimen ? (
            <ScannerUnknownSpecimen
              attemptedLabel={unrecognizedLabel}
              onSearchCatalogue={() => {
                setIsUnknownSpecimen(false);
                setActivePathway('search');
              }}
              onEnterDetails={() => {
                setIsUnknownSpecimen(false);
                setActivePathway('manual');
              }}
              onRetryScan={handleReset}
            />
          ) : activePathway === 'scan' ? (
            <ScannerOpticalChamber
              allFragrances={fragrances}
              onIdentified={handleIdentified}
              onUnrecognized={handleUnrecognized}
            />
          ) : activePathway === 'search' ? (
            <ScannerCatalogueSearch
              allFragrances={fragrances}
              onSelectFragrance={(frag) => handleIdentified(frag, 98, 'confirmed')}
            />
          ) : (
            <ScannerIngestionReview
              allFragrances={fragrances}
              onBackToScanner={() => setActivePathway('scan')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
