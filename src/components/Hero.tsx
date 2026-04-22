import { ArrowDown } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { TextLoop } from '@/components/ui/text-loop';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

const VIDEO_URL = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1776879315/0422_1_hnbyla.mp4';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  const heroRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const isFading = useRef(false);
  const hasLooped = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const dynamicGradientRef = useRef<HTMLDivElement>(null);
  const gradientSetter = useRef<gsap.QuickToFunc | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const velocityBadgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const loopingTextRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({
      onStart: () => setIsLoaded(true),
      defaults: { ease: 'power4.out', duration: 1.2 }
    });

    // 1. Entrance Sequence
    tl.fromTo(videoContainerRef.current, 
      { scale: 1.05, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 1.8, ease: 'power2.out' }
    )
    .fromTo(badgeRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1 },
      "-=1.2"
    )
    .fromTo(velocityBadgeRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.9"
    )
    .fromTo(headlineRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.8"
    )
    .fromTo(loopingTextRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.7"
    )
    .fromTo(descriptionRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.6"
    )
    .fromTo(ctaRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1 },
      "-=0.5"
    )
    .fromTo(scrollIndicatorRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.2"
    );

    // 2. Parallax Effects
    gsap.to(videoContainerRef.current, {
      y: (i, target) => {
        const height = target.offsetHeight;
        return height * 0.05; // Move only 5% to keep it subtle
      },
      scale: 1.05, // Slight scale to hide edges during parallax
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to(contentRef.current, {
      y: -50,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // We no longer use a GSAP timeline for dynamic scaling.
    // Pure mathematical synchronization is handled in the requestAnimationFrame loop below.
    // This guarantees perfect continuous sync during the crossfade loop.
    
    // Initialize highly optimized GSAP quickTo setter for buttery smooth gradient opacity tracking
    if (dynamicGradientRef.current) {
      gradientSetter.current = gsap.quickTo(dynamicGradientRef.current, "opacity", { duration: 0.5, ease: "power2.out" });
    }

    // Hide scroll indicator on scroll
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: '100 top',
      onEnter: () => setShowScrollIndicator(false),
      onLeaveBack: () => setShowScrollIndicator(true)
    });

  }, { scope: heroRef });

  const handleTimeUpdate = useCallback((currentRef: React.RefObject<HTMLVideoElement>, nextRef: React.RefObject<HTMLVideoElement>) => {
    const current = currentRef.current;
    const next = nextRef.current;
    const FADE_DURATION = 2.0; // 2.0 video seconds (at 0.65x speed this is ~3 real seconds)
    
    if (!current || !current.duration) return;

    // Trigger crossfade before the video ends
    if (current.duration - current.currentTime <= FADE_DURATION && !isFading.current) {
      isFading.current = true;
      hasLooped.current = true;
      
      if (next) {
        // next video is already at currentTime = 0 (reset in previous cycle)
        const playPromise = next.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => console.log("Play interrupted:", e));
        }
        
        const realFadeDuration = FADE_DURATION / (current.playbackRate || 1);
        
        // Cinematic crossfade with S-curve easing
        gsap.to(current, { opacity: 0, duration: realFadeDuration, ease: "power1.inOut" });
        gsap.to(next, { 
          opacity: 1, 
          duration: realFadeDuration, 
          ease: "power1.inOut",
          onComplete: () => {
            current.pause();
            current.currentTime = 0;
            isFading.current = false;
          }
        });
      }
    }
  }, []);

  // Set cinematic slow-motion for the videos
  useEffect(() => {
    const applyCinematicSpeed = (video: HTMLVideoElement | null) => {
      if (video) {
        video.playbackRate = 0.65; // Slow down to 65% speed
      }
    };
    
    applyCinematicSpeed(video1Ref.current);
    applyCinematicSpeed(video2Ref.current);
  }, []);

  // Sync the animation mathematically to the dominant video's playback time
  useEffect(() => {
    let animationFrameId: number;
    
    const updateSync = () => {
      // Determine which video is currently driving the visuals
      let driver = video1Ref.current;
      const v1Opacity = parseFloat(video1Ref.current?.style.opacity || '1');
      const v2Opacity = parseFloat(video2Ref.current?.style.opacity || '0');
      
      if (video2Ref.current && v2Opacity > v1Opacity) {
        driver = video2Ref.current;
      }

      if (driver && driver.duration && dynamicGradientRef.current) {
        const time = driver.currentTime;
        const duration = driver.duration;
        const FADE_DURATION = 2.0;

        let progress = 0;
        
        if (time >= 4.0 && time < (duration - FADE_DURATION)) {
            // Darkening phase: 4.0s to 6.0s
            const p = (time - 4.0) / 2.0;
            progress = Math.min(Math.max(p, 0), 1);
        } else if (time >= (duration - FADE_DURATION)) {
            // Reverting phase 1: Old video fading out
            const p = (time - (duration - FADE_DURATION)) / FADE_DURATION;
            progress = 1 - Math.min(Math.max(p, 0), 1);
        } else if (time <= FADE_DURATION && hasLooped.current) {
            // Reverting phase 2: New video fading in
            // Mathematically matches the exact handover point, safely ignores initial load
            const p = time / FADE_DURATION;
            progress = 1 - Math.min(Math.max(p, 0), 1);
        } else {
            // Neutral state
            progress = 0;
        }

        // Apply sine.inOut easing manually for cinematic motion
        const easeProgress = -(Math.cos(Math.PI * progress) - 1) / 2;

        // Modern Contrast Optimization (replaces moving the text)
        // Fades in a dark gradient directly behind the text to guarantee
        // maximum legibility without physically moving UI elements.
        const opacity = 0.4 * easeProgress; // Subtle 40% opacity at peak
        
        // Use GSAP's quickTo for buttery smooth interpolated tracking
        if (gradientSetter.current) gradientSetter.current(opacity);
      }
      
      animationFrameId = requestAnimationFrame(updateSync);
    };
    
    updateSync();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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

  return (
    <section
      ref={heroRef}
      id="home"
      className="tech-hero relative overflow-hidden h-[100dvh] w-full flex items-center justify-start pt-16"
    >
      {/* Background Video with Parallax & Seamless Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={videoContainerRef} className="absolute inset-0 w-full h-full will-change-transform" style={{ opacity: 0 }}>
          <video
            ref={video1Ref}
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleTimeUpdate(video1Ref, video2Ref)}
            poster="https://res.cloudinary.com/dwlfwnbt0/video/upload/so_0/v1776879315/0422_1_hnbyla.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.8) contrast(1.1) saturate(0.9) blur(0.4px)', opacity: 1, zIndex: 1 }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          
          <video
            ref={video2Ref}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleTimeUpdate(video2Ref, video1Ref)}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.8) contrast(1.1) saturate(0.9) blur(0.4px)', opacity: 0, zIndex: 2 }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </div>

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        
        {/* Dynamic Collision Avoidance Gradient */}
        {/* Responsive gradient: centered on mobile for full-width text, isolated to the left on desktop */}
        <style>{`
          .dynamic-collision-gradient {
            background: radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0.7) 0%, transparent 80%);
          }
          @media (min-width: 768px) {
            .dynamic-collision-gradient {
              background: radial-gradient(ellipse 45% 80% at 15% 50%, rgba(0,0,0,0.8) 0%, transparent 100%);
            }
          }
        `}</style>
        <div 
          ref={dynamicGradientRef}
          className="absolute inset-0 z-10 pointer-events-none dynamic-collision-gradient"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Main Content - Left Aligned */}
      <div ref={contentRef} className="container relative z-20 mx-auto px-5 sm:px-6 lg:px-12">
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-[60%] xl:max-w-[55%] flex flex-col gap-3 sm:gap-4">
          
          {/* Badges - Grouped together */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-green-400/10 border border-green-400/30">
              <span className="text-[11px] sm:text-xs font-bold text-green-400">Ecossistema 360° Digital & Técnico</span>
            </div>
            
            <div ref={velocityBadgeRef} className="inline-flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                 Hyper-Velocity <span className="text-primary">20x</span>
               </span>
            </div>
          </div>

          <h1 
            ref={headlineRef}
            className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] xl:text-[56px] font-extrabold tracking-[-0.02em] leading-[1.05] text-white text-balance max-w-3xl"
          >
            <span className="text-[0.65em] font-bold text-white/80 block mb-2" style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 4px 20px, rgba(0, 0, 0, 0.6) 0px 2px 8px' }}>Acelere o seu negócio.</span>
            <span className="text-primary" style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 4px 20px, rgba(0, 0, 0, 0.6) 0px 2px 8px' }}>
              A máquina de<br />
              <span className="text-[1.25em] leading-[0.9] inline-block py-1">resultados</span>
            </span>
            <br />
            <span style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 4px 20px, rgba(0, 0, 0, 0.6) 0px 2px 8px' }}>que não dorme.</span>
          </h1>

          {/* Rotating Text - Services by Category */}
          <div 
            ref={loopingTextRef}
            className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[26px] font-bold text-white/90 leading-[1.2]"
          >
            <TextLoop interval={3} transition={{ duration: 0.4 }}>
              <span>Dominamos o Digital</span>
              <span>Engenharia Web de Elite</span>
              <span>Tráfego que Converte</span>
              <span>Audiovisual Futurista</span>
              <span>Importação Inteligente</span>
              <span>Suporte GSM Avançado</span>
            </TextLoop>
          </div>

          {/* Short Subheadline */}
          <p 
            ref={descriptionRef}
            className="text-[14px] sm:text-[15px] lg:text-[16px] text-white/80 font-medium max-w-[95%] md:max-w-md lg:max-w-lg leading-snug sm:leading-relaxed"
          >
            Pare de fragmentar o seu orçamento em soluções que não conversam. O único <span className="font-bold text-white">ecossistema 360º</span> que funde design, tecnologia e performance num <span className="font-bold text-primary">fluxo de vendas imbatível</span>.
          </p>

          {/* CTA Buttons */}
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row justify-start items-stretch sm:items-start gap-2.5 sm:gap-3 pt-2"
          >
            <MagneticButton
              onClick={openContactModal}
              variant="primary"
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-6 text-[14px] sm:text-base"
            >
              Começar agora
            </MagneticButton>

            <MagneticButton
              onClick={scrollToServices}
              variant="secondary"
              className="w-full sm:w-auto min-h-[44px] sm:min-h-[48px] px-6 text-[14px] sm:text-base bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-none"
            >
              Ver Serviços
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        style={{ display: showScrollIndicator ? 'block' : 'none' }}
      >
        <button
          onClick={scrollToServices}
          className="group flex flex-col items-center space-y-1 p-2 rounded-full hover:bg-white/10 transition-all duration-300"
          aria-label="Ver serviços"
        >
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1 group-hover:border-white/60 transition-colors">
            <div className="w-0.5 h-2 bg-white/60 rounded-full animate-pulse" />
          </div>
          <ArrowDown className="w-3 h-3 text-white/40" />
        </button>
      </div>
    </section>
  );
};

export default Hero;

