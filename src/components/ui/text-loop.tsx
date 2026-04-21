import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState, useEffect, Children, useRef } from 'react';

type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  onIndexChange?: (index: number) => void;
};

export function TextLoop({
  children,
  className,
  interval = 2,
  onIndexChange,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const triggerTransition = contextSafe((nextIndex: number) => {
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(nextIndex);
        if (onIndexChange) onIndexChange(nextIndex);
      }
    });

    // Animate current item out
    tl.to(itemRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    });
  });

  // Entrance animation for new items
  useGSAP(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (itemRef.current) {
      gsap.fromTo(itemRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, { scope: containerRef, dependencies: [currentIndex] });

  useEffect(() => {
    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      triggerTransition(nextIndex);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items.length, interval, currentIndex, triggerTransition]);

  return (
    <div ref={containerRef} className={cn('relative inline-block whitespace-nowrap overflow-hidden', className)}>
      <div 
        ref={itemRef} 
        key={currentIndex} 
        className="will-change-transform will-change-opacity transform-gpu"
      >
        {items[currentIndex]}
      </div>
    </div>
  );
}
