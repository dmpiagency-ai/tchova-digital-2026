// ============================================
// GSM RENTAL PAINEL - HERO SECTION
// Design Liquid Glass Moderno
// ============================================

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
  Globe,
  ChevronDown
} from 'lucide-react';

interface GSMHeroProps {
  onCtaClick: () => void;
  onToolsClick: () => void;
}

const GSMHero: React.FC<GSMHeroProps> = ({ onCtaClick, onToolsClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStat, setActiveStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '2.5K+', label: 'Técnicos Ativos', icon: <Users className="w-4 h-4" /> },
    { value: '99.9%', label: 'Uptime Garantido', icon: <Globe className="w-4 h-4" /> },
    { value: '< 30s', label: 'Ativação', icon: <Zap className="w-4 h-4" /> }
  ];

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: 'Credenciais Instantâneas' },
    { icon: <Shield className="w-5 h-5" />, text: '100% Seguro' },
    { icon: <Clock className="w-5 h-5" />, text: 'Suporte 24/7' }
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* ============================================ */}
      {/* BACKGROUND IMAGE */}
      {/* ============================================ */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772181938/tchova_bg_rental_dkuvji.png"
          alt="Tchova Rental Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* ============================================ */}
      {/* BACKGROUND EFFECTS */}
      {/* ============================================ */}
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 via-brand-green/20 to-transparent rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-tl from-brand-yellow/20 via-primary/15 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Badge */}
          <div 
            className={`flex justify-center mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 via-brand-green/10 to-primary/10 border-primary/30 backdrop-blur-xl rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
              <span className="bg-gradient-to-r from-primary via-brand-green to-primary bg-clip-text text-transparent">
                Ecossistema 360° Técnico GSM
              </span>
            </Badge>
          </div>

          {/* Headline */}
          <div 
            className={`text-center mb-8 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="block text-foreground">Alugue ferramentas GSM</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent">
                com segurança e velocidade
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Credenciais liberadas em <span className="text-primary font-semibold">segundos</span>, 
              API 24/7, suporte técnico especializado. 
              A plataforma mais confiável para técnicos GSM em Moçambique.
            </p>
          </div>

          {/* Features Pills */}
          <div 
            className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <span className="text-primary group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
                <span className="text-sm font-medium text-foreground/80">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row justify-center gap-4 mb-12 transition-all duration-700 delay-450 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              size="lg"
              onClick={onCtaClick}
              className="group relative h-14 px-8 text-lg font-bold rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onToolsClick}
              className="h-14 px-8 text-lg font-semibold rounded-2xl border-2 border-primary/30 bg-white/5 backdrop-blur-xl hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Ver Ferramentas
                <ChevronDown className="w-5 h-5" />
              </span>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-3 gap-4 max-w-2xl mx-auto transition-all duration-700 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
                  activeStat === index 
                    ? 'bg-primary/10 border-primary/40 scale-105' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className={`mb-2 transition-colors ${activeStat === index ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stat.icon}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-foreground">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{stat.label}</span>
                </div>
                
                {/* Active Indicator */}
                {activeStat === index && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div 
            className={`flex flex-wrap justify-center items-center gap-6 mt-12 pt-8 border-t border-white/10 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">Resposta em até 1 hora</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">100% Seguro e Auditado</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary/60" />
      </div>
    </section>
  );
};

export default GSMHero;
