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
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white uppercase">
            PARA QUEM É O <span className="text-primary">ECOSSISTEMA?</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Não servimos todos os negócios. Servimos os que estão prontos para dar o próximo passo.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* O Perfil Certo */}
          <div className="bg-card/60 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-8 md:p-12 shadow-[0_0_40px_-15px_rgba(34,197,94,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              O Perfil Ideal
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Já facturas mas a marca não acompanha o crescimento</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Tens um produto ou serviço de excelência, mas a tua imagem atual afasta clientes de alto valor.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Tens clientes mas dependes 100% do boca-a-boca</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Precisas de canais de captação previsíveis para não dependeres apenas de indicações.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Estás a crescer e os processos já não aguentam</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Sentes que a operação está no limite e precisas de automação e sistemas integrados.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* O Perfil Errado */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden opacity-80">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500/50" />
            <h3 className="text-2xl font-bold text-white/70 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <X className="w-5 h-5 text-red-500" />
              </div>
              Não somos ideais se...
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-bold mb-1">Ainda não tens um negócio definido</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Se ainda estás a estruturar a tua oferta inicial, o investimento num ecossistema 360° é prematuro.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-bold mb-1">Procuras o preço mais baixo do mercado</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Priorizamos o retorno sobre o investimento e a entrega de alto padrão, não a redução de custos a qualquer custo.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-bold mb-1">Não tens budget para investir no crescimento</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Trabalhamos em parceria com empresas prontas para investir na sua própria infraestrutura de escala.</p>
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
