import { useEffect, useRef, useCallback } from 'react';

type AnimationType = 'slide-left' | 'slide-right' | 'slide-up' | 'fade-scale' | 'rotate-in';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  animation?: AnimationType;
  stagger?: boolean;
}

const animations: Record<AnimationType, { from: string; to: string }> = {
  'slide-left': {
    from: 'opacity: 0; transform: translateX(-80px) perspective(800px) rotateY(8deg);',
    to: 'opacity: 1; transform: translateX(0) perspective(800px) rotateY(0deg);',
  },
  'slide-right': {
    from: 'opacity: 0; transform: translateX(80px) perspective(800px) rotateY(-8deg);',
    to: 'opacity: 1; transform: translateX(0) perspective(800px) rotateY(0deg);',
  },
  'slide-up': {
    from: 'opacity: 0; transform: translateY(60px) scale(0.95);',
    to: 'opacity: 1; transform: translateY(0) scale(1);',
  },
  'fade-scale': {
    from: 'opacity: 0; transform: scale(0.88) perspective(600px) rotateX(6deg);',
    to: 'opacity: 1; transform: scale(1) perspective(600px) rotateX(0deg);',
  },
  'rotate-in': {
    from: 'opacity: 0; transform: rotate(-5deg) scale(0.9) translateY(30px);',
    to: 'opacity: 1; transform: rotate(0deg) scale(1) translateY(0);',
  },
};

const animationTypes: AnimationType[] = ['slide-left', 'slide-right', 'slide-up', 'fade-scale'];

function getRandomAnimation(index: number): AnimationType {
  return animationTypes[index % animationTypes.length];
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -60px 0px',
    delay = 0,
    animation,
    stagger = true,
  } = options;

  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.querySelectorAll<HTMLElement>('[data-reveal]');
    
    children.forEach((el, index) => {
      const animType = animation || getRandomAnimation(index);
      const anim = animations[animType];
      const staggerDelay = stagger ? index * 80 : 0;
      const totalDelay = delay + staggerDelay;

      el.style.cssText += anim.from;
      el.style.transition = `opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${totalDelay}ms, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${totalDelay}ms`;
      el.style.willChange = 'transform, opacity';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const animType = el.dataset.reveal as AnimationType || 'slide-up';
            const anim = animations[animType] || animations['slide-up'];
            
            requestAnimationFrame(() => {
              el.style.cssText = el.style.cssText.replace(anim.from, anim.to);
              anim.to.split(';').forEach((prop) => {
                const [key, value] = prop.split(':').map((s) => s?.trim());
                if (key && value) {
                  (el.style as any)[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
                }
              });
            });

            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    children.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, delay, animation, stagger]);

  return containerRef;
}

export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const scrolled = window.scrollY;
          const offset = (rect.top + scrolled - window.innerHeight * 0.5) * speed;
          el.style.transform = `translateY(${-offset}px) translateZ(0)`;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

export function use3DHover() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    requestAnimationFrame(() => {
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateZ(10px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove as EventListener);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove as EventListener);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}
