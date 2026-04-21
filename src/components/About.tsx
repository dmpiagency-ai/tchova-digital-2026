import { Target, Shield, CheckCircle, Heart, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useMemo } from 'react';

const About = () => {
  // Unique differentials with distinct visual styles
  const differentials = useMemo(() => [
    { 
      id: 'speed',
      icon: Zap, 
      label: 'Velocidade Letal', 
      description: 'Lançamos a sua ideia antes que a concorrência consiga reagir',
      color: 'from-brand-green to-emerald-500',
      pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)'
    },
    { 
      id: 'focus',
      icon: Target, 
      label: 'Engenharia de Conversão', 
      description: 'Estratégias focadas em quem realmente abre o bolso para comprar',
      color: 'from-primary to-purple-600',
      pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%)'
    },
    { 
      id: 'reliability',
      icon: Shield, 
      label: 'Disponibilidade Total', 
      description: 'Sua marca online 24/7, blindada contra falhas e instabilidades',
      color: 'from-amber-600 to-orange-600',
      pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15), transparent)'
    },
    { 
      id: 'respect',
      icon: Star, 
      label: 'Autoridade de Elite', 
      description: 'Design de alto luxo que impõe respeito e confiança imediata',
      color: 'from-brand-yellow to-brand-bright',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.1) 50%, transparent 50%)'
    },
    { 
      id: 'results',
      icon: CheckCircle, 
      label: 'Lucratividade Digital', 
      description: 'Ecossistemas desenhados para gerar lucro enquanto você descansa',
      color: 'from-teal-500 to-cyan-500',
      pattern: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.2), transparent)'
    },
    { 
      id: 'partnership',
      icon: Heart, 
      label: 'Parceiro de Guerra', 
      description: 'Não somos uma agência; somos o motor do seu crescimento',
      color: 'from-rose-500 to-pink-500',
      pattern: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)'
    }
  ], []);

  const handleCTA = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { 
        serviceType: 'general-consultation', 
        serviceData: { title: 'Consultoria de Escala', type: 'consultation', requiresLogin: false } 
      }
    }));
  }, []);

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-background/95 dark:bg-background/60 backdrop-blur-lg">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Manifesto Tchova</span>
          </div>
          <h2 className="readable-heading mb-4 tracking-tighter text-foreground uppercase">
            O seu negócio, <span className="text-primary italic">nosso</span> legado
          </h2>
          <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Somos o estúdio de alta performance em Moçambique. <span className="text-foreground font-bold">Fundimos engenharia e design de elite</span> para construir o seu império digital.
          </p>
        </div>

        {/* Differential Cards - 2x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16 px-2 sm:px-0">
          {differentials.map((item, index) => (
            <div
              key={item.id}
              data-reveal
              className={`group relative ${index % 3 === 0 ? 'reveal-slide-left' : index % 3 === 2 ? 'reveal-slide-right' : 'reveal-fade-scale'} reveal-delay-${index + 1}`}
            >
              <div className={`card-3d relative bg-gradient-to-br ${item.color} bg-opacity-10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 h-full border border-white/10 overflow-hidden`}
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))` }}
              >
                {/* Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{ background: item.pattern }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {item.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Hover Glow */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-12 border border-primary/20 overflow-hidden animate-on-scroll">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              {/* Stats Row */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                  <div className="text-3xl md:text-4xl font-black text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Projetos de Alto Nível</div>
                </div>
                <div className="text-center animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                  <div className="text-3xl md:text-4xl font-black text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Líderes de Setor</div>
                </div>
                <div className="text-center animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
                  <div className="text-3xl md:text-4xl font-black text-primary">3+</div>
                  <div className="text-sm text-muted-foreground">Anos na Fronteira</div>
                </div>
              </div>

              {/* Statement */}
              <p className="text-lg sm:text-xl font-medium text-foreground mb-8 max-w-xl mx-auto">
                Não criamos apenas sites. Construímos o <span className="text-primary font-bold">motor</span> que transporta a sua visão para o lucro real.
              </p>

              {/* CTA */}
              <div className="px-4">
                <Button
                  onClick={handleCTA}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-6 sm:px-10 lg:px-12 py-5 sm:py-6 lg:py-8 text-base sm:text-lg lg:text-xl font-black shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-105 uppercase tracking-widest"
                >
                  Tchovar meu negócio
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 animate-pulse" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
