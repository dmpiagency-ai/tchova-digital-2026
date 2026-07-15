import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { Box, Activity, History, Star } from 'lucide-react';
import { BoxTool, Rental, WalletData } from '../types/gsm.types';

interface DashboardViewProps {
  tools: BoxTool[];
  darkMode: boolean;
  rentals: Rental[];
  wallet: WalletData;
  setActiveView: (view: string) => void;
}

export const DashboardView = ({ tools, darkMode, rentals, wallet, setActiveView }: DashboardViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modules = containerRef.current?.querySelectorAll('.gs-module');
    if (modules) {
      gsap.fromTo(modules,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, { scope: containerRef });

  const stats = [
    { label: 'DISPONÍVEIS', value: tools.filter((t: BoxTool) => t.status === 'available').length, icon: Box, sub: 'Prontas p/ uso', pulse: true },
    { label: 'EM OPERAÇÃO', value: tools.filter((t: BoxTool) => t.status === 'in_use').length, icon: Activity, sub: 'Uso atual' },
    { label: 'TOTAL ALUGUÉIS', value: rentals.length, icon: History, sub: 'Histórico' },
  ];

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 lg:pb-12 space-y-6 sm:space-y-10">
      {/* Welcome Banner */}
      <div className={`gs-module relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 ${darkMode ? 'bg-zinc-900 border border-white/5' : 'bg-primary'} text-white shadow-3xl`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">BEM-VINDO AO<br />GSM <span className="text-white/40">ELITE</span></h2>
            <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest sm:tracking-[0.4em] text-white/60">Infraestrutura de alta performance</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full sm:w-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1 sm:mb-2">SALDO DISPONÍVEL</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tighter">{wallet.balance.toFixed(0)} <span className="text-base sm:text-lg opacity-40">MT</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className={`gs-module p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl flex items-center gap-4 sm:gap-6`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black tracking-tighter">{stat.value}</span>
                {stat.pulse && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mb-2" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Tools */}
      <div className="space-y-8">
        <div className="gs-module flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">FERRAMENTAS POPULARES</h3>
          <button onClick={() => setActiveView('tools')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">Ver Todas</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {tools.slice(0, 3).map((tool: BoxTool) => (
            <div
              key={tool.id}
              className={`gs-module group rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl hover:shadow-2xl transition-all duration-500`}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url(${tool.image})`, backgroundColor: '#0a0a0a' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  {tool.price} MT/H
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-2">{tool.name}</h4>
                <p className="text-xs font-bold text-zinc-500 line-clamp-2">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
