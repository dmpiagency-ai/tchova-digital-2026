import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLowEnd } from '@/hooks/useLowEnd';
import { ElitePulse } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const MarketReality = () => {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.from('.reality-item', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="py-16 md:py-24 relative overflow-hidden bg-black border-t border-white/[0.04]"
    >
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-background to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div ref={textRef} className="max-w-4xl mx-auto text-center">
          
          <div className="reality-item inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8 backdrop-blur-md">
            <ElitePulse className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest">A Realidade do Mercado</span>
          </div>

          <h2 className="reality-item text-3xl md:text-5xl font-black mb-8 tracking-tighter text-white uppercase leading-tight">
            O mercado mudou. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Os teus concorrentes já perceberam.</span>
          </h2>

          <div className="reality-item grid md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">O cliente pesquisa antes de comprar</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                O comportamento de compra em Moçambique evoluiu. Antes de qualquer decisão, o teu cliente pesquisa a tua presença online. Se ela falha em passar confiança, o teu concorrente ganha o contrato.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Seguidores não são clientes</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Métricas de vaidade não geram faturação. Ter uma marca de autoridade significa desenhar canais que convertem atenção em propostas e novos contactos de forma previsível e diária.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Amadorismo custa caro</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Uma imagem desorganizada destrói a percepção de valor. O teu design dita o preço que podes cobrar no mercado, atraindo contratos de alto padrão ou curiosos de baixo orçamento.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MarketReality;
