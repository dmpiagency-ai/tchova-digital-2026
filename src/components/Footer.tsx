import { Heart, ArrowUp, Facebook, Instagram } from 'lucide-react';
import { env } from '@/config/env';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Serviços', href: '#services' },
    { name: 'Sobre', href: '#about' },
    { name: 'Planos', href: '#planos' },
    { name: 'Contacto', href: '#contact' },
  ];

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
    <footer className="bg-muted/40 border-t border-border/30 relative">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-8">
        
        {/* Compact Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold gradient-text mb-2">
              TchovaDigital
            </h3>
            <p className="text-muted-foreground mb-3 leading-relaxed text-sm">
              Transformação digital local.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank')}
                className="glass-card hover-glow px-4 py-2 rounded-lg font-medium text-primary border border-primary/25 hover:bg-primary/10 transition-all duration-300 text-sm"
              >
                Conversar
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-bold text-foreground mb-3 text-sm">Navegação</h4>
            <nav className="space-y-2">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium mx-auto text-sm"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-right">
            <h4 className="font-bold text-foreground mb-3 text-sm">Contacto</h4>
            <div className="space-y-1.5 text-muted-foreground text-xs">
              <p>Maputo</p>
              <p>+258 123 456 789</p>
              <p>hello@tchovadigital.com</p>
            </div>

            {/* Social Media Links */}
            <div className="mt-4 flex justify-center md:justify-end space-x-3">
              <a
                href="https://www.facebook.com/profile.php?id=61582720743448"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/tchovadigitalmz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            
            {/* Compact Back to Top Button */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
              className="mt-4 w-10 h-10 neo rounded-lg flex items-center justify-center text-primary hover:scale-110 transition-all duration-300 mx-auto md:mx-0 md:ml-auto"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" focusable="false" />
            </button>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="border-t border-border/30 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-muted-foreground text-xs text-center sm:text-left">
              © 2025 TchovaDigital
            </p>

            <p className="text-muted-foreground text-xs flex items-center">
              Feito com
              <span className="mx-1">💚</span>
              localmente
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-accent rounded-full blur-3xl" />
      </div>
    </footer>
  );
};

export default Footer;