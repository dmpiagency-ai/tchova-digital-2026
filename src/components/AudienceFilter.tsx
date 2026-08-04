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
              Perfil Ideal de Parceria
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Empresas Consolidadas com Presença Desatualizada</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Operação fatura bem, mas a imagem digital não reflete a autoridade real, afastando clientes de ticket alto.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Dependência Exclusiva do Boca-a-Boca</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Necessidade urgente de um funil previsível, escalável e automatizado de aquisição de novos clientes.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">Gargalos Operacionais que Impedem a Escala</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Processos no limite do trabalho manual que exigem sistemas integrados, automação e inteligência digital.</p>
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
              Incompatibilidade Estratégica
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-semibold text-base mb-1">Fase de Ideia ou Conceito Sem Validação</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Oferta inicial ainda sem tração. Nosso ecossistema 360° é desenhado para acelerar negócios operacionais.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-semibold text-base mb-1">Procura por Soluções "Low-Cost"</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Priorizamos ROI e engenharia digital de elite. Não competimos por menor preço, entregamos ativos de alto valor.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <X className="w-5 h-5 text-red-500/70 mt-1 shrink-0" />
                <div>
                  <h4 className="text-white/80 font-semibold text-base mb-1">Sem Visão de Investimento em Escala</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Parcerias exclusivas com empresas prontas para aportar recursos na sua própria infraestrutura de crescimento.</p>
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
