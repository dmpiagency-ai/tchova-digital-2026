import { ArrowDown } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { TextLoop } from '@/components/ui/text-loop';
import { MagneticButton } from '@/components/ui/MagneticButton';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const VIDEO_URL = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1771006702/0213_3_ftmadc.mp4';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
    tl.fromTo(videoRef.current, 
      { scale: 1.4, opacity: 0 },
      { scale: 1.2, opacity: 1, duration: 1.8, ease: 'power2.out' }
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
    gsap.to(videoRef.current, {
      y: (i, target) => {
        const height = target.offsetHeight;
        return height * 0.2; // Move 20% of its height
      },
      scale: 1.35,
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

    // Hide scroll indicator on scroll
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: '100 top',
      onEnter: () => setShowScrollIndicator(false),
      onLeaveBack: () => setShowScrollIndicator(true)
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
      className="tech-hero relative overflow-hidden h-[100dvh] w-full flex items-center justify-start pt-16"
    >
      {/* Background Video with Parallax */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://res.cloudinary.com/dwlfwnbt0/video/upload/so_0/v1771006702/0213_3_ftmadc.jpg"
          className="w-full h-full object-cover will-change-transform"
          style={{
            filter: 'brightness(0.8) contrast(1.1) saturate(0.9) blur(0.4px)',
            opacity: 0, // Initial opacity for GSAP
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main Content - Left Aligned */}
      <div ref={contentRef} className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12">
        <div className="w-full max-w-2xl space-y-3.5 sm:space-y-4 lg:space-y-6">
          {/* Badge */}
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-400/10 border border-green-400/30">
            <span className="text-[13px] sm:text-sm font-bold text-green-400">Ecossistema 360° Digital & Técnico</span>
          </div>
          
          {/* Hyper-Velocity Badge */}
          <div ref={velocityBadgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/80">
               Hyper-Velocity <span className="text-primary">20x</span>
             </span>
          </div>

          <h1 
            ref={headlineRef}
            className="text-[28px] sm:text-[38px] md:text-[48px] lg:text-[60px] font-extrabold tracking-[-0.02em] leading-[1.1] sm:leading-[1.05] text-white"
          >
            <span style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 4px 20px, rgba(0, 0, 0, 0.6) 0px 2px 8px' }}>Acelere o seu negócio.</span><br />
            <span className="text-primary" style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 4px 20px, rgba(0, 0, 0, 0.6) 0px 2px 8px' }}>A máquina de resultados</span><br />
            <span style={{ textShadow: 'rgba(0, 0, 0, 0.8) 0px 4px 20px, rgba(0, 0, 0, 0.6) 0px 2px 8px' }}>que não dorme.</span>
          </h1>

          {/* Rotating Text - Services by Category */}
          <div 
            ref={loopingTextRef}
            className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[34px] font-bold text-white/90 leading-[1.15] sm:leading-[1.1]"
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
            className="readable-text-hero font-medium max-w-lg"
          >
            Pare de fragmentar o seu orçamento em soluções que não conversam. O único <span className="font-bold text-white">ecossistema 360º</span> que funde design, tecnologia e performance num <span className="font-bold text-primary">fluxo de vendas imbatível</span>.
          </p>

          {/* CTA Buttons */}
          <div 
            ref={ctaRef}
            className="flex flex-col sm:flex-row justify-start items-stretch sm:items-start gap-2.5 sm:gap-3 pt-1 sm:pt-2"
          >
            <MagneticButton
              onClick={openContactModal}
              variant="primary"
              className="w-full sm:w-auto min-h-[50px] sm:min-h-[56px] px-8 text-[15px] sm:text-base lg:text-lg"
            >
              Começar agora
            </MagneticButton>

            <MagneticButton
              onClick={scrollToServices}
              variant="secondary"
              className="w-full sm:w-auto min-h-[50px] sm:min-h-[56px] px-8 text-[15px] sm:text-base lg:text-lg bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-none"
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

