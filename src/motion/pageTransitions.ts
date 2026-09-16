import { Variants } from 'motion/react';
import { MOTION_DURATIONS, MOTION_EASINGS } from './config.js';

/**
 * Liquid Luxury View Transitions.
 * Avoids abrupt slideshow jumping; keeps Y displacement subtle (8px)
 * and uses gentle opacity transitions to maintain spatial continuity.
 */
export const pageViewVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.standard,
      ease: MOTION_EASINGS.luxuryDecel,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: MOTION_DURATIONS.micro,
      ease: MOTION_EASINGS.luxuryFluid,
    },
  },
};
