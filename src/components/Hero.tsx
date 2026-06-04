import { ArrowRight } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { ElitePulse, EliteRadar } from '@/components/ui/EliteIcons';

// Background URL (can be video or image)
const DESKTOP_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.webm';
const MOBILE_VIDEO = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.mp4';
// Detect mobile synchronously (safe for SSR: defaults to false, corrected in useEffect)
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

const ROTATING_WORDS = [
  'DESIGN',
  'WEB',
  'MARKETING',
  'VÍDEO',
  'GSM MOBILE TOOLS',
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
  const video2Ref = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelClipRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineClipRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);

  // Reference to keep track of fading state to avoid overlapping triggers
  const isFadingRef = useRef(false);

  // Seamless looping mechanism for video backgrounds
  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2 || isMobile || !videoSrc.includes('video/')) return;

    const FADE_DURATION = 0.5; // crossfade duration in seconds

    const handleTimeUpdate = (e: Event) => {
      const active = e.target as HTMLVideoElement;
      const inactive = active === v1 ? v2 : v1;

      // Start crossfade before the active video ends
      if (active.duration && active.currentTime >= active.duration - FADE_DURATION && !isFadingRef.current) {
        isFadingRef.current = true;
        
        // Prepare and play the inactive video
        inactive.currentTime = 0;
        const playPromise = inactive.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }

        // Crossfade using GSAP
        gsap.to(active, { opacity: 0, duration: FADE_DURATION });
        gsap.to(inactive, { opacity: 1, duration: FADE_DURATION, onComplete: () => {
          active.pause();
          active.currentTime = 0;
          isFadingRef.current = false;
        }});
      }
    };

    v1.addEventListener('timeupdate', handleTimeUpdate);
    v2.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      v1.removeEventListener('timeupdate', handleTimeUpdate);
      v2.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoSrc]);

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

    // Small delay to ensure the DOM is fully ready — longer on mobile to let entry animations paint first without blocking
    const delay = isMobile ? 800 : 150;
    const timer = setTimeout(attemptPlay, delay);
    return () => clearTimeout(timer);
  }, [videoSrc, isMobile]);

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

    // ─── DESKTOP / HIGH-END: Full cinematic 3D experience ────────────────────
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

      // Scroll line animation
      if (scrollLineRef.current) {
        gsap.fromTo(scrollLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true, transformOrigin: 'top center' }
        );
      }

      // Parallax smooth scroll effect (No stretching, uniform scaling)
      if (!isLowEnd) {
        // Uniform zoom & fade out of background video on scroll
        gsap.fromTo(videoContainerRef.current,
          { scale: 1.0, yPercent: 0, opacity: 1 },
          { scale: 1.08, yPercent: 8, opacity: 0.6, ease: 'none',
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true } }
        );

        // Crisp, elegant vertical translation & fade of hero content (No 3D distortion/stretching of text)
        gsap.to(contentRef.current, {
          y: -100, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: true }
        });
      }
    });

    // ─── TABLET: Moderate animations, reduced 3D ─────────────────────────────
    mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.5 } });

      tl.fromTo(videoContainerRef.current,
        { scale: 1.02, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 2, ease: 'power2.out' }
      )
      .fromTo(labelRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.5')
      .fromTo(headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5 },
        '<'
      )
      .fromTo(subheadlineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=1.0')
      .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1.0 },
        '-=0.8'
      );

      // Light 2D Parallax
      if (!isLowEnd) {
        gsap.to(contentRef.current, {
          y: -80, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '60% top', scrub: true }
        });
      }
    });

    // ─── MOBILE: Ultra-lightweight version ─────────
    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.4 } });

      // Ensure immediate visibility
      gsap.set([videoContainerRef.current, labelRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current?.children ? Array.from(ctaRef.current.children) : []], { opacity: 1, y: 0 });

      // Ultra-fast entrance to avoid "missing content" lag
      tl.from(headlineRef.current, { y: 20, opacity: 0, duration: 0.4 })
        .from(subheadlineRef.current, { y: 10, opacity: 0, duration: 0.3 }, '-=0.2');

      // Video scale animation disabled on mobile
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
      className="tech-hero relative overflow-hidden w-full min-h-[100svh] flex items-center justify-center bg-background"
    >
      {/* Layer 0 — Video Background Full Screen */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* Background Atmosphere — mimics the video colors to avoid black bars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(74,222,128,0.05)_0%,transparent_50%)]" />
        
        {/* Mobile Background Effects - REMOVED FOR PERFORMANCE 
            (Nebula and floating orbs were draining mobile GPU and causing freeze on scroll) */}
        <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none opacity-0" />
        
        <div 
          ref={videoContainerRef} 
          className="absolute top-0 left-0 w-full h-[70%] md:h-full overflow-hidden will-change-transform bg-transparent"
        >
          {/* Fallback Static Atmosphere (Visible while video loads) */}
          {/* Fallback Static Atmosphere — removed dark overlay, kept only for mobile poster fallback */}
          
          {/* Background Media: support both video and image */}
          {videoSrc.includes('.mp4') || videoSrc.includes('.webm') || videoSrc.includes('/video/') ? (
            <>
              <video
                ref={video1Ref}
                src={videoSrc}
                muted
                playsInline
                loop={true}
                preload={isMobile ? "none" : "auto"}
                autoPlay={true}
                poster="https://res.cloudinary.com/dwlfwnbt0/video/upload/v1779730814/hero_4_texture-lab-desfoque_nas_ll_kd9shf.jpg"
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
              {!isMobile && (
                <video
                  ref={video2Ref}
                  src={videoSrc}
                  muted
                  playsInline
                  preload="auto"
                  autoPlay={true}
                  className="absolute inset-0 w-full h-full object-cover object-[68%] md:object-[58%_50%] pointer-events-none"
                  style={{
                    filter: isMobile ? 'none' : 'brightness(1.1) contrast(1.1) saturate(1.1)',
                    opacity: 0,
                    zIndex: 3,
                  }}
                />
              )}
            </>
          ) : (
            <img
              ref={video1Ref as any}
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover object-[68%] md:object-[58%_50%] pointer-events-none"
              style={{
                filter: isMobile ? 'none' : 'brightness(1.1) contrast(1.1) saturate(1.1)',
                opacity: 1,
                zIndex: 2,
              }}
              onLoad={() => {
                if (videoContainerRef.current) {
                  gsap.to(videoContainerRef.current, { opacity: 1, duration: 0.5 });
                }
              }}
              alt="Tchova Digital Hero Background"
            />
          )}
          
          {/* Bottom Gradient Fade — blends the video seamlessly into the theme background */}
          {/* Mobile: very tall ultra-smooth fade — eliminates any visible edge */}
          <div 
            className="block md:hidden absolute bottom-0 left-0 w-full z-[5] pointer-events-none"
            style={{
              height: '60%',
              background: 'linear-gradient(to top, #1a1d1b 0%, #1a1d1b 10%, rgba(26,29,27,0.95) 20%, rgba(26,29,27,0.7) 40%, rgba(26,29,27,0.3) 60%, rgba(26,29,27,0.08) 80%, transparent 100%)',
            }}
          />
          {/* Desktop: original subtle fade */}
          <div className="hidden md:block absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background via-background/60 to-transparent z-[5] pointer-events-none" />
        </div>
      </div>

      {/* Localized Readability Gradient — Shaped overlay behind text content only */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Desktop Layer 1: Left-to-right gradient — covers headline & badge area */}
        <div 
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(8,12,10,0.92) 0%, rgba(8,12,10,0.78) 25%, rgba(8,12,10,0.45) 42%, rgba(8,12,10,0.15) 55%, transparent 65%)',
          }}
        />
        {/* Desktop Layer 2: Bottom-left radial — reinforces CTA & subheadline zone */}
        <div 
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 15% 85%, rgba(8,12,10,0.8) 0%, rgba(8,12,10,0.4) 40%, transparent 70%)',
          }}
        />
      </div>

      <div 
        ref={contentRef} 
        className="relative z-20 w-full max-w-7xl mx-auto px-fluid-md flex flex-col items-center md:items-start justify-end md:justify-start gap-fluid-md pt-[clamp(52svh,54svh,56svh)] md:pt-[150px] lg:pt-[20vh] xl:pt-[24vh] pb-16 md:pb-0 translate-y-0 md:-translate-y-6"
      >
        <div className="w-fit max-w-[94%] xs:max-w-[90%] sm:max-w-[80%] md:w-full md:max-w-[70%] lg:max-w-[55%] flex flex-col items-start text-left gap-6 md:gap-8 mx-auto md:mx-0">


          {/* Badge with rotating — Gravyx pattern */}
          <div ref={labelClipRef} className="w-full flex justify-start pl-2 -ml-2">
            <div ref={labelRef} className="flex items-center justify-start gap-3">
              <div className="w-8 h-[1px] bg-primary/50" />
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-primary uppercase flex flex-wrap items-center gap-y-1 gap-x-2 justify-start">
                SOLUÇÕES EM
                <span className="inline-flex h-[1.2em] overflow-hidden relative align-bottom w-[140px] sm:w-[150px] md:w-[220px] tracking-normal justify-start">
                  <span ref={wordRef} className="flex flex-col absolute top-0 left-0 w-full text-left">
                    {ROTATING_WORDS.map((word, i) => (
                      <span key={i} className="h-[1.2em] text-white font-black whitespace-nowrap text-left">{word}</span>
                    ))}
                    <span className="h-[1.2em] text-white font-black whitespace-nowrap text-left">{ROTATING_WORDS[0]}</span>
                  </span>
                </span>
              </span>
            </div>
          </div>

          {/* Headline — Value Proposition */}
          <div ref={headlineClipRef} className="py-4 -my-4 px-4 -mx-4 w-full flex justify-start">
            <h1
              ref={headlineRef}
              className="text-[clamp(1.9rem,9.8vw,3.6rem)] md:text-[clamp(1.8rem,3.8vw,3.5rem)] font-black tracking-tighter leading-[1] text-white uppercase drop-shadow-none md:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-left w-full whitespace-nowrap flex flex-col pr-2"
            >
              <span className="text-[0.57em] md:text-[0.62em] font-extrabold tracking-normal text-white/90 mb-[-0.1em]">
                COLOCA O TEU NEGÓCIO
              </span>
              <span className="font-bebas font-bold inline-block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#4ade80] to-primary bg-[length:200%_auto] animate-gradient-x italic py-0 px-0 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] text-left leading-[1]">
                EM MOVIMENTO.
              </span>
            </h1>
          </div>

          {/* Sub-headline — Explainer */}
          <div
            ref={subheadlineRef}
            className="flex flex-col gap-3 md:gap-5 max-w-2xl text-left items-start w-full"
          >
            <div className="text-[clamp(12px,3.8vw,16px)] md:text-fluid-p text-white/70 font-medium leading-[1.5] md:leading-[1.4] w-full max-w-3xl text-left tracking-tight md:tracking-normal">
              Do <span className="text-white font-semibold">visual</span> que apresenta a tua empresa às <span className="text-primary font-bold">ferramentas</span><br className="hidden md:block" /> que fazem o trabalho acontecer.
            </div>
            <div className="text-[clamp(12px,3.8vw,16px)] md:text-fluid-p text-white/70 font-medium leading-[1.5] md:leading-[1.4] w-full max-w-3xl text-left tracking-tight md:tracking-normal mt-1">
              <span className="text-white font-semibold">Design, Web, Marketing, Vídeo e GSM</span> num <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-4">único ecossistema</span>.
            </div>
          </div>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-start gap-5 pt-4 w-full sm:w-auto justify-start relative"
          >
            {/* Mobile subtle CTA glow — no blur, just a soft radial shadow */}
            <div className="block md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] z-[-1] pointer-events-none rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.08) 0%, transparent 70%)' }} />
            <MagneticButton
              onClick={openContactModal}
              variant="primary"
              className="group h-[54px] xs:h-[58px] md:h-16 px-8 xs:px-10 md:px-14 text-[clamp(12px,3.4vw,13.5px)] md:text-sm font-black tracking-[0.15em] bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 rounded-xl md:rounded-2xl uppercase whitespace-nowrap"
            >
              <span className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                <ElitePulse className="w-4 h-4 md:w-5 md:h-5" />
                FALA CONNOSCO AGORA
              </span>
            </MagneticButton>

            {/* Desktop: Original minimalist text+arrow style */}
            <button
              onClick={scrollToServices}
              className="hidden md:flex group items-center justify-center gap-4 h-16 px-8 text-xs font-black tracking-[0.25em] text-white/40 hover:text-white transition-all duration-500 uppercase"
            >
              <span>O QUE FAZEMOS</span>
              <div className="w-10 h-px bg-white/15 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
              <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white/30 group-hover:text-primary" />
            </button>
          </div>
        </div>

      </div>

      {/* Layer 3 — Scroll Indicator (Visible on mobile & desktop) */}
      <div
        ref={scrollIndicatorRef}
        className="flex absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-700"
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
