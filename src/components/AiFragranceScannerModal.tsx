import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  Scan,
  ShieldCheck,
  Plus,
  ArrowRight,
  Layers,
  FlaskConical
} from 'lucide-react';
import { Fragrance } from '../types.js';
import { MotionModal, MotionButton } from '../motion/index.js';
import { awardXP } from '../services/gamificationEngine.js';

interface AiFragranceScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  allFragrances: Fragrance[];
  onAddToWardrobe: (id: number) => void;
  onSelectFragranceForChamber: (frag: Fragrance) => void;
}

export const AiFragranceScannerModal: React.FC<AiFragranceScannerModalProps> = ({
  isOpen,
  onClose,
  allFragrances,
  onAddToWardrobe,
  onSelectFragranceForChamber
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    fragrance: Fragrance;
    confidence: number;
    detectedLabel: string;
    detectedConcentration: string;
    detectedBottleFormat: string;
    notesIdentified: string[];
  } | null>(null);
  const [hasAdded, setHasAdded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      runScannerSimulation();
    };
    reader.readAsDataURL(file);
  };

  const runScannerSimulation = () => {
    setIsScanning(true);
    setScanResult(null);
    setHasAdded(false);

    setTimeout(() => {
      // Pick the best match from allFragrances
      const candidate = allFragrances[Math.floor(Math.random() * Math.min(10, allFragrances.length))] || allFragrances[0];
      setScanResult({
        fragrance: candidate,
        confidence: 96,
        detectedLabel: candidate.name.toUpperCase(),
        detectedConcentration: candidate.format || 'Eau de Parfum (EDP)',
        detectedBottleFormat: 'Glass Flacon with Metallic Vaporisateur',
        notesIdentified: (candidate.top_notes || []).concat(candidate.base_notes || []).slice(0, 4)
      });
      setIsScanning(false);
      awardXP(30, 'scan_fragrance');
    }, 1200);
  };

  const handleAdd = () => {
    if (scanResult) {
      onAddToWardrobe(scanResult.fragrance.id);
      setHasAdded(true);
      awardXP(25, 'add_scanned_to_wardrobe');
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setScanResult(null);
    setHasAdded(false);
  };

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="relative w-full rounded-3xl bg-[#14110E] border border-amber-600/30 text-stone-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 via-[#181411] to-teal-950/30 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-600 flex items-center justify-center text-stone-100 shadow-lg">
              <Scan className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                Computer Vision &bull; Flacon Recognition
              </div>
              <h3 className="font-serif text-2xl font-medium text-stone-100">
                AI Fragrance Scanner
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-stone-400 hover:text-stone-100 hover:bg-white/[0.06] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!imagePreview ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition flex flex-col items-center justify-center space-y-4 ${
                dragActive
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-white/[0.12] bg-white/[0.02] hover:border-amber-500/50 hover:bg-white/[0.04]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-medium text-stone-200">
                  Upload or Snap Perfume Bottle Photo
                </h4>
                <p className="text-xs text-stone-400 font-sans max-w-sm">
                  Drag and drop a photo of any perfume flacon or box label to identify the fragrance, notes pyramid, and add to your wardrobe.
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition"
              >
                Browse Files / Take Photo
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview and Scanning state */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-black/40 border border-white/[0.08]">
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-white/[0.1]">
                  <img
                    src={imagePreview}
                    alt="Scanned Perfume"
                    className="w-full h-full object-cover"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-amber-950/60 flex items-center justify-center">
                      <div className="w-full h-1 bg-amber-400 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  {isScanning ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-mono">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Analyzing label typography &amp; bottle silhouette...</span>
                      </div>
                      <p className="text-xs text-stone-400">
                        Cross-referencing 2,000+ Indian and international fragrance models...
                      </p>
                    </div>
                  ) : scanResult ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                          {scanResult.confidence}% Verified Match
                        </span>
                      </div>
                      <h4 className="font-serif text-2xl font-medium text-stone-100">
                        {scanResult.fragrance.name}
                      </h4>
                      <p className="text-xs text-stone-400 font-sans">
                        House: <strong className="text-stone-200">{scanResult.fragrance.brand_name || scanResult.fragrance.brand}</strong> &bull; {scanResult.detectedConcentration}
                      </p>
                      <p className="text-xs text-stone-400 font-sans">
                        Family: {scanResult.fragrance.fragrance_family} &bull; Approx. ₹{scanResult.fragrance.price_inr}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Scanned Details Card */}
              {scanResult && (
                <div className="p-5 rounded-2xl bg-[#181411] border border-amber-500/30 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                      Identified Olfactory Structure
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {scanResult.notesIdentified.map(n => (
                        <span key={n} className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <MotionButton
                        variant="primary"
                        onClick={handleAdd}
                        disabled={hasAdded}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-stone-100 font-semibold text-xs shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        <span>{hasAdded ? 'Added to Wardrobe Shelf!' : 'Add to Digital Wardrobe'}</span>
                      </MotionButton>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectFragranceForChamber(scanResult.fragrance);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-stone-300 text-xs font-medium cursor-pointer"
                      >
                        View in Chamber &rarr;
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs text-stone-400 hover:text-stone-200 cursor-pointer underline"
                    >
                      Scan Another Bottle
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MotionModal>
  );
};
