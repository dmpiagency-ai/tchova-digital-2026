import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const PartnersCarousel: React.FC = () => {
  const partners = [
    {
      name: 'Vodacom',
      color: '#E60000',
      category: 'Telecomunicações'
    },
    {
      name: 'Movitel',
      color: '#F97316',
      category: 'Telecomunicações'
    },
    {
      name: 'Tmcel',
      color: '#EAB308',
      category: 'Telecomunicações'
    },
    {
      name: 'Samsung',
      color: '#1D4ED8',
      category: 'Tecnologia'
    },
    {
      name: 'Apple',
      color: '#FFFFFF',
      category: 'Tecnologia'
    },
    {
      name: 'Huawei',
      color: '#EF4444',
      category: 'Tecnologia'
    },
    {
      name: 'M-Pesa',
      color: '#22C55E',
      category: 'Pagamentos'
    },
    {
      name: 'EcoBank',
      color: '#0284C7',
      category: 'Bancário'
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-background relative overflow-hidden border-y border-white/5">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Protocolo de Parcerias</span>
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">
            Parceiros <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green italic">Certificados</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
            Integrados aos maiores ecossistemas globais para garantir performance e segurança de elite.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Carrossel principal */}
          <div
            className="flex gap-8"
            style={{
              width: 'calc(200px * 24)', // Largura total dos logos
              animation: 'scroll 40s linear infinite',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = 'running';
            }}
          >
            {/* Duplicar array para loop infinito */}
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-48 h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 group hover:border-primary/50 hover:bg-white/10 transition-all duration-500 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: partner.color }} />
                  <span className="text-lg font-black tracking-tight text-white uppercase group-hover:text-primary transition-colors">
                    {partner.name}
                  </span>
                </div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  {partner.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background via-background/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background via-background/50 to-transparent z-10 pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-200px * 8));
            }
          }
        `
      }} />
    </section>
  );
};