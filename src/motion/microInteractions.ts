import { Variants } from 'motion/react';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from './config.js';

export const buttonTactileVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.025,
    transition: MOTION_SPRINGS.luxurySoft,
  },
  tap: {
    scale: 0.97,
    transition: MOTION_SPRINGS.tactilePress,
  },
};

export const primaryButtonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 14px 0 rgba(217, 119, 6, 0.25)',
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 8px 24px 0 rgba(217, 119, 6, 0.45)',
    transition: MOTION_SPRINGS.luxurySoft,
  },
  tap: {
    scale: 0.965,
    boxShadow: '0 2px 8px 0 rgba(217, 119, 6, 0.2)',
    transition: MOTION_SPRINGS.tactilePress,
  },
};

export const iconButtonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: MOTION_SPRINGS.luxurySoft,
  },
  tap: {
    scale: 0.92,
    transition: MOTION_SPRINGS.tactilePress,
  },
};

export const badgeUnlockVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: [0.8, 1.08, 1],
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.expressive,
      ease: MOTION_EASINGS.luxuryDecel,
    },
  },
};
