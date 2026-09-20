import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, Binary, HelpCircle } from 'lucide-react';
import { usePrefersReducedMotion } from '../../motion/accessibility.js';
import { accordionVariants } from '../../motion/variants.js';

export interface ProgressiveDisclosureProps {
  /**
   * Title of the Level 2 reveal trigger (e.g. "Why this scent?", "Curious about this chord?")
   */
  curiousTitle?: string;
  /**
   * Content for Level 2: Curious (Notes, longevity, projection, weather/mood connection)
   */
  level2Content: React.ReactNode;
  /**
   * Optional content for Level 3: Enthusiast (8D vector, volatility, fixatives, alchemical calculations)
   */
  level3Content?: React.ReactNode;
  /**
   * Label for Level 3 toggle
   */
  enthusiastTitle?: string;
  /**
   * Initial open state
   */
  defaultOpenLevel2?: boolean;
  defaultOpenLevel3?: boolean;
  className?: string;
}

export const ProgressiveDisclosure: React.FC<ProgressiveDisclosureProps> = ({
  curiousTitle = 'Why this scent?',
  level2Content,
  level3Content,
  enthusiastTitle = 'Enthusiast Analysis (8D & Volatility)',
  defaultOpenLevel2 = false,
  defaultOpenLevel3 = false,
  className = '',
}) => {
  const [isOpenLevel2, setIsOpenLevel2] = useState<boolean>(defaultOpenLevel2);
  const [isOpenLevel3, setIsOpenLevel3] = useState<boolean>(defaultOpenLevel3);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* LEVEL 2 TRIGGER: CURIOUS */}
      <button
        type="button"
        onClick={() => setIsOpenLevel2((prev) => !prev)}
        className="group flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 text-[#5A5046] hover:text-[#1A1613] transition-all cursor-pointer select-none text-xs font-medium"
        aria-expanded={isOpenLevel2}
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600 transition-transform group-hover:scale-110" />
          <span>{curiousTitle}</span>
        </span>
        <motion.span
          animate={{ rotate: isOpenLevel2 ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
        </motion.span>
      </button>

      {/* LEVEL 2 EXPANDABLE CONTENT */}
      <AnimatePresence initial={false}>
        {isOpenLevel2 && (
          <motion.div
            variants={reducedMotion ? undefined : accordionVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#DCD4C8] shadow-xs space-y-4 text-xs text-[#5A5046]">
              {level2Content}

              {/* LEVEL 3 TRIGGER: ENTHUSIAST */}
              {level3Content && (
                <div className="pt-2 border-t border-[#E8DFD3]/80">
                  <button
                    type="button"
                    onClick={() => setIsOpenLevel3((prev) => !prev)}
                    className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-stone-100/80 hover:bg-stone-200/80 text-[11px] font-mono text-stone-700 hover:text-stone-900 transition cursor-pointer"
                    aria-expanded={isOpenLevel3}
                  >
                    <span className="flex items-center gap-1.5">
                      <Binary className="w-3 h-3 text-amber-700" />
                      <span>{enthusiastTitle}</span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpenLevel3 ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3 h-3 text-stone-500" />
                    </motion.span>
                  </button>

                  {/* LEVEL 3 EXPANDABLE CONTENT */}
                  <AnimatePresence initial={false}>
                    {isOpenLevel3 && (
                      <motion.div
                        variants={reducedMotion ? undefined : accordionVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-3.5 rounded-xl bg-[#14110E] text-stone-300 font-mono text-[11px] space-y-2.5 border border-white/10 shadow-inner">
                          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-semibold tracking-wider uppercase">
                            <Sparkles className="w-3 h-3" />
                            <span>Deep Olfactory Kinetics</span>
                          </div>
                          {level3Content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
