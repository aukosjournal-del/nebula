import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Atmospheric Logic - Viewport Animation Loader
 *
 * Lazy-loads animations using IntersectionObserver for performance.
 * Only plays animations when elements are visible in the viewport.
 * GPU-accelerated: all transforms use translate3d.
 */

interface UseLottieOnViewportOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseLottieOnViewportReturn {
  isVisible: boolean;
  isLoaded: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook that detects when an element enters/leaves the viewport.
 * Useful for lazy-loading animations and heavy visual effects.
 */
export function useLottieOnViewport(
  options: UseLottieOnViewportOptions = {}
): UseLottieOnViewportReturn {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, isLoaded]);

  return { isVisible, isLoaded, containerRef };
}

/**
 * Organic Blob Animation Config
 *
 * Instead of requiring lottie-web (heavy dependency),
 * we use Framer Motion to create organic, living animations
 * that embody the "Ready DNA" of Atmospheric Logic.
 */
export interface OrganicBlobConfig {
  colors: string[];
  size: number;
  blur: number;
  opacity: number;
  duration: number;
}

export const defaultBlobConfigs: Record<string, OrganicBlobConfig> = {
  cyan: {
    colors: ['rgba(6, 182, 212, 0.3)', 'rgba(6, 182, 212, 0.1)'],
    size: 150,
    blur: 40,
    opacity: 0.2,
    duration: 8,
  },
  purple: {
    colors: ['rgba(167, 139, 250, 0.3)', 'rgba(167, 139, 250, 0.1)'],
    size: 120,
    blur: 35,
    opacity: 0.15,
    duration: 10,
  },
  amber: {
    colors: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.05)'],
    size: 100,
    blur: 30,
    opacity: 0.1,
    duration: 12,
  },
};

/**
 * Generates random motion keyframes for organic blob movement.
 * Creates natural, non-repetitive looking paths.
 */
export function generateOrganicKeyframes(amplitude: number = 20) {
  const points = 4;
  const xKeyframes: number[] = [];
  const yKeyframes: number[] = [];
  const scaleKeyframes: number[] = [];

  for (let i = 0; i <= points; i++) {
    xKeyframes.push((Math.random() - 0.5) * amplitude * 2);
    yKeyframes.push((Math.random() - 0.5) * amplitude * 2);
    scaleKeyframes.push(0.9 + Math.random() * 0.2);
  }

  // Close the loop
  xKeyframes.push(xKeyframes[0]);
  yKeyframes.push(yKeyframes[0]);
  scaleKeyframes.push(scaleKeyframes[0]);

  return { x: xKeyframes, y: yKeyframes, scale: scaleKeyframes };
}

/**
 * Preload utility for images/assets used in animations.
 * Returns a promise that resolves when the asset is loaded.
 */
export function preloadAsset(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (url.endsWith('.json')) {
      fetch(url)
        .then((res) => res.json())
        .then(() => resolve())
        .catch(reject);
    } else {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    }
  });
}

/**
 * Debounced scroll handler for performance-critical scroll animations.
 */
export function useScrollProgress(containerRef: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const maxScroll = scrollHeight - clientHeight;
      setProgress(maxScroll > 0 ? scrollTop / maxScroll : 0);
    });
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, handleScroll]);

  return progress;
}
