import React, { useCallback, useMemo, useRef } from 'react';
import { MessageSquare, Settings, Rocket, ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // 3 steps with unique visual styles
  const steps = useMemo(() => [
    { 
      id: 'plan',
      icon: MessageSquare, 
      label: 'Diagnóstico Letal', 
      description: 'Ouvimos as tuas dores e traçamos o plano de ataque sem falhas',
      color: 'from-brand-green to-emerald-500',
      bgColor: 'bg-brand-green/5',
      borderColor: 'border-brand-green/20',
      number: '01'
    },
    { 
      id: 'execute',
      icon: Settings, 
      label: 'Arquitetura de Elite', 
      description: 'Construímos o teu motor de vendas com engenharia de ponta',
      color: 'from-primary to-purple-600',
      bgColor: 'bg-primary/5',
      borderColor: 'border-primary/20',
      number: '02'
    },
    { 
      id: 'launch',
      icon: Rocket, 
      label: 'Domínio de Mercado', 
      description: 'Lançamos e escalamos até ao topo do teu setor',
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-600/5',
      borderColor: 'border-amber-600/20',
      number: '03'
    },
  ], []);

  useGSAP(() => {
    // 1. Header Reveal
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

    // 2. Coordinated Staggered Reveal of Steps
    if (stepsRef.current) {
      gsap.from(stepsRef.current.children, {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 80%',
        }
      });
    }

    // 3. Subtle floating animation for cards
    if (stepsRef.current) {
      gsap.to(stepsRef.current.querySelectorAll('.how-step-card'), {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.3,
          from: 'center'
        }
      });
    }
  }, { scope: containerRef });

  const handleCTA = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { 
        serviceType: 'how-it-works', 
        serviceData: { title: 'Iniciar Ecossistema', type: 'start', requiresLogin: false } 
      }
    }));
  }, []);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const onCardMouseEnter = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const glare = card.querySelector('.step-glare');
    gsap.to(card, { scale: 1.05, borderColor: 'rgba(255,255,255,0.3)', duration: 0.4, ease: 'power2.out' });
    if (glare) gsap.to(glare, { opacity: 1, duration: 0.3 });
  });

  const onCardMouseLeave = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const glare = card.querySelector('.step-glare');
    gsap.to(card, { scale: 1, borderColor: 'rgba(255,255,255,0.1)', duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    if (glare) gsap.to(glare, { opacity: 0, duration: 0.4 });
  });

  const onCardMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const glare = card.querySelector('.step-glare');
    if (!glare) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    gsap.to(glare, {
      background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15), transparent 70%)`,
      duration: 0.2
    });
  });

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 relative overflow-hidden bg-background/95 dark:bg-background/60 backdrop-blur-lg">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-green-500/5 to-transparent rounded-full blur-3xl text-primary/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Caminho para o Sucesso</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-foreground">
            Como <span className="text-primary">Vencemos</span>
          </h2>
          <p className="readable-subheading max-w-lg mx-auto">
            Transformamos a sua dor em lucro em 3 etapas de elite
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="group relative"
              >
                <div 
                  onMouseEnter={onCardMouseEnter}
                  onMouseLeave={onCardMouseLeave}
                  onMouseMove={onCardMouseMove}
                  className={`how-step-card relative ${step.bgColor} border border-white/10 rounded-3xl p-6 h-full transition-shadow duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden cursor-default`}
                >
                  <div className="step-glare absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-300" />
                  
                  <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-sm shadow-xl z-20`}>
                    {step.number}
                  </div>

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-6 group-hover:rotate-6 transition-transform duration-500`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-black text-foreground mb-3 tracking-tight">
                    {step.label}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>

                  <div className={`absolute bottom-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 px-4">
          <div className="inline-flex flex-col items-center gap-4">
            <Button
              onClick={handleCTA}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-8 text-xl font-black shadow-2xl shadow-primary/40 transition-all duration-300 hover:scale-105 uppercase tracking-widest group"
            >
              <Zap className="w-5 h-5 mr-3 animate-pulse text-yellow-300 group-hover:scale-125 transition-transform" />
              Bora começar o meu projeto
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span className="text-sm font-bold tracking-tight">Resposta rápida em até 60 minutos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

