import React, { useRef } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check, Clock, Target } from "lucide-react";
import { TiltCard } from '@/components/ui/TiltCard';
import { gsap, useGSAP } from "@/lib/gsapConfig";

// Plans with detailed feature lists
const PLANS = [
  {
    id: 'start',
    name: "Plano Maway (Start)",
    emoji: "🎯",
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
    emoji: "⚡",
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
    emoji: "💎",
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
      y: 30,
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
        y: 50,
        scale: 0.9,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
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
    <section ref={containerRef} id="planos" className="py-24 relative overflow-hidden bg-background/95 dark:bg-background/60 backdrop-blur-lg">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 uppercase tracking-tighter">
            <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent drop-shadow-xl">
              Investimento Consciente
            </span>
          </h2>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Escolha como queres fazer o teu negócio <span className="text-foreground font-black italic">bater</span> hoje.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PLANS.map((plan, index) => (
            <TiltCard 
              key={plan.id} 
              className="p-0 overflow-visible border-0 rounded-2xl bg-transparent h-full" 
              maxTilt={8} 
              glowOpacity={plan.popular ? 0.3 : 0.15}
              glowColor={plan.popular ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.2)'}
            >
              <Card
                className={`relative overflow-hidden h-full flex flex-col ${
                  plan.popular 
                    ? "border-green-500/50 shadow-2xl bg-gradient-to-b from-green-500/10 to-transparent" 
                    : "border-border/50 dark:bg-white/5 bg-slate-50/50 backdrop-blur-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                )}

                <CardHeader className="text-center pb-2 p-6">
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <span className="text-3xl mb-2">{plan.emoji}</span>
                    <h3 className="text-xl font-black dark:text-white text-slate-900 uppercase tracking-tight">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span className="text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">
                        Mais Popular
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mb-1 opacity-50">
                        <span className="text-lg line-through font-bold">{plan.originalPrice}</span>
                        <span className="text-xs font-black">MZN</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-1 scale-110">
                      <span className="text-4xl sm:text-5xl font-black text-green-500 tracking-tighter">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground text-xs font-bold uppercase">MZN</span>
                    </div>
                    
                    {plan.savings && (
                      <div className="mt-4 flex justify-center">
                        <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                          Poupas {plan.savings} MT
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4 font-medium leading-relaxed">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-4 flex-grow flex flex-col">
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs font-medium">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3 mb-6 pt-6 border-t dark:border-white/10 border-slate-200">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Velocidade: {plan.delivery}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      <Target className="w-4 h-4 text-primary" />
                      <span>Foco: {plan.ideal}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleContact(plan)}
                    className={`w-full font-black py-7 text-sm rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 uppercase tracking-widest ${
                      plan.popular 
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/30" 
                        : "dark:bg-white dark:text-black dark:hover:bg-white/90 bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-block dark:bg-white/5 bg-slate-50 backdrop-blur-md rounded-2xl px-8 py-4 border dark:border-white/10 border-slate-200">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Pagamento seguro após validação técnica do projeto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
