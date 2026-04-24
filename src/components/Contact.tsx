import { useCallback, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleWhatsAppClick } from '@/lib/whatsapp';
import { useAnalytics } from '@/hooks/useAnalytics';
import { env } from '@/config/env';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import our premium custom vectors
import { EliteRadar, EliteNode, EliteCore, ElitePulse } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { trackButtonClick, trackEvent } = useAnalytics();
  const [message, setMessage] = useState('');
  const containerRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    // Staggered reveal of header
    tl.from('.contact-header-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Animate the left column (Info & Trust)
    tl.from(leftColumnRef.current, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.4");

    // Animate the right column (Form)
    tl.from(rightColumnRef.current, {
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.8");
  }, { scope: containerRef });

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
    <section 
      id="contact" 
      ref={containerRef}
      className="py-32 relative overflow-hidden bg-background/95 border-t border-white/5"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="contact-header-text text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            Iniciar <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Protocolo</span>
          </h2>
          <p className="contact-header-text text-muted-foreground/80 text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
            Acesso direto ao núcleo técnico. Tempo de resposta garantido em &lt; 5 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Info & Trust */}
          <div ref={leftColumnRef} className="flex flex-col gap-8">
            
            {/* Main Info Card */}
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-2xl font-bold mb-10 flex items-center gap-4 text-white">
                <EliteRadar className="text-primary w-8 h-8" />
                Vetor de Comunicação
              </h3>
              
              <div className="space-y-8">
                {/* Contact Item */}
                <div 
                  className="flex items-center gap-5 cursor-pointer group/item" 
                  onClick={handleDirectWhatsApp}
                >
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-primary group-hover/item:border-primary/50 group-hover/item:scale-110 transition-all duration-300">
                    <ElitePulse className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white/90 text-sm uppercase tracking-wider mb-1">Linha Directa (Chat)</p>
                    <p className="text-muted-foreground text-lg group-hover/item:text-white transition-colors">+{env.WHATSAPP_NUMBER}</p>
                  </div>
                </div>

                {/* Contact Item */}
                <div className="flex items-center gap-5 group/item">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-brand-green group-hover/item:border-brand-green/50 group-hover/item:scale-110 transition-all duration-300">
                    <EliteCore className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white/90 text-sm uppercase tracking-wider mb-1">Transmissão (Email)</p>
                    <p className="text-muted-foreground text-lg group-hover/item:text-white transition-colors">geral@tchovadigital.co.mz</p>
                  </div>
                </div>

                {/* Contact Item */}
                <div className="flex items-center gap-5 group/item">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-brand-yellow group-hover/item:border-brand-yellow/50 group-hover/item:scale-110 transition-all duration-300">
                    <EliteNode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white/90 text-sm uppercase tracking-wider mb-1">Coordenadas</p>
                    <p className="text-muted-foreground leading-relaxed group-hover/item:text-white transition-colors">Maputo, Moçambique.<br />(Operacional Remote em todo o país)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-xl rounded-[2rem] p-10 relative overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ElitePulse className="w-32 h-32 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Bypass de Suporte</h3>
              <p className="text-white/70 mb-8 max-w-sm text-lg">
                Questão crítica? Pressiona para ligação encriptada e imediata à equipa técnica.
              </p>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold rounded-xl h-14 px-8 text-base shadow-xl"
                onClick={handleDirectWhatsApp}
              >
                Conectar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Column: Quick Message Form */}
          <div ref={rightColumnRef} className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 lg:p-12 shadow-2xl relative">
            <h3 className="text-2xl font-bold mb-4 text-white">Terminal de Entrada</h3>
            <p className="text-muted-foreground/80 mb-10 text-lg font-light">
              Descreve os parâmetros da tua necessidade. Encaminhamento em tempo real para a unidade correta.
            </p>

            <form onSubmit={handleQuickMessage} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-primary">Carga de Dados (Mensagem)</label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-brand-green rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <textarea 
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inicia a transmissão aqui..." 
                    className="relative w-full min-h-[220px] p-6 rounded-xl bg-black/60 border border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 outline-none transition-all resize-none font-mono text-lg shadow-inner"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="group relative w-full flex items-center justify-center gap-3 bg-white text-black font-bold h-16 rounded-xl text-lg overflow-hidden transition-transform hover:scale-[1.02]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
                  <EliteRadar className="w-5 h-5" />
                  Submeter Pacote de Dados
                </span>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50 mt-6 font-mono">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Ligação segura e não rastreável
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
