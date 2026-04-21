import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  glowColor?: string;
  magneticForce?: number;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, variant = 'primary', glowColor = 'rgba(34, 197, 94, 0.4)', magneticForce = 0.35, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLSpanElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: buttonRef });

    // Quick setters for maximum performance on mouse move
    const xTo = useRef<any>();
    const yTo = useRef<any>();
    const contentXTo = useRef<any>();
    const contentYTo = useRef<any>();

    useEffect(() => {
      // Initialize quickTo setters
      xTo.current = gsap.quickTo(buttonRef.current, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });
      yTo.current = gsap.quickTo(buttonRef.current, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });
      
      contentXTo.current = gsap.quickTo(contentRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
      contentYTo.current = gsap.quickTo(contentRef.current, 'y', { duration: 0.8, ease: 'power2.out' });
    }, []);

    const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height, left, top } = buttonRef.current.getBoundingClientRect();
      
      // Calculate distance from center
      const x = (clientX - (left + width / 2)) * magneticForce;
      const y = (clientY - (top + height / 2)) * magneticForce;
      
      // Apply movement
      xTo.current(x);
      yTo.current(y);
      
      // Inner content moves slightly less for depth
      contentXTo.current(x * 0.4);
      contentYTo.current(y * 0.4);
    });

    const handleMouseEnter = contextSafe(() => {
      gsap.to(buttonRef.current, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
      }
    });

    const handleMouseLeave = contextSafe(() => {
      // Reset positions with elastic snap back
      xTo.current(0);
      yTo.current(0);
      contentXTo.current(0);
      contentYTo.current(0);
      
      gsap.to(buttonRef.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      if (glowRef.current) {
        gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
      }
    });

    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide rounded-full overflow-hidden focus:outline-none will-change-transform transform-gpu";
    
    const variants = {
      primary: "bg-green-500 text-white shadow-xl shadow-green-500/20 border border-green-500/50",
      secondary: "bg-card text-foreground border border-border shadow-lg backdrop-blur-md",
      outline: "bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
    };

    return (
      <button
        ref={(node) => {
          // @ts-ignore
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {/* Animated Glow Background */}
        {variant === 'primary' && (
          <div
            ref={glowRef}
            className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`
            }}
          />
        )}
        
        {/* Content Wrapper for Z-index & Parallax */}
        <span ref={contentRef} className="relative z-10 flex items-center justify-center gap-2 pointer-events-none">
          {children}
        </span>
      </button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

