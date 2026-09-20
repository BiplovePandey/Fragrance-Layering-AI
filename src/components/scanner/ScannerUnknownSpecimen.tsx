import React from 'react';
import { HelpCircle, Search, Edit3, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

interface ScannerUnknownSpecimenProps {
  attemptedLabel?: string;
  onSearchCatalogue: () => void;
  onEnterDetails: () => void;
  onRetryScan: () => void;
}

export const ScannerUnknownSpecimen: React.FC<ScannerUnknownSpecimenProps> = ({
  attemptedLabel,
  onSearchCatalogue,
  onEnterDetails,
  onRetryScan,
}) => {
  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-800/30 p-8 sm:p-12 text-stone-200 shadow-2xl relative overflow-hidden text-center max-w-2xl mx-auto space-y-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mx-auto shadow-inner">
        <HelpCircle className="w-8 h-8" />
      </div>

      <div className="relative z-10 space-y-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
          Archival Record Notice
        </span>
        <h3 className="font-serif text-3xl font-medium text-[#F8F5EE]">
          Fragrance Not Yet in the Atelier
        </h3>
        <p className="text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
          The optical sensor was unable to match this flacon or label with a verified record in the master catalog.
        </p>
        {attemptedLabel && (
          <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-stone-300 mt-2">
            Target: &ldquo;{attemptedLabel}&rdquo;
          </div>
        )}
      </div>

      <div className="relative z-10 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
        <button
          type="button"
          onClick={onSearchCatalogue}
          className="p-4 rounded-2xl bg-[#14110E] hover:bg-[#1A1613] border border-white/[0.08] hover:border-amber-400/50 text-left transition flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-xs font-semibold text-stone-200 block">Search Catalogue</span>
              <span className="text-[10px] text-stone-500">Query by title or notes</span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={onEnterDetails}
          className="p-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-left transition flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Edit3 className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <span className="text-xs font-semibold text-amber-200 block">Enter Fragrance Details</span>
              <span className="text-[10px] text-amber-400/80">Submit to Ingestion Gate</span>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="relative z-10 pt-2">
        <button
          type="button"
          onClick={onRetryScan}
          className="text-xs font-mono text-stone-400 hover:text-amber-300 transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reposition bottle &amp; retry optical scan</span>
        </button>
      </div>
    </div>
  );
};
