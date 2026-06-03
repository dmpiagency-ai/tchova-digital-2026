import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EliteMatrix } from '@/components/ui/EliteIcons';
import useEmblaCarousel from 'embla-carousel-react';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    name: 'João Macamo',
    company: 'Macamo Importações',
    role: 'CEO',
    content: 'Eu importava da China sozinho e perdia dinheiro com fornecedores errados. A Tchova negociou por mim, encontrou preços 30% mais baratos e tratou da logística toda. Em 3 meses, as minhas encomendas subiram 43%.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 2,
    name: 'Ana Bela',
    company: 'Bela Boutique',
    role: 'Fundadora',
    content: 'Precisava de marca, site e vídeos para o Instagram, tudo ao mesmo tempo. Noutra agência ia pagar 3x mais e esperar meses. A Tchova fez tudo em 2 semanas. Em 3 semanas já tinha clientes novas a mandar mensagem. 65% mais vendas.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 3,
    name: 'Carlos Sitoe',
    company: 'Sitoe Telecomunicações',
    role: 'Diretor Geral',
    content: 'Trabalho com desbloqueio e reparação de celulares. Antes pagava caro por ferramentas GSM lá fora. Com o painel da Tchova, alugo as tools que preciso por dia, pago com M-Pesa e o atendimento é 35% mais rápido. Valeu cada metical.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=150&h=150&q=80',
  }
];

export const Testimonials = () => {
  const { trackEvent } = useAnalytics();
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
    skipSnaps: false,
    breakpoints: { '(min-width: 768px)': { active: false } }
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      gsap.from('.test-header', {
        y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
      });

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 60, opacity: 0, rotationX: -10, scale: 0.95, duration: 0.8,
          stagger: 0.2, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 75%' }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section id="testimonials" ref={containerRef} className="py-12 md:py-24 relative overflow-hidden bg-background border-t border-white/[0.04]">

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand-green/[0.04] md:bg-brand-green/10 rounded-full blur-[100px] md:blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/[0.04] md:bg-primary/10 rounded-full blur-[100px] md:blur-[120px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container px-6 lg:px-12 mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-10 md:mb-20 max-w-3xl mx-auto">
          <div className="test-header inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md">
            <EliteMatrix className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Clientes Reais</span>
          </div>
          <h2 className="test-header text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter text-white uppercase">
            O que dizem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">sobre nós</span>
          </h2>
          <p className="test-header text-base md:text-xl text-muted-foreground/80 font-light leading-relaxed px-4 md:px-0">
            Não acredites só em nós. Ouve quem já trabalhou connosco e viu o negócio mudar.
          </p>
        </div>

        {/* ─── MOBILE: Storytelling Carousel ─────────────────────────────── */}
        <div className="md:hidden">

          {/* Person name + counter */}
          <div className="flex items-center justify-between mb-4 px-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">
                {TESTIMONIALS[selectedIndex].name}
              </span>
              <span className="text-[10px] text-white/25 tracking-widest">
                · {TESTIMONIALS[selectedIndex].role}
              </span>
            </div>
            <span className="text-[11px] font-bold text-white/35 tabular-nums font-mono">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-white/[0.06] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((selectedIndex + 1) / TESTIMONIALS.length) * 100}%` }}
            />
          </div>

          {/* Embla — full width */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {TESTIMONIALS.map((testimonial, index) => (
                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0">
                  <div
                    className={`relative border rounded-2xl overflow-hidden p-6 flex flex-col transition-all duration-400 ${
                      index === selectedIndex
                        ? 'bg-card border-primary/25 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]'
                        : 'bg-card border-white/[0.07]'
                    }`}
                    onMouseEnter={() => trackEvent({ action: 'hover', category: 'testimonials', label: testimonial.name })}
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-white/75 leading-relaxed italic text-sm flex-grow mb-6">
                      "{testimonial.content}"
                    </p>

                    {/* Profile */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-brand-green rounded-full blur-sm opacity-40" />
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="relative w-10 h-10 rounded-full border border-white/20 object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm tracking-tight leading-none mb-0.5">{testimonial.name}</h4>
                        <p className="text-[10px] font-mono text-primary/80 uppercase tracking-wider">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between mt-5 px-0.5">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Depoimento anterior"
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                canScrollPrev ? 'border-primary/40 text-primary active:scale-95' : 'border-white/8 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ver depoimento ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? 'w-7 h-2 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Próximo depoimento"
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                canScrollNext ? 'border-primary/40 text-primary active:scale-95' : 'border-white/8 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP: Grid ──────────────────────────────────────────────── */}
        <div className="hidden md:block w-full max-w-6xl mx-auto">
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card md:bg-card/40 md:backdrop-blur-2xl border border-white/10 p-10 rounded-3xl relative group hover:border-primary/40 transition-colors duration-500 shadow-2xl flex flex-col"
                onMouseEnter={() => trackEvent({ action: 'hover', category: 'testimonials', label: testimonial.name })}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
                <div className="flex gap-1.5 mb-8">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-brand-yellow text-brand-yellow drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  ))}
                </div>
                <p className="text-white/80 leading-loose mb-10 italic text-lg flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-5 mt-auto pt-6 border-t border-white/10">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-brand-green rounded-full blur opacity-0 group-hover:opacity-50 transition duration-500" />
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="relative w-14 h-14 rounded-full border border-white/20 object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg tracking-tight">{testimonial.name}</h4>
                    <p className="text-sm font-mono text-primary/80 uppercase tracking-wider">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
