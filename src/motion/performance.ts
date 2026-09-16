/**
 * Performance utilities for 60fps liquid rendering.
 * Enforces GPU-accelerated CSS styles (will-change, transform3d).
 */

export const GPU_ACCELERATED_STYLE = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  WebkitFontSmoothing: 'subpixel-antialiased' as const,
};

export const WILL_CHANGE_TRANSFORM = {
  willChange: 'transform, opacity',
};

/**
 * Detects whether the active device is low-power or mobile
 * to selectively scale down particle density and 3D tilts.
 */
export function isMobileOrLowPower(): boolean {
  if (typeof window === 'undefined') return false;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth < 768;
  return isTouch || isSmallScreen;
}
