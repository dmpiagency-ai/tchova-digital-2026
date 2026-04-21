import { MessageCircle, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleWhatsAppClick } from '@/lib/whatsapp';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCallback, useState } from 'react';
import { env } from '@/config/env';

const Contact = () => {
  const { trackButtonClick, trackEvent } = useAnalytics();
  const [message, setMessage] = useState('');

  const handleQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent({
      action: 'submit',
      category: 'contact_form',
      label: 'whatsapp_quick_form'
    });
    
    const encodedMessage = encodeURIComponent(message || 'Olá, gostava de saber mais sobre os vossos serviços na Tchova Digital.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const handleDirectWhatsApp = useCallback(() => {
    trackButtonClick('contact', 'whatsapp_direct');
    handleWhatsAppClick('contact', 'general');
  }, [trackButtonClick]);

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background/95 dark:bg-background/80 backdrop-blur-lg border-t border-border/50">
      <div className="container relative z-10 mx-auto px-4">
        
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Vamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">conversar?</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Estamos prontos para analisar o teu projeto. O nosso tempo de resposta via WhatsApp costuma ser inferior a 5 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column: Info & Trust */}
          <div className="flex flex-col gap-8 animate-on-scroll delay-1">
            <div className="bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="text-green-500 w-6 h-6" />
                Informações de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={handleDirectWhatsApp}>
                  <div className="p-3 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Linha Directa (Chat)</p>
                    <p className="text-muted-foreground">+{env.WHATSAPP_NUMBER}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">geral@tchovadigital.co.mz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Localização</p>
                    <p className="text-muted-foreground">Maputo, Moçambique.<br />(Trabalhamos remotamente para todo o país)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-green-500/20">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <MessageCircle className="w-24 h-24" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Suporte Rápido</h3>
              <p className="text-green-50 mb-6 max-w-sm">
                Tens uma questão urgente? Clica aqui para falar directamente com a nossa equipa técnica.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 font-bold rounded-full"
                onClick={handleDirectWhatsApp}
              >
                Falar Agora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Column: Quick Message Form */}
          <div className="bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-lg animate-on-scroll delay-2 relative">
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -z-10" />
            
            <h3 className="text-2xl font-bold mb-6">Mensagem Rápida</h3>
            <p className="text-muted-foreground mb-8">
              Escreve-nos o que precisas. A tua mensagem receberá resposta imediata via chat da nossa equipa.
            </p>

            <form onSubmit={handleQuickMessage} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">A tua mensagem</label>
                <textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Olá! Sou o(a)..." 
                  className="w-full min-h-[160px] p-4 rounded-2xl bg-muted/50 border-border border focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none font-sans text-foreground"
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-14 rounded-xl text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-1 transition-all"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Iniciar Conversa Segura
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Não guardamos os teus dados neste formulário. Seguro e 100% privado.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
