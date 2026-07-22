import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Zap, Shield, Server, Terminal, Lock } from 'lucide-react';

export const GSMPromotionalSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-12 lg:py-16 relative z-10 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div 
          onClick={() => navigate('/gsm')}
          className="group grid grid-cols-1 lg:grid-cols-12 gap-0 bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl shadow-black hover:shadow-primary/20 hover:border-primary/30 transition-all duration-700"
        >
          {/* Visual Side - Left */}
          <div className="lg:col-span-5 relative h-64 xs:h-72 sm:h-80 lg:h-full lg:min-h-[340px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-top transition-transform duration-1000 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url('https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto,w_1200/v1772183388/renta-img-bg_guxaww.jpg')`,
              }}
            />
            {/* Grid Pattern */}
            <div className="absolute inset-0 z-[1] opacity-20 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:32px_32px]" />
            
            {/* Gradient Mask for smooth blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-zinc-950/40 lg:to-zinc-950 z-[2]" />

            {/* Floating Badges */}
            <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-10 flex gap-2">
              <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>

          {/* Content Side - Right */}
          <div className="lg:col-span-7 relative p-5 xs:p-6 sm:p-7 lg:p-9 flex flex-col justify-center z-10 mt-0">
            {/* Watermark Icon */}
            <Cpu className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.02] group-hover:text-primary/[0.05] transition-colors duration-700 pointer-events-none" />

            <div className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 w-fit">
              <div className="p-1 sm:p-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary">
                <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary">
                Infraestrutura GSM
              </span>
            </div>

            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-[0.95] mb-2.5 sm:mb-3">
              Ferramentas <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                de Elite
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-5 max-w-lg leading-relaxed font-medium">
              Acesso imediato ao UnlockTool, Chimera, DFT Pro e Hydra. Faturação ao minuto, sem custos fixos. Ativação instantânea.
            </p>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                { icon: Zap, title: 'Faturação', desc: 'Por minuto' },
                { icon: Server, title: 'Ativação', desc: 'Instantânea' },
                { icon: Lock, title: 'Segurança', desc: 'Isolado' },
                { icon: Cpu, title: 'Stack Pro', desc: '+10 tools' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.05] group-hover:border-white/10 transition-colors">
                  <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-black/50 border border-white/10 text-white shrink-0">
                    <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-500 truncate">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mt-auto">
              <button className="flex items-center justify-center gap-2.5 w-full sm:w-auto bg-primary text-black px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wide group-hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20">
                Aceder ao Painel
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2.5 w-full sm:w-auto">
                <div className="flex -space-x-2.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+15}&backgroundColor=c5f32b`} alt="User" className="w-full h-full" />
                    </div>
                  ))}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-zinc-950 bg-primary flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-black">
                    +1k
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">Técnicos Ativos</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 leading-tight">Na nossa plataforma</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default GSMPromotionalSection;
