import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Shield } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export const GSMPromotionalSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Visual Card - Left/Top: Image only, no text */}
          <TiltCard
            className="select-none lg:col-span-8 cursor-pointer group"
            maxTilt={4}
            glowOpacity={0.3}
            glowColor="rgba(0, 225, 60, 0.3)"
          >
            <div
              onClick={() => navigate('/gsm')}
              className="relative w-full min-h-[70vh] lg:min-h-[82vh]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto,w_1200/v1772183388/renta-img-bg_guxaww.jpg')`,
                }}
              />

              {/* Grid Pattern Overlay */}
              <div
                className="absolute inset-0 z-[1] opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"
              />

              {/* Dark gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[2] pointer-events-none" />

              {/* Glowing border on hover */}
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 transition-colors duration-500 rounded-[2rem] pointer-events-none z-30" />

              {/* Icon Badge */}
              <div className="absolute top-8 left-8 z-30 w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(0,225,60,0.3)]">
                <Cpu className="w-6 h-6 text-white group-hover:text-primary transition-colors duration-500" />
              </div>
            </div>
          </TiltCard>

          {/* Text Sidebar Card - Right/Bottom */}
          <div className="lg:col-span-4 rounded-[2rem] bg-zinc-900/80 backdrop-blur-3xl border border-white/10 p-8 lg:p-10 flex flex-col justify-between min-h-[50vh] lg:min-h-[82vh]">
            <div className="space-y-6">
              {/* Category Label */}
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  INFRAESTRUTURA GSM
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-[0.95]">
                FERRAMENTAS<br />DE ELITE
              </h2>

              {/* Description */}
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                Acesso imediato ao UnlockTool, Chimera, DFT Pro e Hydra.
                Faturação por minuto, sem custos de licença.
                Ativação instantânea para começar a operar em segundos.
              </p>

              {/* Specs */}
              <div className="space-y-4 pt-2">
                {[
                  { icon: Zap, label: 'Faturação por Minuto' },
                  { icon: Shield, label: 'Ativação Instantânea' },
                  { icon: Cpu, label: 'Stack Profissional' },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <spec.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{spec.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/gsm')}
              className="mt-8 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-black font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_30px_rgba(0,225,60,0.2)] hover:shadow-[0_0_40px_rgba(0,225,60,0.3)]"
            >
              <span>Aceder ao Painel</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GSMPromotionalSection;
