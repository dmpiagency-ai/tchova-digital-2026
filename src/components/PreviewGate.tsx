import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewGateProps {
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  serviceTitle: string;
  serviceDescription?: string;
  onUnlock?: () => void;
  blurIntensity?: 'light' | 'medium' | 'heavy';
  showPreviewTimer?: number; // seconds before showing login prompt
}

/**
 * PreviewGate - Componente que mostra preview do conteúdo antes do login
 * 
 * Estratégia de UX:
 * 1. Mostra conteúdo com blur inicialmente
 * 2. Após X segundos, mostra prompt amigável
 * 3. CTA para login sem ser agressivo
 */
const PreviewGate: React.FC<PreviewGateProps> = ({
  children,
  previewContent,
  serviceTitle,
  serviceDescription,
  onUnlock,
  blurIntensity = 'medium',
  showPreviewTimer = 3
}) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeElapsed(true);
      setShowPrompt(true);
    }, showPreviewTimer * 1000);

    return () => clearTimeout(timer);
  }, [showPreviewTimer]);

  const blurClasses = {
    light: 'blur-[2px]',
    medium: 'blur-[4px]',
    heavy: 'blur-[8px]'
  };

  const handleUnlock = () => {
    if (onUnlock) {
      onUnlock();
    } else {
      // Dispatch event to show login modal
      window.dispatchEvent(new CustomEvent('show-login-modal', {
        detail: {
          service: serviceTitle,
          title: `Desbloquear ${serviceTitle}`
        }
      }));
    }
  };

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div 
        className={`transition-all duration-500 ${!timeElapsed ? blurClasses[blurIntensity] : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {previewContent || children}
      </div>

      {/* Overlay with unlock prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="text-center p-6 max-w-sm"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {serviceTitle}
              </h3>
              
              {serviceDescription && (
                <p className="text-white/80 text-sm mb-4">
                  {serviceDescription}
                </p>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleUnlock}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 font-semibold group"
                >
                  <Lock className="w-4 h-4 mr-2 group-hover:hidden" />
                  <ArrowRight className="w-4 h-4 mr-2 hidden group-hover:block" />
                  <span>Desbloquear Conteúdo</span>
                </Button>
                
                <button
                  onClick={() => setShowPrompt(false)}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Continuar explorando
                </button>
              </div>

              {/* Teaser text */}
              <p className="text-white/50 text-xs mt-4">
                ✨ Crie sua conta grátis em 30 segundos
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover hint (before timer) */}
      <AnimatePresence>
        {!timeElapsed && isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Lock className="w-3 h-3" />
            <span>Faça login para ver mais</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreviewGate;
