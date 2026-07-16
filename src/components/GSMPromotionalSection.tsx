import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Shield } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

export const GSMPromotionalSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-12 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">

          <TiltCard
            className="select-none lg:col-span-7 cursor-pointer group"
            maxTilt={4}
            glowOpacity={0.3}
            glowColor="rgba(0, 225, 60, 0.3)"
          >
              <div
                onClick={() => navigate('/gsm')}
                className="relative w-full aspect-[3/4] max-h-[55vh] sm:max-h-[60vh]"
              >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto,w_1200/v1772183388/renta-img-bg_guxaww.jpg')`,
                }}
              />

              <div
                className="absolute inset-0 z-[1] opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[2] pointer-events-none" />

              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/40 transition-colors duration-500 rounded-[1.5rem] pointer-events-none z-30" />

              <div className="absolute top-5 left-5 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(0,225,60,0.3)]">
                <Cpu className="w-4 h-4 text-white group-hover:text-primary transition-colors duration-500" />
              </div>
            </div>
          </TiltCard>

          <div className="lg:col-span-5 rounded-[1.5rem] bg-zinc-900/80 backdrop-blur-3xl border border-white/10 p-6 sm:p-8 lg:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                  INFRAESTRUTURA GSM
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-[0.95]">
                FERRAMENTAS<br />DE ELITE
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">
                Acesso imediato ao UnlockTool, Chimera, DFT Pro e Hydra.
                Faturação por minuto, sem custos de licença.
                Ativação instantânea para começar a operar em segundos.
              </p>

              <div className="space-y-3 pt-1">
                {[
                  { icon: Zap, label: 'Faturação por Minuto' },
                  { icon: Shield, label: 'Ativação Instantânea' },
                  { icon: Cpu, label: 'Stack Profissional' },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <spec.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide">{spec.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/gsm')}
              className="mt-6 w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform duration-300 shadow-[0_0_20px_rgba(0,225,60,0.2)] hover:shadow-[0_0_30px_rgba(0,225,60,0.3)]"
            >
              <span>Aceder ao Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GSMPromotionalSection;
