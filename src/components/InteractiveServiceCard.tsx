import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface InteractiveServiceCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  delay?: number;
  featured?: boolean;
}

export const InteractiveServiceCard: React.FC<InteractiveServiceCardProps> = ({
  title, 
  subtitle, 
  icon, 
  gradient, 
  borderColor, 
  delay = 0,
  featured = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onMouseMove = contextSafe((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1
    
    // Smooth 3D tilt
    gsap.to(cardRef.current, {
      rotateY: xPct * 15,
      rotateX: -yPct * 15,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Parallax depth for inner elements
    gsap.to(iconRef.current, {
      x: xPct * 10,
      y: yPct * 10,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Glare effect movement
    gsap.to(glareRef.current, {
      xPercent: xPct * 50,
      yPercent: yPct * 50,
      opacity: 0.2,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  const onMouseLeave = contextSafe(() => {
    if (!cardRef.current) return;
    
    gsap.to([cardRef.current, iconRef.current, contentRef.current], {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto'
    });

    gsap.to(glareRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  const onMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, {
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  return (
    <div 
      ref={containerRef}
      className={featured ? "sm:col-span-2 sm:row-span-2 h-full" : "h-full"}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`group h-full w-full bg-white/5 dark:bg-black/20 backdrop-blur-xl rounded-[24px] shadow-2xl p-6 lg:p-8 flex flex-col items-center justify-center border ${borderColor} cursor-pointer relative overflow-hidden will-change-transform transform-gpu`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div 
          ref={iconRef}
          className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-shadow duration-300 pointer-events-none`}
          style={{ transform: 'translateZ(50px)' }}
        >
          {icon}
        </div>
        
        <div 
          ref={contentRef}
          className="flex flex-col items-center pointer-events-none"
          style={{ transform: 'translateZ(30px)' }}
        >
          <span className="text-lg lg:text-xl font-bold text-foreground text-center z-10">
            {title}
          </span>
          <span className="text-sm lg:text-base text-foreground/70 mt-1 z-10 text-center">
            {subtitle}
          </span>
        </div>
        
        {/* Cinematic Glare layer */}
        <div 
          ref={glareRef}
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 pointer-events-none mix-blend-overlay"
          style={{ transform: 'translateZ(10px) scale(2)' }}
        />
      </div>
    </div>
  );
};

