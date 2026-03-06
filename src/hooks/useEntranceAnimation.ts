// ============================================
// USE ENTRANCE ANIMATION HOOK
// Scroll-triggered entrance animations
// ============================================

import { useState, useEffect, useRef } from 'react';

interface UseEntranceAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useEntranceAnimation = <T extends HTMLElement>(
  options: UseEntranceAnimationOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (triggerOnce && hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);

  return { ref, isVisible };
};

// Animation delay for staggered effects
export const useStaggeredDelay = (index: number, baseDelay: number = 50) => {
  return { animationDelay: `${index * baseDelay}ms` };
};

export default useEntranceAnimation;
