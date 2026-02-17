import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
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

/**
 * WelcomeModal - Modal de boas-vindas após login/registro
 * 
 * UX Strategy:
 * 1. Mostra animação de celebração
 * 2. Apresenta benefícios em steps
 * 3. Oferece próximo passo claro
 */
const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsAnimating(true);
      
      // Auto-advance steps
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < welcomeSteps.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = welcomeSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl border-0 overflow-hidden p-0 bg-gradient-to-br from-background via-background to-primary/5">
        {/* Close button */}
        <button
          onClick={handleSkip}
          title="Fechar"
          aria-label="Fechar modal de boas-vindas"
          className="absolute right-4 top-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1 }}
            className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.05 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500"
          />
        </div>

        <div className="relative p-8 pt-12">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {welcomeSteps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-primary' 
                    : index < currentStep 
                      ? 'bg-primary/50' 
                      : 'bg-muted'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-6"
              >
                {step.icon}
              </motion.div>

              {/* Highlight badge */}
              {step.highlight && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                >
                  <Zap className="w-3 h-3" />
                  {step.highlight}
                </motion.div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold mb-3">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {step.description}
              </p>

              {/* User greeting */}
              {currentStep === 0 && user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Logado como <strong>{user.email}</strong></span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <Button
              onClick={handleNext}
              className="w-full rounded-full py-6 text-lg font-semibold group"
            >
              <span>
                {currentStep < welcomeSteps.length - 1 ? 'Próximo' : 'Começar a Explorar'}
              </span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pular introdução
            </button>
          </div>
        </div>

        {/* Confetti effect placeholder */}
        {isOpen && currentStep === 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  y: -20, 
                  x: Math.random() * 400,
                  rotate: 0 
                }}
                animate={{ 
                  opacity: 0, 
                  y: 400, 
                  rotate: Math.random() * 360 
                }}
                transition={{ 
                  duration: 2, 
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className={`absolute w-2 h-2 rounded-full ${
                  ['bg-primary', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-pink-400'][i % 5]
                }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
