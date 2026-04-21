'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './RotatingText.css';

interface RotatingTextProps {
  texts: string[];
  transition?: any;
  initial?: any;
  animate?: any;
  exit?: any;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'characters' | 'words' | 'lines' | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

interface WordObj {
  characters: string[];
  needsSpace: boolean;
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>((props, ref) => {
  const {
    texts,
    rotationInterval = 2000,
    staggerDuration = 0.05,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const splitIntoCharacters = (text: string): string[] => {
    if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
      const Segmenter = (Intl as unknown as any).Segmenter;
      const segmenter = new Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), (segment: any) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo((): WordObj[] => {
    const currentText = texts[currentTextIndex];
    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word: string, i: number) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1
      }));
    }
    if (splitBy === 'words') {
      return currentText.split(' ').map((word: string, i: number, arr: string[]) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1
      }));
    }
    if (splitBy === 'lines') {
      return currentText.split('\n').map((line: string, i: number, arr: string[]) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1
      }));
    }

    return currentText.split(splitBy).map((part: string, i: number, arr: string[]) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1
    }));
  }, [texts, currentTextIndex, splitBy]);

  const transitionTo = contextSafe((newIndex: number) => {
    if (isTransitioning || newIndex === currentTextIndex) return;

    setIsTransitioning(true);
    const elements = containerRef.current?.querySelectorAll('.text-rotate-element');
    
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentTextIndex(newIndex);
        if (onNext) onNext(newIndex);
        setIsTransitioning(false);
      }
    });

    if (elements && elements.length > 0) {
      tl.to(elements, {
        y: -20,
        opacity: 0,
        stagger: {
          each: staggerDuration,
          from: staggerFrom as any
        },
        duration: 0.4,
        ease: 'power2.in'
      });
    } else {
      tl.to({}, { duration: 0.1 });
    }
  });

  useGSAP(() => {
    const elements = containerRef.current?.querySelectorAll('.text-rotate-element');
    if (elements && elements.length > 0) {
      gsap.fromTo(elements, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: {
            each: staggerDuration,
            from: staggerFrom as any
          },
          duration: 0.6, 
          ease: 'elastic.out(1, 0.8)' 
        }
      );
    }
  }, { scope: containerRef, dependencies: [currentTextIndex] });

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
    transitionTo(nextIndex);
  }, [currentTextIndex, texts.length, loop, transitionTo]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
    transitionTo(prevIndex);
  }, [currentTextIndex, texts.length, loop, transitionTo]);

  useImperativeHandle(ref, () => ({
    next,
    previous,
    jumpTo: (index: number) => transitionTo(Math.max(0, Math.min(index, texts.length - 1))),
    reset: () => transitionTo(0)
  }), [next, previous, transitionTo, texts.length]);

  useEffect(() => {
    if (!auto || isTransitioning) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto, isTransitioning]);

  return (
    <span ref={containerRef} className={cn('text-rotate inline-flex flex-wrap justify-center', mainClassName)}>
      <span className="text-rotate-sr-only">{texts[currentTextIndex]}</span>
      <span
        key={currentTextIndex}
        className={cn(splitBy === 'lines' ? 'text-rotate-lines' : 'text-rotate', 'inline-flex flex-wrap justify-center')}
        aria-hidden="true"
      >
        {elements.map((wordObj: WordObj, wordIndex: number) => (
          <span key={wordIndex} className={cn('text-rotate-word inline-flex overflow-hidden', splitLevelClassName)}>
            {wordObj.characters.map((char: string, charIndex: number) => (
              <span
                key={charIndex}
                className={cn('text-rotate-element inline-block will-change-transform', elementLevelClassName)}
              >
                {char}
              </span>
            ))}
            {wordObj.needsSpace && <span className="text-rotate-space">&nbsp;</span>}
          </span>
        ))}
      </span>
    </span>
  );
});

RotatingText.displayName = 'RotatingText';
export default RotatingText;
