import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Send,
  Sparkles,
  Info,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Fragrance, AIProductSubmission } from '../../types.js';
import { validateFineFragranceCandidate } from '../../services/ingestionEngine.js';
import { awardXP } from '../../services/gamificationEngine.js';

interface ScannerIngestionReviewProps {
  allFragrances: Fragrance[];
  onSubmissionComplete?: (submission: AIProductSubmission) => void;
  onBackToScanner?: () => void;
}

export const ScannerIngestionReview: React.FC<ScannerIngestionReviewProps> = ({
  allFragrances,
  onSubmissionComplete,
  onBackToScanner,
}) => {
  const [formData, setFormData] = useState({
    brand: '',
    product: '',
    format: 'Eau de Parfum',
    concentration: 'Eau de Parfum (18%)',
    fragranceFamily: 'Woody / Oriental',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    description: '',
    country: 'India',
    sourceUrl: '',
  });

  const [validationResult, setValidationResult] = useState<ReturnType<
    typeof validateFineFragranceCandidate
  > | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<boolean>(false);

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidate: Partial<AIProductSubmission> = {
      brand: formData.brand,
      product: formData.product,
      format: formData.format,
      concentration: formData.concentration,
      description: formData.description,
      notes: {
        top: formData.topNotes.split(',').map((n) => n.trim()).filter(Boolean),
        heart: formData.heartNotes.split(',').map((n) => n.trim()).filter(Boolean),
        base: formData.baseNotes.split(',').map((n) => n.trim()).filter(Boolean),
      },
    };

    const review = validateFineFragranceCandidate(candidate, allFragrances);
    setValidationResult(review);

    if (review.isValid) {
      setSubmittedStatus(true);
      awardXP(40, 'submit_fine_fragrance');
      if (onSubmissionComplete) {
        onSubmissionComplete({
          id: `sub-${Date.now()}`,
          brand: formData.brand,
          product: formData.product,
          format: formData.format,
          concentration: formData.concentration,
          notes: candidate.notes || { top: [], heart: [], base: [] },
          accords: [formData.fragranceFamily],
          description: formData.description,
          country: formData.country,
          source_url: formData.sourceUrl || undefined,
          status: review.confidenceScore > 90 ? 'approved' : 'pending',
          confidence_score: review.confidenceScore,
          validation_flags: review.flags,
          submitted_by: 'Atelier_Curator',
          submitted_at: 'Just now',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      product: '',
      format: 'Eau de Parfum',
      concentration: 'Eau de Parfum (18%)',
      fragranceFamily: 'Woody / Oriental',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      description: '',
      country: 'India',
      sourceUrl: '',
    });
    setValidationResult(null);
    setSubmittedStatus(false);
  };

  return (
    <div className="rounded-3xl bg-[#0F0D0B] border border-amber-900/40 p-6 sm:p-10 text-stone-200 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-amber-400 font-bold">
              Fine Fragrance Gatekeeper
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              Strict Fine-Perfumery Policy
            </span>
          </div>
          <h3 className="font-serif text-3xl font-medium text-[#F8F5EE] mt-1">
            Manual Specimen Ingestion &amp; Review
          </h3>
          <p className="text-xs text-stone-400 mt-1 max-w-xl">
            Fine perfumery catalogue ingestion adheres to strict standards: body deodorants, aerosol sprays, talcs, lotions, and non-perfume cosmetics are automatically rejected.
          </p>
        </div>

        {onBackToScanner && (
          <button
            type="button"
            onClick={onBackToScanner}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-stone-300 transition cursor-pointer self-start sm:self-auto"
          >
            Back to Optical Scanner
          </button>
        )}
      </div>

      {submittedStatus && validationResult?.isValid ? (
        <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="font-serif text-2xl text-emerald-200 font-medium">
            Specimen Ingestion Approved
          </h4>
          <p className="text-xs text-emerald-300/80 leading-relaxed">
            {validationResult.reason}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-mono text-emerald-200 transition cursor-pointer"
            >
              Submit Another Specimen
            </button>
            {onBackToScanner && (
              <button
                type="button"
                onClick={onBackToScanner}
                className="px-5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-stone-300 transition cursor-pointer"
              >
                Return to Scanner
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleValidateAndSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* House / Brand */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-stone-400">
                Perfume House / Brand *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Kastoor, Nisara, Gulabsingh Johrimal, Le Labo"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-500 font-mono">STATUS: USER SUBMITTED</span>
            </div>

            {/* Fragrance Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-stone-400">
                Fragrance Title *
              </label>
              <input
                type="text"
                required
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                placeholder="e.g. Terra Alluvia, Santal Dusk Extrait"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-500 font-mono">STATUS: USER SUBMITTED</span>
            </div>

            {/* Format */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-stone-400">
                Format / Formulation *
              </label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
              >
                <option value="Eau de Parfum">Eau de Parfum (EDP)</option>
                <option value="Eau de Toilette">Eau de Toilette (EDT)</option>
                <option value="Extrait de Parfum">Extrait de Parfum (25-40%)</option>
                <option value="Parfum">Parfum / Pure Perfume</option>
                <option value="Attar">Artisanal Attar (Oil Distillation)</option>
                <option value="Deodorant / Body Spray">Deodorant / Aerosol Spray (Disallowed)</option>
              </select>
              <span className="text-[10px] text-stone-500 font-mono">STATUS: VALIDATED INGESTION TAXONOMY</span>
            </div>

            {/* Concentration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-stone-400">
                Declared Concentration *
              </label>
              <input
                type="text"
                required
                value={formData.concentration}
                onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                placeholder="e.g. Extrait de Parfum (28%), 100% Pure Attar"
                className="w-full px-4 py-2.5 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-500 font-mono">STATUS: USER SUBMITTED</span>
            </div>
          </div>

          {/* Note Pyramid Inputs */}
          <div className="p-5 rounded-2xl bg-[#14110E] border border-white/[0.06] space-y-4">
            <span className="font-mono text-xs uppercase text-amber-400 font-bold block">
              Olfactory Note Pyramid
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-stone-400">Top Notes</label>
                <input
                  type="text"
                  value={formData.topNotes}
                  onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                  placeholder="Cardamom, Bergamot, Pink Pepper"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-stone-100 text-xs focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-stone-400">Heart Notes</label>
                <input
                  type="text"
                  value={formData.heartNotes}
                  onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                  placeholder="Iris, Damascena Rose, Papyrus"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-stone-100 text-xs focus:border-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-stone-400">Base Notes</label>
                <input
                  type="text"
                  value={formData.baseNotes}
                  onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                  placeholder="Mysore Sandalwood, Amber, Leather"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/[0.1] text-stone-100 text-xs focus:border-amber-400 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase text-stone-400">
              House Description / Scent Profile *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide the authentic olfactory profile and composition story from the fragrance house..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#14110E] border border-white/[0.1] text-stone-100 text-sm focus:border-amber-400 focus:outline-hidden"
            />
          </div>

          {/* Validation Feedback Warning (if rejected) */}
          {validationResult && !validationResult.isValid && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold uppercase tracking-wider block text-rose-300">
                  Ingestion Policy Rejection:
                </span>
                <p className="mt-0.5 text-rose-200/90 leading-relaxed">
                  {validationResult.reason}
                </p>
              </div>
            </div>
          )}

          {/* Submit Trigger */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-stone-500 font-mono">
              Taxonomy Gate: Strict fine-fragrance verification active.
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-2 cursor-pointer font-mono uppercase tracking-wider"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Verify &amp; Ingest Specimen</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
