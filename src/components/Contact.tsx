import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleWhatsAppClick } from '@/lib/whatsapp';
import { useAnalytics } from '@/hooks/useAnalytics';

const Contact = () => {
  const { trackButtonClick } = useAnalytics();

  const handleContactClick = () => {
    trackButtonClick('contact', 'whatsapp_main');
    handleWhatsAppClick('contact', 'general');
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Impact Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
              Pronto para Começar?
            </span>
          </h2>

          {/* Single Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 font-medium">
            Converse gratuitamente com um especialista
          </p>

          {/* Single CTA Button */}
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-12 py-6 rounded-full text-lg shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105"
            onClick={handleContactClick}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Falar no WhatsApp
          </Button>

          {/* Minimal Trust Indicators */}
          <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Resposta rápida
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Sem compromisso
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
