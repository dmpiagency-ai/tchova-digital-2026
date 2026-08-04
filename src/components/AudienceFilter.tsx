import React, { useRef } from 'react';
import { Check, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLowEnd } from '@/hooks/useLowEnd';

gsap.registerPlugin(ScrollTrigger);

const AudienceFilter = () => {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.from('.filter-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
      });

      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%' }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 md:py-24 relative bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="filter-header text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white uppercase font-nunito">
            PARA QUEM <span className="text-primary">TRABALHAMOS</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed font-nunito">
            Entregamos o melhor resultado quando o perfil do negócio está alinhado com a nossa operação.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* O Perfil Ideal */}
          <div className="bg-card/60 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 md:p-12 shadow-[0_0_40px_-15px_rgba(34,197,94,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              Trabalhamos bem contigo se...
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">O teu negócio já funciona, mas a imagem não acompanha</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Faturas bem, mas quando alguém vê o teu site ou redes sociais, não percebe o valor do que fazes.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Os clientes só chegam por indicação</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Precisas de um caminho para que pessoas novas te encontrem e escolham sem depender só do boca-a-boca.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Fazes tudo à mão e já não dá</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Queres organizar o negócio com ferramentas e processos que te poupem tempo e energia.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* O Perfil Errado */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden opacity-80">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500/50" />
            <h3 className="text-2xl font-bold text-white/70 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <X className="w-5 h-5 text-red-500" />
              </div>
              Pode não ser o momento certo se...
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-semibold text-base mb-1">Ainda estás na fase da ideia</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Se o negócio ainda não começou a vender, é cedo para o que fazemos. Trabalhamos com negócios que já estão a operar.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-semibold text-base mb-1">Procuras o mais barato</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Não somos a opção mais barata. Focamo-nos em fazer trabalho que realmente traz resultado.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-semibold text-base mb-1">Não estás pronto para investir no teu crescimento</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Trabalhamos com quem está disposto a investir na sua imagem e nas suas ferramentas de venda.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AudienceFilter;
