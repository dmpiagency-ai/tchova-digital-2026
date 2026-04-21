import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

const PromoPopup: React.FC<PromoPopupProps> = ({ isOpen, onClose, onAction }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleClose = contextSafe(() => {
    localStorage.setItem('tchova_promo_seen', 'true');
    const tl = gsap.timeline({
      onComplete: () => {
        setShouldRender(false);
        onClose();
      }
    });
    tl.to(containerRef.current, { y: 100, opacity: 0, duration: 0.4, ease: 'power2.in' });
  });

  const handleAction = contextSafe(() => {
    localStorage.setItem('tchova_promo_seen', 'true');
    handleClose();
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
  });

  const toggleMinimize = contextSafe((minimize: boolean) => {
    const tl = gsap.timeline({
      onComplete: () => setIsMinimized(minimize)
    });

    if (minimize) {
      // Transition from card to badge
      tl.to(cardRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in' });
    } else {
      // Transition from badge to card
      tl.to(badgeRef.current, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      // External close trigger
      if (shouldRender) handleClose();
    }
  }, [isOpen]);

  useGSAP(() => {
    if (!shouldRender) return;

    if (!isMinimized) {
      // Entrance for full card
      gsap.fromTo(cardRef.current, 
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
    } else {
      // Entrance for minimized badge
      gsap.fromTo(badgeRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }
      );
    }
  }, { scope: containerRef, dependencies: [isMinimized, shouldRender] });

  if (!shouldRender) return null;

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[100] pointer-events-none">
      <div className="pointer-events-auto">
        {isMinimized ? (
          <button
            ref={badgeRef}
            onClick={() => toggleMinimize(false)}
            className="flex items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-3xl hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all group scale-0 opacity-0"
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-black text-sm tracking-widest uppercase">10% OFF</span>
            <ChevronUp className="w-4 h-4 opacity-70 group-hover:translate-y-[-2px] transition-all" />
          </button>
        ) : (
          <div
            ref={cardRef}
            className="relative w-full max-w-[320px] bg-background/90 backdrop-blur-2xl rounded-[2rem] shadow-3xl border border-white/10 overflow-hidden scale-0 opacity-0"
          >
            {/* Header Decorations */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />
            <div className="h-1.5 bg-gradient-to-r from-primary via-yellow-400 to-green-400" />

            {/* Top Bar Actions */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => toggleMinimize(true)}
                className="p-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground transition-colors"
                title="Minimizar"
              >
                <ChevronUp className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 text-muted-foreground transition-all hover:rotate-90"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 pt-10 relative z-10">
              {/* Header Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-foreground uppercase tracking-tighter leading-none">
                    Vantagem <br/> Exclusiva
                  </h3>
                </div>
              </div>

              {/* Discount Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                <Percent className="w-3.5 h-3.5" />
                <span>Oferta Limitada</span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-8 font-medium leading-relaxed">
                Queres fazer o teu negócio <strong className="text-foreground">bater maningue</strong>? 
                Começa com 10% de desconto.
                <br />
                <span className="text-primary font-black uppercase tracking-widest mt-2 inline-block">BEMVINDO10</span>
              </p>

              {/* CTA Button */}
              <Button
                onClick={handleAction}
                className="w-full rounded-[1.2rem] py-7 font-black uppercase tracking-widest bg-primary hover:bg-primary/95 text-primary-foreground shadow-2xl shadow-primary/10 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 text-xs">Ativar Cupão</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const usePromoPopup = () => {
  const [showPromo, setShowPromo] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem('tchova_promo_seen');
    const hasLoggedIn = localStorage.getItem('tchova_user') || 
                       localStorage.getItem('tchova_local_current_user') || 
                       localStorage.getItem('tchova_client_session');
    
    if (hasLoggedIn || hasSeenPromo) return;

    // Time-based trigger (15s)
    const timer = setTimeout(() => {
      if (!hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        setShowPromo(true);
      }
    }, 15000);

    // Scroll-based trigger
    const handleScroll = () => {
      if (hasTriggeredRef.current) return;
      if (window.scrollY > window.innerHeight * 1.2) {
        hasTriggeredRef.current = true;
        setTimeout(() => setShowPromo(true), 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closePromo = useCallback(() => {
    setShowPromo(false);
    localStorage.setItem('tchova_promo_seen', 'true');
  }, []);

  return { showPromo, closePromo };
};

export default PromoPopup;
