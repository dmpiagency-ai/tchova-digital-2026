import React, { useCallback, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Workflow, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { EliteRadar, EliteNode, ElitePulse } from '@/components/ui/EliteIcons';
import { isLowEnd } from '@/hooks/useLowEnd';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  // Native Mobile Carousel Refs & State
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  const steps = [
    {
      id: 'plan',
      icon: EliteRadar,
      label: 'DIAGNÓSTICO REAL',
      description: 'Zero suposições. Analisamos o teu negócio, os teus números e identificamos exatamente onde estás a perder dinheiro e clientes.',
      number: '01',
      phase: 'Fase 1',
      keyword: 'Análise',
    },
    {
      id: 'execute',
      icon: EliteNode,
      label: 'SISTEMA DE VENDAS',
      description: 'Não entregamos "arte". Montamos um ecossistema (Branding, Site, Tráfego, Vídeos) focado inteiramente na retenção e conversão.',
      number: '02',
      phase: 'Fase 2',
      keyword: 'Estratégia',
    },
    {
      id: 'launch',
      icon: ElitePulse,
      label: 'ESCALA E PREVISIBILIDADE',
      description: 'Lançamos as campanhas e a infraestrutura. O teu negócio passa a atrair clientes qualificados de forma automática e previsível.',
      number: '03',
      phase: 'Fase 3',
      keyword: 'Escala',
    },
  ];

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 8);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 8);

    const cardWidth = clientWidth * 0.85;
    const index = Math.min(
      steps.length - 1,
      Math.max(0, Math.round((scrollLeft + cardWidth * 0.3) / cardWidth))
    );
    setSelectedIndex(index);
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const scrollPrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollTo = (index: number) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.clientWidth * 0.85;
    carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.from(headerRef.current, {
        y: 40, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
      });

      if (pipelineRef.current) {
        gsap.fromTo(pipelineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.5, ease: 'power3.inOut',
            scrollTrigger: { trigger: stepsRef.current, start: 'top 60%', end: 'bottom 80%', scrub: 1 }
          }
        );
      }
    });

    mm.add('(min-width: 1024px)', () => {
      if (stepsRef.current) {
        gsap.from(stepsRef.current.children, {
          x: (index) => index % 2 === 0 ? 50 : -50,
          opacity: 0, stagger: 0.3, duration: 1.2, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 70%' }
        });
      }
    });
  }, { scope: containerRef });

  const handleCTA = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: {
        serviceType: 'how-it-works',
        serviceData: { title: 'Começar Agora', type: 'start', requiresLogin: false }
      }
    }));
  }, []);

  return (
    <section ref={containerRef} id="how-it-works" className="py-12 md:py-16 lg:py-20 relative overflow-hidden bg-background border-t border-white/[0.04] font-nunito scroll-mt-6">

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}
        />
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/10 rounded-full blur-[200px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-8 md:mb-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3 backdrop-blur-md">
            <Workflow className="w-4 h-4 text-primary" />
            <span className="text-fluid-sm font-bold text-primary uppercase tracking-widest font-nunito">Como Trabalhamos</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tighter text-white uppercase font-nunito">
            3 FASES. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green font-nunito">SEM COMPLICAÇÃO.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed font-nunito max-w-xl">
            Entendemos o teu momento, montamos a estrutura e <span className="text-white font-semibold">lançamos a operação.</span>
          </p>
        </div>

        {/* ─── MOBILE: Native Full-Bleed Carousel ─────────────────────────────────── */}
        <div className="lg:hidden relative">

          {/* Phase label + counter */}
          <div className="flex items-center justify-between mb-4 px-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">
                {steps[selectedIndex]?.phase}
              </span>
              <span className="text-[10px] text-white/25 tracking-widest">
                · {steps[selectedIndex]?.keyword}
              </span>
            </div>
            <span className="text-[11px] font-bold text-white/35 tabular-nums font-mono">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-white/[0.06] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((selectedIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Carousel container */}
          <div className="relative -mx-6">
            {/* Visual Fade Left */}
            <div className={`absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Left Navigation Icon */}
            <button
              onClick={scrollPrev}
              disabled={!showLeftFade}
              aria-label="Fase anterior"
              className={`absolute left-4 top-1/2 -translate-y-1/2 -mt-2 z-20 flex items-center justify-center w-10 h-10 rounded-full border bg-background/90 backdrop-blur-md transition-all duration-200 no-min-size shadow-xl ${
                showLeftFade ? 'border-primary/40 text-primary active:scale-95 opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronLeft className="w-6 h-6 ml-[-2px]" />
            </button>

            {/* Visual Fade Right */}
            <div className={`absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} />

            {/* Right Navigation Icon */}
            <button
              onClick={scrollNext}
              disabled={!showRightFade}
              aria-label="Próxima fase"
              className={`absolute right-4 top-1/2 -translate-y-1/2 -mt-2 z-20 flex items-center justify-center w-10 h-10 rounded-full border bg-background/90 backdrop-blur-md transition-all duration-200 no-min-size shadow-xl ${
                showRightFade ? 'border-primary/40 text-primary active:scale-95 opacity-100 animate-pulse' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronRight className="w-6 h-6 ml-[2px]" />
            </button>

            {/* Native Scroll-Snap Container */}
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pb-4 pt-1 px-6 relative z-0"
            >
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex-[0_0_85%] min-w-0 snap-center transition-all duration-300"
                >
                  <div className={`relative w-full border rounded-2xl overflow-hidden p-6 md:p-8 transition-all duration-300 backdrop-blur-xl ${
                    index === selectedIndex
                      ? 'bg-gradient-to-br from-white/[0.08] via-card/80 to-primary/[0.08] border-primary/40 shadow-[0_0_40px_-10px_rgba(34,197,94,0.35)] opacity-100 scale-100'
                      : 'bg-card/50 border-white/[0.07] opacity-70 scale-[0.98]'
                  }`}>

                    {/* Giant Watermark Number */}
                    <div className="absolute top-2 right-4 text-7xl font-black font-mono text-white/[0.04] pointer-events-none select-none">
                      {step.number}
                    </div>

                    {/* Icon with glow */}
                    <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="relative z-10 text-xl font-black text-white uppercase tracking-tight mb-3 leading-tight font-nunito">
                      {step.label}
                    </h3>

                    {/* Description */}
                    <p className="relative z-10 text-zinc-300 leading-relaxed text-xs sm:text-sm font-normal">
                      {step.description}
                    </p>

                    {/* Footer connector */}
                    <div className="relative z-10 mt-6 flex items-center gap-2 pt-2">
                      <div className="flex-1 h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />
                      {index < steps.length - 1 ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">a seguir</span>
                          <ChevronRight className="w-3 h-3 text-primary" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-black">pronto para funcionar</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls (Indicators only) */}
          <div className="flex items-center justify-center mt-4 px-0.5">
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para fase ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ease-out no-min-size ${
                    i === selectedIndex
                      ? 'w-7 h-2 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── DESKTOP: Alternating timeline layout ──────────────────────────── */}
        <div className="hidden lg:block w-full max-w-5xl mx-auto relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/5 rounded-full overflow-hidden">
            <div ref={pipelineRef} className="w-full h-full bg-gradient-to-b from-transparent via-primary to-brand-green shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>

          <div ref={stepsRef} className="flex flex-col gap-16 lg:gap-20">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.id} className={`relative flex flex-row items-center gap-12 ${isEven ? 'flex-row-reverse' : ''}`}>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                    <div className="absolute w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className={`w-1/2 flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <div className="group relative w-full bg-card md:bg-card/60 md:backdrop-blur-2xl border border-white/10 p-8 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]">
                      <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="relative z-10 text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-3 font-nunito">{step.label}</h3>
                      <p className="relative z-10 text-zinc-400 leading-relaxed text-sm md:text-base font-normal">{step.description}</p>
                    </div>
                  </div>
                  <div className="w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-16 text-center relative z-10">
          <button
            onClick={handleCTA}
            className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-4.5 text-sm md:text-base font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] uppercase tracking-wider"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
