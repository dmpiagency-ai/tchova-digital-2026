import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  X,
  ArrowRight,
  Percent
} from 'lucide-react';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

/**
 * PromoPopup - Aparece automaticamente para novos visitantes
 * 
 * Lógica:
 * 1. Aparece após 5 segundos na página
 * 2. OU quando usuário scrolla até o hero CTA
 * 3. Apenas para usuários que ainda não viram (localStorage)
 * 4. Mostra promoção de desconto para engajamento
 */
const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose, onAction }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAction = () => {
    // Mark as seen
    localStorage.setItem('tchova_promo_seen', 'true');
    onClose();
    if (onAction) {
      onAction();
    } else {
      // Default: scroll to services or open login
      window.dispatchEvent(new CustomEvent('show-login-modal', {
        detail: {
          title: 'Aproveite 10% de Desconto!',
          description: 'Crie sua conta e use o código BEMVINDO10'
        }
      }));
    }
  };

  const handleClose = () => {
    localStorage.setItem('tchova_promo_seen', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 overflow-hidden p-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Close button */}
        <button
          onClick={handleClose}
          title="Fechar"
          aria-label="Fechar popup de promoção"
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
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-yellow-400"
          />
        </div>

        <div className="relative p-8 pt-12 text-center">
          {/* Icon with animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 mb-6 shadow-lg"
          >
            <Gift className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            Oferta Especial! 🎉
          </motion.h2>

          {/* Discount badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white font-bold text-lg mb-4"
          >
            <Percent className="w-5 h-5" />
            <span>10% OFF</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-6"
          >
            Crie sua conta agora e ganhe <strong>10% de desconto</strong> no seu primeiro projeto!
            <br />
            <span className="text-sm text-primary font-medium">Use o código: BEMVINDO10</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleAction}
              className="w-full rounded-full py-6 text-lg font-semibold group bg-primary hover:bg-primary/90"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Criar Conta e Ganhar Desconto</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Secondary action */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleClose}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continuar explorando sem desconto
          </motion.button>
        </div>

        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
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
                  y: 500, 
                  rotate: Math.random() * 720 
                }}
                transition={{ 
                  duration: 2 + Math.random(), 
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className={`absolute w-3 h-3 rounded-full ${
                  ['bg-primary', 'bg-yellow-400', 'bg-green-400', 'bg-pink-400', 'bg-blue-400'][i % 5]
                }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * Hook to manage promo popup logic
 */
export const usePromoPopup = () => {
  const [showPromo, setShowPromo] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Check if user has already seen the promo
    const hasSeenPromo = localStorage.getItem('tchova_promo_seen');
    const hasLoggedIn = localStorage.getItem('tchova_user');
    
    // Don't show if already seen or logged in
    if (hasSeenPromo || hasLoggedIn) {
      return;
    }

    // Timer for 5 seconds
    const timer = setTimeout(() => {
      if (hasScrolled) {
        setShowPromo(true);
      }
    }, 5000);

    // Scroll listener
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // 80% of viewport
      
      if (scrollY > heroHeight * 0.3 && !hasScrolled) {
        setHasScrolled(true);
        // Show promo after scrolling 30% of hero
        setTimeout(() => setShowPromo(true), 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  const closePromo = useCallback(() => {
    setShowPromo(false);
    localStorage.setItem('tchova_promo_seen', 'true');
  }, []);

  return { showPromo, closePromo };
};

export default PromoPopup;
