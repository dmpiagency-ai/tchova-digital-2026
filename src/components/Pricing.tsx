import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TiltCard } from '@/components/ui/TiltCard';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { EliteRadar, ElitePulse, EliteCore } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const PLANS = [
  {
    id: 'start',
    name: "Unidade Alpha",
    subtitle: "Start",
    icon: EliteCore,
    price: "5.000",
    originalPrice: "7.000",
    savings: "2.000",
    period: "único",
    popular: false,
    description: "Design de autoridade e presença digital estratégica para novos projectos.",
    delivery: "3 a 5 dias úteis",
    ideal: "Pequenos negócios e empreendedores",
    buttonText: "Accionar Unidade Alpha",
    features: [
      "Criação de logotipo ou redesign da marca",
      "2 cartazes/posts para redes sociais",
      "1 story para status (WhatsApp / Instagram)",
      "Capa para Facebook",
      "Foto de perfil (página ou conta)",
      "Capa para WhatsApp Business",
      "Papel de parede (celular ou desktop)",
      "Cartão de visita digital com QR Code",
      "Link Bio (cartão digital para redes sociais)",
      "Bônus: Tráfego pago básico por 4 dias",
    ],
  },
  {
    id: 'business',
    name: "Unidade Business",
    subtitle: "Escala",
    icon: ElitePulse,
    price: "15.000",
    originalPrice: "20.000",
    savings: "5.000",
    period: "único",
    popular: true,
    description: "Arquitetura de conversão focada em geração de leads e vendas online.",
    delivery: "7 a 10 dias úteis",
    ideal: "Negócios que querem leads e vendas",
    buttonText: "Accionar Unidade Business",
    features: [
      "Tudo do Plano Start +",
      "Identidade visual completa",
      "Landing page profissional (site simples)",
      "Botão direto para WhatsApp",
      "Página otimizada para conversão",
      "Integração com redes sociais",
      "Configuração de pixel Meta",
      "Tráfego pago estratégico (Meta Ads)",
      "Campanha ativa em até 8 dias",
      "Suporte inicial pós-entrega",
    ],
  },
  {
    id: 'eco360',
    name: "Unidade Eco 360",
    subtitle: "Total",
    icon: EliteRadar,
    price: "35.000",
    originalPrice: "45.000",
    savings: "10.000",
    period: "ajustável",
    popular: false,
    description: "Ecossistema completo para domínio de mercado e escala tecnológica.",
    delivery: "Sob cronograma",
    ideal: "Empresas, startups e instituições",
    buttonText: "Accionar Ecossistema Total",
    features: [
      "Tudo do Plano Business +",
      "Site profissional completo",
      "Sistema de pagamentos online",
      "Carrinho de compras",
      "Painel de gestão (admin)",
      "Integração com APIs",
      "IA (chat, automação, formulários)",
      "Desenvolvimento de apps mobile",
      "Tráfego pago focado no site",
      "Estratégia de crescimento digital",
    ],
  },
];

const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
    gsap.from(headerRef.current, {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
    });

    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        y: 80, scale: 0.9, opacity: 0, stagger: 0.2, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 75%' }
      });
    }
  }, { scope: containerRef });

  const handleContact = (plan: typeof PLANS[number]) => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: {
        serviceType: 'pricing-plan',
        serviceData: { title: `Plano ${plan.name}`, type: 'pricing', requiresLogin: false }
      }
    }));
  };

  return (
    <section ref={containerRef} id="planos" className="py-12 md:py-24 relative overflow-hidden bg-background/95 border-t border-white/5 perspective-1000">

      {/* Background glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-10 md:mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 md:mb-8 backdrop-blur-md">
            <EliteRadar className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Pricing Model</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black mb-4 md:mb-6 tracking-tighter text-white uppercase">
            Investimento <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Consciente</span>
          </h2>
          <p className="text-sm md:text-2xl text-muted-foreground/80 font-light leading-relaxed px-4 md:px-0">
            Escolha como queres fazer o teu negócio <span className="text-white font-semibold italic">bater</span> hoje. Estruturas escaláveis para qualquer estágio.
          </p>
        </div>

        {/* ─── MOBILE: Storytelling Carousel ─────────────────────────────── */}
        <div className="md:hidden">

          {/* Plan label + counter */}
          <div className="flex items-center justify-between mb-4 px-0.5">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${PLANS[selectedIndex].popular ? 'bg-primary' : 'bg-white/40'}`} />
              <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
                {PLANS[selectedIndex].name}
              </span>
              {PLANS[selectedIndex].popular && (
                <span className="text-[8px] font-black text-primary uppercase tracking-widest border border-primary/40 px-1.5 py-0.5 rounded-full">
                  Recomendado
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-white/35 tabular-nums font-mono">
              {String(selectedIndex + 1).padStart(2, '0')} / {String(PLANS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-white/[0.06] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((selectedIndex + 1) / PLANS.length) * 100}%` }}
            />
          </div>

          {/* Embla */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {PLANS.map((plan, index) => (
                <div key={plan.id} className="flex-[0_0_100%] min-w-0">
                  <div className={`relative border rounded-2xl overflow-hidden transition-all duration-400 ${
                    plan.popular
                      ? 'bg-[#0a1a0a] border-primary/40 shadow-[0_0_40px_-10px_rgba(34,197,94,0.4)]'
                      : index === selectedIndex
                        ? 'bg-black/60 border-white/15'
                        : 'bg-black/40 border-white/[0.07]'
                  }`}>

                    {/* Popular top line */}
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-brand-green to-primary" />
                    )}

                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-xl border ${plan.popular ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/60'}`}>
                          <plan.icon className="w-5 h-5" />
                        </div>
                        <div className="text-right">
                          {plan.originalPrice && (
                            <div className="text-[10px] line-through text-white/30 font-mono">{plan.originalPrice} MZN</div>
                          )}
                          <div className={`text-2xl font-black tracking-tight ${plan.popular ? 'text-primary' : 'text-white'}`}>
                            {plan.price} <span className="text-xs font-bold text-white/40">MZN</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-0.5">
                        {plan.name}
                      </h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-3">{plan.subtitle}</p>
                      <p className="text-xs text-white/50 leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <div className="px-6 pb-4 border-t border-white/[0.06] pt-4">
                      <ul className="space-y-2.5">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary/20' : 'bg-white/8'}`}>
                              <Check className={`w-2.5 h-2.5 ${plan.popular ? 'text-primary' : 'text-white/40'}`} />
                            </div>
                            <span className={`text-[11px] leading-snug ${plan.popular ? 'text-white/85' : 'text-white/55'}`}>{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-[10px] text-primary/70 font-bold uppercase tracking-wider pl-6.5">
                            + {plan.features.length - 5} mais incluídos
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-white/[0.06]">
                      <div className="flex gap-2 mb-4">
                        <div className="flex-1 text-center p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Prazo</div>
                          <div className="text-[10px] text-white/70 font-mono">{plan.delivery}</div>
                        </div>
                        <div className="flex-1 text-center p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Pagamento</div>
                          <div className="text-[10px] text-white/70 font-mono capitalize">{plan.period}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleContact(plan)}
                        className={`w-full flex items-center justify-center gap-2 font-black h-12 rounded-xl text-[10px] uppercase tracking-widest transition-transform active:scale-[0.98] ${
                          plan.popular
                            ? 'bg-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : 'bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        {plan.buttonText}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const priceVal = parseInt(plan.price.replace(/\./g, ''));
                          window.dispatchEvent(new CustomEvent('set-roi-investment', {
                            detail: { investment: priceVal }
                          }));
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-1 font-bold h-8 rounded-lg text-[9px] uppercase tracking-widest text-primary/80 hover:text-primary transition-all border border-primary/20 hover:bg-primary/5 bg-transparent"
                      >
                        Simular ROI do Plano
                      </button>
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
              aria-label="Plano anterior"
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                canScrollPrev ? 'border-primary/40 text-primary active:scale-95' : 'border-white/8 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {PLANS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para plano ${i + 1}`}
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
              aria-label="Próximo plano"
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${
                canScrollNext ? 'border-primary/40 text-primary active:scale-95' : 'border-white/8 text-white/15 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP: Grid layout ──────────────────────────────────────── */}
        <div className="hidden md:block w-full max-w-7xl mx-auto">
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {PLANS.map((plan) => (
              <div key={plan.id} className="h-full">
                <TiltCard
                  className="p-0 overflow-visible border-0 rounded-3xl bg-transparent h-full"
                  maxTilt={5}
                  glowOpacity={plan.popular ? 0.4 : 0.1}
                  glowColor={plan.popular ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 255, 255, 0.2)'}
                >
                  <Card className={`relative overflow-hidden h-full flex flex-col ${
                    plan.popular
                      ? "border-primary/50 bg-black/80 backdrop-blur-3xl shadow-[0_0_50px_-15px_rgba(34,197,94,0.3)]"
                      : "border-white/10 bg-black/40 backdrop-blur-2xl"
                  }`}>
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-brand-green to-primary" />
                    )}
                    <CardHeader className="text-center p-6 md:p-10 pb-4 md:pb-6">
                      <div className="flex flex-col items-center gap-4 mb-4 md:mb-6">
                        <div className={`p-3 md:p-4 rounded-2xl border ${plan.popular ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/70'}`}>
                          <plan.icon className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                        {plan.popular && (
                          <span className="text-[11px] bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] animate-pulse">
                            Sinal Alpha Recomendado
                          </span>
                        )}
                      </div>
                      <div className="mt-2 md:mt-4">
                        {plan.originalPrice && (
                          <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                            <span className="text-lg line-through font-bold text-white/50">{plan.originalPrice}</span>
                            <span className="text-xs font-black text-white/50">MZN</span>
                          </div>
                        )}
                        <div className="flex items-center justify-center gap-2">
                          <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-primary' : 'text-white'}`}>{plan.price}</span>
                          <span className="text-muted-foreground text-sm font-bold uppercase mt-2">MZN</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-6 text-sm leading-relaxed px-4">{plan.description}</p>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col p-6 md:p-10 pt-4 border-t border-white/5">
                      <ul className="space-y-4 mb-10 flex-grow">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${plan.popular ? 'bg-primary' : 'bg-white/50'}`} />
                            </div>
                            <span className={`text-sm ${plan.popular ? 'text-white/90 font-medium' : 'text-muted-foreground'}`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Prazo</span>
                          <span className="text-xs text-white text-center font-mono">{plan.delivery}</span>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Pagamento</span>
                          <span className="text-xs text-white text-center font-mono capitalize">{plan.period}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleContact(plan)}
                        className={`group relative w-full flex items-center justify-center gap-2 font-bold h-14 rounded-xl text-sm uppercase tracking-widest overflow-hidden transition-transform hover:scale-[1.02] ${
                          plan.popular ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                        <span className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${plan.popular ? 'group-hover:text-white' : ''}`}>
                          {plan.buttonText}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          const priceVal = parseInt(plan.price.replace(/\./g, ''));
                          window.dispatchEvent(new CustomEvent('set-roi-investment', {
                            detail: { investment: priceVal }
                          }));
                        }}
                        className="w-full mt-3 flex items-center justify-center gap-1 font-bold h-10 rounded-xl text-xs uppercase tracking-widest text-primary/80 hover:text-primary transition-all border border-primary/20 hover:bg-primary/5 bg-transparent"
                      >
                        Simular Retorno (ROI) do Plano
                      </button>
                    </CardContent>
                  </Card>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;
