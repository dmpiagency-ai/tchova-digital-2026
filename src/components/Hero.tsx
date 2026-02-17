import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef, useCallback } from 'react';
import { env } from '@/config/env';
import { TextLoop } from '@/components/ui/text-loop';

const VIDEO_URL = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/v1771006702/0213_3_ftmadc.mp4';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const entranceTimer = setTimeout(() => setIsLoaded(true), 100);
    const completeTimer = setTimeout(() => setEntranceComplete(true), 1500);
    const scrollTimer = setTimeout(() => setShowScrollIndicator(false), 3000);
    
    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(completeTimer);
      clearTimeout(scrollTimer);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const onChange = () => setPrefersReducedMotion(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !entranceComplete) return;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion, entranceComplete]);

  const handleVideoEnded = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="tech-hero relative overflow-hidden h-screen flex items-center justify-start pt-16"
    >
      {/* Background Video with Parallax */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: prefersReducedMotion 
            ? 'none' 
            : entranceComplete 
              ? `translateY(${scrollY * 0.3}px)` 
              : 'translateY(0)',
          transition: 'transform 0.1s linear',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.85) contrast(1.05) saturate(0.95) blur(0.5px)',
            transform: prefersReducedMotion 
              ? 'none' 
              : entranceComplete 
                ? `scale(1.15) translateY(-${scrollY * 0.15}px)` 
                : 'scale(1.3)',
            opacity: isLoaded ? 1 : 0,
            transition: entranceComplete 
              ? 'transform 0.1s linear' 
              : 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-out',
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.3s',
          }}
        />
      </div>

      {/* Main Content - Left Aligned */}
      <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-12">
        <div 
          className="w-full max-w-2xl space-y-3.5 sm:space-y-4 lg:space-y-6"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
          }}
        >
          {/* Badge - Ecosystem 360 */}
          <div 
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-400/10 border border-green-400/30"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
              transition: 'opacity 0.6s ease-out 0.5s, transform 0.6s ease-out 0.5s',
            }}
          >
            <span className="text-[13px] sm:text-sm font-bold text-green-400">Ecossistema 360° Digital & Técnico</span>
          </div>

          {/* Main Headline */}
          <h1 
            className="text-[28px] sm:text-[38px] md:text-[48px] lg:text-[60px] font-extrabold tracking-[-0.02em] leading-[1.1] sm:leading-[1.05] text-white"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.6s, transform 0.6s ease-out 0.6s',
            }}
          >
            <span style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}>Tudo para lançar,</span>
            <br />
            <span 
              className="text-primary"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}
            >
              promover e equipar
            </span>
            <br />
            <span style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}>o seu negócio</span>
          </h1>

          {/* Rotating Text - Services by Category */}
          <div 
            className="text-[18px] sm:text-[22px] md:text-[28px] lg:text-[34px] font-bold text-white/90 leading-[1.15] sm:leading-[1.1]"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.7s, transform 0.6s ease-out 0.7s',
            }}
          >
            <TextLoop interval={3} transition={{ duration: 0.4 }}>
              <span>Design que impacta e marca</span>
              <span>Sites e Apps online,<br />vendendo sem parar</span>
              <span>Marketing estratégico,<br />tráfego que converte</span>
              <span>Audiovisual que comunica</span>
              <span>Importação que facilita</span>
              <span>GSM Mobile que resolve</span>
            </TextLoop>
          </div>

          {/* Short Subheadline */}
          <p 
            className="text-[15px] sm:text-base lg:text-lg text-white/70 font-medium max-w-lg leading-relaxed"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.8s, transform 0.6s ease-out 0.8s',
            }}
          >
            Do <span className="font-bold text-white">design</span> à <span className="font-bold text-white">venda online</span>, do <span className="font-bold text-white">marketing</span> à <span className="font-bold text-white">importação</span> e <span className="font-bold text-white">assistência GSM mobile</span> — a <span className="font-bold text-primary">Tchova resolve</span> num só lugar.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row justify-start items-stretch sm:items-start gap-2.5 sm:gap-3 pt-1 sm:pt-2"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.9s, transform 0.6s ease-out 0.9s',
            }}
          >
            {/* Primary CTA */}
            <Button
              size="lg"
              className="rounded-[22px] sm:rounded-[24px] py-3 sm:py-3.5 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-[#22C55E] to-emerald-600 border-2 border-green-400 text-white hover:from-[#16A34A] hover:to-emerald-700 hover:border-green-500 text-[15px] sm:text-base lg:text-lg hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl w-full sm:w-auto min-h-[50px] sm:min-h-[52px] lg:min-h-[56px] shadow-lg shadow-green-500/25"
              onClick={() => {
                const message = encodeURIComponent('Olá! Quero saber mais sobre o ecossistema 360°.');
                window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
              }}
            >
              Começar agora
            </Button>
            {/* Secondary CTA - Glassmorphism */}
            <Button
              variant="ghost"
              size="lg"
              className="rounded-[22px] sm:rounded-[24px] py-3 sm:py-3.5 px-6 sm:px-8 font-medium transition-all duration-300 border border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40 hover:text-white text-[15px] sm:text-base lg:text-lg w-full sm:w-auto min-h-[50px] sm:min-h-[52px] lg:min-h-[56px] backdrop-blur-xl bg-white/10 shadow-lg shadow-black/10"
              onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Serviços
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
          style={{
            opacity: isLoaded ? 1 : 0,
            animation: isLoaded && !prefersReducedMotion ? 'bounce 2s infinite 1.5s' : 'none',
            transition: 'opacity 0.6s ease-out 1.2s',
          }}
        >
          <button
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex flex-col items-center space-y-1 p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            aria-label="Ver serviços"
          >
            <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1 group-hover:border-white/60 transition-colors">
              <div className="w-0.5 h-2 bg-white/60 rounded-full animate-pulse" />
            </div>
            <ArrowDown className="w-3 h-3 text-white/40" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;
