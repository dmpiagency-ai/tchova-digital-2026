import React, { useCallback, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { EliteRadar, EliteNode, ElitePulse } from '@/components/ui/EliteIcons';
import useEmblaCarousel from 'embla-carousel-react';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const swipeHintRef = useRef<HTMLDivElement>(null);

  // Full-width snapping carousel — one card at a time, no partial peek
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
    skipSnaps: false,
    breakpoints: { '(min-width: 1024px)': { active: false } }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const steps = [
    {
      id: 'plan',
      icon: EliteRadar,
      label: 'Ouvimos o Teu Negócio',
      description: 'Sentamos contigo, entendemos como vendes hoje e onde estás a perder clientes. Sem jargão — só perguntas certas.',
      number: '01',
      phase: 'Fase 1',
      keyword: 'Entender',
    },
    {
      id: 'execute',
      icon: EliteNode,
      label: 'Montamos Tudo Para Ti',
      description: 'Criamos o teu site, a tua marca e o sistema de vendas online. Tudo pronto para os clientes te encontrarem.',
      number: '02',
      phase: 'Fase 2',
      keyword: 'Construir',
    },
    {
      id: 'launch',
      icon: ElitePulse,
      label: 'Começas a Vender Mais',
      description: 'Lançamos, ajustamos e tu começas a ver resultados. O teu negócio a funcionar online, mesmo quando dormes.',
      number: '03',
      phase: 'Fase 3',
      keyword: 'Crescer',
    },
  ];

  // Sync Embla state → React state
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  // One-time swipe hint GSAP animation on mobile
  useEffect(() => {
    if (!swipeHintRef.current) return;
    if (window.innerWidth >= 1024) return;

    const tl = gsap.timeline({ delay: 1.5 });
    tl.to(swipeHintRef.current, { opacity: 1, duration: 0.4 })
      .to(swipeHintRef.current, { x: -20, duration: 0.5, ease: 'power2.out' })
      .to(swipeHintRef.current, { x: 0, duration: 0.4, ease: 'power2.inOut' })
      .to(swipeHintRef.current, { x: -14, duration: 0.35, ease: 'power2.out' })
      .to(swipeHintRef.current, { x: 0, duration: 0.3, ease: 'power2.inOut' })
      .to(swipeHintRef.current, { opacity: 0, duration: 0.5, delay: 0.4 });
  }, []);

  useGSAP(() => {
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

    const mm = gsap.matchMedia();
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
        serviceData: { title: 'Iniciar Ecossistema', type: 'start', requiresLogin: false }
      }
    }));
  }, []);

  return (
    <section ref={containerRef} id="how-it-works" className="py-12 md:py-24 relative overflow-hidden bg-background/95 border-t border-white/5">

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
        <div ref={headerRef} className="text-center mb-10 md:mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Como Trabalhamos</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter text-white uppercase">
            Do Zero ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Resultado</span>
          </h2>
          <p className="text-base md:text-2xl text-muted-foreground/80 font-light leading-relaxed px-4 md:px-0">
            Simples, directo e sem complicações. <span className="text-white font-semibold">3 passos. Resultados reais.</span>
          </p>
        </div>

        {/* ─── MOBILE: Storytelling Carousel ─────────────────────────────────── */}
        <div className="lg:hidden relative">

          {/* Phase label + counter */}
          <div className="flex items-center justify-between mb-4 px-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">
                {steps[selectedIndex].phase}
              </span>
              <span className="text-[10px] text-white/25 tracking-widest">
                · {steps[selectedIndex].keyword}
              </span>
            </div>
            <span className="text-[11px] font-bold text-white/35 tabular-nums font-mono">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar — fills per step */}
          <div className="h-[2px] bg-white/[0.06] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((selectedIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Swipe hint — animates once then disappears */}
          <div
            ref={swipeHintRef}
            className="absolute right-2 top-[45%] z-20 opacity-0 pointer-events-none flex items-center gap-1.5"
          >
            <span className="text-[9px] text-white/40 uppercase tracking-widest">deslize</span>
            <ChevronLeft className="w-5 h-5 text-white/40" />
          </div>

          {/* Embla — 100% width, full card per view */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-[0_0_100%] min-w-0">
                  <div className={`relative w-full border rounded-2xl overflow-hidden p-6 transition-all duration-400 ${
                    index === selectedIndex
                      ? 'bg-[#0a1a0a] border-primary/35 shadow-[0_0_36px_-8px_rgba(34,197,94,0.4)]'
                      : 'bg-black/40 border-white/[0.07]'
                  }`}>

                    {/* Ghost number */}
                    <div className="absolute -bottom-4 -right-3 text-[120px] font-black text-white/[0.04] tracking-tighter leading-none pointer-events-none select-none">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-5">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Title */}
                    <h3 className="relative z-10 text-xl font-black text-white uppercase tracking-tight mb-3 leading-tight">
                      {step.label}
                    </h3>

                    {/* Description — full narrative text */}
                    <p className="relative z-10 text-white/55 leading-relaxed text-sm font-light">
                      {step.description}
                    </p>

                    {/* Footer connector */}
                    <div className="relative z-10 mt-6 flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/[0.06]" />
                      {index < steps.length - 1 ? (
                        <>
                          <span className="text-[8px] uppercase tracking-[0.25em] text-white/30 font-semibold">a seguir</span>
                          <ChevronRight className="w-3 h-3 text-primary/40" />
                        </>
                      ) : (
                        <>
                          <span className="text-[8px] uppercase tracking-[0.25em] text-primary font-black">pronto para vender</span>
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between mt-5 px-0.5">
            {/* Prev */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Fase anterior"
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                canScrollPrev
                  ? 'border-primary/40 text-primary active:scale-95 active:bg-primary/20'
                  : 'border-white/8 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Reactive dots */}
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para fase ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ease-out ${
                    i === selectedIndex
                      ? 'w-7 h-2 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Próxima fase"
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                canScrollNext
                  ? 'border-primary/40 text-primary active:scale-95 active:bg-primary/20'
                  : 'border-white/8 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP: Alternating timeline layout ──────────────────────────── */}
        <div className="hidden lg:block w-full max-w-5xl mx-auto relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/5 rounded-full overflow-hidden">
            <div ref={pipelineRef} className="w-full h-full bg-gradient-to-b from-transparent via-primary to-brand-green shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          </div>

          <div ref={stepsRef} className="flex flex-col gap-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.id} className={`relative flex flex-row items-center gap-16 ${isEven ? 'flex-row-reverse' : ''}`}>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                    <div className="absolute w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className={`w-1/2 flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <div className="group relative w-full bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]">
                      <div className="absolute -bottom-10 -right-6 text-[180px] font-black text-white/5 tracking-tighter leading-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4">
                        {step.number}
                      </div>
                      <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors duration-500">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="relative z-10 text-2xl font-black text-white uppercase tracking-tight mb-4">{step.label}</h3>
                      <p className="relative z-10 text-muted-foreground leading-relaxed text-lg font-light">{step.description}</p>
                    </div>
                  </div>
                  <div className="w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 md:mt-32 text-center relative z-10">
          <button
            onClick={handleCTA}
            className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              Quero Começar Agora
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
