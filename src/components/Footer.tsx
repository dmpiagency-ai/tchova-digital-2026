import { ArrowUp, MessageCircle, Instagram, Facebook, Linkedin, Mail } from 'lucide-react';
import { env } from '@/config/env';
import { useCallback, useMemo } from 'react';

const Footer = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleWhatsAppClick = useCallback(() => {
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, []);

  const links = useMemo(() => [
    { name: 'Serviços', href: '#services' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'Sobre Nós', href: '#about' },
    { name: 'Planos', href: '#planos' },
    { name: 'Contacto', href: '#contact' },
  ], []);

  return (
    <footer className="bg-muted/30 border-t border-border/20 relative">
      <div className="container mx-auto px-4 py-10">
        
        {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* Brand */}
            <div className="text-center md:text-left" data-reveal="reveal-slide-left">
            <h3 className="text-lg font-bold gradient-text mb-2">
              TchovaDigital
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Soluções digitais para negócios que crescem — Maputo, Moçambique 🇲🇿
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              <a 
                href="https://www.instagram.com/tchovadigital" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram da TchovaDigital"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/tchovadigital" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook da TchovaDigital"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/tchovadigital" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn da TchovaDigital"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="mailto:info@tchovadigital.co.mz"
                aria-label="Email da TchovaDigital"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center" data-reveal="reveal-slide-up">
            <h4 className="text-sm font-semibold text-foreground mb-3">Navegação</h4>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Column */}
          <div className="text-center md:text-right" data-reveal="reveal-slide-right">
            <h4 className="text-sm font-semibold text-foreground mb-3">Fale Connosco</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Resposta em até 1 hora ⚡
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full py-2.5 px-6 font-medium transition-all duration-300 hover:scale-105 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <p className="text-xs text-muted-foreground mt-3">
              info@tchovadigital.co.mz
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TchovaDigital. Maputo, Moçambique. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Desenvolvido com 💚 por TchovaDigital
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
