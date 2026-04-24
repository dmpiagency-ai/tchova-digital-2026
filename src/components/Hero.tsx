import { ArrowRight } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { ElitePulse } from '@/components/ui/EliteIcons';

const VIDEO_URL = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1776938788/0422_1_3_1_emhog3.mp4';

const Hero = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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

  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out', duration: 2 }
    });

    // 1. Video entrance — cinematic scale-down
    tl.fromTo(videoContainerRef.current,
      { scale: 1.1, filter: 'blur(8px)', opacity: 0 },
      { scale: 1.0, filter: 'blur(0px)', opacity: 1, duration: 3, ease: 'power2.out' }
    )
    // 2. Futuristic Label — Reveal
    .fromTo(labelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.8 },
      "-=2.2"
    )
    // 3. Headline — Reveal
    .fromTo(headlineClipRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 2, ease: 'expo.inOut' },
      "-=1.8"
    )
    .fromTo(headlineRef.current,
      { y: 120, skewY: 5, filter: 'blur(10px)', opacity: 0 },
      { y: 0, skewY: 0, filter: 'blur(0px)', opacity: 1, duration: 2.2 },
      "<"
    )
    // 4. Sub-headline — fade and lift
    .fromTo(subheadlineRef.current,
      { y: 30, opacity: 0, filter: 'blur(4px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8 },
      "-=1.4"
    )
    // 5. CTAs — staggered entrance
    .fromTo(ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1.5 },
      "-=1.2"
    )
    // 6. Scroll indicator — last to appear
    .fromTo(scrollIndicatorRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.5"
    );

    // Scroll line draw animation
    if (scrollLineRef.current) {
      gsap.fromTo(scrollLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: 'top center'
        }
      );
    }

    // Parallax — video pushes away on scroll
    gsap.to(videoContainerRef.current, {
      y: 150,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Handle scroll indicator visibility
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

  return (
    <section
      ref={heroRef}
      id="home"
      className="tech-hero relative overflow-hidden h-[100dvh] w-full flex items-center justify-center bg-black"
    >
      {/* Layer 0 — Video Background Full Screen */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
        {/* Background Atmosphere — mimics the video colors to avoid black bars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(74,222,128,0.05)_0%,transparent_50%)]" />
        
        <div ref={videoContainerRef} className="absolute inset-0 w-full h-full will-change-transform" style={{ opacity: 0 }}>
          <video
            ref={video1Ref}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-right"
            style={{ filter: 'brightness(1.0) contrast(1.05) saturate(1.1)', opacity: 1, zIndex: 1 }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Localized Readability Gradient — Organic Diagonal Shadow Mask */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {/* Desktop: Organic Diagonal Wedge (105deg) */}
        <div 
          className="hidden md:block absolute inset-0 w-full h-full bg-[linear-gradient(105deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.8)_40%,rgba(0,0,0,0.3)_60%,transparent_80%)] opacity-100" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}
        />
        
        {/* Mobile: Bottom-focused diagonal fade */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-100" />
      </div>

      {/* Layer 2 — Content */}
      <div ref={contentRef} className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center text-center md:items-start md:text-left gap-8 pt-20 md:pt-32">

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
            className="text-[11vw] md:text-[6vw] lg:text-[5vw] font-black tracking-tighter leading-[1] text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] break-words"
          >
            A máquina de<br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#4ade80] to-primary bg-[length:200%_auto] animate-gradient-x italic py-2 px-2 pr-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              resultados
            </span><br />
            <span className="text-white/90">que não dorme.</span>
          </h1>
        </div>

        {/* Sub-headline */}
        <p
          ref={subheadlineRef}
          className="text-base md:text-lg lg:text-xl text-white/70 font-light tracking-wide max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-relaxed"
        >
          <span className="text-white/90 border-l-2 border-primary/50 pl-4 mb-6 block italic">
            Pare de fragmentar o seu orçamento em soluções vazias.
          </span>
          <span className="text-white font-medium block">
            O único ecossistema 360º que funde <span className="text-white font-black underline decoration-primary/40 underline-offset-4">design</span>, <span className="text-white font-black underline decoration-primary/40 underline-offset-4">tecnologia</span> e <span className="text-white font-black underline decoration-primary/40 underline-offset-4">performance</span> num fluxo <span className="text-primary font-black tracking-tighter bg-primary/10 border border-primary/20 shadow-[0_0_10px_rgba(34,197,94,0.1)] px-2 py-0.5 rounded-sm">Hyper-Velocity 20x</span>.
          </span>
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center md:items-start gap-5 pt-4"
        >
          <MagneticButton
            onClick={openContactModal}
            variant="primary"
            className="group h-16 px-14 text-sm font-black tracking-[0.15em] bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 rounded-2xl uppercase"
          >
            <span className="flex items-center gap-3">
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

      {/* Layer 3 — Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="hidden min-h-[700px]:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-700"
        style={{ opacity: showScrollIndicator ? 1 : 0, pointerEvents: showScrollIndicator ? 'auto' : 'none' }}
      >
        <button
          onClick={scrollToServices}
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
