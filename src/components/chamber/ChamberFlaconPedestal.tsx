import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Compass, MapPin, Droplet, ShieldCheck, RotateCcw } from 'lucide-react';
import { Fragrance, OlfactoryVector8D } from '../../types.js';
import { ChamberAtmospherePalette } from './ChamberAtmosphere.js';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { ScentMist } from '../ui/ScentMist.js';

interface ChamberFlaconPedestalProps {
  fragrance: Fragrance;
  palette: ChamberAtmospherePalette;
  vector8D: OlfactoryVector8D;
  onInspectToggle?: () => void;
}

export const ChamberFlaconPedestal: React.FC<ChamberFlaconPedestalProps> = ({
  fragrance,
  palette,
  vector8D,
  onInspectToggle
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  // Mouse / Drag tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end optical tactile drag
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 22 });

  // 3D rotation & perspective transforms
  const rotateY = useTransform(smoothX, [-100, 100], [-9, 9]);
  const rotateX = useTransform(smoothY, [-100, 100], [7, -7]);
  const specularTranslateX = useTransform(smoothX, [-100, 100], [-25, 25]);
  const pedestalTiltX = useTransform(smoothY, [-100, 100], [3, -3]);
  const pedestalTiltY = useTransform(smoothX, [-100, 100], [-4, 4]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = Math.max(-100, Math.min(100, e.clientX - centerX));
    const offsetY = Math.max(-100, Math.min(100, e.clientY - centerY));
    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleResetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Derive intensity & longevity factors for aura glow
  const auraScale = 0.95 + (vector8D.intensity / 100) * 0.25;
  const liquidFillPct = 78;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className="relative flex flex-col items-center justify-center py-6 sm:py-10 select-none group cursor-grab active:cursor-grabbing"
      style={{ perspective: 1000 }}
    >
      {/* Dynamic Scent Aura Glow behind the pedestal */}
      <motion.div
        animate={
          reducedMotion
            ? { opacity: 0.55 }
            : {
                scale: [auraScale, auraScale * 1.08, auraScale],
                opacity: [0.45, 0.65, 0.45]
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-[70px] pointer-events-none -z-10"
        style={{
          background: palette.pedestalGlow
        }}
      />

      {/* Subtle Vapor Plume rising from the flacon collar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-56 pointer-events-none -z-5 overflow-hidden">
        <ScentMist color={palette.particleTone} density="light" />
      </div>

      {/* THE 3D FLACON OBJECT */}
      <motion.div
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="relative flex flex-col items-center z-10"
      >
        {/* ======================= CAP / STOPPER ======================= */}
        <div className="relative flex flex-col items-center mb-1 z-20">
          {/* Stopper Finial with Brass Inlay */}
          <div
            className="w-8 h-4 rounded-t-sm shadow-md flex items-center justify-center border-t border-x"
            style={{
              background: 'linear-gradient(180deg, #FDE68A 0%, #D4AF37 55%, #92400E 100%)',
              borderColor: '#FEF3C7',
              boxShadow: '0 4px 10px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.8)'
            }}
          >
            <div className="w-4 h-1 rounded-full bg-white/40" />
          </div>

          {/* Heavy Brass Collar */}
          <div
            className="w-12 h-4 rounded-xs shadow-sm border-t border-b flex items-center justify-around px-1"
            style={{
              background: 'linear-gradient(90deg, #92400E 0%, #D4AF37 35%, #FFFBEB 50%, #D4AF37 65%, #78350F 100%)',
              borderColor: '#B45309'
            }}
          >
            <span className="w-0.5 h-2 bg-amber-950/40" />
            <span className="w-0.5 h-2 bg-amber-950/40" />
            <span className="w-0.5 h-2 bg-amber-950/40" />
          </div>
        </div>

        {/* ======================= FLACON GLASS BODY ======================= */}
        <div
          className="relative w-44 sm:w-52 h-60 sm:h-72 rounded-2xl p-2.5 overflow-hidden backdrop-blur-md transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(20, 16, 12, 0.65) 50%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 25px 60px -10px rgba(0,0,0,0.7), inset 0 0 0 1.5px rgba(255, 255, 255, 0.22), inset 0 2px 8px rgba(255,255,255,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          {/* Glass Bevel Refractions (Side Prisms) */}
          <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-white/35 via-white/10 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-white/25 via-white/5 to-transparent pointer-events-none" />

          {/* Dynamic Specular Sheen (Reacts to Pointer Motion) */}
          <motion.div
            style={{
              x: reducedMotion ? 0 : specularTranslateX
            }}
            className="absolute -top-10 -bottom-10 left-8 w-6 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 pointer-events-none blur-xs"
          />

          {/* LIQUID COLUMN WITH MENISCUS & DEPTH */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 h-[76%] rounded-xl overflow-hidden pointer-events-none">
            {/* Liquid Background Gradient */}
            <div
              className="w-full h-full relative"
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, ${palette.pedestalGlow} 35%, rgba(10,8,6,0.85) 100%)`
              }}
            >
              {/* Curved Surface Meniscus Line */}
              <div
                className="absolute top-0 left-0 right-0 h-2.5 rounded-full border-t border-white/50"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)',
                  boxShadow: '0 2px 6px rgba(255,255,255,0.3)'
                }}
              />

              {/* Sub-surface Golden Core Flare */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full blur-xl opacity-60"
                style={{ background: palette.brassAccent }}
              />

              {/* Molecular Volatility Micro-Sparkles inside liquid */}
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
              <div className="absolute bottom-14 right-8 w-1 h-1 rounded-full bg-white/50 animate-pulse" />
            </div>
          </div>

          {/* FLACON EMBOSSED GOLD LABEL PLATE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] px-3 py-3.5 rounded-lg bg-[#15120E]/88 border border-[#D4AF37]/50 shadow-xl backdrop-blur-md flex flex-col items-center text-center">
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              {fragrance.brand}
            </span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1" />
            <h3 className="font-serif text-sm sm:text-base font-medium text-stone-100 leading-tight tracking-tight line-clamp-2">
              {fragrance.name}
            </h3>
            <span className="mt-1 text-[8px] font-mono uppercase tracking-widest text-stone-400">
              {fragrance.concentration || 'Fine Parfum'}
            </span>
          </div>

          {/* Base Glass Thickened Heel */}
          <div className="absolute bottom-0 left-0 right-0 h-3.5 bg-gradient-to-t from-white/20 via-white/5 to-transparent border-t border-white/10" />
        </div>
      </motion.div>

      {/* ======================= LABORATORY PEDESTAL ======================= */}
      <motion.div
        style={{
          rotateX: reducedMotion ? 0 : pedestalTiltX,
          rotateY: reducedMotion ? 0 : pedestalTiltY,
          transformStyle: 'preserve-3d'
        }}
        className="relative -mt-6 sm:-mt-8 flex flex-col items-center z-0"
      >
        {/* Contact Shadow directly beneath the flacon */}
        <div
          className="w-36 sm:w-44 h-5 rounded-full blur-sm transition-all duration-300"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 80%)'
          }}
        />

        {/* Illuminated Brushed Brass Pedestal Ring */}
        <div
          className="w-56 sm:w-68 h-10 sm:h-12 rounded-full border-t border-x shadow-2xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #2A221A 0%, #15110E 60%, #0D0A08 100%)',
            borderColor: 'rgba(212, 175, 55, 0.45)',
            boxShadow: `0 15px 35px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2), 0 0 20px ${palette.pedestalGlow}`
          }}
        >
          {/* Circular Brass Bezel Inlay */}
          <div className="absolute inset-1 rounded-full border border-amber-500/25 pointer-events-none" />

          {/* Subtle laboratory markings on pedestal rim */}
          <div className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-widest text-[#D4AF37]/80">
            <span>&bull; OLFACTORY CHAMBER SPECIMEN &bull;</span>
          </div>
        </div>

        {/* Pedestal Base Foundation Plate */}
        <div className="w-64 sm:w-80 h-3 rounded-full bg-[#0E0B09] border-t border-white/10 blur-[0.5px]" />
      </motion.div>

      {/* Tactile Inspection Prompt / Specs Toggle */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowSpecs((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/10 text-[11px] font-mono text-stone-300 hover:text-amber-200 transition cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{showSpecs ? 'Hide Physical Specs' : 'Inspect Physical Details'}</span>
        </button>

        {(mouseX.get() !== 0 || mouseY.get() !== 0) && (
          <button
            type="button"
            onClick={handleResetTilt}
            className="p-1 rounded-full bg-white/[0.05] hover:bg-white/[0.10] text-stone-400 hover:text-stone-200 transition cursor-pointer"
            title="Reset angle"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Expanded Specimen Architecture Badge */}
      {showSpecs && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="mt-3 p-3.5 rounded-xl bg-[#171310]/95 border border-amber-500/25 max-w-sm w-full text-[11px] font-mono text-stone-300 shadow-xl space-y-2"
        >
          <div className="flex justify-between border-b border-white/10 pb-1 text-amber-300">
            <span>FLACON VESSEL SPECIFICATION</span>
            <span>NO. #{fragrance.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-stone-500 block">House / Maker:</span>
              <span className="text-stone-200 font-semibold">{fragrance.brand}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Concentration:</span>
              <span className="text-stone-200 font-semibold">{fragrance.concentration || 'Eau de Parfum'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Family:</span>
              <span className="text-stone-200 font-semibold">{fragrance.fragrance_family}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Origin:</span>
              <span className="text-stone-200 font-semibold">{fragrance.brand_country || 'Heritage Origin'}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
