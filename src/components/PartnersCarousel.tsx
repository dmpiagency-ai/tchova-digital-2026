import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const PartnersCarousel: React.FC = () => {
  const partners = [
    {
      name: 'Vodacom',
      logo: 'https://via.placeholder.com/120x60/4F46E5/FFFFFF?text=VODACOM',
      category: 'Telecomunicações'
    },
    {
      name: 'Movitel',
      logo: 'https://via.placeholder.com/120x60/10B981/FFFFFF?text=MOVITEL',
      category: 'Telecomunicações'
    },
    {
      name: 'Tmcel',
      logo: 'https://via.placeholder.com/120x60/F59E0B/FFFFFF?text=TMCEL',
      category: 'Telecomunicações'
    },
    {
      name: 'Samsung',
      logo: 'https://via.placeholder.com/120x60/1F2937/FFFFFF?text=SAMSUNG',
      category: 'Tecnologia'
    },
    {
      name: 'Apple',
      logo: 'https://via.placeholder.com/120x60/000000/FFFFFF?text=APPLE',
      category: 'Tecnologia'
    },
    {
      name: 'Huawei',
      logo: 'https://via.placeholder.com/120x60/DF1B3F/FFFFFF?text=HUAWEI',
      category: 'Tecnologia'
    },
    {
      name: 'M-Pesa',
      logo: 'https://via.placeholder.com/120x60/4F46E5/FFFFFF?text=M-PESA',
      category: 'Pagamentos'
    },
    {
      name: 'EcoBank',
      logo: 'https://via.placeholder.com/120x60/DC2626/FFFFFF?text=ECOBANK',
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
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-24 h-12 object-contain filter grayscale brightness-150 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 mb-3"
                />
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-primary transition-colors">
                  {partner.name}
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