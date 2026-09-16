import { useState, useEffect } from 'react';

/**
 * Hook to observe user's system preference for reduced motion.
 * Ensures strict compliance with accessibility standards.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      // Fallback for older WebKit
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns safe transition parameters when reduced motion is requested.
 */
export function getAccessibleTransition<T extends Record<string, any>>(
  standardTransition: T,
  reducedMotion: boolean
): T | { duration: number; ease: string } {
  if (reducedMotion) {
    return {
      duration: 0.01,
      ease: 'linear',
    };
  }
  return standardTransition;
}
