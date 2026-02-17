import { MessageCircle, MessageSquare, Settings, Rocket, ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';

const HowItWorks = () => {
  // 3 steps with unique visual styles
  const steps = [
    { 
      icon: MessageSquare, 
      label: 'Conversa', 
      description: 'Entendemos sua necessidade',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      number: '01'
    },
    { 
      icon: Settings, 
      label: 'Desenvolvimento', 
      description: 'Criamos sua solução',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      number: '02'
    },
    { 
      icon: Rocket, 
      label: 'Entrega', 
      description: 'Lançamos juntos',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      number: '03'
    },
  ];

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Olá! Quero começar um projeto.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-green-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Processo Simples</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-foreground">
            Como <span className="text-primary">Funciona</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto">
            Da ideia ao resultado em 3 passos
          </p>
        </div>

        {/* Steps Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="group relative"
              >
                {/* Card */}
                <div className={`relative ${step.bgColor} ${step.borderColor} border rounded-3xl p-6 h-full transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5`}>
                  {/* Step Number */}
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.label}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>

                {/* Arrow Connector - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-8 py-6 font-bold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Resposta em até 1 hora</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
