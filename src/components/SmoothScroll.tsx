import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip on mobile — native iOS/Android scroll is faster than any JS library
    // and the RAF loop causes jank on low-end devices
    const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReducedMotion || !document.body) return;

    // Detect low-end device: ≤2 CPU cores or ≤2GB RAM
    const isLowEnd =
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 2);

    lenisRef.current = new Lenis({
      duration: isLowEnd ? 0.7 : 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      mouseMultiplier: isLowEnd ? 0.7 : 0.9,
      touchMultiplier: 1.5,
      infinite: false,
    });

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
};
