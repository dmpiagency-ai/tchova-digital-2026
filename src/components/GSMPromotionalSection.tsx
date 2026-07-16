import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu } from 'lucide-react';

export const GSMPromotionalSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-primary/10">
          
          {/* Icon Watermark */}
          <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10 pointer-events-none">
            <Cpu className="w-24 h-24 sm:w-36 sm:h-36 text-primary" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                INFRAESTRUTURA GSM
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-4">
              FERRAMENTAS DE ELITE
            </h2>

            <p className="text-sm sm:text-base text-white/70 mb-8 max-w-xl leading-relaxed">
              Acesso imediato ao UnlockTool, Chimera, DFT Pro e Hydra.
              Faturação por minuto, sem custos de licença.
              Ativação instantânea para começar a operar em segundos.
            </p>

            <button
              onClick={() => navigate('/gsm')}
              className="group inline-flex items-center gap-3 bg-white text-black hover:bg-gray-200 font-bold rounded-xl h-14 px-8 text-base shadow-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Aceder ao Painel</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GSMPromotionalSection;
