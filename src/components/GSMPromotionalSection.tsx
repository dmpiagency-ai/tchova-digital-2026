import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Shield } from 'lucide-react';

export const GSMPromotionalSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-12 lg:py-20 relative z-10">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">

          {/* Visual Card - Left: Image only, no text */}
          <div className="lg:col-span-5 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden group cursor-pointer aspect-[3/4] max-h-[65vh] sm:max-h-[70vh] bg-black" onClick={() => navigate('/gsm')}>
            <div
              className="absolute inset-0 bg-contain bg-no-repeat bg-center transition-transform duration-700 ease-out group-hover:scale-[1.12]"
              style={{
                backgroundImage: `url('https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto,w_1200/v1772183388/renta-img-bg_guxaww.jpg')`,
              }}
            />

            {/* Grid Pattern Overlay */}
            <div
              className="absolute inset-0 z-[1] opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"
            />

            {/* Dark gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[2] pointer-events-none" />

            {/* Glowing border on hover */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 transition-colors duration-500 rounded-[1.5rem] sm:rounded-[2rem] pointer-events-none z-30" />

            {/* Icon Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(0,225,60,0.3)]">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-primary transition-colors duration-500" />
            </div>

            {/* Bottom label on image */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                GSM TOOLS
              </span>
            </div>
          </div>

          {/* Text Card - Right: Contact-style design */}
          <div className="lg:col-span-7 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-primary/10">
            
            {/* Icon Watermark */}
            <div className="absolute top-0 right-0 p-4 sm:p-6 md:p-10 opacity-10 pointer-events-none">
              <Cpu className="w-20 h-20 sm:w-24 sm:h-32 md:w-32 md:h-32 text-primary" />
            </div>

            <div className="relative z-10 max-w-xl">
              {/* Category Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  INFRAESTRUTURA GSM
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-3 sm:mb-4">
                FERRAMENTAS DE ELITE
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-white/70 mb-5 sm:mb-6 md:mb-8 max-w-xl leading-relaxed">
                Acesso imediato ao UnlockTool, Chimera, DFT Pro e Hydra.
                Faturação por minuto, sem custos de licença.
                Ativação instantânea para começar a operar em segundos.
              </p>

              {/* Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8">
                {[
                  { icon: Zap, label: 'Faturação por Minuto' },
                  { icon: Shield, label: 'Ativação Instantânea' },
                  { icon: Cpu, label: 'Stack Profissional' },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <spec.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-zinc-200 uppercase tracking-wide leading-tight">{spec.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate('/gsm')}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/90 text-black hover:bg-white font-bold rounded-lg h-11 sm:h-12 px-5 sm:px-6 text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-95"
              >
                <span>Aceder ao Painel</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GSMPromotionalSection;
