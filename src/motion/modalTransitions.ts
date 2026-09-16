import { Variants } from 'motion/react';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from './config.js';

export const modalBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    transition: {
      duration: MOTION_DURATIONS.standard,
      ease: MOTION_EASINGS.luxuryDecel,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: MOTION_DURATIONS.micro,
      ease: MOTION_EASINGS.luxuryFluid,
    },
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...MOTION_SPRINGS.luxurySoft,
      opacity: { duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 12,
    transition: {
      duration: MOTION_DURATIONS.micro,
      ease: MOTION_EASINGS.luxuryFluid,
    },
  },
};
