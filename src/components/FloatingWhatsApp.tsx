import React, { useState, useCallback, useEffect } from 'react';
import { env } from '@/config/env';

type SectionName = 'general' | 'about' | 'services' | 'how-it-works' | 'pricing' | 'roi' | 'testimonials' | 'contact';

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionName>('general');

  const handleWhatsAppClick = useCallback(() => {
    let messageText = 'Olá! Vi o vosso site e gostaria de saber mais sobre os vossos serviços. Podem ajudar-me?';
    
    switch (activeSection) {
      case 'about':
        messageText = 'Olá! Vi a secção sobre a vossa equipa e gostaria de saber mais sobre como trabalham.';
        break;
      case 'services':
        messageText = 'Olá! Gostaria de solicitar um orçamento personalizado para os vossos serviços de design, web ou GSM.';
        break;
      case 'how-it-works':
        messageText = 'Olá! Gostaria de entender melhor o processo operacional da Tchova Digital.';
        break;
      case 'pricing':
        messageText = 'Olá! Gostaria de falar sobre os planos de preços e opções de contratação.';
        break;
      case 'roi':
        messageText = 'Olá! Vi a calculadora de ROI no vosso site e gostaria de fazer uma simulação personalizada de retorno.';
        break;
      case 'testimonials':
        messageText = 'Olá! Vi os vossos casos de sucesso e gostava de obter resultados semelhantes para o meu negócio.';
        break;
      case 'contact':
        messageText = 'Olá! Gostaria de agendar uma consultoria operacional e iniciar o meu projeto.';
        break;
    }
    
    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      // Show button only after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Intersection Observer to detect the currently active section
    const sections = [
      { id: 'about', name: 'about' },
      { id: 'services', name: 'services' },
      { id: 'how-it-works', name: 'how-it-works' },
      { id: 'planos', name: 'pricing' },
      { id: 'roi-calculator-section', name: 'roi' },
      { id: 'testimonials', name: 'testimonials' },
      { id: 'contact', name: 'contact' },
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Focused detection window in the center of viewport
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const sectionConfig = sections.find(s => s.id === sectionId);
          if (sectionConfig) {
            setActiveSection(sectionConfig.name as SectionName);
          }
        }
      });
    }, observerOptions);

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const getSectionCTA = (section: SectionName) => {
    switch (section) {
      case 'about':
        return 'Conhecer Equipa';
      case 'services':
        return 'Pedir Orçamento';
      case 'how-it-works':
        return 'Tirar Dúvidas';
      case 'pricing':
        return 'Ver Preços';
      case 'roi':
        return 'Calcular ROI';
      case 'testimonials':
        return 'Ver Casos';
      case 'contact':
        return 'Iniciar Projeto';
      default:
        return 'Iniciar Conversa';
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <style>{`
        @keyframes textSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-text-slide-up {
          animation: textSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Sleek horizontal CapCut-style call-to-action pill */}
      <button
        onClick={handleWhatsAppClick}
        className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#090909]/90 hover:bg-[#121212]/95 border border-white/10 hover:border-green-500/30 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:scale-105 active:scale-95 transition-all duration-300 ring-1 ring-white/5"
      >
        {/* Pulsing online status indicator */}
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>

        {/* Invite Text — Animates dynamically when activeSection changes */}
        <span 
          key={activeSection}
          className="animate-text-slide-up text-[10px] md:text-xs font-black tracking-[0.18em] uppercase text-white/90 group-hover:text-green-400 transition-colors duration-300"
        >
          {getSectionCTA(activeSection)}
        </span>

        {/* Sleek WhatsApp Icon Container with hover animation */}
        <div className="w-5 h-5 rounded-full bg-green-500/10 group-hover:bg-green-500/20 text-green-400 group-hover:text-green-300 flex items-center justify-center transition-all duration-300 ml-1">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
