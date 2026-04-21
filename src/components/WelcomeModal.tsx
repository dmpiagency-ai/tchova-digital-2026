import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Sparkles, 
  Rocket, 
  Star, 
  Gift, 
  ArrowRight, 
  X,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WelcomeStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const welcomeSteps: WelcomeStep[] = [
  {
    icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
    title: "Bem-vindo à TchovaDigital! 🎉",
    description: "Sua conta foi criada com sucesso. Estamos animados em ter você conosco!",
    highlight: "Conta criada!"
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-400" />,
    title: "Explore Nossos Serviços",
    description: "Descubra soluções digitais para impulsionar seu negócio: sites, apps, marketing e muito mais!",
    highlight: "10+ serviços disponíveis"
  },
  {
    icon: <Gift className="w-8 h-8 text-green-400" />,
    title: "Oferta Especial para Novos Clientes",
    description: "Ganhe 10% de desconto no seu primeiro projeto! Use o código BEMVINDO10.",
    highlight: "Desconto exclusivo"
  }
];

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Animation for step transitions
  const animateStep = contextSafe((newStep: number) => {
    const tl = gsap.timeline();
    tl.to(contentRef.current, { 
      opacity: 0, 
      x: -30, 
      duration: 0.3, 
      ease: 'power2.in',
      onComplete: () => {
        setCurrentStep(newStep);
        gsap.fromTo(contentRef.current, 
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
        );
      }
    });
  });

  const handleNext = contextSafe(() => {
    if (currentStep < welcomeSteps.length - 1) {
      animateStep(currentStep + 1);
    } else {
      onClose();
    }
  });

  const handleSkip = contextSafe(() => {
    onClose();
  });

  // Background ambient animation
  useGSAP(() => {
    if (!isOpen) return;

    gsap.to(orb1Ref.current, {
      scale: 1.2,
      opacity: 0.2,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to(orb2Ref.current, {
      scale: 1.1,
      opacity: 0.1,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });

    // Confetti effect on first step
    if (currentStep === 0 && confettiRef.current) {
      const particles = Array.from(confettiRef.current.children);
      particles.forEach((p) => {
        gsap.set(p, { 
          x: gsap.utils.random(0, 400),
          y: -20,
          opacity: 1,
          scale: gsap.utils.random(0.5, 1.5),
          rotation: gsap.utils.random(0, 360)
        });
        
        gsap.to(p, {
          y: 500,
          x: `+=${gsap.utils.random(-100, 100)}`,
          rotation: `+=${gsap.utils.random(360, 720)}`,
          opacity: 0,
          duration: gsap.utils.random(1.5, 3),
          delay: gsap.utils.random(0, 0.5),
          ease: 'power1.out'
        });
      });
    }

    // Auto-advance logic
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < welcomeSteps.length - 1) {
          animateStep(prev + 1);
          return prev; // State will be updated by animateStep's onComplete
        }
        clearInterval(interval);
        return prev;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, { scope: containerRef, dependencies: [isOpen, currentStep] });

  const step = welcomeSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-[2rem] border-0 overflow-hidden p-0 bg-background/95 backdrop-blur-3xl shadow-3xl">
        <div ref={containerRef} className="relative w-full h-full p-8 md:p-12">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute right-6 top-6 z-50 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all active:scale-90"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Ambient Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              ref={orb1Ref}
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl opacity-0"
            />
            <div
              ref={orb2Ref}
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl opacity-0"
            />
          </div>

          <div className="relative z-10">
            {/* Progress indicators */}
            <div className="flex justify-center gap-2 mb-10">
              {welcomeSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => animateStep(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentStep 
                      ? 'w-10 bg-primary' 
                      : index < currentStep 
                        ? 'w-4 bg-primary/40' 
                        : 'w-4 bg-muted/40'
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <div ref={contentRef} className="text-center">
              {/* Icon Container with Glassmorphism */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10 shadow-xl mb-8">
                <div className="transform scale-125">
                  {step.icon}
                </div>
              </div>

              {/* Highlight badge */}
              {step.highlight && (
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/5">
                    <Zap className="w-3.5 h-3.5" />
                    {step.highlight}
                  </div>
                </div>
              )}

              {/* Title */}
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-foreground drop-shadow-sm">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground text-base mb-8 font-medium leading-relaxed max-w-[90%] mx-auto">
                {step.description}
              </p>

              {/* User Identity Note */}
              {currentStep === 0 && user && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground/60 mb-6 uppercase tracking-widest">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Pronto para operar: <strong className="text-foreground">{user.email?.split('@')[0]}</strong></span>
                </div>
              )}
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-4 mt-8">
              <Button
                onClick={handleNext}
                className="w-full rounded-[1.2rem] py-8 text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">
                  {currentStep < welcomeSteps.length - 1 ? 'Seguir Viagem' : 'Lançar Ecossistema'}
                </span>
                <ArrowRight className="w-6 h-6 ml-3 relative z-10 group-hover:translate-x-2 transition-transform" />
              </Button>

              <button
                onClick={handleSkip}
                className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors py-2"
              >
                Pular Introdução
              </button>
            </div>
          </div>

          {/* Confetti Particle System */}
          <div ref={confettiRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-sm opacity-0 ${
                  ['bg-primary', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-pink-400'][i % 5]
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;


export default WelcomeModal;
