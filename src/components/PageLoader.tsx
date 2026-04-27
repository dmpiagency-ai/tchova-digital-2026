import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PageLoaderProps {
  message?: string;
  duration?: number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "A carregar ecossistema...",
  duration = 400
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const hideLoader = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => setIsVisible(false)
    });

    tl.to(contentRef.current, { 
      opacity: 0, 
      y: -40, 
      scale: 0.9,
      duration: 0.3, 
      ease: 'expo.in' 
    })
    .to(containerRef.current, { 
      opacity: 0, 
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.5, 
      ease: 'expo.inOut' 
    }, "-=0.15");
  });

  useEffect(() => {
    const timer = setTimeout(hideLoader, duration + 200);
    
    const handleContentReady = () => {
      clearTimeout(timer);
      hideLoader();
    };

    window.addEventListener('content-ready', handleContentReady as EventListener);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('content-ready', handleContentReady as EventListener);
    };
  }, [duration, hideLoader]);

  useGSAP(() => {
    if (!isVisible) return;

    if (!isVisible || !contentRef.current) return;

    // 1. Entrance animation
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    });

    // 2. Continuous animations
    gsap.to(ring1Ref.current, {
      rotate: 360,
      duration: 3,
      repeat: -1,
      ease: 'none'
    });

    gsap.to(ring2Ref.current, {
      rotate: -360,
      duration: 4,
      repeat: -1,
      ease: 'none'
    });

    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // 3. Progress bar animation
    gsap.to(progressRef.current, {
      width: '100%',
      duration: duration / 1000,
      ease: 'power1.inOut'
    });
  }, { scope: containerRef, dependencies: [isVisible] });

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-3xl overflow-hidden pointer-events-auto"
    >
      {/* Subtle Ambient Light Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div ref={contentRef} className="flex flex-col items-center justify-center relative z-10">
        {/* The Outer Spinning Ring */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div
            ref={ring1Ref}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary/80"
          />
          <div
            ref={ring2Ref}
            className="absolute inset-[-10px] rounded-full border-b-2 border-l-2 border-brand-yellow/50"
          />
          
          {/* Central Mark */}
          <div
            ref={logoRef}
            className="relative z-10 w-20 h-20 flex items-center justify-center pt-2"
          >
            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
            <svg 
              version="1.1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 640 439" 
              className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]"
            >
              <path fill="currentColor" d="M55.6,138.8h207.9c39.1,0,71,31.8,71,70.6v11.1H178.1C101.4,220.5,55.6,210.6,55.6,138.8L55.6,138.8z"/>
              <path fill="currentColor" d="M509.7,203.1c3.5,15.3,5.3,31.7,5.3,49.1c0,35.5-8,67.2-24.2,94.8c-16,27.5-39.7,50.2-70.9,68c-0.6,0.4-1.4,0.8-2,1.2c11.4-1,22.7-2.5,34-4.6c20.9-4.6,40.1-11.9,57.9-22c31.1-17.9,54.9-40.5,70.9-68.1c16.2-27.5,24.2-59.1,24.2-94.7c0-0.5,0-1,0-1.4c-10.1-21.8-24.9-40.7-44-56.8c-25-21.1-55.9-35.5-92.8-43.6c-20.7-4.6-43.3-7.1-67.7-7.5c32.2,2.4,58,11.9,77.4,28.7c10.8,9.4,19,20.2,24.6,32.8C505.8,186.5,508.2,194.5,509.7,203.1L509.7,203.1z"/>
              <path fill="currentColor" d="M154.6,245.4h81.7l-1,173.8c-71.8-0.3-81.5-39.9-81.1-106.2L154.6,245.4z"/>
              <path fill="currentColor" d="M195,336.7c-0.2,0-0.3,0-0.5,0c0,4.3,0.2,8.4,0.5,12.2V336.7z M543.7,86.5C504.9,54,452,37,385.1,35.4c-0.2,0.7-0.4,1.3-0.6,2c7-0.6,14.6,3.8,15.4,13c2.1,24-5.1,48.5-20.1,66.4l3.7,0.1v0.1c40.2,0,71.6,9.8,94.3,29.3c22.7,19.6,34,46.3,34,80.6c0,34.2-11.4,60.8-34,80.3c-22.7,19.4-54.2,29.1-94.3,29.1c-39.8,0-79.7,0.2-119.5,0.3v79c15.5,2.2,33.2,2.9,53.1,2.9c45.7,0,90.5,1.4,134.8-6.7c20.9-4.6,40.1-11.9,57.9-22c31.2-17.9,54.9-40.5,70.9-68.1c16.2-27.5,24.2-59.1,24.2-94.7C604.8,167.5,584.4,120.7,543.7,86.5z"/>
              <path fill="currentColor" d="M90.2,112.2l293.1,4.6v0.1c5.8,0,11.4,0.2,16.9,0.6c67.9,1.3,121.4,18.3,160.5,51.2c19.2,16.1,33.9,35,44,56.8c-0.3-58.8-20.7-105.1-61.2-139c-40.7-34.2-97.1-51.2-169-51.2h-11.4l-262.3-4.7H75.5c-52.7,0-54.9,78.6-2.2,81.2C78.7,112,84.4,112.2,90.2,112.2L90.2,112.2z"/>
            </svg>
          </div>
        </div>
        
        {/* Loading text with progress bar */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand-yellow">
            TchovaDigital
          </h2>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase pb-1 opacity-70">
              {message}
            </span>
          </div>
          
          {/* Progress Line */}
          <div className="w-32 h-[1px] bg-white/5 overflow-hidden mt-3 relative">
            <div 
              ref={progressRef}
              className="absolute inset-y-0 left-0 bg-primary blur-[0.5px] w-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

