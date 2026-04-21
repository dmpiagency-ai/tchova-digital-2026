import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  glowOpacity?: number;
  glowColor?: string;
}

export const TiltCard = ({
  children,
  className,
  maxTilt = 10,
  glowOpacity = 0.25,
  glowColor = 'rgba(34, 197, 94, 0.4)',
  ...props
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Refs for quick setters
  const xRotateTo = useRef<any>();
  const yRotateTo = useRef<any>();
  const glareXTo = useRef<any>();
  const glareYTo = useRef<any>();

  useEffect(() => {
    // Initialize high-performance setters
    xRotateTo.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.5, ease: 'power2.out' });
    yRotateTo.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.5, ease: 'power2.out' });
    
    glareXTo.current = gsap.quickTo(glareRef.current, 'xPercent', { duration: 0.5, ease: 'power2.out' });
    glareYTo.current = gsap.quickTo(glareRef.current, 'yPercent', { duration: 0.5, ease: 'power2.out' });
  }, []);

  const onMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / height - 0.5) * 2; // -1 to 1
    
    // Apply 3D rotation
    xRotateTo.current(-yPct * maxTilt);
    yRotateTo.current(xPct * maxTilt);
    
    // Apply glare movement
    glareXTo.current(xPct * 50);
    glareYTo.current(yPct * 50);
  });

  const onMouseEnter = contextSafe(() => {
    gsap.to(glareRef.current, { opacity: glowOpacity, duration: 0.3 });
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
  });

  const onMouseLeave = contextSafe(() => {
    // Reset positions with elastic snap
    xRotateTo.current(0);
    yRotateTo.current(0);
    glareXTo.current(0);
    glareYTo.current(0);
    
    gsap.to(glareRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(cardRef.current, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  });

  return (
    <div 
      ref={containerRef}
      className={cn("relative perspective-1000", className)}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full rounded-[2rem] transition-all overflow-hidden border border-white/5 dark:border-white/10 bg-background/50 backdrop-blur-md will-change-transform transform-gpu shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cinematic Glare layer */}
        <div 
          ref={glareRef}
          className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
          style={{ 
            background: `radial-gradient(circle at center, ${glowColor}, transparent 80%)`,
            transform: 'translateZ(1px) scale(2)'
          }}
        />
        
        {/* Content Wrapper (lifted in Z-space) */}
        <div 
          className="relative z-10 w-full h-full"
          style={{ transform: 'translateZ(40px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

