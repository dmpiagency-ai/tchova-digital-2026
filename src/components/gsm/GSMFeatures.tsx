// ============================================
// GSM RENTAL PAINEL - FEATURES SECTION
// Design Liquid Glass Moderno
// ============================================

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
  Zap,
  Shield,
  ArrowRight,
  Clock,
  Key,
  Globe,
  Lock,
  RefreshCw,
  CheckCircle
} from 'lucide-react';

interface GSMFeaturesProps {
  onFeatureClick?: (featureId: string) => void;
}

const GSMFeatures: React.FC<GSMFeaturesProps> = ({ onFeatureClick }) => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 'instant',
      icon: <Zap className="w-7 h-7" />,
      title: 'Credenciais Instantâneas',
      description: 'Liberação automática em segundos, sem intervenção manual. Comece a usar imediatamente após a confirmação do pagamento.',
      gradient: 'from-primary to-brand-green',
      bgGradient: 'from-primary/10 to-brand-green/5',
      borderColor: 'border-primary/30',
      benefits: ['Ativação < 30s', 'Sem espera', 'Acesso imediato']
    },
    {
      id: 'security',
      icon: <Shield className="w-7 h-7" />,
      title: 'Segurança & Auditoria',
      description: 'Todas as transações são registradas e auditadas. Seus dados e credenciais protegidos com criptografia de ponta.',
      gradient: 'from-brand-yellow to-accent-light',
      bgGradient: 'from-brand-yellow/10 to-accent-light/5',
      borderColor: 'border-brand-yellow/30',
      benefits: ['Criptografia AES', 'Logs completos', '2FA disponível']
    },
    {
      id: 'api',
      icon: <ArrowRight className="w-7 h-7" />,
      title: 'API 24/7',
      description: 'Integre com seus sistemas via API REST. Disponibilidade garantida com uptime de 99.9% e suporte técnico dedicado.',
      gradient: 'from-brand-bright to-brand-green',
      bgGradient: 'from-brand-bright/10 to-brand-green/5',
      borderColor: 'border-brand-bright/30',
      benefits: ['REST API', '99.9% uptime', 'Webhooks']
    }
  ];

  const additionalFeatures = [
    { icon: <Clock className="w-5 h-5" />, text: 'Suporte 24/7' },
    { icon: <Key className="w-5 h-5" />, text: 'Acesso Multi-dispositivo' },
    { icon: <Globe className="w-5 h-5" />, text: 'Cobertura Global' },
    { icon: <Lock className="w-5 h-5" />, text: 'Pagamento Seguro' },
    { icon: <RefreshCw className="w-5 h-5" />, text: 'Renovação Fácil' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'Garantia de Qualidade' }
  ];

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-primary/50 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-brand-yellow/50 to-transparent" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            Por que escolher a Tchova?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Tudo que você precisa em{' '}
            <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
              um só lugar
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa para técnicos GSM com ferramentas profissionais, 
            suporte especializado e a melhor experiência do mercado.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              data-index={index}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-500 ${
                visibleCards.has(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              } ${hoveredCard === index ? 'scale-[1.02]' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => onFeatureClick?.(feature.id)}
            >
              {/* Card Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-50`} />
              <div className="absolute inset-0 backdrop-blur-xl" />
              
              {/* Border Gradient */}
              <div className={`absolute inset-0 rounded-xl border ${feature.borderColor} group-hover:border-opacity-60 transition-opacity`} />
              
              {/* Content */}
              <div className="relative p-6 lg:p-8">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-foreground/80 border border-white/10"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300`}>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl" />
          <div className="relative backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {additionalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-default"
                >
                  <span className="text-primary mb-2 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </span>
                  <span className="text-sm font-medium text-foreground/80">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GSMFeatures;
