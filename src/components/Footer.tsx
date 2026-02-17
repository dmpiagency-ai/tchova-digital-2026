import { ArrowUp, MessageCircle } from 'lucide-react';
import { env } from '@/config/env';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border/20 relative">
      <div className="container mx-auto px-4 py-8">
        
        {/* Main Footer Content - Simplified */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold gradient-text mb-2">
              TchovaDigital
            </h3>
            <p className="text-sm text-muted-foreground">
              Soluções digitais para negócios que crescem
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-6">
            {[
              { name: 'Serviços', href: '#services' },
              { name: 'Planos', href: '#planos' },
              { name: 'Contacto', href: '#contact' },
            ].map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais.');
              window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full py-2 px-5 font-medium transition-all duration-300 hover:scale-105 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 TchovaDigital. Moçambique.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              desenvolvido por TchovaDigital
            </span>
            
            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
