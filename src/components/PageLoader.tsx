import React from 'react';
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ── Video URLs (same as Hero — preloaded here so they're cached before Hero mounts) ──
const DESKTOP_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_82/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.webm';
const MOBILE_VIDEO  = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_82/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.mp4';

const getVideoUrl = () => {
  if (typeof window === 'undefined') return DESKTOP_VIDEO;
  return window.innerWidth < 1024 ? MOBILE_VIDEO : DESKTOP_VIDEO;
};

interface PageLoaderProps {
  message?: string;
  duration?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "INICIALIZANDO ECOSSISTEMA",
  duration = 400
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const videoReadyRef = useRef(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const hideLoader = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsVisible(false)
    });

    tl.to(contentRef.current, { 
      opacity: 0, 
      scale: 0.95,
      y: -20,
      duration: 0.35, 
      ease: 'power3.in' 
    })
    .to(containerRef.current, { 
      yPercent: -100,
      duration: 0.55, 
      ease: 'expo.inOut' 
    }, "-=0.15");
  });

  // Preload hero video chunk
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const videoUrl = getVideoUrl();
    let timeoutId: ReturnType<typeof setTimeout>;
    let resolved = false;

    const markReady = () => {
      if (resolved) return;
      resolved = true;
      videoReadyRef.current = true;
    };

    if (isMobile) {
      markReady();
      return;
    }

    if ('fetch' in window) {
      const controller = new AbortController();
      fetch(videoUrl, {
        signal: controller.signal,
        headers: { Range: 'bytes=0-512000' },
      })
        .then(() => markReady())
        .catch(() => {});

      timeoutId = setTimeout(() => {
        if (!resolved) {
          controller.abort();
          markReady();
        }
      }, 4000);
    } else {
      timeoutId = setTimeout(markReady, duration);
    }

    return () => clearTimeout(timeoutId);
  }, [duration]);

  // Loader exit listener
  useEffect(() => {
    let cancelled = false;

    const tryHide = () => {
      if (!cancelled) hideLoader();
    };

    interface TimeoutWithGrace extends ReturnType<typeof setTimeout> {
      __grace?: ReturnType<typeof setTimeout>;
    }

    const minTimer = setTimeout(() => {
      if (videoReadyRef.current) {
        tryHide();
      } else {
        const grace = setTimeout(() => tryHide(), 500);
        (minTimer as TimeoutWithGrace).__grace = grace;
      }
    }, duration + 150);

    const hardMax = setTimeout(() => tryHide(), 4500);

    const handleContentReady = () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(hardMax);
      if ((minTimer as TimeoutWithGrace).__grace) clearTimeout((minTimer as TimeoutWithGrace).__grace);
      hideLoader();
    };

    window.addEventListener('content-ready', handleContentReady as EventListenerOrEventListenerObject);

    return () => {
      cancelled = true;
      clearTimeout(minTimer);
      clearTimeout(hardMax);
      if ((minTimer as TimeoutWithGrace).__grace) clearTimeout((minTimer as TimeoutWithGrace).__grace);
      window.removeEventListener('content-ready', handleContentReady as EventListenerOrEventListenerObject);
    };
  }, [duration, hideLoader]);

  useGSAP(() => {
    if (!isVisible || !contentRef.current) return;

    // Entrance
    gsap.fromTo(contentRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );

    // Pulse logo glow
    gsap.to(logoRef.current, {
      scale: 1.04,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // Progress percentage counter + bar sync
    const counterObj = { value: 0 };
    gsap.to(counterObj, {
      value: 100,
      duration: Math.max(duration / 1000, 1.2),
      ease: 'power2.out',
      onUpdate: () => {
        setProgressPercent(Math.round(counterObj.value));
      }
    });

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: '100%',
        duration: Math.max(duration / 1000, 1.2),
        ease: 'power2.out'
      });
    }
  }, { scope: containerRef, dependencies: [isVisible] });

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 text-white font-nunito overflow-hidden pointer-events-auto select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      <div ref={contentRef} className="flex flex-col items-center justify-center relative z-10 px-6 max-w-sm text-center">
        {/* Brand Emblem with Emerald Ring */}
        <div ref={logoRef} className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Subtle Rotating Pulse Ring */}
          <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-[-6px] rounded-full border border-primary/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

          {/* Glowing Center */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,225,60,0.25)]">
            <svg 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 640 439" 
              className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,225,60,0.8)]"
            >
              <path fill="currentColor" d="M55.6,138.8h207.9c39.1,0,71,31.8,71,70.6v11.1H178.1C101.4,220.5,55.6,210.6,55.6,138.8L55.6,138.8z"/>
              <path fill="currentColor" d="M509.7,203.1c3.5,15.3,5.3,31.7,5.3,49.1c0,35.5-8,67.2-24.2,94.8c-16,27.5-39.7,50.2-70.9,68c-0.6,0.4-1.4,0.8-2,1.2c11.4-1,22.7-2.5,34-4.6c20.9-4.6,40.1-11.9,57.9-22c31.1-17.9,54.9-40.5,70.9-68.1c16.2-27.5,24.2-59.1,24.2-94.7c0-0.5,0-1,0-1.4c-10.1-21.8-24.9-40.7-44-56.8c-25-21.1-55.9-35.5-92.8-43.6c-20.7-4.6-43.3-7.1-67.7-7.5c32.2,2.4,58,11.9,77.4,28.7c10.8,9.4,19,20.2,24.6,32.8C505.8,186.5,508.2,194.5,509.7,203.1L509.7,203.1z"/>
              <path fill="currentColor" d="M154.6,245.4h81.7l-1,173.8c-71.8-0.3-81.5-39.9-81.1-106.2L154.6,245.4z"/>
              <path fill="currentColor" d="M195,336.7c-0.2,0-0.3,0-0.5,0c0,4.3,0.2,8.4,0.5,12.2V336.7z M543.7,86.5C504.9,54,452,37,385.1,35.4c-0.2,0.7-0.4,1.3-0.6,2c7-0.6,14.6,3.8,15.4,13c2.1,24-5.1,48.5-20.1,66.4l3.7,0.1v0.1c40.2,0,71.6,9.8,94.3,29.3c22.7,19.6,34,46.3,34,80.6c0,34.2-11.4,60.8-34,80.3c-22.7,19.4-54.2,29.1-94.3,29.1c-39.8,0-79.7,0.2-119.5,0.3v79c15.5,2.2,33.2,2.9,53.1,2.9c45.7,0,90.5,1.4,134.8-6.7c20.9-4.6,40.1-11.9,57.9-22c31.2-17.9,54.9-40.5,70.9-68.1c16.2-27.5,24.2-59.1,24.2-94.7C604.8,167.5,584.4,120.7,543.7,86.5z"/>
              <path fill="currentColor" d="M90.2,112.2l293.1,4.6v0.1c5.8,0,11.4,0.2,16.9,0.6c67.9,1.3,121.4,18.3,160.5,51.2c19.2,16.1,33.9,35,44,56.8c-0.3-58.8-20.7-105.1-61.2-139c-40.7-34.2-97.1-51.2-169-51.2h-11.4l-262.3-4.7H75.5c-52.7,0-54.9,78.6-2.2,81.2C78.7,112,84.4,112.2,90.2,112.2L90.2,112.2z"/>
            </svg>
          </div>
        </div>

        {/* Brand Logotype & Status */}
        <h2 className="text-xl font-bold tracking-tight uppercase text-white mb-1">
          Tchova<span className="text-primary">Digital</span>
        </h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold tracking-[0.25em] text-white/50 uppercase">
            {message}
          </span>
          <span className="text-[11px] font-mono font-bold text-primary tabular-nums">
            {progressPercent}%
          </span>
        </div>

        {/* Minimal Progress Bar with Glow */}
        <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <div 
            ref={progressBarRef}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-brand-green w-0 shadow-[0_0_12px_#00E13C]"
          />
        </div>
      </div>
    </div>
  );
};
