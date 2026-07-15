import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export const GSMPromotionalSection = () => {
  const navigate = useNavigate();

  return (
    <section id="gsm-section" className="py-16 md:py-24 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        <TiltCard 
          className="select-none p-0 overflow-visible rounded-[2rem]" 
          maxTilt={4} 
          glowOpacity={0.3} 
          glowColor="rgba(0, 225, 60, 0.3)"
          style={{ width: '100%' }}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/gsm')}
            className="relative w-full cursor-pointer group focus:outline-none rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl min-h-[380px] md:min-h-[440px] flex items-end"
          >
            {/* Background Image Setup */}
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-card pointer-events-none">
              {/* Fallback color gradient */}
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary/30 to-black" />
              
              {/* Actual Image for GSM tool rental */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1000ms] ease-out group-hover:scale-105 z-[1]"
                style={{ 
                  backgroundImage: `url('https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto,w_1200/v1772183388/renta-img-bg_guxaww.jpg')`,
                  backgroundColor: '#0a0a0a' 
                }}
              />
              
              {/* Large Watermark Title in background */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 rotate-90 origin-center z-[2] pointer-events-none opacity-[0.02] group-hover:opacity-[0.06] transition-all duration-700 select-none">
                <span className="text-8xl sm:text-9xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                  RENT GSM
                </span>
              </div>
            </div>

            {/* Liquid Glass Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/10 group-hover:from-black/95 group-hover:via-black/70 transition-all duration-500 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10 pointer-events-none" />
            
            {/* Glowing Border on Hover */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 transition-colors duration-500 rounded-[2rem] pointer-events-none z-30" />

            {/* Top Left Icon */}
            <div className="absolute top-6 left-6 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/40">
              <Cpu className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
            </div>

            {/* Top Right "Aceder" Pill */}
            <div className="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,225,60,0.2)]">
                <span>Aceder ao Painel</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Content Container */}
            <div className="relative z-20 w-full p-8 md:p-12 lg:p-14 flex flex-col items-start gap-4">
              
              {/* Category */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 w-full">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  SERVIÇO TÉCNICO GSM
                </span>
                <span className="text-[10px] font-bold font-mono text-white/30 ml-auto">
                  05
                </span>
              </div>

              {/* Title and Description */}
              <div className="space-y-3 max-w-2xl text-left">
                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none group-hover:text-primary transition-colors duration-500">
                  Central de Ferramentas GSM
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-xl">
                  Evite o investimento pesado em dongles e licenças anuais. Alugue acesso imediato às ferramentas líderes de mercado por hora em operação. Pague apenas pelo tempo que usar.
                </p>
              </div>

              {/* Specs / Features in rows */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-left">
                {[
                  'Faturação por Minuto',
                  'Ativação 100% Digital',
                  'UnlockTool, Chimera, DFT Pro, Hydra e mais'
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-300 uppercase tracking-wider">{spec}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </TiltCard>

      </div>
    </section>
  );
};

export default GSMPromotionalSection;
