import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileDown,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Layers,
  Check,
  Copy,
  ExternalLink,
  Presentation
} from 'lucide-react';
import { PRESENTATION_SLIDES, PRESENTATION_METADATA, PresentationSlide } from '../../data/presentationData.js';
import { downloadPresentationClient } from '../../services/presentationGenerator.js';
import { MOTION_SPRINGS } from '../../motion/config.js';

interface PresentationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationDeckModal: React.FC<PresentationDeckModalProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedOutline, setCopiedOutline] = useState(false);

  const currentSlide: PresentationSlide = PRESENTATION_SLIDES[currentSlideIndex] || PRESENTATION_SLIDES[0];

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : PRESENTATION_SLIDES.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < PRESENTATION_SLIDES.length - 1 ? prev + 1 : 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  const handleDownloadPPT = async () => {
    try {
      setIsDownloading(true);
      // Try direct client-side generation first
      await downloadPresentationClient('Olfactory_AI_Project_Presentation.pptx');
    } catch (err) {
      console.warn('Client-side PPT download failed, falling back to server API endpoint:', err);
      // Fallback to static or API endpoint
      const a = document.createElement('a');
      a.href = '/api/presentation/download';
      a.download = 'Olfactory_AI_Project_Presentation.pptx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const handleCopyOutline = () => {
    const outline = PRESENTATION_SLIDES.map(
      (s) => `### Slide ${s.slideNumber}: ${s.title} (${s.subtitle})\n` +
             `${s.summary}\n\n` +
             s.keyPoints.map((p) => `- **${p.title}**: ${p.description}`).join('\n') +
             `\n\n*Speaker Notes:* ${s.speakerNotes}\n\n`
    ).join('---\n\n');

    navigator.clipboard.writeText(
      `# ${PRESENTATION_METADATA.title} — Presentation Outline\n${PRESENTATION_METADATA.subtitle}\n\n${outline}`
    );
    setCopiedOutline(true);
    setTimeout(() => setCopiedOutline(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      id="presentation-deck-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={MOTION_SPRINGS.tactilePress}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[96vh] flex flex-col bg-[#14100D] border border-amber-500/25 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden text-[#F7F4EF]"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#2C241D] bg-[#1A1511]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm sm:text-base font-semibold tracking-wide text-[#F7F4EF]">
                  {PRESENTATION_METADATA.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25 hidden sm:inline">
                  16:9 Widescreen Deck
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#8C8176] hidden md:block">
                Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length} • {currentSlide.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Speaker Notes */}
            <button
              type="button"
              onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition cursor-pointer ${
                showSpeakerNotes
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-black/20 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
              title="Toggle presenter talking points"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Speaker Notes</span>
            </button>

            {/* Copy Outline */}
            <button
              type="button"
              onClick={handleCopyOutline}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 bg-black/20 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer"
              title="Copy entire presentation outline to clipboard"
            >
              {copiedOutline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedOutline ? 'Copied' : 'Copy Text'}</span>
            </button>

            {/* Download PPTX Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleDownloadPPT}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-[0_2px_12px_rgba(217,119,6,0.3)] border border-amber-400/40 transition cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5 animate-bounce" />
              <span>{isDownloading ? 'Preparing PPT...' : 'Download PPT (.pptx)'}</span>
            </motion.button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
              aria-label="Close presentation modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage: 16:9 Interactive Slide View */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col gap-4">
          <div className="relative w-full aspect-[16/9] min-h-[380px] bg-[#100D0B] rounded-xl border border-[#382E25] p-5 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none">
            {/* Top Decorative Gold Rule */}
            <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#C59A3F] to-transparent opacity-80" />

            {/* Slide Header: Category & Counter */}
            <div className="flex items-center justify-between">
              <div className="px-3 py-1 rounded-md bg-[#241D17] border border-[#C59A3F]/50 text-[10px] font-mono tracking-widest uppercase font-bold text-[#C59A3F]">
                {currentSlide.category}
              </div>
              <div className="text-[11px] font-mono tracking-widest text-[#8C8176]">
                {currentSlide.slideNumber}
              </div>
            </div>

            {/* Slide Title & Subtitle */}
            <div className="mt-2">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#F7F4EF]">
                {currentSlide.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#C59A3F] italic mt-1 font-medium">
                {currentSlide.subtitle}
              </p>
              <p className="text-xs text-[#A69B8F] mt-2 max-w-3xl leading-relaxed hidden sm:block">
                {currentSlide.summary}
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-2">
              {currentSlide.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-xl bg-[#181310] border border-[#2E2620] hover:border-amber-500/40 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#F7F4EF] group-hover:text-amber-200 transition-colors">
                        {point.title}
                      </h4>
                      {(point.badge || point.highlight) && (
                        <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          {point.badge || point.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#A69B8F] leading-snug">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Highlights & Footer */}
            <div className="pt-2 border-t border-[#2A221C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[9px] font-mono text-[#6E645A]">
              <div className="flex items-center gap-3">
                {currentSlide.metricsOrHighlights?.map((m, mIdx) => (
                  <div key={mIdx} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#171310] border border-[#2A221C]">
                    <span className="text-amber-400 font-bold">{m.value}</span>
                    <span className="text-[#8C8176]">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block uppercase tracking-wider">
                OLFACTORY AI  •  INTELLIGENT FRAGRANCE ATELIER
              </div>
            </div>
          </div>

          {/* Presenter Speaker Notes Drawer */}
          <AnimatePresence>
            {showSpeakerNotes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={MOTION_SPRINGS.luxurySoft}
                className="rounded-xl bg-[#1A1511] border border-amber-500/20 p-3.5 sm:p-4"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Presenter Explanation & Talking Points (Slide {currentSlideIndex + 1})</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">Read this when explaining this slide</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans bg-black/30 p-2.5 rounded-lg border border-white/5">
                  "{currentSlide.speakerNotes}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Slide Navigation Bar & Thumbnail Strip */}
        <div className="px-4 py-3 border-t border-[#2C241D] bg-[#171310] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer flex items-center gap-1 text-xs font-mono"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <span className="text-xs font-mono text-[#A69B8F] px-2">
              {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer flex items-center gap-1 text-xs font-mono"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Slide Dot Jumpers */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
            {PRESENTATION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(217,119,6,0.6)]'
                    : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                title={`Jump to Slide ${idx + 1}: ${slide.title}`}
              />
            ))}
          </div>

          {/* Direct File Download Link */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <a
              href="/Olfactory_AI_Presentation.pptx"
              download="Olfactory_AI_Presentation.pptx"
              className="text-[#C59A3F] hover:text-amber-300 underline flex items-center gap-1 transition"
            >
              <span>Direct Link (.pptx)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
