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
            Para quem <span className="text-primary">fazemos a diferença?</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Não somos uma agência tradicional. Somos o parceiro técnico para quem quer escalar. Vê se encaixamos no teu perfil:
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
                  <h4 className="text-white font-bold mb-1">Quer resultados, não apenas gostos</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Foco em captar contactos reais e fechar vendas.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Valoriza a própria imagem</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Sabe que um design profissional transmite confiança imediata.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white font-bold mb-1">Está pronto para estruturar</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Sente que precisa de organizar processos para atender mais pessoas.</p>
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
                  <h4 className="text-white/80 font-bold mb-1">Procuras "apenas alguém para postar"</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Não somos meros publicadores de conteúdo sem estratégia.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-bold mb-1">Queres a solução mais barata possível</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Entregamos qualidade superior. O investimento reflete o retorno esperado.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-bold mb-1">Esperas magia do dia para a noite</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Construir autoridade online leva tempo, consistência e trabalho conjunto.</p>
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
