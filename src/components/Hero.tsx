import { ArrowRight } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsapConfig";
import { ElitePulse, EliteRadar } from '@/components/ui/EliteIcons';
import { isLowEnd, isSlowNetwork } from '@/hooks/useLowEnd';

const DESKTOP_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_82/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.webm';
const MOBILE_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_82/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.mp4';
// Detect mobile synchronously (safe for SSR: defaults to false, corrected in useEffect)
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

const ROTATING_WORDS = [
  'SER ENCONTRADO',
  'SER ESCOLHIDO',
  'GANHAR CONFIANÇA',
  'CHEGAR MAIS LONGE',
  'FORTALECER A TUA MARCA',
  'CONQUISTAR CLIENTES',
  'TRABALHAR MELHOR',
];


const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const wordRef = useRef<HTMLDivElement>(null);

  // Lazy initializer — runs synchronously on first render so the correct src is in the DOM immediately
  const [isMobile] = useState(() => getIsMobile());
  const videoSrc = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;

  const heroRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelClipRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineClipRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  // Callback ref to guarantee play and attach intersection observer on mount
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;
    video1Ref.current = node;

    const attemptPlay = () => {
      node.play().catch(() => {
        const playOnInteraction = () => {
          node.play().catch(() => {});
          window.removeEventListener('click', playOnInteraction);
          window.removeEventListener('touchstart', playOnInteraction);
        };
        window.addEventListener('click', playOnInteraction);
        window.addEventListener('touchstart', playOnInteraction);
      });
    };

    attemptPlay();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.play().catch(() => {});
        } else {
          node.pause();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Rotating words cycle — only on capable devices
  useGSAP(() => {
    if (!wordRef.current || isLowEnd) return;
    
    const totalWords = ROTATING_WORDS.length;
    const cloneCount = totalWords + 1;
    const tl = gsap.timeline({ repeat: -1 });
    
    gsap.set(wordRef.current, { yPercent: 0 });
    
    for (let i = 0; i < totalWords; i++) {
      tl.to(wordRef.current, {
        yPercent: -(i + 1) * (100 / cloneCount),
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 2.5
      });
    }
    
    tl.set(wordRef.current, { yPercent: 0 });
  }, { scope: heroRef });

  useGSAP(() => {
    if (!heroRef.current) return;

    // LOW-END: Zero GSAP. Content visible immediately.
    if (isLowEnd) {
      // Just make everything visible with no animation cost
      [videoContainerRef, labelRef, headlineClipRef, headlineRef, subheadlineRef, scrollIndicatorRef].forEach(ref => {
        if (ref.current) gsap.set(ref.current, { opacity: 1, y: 0, clearProps: 'clipPath,rotateX,transformPerspective,skewY,scale,filter' });
      });
      if (ctaRef.current?.children) {
        gsap.set(Array.from(ctaRef.current.children), { opacity: 1, y: 0 });
      }
      return; // No ScrollTrigger, no timelines, no parallax
    }

    const mm = gsap.matchMedia();

    // ─── DESKTOP: Full cinematic experience ────────────────────
    mm.add('(min-width: 1024px)', () => {
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
        { y: 120, skewY: 5, rotateX: -20, transformPerspective: 1000, filter: 'blur(10px)', opacity: 0 },
        { y: 0, skewY: 0, rotateX: 0, filter: 'blur(0px)', opacity: 1, duration: 2.2 },
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

      if (scrollLineRef.current) {
        gsap.fromTo(scrollLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true, transformOrigin: 'top center' }
        );
      }

      // Parallax — desktop only
      gsap.fromTo(videoContainerRef.current,
        { scale: 1.0, yPercent: 0, opacity: 1 },
        { scale: 1.08, yPercent: 8, opacity: 0.6, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } }
      );
      gsap.to(contentRef.current, {
        y: -100, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: true }
      });
    });

    // ─── TABLET: Moderate ─────────────────────────────
    mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });
      tl.fromTo(videoContainerRef.current, { scale: 1.02, opacity: 0 }, { scale: 1.0, opacity: 1, duration: 2, ease: 'power2.out' })
      .fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.5')
      .fromTo(headlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5 }, '<')
      .fromTo(subheadlineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.0')
      .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
        { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1.0 }, '-=0.8'
      );
    });

    // ─── MOBILE (not low-end): Simple fade-in only, no 3D transforms ─────────
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.8 } });

      // Simple opacity fade — no scale, no rotateX, no clipPath, no transformPerspective
      tl.fromTo(videoContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0 }
      )
      .fromTo(labelRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.6')
      .fromTo(headlineRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
      .fromTo(subheadlineRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
      .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
        { y: 10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 }, '-=0.3'
      );
      // NO scroll parallax on mobile. NO video panning. Saves CPU.
    });

    // Scroll indicator hide/show
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
      className="relative min-h-[100svh] md:min-h-screen md:h-screen w-full flex items-end md:items-center justify-center overflow-hidden bg-[#1a1d1b]"
    >
      {/* Layer 0 — Video Background Full Screen */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* Background Atmosphere — mimics the video colors to avoid black bars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(74,222,128,0.05)_0%,transparent_50%)]" />
        
        <div 
          ref={videoContainerRef} 
          className="absolute top-0 left-0 w-full h-[clamp(300px,52svh,500px)] [@media(max-height:720px)]:h-[clamp(260px,44svh,320px)] md:h-full overflow-hidden will-change-transform origin-top bg-background [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)] md:[mask-image:none]"
        >
          {/* Background Media: support both video and image */}
          {isSlowNetwork || isLowEnd ? (
            <img
              ref={video1Ref as React.RefObject<HTMLImageElement>}
              src="https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_auto,w_1000/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.jpg"
              className="absolute top-0 left-0 w-full h-full object-cover object-center md:object-[58%_50%] pointer-events-none"
              style={{ opacity: 1, zIndex: 1, transform: 'translateZ(0)' }}
              alt="Tchova Digital"
              loading="eager"
            />
          ) : (
            <>
              {/* Fallback Poster Image */}
              <img
                src="https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_auto,w_1000/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.jpg"
                className="absolute top-0 left-0 w-full h-full object-cover object-center md:object-[58%_50%] pointer-events-none z-[1]"
                alt="Tchova Digital Hero Fallback"
              />

              {/* Native Hardware-Accelerated Video */}
              <video
                ref={videoRef}
                src={videoSrc}
                muted
                playsInline
                loop
                autoPlay
                disablePictureInPicture
                disableRemotePlayback
                preload="auto"
                poster="https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_auto,w_1000/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.jpg"
                className="absolute top-0 left-0 w-full h-full object-cover object-center md:object-[58%_50%] pointer-events-none z-[2]"
                style={{
                  transform: 'translateZ(0)',
                }}
              />
              {/* Pro Dev: Hardware-accelerated contrast overlay instead of expensive CSS filters on video */}
              {!isMobile && (
                <div className="absolute inset-0 z-[3] pointer-events-none mix-blend-overlay bg-white/5" />
              )}
            </>
          )}

          {/* Bottom Gradient Fade — subtle fade for all screens */}
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background via-background/60 to-transparent z-[5] pointer-events-none" />
        </div>
      </div>

      {/* Localized Readability Gradient — Shaped overlay behind text content only */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Desktop Layer: Smooth dark gradient reading zone on the left (No CSS Blur since video is naturally blurred) */}
        <div 
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(8,12,10,0.95) 0%, rgba(8,12,10,0.85) 30%, rgba(8,12,10,0.4) 48%, rgba(8,12,10,0.05) 60%, transparent 70%)',
          }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-[5vw] sm:px-[6vw] md:px-fluid-md flex flex-col items-start justify-end md:justify-start gap-fluid-md pt-[4svh] md:pt-[150px] lg:pt-[20vh] xl:pt-[24vh] pb-[max(60px,10svh)] md:pb-0 translate-y-0 md:-translate-y-6"
      >
        <div className="w-full flex flex-col items-center md:items-start text-center md:text-left gap-4 xs:gap-5 md:gap-8 md:max-w-[75%] lg:max-w-[50%] xl:max-w-[38%]">

          {/* Badge with rotating — Gravyx pattern */}
          <div ref={labelClipRef} className="w-full flex justify-center md:justify-start pl-0">
            <div ref={labelRef} className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 w-full md:w-auto text-center md:text-left">
              <span className="text-[#4ade80] font-black text-[clamp(9px,2.8vw,13px)] md:text-[11px] tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.2em] uppercase leading-none md:leading-normal whitespace-nowrap">
                TUDO O QUE PRECISAS PARA
              </span>
              <span className="inline-flex h-[1.5em] md:h-[14px] overflow-hidden relative w-full md:w-[180px] tracking-normal text-[clamp(9px,2.8vw,13px)] md:text-[11px] justify-center md:justify-start mt-1 md:mt-0">
                <span ref={wordRef} className="flex flex-col absolute top-0 left-0 w-full items-center md:items-start">
                  {ROTATING_WORDS.map((word, i) => (
                    <span key={i} className="h-[1.5em] md:h-[14px] flex items-center justify-center md:justify-start text-[#eff3c5] font-black whitespace-nowrap text-center md:text-left leading-none w-full">{word}</span>
                  ))}
                  <span className="h-[1.5em] md:h-[14px] flex items-center justify-center md:justify-start text-[#eff3c5] font-black whitespace-nowrap text-center md:text-left leading-none w-full">{ROTATING_WORDS[0]}</span>
                </span>
              </span>
            </div>
          </div>

          {/* Headline — Value Proposition */}
          <div ref={headlineClipRef} className="py-1 md:py-4 -my-1 md:-my-4 md:pl-8 md:-ml-8 md:pr-4 md:-mr-4 w-full flex justify-center md:justify-start">
            <h1
              ref={headlineRef}
              className="tracking-tighter leading-[0.92] md:leading-[1.05] text-left w-auto flex flex-col items-start font-medium text-[clamp(1.8rem,14.5vw,7rem)] md:text-[clamp(3.5rem,5vw,4.5rem)] text-[#f8f9fa] uppercase whitespace-nowrap"
            >
              <span className="italic">A FORÇA</span>
              <span className="italic">
                QUE <span className="text-[#4ade80]">MOVE</span>
              </span>
              <span className="mt-1 md:mt-2 text-[clamp(1.2rem,10.5vw,5rem)] md:text-[clamp(2.5rem,3.5vw,3.2rem)] font-bold">
                O TEU <span className="text-[#4ade80]">NEGÓCIO</span>
              </span>
            </h1>
          </div>

          {/* Sub-headline — Explainer */}
          <div
            ref={subheadlineRef}
            className="flex flex-col gap-3 md:gap-5 max-w-2xl items-center md:items-start w-full mt-3 xs:mt-4 md:mt-4 px-1 md:px-0"
          >
            <div className="text-[clamp(13px,3.8vw,18px)] md:text-fluid-p text-[#eff3c5]/80 font-medium leading-[1.5] w-full max-w-3xl text-center md:text-left tracking-tight md:tracking-normal">
              Do design que justifica o teu preço à estratégia que atrai clientes todos os dias: <span className="text-[#eff3c5] font-semibold">integramos a engrenagem</span> completa para fazer o teu negócio <span className="text-[#eff3c5] font-bold decoration-primary decoration-2 underline underline-offset-4">tchovar</span>.
            </div>
          </div>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row sm:flex-wrap items-center md:items-start justify-center md:justify-start gap-3 md:gap-4 pt-4 xs:pt-5 md:pt-4 w-full relative"
          >
            {/* Mobile subtle CTA glow removed to avoid harsh shadows/cuts */}
            <MagneticButton
              onClick={openContactModal}
              variant="primary"
              className="group w-full sm:w-max shrink-0 h-[56px] xs:h-[58px] md:h-16 px-8 xs:px-10 md:px-14 text-[12px] xs:text-[13px] md:text-sm font-black tracking-[0.15em] bg-gradient-to-r from-white to-white text-black hover:from-primary hover:to-primary hover:text-white transition-all duration-500 rounded-xl md:rounded-2xl uppercase border border-white/10"
              style={{ WebkitTextFillColor: 'black' }}
            >
              <ElitePulse glow={false} className="w-4 h-4 md:w-5 md:h-5 shrink-0" style={{ stroke: 'black' }} />
              <span className="whitespace-nowrap">INICIAR O MEU PROJETO</span>
            </MagneticButton>

            {/* Desktop: Original minimalist text+arrow style */}
            <button
              onClick={scrollToServices}
              className="hidden md:flex group items-center justify-center gap-4 h-16 px-8 text-xs font-black tracking-[0.25em] text-white/40 hover:text-white transition-all duration-500 uppercase shrink-0"
            >
              <span>VER COMO FUNCIONA</span>
              <div className="w-10 h-px bg-white/15 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white/30 group-hover:text-primary" />
            </button>
          </div>
        </div>

      </div>

      {/* Layer 3 — Scroll Indicator (Visible on mobile & desktop) */}
      <div
        ref={scrollIndicatorRef}
        className="flex absolute bottom-3 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-700"
        style={{ opacity: showScrollIndicator ? 1 : 0, pointerEvents: showScrollIndicator ? 'auto' : 'none' }}
      >
        <button
          onClick={scrollToNextSection}
          className="group flex flex-col items-center gap-2 md:gap-3 p-2 md:p-4"
          aria-label="Explorar serviços"
        >
          <span className="text-[8px] md:text-[9px] font-black text-white/15 uppercase tracking-[0.4em] md:tracking-[0.5em] group-hover:text-primary/40 transition-colors duration-500">
            Explore
          </span>
          <div className="relative w-px h-6 md:h-12 bg-white/10 overflow-hidden rounded-full">
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