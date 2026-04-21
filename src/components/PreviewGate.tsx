import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PreviewGateProps {
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  serviceTitle: string;
  serviceDescription?: string;
  onUnlock?: () => void;
  blurIntensity?: 'light' | 'medium' | 'heavy';
  showPreviewTimer?: number; // seconds before showing login prompt
}

const PreviewGate: React.FC<PreviewGateProps> = ({
  children,
  previewContent,
  serviceTitle,
  serviceDescription,
  onUnlock,
  blurIntensity = 'medium',
  showPreviewTimer = 3
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(false);
  const [renderPrompt, setRenderPrompt] = useState(false);
  const [renderHint, setRenderHint] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const blurClasses = {
    light: 'blur-[4px]',
    medium: 'blur-[8px]',
    heavy: 'blur-[16px]'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeElapsed(true);
      setRenderPrompt(true);
      setShowPrompt(true);
    }, showPreviewTimer * 1000);

    return () => clearTimeout(timer);
  }, [showPreviewTimer]);

  useEffect(() => {
    setRenderHint(isHovering && !timeElapsed);
  }, [isHovering, timeElapsed]);

  // Entrance/Exit for Prompt
  useGSAP(() => {
    if (renderPrompt) {
      gsap.fromTo(promptRef.current, 
        { scale: 0.9, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
      
      // Animate content blur increase
      gsap.to(contentRef.current, {
        filter: blurClasses[blurIntensity].replace('blur(', 'blur('),
        duration: 1,
        ease: 'power2.out'
      });
    }
  }, { scope: containerRef, dependencies: [renderPrompt] });

  // Entrance/Exit for Hint
  useGSAP(() => {
    if (renderHint) {
      gsap.fromTo(hintRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [renderHint] });

  const handleUnlock = contextSafe(() => {
    if (onUnlock) {
      onUnlock();
    } else {
      window.dispatchEvent(new CustomEvent('show-login-modal', {
        detail: {
          service: serviceTitle,
          title: `Desbloquear ${serviceTitle}`
        }
      }));
    }
  });

  const closePrompt = contextSafe(() => {
    gsap.to(promptRef.current, {
      scale: 0.9,
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setRenderPrompt(false);
        setShowPrompt(false);
        // Reduce blur slightly as feedback
        gsap.to(contentRef.current, { filter: 'blur(2px)', duration: 0.8 });
      }
    });
  });

  return (
    <div ref={containerRef} className="relative group overflow-hidden rounded-2xl">
      {/* Blurred Content */}
      <div 
        ref={contentRef}
        className="transition-all duration-700 ease-out"
        style={{ filter: !timeElapsed ? 'none' : blurClasses[blurIntensity] }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {previewContent || children}
      </div>

      {/* Overlay with unlock prompt */}
      {renderPrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-30">
          <div
            ref={promptRef}
            className="text-center p-8 max-w-sm bg-background/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-3xl opacity-0"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/20 border border-primary/20 mb-6 shadow-xl shadow-primary/10">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            
            <h3 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tighter">
              {serviceTitle}
            </h3>
            
            {serviceDescription && (
              <p className="text-muted-foreground text-sm mb-8 font-medium leading-relaxed">
                {serviceDescription}
              </p>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleUnlock}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-2xl py-8 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Lock className="w-4 h-4 mr-2 group-hover:scale-0 transition-transform" />
                <ArrowRight className="w-5 h-5 absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all" />
                <span className="group-hover:translate-x-4 transition-transform">Desbloquear Agora</span>
              </Button>
              
              <button
                onClick={closePrompt}
                className="text-muted-foreground hover:text-foreground text-xs font-black uppercase tracking-widest transition-colors py-2"
              >
                Talvez mais tarde
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hover hint */}
      {renderHint && (
        <div
          ref={hintRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-full flex items-center gap-3 z-40 border border-white/10 shadow-2xl opacity-0"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Fez login para desbloquear</span>
        </div>
      )}
    </div>
  );
};

export default PreviewGate;
