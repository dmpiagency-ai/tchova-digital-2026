import React, { useEffect, useCallback, useRef, useState } from 'react';
import { MessageCircle, Rocket, X, Calendar, ChevronRight } from 'lucide-react';
import { env } from '@/config/env';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface InteractiveContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
}

export const InteractiveContactModal: React.FC<InteractiveContactModalProps> = ({
  isOpen,
  onClose,
  serviceName = "o serviço"
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleClose = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShouldRender(false);
        onClose();
      }
    });

    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 30, duration: 0.4, ease: 'power2.in' })
      .to(backdropRef.current, { opacity: 0, duration: 0.3 }, "-=0.2");
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      handleClose();
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useGSAP(() => {
    if (shouldRender && isOpen) {
      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.4 })
        .fromTo(modalRef.current, 
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
          "-=0.2"
        );
    }
  }, { scope: containerRef, dependencies: [shouldRender, isOpen] });

  const handleWhatsApp = useCallback(() => {
    const message = `Olá TchovaDigital! Quero fazer o meu negócio bater maningue com o serviço de ${serviceName}. Como podemos tchovar isso?`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    handleClose();
  }, [serviceName, handleClose]);

  const handleCalendar = useCallback(() => {
    const message = `Olá Tchova Digital! Bora marcar um Meet rápido pra trocar uma ideia sobre ${serviceName}?`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    handleClose();
  }, [serviceName, handleClose]);

  if (!shouldRender) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl opacity-0"
      />

      {/* Modal content wrapper */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className="w-full max-w-lg overflow-hidden pointer-events-auto rounded-[2.5rem] bg-gradient-to-br from-brand-dark/95 to-black/95 border border-white/10 shadow-3xl relative opacity-0"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all transform hover:rotate-90 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Decoration */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-primary/30 via-brand-green/10 to-transparent pointer-events-none" />

          <div className="relative p-8 sm:p-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/30 rotate-3">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-[1.1] tracking-tighter uppercase">
              Tudo pronto <br/>
              <span className="bg-gradient-to-r from-brand-green via-brand-bright to-brand-yellow bg-clip-text text-transparent">
                para a descolagem?
              </span>
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base mb-10 font-medium">
              Escolhe o canal de ataque para o serviço de <strong className="text-white">{serviceName}</strong>. 
              Velocidade de resposta estimada: 20 min.
            </p>

            <div className="space-y-4">
              {/* WhatsApp Option */}
              <button
                onClick={handleWhatsApp}
                className="w-full group relative flex items-center p-5 sm:p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-green/50 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-green/0 via-brand-green/5 to-brand-green/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                <div className="w-14 h-14 rounded-2xl bg-[#25D366]/20 flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageCircle className="w-7 h-7 text-[#25D366]" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-black text-base sm:text-lg uppercase tracking-tight">Célula Expresso</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">WhatsApp Direct</p>
                </div>

                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-brand-green group-hover:translate-x-2 transition-all duration-300" />
              </button>

              {/* Calendar/Meeting Option */}
              <button
                onClick={handleCalendar}
                className="w-full group relative flex items-center p-5 sm:p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-black text-base sm:text-lg uppercase tracking-tight">Conselho Tático</h3>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Agendar Reunião</p>
                </div>

                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
