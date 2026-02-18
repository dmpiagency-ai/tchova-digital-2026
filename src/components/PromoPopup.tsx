import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Gift, 
  X,
  ArrowRight,
  Percent,
  ChevronUp
} from 'lucide-react';

interface PromoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

/**
 * PromoPopup - Notificação discreta para novos visitantes
 * 
 * Aparece como um card flutuante no canto inferior direito
 * NÃO bloqueia a interação com o hero
 * 
 * Lógica:
 * 1. Aparece após 15 segundos na página
 * 2. OU quando usuário scrolla para baixo do hero (seção About)
 * 3. Apenas para usuários que ainda não viram (localStorage)
 */
const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose, onAction }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleAction = () => {
    localStorage.setItem('tchova_promo_seen', 'true');
    onClose();
    if (onAction) {
      onAction();
    } else {
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

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 100, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-40 max-w-sm"
        >
          {isMinimized ? (
            // Minimized state - small badge
            <motion.button
              onClick={handleExpand}
              className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:shadow-xl transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift className="w-5 h-5" />
              <span className="font-semibold">10% OFF</span>
              <ChevronUp className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ) : (
            // Expanded state - full card
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                title="Fechar"
                aria-label="Fechar popup de promoção"
                className="absolute right-2 top-2 z-10 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Minimize button */}
              <button
                onClick={handleMinimize}
                title="Minimizar"
                aria-label="Minimizar popup"
                className="absolute right-10 top-2 z-10 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {/* Gradient accent */}
              <div className="h-1.5 bg-gradient-to-r from-primary via-yellow-400 to-green-400" />

              <div className="p-5 pt-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Desconto exclusivo
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Oferta para novos clientes
                    </p>
                  </div>
                </div>

                {/* Discount badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500 text-white font-bold text-sm mb-3">
                  <Percent className="w-4 h-4" />
                  <span>10% OFF</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Ganhe <strong>10% de desconto</strong> no seu primeiro projeto!
                  <br />
                  <span className="text-primary font-medium">Código: BEMVINDO10</span>
                </p>

                {/* CTA Button */}
                <Button
                  onClick={handleAction}
                  className="w-full rounded-xl py-3 font-semibold group bg-primary hover:bg-primary/90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Começar a Explorar</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Hook to manage promo popup logic
 * 
 * Mudanças:
 * - Aumenta tempo para 15 segundos (era 5)
 * - Só mostra quando usuário JÁ passou do hero
 * - Não interrompe a experiência inicial
 * - NÃO mostra para usuários que já têm conta (localStorage)
 */
export const usePromoPopup = () => {
  const [showPromo, setShowPromo] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    // Check if user has already seen the promo
    const hasSeenPromo = localStorage.getItem('tchova_promo_seen');
    
    // Check if user has an existing account/session
    const hasLoggedIn = localStorage.getItem('tchova_user');
    const hasLocalAuthUser = localStorage.getItem('tchova_local_current_user');
    const hasClientSession = localStorage.getItem('tchova_client_session');
    
    // If any user session exists, mark as existing user
    if (hasLoggedIn || hasLocalAuthUser || hasClientSession) {
      setIsExistingUser(true);
      return; // Don't show promo to existing users
    }
    
    // Don't show if already seen
    if (hasSeenPromo) {
      return;
    }

    // Timer for 15 seconds (mais tempo para não interromper hero)
    const timer = setTimeout(() => {
      if (!hasTriggered && !isExistingUser) {
        setHasTriggered(true);
        setShowPromo(true);
      }
    }, 15000);

    // Scroll listener - só mostra quando passou DO hero
    const handleScroll = () => {
      if (hasTriggered || isExistingUser) return;
      
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight; // 100% da viewport (hero completo)
      
      // Só mostra quando scrollou ALÉM do hero (entrou em outra seção)
      if (scrollY > heroHeight * 1.2) {
        setHasTriggered(true);
        // Pequeno delay para não aparecer "do nada"
        setTimeout(() => setShowPromo(true), 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered, isExistingUser]);

  const closePromo = useCallback(() => {
    setShowPromo(false);
    localStorage.setItem('tchova_promo_seen', 'true');
  }, []);

  return { showPromo, closePromo };
};

export default PromoPopup;
