import { Transition } from 'motion/react';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from './config.js';

export const TRANSITIONS = {
  // Snappy button press & release
  tactilePress: {
    ...MOTION_SPRINGS.tactilePress,
  } satisfies Transition,

  // Fluid card hover and elevation
  cardHover: {
    ...MOTION_SPRINGS.luxurySoft,
  } satisfies Transition,

  // Smooth modal entrance
  modalEntrance: {
    type: 'spring',
    stiffness: 300,
    damping: 32,
    mass: 0.95,
  } satisfies Transition,

  // Backdrop opacity cross-fade
  backdropFade: {
    duration: MOTION_DURATIONS.standard,
    ease: MOTION_EASINGS.luxuryDecel,
  } satisfies Transition,

  // Standard staggered list item
  staggeredChild: (index: number = 0, baseDelay: number = 0.04) => ({
    duration: MOTION_DURATIONS.standard,
    ease: MOTION_EASINGS.luxuryDecel,
    delay: index * baseDelay,
  }) satisfies Transition,

  // Page view transition
  pageCrossFade: {
    duration: MOTION_DURATIONS.standard,
    ease: MOTION_EASINGS.luxuryFluid,
  } satisfies Transition,

  // Cinematic sequence for laboratory synthesis
  cinematicLab: {
    duration: MOTION_DURATIONS.cinematic,
    ease: MOTION_EASINGS.luxuryDecel,
  } satisfies Transition,
};
