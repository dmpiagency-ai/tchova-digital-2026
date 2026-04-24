import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

// Import our premium custom vectors
import { EliteVector, EliteRadar, EliteCore, EliteMatrix, ElitePulse, EliteNode } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
      label: 'Parceiro de Guerra', 
      description: 'Não somos uma agência; somos o motor do seu crescimento',
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
    <section id="about" ref={containerRef} className="py-32 relative overflow-hidden bg-background/95 border-t border-white/5 perspective-1000">
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="manifesto-title inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
            <EliteMatrix className="w-4 h-4 text-primary" />
            <span className="text-xs tracking-widest font-bold text-primary uppercase">Manifesto Tchova</span>
          </div>
          <h2 className="manifesto-title text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            O seu negócio, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green italic">nosso legado</span>
          </h2>
          <p className="manifesto-title text-xl md:text-2xl text-muted-foreground/80 font-light leading-relaxed">
            Somos o estúdio de alta performance em Moçambique. <span className="text-white font-semibold">Fundimos engenharia e design de elite</span> para construir o seu império digital.
          </p>
        </div>

        {/* Differential Cards - Liquid Glass 3D Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-32">
          {differentials.map((item) => (
            <div
              key={item.id}
              className={`group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${item.glow}`}
            >
              {/* Icon Container with subtle inner glow */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <item.icon className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-white mb-3">
                {item.label}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Value Proposition & Stats Terminal */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-black/50 backdrop-blur-3xl rounded-[2.5rem] p-12 md:p-16 border border-white/10 overflow-hidden shadow-2xl">
            {/* Inner Glowing Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-primary/10 to-brand-green/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              
              {/* Stats Row */}
              <div ref={statsRef} className="flex flex-col md:flex-row justify-center gap-16 md:gap-24 mb-16 w-full border-b border-white/10 pb-16">
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2 tracking-tighter">100<span className="text-primary">+</span></div>
                  <div className="text-sm uppercase tracking-widest text-primary font-bold">Projetos de Alto Nível</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2 tracking-tighter">50<span className="text-primary">+</span></div>
                  <div className="text-sm uppercase tracking-widest text-primary font-bold">Líderes de Setor</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2 tracking-tighter">3<span className="text-primary">+</span></div>
                  <div className="text-sm uppercase tracking-widest text-primary font-bold">Anos na Fronteira</div>
                </div>
              </div>

              {/* Bottom Call to Action */}
              <div className="text-center max-w-2xl mx-auto">
                <p className="text-2xl text-white font-medium mb-10 leading-snug">
                  Não criamos apenas sites. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Construímos o motor que transporta a sua visão para o lucro real.</span>
                </p>
                
                <button 
                  onClick={handleCTA}
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                    <EliteNode className="w-5 h-5" />
                    Tchovar meu negócio
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
