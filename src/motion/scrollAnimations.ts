import { Variants } from 'motion/react';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from './config.js';

export const scrollSectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.expressive,
      ease: MOTION_EASINGS.luxuryDecel,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

export const scrollChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...MOTION_SPRINGS.luxurySoft,
      opacity: { duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel },
    },
  },
};
