import { Transition } from 'motion/react';
import { MOTION_SPRINGS } from './config.js';

/**
 * Shared Element Layout Transition tokens.
 * Used with motion's `layoutId` to animate bottles seamlessly from cards into modals and back.
 */
export const SHARED_FLACON_TRANSITION: Transition = {
  ...MOTION_SPRINGS.spatialLayout,
};

export const getFlaconLayoutId = (fragranceId: number | string): string =>
  `flacon-bottle-${fragranceId}`;

export const getCardBadgeLayoutId = (fragranceId: number | string): string =>
  `flacon-badge-${fragranceId}`;
