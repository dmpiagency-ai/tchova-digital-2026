import { useCallback, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleWhatsAppClick } from '@/lib/whatsapp';
import { useAnalytics } from '@/hooks/useAnalytics';
import { env } from '@/config/env';
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsapConfig";
import { isLowEnd } from '@/hooks/useLowEnd';

const Contact = () => {
  const { trackButtonClick } = useAnalytics();
  const containerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLowEnd) return;
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-header-text',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );

      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current,
          { y: 30, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  const handleDirectWhatsApp = useCallback(() => {
    trackButtonClick('contact', 'whatsapp_direct');
    handleWhatsAppClick('contact', 'general');
  }, [trackButtonClick]);

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="py-16 md:py-20 lg:py-28 relative overflow-hidden bg-background border-t border-white/[0.04] scroll-mt-6"
    >
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] pointer-events-none opacity-20 md:opacity-40">
        <div className="absolute top-0 right-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary/20 blur-[100px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-brand-green/10 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        
        {/* Centered CTA Block — No grid, no form, just impact */}
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">

          {/* Badge */}
          <div className="contact-header-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md">
            <EliteRadar className="w-4 h-4 text-primary" />
            <span className="text-fluid-sm font-bold text-primary uppercase tracking-widest font-nunito">Próximo Passo</span>
          </div>

          {/* Big headline */}
          <h2 className="contact-header-text text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tighter text-white uppercase font-nunito leading-[1.1]">
            PRONTO PARA <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">COMEÇAR?</span>
          </h2>

          {/* One-liner */}
          <p className="contact-header-text text-zinc-400 text-base md:text-lg font-normal leading-relaxed font-nunito max-w-xl mb-8 md:mb-10">
            Conta-nos o que precisas. Respondemos em menos de 24h, sem compromisso.
          </p>

          {/* CTA Card — Single focused action block */}
          <div ref={ctaRef} className="w-full max-w-xl">
            
            {/* Primary CTA Button — Big, impossible to miss */}
            <Button 
              variant="default" 
              size="lg" 
              className="w-full bg-white text-black hover:bg-gray-100 font-bold rounded-2xl h-16 md:h-[72px] px-10 text-base md:text-lg shadow-[0_0_60px_-15px_rgba(34,197,94,0.3)] transition-all duration-300 hover:shadow-[0_0_80px_-10px_rgba(34,197,94,0.4)] hover:scale-[1.02] group"
              onClick={handleDirectWhatsApp}
            >
              <ElitePulse className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
              Falar pelo WhatsApp
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Trust signal */}
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mt-5 font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Ligação directa e segura · Sem burocracia
            </div>

            {/* Alternative channels — subtle */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href={`https://wa.me/${env.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors group/link"
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover/link:border-primary/40 transition-colors">
                  <ElitePulse className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">+{env.WHATSAPP_NUMBER}</span>
              </a>

              <a 
                href="mailto:geral@tchovadigital.co.mz"
                className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors group/link"
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover/link:border-brand-green/40 transition-colors">
                  <EliteCore className="w-4 h-4 text-brand-green" />
                </div>
                <span className="text-sm">geral@tchovadigital.co.mz</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
