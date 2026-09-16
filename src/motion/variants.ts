import { Variants } from 'motion/react';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from './config.js';

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.standard,
      ease: MOTION_EASINGS.luxuryDecel,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOTION_DURATIONS.micro,
      ease: MOTION_EASINGS.luxuryFluid,
    },
  },
};

export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...MOTION_SPRINGS.luxurySoft,
      opacity: { duration: MOTION_DURATIONS.standard, ease: MOTION_EASINGS.luxuryDecel },
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: MOTION_DURATIONS.micro,
      ease: MOTION_EASINGS.luxuryFluid,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const cardInteractiveVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
  },
  hover: {
    scale: 1.018,
    y: -3,
    boxShadow: '0 20px 32px -8px rgba(0, 0, 0, 0.7), 0 0 20px 2px rgba(217, 119, 6, 0.12)',
    transition: MOTION_SPRINGS.luxurySoft,
  },
  tap: {
    scale: 0.985,
    y: 0,
    boxShadow: '0 6px 14px -3px rgba(0, 0, 0, 0.5)',
    transition: MOTION_SPRINGS.tactilePress,
  },
};

export const flaconFloatVariants: Variants = {
  idle: {
    y: [0, -6, 0],
    rotate: [0, 0.5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
  hover: {
    scale: 1.04,
    y: -8,
    filter: 'drop-shadow(0 20px 25px rgba(217, 119, 6, 0.25))',
    transition: MOTION_SPRINGS.luxurySoft,
  },
};

export const blurRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.expressive,
      ease: MOTION_EASINGS.luxuryDecel,
    },
  },
};
