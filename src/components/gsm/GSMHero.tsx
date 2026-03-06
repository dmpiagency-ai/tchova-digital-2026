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
  ChevronDown,
  PlayCircle
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
    { icon: <Zap className="w-5 h-5" />, text: 'Acesso Imediato' },
    { icon: <Shield className="w-5 h-5" />, text: 'Segurança Garantida' },
    { icon: <Clock className="w-5 h-5" />, text: 'Suporte Especializado' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ============================================ */}
      {/* BACKGROUND IMAGE */}
      {/* ============================================ */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772181938/tchova_bg_rental_dkuvji.png"
          alt="Tchova Rental Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
      </div>
      
      {/* ============================================ */}
      {/* BACKGROUND EFFECTS */}
      {/* ============================================ */}
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-primary/40 via-brand-green/30 to-transparent rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-tl from-brand-yellow/30 via-primary/25 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/15 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full animate-float"
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
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
            
          {/* Badge */}
          <div 
            className={`flex justify-center mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <Badge 
              variant="outline" 
              className="px-6 py-3 text-sm font-medium bg-white/10 backdrop-blur-xl rounded-full border-white/30"
            >
              <Sparkles className="w-4 h-4 mr-2 text-white animate-pulse" />
              <span className="text-white font-semibold">
                Ecossistema 360° Técnico GSM
              </span>
            </Badge>
          </div>

          {/* Headline */}
          <div 
            className={`text-center mb-10 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="block text-white">Alugue ferramentas GSM</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
                com segurança e velocidade
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Credenciais liberadas em <span className="text-primary font-semibold">segundos</span>, 
              API 24/7, suporte técnico especializado. 
              A plataforma mais confiável para técnicos GSM em Moçambique.
            </p>
          </div>

          {/* Features Pills */}
          <div 
            className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/20 transition-all duration-300 group"
              >
                <span className="text-white group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
                <span className="text-sm font-medium text-white">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row justify-center gap-6 mb-16 transition-all duration-700 delay-450 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              size="lg"
              onClick={onCtaClick}
              className="group relative h-16 px-10 text-lg font-bold rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={onToolsClick}
              className="h-16 px-10 text-lg font-semibold rounded-3xl border-2 border-white/40 bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-white/60 text-white transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center justify-center gap-3">
                Ver Ferramentas
                <ChevronDown className="w-5 h-5" />
              </span>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-700 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-3xl backdrop-blur-xl border transition-all duration-500 ${
                  activeStat === index 
                    ? 'bg-primary/20 border-primary/60 scale-105' 
                    : 'bg-white/10 border-white/30 hover:bg-white/20'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className={`mb-3 transition-colors ${activeStat === index ? 'text-primary' : 'text-white'}`}>
                    {stat.icon}
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-white">{stat.value}</span>
                  <span className="text-sm text-gray-200 mt-2">{stat.label}</span>
                </div>
                
                {/* Active Indicator */}
                {activeStat === index && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div 
            className={`flex flex-wrap justify-center items-center gap-8 mt-16 pt-12 border-t border-white/20 transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-3 text-gray-200">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Resposta em até 1 hora</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <div className="flex items-center gap-3 text-gray-200">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">100% Seguro e Auditado</span>
            </div>
            <div className="w-px h-6 bg-white/30" />
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-yellow text-brand-yellow" />
              ))}
              <span className="text-sm text-gray-200 font-medium">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/80" />
      </div>
    </section>
  );
};

export default GSMHero;
