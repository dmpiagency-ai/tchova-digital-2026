import React, { useRef } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TiltCard } from '@/components/ui/TiltCard';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { EliteRadar, ElitePulse, EliteCore } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

// Plans with detailed feature lists
const PLANS = [
  {
    id: 'start',
    name: "Plano Maway (Start)",
    icon: EliteCore,
    price: "5.000",
    originalPrice: "7.000",
    savings: "2.000",
    period: "único",
    popular: false,
    description: "Pra quem tá a começar e quer uma marca de respeito e presença básica",
    delivery: "3 a 5 dias úteis",
    ideal: "Pequenos negócios e empreendedores",
    buttonText: "Quero esse maway",
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
    name: "Plano Business (Pra Bater)",
    icon: ElitePulse,
    price: "15.000",
    originalPrice: "20.000",
    savings: "5.000",
    period: "único",
    popular: true,
    description: "Pra quem quer ver o negócio bater maningue e vender online",
    delivery: "7 a 10 dias úteis",
    ideal: "Negócios que querem leads e vendas",
    buttonText: "Bora vender online",
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
    name: "Eco 360 (Tchova Total)",
    icon: EliteRadar,
    price: "35.000",
    originalPrice: "45.000",
    savings: "10.000",
    period: "ajustável",
    popular: false,
    description: "Solução completa 360 para dominar o mercado de vez",
    delivery: "Sob cronograma do projeto",
    ideal: "Empresas, startups e instituições",
    buttonText: "Tchovar tudo",
    features: [
      "Tudo do Plano Business +",
      "Site profissional completo",
      "Sistema de pagamentos online",
      "Carrinho de compras",
      "Site tipo plataforma institucional",
      "Painel de gestão (admin)",
      "Integração com APIs",
      "Possibilidade de IA (chat, automação, formulários)",
      "Desenvolvimento de apps mobile",
      "Tráfego pago focado no site e produtos",
      "Estratégia de crescimento digital",
    ],
  },
];

const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Header Entrance
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

    // 2. Coordinated Card Entrance
    if (gridRef.current) {
      gsap.from(gridRef.current.children, {
        y: 80,
        scale: 0.9,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
        }
      });
    }
  }, { scope: containerRef });

  const handleContact = (plan: any) => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { 
        serviceType: 'pricing-plan', 
        serviceData: { title: `Plano ${plan.name}`, type: 'pricing', requiresLogin: false } 
      }
    }));
  };

  return (
    <section ref={containerRef} id="planos" className="py-20 relative overflow-hidden bg-background/95 border-t border-white/5 perspective-1000">
      
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
            <EliteRadar className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Pricing Model</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            Investimento <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Consciente</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground/80 font-light leading-relaxed">
            Escolha como queres fazer o teu negócio <span className="text-white font-semibold italic">bater</span> hoje. Estruturas escaláveis para qualquer estágio.
          </p>
        </div>

        {/* Pricing Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan) => (
            <TiltCard 
              key={plan.id} 
              className="p-0 overflow-visible border-0 rounded-3xl bg-transparent h-full" 
              maxTilt={5} 
              glowOpacity={plan.popular ? 0.4 : 0.1}
              glowColor={plan.popular ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255, 255, 255, 0.2)'}
            >
              <Card
                className={`relative overflow-hidden h-full flex flex-col ${
                  plan.popular 
                    ? "border-primary/50 bg-black/80 backdrop-blur-3xl shadow-[0_0_50px_-15px_rgba(34,197,94,0.3)]" 
                    : "border-white/10 bg-black/40 backdrop-blur-2xl"
                }`}
              >
                {/* Popular Plan Top Gradient Line */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-brand-green to-primary" />
                )}

                <CardHeader className="text-center p-10 pb-6">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl border ${plan.popular ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/70'}`}>
                      <plan.icon className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                      {plan.name}
                    </h3>
                    
                    {plan.popular && (
                      <span className="text-[11px] bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full font-black uppercase tracking-widest animate-pulse">
                        Sinal Alpha Recomendado
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                        <span className="text-lg line-through font-bold text-white/50">{plan.originalPrice}</span>
                        <span className="text-xs font-black text-white/50">MZN</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-5xl font-black tracking-tighter ${plan.popular ? 'text-primary' : 'text-white'}`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-sm font-bold uppercase mt-2">MZN</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mt-6 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col p-10 pt-4 border-t border-white/5">
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${plan.popular ? 'bg-primary' : 'bg-white/50'}`} />
                        </div>
                        <span className={`text-sm ${plan.popular ? 'text-white/90 font-medium' : 'text-muted-foreground'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Pricing Info Footer */}
                  <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5">
                    <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Prazo</span>
                      <span className="text-xs text-white text-center">{plan.delivery}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Pagamento</span>
                      <span className="text-xs text-white text-center">{plan.period}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleContact(plan)}
                    className={`group relative w-full flex items-center justify-center gap-2 font-bold h-14 rounded-xl text-sm uppercase tracking-widest overflow-hidden transition-transform hover:scale-[1.02] ${
                      plan.popular 
                        ? 'bg-white text-black' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <span className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${plan.popular ? 'group-hover:text-white' : ''}`}>
                      {plan.buttonText}
                      <ArrowRight className={`w-4 h-4 transition-transform ${plan.popular ? 'group-hover:translate-x-1' : ''}`} />
                    </span>
                  </button>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;
