import { Target, Clock, MessageCircle, Shield, CheckCircle, Heart, ArrowRight, Star, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';

const About = () => {
  // Unique differentials with distinct visual styles
  const differentials = [
    { 
      icon: Target, 
      label: 'Foco Total', 
      description: 'Dedicação exclusiva ao seu projeto',
      color: 'from-blue-500 to-cyan-500',
      pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent)'
    },
    { 
      icon: Clock, 
      label: 'Prazos Claros', 
      description: 'Entregas no tempo combinado',
      color: 'from-violet-500 to-purple-500',
      pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%)'
    },
    { 
      icon: MessageCircle, 
      label: 'Comunicação Direta', 
      description: 'Contato direto com especialista',
      color: 'from-green-500 to-emerald-500',
      pattern: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.15), transparent)'
    },
    { 
      icon: Shield, 
      label: 'Processo Organizado', 
      description: 'Metodologia testada e aprovada',
      color: 'from-amber-500 to-orange-500',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.1) 50%, transparent 50%)'
    },
    { 
      icon: CheckCircle, 
      label: 'Revisões Incluídas', 
      description: 'Ajustes até ficar perfeito',
      color: 'from-teal-500 to-cyan-500',
      pattern: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.2), transparent)'
    },
    { 
      icon: Heart, 
      label: 'Suporte Pós-Entrega', 
      description: 'Acompanhamento contínuo',
      color: 'from-rose-500 to-pink-500',
      pattern: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)'
    }
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Nossos Diferenciais</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-foreground">
            Por Que Nos <span className="text-primary">Escolher</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto">
            Diferenciais que fazem diferença no seu projeto
          </p>
        </div>

        {/* Differential Cards - 2x3 Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className={`relative bg-gradient-to-br ${item.color} bg-opacity-10 rounded-3xl p-6 h-full border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5`}
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
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
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
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-12 border border-primary/20 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              {/* Stats Row */}
              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Projetos Entregues</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Clientes Satisfeitos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-primary">3+</div>
                  <div className="text-sm text-muted-foreground">Anos de Experiência</div>
                </div>
              </div>

              {/* Statement */}
              <p className="text-lg sm:text-xl font-medium text-foreground mb-8 max-w-xl mx-auto">
                Soluções digitais pensadas para negócios que querem <span className="text-primary font-bold">crescer</span>
              </p>

              {/* CTA */}
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8 py-6 font-bold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar Conosco
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
