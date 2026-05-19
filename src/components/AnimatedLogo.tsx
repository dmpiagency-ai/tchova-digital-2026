import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { cn } from '@/lib/utils';
import logoV1 from '@/assets/logo_v1.svg';
import logoV2 from '@/assets/logo_v2.svg';
import logoV3 from '@/assets/logo_v3.svg';

const TEXT_COLORS = {
  0: { tchova: '#FFFFFF', digital: '#22C55E' },
  1: { tchova: '#FFFFFF', digital: '#00EF64' },
  2: { tchova: '#D1D5DB', digital: '#283533' },
};

const BrandTextSVG = ({ tchovaFill, digitalFill, className }: { tchovaFill: string; digitalFill: string; className?: string }) => (
  <svg viewBox="0 0 3354.6 562.9" className={cn("h-full w-auto transition-colors duration-1000", className)}>
    <path fill={tchovaFill} d="M212.4,395.2V208.4h-45.7c-33.5,0-60.6-27.1-60.6-60.6v-10.9h240.2c33.5,0,60.6,27.1,60.6,60.6v10.9H300.1V473h-9.9C247.2,473,212.4,438.1,212.4,395.2z" className="transition-all duration-1000" />
    <path fill={tchovaFill} d="M518.4,478.7c-26.4,0-49.3-5-68.9-15c-19.5-10-34.7-24.3-45.5-42.9c-10.8-18.6-16.2-40.4-16.2-65.5c0-25.4,5.4-47.3,16.2-65.5c10.8-18.3,26-32.3,45.5-42.2c19.5-9.8,42.5-14.8,68.9-14.8c15.6,0,31.1,2.2,46.7,6.7c15.6,4.5,28.3,10.5,38.1,18.1l-22.9,58.2c-7-5.7-15.4-10.3-25.3-13.8c-9.9-3.5-19.2-5.2-28.1-5.2c-16.5,0-29.4,5.2-38.6,15.5c-9.2,10.3-13.8,24.9-13.8,43.6c0,18.1,4.6,32.4,13.8,42.9c9.2,10.5,22.1,15.7,38.6,15.7c8.9,0,18.3-1.7,28.1-5c9.8-3.3,18.3-8,25.3-14.1l22.9,58.6c-9.9,7.3-22.6,13.3-38.1,17.9C549.6,476.4,534,478.7,518.4,478.7z" className="transition-all duration-1000" />
    <path fill={tchovaFill} d="M629.5,473V136.9h84.8v142.5h-7.6c7.6-14.9,18.5-26.5,32.7-34.6c14.1-8.1,30.3-12.2,48.4-12.2c18.7,0,34.2,3.7,46.2,11.2c12.1,7.5,21.1,18.6,27.2,33.4c6,14.8,9.1,33.8,9.1,57V473h-84.8V337.6c0-9.5-1.1-17.2-3.3-22.9c-2.2-5.7-5.5-9.9-9.8-12.6c-4.3-2.7-9.6-4.1-16-4.1c-8.6,0-16.1,1.8-22.4,5.5c-6.4,3.7-11.2,8.9-14.5,15.7c-3.3,6.8-5,14.7-5,23.6V473H629.5z" className="transition-all duration-1000" />
    <path fill={tchovaFill} d="M1037.5,478.7c-26.1,0-48.8-4.9-68.2-14.8c-19.4-9.8-34.5-24.1-45.3-42.7c-10.8-18.6-16.2-40.4-16.2-65.5c0-25.4,5.4-47.3,16.2-65.8c10.8-18.4,25.9-32.6,45.3-42.4c19.4-9.8,42.1-14.8,68.2-14.8c26.4,0,49.2,4.9,68.4,14.8c19.2,9.9,34.2,24,44.8,42.4c10.6,18.4,16,40.4,16,65.8c0,25.1-5.3,47-16,65.5c-10.7,18.6-25.6,32.8-44.8,42.7C1086.7,473.8,1063.9,478.7,1037.5,478.7z M1037.5,415.3c12.7,0,23.2-4.7,31.5-14.1c8.3-9.4,12.4-24.7,12.4-46c0-21-4.1-36.1-12.4-45.5c-8.3-9.4-18.8-14.1-31.5-14.1c-13,0-23.7,4.7-31.9,14.1c-8.3,9.4-12.4,24.5-12.4,45.5c0,21.3,4.1,36.6,12.4,46C1013.9,410.6,1024.5,415.3,1037.5,415.3z" className="transition-all duration-1000" />
    <path fill={tchovaFill} d="M1272.5,473l-103-234.5h89.1l59.1,153.5h-16.2l62.4-153.5h82.9L1342.1,473H1272.5z" className="transition-all duration-1000" />
    <path fill={tchovaFill} d="M1538.1,478.7c-18.1,0-34.2-3.4-48.1-10.2c-14-6.8-24.9-16-32.7-27.6c-7.8-11.6-11.7-24.9-11.7-39.8c0-17.2,4.4-30.7,13.3-40.5c8.9-9.8,23.3-16.9,43.1-21.2c19.9-4.3,46.2-6.4,78.9-6.4h26.2v39.6H1581c-9.5,0-17.6,0.6-24.3,1.9c-6.7,1.3-12.2,2.9-16.7,4.8c-4.5,1.9-7.7,4.4-9.8,7.4c-2.1,3-3.1,6.8-3.1,11.2c0,7.3,2.5,13.3,7.6,18.1c5.1,4.8,12.7,7.2,22.9,7.2c7.6,0,14.5-1.7,20.7-5.2c6.2-3.5,11.2-8.3,15-14.5c3.8-6.2,5.7-13.4,5.7-21.7v-55.3c0-11.8-2.9-19.9-8.8-24.5c-5.9-4.6-15.8-6.9-29.8-6.9c-12.4,0-25.8,1.9-40.3,5.7c-14.5,3.8-28.8,9.7-43.1,17.6l-21.9-55.8c8.3-5.7,18.6-10.8,31-15.3c12.4-4.4,25.5-7.9,39.3-10.5c13.8-2.5,26.6-3.8,38.4-3.8c26.1,0,47.6,3.8,64.6,11.4c17,7.6,29.7,19.1,38.1,34.6c8.4,15.4,12.6,35.2,12.6,59.3V473H1600v-44.3h2.9c-1.6,9.9-5.2,18.5-11,26c-5.7,7.5-13.2,13.3-22.4,17.6C1560.3,476.5,1549.8,478.7,1538.1,478.7z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M1784,473V157.2c0-11.2,12.2-20.3,27.2-20.3h125.2c49.1,0,90.6,6.4,124.6,19.3c33.9,12.9,59.8,31.8,77.5,56.7c17.7,25,26.6,55.5,26.6,91.8c0,36.2-8.9,66.9-26.6,92c-17.7,25.1-43.5,44.1-77.5,57c-33.9,12.9-75.5,19.3-124.6,19.3H1784z M1836.5,439.6h96.1c59.3,0,114.9-11.3,144.1-33.8c29.2-22.6,43.9-56.2,43.9-101.1c0-44.8-14.7-78.4-44.2-100.8c-29.5-22.4-84.9-33.6-143.8-33.6h-96.1V439.6z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M2215.7,183.6v-43.4h47.7v43.4H2215.7z M2220.4,473V241.3h38.6V473H2220.4z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M2433.5,563.1c-20,0-38.8-2.6-56.5-7.9c-17.6-5.2-33.3-13.1-47-23.6l12.9-28.1c9.5,6.7,19,12.2,28.4,16.4c9.4,4.3,19.1,7.4,29.1,9.3c10,1.9,20.4,2.9,31.2,2.9c22.6,0,39.6-6,51.2-18.1c11.6-12.1,17.4-29.6,17.4-52.4v-53.9h4.8c-4.8,18.4-14.9,33.1-30.3,43.9c-15.4,10.8-33.4,16.2-54.1,16.2c-21.3,0-39.7-4.8-55.3-14.5c-15.6-9.7-27.6-23.3-36-40.8c-8.4-17.5-12.6-37.7-12.6-60.5s4.2-43,12.6-60.3c8.4-17.3,20.4-30.7,36-40.3c15.6-9.5,34-14.3,55.3-14.3c21,0,39.1,5.3,54.3,16c15.3,10.7,25.1,25,29.6,43.1h-4.3v-54.8h37.7v215c0,23.5-3.9,43.2-11.7,59.1c-7.8,15.9-19.5,27.8-35,35.8C2475.6,559.1,2456.4,563.1,2433.5,563.1z M2427.8,436.3c22.2,0,39.9-7.6,52.9-22.9c13-15.3,19.5-35.8,19.5-61.5c0-25.7-6.5-46.2-19.5-61.3c-13-15.1-30.7-22.6-52.9-22.6c-21.9,0-39.4,7.6-52.4,22.6c-13,15.1-19.5,35.5-19.5,61.3c0,25.7,6.5,46.2,19.5,61.5C2388.4,428.6,2405.9,436.3,2427.8,436.3z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M2605.6,183.6v-43.4h47.7v43.4H2605.6z M2610.4,473V241.3h38.6V473H2610.4z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M2813.9,477.3c-27.3,0-47.8-7.3-61.5-21.9c-13.7-14.6-20.5-35.4-20.5-62.4V271.3h-45.3v-30h45.3v-71h38.6v71h73.4v30h-73.4v117.7c0,18.1,3.8,31.9,11.4,41.2c7.6,9.4,20,14.1,37.2,14.1c5.1,0,10.2-0.6,15.3-1.9c5.1-1.3,9.7-2.5,13.8-3.8l6.7,29.6c-4.1,2.2-10.2,4.3-18.1,6.2C2828.8,476.3,2821.2,477.3,2813.9,477.3z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M2960.7,477.3c-15.9,0-30.1-3.1-42.7-9.3c-12.6-6.2-22.5-14.7-29.8-25.5c-7.3-10.8-11-22.9-11-36.2c0-17.2,4.4-30.7,13.1-40.5c8.7-9.8,23.2-16.8,43.4-21c20.2-4.1,47.7-6.2,82.7-6.2h21.5v25.3h-21c-19.4,0-35.6,0.6-48.6,1.9c-13,1.3-23.4,3.5-31,6.7c-7.6,3.2-13,7.3-16.2,12.4c-3.2,5.1-4.8,11.4-4.8,19.1c0,13,4.5,23.7,13.6,31.9c9.1,8.3,21.4,12.4,36.9,12.4c12.7,0,23.9-3,33.6-9.1c9.7-6,17.3-14.3,22.9-24.8c5.6-10.5,8.3-22.6,8.3-36.2v-54.3c0-19.7-4-33.9-11.9-42.7c-7.9-8.7-21-13.1-39.1-13.1c-14,0-27.5,2-40.5,6c-13,4-26.4,10.4-40,19.3l-13.3-28.1c8.3-5.7,17.6-10.7,28.1-15c10.5-4.3,21.5-7.5,32.9-9.8c11.4-2.2,22.4-3.3,32.9-3.3c20,0,36.5,3.3,49.6,9.8c13,6.5,22.7,16.4,29.1,29.6c6.4,13.2,9.5,30.1,9.5,50.8V473h-36.2v-53.9h4.3c-2.5,12.1-7.4,22.4-14.5,31c-7.2,8.6-16,15.3-26.5,20S2973.7,477.3,2960.7,477.3z" className="transition-all duration-1000" />
    <path fill={digitalFill} d="M3211.4,477.3c-23.5,0-41.2-7-53.2-21c-11.9-14-17.9-34-17.9-60.1V136.9h38.6v256.5c0,11.1,1.5,20.5,4.5,28.1c3,7.6,7.5,13.3,13.6,17.2c6,3.8,13.5,5.7,22.4,5.7c3.8,0,7.5-0.2,11.2-0.7c3.6-0.5,7.1-1.2,10.2-2.1l-1,32.4c-5.1,1-9.9,1.7-14.5,2.4C3220.9,476.9,3216.2,477.3,3211.4,477.3z" className="transition-all duration-1000" />
  </svg>
);

interface AnimatedLogoProps {
  className?: string;
  showText?: boolean;
}

export const AnimatedLogo = ({ className, showText = false }: AnimatedLogoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const v1Ref = useRef<HTMLImageElement>(null);
  const v2Ref = useRef<HTMLImageElement>(null);
  const v3Ref = useRef<HTMLImageElement>(null);
  
  const [colors, setColors] = useState(TEXT_COLORS[0]);

  useGSAP(() => {
    if (!containerRef.current) return;

    // On mobile: show only the first logo statically — no loop, no CPU cost
    const isMobile = window.innerWidth <= 768;
    const icons = [v1Ref.current, v2Ref.current, v3Ref.current];

    if (isMobile) {
      gsap.set(icons, { opacity: 0, zIndex: 1 });
      gsap.set(icons[0], { opacity: 1, zIndex: 5 });
      return;
    }

    const tl = gsap.timeline({ repeat: -1 });

    gsap.set(icons, { opacity: 0, zIndex: 1, scale: 1 });
    gsap.set(icons[0], { opacity: 1, zIndex: 5 });

    const smoothTransition = (fromIdx: number, toIdx: number) => {
      const from = icons[fromIdx];
      const to = icons[toIdx];

      // 8s pause (increased from 5s) — more stable, less CPU usage
      tl.to({}, { duration: 8 })
        .add(() => {
          gsap.set(to, { zIndex: 10, opacity: 0, scale: 0.95 });
        })
        .add(() => {
          setColors(TEXT_COLORS[toIdx as keyof typeof TEXT_COLORS]);
        })
        .to(to, { opacity: 1, scale: 1, duration: 2, ease: 'sine.inOut' })
        .to(from, { opacity: 0, scale: 1.05, duration: 2, ease: 'sine.inOut' }, '<')
        .add(() => {
          gsap.set(to, { zIndex: 5 });
          gsap.set(from, { zIndex: 1, opacity: 0 });
        });
    };

    smoothTransition(0, 1);
    smoothTransition(1, 2);
    smoothTransition(2, 0);

    // Pause GSAP loop when tab is hidden — saves CPU/GPU/battery
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tl.pause();
      } else {
        tl.resume();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={cn("flex items-center gap-4 h-full", className)}>
      <div className="relative h-full aspect-square flex-shrink-0">
        <img ref={v1Ref} src={logoV1} alt="V1" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
        <img ref={v2Ref} src={logoV2} alt="V2" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
        <img ref={v3Ref} src={logoV3} alt="V3" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
      </div>
      
      {showText && (
        <div className="flex items-center h-[45%] select-none overflow-hidden">
          <BrandTextSVG 
            tchovaFill={colors.tchova} 
            digitalFill={colors.digital} 
            className="h-full" 
          />
        </div>
      )}
    </div>
  );
};
