import { ArrowRight } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { ElitePulse, EliteRadar } from '@/components/ui/EliteIcons';

// Desktop: max quality + auto codec
const DESKTOP_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_auto:best,vc_auto/v1778250435/0508_xnt09o.mp4';
// Mobile: unified max quality (Cloudinary vc_auto serves optimized HEVC/VP9 which is smaller and smoother)
const MOBILE_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_auto:best,vc_auto/v1778250435/0508_xnt09o.mp4';
// Poster: high quality JPEG thumbnail for initial load
const POSTER_URL = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_jpg,q_auto:best,w_1080,so_0/v1778250435/0508_xnt09o.jpg';

// Detect mobile synchronously (safe for SSR: defaults to false, corrected in useEffect)
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

const ROTATING_WORDS = [
  'Design de Alto Impacto',
  'Marketing que Converte',
  'Sites & Apps Premium',
  'Audiovisual & Conteúdos',
  'Importação Assistida',
  'Painel Rental & GSM Mobile',
];

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const wordRef = useRef<HTMLDivElement>(null);

  // Lazy initializer — runs synchronously on first render so the correct src is in the DOM immediately
  const [isMobile] = useState(() => getIsMobile());
  const videoSrc = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;

  const heroRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelClipRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineClipRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  // iOS Safari autoplay fix: explicitly load + play after mount
  useEffect(() => {
    const video = video1Ref.current;
    if (!video) return;

    // Ensure attributes are set at DOM level (React sometimes misses these on iOS)
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;

    // Load the video and attempt to play
    const attemptPlay = () => {
      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was blocked (iOS restriction) — wait for user interaction
          const playOnTouch = () => {
            video.play().catch(() => {});
            document.removeEventListener('touchstart', playOnTouch);
            document.removeEventListener('click', playOnTouch);
          };
          document.addEventListener('touchstart', playOnTouch, { once: true, passive: true });
          document.addEventListener('click', playOnTouch, { once: true });
        });
      }
    };

    // Small delay to ensure the DOM is fully ready
    const timer = setTimeout(attemptPlay, 100);
    return () => clearTimeout(timer);
  }, [videoSrc]);

  // Rotating words cycle with seamless vertical scrolling
  useGSAP(() => {
    if (!wordRef.current) return;
    
    const totalWords = ROTATING_WORDS.length;
    const cloneCount = totalWords + 1; // Original + 1 clone
    const tl = gsap.timeline({ repeat: -1 });
    
    // Explicitly set initial state
    gsap.set(wordRef.current, { yPercent: 0 });
    
    for (let i = 0; i < totalWords; i++) {
      tl.to(wordRef.current, {
        yPercent: -(i + 1) * (100 / cloneCount),
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 2.5
      });
    }
    
    // Instantly reset to the beginning for a seamless loop
    tl.set(wordRef.current, { yPercent: 0 });
  }, { scope: heroRef });

  useGSAP(() => {
    if (!heroRef.current) return;

    // Detect low-end device: ≤2 CPU cores or ≤2GB RAM
    const isLowEnd =
      (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) ||
      ((navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory <= 2);

    const mm = gsap.matchMedia();

    // ─── DESKTOP / HIGH-END: Full cinematic experience ───────────────────────
    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 2 } });

      tl.fromTo(videoContainerRef.current,
        { scale: 1.05, filter: 'blur(4px)', opacity: 0 },
        { scale: 1.0, filter: 'blur(0px)', opacity: 1, duration: 2.5, ease: 'power2.out' }
      )
      .fromTo(labelRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.8 },
        '-=2.2'
      )
      .fromTo(headlineClipRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'expo.inOut' },
        '-=1.8'
      )
      .fromTo(headlineRef.current,
        { y: 120, skewY: 5, filter: 'blur(10px)', opacity: 0 },
        { y: 0, skewY: 0, filter: 'blur(0px)', opacity: 1, duration: 2.2 },
        '<'
      )
      .fromTo(subheadlineRef.current,
        { y: 30, opacity: 0, filter: 'blur(4px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8 },
        '-=1.4'
      )
      .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1.5 },
        '-=1.2'
      )
      .fromTo(scrollIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.5'
      );

      // Scroll line animation
      if (scrollLineRef.current) {
        gsap.fromTo(scrollLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true, transformOrigin: 'top center' }
        );
      }

      // Parallax scroll effect (disabled on low-end desktop)
      if (!isLowEnd) {
        gsap.fromTo(videoContainerRef.current,
          { scaleY: 1, scaleX: 1, opacity: 1 },
          { scaleY: 1.05, scaleX: 1.02, opacity: 0.8, ease: 'none',
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 2 } }
        );

        gsap.to(contentRef.current, {
          y: -100, scale: 0.95, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '70% top', scrub: 2 }
        });
      }
    });

    // ─── MOBILE: Lightweight version (no blur, no skew, no clipPath, no objectPosition animation) ─────────
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });

      // Video visible immediately — no filter animation
      gsap.set(videoContainerRef.current, { opacity: 1 });

      tl.fromTo(labelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo(headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.3'
      )
      .fromTo(subheadlineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        '-=0.3'
      );

      // Smooth, GPU-accelerated panning animation for mobile (replaces expensive objectPosition)
      gsap.to(videoContainerRef.current, {
        xPercent: 3, // Move 3% of the 110% width
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // No parallax on mobile — too expensive
    });

    // Scroll indicator hide/show (both mobile and desktop)
    gsap.to({}, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: '80 top',
        onEnter: () => setShowScrollIndicator(false),
        onLeaveBack: () => setShowScrollIndicator(true)
      }
    });

  }, { scope: heroRef });

  const openContactModal = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { serviceType: 'hero-cta', serviceData: { title: 'o seu Projeto Global', type: 'hero', requiresLogin: false } }
    }));
  }, []);

  const scrollToServices = useCallback(() => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('about') || document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="tech-hero relative overflow-hidden min-h-[85vh] md:min-h-[90vh] w-full flex items-center justify-center bg-black py-12 md:py-20"
    >
      {/* Layer 0 — Video Background Full Screen */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Background Atmosphere — mimics the video colors to avoid black bars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(74,222,128,0.05)_0%,transparent_50%)]" />
        
        <div 
          ref={videoContainerRef} 
          className="absolute top-0 h-full w-[110%] -left-[5%] will-change-transform bg-[#050505]"
        >
          {/* Fallback Static Atmosphere (Visible while video loads) */}
          {/* Fallback Static Atmosphere (Visible while video loads) — Hidden on mobile to ensure zero overlays */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-black via-primary/5 to-black z-[1]" />
          
          {/* Video: src set directly (not via conditional <source>) to ensure iOS sees content on mount */}
          <video
            ref={video1Ref}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            poster={POSTER_URL}
            className="absolute inset-0 w-full h-full object-cover object-[43%] md:object-[58%_50%] pointer-events-none"
            style={{
              filter: isMobile ? 'none' : 'brightness(1.1) contrast(1.1) saturate(1.1)',
              opacity: 1,
              zIndex: 2,
            }}
            onCanPlay={() => {
              if (videoContainerRef.current) {
                gsap.to(videoContainerRef.current, { opacity: 1, duration: 0.5 });
              }
            }}
          />
        </div>
      </div>

      {/* Localized Readability Gradient — Organic Diagonal Shadow Mask */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Desktop: Organic Diagonal Wedge (105deg) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-[linear-gradient(105deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.8)_40%,rgba(0,0,0,0.3)_60%,transparent_80%)] opacity-100" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}
        />
        
        {/* Mobile: Vertical Readability Gradient — Focused on text area, clearer at the top */}
        <div 
          className="md:hidden absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.8)_30%,rgba(0,0,0,0.8)_60%,transparent_95%)]" 
        />
      </div>

      {/* Layer 2 — Content */}
      <div 
        ref={contentRef} 
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-8 pt-24 md:pt-28 translate-y-0 md:-translate-y-10"
      >
        <div className="w-full md:max-w-[45%] flex flex-col items-center md:items-start text-center md:text-left gap-3 md:gap-8">


          {/* Futuristic Label Reveal */}
          <div ref={labelClipRef} className="overflow-hidden">
            <div ref={labelRef} className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-primary/50" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.4em] text-primary uppercase">
                Ecossistema 360° Digital & Técnico
              </span>
            </div>
          </div>

          {/* Headline — Monumental Typography */}
          <div ref={headlineClipRef} className="overflow-hidden py-4 -my-4 px-4 -mx-4">
            <h1
              ref={headlineRef}
              className="text-[10vw] sm:text-[8vw] md:text-[5.5vw] lg:text-[4.5vw] xl:text-[4vw] font-black tracking-tighter leading-[1] text-white uppercase drop-shadow-none md:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] break-words"
            >
              A máquina de<br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#4ade80] to-primary bg-[length:200%_auto] animate-gradient-x italic py-2 px-2 pr-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] text-[1.15em]">
                resultados
              </span><br />
              <span className="text-white/90">que não dorme.</span>
            </h1>
          </div>

          {/* Sub-headline / Hierarchy refinement */}
          <div
            ref={subheadlineRef}
            className="flex flex-col gap-2 md:gap-5 max-w-2xl text-center md:text-left"
          >
            <p className="text-lg md:text-xl text-white/50 italic border-l border-primary/30 pl-4 leading-relaxed">
              Pare de fragmentar o seu orçamento em soluções vazias.
            </p>

            <div className="text-base md:text-lg lg:text-xl text-white font-medium leading-[1.3] text-center md:text-left">
              O único ecossistema 360º{' '}
              <br />
              que funde{' '}
              <div className="inline-flex flex-col h-[1.3em] overflow-hidden align-middle translate-y-[-0.1em] text-[0.9em]">
                <div ref={wordRef} className="flex flex-col">
                  {[...ROTATING_WORDS, ROTATING_WORDS[0]].map((word, i) => (
                    <span 
                      key={i}
                      className="text-primary font-black uppercase tracking-tight whitespace-nowrap h-[1.3em] flex items-center justify-center md:justify-start"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              <br className="hidden md:block" />
              <span className="whitespace-nowrap text-lg md:text-xl lg:text-2xl">
                {' '}num fluxo{' '}
                <span className="inline-block text-primary font-black tracking-tighter bg-primary/10 border border-primary/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(34,197,94,0.2)] px-3 py-1 rounded-sm text-[1em] leading-none translate-y-[-0.05em] ring-1 ring-primary/10 border-l-2">
                  Hyper-Velocity 20x
                </span>.
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-center md:items-start gap-5 pt-4"
          >
            <MagneticButton
              onClick={openContactModal}
              variant="primary"
              className="group h-16 px-10 md:px-14 text-sm font-black tracking-[0.15em] bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 rounded-2xl uppercase whitespace-nowrap"
            >
              <span className="flex items-center gap-3 whitespace-nowrap">
                <ElitePulse className="w-5 h-5" />
                QUERO RESULTADOS
              </span>
            </MagneticButton>

            <button
              onClick={scrollToServices}
              className="group flex items-center gap-4 h-16 px-8 text-xs font-black tracking-[0.25em] text-white/40 hover:text-white transition-all duration-500 uppercase"
            >
              <span>VER SERVIÇOS</span>
              <div className="w-10 h-px bg-white/15 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white/30 group-hover:text-primary" />
            </button>
          </div>
        </div>

      </div>

      {/* Layer 3 — Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="hidden min-h-[700px]:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-700"
        style={{ opacity: showScrollIndicator ? 1 : 0, pointerEvents: showScrollIndicator ? 'auto' : 'none' }}
      >
        <button
          onClick={scrollToNextSection}
          className="group flex flex-col items-center gap-3 p-4"
          aria-label="Explorar serviços"
        >
          <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.5em] group-hover:text-primary/40 transition-colors duration-500">
            Explore
          </span>
          <div className="relative w-px h-12 bg-white/10 overflow-hidden rounded-full">
            <div
              ref={scrollLineRef}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary to-transparent origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;
