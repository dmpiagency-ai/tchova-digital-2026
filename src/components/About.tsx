import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Import our premium custom vectors
import { EliteVector, EliteRadar, EliteCore, EliteMatrix, ElitePulse, EliteNode } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [emblaRef] = useEmblaCarousel({ 
    align: 'start', 
    containScroll: 'trimSnaps',
    breakpoints: { '(min-width: 768px)': { active: false } } 
  }, [Autoplay({ delay: 4000, stopOnInteraction: true })]);

  // Unique differentials with distinct visual styles using EliteIcons
  const differentials = [
    { 
      id: 'speed',
      icon: EliteVector, 
      label: 'Velocidade Letal', 
      description: 'Lançamos a sua ideia antes que a concorrência consiga reagir',
      glow: 'group-hover:border-green-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]'
    },
    { 
      id: 'focus',
      icon: EliteRadar, 
      label: 'Engenharia de Conversão', 
      description: 'Estratégias focadas em quem realmente abre o bolso para comprar',
      glow: 'group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]'
    },
    { 
      id: 'reliability',
      icon: EliteCore, 
      label: 'Disponibilidade Total', 
      description: 'Sua marca online 24/7, blindada contra falhas e instabilidades',
      glow: 'group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]'
    },
    { 
      id: 'respect',
      icon: EliteMatrix, 
      label: 'Autoridade de Elite', 
      description: 'Design de alto luxo que impõe respeito e confiança imediata',
      glow: 'group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]'
    },
    { 
      id: 'results',
      icon: ElitePulse, 
      label: 'Lucratividade Digital', 
      description: 'Ecossistemas desenhados para gerar lucro enquanto você descansa',
      glow: 'group-hover:border-teal-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.3)]'
    },
    { 
      id: 'partnership',
      icon: EliteNode, 
      label: 'Unidade de Suporte Tático', 
      description: 'Não somos uma agência; somos o motor operacional do seu crescimento em Moçambique',
      glow: 'group-hover:border-rose-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]'
    }
  ];

  useGSAP(() => {
    // Reveal Header
    gsap.from('.manifesto-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    // 3D Cascade reveal for cards
    if (cardsRef.current) {
      gsap.from(cardsRef.current.children, {
        y: 80,
        opacity: 0,
        rotationX: -15,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
        }
      });
    }

    // Impactful Stats reveal
    if (statsRef.current) {
      gsap.from(statsRef.current.children, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        }
      });
    }
  }, { scope: containerRef });

  const handleCTA = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { 
        serviceType: 'general-consultation', 
        serviceData: { title: 'Consultoria de Escala', type: 'consultation', requiresLogin: false } 
      }
    }));
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-12 md:py-24 relative overflow-hidden bg-[#030303] border-t border-white/5 perspective-1000">
      {/* Elite Background Architecture */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1. Cyber Grid Overlay (Softened) */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '64px 64px' 
          }} 
        />
        
        {/* 2. Liquid Energy Blobs (Softened and Diffused) */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-brand-green/8 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '15s' }} />
        </div>

        {/* 3. Ambient Technical Lines (Subtle) */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-brand-green/20 to-transparent" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Cinematic Header & Visual (Wide Card) */}
        <div className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-16 md:mb-24 border border-white/10 group shadow-2xl">
          
          {/* Immersive Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://res.cloudinary.com/dwlfwnbt0/image/upload/v1779210623/quem_somos_robo_g4vzwl.jpg" 
              alt="TchovaDigital Engenharia de Elite" 
              className="w-full h-full object-cover object-[center_30%] transition-transform duration-[2s] group-hover:scale-105" 
            />
            {/* Gradients for text legibility and elite aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 px-6 py-16 md:py-24 lg:py-32 lg:px-16 max-w-4xl text-center md:text-left mx-auto md:mx-0">
            <div className="manifesto-title inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8 backdrop-blur-md">
              <EliteMatrix className="w-4 h-4 text-primary" />
              <span className="text-xs tracking-widest font-bold text-primary uppercase">Manifesto do Ecossistema</span>
            </div>
            <h2 className="manifesto-title text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white py-2 md:px-1 uppercase leading-[1.1]">
              O seu negócio,<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green italic md:pr-2">nosso legado</span>
            </h2>
            <p className="manifesto-title text-lg md:text-2xl text-white/90 font-light leading-relaxed">
              Somos o estúdio de alta performance em Moçambique. <span className="text-white font-semibold">Fundimos engenharia e design de elite</span> para construir o seu império digital.
            </p>
          </div>
        </div>

        {/* Differential Cards - Embla Slider on Mobile */}
        <div className="w-full max-w-6xl mx-auto overflow-hidden px-4 md:px-0 mb-10 md:mb-16" ref={emblaRef}>
          <div 
            ref={cardsRef} 
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {differentials.map((item) => (
              <div
                key={item.id}
                className={`flex-[0_0_85%] md:flex-none min-w-0 group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 ${item.glow}`}
              >
                {/* Icon Container with subtle inner glow */}
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-primary transition-colors" />
                </div>

                {/* Text */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
                  {item.label}
                </h3>
                <p className="text-xs md:text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Indicators */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {differentials.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
            ))}
          </div>
        </div>

        {/* Value Proposition & Stats Terminal */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-black/50 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 border border-white/10 overflow-hidden shadow-2xl">
            {/* Inner Glowing Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-primary/10 to-brand-green/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              
              {/* Stats Row */}
              <div ref={statsRef} className="flex flex-col md:flex-row justify-center gap-10 md:gap-24 mb-10 md:mb-16 w-full border-b border-white/10 pb-10 md:pb-16">
                <div className="text-center">
                  <div className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-1 tracking-tighter">100<span className="text-primary">+</span></div>
                  <div className="text-[10px] md:text-sm uppercase tracking-widest text-primary font-bold">Projectos Executados</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-1 tracking-tighter">50<span className="text-primary">+</span></div>
                  <div className="text-[10px] md:text-sm uppercase tracking-widest text-primary font-bold">Líderes de Sector</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-1 tracking-tighter">3<span className="text-primary">+</span></div>
                  <div className="text-[10px] md:text-sm uppercase tracking-widest text-primary font-bold">Anos na Fronteira</div>
                </div>
              </div>

              {/* Bottom Call to Action */}
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-lg md:text-2xl text-white font-medium mb-8 md:mb-10 leading-snug">
                  Não criamos apenas sites. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Construímos o motor que transporta a sua visão para o lucro real.</span>
                </p>
                
                <button 
                  onClick={handleCTA}
                  className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                    <EliteNode className="w-5 h-5" />
                    Accionar Unidade de Elite
                    <ArrowRight className="w-5 h-5 ml-1 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
