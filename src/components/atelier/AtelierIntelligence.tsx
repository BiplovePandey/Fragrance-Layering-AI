import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Camera, GraduationCap, ArrowRight, Sparkles, Wind, Scan, Atom } from 'lucide-react';
import { GlassSurface } from '../ui/GlassSurface.js';

interface AtelierIntelligenceProps {
  onOpenAiPerfumer: () => void;
  onOpenScanner: () => void;
  onOpenAcademy: () => void;
}

export const AtelierIntelligence: React.FC<AtelierIntelligenceProps> = ({
  onOpenAiPerfumer,
  onOpenScanner,
  onOpenAcademy
}) => {
  return (
    <section className="relative my-8 py-2">
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[420px] h-[300px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <GlassSurface
        surface="atelier"
        radius="luxury"
        className="p-6 sm:p-10 space-y-7"
      >
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E8DFD3]/75 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs font-mono mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>CHAPTER V &bull; THE ATELIER&apos;S INSTRUMENTS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-[#1A1613] tracking-tight">
              Atelier Intelligence Instruments
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5046] mt-1 max-w-xl leading-relaxed font-sans">
              Precision computational tools designed for bespoke alchemical consultation, optical flacon digitisation, and molecular chemistry.
            </p>
          </div>

          <span className="text-xs font-mono text-[#7A6F66] self-start sm:self-center">
            8-D Vector Engine &bull; Vision AI
          </span>
        </div>

        {/* 3 Prestigious Atelier Instruments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Instrument 1: THE NOSE (AI Master Perfumer) */}
          <div
            onClick={onOpenAiPerfumer}
            className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] hover:border-amber-400/90 hover:bg-white transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-2xs"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenAiPerfumer()}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform shadow-2xs">
                  <Wind className="w-5 h-5 text-amber-800" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-800/80 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                  INST-01
                </span>
              </div>

              <span className="font-brand text-[10px] text-amber-800 uppercase tracking-[0.2em] block font-semibold">
                The Nose
              </span>
              <h3 className="font-serif text-xl text-[#1A1613] font-medium mt-1">
                AI Master Perfumer
              </h3>
              <p className="text-xs text-[#5A5046] mt-2 leading-relaxed">
                Consult an AI nose trained on Kannauj botanicals, volatility kinetics, and personal scent memory to compose tailored chords.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-[#E8DFD3] flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-950">
              <span>Consult The Nose</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Instrument 2: THE LENS (Fragrance Scanner) */}
          <div
            onClick={onOpenScanner}
            className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] hover:border-rose-400/90 hover:bg-white transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-2xs"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenScanner()}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-100/90 border border-rose-300 flex items-center justify-center text-rose-900 group-hover:scale-105 transition-transform shadow-2xs">
                  <Scan className="w-5 h-5 text-rose-800" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-rose-800/80 font-bold px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                  INST-02
                </span>
              </div>

              <span className="font-brand text-[10px] text-rose-800 uppercase tracking-[0.2em] block font-semibold">
                The Lens
              </span>
              <h3 className="font-serif text-xl text-[#1A1613] font-medium mt-1">
                Optical Fragrance Scanner
              </h3>
              <p className="text-xs text-[#5A5046] mt-2 leading-relaxed">
                Capture any perfume flacon or packaging box. Automatically extracts notes, accords, concentration, and syncs into your wardrobe.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-[#E8DFD3] flex items-center justify-between text-xs font-semibold text-rose-800 group-hover:text-rose-950">
              <span>Engage Optical Lens</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Instrument 3: THE ACADEMY (Scent Physics) */}
          <div
            onClick={onOpenAcademy}
            className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E3DACB] hover:border-amber-400/90 hover:bg-white transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-2xs"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenAcademy()}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 group-hover:scale-105 transition-transform shadow-2xs">
                  <Atom className="w-5 h-5 text-amber-900" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-800/80 font-bold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                  INST-03
                </span>
              </div>

              <span className="font-brand text-[10px] text-amber-800 uppercase tracking-[0.2em] block font-semibold">
                The Academy
              </span>
              <h3 className="font-serif text-xl text-[#1A1613] font-medium mt-1">
                Scent Academy &amp; Physics
              </h3>
              <p className="text-xs text-[#5A5046] mt-2 leading-relaxed">
                Deep dive into molecular vapor pressures, epidermal lipid binding, Kannauj copper stills, and test your nose to earn XP.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-[#E8DFD3] flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-950">
              <span>Enter Academy (+XP)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </GlassSurface>
    </section>
  );
};
