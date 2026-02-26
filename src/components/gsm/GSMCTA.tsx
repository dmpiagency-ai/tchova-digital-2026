// ============================================
// GSM RENTAL PAINEL - CTA SECTION
// Design Liquid Glass Moderno
// Final Call to Action
// ============================================

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Phone,
  MessageCircle,
  Zap,
  Star
} from 'lucide-react';

interface GSMCTAProps {
  onSignUp?: () => void;
  onContact?: () => void;
}

const GSMCTA: React.FC<GSMCTAProps> = ({
  onSignUp,
  onContact
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: 'Ativação em segundos' },
    { icon: <Shield className="w-5 h-5" />, text: 'Pagamento seguro' },
    { icon: <Clock className="w-5 h-5" />, text: 'Suporte 24/7' },
    { icon: <Users className="w-5 h-5" />, text: '2.5K+ técnicos ativos' }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-green/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Badge */}
          <Badge className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Comece Gratuitamente
          </Badge>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground mb-6 leading-tight">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-primary via-brand-green to-primary bg-clip-text text-transparent">
              Elevar
            </span>
            <br />
            seu Trabalho GSM?
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Junte-se a milhares de técnicos que já estão economizando tempo 
            e aumentando sua produtividade com nossas ferramentas GSM.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="text-primary">{benefit.icon}</span>
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green shadow-lg shadow-primary/25 group"
              onClick={onSignUp}
            >
              <Star className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Criar Conta Grátis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-bold rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 group"
              onClick={onContact}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-brand-yellow fill-brand-yellow"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.9/5 de 500+ avaliações
              </span>
            </div>

            {/* Guarantee */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Garantia de satisfação ou seu dinheiro de volta</span>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="hidden lg:block">
          {/* Left Card */}
          <div className={`absolute left-8 top-1/3 w-64 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Aluguel Ativado</p>
                <p className="text-xs text-muted-foreground">Agora mesmo</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              "Ferramenta funcionando perfeitamente!"
            </p>
          </div>

          {/* Right Card */}
          <div className={`absolute right-8 bottom-1/3 w-64 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">+150 Técnicos Hoje</p>
                <p className="text-xs text-muted-foreground">Ativos nas últimas 24h</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-brand-green border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-xs font-medium">
                +146
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default GSMCTA;
