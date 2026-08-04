import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TiltCard } from '@/components/ui/TiltCard';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { EliteRadar, ElitePulse, EliteCore } from '@/components/ui/EliteIcons';
import { isLowEnd } from '@/hooks/useLowEnd';

gsap.registerPlugin(ScrollTrigger);

type Plan = {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  icon: React.ElementType;
  price: string;
  period: string;
  popular: boolean;
  description: string;
  buttonText: string;
  includesText?: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    id: 'tchovar-start',
    name: "TCHOVAR — START",
    badge: "Boost Lançamento",
    subtitle: "PARA LANÇAR O NEGÓCIO COM IMAGEM E VENDAS",
    icon: EliteCore,
    price: "4.990",
    period: "50% no arranque / 50% na entrega",
    popular: false,
    description: "Solução rápida para entrar no mercado com imagem profissional e captar os primeiros clientes.",
    buttonText: "Falar com Especialista",
    features: [
      "Criação de Logotipo e Guia Visual Elementar",
      "Otimização de Perfil (Bio, Destaques, Templates)",
      "Página de Destino (Landing Page) Direta para WhatsApp",
      "Campanha de Anúncios Intensiva (4 Dias)",
    ],
  },
  {
    id: 'tchovar-escala',
    name: "TCHOVAR — ESCALA",
    badge: "Vendedor Online 24h",
    subtitle: "PARA ATRAIR CLIENTES TODOS OS DIAS",
    icon: ElitePulse,
    price: "14.500",
    period: "50% no arranque / 50% na entrega",
    popular: true,
    description: "Estrutura web avançada com anúncios contínuos para transformar visitantes em compradores.",
    buttonText: "Falar com Especialista",
    includesText: "Tudo no plano START, e ainda:",
    features: [
      "Website Completo ou Loja Online Profissional",
      "Integração de Pagamentos Locais (M-Pesa/e-Mola)",
      "Gestão de Tráfego Contínua (Meta & Google Ads)",
      "Gestão Estratégica de Redes Sociais (30 Dias)",
      "Relatório Mensal de Performance e Vendas",
    ],
  },
  {
    id: 'tchovar-evolucao',
    name: "TCHOVAR — EVOLUÇÃO",
    badge: "Sistema 360° & Automação",
    subtitle: "PARA ORGANIZAR E ESCALAR A OPERAÇÃO",
    icon: EliteRadar,
    price: "35.000",
    period: "50% no arranque / 50% na entrega",
    popular: false,
    description: "Ecossistema digital completo com automação de processos para empresas em forte expansão.",
    buttonText: "Falar com Especialista",
    includesText: "Tudo no plano ESCALA, e ainda:",
    features: [
      "Auditoria 360° da Marca e Funis de Venda",
      "Plataforma Digital Customizada de Alta Performance",
      "Automação Inteligente de Atendimento no WhatsApp",
      "Sistema de Captação e Extração de Leads B2B/B2C",
      "Produção Audiovisual (Vídeo Institucional Premium)",
    ],
  },
];

const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Mobile Carousel Refs & State
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [selectedModalPlan, setSelectedModalPlan] = useState<Plan | null>(null);

  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Lock background scroll when Bottom Sheet Modal is open
  useEffect(() => {
    if (selectedModalPlan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedModalPlan]);

  // Scroll listener for dynamic fade overlays & index update
  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 8);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 8);

    const cardWidth = clientWidth * 0.85;
    const index = Math.min(
      PLANS.length - 1,
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

  // Touch Tolerance Handler: differentiates clean taps from drag/swipes
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handlePointerUp = (e: React.PointerEvent, plan: Plan) => {
    if (!pointerStartRef.current) return;
    const dx = Math.abs(e.clientX - pointerStartRef.current.x);
    const dy = Math.abs(e.clientY - pointerStartRef.current.y);
    const dist = Math.hypot(dx, dy);
    const duration = Date.now() - pointerStartRef.current.time;

    pointerStartRef.current = null;

    // Clean tap: <20px displacement and <500ms duration
    if (dist < 20 && duration < 500) {
      setSelectedModalPlan(plan);
    }
  };

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
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
    });
  }, { scope: containerRef });

  const handleContact = (plan: Plan) => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: {
        serviceType: 'pricing-plan',
        serviceData: { title: `Plano ${plan.name}`, type: 'pricing', requiresLogin: false }
      }
    }));
  };

  return (
    <section ref={containerRef} id="planos" className="py-12 md:py-16 lg:py-20 relative overflow-hidden bg-background/95 border-t border-white/5 perspective-1000 scroll-mt-6">

      {/* Background glows — contained & dimmed on mobile to prevent card bleed */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-green/[0.04] md:bg-brand-green/10 rounded-full blur-[100px] md:blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/[0.04] md:bg-primary/10 rounded-full blur-[100px] md:blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-8 md:mb-10 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3 backdrop-blur-md">
            <EliteRadar className="w-4 h-4 text-primary" />
            <span className="text-fluid-sm font-bold text-primary uppercase tracking-widest font-nunito">Planos</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tighter text-white uppercase font-nunito">
            ESCOLHE O QUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">PRECISAS.</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-normal leading-relaxed font-nunito max-w-2xl">
            Cada negócio está numa fase diferente. Escolhe o plano que faz sentido para ti agora.
            <span className="block mt-1 text-white/70 text-xs md:text-sm font-semibold">Sem compromisso. Fala connosco primeiro.</span>
          </p>
        </div>

        {/* ─── MOBILE: Native Tailwind Carousel with Touch Tolerance & Bottom Sheet ──── */}
        <div className="md:hidden relative">

          {/* Plan label + counter */}
          <div className="flex items-center justify-between mb-4 px-0.5">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${PLANS[selectedIndex]?.popular ? 'bg-primary' : 'bg-white/40'}`} />
              <span className="text-[10px] font-black tracking-[0.2em] text-white/70 uppercase">
                {PLANS[selectedIndex]?.name}
              </span>
              {PLANS[selectedIndex]?.popular && (
                <span className="text-[8px] font-black text-primary uppercase tracking-widest border border-primary/40 px-1.5 py-0.5 rounded-full">
                  Mais Escolhido
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

          {/* Carousel container */}
          <div className="relative -mx-6">
            {/* Visual Fade Left */}
            <div className={`absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Left Navigation Icon */}
            <button
              onClick={scrollPrev}
              disabled={!showLeftFade}
              aria-label="Plano anterior"
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
              aria-label="Próximo plano"
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
              {PLANS.map((plan, index) => (
                <div
                  key={plan.id}
                  className="flex-[0_0_85%] min-w-0 snap-center transition-all duration-300"
                  onPointerDown={handlePointerDown}
                  onPointerUp={(e) => handlePointerUp(e, plan)}
                >
                  <div
                    className={`relative border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                      index === selectedIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-70 scale-[0.98]'
                    } ${
                      plan.popular
                        ? 'bg-primary/5 border-primary/40 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]'
                        : index === selectedIndex
                          ? 'bg-card border-white/20'
                          : 'bg-card/70 border-white/[0.08]'
                    }`}
                  >

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
                          <div className={`text-2xl font-black tracking-tight ${plan.popular ? 'text-primary' : 'text-white'}`}>
                            {plan.price} <span className="text-xs font-bold text-white/40">MZN</span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-1">
                        {plan.name}
                      </h3>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md mb-2">
                        {plan.badge}
                      </span>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-2 leading-tight">{plan.subtitle}</p>
                      <p className="text-xs text-white/80 leading-relaxed font-medium mb-1 line-clamp-2">{plan.description}</p>
                    </div>

                    {/* Features preview */}
                    <div className="px-6 pb-4 border-t border-white/[0.06] pt-4">
                      {plan.includesText ? (
                        <div className="mb-3 text-[10px] font-bold text-white/80 uppercase tracking-widest border-l-2 border-primary/50 pl-2">
                          {plan.includesText}
                        </div>
                      ) : (
                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">Entregáveis Base:</p>
                      )}
                      <ul className="space-y-2.5">
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary" />
                            </div>
                            <span className="text-xs text-zinc-300 leading-snug font-normal line-clamp-1">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-[10px] font-bold text-primary tracking-wider uppercase pt-1">
                            + {plan.features.length - 3} outros entregáveis (Toque para ver tudo)
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-white/[0.06]">
                      <div className="mb-4 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center">
                        <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Condição de Pagamento</div>
                        <div className="text-xs text-primary font-mono font-bold">{plan.period}</div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContact(plan);
                        }}
                        className={`w-full flex items-center justify-center gap-2 font-black h-12 rounded-xl text-[11px] uppercase tracking-widest transition-transform active:scale-[0.98] ${
                          plan.popular
                            ? 'bg-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                            : 'bg-white/10 text-white border border-white/10'
                        }`}
                      >
                        {plan.buttonText}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls (Indicators only) */}
          <div className="flex items-center justify-center mt-4 px-0.5">
            <div className="flex items-center gap-2">
              {PLANS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para plano ${i + 1}`}
                  className={`rounded-full transition-all duration-300 no-min-size ${
                    i === selectedIndex
                      ? 'w-7 h-2 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ─── DESKTOP: Grid layout ──────────────────────────────────────── */}
        <div className="hidden md:block w-full max-w-7xl mx-auto">
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {PLANS.map((plan) => (
              <div key={plan.id} className="h-full">
                <TiltCard
                  className="p-0 overflow-visible border-0 rounded-3xl bg-transparent h-full"
                  maxTilt={5}
                  glowOpacity={plan.popular ? 0.4 : 0.1}
                  glowColor={plan.popular ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 255, 255, 0.2)'}
                >
                  <Card className={`relative overflow-hidden h-full flex flex-col justify-between ${
                    plan.popular
                      ? "border-primary/50 bg-primary/5 backdrop-blur-3xl shadow-[0_0_50px_-15px_rgba(34,197,94,0.3)]"
                      : "border-white/10 bg-card/60 backdrop-blur-2xl"
                  }`}>
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-brand-green to-primary" />
                    )}

                    <CardHeader className="text-center p-6 md:p-8 pb-4">
                      <div className="flex flex-col items-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl border ${plan.popular ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/70'}`}>
                          <plan.icon className="w-7 h-7" />
                        </div>

                        {plan.popular && (
                          <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-3.5 py-1 rounded-full font-black uppercase tracking-[0.2em] animate-pulse mb-1">
                            Mais Escolhido
                          </span>
                        )}

                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                        
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md">
                          {plan.badge}
                        </span>

                        <p className="text-xs text-white/50 uppercase tracking-widest font-bold max-w-xs">{plan.subtitle}</p>
                      </div>

                      <div className="mt-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-primary' : 'text-white'}`}>{plan.price}</span>
                          <span className="text-muted-foreground text-sm font-bold uppercase mt-2">MZN</span>
                        </div>
                      </div>

                      <p className="text-zinc-300 mt-4 text-sm leading-relaxed font-normal">{plan.description}</p>
                    </CardHeader>

                    <CardContent className="flex-grow flex flex-col p-6 md:p-8 pt-4 border-t border-white/5">
                      {plan.includesText ? (
                        <div className="mb-4 text-xs font-bold text-white/80 uppercase tracking-widest border-l-2 border-primary/50 pl-3">
                          {plan.includesText}
                        </div>
                      ) : (
                        <p className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Entregáveis Base:</p>
                      )}
                      <ul className="space-y-3.5 mb-8 flex-grow">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm text-zinc-200 leading-snug font-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-0.5">Condição de Pagamento</span>
                        <span className="text-xs text-primary font-mono font-bold">{plan.period}</span>
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
                    </CardContent>
                  </Card>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── BOTTOM SHEET MODAL ────────────────────────────────────────── */}
      {selectedModalPlan && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedModalPlan(null)}
        >
          <div
            className="w-full sm:max-w-lg bg-zinc-950 border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative animate-in slide-in-from-bottom-5 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedModalPlan(null)}
              aria-label="Fechar detalhes"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Pull Handle (Mobile) */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl border ${selectedModalPlan.popular ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/70'}`}>
                <selectedModalPlan.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                  {selectedModalPlan.badge}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                  {selectedModalPlan.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-white/60 uppercase tracking-widest font-bold mb-3">{selectedModalPlan.subtitle}</p>
            <p className="text-sm text-zinc-300 leading-relaxed font-normal mb-6">{selectedModalPlan.description}</p>

            <div className="flex items-baseline gap-2 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-3xl font-black text-white">{selectedModalPlan.price}</span>
              <span className="text-xs font-bold text-white/50 uppercase">MZN</span>
              <span className="text-[11px] text-primary font-mono ml-auto font-bold">{selectedModalPlan.period}</span>
            </div>

            <div className="mb-6">
              {selectedModalPlan.includesText ? (
                <div className="mb-3 text-xs font-bold text-white/80 uppercase tracking-widest border-l-2 border-primary/50 pl-3">
                  {selectedModalPlan.includesText}
                </div>
              ) : (
                <p className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Entregáveis Incluídos:</p>
              )}
              <ul className="space-y-3">
                {selectedModalPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm text-zinc-200 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                const plan = selectedModalPlan;
                setSelectedModalPlan(null);
                handleContact(plan);
              }}
              className="w-full flex items-center justify-center gap-2 font-black h-12 rounded-xl text-xs uppercase tracking-widest bg-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-[0.98] transition-transform"
            >
              {selectedModalPlan.buttonText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default Pricing;
