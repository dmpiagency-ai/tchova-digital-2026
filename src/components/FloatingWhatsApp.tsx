import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Olá! Vi seu site e gostaria de saber mais sobre seus serviços de design digital.'
    );
    window.open(`https://wa.me/258123456789?text=${message}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Main WhatsApp Button - Temporarily Hidden */}
      <div className="fixed bottom-6 right-6 z-40" style={{ display: 'none' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-pulse hover:animate-none ${
            isOpen ? 'bg-green-600' : ''
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-7 h-7" />
          )}
        </button>

        {/* Tooltip/Popup */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-72 glass-card p-6 rounded-2xl shadow-2xl animate-fade-up">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-2">
                  Fale connosco no WhatsApp!
                </h4>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Olá! Sou o TchovaDigital. Como posso ajudar você a transformar sua marca digital hoje?
                </p>
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 text-sm"
                >
                  Iniciar Conversa
                </button>
              </div>
            </div>
            
            {/* Arrow pointing to button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border border-primary/20 transform rotate-45" />
          </div>
        )}
      </div>

    </>
  );
};

export default FloatingWhatsApp;