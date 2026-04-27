import React, { useRef } from 'react';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { 
  EliteMatrix, EliteVector, ElitePulse, EliteRadar, 
  EliteGrid, EliteLens, EliteCore, EliteNode, EliteSphere 
} from './ui/EliteIcons';

interface ServiceVisualProps {
  type: 'design' | 'websites' | 'marketing' | 'audiovisual' | 'importacao' | string;
  className?: string;
}

export const ServiceVisual: React.FC<ServiceVisualProps> = ({ type, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!visualRef.current) return;

    // Base floating animation
    gsap.to(visualRef.current, {
      y: -20,
      rotateX: 5,
      rotateY: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Particle/Detail animations based on type
    const particles = visualRef.current.querySelectorAll('.visual-particle');
    if (particles.length > 0) {
      gsap.to(particles, {
        opacity: (i) => 0.3 + Math.random() * 0.5,
        scale: (i) => 0.8 + Math.random() * 0.4,
        duration: (i) => 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut"
      });
    }

    // Specific animations
    if (type === 'marketing') {
      const pulse = visualRef.current.querySelector('.elite-pulse-icon');
      if (pulse) {
        gsap.to(pulse, {
          scale: 1.1,
          opacity: 0.8,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    }

    if (type === 'websites') {
      const streams = visualRef.current.querySelectorAll('.data-stream');
      gsap.to(streams, {
        strokeDashoffset: -100,
        duration: 2,
        repeat: -1,
        ease: "none"
      });
    }

  }, { scope: containerRef, dependencies: [type] });

  const renderVisual = () => {
    switch (type) {
      case 'design':
        return (
          <div ref={visualRef} className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
            <EliteCore className="absolute w-32 h-32 lg:w-48 lg:h-48 text-primary/40 blur-[2px]" />
            <EliteMatrix className="relative w-40 h-40 lg:w-64 lg:h-64 text-primary z-10" />
            <div className="visual-particle absolute top-0 left-0 w-8 h-8 rounded-full bg-brand-green/20 blur-xl" />
            <div className="visual-particle absolute bottom-10 right-0 w-12 h-12 rounded-full bg-primary/20 blur-xl" />
            <div className="absolute inset-0 border border-white/5 rounded-full scale-110 animate-spin-slow opacity-20" />
          </div>
        );
      case 'websites':
        return (
          <div ref={visualRef} className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
            <EliteGrid className="absolute w-40 h-40 lg:w-64 lg:h-64 text-brand-green/30" />
            <EliteVector className="relative w-32 h-32 lg:w-48 lg:h-48 text-brand-green z-10" />
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
              <path className="data-stream" d="M10,50 Q50,10 90,50 T170,50" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="5,5" />
              <path className="data-stream" d="M10,80 Q60,40 110,80 T210,80" stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="5,5" />
            </svg>
          </div>
        );
      case 'marketing':
        return (
          <div ref={visualRef} className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
            <EliteRadar className="absolute w-48 h-48 lg:w-72 lg:h-72 text-brand-yellow/20" />
            <ElitePulse className="elite-pulse-icon relative w-32 h-32 lg:w-48 lg:h-48 text-brand-yellow z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="visual-particle w-64 h-64 border border-brand-yellow/10 rounded-full animate-ping" />
            </div>
          </div>
        );
      case 'audiovisual':
        return (
          <div ref={visualRef} className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-brand-green/10 rounded-full blur-3xl animate-pulse" />
            <EliteLens className="relative w-40 h-40 lg:w-64 lg:h-64 text-white z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <div className="visual-particle absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
            <div className="visual-particle absolute bottom-1/3 left-1/4 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>
        );
      case 'importacao':
        return (
          <div ref={visualRef} className="relative w-64 h-64 lg:w-96 lg:h-96 flex items-center justify-center">
            <EliteSphere className="absolute w-40 h-40 lg:w-64 lg:h-64 text-primary/20 animate-spin-slow" />
            <EliteNode className="relative w-32 h-32 lg:w-48 lg:h-48 text-primary z-10" />
            <div className="visual-particle absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-125" />
          </div>
        );
      default:
        return (
          <div ref={visualRef} className="w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        );
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center justify-center perspective-1000 ${className}`}
    >
      {renderVisual()}
    </div>
  );
};
