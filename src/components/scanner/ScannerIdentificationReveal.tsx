import React from 'react';
import {
  Sparkles,
  FlaskConical,
  Compass,
  Layers,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Droplets
} from 'lucide-react';
import { Fragrance } from '../../types.js';

interface ScannerIdentificationRevealProps {
  fragrance: Fragrance;
  confidence: number;
  matchState: 'confirmed' | 'possible';
  onInspectInChamber: (fragrance: Fragrance) => void;
  onSendToLaboratory: (fragrance: Fragrance) => void;
  onAddToCabinet: (fragrance: Fragrance) => void;
  onTraceHeritage?: (materialId?: string) => void;
  onScanAnother: () => void;
  isInCabinet?: boolean;
}

export const ScannerIdentificationReveal: React.FC<ScannerIdentificationRevealProps> = ({
  fragrance,
  confidence,
  matchState,
  onInspectInChamber,
  onSendToLaboratory,
  onAddToCabinet,
  onTraceHeritage,
  onScanAnother,
  isInCabinet = false,
}) => {
  // Check for Indian heritage materials in notes or description
  const combinedText = [
    fragrance.name,
    fragrance.brand_name || fragrance.brand || '',
    fragrance.description || '',
    ...(fragrance.top_notes || []),
    ...(fragrance.middle_notes || []),
    ...(fragrance.base_notes || [])
  ].join(' ').toLowerCase();

  const hasHeritageMaterial =
    combinedText.includes('mitti') ||
    combinedText.includes('khus') ||
    combinedText.includes('sandalwood') ||
    combinedText.includes('chandan') ||
    combinedText.includes('oud') ||
    combinedText.includes('agarwood') ||
    combinedText.includes('rose') ||
    combinedText.includes('gulab') ||
    combinedText.includes('kewda') ||
    combinedText.includes('shamama') ||
    combinedText.includes('saffron') ||
    combinedText.includes('kesar');

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-600/40 p-6 sm:p-10 text-stone-200 shadow-2xl relative overflow-hidden space-y-8">
      {/* Smoked glass & amber ambient backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Identification Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
                {matchState === 'confirmed' ? 'Catalogue Verification Confirmed' : 'Probable Catalogue Match'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                {confidence}% Confidence
              </span>
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-0.5">
              Specimen Identified
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onScanAnother}
          className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-stone-300 hover:text-white transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Scan Another Flacon</span>
        </button>
      </div>

      {/* Primary Specimen Dossier */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Fragrance Profile Dossier */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="font-brand text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold block">
              {fragrance.brand_name || fragrance.brand}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#F8F5EE] font-medium mt-1">
              {fragrance.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-stone-300 font-mono text-xs">
                {fragrance.format || 'Eau de Parfum'}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs">
                {fragrance.fragrance_family}
              </span>
              {fragrance.is_oil_based && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                  Pure Oil Formulation
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-stone-300 font-sans leading-relaxed border-l-2 border-amber-500/50 pl-4 py-1">
            {fragrance.description ||
              'A masterful composition balancing rare botanical accords with high-fixative base heartwoods.'}
          </p>

          {/* Olfactory Pyramid */}
          <div className="p-5 rounded-2xl bg-[#14110E] border border-white/[0.06] space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block">
              Recognized Note Pyramid:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-mono text-amber-400/90 block mb-1">Top Notes (0-15m)</span>
                <p className="text-stone-200">
                  {fragrance.top_notes?.join(', ') || 'Bergamot, Pink Pepper, Citrus'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-mono text-amber-400/90 block mb-1">Heart (15m-2h)</span>
                <p className="text-stone-200">
                  {fragrance.middle_notes?.join(', ') || 'Cardamom, Orris, Damascena Rose'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-mono text-amber-400/90 block mb-1">Base (2h-12h+)</span>
                <p className="text-stone-200">
                  {fragrance.base_notes?.join(', ') || 'Sandalwood, Amber, Cedarwood, Musk'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Research Actions & Interconnection Ports */}
        <div className="lg:col-span-5 space-y-3.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 block">
            Atelier Integration Channels:
          </span>

          {/* Action 1: Inspect in Fragrance Chamber */}
          <button
            type="button"
            onClick={() => onInspectInChamber(fragrance)}
            className="w-full p-4 rounded-2xl bg-[#14110E] hover:bg-[#1C1814] border border-amber-500/30 hover:border-amber-400 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F8F5EE] group-hover:text-amber-300 transition-colors">
                  Inspect in Fragrance Chamber
                </h4>
                <p className="text-xs text-stone-400">
                  Explore full 8D radar, notes decomposition &amp; drydown kinetics.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Action 2: Send to Layering Laboratory */}
          <button
            type="button"
            onClick={() => onSendToLaboratory(fragrance)}
            className="w-full p-4 rounded-2xl bg-[#14110E] hover:bg-[#1C1814] border border-rose-500/30 hover:border-rose-400 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F8F5EE] group-hover:text-rose-300 transition-colors">
                  Experiment in Layering Lab
                </h4>
                <p className="text-xs text-stone-400">
                  Formulate dual-bottle chords, simulate evaporation &amp; balance.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-rose-300 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          {/* Action 3: Add to Wardrobe Cabinet */}
          <button
            type="button"
            onClick={() => onAddToCabinet(fragrance)}
            className="w-full p-4 rounded-2xl bg-[#14110E] hover:bg-[#1C1814] border border-emerald-500/30 hover:border-emerald-400 text-left transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#F8F5EE] group-hover:text-emerald-300 transition-colors">
                  {isInCabinet ? 'Already in Private Cabinet' : 'Add to Fragrance Cabinet'}
                </h4>
                <p className="text-xs text-stone-400">
                  {isInCabinet ? 'Specimen is actively stored in your vault.' : 'Sync this flacon into your permanent collection.'}
                </p>
              </div>
            </div>
            <CheckCircle2 className={`w-4 h-4 shrink-0 ml-2 ${isInCabinet ? 'text-emerald-400' : 'text-stone-500'}`} />
          </button>

          {/* Action 4: Trace Heritage (if heritage notes exist) */}
          {hasHeritageMaterial && onTraceHeritage && (
            <button
              type="button"
              onClick={() => onTraceHeritage()}
              className="w-full p-4 rounded-2xl bg-[#14110E] hover:bg-[#1C1814] border border-amber-400/40 hover:border-amber-300 text-left transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#F8F5EE] group-hover:text-amber-300 transition-colors">
                    Trace Its Heritage in Atlas
                  </h4>
                  <p className="text-xs text-stone-400">
                    Discover historical Kannauj or Mysore roots and extraction craft.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
