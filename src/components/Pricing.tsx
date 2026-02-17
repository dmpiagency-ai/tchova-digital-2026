import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check, Clock, Target } from "lucide-react";
import { env } from "@/config/env";

// Plans with detailed feature lists
const PLANS = [
  {
    name: "Start",
    emoji: "🔰",
    price: "5.000",
    originalPrice: "7.000",
    savings: "2.000",
    period: "único",
    popular: false,
    description: "Para quem precisa começar com uma marca profissional e presença básica",
    delivery: "3 a 5 dias úteis",
    ideal: "Pequenos negócios e empreendedores individuais",
    buttonText: "Quero começar agora",
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
    name: "Business",
    emoji: "🚀",
    price: "15.000",
    originalPrice: "20.000",
    savings: "5.000",
    period: "único",
    popular: true,
    description: "Para negócios que querem vender e captar clientes online",
    delivery: "7 a 10 dias úteis",
    ideal: "Negócios que querem gerar leads e vendas",
    buttonText: "Quero vender online",
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
    name: "Pro / Avançado",
    emoji: "👑",
    price: "35.000",
    originalPrice: "45.000",
    savings: "10.000",
    period: "ajustável",
    popular: false,
    description: "Para empresas que querem escalar e automatizar",
    delivery: "Sob cronograma do projeto",
    ideal: "Empresas, startups e instituições",
    buttonText: "Quero escalar meu negócio",
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
  const handleContact = (plan: typeof PLANS[0]) => {
    const message = encodeURIComponent(`Olá! Tenho interesse no plano ${plan.name} (${plan.price} MZN). Podem me explicar mais detalhes?`);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <section id="planos" className="py-20 relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Impact Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
              Planos para Seu Negócio
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto font-medium">
            Escolha o pacote ideal para suas necessidades
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular 
                  ? "border-green-500/50 shadow-xl bg-gradient-to-b from-green-500/10 to-transparent" 
                  : "border-white/10 bg-white/95 dark:bg-card/95"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              )}

              <CardHeader className="text-center pb-2">
                {/* Plan Name with Emoji */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{plan.emoji}</span>
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      Mais Popular
                    </span>
                  )}
                </div>
                
                {/* Price with Persuasion */}
                <div className="mt-2">
                  {/* Original Price - Strikethrough */}
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-lg text-gray-400 line-through">
                        {plan.originalPrice}
                      </span>
                      <span className="text-xs text-gray-500">MT</span>
                    </div>
                  )}
                  
                  {/* Current Price */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-green-500">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">MZN</span>
                  </div>
                  
                  {/* Savings Badge */}
                  {plan.savings && (
                    <div className="mt-2 flex justify-center">
                      <span className="text-xs bg-green-500/20 text-green-600 px-3 py-1 rounded-full font-bold">
                        Economiza {plan.savings} MT
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-4">
                {/* Features List */}
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Delivery & Ideal For */}
                <div className="flex flex-col gap-2 mb-4 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Entrega: {plan.delivery}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Target className="w-4 h-4" />
                    <span>Ideal: {plan.ideal}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleContact(plan)}
                  className={`w-full font-bold py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                    plan.popular 
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20" 
                      : "bg-foreground hover:bg-foreground/90 text-background"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Note */}
        <div className="text-center mt-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 max-w-xl mx-auto border border-white/10">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Pagamento apenas após conversa e definição clara do projeto.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
