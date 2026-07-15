import { Star } from 'lucide-react';
import { BoxTool } from '../types/gsm.types';

interface ToolCardProps {
  tool: BoxTool;
  onRent: (tool: BoxTool) => void;
  darkMode: boolean;
}

export const ToolCard = ({ tool, onRent, darkMode }: ToolCardProps) => {
  return (
    <div className={`gs-tool-card group rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl hover:shadow-3xl transition-all duration-500`}>
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-10">
        <div className="w-full lg:w-64 aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110 z-[2]" style={{ backgroundImage: `url(${tool.image})`, backgroundColor: '#0a0a0a' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">{tool.name}</h3>
                {tool.nickname && <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">{tool.nickname}</span>}
              </div>
              <p className="text-xs sm:text-sm font-bold text-zinc-500 max-w-xl">{tool.description}</p>
            </div>
            <div className={`self-start px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${tool.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {tool.status === 'available' ? 'Disponível' : 'Em Uso'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tool.features?.map((f: string, i: number) => (
              <span key={i} className="px-3 py-1 sm:px-4 sm:py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">{f}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 sm:pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4 sm:gap-0">
            <div className="flex items-center justify-between sm:justify-start gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Custo/Hora</p>
                <p className="text-xl sm:text-2xl font-black text-primary">{tool.price} <span className="text-xs sm:text-sm">MT</span></p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Avaliação</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-black text-sm">{tool.rating}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onRent(tool)}
              disabled={tool.status !== 'available'}
              className={`w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 mt-2 sm:mt-0 rounded-[1.2rem] sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all shadow-xl ${
                tool.status === 'available' 
                  ? 'bg-primary text-white hover:shadow-primary/30 hover:scale-[1.02] transform' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {tool.status === 'available' ? 'Alugar Agora' : 'Indisponível'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
