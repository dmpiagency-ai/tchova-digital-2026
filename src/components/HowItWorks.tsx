import React, { useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight } from 'lucide-react';
import { EliteRadar, EliteNode, ElitePulse } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  // 3 steps representing the elite operation pipeline
  const steps = [
    { 
      id: 'plan',
      icon: EliteRadar, 
      label: 'Diagnóstico Letal', 
      description: 'Ouvimos as tuas dores e traçamos o plano de ataque sem falhas',
      number: '01'
    },
    { 
      id: 'execute',
      icon: EliteNode, 
      label: 'Arquitetura de Elite', 
      description: 'Construímos o teu motor de vendas com engenharia de ponta',
      number: '02'
    },
    { 
      id: 'launch',
      icon: ElitePulse, 
      label: 'Domínio de Mercado', 
      description: 'Lançamos e escalamos até ao topo do teu setor',
      number: '03'
    },
  ];

  useGSAP(() => {
    // 1. Header Reveal
    gsap.from(headerRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 85%',
      }
    });

    // 2. The Energy Pipeline Draw Animation
    if (pipelineRef.current) {
      gsap.fromTo(pipelineRef.current, 
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1, // Tie it to scroll position for a technical feel
          }
        }
      );
    }

    // 3. Staggered Reveal of Operation Nodes (Cards)
    if (stepsRef.current) {
      gsap.from(stepsRef.current.children, {
        x: (index) => index % 2 === 0 ? 50 : -50,
        opacity: 0,
        stagger: 0.3,
        duration: 1.2,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 70%',
        }
      });
    }

  }, { scope: containerRef });

  const handleCTA = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { 
        serviceType: 'how-it-works', 
        serviceData: { title: 'Iniciar Ecossistema', type: 'start', requiresLogin: false } 
      }
    }));
  }, []);

  return (
    <section ref={containerRef} id="how-it-works" className="py-20 relative overflow-hidden bg-background/95 border-t border-white/5 perspective-1000">
      
      {/* Elite Background Architecture (Softened) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 1. Subtle Technical Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '120px 120px' 
          }} 
        />
        
        {/* 2. Core Soft Energy Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[200px] animate-pulse" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Caminho para o Sucesso</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Vencemos</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground/80 font-light leading-relaxed">
            Transformamos a sua dor em lucro através de uma <span className="text-white font-semibold">operação cirúrgica em 3 etapas</span>.
          </p>
        </div>

        {/* Operation Pipeline Setup */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-0">
          
          {/* Central Glowing Line (The Pipeline) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/5 rounded-full overflow-hidden">
             <div ref={pipelineRef} className="w-full h-full bg-gradient-to-b from-transparent via-primary to-brand-green shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>

          <div ref={stepsRef} className="flex flex-col gap-12 lg:gap-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.id} className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Central Node Dot (Desktop Only) */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border-2 border-primary items-center justify-center z-10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                    <div className="absolute w-3 h-3 rounded-full bg-primary" />
                  </div>

                  {/* Card Content */}
                  <div className={`w-full lg:w-1/2 flex ${isEven ? 'lg:justify-start' : 'lg:justify-end'}`}>
                    <div className="group relative w-full bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]">
                      
                      {/* Massive Background Number */}
                      <div className="absolute -bottom-10 -right-6 text-[180px] font-black text-white/5 tracking-tighter leading-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors duration-500">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>

                      {/* Text */}
                      <h3 className="relative z-10 text-2xl font-black text-white uppercase tracking-tight mb-4">
                        {step.label}
                      </h3>
                      <p className="relative z-10 text-muted-foreground leading-relaxed text-lg font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty Spacer for alignment */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-32 text-center relative z-10">
          <button 
            onClick={handleCTA}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              Iniciar a Operação
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
